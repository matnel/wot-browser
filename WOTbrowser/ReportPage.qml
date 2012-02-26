import QtQuick 1.0

import com.nokia.meego 1.0

Page {

    tools: commonTools
    anchors.margins: UiConstants.DefaultMargin

    function setValues(list) {
        general.value = list[0]
        vendor.value = list[1]
        privacy.value = list[2]
        child.value = list[3]
    }

    Flow {

        anchors.fill: parent
        anchors.margins: UiConstants.DefaultMargin

        spacing: 6

        Label {
            color: 'green'
            font.pixelSize: 30
            text : 'Rate this page:'
        }

        WOTSlider {
            id: general
            label: 'General trustworthiness'
        }

        WOTSlider {
            id: vendor
            label: 'Vendor reliability'
        }

        WOTSlider {
            id: privacy
            label: 'Privacy'
        }

        WOTSlider {
            id: child
            label: 'Child safetyness'
        }

        Button {
            text: 'Send report'
            onClicked: {
                pageStack.pop();
                // clear page
                reportPage.setValues([50,50,50,50]);
            }
        }

    }

}
