import express from "express";
import bodyParser from "body-parser";

const app = express();
const port = 3000;
let arr = [];

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.set('view engine', 'ejs');

app.get("/", (req, res) => {
  res.render("index.ejs");
});

app.get("/write", (req, res) => {
  res.render("write.ejs");
});

// Handle form submission via POST request
app.post("/blog", (req, res) => {
  const action = req.body.action;
  const postNum = parseInt(req.body.pnum) - 1;

  if (action === "edit") {
    if (postNum >= 0 && postNum < arr.length) {
      arr[postNum].heading = req.body.htext;
      arr[postNum].body = req.body.btext;
    }
  } else if (action === "delete") {
    if (postNum >= 0 && postNum < arr.length) {
      arr.splice(postNum, 1);
      // Update IDs of remaining posts
      for (let i = 0; i < arr.length; i++) {
        arr[i].id = i + 1;
      }
    }
  } else if (action === "submit") {
    let todayJournal = {
      id: arr.length + 1,
      heading: req.body.htext,
      body: req.body.btext
    };
    arr.push(todayJournal);
  }
  res.redirect("/blog");
});

// Render the blog page with current entries in arr
app.get("/blog", (req, res) => {
  res.render("blog.ejs", { arr: arr });
});

app.get("/edit", (req, res) => {
  res.render("edit.ejs");
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
