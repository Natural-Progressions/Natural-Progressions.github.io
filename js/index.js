$(function () {
    var logEntries = [];
    $.ajax({
        type: 'GET',
        url: "/json/changelog.json",
        dataType: 'json',
        success: function(data) { logEntries = data;},
        async: false
    });
    
    for (let entryName in logEntries) {
        let activities = logEntries[entryName]["Activities"];

        let unorderedList = $("<ul>");

        for (let index in activities) {
            unorderedList.append($("<li>").text(activities[index]));
        }

        $('#changelog-sections').append( $("<h2>").addClass("text-center").addClass("py-2").addClass("bg-warning-subtle").text(entryName));
        $('#changelog-sections').append(unorderedList);
    }
});