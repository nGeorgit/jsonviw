var storage = window.localStorage;

$(document).ready(function() {
    // Load the spellbook JSON data
    $.getJSON("spellbook.json", function(data) {
      // Sort the spells by level and name
      data.spells.sort(function(a, b) {
        if (a.level === b.level) {
          return a.name.localeCompare(b.name);
        } else {
          return a.level - b.level;
        }
      });
  
      // Create a spellbook object to store spell data and spell slot counters
      var spellbook = {};

      let spellSlots = JSON.parse(storage.getItem('spellSlots'));

      if (spellSlots === null)
      {
        resetSpells()
      }

      for (let i = 1; i <= 9; i++) {
        $("#level"+i+"-counter").text(spellSlots[i]);
      }
      

      for (var i = 0; i < data.spells.length; i++) {
        var spell = data.spells[i];
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
        spellbookHTML += "<div class='level-header'><button class='btn-toggle' id='btn-toggle"+ level +"' aria-expanded='true' onclick='toggle("+level+")' ></button>Level " + level + "</div>";
        spellbookHTML += "<ul id='class"+level+"'>";
        for (var i = 0; i < spellbook[level].length; i++) {
          var spell = spellbook[level][i];
          var castOptions = "";
          // Create dropdown options for casting at levels 1 through 3
          for (var j = parseInt(level); j <= 3; j++) {
            castOptions += "<option value='" + j + "'>Level " + j + "</option>";
          }
          spellbookHTML += '<li class="spell">' +
            '<h4 class="spell-name"onclick="toggleSpell(' + level + ', ' + i + ')">' + spell.name + '</h4>' +
            '<div class="spell-details" id="'+level+','+i+'">' +
            '<p><strong>Range:</strong>' + spell.range + '</p>' +
            '<p><strong>Duration:</strong>' + spell.duration + '</p>' +
            '<p><strong>Casting Time:</strong>'+spell.casting_time+'</p>' +
            '<label for="cast-level-'+level+'-'+i+'">Cast at:</label>' +
            '<select class="select" id="cast-level-'+level+'-'+i+'" name="cast-level">' + castOptions + '</select>' +
            '</div>' +
            '<button class="btn-cast-spell" onclick="castSpell(' + level + ', ' + i + ', document.getElementById(\'cast-level-'+level+'-'+i+'\').value)">Cast</button>' +
          '</li>';

        }
        spellbookHTML += "</ul>";
      }
      
      // Add the spellbook HTML to the page
      $(".spell-list").html(spellbookHTML);
      // var spellCards = document.getElementsByClassName('btn-show-spell');
      // for (var i = 0; i < spellCards.length; i++) {
      //   spellCards[i].addEventListener('click', function() {
      //     var details = this.querySelector('.spell-details');
      //     if (details.style.display === "none") {
      //       details.style.display = "block";
      //     } else {
      //       details.style.display = "none";
      //     }
      //   });
      // }

      window.toggleSpell = function(level, i) {
        details = document.getElementById(level + ',' + i);
        if (details.style.display == "none") {
          details.style.display = "block";
        } else {
          details.style.display = "none";
        }
      }

      // Define a function to cast a spell and reduce the spell slot counter for the respective spell level
      window.castSpell = function(level, i, levelCast) {
        if (spellSlots[level] > 0) {
          spellSlots[levelCast]--;

          updateSpellSlot(levelCast);
          //$("#spellbook li:eq(" + index + ") p:eq(4)").text("Slot Count: " + spell.slot_count);
          $("#level"+levelCast+"-counter").text(parseInt($("#level"+levelCast+"-counter").text()) - 1);
          alert("You cast " + spellbook[level][i].name + " at level " + levelCast);

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

async function resetSpellsReq(){
  if(confirm("Do you wanna reset your spell slots?"))
  {
    resetSpells();
  }
}

function resetSpells(){
  $.getJSON("spellbook.json", function(data) {
    storage.setItem('spellSlots', JSON.stringify(data.maxSpellSlots));
  });
}

function updateSpellSlot(level)
{
  let spellSlots = JSON.parse(storage.getItem('spellSlots'));
  spellSlots[level]--;
  storage.setItem('spellSlots', JSON.stringify(spellSlots));
}

