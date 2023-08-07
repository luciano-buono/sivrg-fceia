#!/usr/bin/env python
import time
import RPi.GPIO as GPIO
from mfrc522 import SimpleMFRC522
import mysql.connector

db = mysql.connector.connect(
  host="192.168.100.70",
  user="sivrg_admin",
  password="proyectofinal",
  database="attendancesystem"
)

cursor = db.cursor()
reader = SimpleMFRC522()

try:
  while True:
    print('Acerca la tarjeta de identificacion')
    id, text = reader.read()

    cursor.execute("Select id, name FROM users WHERE rfid_uid="+str(id))
    result = cursor.fetchone()

    if cursor.rowcount >= 1:
      print("Bienvenido/a " + result[1])
      cursor.execute("INSERT INTO attendance (user_id) VALUES (%s)", (result[0],) )
      db.commit()
    else:
      print("Conductor no registrado.")
    time.sleep(2)
finally:
  GPIO.cleanup()
