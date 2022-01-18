const delayInMilliseconds15 = 1500; //! 1.5 second

function change(qID) {
    let id = document.getElementById(qID).style.display = "none";
    qID++;
    let newQ = document.getElementById(qID).style.display = "block";
}

class room {
    constructor (name, description) {
        this._name = name;
        this._description = description;
        this._linkedRooms = {};
    }
    get name(){
        return this._name;
    }
    get description(){
        return this._description;
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
    linkRoom(direction, roomToLink){
        this._linkedRooms[direction] = roomToLink;
    }

    move(direction){
        if (direction in this._linkedRooms){
            return this._linkedRooms[direction];
        } else {
            alert("You cannot move there!");
            console.log("You cannot move there!");
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
        return "Hello " + this._name + ", thanks for playing!";
    }
    talk(){
        return this._name + "says.. " + this._conversation;;
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
        return "You are using the " + this._name + ", this " + this._description;
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

const Field = new room ("Field", "there isn't anything here of interest. There are Woods to the north, south, east and west.");
const WWoods = new room ("West Woods", "it's cold here! To the north is a House, to the south is a Factory and to the east is a Garden, we need a key to pass.");

Field.linkRoom("go west", WWoods);
WWoods.linkRoom("go east", Field);


function displayRoomInfo(room){
    textContent = room.describe();
    document.getElementById("dock").innerHTML = textContent;
    // document.getElementById("input").focus();
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
            document.getElementById("input").value = "";
        }
    });
}

startGame();