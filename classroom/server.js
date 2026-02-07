const express = require('express');
const app = express();
const session = require('express-session');

app.use(session({ secret:"mysecret"}));

     app.get('/', (req, res) => {
          res.send("test successful");
     });



app.listen(3000, () => {
  console.log('Server is running on port 3000');
});