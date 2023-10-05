$(function () {
    fetch("/json/races.json")
    .then((response) => {
        if (!response.ok) {
            throw new Error(`HTTP error, status = ${response.status}`);
        }
        return response.json();
        })
    .then((data) => {
        for (const entry of data["entries"]) {
            processEntry(entry);
        }
    })
});

function processEntry(entry) {
    const name = entry["Name"];
    const description = entry["Description"];
    const names = entry["Names"];
    const traits = entry["Traits"];
    const halfRaces = entry["Half-Races"];

    let content = generateNavEntry(name);
    // TODO: Handle description
    // TODO: Handle names
    // TODO: Handle traits
    // TODO: Handle half-races
}

function generateNavEntry(name) {
    let button = $("<button>");

    niceName = name.replace(/\s+/g, '-');

    name.replace

    button.addClass("nav-link");
    button.attr("id", niceName + "-tab");
    button.attr("data-bs-toggle", "pill");
    button.attr("data-bs-target", "#" + niceName);
    button.attr("type", "button");
    button.attr("role", "tab");
    button.attr("aria-controls", niceName);
    button.attr("aria-selected", "false");
    button.attr("onclick", "redrawTOC()");
    button.text(name);

    $("#sidebar-tab").append(button);

    let content = $("<div>");

    content.addClass("tab-pane");
    content.addClass("fade");
    content.attr("id", niceName);
    content.attr("role", "tabpanel");
    content.attr("aria-labelledby", niceName + "-tab");
    content.attr("tabIndex", "0");
    // TODO: Remove this line
    content.text("This is a test for " + name);

    $("#sidebar-tabContent").append(content);

    return content;
}