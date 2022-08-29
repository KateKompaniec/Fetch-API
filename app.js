const express = require("express");
const app = express();
const cors = require('cors');



function logRequest({ method, url }, res, next) {
  console.log(`[${new Date().toISOString()}] ${method} ${url}`);
  next();
}
app.use(cors());
app.use(express.json());
app.use(logRequest);


const inc = (init = 0) => () => ++init;
const genId = inc();
let todoitem = [
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

const createTask = (data) => {
  return {
    id: genId(),
    title: data.title,
    description: data.description,
    done: false,
    due_date:data.due_date
  };
};

// Getting a list of all todoitem > curl localhost:5000/todoitem
app.get("/tasks", (req, res) => res.json(todoitem));

// Creating a new todoitem > curl localhost:5000/todoitem -d '{ "title": "Generate ID" }' -H 'Content-type: application/json'
app.post("/tasks", (req, res) => {
  const todo = createTask(req.body);
  todoitem.push(todo);
  res.json(todoitem);
});

// Edit todoitem > curl -X PATCH localhost:5000/todoitem/1 -d '{ "done": true }' -H 'Content-type: application/json'
app.patch("/tasks/:id", (req, res) => {
  const todoId = parseInt(req.params.id);
  const todo = todoitem.find((t) => t.id === todoId);
  if (todo) {
    Object.assign(todo, req.body);
    res.json(todoitem);
  } else {
    res.status(404).json({ error: "Task not found" });
  }
});

app.delete("/tasks/:id", (req, res) => {
    const todoId = parseInt(req.params.id);
    const todo = todoitem.find((t) => t.id === todoId);
    if (todo) {
        let index = tasks.indexOf(task);
        tasks.splice(index,1);
      res.json(todoitem);
    } else {
      res.status(404).json({ error: "Task not found" });
    }
  })

module.exports = app