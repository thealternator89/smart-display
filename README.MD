# smart-display

A basic web-based smart display for use with a tablet with a web browser in kiosk mode.

The server runs on Nodejs to serve the client, and provide the needed APIs.

The client is written in raw javascript (transpiled from typescript) with minimal dependencies for compatibility with lower-end tablets.

# Features

* **Weather**: 1 primary and _unlimited_ additional locations
* **Traffic**: < 5 routes at a time. Map displayed on press
* **Reminders**: < 4 reminders at a time

## Weather

Uses OpenWeatherMap to display weather for various locations.

Primary location shows:
* Weather condition (text, icon and display background)
* Temperatures: current, min and max

Additional locations show:
* Weather condition (icon)
* Temperatures: current, min and max

## Traffic

Uses MapBox to find the fastest route for up to 5 destinations at a time.

If MapBox returns congestion data, the traffic tiles will be shown with colours based on the average level of congestion:
* **Semi-transparent dark**: Unknown
* **Black/Red gradient**: Severe congestion
* **Red**: Heavy congestion
* **Orange**: Moderate congestion
* **Green**: Low congestion

Touching on a traffic route panel will cause a dialog to appear which will show the route that MapBox has determined is the fastest.

## Reminders

Reminders can be displayed at specified times (up to 4 at a time) to help remind users of things in a timely manner.

You can, for example, display a weekly reminder on rubbish day to ensure you remember to put the bins out.
Reminders can be set up to display differently on alternating weeks, e.g. to remind which bins to put out on any specific week.

## Night Mode

A time can be scheduled to go into Night Mode.

During Night Mode, the following happens:

* The background is set to black
* The time is moved to the middle of the screen and set to a dimmer colour
* Weather, traffic and reminders are hidden
* APIs for weather and traffic are not called
