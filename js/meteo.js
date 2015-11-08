

function refreshMeteo(minute)
{	local=minute * 60000 ;
	getMeteo()
	setInterval(getMeteo, local);



}


function getMeteo()
{

	
 $.getJSON("https://api.forecast.io/forecast/f378e0b0885acbf3860873dbeea80037/48.799488,2.619860?units=si&lang=fr&callback=?", function(data)
             {
            	 displayData(data)



            });

}

function displayData(data)
{   var skycons = new Skycons({"color": "pink"});
	  console.log(data);
    skycons.add("weather-icon", data.currently.icon);
   
    $('.weather-temperature').html( entier(data.currently.temperature) );
    $('.weather-legend').html( entier(data.currently.summary) );
    skycons.play();

    
     
         $('#tmp-7').html( '16' );
         displayWeek(data.daily.data);

}

function displayWeek(data)
{ 
    var skyconsForecast = new Skycons({"color": "white"});
    
    
    $.each(data, function(index, value){
        
        $('#day-'+index).html(getDayName(value.time));
        $('#tmp-'+index).html( entier(value.temperatureMax) );
        if (value.temperatureMax < 0)
        {
          $('#tmp-'+index).addClass('minus');
        }
        skyconsForecast.add('weather-icon-'+index, value.icon);
    });

  skyconsForecast.play();

}

function getDayName(day)
{
  var date = new Date(day  * 1000);
  
  var weekdays = ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];
  return weekdays[date.getDay()];


}
function entier(nb)
  {

    var number= nb.toString();
    var res = number.split(".");
    return res[0];


  }