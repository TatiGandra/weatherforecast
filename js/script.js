'use strict';

// variáveis com a url base da API e com a chave para acessá-la 
const baseurl = 'https://api.weatherbit.io/v2.0/forecast/daily';
const apiKey = '9e248466ac6040768c50e0885951e6b6'; 
const weekdays = {
	0: 'Dom',
	1: 'Seg',
	2: 'Ter',
	3: 'Qua',
	4: 'Qui',
	5: 'Sex',
	6: 'Sáb',
}

getForecast('Recife');

$('#search').click(function(event){
	event.preventDefault();
	const newCity = $('#city').val();
	
	getForecast(newCity);
});


function getForecast(city){
	$('.loader').css('display','');
	$('#forecast').css('display','none');
	clearFields();
	
	//função para requerir as informações da API
	$.ajax({
	 	url: baseurl,
	 	data: {
	 		key: apiKey ,
	 		city: city,
	 		lang: 'pt',
	 	},
	 	success: function(result){
	 		$('.loader').css('display','none');
			$('#forecast').css('display','');
			$('#city-name').text(result.city_name);
	 		const forecast = result.data;
	 		const today = forecast [0];
			displayToday(today);
			
			const nextDays = forecast.slice(1);
			displayNextdays(nextDays);
			

		},
		error: function(error){
			console.log(error.response.Text);
		}
})
}

function clearFields(){
	$('#next-days').empty();
}


//função pata "puxar" as informações da API para os espaços das informações do dia
function displayToday (today) {
	const temperature = Math.round(today.temp);
	const windSpeed = today.wind_spd;
	const relativeHumidity = today.rh;
	const weatherDescription = today.weather.description;
	const icon = today.weather.icon;
	const iconURL = `https://www.weatherbit.io/static/img/icons/${icon}.png`;

	
	$('#current-temperature').text(temperature);
	$('#current-weather').text(weatherDescription);
	$('#current-wind').text(windSpeed);
	$('#current-humidity').text(relativeHumidity);
	$('#weather-icon').attr('src', iconURL);

}

function displayNextdays (nextDays) {
	for(let i = 0; i < nextDays.length; i = i + 1) {
	const day = nextDays[i];	
	const min = Math.round(day.min_temp);
	const max = Math.round(day.max_temp);
	const date = new Date(day.valid_date);
	const weekday = weekdays[date.getUTCDay()];

	const card = $(
				`<div class="day-card">
                    <div class="date">${date.getUTCDate()}/${date.getUTCMonth() + 1}</div>
                    <div class="weekday">${weekday}</div>
                    <div class="temperatures">
                        <span class="max">${max}°</span>
                        <span class="min">${min}°</span>
                    </div>
                </div>`);
	card.appendTo('#next-days');
	}
}