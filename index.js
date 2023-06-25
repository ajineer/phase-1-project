function initialized(){
    let listObj
    let Lists
    fetch("http://localhost:3000/Lists")
    .then(res => res.json())
    .then(data => {
        Lists = data
        //loadListDetails(Lists[0])
        Lists.forEach(list => {
            loadListName(list);
        });
    })

    function loadListName(aList){
        let toDoLists = document.querySelector("#lists")
        let listItem = createListsItem(aList.name)
        
        toDoLists.appendChild(listItem)
        let editButton = listItem.querySelector("#edit")
        
        editButton.addEventListener("click", (e) =>{
            listNameSpan = listItem.querySelector("span")
            listNameSpan.style.backgroundColor = "white"
            listNameSpan.contentEditable = true
            listNameSpan.focus();
            listNameSpan.addEventListener("keydown", event =>{
                if(event.key === "Enter"){
                    event.preventDefault()
                    listNameSpan.contentEditable = false
                    listNameSpan.style.backgroundColor = ""
                    patchListName(aList.id, listNameSpan.innerText)
                }
            })
        })
    }
    function patchListName(anId, aListName){
        fetch(`http://localhost:3000/Lists/${anId}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify({
                name: aListName
            })
        })

    }
    
    function createListsItem(listName){
        let listsItem = document.createElement("li")
        let listsSpan = document.createElement("span")
        let editButton = document.createElement("div")

        editButton.id = "listsEditButton"
        listsSpan.innerText = listName
        editButton.innerHTML = "<button id=\"edit\"><i>&#9998;</i></button><button id=\"deleteList\"><i>&#9988;</i></button>"
        listsItem.append(listsSpan, editButton)
        
        return listsItem

    }

    function createListItem(appendText){
        
        let theItem = document.createElement("li")
        let textSpan = document.createElement("span")
        let buttons = document.createElement("div")
        
        textSpan.id = "itemText"
        textSpan.innerText = appendText
        buttons.id = "buttons-container"
        buttons.innerHTML = "<button id=\"edit\"><i>&#9998;</i></button><button id=\"checkbox\"><i>&#10003;</i></button><button id=\"trash\"><i>&#10006;</i></button>"
        
        theItem.appendChild(textSpan)
        theItem.appendChild(buttons)
        
        return theItem
    }
    function deleteListDetails(){
        let currentToDoList = document.querySelector("#items")
        currentToDoList.innerHTML = "<ul id=\"items\"></ul>"
    }
}


document.addEventListener("DOMContentLoaded", initialized())