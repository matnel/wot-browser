import QtQuick 1.0

import com.nokia.meego 1.0

Item  {

    property alias label: label.text
    property alias value: value.value

    height: 75
    width: parent.width

    Label {
        id: label
        text: '!! Label'
    }

    Slider {
        id: value

        anchors.top: label.bottom
        anchors.topMargin: 5

        valueIndicatorText: ''

        // hardcoded values
        property variant _wot_text : ['Very poor', 'Poor', 'Unsatisfactory', 'Good', 'Excellent']

        onValueChanged: {
            var v = Math.floor( value.value  / 20 )
            value.valueIndicatorText = value._wot_text[v]
        }

        value : 50

        minimumValue: 0
        maximumValue: 100
        stepSize: 1
        valueIndicatorVisible: true
    }

}
