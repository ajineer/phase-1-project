function initialized(){
    fetch("http://localhost:3000/Lists")
    .then(res => res.json())
    .then(data => {
        let Lists = data
        let currentList
        Lists.forEach(list => {
            let toDoLists = document.querySelector("#lists")
            let listItem = createListsItem(list.name)
            toDoLists.appendChild(listItem)
            // let domTasks
            let domTasks
            listItem.addEventListener("click", (e)=>{
                // reset incomplete and completed task list
                deleteListDetails();
                // load the list name above c and ic tasks
                loadListName(list.name)
                // make both an ic list and c list of dom elements
                domTasks = makeListItems(list.incomplete, list.complete)
                // render the ic an c items into the dom
                renderTasks(domTasks[0], domTasks[1])
                addICEventListener(domTasks)
            })
        })    
    })
    function addICEventListener(liArray){
        let tasks = [liArray[0].map(liItem =>{
            return liItem.querySelector("span").innerText
        }), liArray[1].map(liItem =>{
            return liItem.querySelector("span").innerText
        })]
        let domifyIctasks
        liArray[0].forEach(li =>{
            li.querySelector("#checkbox").addEventListener("click", ()=>{
                currentICtask = updateICtasks(li.querySelector("span").innerText, tasks)
                domifyIctasks = makeListItems(currentICtask[0], currentICtask[1])
                renderTasks(domifyIctasks[0], domifyIctasks[1])
            })
        })
    }
    function loadListName(aListName){
        let listDOMName = document.querySelector("#name")
        listDOMName.innerText = aListName
    }

    function renderTasks(domIncompleteTasks, domcompletedTasks){
        let incompleteDOMtasks = document.querySelector("#incomplete-items")
        let completeDOMtasks = document.querySelector("#complete-items")
        
        domIncompleteTasks.forEach(icTask =>{
            incompleteDOMtasks.appendChild(icTask)
        })
        domcompletedTasks.forEach(cTask =>{
            completeDOMtasks.appendChild(cTask)
        })
    }

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
        //.then(patchedList => loadListItems(patchedList.incomplete, patchedList.complete)
        //)
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


    function updateICtasks(liTask, aList){
        let icIndex = aList[0].indexOf(liTask)
        aList[1].push(liTask)
        aList[0].splice(icIndex, 1)
        return [aList[0], aList[1]]
    }

    function updateCtasks(liTask, aList){
        let cIndex = aList[1].indexOf(liTask)
        aList[0].push(liTask)
        aList[1].splice(cIndex, 1)
        return [aList[0], aList[1]]
    }
    
    function makeListItems(incompleteList, completeList){
        // deleteListDetails();
        // let alistName = document.querySelector("#name")
        // alistName.innerText = listName
        // let incompleteDOMList = document.querySelector("#incomplete-items")
        // let completeDOMList = document.querySelector("#complete-items")
        // incompleteList.forEach(item =>{
        //     let incompleteTask = createListItem(item)
        //     incompleteDOMList.appendChild(incompleteTask)
        // })
        // completeList.forEach(item =>{
        //     let completeTask = createListItem(item)
        //     completeDOMList.appendChild(completeTask)
        // })
        let domCitems = completeList.map(cTask =>{
            cTask = createListItem(cTask)
            return cTask
        })
        let domICitems = incompleteList.map(icTask =>{
            icTask = createListItem(icTask)
            return icTask
        })
        return [domICitems, domCitems]
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
        let listName = document.querySelector("#name")
        listName.innerText = ""
        incompleteList.innerHTML = "<ul id=\"incomplete-items\"></ul>"
        completeList.innerHTML = "<ul id=\"complete-items\"></ul>"
    }
}


document.addEventListener("DOMContentLoaded", initialized())