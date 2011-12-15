/********
* A prototype of web browser integrating the Web of Trust service
* into the browsing experience.
******/

import QtQuick 1.1
import com.nokia.meego 1.0

import QtWebKit 1.0

Page {

    tools: commonTools

    TextField {
        id : url
        width: 0.8 * parent.width
        text: 'http://hiit.fi'
    }

    Button {
        anchors.left: url.right
        anchors.top: url.top
        width: 0.2 * parent.width
        text: qsTr("Go")
        onClicked: {

            var target = url.text
            if( target.substring(0,7) != 'http://') {
                target = 'http://' + target
            }

            // validate url via WOT
            var serviceURL = 'http://api.mywot.com/0.4/public_link_json?hosts='
            var targetURL = serviceURL + target + '/'
            var request = new XMLHttpRequest()

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
                        canOpen = false;
                    }

                    if( canOpen ) {
                        browser.url = target
                    } else {
                        // warn user
                        warning.open()
                    }
                }
            }

            request.open( 'GET', targetURL )
            request.send()
        }
    }

    WebView {
        id : browser

        url : 'http://hiit.fi/'

        width: parent.width

        anchors.top: url.bottom
        anchors.right: parent.right
        anchors.left: parent.left
        anchors.bottom: parent.bottom
    }

    Dialog {
        id: warning
        title : Label { text : 'Can not open the page'; color: "white" }
        content : Label { text : 'The page you requested is considered harmful by the Web of Trust. I will not open the page for you.'; color: "white"; width: parent.width - 20 }
        buttons: Button { text : 'Close'; onClicked: warning.accept() }
    }

}
