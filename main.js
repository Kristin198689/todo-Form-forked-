const createTodoForm = document.getElementById("create-todo-form");
const listBox = document.querySelector(".todolist__list");

const todos = JSON.parse(localStorage.getItem("todos")) || [];

// функция, которая позволяет в 1 строку создать элемент с классом и текстом
const createElem = (tag, className, text = "") => {
  const element = document.createElement(tag);
  element.className = className;
  element.textContent = text;
  return element;
};

const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  const monthes =
    "января, февраля, марта, апреля, мая, июня, июля, августа, сентября, октября, ноября, декабря".split(
      ", "
    );
  const monthStr = monthes[date.getMonth()];
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  return `${date.getDate()} ${monthStr}, ${hours}:${minutes}`;
};

// функция, которая создает элемент li (для туду)
const createTodoElement = (todo) => {
  const li = createElem("li", "todolist__list-item");

  // Создаем чекбокс для отметки выполнения задачи
  const checkbox = createElem("input", "todolist__list-checkbox");
  checkbox.type = "checkbox";
  checkbox.checked = todo.isDone;

  // Добавляем обработчик изменения состояния чекбокса
  checkbox.addEventListener("change", () => {
    todo.isDone = checkbox.checked;
    updateTodos();
  });

  // Создаем кнопку удаления задачи
  const deleteButton = createElem("button", "todolist__del-btn");

  // Добавляем обработчик клика на кнопку удаления
  deleteButton.addEventListener("click", () => {
    const index = todos.indexOf(todo);
    todos.splice(index, 1);
    updateTodos();
  });

  // Создаем контейнер для текста задачи и времени
  const div = createElem("div", "todolist__list-item-content");

  // Добавляем время выполнения задачи
  const time = createElem(
    "time",
    "todolist__list-item-time",
    formatDate(todo.time)
  );

  // Добавляем текст задачи
  const text = createElem("p", "todolist__list-item-text", todo.text);

  // Добавляем элементы в контейнер
  div.append(time, text, deleteButton);

  // Добавляем элементы в строку списка
  li.append(checkbox, div, deleteButton);

  return li;
};

// Функция обновления списка задач и сохранения в localStorage
const updateTodos = () => {
  renderTodos();
  localStorage.setItem("todos", JSON.stringify(todos));
};

const renderTodos = () => {
  listBox.innerHTML = ""; // Очищаем список перед отрисовкой

  todos.forEach((todo) => {
    const li = createTodoElement(todo);
    listBox.appendChild(li);
  });
};

const resetValidationStyles = () => {
  document.querySelectorAll(".new-todo__validation-box").forEach((elem) => {
    elem.style.display = "none";
  });
  document.querySelectorAll(".new-todo__input--error").forEach((elem) => {
    elem.classList.remove("new-todo__input--error");
  });
};

createTodoForm.addEventListener("submit", (e) => {
  e.preventDefault();
  // создаем объект для новой задачи
  const newTodo = {
    text: e.target.elements.todoDesc.value,
    time: e.target.elements.todoTime.value,
    isDone: false,
  };

  if (!newTodo.text) {
    e.target.elements.todoDesc.classList.add("new-todo__input--error");
    const textValidBox = document.querySelector(
      ".new-todo__desc-validation-box"
    );
    textValidBox.style.display = "block";
    textValidBox.textContent = "Поле обязательно";
    return;
  }
  if (!newTodo.time) {
    e.target.elements.todoTime.classList.add("new-todo__input--error");
    const textValidBox = document.querySelector(
      ".new-todo__time-validation-box"
    );
    textValidBox.style.display = "block";
    textValidBox.textContent = "Поле обязательно";
    return;
  }
  resetValidationStyles();
  // добавляем в массив всех задач
  todos.push(newTodo);
  // сохраняем в localStorage
  updateTodos();
  e.target.reset();
});

// отрисовываем первоначальные задачи
renderTodos();

const allButton = document.querySelector(".todolist__filters-btn");
const activeButton = document.querySelectorAll(".todolist__filters-btn")[1];
const completedButton = document.querySelectorAll(".todolist__filters-btn")[2];

allButton.addEventListener("click", () => {
  setActiveButton(allButton);
  renderAllTodos();
});

activeButton.addEventListener("click", () => {
  setActiveButton(activeButton);
  renderActiveTodos();
});

completedButton.addEventListener("click", () => {
  setActiveButton(completedButton);
  renderCompletedTodos();
});

function setActiveButton(button) {
  document.querySelectorAll(".todolist__filters-btn").forEach((btn) => {
    btn.classList.remove("todolist__filters-btn--active");
  });
  button.classList.add("todolist__filters-btn--active");
}

function renderAllTodos() {
  listBox.innerHTML = ""; // Очищаем список перед отрисовкой

  todos.forEach((todo) => {
    const li = createTodoElement(todo);
    listBox.appendChild(li);
  });
}

function renderActiveTodos() {
  listBox.innerHTML = ""; // Очищаем список перед отрисовкой

  const activeTodos = todos.filter((todo) => !todo.isDone);
  activeTodos.forEach((todo) => {
    const li = createTodoElement(todo);
    listBox.appendChild(li);
  });
}

function renderCompletedTodos() {
  listBox.innerHTML = ""; // Очищаем список перед отрисовкой

  const completedTodos = todos.filter((todo) => todo.isDone);
  completedTodos.forEach((todo) => {
    const li = createTodoElement(todo);
    listBox.appendChild(li);
  });
}

function updateTime() {
  const title = document.querySelector(".title");
  const subtitle = document.querySelector(".subtitle");
  const now = new Date();

  const daysOfWeek = [
    "Воскресенье",
    "Понедельник",
    "Вторник",
    "Среда",
    "Четверг",
    "Пятница",
    "Суббота",
  ];

  const dayOfWeek = daysOfWeek[now.getDay()];

  const options = {
    day: "numeric",
    month: "long",
  };
  const formattedTime = now.toLocaleString("ru-RU", options);

  title.textContent = dayOfWeek;
  subtitle.textContent = formattedTime;
}

updateTime();
