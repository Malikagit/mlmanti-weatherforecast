//display icon
function displayIcons(id) {
    if (id === 800) {
        return `<img class="img" src="./assets/sun.svg">`
    } else if (id >= 801 && 804 >= id) {
        if (id === 801 || id === 802) {
            return `<img class="img" src="./assets/cloudy.svg">`;
        }
        if (id === 803 || id === 804) {
            return `<img class="img" src="./assets/clouds.svg">`;
        }
    } else if (id >= 600 && 622 >= id) {
        return `<img class="img" src="./assets/snow.svg">`;
    } else {
        return `<img class="img" src="./assets/rain.svg">`;
    }
}
//methode removechild

//recupere le jr apartir du numéro du jour dans la semaine
const day = function getday(a) {
    let semaine = [`Sunday`, `Monday`, `Tuesday`, ` Wednesday`, ` Thursday`, `Friday`, `Saturday`];
    return semaine[a]
}

//get the weather using geographic coordinates
function getweather(lat, lon) {
    const city = fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minytely,hourly&appid=d0fcc00c02efe5b8355fa57156f79f2b`)
        .then(response => {
            return response.json() //attention à return pour pouvoir récupèrer les infos dans le 'then' suivant
            // le .json() permet d'extraire le json de la response récupèré 
        })
        .then(data => {
            console.log(data);
            return data;
        })
    return city;
}
//get geographic coordinates using city name
function getCity(ville) {
    let cordGeo = fetch(
        `https://api.opencagedata.com/geocode/v1/json?q=${ville}&key=9c86f2c1db224c50bff8e37160c82e7c`
    )
        .then(response => {
            return response.json()
        })
        .then(data => {
            let longitude = data.results[0].geometry.lng;
            let latitude = data.results[0].geometry.lat;
            let cord = { longitude, latitude }
            return cord;
        })
        .catch(error =>
            console.error(error)
        );
    return cordGeo;
}

document.addEventListener('DOMContentLoaded', (event) => {
    const elementCity = document.getElementById(`cityName`)
    const zoneDaffichage = document.getElementById('descripWeath')
    document.getElementById("form-user").addEventListener("submit", (event) => {
        event.preventDefault();// important pour éviter les comportements par défaut, notammment 
        //lorsque je charge la page html
        // ce code se déclenchera lorsque le user aura soumis le formulaire*/
        //vider ma div d'affichage de données
        while (zoneDaffichage.firstChild) {
            zoneDaffichage.removeChild(zoneDaffichage.firstChild);
        }
        const nomDeVille = elementCity.value;
        getCity(nomDeVille).then((result) => {
            console.log(result);
            getweather(result.latitude, result.longitude)
                .then((meteo) => {
                    const nbrjselected = document.getElementById(`myselect`)
                    for (let i = 0; i < nbrjselected.value; i++) {
                        const daynumber = new Date(meteo.daily[i].dt * 1000).getDay();
                        //affiche le jour
                        zoneDaffichage.insertAdjacentHTML(`beforeend`, ` <p>${day(daynumber)} </p > `);
                        //afficher icone 
                        zoneDaffichage.insertAdjacentHTML(`beforeend`, displayIcons(meteo.daily[i].weather[0].id))
                    }
                })
        })
    })
})
