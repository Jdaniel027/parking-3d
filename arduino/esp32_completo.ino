#include <ArduinoJson.h>
#include <ESP32Servo.h>

// ==========================================
// PINES - SEMÁFOROS
// ==========================================
const int S1_2_R = 4;  const int S1_2_Y = 16; const int S1_2_G = 17;
const int S3_4_R = 14; const int S3_4_Y = 32; const int S3_4_G = 33;

// ==========================================
// PINES - LUCES ZONA (PWM)
// ==========================================
const int PIN_OESTE = 27;
const int PIN_ESTE  = 26;
const int PIN_LDR   = 34;

// ==========================================
// PINES - BARRERAS (ULTRASÓNICOS + SERVOS)
// ==========================================
const int TRIG_ENTRADA = 5;
const int ECHO_ENTRADA = 18;
const int TRIG_SALIDA  = 23;
const int ECHO_SALIDA  = 25;
const int SERVO_ENTRADA_PIN = 19;
const int SERVO_SALIDA_PIN  = 13;

const int ANGULO_CERRADO = 45;
const int ANGULO_ABIERTO = 130;
const int DISTANCIA_DETECCION = 10;

const unsigned long TIEMPO_ABIERTO = 3000;

Servo servoEntrada;
Servo servoSalida;
unsigned long ultimaDeteccionEntrada = 0;
unsigned long ultimaDeteccionSalida  = 0;

// ==========================================
// VARIABLES DE ESTADO - SEMÁFOROS
// ==========================================
enum ModoSemaforo { MANUAL, AUTOMATICO, EMERGENCIA };
struct Semaforo {
  ModoSemaforo modo = MANUAL;
  int verdeTime, amarilloTime, rojoTime;
  unsigned long lastChange;
  int etapa = 0;
};

Semaforo semaforos[4];
int intensidadOeste = 0;
int intensidadEste  = 0;
bool ecoOeste = false;
bool ecoEste  = false;
int disponibles = 0;

int pinesSem1_2[] = {S1_2_R, S1_2_Y, S1_2_G};
int pinesSem3_4[] = {S3_4_R, S3_4_Y, S3_4_G};

// ==========================================
// SETUP
// ==========================================
void setup() {
  Serial.begin(115200);

  int pines[] = {S1_2_R, S1_2_Y, S1_2_G, S3_4_R, S3_4_Y, S3_4_G, PIN_OESTE, PIN_ESTE};
  for (int p : pines) {
    pinMode(p, OUTPUT);
    digitalWrite(p, LOW);
  }

  pinMode(PIN_LDR, INPUT);
  pinMode(TRIG_ENTRADA, OUTPUT);
  pinMode(ECHO_ENTRADA, INPUT);
  pinMode(TRIG_SALIDA, OUTPUT);
  pinMode(ECHO_SALIDA, INPUT);

  servoEntrada.attach(SERVO_ENTRADA_PIN);
  servoSalida.attach(SERVO_SALIDA_PIN);
  servoEntrada.write(ANGULO_CERRADO);
  servoSalida.write(ANGULO_CERRADO);

  Serial.println("{\"status\":\"ESP32_READY\"}");
}

// ==========================================
// LOOP PRINCIPAL
// ==========================================
void loop() {
  if (Serial.available()) {
    StaticJsonDocument<512> doc;
    DeserializationError error = deserializeJson(doc, Serial);

    if (!error) {
      if (doc.containsKey("type")) {
        String type = doc["type"];
        if (type == "parking") {
          disponibles = doc["disponibles"];
        }
      } else if (doc.containsKey("semaforo")) {
        procesarSemaforo(doc);
      } else if (doc.containsKey("zona")) {
        procesarLuces(doc);
      }
    }
  }

  actualizarSemaforos();
  actualizarLucesEco();
  actualizarBarreras();
}

// ==========================================
// SEMÁFOROS
// ==========================================
void procesarSemaforo(JsonDocument& doc) {
  int id = doc["semaforo"];
  if (id < 1 || id > 4) return;

  Semaforo &s = semaforos[id - 1];
  String mode = doc["mode"];

  if (mode == "manual") {
    s.modo = MANUAL;
    String color = doc["payload"]["color"];
    prenderColor(id, color);
  }
  else if (mode == "automatico") {
    s.modo = AUTOMATICO;
    s.verdeTime = doc["payload"]["verde"];
    s.amarilloTime = doc["payload"]["amarillo"];
    s.rojoTime = doc["payload"]["rojo"];
    s.lastChange = millis();
    s.etapa = (id <= 2) ? 1 : 3;
    prenderColor(id, (id <= 2) ? "verde" : "rojo");
  }
  else if (mode == "emergencia") {
    s.modo = EMERGENCIA;
    prenderColor(id, "rojo");
  }
}

void actualizarSemaforos() {
  for (int i = 0; i < 4; i++) {
    if (semaforos[i].modo != AUTOMATICO) continue;

    unsigned long now = millis();
    Semaforo &s = semaforos[i];
    unsigned long duracion;

    if (s.etapa == 1) duracion = s.verdeTime * 1000;
    else if (s.etapa == 2) duracion = s.amarilloTime * 1000;
    else duracion = s.rojoTime * 1000;

    if (now - s.lastChange >= duracion) {
      s.etapa = (s.etapa % 3) + 1;
      s.lastChange = now;

      String color = (s.etapa == 1) ? "verde" : (s.etapa == 2) ? "amarillo" : "rojo";
      prenderColor(i + 1, color);
    }
  }
}

void prenderColor(int semId, String color) {
  int *p;
  if (semId == 1 || semId == 2) {
    p = pinesSem1_2;
  } else {
    p = pinesSem3_4;
  }

  digitalWrite(p[0], color == "rojo" ? HIGH : LOW);
  digitalWrite(p[1], color == "amarillo" ? HIGH : LOW);
  digitalWrite(p[2], color == "verde" ? HIGH : LOW);
}

// ==========================================
// LUCES - POR ZONA INDEPENDIENTE
// ==========================================
void procesarLuces(JsonDocument& doc) {
  String zona = doc["zona"];
  String mode = doc["mode"];

  bool afectaOeste = (zona == "oeste" || zona == "ambas");
  bool afectaEste  = (zona == "este"  || zona == "ambas");

  if (mode == "apagar") {
    if (afectaOeste) { intensidadOeste = 0; ecoOeste = false; analogWrite(PIN_OESTE, 0); }
    if (afectaEste)  { intensidadEste  = 0; ecoEste  = false; analogWrite(PIN_ESTE, 0); }
  }
  else if (mode == "manual") {
    int pwm = map((int)doc["payload"]["intensidad"], 0, 100, 0, 255);
    if (afectaOeste) { intensidadOeste = pwm; ecoOeste = false; analogWrite(PIN_OESTE, pwm); }
    if (afectaEste)  { intensidadEste  = pwm; ecoEste  = false; analogWrite(PIN_ESTE, pwm); }
  }
  else if (mode == "eco") {
    if (afectaOeste) ecoOeste = true;
    if (afectaEste)  ecoEste  = true;
  }
}

void actualizarLucesEco() {
  int nivelLuz = analogRead(PIN_LDR);
  int pwm = map(nivelLuz, 0, 1200, 255, 0);
  pwm = constrain(pwm, 0, 255);

  if (ecoOeste) analogWrite(PIN_OESTE, pwm);
  if (ecoEste)  analogWrite(PIN_ESTE, pwm);
}

// ==========================================
// BARRERAS (SERVOS + ULTRASÓNICOS)
// ==========================================
long obtenerDistancia(int trigPin, int echoPin) {
  digitalWrite(trigPin, LOW);
  delayMicroseconds(2);
  digitalWrite(trigPin, HIGH);
  delayMicroseconds(10);
  digitalWrite(trigPin, LOW);

  long duracion = pulseIn(echoPin, HIGH, 30000);
  long distancia = duracion * 0.034 / 2;

  if (distancia == 0) return 999;
  return distancia;
}

void actualizarBarreras() {
  long distEntrada = obtenerDistancia(TRIG_ENTRADA, ECHO_ENTRADA);
  long distSalida  = obtenerDistancia(TRIG_SALIDA,  ECHO_SALIDA);

  unsigned long ahora = millis();

  if (distEntrada < DISTANCIA_DETECCION && disponibles > 0) {
    servoEntrada.write(ANGULO_ABIERTO);
    ultimaDeteccionEntrada = ahora;
  } else if (ahora - ultimaDeteccionEntrada < TIEMPO_ABIERTO) {
    servoEntrada.write(ANGULO_ABIERTO);
  } else {
    servoEntrada.write(ANGULO_CERRADO);
  }

  if (distSalida < DISTANCIA_DETECCION) {
    servoSalida.write(ANGULO_ABIERTO);
    ultimaDeteccionSalida = ahora;
  } else if (ahora - ultimaDeteccionSalida < TIEMPO_ABIERTO) {
    servoSalida.write(ANGULO_ABIERTO);
  } else {
    servoSalida.write(ANGULO_CERRADO);
  }
}
