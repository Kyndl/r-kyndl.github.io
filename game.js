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
    let problems = [];

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

    function getRandomProblem(problems, level) {
        const weightedProblems = problems.map(p => {
            const distance = Math.abs(p.difficulty - level);
            const weight = 1 / (1 + distance);
            return { ...p, weight };
        });

        const totalWeight = weightedProblems.reduce((sum, p) => sum + p.weight, 0);
        let randomValue = Math.random() * totalWeight;

        for (let problem of weightedProblems) {
            randomValue -= problem.weight;
            if (randomValue <= 0) {
                return problem;
            }
        }
        return weightedProblems[0]; // fallback
    }

    function displayProblem(problem) {
        if (!problem) return;
        document.getElementById("problem-text").textContent = `${problem.text} (Obtížnost: ${problem.difficulty})`;
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

        const difficulty = selectedProblem.difficulty;
        const perfectThreshold = 15 + difficulty * 2;
        const successThreshold = 12 + difficulty * 2;
        const consequenceThreshold = 6 + difficulty;

        if (total >= perfectThreshold) {
            outcomeText = "Perfektní úspěch!";
            resultText = "Získali jste předmět a postupujete dál.";
            const newItem = getRandomItem();
            addItemToInventory(newItem);
            xpGained = 10;
        } else if (total >= successThreshold) {
            outcomeText = "Úspěch!";
            resultText = "Pokročili jste dál.";
            xpGained = 5;
        } else if (total >= consequenceThreshold) {
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
            selectedProblem = getRandomProblem(problems, level);
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

    // =========================
    // === INVENTORY SYSTEM ===
    // =========================
    function getInventory() {
        return JSON.parse(localStorage.getItem("inventory")) || [];
    }

    function saveInventory(inventory) {
        localStorage.setItem("inventory", JSON.stringify(inventory));
    }

    function addItemToInventory(item) {
        const inventory = getInventory();
        const itemWithId = { ...item, id: crypto.randomUUID() }; // Unique ID
        inventory.push(itemWithId);
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
            li.textContent = `${item.name} (${item.rarity})`;
    
            if (item.type === "heal" || item.type === "buff") {
                const btn = document.createElement("button");
                btn.textContent = "Použít";
                btn.setAttribute("data-id", item.id); // Attach item ID
                btn.onclick = () => {
                    useItem(item);
                    removeItemById(item.id);
                };
                li.appendChild(btn);
            }
    
            inventoryList.appendChild(li);
        });
    }

    function removeItemById(id) {
        let inventory = getInventory();
        inventory = inventory.filter(item => item.id !== id);
        saveInventory(inventory);
        updateInventoryDisplay();
    }
    
    
    

    let itemPool = [];

fetch('items.json')
    .then(response => response.json())
    .then(data => itemPool = data)
    .catch(err => console.error("Failed to load items:", err));


    function getRandomItem(difficulty, level) {
        if (itemPool.length === 0) return { name: "Neznámý předmět", rarity: "common", type: "item" };
    
        function getItemRarityWeights(diff, lvl) {
            const delta = diff - lvl;
            return {
                common: Math.max(10, 50 - delta * 2),
                uncommon: Math.max(5, 30 + delta * 1),
                rare: Math.max(0, 15 + delta * 1.5),
                epic: Math.max(0, 5 + delta * 1)
            };
        }
    
        function weightedRandom(weights) {
            const entries = Object.entries(weights);
            const total = entries.reduce((s, [, w]) => s + w, 0);
            let rand = Math.random() * total;
            for (const [rarity, weight] of entries) {
                if (rand < weight) return rarity;
                rand -= weight;
            }
            return "common";
        }
    
        const weights = getItemRarityWeights(difficulty, level);
        const selectedRarity = weightedRandom(weights);
        const filtered = itemPool.filter(i => i.rarity === selectedRarity);
        return filtered[Math.floor(Math.random() * filtered.length)];
    }

    function useItem(item) {
        if (item.type === "heal") {
            currentHP += item.value;
            localStorage.setItem("hp", currentHP);
        } else if (item.type === "buff") {
            playerStats[item.stat] += item.value;
            localStorage.setItem("playerStats", JSON.stringify(playerStats));
        }
    
        alert(`Používáš: ${item.name}!`);
        updateStatsDisplay();
        updateInventoryDisplay();
    }
    
    

    updateInventoryDisplay();



    // ==================
    // === UI SECTION ===
    // ==================


    // === BACK AND MENU BUTTONS ===
    const backButton = document.getElementById("back-button");
    if (backButton) {
        backButton.onclick = () => window.location.href = "encounter.html";
    }

    const menuButton = document.getElementById("menu-button");
    if (menuButton) {
        menuButton.onclick = () => window.location.href = "index.html";
    }

    // Fetch encounters and display one matching player's level
    fetch('encounters.json')
        .then(response => response.json())
        .then(data => {
            problems.length = 0;
            problems.push(...data);
            selectedProblem = getRandomProblem(problems, level);
            displayProblem(selectedProblem);
        })
        .catch(error => {
            console.error('Error fetching encounters:', error);
        });
});



    // ==================
    // === CHANGELOG ====
    // ==================


    fetch('https://api.github.com/repos/Kyndl/r-kyndl.github.io/commits')
        .then(res => res.json())
        .then(data => {
        const list = document.getElementById('changelog');
        data.slice(0, 5).forEach(commit => {
      const li = document.createElement('li');
      li.textContent = `${commit.commit.message} by ${commit.commit.author.name}`;
      list.appendChild(li);
    });
    });


    // window.onload = function () {
    //     const saved = localStorage.getItem('characterData');
    //     if (saved) {
    //       const data = JSON.parse(saved);
    //   
    //       // Apply to your DOM elements however needed
    //       changeHairStyle(data.hairStyle);
    //       changeBody(data.bodyStyle);
    //       changeSkinColor(data.skinColor);
    //       changeEyeColor(data.eyeColor);
    //       changeLegStyle(data.legStyle);
    //     }
    //   };
