// Variables

console.log("hi");

// // dashboard must have form inputs
// var cities = document.getElementById("cities");
// var search = document.getElementById("search");

// var listOfCities = [];
// var cityName;

// var searchHistory = localStorage.getItem("searchResults");
// cities.textContent = searchHistory;

// // variable to store API key
// var myAPIKey = "2ecfe4c2a11397b2d45e53c232c2e00e"; 

// // get coordinates and make another API call

// create function for getCity
// function getCity(event) {

//     event.preventDefault();

//     // create variable of city we're searching 
//     var citySearch = cities.value;
//     console.log(citySearch);

//     // consult api about city's weather 
//     getCoordinates(citySearch); 
//     // pass city name into it. parameter with city 

// }

// // city parameter tells function you're going to get data passed through
// function getCoordinates(city) {
// console.log(city);

//     fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=5&appid=${myAPIKey}`)
//         .then(function (response){
//             return response.json();
//         })
//         .then(function (data) {
//             getWeather(data);
//         });
// };

// function getWeather(coordinates) {
//     console.log(coordinates);

    // save lat and long as variables 
    // use fetch
    // plug the variables with ${}
// });

// local storage

// used coordinates to pass onto another function that makes a fetch call 


function renderCity() {
    $("#cityList").empty();
    $("#citySearch").val("");
    for (i = 0; i < listOfCities.length; i++) {
        var c = $("<a>");
        c.addClass("list-group");
        c.attr("data-name", listOfCities[i]);
        c.text("#cityList").prepend(c);
    }
}

// get city value when button is pressed
$("#city-search").on("click", function(event) {
    event.preventDefault();
    $("#forecast").empty();
    cityName = $("#city-search").val();
    listOfCities.push(cityName);
    saveLocalCity();
    storeArrayCity();
    renderCity();
    displayWeather();
    forecastDisplay(cityName);
});

// Local Storage 
// loops cities from array 
function startListOfCities() {
    var citiesSaved = JSON.parse(localStorage.getItem("cities"));
    renderCity();
    console.log(citiesSaved);
}

function saveLocalCity() {
    localStorage.setItem("cityCurrent", JSON.stringify(cityName));
}

function storeArrayCity() {
    localStorage.setItem("cityCurrent", JSON.stringify(listOfCities));
}

// Weather Display
function weatherStart() {
    var storedWeather = JSON.parse(localStorage.getItem("cityCurrent"));
    displayWeather();
    displayForecast();
    console.log(storedWeather);
}

 //ajax call to retrieve data from OpenWeather
 function displayWeather() {
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&units=imperial" + "&appid=" + myAPIKey;
    var response = $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {
        console.log(response);


        //displaying Temperature information
        var getTemperature = response.main.temp.toFixed(0);
        var tempEl = $("<p>").text("Temperature:  " + getTemperature + "° F");
        //displaying Humidity information
        var getHumidity = response.main.humidity;
        var humidityEL = $("<p>").text("Humidity:  " + getHumidity + "%");
        //displaying windspeed information
        var getWindSpeed = response.wind.speed.toFixed(0);
        var windSpeedEl = $("<p>").text("Wind Speed:  " + getWindSpeed + " mph");
        //appending weather container information to the page
        $("#weatherContainer").append('<h3>' + cityName);
        // $("#weatherContainer").text("Today's Date: " + currentDay);
        $("#weatherContainer").append(tempEl);
        $("#weatherContainer").append(humidityEL);
        $("#weatherContainer").append(windSpeedEl);
        //displaying uv index information
        queryURL = "http://api.openweathermap.org/data/2.5/uvi?lat=" + response.coord.lat + "&lon=" + response.coord.lon + "&appid=" + myAPIKey
        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function (uvIndexResponse) {
            var uvIndexEl = $("<p>").text("UV Index:  " + uvIndexResponse.value);
            
            //displaying image information
            var codeIcon = response.weather[0].icon
            var urlIcon = "http://openweathermap.org/img/w/" + codeIcon + ".png";
            var img = $("<img>").attr("src", urlIcon)
            $("#weatherContainer").append(uvIndexEl, img);
        });
    });
}

// when looking for city, can see current and future conditions
// loop list of populated cities
// city is added to search history
// view current weather conditions
// 5 day forecast with city name, the date, wind speed, icon representation of weather conditions,temperature,UV index, humidity,
function displayForecast(cityName) {
           
    var queryURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + cityName + "&units=imperial&appid=" + myAPIKey;
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (forecastResponse) {
        var days = forecastResponse.list
        for (let i = 0; i < 5; i++) {
            //create card 
            var col = $("<div>").addClass("col-md-2");
            var card = $("<div>").addClass("card");
            var cardBody = $("<div>").addClass("card-body");
            var dateDisplay = $("<h5>").addClass("card-title").text(days[i].dt_txt);
            var temperatureDisplay = $("<p>").addClass("card-text").text("Temperature:  " + days[i].main.temp + "° F");
            var humidityDisplay = $("<p>").addClass("card-text").text("Humidity:  " + days[i].main.humidity + "%");
            //appending card and information to page
            col.append(card.append(cardBody.append(dateDisplay, tempDisplay, humidDisplay)));
            $("#forecast").append(col)
            var forecastHeader = $("<h4 class='card-header'>").text("5 Day Forecast");
        }
    })
}

// view future weather conditions for that city
// when click on city in search history, presented with current and future conditions