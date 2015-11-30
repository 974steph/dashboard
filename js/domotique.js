var serveur="192.25.84.106:8085/core/api/jeeApi.php?apikey=bc3t62434g34jfk18qmd";



function refreshMeteo(minute)
{	local=minute * 60000 ;
	getMeteo()
	setInterval(getMeteo, local);

}

function refreshDomotique(minute)
{ local=minute * 60000 ;
  getDomotique();
  setInterval(getDomotique, local);
  
  
}

function getDomotique()
{
  getLocalTemp();
  getPeriode();
  getEtatCommandeChauffage();
  displayDate("#mToday");
  getEtatHg();
  getConsigneTemp();
  getEtatChaudiere();
}



function getEtatChaudiere()
{
  url="http://"+serveur+"&type=cmd&id=175";
  console.log(url);
  $.get( url, function( data ) 
  { 
    displayEtatChaudiere(data);

  }); 


}

function displayEtatChaudiere(data)
{ console.log("etat chaudiere " +data);
  if (data==0)
  {
    
    $("#animatedring").removeClass('roue');
  }
  else
  { 
    $("#animatedring").addClass('roue');

  }
}


function getConsigneTemp()
{
  url="http://"+serveur+"&type=cmd&id=145";
  console.log(url);
  $.get( url, function( data ) 
  { 
    displayConsigneTemp(data);

  }); 



}


function displayConsigneTemp(data)
{
  $('#consigneTemp').html( data );

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
  
  if (data == 'off') 
  {    $('#buttonOnOFF').removeClass('active');
       $('#EtatChauffage').text('OFF').css('color', '#2a2a2a');
       activeOnOffAuto('#onOffAuto_OFF');
  }
  else
         { $('#buttonOnOFF').addClass('active');
           if (data == 'auto') 
           { $('#EtatChauffage').text('AUTO').css('color', '#61fc8c');
             activeOnOffAuto('#onOffAuto_AUTO');
           }
           else
           { $('#EtatChauffage').text('ON').css('color', '#61fc8c');
             activeOnOffAuto('#onOffAuto_ON');
           }
         } 



}

function activeOnOffAuto(on)
{ $('#onOffAuto_AUTO').removeClass('active');
  $('#onOffAuto_ON').removeClass('active');
  $('#onOffAuto_OFF').removeClass('active');
  $(on).addClass('active');

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

    
     
        // $('#tmp-7').html( '16' );
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

function displayDate(where)
{
  
   
  var dateFormat = $.datepicker.formatDate('dd MM, yy', new Date(),$.datepicker.regional["fr"]);
  $(where).html(dateFormat );

}

function commandAutoOnOff(command)
{
  console.log(command);
  //displayEtatCommandeChauffage(command);
  url="http://"+serveur+"&type=cmd&id=184&slider="+command;
  
  $.getJSON(url, function(data)
  {
    console.log(data);
  });

  //actu
  getDomotique();

}


function getEtatHg()
{


  url="http://"+serveur+"&type=cmd&id=136";
  $.getJSON(url, function(data)
  {
    displayEtatHG(data);
  });

}

function displayEtatHG(etat)
{ 
  if (etat==0)
  {
    $("#horsGel .badge").html('off');
    $("#horsGelIcon").removeClass('mif-ani-spin');
  }
  else
  { $("#horsGel .badge").html('on');
    $("#horsGelIcon").addClass('mif-ani-spin');

  }


}

function commandSwitchHG()
{ etat=$("#horsGel .badge").html();
  console.log(etat);
  if (etat=='on')
  { displayEtatHG(0);
  } 
  else
  { displayEtatHG(1);
  } 

  url="http://"+serveur+"&type=cmd&id=154";
  $.getJSON(url, function(data)
  {
    console.log("commande hg");
  });
  
}