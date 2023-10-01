$(function () {
    var navSelector = "#toc";
    Toc.init({
        $nav: $("#toc"), 
        $scope: $("h1, h2")
    });
    $("body").scrollspy({
      target: navSelector,
    });
  });