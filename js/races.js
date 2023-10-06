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
        primaryAbilityData.html("Your " + createBoldText(primaryAbilityModifier) + " ability modifier increases by 1");
    }

    if (secondaryAbilityModifier != undefined) {
        secondaryAbilityData.html("Your " + createBoldText(secondaryAbilityModifier) + " ability modifier increases by 1");
    }

    tableRow.append(nameData);
    tableRow.append(primaryAbilityData);
    tableRow.append(secondaryAbilityData);

    tbody.append(tableRow);
}