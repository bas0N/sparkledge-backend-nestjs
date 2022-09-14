"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendMessage = void 0;
const sendMessage = async (userId, userEmail, documentId, reportId, reportCategory, reportContent, currentDate) => {
    const messageText = `REPORT #${reportId},\n timestamp: ${currentDate},\n 
  REPORTED BY: email: ${userEmail}, id:${userId},\n
  REPORTED DOCUMENT ID: ${documentId},\n
  REPORT CATEGORY: ${reportCategory},\n
  REPORT CONTENT: ${reportContent}
  `;
    const body = { channel: 'sparkledge-reports', text: messageText };
    try {
        const res = await fetch('https://slack.com/api/chat.postMessage', {
            method: 'post',
            body: JSON.stringify(body),
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${process.env.SLACK_BOT_KEY}`,
            },
        });
        return res;
    }
    catch (err) {
        console.log(err);
    }
};
exports.sendMessage = sendMessage;
//# sourceMappingURL=slackBot.js.map