const Post = require('../models/post');

module.exports.home = (req, res) => {
    // console.log(req.cookies);
    // res.render('home', {
    //     title: "Home"
    // });

    // populate the user of each post
    Post.find({}).populate('user').exec(function (err, posts) {
        return res.render('home', {
            title: "Codeial | Home",
            posts: posts
        });
    });
};
