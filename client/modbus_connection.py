# pip install pymodbus
import signal, sys, time
from pymodbus.client.tcp import ModbusTcpClient as ModbusClient


client= ModbusClient('192.168.2.40', port=504)
# def signal_handler(signal, frame):
#     print("\nprogram exiting gracefully")
#     client.close()
#     sys.exit(0)

# signal.signal(signal.SIGINT, signal_handler)



def ingreso_playon():
    try :
        client.connect()

        print('Leer que PLC este listo para comenzar')
        re_plc_rdy = client.read_holding_registers(address=7)
        print(re_plc_rdy.registers)
        if re_plc_rdy.registers[0] == 100:

            print("Inicio de secuencia")
            client.write_registers(0,100,unit=1) #reset bit comunicación

        while True:
            print("Send bit de vida")
            client.write_registers(10,25,unit=1) #reset bit comunicación
            time.sleep(5)

    finally:
        print("Closing connection..")
        client.close()

def ingreso_balanza():
    pass
def egreso_balanza():
    pass

if __name__ == '__main__':
    ingreso_playon()
