import QtQuick 1.0

import com.nokia.meego 1.0

Dialog {
        id: warning
        title : Label { text : 'Can not open the page'; color: "white" }
        content : Label { text : 'The page you requested is considered harmful by the Web of Trust. I will not open the page for you.'; color: "white"; width: parent.width - 20 }

        buttons: Item {
            Button { text : 'Do not continue'; onClicked: warning.accept() }
            Button { text : 'Continue anyway'; onClicked: warning.reject() }
        }
    }
