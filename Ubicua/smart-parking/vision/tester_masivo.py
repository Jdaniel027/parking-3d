#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
Script de Validación Masiva de Imágenes Reales.
Analiza la cantidad de píxeles de borde (Canny) en cada ROI para calibrar el umbral.
"""

import os
import json
import cv2
import numpy as np

def cargar_cajones(ruta_json):
    with open(ruta_json, 'r', encoding='utf-8') as f:
        return json.load(f).get("cajones", [])

def test_masivo():
    directorio_actual = os.path.dirname(os.path.abspath(__file__))
    ruta_json = os.path.join(directorio_actual, "cajones.json")
    cajones = cargar_cajones(ruta_json)
    
    # Lista exacta de tus 9 archivos de prueba reales cuidando las extensiones
    archivos = [
        "prueba1.png", 
        "prueba2.png", 
        "prueba3.png", 
        "prueba4.png", 
        "prueba5.png",
        "prueba6.png", 
        "prueba7.png", 
        "prueba8.png", 
        "prueba9.png"
    ]
    
    # Encabezado de la tabla para la consola
    print(f"\n{'Archivo':<15} | {'C1':<6} | {'C2':<6} | {'C3':<6} | {'C4':<6} | {'C5':<6}")
    print("-" * 60)

    for archivo in archivos:
        ruta_imagen = os.path.join(directorio_actual, "imagenes", archivo)
        
        if not os.path.exists(ruta_imagen):
            print(f"[FALTA] {archivo:<7} | -      | -      | -      | -      | -      ")
            continue
            
        frame = cv2.imread(ruta_imagen)
        
        # Reescalamos a la misma resolución que usamos en procesador.py para que el JSON encaje perfecto
        frame_redimensionado = cv2.resize(frame, (1280, 720))
        
        # Filtro Canny Edge Detector (Umbrales 50 y 150)
        grises = cv2.cvtColor(frame_redimensionado, cv2.COLOR_BGR2GRAY)
        bordes = cv2.Canny(grises, 50, 150)
        
        resultados = []
        
        for cajon in cajones:
            puntos = np.array(cajon["puntos"], np.int32).reshape((-1, 1, 2))
            
            # Enmascaramiento del trapecio
            mascara = np.zeros(bordes.shape, dtype=np.uint8)
            cv2.fillPoly(mascara, [puntos], 255)
            
            # Extraer bordes e insertarlos a la matriz de resultados
            bordes_aislados = cv2.bitwise_and(bordes, bordes, mask=mascara)
            cantidad_bordes = cv2.countNonZero(bordes_aislados)
            resultados.append(cantidad_bordes)
        
        # Imprimir la fila con los bordes detectados por cada cajón
        print(f"{archivo:<15} | {resultados[0]:<6} | {resultados[1]:<6} | {resultados[2]:<6} | {resultados[3]:<6} | {resultados[4]:<6}")
    
    print("-" * 60)
    print("Nota: Busca el 'salto numérico' entre los cajones vacíos y los ocupados.\n")

if __name__ == "__main__":
    test_masivo()