function initialized(){
    
    // "Global" variables for all the todo lists, current list and some dom elements
    let Lists
    let currentlist
    let incompleteList = document.querySelector("#incomplete-items")
    let completeList = document.querySelector("#complete-items")

    // start with fetching the todo lists from db.json
    fetch("http://localhost:3000/Lists")
    .then(res => res.json())
    .then(data => {
        Lists = data
        Lists.forEach(list => {
            loadLists(list)
        })    
        loadListDetail(Lists[0]?Lists[0]:{id:'', name:'', incomplete:[], complete:[]})
        createNewList()
        createNewItem()
    })

    // function adds new item to to incomplete task list
    function createNewItem(){
        document.querySelector("#new-item-form").addEventListener("submit", (e)=>{
            e.preventDefault()
            if(e.target[0].value === "" || currentlist.id===''){
                alert("Invalid task name or no list found")
            }else{
                currentlist.incomplete.push(e.target[0].value)
                patchTasks(currentlist, [currentlist.incomplete, currentlist.complete])
                loadListDetail(currentlist)
            } 
            e.target.reset()
        })
    }

    // function creates new todo list
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

    // update json data base with updated tasks list
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

    // load every todo list in lists column
    // and add event listener to each one
    function loadLists(aList){

        let toDoLists = document.querySelector("#lists")
        let listItem = createListsItem(aList.name)

        toDoLists.appendChild(listItem)
        listItem.addEventListener("click", (e)=>{
            loadListDetail(aList)
        })
        listItem.querySelector("button").addEventListener("click", ()=>{
            deleteThisList(aList)
            listItem.remove()
            deleteListDetails()
        })
    }

    function deleteThisList(aList){
        fetch(`http://localhost:3000/Lists/${aList.id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            }
        }).then(()=>{
            Lists = Lists.filter(l => l.id !== aList.id)
            loadListDetail(Lists[0]?Lists[0]:{id:'', name:'', incomplete:[], complete:[]})
        })
    }
    // loads the tasks from the current list selected
    // and adds event listeners to the tasks in both columns
    function loadListDetail(aList){
        
        currentlist = aList
        let tasksLi = [currentlist?currentlist.incomplete.map(icTask =>{
                return createListItem(icTask)
            }):[], currentlist?currentlist.complete.map(cTask =>{
                return createListItem(cTask)
            }):[]]
        
        deleteListDetails()
        document.querySelector("#name").innerText = aList.name
        renderTasks(tasksLi[0], tasksLi[1])
        addEventListeners(tasksLi, currentlist)
    }

    // adds event listeners to the edit, delete, and check buttons
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

    // deletes task from the incomplete or complete list
    function deleteTask(text, aList, isIC){
        isIC ?(
            aList.incomplete = aList.incomplete.filter(task => task !== text)
        ):(
            aList.complete = aList.complete.filter(task => task !== text)
        )
        return [aList.incomplete, aList.complete]
    }

    // appends edited task to the incomplete/complete list
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

    // moves incomplete task to complete or vise versa
    function updateTasks(liTask, aList, taskIC){

        taskIC ? (
            aList.complete.push(liTask), 
            aList.incomplete = aList.incomplete.filter(tasks => tasks !== liTask)
        ):(
            aList.incomplete.push(liTask),
            aList.complete = aList.complete.filter(tasks => tasks !== liTask)
        ) 
        return [aList.incomplete, aList.complete]
    }

    // creates todo task for the DOM
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

    // creates new list for the lists DOM
    function createListsItem(listName){

        let listsItem = document.createElement("li")
        let listsSpan = document.createElement("span")
        let listDelete = document.createElement("button")


        listDelete.innerHTML = "<i>&#10005;</i>"
        listDelete.id = "deleteListBtn"
        listsSpan.innerText = listName
        listsItem.append(listsSpan)
        listsItem.append(listDelete)
        
        return listsItem
    }

    // renders all todo's of current list selected to the DOM
    function renderTasks(domIncompleteTasks, domcompletedTasks){
        
        domIncompleteTasks.forEach(icTask =>{
            incompleteList.appendChild(icTask)
        })
        domcompletedTasks.forEach(cTask =>{
            completeList.appendChild(cTask)
        })
    }

    // resets the todo's evertytime a different list is selected
    function deleteListDetails(){

        let listName = document.querySelector("#name")
        
        listName.innerText = ""
        incompleteList.innerHTML = "<ul id=\"incomplete-items\"></ul>"
        completeList.innerHTML = "<ul id=\"complete-items\"></ul>"
    }

}

//runs entire program when html is finished loading
document.addEventListener("DOMContentLoaded", initialized())