import datetime
import time
from camera_orange import take_photo

# pip install pymodbus
import signal, sys
from pymodbus.client.tcp import ModbusTcpClient as ModbusClient
from sivrg_http_requests import (
    TURNO_STATE,
    sivrg_send_validate,
    sivrg_update_turno,
    sivrg_update_pesada,
    sivrg_update_silo,
    sivrg_check_refresh_token,
)

from utils import *

from threading import Thread
from pick import pick
import config


settings = config.Settings()

if not settings.LOCAL:
    from lpr_orange import get_LPR
    from rfid.MFRC522_python.mfrc522 import SimpleMFRC522


def is_plc_ready(client):
    """
    Read address 7 and expects value 100
    """
    re_plc_rdy = client.read_holding_registers(address=7)
    prLightPurple(f"Register 7 value:{re_plc_rdy.registers}")
    if re_plc_rdy.registers[0] == 100:
        print("PLC ready")
        return True
    return False


def plc_start_seq(client):
    """
    Write address 0 to value 100
    """
    print("Inicio de secuencia")
    prLightPurple("set register 0 to value 100")
    client.write_registers(0, 100, unit=1)  # reset bit comunicación


def is_plc_weight_rdy(client):
    """
    Read address 1 and expects value 100
    """
    re_plc_weight_rdy = client.read_holding_registers(address=1)
    prLightPurple(f"Register 1 value:{re_plc_weight_rdy.registers}")
    if re_plc_weight_rdy.registers[0] == 100:
        print("PLC Weight ready")
        return True
    return False


def send_bit_de_vida(client, interval_sec):
    while True:
        print("-----Send bit de vida-----")
        client.write_registers(10, 25, unit=1)  # reset bit comunicación
        time.sleep(interval_sec)


def ingreso_playon():
    MODBUS_HOST = settings.MODBUS_HOST_PLAYON
    MODBUS_PORT = settings.MODBUS_PORT_PLAYON
    client = ModbusClient(MODBUS_HOST, port=MODBUS_PORT)
    reader = SimpleMFRC522()
    client.connect()

    print("Starting background task...")
    daemon = Thread(
        target=send_bit_de_vida,
        args=(
            client,
            5,
        ),
        daemon=True,
        name="Background",
    )
    daemon.start()
    try:
        while True:
            ## PLC wait until ready
            while True:
                if is_plc_ready(client):
                    break
                time.sleep(5)

            ## RFID LPR
            # prGreen("Hold a tag near the reader")
            # rfid_uid = input("RFID_UID")
            # rfid_uid = 2222
            # print(f"ID: {rfid_uid}")
            # print(f"Reading lisence from image..")
            # patente = 'ABC321'
            # print({"LICENSE_PLATE":patente})

            prCyan("Press Enter to start tag reading...")
            input("")
            prGreen("Hold a tag near the reader")
            rfid_uid, text = reader.read()
            print(f"ID: {rfid_uid}\nText: {text}")
            time.sleep(2)
            print(f"Reading lisence from image or photo..")
            take_photo()
            prediccion = get_LPR()
            print({"LICENSE_PLATE": prediccion})
            patente = prediccion
    
            if patente != -1:
                ## FastAPI
                fecha = datetime.today()
                # fecha = datetime.datetime.today() - datetime.timedelta(days=1)
                # fecha = datetime(2024,3,9)
                turno_id, producto_id = sivrg_send_validate(
                    access_token=access_token,
                    rfid_uid=rfid_uid,
                    patente=patente,
                    fecha=fecha,
                )
                if turno_id:
                    # This will create an empty pesada entry
                    sivrg_update_turno(
                        access_token=access_token, id=turno_id, state=TURNO_STATE.ENTRANCE
                    )
                    plc_start_seq(client)
                else:
                    print("Turno no validado")

    finally:
        prLightPurple("Closing connection..")
        client.close()


def ingreso_balanza():
    MODBUS_HOST = settings.MODBUS_HOST_INGRESO_BALANZA
    MODBUS_PORT = settings.MODBUS_PORT_INGRESO_BALANZA
    client = ModbusClient(MODBUS_HOST, port=MODBUS_PORT)
    reader = SimpleMFRC522()
    client.connect()
    print("Starting background task...")
    daemon = Thread(target=send_bit_de_vida, args=(client,5,), daemon=True, name="Background")
    daemon.start()
    try:
        while True:

            ## PLC wait until ready
            while True:
                if is_plc_ready(client):
                    break
                time.sleep(10)

            # ## RFID LPR
            # prGreen("Hold a tag near the reader")
            # rfid_uid = input("RFID_UID")
            # rfid_uid = 2222
            # print(f"ID: {rfid_uid}")
            # print(f"Reading lisence from image..")
            # patente = 'ABC321'
            # print({"LICENSE_PLATE":patente})

            prCyan("Press Enter to start tag reading...")
            input("d")
            prGreen("Hold a tag near the reader")
            rfid_uid, text = reader.read()
            print(f"ID: {rfid_uid}\nText: {text}")
            time.sleep(2)
            print(f"Reading lisence from image or photo..")
            take_photo()
            prediccion = get_LPR()
            print({"LICENSE_PLATE": prediccion})
            patente = prediccion

            if patente != -1:
                ## FastAPI
                fecha = datetime.today()
                # fecha = datetime(2024,3,9)
                turno_id, producto_id = sivrg_send_validate(
                    access_token=access_token,
                    rfid_uid=rfid_uid,
                    patente=patente,
                    fecha=fecha,
                )
                if turno_id:
                    # This will create an empty pesada entry
                    sivrg_update_turno(
                        access_token=access_token, id=turno_id, state=TURNO_STATE.BALANZA_IN
                    )
                    plc_start_seq(client)
                else:
                    print("Turno no validado")

                ## PLC wait until weight is ready
                while True:
                    if is_plc_weight_rdy(client):
                        break
                    time.sleep(10)
                re_plc_weight = client.read_holding_registers(address=2)
                peso_pesada = re_plc_weight.registers[0]
                prLightPurple(f"Register 2 value:{peso_pesada}")
                prLightPurple("set register 1 to value 25")
                time.sleep(2)
                client.write_registers(1, 25, unit=1)  # reset to PLC knows that i read it

                sivrg_update_pesada(
                    access_token=access_token,
                    turno_id=turno_id,
                    fecha_pesada=fecha,
                    peso_pesada=peso_pesada,
                    direction="in",
                )

    finally:
        print("Closing connection..")
        client.close()


def egreso_balanza():
    MODBUS_HOST = settings.MODBUS_HOST_EGRESO_BALANZA
    MODBUS_PORT = settings.MODBUS_PORT_EGRESO_BALANZA
    client = ModbusClient(MODBUS_HOST, port=MODBUS_PORT)
    reader = SimpleMFRC522()
    client.connect()
    print("Starting background task...")
    daemon = Thread(target=send_bit_de_vida, args=(client, 5,), daemon=True, name="Background")
    daemon.start()
    try:
        while True:

            ## PLC wait until ready
            while True:
                if is_plc_ready(client):
                    break
                time.sleep(10)

            # ## RFID LPR
            # prGreen("Hold a tag near the reader")
            # rfid_uid = input("RFID_UID")
            # rfid_uid = 2222
            # print(f"ID: {rfid_uid}")
            # print(f"Reading lisence from image..")
            # patente = 'ABC321'
            # print({"LICENSE_PLATE":patente})

            prCyan("Press Enter to start tag reading...")
            input("")
            prGreen("Hold a tag near the reader")
            rfid_uid, text = reader.read()
            print(f"ID: {rfid_uid}\nText: {text}")
            time.sleep(2)
            print(f"Reading lisence from image or photo..")
            take_photo()
            prediccion = get_LPR()
            print({"LICENSE_PLATE": prediccion})
            patente = prediccion

            if patente != -1:
                ## FastAPI
                fecha = datetime.today()
                # fecha = datetime(2024,3,9)
                turno_id, producto_id = sivrg_send_validate(
                    access_token=access_token,
                    rfid_uid=rfid_uid,
                    patente=patente,
                    fecha=fecha,
                )
                if turno_id:
                    # This will create an empty pesada entry
                    sivrg_update_turno(
                        access_token=access_token,
                        id=turno_id,
                        state=TURNO_STATE.BALANZA_OUT,
                    )
                    plc_start_seq(client)
                else:
                    prYellow("Turno no validado")

                ## PLC wait until weight is ready
                while True:
                    if is_plc_weight_rdy(client):
                        break
                    time.sleep(10)
                re_plc_weight = client.read_holding_registers(address=2)
                peso_pesada = re_plc_weight.registers[0]
                prLightPurple(f"Register 2 value:{peso_pesada}")
                client.write_registers(1, 25, unit=1)  # reset to PLC knows that i read it

                pesada_object = sivrg_update_pesada(
                    access_token=access_token,
                    turno_id=turno_id,
                    fecha_pesada=fecha,
                    peso_pesada=peso_pesada,
                    direction="out",
                )
                net_weight = pesada_object.get("peso_bruto_in") - pesada_object.get(
                    "peso_bruto_out"
                )
                sivrg_update_turno(
                    access_token=access_token, id=turno_id, state=TURNO_STATE.FINISHED
                )
                sivrg_update_silo(
                    access_token=access_token,
                    producto_id=producto_id,
                    peso_agregado=net_weight,
                )

    finally:
        print("Closing connection..")
        client.close()


if __name__ == "__main__":
    access_token = settings.ACCESS_TOKEN
    sivrg_check_refresh_token(access_token)
    title = "Choose your mode: "
    options = ["Ingreso playon", "Ingreso balanza", "Egreso balanza"]
    option, index = pick(options, title)
    match option:
        case "Ingreso playon":
            ingreso_playon()
            # pass
        case "Ingreso balanza":
            ingreso_balanza()
            # pass
        case "Egreso balanza":
            egreso_balanza()
            # pass
