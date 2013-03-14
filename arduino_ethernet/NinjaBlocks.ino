/*
  NinjaBlock Basic Comms Example - @askpete
 
 This sketch uses the NinjaBlockEthernet library to create a rudimentary button sensor 
 and a simple led actuator. This is awesome because it gives your Arduino project a
 REST interface in a couple of minutes.
 
 @justy : Note that the EtherTen reserves pins 11-13 for Ethernet and Card operations.  The Arduino Ethernet
 shield uses pin 10 and 4 also.
 
 Ninja Params
 ------------
 
 You need a Ninja Blocks account to use the library, use the invite code 1012BB to signup
 at https://a.ninja.is if you don't have one. 
 
 For reference the NinjaBlock params are:
 
 token    For hacking use the virtual block token from https://a.ninja.is/hacking , there
 are other ways to get a token but hard to squeeze into a library for a 328.
 nodeID   This is the board's ID. Can be any 12+char string. It's used in REST so it's a
 good idea to make it easy to remember, e.g. ARDUINOBLOCK.
 vendorID Use 0 with the device IDs here http://ninjablocks.com/docs/device-ids and 
 you get pretty widgets for "free". Create your own by pinging help@ninjablocks.com.
 deviceID Identifies each device and maps to UI elements and properties that allow other apps
 to interact with your devices without knowing about them, see link above.
 guid     Think of this as port - it is used to differentiate between multiple devices of
 the same type.
 
 How to use this example
 -----------------------
 
 1) I've tested this with a Freetronics Etherten (http://www.freetronics.com/etherten ) and 
 an Arduino Ethernet (http://arduino.cc/en/Main/ArduinoBoardEthernet ), but any board or 
 shield compatible with the standard Ethernet library should be fine. 
 
 For the button we'll just ground pin 5 - feel free to wire up a button. In the real 
 world you would obviously want to debounce.
 
 Connect the anode (long lead, +ve) of a LED to pin 7, and connect that LED's cathode (short lead, -ve) to GND through a 330R-1K resistor. 
 
 2) Copy the NinjaBlock library into your Arduino libraries dir. 
 
 3) Upload and plug in the intwertubes
 
 4) When you ground your button the first time it will appear on your dashboard. Turn your 
 led on by clicking on white and off by clicking on black. Yay.
 
 5) The real fun is using REST interface, e.g. turn your light on with
 
 curl -H 'Content-Type: application/json' \
 -X 'PUT' \
 -d '{ "DA" : "FFFFFF" }' \
 -i https://api.ninja.is/rest/v0/device/ARDUINOBLOCK_0_0_1000?user_access_token=YOURTOKEN
 
 NB: Access tokens are not the same as block tokens, get yours from https://a.ninja.is/hacking
 
 You can also add a callback for your button that pings a uri of your choice whenever its 
 pressed, or create a rule that sends an sms, posts to facebook, hits a webhook or whatever.
 I hope you do something interesting, be sure and let me know in the forums 
 http://ninjablocks.com/forums
 
 TODO: Write a proper how-to for this 
 
 */

#include <SPI.h>
#include <Ethernet.h>
#include <NinjaBlockEthernet.h>
//#include <MemoryFree.h>
// used to measure the temp only once in a while
#include <TimedAction.h>
#include "DHT.h"
// for dtostrf(FLOAT,WIDTH,PRECISION,BUFFER);
#include<stdlib.h>

#define DEFAULT_VENDOR_ID 0

#define LED_DEVICE_ID 1000
//#define BUTTON_DEVICE_ID 5
#define STEPPER_DEVICE_ID 239
#define TEMP_DEVICE_ID 202
#define TEMP_DHT_DEVICE_ID 9
#define HUMIDITY_DHT_DEVICE_ID 8

// thermistor
// the value of the 'other' resistor
#define SERIESRESISTOR 10000
// What pin to connect the sensor to
#define THERMISTORPIN A0
// resistance at 25 degrees C
#define THERMISTORNOMINAL 10000      
// temp. for nominal resistance (almost always 25 C)
#define TEMPERATURENOMINAL 25   
// how many samples to take and average, more takes longer
// but is more 'smooth'
#define NUMSAMPLES 5
// The beta coefficient of the thermistor (usually 3000-4000)
#define BCOEFFICIENT 3950
// the value of the 'other' resistor
#define SERIESRESISTOR 10000
int samples[NUMSAMPLES];

// DHT sensor
// Connect pin 1 (on the left) of the sensor to +5V
// Connect pin 2 of the sensor to whatever your DHTPIN is
// Connect pin 4 (on the right) of the sensor to GROUND
// Connect a 10K resistor from pin 2 (data) to pin 1 (power) of the sensor
#define DHTPIN 2     // what pin we're connected to
#define DHTTYPE DHT11   // DHT 11 
DHT dht(DHTPIN, DHTTYPE);

#define ENABLE_SERIAL true    // @justy : You may wish to disable Serial, but it's also handy to be able to use it for debugging, so here's a master switch.

// Define pins and delay to use for stepper motor
int stepPins[] = {9,8,7,4};
int waitTime = 5;	// milliseconds

//byte button = 5; // Jumper this to ground to press the "button"
byte led = 3;  // Connect the anode (long lead, +ve) of a LED to this pin, and connect that LED's cathode (short lead, -ve) to GND through a 330R-K resistor. 

//boolean isButtonDown = false;

// to be used to send float values as chars to the dashboard
char tmp[5];

// use a TimedAction for temp measuring so we do it only about every minute
TimedAction timedAction = TimedAction(60000,measureTempBoth);

void setup(){

  pinMode(led, OUTPUT);  

  // Set all stepper motor pins as output
  for (int thisPin = 0; thisPin < 4; thisPin++)  {
    pinMode(stepPins[thisPin], OUTPUT);
    digitalWrite(stepPins[thisPin], LOW);    
  }

  // test the stepper motor
//  forward(20);
//  delay(100*waitTime);
//  backwards(20);
//  delay(100*waitTime);

  dht.begin();

  // connect AREF to 3.3V and use that as VCC, less noisy!
  analogReference(EXTERNAL);

#if ENABLE_SERIAL
  Serial.begin(9600);
  Serial.println("Starting..");
#endif
  delay(1000);   // This delay is to wait for the Ethernet Controller to get ready

  NinjaBlock.host = "api.ninja.is";
  NinjaBlock.port = 80;
  NinjaBlock.nodeID = "ARDUINOBLOCK";  // Name this as you wish
  NinjaBlock.token = "YOURTOKEN"; // Get yours from https://a.ninja.is/hacking 
  NinjaBlock.guid = "0";
  NinjaBlock.vendorID=DEFAULT_VENDOR_ID;
  NinjaBlock.deviceID=STEPPER_DEVICE_ID;

  if (NinjaBlock.begin()==0)
    Serial.println("Init failed");

  // Tell Ninja we exist and are alive and off.
#if ENABLE_SERIAL 
  Serial.println("Creating STEPPER_DEVICE");
#endif
  NinjaBlock.send("000000"); // doesn't really matter what we send, this is an actuator

}

void loop() {

  if(NinjaBlock.receive()) {
//#if ENABLE_SERIAL
//      Serial.println("Data available");
//#endif
    // If this function returns true, there are commands (data) from the server
    // Return values are:
    // NinjaBlock.strGUID
    // NinjaBlock.intVID
    // NinjaBlock.intDID
    // NinjaBlock.intDATA - if data is integer
    // NinjaBlock.strDATA - if data is string (note char[64])

    if (NinjaBlock.IsDATAString) {

      // Serial.print("strDATA=");
      // Serial.println(NinjaBlock.strDATA);

      if (NinjaBlock.intDID == LED_DEVICE_ID) {

        // FFFFFF is "white" in the RGB widget we identified as
        if (strcmp(NinjaBlock.strDATA,"FFFFFF") == 0) { 
#if ENABLE_SERIAL
          Serial.println("LED ON");
#endif
          digitalWrite(led, HIGH); 
        } 
        else if (strcmp(NinjaBlock.strDATA,"000000") == 0) {
#if ENABLE_SERIAL
          Serial.println("LED OFF");
#endif
          digitalWrite(led, LOW); 
        }

      } 
      else if (NinjaBlock.intDID == STEPPER_DEVICE_ID) {

        // do something with the stepper motor
#if ENABLE_SERIAL
        Serial.println("STEPPER MOTOR ON");
#endif
        forward(20);
        delay(10*waitTime);

      }
    } 
    else {
      // Do something with int data
#if ENABLE_SERIAL
      Serial.print("intDATA=");
      Serial.println(NinjaBlock.intDATA);
#endif
    }

  } else {
    // measure and send temp once about every minute
    timedAction.check();
  }    

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
    setStep(1, 0, 0, 1);
    delay(waitTime);
    setStep(0, 1, 0, 1);
    delay(waitTime);
    setStep(0, 1, 1, 0);
    delay(waitTime);
    setStep(1, 0, 1, 0);
    delay(waitTime);
  }
}

void setStep(int w1, int w2, int w3, int w4) {
  digitalWrite(stepPins[0], w1);
  digitalWrite(stepPins[1], w2);
  digitalWrite(stepPins[2], w3);
  digitalWrite(stepPins[3], w4);
}

void measureTempBoth() {
  measureTempHumid();
  measureTemp();
}

void measureTempHumid() {
  // Reading temperature or humidity takes about 250 milliseconds!
  // Sensor readings may also be up to 2 seconds 'old' (its a very slow sensor)
  float h = dht.readHumidity();
  float t = dht.readTemperature();
  if (!isnan(t) && !isnan(h)) {
    
#if ENABLE_SERIAL
    Serial.print("Humidity: "); 
    Serial.print(h);
    Serial.print(" %\t");
    Serial.print("Temperature: "); 
    Serial.print(t);
    Serial.println(" *C");
#endif
   
    // the values coming from the library are floats but all I've seen
    // as decimals are .00 so they can be sent as ints
    NinjaBlock.deviceID=TEMP_DHT_DEVICE_ID;
    NinjaBlock.send(t);
    delay(300);
    NinjaBlock.deviceID=HUMIDITY_DHT_DEVICE_ID;
    NinjaBlock.send(h);
    delay(300);
  }
}

void measureTemp() {
  uint8_t i;
  float average;

  // take N samples in a row, with a slight delay
  for (i=0; i< NUMSAMPLES; i++) {
    samples[i] = analogRead(THERMISTORPIN);
    delay(10);
  }

  // average all the samples out
  average = 0;
  for (i=0; i< NUMSAMPLES; i++) {
    average += samples[i];
  }
  average /= NUMSAMPLES;

  // convert the value to resistance
  average = 1023 / average - 1;
#if ENABLE_SERIAL
  Serial.print("Average analog reading "); 
  Serial.println(average);
#endif
  average = SERIESRESISTOR / average;
#if ENABLE_SERIAL
  Serial.print("Thermistor resistance "); 
  Serial.println(average);
#endif

  float steinhart;
  steinhart = average / THERMISTORNOMINAL;     // (R/Ro)
  steinhart = log(steinhart);                  // ln(R/Ro)
  steinhart /= BCOEFFICIENT;                   // 1/B * ln(R/Ro)
  steinhart += 1.0 / (TEMPERATURENOMINAL + 273.15); // + (1/To)
  steinhart = 1.0 / steinhart;                 // Invert
  steinhart -= 273.15;                         // convert to C

#if ENABLE_SERIAL
  Serial.print("Temperature "); 
  Serial.print(steinhart);
  Serial.println(" *C");
#endif

  // send the temp value to the server
  NinjaBlock.deviceID=TEMP_DEVICE_ID;
//  NinjaBlock.send(steinhart);
  NinjaBlock.send(dtostrf(steinhart,1,1,tmp));
  delay(500);
}

