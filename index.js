const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
var engine = require('consolidate');
var assert = require('assert');
const port =process.env.port || 3000
const app = express();

app.use(express.json())
app.use(express.static('public'))
app.use(express.urlencoded({
    extended:true
}))

mongoose.connect('mongodb://localhost:27017/rahul',{
    useNewUrlParser: true,
    useUnifiedTopology: true
});

var db = mongoose.connection;

db.on('error',()=>console.log("Error in Connecting to Database"));
db.once('open',()=>console.log("Connected to Database"))

app.post("/create_acc",(req,res)=>{
    var username = req.body.uname;
    var email = req.body.email;
    var phone = req.body.phone;
    var pwd = req.body.pwd;

    var data = {
        "username": username,
        "email" : email,
        "phone": phone,
        "pwd" : pwd
    }

    db.collection('users').insertOne(data,(err,collection)=>{
        if(err){
            throw err;
        }
        console.log("Record Inserted Successfully");
    });

    return res.redirect('login.html')

})

app.post("/login",(req,res)=>{
    
        var email = req.body.email;
        var pwd = req.body.pwd;
        var pass;
        
        
        db.collection('users').findOne(
            {
            "email" : email
            } 
            ,(err,collection)=>{
          try {
    
          
            pass=collection.pwd;
           
          
            if(pass==pwd)
        {
            console.log("Record found Successfully");
            return res.redirect('myprofile.html')
        }
        
        else
        {
            console.log("Record not found!!");
            return res.send('Record not found!!')
        }
             } catch (err) {
                 res.send("Invalid Email")
             }});
       
    })
    
app.engine('html', engine.mustache);
app.set('view engine', 'html')

app.get("/statement",(req,res)=>{
    var resultArray = [];
    var cursor = db.collection('statement').find({});
    cursor.forEach(function(doc){
        assert.notEqual(null, doc);
        resultArray.push(doc);
      }, function (err, doc){
        assert.equal(null, err);
        res.render('statement',{statement : resultArray});
        console.log({statement : resultArray});
      });
})

app.get("/customers",(req,res)=>{
    var resultArray = [];
    var cursor = db.collection('customers').find({});
    cursor.forEach(function(doc){
        assert.notEqual(null, doc);
        resultArray.push(doc);
      }, function (err, doc){
        assert.equal(null, err);
        res.render('customers',{customers : resultArray});
        console.log({customers : resultArray});
      });
})



app.get("/",(req,res)=>{
    res.set({
        "Allow-access-Allow-Origin": '*'
    })
    return res.redirect('homepage.html');
})

app.listen(port,()=>{
    console.log('accuired port number is '+ port)
}) 