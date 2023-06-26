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
    })

    function createNewItem(aList){
        document.querySelector("#new-item-form").addEventListener("submit", (e)=>{
            e.preventDefault()
            if(e.target[0].value !==""){
                aList.incomplete.push(e.target[0].value)
                fetch(`http://localhost:3000/Lists/${aList.id}`, {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "application/json"
                    },
                    body: JSON.stringify({
                        id: aList.id,
                        name: aList.name,
                        incomplete: aList.incomplete,
                        complete: aList.complete
                    })
                })
                loadListDetail(aList)
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
        listItem.addEventListener("click", ()=>{
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
        document.querySelector("#new-item-form").addEventListener("submit", (e)=>{
            e.preventDefault()
            if(e.target[0].value !==""){
                currentlist.incomplete.push(e.target[0].value)
                fetch(`http://localhost:3000/Lists/${currentlist.id}`, {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "application/json"
                    },
                    body: JSON.stringify({
                        id: currentlist.id,
                        name: currentlist.name,
                        incomplete: currentlist.incomplete,
                        complete: currentlist.complete
                    })
                }).then(res => res.json())
                .then(data => {
                    loadListDetail(data)
                })
            }else{
                alert("Please enter a new task!")
            }
            e.target.reset()
        })
    }

    function addCBEventListeners(aTaskList, currentlist){
        aTaskList[0].forEach(li =>{
            li.querySelector("#checkbox").addEventListener("click", ()=>{
                let updatedICtasks = updateICtasks(li.querySelector("span").innerText, currentlist)
                patchTasks(currentlist, updatedICtasks)
                loadListDetail(currentlist)
            })
        })
        aTaskList[1].forEach(li =>{
            li.querySelector("#checkbox").addEventListener("click", ()=>{
                let updatedCtasks = updateCtasks(li.querySelector("span").innerText, currentlist)
                patchTasks(currentlist, updatedCtasks)
                loadListDetail(currentlist)
            })
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
    function updateICtasks(liTask, aList){
        let icIndex = aList.incomplete.indexOf(liTask)
        aList.complete.push(liTask)
        aList.incomplete.splice(icIndex, 1)
        return [aList.incomplete, aList.complete]
    }

    function updateCtasks(liTask, aList){
        let cIndex = aList.complete.indexOf(liTask)
        aList.incomplete.push(liTask)
        aList.complete.splice(cIndex, 1)
        return [aList.incomplete, aList.complete]
    }

    function createListItem(appendText){
        
        let theItem = document.createElement("li")
        let textSpan = document.createElement("span")
        let buttons = document.createElement("div")
        
        textSpan.id = "itemText"
        textSpan.innerText = appendText
        buttons.id = "buttons-container"
        buttons.innerHTML = "<button id=\"checkbox\"><i>&#10003;</i></button>"
        
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