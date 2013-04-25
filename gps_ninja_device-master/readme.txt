The code is here https://github.com/chrisn-au/gps_ninja_device.

The steps are here https://github.com/chrisn-au/gps_ninja_device and also here http://forums.ninjablocks.com/index.php?p=/discussion/comment/2820#Comment_2820 below is a combination of the 2 because some comments are clearer for me in one place, others in the other.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
Objective
Control A LimitlessLED RGB light via a Ninja block using location data
Proof of technology
Using an iphone running Google latitude, extract data using google latitude API, determine distance to a fixed location (home), change colour of light depending on distance from home via the Ninja API

Why
because I thought it would be cool, Why Ninja - the Abstraction from device implementation
means this could control Nina's eyes, turn on/off lights, brew a coffee with little or no code
change

Technology

Aging iphone 4s running google latitude 
a Node.js app accessing the latitude
A couple of node.js scripts (running on Windows 7)
Ninja block API
Ninja block dashboard
Nina's lovely eyes or a LimitlessLED light

This document assumes you have a Ninja device configured of type 1000 (RGB) light. You will need to get the URL for this device from the dashboard under info.

High level steps

Configure google app with access to latitude
Authorize the gps_ninja app to access google latitude
Update gps_lighting app to talk to your ninja block and tailor to your env

Process

1) Create or update an application for google
https://code.google.com/apis/console/
Create the application
Select google latitude under services
Configure api access
Make sure it is Installed Application and other (application type)

Client ID for installed applications
Client ID:	myclientid.apps.googleusercontent.com
Client secret:	ljxxxxxxxxxxxxxxxxxxx
You will need to keep Client ID == client_id , and Client Secret == client_secret

2. Get the two scripts GPS scripts and Geolib https://github.com/manuelbieh/geolib
Install the geolib library "npm install geolib"
A great node.js library for distances between co-ordinates(thanks manuel)

3. Configure and run authenticate script ( or not)
gps_ninja_authenticate.js
This script (developed as a part of my learning) is an to attempt to simplify doing the upfront OAuth2 authentication with the google API. At a minimum it should give a guide on how to use the google oauth2 APIs.

Read https://developers.google.com/accounts/docs/OAuth2InstalledApp for further info.

Retrieve the client_id and client_secret from the google app registration and update in the script.

Run the script "node gps_ninja_authenticate.js" and assuming the deities are shining on you you will receive the refresh_token and which along with client_id and client_secret and update the gps_ninja.js script.

3. Update the gps_ninja.js script 
refresh_token, client_id, client_secret.

(on github it says: Edit gpslatiude.js and update refresh_token; client_id;client_secret)

You will need also to update your latitude and longitude of your fixed point, ninja device URL, ninja access token.

The gps_ninja.js script simply calls the latitude API every 30 secs and retrieves the best current location. If the location has changed since the last call it updates the ninja device with a colour based on distance from the point. Adjust these setting to suit your setup. Given my experience at home the iPhone moving around the house can change my location by up to 30 meters. That is why I have my home colour blue configured at 50. Have a play

4. Restart the NinjaClient and watch console for messages). All working you will have a new Temperature device on your dashboard with updates on distance from the point.

All going well when you run the script it will all work. It will log to the console any time that the location changes and the distance from your fixed point.

(I think the reason it says Temperature on github comments is because of this added comment on the forum: Changed the standalone script to be a device of type temperature (device ID 9). Device simply passes back the distance to the fixed point to the temperature object. Then you can use the rules engine to drive the lights or coffee pots etc.)

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

My codes are not saved in this repo since they are private (*see info for GPS app.txt).

 

