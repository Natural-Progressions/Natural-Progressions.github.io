/*
 *  Detail:
 *      Map of String -> String
 */
var nameToDetailHTML = {};

$(function () {
    fetch("/json/spells.json")
    .then((response) => {
        if (!response.ok) {
            throw new Error(`HTTP error, status = ${response.status}`);
        }

        return response.json();
    })
    .then((data) => {

        /* Generates spell table entries and viewable panels */
        for (const entry of data["entries"]) {
            processSpellEntry(entry);
        }
        
        new DataTable('#spells-table', {
            columnDefs: [
                {
                    target: 5,
                    visible: false
                },
                {
                    target: 6,
                    visible: false
                }
            ],
            lengthMenu: [
                [-1, 10, 25, 50, 100],
                ['All', 10, 25, 50, 100]
            ]
        });
    })
});

/*
 *  Spell:
 *      level: Number
 *      manaCost: Number
 *      name: String
 *      schoolOfMagic: String
 *      castingTime: String
 *      range: String
 *      components: Object
 *      duration: String
 *      effect: List of String
 *      damageTypes: List of String
 *      classes: List of String
 */
function processSpellEntry(spell) {

    let name = spell["name"];
    let level = spell["level"];
    let schoolOfMagic = spell["schoolOfMagic"];
    let castingTime = spell["castingTime"];
    let range = spell["range"];
    let damageTypes = spell["damageTypes"];
    let classes = spell["classes"];

    let spellsTableBody = $("#spells-table-body");

    let tableRow = createSpellsTableRow(name, level, schoolOfMagic, castingTime, range, damageTypes, classes);

    tableRow.click(function(){ displayDetails(createNiceId(name), spell)});
    spellsTableBody.append(tableRow);

}

function createSpellsTableRow(name, level, schoolOfMagic, castingTime, range, damageTypes, classes) {
    
    let tableRow = createTableRow();

    if (name != undefined) {
        tableRow.attr("id", createNiceId(name));
    }

    generateTableCell(name, tableRow);
    generateTableCell(level, tableRow);
    generateTableCell(schoolOfMagic, tableRow);
    generateTableCell(castingTime, tableRow);
    generateTableCell(range, tableRow);
    generateTableCell(damageTypes.join(" "), tableRow);
    generateTableCell(classes.join(" "), tableRow);

    return tableRow;
}

function displayDetails(lowercaseName, spell) {

    let column = $("#selected-spells");

    /* Clear out the selected information */
    $("#spells-table tr").removeClass("table-info");
    column.empty();

    $(`#${lowercaseName}`).addClass("table-info");

    if (nameToDetailHTML[lowercaseName] != undefined) {
        column.html(nameToDetailHTML[lowercaseName]);
        return;
    }

    let level = spell["level"];
    let manaCost = spell["manaCost"];
    let name = spell["name"];
    let schoolOfMagic = spell["schoolOfMagic"];
    let castingTime = spell["castingTime"];
    let range = spell["range"];
    let components = spell["components"];
    let duration = spell["duration"];
    let effect = spell["effect"];
    let damageTypes = spell["damageTypes"];
    let classes = spell["classes"];

    column.append(createH2(name));
    generateParagraphIfNotUndefinedWithHeader(level, column, "Level");
    generateParagraphIfNotUndefinedWithHeader(manaCost, column, "Mana Cost");
    generateParagraphIfNotUndefinedWithHeader(castingTime, column, "Casting Time");
    generateParagraphIfNotUndefinedWithHeader(range, column, "Range");
    generateComponents(components, column);
    generateParagraphIfNotUndefinedWithHeader(duration, column, "Duration");
    generateParagraphIfNotUndefinedWithHeader(schoolOfMagic, column, "School of Magic");
    
    if (damageTypes != undefined && damageTypes.length != 0) {
        generateParagraphIfNotUndefinedWithHeader(damageTypes.join(", "), column, "Damage Types");
    }

    if (classes != undefined && classes.length != 0) {
        generateParagraphIfNotUndefinedWithHeader(classes.join(", "), column, "Classes");
    }

    generateHR(column);
    generateParagraphsFromListIfNotUndefined(effect, column);

    nameToDetailHTML[lowercaseName] = column.html();
}

/*
 *  components:
 *      verbal: Boolean
 *      somatic: Boolean
 *      material: String
 */
function generateComponents(components, column) {

    if (components == undefined) {
        return;
    }

    let verbal = components["verbal"];
    let somatic = components["somatic"];
    let material = components["material"];

    let componentsList = [];

    if (verbal != undefined && verbal == true) {
        componentsList.push("V");
    }

    if (somatic != undefined && somatic == true) {
        componentsList.push("S");
    }

    if (material != undefined) {
        componentsList.push("M (" + material + ")");
    }

    generateParagraphIfNotUndefinedWithHeader(componentsList.join(", "), column, "Components");
}

function delay(milliseconds){
    return new Promise(resolve => {
        setTimeout(resolve, milliseconds);
    });
}