from utils import DateTimeEncoder
import config
import requests
import json
import datetime
from strenum import StrEnum # from enum import StrEnum in python 3.12


settings = config.Settings()
DOMAIN = settings.FAST_API_SERVER

class TURNO_STATE(StrEnum):
    PENDING = "pending"
    CANCELED ="canceled"
    ACCEPTED ="accepted"
    ENTRANCE = "in_progress_entrada"
    BALANZA_IN = "in_progress_balanza_in"
    BALANZA_OUT = "in_progress_balanza_out"
    FINISHED = "finished"

class AuthError(Exception): pass

def login_auth0():
    payload = {
        "client_id":settings.AUTH0_CLIENT_ID,
        "client_secret":settings.AUTH0_CLIENT_SECRET,
        "audience":settings.AUTH0_CLIENT_AUDIENCE,
        "grant_type":"client_credentials"
    }
    response = requests.post(url=f'{settings.AUTH0_DOMAIN}/oauth/token', data=payload)
    response_json = json.loads(response.text)
    if response_json.get("error"):
        raise AuthError("Invalid client or secret key")
    return response_json.get("access_token")

def sivrg_send_validate(access_token: str, rfid_uid, patente, fecha):
    headers = {"Authorization": f"Bearer {access_token}"}

    # Validate endpoint
    PATH = '/turnos/validate/'
    data= {
        'rfid_uid': rfid_uid,
        'patente': patente,
        'fecha': fecha
    }
    response = requests.get(url=f'{DOMAIN}{PATH}',headers=headers, params=data)
    response_text = json.loads(response.text)
    # print(response_text)
    if response.status_code == 401:
        print(response_text)
        return False
    turno_id = response_text.get('id')
    if not turno_id:
        print("turno not found")
        return False
    return turno_id

def sivrg_update_turno(access_token: str, id: str, state: str):
    headers = {"Authorization": f"Bearer {access_token}"}
    PATH = f'/turnos/{id}/'
    data= {
        'state': state,
    }
    response = requests.put(url=f'{DOMAIN}{PATH}',headers=headers, params=data)
    response_text = json.loads(response.text)
    if response.status_code == 401:
        print(response_text)
        return False
    turno_id = response_text.get('id')
    if not turno_id:
        print("turno not found")
        return False
    turno_state = response_text.get('state')
    print(f'{response.status_code} -- TURNO ID:{turno_id} | {turno_state}')
    return True

def sivrg_update_pesada(access_token: str, turno_id: str, fecha_pesada, peso_pesada, direction: str = 'in'):
    headers = {"Authorization": f"Bearer {access_token}"}
    PATH = f'/turnos/{turno_id}/pesada'
    response = requests.get(url=f'{DOMAIN}{PATH}',headers=headers)
    response_text = json.loads(response.text)
    pesada_id = response_text.get('id')

    print(f'{response.status_code} -- PESADA ID:{pesada_id}')
    # PUT pesada time and value
    PATH = f'/pesadas/{pesada_id}/'
    data= {
        f"fecha_hora_balanza_{direction}": fecha_pesada,
        f"peso_bruto_{direction}": peso_pesada,
        "turno_id": turno_id
    }
    data=json.dumps(data,cls=DateTimeEncoder)
    response = requests.put(url=f'{DOMAIN}{PATH}',headers=headers, data=data)
    response_text = json.loads(response.text)
    print(f'{response.status_code} -- PESADA ID:{pesada_id}')
    print(response_text)
    print(f"Turno validado y en in_progress_balanza_{direction}")

    return True


if __name__ == "__main__":
    access_token = login_auth0()
    print(access_token)
    # access_token = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6InBlQjZ4Znp2am53TVhoSkpJUlV0dCJ9.eyJpc3MiOiJodHRwczovL21ldGhpenVsLnVzLmF1dGgwLmNvbS8iLCJzdWIiOiJpaU5zQ0JjWmNmT0lvMERMVnk2SXRuM1RFZnlQMlpPRUBjbGllbnRzIiwiYXVkIjoiaHR0cHM6Ly9hcGkuc2l2cmcubWV0aGl6dWwuY29tIiwiaWF0IjoxNzA5NzYzMjMwLCJleHAiOjE3MDk5NDk2MzAsImF6cCI6ImlpTnNDQmNaY2ZPSW8wRExWeTZJdG4zVEVmeVAyWk9FIiwic2NvcGUiOiJyZWFkOnRlc3QiLCJndHkiOiJjbGllbnQtY3JlZGVudGlhbHMiLCJwZXJtaXNzaW9ucyI6WyJyZWFkOnRlc3QiXX0.wC_PciOVSZr1goemlk9SiEcj1MZFWJovxqd0hAoi33NCR3t84jwMSSO5Bs4j2krsGhuR_u5WuzL2akUKOWUf0gSOVdnUXR3Sx-v9lO6iZ3LqwUEfZwbvgRpEtsr8nunDyhWgVgGldeiGlsj7UaSmZTjMDqUTJYlKL7qG3hMWiYa291H7MBHhM8EnQCJ5syYYLbHIKGghp2API9N976MjD7KHghjzD6peCuSfiKvLkvMZHQOhpvAb8xzEnmBFRYSeNOl6gbU4GV0mPTJ6hmEGqLZPtmyHcUIHnF7ebwZMq9dLGwqh7VAk8ZPKMtSyHltcB7gu126fIPmxcM2G7euadQ'
    # rfid_uid = 2222
    # patente = 'ABC321'
    # # fecha = datetime.datetime.today() - datetime.timedelta(days=1)
    # fecha = datetime.datetime(2024,2,17)

    # # Playon
    # turno_id = sivrg_send_validate(access_token=access_token, rfid_uid=rfid_uid, patente=patente, fecha=fecha)
    # # This will create an empty pesada entry
    # sivrg_update_turno(access_token=access_token,id=turno_id, state=TURNO_STATE.ENTRANCE)

    # # BalanzaIN
    # turno_id = sivrg_send_validate(access_token=access_token, rfid_uid=rfid_uid, patente=patente, fecha=fecha)
    # sivrg_update_turno(access_token=access_token,id=turno_id, state=TURNO_STATE.BALANZA_IN)
    # sivrg_update_pesada(access_token=access_token, turno_id=turno_id, fecha_pesada=fecha, peso_pesada=7000, direction='in')

    # BalanzaOUT
    # turno_id = sivrg_send_validate(access_token=access_token, rfid_uid=rfid_uid, patente=patente, fecha=fecha)
    # sivrg_update_turno(access_token=access_token,id=turno_id, state=TURNO_STATE.BALANZA_OUT)
    # sivrg_update_pesada(access_token=access_token, turno_id=turno_id, fecha_pesada=datetime.datetime.today(), peso_pesada=7000, direction='out')
    # sivrg_update_turno(access_token=access_token,id=turno_id, state=TURNO_STATE.FINISHED)
