function createH1(title) {

    let h1 = $("<h1>");

    h1.addClass("text-center");
    h1.addClass("py-3");
    h1.addClass("bg-danger-subtle");
    h1.text(title);

    return h1;
}

function createH2(title) {

    let h2 = $("<h2>");

    h2.addClass("text-center");
    h2.addClass("py-2");
    h2.addClass("bg-warning-subtle");
    h2.text(title);

    return h2;
}

function createH3(title) {

    let h3 = $("<h3>");

    h3.addClass("text-center");
    h3.addClass("py-1");
    h3.text(title);

    return h3;
}

function createP(text) {

    let p = $("<p>");
    
    p.html(text);

    return p;
}

function createBoldText(text) {
    return "<b>" + text + "</b>";
}

function generateParagraph(paragraph, content) {
    content.append(createP(paragraph));
}

function generateParagraphWithHeader(paragraph, content, header) {
    generateParagraph(createBoldText(header) + ": " + paragraph, content);
}

function generateParagraphIfNotUndefined(paragraph, content) {

    if (paragraph == undefined) {
        return;
    }

    generateParagraph(paragraph, content);
}

function generateParagraphIfNotUndefinedWithHeader(paragraph, content, header) {

    if (paragraph == undefined) {
        return;
    }

    generateParagraphWithHeader(paragraph, content, header);
}

function generateParagraphsFromList(list, content) {
    
    for (const paragraph of list) {
        generateParagraph(paragraph, content);
    }
}

function generateParagraphsFromListIfNotUndefined(list, content) {

    if (list == undefined) {
        return;
    }

    generateParagraphsFromList(list, content);
}

function createNavEntry(name) {

    let button = $("<button>");

    niceName = name.replace(/\s+/g, '-');

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

    $("#sidebar-tabContent").append(content);

    return content;
}