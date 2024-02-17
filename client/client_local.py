from lpr.ConvALPR.alpr.alpr import ALPR
import cv2
import yaml
import glob

import requests, json
import cv2, time


from time import sleep
# from rfid.MFRC522_python.mfrc522 import SimpleMFRC522
from utils import *
import os

import config

settings = config.Settings()
class AuthError(Exception): pass

def get_LPR():
    # Get into the module directory. Avoid errors in relative paths used there
    os.chdir("lpr/ConvALPR")
    CONFIGFILE = "config.yaml"
    with open(CONFIGFILE, 'r') as stream:
        cfg = yaml.safe_load(stream)
    SOURCE_DIR =glob.glob('../../../FOTOS/img8.jpg')
    SOURCE_DIR =glob.glob('../../../FOTOS/opencv_frame_0.png')

    # Get all images in directory
    print(f"Source dir:{SOURCE_DIR}")
    cv2_images = []
    for file in SOURCE_DIR:
        print("Loading source files..")
        cv2_images.append(cv2.imread(file))
    # %%
    alpr = ALPR(cfg['modelo'], cfg['db'])
        # Show interactively the photos with the recognized box and License
    for i, x in enumerate(cv2_images):
        print("Predicting..")
        predicciones = alpr.predict(cv2_images[i])
        print(predicciones)

    #Get back to current directotry
    os.chdir(os.path.dirname(os.path.abspath(__file__)))

    if len(predicciones) == 1:
        return predicciones[0]
    else:
        print("Hay mas de una patente reconozida\nRevisar cuantas imagenes de entrada hay\Exitting..")
        exit(1)

def local_camera():
    cam = cv2.VideoCapture(0)
    cv2.namedWindow("test")
    ret, frame = cam.read()
    if not ret:
        print("failed to grab frame")

    img_path = "../FOTOS/"
    img_name = "../FOTOS/opencv_frame_{}.png".format(0)
    cv2.imwrite(img_name, frame)
    print("{} written!".format(img_name))

    cam.release
    cv2.destroyAllWindows()
    print("Saving photo...")
    time.sleep(5)
    prediccion = get_LPR()
    print({"LICENSE_PLATE":prediccion})

def login_auth0():
    payload = {
        "client_id":settings.AUTH_CLIENT_ID,
        "client_secret":settings.AUTH_CLIENT_SECRET,
        "audience":settings.AUTH_CLIENT_AUDIENCE,
        "grant_type":"client_credentials"
    }
    response = requests.post(url=f'{settings.AUTH0_DOMAIN}/oauth/token', data=payload)
    print(response.text)
    response_json = json.loads(response.text)
    if response_json.get("error"):
        raise AuthError("Invalid client or secret key")
    return response_json.get("access_token")

def test_apis():

    rfid_uid = 1111
    patente = 'ABC123'
    fecha = '2024-02-17T06:30:05.260862'
    data= {
        'rfid_uid': rfid_uid,
        'patente': patente,
        'fecha': fecha
    }
    response = requests.get(url='http://localhost:5000/public/turnos/validate', params=data)
    print(response.text)


    # Create initial pesada with no values just to have time of arrival
    data = {
        "peso_bruto_in": 0,
        "peso_bruto_out": 0,
        "turno_id": 2
    }
    response = requests.get(url='http://localhost:5000/pesadas', data=json.dumps(data))


    # Edit pesada with with ingress weight
    data = {
        "peso_bruto_in": 0,
        "peso_bruto_out": 0,
        "turno_id": 2
    }
    response = requests.get(url='http://localhost:5000/pesadas', data=json.dumps(data))


if __name__ == "__main__":
    # local_camera()
    # get_RFID()
    # access_token = login_auth0()
    access_token = "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6InBlQjZ4Znp2am53TVhoSkpJUlV0dCJ9.eyJpc3MiOiJodHRwczovL21ldGhpenVsLnVzLmF1dGgwLmNvbS8iLCJzdWIiOiJpaU5zQ0JjWmNmT0lvMERMVnk2SXRuM1RFZnlQMlpPRUBjbGllbnRzIiwiYXVkIjoiaHR0cHM6Ly9hcGkuc2l2cmcubWV0aGl6dWwuY29tIiwiaWF0IjoxNzA4MjEwMTkxLCJleHAiOjE3MDgyOTY1OTEsImF6cCI6ImlpTnNDQmNaY2ZPSW8wRExWeTZJdG4zVEVmeVAyWk9FIiwic2NvcGUiOiJyZWFkOnRlc3QiLCJndHkiOiJjbGllbnQtY3JlZGVudGlhbHMiLCJwZXJtaXNzaW9ucyI6WyJyZWFkOnRlc3QiXX0.PhoNWTX3FZxyuWCvspkhhuFLo5sJzepT7Z9OkU-Rxwjif7rnm0jKvcvNAgtnqCXsM0_i_wG9j0aNJ2scG5KPVE-TOYw0NMrAEX0BLTVHkFSiDY9XcC1VyuCY2E4KjXJMnPxpHJ4lBuBoE7urQo58tvrd-1fbj4BtDbjD0xlNIguhIG148jjJq2NZq7LTPSkEpteYV1L2GBwHgsTI16GBC1hQXhH2i-zqQkfYc_ejeN2yz5FT4HEMsmOVlRDj6bsBMvNlsQ-qITA7YZX7RcafAwTgMJ8rUXx8BHy6MQRe4GyJDzi34b0eQqLOWjWOesGTa3IZ6lllkj7ADpMQP9x1iQ"
