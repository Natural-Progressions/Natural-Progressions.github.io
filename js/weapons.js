$(function () {
    fetch("/json/weapons.json")
    .then((response) => {
        if (!response.ok) {
            throw new Error(`HTTP error, status = ${response.status}`);
        }

        return response.json();
    })
    .then((data) => {
        
        generatePropertyCards(data["properties"]);
        for (const entry of data["entries"]) {
            processWeaponGroupWrapper(entry, data["properties"]);
        }
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
function generateCardParagraphsFromList(property, column) {
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
    let description = weapon["Description"];
    let damageTypes = weapon["Damage Types"];
    let weight = weapon["Weight"];
    let cost = weapon["Cost"];
    let training = weapon["Training"];
    let masterAbility = weapon["Master Ability"];

    let weaponTableBody = $("#weapon-table-body");

    generateWeaponTableRow(name, weaponGroupName, damageTypes, training, weight, cost, weaponTableBody);
    // TODO: Handle creation of selected data + the act of selecting rows
}

function generateWeaponTableRow(name, weaponGroupName, damageTypes, training, weight, cost, weaponTableBody) {

    let tableRow = createTableRow();

    generateTableCell(name, tableRow);
    generateTableCell(weaponGroupName, tableRow);
    generateTableCell(damageTypes, tableRow);
    // generateTableTrainingDamage(training, tableRow);
    generateTableCell(weight, tableRow);
    generateTableCell(cost, tableRow);

    weaponTableBody.append(tableRow);
}

/*
 *  Training:
 *      Untrained: Object
 *      Trained: Object
 *      Experienced: Object
 *      Expert: Object
 *      Master: Object
 */
function generateTableTrainingDamage(training, tableRow) {
    /* Hardcoding to ensure order is correct */
    generateTrainingTableCell(training["Untrained"], tableRow);
    generateTrainingTableCell(training["Trained"], tableRow);
    generateTrainingTableCell(training["Experienced"], tableRow);
    generateTrainingTableCell(training["Expert"], tableRow);
    generateTrainingTableCell(training["Master"], tableRow);
}

/*
 *  Training Level
 *      Damage: String
 *      Properties: List of String
 */
function generateTrainingTableCell(trainingLevel, tableRow) {
    generateTableCell(trainingLevel["Damage"], tableRow);
}