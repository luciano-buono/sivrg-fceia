# from .lpr.ConvALPR.alpr.alpr import ALPR
from lpr.ConvALPR.alpr.alpr import ALPR
import cv2
import yaml
import glob

import requests, json

import os

def get_LPR():
    # Get into the module directory. Avoid errors in relative paths used there
    os.chdir("lpr/ConvALPR")
    CONFIGFILE = "config.yaml"
    with open(CONFIGFILE, 'r') as stream:
        cfg = yaml.safe_load(stream)
    SOURCE_DIR =glob.glob('../../../FOTOS/img8.jpg')

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

    #Get back to current directotry
    os.chdir(os.path.dirname(os.path.abspath(__file__)))

    if len(predicciones) == 1:
        return predicciones[0]
    else:
        print("Hay mas de una patente reconozida\nRevisar cuantas imagenes de entrada hay\Exitting..")
        exit(1)

def get_RFID():
    pass

if __name__ == "__main__":
    prediccion = get_LPR()
    print({"LICENSE_PLATE":prediccion})

    tag_id = get_RFID()
    # tag_id = "10ABA3"
    # data= {
    #     'tag_id': tag_id,
    #     'license_plate': 'prediccion'
    # }
    # response = requests.post(url='http://localhost:5000/validate', data=json.dumps(data))
    # print(response.text)
