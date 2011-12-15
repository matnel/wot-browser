import QtQuick 1.1
import com.nokia.meego 1.0

PageStackWindow {
    id: appWindow

    initialPage: mainPage

    MainPage {
        id: mainPage
    }

    ReportPage{
        id: reportPage
     }

    ToolBarLayout {
         id: commonTools
         visible: true
         ToolIcon { iconId: "toolbar-back"; onClicked: { myMenu.close(); pageStack.pop(); } }
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
            }
        }
    }

}
