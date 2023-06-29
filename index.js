function initialized(){
    
    let Lists
    let currentlist
    let incompleteList = document.querySelector("#incomplete-items")
    let completeList = document.querySelector("#complete-items")

    fetch("http://localhost:3000/Lists")
    .then(res => res.json())
    .then(data => {
        Lists = data
        Lists.forEach(list => {
            loadLists(list)
        })    
        //loadListDetail(Lists[0])
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
                    loadListDetail(newList)
                })
                e.target.reset()
            }else{
                alert("Please enter a name for this new list!")
            }
        })
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
        addEventListeners(tasksLi, currentlist)
    }

    function addEventListeners(aTaskList, aList){
        
        aTaskList.forEach(taskList =>{

            let taskListIndex = aTaskList.indexOf(taskList)
            
            taskList.forEach(li =>{
                
                let checkBox = li.querySelector("#checkbox")
                let editButton = li.querySelector("#editTask")
                let deleteButton = li.querySelector("#deleteTask")

                deleteButton.addEventListener("click", ()=>{
                    if(taskListIndex === 0){
                        let updatedTasks = deleteTask(li.querySelector("span").innerText, aList, true)
                        patchTasks(aList, updatedTasks)
                        loadListDetail(aList)
                    }else{
                        let updatedTasks = deleteTask(li.querySelector("span").innerText, aList, false)
                        patchTasks(aList, updatedTasks)
                        loadListDetail(aList)
                    }
                })

                checkBox.addEventListener("click", ()=>{
                    if(taskListIndex === 0){
                        let updatedTasks = updateTasks(li.querySelector("span").innerText, aList, true)
                        patchTasks(aList, updatedTasks)
                        loadListDetail(aList)
                    }else{
                        let updatedTasks = updateTasks(li.querySelector("span").innerText, aList, false)
                        patchTasks(aList, updatedTasks)
                        loadListDetail(aList)
                    }
                })

                editButton.addEventListener("click", ()=>{

                    let textSpan = li.querySelector("span")
                    let textSpanValue = textSpan.innerText

                    textSpan.style.backgroundColor = "white"
                    textSpan.contentEditable = true
                    textSpan.focus()
                    textSpan.addEventListener("keydown", (e)=>{
                        if(e.key === "Enter"){
                            textSpan.contentEditable = false
                            if(taskListIndex === 0){
                                let editedTasks = editTask(aList, textSpanValue, e, true)
                                patchTasks(aList, editedTasks)
                            }else{
                                let editedTasks = editTask(aList, textSpanValue, e, false)
                                patchTasks(aList, editedTasks)
                            }
                        }
                    })
                    textSpan.addEventListener("blur", ()=>{
                        textSpan.style.backgroundColor = ""
                        textSpan.contentEditable = false
                    })
                })
            })
        })
    }

    function deleteTask(text, aList, isIC){
        isIC ?(
            aList.incomplete = aList.incomplete.filter(task => task !== text)
        ):(
            aList.complete = aList.complete.filter(task => task !== text)
        )
        return [aList.incomplete, aList.complete]
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
        buttons.innerHTML = "<button id=\"deleteTask\"><i>&#10005;</i></button><button id=\"editTask\"><i>&#9998;</i></button><button id=\"checkbox\"><i>&#10003;</i></button>"
        
        theItem.appendChild(textSpan)
        theItem.appendChild(buttons)

        return theItem
    }

    function createListsItem(listName){

        let listsItem = document.createElement("li")
        let listsSpan = document.createElement("span")

        listsItem.setAttribute("tabindex", 1)
        listsSpan.innerText = listName
        listsItem.append(listsSpan)
        
        return listsItem
    }

    function renderTasks(domIncompleteTasks, domcompletedTasks){
        
        domIncompleteTasks.forEach(icTask =>{
            incompleteList.appendChild(icTask)
        })
        domcompletedTasks.forEach(cTask =>{
            completeList.appendChild(cTask)
        })
    }

    function deleteListDetails(){

        let listName = document.querySelector("#name")
        
        listName.innerText = ""
        incompleteList.innerHTML = "<ul id=\"incomplete-items\"></ul>"
        completeList.innerHTML = "<ul id=\"complete-items\"></ul>"
    }

}

document.addEventListener("DOMContentLoaded", initialized())