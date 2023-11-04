/*
 *  Detail:
 *      Map of String -> String
 */
var nameToDetailHTML = {};

$(function () {
    fetch("/json/tools.json")
    .then((response) => {
        if (!response.ok) {
            throw new Error(`HTTP error, status = ${response.status}`);
        }

        return response.json();
    })
    .then((data) => {

        /* Generates tool table entries and viewable panels */
        for (const entry of data["entries"]) {
            processToolEntry(entry);
        }
        
        new DataTable('#tools-table', {
            columnDefs: [
                {
                    target: 3,
                    visible: false
                }
            ],
            lengthMenu: [
                [-1, 10, 25, 50],
                ['All', 10, 25, 50]
            ]
        });
    })
});

/*
 *  Tool:
 *      Name: String
 *      Description: String
 *      Cost: Integer
 *      Weight: Integer
 *      Components: String
 *      Skills: Object
 *      Other Activities: Object
 *      Other: Object
 */
function processToolEntry(tool) {

    let name = tool["Name"];
    let cost = tool["Cost"];
    let weight = tool["Weight"];
    let skills = tool["Skills"]

    let toolsTableTody = $("#tools-table-body");

    let tableRow = createToolsTableRow(name, cost, weight, skills);

    tableRow.click(function(){ displayDetails(createNiceId(name), tool)});
    toolsTableTody.append(tableRow);

}

function createToolsTableRow(name, cost, weight, skills) {
    
    let tableRow = createTableRow();

    if (name != undefined) {
        tableRow.attr("id", createNiceId(name));
    }

    generateTableCell(name, tableRow);
    generateTableCell(cost, tableRow);
    generateTableCell(weight, tableRow);
    generateTableCell(getSkills(skills).join(" "), tableRow);

    return tableRow;
}

function getSkills(skills) {

    const uniqueSkills = new Set();

    for (const skillName of Object.keys(skills)) {
        uniqueSkills.add(skillName);
    }

    return Array.from(uniqueSkills);
}

function displayDetails(lowercaseName, tool) {

    let column = $("#selected-tools");

    /* Clear out the selected information */
    $("#tools-table tr").removeClass("table-info");
    column.empty();

    $(`#${lowercaseName}`).addClass("table-info");

    if (nameToDetailHTML[lowercaseName] != undefined) {
        column.html(nameToDetailHTML[lowercaseName]);
        return;
    }

    let name = tool["Name"];
    let description = tool["Description"];
    let cost = tool["Cost"];
    let weight = tool["Weight"];
    let components = tool["Components"];
    let skills = tool["Skills"];
    let otherActivities = tool["Other Activities"];
    let other = tool["Other"];

    column.append(createH2(name));
    generateParagraphIfNotUndefined(description, column);
    generateParagraphIfNotUndefinedWithHeader(cost + " gold", column, "Cost");
    generateParagraphIfNotUndefinedWithHeader(weight + " lbs", column, "Weight");
    generateParagraphIfNotUndefinedWithHeader(components, column, "Components");
    generateSkills(skills, column);
    generateOther(other, column);
    generateOtherActivities(otherActivities, column);

    nameToDetailHTML[lowercaseName] = column.html();
}

/*
 *  Skills:
 *      Skill Name (String): Description (String)
 */
function generateSkills(skills, column) {

    for (const skillName of Object.keys(skills)) {
        generateParagraphIfNotUndefinedWithHeader(skills[skillName], column, skillName);
    }
}

/*
 *  Other:
 *      Skill Name (String): Description (List of String);
 */
function generateOther(other, column) {

    for (const otherName of Object.keys(other)) {
        generateParagraphsFromListIfNotUndefinedWithHeader(other[otherName], column, otherName);
    }
}

/*
 *  Other Activities:
 *      Name (String): String
 */
function generateOtherActivities(otherActivities, column) {
    
    generateHR(column);

    let table = createTable();

    generateToolsTableHeader(table);
    generateToolsTableBody(table, otherActivities);

    column.append(table);
}

function generateToolsTableHeader(table) {

    let thead = createTableHeader();
    let tr = createTableRow();

    generateTableHeaderCell("Activity", tr);
    generateTableHeaderCell("DC", tr);

    thead.append(tr);
    table.append(thead);
}

function generateToolsTableBody(table, otherActivities) {

    let tbody = createTableBody();

    for (let activityName of Object.keys(otherActivities)) {

        let tr = createTableRow();

        generateTableCell(activityName, tr);
        generateTableCell(otherActivities[activityName], tr);

        tbody.append(tr);
    }

    table.append(tbody);
}

function delay(milliseconds){
    return new Promise(resolve => {
        setTimeout(resolve, milliseconds);
    });
}