import datetime
import time
# pip install pymodbus
import signal, sys, time
from pymodbus.client.tcp import ModbusTcpClient as ModbusClient
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
            access_token = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6InBlQjZ4Znp2am53TVhoSkpJUlV0dCJ9.eyJodHRwczovL3NpdnJnLm1ldGhpenVsLmNvbS9yb2xlcyI6WyJlbXBsb3llZSJdLCJodHRwczovL3NpdnJnLm1ldGhpenVsLmNvbS9lbWFpbCI6InJpY2FyZGl0b2ZvcnRAbWV0aGl6dWwubGl2ZSIsImlzcyI6Imh0dHBzOi8vbWV0aGl6dWwudXMuYXV0aDAuY29tLyIsInN1YiI6ImF1dGgwfDYxNGNlODUxNjE3MThlMDA2OWUzZDI1NCIsImF1ZCI6Imh0dHBzOi8vYXBpLnNpdnJnLm1ldGhpenVsLmNvbSIsImlhdCI6MTcwODI5MzA4MSwiZXhwIjoxNzA4Mzc5NDgxLCJhenAiOiJ2dW02eFJtMzJSYm1sRGpNRWFRYjg0ZEF4R0QwQWJnViIsInNjb3BlIjoiIiwicGVybWlzc2lvbnMiOltdfQ.gFdd-CLiWEex7WwOuUNB3vovc-YMXDKpVc61igh2Wrb5cj1qxTAq_nVNCdZp4RoJM4O5eTcghQniM1uUrInTrnXnzrhOqcgV-Z9Sih0pAhPnniQVIxV7bKOCmSOcRg5DiITN4i387F_TNtJaW6ogsITQ5GTTno38Hp1XPa2GPozF0K6Zt1k6geuca303Byb8jwropXPiLkqDGao8i28V43fvoOBX7PX4qEwWvuktnJXdVY_2JRmPiO_S8ck0poThmr1gI_RNEun7Ep79mNLBu1T0--l0cvnvxLmtUDitSbDx3cjKIKo4dl9MjRAJeVEVButATqMK2lH9_v5XdKxJRg'
            fecha = datetime.datetime.today() - datetime.timedelta(days=1)
            inp = input('Confirmar')
            is_validated = test_ingreso_balanza(access_token=access_token, rfid_uid=rfid_uid, patente=patente, fecha=fecha)

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



