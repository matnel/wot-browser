import QtQuick 1.0

import com.nokia.meego 1.0

Item {

    property alias name: label.text
    property int riskLevel: 1

    height: Math.max( label.height, icon.height )
    width: parent.width

    onRiskLevelChanged: {
        var i = Math.floor( riskLevel / 20 );
        icon.source = icon._url + i + icon._extension
    }

    Label {
        id: label
        text: '!! Label'
    }

    Image {
        id: icon

        anchors.left: parent.right
        anchors.rightMargin: 7
        anchors.top: label.top

        property string _url : 'http://api.mywot.com/widgets/images/'
        property string _extension : '.png'
        width: 16
        height: 16
        source : _url + '1' + _extension
    }

}
