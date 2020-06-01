# Config

The configuration is stored in `config.json` in the root of the repo.

## `night`

* **enabled**: `true|false`
* **timeStart**: _The time to start, in 24hour time - e.g. `"21:00"`_
* **timeEnd**: _The time to end, in 24hour time - e.g. `"05:00"`_

## `traffic`

An array of the following:

* **active**:
	* **days**: _Days, e.g. `"mon,tue,wed,thu,fri,sat,sun"`_
	* **timeStart**: _The time to start, in 24hour time - e.g. `"01:00"`_
	* **timeEnd**: _The time to end, in 24hour time - e.g. `"03:00"`_
* **route**:
	* **start**:
		* **name**: _Name to display on the UI_
		* **coords**: _Coordinates as "lat, lon" - e.g. `"51.50642, -0.12721"`_

## `weather`

An array of the following:

For the OpenWeatherMap ID, find the desired location. The ID is in the URL at `https://openweathermap.org/city/<id>`

* **active**:
	* **days**: _Days, e.g. `"mon,tue,wed,thu,fri,sat,sun"`_
	* **timeStart**: _The time to start, in 24hour time - e.g. `"05:00"`_
	* **timeEnd**: _The time to end, in 24hour time - e.g. `"10:00"`_
* **primary**:
	* **name**: _Name to display on the UI_
	* **id**: _OpenWeatherMap location ID - e.g. `5128581`_

## `alerts`

* **active**:
	* **days**: _Days, e.g. `"mon,tue,wed,thu,fri,sat,sun"`_
	* **timeStart**: _The time to start, in 24hour time - e.g. `"17:00"`_
	* **timeEnd**: _The time to end, in 24hour time - e.g. `"23:00"`_
* **type**: _Either `"standard"` or `"alternating_week"`_
* **content**: If `type` is `standard`
	* **color**: _HTML/CSS color code to use to display. e.g. `"red"`_
	* **text**: _Text to display in UI_
* **week**: If `type` is `alternating_week`
	* **even**: Item to display on even weeks
		* **color**: _HTML/CSS color code to use to display. e.g. `"red"`_
		* **text**: _Text to display in UI_
	* **odd**: Item to display on odd weeks
		* **color**: _HTML/CSS color code to use to display. e.g. `"red"`_
		* **text**: _Text to display in UI_
