const express = require('express');
const app = express();
const helloCnotroller =require('./controllers/helloController'); 
app.get('/run-analytics', async (req, res) => {
  // Run your analytics task here
  // For example, retrieve data from Firestore, perform analytics, and upload results to Firestore
});

app.get('/', helloCnotroller.index);

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
