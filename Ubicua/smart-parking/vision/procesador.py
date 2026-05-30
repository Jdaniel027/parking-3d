#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
Proyecto: Estacionamiento Público Inteligente - Smart City
Módulo: Visión Artificial / Procesamiento y Calibración
Descripción: Este script lee la imagen base del estacionamiento, la reescala
             a resolución de trabajo (1280x720) y dibuja los rectángulos
             delimitadores definidos en 'cajones.json'. Sirve para calibrar
             visualmente la posición de los 4 cajones en entornos Headless.
Autor: Víctor Alexander Chávez López & Colaborador
Fecha: Mayo 2026
"""

import os
import json
import cv2
import numpy as np

def cargar_configuracion_cajones(ruta_json):
    """Lee el archivo JSON con las coordenadas de los cajones."""
    if not os.path.exists(ruta_json):
        print(f"[ERROR] No se encontró el archivo de configuración: {ruta_json}")
        return None
    
    with open(ruta_json, 'r', encoding='utf-8') as f:
        data = json.load(f)
    return data.get("cajones", [])

def dibujar_zonas_calibracion():
    # Configuración de rutas dinámicas para evitar errores de directorio
    directorio_actual = os.path.dirname(os.path.abspath(__file__))
    ruta_imagen_base = os.path.join(directorio_actual, "imagenes", "vacio.jpg")
    ruta_imagen_salida = os.path.join(directorio_actual, "imagenes", "calibracion.jpg")
    ruta_json = os.path.join(directorio_actual, "cajones.json")
    
    # 1. Validar y cargar la imagen capturada por la cámara
    if not os.path.exists(ruta_imagen_base):
        print("[ERROR] No existe 'vacio.jpg'. Ejecuta primero la captura de la cámara.")
        return
        
    frame = cv2.imread(ruta_imagen_base)
    
    # 2. Reescalar a dimensiones de trabajo HD (1280 x 720)
    # Esto reduce drásticamente el uso de CPU/RAM en la Raspberry Pi 4
    ancho_trabajo = 1280
    alto_trabajo = 720
    frame_redimensionado = cv2.resize(frame, (ancho_trabajo, alto_trabajo))
    
    # 3. Cargar las coordenadas del JSON
    cajones = cargar_configuracion_cajones(ruta_json)
    if not cajones:
        print("[ERROR] No se pudieron cargar los cajones del archivo JSON.")
        return

    print(f"[INFO] Procesando {len(cajones)} cajones para calibración...")
    
    # 4. Iterar sobre cada cajón y dibujar su polígono en el lienzo
    for cajon in cajones:
        puntos = cajon["puntos"]
        nombre = cajon["nombre"]
        
        # Convertir la lista de puntos a un arreglo matricial de NumPy que OpenCV entienda
        pts = np.array(puntos, np.int32)
        pts = pts.reshape((-1, 1, 2))
        
        # Dibujar polígono (isClosed=True para que cierre el trapecio)
        cv2.polylines(frame_redimensionado, [pts], isClosed=True, color=(0, 255, 0), thickness=2)
        
        # Extraer la primera coordenada (esquina superior izquierda) para colocar el texto
        x_texto, y_texto = puntos[0][0], puntos[0][1]
        
        cv2.putText(
            frame_redimensionado, 
            nombre, 
            (x_texto, y_texto - 10), 
            cv2.FONT_HERSHEY_SIMPLEX, 
            0.6, 
            (0, 255, 0), 
            2
        )
        
    # 5. Guardar el resultado en el disco
    cv2.imwrite(ruta_imagen_salida, frame_redimensionado)
    print(f"[ÉXITO] Imagen de calibración generada en: {ruta_imagen_salida}")
    print("[INFO] Ejecuta 'code imagenes/calibracion.jpg' para ajustar tus coordenadas.")

if __name__ == "__main__":
    dibujar_zonas_calibracion()