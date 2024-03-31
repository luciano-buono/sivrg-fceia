from utils import DateTimeEncoder
import config
import requests
import json
import datetime
from strenum import StrEnum  # from enum import StrEnum in python 3.12


settings = config.Settings()
DOMAIN = settings.FAST_API_SERVER


class TURNO_STATE(StrEnum):
    PENDING = "pending"
    CANCELED = "canceled"
    ACCEPTED = "accepted"
    ENTRANCE = "in_progress_entrada"
    BALANZA_IN = "in_progress_balanza_in"
    BALANZA_OUT = "in_progress_balanza_out"
    FINISHED = "finished"


class AuthError(Exception):
    pass


def login_auth0():
    payload = {
        "client_id": settings.AUTH0_CLIENT_ID,
        "client_secret": settings.AUTH0_CLIENT_SECRET,
        "audience": settings.AUTH0_CLIENT_AUDIENCE,
        "grant_type": "client_credentials",
    }
    response = requests.post(url=f"{settings.AUTH0_DOMAIN}/oauth/token", data=payload)
    response_json = json.loads(response.text)
    if response_json.get("error"):
        raise AuthError("Invalid client or secret key")
    return response_json.get("access_token")


def sivrg_send_validate(access_token: str, rfid_uid, patente, fecha):
    headers = {"Authorization": f"Bearer {access_token}"}

    # Validate endpoint
    PATH = "/turnos/validate/"
    data = {"rfid_uid": rfid_uid, "patente": patente, "fecha": fecha}
    response = requests.get(url=f"{DOMAIN}{PATH}", headers=headers, params=data)
    response_text = json.loads(response.text)
    # print(response_text)
    if response.status_code == 401:
        print(response_text)
        return False, -1
    turno_id = response_text.get("id")
    producto_id = response_text.get("producto_id")
    if not turno_id:
        print("turno not found")
        return False, False
    return turno_id, producto_id


def sivrg_update_turno(access_token: str, id: str, state: str):
    headers = {"Authorization": f"Bearer {access_token}"}
    PATH = f"/turnos/{id}/"
    data = {
        "state": state,
    }
    response = requests.put(url=f"{DOMAIN}{PATH}", headers=headers, params=data)
    response_text = json.loads(response.text)
    if response.status_code == 401:
        print(response_text)
        return False
    turno_id = response_text.get("id")
    if not turno_id:
        print("turno not found")
        return False
    turno_state = response_text.get("state")
    print(f"{response.status_code} -- TURNO ID:{turno_id} | {turno_state}")
    return True


def sivrg_update_pesada(
    access_token: str, turno_id: str, fecha_pesada, peso_pesada, direction: str = "in"
):
    headers = {"Authorization": f"Bearer {access_token}"}
    PATH = f"/turnos/{turno_id}/pesada"
    response = requests.get(url=f"{DOMAIN}{PATH}", headers=headers)
    response_text = json.loads(response.text)
    pesada_id = response_text.get("id")

    print(f"{response.status_code} -- PESADA ID:{pesada_id}")
    # PUT pesada time and value
    PATH = f"/pesadas/{pesada_id}/"
    data = {
        f"fecha_hora_balanza_{direction}": fecha_pesada,
        f"peso_bruto_{direction}": peso_pesada,
        "turno_id": turno_id,
    }
    data = json.dumps(data, cls=DateTimeEncoder)
    response = requests.put(url=f"{DOMAIN}{PATH}", headers=headers, data=data)
    response_text = json.loads(response.text)
    print(f"{response.status_code} -- PESADA ID:{pesada_id}")
    print(response_text)
    print(f"Turno validado y en in_progress_balanza_{direction}")

    return response_text


def sivrg_update_silo(access_token: str, producto_id: str, peso_agregado: int):
    headers = {"Authorization": f"Bearer {access_token}"}
    PATH = f"/silos/{producto_id}/"
    response = requests.get(url=f"{DOMAIN}{PATH}", headers=headers)
    response_text = json.loads(response.text)
    silo_id = response_text.get("id")
    capacidad = response_text.get("capacidad")
    utilizado = response_text.get("utilizado")
    habilitado = response_text.get("habilitado")
    if not habilitado:
        return False
    PATH = f"/silos/{silo_id}"
    data = {
        "producto_id": producto_id,
        "capacidad": capacidad,
        "utilizado": utilizado + peso_agregado,
        "habilitado": "true",
    }
    response = requests.put(url=f"{DOMAIN}{PATH}", headers=headers, json=data)
    response_text = json.loads(response.text)
    print(response_text)
    return True


if __name__ == "__main__":
    # access_token = login_auth0()
    # print(access_token)
    access_token = "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6InBlQjZ4Znp2am53TVhoSkpJUlV0dCJ9.eyJodHRwczovL3NpdnJnLm1ldGhpenVsLmNvbS9yb2xlcyI6WyJlbXBsb3llZSJdLCJpc3MiOiJodHRwczovL21ldGhpenVsLnVzLmF1dGgwLmNvbS8iLCJzdWIiOiJpaU5zQ0JjWmNmT0lvMERMVnk2SXRuM1RFZnlQMlpPRUBjbGllbnRzIiwiYXVkIjoiaHR0cHM6Ly9hcGkuc2l2cmcubWV0aGl6dWwuY29tIiwiaWF0IjoxNzExODk5ODQwLCJleHAiOjE3MTIwODYyNDAsInNjb3BlIjoicmVhZDp0ZXN0IiwiZ3R5IjoiY2xpZW50LWNyZWRlbnRpYWxzIiwiYXpwIjoiaWlOc0NCY1pjZk9JbzBETFZ5Nkl0bjNURWZ5UDJaT0UiLCJwZXJtaXNzaW9ucyI6WyJyZWFkOnRlc3QiXX0.Ovqvw7CGFbmJT7yDjOqjBgr06m-9DLMOhq4vxJwAgbBJK2jkyyqxHB9XSlxdUblIf_zCifW37k7UqjpzWbA3cekLrGO5T1adesGdrA3MZl0ntdp48meDO7TKb3S_2OK1-RcTygVm77AlLNMgaKqjouLmjD3CzPY-2jw0GMY3-wMVGOWye9qKd9qsZK6El8q1yanu_lorPmI87WxuKIX3qpRdoH-TWpn7ystnjWE1ND6orghq68n6TDm52Yr8qb64MK7aXbaFRYFUHoc7GoIb2k-E-EHvDKMbSpth8AD1BzvgC9oGoiys_OmUHB0GG0jWuvXNVJiOTyP_Yhw9wyzwFQ"
    rfid_uid = 346826153725
    patente = "ABC123"
    fecha = datetime.datetime.today()
    # fecha = datetime.datetime(2024,3,29)

    ####### Playon
    # turno_id,producto_id = sivrg_send_validate(access_token=access_token, rfid_uid=rfid_uid, patente=patente, fecha=fecha)
    # ##### When state is changed to in_progress_entrada, that will trigger an empty pesada entry
    # if turno_id:
    #     sivrg_update_turno(access_token=access_token,id=turno_id, state=TURNO_STATE.ENTRANCE)

    ###### BalanzaIN
    # turno_id, producto_id = sivrg_send_validate(access_token=access_token, rfid_uid=rfid_uid, patente=patente, fecha=fecha)
    # if turno_id:
    #     sivrg_update_turno(access_token=access_token,id=turno_id, state=TURNO_STATE.BALANZA_IN)
    #     sivrg_update_pesada(access_token=access_token, turno_id=turno_id, fecha_pesada=fecha, peso_pesada=7000, direction='in')

    ###### BalanzaOUT
    turno_id, producto_id = sivrg_send_validate(
        access_token=access_token, rfid_uid=rfid_uid, patente=patente, fecha=fecha
    )
    if turno_id:
        sivrg_update_turno(
            access_token=access_token, id=turno_id, state=TURNO_STATE.BALANZA_OUT
        )
        pesada_object = sivrg_update_pesada(
            access_token=access_token,
            turno_id=turno_id,
            fecha_pesada=datetime.datetime.today(),
            peso_pesada=5000,
            direction="out",
        )
        net_weight = pesada_object.get("peso_bruto_in") - pesada_object.get(
            "peso_bruto_out"
        )
        sivrg_update_turno(
            access_token=access_token, id=turno_id, state=TURNO_STATE.FINISHED
        )
        sivrg_update_silo(
            access_token=access_token, producto_id=producto_id, peso_agregado=net_weight
        )
