import QtQuick 1.0

import com.nokia.meego 1.0

Page {

    tools: commonTools
    anchors.margins: UiConstants.DefaultMargin

    Flow {

        anchors.fill: parent
        anchors.margins: UiConstants.DefaultMargin
    Label {
        id: inhope_label
        width: 0.6 * parent.width
        text: 'This page contains illegal content'
    }

    Switch {
        id : inhope
        anchors.left: inhope_label.right
    }

    TextField {
        visible: inhope.checked
        id: inhope_spesify
        placeholderText: 'Please spesify'
    }

    Label {
        text: ' '
    }

    Label {
        text : 'Help Web of Trust by rating this page'
    }

    Label {
        text: ' '
    }

    Label {
        text: 'General trustworthiness'
    }

    Slider {
        minimumValue: 0
        maximumValue: 100
        stepSize: 1
        valueIndicatorVisible: true
    }

    Label {
        text: 'Privacy'
    }

    Slider {
        minimumValue: 0
        maximumValue: 100
        stepSize: 1
        valueIndicatorVisible: true
    }

    Label {
        text: 'Child safetyness'
    }

    Slider {
        minimumValue: 0
        maximumValue: 100
        stepSize: 1
        valueIndicatorVisible: true
    }

    Button {
        text: 'Send report'
        onClicked: pageStack.pop();
    }

    }

}
