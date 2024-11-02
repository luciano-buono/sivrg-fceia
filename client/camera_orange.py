import cv2
from datetime import datetime
import os

def take_photo():
    # Check which /dev/video* you need to use!
    cam = cv2.VideoCapture(1)
    cam.set(cv2.CAP_PROP_FRAME_WIDTH, 1280)
    cam.set(cv2.CAP_PROP_FRAME_HEIGHT, 1024)

    img_directory = "../FOTOS/"
    ret, frame = cam.read()
    if not ret:
        print("failed to grab frame")

    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    img_name = os.path.join(img_directory, f"{timestamp}.png")
    cv2.imwrite(img_name, frame)
    print("{} written!".format(img_name))

    cam.release()
    return f"{timestamp}.png"

if __name__ == "__main__":
    take_photo()
