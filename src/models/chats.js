const admin = require("firebase-admin");
const db = admin.firestore();

function getCurrentTimestamp() {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  return now.getTime();
}

exports.getTodaysChats = async function () {
  const query = db.collection("chats");
  const today = getCurrentTimestamp();

  try {
    const doc = await query.where("lastAccessed", ">", today).get();

    if (!doc) {
      return { message: "No such document!" };
    } else {
      const chatsArray = [];
      doc.forEach((user) => {
        chatsArray.push({ id: user.id, ...user.data() });
      });
      console.log(chatsArray);
      return chatsArray;
    }
  } catch (err) {
    return err;
  }
};

exports.getChatCount = async function () {
  const query = db.collection("users");
  try {
    const snapshot = await query.get();
    const count = snapshot.size;
    console.log(count);
    return count;
  } catch (err) {
    console.log(err);
    return err;
  }
};

// Get users for March 1, 2023
// let date = new Date(2023, 2, 1);   Months are 0-indexed in JavaScript, so 2 represents March
exports.getChatsByDay = async function (date) {
  // Create a query against the collection
  const query = db.collection("chats");
  console.log("cahts called");

  // Start and end timestamps for the day
  const start = new Date(date);
  start.setHours(0, 0, 0, 0);
  const end = new Date(date);
  end.setHours(23, 59, 59, 999);

  // Convert to Firestore timestamps
  const startTimestamp = start.getTime();
  const endTimestamp = end.getTime();

  try {
    // Query for users who logged in on the specific day
    const snapshot = await query
      .where("lastAccessed", ">=", startTimestamp)
      .where("lastAccessed", "<=", endTimestamp)
      .get();
    console.log("snapshot recieved called");

    // Get user data from the documents
    const chats = snapshot.docs.map((doc) => doc.data());
    return chats;
  } catch (err) {
    console.log(err);
    return err;
  }
};
