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


    Item {

        anchors.top: top.bottom
        anchors.right: parent.right
        anchors.left: parent.left
        anchors.bottom: parent.bottom

        width: parent.width
        // FIXME: This won't scale nicely
        height: parent.height - top.height

        Flickable {

            id: flick

            height: parent.height
            width: parent.width

            contentWidth: Math.max( browser.width , flick.width )
            contentHeight: Math.max( browser.height , flick.height )

            pressDelay: 200

            WebView {
                id : browser

                url : 'http://hiit.fi/'

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
    }

    Menu {
        id: demo
        property alias title: header.text
        property alias dimension1: a.riskLevel
        property alias dimension2: b.riskLevel
        property alias dimension3: c.riskLevel
        property alias dimension4: d.riskLevel
        MenuLayout {
            Flow {
                flow: Flow.TopToBottom
                spacing: 6
                Label {
                    id: header
                    text: '!! Header'
                    color: 'green'
                    font.pixelSize: 30
                }
                WOTIcon {
                    id: a
                    name: 'Trustworthiness'
                }
                WOTIcon {
                    id: b
                    name: 'Vendor reliability'
                }
                WOTIcon {
                    id: c
                    name: 'Privacy'
                }
                WOTIcon {
                    id: d
                    name: 'Child safety'
                }

                Button {
                    text: 'Details'
                    onClicked: {
                        // update values
                        console.log( a.riskLevel )
                        reportPage.setValues( [ a.riskLevel , b.riskLevel, c.riskLevel, d.riskLevel] );
                        pageStack.push( reportPage );
                        demo.close();
                    }
                }
            }
        }
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
