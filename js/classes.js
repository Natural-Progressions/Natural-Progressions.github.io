$(function () {
    fetch("/json/classes.json")
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
    const martialArchetype = entry["Martial Archetype"];
    const magicArchetype = entry["Magic Archetype"];

    let content = createNavEntry(name);
    content.append(createH1(name));

    generateDescription(description, content);
    generateArchetypes(martialArchetype, magicArchetype, content);
}

/*
 *  Description: List
 */
function generateDescription(description, content) {
    generateParagraphIfNotUndefined(description, content);
}

/*
 *  Martial Archetype: Object
 *      Name: String
 *      Skill Modifier Bonuses: String
 *      Tool Modifier Bonuses: String
 *      Weapon Modifier Bonuses: String
 *      Armor Training: String
 *      Shield Training: String
 *      Starting Equipment: String
 *      Features: List of Object
 * 
 *  Magic Archetype: Object
 *      Name: String
 *      Skill Modifier Bonuses: String
 *      Tool Modifier Bonuses: String
 *      Weapon Modifier Bonuses: String
 *      Spellcasting Modfier Bonuses: String
 *      Armor Training: String
 *      Shield Training: String
 *      Starting Equipment: String
 *      Primary Spellcasting Skill: String
 *      Number of Spells Known: List of String
 *      Features: List of Object
 */
function generateArchetypes(martialArchetype, magicArchetype, content) {

    generateHR(content);
    generateHeaderRow(martialArchetype["Name"], magicArchetype["Name"], content);
    generateBodyRowWithHeader(martialArchetype["Skill Modifier Bonuses"], magicArchetype["Skill Modifier Bonuses"], content, "Skill Modifier Bonuses");
    generateBodyRowWithHeader(martialArchetype["Tool Modifier Bonuses"], magicArchetype["Tool Modifier Bonuses"], content, "Tool Modifier Bonuses");
    generateBodyRowWithHeader(martialArchetype["Weapon Modifier Bonuses"], magicArchetype["Weapon Modifier Bonuses"], content, "Weapon Modifier Bonuses");
    generateBodyRowWithHeader(martialArchetype["Spellcasting Modifier Bonuses"], magicArchetype["Spellcasting Modifier Bonuses"], content, "Spellcasting Modifier Bonuses");
    generateBodyRowWithHeader(martialArchetype["Armor Training"], magicArchetype["Armor Training"], content, "Armor Training");
    generateBodyRowWithHeader(martialArchetype["Shield Training"], magicArchetype["Shield Training"], content, "Shield Training");
    generateBodyRowWithHeader(martialArchetype["Starting Equipment"], magicArchetype["Starting Equipment"], content, "Starting Equipment");
    generateBodyRowWithHeader(martialArchetype["Primary Spellcasting Skill"], magicArchetype["Primary Spellcasting Skill"], content, "Primary Spellcasting Skill");
    generateListBodyRowWithHeader(martialArchetype["Number of Spells Known"], magicArchetype["Number of Spells Known"], content, "Number of Spells Known");
    generateFeaturesTables(martialArchetype["Features"], magicArchetype["Features"], content)
    generateFeatures(martialArchetype["Features"], magicArchetype["Features"], content);
}

function generateHeaderRow(martialName, magicName, content) {

    let row = createRow();
    let leftColumn = createLeftColumn();
    let rightColumn = createRightColumn();

    if (martialName != undefined) {
        leftColumn.append(createH2(martialName + " (Martial)"));
    }

    if (magicName != undefined) {
        rightColumn.append(createH2(magicName + " (Magic)"));
    }

    row.append(leftColumn);
    row.append(rightColumn);

    content.append(row);
}

function generateBodyRowWithHeader(martialText, magicText, content, header) {

    let row = createRow();
    let leftColumn = createLeftColumn();
    let rightColumn = createRightColumn();

    generateParagraphIfNotUndefinedWithHeader(martialText, leftColumn, header);
    generateParagraphIfNotUndefinedWithHeader(magicText, rightColumn, header);

    row.append(leftColumn);
    row.append(rightColumn);

    content.append(row);
}

function generateListBodyRowWithHeader(martialList, magicList, content, header) {

    let row = createRow();
    let leftColumn = createLeftColumn();
    let rightColumn = createRightColumn();

    generateParagraphsFromListIfNotUndefinedWithHeader(martialList, leftColumn, header);
    generateParagraphsFromListIfNotUndefinedWithHeader(magicList, rightColumn, header);

    row.append(leftColumn);
    row.append(rightColumn);

    content.append(row);
}

function generateFeaturesTables(martialFeatures, magicFeatures, content) {

    let row = createRow();
    let leftColumn = createLeftColumn();
    let rightColumn = createRightColumn();

    generateFeaturesTable(martialFeatures, leftColumn);
    generateFeaturesTable(magicFeatures, rightColumn);

    row.append(leftColumn);
    row.append(rightColumn);

    content.append(row);

}

function generateFeaturesTable(featureList, column) {

    if (featureList == undefined) {
        return;
    }

    let table = createTable();

    generateTableHeaderRow(table);

    let tbody = $("<tbody>");

    for (let i = 0; i < featureList.length; i++) {
        addRow(featureList.at(i), tbody, i + 1);
    }

    table.append(tbody);

    column.append(table);
}

function createTable() {

    let table = $("<table>");

    table.addClass("table");
    table.addClass("table-striped");
    table.addClass("table-hover");

    return table;
}

function generateTableHeaderRow(table) {

    let thead = $("<thead>");
    let tr = $("<tr>");

    let th1 = $("<th>");
    th1.attr("scope", "col");
    th1.text("Level");

    let th2 = $("<th>");
    th2.attr("scope", "col");
    th2.text("Feature Gained");

    tr.append(th1);
    tr.append(th2);

    thead.append(tr);

    table.append(thead);
}

function addRow(feature, tbody, level) {

    let tr = $("<tr>");

    let td1 = $("<td>");
    td1.text(level);

    let td2 = $("<td>");
    td2.text(feature["Name"]);

    tr.append(td1);
    tr.append(td2);

    tbody.append(tr);
}

function generateFeatures(martialFeatures, magicFeatures, content) {

    if (martialFeatures == undefined && magicFeatures == undefined) {
        return;
    }

    generateHR(content);
    generateH3("Features", content);
    generateHR(content);

    /* We want to go with the max size to make sure that every feature gets  displayed. generateFeature will be handle undefined being passed */
    for (let i = 0; i < Math.max(martialFeatures.length, magicFeatures.length); i++) {
        generateFeature(martialFeatures.at(i), magicFeatures.at(i), content, i);
    }
}

/*
 *  Feature:
 *      Name: String
 *      Description: List of String
 *      Options: List of Objects
 */
function generateFeature(martialFeature, magicFeature, content, index) {

    generateTitleRow(martialFeature["Name"], magicFeature["Name"], content, index);
    generateDescriptionRow(martialFeature, magicFeature, content);
}

function generateTitleRow(martialName, magicName, content, index) {

    let row = createRow();
    let leftColumn = createLeftColumn();
    let rightColumn = createRightColumn();

    if (index != 0) {
        generateHR(leftColumn);
        generateHR(rightColumn);
    }

    if (martialName != undefined) {
        generateH4(martialName, leftColumn);
    }

    if (magicName != undefined) {
        generateH4(magicName, rightColumn);
    }

    row.append(leftColumn);
    row.append(rightColumn);

    content.append(row);
}

function generateDescriptionRow(martialFeature, magicFeature, content) {

    let row = createRow();
    let leftColumn = createLeftColumn();
    let rightColumn = createRightColumn();

    generateParagraphsFromListIfNotUndefined(martialFeature["Description"], leftColumn);
    generateParagraphsFromListIfNotUndefined(magicFeature["Description"], rightColumn);

    generateOptions(martialFeature["Options"], leftColumn);
    generateOptions(magicFeature["Options"], rightColumn);

    row.append(leftColumn);
    row.append(rightColumn);

    content.append(row);
}

/*
 *  Options:
 *      Unnamed List of Objects:
 *          Name: String
 *          Description: List of String
 */
function generateOptions(options, column) {

    if (options == undefined) {
        return;
    }

    for (const entry of options) {
        generateParagraphsFromListIfNotUndefinedWithHeader(entry["Description"], column, entry["Name"]);
    }
}

function createRow() {

    let div = $("<div>");

    div.addClass("row");

    return div;
}

function createLeftColumn() {

    let div = $("<div>");

    div.addClass("col-6");
    div.addClass("border-end");

    return div;
}

function createRightColumn() {

    let div = $("<div>");

    div.addClass("col-6");

    return div;

}

function generateH2(title, content) {
    content.append(createH2(title));
}

function generateH2IfNotUndefined(title, content) {

    if (title == undefined) {
        return;
    }

    generateH2(title, content);
}

function generateH3(title, content) {
    content.append(createH3(title));
}

function generateH4(title, content) {
    content.append(createH4(title));
}

function createH4(title) {

    let h4 = $("<h4>");

    h4.addClass("text-center");
    h4.text(title);

    return h4;
}

function generateParagraphsFromListWithHeader(list, content, header) {
    
    for (let i = 0; i < list.length; i++) {
        if (i == 0) {
            generateParagraphIfNotUndefinedWithHeader(list.at(i), content, header);
        } else {
            generateParagraph(list.at(i), content);
        }
    }
}

function generateParagraphsFromListIfNotUndefinedWithHeader(list, content, header) {

    if (list == undefined) {
        return;
    }

    generateParagraphsFromListWithHeader(list, content, header);
}