$(function () {
    // var logEntries = [];
    // $.ajax({
    //     type: 'GET',
    //     url: "/json/changelog.json",
    //     dataType: 'json',
    //     success: function(data) { logEntries = data;},
    //     async: false
    // });
    
    // for (let entryName in logEntries) {
    //     let activities = logEntries[entryName]["Activities"];

    //     let unorderedList = $("<ul>");

    //     for (let index in activities) {
    //         unorderedList.append($("<li>").text(activities[index]));
    //     }

    //     $('#changelog-sections').append( $("<h2>").addClass("text-center").addClass("py-2").addClass("bg-warning-subtle").text(entryName));
    //     $('#changelog-sections').append(unorderedList);
    // }

    const request = async() => {
        fetch("/json/changelog.json")
        .then((response) => {
            if (!response.ok) {
                throw new Error(`HTTP error, status = ${response.status}`);
            }
            return response.json();
        })
        .then((data) => {
            for (const entry of data.entries) {
                $('#changelog-sections').append( $("<h2>").addClass("text-center").addClass("py-2").addClass("bg-warning-subtle").text(entry.Name));
                let unorderedList = $("<ul>");

                for (const description of entry.Activities) {
                    unorderedList.append($("<li>").text(description));
                }

                $('#changelog-sections').append(unorderedList);
            }
        }
    )}

    request();
});