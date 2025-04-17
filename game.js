// game.js

document.addEventListener("DOMContentLoaded", function () {
    // Define problems with a difficulty weight
    const problems = [
        {
            text: "Před vámi je zborcený most. Musíte ho přeskočit nebo obejít.",
            difficulty: 1, // Easy (success chance 100% for lower rolls)
            choices: [
                { text: "Přeskočit (Síla)", stat: "str" },
                { text: "Obe jít (Houževnatost)", stat: "dex" },
                { text: "Najít jinou cestu (Inteligence)", stat: "int" }
            ]
        },
        {
            text: "Stojíš před magickým zámkem, který blokuje dveře.",
            difficulty: 2, // Medium
            choices: [
                { text: "Rozrazit dveře (Síla)", stat: "str" },
                { text: "Obejít mechanismus (Houževnatost)", stat: "dex" },
                { text: "Rozluštit kouzlo (Inteligence)", stat: "int" }
            ]
        },
        {
            text: "Byl jsi přepaden v temném lese.",
            difficulty: 3, // Hard
            choices: [
                { text: "Bojuj (Síla)", stat: "str" },
                { text: "Utíkej (Houževnatost)", stat: "dex" },
                { text: "Oklam je (Inteligence)", stat: "int" }
            ]
        }
    ];

    // Load or initialize player stats
    const playerStats = JSON.parse(localStorage.getItem("playerStats") || '{"str": 10, "dex": 10, "int": 10, "class": "warrior"}');
    let currentHP = parseInt(localStorage.getItem("hp") || "10");
    const maxHP = 15; // Store the initial maxHP for resetting

    // Display stats
    document.getElementById("str-stat").textContent = playerStats.str;
    document.getElementById("dex-stat").textContent = playerStats.dex;
    document.getElementById("int-stat").textContent = playerStats.int;
    document.getElementById("hp-stat").textContent = currentHP;

    // Pick a random problem based on difficulty weighting
    const totalDifficulty = problems.reduce((sum, problem) => sum + problem.difficulty, 0);
    let randomValue = Math.random() * totalDifficulty;
    let selectedProblem = null;
    for (let problem of problems) {
        randomValue -= problem.difficulty;
        if (randomValue <= 0) {
            selectedProblem = problem;
            break;
        }
    }

    // Display selected problem
    document.getElementById("problem-text").textContent = selectedProblem.text;

    // Assign choices for the selected problem
    const buttons = [document.getElementById("choice1"), document.getElementById("choice2"), document.getElementById("choice3")];
    selectedProblem.choices.forEach((choice, index) => {
        const btn = buttons[index];
        btn.textContent = choice.text;
        btn.onclick = function () {
            const d20 = Math.floor(Math.random() * 20) + 1;
            const total = d20 + playerStats[choice.stat];

            // Store choices and results in localStorage
            localStorage.setItem("choice", choice.text);
            localStorage.setItem("stat", choice.stat);
            localStorage.setItem("result", JSON.stringify({ d20, total }));

            // Reset HP and disable inputs if health is zero
// Inside your choice button click event:
if (currentHP <= 0) {
    // Reset HP to maxHP (or adjust as needed)
    currentHP = maxHP;
    document.getElementById("hp-display").textContent = `Aktuální životy: ${currentHP}`; // Update HP display

    // Save updated health back to localStorage
    localStorage.setItem("hp", currentHP);

    // Disable all user inputs
    const inputs = document.querySelectorAll('button, input, textarea, select');
    inputs.forEach(input => {
        input.disabled = true;
    });

    // Redirect to index.html after 3 seconds
    setTimeout(() => {
        location.href = "index.html";
    }, 3000);
} else {
    // Continue with the outcome logic as usual
    // Adjust HP based on result
    let outcomeText = '';
    let resultText = '';
    let additionalInfo = '';
    if (total >= 18) {
        outcomeText = "Perfektní úspěch!";
        resultText = `Získali jste předmět a postupujete dál.`;
        additionalInfo = rewardItem;  // Assuming 'rewardItem' is predefined elsewhere
    } else if (total >= 15) {
        outcomeText = "Úspěch!";
        resultText = `Pokročili jste dál.`;
    } else if (total >= 4) {
        outcomeText = "Úspěch, ale s následky.";
        resultText = `Vezmete poškození.`;
        additionalInfo = "Poškození: 5 HP.";
        currentHP -= 5; // Subtract 5 HP on success with consequences
    } else {
        outcomeText = "Neúspěch!";
        resultText = `Nepodařilo se vám to. Zemřeli jste!`;
        additionalInfo = "Hráč umírá a končí hru.";
        currentHP = 0; // Player dies
    }

    // Update the outcome display
    document.getElementById("outcome-text").textContent = outcomeText;
    document.getElementById("result").innerHTML = `...`; // Updated HTML for result

    // Update health display
    document.getElementById("hp-display").textContent = `Aktuální životy: ${currentHP}`;

    // Save updated health back to localStorage
    localStorage.setItem("hp", currentHP);
}


            // Adjust HP based on result
            let outcomeText = '';
            let resultText = '';
            let additionalInfo = '';
            if (total >= 18) {
                outcomeText = "Perfektní úspěch!";
                resultText = `Získali jste předmět a postupujete dál.`;
                // Assuming 'rewardItem' is predefined elsewhere
                additionalInfo = rewardItem;
            } else if (total >= 15) {
                outcomeText = "Úspěch!";
                resultText = `Pokročili jste dál.`;
            } else if (total >= 4) {
                outcomeText = "Úspěch, ale s následky.";
                resultText = `Vezmete poškození.`;
                additionalInfo = "Poškození: 5 HP.";
                currentHP -= 5; // Subtract 5 HP on success with consequences
            } else {
                outcomeText = "Neúspěch!";
                resultText = `Nepodařilo se vám to. Zemřeli jste!`;
                additionalInfo = "Hráč umírá a končí hru.";
                currentHP = 0; // Player dies, health is 0
                document.getElementById("menu-button").disabled = true; // Disable menu button until game ends
                setTimeout(() => {
                    location.href = "index.html";
                }, 3000); // Redirect to index.html after 3 seconds
            }

            // Update the outcome display
            document.getElementById("outcome-text").textContent = outcomeText;
            document.getElementById("choice-text").textContent = `Volba: ${choice.text}`;
            document.getElementById("result").innerHTML = `
                <p>D20: ${d20} + ${playerStats[choice.stat]} (Stat) = ${total}</p>
                <p>${resultText}</p>
                <p>${additionalInfo}</p>
            `;

            // Update health display
            document.getElementById("hp-display").textContent = `Aktuální životy: ${currentHP}`;

            // Save updated health back to localStorage
            localStorage.setItem("hp", currentHP);

            // Inventory functions
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
                inventoryList.innerHTML = "";

                if (inventory.length === 0) {
                    inventoryList.innerHTML = "<li>Prázdný</li>";
                    return;
                }

                inventory.forEach(item => {
                    const li = document.createElement("li");
                    li.textContent = item;
                    inventoryList.appendChild(li);
                });
            }

            // Clear stored values after outcome
            localStorage.removeItem("choice");
            localStorage.removeItem("stat");
            localStorage.removeItem("result");

            // Back button logic
            document.getElementById("back-button").onclick = function () {
                // Return to the encounter page
                location.href = "encounter.html";
            };
        };
    });

    // Optional: Menu button
    document.getElementById("menu-button").onclick = function () {
        window.location.href = "index.html";
    };
});
