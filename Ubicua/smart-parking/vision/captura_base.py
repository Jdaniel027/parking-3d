#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
Proyecto: Estacionamiento Público Inteligente - Smart City
Módulo: Visión Artificial / Calibración
Descripción: Este script inicializa la cámara Arducam mediante OpenCV,
             configura la resolución óptima y captura una imagen fija
             del estacionamiento vacío. Esta foto servirá para mapear
             las coordenadas de los 4 cajones.
Autor: Víctor Alexander Chávez López & Colaborador
Fecha: Mayo 2026
"""

import os
import time
import cv2

def capturar_imagen_calibracion():
    # Definir las rutas de almacenamiento de forma dinámica y ordenada
    directorio_actual = os.path.dirname(os.path.abspath(__file__))
    carpeta_imagenes = os.path.join(directorio_actual, "imagenes")
    ruta_guardado = os.path.join(carpeta_imagenes, "vacio.jpg")
    
    print("[INFO] Inicializando cámara Arducam...")
    
    # Inicializar la captura de video (0 es el índice por defecto de la cámara en Raspberry Pi)
    cap = cv2.VideoCapture(0, cv2.CAP_V4L2)
    
    # Configurar la resolución de captura a HD (1280x720)
    # Balance perfecto entre nitidez para los cajones y velocidad de procesamiento
    cap.set(cv2.CAP_PROP_FRAME_WIDTH, 1280)
    cap.set(cv2.CAP_PROP_FRAME_HEIGHT, 720)
    
    # Validar si el sistema operativo otorgó acceso a la cámara
    if not cap.isOpened():
        print("[ERROR] No se pudo acceder a la cámara Arducam. Verifica el cable flex.")
        return
    
    # Tiempo de espera (Warm-up) crítico para que el sensor de la cámara
    # regule automáticamente la exposición y el balance de blancos.
    print("[INFO] Estabilizando sensor de luz (Espera 2 segundos)...")
    time.sleep(2)
    
    # Capturar un único frame nítido
    ret, frame = cap.read()
    
    if ret:
        # Guardar la imagen en formato JPG en la carpeta especificada
        cv2.imwrite(ruta_guardado, frame)
        print(f"[ÉXITO] Imagen de calibración guardada en: {ruta_guardado}")
        print("[INFO] Revisa la carpeta 'imagenes/' en tu VS Code para verificar el encuadre.")
    else:
        print("[ERROR] No se pudo leer el frame de la cámara.")
        
    # Liberar el hardware de la cámara para que no se quede bloqueado
    cap.release()

if __name__ == "__main__":
    capturar_imagen_calibracion()