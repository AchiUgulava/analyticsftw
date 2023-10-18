const chats = require("./chats");
const users = require("./users");

exports.getUserAnalytics = async function (date) {
  const usersToday = await users.getUsersByDay(date);
  let totalChats = 0;
  let runningTotalMessages = 0;
  let totalMessages = 0;
  let runningDeviceTypeCounts = {};
  const deviceTypePercentages = {};
  const ipAddresses = []

  usersToday.forEach((user, index) => {
      runningTotalMessages = calculateRunningAverage(runningTotalMessages, user.message_count, index);
      totalMessages += user.message_count;
      totalChats += user.chat_ids.length;
    runningDeviceTypeCounts[user.device_type] = (runningDeviceTypeCounts[user.device_type] || 0) + 1;
   
    for (const type in runningDeviceTypeCounts) {
      deviceTypePercentages[type] = ((runningDeviceTypeCounts[type] / (index + 1)) * 100).toFixed(2) + '%';
    }

     ipAddresses.push(user.ip)


  });
  let analytics = {
    runningAverages: {
      averageUsersPerDay: usersToday.length,
      averageChatsPerUser: totalChats/usersToday.length,
      averageMessagesPerChat: runningTotalMessages,
      deviceTypePercentages,
      ipAddresses,
      totalMessages: totalMessages,
    },
  };

  console.log(analytics);
};

// Function to calculate the running average


exports.getChatsAnalytics = async function (date) {
  let today = null;
  let chatsToday = [];
  if (!date) {
    today = new Date().setHours(0, 0, 0, 0);
    chatsToday = await chats.getChatsByDay(today.getTime());
  } else {
    chatsToday = await chats.getChatsByDay(date);
    today = new Date(date);
  }
  const tomorrow = new Date(today);
  const todayAndTomorrowRange = { start: today, end: tomorrow };
  tomorrow.setDate(tomorrow.getDate() + 1);
  let runningAverageConversationDuration = 0;
  let runningAverageMessagesPerChat = 0;
  let runningAverageLikes = 0;
  let runningAverageDislikes = 0;
  let runningAverageResponseTime = 0;
  let runningAverageErrorRate = 0;

  chatsToday.forEach((chat, index) => {
    const messagesTodayAndTomorrow = chat.messages.filter((message) => {
      return (
        message.time >= todayAndTomorrowRange.start &&
        message.time < todayAndTomorrowRange.end
      );
    });
    const numMessages = messagesTodayAndTomorrow.length;

    runningAverageConversationDuration = calculateRunningAverage(
      runningAverageConversationDuration,
      chat.totalConversationDuration,
      index
    );
    runningAverageMessagesPerChat = calculateRunningAverage(
      runningAverageMessagesPerChat,
      numMessages,
      index
    );
    runningAverageLikes = calculateRunningAverage(
      runningAverageLikes,
      chat.likeCount,
      index
    );
    runningAverageDislikes = calculateRunningAverage(
      runningAverageDislikes,
      chat.dislikeCount,
      index
    );
    runningAverageResponseTime = calculateRunningAverage(
      runningAverageResponseTime,
      chat.averageResponseTime,
      index
    );
    runningAverageErrorRate = calculateRunningAverage(
      runningAverageErrorRate,
      chat.errorRate,
      index
    );
  });

  const likeDislikeRatio = (
    runningAverageLikes / (runningAverageDislikes || 1)
  ).toFixed(1);

  const analytics = {
    runningAverages: {
      averageConversationDuration: new Date(runningAverageConversationDuration)
        .toISOString()
        .substr(11, 8),
      averageMessagesPerChat: runningAverageMessagesPerChat,
      averageLikesPerChat: runningAverageLikes,
      averageDislikesPerChat: runningAverageDislikes,
      averageResponseTime: new Date(runningAverageResponseTime)
        .toISOString()
        .substr(11, 8),
      errorRate: runningAverageErrorRate.toFixed(1),
      likeDislikeRatio,
    },
  };

  console.log(analytics);


};
function calculateRunningAverage(runningAverage, newValue, index) {
    return ((runningAverage * index) + newValue) / (index + 1);
  }