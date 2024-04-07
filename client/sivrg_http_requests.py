from utils import DateTimeEncoder
import config
import requests
import json
import datetime
import time
from strenum import StrEnum  # from enum import StrEnum in python 3.12
import dotenv

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
    PATH = f"/turnos/{id}"
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
    PATH = f"/pesadas/{pesada_id}"
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
    PATH = f"/silos/{producto_id}"
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
    print(response.status_code, response_text)
    return True


def sivrg_check_refresh_token(access_token: str):
    headers = {"Authorization": f"Bearer {access_token}"}

    # Validate endpoint
    PATH = "/api/get_auth0_user"
    response = requests.get(url=f"{DOMAIN}{PATH}", headers=headers)
    response_text = json.loads(response.text)
    print(response.status_code, response_text)
    if response.status_code == 401:
        access_token = login_auth0()
        dotenv.set_key(dotenv_path='.env' ,key_to_set='ACCESS_TOKEN',value_to_set=access_token)
        dotenv.load_dotenv()


if __name__ == "__main__":
    access_token = settings.ACCESS_TOKEN
    sivrg_check_refresh_token(access_token)


    # # Casimiro Reyes empresa2
    rfid_uid = 427772581204
    patente = "JJJ111"

    # Julio Raikkonen empresa3
    # rfid_uid = 287863187226
    # patente = "AF070SA"

    # Marcos Polo empresa1
    # rfid_uid = 346826153725
    # patente = "KZK142"

    # # Pedro Alpira empresa1
    # rfid_uid = 912211182770
    # patente = "KZK142"

    fecha = datetime.datetime.today()
    # fecha = datetime.datetime(2024,3,29)

    ##### Playon
    turno_id,producto_id = sivrg_send_validate(access_token=access_token, rfid_uid=rfid_uid, patente=patente, fecha=fecha)
    #### When state is changed to in_progress_entrada, that will trigger an empty pesada entry
    if turno_id:
        sivrg_update_turno(access_token=access_token,id=turno_id, state=TURNO_STATE.ENTRANCE)
    time.sleep(2)

    ### BalanzaIN
    turno_id, producto_id = sivrg_send_validate(access_token=access_token, rfid_uid=rfid_uid, patente=patente, fecha=fecha)
    if turno_id:
        sivrg_update_turno(access_token=access_token,id=turno_id, state=TURNO_STATE.BALANZA_IN)
        sivrg_update_pesada(access_token=access_token, turno_id=turno_id, fecha_pesada=fecha, peso_pesada=230000, direction='in')
    time.sleep(2)

    #### BalanzaOUT
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
            peso_pesada=200000,
            direction="out",
        )
        net_weight = pesada_object.get("peso_bruto_in") - pesada_object.get(
            "peso_bruto_out"
        )
        print(net_weight)
        time.sleep(1)
        sivrg_update_turno(
            access_token=access_token, id=turno_id, state=TURNO_STATE.FINISHED
        )
        sivrg_update_silo(
            access_token=access_token, producto_id=producto_id, peso_agregado=net_weight
        )
