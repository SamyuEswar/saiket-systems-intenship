// =========================================
// TASK 5 — To-Do List App
// Saiket Systems | HTML + CSS + JavaScript
// =========================================

// ── STATE ─────────────────────────────────
// Read tasks from localStorage; handle old tasks that might not have a 'deleted' property
let tasks       = JSON.parse(localStorage.getItem('ss-tasks-v2') || '[]');
let filter      = 'all';      // 'all' | 'active' | 'completed' | 'deleted'
let searchQuery = '';
let editingId   = null;

// Migrate old data if any (from old localStorage key)
if (tasks.length === 0) {
  const oldTasks = JSON.parse(localStorage.getItem('ss-tasks') || '[]');
  if (oldTasks.length > 0) {
    tasks = oldTasks.map(t => ({ ...t, deleted: false }));
    save();
  }
}

// ── DOM REFS ──────────────────────────────
const taskInput      = document.getElementById('task-input');
const addBtn         = document.getElementById('add-btn');
const taskList       = document.getElementById('task-list');
const statChips      = document.querySelectorAll('.stat-chip');
const searchInput    = document.getElementById('search-input');
const sortSelect     = document.getElementById('sort-select');
const clearBtn       = document.getElementById('clear-done-btn');

// Stats
const statTotal    = document.getElementById('stat-total');
const statActive   = document.getElementById('stat-active');
const statDone     = document.getElementById('stat-done');
const statDeleted  = document.getElementById('stat-deleted');

// ── SAVE TO LOCALSTORAGE ──────────────────
function save() {
  localStorage.setItem('ss-tasks-v2', JSON.stringify(tasks));
}

// ── GENERATE ID ───────────────────────────
function genId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

// ── FORMAT DATE ───────────────────────────
function formatDate(ts) {
  return new Date(ts).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'
  });
}

// ── ADD TASK ──────────────────────────────
function addTask() {
  const text     = taskInput.value.trim();
  const priority = document.getElementById('priority-select').value;
  const category = document.getElementById('category-select').value;

  if (!text) {
    // Shake the input if empty
    taskInput.style.borderColor = 'var(--red)';
    taskInput.focus();
    setTimeout(() => { taskInput.style.borderColor = ''; }, 1200);
    return;
  }

  const task = {
    id:        genId(),
    text,
    priority,
    category,
    completed: false,
    deleted:   false,
    createdAt: Date.now()
  };

  tasks.unshift(task);
  save();
  taskInput.value = '';
  taskInput.focus();

  // If user is currently looking at 'deleted' view, switch to 'all' so they see the new task
  if (filter === 'deleted') {
    setFilter('all');
  } else {
    render();
  }
}

// ── TOGGLE COMPLETE ───────────────────────
function toggleComplete(id) {
  const task = tasks.find(t => t.id === id);
  if (task) {
    task.completed = !task.completed;
    save();
    render();
  }
}

// ── START EDIT ────────────────────────────
function startEdit(id) {
  editingId = id;
  render();

  // Focus on the edit input after render
  const input = document.getElementById(`edit-${id}`);
  if (input) {
    input.focus();
    input.setSelectionRange(input.value.length, input.value.length);
  }
}

// ── SAVE EDIT ─────────────────────────────
function saveEdit(id) {
  const input = document.getElementById(`edit-${id}`);
  if (!input) return;

  const newText = input.value.trim();
  if (!newText) return; // don't save empty

  const task = tasks.find(t => t.id === id);
  if (task) {
    task.text = newText;
    save();
  }

  editingId = null;
  render();
}

// ── SOFT DELETE TASK ──────────────────────
function deleteTask(id) {
  const item = document.querySelector(`[data-id="${id}"]`);

  if (item) {
    item.classList.add('removing');
    setTimeout(() => {
      const task = tasks.find(t => t.id === id);
      if (task) task.deleted = true;
      save();
      render();
    }, 300);
  }
}

// ── RESTORE DELETED TASK ──────────────────
function restoreTask(id) {
  const item = document.querySelector(`[data-id="${id}"]`);

  if (item) {
    item.classList.add('removing');
    setTimeout(() => {
      const task = tasks.find(t => t.id === id);
      if (task) task.deleted = false;
      save();
      render();
    }, 300);
  }
}

// ── PERMANENTLY DELETE TASK ───────────────
function hardDeleteTask(id) {
  const item = document.querySelector(`[data-id="${id}"]`);

  if (item) {
    item.classList.add('removing');
    setTimeout(() => {
      tasks = tasks.filter(t => t.id !== id);
      save();
      render();
    }, 300);
  }
}

// ── CLEAR BUTTON ACTION ───────────────────
function handleClearBtn() {
  if (filter === 'deleted') {
    // Permanent empty trash
    tasks = tasks.filter(t => !t.deleted);
  } else {
    // Soft delete all completed
    tasks.forEach(t => {
      if (t.completed && !t.deleted) {
        t.deleted = true;
      }
    });
  }
  save();
  render();
}

// ── FILTER ────────────────────────────────
function setFilter(f) {
  filter = f;
  statChips.forEach(chip => {
    const isSelected = chip.dataset.filter === f;
    chip.classList.toggle('selected', isSelected);
    chip.setAttribute('aria-pressed', isSelected);
  });
  render();
}

// ── GET VISIBLE TASKS ─────────────────────
function getVisibleTasks() {
  let visible = [...tasks];

  // Base filter by deleted state
  if (filter === 'deleted') {
    visible = visible.filter(t => t.deleted);
  } else {
    visible = visible.filter(t => !t.deleted);
    // Sub-filters for non-deleted tasks
    if (filter === 'active')    visible = visible.filter(t => !t.completed);
    if (filter === 'completed') visible = visible.filter(t => t.completed);
  }

  // Search
  if (searchQuery) {
    const q = searchQuery.toLowerCase();
    visible = visible.filter(t => t.text.toLowerCase().includes(q));
  }

  // Sort
  const sort = sortSelect.value;
  if (sort === 'oldest')   visible.sort((a,b) => a.createdAt - b.createdAt);
  if (sort === 'alpha')    visible.sort((a,b) => a.text.localeCompare(b.text));
  if (sort === 'priority') {
    const order = { high: 0, medium: 1, low: 2 };
    visible.sort((a,b) => order[a.priority] - order[b.priority]);
  } else if (sort === 'newest') {
    visible.sort((a,b) => b.createdAt - a.createdAt); // Make newest default correctly sorted
  }

  return visible;
}

// ── BUILD TASK HTML ───────────────────────
function buildTaskHTML(task) {
  const isEditing   = editingId === task.id;
  const priorityMap = { high: '🔴 High', medium: '🟡 Medium', low: '🟢 Low' };
  const isDeleted   = task.deleted;

  return `
    <li
      class="task-item ${task.completed ? 'completed' : ''}"
      data-id="${task.id}"
      data-priority="${task.priority}"
      id="task-${task.id}"
    >
      <!-- Checkbox (disabled in deleted view) -->
      <button
        class="task-check"
        onclick="toggleComplete('${task.id}')"
        aria-label="${task.completed ? 'Mark as incomplete' : 'Mark as complete'}"
        title="${task.completed ? 'Unmark' : 'Mark done'}"
        ${isDeleted ? 'disabled style="opacity:0.5;cursor:not-allowed"' : ''}
      >${task.completed ? '✓' : ''}</button>

      <!-- Body -->
      <div class="task-body">
        ${isEditing && !isDeleted
          ? `<input
               class="task-edit-input"
               id="edit-${task.id}"
               value="${task.text.replace(/"/g, '&quot;')}"
               onkeydown="if(event.key==='Enter') saveEdit('${task.id}'); if(event.key==='Escape'){ editingId=null; render(); }"
             />`
          : `<p class="task-text" ${isDeleted ? 'style="color: var(--text-3);"' : ''}>${escapeHTML(task.text)}</p>`
        }
        <div class="task-meta">
          <span class="task-category-badge">${task.category}</span>
          <span class="priority-badge ${task.priority}">${priorityMap[task.priority]}</span>
          <span class="task-date">${formatDate(task.createdAt)}</span>
        </div>
      </div>

      <!-- Actions -->
      <div class="task-actions">
        ${isDeleted
          ? `
            <button class="icon-btn save" onclick="restoreTask('${task.id}')" title="Restore Task">♻️</button>
            <button class="icon-btn delete" onclick="hardDeleteTask('${task.id}')" title="Permanently Delete">🔥</button>
            `
          : `
            ${isEditing
              ? `<button class="icon-btn save" onclick="saveEdit('${task.id}')" title="Save">💾</button>`
              : `<button class="icon-btn edit" onclick="startEdit('${task.id}')" title="Edit" ${task.completed ? 'disabled style="opacity:0.5;cursor:not-allowed"' : ''}>✏️</button>`
            }
            <button class="icon-btn delete" onclick="deleteTask('${task.id}')" title="Delete">🗑️</button>
            `
        }
      </div>
    </li>
  `;
}

// ── ESCAPE HTML ───────────────────────────
function escapeHTML(str) {
  const d = document.createElement('div');
  d.textContent = str;
  return d.innerHTML;
}

// ── UPDATE STATS ──────────────────────────
function updateStats() {
  const nonDeletedTasks = tasks.filter(t => !t.deleted);
  const total     = nonDeletedTasks.length;
  const completed = nonDeletedTasks.filter(t => t.completed).length;
  const active    = total - completed;
  const deleted   = tasks.filter(t => t.deleted).length;

  statTotal.textContent   = total;
  statActive.textContent  = active;
  statDone.textContent    = completed;
  statDeleted.textContent = deleted;

  // Update clear button context based on filter
  if (filter === 'deleted') {
    clearBtn.innerHTML = '🔥 Empty Trash (Permanent)';
    clearBtn.style.display = deleted > 0 ? 'block' : 'none';
  } else {
    clearBtn.innerHTML = '🗑️ Clear Completed Tasks';
    clearBtn.style.display = completed > 0 ? 'block' : 'none';
  }
}

// ── RENDER ────────────────────────────────
function render() {
  const visible = getVisibleTasks();
  updateStats();

  if (visible.length === 0) {
    const msgs = {
      all:       { icon: '📝', title: 'No tasks yet!', sub: 'Start organizing your day by adding a task.' },
      active:    { icon: '✨', title: 'All caught up!',     sub: 'You have no active tasks.' },
      completed: { icon: '🌱', title: 'Nothing completed yet.', sub: 'Check off a task to see it here.' },
      deleted:   { icon: '🗑️', title: 'Trash is empty.', sub: 'Deleted tasks will appear here.' }
    };
    const m = msgs[filter] || msgs.all;

    taskList.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">${m.icon}</div>
        <h3>${m.title}</h3>
        <p>${m.sub}</p>
      </div>
    `;
    return;
  }

  taskList.innerHTML = visible.map(buildTaskHTML).join('');
}

// ── EVENT LISTENERS ───────────────────────

// Add button
addBtn.addEventListener('click', addTask);

// Enter key in input
taskInput.addEventListener('keydown', e => {
  if (e.key === 'Enter') addTask();
});

// Stat Chips (Filters)
statChips.forEach(chip => {
  chip.addEventListener('click', () => setFilter(chip.dataset.filter));
  // Keyboard accessibility
  chip.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setFilter(chip.dataset.filter);
    }
  });
});

// Search
searchInput.addEventListener('input', e => {
  searchQuery = e.target.value;
  render();
});

// Sort
sortSelect.addEventListener('change', render);

// Clear completed / Empty trash
clearBtn.addEventListener('click', handleClearBtn);

// ── INITIAL RENDER ────────────────────────
render();
