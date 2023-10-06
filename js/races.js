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

    let content = createNavEntry(name);
    content.append(createH1(name));

    generateDescription(description, content);
    generateNames(names, content);
    generateTraits(traits, content, name);
    generateHalfRaces(halfRaces, name);
}

/*
 *  Description: List
 */
function generateDescription(description, content) {

    if (description == undefined) {
        return;
    }

    generateParagraphsFromListIfNotUndefined(description, content);

    content.append($("<hr>"));
}

/*
 *  Names:
 *      Description: List of String
 *      Male Names: String
 *      Female Names: String
 *      Other Sections: Object
 *          (variable): String
 */
function generateNames(names, content) {

    if (names == undefined) {
        return;
    }

    content.append(createH2("Names"));

    const description = names["Description"];
    const maleNames = names["Male Names"];
    const femaleNames = names["Female Names"];
    const otherSections = names["Other Sections"];

    generateParagraphIfNotUndefined(description, content);
    generateParagraphIfNotUndefinedWithHeader(maleNames, content, "Male Names");
    generateParagraphIfNotUndefinedWithHeader(femaleNames, content, "Female Names");

    if (otherSections != undefined) {
        for (let title of Object.keys(otherSections)) {
            generateParagraphWithHeader(otherSections[title], content, title);
        }
    }
}

/*
 *  Traits:
 *      Ability Modifier Increases: List of String
 *      Age: String
 *      Languages: String
 *      Senses: String
 *      Size: String
 *      Speed: String
 *      Combat Training: String
 *      Magic Bonuses: String
 *      Tool Bonuses: String
 *      Other Abilities: Object
 *          (variable): List of String
 */
function generateTraits(traits, content, name) {

    if (traits == undefined) {
        return;
    }

    content.append(createH2("Traits"));

    const abilityModifierIncreases = traits["Ability Modifier Increases"];
    const age = traits["Age"];
    const languages = traits["Languages"];
    const senses = traits["Senses"];
    const size = traits["Size"];
    const speed = traits["Speed"];
    const combatTraining = traits["Combat Training"];
    const magicBonuses = traits["Magic Bonuses"];
    const toolBonuses = traits["Tool Bonuses"];
    const otherAbilities = traits["Other Abilities"];

    generateParagraphsFromListIfNotUndefined(abilityModifierIncreases, content);
    generateParagraphIfNotUndefined(age, content, "Age");
    generateParagraphIfNotUndefinedWithHeader(languages, content, "Languages");
    generateParagraphIfNotUndefinedWithHeader(senses, content, "Senses");
    generateParagraphIfNotUndefinedWithHeader(size, content, "Size");
    generateParagraphIfNotUndefinedWithHeader(speed, content, "Speed");
    generateParagraphIfNotUndefinedWithHeader(combatTraining, content, "Combat Training");
    generateParagraphIfNotUndefinedWithHeader(magicBonuses, content, "Magic Bonuses");
    generateParagraphIfNotUndefinedWithHeader(toolBonuses, content, "Tool Bonuses");

    let abilityNames = "";

    if (otherAbilities != undefined) {
        for (let title of Object.keys(otherAbilities)) {
            generateParagraphWithHeader(otherAbilities[title], content, title);
        }

        abilityNames = Object.keys(otherAbilities).join(", ");
    }

    let tbody = $("#half-race-trait-table-body");

    if (tbody == undefined) {
        return;
    }

    let tableRow = $("<tr>");

    let nameData = $("<td>");
    let abilityNamesData = $("<td>");

    nameData.html(name);

    if (abilityNames != "") {
        abilityNamesData.html(abilityNames);
    } else {
        abilityNamesData.html("No unique traits");
    }

    tableRow.append(nameData);
    tableRow.append(abilityNamesData);

    tbody.append(tableRow);
}

/*
 *  Half-Races
 *      Primary Ability Modifier: String
 *      Secondary Ability Modifier: String
 */
function generateHalfRaces(halfRaces, name) {

    if (halfRaces == undefined) {
        return;
    }

    let tbody = $("#half-race-ability-modifier-table-body");

    if (tbody == undefined) {
        return;
    }

    let tableRow = $("<tr>");

    let nameData = $("<td>");
    let primaryAbilityData = $("<td>");
    let secondaryAbilityData = $("<td>");

    const primaryAbilityModifier = halfRaces["Primary Ability Modifier"];
    const secondaryAbilityModifier = halfRaces["Secondary Ability Modifier"];

    nameData.html(name);

    if (primaryAbilityModifier != undefined) {

        if (primaryAbilityModifier == "Any") {
            primaryAbilityData.html("You can increase the ability modifier of one ability by 1");
        } else {
            primaryAbilityData.html("Your " + createBoldText(primaryAbilityModifier) + " ability modifier increases by 1");
        }
    }

    if (secondaryAbilityModifier != undefined) {

        if (secondaryAbilityModifier == "Any") {
            secondaryAbilityData.html("You can increase the ability modifier of one ability by 1");
        } else {
            secondaryAbilityData.html("Your " + createBoldText(secondaryAbilityModifier) + " ability modifier increases by 1");
        }
    }

    tableRow.append(nameData);
    tableRow.append(primaryAbilityData);
    tableRow.append(secondaryAbilityData);

    tbody.append(tableRow);
}