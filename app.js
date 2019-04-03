var express = require("express");
var app = express();
var methodOverride = require("method-override");
var expressSanitizer = require("express-sanitizer");
var bodyparser = require("body-parser");
var mongoose = require("mongoose");

//app config
mongoose.connect("mongodb://localhost/restful_blog_app");
app.set("view engine","ejs");
app.use(express.static("public"));
app.use(bodyparser.urlencoded({extended: true}));
app.use(expressSanitizer());
app.use(methodOverride("_method"));

//mongoose model config
var blogSchema = mongoose.Schema({
    title : String,
    image : String,
    body : String,
    created :{ type : Date, default : Date.now} 
});
var Blog = mongoose.model("Blog",blogSchema);

//restful routes
app.get("/",function(req,res){
    res.redirect("/blogs");
});
//index route
app.get("/blogs",function(req,res){
    Blog.find({},function(err,blogs){
        if(err){
            console.log(err);
        }else{
            res.render("index", {blogs: blogs});
        }
    })
});

//new route
app.get("/blogs/new",function(req,res){
   res.render("new"); 
});

//create route
app.post("/blogs",function(req,res){
    req.body.blog.body = req.sanitize(req.body.blog.body); 
    Blog.create(req.body.blog,function(err,newBlog){
        if(err){
            res.render("new");
        }else{
           // console.log(newBlog);
            res.redirect("/blogs");
        }
    })
});

//show route
app.get("/blogs/:id",function(req,res){
   Blog.findById(req.params.id,function(err, foundBlog){
       if(err){
           res.redirect("/blogs");
       }else{
           res.render("show",{blog: foundBlog});
       }
   });
});

//edit route
app.get("/blogs/:id/edit",function(req,res){
    Blog.findById(req.params.id,function(err, foundBlog){
        if(err){
            res.redirect("/blogs");
        }else{
            res.render("edit",{blog : foundBlog});
        }
    });
});

//update route
app.put("/blogs/:id",function(req,res){
    req.body.blog.body = req.sanitize(req.body.blog.body); 
    Blog.findByIdAndUpdate(req.params.id,req.body.blog,function(err,updatedBlog){
        if(err){
            res.reditect("/blogs");
        }else{
            res.redirect("/blogs/"+req.params.id);
        }
    });
});

//delete route
app.delete("/blogs/:id",function(req,res){
//destroy route
   Blog.findByIdAndRemove(req.params.id,function(err){
       if(err){
           res.redirect("/blogs");
       }else{
           res.redirect("/blogs");
       }
   })
//redirect somewhere
    
});

app.listen(process.env.PORT,process.env.IP,function(){
  console.log("SERVERR IS RUNNING !!!"); 
});
