const CLASSES = fetch("/data/classes.json")
    .then(response => response.json())
    .catch(error => console.log(error));

let startingClass;

async function init() {
    await populate();
    await update();
}

async function update() {
    // get current starting class
    let classSelect = document.getElementById("class");
    let currentClass = (await CLASSES).find(c => c.id == classSelect.options[classSelect.selectedIndex].value);

    let prevClass = { ...startingClass };
    if (prevClass.id != currentClass) {
        // update statistics 
        [...document.getElementsByName("stat")].forEach((stat, i) => {
            stat.value = parseInt((stat.value || 0) == prevClass.stats[i] ? currentClass.stats[i] : stat.value);
        });
        document.getElementById("level").value = [...document.getElementsByName("stat")].reduce((total, stat) => total + parseInt(stat), 0) - 79;
    }
    startingClass = currentClass;
}
async function populate() {
    let select = document.getElementById("class");

    CLASSES.then(classes => {
        classes.forEach(c => {
            let option = new Option(c.name, c.id);
            select.options.add(option);
        });
        select.selectedIndex = 0;
        startingClass = classes[0];
    });
}