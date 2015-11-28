var serveur="192.25.84.106:8085/core/api/jeeApi.php?apikey=bc3t62434g34jfk18qmd";



function refreshMeteo(minute)
{	local=minute * 60000 ;
	getMeteo()
	setInterval(getMeteo, local);

}

function refreshDomotique(minute)
{ local=minute * 60000 ;
  getLocalTemp();
  getPeriode();
  getEtatCommandeChauffage();
  setInterval(getLocalTemp, local);
  setInterval(getPeriode, local);
  setInterval(getEtatCommandeChauffage, local);
  
}



function getEtatCommandeChauffage()
{ url="http://"+serveur+"&type=cmd&id=185";
  console.log(url);
  $.get( url, function( data ) 
  { 
    displayEtatCommandeChauffage(data);

  }); 



}



function getPeriode()
{ url="http://"+serveur+"&type=cmd&id=137";
  console.log(url);
  $.get( url, function( data ) 
  { 
    displayPeriode(data);

  }); 



}


function getLocalTemp()
{ url="http://"+serveur+"&type=cmd&id=189";
  $.getJSON(url, function(data)
             {
               displayLocalTemp(data)



            });

}

function displayEtatCommandeChauffage(data)
{
  console.log(data=='auto');
  if (data == 'off') 
  { $('#buttonOnOFF').removeClass('active');
       $('#EtatChauffage').text('OFF').css('color', '#2a2a2a');
  }
  else
         { $('#buttonOnOFF').addClass('active');
           if (data == 'auto') 
           { $('#EtatChauffage').text('AUTO').css('color', '#61fc8c');
           }
           else
           { $('#EtatChauffage').text('ON').css('color', '#61fc8c');
           }
         }  

}

function displayPeriode(data)
{  console.log(data);
  var src="icon/"+data+".png";
   $("#periodPic").attr("src",src);

}

function displayLocalTemp(data)
{

  console.log(data);
  var chaine = entier(data) + "<span>." + decimale(data)  +"</span><strong>&deg;</strong>" ;
  $('.deneme').html( chaine );
  
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

function decimale(nb)
{ var l=parseFloat( nb.toFixed(1));
  var number= l.toString();
  var res = number.split("."); 
  if (res[1] == null) {
      res[1]=0;
  }
  return res[1];


}

function entier(nb)
{

    var number= nb.toString();
    var res = number.split(".");
    return res[0];
}