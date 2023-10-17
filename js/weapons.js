$(function () {
    fetch("/json/weapons.json")
    .then((response) => {
        if (!response.ok) {
            throw new Error(`HTTP error, status = ${response.status}`);
        }

        return response.json();
    })
    .then((data) => {
        for (const entry of data["entries"]) {
            processWeaponGroupWrapper(entry, data["properties"]);
        }
    })
});

function processWeaponGroupWrapper(weaponGroupWrapper, properties) {
    for (const weaponGroupName of Object.keys(weaponGroupWrapper)) {
        processWeaponGroup(weaponGroupWrapper[weaponGroupName], name, properties);
    }
}

function processWeaponGroup(weaponGroup, weaponGroupName, properties) {
    for (const weaponName of weaponGroup) {
        processWeapon(weaponName, weaponGroupName, properties);
    }
}

function processWeapon(weapon, weaponGroupName, properties) {
    console.log(weapon);
    console.log(weaponGroupName);
    console.log(properties);
}