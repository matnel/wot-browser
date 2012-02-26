/* Copyright Â© 2008  WOT Services Oy <info@mywot.com> */
var wotprotocol = (document.location.protocol == "https:") ? "https://" : "http://";
var wotbase = wotprotocol + "api.mywot.com/widgets";
var injectbase = wotprotocol + "humanisti.fixme.fi/~matnel/wot";
var wotinject = function(src) {
        var lib = document.createElement( 'script' );
        lib.type = "text/javascript";
        lib.src = injectbase + "/" + src + ".js";
	document.body.appendChild(lib);
};

var wotjquery = typeof(jQuery) != "undefined";

function execute() {
  if( !wotjquery ) wotinject("jquery");
  wotinject("ratingwidget");
  _qml.debug('Executed at ' + document.location.href);
}
