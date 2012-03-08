import QtQuick 1.0

import com.nokia.meego 1.0

QueryDialog {
        id: warning
        titleText : 'Page may be harmful!'
        message : 'The page you requested is considered harmful by the Web of Trust. Shall I proceed anyway?'
        acceptButtonText: 'No, do not open this page'
        rejectButtonText: 'Yes, continue anyway'
}
