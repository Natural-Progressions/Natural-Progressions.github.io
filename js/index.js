$(function () {
    var j = [];
    $.ajax({
        type: 'GET',
        url: "/json/changelog.json",
        dataType: 'json',
        success: function(data) { j = data;},
        async: false
    });
    console.log(j);
  });