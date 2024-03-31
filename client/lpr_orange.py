from lpr.ConvALPR.alpr.alpr import ALPR
import cv2
import yaml
import glob

import requests, json, datetime

from camera_orange import take_photo

from time import sleep
from rfid.MFRC522_python.mfrc522 import SimpleMFRC522
from utils import *
import os


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


def get_RFID():
    reader = SimpleMFRC522()

    try:
        while True:
            prGreen("Hold a tag near the reader")
            id, text = reader.read()
            print(f"ID: {id}\nText: {text}")
            sleep(5)
            print(f"Reading lisence from image or photo..")
            take_photo()
            prediccion = get_LPR()
            print({"LICENSE_PLATE": prediccion})
            print("Verifying truck credentials against the database..")

            prCyan(f"End of process flow..\nRestarting..\n")
    except KeyboardInterrupt:
        raise


if __name__ == "__main__":
    get_RFID()
