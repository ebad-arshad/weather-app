let main = document.getElementsByClassName("main");
let input = document.getElementById("search_input");
let search_icon = document.getElementsByClassName("fa-magnifying-glass")[0];
let reg_number = /^[a-zA-Z\s]*$/;

window.onload = input.focus();

let input_search = search_icon.onclick = () => {
    let extra_space_remove = input.value.replace(/\s\s+/g, " ");
    if (input.value !== "" && reg_number.test(extra_space_remove)) {
        extra_space_remove = extra_space_remove.toLowerCase();
        data_result(extra_space_remove);
        input.value = "";
        input.blur();
        document.getElementsByClassName("loader")[0].classList.remove("hidden");
        document.getElementsByClassName("not_found")[0].classList.add("hidden");
        document.getElementsByClassName("main")[0].classList.add("hidden");
    }
    else {
        input.style.borderColor = "red";
        setTimeout(() => input.style.borderColor = "#fff", 2000)
    }
}

const data_result = input_data => {
    const getting_api = new Promise((resolve, reject) => {
        fetch(`https://api.openweathermap.org/data/2.5/weather?q=${input_data}&appid=a0a0e583498ad3bff8114fae16b983ad&units=metric`)
            .then(res => resolve(res))
            .catch(err => reject(err))
    })
    getting_api
        .then(res => res.json())
        .then(res => {
            if (res.cod === 200) {
                document.getElementsByClassName("not_found")[0].classList.add("hidden");
                document.getElementsByClassName("main")[0].classList.remove("hidden");
                document.getElementsByClassName("loader")[0].classList.add("hidden");
                let date = new Date().getUTCDay(res.timezone);
                let day = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
                let day_night;
                res.weather[0].icon[2] === "d" ? day_night = "Day" : day_night = "Night";
                document.getElementsByClassName("container")[0].parentNode.style.backgroundImage = `url(images/weathers/${(res.weather[0].icon).slice(0, 2)}.gif)`

                main[0].innerHTML = `
                <div class="col_1">
                    <div class="city_day">
                        <h1>${res.name}</h1>
                        <h1>${day[date]}</h1>
                        <h1>${day_night}</h1>
                    </div>
                    <div class="other_data">
                        <p><i class="fa-solid fa-solid fa-droplet"></i>${res.main.humidity} %</p>
                        <p><i class="fa-solid fa-wind"></i>${(res.wind.speed).toFixed(2)} m/s</p>
                        <p><i class="fa-solid fa-temperature-three-quarters"></i> ${res.main.pressure} hPa</p>
                    </div>
                </div>
                <div class="col_2">
                    <h1>${res.weather[0].main}</h1>
                    <img src="images/weathers_icons/${res.weather[0].icon}.png" alt="${res.weather[0].description}">
                </div>
                <div class="col_3">
                    <h1 class="cent">${res.main.temp} <sup>0</sup>C</h1>
                    <h1 class="hidden_slash">/</h1>
                    <h1 class="farh">${((res.main.temp * 9 / 5) + 32).toFixed(2)} <sup>0</sup>F</h1>
                </div>
                `


            } else {
                document.getElementsByClassName("main")[0].classList.add("hidden");
                document.getElementsByClassName("not_found")[0].classList.remove("hidden");
                document.getElementsByClassName("container")[0].parentNode.style.backgroundImage = `url(images/weathers.jpeg)`;
                document.getElementsByClassName("loader")[0].classList.add("hidden");
            }
        })
        .catch(err => console.log('Error==>', err))
}