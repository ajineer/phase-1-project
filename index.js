function initialized(){
    let listObj
    fetch("http://localhost:3000/Lists")
    .then(res => res.json())
    .then(data => {
        let Lists = data
        loadListDetails(Lists[0])
        Lists.forEach(list => {
            loadListName(list);
        });
    })

    function loadListName(aList){
        let toDoLists = document.querySelector("#lists")
        let listTitle = document.createElement("li")
        listTitle.innerText = aList.name
        toDoLists.appendChild(listTitle)
        listTitle.addEventListener("click", (e) => {
            deleteListDetails();
            loadListDetails(aList)
        })
    }
    function loadListDetails(aList){
        
        let toDoList = document.querySelector('#items')
        let toDoObjects = Object.values(aList.items)
        let thisTitle = document.querySelector("#name")
        thisTitle.innerText = aList.name

        toDoObjects.forEach(Object => {
            let theItem = document.createElement("li")
            theItem.innerText = Object.item
            let buttons = document.createElement("div")
            buttons.id = "buttons-container"
            buttons.innerHTML = "<button id=\"edit\"><i>&#9998;</i></button><button id=\"checkbox\"><i>&#10003;</i></button> <button id=\"trashbutton\"><i>&#10006;</i></button>"
            theItem.appendChild(buttons)
            toDoList.appendChild(theItem)
        })
    }

    function deleteListDetails(){
        let currentToDoList = document.querySelector("#items")
        currentToDoList.innerHTML = "<ul id=\"items\"></ul>"
    }
}


document.addEventListener("DOMContentLoaded", initialized())