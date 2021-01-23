# 06 Server-Side APIs: Weather Dashboard

Everyone has to deal with weather and everyone needs to know what the weather is, maybe in multiple parts of the world at once. With my weather dashboard application, you can view current weather information and a 5 day forecast for any city you search for (This is limited to the most popular result for that searched city. Plans are to implement more targeted searches in the future to ensure you can differentiate duplicate city names.) This is all done with the power of APIs. Geolocation-DB API and IPStack API are both used for getting current location from the user. OpenWeatherMap API's are used to get the current weather, uv index, and 5 day forecast for the searched city. Information is dynamically created and appended to page. 

Users don't want to have to search for their commonly searched for cities each time they open their weather dashboard either so I have created a 10 most recently searched list on the left side. The weather dashboard also displays the last searched for city on application open. All recent cities are saved in local storage. 

*****Insert Pictures here with display of functionality*****


## User Story

```
AS A traveler
I WANT to see the weather outlook for multiple cities
SO THAT I can plan a trip accordingly
```

## Acceptance Criteria

```
GIVEN a weather dashboard with form inputs
WHEN I search for a city
THEN I am presented with current and future conditions for that city and that city is added to the search history
WHEN I view current weather conditions for that city
THEN I am presented with the city name, the date, an icon representation of weather conditions, the temperature, the humidity, the wind speed, and the UV index
WHEN I view the UV index
THEN I am presented with a color that indicates whether the conditions are favorable, moderate, or severe
WHEN I view future weather conditions for that city
THEN I am presented with a 5-day forecast that displays the date, an icon representation of weather conditions, the temperature, and the humidity
WHEN I click on a city in the search history
THEN I am again presented with current and future conditions for that city
WHEN I open the weather dashboard
THEN I am presented with the last searched city forecast
```

The following image demonstrates the application functionality:

![weather dashboard demo](./Assets/06-server-side-apis-homework-demo.png)

## Review

You are required to submit the following for review:

* The URL of the deployed application.

* The URL of the GitHub repository. Give the repository a unique name and include a README describing the project.

- - -
