const url =
  "https://weather-by-api-ninjas.p.rapidapi.com/v1/weather?city=Mumbai";
const options = {
  method: "GET",
  headers: {
    "X-RapidAPI-Key": "5041c3e377msh9d016db95a367dap1fb04cjsn1a0b53eaf5d1",
    "X-RapidAPI-Host": "weather-by-api-ninjas.p.rapidapi.com",
  },
};

const fetchWeather = async (city) => {
  try {
    const response = await fetch(
      `https://weather-by-api-ninjas.p.rapidapi.com/v1/weather?city=${city}`,
      options
    );
    const result = await response.text();
    // console.log(result);
    return result;
  } catch (error) {
    console.error(error);
  }
};

let city = document.querySelector("#city_input");
let city_div = document.querySelector("#div_city");
let weather_form = document.querySelector("#weather_form");
let city_error = document.getElementsByClassName("city_error");
let weather_cities = document.querySelector(".weather_cities");

weather_form.addEventListener("submit", async function (e) {
  e.preventDefault();
  let city_name = city.value;
  if (!city_name) {
    city_error[0].innerHTML = "Please enter a valid city";
    city_error[0].style.color = "red";
  } else {
    let weather = await fetchWeather(city_name);
    weather = JSON.parse(weather);
    console.log(weather);
    let card = document.createElement("div");
    card.setAttribute("class", "card");
    let card_body = document.createElement("div");
    card_body.setAttribute("class", "card-body");
    let h5 = document.createElement("h5");
    h5.style.textAlign = "center";
    h5.innerHTML = city_name;
    weather_cities.appendChild(card);
    card.appendChild(card_body);
    card_body.appendChild(h5);

    // Sunrise images
    let sunrise_img = document.createElement("img");
    sunrise_img.src = "/images/sunrise.png";
    sunrise_img.width = "50";
    sunrise_img.height = "50";
    let riseTime = document.createElement("span");
    let sunrise = getTimeFromDate(weather.sunrise);
    riseTime.innerHTML = sunrise;
    card_body.appendChild(sunrise_img);
    card_body.appendChild(riseTime);

    // Sunset images
    let sunset_img = document.createElement("img");
    sunset_img.style.marginLeft = "25px";
    sunset_img.src = "/images/sunrise.png";
    sunset_img.width = "50";
    sunset_img.height = "50";
    let setTime = document.createElement("span");
    let sunSet = getTimeFromDate(weather.sunset);
    setTime.innerHTML = sunSet;
    card_body.appendChild(sunset_img);
    card_body.appendChild(setTime);
  }
  city.value = null;
  city.focus();
});

city.addEventListener("keyup", function (e) {
  console.log(e.target.value);
  city_error[0].innerHTML = "";
});

// <div class="card" style="width: 18rem">
//   <div class="card-body">
//     <h5 class="card-title">Card title</h5>
//       </div>
//         <ul class="list-group list-group-flush">
//           <li class="list-group-item">An item</li>
//           <li class="list-group-item">A second item</li>
//           <li class="list-group-item">A third item</li>
//         </ul>
//         <div class="card-body">
//           <a href="#" class="card-link">Card link</a>
//           <a href="#" class="card-link">Another link</a>
//       </div>
//   </div>

function getTimeFromDate(timestamp) {
  var theDate = new Date(timestamp * 1000);
  let hour = theDate.getHours();
  let minute = theDate.getMinutes();
  let second = theDate.getSeconds();
  return `${hour}:${minute}:${second}`;
}

let sample = {
  cloud_pct: 5,
  temp: 24,
  feels_like: 24,
  humidity: 39,
  min_temp: 24,
  max_temp: 24,
  wind_speed: 0.89,
  wind_degrees: 283,
  sunrise: 1698454941,
  sunset: 1698496455,
};
