const apiKey = 'c3cf09d815b87e99ede2a5f9f2fced70';
const apiBaseUrl = 'https://api.openweathermap.org/data/2.5';

function searchWeather() {
    const cityInput = document.getElementById('city-input');
    const cityName = cityInput.value;
    
    if (cityName.trim() !== '') {
        
        fetch(`${apiBaseUrl}/weather?q=${cityName}&appid=${apiKey}`)
            .then(response => response.json())
            .then(data => {
                CurrentWeather(data);
                addToSearchHistory(cityName);
            })
            .catch(error => console.error('Error fetching current weather:', error));

       
        fetch(`${apiBaseUrl}/forecast?q=${cityName}&appid=${apiKey}`)
            .then(response => response.json())
            .then(data => displayForecast(data))
            .catch(error => console.error('Error fetching forecast:', error));
    }
}

function CurrentWeather(data) {
    const currentWeatherDiv = document.getElementById('current-weather');
    currentWeatherDiv.innerHTML = `
        <h2>${data.name}</h2>
        <p>Date: ${new Date().toLocaleDateString()}</p>
        <p>Temperature: ${data.main.temp} &#8451;</p>
        <p>Humidity: ${data.main.humidity}%</p>
        <p>Wind Speed: ${data.wind.speed} m/s</p>
    `;
}

function displayForecast(data) {
    const forecastEntriesDiv = document.getElementById('forecast-entries');
    forecastEntriesDiv.innerHTML = ''; 

   
    const forecastEntries = data.list;

    
    for (let i = 0; i < forecastEntries.length; i += 8) {
        const entry = forecastEntries[i];
        const date = entry.dt_txt.split(' ')[0];
        const temperature = entry.main.temp;
        const humidity = entry.main.humidity;
        const windSpeed = entry.wind.speed;

        forecastEntriesDiv.innerHTML += `
            <div class="forecast-entry">
                <p>Date: ${date}</p>
                <p>Temperature: ${temperature} &#8451;</p>
                <p>Humidity: ${humidity}%</p>
                <p>Wind Speed: ${windSpeed} m/s</p>
            </div>
        `;
        console.log("api response:", data);
    }

}

function calculateTemperature(entries) {
    const sum = entries.reduce((acc, entry) => acc + entry.main.temp, 0);
    return (sum / entries.length).toFixed(2);
}

function addToSearchHistory(cityName) {
    const searchHistoryDiv = document.getElementById('search-history');

    
    saveLocalStorage(cityName);

    
    searchHistoryDiv.innerHTML += `<p onclick="searchHistoryClick('${cityName}')">${cityName}</p>`;
}

function saveLocalStorage(cityName) {
    const searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];
    searchHistory.push(cityName);
    localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
}

function loadingSearchHistory() {
    const searchHistoryDiv = document.getElementById('search-history');
    const searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];

    searchHistoryDiv.innerHTML = '';
    searchHistory.forEach(cityName => {
        searchHistoryDiv.innerHTML += `<p onclick="searchHistoryClick('${cityName}')">${cityName}</p>`;
    });
}


loadingSearchHistory();
