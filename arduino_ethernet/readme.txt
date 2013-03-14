This is a small project I put together to see how an Arduino with Ethernet shield works as a NinjaBlock. Started with the code from the NinjaBlocks website and made some changes:
- removed the push button device
- left the LED device in place but I am not doing anything with it yet
- added a generic temperature sensor using a thermistor (analog reading on pin A0)
- added a DHT temperature device (using DHT11 on pin 2)
- added a DHT humidity device (using DHT11 on pin 2)
- added a stepper motor actuator.

The temperature and humidity are read and sent once about every minute (using a TimedAction for this). The values coming from the DHT sensor library are both float but in fact I've never seen anything but .00 as the decimal value so using NinjaBlock.send(int) function is OK. On the other hand, the temperature calculated using the thermistor has decimal digits so instead I am using the NinjaBlock.send(* chr) function passing a string with one decimal place. Not a big deal but I really wanted to see if sending a char string to a dashboard widget expecting numbers works and indeed it works great.

Note: I noticed that sometimes the command for the stepper motor (sent via curl on command line) doesn't register in the code for some reason. It would be nice to figure out why but even if not working perfectly, I don't plan to use the stepper for anything critical so a few commands can be lost now and then.

I will add more devices in the code as long as I still have enough memory and free pins on the Arduino. At this time, most of the digital pins are used but I still have the analog ones available. Also, the size of the program is about 23k, still have room for a few kb.