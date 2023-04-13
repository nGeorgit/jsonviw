$(document).ready(function() {
    // Load the spellbook JSON data
    $.getJSON("spellbook.json", function(data) {
      // Sort the spells by level and name
      data.sort(function(a, b) {
        if (a.level === b.level) {
          return a.name.localeCompare(b.name);
        } else {
          return a.level - b.level;
        }
      });
  
      // Create a spellbook object to store spell data and spell slot counters
      var spellbook = {};
      const spellslotsMax = {
        1: 2,
        2: 2,
        3: 2,
        4: 2,
        5: 2,
        6: 2,
        7: 2,
        8: 2,
        9: 2
      };

      var spellslots = spellslotsMax;
      
      for (let i = 1; i <= 9; i++) {
        $("#level"+i+"-counter").text(spellslots[i]);
      }
      

      for (var i = 0; i < data.length; i++) {
        var spell = data[i];
        if (!spellbook[spell.level]) {
          spellbook[spell.level] = [];
        }
        spellbook[spell.level].push({
          name: spell.name,
          range: spell.range,
          duration: spell.duration,
          casting_time: spell.casting_time,
          description: spell.description,
        });
      }
  
      // Create HTML elements to display the spellbook
      var spellbookHTML = "";
      for (var level in spellbook) {
        spellbookHTML += "<h2><button class='btn-toggle' id='btn-toggle"+ level +"' aria-expanded='true' onclick='toggle("+level+")' ></button>Level " + level + "</h2>";
        spellbookHTML += "<ul id='class"+level+"'>";
        for (var i = 0; i < spellbook[level].length; i++) {
          var spell = spellbook[level][i];

          spellbookHTML += '<li class="spell">		<h4 class="spell-name">' + spell.name + '</h4>		<div class="spell-details">				<p><strong>Range:</strong>' + spell.range + '</p>		<p><strong>Duration:</strong>' + spell.duration + '</p>		<p><strong>Casting Time:</strong>'+spell.casting_time+'</p>	</div>		<button class="btn-cast-spell"  onclick="castSpell(' + level + ', ' + i + ')">Cast</button> </li>';
        }
        spellbookHTML += "</ul>";
      }
  
      // Add the spellbook HTML to the page
      $(".spell-list").html(spellbookHTML);
  
      // Define a function to cast a spell and reduce the spell slot counter for the respective spell level
      window.castSpell = function(level, i) {
        if (spellslots[level] > 0) {
          spellslots[level]--;
          //$("#spellbook li:eq(" + index + ") p:eq(4)").text("Slot Count: " + spell.slot_count);
          $("#level"+level+"-counter").text(parseInt($("#level"+level+"-counter").text()) - 1);
          alert("You cast " + spellbook[level][i].name + "!");

        } else {
          alert("You don't have any spell slots of level " + level + " remaining.");
        }
      }

      window.toggle = function(level) {
        let btn = $("#btn-toggle"+level)
        if (btn.attr("aria-expanded") === 'true'){
          btn.attr("aria-expanded", 'false');
          $("#class"+level).css("display", "none");
        } else {
          btn.attr("aria-expanded", 'true');
          $("#class"+level).css("display", "block");
        }
      }
    });
  });

