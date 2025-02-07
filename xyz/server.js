const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const path = require("path");

const app = express();
const port = 3001;

app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true })); 
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static("public")); 


mongoose.connect("mongodb://127.0.0.1:27017/bookstore", { useNewUrlParser: true, useUnifiedTopology: true })

const bookSchema = new mongoose.Schema({
    title: String,
    author: String,
    price: Number
});
const Book = mongoose.model("Book", bookSchema);


app.get("/", async (req, res) => {
    const books = await Book.find();
    res.render("index", { books });
});

app.get("/books", async (req, res) => {
    const books = await Book.find();
    res.json(books);
});


app.post("/add", async (req, res) => {
    const { title, author, price } = req.body;

    if (!title || !author || isNaN(price) || price <= 0) {
        const books = await Book.find();
        return res.render("index", { books, error: "All fields are required and price must be a positive number" });
    }

    await Book.create({ title, author, price });
    res.redirect("/");
});

app.post("/delete/:id", async (req, res) => {
    await Book.findByIdAndDelete(req.params.id);
    res.redirect("/");
});


app.listen(port, () => {
    console.log(` Server running at http://localhost:${port}`);
});
