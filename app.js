const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _ = require("lodash");
const app = express();


app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
app.set('view engine', 'ejs');

mongoose.connect("mongodb+srv://admin-mathur:test123@cluster0-rbfpi.mongodb.net/todolistDB", { useNewUrlParser: true,  useUnifiedTopology: true});

const itemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true]
  }
});

const Item = mongoose.model("Item", itemSchema);

const item1 = new Item({
  name: "Welcome to Your todo list!"
});

const item2 = new Item({
  name: "Hit the + button to add a new item."
});

const item3 = new Item({
  name: "<-- Hit this to delete an item"
});

const defaultItems = [item1, item2, item3];

const listSchema = {
  name: String,
  items: [itemSchema]
};

const List = mongoose.model("List", listSchema);

app.get("/", function(req, res) {

      Item.find({}, function(err, foundItems){
        if(foundItems.length === 0){
          Item.insertMany(defaultItems, function(err){
            if(err){
              console.log(err);
            }else{
              console.log("Inserted default items successfully");
            }
          });
          res.redirect("/");
        }else{
          // console.log(foundItems);
          res.render("list", {listTitle: "Today",newListItem: foundItems});
        }
  })
});

app.post("/", function(req, res) {
  const itemName = req.body.newItem;
  const listName = req.body.list;
  console.log(listName);
  const item = new Item({
    name: itemName
  });

  if(listName === "Today"){
    item.save();
    res.redirect("/");
  }else{
    List.findOne({name: listName}, function(err, foundList){
      foundList.items.push(item);
      foundList.save();
      res.redirect("/" + listName);
    });
  }

  // console.log(setItem);

});


app.get("/:customListName", function(req, res){
  const customListName = _.capitalize(req.params.customListName);


  List.findOne({name: customListName}, function(err, foundList){
    if(!foundList){
        const list = new List({
          name: customListName,
          items: defaultItems
        });
        list.save();
        res.redirect("/" + customListName);
        // console.log("Doesn't Exist " + foundList );
    }else{
      res.render("list", {listTitle: foundList.name, newListItem: foundList.items})
      // console.log("Exists " + foundList);
    }
  });

});


app.post("/delete", function(req, res){
  const checkedItemId = req.body.checkbox;
  const listName = req.body.listName;

  if(listName === "Today"){

    Item.findByIdAndRemove(checkedItemId, function(err){
      if(err){
        console.log(err);
      }else{
        console.log("successfully deleted checked item");
        res.redirect("/");
      }
    });

  }else{
    List.findOneAndUpdate({name: listName}, {$pull: {items: {_id: checkedItemId}}}, function(err, foundList){
      if(!err){
        res.redirect("/" + listName);

      }
    })
  }

})

app.listen(process.env.PORT || 3000, function() {

  console.log("Server started at port 3000");

});
