const express = require('express');
const uuid = require('uuid');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use('/assets', express.static(path.join(__dirname, 'public/assets')));

app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, "./public/notes.html"));
});

app.get('/api/notes', (req,res) => {
    res.readFile(path.join(__dirname, "./db/db.json"), 'utf8', (err, data) => {
        if (err) throw err;
        res.json(JSON.parse(data));
    });
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
  });

  app.post('/api/notes', (req, res) => {
    fs.readFile(path.join(__dirname,  "./db/db.json"), 'utf8', (err, data) => {
      let db = JSON.parse(data);
      db.push({
        id: uuid.v4(),
        ...req.body,
      });
      fs.writeFile(
        path.join(__dirname,  "./db/db.json"),
        JSON.stringify(db, null, 2),
        (err, data) => {
          if (err) throw err;
          res.json(db);
        }
      );
    });
  });

app.listen(PORT, () => console.log(`The server is now listening on PORT ${PORT}`));
// app.listen(process.env.PORT || 3001, function(){
//   console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
// });
