function create(__helpers) {
  var str = __helpers.s,
      empty = __helpers.e,
      notEmpty = __helpers.ne;

  return function render(data, out) {
    out.w('<html lang="en"><head><title>Bootstrap 101 Template</title><link href="bower_components/bootstrap/dist/css/bootstrap.min.css" rel="stylesheet"> <script src="js/script.js"></script><script src="bower_components/jquery/dist/jquery.min.js"></script><script src="bower_components/bootstrap/dist/js/bootstrap.min.js"></script></head><body><h1>Hello, world!</h1><div class="dropdown"><button class="btn btn-primary dropdown-toggle" type="button" data-toggle="dropdown">Dropdown Example <span class="caret"></span></button><ul class="dropdown-menu"><li><a href="#">HTML</a></li><li><a href="#">CSS</a></li><li><a href="#">JavaScript</a></li></ul></div></body></html>');
  };
}
(module.exports = require("marko").c(__filename)).c(create);