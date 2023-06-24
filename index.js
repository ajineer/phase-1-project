function initialized(){
    let listObj
    let Lists
    fetch("http://localhost:3000/Lists")
    .then(res => res.json())
    .then(data => {
        Lists = data
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
            let toDoListItem = createListItem(Object.item)
            let editBtn = document.querySelector("#edit")
            toDoList.appendChild(toDoListItem)
            let textSpan = document.querySelector("#itemText")
            document.querySelector("#edit").addEventListener("click", (e)=>{
                return 1;
            })
        })
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