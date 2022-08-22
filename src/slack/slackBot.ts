export const sendMessage = async (
  userId: string,
  userEmail: string,
  documentId: string,
  reportId: string,
  reportCategory: string,
  reportContent: string,
  currentDate: Date,
) => {
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
  } catch (err) {
    console.log(err);
  }
};

// userId: string,
//   documentId: string,
//   userEmail: string,
//   reportCategory: string,
//   reportContent,
