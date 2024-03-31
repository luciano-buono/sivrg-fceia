from lpr.ConvALPR.alpr.alpr import ALPR
import cv2
import yaml
import glob

import requests, json
import cv2, time, datetime


from time import sleep

# from rfid.MFRC522_python.mfrc522 import SimpleMFRC522
from utils import *
import os

import config

settings = config.Settings()


class AuthError(Exception):
    pass


def get_LPR():
    # Get into the module directory. Avoid errors in relative paths used there
    os.chdir("lpr/ConvALPR")
    CONFIGFILE = "config.yaml"
    with open(CONFIGFILE, "r") as stream:
        cfg = yaml.safe_load(stream)
    SOURCE_DIR = glob.glob("../../../FOTOS/img8.jpg")
    SOURCE_DIR = glob.glob("../../../FOTOS/opencv_frame_0.png")

    # Get all images in directory
    print(f"Source dir:{SOURCE_DIR}")
    cv2_images = []
    for file in SOURCE_DIR:
        print("Loading source files..")
        cv2_images.append(cv2.imread(file))
    # %%
    alpr = ALPR(cfg["modelo"], cfg["db"])
    # Show interactively the photos with the recognized box and License
    for i, x in enumerate(cv2_images):
        print("Predicting..")
        predicciones = alpr.predict(cv2_images[i])
        print(predicciones)

    # Get back to current directotry
    os.chdir(os.path.dirname(os.path.abspath(__file__)))

    if len(predicciones) == 1:
        return predicciones[0]
    else:
        print(
            "Hay mas de una patente reconozida\nRevisar cuantas imagenes de entrada hay\Exitting.."
        )
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
    print({"LICENSE_PLATE": prediccion})


def login_auth0():
    payload = {
        "client_id": settings.AUTH_CLIENT_ID,
        "client_secret": settings.AUTH_CLIENT_SECRET,
        "audience": settings.AUTH_CLIENT_AUDIENCE,
        "grant_type": "client_credentials",
    }
    response = requests.post(url=f"{settings.AUTH0_DOMAIN}/oauth/token", data=payload)
    print(response.text)
    response_json = json.loads(response.text)
    if response_json.get("error"):
        raise AuthError("Invalid client or secret key")
    return response_json.get("access_token")


def test_ingreso_playon(access_token: str, rfid_uid, patente, fecha):
    DOMAIN = "http://localhost:5000"
    headers = {"Authorization": f"Bearer {access_token}"}

    # Validate endpoint
    PATH = "/turnos/validate/"
    data = {"rfid_uid": rfid_uid, "patente": patente, "fecha": fecha}
    response = requests.get(url=f"{DOMAIN}{PATH}", headers=headers, params=data)
    response_text = json.loads(response.text)
    # print(response_text)
    if response.status_code == 401:
        print(response_text)
        return False
    turno_id = response_text.get("id")

    # PUT turno in in_progress_entrada state
    PATH = f"/turnos/{turno_id}/"
    data = {
        "state": "in_progress_entrada",
    }
    response = json.loads(
        requests.put(url=f"{DOMAIN}{PATH}", headers=headers, params=data).text
    )
    # print(response)

    print("Turno validado y en in_progress_entrada")
    return True


def test_ingreso_balanza(access_token: str, rfid_uid, patente, fecha):
    DOMAIN = "http://localhost:5000"
    headers = {"Authorization": f"Bearer {access_token}"}

    # Validate endpoint
    PATH = "/turnos/validate/"
    data = {"rfid_uid": rfid_uid, "patente": patente, "fecha": fecha}
    response = requests.get(url=f"{DOMAIN}{PATH}", headers=headers, params=data)
    response_text = json.loads(response.text)
    # print(response_text)
    if response.status_code == 401:
        print(response_text)
        return False
    turno_id = response_text.get("id")

    # PUT turno in in_progress_entrada state
    PATH = f"/turnos/{turno_id}/"
    data = {
        "state": "in_progress_balanza_in",
    }
    response = requests.put(url=f"{DOMAIN}{PATH}", headers=headers, params=data)
    response_text = json.loads(response.text)
    print("Turno validado y en in_progress_balanza_in")

    PATH = f"/turnos/{turno_id}/pesada"
    response = requests.get(url=f"{DOMAIN}{PATH}", headers=headers)
    response_text = json.loads(response.text)
    pesada_id = response_text.get("id")

    # PUT pesada time and value IN
    PATH = f"/pesadas/{pesada_id}/"
    data = {
        "fecha_hora_balanza_in": "2024-02-17T21:30:55.749Z",
        "peso_bruto_in": 10000,
        "turno_id": turno_id,
    }
    response = requests.put(url=f"{DOMAIN}{PATH}", headers=headers, params=data)
    response_text = json.loads(response.text)
    print("Turno validado y en in_progress_balanza_in")

    return True


if __name__ == "__main__":
    # local_camera()
    # get_RFID()
    # access_token = login_auth0()
    access_token = "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6InBlQjZ4Znp2am53TVhoSkpJUlV0dCJ9.eyJodHRwczovL3NpdnJnLm1ldGhpenVsLmNvbS9yb2xlcyI6WyJlbXBsb3llZSJdLCJodHRwczovL3NpdnJnLm1ldGhpenVsLmNvbS9lbWFpbCI6InJpY2FyZGl0b2ZvcnRAbWV0aGl6dWwubGl2ZSIsImlzcyI6Imh0dHBzOi8vbWV0aGl6dWwudXMuYXV0aDAuY29tLyIsInN1YiI6ImF1dGgwfDYxNGNlODUxNjE3MThlMDA2OWUzZDI1NCIsImF1ZCI6Imh0dHBzOi8vYXBpLnNpdnJnLm1ldGhpenVsLmNvbSIsImlhdCI6MTcwODI5MzA4MSwiZXhwIjoxNzA4Mzc5NDgxLCJhenAiOiJ2dW02eFJtMzJSYm1sRGpNRWFRYjg0ZEF4R0QwQWJnViIsInNjb3BlIjoiIiwicGVybWlzc2lvbnMiOltdfQ.gFdd-CLiWEex7WwOuUNB3vovc-YMXDKpVc61igh2Wrb5cj1qxTAq_nVNCdZp4RoJM4O5eTcghQniM1uUrInTrnXnzrhOqcgV-Z9Sih0pAhPnniQVIxV7bKOCmSOcRg5DiITN4i387F_TNtJaW6ogsITQ5GTTno38Hp1XPa2GPozF0K6Zt1k6geuca303Byb8jwropXPiLkqDGao8i28V43fvoOBX7PX4qEwWvuktnJXdVY_2JRmPiO_S8ck0poThmr1gI_RNEun7Ep79mNLBu1T0--l0cvnvxLmtUDitSbDx3cjKIKo4dl9MjRAJeVEVButATqMK2lH9_v5XdKxJRg"
    rfid_uid = 2222
    patente = "ABC321"
    fecha = datetime.datetime.today() - datetime.timedelta(days=1)
    inp = input("Confirmar")
    test_ingreso_playon(
        access_token=access_token, rfid_uid=rfid_uid, patente=patente, fecha=fecha
    )
