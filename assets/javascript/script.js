$(document).ready(function() {
//Javascript code in here.

var apiKey = "c67bcac9baf63e1d77cd3d4a1d20a93c";


$("#searchBtn").on("click", function(e) {
    e.preventDefault();
    var newCity = $("#search-city").val().trim();
    console.log(newCity);

    //addCityToList(newCity);
    weatherAPI(newCity);
});


function addCityToList(newCity) {
    //! When adding recently searched cities to list on left of page, MAKE SURE to give each list item (li) a class of "list-group-item"!!!


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