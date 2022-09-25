const key = config.MY_KEY

async function startFunc(){

    var x = document.getElementById("resultDiv");
    var y = document.getElementById("rainChanceDiv");
    var z = document.getElementById("location")

    var locationId = getLocationId(z.value)
    locationId = await locationId
    locationKey = locationId[0].Key

    let data = getWeatherData(locationKey);
    let result = await determineRain(data);

    if (result.itWillRain){
        x.innerHTML = "It will rain today";
        y.innerHTML = ""
    }
    else{
        x.innerHTML = "It likely will not rain today";
        y.innerHTML = "Chance of rain today: " + parseInt(result.rainChance)/10 + "%"
    }
}

async function getWeatherData(locationKey){

    locationKey = await locationKey
    var base = "http://dataservice.accuweather.com/forecasts/v1/hourly/12hour/";
    var apikey = `?apikey=${key}`;
    var call = await fetch(base + locationKey + apikey);
    var data = await call.json();

    return data
}

async function determineRain(data){

    data = await data;
    var rainChance = 0;
    for (let i = 0; i < 12; i++){
        if (data[i].HasPrecipitation){
            var itWillRain = true;
            break;
        }
        else{
            if (data[i].PrecipitationProbability > rainChance){
                rainChance = data[i].PrecipitationProbability;
            }
        }
    }
    return {itWillRain, rainChance}
}

async function getLocationId(text){

    var base = "http://dataservice.accuweather.com/locations/v1/cities/search";
    var apikey = `?apikey=${key}&q=${text}`;

    var call = await fetch(base + apikey);
    var id = await call.json();

    return id
}