$(function () {
    /* Entry definition:
     *      Name: String
     *      Activities: List of String 
     */
    fetch("/json/changelog.json").then((response) => {
        if (!response.ok) {
            throw new Error(`HTTP error, status = ${response.status}`);
        }
        return response.json();
    }).then((data) => {
        for (const entry of data.entries) {
            $('#changelog-sections').append( $("<h2>").addClass("text-center").addClass("py-2").addClass("bg-warning-subtle").text(entry.Name));
            let unorderedList = $("<ul>");

            for (const description of entry.Activities) {
                unorderedList.append($("<li>").text(description));
            }

            $('#changelog-sections').append(unorderedList);
        }
    })

    $.getScript( "/js/toc.js" );
});