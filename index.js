function initialized(){
    let listObj
    let Lists
    fetch("http://localhost:3000/Lists")
    .then(res => res.json())
    .then(data => {
        Lists = data
        Lists.forEach(list => {
            //loadListName(list)
            let toDoLists = document.querySelector("#lists")
            let listItem = createListsItem(list.name)
            toDoLists.appendChild(listItem)
            listItem.addEventListener("click", ()=>{
                loadListItems(list.incomplete, list.complete, list.name)
                let domICitems = document.querySelector("#incomplete-items").querySelectorAll("li")
                domICitems.forEach(icItem =>{
                    icItem.querySelector("#checkbox").addEventListener("click", ()=>{
                        let updatedTasks = updateICtasks(icItem.querySelector("span").innerText, list)
                        updateIClist(list, updatedTasks)
                    })
                })
            })
        })    
    })

    function updateIClist(aList, tasks){
        fetch(`http://localhost:3000/Lists/${aList.id}`,{
            method:"PATCH",
            headers:{
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify({
                id: aList.id,
                name: aList.name,
                incomplete: tasks[0],
                complete: tasks[1]
            })
        })
        .then(res => res.json())
        .then(patchedList => loadListItems(patchedList.incomplete, patchedList.complete, patchedList)
        )
    }

        // let editButton = listItem.querySelector("#edit")
        // let deleteButton = listItem.querySelector("#deleteList")

        // deleteButton.addEventListener("click", () => {
        //     deleteList(aList.id)
        //     listItem.remove()
        // }) 

        // editButton.addEventListener("click", (e) =>{
        //     listNameSpan = listItem.querySelector("span")
        //     listNameSpan.style.backgroundColor = "white"
        //     listNameSpan.contentEditable = true
        //     listNameSpan.focus();
        //     listNameSpan.addEventListener("keydown", event =>{
        //         if(event.key === "Enter"){
        //             event.preventDefault()
        //             listNameSpan.contentEditable = false
        //             listNameSpan.style.backgroundColor = ""
        //             patchListName(aList.id, listNameSpan.innerText)
        //         }
        //     })
        // })

        // listItem.addEventListener("click", ()=>{
        //     loadListItems(aList.incomplete, aList.complete, aList.name)
        //     let incompleteTaskList = document.querySelector("#incomplete-items").querySelectorAll("li")
        //     incompleteTaskList.forEach(task => {
        //         task.querySelector("#checkbox").addEventListener("click", ()=>{
        //             let updatedTasks = updateICtasks(task, aList)
        //             loadListItems(updatedTasks[0], updatedTasks[1], aList.name)
        //         })
        //     })
        // })

    function updateICtasks(taskText, aList){
        let icIndex = aList.incomplete.indexOf(taskText)
        aList.complete.push(taskText)
        aList.incomplete.splice(icIndex, 1)
        return [aList.incomplete, aList.complete]
    }

    function loadListItems(incompleteList, completeList, listName){
        deleteListDetails();
        let alistName = document.querySelector("#name")
        alistName.innerText = listName
        let incompleteDOMList = document.querySelector("#incomplete-items")
        let completeDOMList = document.querySelector("#complete-items")
        incompleteList.forEach(item =>{
            let incompleteTask = createListItem(item)
            incompleteDOMList.appendChild(incompleteTask)
        })
        completeList.forEach(item =>{
            let completeTask = createListItem(item)
            completeDOMList.appendChild(completeTask)
        })  
    }
    function deleteList(listId){
        fetch(`http://localhost:3000/Lists/${listId}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            }
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
        let incompleteList = document.querySelector("#incomplete-items")
        let completeList = document.querySelector("#complete-items")
        incompleteList.innerHTML = "<ul id=\"incomplete-items\"></ul>"
        completeList.innerHTML = "<ul id=\"complete-items\"></ul>"
    }
}


document.addEventListener("DOMContentLoaded", initialized())