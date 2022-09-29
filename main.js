async function startFunc(){

    const key = "yen0nyQobGnRmlx8aNeuMFHJArHIw3PT";

    var u = document.getElementById("currentTempDiv");
    var v= document.getElementById("lowestTempDiv");
    var w = document.getElementById("img");
    var x = document.getElementById("resultDiv");
    var y = document.getElementById("rainChanceDiv");
    var z = document.getElementById("location");

    var locationId = getLocationId(z.value);
    locationId = await locationId;
    locationKey = locationId[0].Key;

    let data = getWeatherData(locationKey);
    let result = await determineRain(data);

    if (result.itWillRain){
        x.innerHTML = "It will rain today";
        y.innerHTML = "";
        w.src = "/pics/9.png"
    }
    else{
        x.innerHTML = "It likely will not rain today";
        y.innerHTML = "Chance of rain today: " + parseInt(result.rainChance) * 10 + "%";
        w.src = "/pics/10.png";
    }
    let temperatures = await findTemperatures(data);
    u.innerHTML = "It is currently " + temperatures.currentTemp + " degrees Celsius.";
    v.innerHTML = "The lowest temperature today will be " + temperatures.lowestTemp + " degrees Celsius at " + temperatures.time;
}

async function getWeatherData(locationKey){

    locationKey = await locationKey
    var base = "http://dataservice.accuweather.com/forecasts/v1/hourly/12hour/";
    var apikey = `?apikey=${key}`;
    var call = await fetch(base + locationKey + apikey + "&metric=true");
    var data = await call.json();
    console.log(data)

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

    return id;
}

async function findTemperatures(data){

    data = await data;
    var currentTemp = data[0].Temperature.Value;
    var lowestTemp = 100;

    for (let i = 0; i < 12; i++){
        if (data[i].Temperature.Value < lowestTemp){
            lowestTemp = data[i].Temperature.Value;
            var time = data[i].DateTime.slice(11, 19)
        }
    }

    return {currentTemp, lowestTemp, time}
}