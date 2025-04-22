document.addEventListener("DOMContentLoaded", function () {
    // ===============================
    // === CLASS SELECTION SECTION ===
    // ===============================
    const baseStats = {
        warrior: { str: 8, dex: 4, int: 2, hp: 16 },
        rogue: { str: 5, dex: 8, int: 5, hp: 12 },
        mage: { str: 4, dex: 6, int: 8, hp: 12 }
    };

    const chooseWarrior = document.getElementById("chooseWarrior");
    const chooseRogue = document.getElementById("chooseRogue");
    const chooseMage = document.getElementById("chooseMage");

    if (chooseWarrior && chooseRogue && chooseMage) {
        chooseWarrior.addEventListener("click", function () {
            chooseClass("warrior");
        });

        chooseRogue.addEventListener("click", function () {
            chooseClass("rogue");
        });

        chooseMage.addEventListener("click", function () {
            chooseClass("mage");
        });
    }

    function chooseClass(className) {
        const stats = baseStats[className];
        localStorage.setItem("playerStats", JSON.stringify({
            str: stats.str,
            dex: stats.dex,
            int: stats.int,
            class: className
        }));
        localStorage.setItem("hp", stats.hp);
        localStorage.setItem("inventory", JSON.stringify([]));
        window.location.href = 'encounter.html';
    }

    // ===============================
    // ====== ENCOUNTER SECTION ======
    // ===============================
    const problems = [
        {
            text: "Před vámi je zborcený most. Musíte ho přeskočit nebo obejít.",
            difficulty: 1,
            choices: [
                { text: "Přeskočit (Síla)", stat: "str" },
                { text: "Obe jít (Houževnatost)", stat: "dex" },
                { text: "Najít jinou cestu (Inteligence)", stat: "int" }
            ]
        },
        {
            text: "Stojíš před magickým zámkem, který blokuje dveře.",
            difficulty: 2,
            choices: [
                { text: "Rozrazit dveře (Síla)", stat: "str" },
                { text: "Obejít mechanismus (Houževnatost)", stat: "dex" },
                { text: "Rozluštit kouzlo (Inteligence)", stat: "int" }
            ]
        },
        {
            text: "Byl jsi přepaden v temném lese.",
            difficulty: 3,
            choices: [
                { text: "Bojuj (Síla)", stat: "str" },
                { text: "Utíkej (Houževnatost)", stat: "dex" },
                { text: "Oklam je (Inteligence)", stat: "int" }
            ]
        }
    ];

    const playerStats = JSON.parse(localStorage.getItem("playerStats") || '{}');
    let currentHP = parseInt(localStorage.getItem("hp") || "0");

    if (!playerStats || !playerStats.str) {
        window.location.href = "index.html"; // fallback pokud chybí data
        return;
    }

    // show player stats
    const strStat = document.getElementById("str-stat");
    const dexStat = document.getElementById("dex-stat");
    const intStat = document.getElementById("int-stat");
    const hpStat = document.getElementById("hp-stat");

    if (strStat) strStat.textContent = playerStats.str;
    if (dexStat) dexStat.textContent = playerStats.dex;
    if (intStat) intStat.textContent = playerStats.int;
    if (hpStat) hpStat.textContent = currentHP;

    // randomly select a problem based on difficulty
    const totalDifficulty = problems.reduce((sum, p) => sum + p.difficulty, 0);
    let randomValue = Math.random() * totalDifficulty;
    let selectedProblem = null;
    for (let problem of problems) {
        randomValue -= problem.difficulty;
        if (randomValue <= 0) {
            selectedProblem = problem;
            break;
        }
    }

    if (selectedProblem) {
        document.getElementById("problem-text").textContent = selectedProblem.text;
        const buttons = [document.getElementById("choice1"), document.getElementById("choice2"), document.getElementById("choice3")];
        selectedProblem.choices.forEach((choice, index) => {
            const btn = buttons[index];
            btn.textContent = choice.text;
            btn.onclick = function () {
                handleChoice(choice);
            };
        });
    }

    // result display
    function handleChoice(choice) {
        if (currentHP <= 0) return;

        const d20 = Math.floor(Math.random() * 20) + 1;
        const total = d20 + playerStats[choice.stat];

        localStorage.setItem("choice", choice.text);
        localStorage.setItem("stat", choice.stat);
        localStorage.setItem("result", JSON.stringify({ d20, total }));

        let outcomeText = '';
        let resultText = '';
        let additionalInfo = '';

        if (total >= 18) {
            outcomeText = "Perfektní úspěch!";
            resultText = "Získali jste předmět a postupujete dál.";
            const newItem = getRandomItem(); // <-- nový řádek
            addItemToInventory(newItem);     // <-- místo pevného "Tajemný artefakt"
        } else if (total >= 15) {
            outcomeText = "Úspěch!";
            resultText = "Pokročili jste dál.";
        } else if (total >= 4) {
            outcomeText = "Úspěch, ale s následky.";
            resultText = "Vezmete poškození.";
            additionalInfo = "Poškození: 5 HP.";
            currentHP -= 5;
        } else {
            outcomeText = "Neúspěch!";
            resultText = "Nepodařilo se vám to. Zemřeli jste!";
            additionalInfo = "Hráč umírá a končí hru.";
            currentHP = 0;
            disableButtons();
            setTimeout(() => {
                location.href = "index.html";
            }, 3000);
        }

        document.getElementById("outcome-text").textContent = outcomeText;
        document.getElementById("choice-text").textContent = `Volba: ${choice.text}`;
        document.getElementById("result").innerHTML = `
            <p>D20: ${d20} + ${playerStats[choice.stat]} (Stat) = ${total}</p>
            <p>${resultText}</p>
            <p>${additionalInfo}</p>
        `;

        document.getElementById("hp-display").textContent = `Aktuální životy: ${currentHP}`;
        localStorage.setItem("hp", currentHP);

        if (currentHP <= 0) {
            disableButtons();
            setTimeout(() => {
                location.href = "index.html";
            }, 3000);
        }
    }

    function disableButtons() {
        const buttons = document.querySelectorAll("button");
        buttons.forEach(btn => btn.disabled = true);
    }

    // inventory 
    function getInventory() {
        return JSON.parse(localStorage.getItem("inventory")) || [];
    }

    function saveInventory(inventory) {
        localStorage.setItem("inventory", JSON.stringify(inventory));
    }

    function addItemToInventory(item) {
        const inventory = getInventory();
        inventory.push(item);
        saveInventory(inventory);
        updateInventoryDisplay();
    }

    function updateInventoryDisplay() {
        const inventoryList = document.getElementById("inventory-list");
        if (!inventoryList) return;

        const inventory = getInventory();
        inventoryList.innerHTML = inventory.length === 0 ? "<li>Prázdný</li>" : '';
        inventory.forEach(item => {
            const li = document.createElement("li");
            li.textContent = item;
            inventoryList.appendChild(li);
        });
    }

    function getRandomItem() {
        const items = [
            "Léčivý lektvar",
            "Kouzelný kámen",
            "Zrezivělý klíč",
            "Stříbrná dýka",
            "Amulet štěstí",
            "Neviditelný plášť",
            "Starý svitek",
            "Tajemný krystal"
        ];
        const index = Math.floor(Math.random() * items.length);
        return items[index];
    }
    

    updateInventoryDisplay();

    // back and menu buttons
    const backButton = document.getElementById("back-button");
    if (backButton) {
        backButton.onclick = function () {
            window.location.href = "encounter.html";
        };
    }

    const menuButton = document.getElementById("menu-button");
    if (menuButton) {
        menuButton.onclick = function () {
            window.location.href = "index.html";
        };
    }
});
