const q = (s) => document.querySelector(s);
const listEl = q('#list');
const input = q('#taskInput');
const addForm = q('#addForm');
const countEl = q('#count');
const emptyEl = q('#empty');
const filters = [...document.querySelectorAll('.filters button')];

let tasks = JSON.parse(localStorage.getItem('todo.tasks') || '[]');
let currentFilter = 'all';

function save() {
  localStorage.setItem('todo.tasks', JSON.stringify(tasks));
}

function render() {
  listEl.innerHTML = '';
  const filtered = tasks.filter((t) => {
    if (currentFilter === 'all') return true;
    if (currentFilter === 'active') return !t.done;
    return t.done;
  });

  emptyEl.hidden = filtered.length !== 0;

  filtered.forEach((t) => {
    const li = document.createElement('li');
    li.className = 'item';
    li.dataset.id = t.id;

    li.innerHTML = `
      <div class="content">
        <input class="chk" type="checkbox" ${t.done ? 'checked' : ''} />
        <div class="text ${t.done ? 'completed' : ''}" contenteditable="true">${t.text}</div>
      </div>

      <div class="actions">
        <button class="delete">🗑</button>
      </div>
    `;

    const chk = li.querySelector('.chk');
    const txt = li.querySelector('.text');
    const del = li.querySelector('.delete');

    chk.addEventListener('change', () => {
      t.done = chk.checked;
      save();
      render();
    });

    del.addEventListener('click', () => {
      tasks = tasks.filter((x) => x.id !== t.id);
      save();
      render();
    });

    txt.addEventListener('input', () => {
      t.text = txt.innerText.trim();
      save();
    });

    listEl.appendChild(li);
  });

  const remaining = tasks.filter((t) => !t.done).length;
  countEl.textContent = `${remaining} tasks left`;
}

addForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const val = input.value.trim();
  if (!val) return;

  tasks.push({
    id: 't_' + Date.now(),
    text: val,
    done: false,
  });

  input.value = '';
  save();
  render();
});

filters.forEach((btn) =>
  btn.addEventListener('click', () => {
    filters.forEach((b) => b.classList.remove('active'));
    btn.classList.add('active');

    currentFilter = btn.dataset.filter;
    render();
  })
);

q('#clearCompleted').addEventListener('click', () => {
  tasks = tasks.filter((t) => !t.done);
  save();
  render();
});

render();
