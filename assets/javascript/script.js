$(document).ready(function() {
//Javascript code in here.

var apiKey = "c67bcac9baf63e1d77cd3d4a1d20a93c";
var recentCitiesArray = [];


$("#searchBtn").on("click", function(e) {
    e.preventDefault();
    var newCity = $("#search-city").val().trim();

    addCityToList(newCity);
    weatherAPI(newCity);
});


function addCityToList(newCity) {
    //! When adding recently searched cities to list on left of page, MAKE SURE to give each list item (li) a class of "list-group-item"!!!
    //Parse local storage for recent cities list array
    //save that to our recentCitiesArray
    //Prepend newCity value to the front of our array and slice off last value if array exceeds length of 10
    //Use a for loop the length of the array to create <li> items and append those to #recent-cities-list div
    $("#recent-cities-list").empty();

    var recentCities = JSON.parse(localStorage.getItem("recentCitiesArray"));

    if(recentCities !== null) {
        recentCitiesArray = recentCities;
    }

    var index = recentCitiesArray.indexOf(newCity);

    if (index >= 0) {
        recentCitiesArray.splice(index, 1);
    }
    
    recentCitiesArray.unshift(newCity);


    if(recentCitiesArray.length > 10) {
        recentCitiesArray.pop();
    }

    for(i = 0; i < recentCitiesArray.length; i++) {
        var newLi = $("<li></li>");
        newLi.addClass("list-group-item");
        newLi.text(recentCitiesArray[i]);
        console.log(newLi);

        $("#recent-cities-list").append(newLi);
    }

    localStorage.setItem("recentCitiesArray", JSON.stringify(recentCitiesArray));

}

function weatherAPI(newCity) {

    var queryUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + newCity + "&appid=" + apiKey;

    $.ajax({
        url: queryUrl,
        method: "Get"
    }).then(function(response) {
        console.log(response);
    })

}










});