/*
 *  Detail:
 *      Map of String -> String
 */
var nameToDetailHTML = {};

$(function () {
    fetch("/json/armor_and_shields.json")
    .then((response) => {
        if (!response.ok) {
            throw new Error(`HTTP error, status = ${response.status}`);
        }

        return response.json();
    })
    .then((data) => {

        /* Genereates armor table entries and viewable panels */
        for (const entry of Object.keys(data["entries"]["Armor"])) {
            processArmorGroupWrapper(entry, data["entries"]["Armor"][entry]);
        }

        /* Generates the shield table entries and viewable panels */
        for (const entry of data["entries"]["Shields"]) {
            processShieldEntry(entry);
        }
        
        new DataTable('#weapon-table', {
            lengthMenu: [
                [-1, 10, 25, 50, 100],
                ['All', 10, 25, 50, 100]
            ]
        });
    })
});

function processArmorGroupWrapper(armorGroupName, armorGroup) {
    for (const armor of armorGroup) {
        processArmor(armorGroupName, armor)
    }
}

function processArmor(armorGroupName, armor) {

    let name = armor["Name"];
    let acBonus = armor["AC Bonus"];
    let stealth = armor["Stealth"];
    let weight = armor["Weight"];
    let cost = armor["Cost"];

    let armorAndShieldTableBody = $("#armor-and-shields-table-body");

    let tableRow = createArmorAndShieldTableRow(name, armorGroupName, acBonus, stealth, weight, cost);

    tableRow.click(function(){ displayArmorDetails(createNiceId(name), armorGroupName, armor)});
    armorAndShieldTableBody.append(tableRow);
}

function createArmorAndShieldTableRow(name, armorGroupName, acBonus, stealth, weight, cost) {

    let tableRow = createTableRow();

    if (name != undefined) {
        tableRow.attr("id", createNiceId(name));
    }

    generateTableCell(name, tableRow);
    generateTableCell(armorGroupName, tableRow);
    generateTableCell(acBonus, tableRow);
    generateTableCell(stealth, tableRow);
    generateTableCell(weight, tableRow);
    generateTableCell(cost, tableRow);

    return tableRow;
}

function displayArmorDetails(lowercaseName, armorGroupName, armor) {

    let column = $("#selected-armor-and-shields");

    /* Clear out the selected information */
    $("#armor-and-shields-table tr").removeClass("table-info");
    column.empty();

    $(`#${lowercaseName}`).addClass("table-info");

    if (nameToDetailHTML[lowercaseName] != undefined) {
        column.html(nameToDetailHTML[lowercaseName]);
        return;
    }

    let name = armor["Name"];
    let acBonus = armor["AC Bonus"];
    let stealth = armor["Stealth"];
    let weight = armor["Weight"];
    let cost = armor["Cost"];
    let description = armor["Description"];

    column.append(createH2(name));
    generateParagraphIfNotUndefined(description, column);
    generateParagraphIfNotUndefinedWithHeader(armorGroupName, column, "Armor Type");
    generateParagraphIfNotUndefinedWithHeader(acBonus, column, "AC Bonus");
    generateParagraphIfNotUndefinedWithHeader(stealth, column, "Stealth");
    generateParagraphIfNotUndefinedWithHeader(weight + " lbs", column, "Weight");
    generateParagraphIfNotUndefinedWithHeader(cost + " gold", column, "Cost");

    nameToDetailHTML[lowercaseName] = column.html();
}

function processShieldEntry(shield) {

    let name = shield["Name"];
    let acBonus = shield["AC Bonus"];
    let stealth = shield["Stealth"]
    let weight = shield["Weight"];
    let cost = shield["Cost"];

    let armorAndShieldTableBody = $("#armor-and-shields-table-body");

    let tableRow = createArmorAndShieldTableRow(name, "Shield", acBonus, stealth, weight, cost);

    tableRow.click(function(){ displayShieldDetails(createNiceId(name), shield)});
    armorAndShieldTableBody.append(tableRow);
}

function displayShieldDetails(lowercaseName, shield) {

    let column = $("#selected-armor-and-shields");

    /* Clear out the selected information */
    $("#armor-and-shields-table tr").removeClass("table-info");
    column.empty();

    $(`#${lowercaseName}`).addClass("table-info");

    if (nameToDetailHTML[lowercaseName] != undefined) {
        column.html(nameToDetailHTML[lowercaseName]);
        return;
    }

    let name = shield["Name"];
    let acBonus = shield["AC Bonus"];
    let stealth = shield["Stealth"];
    let donStrapped = shield["Don (Strapped)"];
    let donHeld = shield["Don (Held)"];
    let weight = shield["Weight"];
    let cost = shield["Cost"];
    let description = shield["Description"];

    column.append(createH2(name));
    generateParagraphIfNotUndefined(description, column);
    generateParagraphIfNotUndefinedWithHeader(acBonus, column, "AC Bonus");
    generateParagraphIfNotUndefinedWithHeader(stealth, column, "Stealth");
    generateParagraphIfNotUndefinedWithHeader(donStrapped, column, "Don (Strapped)");
    generateParagraphIfNotUndefinedWithHeader(donHeld, column, "Don (Held)");
    generateParagraphIfNotUndefinedWithHeader(weight + " lbs", column, "Weight");
    generateParagraphIfNotUndefinedWithHeader(cost + " gold", column, "Cost");

    nameToDetailHTML[lowercaseName] = column.html();
}

function delay(milliseconds){
    return new Promise(resolve => {
        setTimeout(resolve, milliseconds);
    });
}