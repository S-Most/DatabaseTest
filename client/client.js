const form = document.querySelector("form");
const loading = document.querySelector(".loading");
const divMessage = document.querySelector(".messages");
const API_URL = "http://localhost:5000/messages";

loading.style.display = "block";

listAllMessages();

form.addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(form);
    const name = formData.get("name");
    const message = formData.get("message");

    const toShare = { name, message };
    console.log(toShare);

    form.reset();
    form.style.display = "none";
    loading.style.display = "block";

    fetch(API_URL, {
        method: "POST",
        body: JSON.stringify(toShare),
        headers: {
            "content-type": "application/json",
        },
    })
        .then((response) => response.json())
        .then((createdMessage) => {
            console.log(createdMessage);
            listAllMessages();
            form.style.display = "flex";
            loading.style.display = "none";
        });
});

function listAllMessages() {
    divMessage.innerHTML = "";
    fetch(API_URL)
        .then((response) => response.json())
        .then((myMessages) => {
            console.log(myMessages);
            myMessages.reverse();
            myMessages.forEach((myMessage) => {
                const div = document.createElement("div");
                const elName = document.createElement("h3");
                const elMessage = document.createElement("p");
                const elDate = document.createElement("small");

                div.classList.add("mes");
                elName.classList.add("mes-title");

                elName.innerText = myMessage.name;
                elMessage.innerText = myMessage.message;
                elDate.innerText = myMessage.created;

                div.appendChild(elName);
                div.appendChild(elMessage);
                div.appendChild(elDate);
                divMessage.appendChild(div);
            });
        });
    loading.style.display = "none";
}
