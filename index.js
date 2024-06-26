import express from "express";
import bodyParser from "body-parser";

import {dirname} from "path";
import {fileURLToPath} from "url";
const __dirname = dirname(fileURLToPath(import.meta.url));

let authorNames = ['Arthur Morgan']
let postTitles = ['Mangoes in Cancun']
let postSubtitles = ["I still don't trust Micah"]
let authorEmail = ['arthurmorgan@cancun.com']
let postContent = ['Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Augue lacus viverra vitae congue eu consequat ac felis donec. Ac felis donec et odio pellentesque diam volutpat. Ut diam quam nulla porttitor. Praesent semper feugiat nibh sed pulvinar proin gravida. Molestie nunc non blandit massa enim. Mauris rhoncus aenean vel elit scelerisque. In hac habitasse platea dictumst vestibulum rhoncus. Sem et tortor consequat id. Pretium aenean pharetra magna ac placerat vestibulum lectus. Scelerisque in dictum non consectetur a. Sed risus ultricies tristique nulla aliquet enim tortor at auctor. Pulvinar pellentesque habitant morbi tristique. Lorem dolor sed viverra ipsum nunc aliquet bibendum enim facilisis. Leo integer malesuada nunc vel risus commodo viverra. Elit duis tristique sollicitudin nibh. Blandit cursus risus at ultrices mi tempus imperdiet nulla. Nec ultrices dui sapien eget mi proin sed.']
let postId = [0]

let currentName = '';
let currentEmail = '';
let currentTitle = '';
let currentSubtitle = '';
let currentPost = '';
let postCount = 1;
let currentpostId = '';


const app = express();
const port = 3000;

app.use(express.static(__dirname + "/public"));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.urlencoded({ extended: true }));

app.get("/about", (req, res) => {
    res.render("about.ejs");
})

app.get("/contact", (req, res) => {
    res.render("contact.ejs");
})

app.get("/new-post", (req, res) => {
    res.render("new_post.ejs");
})

app.locals.id = -1;


app.all("/", (req, res) => {

    if (req.method === "POST") {

        currentEmail = req.body.email;
        currentName = req.body.name;
        currentPost = req.body.post_content;
        currentTitle = req.body.title;
        currentSubtitle = req.body.subtitle;
        currentpostId = Number(req.body.postid);

        let arrayPosition = postId.indexOf(app.locals.id);

        if( arrayPosition > -1) {
            authorNames[arrayPosition] = currentName;
            authorEmail[arrayPosition] = currentEmail;
            postTitles[arrayPosition] = currentTitle;
            postSubtitles[arrayPosition] = currentSubtitle;
            postContent[arrayPosition] = currentPost;
        }

        else {
            authorNames.push(currentName);
            authorEmail.push(currentEmail);
            postTitles.push(currentTitle);
            postSubtitles.push(currentSubtitle);
            postContent.push(currentPost);
            postId.push(postCount);
            postCount++;
        }
        
    }
    
    
    res.render("index.ejs", {
        authorNames: authorNames,
        authorEmail: authorEmail,
        postTitles: postTitles,
        postSubtitles: postSubtitles,
        postContent: postContent,
        postId: postId      
    });
})


app.all("/update/:postid", (req, res) => {    
    
    currentpostId = Number(req.params.postid);    
    app.locals.id = currentpostId;
    
    if(req.method === "GET") {

        let arrayPosition = postId.indexOf(currentpostId);
        console.log(arrayPosition)        
        console.log(postId)
        console.log(postId.indexOf(0))

        currentEmail = authorEmail[arrayPosition];
        console.log(currentEmail)
        
        currentName = authorNames[arrayPosition];
        currentPost = postContent[arrayPosition];
        currentTitle = postTitles[arrayPosition];
        currentSubtitle = postSubtitles[arrayPosition];

        authorNames[arrayPosition] = currentName;
        authorEmail[arrayPosition] = currentEmail;
        postTitles[arrayPosition] = currentTitle;
        postSubtitles[arrayPosition] = currentSubtitle;
        postContent[arrayPosition] = currentPost;
    }

    if (req.method === "POST") {
        
        let arrayPosition = postId.indexOf(currentpostId);
        console.log(arrayPosition)        
        

        currentEmail = req.body.email;
        currentName = req.body.name;
        currentTitle = req.body.title;
        currentSubtitle = req.body.subtitle;
        currentPost = req.body.post_content;

        authorNames[arrayPosition] = currentName;
        authorEmail[arrayPosition] = currentEmail;
        postTitles[arrayPosition] = currentTitle;
        postSubtitles[arrayPosition] = currentSubtitle;
        postContent[arrayPosition] = currentPost;

        res.redirect("/");
    }

    res.render("update_post.ejs", {
        currentpostId: currentpostId, 
        currentEmail: currentEmail,
        currentPost: currentPost,
        currentName: currentName,
        currentTitle: currentTitle,
        currentSubtitle: currentSubtitle
    });
})

app.get("/delete/:postid", (req, res) => {

    currentpostId = Number(req.params.postid); 
    let arrayPosition = postId.indexOf(currentpostId);

    if (arrayPosition > -1) {
        authorEmail.splice(arrayPosition, 1);
        authorNames.splice(arrayPosition, 1);
        postContent.splice(arrayPosition, 1);
        postTitles.splice(arrayPosition, 1);
        postSubtitles.splice(arrayPosition, 1);
    }

    res.redirect("/");
})

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
  });