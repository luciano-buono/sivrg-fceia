# pip install pymodbus
import signal, sys
from pymodbus.client.tcp import ModbusTcpClient as ModbusClient
client= ModbusClient('192.168.2.99', port=502)

def signal_handler(signal, frame):
    print("\nprogram exiting gracefully")
    client.close()
    sys.exit(0)

signal.signal(signal.SIGINT, signal_handler)

try :
    client.connect()

    unit=0x1

    # rq = client.write_coil(0 ,True,unit=1)

    # rr = client.write_register(5,4,unit=1)

    print("READING....")
    readcoil = client.read_holding_registers(address=0)
    print (readcoil.registers)

    while 1:
        print("ds")
finally:
    print("Closing connection..")
    client.close()
