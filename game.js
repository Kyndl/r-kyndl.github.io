document.addEventListener('DOMContentLoaded', function () {
    const encounters = {
        level1: [
            {
                name: "Zaječí mýtina",
                text: "Na cestičce vás zastaví malý zajíc.",
                choices: [
                    { text: "Pohladit ho.", next: "outcome.html", stat: "dex" },
                    { text: "Pokračovat v cestě.", next: "outcome.html", stat: "str" },
                    { text: "Zkusit ho chytit.", next: "outcome.html", stat: "dex" }
                ],
                location: { x: 100, y: 50 }
            },
            {
                name: "Starý strom",
                text: "Na kraji lesa je starý strom.",
                choices: [
                    { text: "Prozkoumat strom.", next: "outcome.html", stat: "int" },
                    { text: "Pokračovat dál.", next: "outcome.html", stat: "str" },
                    { text: "Sklonit se a posbírat byliny.", next: "outcome.html", stat: "int" }
                ],
                location: { x: 200, y: 100 }
            },
            {
                name: "Zřícenina",
                text: "Přicházíte ke staré zřícenině.",
                choices: [
                    { text: "Prohledat vchod.", next: "outcome.html", stat: "int" },
                    { text: "Zakřičet dovnitř.", next: "outcome.html", stat: "str" },
                    { text: "Zapsat runy na zdi.", next: "outcome.html", stat: "dex" }
                ],
                location: { x: 320, y: 180 }
            }
        ]
    };

    const playerClass = {
        warrior: 5,
        rogue: 3,
        mage: 2
    };

    const stats = JSON.parse(localStorage.getItem("playerStats") || '{"str": 10, "dex": 10, "int": 10, "class": "warrior", "hp": 15, "level": 1, "xp": 0, "inventory": []}');
    let level = stats.level || 1;
    const classModifier = playerClass[stats.class] || 0;
    const hp = stats.hp || (10 + classModifier + level);

    let inEncounter = false;

    function initMap() {
        const map = document.getElementById("map");
        map.innerHTML = ""; // clear previous map if any

        encounters.level1.forEach((encounter, index) => {
            // Create location dot
            const locationDot = document.createElement("div");
            locationDot.classList.add("location");
            locationDot.style.left = `${encounter.location.x}px`;
            locationDot.style.top = `${encounter.location.y}px`;
            locationDot.onclick = () => {
                if (!inEncounter) triggerEncounter(encounter);
            };

            // Create label
            const label = document.createElement("div");
            label.classList.add("location-label");
            label.style.left = `${encounter.location.x - 20}px`;
            label.style.top = `${encounter.location.y - 25}px`;
            label.textContent = encounter.name;

            map.appendChild(locationDot);
            map.appendChild(label);
        });
    }

    function triggerEncounter(encounter) {
        inEncounter = true;

        document.getElementById("problem-text").textContent = encounter.text;
        document.getElementById("choice1").textContent = encounter.choices[0].text;
        document.getElementById("choice2").textContent = encounter.choices[1].text;
        document.getElementById("choice3").textContent = encounter.choices[2].text;

        document.getElementById("choice1").onclick = () => handleChoice(encounter.choices[0]);
        document.getElementById("choice2").onclick = () => handleChoice(encounter.choices[1]);
        document.getElementById("choice3").onclick = () => handleChoice(encounter.choices[2]);

        updateMap(encounter.location);
    }

    function handleChoice(choice) {
        const { stat, next } = choice;
        const result = rollDice(stat);

        localStorage.setItem("choice", choice.text);
        localStorage.setItem("stat", stat);
        localStorage.setItem("result", JSON.stringify(result));
        localStorage.setItem("hp", stats.hp);
        localStorage.setItem("playerStats", JSON.stringify(stats));

        location.href = next;
    }

    function rollDice(stat) {
        const d20 = Math.floor(Math.random() * 20) + 1;
        const total = d20 + stats[stat];
        return { d20, total };
    }

    function updateMap(location) {
        const map = document.getElementById("map");

        const playerMarker = document.createElement("div");
        playerMarker.classList.add("location", "player-marker");
        playerMarker.style.left = `${location.x}px`;
        playerMarker.style.top = `${location.y}px`;

        map.appendChild(playerMarker);
    }

    initMap();

    document.getElementById("stats-box").innerHTML = `
        <h3>Vaše statistiky</h3>
        <p>Síla: ${stats.str}</p>
        <p>Obratnost: ${stats.dex}</p>
        <p>Inteligence: ${stats.int}</p>
        <p>Úroveň: ${level}</p>
        <p>Životy: ${hp}</p>
    `;
});

document.getElementById("menu-button").onclick = () => location.href = "index.html";

// CSS adjuster
window.onload = function() {
    var cssPath = "standard.css";  // Default CSS
    if (navigator.platform.includes("iPad")) {
        cssPath = "iPad.css";  // Load iPad-specific CSS
    }
    
    var fileref = document.createElement("link");
    fileref.setAttribute("rel", "stylesheet");
    fileref.setAttribute("type", "text/css");
    fileref.setAttribute("href", cssPath);
    document.getElementsByTagName("head")[0].appendChild(fileref);
};
