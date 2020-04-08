const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js");

const app = express();

const items = [];
const workItems = [];
// Arrays can be constant if we are only pushing items into it, but we cannot discretely redefine an element of array or add element like array[5] = "a"

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
app.set('view engine', 'ejs');


app.get("/", function(req, res) {

  let day = date.getDate();

  res.render("list", {listTitle: day,newListItem: items});

});

app.post("/", function(req, res) {
  let item = req.body.newItem;
  items.push(item)
  // console.log(setItem);

  res.redirect("/");
});

app.get("/work", function(req, res) {
  res.render("list", {
    listTitle: "Work",
    newListItem: workItems
  });
})

app.post("/work", function(req, res) {

});

app.listen(3000, function() {

  console.log("Server started at port 3000");

});
