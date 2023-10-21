/*
 *  Detail:
 *      Map of String -> String
 */
var nameToDetailHTML = {};

$(function () {
    fetch("/json/weapons.json")
    .then((response) => {
        if (!response.ok) {
            throw new Error(`HTTP error, status = ${response.status}`);
        }

        return response.json();
    })
    .then((data) => {
        
        /* Generates the property cards */
        generatePropertyCards(data["properties"]);

        /* Generates the table entries and viewable panels */
        for (const entry of data["entries"]) {
            processWeaponGroupWrapper(entry, data["properties"]);
        }

        /* We don't want to the properties tab to be visible, but we want it to be searchable */
        new DataTable('#weapon-table', {
            columnDefs: [
                {
                    target: 5,
                    visible: false
                }
            ]
        });
    })
});

function generatePropertyCards(properties) {

    let leftColumn = $("#left-side");
    let rightColumn = $("#right-side");
    let leftCount = 0;
    let rightCount = 0;

    for (const propertyName of Object.keys(properties)) {
        if (leftCount > rightCount) {
            addProperty(propertyName, properties[propertyName], rightColumn);
            rightCount += getSize(properties[propertyName]);
        } else {
            addProperty(propertyName, properties[propertyName], leftColumn);
            leftCount += getSize(properties[propertyName]);
        }
    }
}

function addProperty(name, property, column) {
    
    let card = createCard();
    let cardBody = createCardBody(name);

    generatePropertyDescription(property, cardBody);

    card.append(cardBody);
    column.append(card);
}

/*
 *  Description: List of String
 */
function generatePropertyDescription(property, card) {
    generateParagraphsFromList(property, card);
}

function getSize(property) {
    
    let size = 0;

    for (const paragraph of property) {
        size += paragraph.length;
    }

    return size;
}

function createCardBody(name) {

    let div = $("<div>");

    div.addClass("card-body");

    if (name != undefined) {
        div.append(createCardTitle(name));
    }

    return div;
}

function processWeaponGroupWrapper(weaponGroupWrapper, properties) {
    for (const weaponGroupName of Object.keys(weaponGroupWrapper)) {
        processWeaponGroup(weaponGroupWrapper[weaponGroupName], weaponGroupName, properties);
    }
}

function processWeaponGroup(weaponGroup, weaponGroupName, properties) {
    for (const weaponName of weaponGroup) {
        processWeapon(weaponName, weaponGroupName, properties);
    }
}

/*
 *  Weapon:
 *      Name: String
 *      Description: String
 *      Damage Types: String
 *      Weight: Number
 *      Cost: Number
 *      Training: Object
 *      Master Ability: String
 */
function processWeapon(weapon, weaponGroupName, properties) {

    let name = weapon["Name"];
    let damageTypes = weapon["Damage Types"];
    let weight = weapon["Weight"];
    let cost = weapon["Cost"];
    let training = weapon["Training"];

    let weaponTableBody = $("#weapon-table-body");

    let tableRow = createWeaponTableRow(name, weaponGroupName, damageTypes, training, weight, cost);
    
    tableRow.click(function(){ displayDetails(createNiceId(name), weapon, properties) });
    weaponTableBody.append(tableRow);
}

function createWeaponTableRow(name, weaponGroupName, damageTypes, training, weight, cost) {

    let tableRow = createTableRow();

    if (name != undefined) {
        tableRow.attr("id", createNiceId(name));
    }

    generateTableCell(name, tableRow);
    generateTableCell(weaponGroupName, tableRow);
    generateTableCell(damageTypes, tableRow);
    generateTableCell(weight, tableRow);
    generateTableCell(cost, tableRow);
    generateTableCell(getProperties(training).join(" "), tableRow);

    return tableRow;
}

function displayDetails(lowercaseName, weapon, properties) {

    let column = $("#selected-weapon");

    /* Clear out the selected information */
    $("#weapon-table tr").removeClass("table-info");
    column.empty();

    $(`#${lowercaseName}`).addClass("table-info");

    if (nameToDetailHTML[lowercaseName] != undefined) {
        column.html(nameToDetailHTML[lowercaseName]);
        return;
    }

    let name = weapon["Name"];
    let description = weapon["Description"];
    let damageTypes = weapon["Damage Types"];
    let weight = weapon["Weight"];
    let cost = weapon["Cost"];
    let training = weapon["Training"];
    let masterAbility = weapon["Master Ability"];

    column.append(createH2(name));
    generateParagraphIfNotUndefined(description, column);
    generateParagraphIfNotUndefinedWithHeader(damageTypes, column, "Damage Types");
    generateParagraphIfNotUndefinedWithHeader(weight + " lbs", column, "Weight");
    generateParagraphIfNotUndefinedWithHeader(cost + " gold", column, "Cost");
    generateTrainingTable(training, column);
    generateParagraphIfNotUndefinedWithHeader(masterAbility, column, "Master Ability");
    generateProperties(training, column, properties);

    nameToDetailHTML[lowercaseName] = column.html();
}

/*
 *  Training:
 *      Untrained: Object
 *      Trained: Object
 *      Experienced: Object
 *      Expert: Object
 *      Master: Object
 */
function generateTrainingTable(training, column) {

    generateHR(column);

    let table = $("<table>")

    table.addClass("table");
    table.addClass("table-striped");
    table.addClass("table-hover");

    generateTrainingTableHeader(table);

    /* Hardcoding to ensure order is correct */
    generateTrainingTableRow("Untrained", training["Untrained"], table);
    generateTrainingTableRow("Trained", training["Trained"], table);
    generateTrainingTableRow("Experienced", training["Experienced"], table);
    generateTrainingTableRow("Expert", training["Expert"], table);
    generateTrainingTableRow("Master", training["Master"], table);

    column.append(table);
}

function generateTrainingTableHeader(table) {

    let thead = createTableHeader();
    let tr = createTableRow();

    generateTableHeaderCell("Training Level", tr);
    generateTableHeaderCell("Damage", tr);
    generateTableHeaderCell("Properties", tr);

    thead.append(tr);

    table.append(thead);
}

/*
 *  Training Level
 *      Damage: String
 *      Properties: List of String
 */
function generateTrainingTableRow(trainingTitle, trainingLevel, table) {

    let damage = trainingLevel["Damage"];
    let properties = trainingLevel["Properties"];

    let row = createTableRow();

    generateTableCell(trainingTitle, row);
    generateTableCell(damage, row);
    generateTableCell(properties.join(", "), row);

    table.append(row);
}

function generateProperties(training, column, allProperties) {

    let usedProperties = getProperties(training);

    generateHR(column);

    for (const propertyName of usedProperties) {
        addProperty(propertyName, allProperties[propertyName], column);
    }
}

/*
 *  Training:
 *      Untrained: Object
 *      Trained: Object
 *      Experienced: Object
 *      Expert: Object
 *      Master: Object
 *
 *  Training Level
 *      Damage: String
 *      Properties: List of String
 */
function getProperties(training) {

    const uniqueProperties = new Set();

    for (const trainingLevel of Object.keys(training)) {

        if (training[trainingLevel]["Properties"] == undefined) {
            continue;
        }

        for (const propertyName of training[trainingLevel]["Properties"]) {
            uniqueProperties.add(propertyName);
        }
    }

    return Array.from(uniqueProperties).sort();
}

function delay(milliseconds){
    return new Promise(resolve => {
        setTimeout(resolve, milliseconds);
    });
}