#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
Herramienta de Depuración Visual (Offline)
Analiza imágenes de prueba existentes, dibuja los polígonos Rojo/Verde y guarda el resultado.
"""

import os
import json
import cv2
import numpy as np

# --- CONFIGURACIÓN DE LA PRUEBA ---
UMBRAL_OCUPACION = 1000  # Tu umbral calibrado
# Cambia este nombre por la foto que quieras probar (prueba1.jpg hasta prueba9.jpg)
NOMBRE_IMAGEN_PRUEBA = "maqueta_real.jpg" 

RUTA_BASE = os.path.dirname(os.path.abspath(__file__))
RUTA_JSON = os.path.join(RUTA_BASE, "cajones.json")
RUTA_IMAGEN_PRUEBA = os.path.join(RUTA_BASE, "imagenes", NOMBRE_IMAGEN_PRUEBA)
RUTA_RESULTADO = os.path.join(RUTA_BASE, "imagenes", "resultado_test.jpg")

def cargar_cajones():
    with open(RUTA_JSON, 'r', encoding='utf-8') as f:
        return json.load(f).get("cajones", [])

def analizar_foto_prueba():
    print(f"[INFO] Analizando imagen de prueba: {NOMBRE_IMAGEN_PRUEBA}...")
    
    if not os.path.exists(RUTA_IMAGEN_PRUEBA):
        print(f"[ERROR] No se encontró la imagen: {RUTA_IMAGEN_PRUEBA}")
        return
        
    # 1. Cargar imagen y redimensionar (por si acaso)
    frame = cv2.imread(RUTA_IMAGEN_PRUEBA)
    frame = cv2.resize(frame, (1280, 720))
    cajones = cargar_cajones()
    
    # 2. Procesamiento de Visión
    grises = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
    bordes = cv2.Canny(grises, 50, 150)
    
    estados = []
    
    print("\n--- RESULTADO DE LA EVALUACIÓN ---")
    for cajon in cajones:
        puntos = np.array(cajon["puntos"], np.int32).reshape((-1, 1, 2))
        
        # Enmascaramiento y conteo
        mascara = np.zeros(bordes.shape, dtype=np.uint8)
        cv2.fillPoly(mascara, [puntos], 255)
        bordes_aislados = cv2.bitwise_and(bordes, bordes, mask=mascara)
        
        cantidad_bordes = cv2.countNonZero(bordes_aislados)
        estado = 1 if cantidad_bordes > UMBRAL_OCUPACION else 0
        estados.append(estado)
        
        # --- LÓGICA VISUAL (ROJO / VERDE) ---
        if estado == 1:
            color = (0, 0, 255)  # Rojo BGR (Ocupado)
            estado_texto = "OCUPADO"
        else:
            color = (0, 255, 0)  # Verde BGR (Libre)
            estado_texto = "LIBRE"
            
        # Dibujar el trapecio (thickness=3 para que resalte más)
        cv2.polylines(frame, [puntos], isClosed=True, color=color, thickness=3)
        
        # Fondo oscuro para el texto para que se lea mejor sobre los carritos
        x_texto, y_texto = cajon["puntos"][0][0], cajon["puntos"][0][1]
        (w_texto, h_texto), _ = cv2.getTextSize(f"{cajon['nombre']}: {estado_texto}", cv2.FONT_HERSHEY_SIMPLEX, 0.7, 2)
        cv2.rectangle(frame, (x_texto, y_texto - 25), (x_texto + w_texto, y_texto), (0, 0, 0), -1)
        
        # Escribir el texto
        cv2.putText(frame, f"{cajon['nombre']}: {estado_texto}", 
                    (x_texto, y_texto - 5), cv2.FONT_HERSHEY_SIMPLEX, 0.7, color, 2)
        
        print(f"{cajon['nombre']}: {estado_texto:<7} | Bordes: {cantidad_bordes}")
    
    # 3. Guardar la imagen con los dibujos
    cv2.imwrite(RUTA_RESULTADO, frame)
    print("----------------------------------")
    print(f"[ÉXITO] Imagen analizada guardada en: imagenes/resultado_test.jpg")
    print(f"Payload simulado: {estados}\n")

if __name__ == "__main__":
    analizar_foto_prueba()