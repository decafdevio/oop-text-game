const delayInMilliseconds15 = 1500; //! 1.5 second

let haveKey = 0;
let haveFood = 0;

// A javascript "enum" for the directions. Typescript makes this a lot nicer.
// Whether using an "enum" or something like `const EAST = "east"`, these values
// should be contained in variables instead of hand written each time. Makes it
// much harder to typo them and create bugs.
const Directions = Object.freeze({
    EAST: Symbol("east"),
});

// Helper function for getting enum by string value
function getDirectionFromString(value) {
    return Object.value(Directions).find(sym => sym.description === value);
}

function change(qID) {
    document.getElementById(qID).style.display = "none";
    qID++;
    document.getElementById(qID).style.display = "block";
    document.getElementById("nav-icon-key").style.display = "";
    document.getElementById("nav-icon-food").style.display = "";
}

function useNavItem(buttonId) {
    // HTML is being used here to store the game state. This leads to problems
    // because I can manipulated the HTML using the code inspector. If we have
    // state that needs to be stored, then it makes more sense to use an object
    // in our code that can't be manipualted so easily by the user.
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

// class names should be UpperCaseStyle
class Room {
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
                    document.getElementById("input").value = "";
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
            } else if (this._name == "Garden") {
                if (direction == "go east") {
                    if (haveFood == 1) {
                        alert("Well done! You passed Bruno and returned home safely!")
                    } else {
                        let newLine = "\r\n";
                        let msg = "You were missing an item!";
                        msg += newLine;
                        msg += "Bruno didn't let you pass :(";
                        alert(msg);
                        window.location.href="index.html"
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

class Character{
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

class Item{
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

class Enemy extends Character{
    constructor(name, conversation, weakness){
        super(name, conversation);
        this._weakness = weakness;
    }

    fight(item){
        // Simple typo here that has bit me so many times I can't count them.
        // This if was always returning true, because it was an assignment
        // instead of a comparison.
        if (item == this._weakness){
            alert("you won")
            return true;
        } else {
            alert("you lost")
            return false;
        }
    }
}

const Field = new Room ("Field", "there isn't anything here of interest.", "There are Woods to the NORTH, SOUTH, EAST and WEST.");
const WestWoods = new Room ("West Woods", "it's cold here!", "To the NORTH is a Park, to the SOUTH is a Yard.");
const EastWoods = new Room ("East Woods", "it's hot here!", "To the NORTH is a House and to the SOUTH is a Factory. To the EAST is a Garden, we need a key to pass here.");
const NorthWoods = new Room ("North Woods", "it's loud here!", "To the WEST is a Park and to the EAST is a House.");
const SouthWoods = new Room ("South Woods", "it's quiet here!", "To the WEST is a Yard, to the EAST is a Factory.");
const Park = new Room ("Park", "you're not alone!", "To the EAST is a North Woods, to the SOUTH is a West Woods.");
const House = new Room ("House", "you're not alone!", "To the WEST is a North Woods, to the SOUTH is a East Woods.");
const Factory = new Room ("Factory", "you're not alone!", "To the NORTH is a East Woods, to the WEST is a South Woods.");
const Yard = new Room ("Yard", "you're not alone!", "To the NORTH is a West Woods, to the EAST is a South Woods.");
const Garden = new Room ("Garden", "you're not alone!", "There is knowhere to run. To pass Bruno go EAST.");
const Home = new Room ("Home", "You made it!", "");

Field.linkRoom("go west", WestWoods);
// We can now use our directions enumeration so that we are consistent with them.
// An additional advantage is that we can get console errors if we mistype them.
// Before if I accidentally typed "aest", it would just work and I'd have to find
// the bug manually
Field.linkRoom(Directions.EAST, EastWoods);
Field.linkRoom("go north", NorthWoods);
Field.linkRoom("go south", SouthWoods);
// woods
NorthWoods.linkRoom("go west", Park);
NorthWoods.linkRoom("go south", Field);
NorthWoods.linkRoom(Directions.EAST, House);
SouthWoods.linkRoom("go west", Yard);
SouthWoods.linkRoom("go north", Field);
SouthWoods.linkRoom(Directions.EAST, Factory);
EastWoods.linkRoom("go north", House);
EastWoods.linkRoom("go west", Field);
EastWoods.linkRoom(Directions.EAST, Garden); //! Final Boss
EastWoods.linkRoom("go south", Factory);
WestWoods.linkRoom("go north", Park);
WestWoods.linkRoom(Directions.EAST, Field);
WestWoods.linkRoom("go south", Yard);
// rooms
Park.linkRoom(Directions.EAST, NorthWoods);
Park.linkRoom("go south", WestWoods);
House.linkRoom("go west", NorthWoods);
House.linkRoom("go south", EastWoods);
Factory.linkRoom("go north", EastWoods);
Factory.linkRoom("go west", SouthWoods);
Yard.linkRoom(Directions.EAST, SouthWoods);
Yard.linkRoom("go north", WestWoods);
Garden.linkRoom(Directions.EAST, Home);
// add items
// Moving items above characters, so that we can reference already defined things (item name)
// for enemy weaknesses instead of hard coding those values
const Key = new Item("KEY", "this seems important.");
const Food = new Item("FOOD", "when the time comes you will know what to do with this.");
const Clue1 = new Item("CLUE1", "you need a KEY to open the GARDEN.");
const Clue2 = new Item("CLUE2", "all dogs do is eat!");
// add characters
const Don = new Character("Don", "he seems upset.", "I wish someone would help cheer me up!");
const Nancy = new Character("Nancy", "she seems lonely.", "I want a friend to play with.");
const Eliza = new Character("Eliza", "she have fleas.", "why won't this itching stop?!");
const Bob = new Character("Bob", "he are very angry.", "I don't want to see anybody, GO AWAY!");
const Bruno = new Enemy("Bruno", "he's a vicious dog!", "I'm always hungry! I'm going to eat you!", Food.name);
// Setting the weakness like this doesn't work with how the class is constructed.
// We need to use the constructor to set it.
// Bruno.weakness = "FOOD";

// add characters & items to rooms
// This works, but isn't best practice. Neither character nor item is defined on the Room prototype.
// Another dev reading the code wouldn't now that these are available options.
// It's best to define them in the class and set them to null in the constructor.
// You can then use a setter to assign them values for the ones needed.
Park.character = Don;
Park.item = Key;
House.character = Nancy;
House.item = Clue1;
Factory.character = Eliza;
Factory.item = Food;
Yard.character = Bob;
Yard.item = Clue2;
Garden.character = Bruno;


// You can then use a Player class to manage our inventory and any other attributes we want
class Player {
    constructor(name) {
        this._name = name;
        this._inventory = new Set(); // List of item names the user has
    }

    giveItem(itemName) {
        this._inventory.add(itemName);
    }

    hasItem(itemName) {
        this._inventory.has(itemName);
    }
}

// The functions in this class are largely what I would want to put inside a master Game class
// The interface for that class would look something like this
class Game {
    constructor(player) {
        this._player = player;
        this._rooms = [];
        this._characters = []; // { "htmlID": "id-attribute-value-in-html", "character": Character }
        this._items = [] // { "htmlID": "id-attribute-value-in-html", "item": Item }

        this._currentRoom = null;
    }

    /**
     * Setup methods
     */

    addRoom(room) {
        this._rooms.push(room);
    }
    addCharacter(htmlID, character) {
        this._characters.push({ htmlID, character });
    }
    addItem(htmlID, item) {
        this._items.push({ htmlID, item });
    }

    /**
     * Game play functions
     */

    start(startRoom) {
        // This will replace the startGame function
        this._currentRoom = startRoom;
        this._showRoom(startRoom);

        // Input handling, use an arrow function so that `this` is properly bound
        document.addEventListener("keydown", (event) => {
            if (event.key === "Enter"){
                const command = document.getElementById("input").value;
                if (command) { // Not empty
                    this._handleCommand(command);
                }
                this._setInput("");
            }
        });    
    }

    // This method would replace or be called by the useNavItem function
    useItem(itemName) {
        // Now since we're storing this in memory, the user can't manipulate the HTML
        // to give them items they aren't supposed to have, yet.
        if (this._player.hasItem(itemName)) {
            // Do stuff
        } else {
            // Error case
        }
    }

    _handleCommand(command) {
        // We going to break up the command ("go"/"use") from the arguments for the command
        // This can allow us to more easily expand and break out the functionality of the
        // given command.
        // We trim any leading/trailing whitespace, lowerCase it, then split it
        // The regex below splits on 1 or more whitespace characters. First item in array
        // is the command, second item is everything else after the first spaces
        // The regex allows us to make "go     east" work properly
        const [cmd, args] = command.trim().toLowerCase().split(/\s+/, 2);

        if (cmd === "go") { // TODO make a constant
            // Convert from our string to an enum. If undefined, it wasn't found
            const direction = getDirectionFromString(args);
            if (direction) {
                // Update room argument to just handle Direction
                const nextRoom = this._currentRoom.move(direction);
                this._showRoom(nextRoom);
            } else {
                // Error case
                // Maybe something like this._invalidCommand("direction not found");
                // and then _invalidCommand can do the alert, etc
            }
        } else if (cmd === "use") {
            // TODO handling of items
        }
    }

    _givePlayerItem(itemName) {
        // Make sure the item exist in our game
        const gameItem = this._findItemByName(itemName);
        if (gameItem) {
            // New handling to give the player the item
            this.player.giveItem(itemName);
            // Manage HTML display from here
            document.getElementById(gameItem.htmlID).style.color = "green";
        }
    }

    _showRoom(room) {
        // This would replace the displayRoomInfo function
        // Some of the changes to interoperate here
        this._resetRoom();

        // Make sure the room's character is managed by the game
        const roomChar = this._findCharacterByName(room.character.name);
        if (roomChar) {
            this._showElement(roomChar.htmlID);
            // If room.item, also show element and this._givePlayerItem(room.item.name)
            // figure out dialog and use this._setOccDialog()
        } else {
            // figure out dialog and use this._setOccDialog()
        }
        this._focusInput(); // Or move it into the logic above
    }

    _resetRoom() {
        // Hide all characters and items
        this._characters.forEach(c => {
            this._hideElement(c.htmlID);
        })
        // Hide all items
        // <snip>
    }

    /**
     * Below are a list of "library" functions to handle manipulating the HTML.
     * This allows our code to call a single place to do a thing. Then if how we
     * want to do that thing changes, we only have to update 1 place in the code
     * instead of all the places we were doing it before.
     * 
     * For instance, if we change the ID of the input box, we will now only have
     * to update it in one spot and everything will just work. Or if we change
     * how we display the dialog (like using an alert) then we only have to change
     * it in one spot.
     */

    _findCharacterByName(charName) {
        // Remember the structure of _characters and reference the nested data
        return this._characters.find(c => c.character.name === charName);
    }

    _findItemByName(itemName) {
        return this._items.find(i => i.item.name === itemName);
    }

    _setOccDialog(dialog) {
        // Make a pretty function to handle updating the dialog to reduce copy/paste
        document.getElementById("dock").innerHTML = dialog;
    }

    _focusInput() {
        document.getElementById("input").focus();
    }

    _setInput(value) {
        document.getElementById("input").value = value;
    }

    _showElement(htmlID) {
        document.getElementById(htmlID).style.display = "";
    }

    _hideElement(htmlID) {
        document.getElementById(htmlID).style.display = "none";
    }
}

function displayRoomInfo(room){
    let occDialog = "";
    const charName = room.character;

    // reset character images
    // This is a wild guess, but I'm assuming that we would probably want to reset the images
    // regardless of which room we are in. That way if we move from one room w/ a character
    // to another room that also has a character, we turn off the previous character.
    // The previous code will also work because all the rooms are linked by woods that don't
    // have characters. Best to be explicit about cleanup code for edge cases.
    resetImgs();

    if (charName == null) {
        occDialog = "";
        textContent = room.describe();
        nextDirections = room.directions();
        document.getElementById("dock").innerHTML = textContent + nextDirections;
        document.getElementById("input").focus();
    } else {
        occDialog = room.character.describe() + " " + room.character.talk();
        textContent = room.describe();
        nextDirections = room.directions();
        document.getElementById("dock").innerHTML = textContent + " " + occDialog + nextDirections;
        document.getElementById("input").focus();
            // open character image
        // I don't love the re-used or properties here for multiple things. We are using the
        // name both as the name and for the HTML ID. We should explicitly pass the HTML ID
        // as another argument in the constructor. This decouples the code from the structure
        // of the HTML, giving us more flexibility in how we can update and manage things.
        // Items are an example of where this is useful, since the HTML ID is different from
        // the name.
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
            // const action = ["use food"];
            if (directions.includes(command.toLowerCase())) {
                currentRoom = currentRoom.move(command);
                displayRoomInfo(currentRoom);
            // } else if (action.includes(command.toLowerCase())){
            //     if (enemy._name == null) {
            //         return;
            //     } else {
            //         let outcome = enemy.fight(command);
            //         alert(outcome);
            //     }
            // } 
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