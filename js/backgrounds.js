$(function () {
    fetch("/json/backgrounds.json")
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
    const skillIncreases = entry["Skill Modifier Increases"];
    const toolIncreases = entry["Tool Modifier Increases"];
    const startingEquipment = entry["Starting Equipment"];
    const uniqueTrait = entry["Unique Trait"];

    let div = $("#backgrounds");
    let card = createCard();
    let cardBody = createCardBody(name);

    generateSkillIncreases(skillIncreases, cardBody);
    generateToolIncreases(toolIncreases, cardBody);
    generateStartingEquipment(startingEquipment, cardBody);
    generateUniqueTrait(uniqueTrait, cardBody);

    card.append(cardBody);
    div.append(card);

}

/*
 * Name: String
 */
function createCardBody(name) {

    let div = $("<div>");

    div.addClass("card-body");

    if (name != undefined) {
        div.append(createCardTitle(name));
    }

    return div;
}

/*
 *  Skill Modifier Increases: String
 */
function generateSkillIncreases(skillIncreases, cardBody) {
    generateCardParagraphIfNotUndefinedWithHeader(skillIncreases, cardBody, "Skill Modifier Increases");
}

/*
 *  Tool Modifier Increases: String
 */
function generateToolIncreases(toolIncreases, cardBody) {
    generateCardParagraphIfNotUndefinedWithHeader(toolIncreases, cardBody, "Tool Modifier Increases");

}

/*
 *  Starting Equipment: String
 */
function generateStartingEquipment(startingEquipment, cardBody) {
    generateCardParagraphIfNotUndefinedWithHeader(startingEquipment, cardBody, "Starting Equipment");

}

/*
 *  Unique Trait: Object
 *      Name: String
 *      Description: String
 */
function generateUniqueTrait(uniqueTrait, cardBody) {

    if (uniqueTrait == undefined) {
        return;
    }

    let name = uniqueTrait["Name"];
    let description = uniqueTrait["Description"];

    generateCardParagraphIfNotUndefinedWithHeader(description, cardBody, name);
}