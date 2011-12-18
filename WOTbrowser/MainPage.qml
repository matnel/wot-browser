/********
* A prototype of web browser integrating the Web of Trust service
* into the browsing experience.
******/

import QtQuick 1.1
import com.nokia.meego 1.0

import QtWebKit 1.0

import 'wot.js' as ValidationService

Page {

    tools: commonTools

    function back() {
        browser.back.trigger()
    }

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

            var request = ValidationService.validate( target, handleResponse )

        }

        function handleResponse( response ) {
            url.text = response.site
            if( response.siteOk ) {
                browser.url = response.site
            } else {
                warning.open();
            }
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

    Warning {
        id: warning

        function accepted() {
            // do nothing
        }

        function rejected() {
            browser.url = url.text
        }
    }

}
