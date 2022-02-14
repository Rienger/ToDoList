const express = require('express')
const bodyParser = require('body-parser')
const ejs = require('ejs')
const mongoose = require('mongoose')

const app = express();


app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'));

mongoose.connect('mongodb://localhost:27017/rinkaDB');

const itemsSchema = {
  name: String,
}

const Item = mongoose.model('Item', itemsSchema);

const item1 = new Item({
  name: 'whatever'
})

const item2 = new Item({
  name: 'shut'
})

const item3 = new Item({
  name: 'goodness'
})


const defaultItems = [item1, item2, item3]


Item.insertMany(defaultItems, function(err){
  if (err){
    console.log(err)
  } else{
    console.log('successfully saved default items');
  }
})



app.get('/', function(req, res) {

  Item.find({}, function(err, items){
    if (err){
      console.log(err);
    } else{
      console.log(items);
    }
  })

  res.render('list', {listTitle: 'Today', newListItems: items})
})






app.post('/', function(req, res){
  res.render('list')
})















app.listen(3000, function(){
  console.log('server connected on port 3000');
})
