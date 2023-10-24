const admin = require("firebase-admin");
const db = admin.firestore();

exports.getAllUsers = async function () {
  const doc = await db.collection("users").get();

  if (!doc) {
    return { message: "No such document!" };
  } else {
    const usersArray = [];
    doc.forEach((user) => {
      usersArray.push({ id: user.id, ...user.data() });
    });
    console.log(usersArray);
    return usersArray;
  }
};



exports.getFilteredUsers = async function(sortBy, page ) {
  try {
    const usersCollection = db.collection('users');
    let query = usersCollection;
    const direction = sortBy.asc ? "asc" : "desc"
    if (page > 0) {
      const startAfterDoc = await usersCollection
        .orderBy(sortBy.name, direction)
        // .limit((page) * 50)
        .get()
        .then((snapshot) => snapshot.docs[snapshot.docs.length - 1].data());
      // .then((snapshot) => snapshot.docs[snapshot.docs.length - 1].data().sortBy.value.name);
      console.log(startAfterDoc)
      query = query.orderBy(sortBy.name, direction).startAfter(startAfterDoc.email || startAfterDoc.id || startAfterDoc.name);
    } else {
      query = query.orderBy(sortBy.name, direction);
    }

    const querySnapshot = await query.get();
    // const querySnapshot = await query.limit(50).get();

    const usersArray = [];
    const count = querySnapshot.size
    querySnapshot.forEach((doc) => {
      usersArray.push({ id: doc.id, ...doc.data() });
    });
    
    console.log(usersArray);
    return {users:usersArray, count:count};
  } catch (error) {
    console.error(error);
    return [];
  }
};

function getCurrentTimestamp() {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  return now;
}

exports.getTodaysCount = async function () {
  const query = db.collection("users");
  const today = getCurrentTimestamp();

  try {
    const snapshot = await query.where("last_login", ">", today).get();
    const count = snapshot.size;
    console.log(count);
    return count;
  } catch (err) {
    return err;
  }
};

exports.getUserCount = async function () {
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
exports.getUsersByDay = async function (date) {
  // Create a query against the collection
  const query = db.collection("users");

  // Start and end timestamps for the day
  const start = new Date(date);
  start.setHours(0, 0, 0, 0);
  const end = new Date(date);
  end.setHours(23, 59, 59, 999);

  // Convert to Firestore timestamps
  const startTimestamp = admin.firestore.Timestamp.fromDate(start);
  const endTimestamp = admin.firestore.Timestamp.fromDate(end);
  console.log(startTimestamp, startTimestamp);
  try {
    // Query for users who logged in on the specific day
    const snapshot = await query
      .where("last_login", ">=", startTimestamp)
      .where("last_login", "<=", endTimestamp)
      .get();

    // Get user data from the documents
    console.log(snapshot.size);
    const users = snapshot.docs.map((doc) => doc.data());
    // console.log(users);
    return users;
  } catch (err) {
    console.log(err);
    return err;
  }
};
