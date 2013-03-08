This project creates a NinjaBlocks stepper motor actuator that runs on a Raspberry Pi and calls a Python module: stepper.py. It passes 2 params to the Python module:
- delay in milliseconds - the delay between steps - in practice I notice that 2 is the smallest value, I normally use 5
- number of steps - the number of steps to be executed - if the value is negative, the motor will rotate backwards

stepper.py is based on Adafruit's tutorial for Raspberry Pi in the adafruit learning system, here: http://learn.adafruit.com/adafruits-raspberry-pi-lesson-10-stepper-motors/software

Note: you can clone the repository project and then copy stepper.py in the ninjaBlocks directory or you can edit the stepper-module/lib/device.js and change the path to stepper.py to work with your directory structure (on my Ras Pi this is: ~/ninjaBlocks/ninja-modules/stepper-module).
