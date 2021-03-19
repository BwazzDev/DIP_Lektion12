const chatMessages = "https://dipchat.herokuapp.com/beskeder";
const chatRooms = "https://dipchat.herokuapp.com/rum";
const postEndPoint = "https://dipchat.herokuapp.com/besked";
const deleteEndPoint = "https://dipchat.herokuapp.com/besked/";

const dynamicRoomList = document.querySelector(".dynamicRoomList");
const chatList = document.querySelector(".chatList");

const chatroomSendList = document.querySelector(".chatroomSendList");
const chatUsername = document.querySelector(".chatUsername input");
const sendButton = document.querySelector(".sendBtn");
const messageInput = document.querySelector(".sendInput");
const allRoomsButton = document.querySelector(".allRooms");

let activeRooms = [];
let allCurrentMessages;
let allCurrentRooms;

class Message {
    constructor(navn, rum, tekst, nr) {
        this.navn = navn;
        this.rum = rum;
        this.tekst = tekst;
        this.nr = nr;
    }

    createHTMLElement() {
        // Message Container
        let msgContainer = document.createElement("div");
        msgContainer.classList.add("chatMessage");
        msgContainer.classList.add(this.nr);

        // -- Delete Button
        let deleteButton = document.createElement("a");
        deleteButton.addEventListener("click", ev => this.deleteMessage(ev));
        deleteButton.appendChild(document.createTextNode("x"));
        deleteButton.classList.add("deleteButton");
        msgContainer.appendChild(deleteButton);

        // -- Message Header
        let msgHeader = document.createElement("div");
        msgHeader.innerHTML = `<span class="headerTextNavn">${this.navn} </span><span class="headerTextRum">[${this.rum}]</span>`;
        msgContainer.appendChild(msgHeader);

        // -- Message Content
        let msgContent = document.createElement("div");
        msgContent.innerHTML = `<span class="contentText">${this.tekst}</span>`;
        msgContainer.appendChild(msgContent);

        // Add Element to Chatlist
        chatList.append(msgContainer);
    }

    deleteMessage(event) {
        let deleteTarget = deleteEndPoint + event.target.parentElement.classList[1];
        console.log(deleteTarget);
        deLete(deleteTarget);
    }
}

class Room {
    constructor(roomName) {
        this.roomName = roomName;
    }

    createHTMLElement() {
        let roomElement = document.createElement("div");
        roomElement.classList.add("roomElement");
        roomElement.innerHTML = `<span class=roomElement">${this.roomName}</span>`;
        roomElement.addEventListener("click", ev => this.toggleRoom(ev, this.roomName));
        dynamicRoomList.append(roomElement);
    }

    createHTMLOption() {
        let optionElement = document.createElement("option");
        optionElement.value = this.roomName;
        optionElement.innerHTML = this.roomName;
        chatroomSendList.appendChild(optionElement);
    }

    toggleRoom(event, roomName) {
        let target = event.currentTarget.classList;
        if (!target.contains("roomElementActive")) {
            target.add("roomElementActive");
            activeRooms.push(roomName);
        } else {
            target.remove("roomElementActive");
            activeRooms = activeRooms.filter(obj => obj !== roomName);
        }
        console.log(activeRooms);
        reloadMessages();
    }
}

async function queryMessages() {
    try {
        let newMessages = await get(chatMessages);
        if (JSON.stringify(newMessages) !== JSON.stringify(allCurrentMessages)) {
            allCurrentMessages = newMessages;
            reloadMessages();
        }
    } catch (e) {
        console.log(e)
    }
}

function reloadMessages() {
    chatList.innerHTML = "";
    for (let element of allCurrentMessages) {
        if (activeRooms.includes(element.rum)) {
            let newMsg = new Message(element.navn, element.rum, element.tekst, element.nr);
            newMsg.createHTMLElement();
        }
    }
    chatList.scrollTop = chatList.scrollHeight;
}

async function queryRooms() {
    try {
        let newRooms = await get(chatRooms);
        if (JSON.stringify(newRooms) !== JSON.stringify(allCurrentRooms)) {
            allCurrentRooms = newRooms;
            dynamicRoomList.innerHTML = "";
            for (let element of allCurrentRooms) {
                let newRoom = new Room(element);
                newRoom.createHTMLElement();
                newRoom.createHTMLOption();
            }
        }
    } catch (e) {
        console.log(e);
    }
}

queryMessages();
queryRooms();
setInterval(queryMessages, 100);
setInterval(queryRooms, 100);
// allRoomsButton.addEventListener("click", ev => toggleRoom(ev))



async function postNewMessage() {
    let username;
    console.log(chatUsername.value);
    if (chatUsername.value === "") {
        username = "Anonymous";
    } else {
        username = chatUsername.value;
    }
    const newPost = {navn: username, rum: chatroomSendList.options[chatroomSendList.selectedIndex].text, tekst: messageInput.value};
    console.log(JSON.stringify(newPost));
    await post(postEndPoint, newPost);
    messageInput.value = "";
}

sendButton.addEventListener("click", postNewMessage);



