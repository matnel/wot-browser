import QtQuick 1.1
import com.nokia.meego 1.0

import com.nokia.extras 1.1

import "wot"

PageStackWindow {
    id: appWindow

    initialPage: mainPage

    BrowserPage {
        id: mainPage
    }

    Reporting {
        id: reportPage
     }

    ToolBarLayout {
         id: commonTools
         visible: true
         ToolIcon { iconId: "toolbar-back"; visible: pageStack.currentPage != mainPage; onClicked: { myMenu.close(); pageStack.pop(); } }
         ToolIcon { iconId: "toolbar-back"; visible: pageStack.currentPage == mainPage; onClicked:  { mainPage.back() } }
         ToolIcon { iconId: "toolbar-view-menu"; onClicked: (myMenu.status == DialogStatus.Closed) ? myMenu.open() : myMenu.close() }
     }

    Menu {
        id: myMenu
        MenuLayout {
            MenuItem {
                visible: pageStack.currentPage != reportPage
                text: "Report this page"
                onClicked: { pageStack.push( reportPage ); myMenu.close() }
            }
            MenuItem {
                text: 'About'
                onClicked: about.open()
            }
            MenuItem {
                text: 'Close app'
                onClicked: Qt.quit()
            }
        }
    }

    QueryDialog {
        id: about
        titleText: 'About this application'
        message: 'This is a prototype of a browser integrating the Web of Trust as part of the browsing experience. Application is developed as a proof of concept only and is not in product maturity. Created in Helsinki Institute for Information Technology HIIT by Matti Nelimarkka <ext-matti.nelimarkka@nokia.com>.'
        acceptButtonText: 'Ok'
    }

    InfoBanner {
        id : info
        anchors.top: parent.top
        text: '!!'
    }

}
