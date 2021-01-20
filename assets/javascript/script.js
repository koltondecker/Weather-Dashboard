$(document).ready(function() {
//Javascript code in here.    
    
    var apiKey = "c67bcac9baf63e1d77cd3d4a1d20a93c";
    var forecastApiKey = "c6a936905a8566bfdc4cca37ff190c24";
    var ipAddressApiKey = "1e2553f4aa45ffd9c936850e77e4a3e8";
    var recentCitiesArray = [];
    var recentSearchesAmount = 10;

    updateListofCities();

    var $rightSideCol = $("#right-side-col");
    $(document).on({
        ajaxStart: function() { $rightSideCol.addClass("loading"); },
        ajaxStop: function() { $rightSideCol.removeClass("loading"); }
    });

    $("#locationBtn").on("click", function(e) {
        e.preventDefault();
        navigator.geolocation.getCurrentPosition((position) => {
            $.ajax({
                url: "https://geolocation-db.com/jsonp",
                jsonpCallback: "callback",
                dataType: "jsonp",
                success: function(location) {
                    console.log(location);
                    if(location.city!==null) {
                        currentWeatherAPI(location.city);
                    }
                    else {
                        $.ajax({
                            url: "http://api.ipstack.com/" + location.IPv4 + "?access_key=" + ipAddressApiKey,
                            method: "Get"
                        }).then(function(location) {
                            currentWeatherAPI(location.city);
                        });
                    }
                },
            })
        });
    });

    $(document).on("click", ".uv-value", function() {
        jQuery.noConflict(); 
        $("#myModal").modal("show");
    });
    
    if(recentCitiesArray.length > 0) {
        currentWeatherAPI(recentCitiesArray[0]);
    }

    $("#searchBtn").on("click", function(e) {
        e.preventDefault();
        newCity = $("#search-city").val().trim();

        currentWeatherAPI(newCity);
    });

    $(document).on('click', '.list-group-item', function(e) {
        console.log(this.textContent);
        var city = this.textContent;

        currentWeatherAPI(city);
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
        return recentCitiesArray;
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

            updateListofCities(officialName);
            uvIndexAPI(cityNameAndDate, weatherImage, temperature, humidity, windSpeed, lat, long);
            fiveDayForecastAPI(officialName);
        });
    }

    function uvIndexAPI(cityNameAndDate, weatherImage, temperature, humidity, windSpeed, lat, long) {

        var queryUrl = "https://api.openweathermap.org/data/2.5/uvi?lat=" + lat + "&lon=" + long + "&appid=" + apiKey;

        $.ajax({
            url: queryUrl,
            method: "Get"
        }).then(function(response) {
            console.log(response);
            var indexValue = 7;
            var uvIndexPTag = $("<p>");
            uvIndexPTag.text("UV Index: ");
            uvIndexPTag.addClass("uv-ptag");
            var uvIndexValue = $("<p>");
            uvIndexValue.text(response.value);
            uvIndexValue.addClass("uv-value");

            uvIndexPTag.append(uvIndexValue);

            if(response.value < 3) {
                uvIndexValue.addClass("low-uv");
            }
            else if(response.value >= 3 && response.value < 6) {
                uvIndexValue.addClass("medium-uv");
            }
            else if(response.value >= 6 && response.value < 8) {
                uvIndexValue.addClass("high-uv");
            }
            else {
                uvIndexValue.addClass("very-high-uv");
            }


            $("#city-current-info").append(cityNameAndDate, weatherImage, temperature, humidity, windSpeed, uvIndexPTag);
        });
    }


    function fiveDayForecastAPI(newCity) {
        var queryUrl = "https://api.openweathermap.org/data/2.5/forecast?q=" + newCity + "&appid=" + forecastApiKey + "&units=imperial";

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

            for(i = 0; i < response.list.length; i++) {
                if(response.list[i].dt_txt.indexOf("15:00:00")>=0) {
                    var newCardDiv = $("<div>").addClass("card");
                    var cardBodyDiv = $("<div>").addClass("card-body");
                    var cardTitle = $("<h3>").addClass("card-title");
                    cardTitle.text(new Date(response.list[i].dt * 1000).toLocaleDateString("en-US"))
                    var weatherImageID = response.list[i].weather[0].icon;
                    var weatherImageUrl = "https://openweathermap.org/img/w/" + weatherImageID + ".png";
                    var weatherIcon = $("<img>").attr("src", weatherImageUrl);
                    var temperature = $("<p>").addClass("card-text");
                    temperature.text("Temp: " + response.list[i].main.temp + " ºF");
                    var humidity = $("<p>").addClass("card-text");
                    humidity.text("Humidity: " + response.list[i].main.humidity + "%");

                    cardBodyDiv.append(cardTitle, weatherIcon, temperature, humidity);
                    newCardDiv.append(cardBodyDiv);
                    $("#city-5-day-forecast").append(newCardDiv);
                }
            }
        });
    }

});