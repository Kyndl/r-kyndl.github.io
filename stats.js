function chooseClass(className) {
    const classes = {
      warrior: { str: 9, dex: 4, int: 2 },
      rogue:   { str: 4, dex: 9, int: 3 },
      mage:    { str: 2, dex: 4, int: 9 }
    };
  
    localStorage.setItem("playerClass", className);
    localStorage.setItem("playerStats", JSON.stringify(classes[className]));
  
    window.location.href = "encounter.html";
  }
  