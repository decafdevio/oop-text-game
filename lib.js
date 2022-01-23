const delayInMilliseconds15 = 1500; //! 1.5 second

let haveKey = 0;
let haveFood = 0;

function change(qID) {
    let id = document.getElementById(qID).style.display = "none";
    qID++;
    let newQ = document.getElementById(qID).style.display = "block";
    document.getElementById("nav-icon-key").style.display = "";
    document.getElementById("nav-icon-food").style.display = "";
}

function useNavItem(buttonId) {
    if (document.getElementById(buttonId).style.color == "green") {
        if (buttonId == "nav-icon-key") {
            document.getElementById("input").value = "use key";
        } else {
            document.getElementById("input").value = "use food";
        }
    } else {
        alert("You don't have this item yet.");
    }
}

class room {
    constructor (name, description, directions) {
        this._name = name;
        this._description = description;
        this._directions = '<span class="shadeMap">' + directions + '</span>';
        this._linkedRooms = {};
    }
    get name(){
        return this._name;
    }
    get description(){
        return this._description;
    }
    get directions(){
        return this._directions;
    }
    set name(val) {
        if (val.length < 4){
            console.log("Name is too short");
            return;
        }
        this._name = val;
    }
    describe(){
        return "You're in the " + this._name + ", " + this._description;
    }
    directions(){
        return "<hr>" + this._directions;
    }

    linkRoom(direction, roomToLink){
        this._linkedRooms[direction] = roomToLink;
    }

    move(direction){
        if (direction in this._linkedRooms){
            if (this._name == "East Woods") {
                if (direction == "go east") {
                    if (haveKey == 1) {
                        return this._linkedRooms[direction];
                    } else {
                        let newLine = "\r\n";
                        let msg = "You cannot move there!";
                        msg += newLine;
                        msg += "Maybe you need an item?";
                        alert(msg);
                        return this;
                    }
                } else {
                    return this._linkedRooms[direction];
                }
            } else {
                return this._linkedRooms[direction];
            }
        } else {
            alert("You cannot move there!");
            return this;
        }
    }
}
class character{
    constructor(name, description, conversation) {
        this._name = name;
        this._description = description;
        this._conversation = conversation;
    }
    get name(){
        return this._name;
    }
    get description(){
        return this._description;
    }
    set name(val){
        this._name = val;
    }
    describe(){
        return "You have met " + this._name + " " + this._description;
    }
    talk(){
        return this._name + " says.. " + this._conversation;;
    }
}

class item{
    constructor(name, description){
        this._name = name;
        this._description = description;
    }
    get name(){
        return this._name;
    }
    get description(){
        return this._description;
    }
    describe(){
        return "You used " + this._name + this._description;
    }
}

class enemy extends character{
    constructor(name, pronoun, conversation, weakness){
        super(name, pronoun, conversation);
        this._weakness =  weakness;
    }

    fight(item){
        if (item = this._weakness){
            return true;
        } else {
            return false;
        }
    }
}

const Field = new room ("Field", "there isn't anything here of interest.", "There are Woods to the NORTH, SOUTH, EAST and WEST.");
const WestWoods = new room ("West Woods", "it's cold here!", "To the NORTH is a Park, to the SOUTH is a Yard.");
const EastWoods = new room ("East Woods", "it's hot here!", "To the NORTH is a House and to the SOUTH is a Factory. To the EAST is a Garden, we need a key to pass here.");
const NorthWoods = new room ("North Woods", "it's loud here!", "To the WEST is a Park and to the EAST is a House.");
const SouthWoods = new room ("South Woods", "it's quiet here!", "To the WEST is a Yard, to the EAST is a Factory.");
const Park = new room ("Park", "you're not alone!", "To the EAST is a North Woods, to the SOUTH is a West Woods.");
const House = new room ("House", "you're not alone!", "To the WEST is a North Woods, to the SOUTH is a East Woods.");
const Factory = new room ("Factory", "you're not alone!", "To the NORTH is a East Woods, to the WEST is a South Woods.");
const Yard = new room ("Yard", "you're not alone!", "To the NORTH is a West Woods, to the EAST is a South Woods.");
const Garden = new room ("Garden", "you're not alone!", "There is knowhere to run. Try using an item!");

Field.linkRoom("go west", WestWoods);
Field.linkRoom("go east", EastWoods);
Field.linkRoom("go north", NorthWoods);
Field.linkRoom("go south", SouthWoods);
// woods
NorthWoods.linkRoom("go west", Park);
NorthWoods.linkRoom("go south", Field);
NorthWoods.linkRoom("go east", House);
SouthWoods.linkRoom("go west", Yard);
SouthWoods.linkRoom("go north", Field);
SouthWoods.linkRoom("go east", Factory);
EastWoods.linkRoom("go north", House);
EastWoods.linkRoom("go west", Field);
EastWoods.linkRoom("go east", Garden); //! Final Boss
EastWoods.linkRoom("go south", Factory);
WestWoods.linkRoom("go north", Park);
WestWoods.linkRoom("go east", Field);
WestWoods.linkRoom("go south", Yard);
// rooms
Park.linkRoom("go east", NorthWoods);
Park.linkRoom("go south", WestWoods);
House.linkRoom("go west", NorthWoods);
House.linkRoom("go south", EastWoods);
Factory.linkRoom("go north", EastWoods);
Factory.linkRoom("go west", SouthWoods);
Yard.linkRoom("go east", SouthWoods);
Yard.linkRoom("go north", WestWoods);
// add characters
const Don = new character("Don", "he seems upset.", "I wish someone would help cheer me up!");
const Nancy = new character("Nancy", "she seems lonely.", "I want a friend to play with.");
const Eliza = new character("Eliza", "she have fleas.", "why won't this itching stop?!");
const Bob = new character("Bob", "he are very angry.", "I don't want to see anybody, GO AWAY!");
const Bruno = new enemy("Bruno", "he's a vicious dog!", "I'm always hungry! I'm going to eat you!");
// add items
const Key = new item("KEY", "this seems important.");
const Food = new item("FOOD", "when the time comes you will know what to do with this.");
const Clue1 = new item("CLUE1", "you need a KEY to open the GARDEN.");
const Clue2 = new item("CLUE2", "all dogs do is eat!");
// add characters & items to rooms
Park.character = Don;
Park.item = Key;
House.character = Nancy;
House.item = Clue1;
Factory.character = Eliza;
Factory.item = Food;
Yard.character = Bob;
Yard.item = Clue2;
Garden.character = Bruno;

function displayRoomInfo(room){
    let occDialog = "";
    let charName = room.character;
    if (charName == null) {
        occDialog = "";
        textContent = room.describe();
        nextDirections = room.directions();
        document.getElementById("dock").innerHTML = textContent + nextDirections;
        document.getElementById("input").focus();
            // reset character images
        resetImgs();
    } else {
        occDialog = room.character.describe() + " " + room.character.talk();
        textContent = room.describe();
        nextDirections = room.directions();
        document.getElementById("dock").innerHTML = textContent + " " + occDialog + nextDirections;
        document.getElementById("input").focus();
            // open character image
        document.getElementById(room.character._name).style.display = "";
        document.getElementById(room.item._name).style.display = "";
            // required items
        if (room.item._name == "KEY") {
        document.getElementById("nav-icon-key").style.color = "green";
        haveKey = 1;
        }
        if (room.item._name == "FOOD") {
        document.getElementById("nav-icon-food").style.color = "green";
        haveFood = 1;
        }
    }
}

function resetImgs(){
        // chars
    document.getElementById("Don").style.display = "none";
    document.getElementById("Nancy").style.display = "none";
    document.getElementById("Eliza").style.display = "none";
    document.getElementById("Bob").style.display = "none";
    document.getElementById("Bruno").style.display = "none";
        // items
    document.getElementById("CLUE1").style.display = "none";
    document.getElementById("CLUE2").style.display = "none";
    document.getElementById("KEY").style.display = "none";
    document.getElementById("FOOD").style.display = "none";
}

function startGame(){
    let currentRoom = Field;
    displayRoomInfo(currentRoom);
    document.addEventListener("keydown", function(event) {
        if (event.key === "Enter"){
            command = document.getElementById("input").value;
            const directions = ["go north", "go south", "go east", "go west"];
            if (directions.includes(command.toLowerCase())) {
                currentRoom = currentRoom.move(command);
                displayRoomInfo(currentRoom);
            } else {
                alert("Invalid Command");
            }

            // const equipment = ["use key", "use food"];
            // if (directions.includes(command.toLowerCase())) {

            // }
            document.getElementById("input").value = "";
        }
    });
}

startGame();