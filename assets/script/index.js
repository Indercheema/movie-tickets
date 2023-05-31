'use strict';

import { select, onEvent } from "./utils.js";

const cities = './assets/script/city.json';
const movies = './assets/script/movie.json';
const list = select('.movieSection');
const movieInput = select('.movie-input');
const cityInput = select('.city-input');
const movieList = select('.movie-list-box');
const cityList = select('.city-list-box');
const bodyClick = select('body');


function listMovies(array) {
    let movies = '';
    list.innerHTML = '';
    if (array.length > 0) {
        array.forEach(movie => {
            movies += `
        <div class="movieBox">
          <img src="${movie.img}" class="movieImg">
          <p class="movieTitle">${movie.title}</p>
        </div>`
        });
    } else {
        movies = `<li>Movie not found</li>`;
    }
    list.innerHTML = `${movies}`;
}

const options = {
    method: 'GET',
    headers: { 'Content-Type': 'application/json; charset=UTF-8' },
    mode: 'cors'
};

async function getMovies() {
    try {
        const response = await fetch(movies, options);

        if (!response.ok) {
            throw new Error(`${response.statusText} (${response.status})}`)
        }

        const data = await response.json();
        listMovies(data.results);
    } catch (error) {
        console.log(error.message);
    }
}

getMovies();

async function filterMovies() {
    if (movieInput.value.length > 1) {
        const userInput = movieInput.value.toLowerCase();
        movieList.innerHTML = '';
        const response = await fetch(movies, options);
        if (!response.ok) {
            throw new Error(`${response.statusText} (${response.status})`)
        }
        const data = await response.json();
        const matchedMovies = [];
        for (let i = 0; i < data.results.length; i++) {
            let movieTitle = data.results[i].title;
            let movieYear = data.results[i].year;
            let movie = movieTitle + " " + `(${movieYear})`;
            matchedMovies.push(movie);
        }
        const filterMovies = matchedMovies.filter(movie => {
            return movie.toLowerCase().includes(userInput);
        });
        if (filterMovies.length > 0) {
            filterMovies.forEach(movie => {
                const newDiv = document.createElement('div');
                newDiv.textContent = movie;
                onEvent('click', newDiv, () => {
                    movieInput.value = newDiv.textContent;
                    movieList.innerHTML = '';
                });
                movieList.appendChild(newDiv);
            })

        } else {
            const movieNotFound = document.createElement('div');
            movieNotFound.textContent = 'Movie not found with this name';
            movieNotFound.style.backgroundColor = '#262933';
            movieList.appendChild(movieNotFound);
        }
    }
}

onEvent('input', movieInput, async () => {

    if(movieInput.value.length == 0) {
        movieList.innerHTML = '';
    } else {
        filterMovies();
    }

});

async function filterCities() {
    if (cityInput.value.length > 1) {
        const userInput = cityInput.value.toLowerCase();
        cityList.innerHTML = '';
        const response = await fetch(cities, options);
        if (!response.ok) {
            throw new Error(`${response.statusText} (${response.status})`)
        }
        const data = await response.json();
        const matchedCities = [];
        for (let i = 0; i < data.cities.length; i++) {
            let cityName = data.cities[i].name;
            matchedCities.push(cityName);
        }
        const filterCities = matchedCities.filter(city => {
            return city.toLowerCase().includes(userInput);
        });

        if (filterCities.length > 0) {
            filterCities.forEach(city => {
                const newDiv = document.createElement('div');
                newDiv.textContent = city;
                onEvent('click', newDiv, () => {
                    cityInput.value = newDiv.textContent;
                    cityList.innerHTML = '';
                });
                cityList.appendChild(newDiv);
            })

        } else {
            const cityNotFound = document.createElement('div');
            cityNotFound.textContent = 'City not found with this name';
            cityNotFound.style.backgroundColor = '#262933';
            cityList.appendChild(cityNotFound);
        }
    }
}



onEvent('input', cityInput, async () => {

    if(cityInput.value.length == 0) {
        cityList.innerHTML = '';
    } else {
        filterCities();
    }

});

onEvent('click', bodyClick, () => {
    movieList.innerHTML = '';
    cityList.innerHTML = '';
})


