const key = config.MY_KEY
const city = 'vancouver'
const locationKey = '53286'

function startFunc(){

    var x = document.getElementById("resultDiv");
    data = getWeatherData();
    //rainChance = determineRain(data);
    x.innerHTML = rainChance;
}

async function getWeatherData(){

    var base = "http://dataservice.accuweather.com/forecasts/v1/hourly/12hour/";
    var end = "53286";
    var apikey = `?apikey=${key}`;
    var call = await fetch(base + end + apikey);
    var data = await call.json();

    return determineRain(data)
}

function determineRain(data){

    console.log(data)

}