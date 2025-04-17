const encounters = {
    level1: [
      {
        text: "Na cestičce vás zastaví malý zajíc.",
        choices: [
          { text: "Pohladit ho.", next: "pet.html" },
          { text: "Pokračovat v cestě.", next: "walkaway.html" },
          { text: "Zkusit ho chytit.", next: "chase.html" }
        ]
      },
      {
        text: "Na kraji lesa je starý strom.",
        choices: [
          { text: "Prozkoumat strom.", next: "tree.html" },
          { text: "Pokračovat dál.", next: "walkaway.html" },
          { text: "Sklonit se a posbírat byliny.", next: "herbs.html" }
        ]
      }
    ],
    level2: [
      {
        text: "Křižovatka se třemi směry.",
        choices: [
          { text: "Vydat se doprava.", next: "right.html" },
          { text: "Vydat se doleva.", next: "left.html" },
          { text: "Jít rovně.", next: "straight.html" }
        ]
      },
      {
        text: "Starý vchod do opuštěné jeskyně.",
        choices: [
          { text: "Vstoupit do jeskyně.", next: "cave.html" },
          { text: "Prozkoumat vchod.", next: "explore.html" },
          { text: "Zavolat, jestli někdo odpoví.", next: "call.html" }
        ]
      }
    ],
    level3: [
      {
        text: "V lese vidíte divokého králíka.",
        choices: [
          { text: "Snažit se ho chytit.", next: "catch.html" },
          { text: "Nechat ho běžet.", next: "letgo.html" },
          { text: "Vydat se jinam.", next: "walkaway.html" }
        ]
      },
      {
        text: "V dáli je vidět osamělý maják.",
        choices: [
          { text: "Jít k majáku.", next: "lighthouse.html" },
          { text: "Zůstat a pozorovat.", next: "watch.html" },
          { text: "Odebrat se do lesa.", next: "forest.html" }
        ]
      }
    ],
    level4: [
      {
        text: "Na cestě potkáte postavu s dlouhým pláštěm.",
        choices: [
          { text: "Pozdravit ho.", next: "greet.html" },
          { text: "Přistoupit k němu opatrně.", next: "approach.html" },
          { text: "Pokračovat dál.", next: "ignore.html" }
        ]
      },
      {
        text: "Před vámi stojí neznámá, stará stavba.",
        choices: [
          { text: "Prozkoumat stavbu.", next: "explore.html" },
          { text: "Zavolat do stavby.", next: "call.html" },
          { text: "Ignorovat a jít dál.", next: "walkaway.html" }
        ]
      }
    ],
    level5: [
      {
        text: "Narazíte na malý tábor v lese.",
        choices: [
          { text: "Přistoupit a zjistit, kdo tam je.", next: "camp.html" },
          { text: "Skrýt se a pozorovat.", next: "watch.html" },
          { text: "Odejít a pokračovat.", next: "leave.html" }
        ]
      },
      {
        text: "V dálce vidíte zvláštní kouř stoupající z lesa.",
        choices: [
          { text: "Jít k němu.", next: "smoke.html" },
          { text: "Vyčkat a pozorovat.", next: "wait.html" },
          { text: "Odejít na opačnou stranu.", next: "away.html" }
        ]
      }
    ],
    level6: [
      {
        text: "Objevíte skupinu divokých zvířat na lovu.",
        choices: [
          { text: "Zůstat tichý a sledovat je.", next: "watch.html" },
          { text: "Vydat se proti nim.", next: "fight.html" },
          { text: "Opustit místo.", next: "leave.html" }
        ]
      },
      {
        text: "Ve stínu stojí starý muž s hůlkou.",
        choices: [
          { text: "Promluvit s ním.", next: "talk.html" },
          { text: "Zeptej se ho na cestu.", next: "ask.html" },
          { text: "Opustit místo.", next: "walkaway.html" }
        ]
      }
    ],
    level7: [
      {
        text: "Setkání s obřími pavouky v opuštěné jeskyni.",
        choices: [
          { text: "Zaútočit na pavouky.", next: "fight.html" },
          { text: "Skrýt se a čekat.", next: "hide.html" },
          { text: "Pokračovat dál, bez přímého kontaktu.", next: "moveon.html" }
        ]
      },
      {
        text: "Na cestě se objeví velký troll.",
        choices: [
          { text: "Zaútočit na trolla.", next: "fight.html" },
          { text: "Pokoušet se trolla přelstít.", next: "trick.html" },
          { text: "Utéct.", next: "run.html" }
        ]
      }
    ],
    level8: [
      {
        text: "Temná postava se vám zjeví a vyzývá vás na souboj.",
        choices: [
          { text: "Bojujte s ní.", next: "battle.html" },
          { text: "Zkuste ji přesvědčit k vyjednávání.", next: "negotiate.html" },
          { text: "Utečte z boje.", next: "flee.html" }
        ]
      },
      {
        text: "Na horizontu se objevuje armáda nemrtvých.",
        choices: [
          { text: "Zůstat a bojovat.", next: "battle.html" },
          { text: "Pokoušet se najít úkryt.", next: "hide.html" },
          { text: "Utéct, jak nejrychleji můžete.", next: "run.html" }
        ]
      }
    ],
    level9: [
      {
        text: "Objevujete tajnou místnost plnou nebezpečných pastí.",
        choices: [
          { text: "Pokračovat opatrně.", next: "cautious.html" },
          { text: "Prozkoumat místnost a zjistit, jaké pasti jsou tam nastražené.", next: "explore.html" },
          { text: "Skrýt se a čekat na příležitost.", next: "wait.html" }
        ]
      },
      {
        text: "Stojíte před obrovským drakem.",
        choices: [
          { text: "Zaútočit na draka.", next: "fight.html" },
          { text: "Zkuste s ním jednat.", next: "negotiate.html" },
          { text: "Utéct a hledat úkryt.", next: "run.html" }
        ]
      }
    ]
  };
  
  const stats = JSON.parse(localStorage.getItem("playerStats"));
  const level = 1; // Tato hodnota může být dynamicky nastavena podle úrovně hráče.
  const selected = encounters[`level${level}`][Math.floor(Math.random() * encounters[`level${level}`].length)];
  
  document.getElementById("problem-text").textContent = selected.text;
  document.getElementById("choice1").textContent = selected.choices[0].text;
  document.getElementById("choice2").textContent = selected.choices[1].text;
  document.getElementById("choice3").textContent = selected.choices[2].text;
  
  document.getElementById("choice1").onclick = () => location.href = selected.choices[0].next;
  document.getElementById("choice2").onclick = () => location.href = selected.choices[1].next;
  document.getElementById("choice3").onclick = () => location.href = selected.choices[2].next;
  
  // Zobrazit statistiky hráče
  document.getElementById("stats-box").innerHTML = `
    <h3>Vaše statistiky</h3>
    <p>Síla: ${stats.str}</p>
    <p>Obratnost: ${stats.dex}</p>
    <p>Inteligence: ${stats.int}</p>
  `;
  