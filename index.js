function initialized(){
    let Lists
    let currentlist
    fetch("http://localhost:3000/Lists")
    .then(res => res.json())
    .then(data => {
        Lists = data
        Lists.forEach(list => {
            loadLists(list)
        })    
        loadListDetail(Lists[0])
        createNewList()
        createNewItem()
    })

    function createNewItem(){
        document.querySelector("#new-item-form").addEventListener("submit", (e)=>{
            e.preventDefault()
            if(e.target[0].value !==""){
                currentlist.incomplete.push(e.target[0].value)
                patchTasks(currentlist, [currentlist.incomplete, currentlist.complete])
                loadListDetail(currentlist)
            }else{
                alert("Please enter a new task!")
            } 
            e.target.reset()
        })
    }

    function createNewList(){
        document.querySelector("#new-list-form").addEventListener("submit", (e)=>{
            e.preventDefault()
            if(e.target[0].value !== ""){
                fetch(`http://localhost:3000/Lists`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "application/json"
                    },
                    body: JSON.stringify({
                        id: "",
                        name: e.target[0].value,
                        incomplete: [],
                        complete: []
                    })
                }).then(res => res.json())
                .then(newList => {
                    loadLists(newList)
                })
                
            }else{
                alert("Please enter a name for this new list!")
            }
        })
    }

    function loadLists(aList){
        let toDoLists = document.querySelector("#lists")
        let listItem = createListsItem(aList.name)
        toDoLists.appendChild(listItem)
        listItem.addEventListener("click", (e)=>{
            loadListDetail(aList)
        })
    }

    function loadListDetail(aList){
        currentlist = aList
        let tasksLi = [currentlist.incomplete.map(icTask =>{
            return createListItem(icTask)
        }), currentlist.complete.map(cTask =>{
            return createListItem(cTask)
        })]
        deleteListDetails()
        document.querySelector("#name").innerText = aList.name
        renderTasks(tasksLi[0], tasksLi[1])
        addCBEventListeners(tasksLi, currentlist)
    }

    function addCBEventListeners(aTaskList, aList){
        aTaskList[0].forEach(li =>{
            let checkButton = li.querySelector("#checkbox")
            let editButton = li.querySelector("#editTask")

            checkButton.addEventListener("click", ()=>{
                let updatedTasks = updateTasks(li.querySelector("span").innerText, aList, true)
                patchTasks(aList, updatedTasks)
                loadListDetail(aList)
            })

            editButton.addEventListener("click", ()=>{
                let textSpanElement = li.querySelector("span")
                let textSpanValue = textSpanElement.innerText
                textSpanElement.style.backgroundColor = "white"
                textSpanElement.contentEditable = true
                textSpanElement.addEventListener("keydown", (e)=>{
                    if(e.key === "Enter"){
                        textSpanElement.style.backgroundColor = ""
                        textSpanElement.contentEditable = false
                        let editedTasks = editTask(aList, textSpanValue, e, true)
                        patchTasks(currentlist, editedTasks)
                    }
                })     
            })
        })
        aTaskList[1].forEach(li =>{
            let checkButton = li.querySelector("#checkbox")
            let editButton = li.querySelector("#editTask")

            checkButton.addEventListener("click", ()=>{
                let updatedTasks = updateTasks(li.querySelector("span").innerText, currentlist, false)
                patchTasks(currentlist, updatedTasks)
                loadListDetail(currentlist)
            })

            editButton.addEventListener("click", ()=>{
                let textSpanElement = li.querySelector("span")
                let textSpanValue = textSpanElement.innerText
                textSpanElement.style.backgroundColor = "white"
                textSpanElement.contentEditable = true
                textSpanElement.addEventListener("keydown", (e)=>{
                    if(e.key === "Enter"){
                        textSpanElement.style.backgroundColor = ""
                        textSpanElement.contentEditable = false
                        let editedTasks = editTask(aList, textSpanValue, e, false)
                        console.log(editedTasks)
                        patchTasks(currentlist, editedTasks)
                    }
                })     
            })
        })
    }

    function editTask(aList, currentText, event, isIC){
        isIC ? (
            aList.incomplete = aList.incomplete.filter(icTask => icTask !== currentText),
            aList.incomplete.push(event.target.innerText)
        ):(
            aList.complete = aList.complete.filter(cTask => cTask !== currentText),
            aList.complete.push(event.target.innerText)
        )
        return [aList.incomplete, aList.complete]
    }

    function patchTasks(aList, taskList){
        
        fetch(`http://localhost:3000/Lists/${aList.id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify({
                id: aList.id,
                name: aList.name,
                incomplete: taskList[0],
                complete: taskList[1]
            })
        })
    }

    function updateTasks(liTask, aList, taskIC){
        taskIC ? (
            aList.complete.push(liTask), 
            aList.incomplete = aList.incomplete.filter(tasks => tasks !== liTask)):(
            aList.incomplete.push(liTask),
            aList.complete = aList.complete.filter(tasks => tasks !== liTask)
        ) 
        return [aList.incomplete, aList.complete]
    }

    function createListItem(appendText){
        
        let theItem = document.createElement("li")
        let textSpan = document.createElement("span")
        let buttons = document.createElement("div")
        
        textSpan.id = "itemText"
        textSpan.innerText = appendText
        buttons.id = "buttons-container"
        buttons.innerHTML = "<button id=\"editTask\"><i>&#9998;</i></button><button id=\"checkbox\"><i>&#10003;</i></button>"
        
        theItem.appendChild(textSpan)
        theItem.appendChild(buttons)

        return theItem
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

    function deleteListDetails(){

        let incompleteList = document.querySelector("#incomplete-items")
        let completeList = document.querySelector("#complete-items")
        let listName = document.querySelector("#name")
        
        listName.innerText = ""
        incompleteList.innerHTML = "<ul id=\"incomplete-items\"></ul>"
        completeList.innerHTML = "<ul id=\"complete-items\"></ul>"
    }

    function createListsItem(listName){

        let listsItem = document.createElement("li")
        let listsSpan = document.createElement("span")

        listsSpan.innerText = listName
        listsItem.append(listsSpan)
        
        return listsItem
    }
}

document.addEventListener("DOMContentLoaded", initialized())