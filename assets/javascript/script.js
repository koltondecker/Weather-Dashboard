$(document).ready(function() {
//Javascript code in here.

    var apiKey = "c67bcac9baf63e1d77cd3d4a1d20a93c";
    var recentCitiesArray = [];
    var newCity;
    var recentSearchesAmount = 10;

    updateListofCities();

    $("#searchBtn").on("click", function(e) {
        e.preventDefault();
        newCity = $("#search-city").val().trim();

        updateListofCities(newCity);
        weatherAPI(newCity);
    });


    function updateListofCities(newCity) {

        //Clear list of recent cities each time so we aren't stacking content
        $("#recent-cities-list").empty();

        //Parse local storage for recent cities list array.
        var recentCities = JSON.parse(localStorage.getItem("recentCitiesArray"));

        //Save local storage to our recentCitiesArray if it isn't empty.
        if(recentCities !== null) {
            recentCitiesArray = recentCities;
        }

        //Check if city already exists in array, slice it out if it does, then prepend newCity value to the front of our array.
        if(newCity !== undefined) {
            var index = recentCitiesArray.indexOf(newCity);

            if (index >= 0) {
                recentCitiesArray.splice(index, 1);
            }
            
            recentCitiesArray.unshift(newCity);
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

    }

    function weatherAPI(newCity) {
        $("#city-current-info").empty();
        $("#city-5-day-forecast").empty();

        var queryUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + newCity + "&units=imperial&&appid=" + apiKey;

        $.ajax({
            url: queryUrl,
            method: "Get"
        }).then(function(response) {
            console.log(response);

            var cityName = $("<h3>");
            cityName.text(response.name);
            var temperature = $("<p>");
            temperature.text("Temperature: " + response.main.temp + " ºF");
            var humidity = $("<p>");
            humidity.text("Humidity: " + response.main.humidity + "%");
            var windSpeed = $("<p>");
            windSpeed.text("Wind Speed: " + response.wind.speed + " MPH");
            
            $("#city-current-info").append(cityName, temperature, humidity, windSpeed);

        })

    }









});