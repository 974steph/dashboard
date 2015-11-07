

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

}


function entier(nb)
  {

    var number= nb.toString();
    var res = number.split(".");
    return res[0];


  }