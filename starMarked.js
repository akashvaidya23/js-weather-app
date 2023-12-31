const options = {
  method: "GET",
  headers: {
    "X-RapidAPI-Key": "5041c3e377msh9d016db95a367dap1fb04cjsn1a0b53eaf5d1",
    "X-RapidAPI-Host": "weather-by-api-ninjas.p.rapidapi.com",
  },
};

let city = document.querySelector("#city_input");
let city_div = document.querySelector("#div_city");
let weather_form = document.querySelector("#weather_form");
let city_error = document.getElementsByClassName("city_error");
let weather_cities = document.querySelector(".weather_cities");
let loading = document.querySelector("#Loading");
let cities = [];
let starMarked = JSON.parse(localStorage.getItem("star_marked_cities")) ?? [];
let current_city = "";
let star_marked_page = document.getElementById("starmarked_places");
let check_weather = document.getElementById("check_weather");
let search_city_text = document.getElementById("search_city_text");
let weather_error = document.getElementById("weather_error");

const getStarMarkedCitiesWeather = async () => {
  if (starMarked) {
    for (const city_name of starMarked) {
      if (city_name != current_city) {
        let data1 = {};
        data1.city_name = city_name;
        const response = await fetch(
          `https://weather-by-api-ninjas.p.rapidapi.com/v1/weather?city=${city_name}`,
          options
        );
        const weather = await response.json();
        data1.weather = weather;
        cities.push(data1);
      }
    }
  }
  return cities;
};

const renderWeather = (cities) => {
  weather_cities.innerHTML = "";
  cities.map((city, index) => {
    let card = document.createElement("div");
    let actionDiv = document.createElement("div");
    let closeBtn = document.createElement("span");
    closeBtn.innerHTML = `<button class="remove" style="float:right" onclick = removeCity('${index}')>&times;</button>`;
    actionDiv.appendChild(closeBtn);
    const star = document.createElement("span");
    if (starMarked.indexOf(city.city_name) != -1) {
      star.setAttribute("class", "fa fa-star checked");
    } else {
      star.setAttribute("class", "fa fa-star");
    }
    star.setAttribute("onclick", `starMark('${city.city_name}')`);
    star.style.marginLeft = "5px";
    card.appendChild(star);
    actionDiv.appendChild(star);
    card.appendChild(actionDiv);
    if (city.weather.temp <= 20) {
      card.setAttribute("class", "card-cold");
    } else if (city.weather.temp > 20) {
      card.setAttribute("class", "card-worm");
    } else if (city.weather.temp > 40) {
      card.setAttribute("class", "card-hot");
    }
    let card_body = document.createElement("div");
    card_body.setAttribute("class", "card-body");
    let h5 = document.createElement("h5");
    h5.style.textAlign = "center";
    h5.innerHTML = city.city_name;
    weather_cities.appendChild(card);
    card.appendChild(card_body);
    card_body.appendChild(h5);
    // Sunrise images
    let sunrise_img = document.createElement("img");
    sunrise_img.src = "/images/sunrise.png";
    sunrise_img.width = "50";
    sunrise_img.height = "50";
    let riseTime = document.createElement("span");
    let sunrise = getTimeFromDate(city.weather.sunrise);
    riseTime.innerHTML = sunrise;
    card_body.appendChild(sunrise_img);
    card_body.appendChild(riseTime);
    // Sunset images
    let sunset_img = document.createElement("img");
    sunset_img.style.marginLeft = "25px";
    sunset_img.src = "/images/sunset-2.png";
    sunset_img.width = "50";
    sunset_img.height = "50";
    let setTime = document.createElement("span");
    let sunSet = getTimeFromDate(city.weather.sunset);
    setTime.innerHTML = sunSet;
    card_body.appendChild(sunset_img);
    card_body.appendChild(setTime);
    let br = document.createElement("br");
    card_body.appendChild(br);
    // Max_temp
    let max_temp_img = document.createElement("img");
    max_temp_img.style.marginTop = "20px";
    max_temp_img.src = "/images/fever.png";
    max_temp_img.width = "50";
    max_temp_img.height = "50";
    let setMaxTemp = document.createElement("span");
    let maxTemp = city.weather.max_temp;
    setMaxTemp.innerHTML = maxTemp;
    card_body.appendChild(max_temp_img);
    card_body.appendChild(setMaxTemp);
    // Min_temp
    let min_temp_img = document.createElement("img");
    min_temp_img.style.marginTop = "20px";
    min_temp_img.style.marginLeft = "85px";
    min_temp_img.src = "/images/low-temperature.png";
    min_temp_img.width = "50";
    min_temp_img.height = "50";
    let setMinTemp = document.createElement("span");
    let minTemp = city.weather.min_temp;
    setMinTemp.innerHTML = minTemp;
    card_body.appendChild(min_temp_img);
    card_body.appendChild(setMinTemp);
    // Wind Speed
    let wind_speed_div = document.createElement("div");
    wind_speed_div.style.marginTop = "20px";
    let wind_speed_img = document.createElement("img");
    wind_speed_img.src = "/images/anemometer.png";
    wind_speed_img.width = "50";
    wind_speed_img.height = "50";
    let setwind_speed = document.createElement("span");
    let wind_speed = city.weather.wind_speed;
    setwind_speed.innerHTML = wind_speed;
    wind_speed_div.appendChild(wind_speed_img);
    wind_speed_div.appendChild(setwind_speed);
    card_body.appendChild(wind_speed_div);
    // Wind Temperature
  });
};

let getWeather = async () => {
  let citiess = await getStarMarkedCitiesWeather();
  renderWeather(citiess);
  loading.style.display = "none";
};

getWeather();

function getTimeFromDate(timestamp) {
  var theDate = new Date(timestamp * 1000).toLocaleTimeString();
  return theDate;
}

search_city_text.addEventListener("keyup", async function (e) {
  loading.style.display = "block";
  let searchText = e.target.value;
  let filtered_cities = searchTask(searchText);
  weather_error.innerHTML = "";
  if (filtered_cities.length == 0) {
    weather_error.innerHTML = "No City Found";
  }
  if (searchText !== null) {
    renderWeather(filtered_cities);
  } else {
    renderWeather(cities);
  }
  loading.style.display = "none";
});

const removeCity = (index) => {
  starMarked.splice(starMarked.indexOf(cities[index].city_name), 1);
  cities.splice(index, 1);
  weather_cities.innerHTML = "";
  localStorage.setItem("star_marked_cities", JSON.stringify(starMarked));
  renderWeather(cities);
};

const searchTask = (searchText) => {
  loading.style.display = "block";
  let filtered_cities = cities.filter((city) => {
    return city.city_name.toLowerCase().includes(searchText.toLowerCase());
  });
  loading.style.display = "none";
  return filtered_cities;
};

const starMark = (city) => {
  if (starMarked.indexOf(city) == -1) {
    starMarked.push(city);
  } else {
    starMarked.splice(starMarked.indexOf(city), 1);
  }
  localStorage.setItem("star_marked_cities", JSON.stringify(starMarked));
  renderWeather(cities);
};

star_marked_page.addEventListener("click", function (e) {
  window.location.href = "./starmarked.html";
});

check_weather.addEventListener("click", function (e) {
  window.location.href = "./index.html";
});
