//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require('mongoose')
const _ = require('lodash')

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect('mongodb+srv://Sukabli:sukabli@cluster0.4s2jh.mongodb.net/todolistDB')

const itemSchema = {
  name: String
};

const Item = mongoose.model('Item', itemSchema)


const item1 = new Item({
  name:'Welcome to your todolist'
})

const item2 = new Item({
  name: 'Hit the + button to add items.'
})

const item3 = new Item({
  name: '<-- Hit this to delete an item'
})

const defaultItems = [item1, item2, item3]



const listSchema = {
  name: String,
  items: [itemSchema]
}

const List = mongoose.model('List', listSchema)





app.get("/", function(req, res) {


  //find callback returns an array
  Item.find({}, function(err, items){

    if (items.length === 0){
      Item.insertMany(defaultItems, function(err){
        if (err){
          console.log(err)
        } else {
          console.log('successfully saved')
        }
      })
      res.redirect('/');
    } else {
      res.render("list", {listTitle: 'Today', newListItems: items});
    }
  })
});




app.get('/:customRoute', function(req, res){
  const customRoute = _.capitalize(req.params.customRoute)



  //findOne callback returns an object
  List.findOne({name: customRoute}, function(err, foundList){
    if (!err){
      if (!foundList){
        //create a new list
        const list = new List({
          name: customRoute,
          items: defaultItems
        })
          list.save();
          res.redirect('/' + customRoute)
      } else{
        res.render('list', {listTitle: foundList.name, newListItems: foundList.items})
        ;
      }
    }
  })
})





app.post("/", function(req, res){

  const itemName = req.body.newItem;
  const listName = req.body.list;

  const item = new Item({
    name: itemName
  });

  if (listName === 'Today'){
    item.save();
    res.redirect('/')
  } else {
    List.findOne({name: listName}, function(err, foundList){
      foundList.items.push(item)
      foundList.save();
      res.redirect('/' + listName)
    })
  }
});





app.post('/delete', function(req, res){
  const checkedItemId = req.body.deleteItem;
  const listName = req.body.listName;

  if (listName === 'Today'){
    Item.findByIdAndRemove(checkedItemId, function(err){
      if (!err){
        console.log('successfully deleted');
        res.redirect('/');
      }

    });
  } else {
    List.findOneAndUpdate({name: listName}, {$pull: {items: {_id: checkedItemId}}}, function(err, foundList){
      if (!err){
        res.redirect('/'+ listName);
      }
    });
  }



});


let port = process.env.PORT || 3000;



app.listen(port, function() {
  console.log("Server started successfully");
});
