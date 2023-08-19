# %%
from alpr.alpr import ALPR
import cv2
import yaml
import matplotlib.pyplot as plt
import matplotlib.image as mpimg
import glob

import requests, json

CONFIGFILE = "config.yaml"

with open(CONFIGFILE, 'r') as stream:
    cfg = yaml.safe_load(stream)

# %%


SOURCE_DIR =glob.glob('../../FOTOS/*.jpg')
SOURCE_DIR =glob.glob('../../FOTOS/img8.jpg')
SHOW_PREVIEW_IMAGE = False
SHOW_INTERACTIVE_IMAGE2 = False

def get_LPR():
    # Get all images in directory
    print(f"Source dir:{SOURCE_DIR}")
    cv2_images = []
    plt_images = []
    name_images = []
    images = [cv2.imread(file) for file in SOURCE_DIR]
    for file in SOURCE_DIR:
        print("Loading source files..")
        name_images.append(file)
        cv2_images.append(cv2.imread(file))
        plt_images.append(mpimg.imread(file))

    # Check how to use it
    # is_img = cv2.haveImageReader(video_path)


    # %%
    # Only works on Notebook, show list of images to be analyzed
    if SHOW_PREVIEW_IMAGE:
        fig = plt.figure(figsize=(20, 10))
        for i, x in enumerate(plt_images):
        #   image, label = next(train_iter)
            fig.add_subplot(1, len(plt_images), i+1)
            plt.imshow(x)
            plt.axis('off')
            plt.title(name_images[i])

    # %%
    alpr = ALPR(cfg['modelo'], cfg['db'])
        # Show interactively the photos with the recognized box and License
    for i, x in enumerate(cv2_images):
        print("Predicting..")
        predicciones = alpr.predict(cv2_images[i])

        if SHOW_INTERACTIVE_IMAGE2:
            frame = cv2_images[i]
            frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            frame_w_pred, total_time = alpr.mostrar_predicts(frame)
            frame_w_pred = cv2.cvtColor(frame_w_pred, cv2.COLOR_RGB2BGR)
            frame_w_pred_r = cv2.resize(frame_w_pred, dsize=(1400, 1000))
            cv2.namedWindow("result", cv2.WINDOW_AUTOSIZE)
            cv2.imshow("result", frame_w_pred_r)
            cv2.waitKey()
            print(f"{name_images[i]}: {predicciones}")

    if len(predicciones) == 1:
        return predicciones[0]
    else:
        print("Hay mas de una patente reconozida\nRevisar cuantas imagenes de entrada hay\Exitting..")
        exit(1)

if __name__ == "__main__":
    # prediccion = get_LPR()
    # print({"LICENSE_PLATE":prediccion})
    tag_id = "10ABA3"
    data= {
        'tag_id': tag_id,
        'license_plate': 'prediccion'
    }
    response = requests.post(url='http://localhost:5000/validate', data=json.dumps(data))
    print(response.text)