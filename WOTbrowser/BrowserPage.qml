/********
* A prototype of web browser integrating the Web of Trust service
* into the browsing experience.
******/

import QtQuick 1.1
import com.nokia.meego 1.0

import QtWebKit 1.0

import 'wot.js' as ValidationService

import "wot"


Page {

    tools: commonTools

    function back() {
        browser.back.trigger()
    }

    Item {

        id: top
        anchors.top: parent.top
        anchors.left: parent.left

        width: parent.width
        height: url.height

        TextField {
            id : url
            width: 0.8 * parent.width
            text: browser.url
            placeholderText: 'http://www.example.com/'

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

    }

    Flickable {

        id: flick

        anchors.top: top.bottom

        width: parent.width
        height: parent.height - top.height

        contentWidth: browser.width
        contentHeight: browser.height

        pressDelay: 200

        WebView {
            id : browser

            url : 'http://www.google.com/'

            preferredWidth: flick.width
            preferredHeight: flick.height

            // focus: true

            javaScriptWindowObjects: QtObject {
                WebView.windowObjectName: "_qml"

                function display(wotdata) {
                    demo.title = wotdata.target;
                    demo.dimension1 = wotdata[0][0];
                    demo.dimension2 = wotdata[1][0];
                    demo.dimension3 = wotdata[2][0];
                    demo.dimension4 = wotdata[4][0];
                    demo.open();
                }

                function debug(a) {
                    console.log(a);
                }
            }


            // when the page has been loaded, execute the javascript
            onLoadFinished: runSystem()

            function runSystem() {
                // update url
                url.text = browser.url

                browser.evaluateJavaScript( ValidationService.jsLib );
            }

        }
    }

    ScrollDecorator {
        flickableItem: flick
    }

    Display {
        id: demo
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
