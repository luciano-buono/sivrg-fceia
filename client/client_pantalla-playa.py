#!/usr/bin/env python
# -*- coding: utf-8 -*-
from  tkinter import *
import tkinter as tk
#import RPi.GPIO as GPIO
import pygame
from gtts import gTTS
  

texto_patente= "AR245CA"
num_silo= "1"
texto_prox_patente = "DE245CC"

language='es'


def info():
   filewin = Toplevel(root)
   acerca_de = Label(filewin, text="Este programa fue desarrollado para la Facultad de Ciencias Exactas, Ingeniería y Agrimensura de la Universidad Nacional de Rosario")
   acerca_de.pack()

def llamado():
    texto_patente_espaciado = ""

    for caracter in texto_patente:
        texto_patente_espaciado = texto_patente_espaciado + caracter + ", "
        
    # Texto que deseas convertir a voz
    texto_a_leer = "Vehículo patente: " + texto_patente + ", dirigirse a balanza de ingreso para descargar en silo número " + num_silo + ". . . . . Repito. " + "Vehículo patente: " + texto_patente_espaciado + " dirigirse a balanza de ingreso para descargar en silo número " + num_silo + ". . . Muchas gracias. "

    # Crear el objeto gTTS (Google Text-to-Speech)
    tts = gTTS(text=texto_a_leer, lang=language)

    # Guardar el archivo de audio
    tts.save('output.mp3')
    # Inicializar pygame, ajustar la velocidad y reproducir el archivo de audio
    pygame.mixer.init()
    pygame.mixer.music.load('output.mp3')
    pygame.mixer.music.play()



#VENTANA
root=Tk()

#BARRA DE MENÚ
menubar = Menu(root)

filemenu = Menu(menubar, tearoff=0)
filemenu.add_command(label="Leer llamado", command=llamado)
filemenu.add_command(label="Acerca de...", command=info)
filemenu.add_separator()
filemenu.add_command(label="Salir", command=root.quit)

menubar.add_cascade(label="Acciones", menu=filemenu)

root.config(menu=menubar)

# Seteo de pin
ONAIRPIN=21
#GPIO.setmode(GPIO.BCM)
#GPIO.setup(ONAIRPIN, GPIO.IN, pull_up_down=GPIO.PUD_DOWN)


#root.geometry("1280x720")
root.geometry("{0}x{1}+0+0".format(root.winfo_screenwidth(), root.winfo_screenheight()))
root.configure(background='black')
root.title("SIVRG")
clock=Label(root,font=("times",50,"bold"))
#clock.grid(row=2,column=1,pady=200,padx=350)


# if(GPIO.input(ONAIRPIN)==True):
patente=Label(root,text=texto_patente,font="Arial 300 bold",fg="red")
patente.configure(bg='black')
silo=Label(root,font=("times",50,"bold"))
silo.config(text="Silo n°"+ num_silo,bg="black",fg="green",font="Arial 220 bold")
prox_patente=Label(root,font=("times",50,"bold"))
prox_patente.configure(text="Próximo:  "+ texto_prox_patente,bg="black",fg="yellow",font="Arial 100 bold")


patente.place(relx=0.5,rely=0.2,anchor='center')
silo.place(relx=0.5,rely=0.5,anchor='center')
prox_patente.place(relx=0.5,rely=0.8,anchor='center')


root.mainloop()
