import cv2, time

# Check which /dev/video* you need to use!
cam = cv2.VideoCapture(1)

ret, frame = cam.read()
if not ret:
    print("failed to grab frame")

img_path = "../FOTOS/"
img_name = "../FOTOS/opencv_frame_{}.png".format(0)
cv2.imwrite(img_name, frame)
print("{} written!".format(img_name))

cam.release()
