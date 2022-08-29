'use strict';

const calendarSvg = `<svg  width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M10.4998 2.33325H3.49984C2.21117 2.33325 1.1665 3.37792 1.1665 4.66659V10.4999C1.1665 11.7886 2.21117 12.8333 3.49984 12.8333H10.4998C11.7885 12.8333 12.8332 11.7886 12.8332 10.4999V4.66659C12.8332 3.37792 11.7885 2.33325 10.4998 2.33325Z" stroke="#878787" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M4.6665 1.16663V3.49996M9.33317 1.16663V3.49996M1.1665 5.83329H12.8332" stroke="#878787" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`

/* const inc = (init = 0) => () => ++init;
const genId = inc();

   let tasks = [
    {
        id: genId(),
        title: 'Пройти опитування',
        description: 'Пройти опитування за цим посиланням: https://example.com/',
        done: false,
        due_date: new Date(new Date().setDate(new Date().getDate() - 1))

    },
    {
        id: genId(),
        title: 'Реєстрація на TechTalk 25.08.22',
        description: 'Зареєструватись на TechTalk, який пройде 25.08.22 о 09:00. Поговоримо про багаторічну традицію нашої компанії — шаринг знань та традиційний івент з багаторічною історією — InterLink Tech Talk. За традицією, останній івент теплого сезону ми проводимо на свіжому повітрі, у форматі Open Air з пікніком та спілкуванням з колегами. Ділимося з вами коротким оглядом презентацій від наших спікерів, світлинами та атмосферою. Підготовка, саунд чек, посадочні місця — і наша офісна зона відпочинку готова зустрічати гостей. Почали ми наш Knowledge...',
        done: true,
        due_date: new Date(Date.now())
    },
    {
        id: genId(),
        title: 'Реєстрація на MeetUp 22.09.22',
        description: 'Зареєструватись на MeetUp, який пройде 22.09.22 о 18:00',
        done: false,
        due_date: new Date(new Date().setDate(new Date().getDate() + 1))
    },
    {
        id: genId(),
        title: 'Зробити щось',
        done: false,
        due_date: new Date(new Date().setDate(new Date().getDate() + 2))
    },
    {
        id: genId(),
        title: 'Кожен день робити зарядку',
        description: 'Зареєструватись на MeetUp, який пройде 22.09.22 о 18:00',
        done: false,
    }
] 
    */

let local_storage = [];

function getValidDate(date) {
    if(date!=""){
        date = new Date(date)
        let time = date.toISOString().split("T")[0].split("-").reverse().join(".");
        return time;
    } else return "";
    
}

function isOverdueTask(task) {
    let currentDate = new Date(Date.now())
    return (new Date(task.due_date) < currentDate) ? true : false;
}

function templateTask(task) {
    return `<div class="task" >
    <span class="scale" ${task.done ? "style = \"background: #58AC83; border-radius: 4px 4px 0px 0px; width: 100%; \"" : task.due_date ? (isOverdueTask(task) ? "style = \"background: #E63241; border-radius: 4px 4px 0px 0px; width: 100%;\"" :
    "style = \"background: #D9D9D9;border-radius: 4px 4px 0px 0px; width: 100%;\"" ): "style = \"background: #D9D9D9;border-radius: 4px 4px 0px 0px; width: 100%;\""}></span>
    <div class="due_date">
    ${task.due_date ? calendarSvg : ""}
      <h3 ${task.done ? "style= \"color: #262837;\" " : task.due_date ? (isOverdueTask(task) ? "style = \"color: #E63241; \"" : "") : ""}> ${ task.due_date? getValidDate(task.due_date) : ""}</h3>
    </div>
    <div class="title" task_id = \"${task.id}\">
    <input type="checkbox" ${task.done ? "checked" : ""} onclick=\"changeState(event)\">
      <h4 ${task.done ? "style =\"color: #878787;  text-decoration: line-through;\"" : "style= \"color: #262837; text-decoration: none;\" "}>${task.title}</h4>
    </div>
    <div class="description">
      <p>${task.description ? task.description : ""}</p>
    </div>
    </div>
  </li>`
}

const listOfTasks = document.querySelector('.list_of_tasks')

function changeState(event) {
    event.stopPropagation()
    event.target.parent('.task')
    console.log(event.target, this);
    const currentDivTitle = event.target.parentElement;
    const currentDivTask = event.target.parentNode.parentNode;
    console.log(currentDivTitle, currentDivTask);
    /* const currentItems = document.querySelectorAll("#element_of_list")
    currentItems.forEach(currentItem => {
        const currentDiv = currentItem.querySelector(".task").outerHTML
        const titleofTask = currentItem.querySelector(".title h4").outerText
        if (currentDivTask.outerHTML === currentDiv) {
            tasksToInsert = tasks.find((task) => {task.title === titleofTask})
            tasksToInsert.done=!tasksToInsert.done;
            const newItem = document.createElement('li')
            newItem.setAttribute('id', 'element_of_list')
            newItem.classList.toggle('done', tasksToInsert.done);
            newItem = generateTask(tasksToInsert); 
            currentItem.replaceWith(newItem);
            
        }
    })  */ 
     let taskid = parseInt(currentDivTitle.getAttribute("task_id")) 
     let task_checkbox=event.target.hasAttribute("checked")
     console.log(taskid, task_checkbox);
    updateServerTask(taskid, {done:task_checkbox}).then(task=>{
    console.log(task);
    const newEl = generateTask(task);
    const oldEl = document.querySelector("");
    //oldEl.replaceWith(newEl); 
    }) 
  
}

function removeTask(event) {
    event.stopPropagation();
    console.log(event.target, this);
    const btn = event.target
    if (btn.tagName === 'BUTTON') {
        btn.remove();
        deleteServerTask().then();
    }
}

function showAllTasks(event) {
    event.stopPropagation();
    console.log(event.target, this);
    document.querySelector(".list_of_tasks").classList.toggle("show-done")
}

function generateTask(task) {
    let taskNode = document.createElement('li');
    taskNode.setAttribute('id', 'element_of_list')
    taskNode.classList.toggle('done', task.done);
    taskNode.innerHTML = `<button id="toDelete" onclick="removeTask(event)">Delete</button>
        ${templateTask(task)}`
    return taskNode;
}

function printAllTasks(tasks) {
    tasks
        .map((task) => {
            listOfTasks.appendChild(generateTask(task))
        })
        .join("");
}


let tasksToRemove = document.querySelectorAll("#toDelete")
let taskstoChange = document.querySelectorAll("input")
let AllTasks = document.querySelector("#showAllTasks")

//AllTasks.addEventListener('click', showAllTasks)
//taskstoChange.forEach(taskToChangeState => taskToChangeState.addEventListener('click', changeState))
tasksToRemove.forEach(task => task.addEventListener('click', removeTask))

let taskForm = document.forms["task"]
const defaultDone = { done: false }

taskForm.addEventListener('submit', (event) => {
    event.preventDefault();
    let validTitle = document.forms["task"].elements.title;
    let formData = new FormData(taskForm);
    if (validTitle.value.length != 0) {
        let newTask = Object.fromEntries(formData.entries())
        newTask = Object.assign(newTask, defaultDone)
        console.log(newTask)
            local_storage.push(newTask)
            listOfTasks.appendChild(generateTask(newTask))
            createTask(newTask)
                .then((task) => {
                    console.log(task);
                    if (task === undefined) throw Error("No data");
                    let i = local_storage.indexOf(newTask);
                    local_storage[i] = task;
                    const newEl = generateTask(local_storage[i])
                    const oldEl = document.querySelector("#element_of_list:last-child");
                    oldEl.replaceWith(newEl);
                })
                .then(taskForm.reset());
    }
    else {
        let errText = document.querySelector(".err_empty_title");
        errText.style.opacity = "1";
        validTitle.style.border = "1px solid red";
        setTimeout(() => { errText.style.opacity = "0"; validTitle.style.border = ""; }, 2000);
    }

})


const tasksEndpoint = 'http://localhost:5000/tasks';

function getAllTasks() {
    return fetch(tasksEndpoint)
        .then(response => response.json())
        .then(tasks => printAllTasks(tasks))
        .catch(handleError)
}

function handleError() {
    listOfTasks.innerText = "Can't load task :(";
}

function createTask(task) {
    return fetch(tasksEndpoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(task)
    })
        .then(response => response.json())
}

function updateServerTask(taskid, done) {
    return fetch(tasksEndpoint + "/" +taskid, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json;charset=utf-8",
        },
       body: JSON.stringify(done)
    })
        .then((response) => response.json());
}

function deleteServerTask() {
    return fetch(tasksEndpoint + id, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json;charset=utf-8",
        },
    })
        .then((response) => response.json())
}
getAllTasks()