$(function () {
    var j = [];
    $.ajax({
        type: 'GET',
        url: url,
        dataType: 'json',
        success: function(data) { j = data;},
        async: false
    });
    console.log(j);
  });