var express = require("express");
var app = express();
var methodoverride = require("method-override");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var expresssanitizer = require("express-sanitizer");

mongoose.connect("mongodb://localhost:27017/blog_app",{useNewUrlParser : true});
app.set("view engine","ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodoverride("_method"));
app.use(expresssanitizer()); 

var blogSchema = new mongoose.Schema({
    title : String,
    image : String,
    body : String,
    created : {type: Date,default: Date.now}
});
var Blog = mongoose.model("Blog", blogSchema);

// Blog.create({
//     title: "Test blog",
//     image: "https://images.unsplash.com/photo-1558544474-bf682e6669ef?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
//     body: "this is a test blog."
// });

//RESTFUL ROUTES
app.get("/",function(req,res){
   res.redirect("/blogs"); 
});
// index route
app.get("/blogs",function(req,res){
    Blog.find({},function(err, blogs){
       if(err){
           console.log(err);
       } else{
           res.render("index",{blogs : blogs});
       }
    });
    
});

// new route
app.get("/blogs/new",function(req,res){
    res.render("new");
});
// create route
app.post("/blogs",function(req,res){
    req.body.blog.body = req.sanitize(req.body.blog.body);
    Blog.create(req.body.blog,function(err,newblog){
        if(err){
            res.render("new");
        }else{
            res.redirect("/blogs");
        }
    });
});

//show route
app.get("/blogs/:id",function(req,res){
    Blog.findById(req.params.id,function(err,foundblog){
        if(err){
            res.redirect("/blogs");
        }else{
            res.render("show",{blog: foundblog});
        }
    });
});
//edit route
app.get("/blogs/:id/edit",function(req,res){
    Blog.findById(req.params.id,function(err, updateblog){
        if(err){
            res.redirect("/blogs");
        }else{
            res.render( "edit",{blog : updateblog});    
        }
    });
});
//update route
app.put("/blogs/:id",function(req,res){
    req.body.blog.body = req.sanitize(req.body.blog.body);
    Blog.findByIdAndUpdate(req.params.id,req.body.blog,function(err,updatedblog){
      if(err){
        res.redirect("/blogs");
    }else{
        res.redirect("/blogs/"+ req.params.id);
    }  
    });
});
//delete route
app.delete("/blogs/:id",function(req,res){
   Blog.findByIdAndRemove(req.params.id,function(err){
       if(err){
           res.redirect("/blogs");
       }else{
           res.redirect("/blogs");
       }
   }) ;
});

app.listen(process.env.PORT,process.env.IP,function(){
    console.log("server started");
});
