// För att lösa uppgiften har jag googlat mig fram till dokumentation, använt chatGTP och kollat på olika Youtube-videos.
const API_URL = 'https://js1-todo-api.vercel.app/api/todos?apikey=84e78461-7f5f-4914-88ed-4422093ba6a1';

// Hämtar alla todos från API:et
async function fetchTodos() {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const todos = await response.json();
    displayTodos(todos);  // Kallar på en funktion som ska visa todos i DOM:en
  } catch (error) {
    console.error('Could not fetch todos:', error);
  }
}

// Bygger en dynamisk lista baserat på todos från mitt API
function displayTodos(todos) {
  const todoList = document.getElementById('todoList');
  todoList.innerHTML = '';
  todoList.className = "text-xl text-center text-rose-950 bg-white/75 py-2.5";

  // Skapar en <li> för varje todo
  todos.forEach(todo => {
    const listItem = document.createElement('li');
    listItem.className = `text-rose-950 my-7 ${todo.completed ? 'completed' : 'not-completed'}`;
    listItem.setAttribute('data-id', todo._id);
    listItem.textContent = todo.title;

    // Toggle-button för klarmarkering
    const toggleButton = document.createElement('button');
    toggleButton.className = "cursor-pointer text-sm bg-green-500 text-white px-2 mx-2 rounded";
    toggleButton.textContent = todo.completed ? 'Mark as Not Done' : 'Mark as Done';
    toggleButton.addEventListener('click', () => toggleTodoStatus(todo._id, !todo.completed));

    // Remove-button för borttagning
    const deleteButton = document.createElement('button');
    deleteButton.className = "cursor-pointer text-sm bg-red-500 text-white px-2 mx-2 rounded";
    deleteButton.textContent = 'Remove';
    deleteButton.addEventListener('click', () => handleDeleteAttempt(todo));

    listItem.appendChild(toggleButton);
    listItem.appendChild(deleteButton);
    todoList.appendChild(listItem);
  });
}

// Skickar en ny todo till API:et och uppdaterar listan
async function addTodo(todoText) {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ title: todoText })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const newTodo = await response.json();
    fetchTodos();
  } catch (error) {
    console.error('Could not add todo:', error);
  }
}

// Tar bort en todo baserat på en todos id
async function deleteTodo(id) {
  try {
    const response = await fetch(`https://js1-todo-api.vercel.app/api/todos/${id}?apikey=84e78461-7f5f-4914-88ed-4422093ba6a1`, {
      method: 'DELETE'
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    fetchTodos(); // Laddar om todos efter borttagning
  } catch (error) {
    console.error('Could not remove todo:', error);
  }
}

// Funktion för att klarmarkera eller avmarkera en todo
async function toggleTodoStatus(id, isCompleted) {
  try {
    const response = await fetch(`https://js1-todo-api.vercel.app/api/todos/${id}?apikey=84e78461-7f5f-4914-88ed-4422093ba6a1`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ completed: isCompleted }) // Uppdaterar status
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    fetchTodos(); // Laddar om listan med uppdaterade statusar
  } catch (error) {
    console.error('Could not update todo status:', error);
  }
}

// Funktion för att hantera försök att ta bort en ej klarmarkerad todo
function handleDeleteAttempt(todo) {
  if (!todo.completed) {
    showModal('You cannot delete a todo that is not marked as done.');
    return;
  }

  deleteTodo(todo._id);
}

// Funktion för att visa en modal vid försök av borttagning av en ej klarmarkerad todo
function showModal(message) {
  const modal = document.getElementById('modal');
  const modalMessage = document.getElementById('modalMessage');

  modalMessage.textContent = message;
  modal.classList.remove('hidden'); // Visa modalen

  // Stäng modalen
  const closeModal = document.getElementById('closeModal');
  closeModal.addEventListener('click', () => {
    modal.classList.add('hidden'); // Dölj modalen
  });
}

// Eventlistener för att lägga till nya todos
document.getElementById('todoForm').addEventListener('submit', function(event) {
  event.preventDefault();

  const todoInput = document.getElementById('todoInput');
  const errorMessage = document.getElementById('errorMessage');

  // Validerar input
  if (todoInput.value.trim() === '') {
    errorMessage.textContent = 'Please, write a todo.';
    errorMessage.classList.add('visible');
    return;
  }

  errorMessage.textContent = '';
  errorMessage.classList.remove('visible');
  addTodo(todoInput.value.trim());
  todoInput.value = '';
});

document.addEventListener('DOMContentLoaded', fetchTodos);
