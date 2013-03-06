/*----------------------------------------------------------------------
 * Name: Stepper Motor using pins directly - no library
 *
 * Original Author: Simon Monk (on adafruit learning system for RaspberryPi)
 *
 * Modified for Arduino: coprea
 *----------------------------------------------------------------------*/

// Define pins to use
int stepPins[] = {2,3,4,5};

int waitTime = 5;	// milliseconds

// Define sequence
static const int STEP_COUNT = 4;
byte myArray[STEP_COUNT][4]={
  {    1,0,1,0    },
  {    0,1,1,0    },
  {    0,1,0,1    },
  {    1,0,0,1    }
};

void setup() {
  // initialize the serial port:
  Serial.begin(9600);

  // Set all pins as output
  for (int thisPin = 0; thisPin < 4; thisPin++)  {
    pinMode(stepPins[thisPin], OUTPUT);
    digitalWrite(stepPins[thisPin], LOW);    
  }
}

void loop() {
  forward(20);
  delay(100*waitTime);
  forward(256);
  delay(100*waitTime);
  forward(512);
  delay(100*waitTime);

  backwards(256);
  delay(100*waitTime);
  backwards(512);
  delay(100*waitTime);
}

void forward(int steps) {
  for (int i = 0; i < steps; i++)  {
    setStep(1, 0, 1, 0);
    delay(waitTime);
    setStep(0, 1, 1, 0);
    delay(waitTime);
    setStep(0, 1, 0, 1);
    delay(waitTime);
    setStep(1, 0, 0, 1);
    delay(waitTime);
  }
}

void backwards(int steps) {
  for (int i = 0; i < steps; i++)  {
    setStep(1, 1, 0, 0);
    delay(waitTime);
    setStep(1, 0, 0, 1);
    delay(waitTime);
    setStep(0, 0, 1, 1);
    delay(waitTime);
    setStep(0, 1, 1, 0);
    delay(waitTime);
  }
}

void setStep(int w1, int w2, int w3, int w4) {
  digitalWrite(stepPins[0], w1);
  digitalWrite(stepPins[1], w2);
  digitalWrite(stepPins[2], w3);
  digitalWrite(stepPins[3], w4);
}
