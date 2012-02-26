/*
	Copyright © 2011  WOT Services Oy <info@mywot.com>
*/
if (!wotjquery) {
	jQuery.noConflict();
}

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
			var m = /^(\w+):\/\/((\w+)(:(\w+))?@)?([^:\/\?&=#\[\]]+|\[[^\/\?&=#\[\]]+\])\.?(:(\d+))?(.*)$/.exec(url);
			if (m && m[6] != null) {
				return jQuery.trim(m[6].toLowerCase());
			}
		}
		return null;
	};

	var getsize = function() {
		var cx = 0;
		var cy = 0;
	
		if (typeof(window.innerWidth) == "number") {
			cx = window.innerWidth;
			cy = window.innerHeight;
		} else if (document.documentElement &&
				(document.documentElement.clientWidth ||
				 document.documentElement.clientHeight)) {
			cx = document.documentElement.clientWidth;
			cy = document.documentElement.clientHeight;
		} else if (document.body &&
				(document.body.clientWidth ||
				 document.body.clientHeight)) {
			cx = document.body.clientWidth;
			cy = document.body.clientHeight;
		}
	
		return { width: cx, height: cy };
	};
	
	var getscroll = function() {
		var x = 0;
		var y = 0;
	
		if (typeof(window.pageYOffset) == 'number') {
			x = window.pageXOffset;
			y = window.pageYOffset;
		} else if (document.body &&
				(document.body.scrollLeft ||
				 document.body.scrollTop)) {
			x = document.body.scrollLeft;
			y = document.body.scrollTop;
		} else if (document.documentElement &&
				(document.documentElement.scrollLeft ||
				 document.documentElement.scrollTop)) {
			x = document.documentElement.scrollLeft;
			y = document.documentElement.scrollTop;
		}
	
		return { x: x, y: y };
	};

	/* Styles */
	var addstyle = function() {
		var style = "";

		for (var i = 0; i < ratings.length; ++i) {
	 		style += " .wot-r" + i + "{ " +
				"background: url(\'" + wotbase + "/images/" + i +
				rating_options.imgext + "\') bottom right no-repeat; }";
		}

		jQuery("head").append("<style type=\"text/css\"> " +
			".wot-icon { " +
				"display: inline; " +
				"height: 16px; " +
				"padding-top: 3px; " +
				"padding-left: 16px; " +
				"width: 16px; " +
			"}" + style + "</style>");
	};

	/* Tooltip */
	var gettippos = function(e, l) {
		var basey = l.offset().top;

		/* IE 7 computes the element position wrong sometimes, keep near
			the cursor */
		if (basey > e.pageY + l.height()) {
			basey = e.pageY - l.height() / 2;
		}

		var x = e.pageX - tooltip_options.offset_x;
		var y = basey - tooltip_options.height -
					tooltip_options.offset_y;

		var sz = getsize();
		var sc = getscroll();

		if (x < sc.x) {
			/* Align on the left edge */
			x = sc.x;
		} else if (sz.width > 0 &&
				x - sc.x + tooltip_options.width > sz.width) {
			/* Align on the right edge */
			x = sz.width + sc.x - tooltip_options.width -
					tooltip_options.scrollbar_x;
		}
		if (y < sc.y) {
			/* Move to the bottom */
			y = basey + l.height() + tooltip_options.offset_y;
		}

		return { x: x, y: y };
	};

	var showtip = function(x, y, target) {
		if (!tooltip) {
			return;
		}
		var appearance = ++tooltip_status.appearance;
		window.setTimeout(function() {
			if (tooltip_status.hovering && !tooltip_status.ontip &&
					appearance == tooltip_status.appearance) {
				tooltip.css("top",  y + "px");
				tooltip.css("left", x + "px");
				tooltip.attr("href", tooltip_options.linkbase +
					encodeURIComponent(target));

				if (tooltip.css("display") != "block") {
					if (jQuery.browser.msie) {
						tooltip.css("display", "block");
					} else {
						tooltip.fadeIn(tooltip_options.fade_speed);
					}
				}
			}
		}, tooltip_options.delay_in);
	};

	var hidetip = function() {
		if (!tooltip) {
			return;
		}
		var appearance = tooltip_status.appearance;
		window.setTimeout(function() {
			if (!tooltip_status.hovering && tooltip.css("display") != "none" &&
					appearance == tooltip_status.appearance) {
				if (jQuery.browser.msie) {
					tooltip.css("display", "none");
				} else {
					tooltip.fadeOut(tooltip_options.fade_speed);
				}
				tooltip_status.ontip = false;
			}
		}, tooltip_options.delay_out);
	};


	var addtooltip = function() {
		if (!tooltip_options.enabled) {
			return;
		}

		jQuery("body").append("<a id=\"wot-tooltip\" class=\"" +
				rating_options.exclass + "\" style=\"" +
			"background: url(\'" + tooltip_options.bg_image +
				rating_options.imgext + "\') top left no-repeat; " +
			"border: 0; " +
			"cursor: pointer; " +
			"display: none; " +
			"position: absolute; " +
			"height: "  + tooltip_options.height + "px; " +
			"width: "   + tooltip_options.width  + "px; " +
			"z-index: " + tooltip_options.zindex + ";\"></a>");
	
		tooltip = jQuery("#wot-tooltip");

		if (tooltip) {
			tooltip.hover(function(e) {
				tooltip_status.ontip = tooltip_status.hovering = true;
			},
			function(e) {
				tooltip_status.ontip = tooltip_status.hovering = false;
				hidetip();
			});
		}
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
			// $("<div class=\'" + c + "\'><a href=\'\'>Uuuu</a></div>");
			var icon = $("<big><strong>WOT</strong></big>");

			// ** changed by Matti, mobile OS spesific content ** //
			icon.click( function() {
				_qml.display( data[h] );
			} )
			koira = icon;
			var linkhtml = l.html();
			var iconhtml = icon.html();
			var t = $('<span>');
			t.append( l.clone() );
			t.append( icon );
			l.replaceWith( t );
		});
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

		if (rating_options.updateinterval > 0) {
			window.setTimeout(updatelinks, rating_options.updateinterval);
		}
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
	addtooltip();
	updatelinks();
});

