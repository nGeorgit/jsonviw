// Get the spellSlots object from local storage or create a new one if it doesn't exist
var spellSlots = JSON.parse(localStorage.getItem("spellSlots")) || {};

// Function to update the UI with the current spell slots
function updateSpellSlotsUI() {
  var tbody = document.getElementById("spell-slots-body");
  tbody.innerHTML = "";
  for (var level in spellSlots) {
    var tr = document.createElement("tr");

    var levelTd = document.createElement("td");
    levelTd.textContent = level;
    tr.appendChild(levelTd);

    var slotsTd = document.createElement("td");
    var input = document.createElement("input");
    input.type = "number";
    input.value = spellSlots[level];
    input.min = 0;
    slotsTd.appendChild(input);
    tr.appendChild(slotsTd);

    var actionsTd = document.createElement("td");
    var increaseBtn = document.createElement("button");
    increaseBtn.textContent = "+";
    increaseBtn.addEventListener("click", function(e) {
      var level = e.target.getAttribute("data-level");
      spellSlots[level]++;
      updateSpellSlotsUI();
    });
    increaseBtn.setAttribute("data-level", level);
    actionsTd.appendChild(increaseBtn);

    var decreaseBtn = document.createElement("button");
    decreaseBtn.textContent = "-";
    decreaseBtn.addEventListener("click", function(e) {
      var level = e.target.getAttribute("data-level");
      if (spellSlots[level] > 0) {
        spellSlots[level]--;
        updateSpellSlotsUI();
      }
    });
    decreaseBtn.setAttribute("data-level", level);
    actionsTd.appendChild(decreaseBtn);

    tr.appendChild(actionsTd);
    tbody.appendChild(tr);
  }
}

// Call the function to update the UI on page load
updateSpellSlotsUI();

// Add event listener to save changes button
document.getElementById("save-btn").addEventListener("click", function() {
  localStorage.setItem("spellSlots", JSON.stringify(spellSlots));
});
