// --- Sidebar burger menu ---
const burger = document.getElementById('burger');
const sidebar = document.getElementById('sidebar');
burger.addEventListener('click', () => sidebar.classList.toggle('collapsed'));

// --- Panel and Todo List ---
const panelArea = document.getElementById('panel-area');
const tabSearch = document.getElementById('tab-search');
const tabFilter = document.getElementById('tab-filter');
const tabAdd = document.getElementById('tab-add');
const todoList = document.getElementById('todo-list');

let todos = [];

// --- Utility Functions ---
function hidePanel() { panelArea.innerHTML = ''; }

// --- Render Todos ---
function renderTodos(filtered = todos) {
    todoList.innerHTML = '';
    filtered.forEach((t, i) => {
        const li = document.createElement('li');

        // Header
        const header = document.createElement('div');
        header.classList.add('task-header');

        const title = document.createElement('span');
        title.textContent = t.title;
        title.classList.add('task-title', t.priority.toLowerCase());

        const btnDiv = document.createElement('div');
        const editBtn = document.createElement('button'); editBtn.textContent = 'Edit';
        editBtn.addEventListener('click', () => editTask(i));

        const delBtn = document.createElement('button'); delBtn.textContent = 'Delete';
        delBtn.style.backgroundColor = '#f44336';
        delBtn.addEventListener('click', () => { todos.splice(i, 1); renderTodos(); });

        btnDiv.appendChild(editBtn);
        btnDiv.appendChild(delBtn);
        header.appendChild(title);
        header.appendChild(btnDiv);
        li.appendChild(header);

        // Description
        const descDiv = document.createElement('div');
        descDiv.classList.add('task-desc');
        descDiv.textContent = t.desc;
        li.appendChild(descDiv);

        // Subtasks (display only)
        if(t.subtasks.length > 0){
            const subUl = document.createElement('ul');
            subUl.classList.add('subtasks');
            t.subtasks.forEach(st => {
                const subLi = document.createElement('li');
                const span = document.createElement('span'); span.textContent = st;
                subLi.appendChild(span);
                subUl.appendChild(subLi);
            });
            li.appendChild(subUl);
        }

        // Footer: deadline + tags
        const footer = document.createElement('div'); footer.classList.add('task-footer');

        const dueDiv = document.createElement('div');
        if(t.due) {
            const days = Math.ceil((new Date(t.due) - new Date()) / (1000*60*60*24));
            dueDiv.textContent = `Due in ${days} day(s)`;
            if(days <= 2) dueDiv.style.color = '#f44336';
        }
        footer.appendChild(dueDiv);

        const tagsDiv = document.createElement('div'); tagsDiv.classList.add('tags');
        t.tags.forEach(tag => {
            const btn = document.createElement('button'); btn.textContent = tag;
            tagsDiv.appendChild(btn);
        });
        footer.appendChild(tagsDiv);

        li.appendChild(footer);
        todoList.appendChild(li);
    });
}

// --- Add Task Panel ---
tabAdd.addEventListener('click', () => {
    hidePanel();
    const div = document.createElement('div'); div.classList.add('panel');

    const inputTitle = document.createElement('input'); inputTitle.type='text'; inputTitle.placeholder='Title';
    const inputDesc = document.createElement('input'); inputDesc.type='text'; inputDesc.placeholder='Description';
    const inputTags = document.createElement('input'); inputTags.type='text'; inputTags.placeholder='Tags (comma separated)';
    const inputDue = document.createElement('input'); inputDue.type='date';

    // Priority buttons
    const priorityDiv = document.createElement('div');
    let selected='Medium';
    ['Low','Medium','High'].forEach(p=>{
        const btn = document.createElement('button'); btn.textContent = p; btn.classList.add('priority-btn');
        if(p===selected) btn.classList.add('active');
        btn.addEventListener('click', ()=>{
            selected=p;
            priorityDiv.querySelectorAll('button').forEach(b=>b.classList.remove('active'));
            btn.classList.add('active');
        });
        priorityDiv.appendChild(btn);
    });

    const addBtn = document.createElement('button'); addBtn.textContent='Add Task'; addBtn.id='add-btn';
    addBtn.addEventListener('click', ()=>{
        if(!inputTitle.value.trim()) return;
        todos.push({
            title: inputTitle.value,
            desc: inputDesc.value,
            tags: inputTags.value.split(',').map(v=>v.trim()).filter(Boolean),
            priority: selected,
            due: inputDue.value||null,
            subtasks: [],
            completed: false
        });
        renderTodos();
        hidePanel();
    });

    div.appendChild(inputTitle); div.appendChild(inputDesc);
    div.appendChild(inputTags); div.appendChild(inputDue);
    div.appendChild(priorityDiv); div.appendChild(addBtn);
    panelArea.appendChild(div);
});

// --- Search Panel ---
tabSearch.addEventListener('click', ()=>{
    hidePanel();
    const div = document.createElement('div'); div.classList.add('panel');
    const input = document.createElement('input'); input.type='text'; input.placeholder='Search by title...';
    input.addEventListener('input', ()=>renderTodos(todos.filter(t=>t.title.toLowerCase().includes(input.value.toLowerCase()))));
    div.appendChild(input);
    panelArea.appendChild(div);
});

// --- Filter Panel ---
tabFilter.addEventListener('click', ()=>{
    hidePanel();
    const div = document.createElement('div'); div.classList.add('panel');
    const input = document.createElement('input'); input.type='text'; input.placeholder='Filter by tag...';
    input.addEventListener('input', ()=>renderTodos(todos.filter(t=>t.tags.includes(input.value))));
    div.appendChild(input);
    panelArea.appendChild(div);
});

// --- Edit Task Panel ---
function editTask(idx){
    const t = todos[idx];
    hidePanel();
    const div = document.createElement('div'); div.classList.add('panel');

    const inputTitle = document.createElement('input'); inputTitle.type='text'; inputTitle.value=t.title;
    const inputDesc = document.createElement('input'); inputDesc.type='text'; inputDesc.value=t.desc;
    const inputTags = document.createElement('input'); inputTags.type='text'; inputTags.value=t.tags.join(',');
    const inputDue = document.createElement('input'); inputDue.type='date'; inputDue.value=t.due||'';

    // Priority buttons
    const priorityDiv = document.createElement('div');
    let selected=t.priority;
    ['Low','Medium','High'].forEach(p=>{
        const btn=document.createElement('button'); btn.classList.add('priority-btn'); btn.textContent=p;
        if(p===selected) btn.classList.add('active');
        btn.addEventListener('click', ()=>{
            selected=p;
            priorityDiv.querySelectorAll('button').forEach(b=>b.classList.remove('active'));
            btn.classList.add('active');
        });
        priorityDiv.appendChild(btn);
    });

    // Subtasks section in edit panel
    const subDiv = document.createElement('div'); subDiv.classList.add('subtasks-panel');
    const subUl = document.createElement('ul'); subUl.classList.add('subtasks');

    function renderEditSubtasks() {
        subUl.innerHTML = '';
        t.subtasks.forEach((st,j)=>{
            const li = document.createElement('li');
            const span = document.createElement('span'); span.textContent=st;
            const delBtn = document.createElement('button'); delBtn.textContent='×';
            delBtn.addEventListener('click',()=>{ t.subtasks.splice(j,1); renderEditSubtasks(); });
            li.appendChild(span); li.appendChild(delBtn); subUl.appendChild(li);
        });
    }
    renderEditSubtasks();

    const subInput = document.createElement('input'); subInput.type='text'; subInput.placeholder='Add subtask & Enter';
    subInput.addEventListener('keypress', e=>{
        if(e.key==='Enter' && subInput.value.trim()){
            t.subtasks.push(subInput.value.trim());
            subInput.value='';
            renderEditSubtasks();
        }
    });

    subDiv.appendChild(subUl); subDiv.appendChild(subInput);

    const saveBtn=document.createElement('button'); saveBtn.textContent='Save Changes'; saveBtn.id='add-btn';
    saveBtn.addEventListener('click', ()=>{
        t.title = inputTitle.value;
        t.desc = inputDesc.value;
        t.tags = inputTags.value.split(',').map(v=>v.trim()).filter(Boolean);
        t.due = inputDue.value || null;
        t.priority = selected;
        renderTodos();
        hidePanel();
    });

    div.appendChild(inputTitle); div.appendChild(inputDesc);
    div.appendChild(inputTags); div.appendChild(inputDue);
    div.appendChild(priorityDiv); div.appendChild(subDiv);
    div.appendChild(saveBtn);
    panelArea.appendChild(div);
}

// --- Initial render ---
renderTodos();
