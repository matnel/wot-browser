import QtQuick 1.0
import com.nokia.meego 1.0

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
                    reportPage.setValues( [ a.riskLevel , b.riskLevel, c.riskLevel, d.riskLevel] );
                    pageStack.push( reportPage );
                    demo.close();
                }
            }
        }
    }
}
