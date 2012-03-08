import QtQuick 1.0
import com.nokia.meego 1.0


Item {

    property alias title: header.text

    property alias dimension1: a.riskLevel
    property alias dimension2: b.riskLevel
    property alias dimension3: c.riskLevel
    property alias dimension4: d.riskLevel

    function open() {
        _menu.open()
    }

    function close() {
        _menu.close()
    }

    Menu {

        id: _menu


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

                Indicator {
                    id: a
                    name: 'Trustworthiness'
                }
                Indicator {
                    id: b
                    name: 'Vendor reliability'
                }
                Indicator {
                    id: c
                    name: 'Privacy'
                }
                Indicator {
                    id: d
                    name: 'Child safety'
                }

                Button {
                    text: 'Details'
                    onClicked: {
                        // update values
                        reportPage.setValues( [ a.riskLevel , b.riskLevel, c.riskLevel, d.riskLevel] );
                        pageStack.push( reportPage );
                        // todo: cleanup
                        _menu.close();
                    }
                }
            }
        }
    }

}
