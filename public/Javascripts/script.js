let socket = io();
let messageInput = document.querySelector(".message-input");
let sendBtn = document.querySelector(".send-btn");
let content = document.querySelector(".content");
let namePage = document.querySelector(".namePage");
let nameInput = document.querySelector(".name-input");
let setName = document.querySelector(".setname");
let username = document.querySelector(".username");
let live = document.querySelector(".live");
let allUsers = document.querySelector(".users");

setName.addEventListener("click", function(){
    if(nameInput.value.trim().length > 0){
        socket.emit("username", nameInput.value.trim())
        console.log("clicked")
    }
})

socket.on("username-set", function(name){
    namePage.style.display = "none"
    username.textContent = name
    console.log(name)
})

nameInput.addEventListener("input", function(){
    if(nameInput.value.trim().length > 0){
        let newName = nameInput.value.replace(" ", "_");
        nameInput.value = newName
    }else{
        nameInput.value = ""
    }
})

socket.on("connected-users", function(data){
    live.textContent = data.totalusers;
    allUsers.innerHTML = ""; 
    data.usernames.forEach(username => {
        allUsers.innerHTML += `
            <div class="user w-[90%] h-[8%] bg-gradient-to-r from-emerald-500 to-emerald-700 p-2">
                <h2 class="user-name">${username}</h2>
            </div>`;
    });

})


sendBtn.addEventListener("click", function(){
    if(messageInput.value.trim().length > 0){
        let date = new Date()
        let time = `${date.getHours()}:${date.getMinutes()}${date.getHours() > 11 ? "PM" : "AM"}`;
        socket.emit("send-msg", {message: messageInput.value, time});
        messageInput.value = "";
    }
    
});

socket.on("recieve-msg", function(data){
    let {id, time, message} = data;
    if(data.id === socket.id){
        content.innerHTML += `<div class="msg w-[fit-content] bg-emerald-700 rounded-lg px-3 py-2 rounded-tr-[0] self-end mt-2">
                        <h4>${message}</h4>
                        <p class="font-light text-zinc-300 text-sm text-end">${time}</p>
                    </div>`
    } else{
        content.innerHTML += `<div class="msg w-[fit-content] bg-zinc-700 rounded-lg px-3 py-2 rounded-tl-[0] mt-2">
                        <h4>${message}</h4>
                        <p class="font-light text-zinc-300 text-sm text-end">${time}</p>
                    </div>`
    }
    content.scrollTop = content.scrollHeight
})

socket.on("disconnected-user", function(data){
    live.textContent = data
})