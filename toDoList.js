'use strict';

const template = document.querySelector('#taskTemplate');
const listOfTasks = document.querySelector('.list_of_tasks')
const local_storage=[]

/* let tasks = [
    {
        title: 'Пройти опитування',
        description: 'Пройти опитування за цим посиланням: https://example.com/',
        done: false,
        due_date: new Date(new Date().setDate(new Date().getDate() - 1))

    },
    {
        title: 'Реєстрація на TechTalk 25.08.22',
        description: 'Зареєструватись на TechTalk, який пройде 25.08.22 о 09:00. Поговоримо про багаторічну традицію нашої компанії — шаринг знань та традиційний івент з багаторічною історією — InterLink Tech Talk. За традицією, останній івент теплого сезону ми проводимо на свіжому повітрі, у форматі Open Air з пікніком та спілкуванням з колегами. Ділимося з вами коротким оглядом презентацій від наших спікерів, світлинами та атмосферою. Підготовка, саунд чек, посадочні місця — і наша офісна зона відпочинку готова зустрічати гостей. Почали ми наш Knowledge...',
        done: true,
        due_date: new Date(Date.now())
    },
    {
        title: 'Реєстрація на MeetUp 22.09.22',
        description: 'Зареєструватись на MeetUp, який пройде 22.09.22 о 18:00',
        done: false,
        due_date: new Date(new Date().setDate(new Date().getDate() + 1))
    },
    {
        title: 'Зробити щось',
        done: false,
        due_date: new Date(new Date().setDate(new Date().getDate() + 2))
    },
    {
        title: 'Кожен день робити зарядку',
        description: 'Зареєструватись на MeetUp, який пройде 22.09.22 о 18:00',
        done: false,
    }
]
 */

function getValidDate(date) {
    if(date){
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
    let taskClone = template.content.firstElementChild.cloneNode(true);
    console.log(taskClone);
    let taskContent = taskClone.querySelectorAll("h3, h4, p");
    let input = taskClone.querySelector("input");
    let dueDate =taskClone.querySelector(".due_date");
    taskClone.classList.add("undone");
    taskClone.setAttribute("task_id",`${task.id}`)
    taskContent[0].textContent = getValidDate(task.due_date);
    taskContent[1].textContent = task.title;
    taskContent[2].textContent = task.description;

    if (task.done) {
        input.setAttribute("checked", "checked");
        taskClone.classList.add("done_task");
        taskClone.classList.remove("undone");

    }

    if(task.due_date){
        if (isOverdueTask(task)) {
            taskClone.classList.add("overdue");
        }
    } 
    else dueDate.classList.add("displayDate")
    return taskClone;
}

function generateLI(task) {
    let taskNode = document.createElement('li');
    taskNode.setAttribute('id', 'element_of_list')
    taskNode.classList.toggle('done', task.done);
    taskNode.appendChild(templateTask(task))
    return taskNode;
}

function printAllTasks(tasks) {
    tasks
        .map((task) => {
            listOfTasks.appendChild(generateLI(task))
        })
        .join("");
}


function changeState(event) {
    event.stopPropagation()
    console.log(event.target.parentNode.parentNode.parentNode);
    const currentItem = event.target.parentNode.parentNode.parentNode;
    let currentDivTask= event.target.parentNode.parentNode
    let taskid = parseInt(currentDivTask.getAttribute("task_id"))
    let task_checkbox = event.target.hasAttribute("checked")
    console.log(taskid, task_checkbox);
    updateServerTask(taskid, { done: task_checkbox }).then(task => {
        console.log(task);
        const newEl = generateLI(task);
        currentItem.replaceWith(newEl); 
    })
}

function removeTask(event) {
    event.stopPropagation();
    console.log(event.target.parentNode.parentElement, this);
    const btn = event.target.parentElement.parentElement
    const currentDivTask= btn.querySelector(".task")
    let taskid = parseInt(currentDivTask.getAttribute("task_id"))
    console.log(taskid)
    if (event.target.tagName === 'BUTTON') {
       deleteServerTask(taskid).then(()=>btn.remove())
    }
}

function showAllTasks(event) {
    event.stopPropagation();
    console.log(event.target, this);
    document.querySelector(".list_of_tasks").classList.toggle("show-done")
}


let tasksToRemove = document.querySelectorAll("#toDelete")
let taskstoChange = document.querySelectorAll("input")
let AllTasks = document.querySelector("#showAllTasks")

//AllTasks.addEventListener('click', showAllTasks)
//taskstoChange.forEach(taskToChangeState => taskToChangeState.addEventListener('click', changeState))
//tasksToRemove.forEach(task => task.addEventListener('click', removeTask))

let taskForm = document.forms["task"]
const defaultDone = { done: false }

taskForm.addEventListener('submit', (event) => {
    event.preventDefault();
    let validTitle = document.forms["task"].elements.title;
    let formData = new FormData(taskForm);
    if (validTitle.value.length != 0) {
        let newTask = Object.fromEntries(formData.entries())
        newTask = Object.assign(newTask, defaultDone)
        console.log(newTask);
        local_storage.push(newTask);
        listOfTasks.appendChild(generateLI(newTask))
        taskForm.reset();
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
    return fetch(tasksEndpoint + "/" + taskid, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json;charset=utf-8",
        },
        body: JSON.stringify(done)
    })
        .then((response) => response.json());
}

function deleteServerTask(taskid) {
    return fetch(tasksEndpoint +  "/" + taskid, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json;charset=utf-8",
        },
    })
        .then((response) => response.json())
}
getAllTasks()