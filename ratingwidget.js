/*
  Copyright (c) 2011  WOT Services Oy <info@mywot.com>
  Adapted for Qt use by Matti Nelimarkka, HIIT (ext-matti.nelimarkka@nokia.com).
*/

// if (!wotjquery) {
//	jQuery.noConflict();
// }

jQuery(document).ready(function() {

	/* Constants */
	var ratings = [ -1, 0, 20, 40, 60, 80 ];

	/* Options */
	var rating_options = {
		protocol:		wotprotocol,
		api:			"api.mywot.com/0.4/public_link_json?hosts=",
		application:	"0",
		exchildren:		"img",
		exclass:		"wot-exclude",
		hasrating:		"wothasrating",
		imgext:			".png",
		maxhosts:		100,
		maxlength:		2000,
		selector:		"a[href]",
		updateinterval:	0
	};

	var tooltip_options = {
		bg_image:		wotbase + "/images/view",
		delay_in:		200,
		delay_out:		2000,
		enabled:		true,
		fade_speed:		400,
		height:			28,
		linkbase:		"http://www.mywot.com/scorecard/",
		offset_x:		140 / 3,
		offset_y:		2,
		scrollbar_x:	12,
		width:			140,
		zindex:			100000
	};

	/* Globals */
	var tooltip_status = {
		appearance:	0,
		hovering:	false,
		ontip:		false
	};

	var tooltip;
	var loaded = {};
	var data = {};

	/* Helpers */
	var gethostname = function(url) {
		if (url) {
			// Google spesific stuff!
			if( /.*(google\.(com?\.[a-z]{2}|[a-z]{2,})|youtube\.com).*$/.test( window.location.href ) ) {

			// detect search results
			var t = /\/url\?q=(.*)?/.exec(url);
  			if (t && t[1] != null ) {
				url = t[1];
  			}

			// detect ads
			t = /\/aclk?.*adurl=(.*)?/.exec(url);
			if (t && t[1] != null ) {
                                url = t[1];
                        }

			// remove indicators from Google-sites (for demo)
			var g = /.*(google\.(com?\.[a-z]{2}|[a-z]{2,})|youtube\.com).*$/.test( url );
			if ( g ) {
				return "/";
			}
			}
			// end of Google spesific stuff
			
			// get domain
			var m = /^(\w+):\/\/((\w+)(:(\w+))?@)?([^:\/\?&=#\[\]]+|\[[^\/\?&=#\[\]]+\])\.?(:(\d+))?(.*)$/.exec(url);
			if (m && m[6] != null) {
				return jQuery.trim(m[6].toLowerCase());
			}
		}
		return null;
	};

	/* Styles */
	var addstyle = function() {
		var style = "";

		for (var i = 0; i < ratings.length; ++i) {
	 		style += " .wot-r" + i + "{ " +
				"background: url(\'" + wotbase + "/images/" + i + rating_options.imgext + "\'); background-repeat: no-repeat; }";
		}

		jQuery("head").append("<style type=\"text/css\"> " +
			".wot-icon { " +
				// "display: inline; " +
				// "margin-top: -12px;" +
				"height: 28px; " +
				"padding-top: 0px; " +
				"padding-left: 28px; " +
				"width: 28px; " +
			"}" + style + "</style>");
	};

	/* Ratings */
	var addratings = function() {
		jQuery(rating_options.selector).each(function(i) {
			var l = jQuery(this);

			if (l.attr(rating_options.hasrating) == "true" ||
					l.hasClass(rating_options.exclass) ||
					jQuery(rating_options.exchildren, l).length > 0) {
				return;
			}

			var h = gethostname(l.attr("href"));

			if (!h || !data[h]) {
				return;
			}

			var c = "wot-icon wot-r";

			// by default add zero

			if (!data[h][rating_options.application]) {
				c += "0";
			} else {
				for (var j = ratings.length - 1; j >= 0; --j) {
					if (data[h][rating_options.application][0] >= ratings[j]) {
						c += j;
						break;
					}
				}
			}

			l.attr(rating_options.hasrating, "true");

			var icon = $("<span class=\'" + c + "\'>&nbsp;</span>");
			// var icon = $("<big><strong>WOT</strong></big>");

			// ** changed by Matti, mobile OS spesific content ** //
			icon.click( function() {
				_qml.display( data[h] );
			} );
			var t = $('<span>');
			t.append( l.clone() );
			t.append( icon );
			l.replaceWith( t );
		});
		// tell UI that execution is done
		_qml.load_done();
	};

	var updateratings = function(hosts) {
		if (!hosts.length) {
			addratings();
			return;
		}
		jQuery.getJSON(rating_options.protocol + rating_options.api +
				hosts.join("/") + "/&callback=?",
			function(json) {
				jQuery.extend(data, json);
				addratings();
			});
	};

	var updatelinks = function() {
		var hosts = [];
		var length = 0;

		jQuery(rating_options.selector).each(function(i) {
			var l = jQuery(this);

			if (l.hasClass(rating_options.exclass) ||
					jQuery(rating_options.exchildren, l).length > 0) {
				return;
			}

			var h = gethostname(l.attr("href"));

			if (!h || loaded[h]) {
				return;
			}

			if (hosts.length >= rating_options.maxhosts ||
					length >= rating_options.maxlength) {
				updateratings(hosts);
				hosts = [];
				length = 0;
			}
			
			loaded[h] = true;

			if ((typeof(rating_options.include) == "undefined" ||
					rating_options.include.test(h)) &&
				(typeof(rating_options.exclude) == "undefined" ||
					!rating_options.exclude.test(h)) &&
				(typeof(rating_options.localhost) == "undefined" ||
					(h != rating_options.localhost &&
					 h != "www." + rating_options.localhost &&
					"www." + h != rating_options.localhost))) {
				var encoded = encodeURIComponent(h);
				hosts.push(encoded);
				length += encoded.length + 1;
			}
		});

		updateratings(hosts);
	};

	/* Options */
	if (typeof(wot_rating_options) != "undefined") {
		jQuery.extend(rating_options, wot_rating_options);
	}
	if (typeof(wot_tooltip_options) != "undefined") {
		jQuery.extend(tooltip_options, wot_tooltip_options);
	}

	/* Backwards compatibility */
	if (typeof(rating_options.include) == "undefined" &&
			typeof(wot_hostname_include) != "undefined") {
		rating_options.include = wot_hostname_include;
	}
	if (typeof(rating_options.exclude) == "undefined" &&
			typeof(wot_hostname_exclude) != "undefined") {
		rating_options.exclude = wot_hostname_exclude;
	}

	/* Determine localhost */
	if (typeof(rating_options.localhost) == "undefined" &&
			typeof(window.location.hostname) == "string" &&
			window.location.hostname.length > 0) {
		rating_options.localhost = window.location.hostname.toLowerCase();
	}

	/* Default excludes for the most popular hosting sites */
	if (typeof(rating_options.localhost) == "string" &&
			typeof(rating_options.exclude) == "undefined") {
		/* Blogger */
		if (/\.blogspot\.com$/i.test(rating_options.localhost)) {
			rating_options.exclude = /^(.+\.)*blogger\.com$/i;
		}
	}

	/* Browser-specific */
	if (jQuery.browser.msie && parseInt(jQuery.browser.version) < 7) {
		rating_options.imgext = ".gif";
	}

	/* Do stuff */
	addstyle();
	updatelinks();
});

