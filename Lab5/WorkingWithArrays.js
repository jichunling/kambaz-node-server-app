let todos = [
  { id: 1, title: "Task 1", completed: false },
  { id: 2, title: "Task 2", completed: true },
  { id: 3, title: "Task 3", completed: false },
  { id: 4, title: "Task 4", completed: true },
];

export default function WorkingWithArrays(app) {
  const getTodos = (req, res) => {
    const { completed } = req.query;
    if (completed !== undefined) {
      const completedBool = completed === "true";
      const completedTodos = todos.filter((t) => t.completed === completedBool);
      res.json(completedTodos);
      return;
    }
    res.json(todos);
  };
  const getTodoById = (req, res) => {
    const { id } = req.params;
    const todo = todos.find(
         (t) => t.id === parseInt(id));
    res.json(todo);
  };

//Feature,                  createNewTodo,                                                            postNewTodo
//Data Source,          Hardcoded on the Server,                                                     Sent from the Client (req.body)
//Request Type,         Typically called with a GET or POST request that has an empty body.,        "Must be called with a POST request containing a JSON body (e.g., { ""title"": ""Buy Milk"", ""completed"": false })."
//Response Body,        Sends back the entire updated todos array (res.json(todos)).,               Sends back only the newly created todo object (res.json(newTodo)).
//Data Sent,            "The new todo always has title: ""New Task"".",                             "The new todo has its title, completed status, and any other fields set by the client."
  
const createNewTodo = (req, res) => {
    const newTodo = { id: new Date().getTime(),
      title: "New Task", completed: false };
    todos.push(newTodo);
    res.json(todos);//response the whole list
  };
  const postNewTodo = (req, res) => {
    //create primary key "id" in the server
    //the other info gets from the client "req.body"
    const newTodo = { ...req.body,
      id: new Date().getTime() };
    todos.push(newTodo);
    res.json(newTodo); //only response the new Todo, not the whole list
    //the client only get the casch
  };

  const removeTodo = (req, res) => {
    const { id } = req.params;
    const todoIndex = todos.findIndex((t) => t.id === parseInt(id));
    todos.splice(todoIndex, 1);
    res.json(todos); //return all the todos
  };
  const deleteTodo = (req, res) => {
    const { id } = req.params;
    const todoIndex = todos.findIndex((t) => t.id === parseInt(id));
    //Deleting Non Existing Items
    if (todoIndex === -1) {
      res.status(404).json({ message:
        `Unable to delete Todo with ID ${id}` });
      return;
    }

    todos.splice(todoIndex, 1);
    res.sendStatus(200); //just sending the status
  };


  const updateTodoTitle = (req, res) => {
    const { id, title } = req.params;
    const todo = todos.find(
      (t) => t.id === parseInt(id));
    todo.title = title;
    res.json(todos);
  };
  const updateTodo = (req, res) => {
    const { id } = req.params;
    //Updating Non Existing Items
    const todoIndex = todos.findIndex(
      (t) => t.id === parseInt(id));
    if (todoIndex === -1) {
      res.status(404).json({ message:
        `Unable to update Todo with ID ${id}` });
      return;
    }

    todos = todos.map((t) => {
      if (t.id === parseInt(id)) {
        return { ...t, ...req.body };
      }
      return t;
    });
    res.sendStatus(200);
  };
  app.put("/lab5/todos/:id", updateTodo);

  app.get("/lab5/todos/:id/title/:title", updateTodoTitle);
  app.get("/lab5/todos/:id/delete", removeTodo); //bad practice:URL里面有verb:delete
  app.delete("/lab5/todos/:id", deleteTodo);
  app.get("/lab5/todos", getTodos);
  app.get("/lab5/todos/create", createNewTodo);//bad practice:URL里面有verb:create
  app.post("/lab5/todos", postNewTodo); //no need to verb "create"
  app.get("/lab5/todos/:id", getTodoById);



  
};
