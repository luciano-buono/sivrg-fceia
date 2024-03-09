import datetime
import time
# pip install pymodbus
import signal, sys, time
from pymodbus.client.tcp import ModbusTcpClient as ModbusClient
from sivrg_http_requests import TURNO_STATE, sivrg_send_validate, sivrg_update_pesada, sivrg_update_turno
from client_local import test_ingreso_balanza, test_ingreso_playon

from utils import *

from threading import Thread


MODBUS_HOST = '192.168.2.40'
MODBUS_PORT = 501
client= ModbusClient(MODBUS_HOST, port=MODBUS_PORT)
client.connect()

def ingreso_playon():
    print("Inicio de secuencia")
    print("set register 0 to value 100")
    client.write_registers(0,100,unit=1) #reset bit comunicación


def ingreso_balanza():
    pass
def egreso_balanza():
    pass

def send_bit_de_vida(interval_sec):
    while True:
        print("-----Send bit de vida-----")
        client.write_registers(10,25,unit=1) #reset bit comunicación
        time.sleep(interval_sec)

if __name__ == '__main__':
    print('Starting background task...')
    daemon = Thread(target=send_bit_de_vida, args=(5,), daemon=True, name='Background')
    daemon.start()
    try :
        while True:

            ## PLC wait until ready
            while True:
                re_plc_rdy = client.read_holding_registers(address=7)
                print(f'Register 7 value:{re_plc_rdy.registers}')
                if re_plc_rdy.registers[0] == 100:
                    print('PLC ready')
                    break
                time.sleep(10)

            ## RFID LPR
            prGreen("Hold a tag near the reader")
            rfid_uid = input("RFID_UID")
            rfid_uid = 2222
            print(f"ID: {rfid_uid}")
            print(f"Reading lisence from image..")
            patente = 'ABC321'
            print({"LICENSE_PLATE":patente})

            ## FastAPI
            access_token = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6InBlQjZ4Znp2am53TVhoSkpJUlV0dCJ9.eyJodHRwczovL3NpdnJnLm1ldGhpenVsLmNvbS9yb2xlcyI6WyJlbXBsb3llZSJdLCJpc3MiOiJodHRwczovL21ldGhpenVsLnVzLmF1dGgwLmNvbS8iLCJzdWIiOiJpaU5zQ0JjWmNmT0lvMERMVnk2SXRuM1RFZnlQMlpPRUBjbGllbnRzIiwiYXVkIjoiaHR0cHM6Ly9hcGkuc2l2cmcubWV0aGl6dWwuY29tIiwiaWF0IjoxNzEwMDE0ODM5LCJleHAiOjE3MTAyMDEyMzksImF6cCI6ImlpTnNDQmNaY2ZPSW8wRExWeTZJdG4zVEVmeVAyWk9FIiwic2NvcGUiOiJyZWFkOnRlc3QiLCJndHkiOiJjbGllbnQtY3JlZGVudGlhbHMiLCJwZXJtaXNzaW9ucyI6WyJyZWFkOnRlc3QiXX0.DolxtfwM-2XWcwlkE0lyps2Md4Vp8sRMAOuSarcjzNqbmIShg5rg2J2gdQq64nGCOCKossrv8v1lRu0PmCZjf2tjMWLfufnOXrYm1plc_Ldow63McAE-uROkfdc5p07QSmaiRMgkcrzvXUeBrjlBbtYf8mStHj4nqC6RTFATi5Aj_Zt3p3-c5fyLMOUMLmuKmVRPX_0xhG6Lxm9uHDL9gBod1PQhz8MJzonaMYXY_G4tjvpWVVuWMzI91LKQ8d-fT41B53-3gFlBwS5qmp_LTBHs2AJn90GCkNfFPBYBIFwEZeHaZcTHxwvo5f6Lco7LetQuquE8Y6rIIt8_cPg7bg'
            fecha = datetime.datetime(2024,3,9)
            inp = input('Confirmar')
            # # BalanzaIN
            turno_id = sivrg_send_validate(access_token=access_token, rfid_uid=rfid_uid, patente=patente, fecha=fecha)
            sivrg_update_turno(access_token=access_token,id=turno_id, state=TURNO_STATE.BALANZA_IN)
            sivrg_update_pesada(access_token=access_token, turno_id=turno_id, fecha_pesada=fecha, peso_pesada=7000, direction='in')
            if turno_id:
                is_validated = True
            ## PLC start sequence
            if is_validated:
                print("Inicio de secuencia")
                print("set register 0 to value 100")
                client.write_registers(0,100,unit=1) #reset bit comunicación

            ## PLC wait until weight is ready
            while True:
                re_plc_weight_rdy = client.read_holding_registers(address=1)
                print(f'Register 1 value:{re_plc_weight_rdy.registers}')
                if re_plc_weight_rdy.registers[0] == 100:
                    print('PLC Weight ready')
                    break
                time.sleep(10)
            re_plc_weight = client.read_holding_registers(address=2)
            print(f'Register 2 value:{re_plc_weight.registers}')
            client.write_registers(1,25,unit=1) # reset to PLC knows that i read it

    finally:
        print("Closing connection..")
        client.close()



