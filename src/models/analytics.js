const chats = require("./chats");
const users = require("./users");
const axios = require("axios");
const admin = require("firebase-admin");
const db = admin.firestore();

/**
 * Asynchronously fetches and sets chat and user analytics data for a given date in Firestore.
 * If no date is provided, the current date is used.
 *
 * @async
 * @function
 * @param {Date} date - The date to fetch and set analytics for.
 * @returns {Object} An object containing the analytics data that was set in Firestore.
 *
 * @example
 * const analytics = await setAnalytics(new Date());
 * console.log(analytics);
 */
exports.setAnalytics = async function (date) {
  const day = new Date(date);
  day.setHours(0, 0, 0, 0);
  const chats = await getChatsAnalytics(date);
  const users = await getUserAnalytics(date);
  console.log("analytics are fetched");
  const todaysAnalytics = {
    date: day.toISOString(),
    userEngagement: {
      totalMessagesSent: chats.totalMessages,
      chatsToday: chats.totalChats,
      averageMessagesPerUser: chats.totalMessages / users.usersToday,
      averageConversationDuration: chats.averageConversationDuration,
    },
    userSatisfaction: {
      averageLikesPerChat: chats.averageLikesPerChat,
      averageDislikesPerChat: chats.averageDislikesPerChat,
    },
    usage: {
      totalUsers: users.totalUsers,
      activeUsers: users.usersToday,
    },
    performance: {
      averageResponseTime: chats.averageResponseTime,
      errorRate: chats.errorRate,
      averageMessagesPerChat: chats.averageMessagesPerChat,
    },
    userLocation: users.ipAddresses,
    userDevices: users.deviceTypePercentages,
  };

  console.log(todaysAnalytics);

  const docRef = db.collection("dailyAnalytics").doc(`${day.toISOString()}`);
  try {
    await docRef.set(todaysAnalytics);
    console.log("updated successfuly");
  } catch (err) {
    console.log(err);
  }
  return todaysAnalytics;
};


/**
 * Asynchronously retrieves the analytics data for the past 7 days from Firestore.
 *
 * @async
 * @function
 * @returns {Array} An array containing the analytics data for the past 7 days, in reverse chronological order.
 *
 * @example
 * const weeklyAnalytics = await getWeekly();
 * console.log(weeklyAnalytics);
 */

exports.getWeekly = async function () {
  let collectionRef = db.collection("dailyAnalytics");
  let query = collectionRef.orderBy("date").limitToLast(7);
  try {
    let querySnapshot = await query.get();
    let documents = querySnapshot.docs.map((doc) => doc.data()).reverse();
    console.log(documents);
    return documents;
  } catch (err) {
    console.log(err);
    return "bleh";
  }
};

/**
 * Asynchronously fetches user analytics data for a given date.
 *
 * @async
 * @function
 * @param {Date} date - The date to fetch user analytics for.
 * @returns {Object} An object containing various user analytics data.
 *
 * @example
 * const analytics = await getUserAnalytics(new Date());
 * console.log(analytics);
 */
async function getUserAnalytics(date) {
  // Fetch user data for the given date
  const usersToday = await users.getUsersByDay(date);
  // Fetch the total number of users
  const totalUsers = await users.getUserCount();
  console.log("users are fetched");

  // Initialize variables for storing analytics data
  let totalChats = 0;
  let runningTotalMessages = 0;
  let totalMessages = 0;
  let runningDeviceTypeCounts = {};
  const deviceTypePercentages = {};
  const ipAddresses = [];

  // Process each user's data
  usersToday.forEach((user, index) => {
    // Calculate running averages and totals
    runningTotalMessages = calculateRunningAverage(
      runningTotalMessages,
      user.message_count,
      index
    );
    totalMessages += user.message_count;
    totalChats += user.chat_ids ? user.chat_ids.length : 0;
    runningDeviceTypeCounts[user.device_type] =
      (runningDeviceTypeCounts[user.device_type] || 0) + 1;

    // Calculate device type percentages
    for (const type in runningDeviceTypeCounts) {
      deviceTypePercentages[type] =
        ((runningDeviceTypeCounts[type] / (index + 1)) * 100).toFixed(2) + "%";
    }

    // Store user's IP address
    ipAddresses.push(user.ip);
  });

  // Fetch the country for each IP address
  const countries = await Promise.all(
    ipAddresses
      .filter((ipAddress) => ipAddress)
      .map(async (ipAddress) => {
        try {
          const response = await axios.get(
            `https://api.country.is/${ipAddress}`
          );
          return response.data.country;
        } catch (err) {
          return "other";
        }
      })
  );

  // Count the occurrence of each country
  let counts = {};
  countries.forEach((country) => {
    counts[country] = (counts[country] || 0) + 1;
  });

  // Calculate the percentage for each country
  let percentages = {};
  for (let country in counts) {
    percentages[country] = (counts[country] / countries.length) * 100;
  }

  // Prepare the analytics data
  let analytics = {
    usersToday: usersToday.length,
    averageChatsPerUser: totalChats / usersToday.length,
    deviceTypePercentages,
    ipAddresses: percentages,
    totalMessages: totalMessages,
    totalUsers: totalUsers,
  };
  console.log("users analyzed");
  return analytics;
}

/**
 * Asynchronously fetches chat analytics data for a given date.
 *
 * @async
 * @function
 * @param {Date} date - The date to fetch chat analytics for. If no date is provided, the current date is used.
 * @returns {Object} An object containing various chat analytics data.
 *
 * @example
 * const analytics = await getChatsAnalytics(new Date());
 * console.log(analytics);
 */
async function getChatsAnalytics(date) {
  let today = null;
  let chatsToday = [];
  console.log("chats are being retrieved");
  if (!date) {
    today = new Date().setHours(0, 0, 0, 0);
    chatsToday = await chats.getChatsByDay(today.getTime());
  } else {
    chatsToday = await chats.getChatsByDay(date);
    today = new Date(date);
  }
  console.log("cahts are retrieved");

  const tomorrow = new Date(today);
  const todayAndTomorrowRange = { start: today, end: tomorrow };
  tomorrow.setDate(tomorrow.getDate() + 1);
  let runningAverageConversationDuration = 0;
  let runningAverageLikes = 0;
  let runningAverageDislikes = 0;
  let runningAverageResponseTime = 0;
  let runningAverageErrorRate = 0;
  let runningTotalMessages = 0;
  let totalMessages = 0;
  chatsToday.forEach((chat, index) => {
    const messagesTodayAndTomorrow = chat.messages.filter((message) => {
      return (
        message.time >= todayAndTomorrowRange.start &&
        message.time < todayAndTomorrowRange.end
      );
    });
    const numMessages = messagesTodayAndTomorrow.length;
    totalMessages += numMessages;
    runningAverageConversationDuration = calculateRunningAverage(
      runningAverageConversationDuration,
      chat.totalConversationDuration,
      index
    );
    runningTotalMessages = calculateRunningAverage(
      runningTotalMessages,
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

  const analytics = {
    totalChats: chatsToday.length,
    totalMessages: totalMessages,
    averageConversationDuration: new Date(runningAverageConversationDuration)
      .toISOString()
      .substr(11, 8),
    averageLikesPerChat: runningAverageLikes,
    averageDislikesPerChat: runningAverageDislikes,
    averageMessagesPerChat: runningTotalMessages,
    averageResponseTime: new Date(runningAverageResponseTime)
      .toISOString()
      .substr(11, 8),
    errorRate: runningAverageErrorRate.toFixed(1),
  };
  console.log("chats analyzed");

  return analytics;
}

//running average so the variables dont overflow

function calculateRunningAverage(runningAverage, newValue, index) {
  return (runningAverage * index + newValue) / (index + 1);
}

// this is a sample function to change/ edit a field in firebase

async function addDateFieldToDocuments() {
  const collectionRef = db.collection("dailyAnalytics");
  try {
    const snapshot = await collectionRef.get();

    snapshot.forEach((doc) => {
      const documentId = doc.id;
      const documentData = doc.data();

      // Add a new field 'date' that is the same as the document ID
      documentData.date = documentId;

      // Update the document with the new data
      collectionRef.doc(documentId).set(documentData), { merge: true };
    });

    console.log("success");
  } catch (err) {
    console.log(err);
  }
}
