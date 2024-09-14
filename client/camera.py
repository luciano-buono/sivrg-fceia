import cv2
from datetime import datetime
import os

cam = cv2.VideoCapture(0)

cv2.namedWindow("test")

img_directory = "../FOTOS/"

while True:
    ret, frame = cam.read()
    if not ret:
        print("failed to grab frame")
        break
    cv2.imshow("test", frame)

    k = cv2.waitKey(1)
    if k%256 == 27:
        # ESC pressed
        print("Escape hit, closing...")
        break
    elif k%256 == 32:
        # SPACE pressed
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        img_name = os.path.join(img_directory, f"{timestamp}.png")
        cv2.imwrite(img_name, frame)
        print("{} written!".format(img_name))

cam.release()

cv2.destroyAllWindows()



# import cv2, time
# cam = cv2.VideoCapture(0)
# cv2.namedWindow("test")
# ret, frame = cam.read()
# if not ret:
#     print("failed to grab frame")

# img_path = "../FOTOS/"
# img_name = "../FOTOS/opencv_frame_{}.png".format(0)
# cv2.imwrite(img_name, frame)
# print("{} written!".format(img_name))

# cam.release
# cv2.destroyAllWindows()
