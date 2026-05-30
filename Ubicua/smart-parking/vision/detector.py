#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
Motor de Visión Artificial - Estacionamiento Inteligente IoT
Captura continua, análisis Canny, generación de payload y monitor visual (Overlay).
Integrado con WebSockets para reporte en tiempo real.
"""

import os
import json
import cv2
import numpy as np
import subprocess
import time
import socketio  # <-- NUEVO: Para comunicación con el backend

# --- CONFIGURACIÓN ---
UMBRAL_OCUPACION = 1000
RUTA_BASE = os.path.dirname(os.path.abspath(__file__))
RUTA_JSON = os.path.join(RUTA_BASE, "cajones.json")
RUTA_IMAGEN_TEMP = os.path.join(RUTA_BASE, "imagenes", "captura_actual.jpg")
RUTA_MONITOR = os.path.join(RUTA_BASE, "imagenes", "en_vivo.jpg") 

# --- CONFIGURACIÓN WSS ---
SERVER_URL = "http://localhost:3000" # Cambia localhost por la IP si el backend está en otra máquina
sio = socketio.Client()

@sio.event
def connect():
    print("[WSS] ✅ Conectado al servidor NestJS")

@sio.event
def disconnect():
    print("[WSS] ❌ Desconectado del servidor")

def cargar_cajones():
    with open(RUTA_JSON, 'r', encoding='utf-8') as f:
        return json.load(f).get("cajones", [])

def tomar_fotografia():
    comando = [
        "rpicam-still", 
        "-o", RUTA_IMAGEN_TEMP, 
        "-n", 
        "-t", "500"
    ]
    subprocess.run(comando, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)

def analizar_estacionamiento():
    tomar_fotografia()
    
    if not os.path.exists(RUTA_IMAGEN_TEMP):
        return None
        
    frame = cv2.imread(RUTA_IMAGEN_TEMP)
    frame = cv2.resize(frame, (1280, 720))
    
    cajones = cargar_cajones()
    grises = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
    bordes = cv2.Canny(grises, 50, 150)
    
    estados = []
    
    print("\n" + "="*35)
    print("      MONITOR DE TELEMETRÍA")
    print("="*35)
    
    for cajon in cajones:
        puntos = np.array(cajon["puntos"], np.int32).reshape((-1, 1, 2))
        mascara = np.zeros(bordes.shape, dtype=np.uint8)
        cv2.fillPoly(mascara, [puntos], 255)
        bordes_aislados = cv2.bitwise_and(bordes, bordes, mask=mascara)
        
        cantidad_bordes = cv2.countNonZero(bordes_aislados)
        estado = 1 if cantidad_bordes > UMBRAL_OCUPACION else 0
        estados.append(estado)
        
        if estado == 1:
            color = (0, 0, 255)
            texto = "OCUPADO"
        else:
            color = (0, 255, 0)
            texto = "LIBRE"
            
        cv2.polylines(frame, [puntos], isClosed=True, color=color, thickness=3)
        x_texto, y_texto = cajon["puntos"][0][0], cajon["puntos"][0][1]
        (w_texto, h_texto), _ = cv2.getTextSize(f"{cajon['nombre']}: {texto}", cv2.FONT_HERSHEY_SIMPLEX, 0.7, 2)
        cv2.rectangle(frame, (x_texto, y_texto - 25), (x_texto + w_texto, y_texto), (0, 0, 0), -1)
        cv2.putText(frame, f"{cajon['nombre']}: {texto}", (x_texto, y_texto - 5), cv2.FONT_HERSHEY_SIMPLEX, 0.7, color, 2)
        
        print(f"{cajon['nombre']}: {texto:<7} | Bordes: {cantidad_bordes}")
    
    print("-" * 35)
    print(f"PAYLOAD: {estados}")

    # --- ENVÍO DE DATOS VIA WSS ---
    if sio.connected:
        sio.emit('simulate_parking', {"estados": estados})
        print("[WSS] 📡 Datos enviados al servidor")
    else:
        print("[WSS] ⚠️ No conectado. Reintentando conexión...")
        try:
            sio.connect(SERVER_URL)
        except:
            pass
    
    cv2.imwrite(RUTA_MONITOR, frame)
    if os.path.exists(RUTA_IMAGEN_TEMP):
        os.remove(RUTA_IMAGEN_TEMP)

if __name__ == "__main__":
    print("[INFO] Iniciando motor con monitor visual y WSS...")
    
    # Intento inicial de conexión
    try:
        sio.connect(SERVER_URL)
    except Exception as e:
        print(f"[WSS] ❌ Error inicial de conexión: {e}")

    try:
        while True:
            analizar_estacionamiento()
            time.sleep(2)
    except KeyboardInterrupt:
        print("\n[INFO] Motor detenido.")
        if sio.connected:
            sio.disconnect()