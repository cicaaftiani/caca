const books = [];
const RENDER_EVENT = 'render-book';
const SAVE_EVENT = 'save-book';
const BOOK_STORAGE_KEY = 'BOOK_STORAGE';

function generateId() {
    return +new Date();
}

function findBook(bookId) {
    for (const book of books) {
        if (book.id === bookId) {
            return book;
        }
    }
    return null;
}

function findBookIndex(bookId) {
    for (let i = 0; i < books.length; i++) {
        if (books[i].id === bookId) {
            return i;
        }
    }
    return -1;
}

function isStorageExist() {
    return typeof Storage !== 'undefined';
}

function saveData() {
    if (isStorageExist()) {
        localStorage.setItem(BOOK_STORAGE_KEY, JSON.stringify(books));
        document.dispatchEvent(new Event(SAVE_EVENT));
    }
}

function loadDataFromStorage() {
    const serializedData = localStorage.getItem(BOOK_STORAGE_KEY);
    let data = JSON.parse(serializedData);
    if (data !== null) {
        books.push(...data);
    }
    document.dispatchEvent(new Event(RENDER_EVENT));
}


function makeBook(bookObject) {
    const textTitle = document.createElement('h3');
    textTitle.innerText = bookObject.title;

    const textAuthor = document.createElement('p');
    textAuthor.innerText = `Penulis: ${bookObject.author}`;

    const textYear = document.createElement('p');
    textYear.innerText = `Tahun: ${bookObject.year}`;

    const textContainer = document.createElement('article');
    textContainer.classList.add('book_item');
    textContainer.append(textTitle, textAuthor, textYear);

    const container = document.createElement('div');
    container.classList.add('action');
    textContainer.append(container);
    container.setAttribute('id', `book-${bookObject.id}`);

    if (bookObject.isCompleted) {
        const undoButton = document.createElement('button');
        undoButton.classList.add('green');
        undoButton.innerText = 'Belum selesai dibaca';
        undoButton.addEventListener('click', function () {
            undoTaskFromCompleted(bookObject.id);
        });

        const trashButton = document.createElement('button');
        trashButton.classList.add('red');
        trashButton.innerText = 'Hapus buku';
        trashButton.addEventListener('click', function () {
            removeTaskFromCompleted(bookObject.id);
        });

        textContainer.append(undoButton, trashButton);
        document.getElementById('completeBookshelfList').appendChild(textContainer);
    } else {
        const doneButton = document.createElement('button');
        doneButton.classList.add('green');
        doneButton.innerText = 'Selesai dibaca';
        doneButton.addEventListener('click', function () {
            addTaskToCompleted(bookObject.id);
        });

        const trashButton = document.createElement('button');
        trashButton.classList.add('red');
        trashButton.innerText = 'Hapus buku';
        trashButton.addEventListener('click', function () {
            removeTaskFromCompleted(bookObject.id);
        });

        textContainer.append(doneButton, trashButton);
        document.getElementById('incompleteBookshelfList').appendChild(textContainer);
    }

    return textContainer;
}

function addBook() {
    const title = document.getElementById('title').value;
    const author = document.getElementById('author').value;
    const year = parseInt(document.getElementById('year').value);
    const generatedID = generateId();

    const completedCheckbox = document.getElementById('inputIsComplete');
    const isComplete = completedCheckbox.checked;

    const bookObject = {
        id: generatedID,
        title: title,
        author: author,
        year: year,
        isCompleted: isComplete
    };

    books.push(bookObject);

    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function completeToUnfinishedBook(bookId) {
    const bookTarget = findBook(bookId);
    if (bookTarget == null) return;
    bookTarget.isCompleted = false;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function unfinishedToCompleteBook(bookId) {
    const bookTarget = findBook(bookId);
    if (bookTarget == null) return;
    bookTarget.isCompleted = true;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function removeBook(bookId) {
    const bookTargetIndex = findBookIndex(bookId);
    if (bookTargetIndex === -1) return;
    books.splice(bookTargetIndex, 1);
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

document.addEventListener('DOMContentLoaded', function () {
    const submitForm = document.getElementById('inputBookForm');
    submitForm.addEventListener('submit', function (event) {
        event.preventDefault();
        addBook();
    });

    if (isStorageExist()) {
        loadDataFromStorage();
    }
});

document.addEventListener(SAVE_EVENT, () => {
    console.log('Data berhasil disimpan.');
});

document.addEventListener(RENDER_EVENT, function () {
    const incompleteBookList = document.getElementById('incompleteBookshelfList');
    incompleteBookList.innerHTML = '';
    const completedBookList = document.getElementById('completeBookshelfList');
    completedBookList.innerHTML = '';

    for (const book of books) {
        const bookElement = makeBook(book);
        if (!book.isCompleted) {
            incompleteBookList.appendChild(bookElement);
        } else {
            completedBookList.appendChild(bookElement);
        }
    }
});
