.pragma library

function validate(url , callbackFunction) {

    // validate url via WOT
    var serviceURL = 'http://api.mywot.com/0.4/public_link_json?hosts='
    var targetURL = serviceURL + url + '/'
    var request = new XMLHttpRequest()

    request.open( 'GET', targetURL )

    request.onreadystatechange = function() {
        if( request.readyState == XMLHttpRequest.DONE ) {
            var canOpen = true
            var data = JSON.parse( request.responseText )

            var firstKey = ''

            for( var i in data ) {
                firstKey = i
            }

            // WOT is stange, api indexes 0, 1, 2, 4
            for( var j = 0; j < 3; j++ ) {
                if( data[firstKey][j][0] < 40 ) {
                    canOpen = false
                }
            }

            if( data[firstKey][4][0] < 40 ) {
                canOpen = false
            }

            callbackFunction( { siteOk : canOpen , site : url } )
        }
    }

    request.send()
    return request

}
