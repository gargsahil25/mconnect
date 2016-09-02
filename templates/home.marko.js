function create(__helpers) {
  var str = __helpers.s,
      empty = __helpers.e,
      notEmpty = __helpers.ne,
      __loadTemplate = __helpers.l,
      __base_marko = __loadTemplate(require.resolve("./base.marko"), require),
      __renderer = __helpers.r,
      ___node_modules_marko_layout_use_tag_js = __renderer(require("marko-layout/use-tag")),
      __tag = __helpers.t,
      ___node_modules_marko_layout_put_tag_js = __renderer(require("marko-layout/put-tag")),
      forEach = __helpers.f,
      attr = __helpers.a,
      escapeXml = __helpers.x;

  return function render(data, out) {
    __tag(out,
      ___node_modules_marko_layout_use_tag_js,
      {
        "template": __base_marko,
        "getContent": function(__layoutHelper) {
          __tag(out,
            ___node_modules_marko_layout_put_tag_js,
            {
              "into": "styles",
              "layout": __layoutHelper
            },
            function(out) {
              out.w('<link rel="stylesheet" href="css/home.css">');
            });
          __tag(out,
            ___node_modules_marko_layout_put_tag_js,
            {
              "into": "body",
              "layout": __layoutHelper
            },
            function(out) {
              out.w('<h1>Hello, world!</h1><div class="col-lg-3"> <div class="dropdown"><button class="btn btn-primary dropdown-toggle" type="button" data-toggle="dropdown" id="cityButton">Cities <span class="caret"></span></button><ul class="dropdown-menu scrollable-menu">');

              forEach(data.cities, function(city) {
                out.w('<li class="cityButton"' +
                  attr("value", city.id) +
                  '>' +
                  escapeXml(city.label) +
                  '</li>');
              });

              out.w(' </ul></div></div><div class="col-lg-3"> <div class="dropdown"><button class="btn btn-primary dropdown-toggle" type="button" data-toggle="dropdown">Locality <span class="caret"></span></button><ul class="dropdown-menu scrollable-menu">');

              forEach(data.locality, function(locality) {
                out.w('<li' +
                  attr("id", locality.localityId) +
                  '>' +
                  escapeXml(locality.label) +
                  '</li>');
              });

              out.w('</ul></div></div><div class="col-lg-12"><div class="form-group"><label for="usr">Question</label><input type="text" class="form-control" id="question"></div></div> <div id="questions" class="col-lg-12">');

              forEach(data.questions, function(question) {
                out.w('<div class="container"><div class="panel panel-default"><div class="panel-heading">' +
                  escapeXml(question.question) +
                  '</div><div class="panel-body">' +
                  escapeXml(question.question) +
                  '</div></div></div>');
              });

              out.w(' </div>');
            });
        }
      });
  };
}
(module.exports = require("marko").c(__filename)).c(create);