/*
 *  Detail:
 *      Map of String -> String
 */
var nameToDetailHTML = {};

/*
 *  Column Names:
 *      Map of String -> index
 */
var columnNames = {
    "WEAPON": 0,
    "WEAPON GROUP": 1,
    "DAMAGE TYPE": 2,
    "WEIGHT": 3,
    "COST": 4,
    "PROPERTY": 5
}

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
            ],
            lengthMenu: [
                [-1, 10, 25, 50, 100],
                ['All', 10, 25, 50, 100]
            ]
        });

        DataTable.ext.search.push(function (settings, data, dataIndex) {

            let text = $('#weapon-table').DataTable().search();
            // console.log(settings);
            // console.log(data);
            // console.log(dataIndex);

            if (text == undefined || text == '') {
                return true;
            }

            /* If the text doesn't have a colon, do a normal check; data is a list of Strings (a row in the table) */
            if (!text.includes(":")) {
                // console.log(data);
                // console.log(text);
                if (data[0].startsWith('Bar')) {
                    checkCellDEBUG(data, text);
                }
                
                return checkCell(data, text);
            }

            /* At this point, the search is something like Weapon:Bar Mace -- it's assumed to be in the format of column:search */
            let columnSearch = text.split(":");
            console.log(columnSearch);
            console.log(columnSearch[0]);
            console.log(columnSearch[1]);
            console.log(columnNames[columnSearch[0]]);
            console.log(data[columnNames[columnSearch[0]]]);

            return stringContains(data[columnNames[columnSearch[0]]], columNSearch[1]);
        });
    })
});

function stringContains(whole, part) {
    return whole.toUpperCase().includes(part.toUpperCase());
}

function checkCell(data, text) {
    for (const cell of data) {
        if (cell == undefined || cell == '') {
            continue;
        }

        /* When searching "bar" in weapons, we want to check if "bar" is in "Bar Mace", not if "Bar Mace" is in "bar" */
        if (stringContains(cell, text)) {
            return true;
        }
    }

    return false;
}

function checkCellDEBUG(data, text) {
    console.log(data);
    console.log(text);
    for (const cell of data) {
        console.log(cell);
        if (cell == undefined || cell == '') {
            continue;
        }
        
        console.log(stringContains(cell, text));

        if (stringContains(cell, text)) {
            return true;
        }
    }

    return false;
}

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

    if (property == undefined) {
        console.log(name);
        return;
    }
    
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

    let table = createTable();

    generateTrainingTableHeader(table);

    let tbody = createTableBody();

    /* Hardcoding to ensure order is correct */
    generateTrainingTableRow("Untrained", training["Untrained"], tbody);
    generateTrainingTableRow("Trained", training["Trained"], tbody);
    generateTrainingTableRow("Experienced", training["Experienced"], tbody);
    generateTrainingTableRow("Expert", training["Expert"], tbody);
    generateTrainingTableRow("Master", training["Master"], tbody);
    
    table.append(tbody);
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
function generateTrainingTableRow(trainingTitle, trainingLevel, tbody) {

    let damage = trainingLevel["Damage"];
    let properties = trainingLevel["Properties"];

    let row = createTableRow();

    generateTableCell(trainingTitle, row);
    generateTableCell(damage, row);
    generateTableCell(properties.join(", "), row);

    tbody.append(row);
}

function generateProperties(training, column, allProperties) {

    let usedProperties = getProperties(training);

    generateHR(column);

    for (const propertyName of usedProperties) {

        let propertyDefinition = allProperties[propertyName];

        if (propertyDefinition == undefined) {
            /* Versatile generally is something like "Versatile 1d10" */
            if (propertyName.startsWith("Versatile")) {
                propertyDefinition = allProperties["Versatile"];
            }

            /* Melee may have a different damage amount depending on the weapon */
            if (propertyName.startsWith("Melee")) {
                propertyDefinition = allProperties["Melee"];
            }

            /* Reload will have a time amount associated with it */
            if (propertyName.startsWith("Reload")) {
                propertyDefinition = allProperties["Reload"];
            }

            /* There are no properties associated with Natural Weapons at Untrained */
            if (propertyName == "[None]") {
                continue;
            }
        }
        addProperty(propertyName, propertyDefinition, column);
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

        let ignoredProperties = ["You cannot wield an intercepter without training", ""];

        for (const propertyName of training[trainingLevel]["Properties"]) {

            if (ignoredProperties.includes(propertyName)) {
                continue;
            }

            /* Handle "deflect (d4)" properly */
            if (propertyName.includes(" (")) {
                uniqueProperties.add(propertyName.split(" (")[0]);
            } else {
                uniqueProperties.add(propertyName);
            }
        }
    }

    return Array.from(uniqueProperties).sort();
}

function delay(milliseconds){
    return new Promise(resolve => {
        setTimeout(resolve, milliseconds);
    });
}