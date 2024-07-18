document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    if (token) {
        document.getElementById('auth').style.display = 'none';
        document.getElementById('notes-section').style.display = 'block';
        fetchNotes();
    }

    document.getElementById('register').addEventListener('click', async () => {
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const response = await fetch('/api/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });
        const data = await response.json();
        localStorage.setItem('token', data.token);
        document.getElementById('auth').style.display = 'none';
        document.getElementById('notes-section').style.display = 'block';
    });

    document.getElementById('login').addEventListener('click', async () => {
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });
        const data = await response.json();
        localStorage.setItem('token', data.token);
        document.getElementById('auth').style.display = 'none';
        document.getElementById('notes-section').style.display = 'block';
        fetchNotes();
    });

    document.getElementById('create-note').addEventListener('click', () => {
        const title = prompt('Note title');
        const content = prompt('Note content');
        createNote({ title, content });
    });

    document.getElementById('search').addEventListener('input', (event) => {
        const query = event.target.value.toLowerCase();
        const notes = document.querySelectorAll('.note');
        notes.forEach(note => {
            const title = note.querySelector('.note-title').textContent.toLowerCase();
            const content = note.querySelector('.note-content').textContent.toLowerCase();
            if (title.includes(query) || content.includes(query)) {
                note.style.display = 'block';
            } else {
                note.style.display = 'none';
            }
        });
    });
});

async function fetchNotes() {
    const token = localStorage.getItem('token');
    const response = await fetch('/api/notes', {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    const notes = await response.json();
    const notesContainer = document.getElementById('notes');
    notesContainer.innerHTML = '';
    notes.forEach(note => {
        const noteElement = document.createElement('div');
        noteElement.classList.add('note');
        noteElement.innerHTML = `
            <h2 class="note-title">${note.title}</h2>
            <p class="note-content">${note.content}</p>
        `;
        notesContainer.appendChild(noteElement);
    });
}

async function createNote(note) {
    const token = localStorage.getItem('token');
    await fetch('/api/notes', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(note)
    });
    fetchNotes();
}
console.log("Hi")