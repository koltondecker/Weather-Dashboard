$(document).ready(function() {
//Javascript code in here.

    var apiKey = "c67bcac9baf63e1d77cd3d4a1d20a93c";
    var recentCitiesArray = [];
    var recentSearchesAmount = 10;

    updateListofCities();

    $("#searchBtn").on("click", function(e) {
        e.preventDefault();
        newCity = $("#search-city").val().trim();

        updateListofCities(newCity);
        //fiveDayForecastAPI(newCity);
    });

    $(document).on('click', '.list-group-item', function(e) {
        console.log(this.textContent);
        var city = this.textContent;

        updateListofCities(city);
    });

    function updateListofCities(officialName) {

        //Clear list of recent cities each time so we aren't stacking content
        $("#recent-cities-list").empty();

        //Parse local storage for recent cities list array.
        var recentCities = JSON.parse(localStorage.getItem("recentCitiesArray"));

        //Save local storage to our recentCitiesArray if it isn't empty.
        if(recentCities !== null) {
            recentCitiesArray = recentCities;
        }

        //Check if city already exists in array, slice it out if it does, then prepend officialName value to the front of our array.
        if(officialName !== undefined) {
            var index = recentCitiesArray.indexOf(officialName);

            if (index >= 0) {
                recentCitiesArray.splice(index, 1);
            }
            
            recentCitiesArray.unshift(officialName);
        }
        
        //Slices off the last element in the array if the array exceeds a length of 10;
        if(recentCitiesArray.length > recentSearchesAmount) {
            recentCitiesArray.pop();
        }

        //For loop the length of the array to create <li> items and append those to #recent-cities-list div
        for(i = 0; i < recentCitiesArray.length; i++) {
            var newLi = $("<li></li>");

            newLi.addClass("list-group-item");
            newLi.text(recentCitiesArray[i]);

            $("#recent-cities-list").append(newLi);
        }

        localStorage.setItem("recentCitiesArray", JSON.stringify(recentCitiesArray));

        if(recentCitiesArray.length > 0) {
            currentWeatherAPI(recentCitiesArray[0]);
        }
    }

    function currentWeatherAPI(newCity) {
        $("#city-current-info").empty();
        $("#city-5-day-forecast").empty();

        var queryUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + newCity + "&units=imperial&&appid=" + apiKey;

        $.ajax({
            url: queryUrl,
            method: "Get"
        }).then(function(response) {
            console.log(response);

            var weatherImageID = response.weather[0].icon;
            var weatherImageURL = "https://openweathermap.org/img/w/" + weatherImageID + ".png";

            var cityNameAndDate = $("<h3>");
            cityNameAndDate.addClass("city-name-and-date");
            var cityName = response.name;
            //Takes unix timestamp from api and gets the date string out of it.
            var currentDate = "(" + new Date(response.dt * 1000).toLocaleDateString("en-US") + ")";
            cityNameAndDate.text(cityName + currentDate);
            var weatherImage = $("<img>");
            weatherImage.attr("src", weatherImageURL);
            var temperature = $("<p>");
            temperature.text("Temperature: " + response.main.temp + " ºF");
            var humidity = $("<p>");
            humidity.text("Humidity: " + response.main.humidity + "%");
            var windSpeed = $("<p>");
            windSpeed.text("Wind Speed: " + response.wind.speed + " MPH");
            
            var lat = response.coord.lat;
            var long = response.coord.lon;

            var officialName = response.name;

            //updateListofCities(officialName);
            uvIndexAPI(cityNameAndDate, weatherImage, temperature, humidity, windSpeed, lat, long);
        });
    }

    function uvIndexAPI(cityNameAndDate, weatherImage, temperature, humidity, windSpeed, lat, long) {

        var queryUrl = "https://api.openweathermap.org/data/2.5/uvi?lat=" + lat + "&lon=" + long + "&appid=" + apiKey;

        $.ajax({
            url: queryUrl,
            method: "Get"
        }).then(function(response) {
            console.log(response);

            var uvIndex = $("<p>");
            uvIndex.text("UV Index: " + response.value);


            $("#city-current-info").append(cityNameAndDate, weatherImage, temperature, humidity, windSpeed, uvIndex);
        });
    }


    function fiveDayForecastAPI(newCity) {
        var forecastCount = 5;
        var queryUrl = "https://api.openweathermap.org/data/2.5/forecast/daily?q=" + newCity + "&cnt=" + forecastCount + "&units=imperial&appid=" + apiKey;

        $.ajax({
            url: queryUrl,
            method: "Get"
        }).then(function(response) {
            console.log(response);
            var fiveDayHeader = $("<h3>");
            fiveDayHeader.addClass("fiveDayHeader");
            fiveDayHeader.text("5-Day Forecast: ");

            console.log(response.list[0].main.temp);


            $("#city-5-day-forecast").append(fiveDayHeader);
        });
    }

});