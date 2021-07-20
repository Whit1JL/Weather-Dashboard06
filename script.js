$(document).ready(function () {


    //Global Variables
    var api = "b26f77a0f941976c50cef7bdb9d7f15d"
    var CityList = [];
    var cityName;
    //Inital function to display users city input 
    function renderCity() {
        $("#cityList").empty();
        $("#citySearch").val("");
        for (i = 0; i < CityList.length; i++) {
            var c = $("<a>");
            c.addClass("list-group");
            c.attr("data-name", CityList[i]);
            c.text("#cityList").prepend(c);
        }
    }
    //onclick on the search icon button 
    $("#citySearchBtn").on("click", function (event) {
        event.preventDefault();
        $("#forecast").empty()
        cityName = $("#citySearch").val()
        CityList.push(cityName);
        saveLocalCity();
        storeArrayOfCity();
        renderCity();
        displayWeather();
        displayForecast(cityName);
    });
    //LOCAL STORAGE
    //pulls the array list from local storage 
    function startCityList() {
        var savedCities = JSON.parse(localStorage.getItem("cities"));
        renderCity();
    }
    //save user's city into local storage
    function saveLocalCity() {
        localStorage.setItem("currentCity", JSON.stringify(cityName));
    }
    //save city array into local storage
    function storeArrayOfCity() {
        localStorage.setItem("currentCity", JSON.stringify(CityList));
    }
    //WEATHER
    //pulls the current city so the weather will load on page refresh
    function startWeather() {
        var storedWeather = JSON.parse(localStorage.getItem("currentCity"));
        displayWeather();
        displayForecast();
    }
    //ajax call to retrieve data from OpenWeather
    function displayWeather() {
        var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&units=imperial" + "&appid=" + api;
        var response = $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function (response) {
            console.log(response);
            //displaying date (THIS DOES NOT WORK)
         //    var currentDay = moment().format("MMMM Do, YYYY");
         //    $("#weatherContainer").text("Today's Date: " + currentDay);
            //displaying Temperature information
            var getTemp = response.main.temp.toFixed(0);
            var TempEl = $("<p>").text("Temperature:  " + getTemp + "° F");
            //displaying Humidity information
            var getHumidity = response.main.humidity;
            var humidityEL = $("<p>").text("Humidity:  " + getHumidity + "%");
            //displaying windspeed information
            var getWindSpeed = response.wind.speed.toFixed(0);
            var WindSpeedEl = $("<p>").text("Wind Speed:  " + getWindSpeed + " mph");
            //appending weather container information to the page
            $("#weatherContainer").append('<h3>' + cityName);
            // $("#weatherContainer").text("Today's Date: " + currentDay);
            $("#weatherContainer").append(TempEl);
            $("#weatherContainer").append(humidityEL);
            $("#weatherContainer").append(WindSpeedEl);
            //displaying uv index information
            queryURL = "http://api.openweathermap.org/data/2.5/uvi?lat=" + response.coord.lat + "&lon=" + response.coord.lon + "&appid=" + api
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
    //display linearly the 5 day forecast in forecast container
    function displayForecast(cityName) {
        
        var queryURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + cityName + "&units=imperial&appid=" + api;
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
                var tempDisplay = $("<p>").addClass("card-text").text("Temperature:  " + days[i].main.temp + "° F");
                var humidDisplay = $("<p>").addClass("card-text").text("Humidity:  " + days[i].main.humidity + "%");
                //appending card and information to page
                col.append(card.append(cardBody.append(dateDisplay, tempDisplay, humidDisplay)));
                $("#forecast").append(col)
                var forecastHeader = $("<h4 class='card-header'>").text("5 Day Forecast");
            }
        })
    }
})