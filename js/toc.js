$(function () {
    var navSelector = "#toc";
    Toc.init({
        $nav: $("#toc"), 
        $scope: $("h1, h2, h3, h4, h5, h6")
    })
    $("body").scrollspy({
      target: navSelector,
    });
  });