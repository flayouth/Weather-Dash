//Look Data
var lookCity = $('#look-city');
var lookCityBtn = $('#look-city-btn');
var lookHistoryList = $('#look-history');
var removeHistoryBtn = $('#remove-history-btn');

//Weather Now
var nowWeatherContent = $('#now-weather-content');
var nowCity = $('#now-city');
var nowTemp = $('#now-temp');
var nowHumidity = $('#now-humidity');
var nowWindSpeed = $('#now-wind-speed');
var nowWeatherIcon = $('#icon')
var uvIndex = $('#uv-index');

var fiveDayForecast = $('#five-day-forecast');

// My API Key
var myAPI = "c15a1b87fa8e1cdb0179096355dade55";

//city list array for look up history
var cityList = [];

//Document 
$(document).ready(function () {

    // Find date and display
var nowDate = moment().format('L');
$("#now-date").text("(" + nowDate + ")");

//check if look history exists when page loads
getHistory();


function nowWeather(city) {
    var url = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + myAPI + "&units=imperial"

    fetch(url)
     .then(function (response){
        if (!response.ok) {
            throw response.json();
          }
          return response.json();
     })
     .then(function (data){
        console.log(data);
        fiveDayForecast(data.coord.lat, data.coord.lon);
        nowCity.text(data.name);
        nowTemp.text(data.main.temp);
        nowHumidity.text(data.main.humidity + "%");
        nowWindSpeed.text(data.wind.speed + "mph");
        nowWeatherIcon.attr("src", "http://openweathermap.org/img/wn/" + data.weather[0].icon + ".png")
     })
}

function fiveDayForecast(lat, lon) {
    var url = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&units=imperial&appid=" + myAPI

    fetch(url)

    .then(function (response){
        if (!response.ok) {
            throw response.json();
          }
          return response.json();
     })
     .then(function (data){
        console.log(data);
        //sends latitude and longitude data to five day forecast function
        fiveDayForecast(data.coord.lat, data.coord.lon);
        //change text to respective data call
        nowCity.text(data.name + " ");
        nowTemp.text(data.main.temp);
        nowHumidity.text(data.main.humidity + "%");
        nowWindSpeed.text(data.wind.speed + " MPH");
        //changes img to the icon from open weather map data
        nowWeatherIcon.attr("src", "http://openweathermap.org/img/wn/" + data.weather[0].icon + ".png")
    })
}

//Five Day forecast API fetch function
function fiveDayForecast(lat, lon) {
//set url variable to url string
var url = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&units=imperial&appid=" + myAPI


fetch(url)

    .then(function (response){
        if (!response.ok) {
            throw response.json();
        }
        return response.json();
    })
    .then(function (data){
        console.log(data);

        //UV Index
        uvIndex.text(data.current.uvi);

        //Changes UV badge color based on UV Index number
        if (data.current.uvi <= 4) {
            uvIndex.addClass('badge badge-success');
        }

        else if (data.current.uvi > 4 && data.current.uvi <= 7) {
            uvIndex.removeClass('badge badge-success');
            uvIndex.addClass('badge badge-warning');
        }

        else {
            uvIndex.removeClass('badge badge-success');
            uvIndex.removeClass('badge badge-warning');
            uvIndex.addClass('badge badge-danger');
        }

        $('#five-day-forecast').empty();
        //Create Cards
        for (let i = 1; i < data.daily.length; i++) {

            //Date for each card 
            var date = new Date(data.daily[i].dt * 1000);
            console.log(date);
            var formatDate = moment(date).format('L'); //format the date to month/day/year 
            console.log(formatDate);
            var forecastDateString = formatDate
            console.log(forecastDateString);

            //Five Day Forecast El
            var fiveDayForecast = $('#five-day-forecast');
            var forecastCol = $("<div class='col-12 col-md-6 col-lg mb-3'>");
            var forecastCard = $("<div class='card text-white bg-primary'>");
            var forecastCardBody = $("<div class='card-body'>");

            var forecastDate = $("<h5 class='card-title'>");
            var forecastIcon = $("<img>");
            var forecastTemp = $("<p class='card-text mb-0'>");
            var forecastWind = $("<p class='card-text mb-0'>");
            var forecastHumidity = $("<p class='card-text mb-0'>");

            //create each card
            fiveDayForecast.append(forecastCol);
            forecastCol.append(forecastCard);
            forecastCard.append(forecastCardBody);

            forecastCardBody.append(forecastDate);
            forecastCardBody.append(forecastIcon);
            forecastCardBody.append(forecastTemp);
            forecastCardBody.append(forecastWind);
            forecastCardBody.append(forecastHumidity);

            //add info to each card
            forecastDate.text(forecastDateString);
            forecastIcon.attr("src", "http://openweathermap.org/img/wn/" + data.daily[i].weather[0].icon + ".png");
            forecastTemp.text("Temp: " + data.daily[i].temp.day + String.fromCharCode(8457));
            forecastWind.text("Wind Speed: " + data.daily[i].wind_speed + " MPH");
            forecastHumidity.text("Humidity: " + data.daily[i].humidity + "%");

            // If there are 5 cards on page then stop loop
            if (i === 5)
                break;
            
        }

    });
}

//On click of the look up btn take the value and send the input to nowWeather, lookHistory and clear the input field.
lookCityBtn.on('click', function () {


//grabs value entered in
var input = lookCity.val().trim()
console.log(input); 

nowWeather(input);
lookHistory(input);
lookCity.val("");
});

$('#form-look').on('submit', function () {



var input = lookCity.val().trim()
console.log(input); 

nowWeather(input);
lookHistory(input);
lookCity.val("");
});

//Look history 
function lookHistory(input) {

if(input){

    if(cityList.indexOf(input) === -1){
        cityList.push(input)

        //run this function to list all the cities in storage
        listArray();
    }
   
    else {
        //then remove the existing input
        var removeIndex = cityList.indexOf(input);
        cityList.splice(removeIndex, 1);

        //push the input to the array
        cityList.push(input);

        //run this function to list all the cities in the local storage/ history
        listArray();
    }
}
}

function listArray() {

lookHistoryList.empty();

cityList.forEach(function(city){
    var lookHistoryItem = $('<li type="button" class="list-group-item btn btn-warning btn-sm" id="city-btn">');
    lookHistoryItem.attr("data-value", city);
    lookHistoryItem.text(city);
    lookHistoryList.prepend(lookHistoryItem);
    //click history item to take you to that look up
    lookHistoryItem.on('click', function () {
        var input = lookHistoryItem.text()
        console.log(input); 
    
        nowWeather(input);
        lookHistory(input);
    });
});
 //save local storage
 localStorage.setItem("cities",JSON.stringify(cityList));

}

function getHistory() {
if (localStorage.getItem("cities")) {
    cityList = JSON.parse(localStorage.getItem("cities"));
    var lastIndex = cityList.length - 1;
    
    listArray();

    if (cityList.length !== 0) {
        nowWeather(cityList[lastIndex]);
    }

    else {
        //if no history make default Tampa, FL
        nowWeather("Tampa");
    }
}
}

removeHistoryBtn.on("click", function () {
localStorage.clear();
cityList = [];
listArray();
});

});