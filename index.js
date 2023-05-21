require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const ejs = require("ejs");


const app = express();
app.set('view engine','ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));
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
const URI = process.env.URI+"/user";
console.log(URI);


mongoose.connect(process.env.URI)

const Schema = mongoose.Schema;
const data = new Schema({
    messege: { type: String, required: true },
    date: { type: Date, default: Date.now },
}, { versionKey: false });

const item = mongoose.model('item',data);


app.get("/", async(req, res) => {
    const datas = await item.find();
     res.render("loader",{data:datas});
});


app.post("/delete/:id", async (req, res) => {
    const id = req.params.id;

    try {
        const deletee = await item.deleteOne({ "_id": id });
        if (deletee) {
            console.log("deleted", id);
            res.redirect("/");
        } else {
            console.log("not deleted");
            res.send("<script>window.alert(`error in deleting`);window.location.href='/';</script>");
        }
    } catch (error) {
        console.log("error");
        res.sendStatus(404);
    }
});


app.post("/update/:id", async (req, res) => {
    const id = req.params.id;
    const newText = req.body.editText;

    try {
        const updatedItem = await item.findByIdAndUpdate(id, { messege: newText });
        if (updatedItem) {
            console.log("updated", id);
            res.redirect("/");
        } else {
            console.log("not updated");
            res.send("<script>window.alert(`error in updating`);window.location.href='/';</script>");
        }
    } catch (error) {
        console.log("error",error);
        res.send("<script>window.alert(`error in updating`);window.location.href='/';</script>");
        // res.sendStatus(404);
    }
});





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