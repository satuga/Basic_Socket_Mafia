var locations = ["Beach", "Airplane", "Office", "Forest", "Disneylend", "Antarctica", "Somewhere In The Middle East", "Aquarium", "Bedroom", "Dungeon", "Brothel", "Passenger","Mall",
  "India","Mecha","Siberia","Hooters","Uranus","Way.com","White House","Taiwan","China","Eiffel Tower","Universal Studios","San Francisco","India/Bollywood","Trump Tower",
  "Space", "Sun", "Mars", "New Orleans","Zoo","New York","Bikini Bottom", "Jurassic Park", "Hell", "Chik-Fil-A", "Graveyard", "North Korea", "Suicide Forest", "Arcade","America"];

var gameStyle = "";
var numPlayers = 0;
var numSpies = 0;
var roles = [];
var randomLocation = locations[getRandomNumber(0,(locations.length-1))];

function shuffle(array) 
{
    var currentIndex = array.length, temporaryValue, randomIndex;
  
    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
  
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
  
      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }
  
    return array;
}


function startGame()
{
  gameStyle = "";
  numPlayers = 0;
  numSpies = 0;
  roles = [];
  randomLocation = locations[getRandomNumber(0,(locations.length-1))];
  var content = document.getElementById('Game');
  content.innerHTML = `
    <input id="Players" class="txt" type="text" placeholder = "Enter Number of Players" value = ""></input>
    <button class="btn" onclick="validatePlayers(Players.value)">Next</button>
  `;
}

function validatePlayers(x)
{
  if(isNaN(x) || x == "" || parseInt(x) < 3)
  {
    var content = document.getElementById('Game');
    content.innerHTML = `
    <input id="Players" class="txt" type="text" placeholder = "Enter Valid Number of Players" value = ""></input>
    <button class="btn" onclick="validatePlayers(Players.value)">Next</button>
    `;
  }
  else
  {
    numPlayers = x;
    var content = document.getElementById('Game');
    content.innerHTML = `
      <button class="gameModeBtn" onclick="setSpyMode('variable')">Variable # of Spies</button>
      <button class="gameModeBtn2" onclick="setSpyMode('exact')">Exact # of Spies</button>
    `;
  }
}

function setSpyMode(gamemode)
{
    gameStyle = gamemode;
    var content = document.getElementById('Game');
    content.innerHTML = `
    <input id="Spies" class="txt" type="text" placeholder = "Enter Number of Spies" value = ""></input>
    <button class="btn" onclick="validateSpies(Spies.value)">Next</button>
    `;
}

function validateSpies(x)
{
  if( isNaN(x) || x == "" || parseInt(x) < 0 || numPlayers < parseInt(x))
  {
    var content = document.getElementById('Game');
    content.innerHTML = `
    <input id="Spies" class="txt" type="text" placeholder = "Enter Valid Number of Spies" value = ""></input>
    <button class="btn" onclick="validateSpies(Spies.value)">Next</button>
    `;
  }
  else
  {
    numSpies = x;
    setRoles();

  }
}

function setRoles()
{
  for(var i = 0; i < numPlayers; i++)
  {
    roles.push(randomLocation);
  }
  
  var z = numSpies;
  if(gameStyle == "exact")
  {
    while(z > 0)
    {
      var rand = getRandomNumber(0,roles.length-1);

      if(roles[rand] == "Spy")
      {
        rand = getRandomNumber(0,roles.length-1);
      }
      else
      {
        roles[rand] = "Spy";
        z--; 
      }
    }
  }
  else
  {
    for(var i = numSpies; i > 0; i--)
    {
      var rand = getRandomNumber(0,roles.length);
      roles[rand] = "Spy";
    }
  }

  for(var o = 0; o < 100; o++)
  {
    roles = shuffle(roles);
  }

  prepRoles(numPlayers-1);
}

function prepRoles(x)
{
  if(x > -1)
  {
    var content = document.getElementById('Game');
    content.innerHTML = `
    <button class="btn" onclick="showRoles(${x})";>Player ${x+1} Click To See Position</button>
    `;
  }
  else
  {
    var content = document.getElementById('Game');
    content.innerHTML = `
    <button class="btn" onclick="startGame()";>Play Again?</button>
    `;

  }
}

function showRoles(x)
{
  var content = document.getElementById('Game');
  content.innerHTML = `
  <input id="Spies" class="txt" type="text" value = "You Got Position: ${roles[x]}" readonly></input>
  <button class="btn" onclick="prepRoles(${x-1})";>Click Here When Done</button>
  `;
}

function getRandomNumber(min, max) 
{
  return Math.floor(Math.random() * (max - min + 1) ) + min;
}

function mute()
{
  var song = document.getElementById('music');
  var button = document.getElementById('song');
  song.innerHTML = "";
  button.innerHTML = '<button class="btn3" onclick="unmute();">Play Song</button>';
}

function unmute()
{
  var song = document.getElementById('music');
  var button = document.getElementById('song');
  song.innerHTML = '<embed src="/static/music/song.mp3" autostart="true" loop="true" hidden="true"></embed>';
  button.innerHTML = '<button class="btn3" onclick="mute();">Mute Song</button>';
}
