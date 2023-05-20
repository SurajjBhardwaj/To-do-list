require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const ejs = require("ejs");


const app = express();
app.set('view engine','ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
const port = process.env.PORT || 3000;

// mongoose
const connection = async ()=>{

    try {
        mongoose.connect(process.env.URI);
        console.log("database connected");
    } catch (error) {
        console.log("error in database connection");
    }


}
mongoose.connect(process.env.URI)

const Schema = mongoose.Schema;
const data = new Schema({
    messege:{type:String,required:true},
    date:{type:Date,default:Date.now}
})

const item = mongoose.model('item',data);


app.get("/", async(req, res) => {
    const datas = await item.find();
     res.render("loader",{data:datas});
});

app.post("/delete",async(req,res)=>{
    const id = req.body.checkbox;
    console.log(id);

    try {

        const deletee = await item.deleteOne({"_id":id});
        if(deletee) {
            console.log("deleted ",id);
            res.redirect("/");
        }else{
            console.log("not deleted");
            res.send("<script>window.alert(`error in saving`);window.location.href="/"</script>");


        }
        
    } catch (error) {
        console.log("error");
        res.sendStatus(404);
        // res.send("<script>window.alert(`error in saving`);window.location.href="/"</script>")
    }
})



app.post("/upload",(req,res)=>{
    const task = new item({
        messege : req.body.work
    });
    console.log(task);

    try {
       const s = task.save();
       if(s){
        console.log("data saved",s);
        res.redirect("/");
       }else{
        console.log("error in saving");
        req.redirect("/");
       }
       
    } catch (error) {
        console.log("error here ",error);
        res.send(`<script>window.alert("error in saving");window.location.href="/";</script>`)
    };
});


app.listen(port, () => console.log(` app listening on port ${port}, http://localhost:${port}`));