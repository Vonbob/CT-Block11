var intervalID = 0;
var interval = 10000 //default 10 seconds
var tempUnits = "c"; //default Celsius 

var main = function () {
    addDOMEventListeners();
    if ("geolocation" in navigator) {
        getWeather();
        intervalID = setInterval(getWeather, interval);
    }
    else {
        $(".error-container > p").text("We apologize but your browser doesn't support geolocation.");
        $(".error-container").slideDown(400);
    }
}

var getWeather = function () {
    navigator.geolocation.getCurrentPosition(function (position) {
        loadWeather(position.coords.latitude + "," + position.coords.longitude, tempUnits);
    });
}

var loadWeather = function (location, units) {
    $.simpleWeather({
        location: location,
        woeid: "",
        unit: units,
        success: function (weather) {
            $(".location").text(weather.city + ", " + weather.region);
            $(".temperature").html(weather.temp + "&#176;" + weather.units.temp);
            $(".climate").html("<img src='images/" + weather.code + ".svg' alt='weather icon' />");  
            $(".humidity").text(weather.humidity + "%");
            $(".windspeed").text(weather.wind.speed + " " + weather.units.speed);
            var d = new Date();
            $(".check-time").text("Last check: " + d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds());
        },

        error: function (err) {
            var d = new Date();
            $(".error-container > p").text(d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds() + " - " + err);
            $(".error-container").slideDown(400);
        }
    });
};

/* error panel */
var closeError = function () {
    $(".error-container").slideUp(400);
};

/* options panel */
var showOptions = function () {
    $(".options-container").slideToggle(400);
};


/* changing options for weather information */
var changeInterval = function (event) {
    if (!event.target.value) {
        return;
    }

    interval = event.target.value * 1000;
    clearInterval(intervalID);
    intervalID = setInterval(getWeather, interval);
};


var changeUnits = function (event) {
    if (!event.target.value) {
        return;
    }

    tempUnits = event.target.value;
    clearInterval(intervalID);
    getWeather();
    intervalID = setInterval(getWeather, interval);
};

var addDOMEventListeners = function () {
    $(".close-error").click(closeError);
    $(".options-icon").click(showOptions);

    $(".interval-set").click(changeInterval);
    $(".units-set").click(changeUnits);
}


$(document).ready(main);