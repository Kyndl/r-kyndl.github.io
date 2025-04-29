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
        chooseWarrior.addEventListener("click", () => chooseClass("warrior"));
        chooseRogue.addEventListener("click", () => chooseClass("rogue"));
        chooseMage.addEventListener("click", () => chooseClass("mage"));
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
        localStorage.setItem("xp", 0);
        localStorage.setItem("level", 1);
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

    let playerStats = JSON.parse(localStorage.getItem("playerStats") || '{}');
    let currentHP = parseInt(localStorage.getItem("hp") || "0");
    let xp = parseInt(localStorage.getItem("xp") || "0");
    let level = parseInt(localStorage.getItem("level") || "1");

    if (!playerStats || !playerStats.str) {
        window.location.href = "index.html";
        return;
    }

    const strStat = document.getElementById("str-stat");
    const dexStat = document.getElementById("dex-stat");
    const intStat = document.getElementById("int-stat");
    const hpStat = document.getElementById("hp-stat");
    const levelStat = document.getElementById("level-stat");

    function updateStatsDisplay() {
        if (strStat) strStat.textContent = playerStats.str;
        if (dexStat) dexStat.textContent = playerStats.dex;
        if (intStat) intStat.textContent = playerStats.int;
        if (hpStat) hpStat.textContent = currentHP;
        if (levelStat) levelStat.textContent = `Level: ${level}`;
    }

    updateStatsDisplay();

    function getRandomProblem() {
        const totalDifficulty = problems.reduce((sum, p) => sum + p.difficulty, 0);
        let randomValue = Math.random() * totalDifficulty;
        for (let problem of problems) {
            randomValue -= problem.difficulty;
            if (randomValue <= 0) {
                return problem;
            }
        }
        return problems[0];
    }

    let selectedProblem = getRandomProblem();
    displayProblem(selectedProblem);

    function displayProblem(problem) {
        if (!problem) return;
        document.getElementById("problem-text").textContent = problem.text;
        const buttons = [
            document.getElementById("choice1"),
            document.getElementById("choice2"),
            document.getElementById("choice3")
        ];
        problem.choices.forEach((choice, index) => {
            const btn = buttons[index];
            if (btn) {
                btn.textContent = choice.text;
                btn.onclick = () => handleChoice(choice);
            }
        });
    }

    function handleChoice(choice) {
        if (currentHP <= 0) {
            disableButtons();
            setTimeout(() => {
                location.href = "index.html";
            }, 3000);
            return;
        }

        const d20 = Math.floor(Math.random() * 20) + 1;
        const total = d20 + playerStats[choice.stat];

        localStorage.setItem("choice", choice.text);
        localStorage.setItem("stat", choice.stat);
        localStorage.setItem("result", JSON.stringify({ d20, total }));

        let outcomeText = '';
        let resultText = '';
        let additionalInfo = '';
        let xpGained = 0;

        if (total >= 18) {
            outcomeText = "Perfektní úspěch!";
            resultText = "Získali jste předmět a postupujete dál.";
            const newItem = getRandomItem();
            addItemToInventory(newItem);
            xpGained = 10;
        } else if (total >= 15) {
            outcomeText = "Úspěch!";
            resultText = "Pokročili jste dál.";
            xpGained = 5;
        } else if (total >= 4) {
            outcomeText = "Úspěch, ale s následky.";
            resultText = "Vezmete poškození.";
            additionalInfo = "Poškození: 5 HP.";
            currentHP -= 5;
            xpGained = 2;
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

        xp += xpGained;
        localStorage.setItem("xp", xp);
        localStorage.setItem("hp", currentHP);
        levelUp();
        updateStatsDisplay();

        document.getElementById("outcome-text").textContent = outcomeText;
        document.getElementById("choice-text").textContent = `Volba: ${choice.text}`;
        document.getElementById("result").innerHTML = `
            <p>D20: ${d20} + ${playerStats[choice.stat]} (Stat) = ${total}</p>
            <p>${resultText}</p>
            <p>${additionalInfo}</p>
            <p>Získáno XP: ${xpGained}</p>
        `;

        document.getElementById("hp-display").textContent = `Aktuální životy: ${currentHP}`;

        if (currentHP > 0) {
            selectedProblem = getRandomProblem();
            displayProblem(selectedProblem);
        }
    }

    function disableButtons() {
        const buttons = document.querySelectorAll("button");
        buttons.forEach(btn => btn.disabled = true);
    }

    function levelUp() {
        const xpThreshold = level * 50;
        if (xp >= xpThreshold) {
            level++;
            xp = 0;
            localStorage.setItem("level", level);
            localStorage.setItem("xp", xp);
            alert(`Level up! Jsi nyní lvl ${level}!`);
            const playerStatsRaw = JSON.parse(localStorage.getItem("playerStats"));
            playerStatsRaw.str += 1;
            playerStatsRaw.dex += 1;
            playerStatsRaw.int += 1;
            localStorage.setItem("playerStats", JSON.stringify(playerStatsRaw));
            playerStats = playerStatsRaw;
        }
    }

    // === INVENTORY SYSTEM ===
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

    // === BACK AND MENU BUTTONS ===
    const backButton = document.getElementById("back-button");
    if (backButton) {
        backButton.onclick = () => window.location.href = "encounter.html";
    }

    const menuButton = document.getElementById("menu-button");
    if (menuButton) {
        menuButton.onclick = () => window.location.href = "index.html";
    }
});


// theme changer
    if (localStorage.getItem('theme') === 'dark') {
        document.body.classList.add('dark');
      }
  
      function toggleTheme() {
        document.body.classList.toggle('dark');
        localStorage.setItem('theme', document.body.classList.contains('dark') ? 'dark' : 'light');
      }