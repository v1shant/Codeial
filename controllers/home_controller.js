module.exports.home = (req, res) => {
    console.log(req.cookies);
    res.render('home', {
        title: "Home"
    });
};