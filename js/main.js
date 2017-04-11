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

/*option panel - for changing temperature units and interval */
var options = {
    restart: function () {
        clearInterval(intervalID);
        intervalID = setInterval(getWeather, interval);
    },
    tenSeconds: function() {
        interval = 10000;
        this.restart();
    },
    oneMinute: function () {
        interval = 60000;
        this.restart();
    },
    fiveMinutes: function () {
        interval = 300000;
        this.restart();
    },
    cel: function () {
        tempUnits = "c";
        this.restart();
    },
    far: function () {
        tempUnits = "f";
        this.restart();
    }
};

/* error panel */
var closeError = function () {
    $(".error-container").slideUp(400);
}

/* options panel */
var showOptions = function () {
    $(".options-container").slideToggle(400);
}

/* changing options for weather information */
var changeOptions = function (event) {
    if (!event.target.id) {
        return;
    }

    options[event.target.id]();
}

var addDOMEventListeners = function () {
    $(".close-error").click(closeError);
    $(".options-icon").click(showOptions);
    $(".options-container").click(changeOptions);
}


$(document).ready(main);