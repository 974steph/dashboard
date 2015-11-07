/**
 * Plugin: jquery.zWeatherFeed
 * 
 * Version: 1.3.1
 * (c) Copyright 2011-2015, Zazar Ltd
 * 
 * Description: jQuery plugin for display of Yahoo! Weather feeds
 * 
 * History:
 * 1.3.1 - Forecast day option and background image code fix (credit to Romiko)
 * 1.3.0 - Added refresh timer
 * 1.2.1 - Handle invalid locations
 * 1.2.0 - Added forecast data option
 * 1.1.0 - Added user callback function
 *         New option to use WOEID identifiers
 *         New day/night CSS class for feed items
 *         Updated full forecast link to feed link location
 * 1.0.3 - Changed full forecast link to Weather Channel due to invalid Yahoo! link
	   Add 'linktarget' option for forecast link
 * 1.0.2 - Correction to options / link
 * 1.0.1 - Added hourly caching to YQL to avoid rate limits
 *         Uses Weather Channel location ID and not Yahoo WOEID
 *         Displays day or night background images
 **/

(function($){

	$.fn.weatherfeed = function(locations, options, fn) {	
	
		// Set plugin defaults
		var defaults = {
			unit: 'c',
			image: true,
			country: false,
			highlow: true,
			wind: true,
			humidity: false,
			visibility: false,
			sunrise: false,
			sunset: false,
			forecast: false,
			forecastdays: 5,
			link: true,
			showerror: true,
			linktarget: '_self',
			woeid: false,
			refresh: 0
		};  
		var options = $.extend(defaults, options); 
		var row = 'odd';

		// Functions
		return this.each(function(i, e) {
			var $e = $(e);
			
			var count = locations.length;
			if (count > 10) count = 10;

			var locationid = '';

			for (var i=0; i<count; i++) {
				if (locationid != '') locationid += ',';
				locationid += "'"+ locations[i] + "'";
			}

			// Cache results for an hour to prevent overuse
			now = new Date();

			// Select location ID type
			var queryType = options.woeid ? 'woeid' : 'location';
					
			// Create Yahoo Weather feed API address
			var query = "select * from weather.forecast where "+ queryType +" in ("+ locationid +") and u='"+ options.unit +"'";
			var api = 'http://query.yahooapis.com/v1/public/yql?q='+ encodeURIComponent(query) +'&rnd='+ now.getFullYear() + now.getMonth() + now.getDay() + now.getHours() +'&format=json&callback=?';

			// Request feed data
			sendRequest(query, api, options);

			if (options.refresh > 0) {

				// Set timer interval for scrolling		
				var interval = setInterval(function(){ sendRequest(query, api, options); }, options.refresh * 60000);
			}

			// Function to gather new weather data
			function sendRequest(query, api, options) {

				
				$.ajax({
					type: 'GET',
					url: api,
					dataType: 'json',
					success: function(data) {

						if (data.query) {
			
							if (data.query.results.channel.length > 0 ) {
							
								// Multiple locations
								var result = data.query.results.channel.length;
								for (var i=0; i<result; i++) {
							
									// Create weather feed item
									_process(e, data.query.results.channel[i], options);
								}
							} else {
	
								// Single location only
								_process(e, data.query.results.channel, options);
							}

							// Optional user callback function
							if ($.isFunction(fn)) fn.call(this,$e);

						} else {
							if (options.showerror) console.log('Weather information unavailable');
						}
					},
					error: function(data) {
						if (options.showerror) console.log('Weather erreur');
					}
				});				
			};
		
			// Function to each feed item
			var _process = function(e, feed, options) {
				var $e = $(e);

				// Check for invalid location
				if (feed.description != 'Yahoo! Weather Error') {

					// Format feed items
					var wd = feed.wind.direction;
					if (wd>=348.75&&wd<=360){wd="N"};if(wd>=0&&wd<11.25){wd="N"};if(wd>=11.25&&wd<33.75){wd="NNE"};if(wd>=33.75&&wd<56.25){wd="NE"};if(wd>=56.25&&wd<78.75){wd="ENE"};if(wd>=78.75&&wd<101.25){wd="E"};if(wd>=101.25&&wd<123.75){wd="ESE"};if(wd>=123.75&&wd<146.25){wd="SE"};if(wd>=146.25&&wd<168.75){wd="SSE"};if(wd>=168.75&&wd<191.25){wd="S"};if(wd>=191.25 && wd<213.75){wd="SSW"};if(wd>=213.75&&wd<236.25){wd="SW"};if(wd>=236.25&&wd<258.75){wd="WSW"};if(wd>=258.75 && wd<281.25){wd="W"};if(wd>=281.25&&wd<303.75){wd="WNW"};if(wd>=303.75&&wd<326.25){wd="NW"};if(wd>=326.25&&wd<348.75){wd="NNW"};
					var wf = feed.item.forecast[0];
		
					console.log(feed);
					$('.meteolocation').html( feed.location.city );
					

				} 
				
			};

			// Get time string as date
			var _getTimeAsDate = function(t) {
		
				d = new Date();
				r = new Date(d.toDateString() +' '+ t);

				return r;
			};

		});
	};

})(jQuery);
