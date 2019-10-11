var totalPlayers = 0;
var numMafia = 0;
var numDoctors = 0;
var numSherifs = 0;
var numCivillians = 0;
var roles = [];
var names = [];
var killer = 0;
var saved = 0;

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

function setMafia()
{
    totalPlayers = 0;
    numMafia = 0;
    numDoctors = 0;
    numSherifs = 0;
    numCivillians = 0;
    roles = [];

    var content = document.getElementById('Game');
    content.innerHTML = `
    <input id="Players" class="txt" type="text" placeholder = "Enter Number of Mafia" value = ""></input>
    <button class="btn" onclick="setDoctors(Players.value)">Next</button>
    `;
}

function setDoctors(mafia_players)
{
    numMafia = mafia_players;

    var content = document.getElementById('Game');
    content.innerHTML = `
    <input id="Players" class="txt" type="text" placeholder = "Enter Number of Doctors" value = ""></input>
    <button class="btn" onclick="setSherifs(Players.value)">Next</button>
    `;   
}

function setSherifs(doctor_players)
{
    numDoctors = doctor_players;

    var content = document.getElementById('Game');
    content.innerHTML = `
    <input id="Players" class="txt" type="text" placeholder = "Enter Number of Sherifs" value = ""></input>
    <button class="btn" onclick="setCivillians(Players.value)">Next</button>
    `;   
}

function setCivillians(sherif_players)
{
    numSherifs = sherif_players;

    var content = document.getElementById('Game');
    content.innerHTML = `
    <input id="Players" class="txt" type="text" placeholder = "Enter Number of Civillians" value = ""></input>
    <button class="btn" onclick="end(Players.value)">Next</button>
    `;   
}

function end(civillian_players)
{
    numCivillians = civillian_players;
    totalPlayers = parseInt(numMafia) + parseInt(numDoctors) + parseInt(numSherifs) + parseInt(numCivillians);
    // console.log(totalPlayers);
    setRoles();
    prepRoles(totalPlayers, "n/a");
}

function setRoles()
{
    for(var i = 0; i < numMafia; i++)
    {
        roles.push("Mafia");
    }
    for(var i = 0; i < numDoctors; i++)
    {
        roles.push("Doctor");
    }
    for(var i = 0; i < numSherifs; i++)
    {
        roles.push("Sherif");
    }
    for(var i = 0; i < numCivillians; i++)
    {
        roles.push("Civillian");
    }
    
    for(var k = 0; k < 100; k++)
    {
        roles = shuffle(roles);
    }

    // console.log(roles);
}

function prepRoles(x, username)
{
    if(username != "n/a")
    {
        names.push(username);
    }

    if(x > 0)
    {
        var content = document.getElementById('Game');
        content.innerHTML = `
        <button class="btn" onclick="showRoles(${x})";>Player ${x} Click To See Position</button>
        `;
    }
    else
    {
        var temp_names = []
        for(var j = names.length-1; j > -1; j--)
        {
            temp_names.push(names[j]);
        }
        names = temp_names;

        var content = document.getElementById('Game');
        content.innerHTML = `
        <button class="btn" onclick="playRound()";>Play Round</button>
        `;

    }
}

function showRoles(x)
{
  var content = document.getElementById('Game');
  content.innerHTML = `
  <input id="Spies" class="txt" type="text" value = "You Got Position: ${roles[x-1]}" readonly></input>
  <button class="btn" onclick="placeName(${x-1})";>Click Here To Place Your Name</button>
  `;
}

function placeName(x)
{
    var content = document.getElementById('Game');
    content.innerHTML = `
    <input id="Name" class="txt" type="text" placeholder = "Enter Your Name Here" value = ""></input>
    <button class="btn" onclick="prepRoles(${x}, Name.value)";>Click Here When Done</button>
    `;

}

function playRound()
{
    console.log(names);
    var instruction = 'Mafia Kill: ';
    for(var i = 0; i < names.length; i++)
    {
        instruction = instruction + String(i+1) + "." + names[i] + " ";
    }
    var content = document.getElementById('Game');
    content.innerHTML = `
    <input id="Players" class="txt" type="text" placeholder = "" value = "${instruction}"></input>
    <button class="btn" onclick="savePerson(Players.value)">Next</button>
    `;
}

function savePerson(x)
{
    killer = x-1;
    
    var instruction = 'Doctor Save: ';

    for(var i = 0; i < names.length; i++)
    {
        instruction = instruction + String(i+1) + "." + names[i] + " ";
    }
    var content = document.getElementById('Game');
    content.innerHTML = `
    <input id="Players" class="txt" type="text" placeholder = "" value = "${instruction}"></input>
    <button class="btn" onclick="investigate(Players.value)">Next</button>
    `;
}

function investigate(x)
{
    saved = x-1;

    var instruction = 'Sherif Investigate: ';

    for(var i = 0; i < names.length; i++)
    {
        instruction = instruction + String(i+1) + "." + names[i] + " ";
    }
    var content = document.getElementById('Game');
    content.innerHTML = `
    <input id="Players" class="txt" type="text" placeholder = "" value = "${instruction}"></input>
    <button class="btn" onclick="showInvestigate(Players.value)">Next</button>
    `;
}

function showInvestigate(x)
{
    var content = document.getElementById('Game');
    content.innerHTML = `
    <input id="Players" class="txt" type="text" placeholder = "" value = "Here is the role of ${names[x-1]}: ${roles[x-1]}" readonly></input>
    <button class="btn" onclick="playoutRound()">Next</button>
    `;
}

function playoutRound()
{
    var content = document.getElementById('Game');
    content.innerHTML = `
    <input id="Players" class="txt" type="text" placeholder = "" value = "${names[killer]} is dead, ${names[saved]} is saved" readonly></input>
    <button class="btn" onclick="whoKill()">Next</button>
    `;

    if(names[killer] != names[saved])
    {
        roles.splice(killer,1);
        names.splice(killer,1);
    }

}

function whoKill()
{
    var instruction = 'Who Dies?: ';

    for(var i = 0; i < names.length; i++)
    {
        instruction = instruction + String(i+1) + "." + names[i] + " ";
    }
    var content = document.getElementById('Game');
    content.innerHTML = `
    <input id="Players" class="txt" type="text" placeholder = "" value = "${instruction}"></input>
    <button class="btn" onclick="killPerson(Players.value)">Next</button>
    `;
}

function killPerson(x)
{
    x = x-1;
    var content = document.getElementById('Game');
    content.innerHTML = `
    <input id="Players" class="txt" type="text" placeholder = "" value = "${names[x]} was a ${roles[x]}" readonly></input>
    <button class="btn" onclick="playRound()">Next</button>
    `;
    roles.splice(x,1);
    names.splice(x,1);
}