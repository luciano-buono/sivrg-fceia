import cv2, time

def take_photo():
    # Check which /dev/video* you need to use!
    cam = cv2.VideoCapture(1)

    ret, frame = cam.read()
    if not ret:
        print("failed to grab frame")

    img_name = "../FOTOS/opencv_frame_{}.png".format(0)
    cv2.imwrite(img_name, frame)
    print("{} written!".format(img_name))

    cam.release()


if __name__ == "__main__":
    take_photo()
