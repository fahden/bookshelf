const STORAGE_KEY = "BOOKS";
let books = [];
let editingBookId = null;

/* =====================
   LOCAL STORAGE
===================== */
function loadBooks() {
  const data = localStorage.getItem(STORAGE_KEY);
  if (data) {
    books = JSON.parse(data);
  }
}

function saveBooks() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(books));
}

/* =====================
   TAMBAH & EDIT BUKU
===================== */
document.getElementById("bookForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const title = document.getElementById("bookFormTitle").value;
  const author = document.getElementById("bookFormAuthor").value;
  const year = Number(document.getElementById("bookFormYear").value);
  const isComplete = document.getElementById("bookFormIsComplete").checked;

  if (editingBookId === null) {
    // MODE TAMBAH
    const book = {
      id: Number(new Date()),
      title,
      author,
      year,
      isComplete,
    };
    books.push(book);
  } else {
    // MODE EDIT
    const book = books.find(b => b.id === editingBookId);
    book.title = title;
    book.author = author;
    book.year = year;
    book.isComplete = isComplete;

    editingBookId = null;
    document.querySelector("#bookForm button").innerText = "Masukkan Buku";
  }

  saveBooks();
  renderBooks();
  this.reset();
});

/* =====================
   RENDER BUKU
===================== */
function renderBooks(keyword = "") {
  const incomplete = document.getElementById("incompleteBookList");
  const complete = document.getElementById("completeBookList");

  incomplete.innerHTML = "";
  complete.innerHTML = "";

  const filteredBooks = books.filter(book =>
  book.title.toLowerCase().includes(keyword.toLowerCase())
    );

    for (const book of filteredBooks) {

    const bookElement = document.createElement("div");

    bookElement.setAttribute("data-bookid", book.id);
    bookElement.setAttribute("data-testid", "bookItem");

    bookElement.innerHTML = `
      <h3 data-testid="bookItemTitle">${book.title}</h3>
      <p data-testid="bookItemAuthor">Penulis: ${book.author}</p>
      <p data-testid="bookItemYear">Tahun: ${book.year}</p>
      <div>
        <button data-testid="bookItemIsCompleteButton">
          ${book.isComplete ? "Belum selesai dibaca" : "Selesai dibaca"}
        </button>
        <button data-testid="bookItemDeleteButton">Hapus Buku</button>
        <button data-testid="bookItemEditButton">Edit Buku</button>
      </div>
    `;

    // pindah rak
    bookElement
      .querySelector('[data-testid="bookItemIsCompleteButton"]')
      .addEventListener("click", () => {
        book.isComplete = !book.isComplete;
        saveBooks();
        renderBooks();
      });

    // hapus buku
    bookElement
      .querySelector('[data-testid="bookItemDeleteButton"]')
      .addEventListener("click", () => {
        books = books.filter(b => b.id !== book.id);
        saveBooks();
        renderBooks();
      });

    // EDIT BUKU ✅ (INI YANG TADI SALAH POSISI)
    bookElement
      .querySelector('[data-testid="bookItemEditButton"]')
      .addEventListener("click", () => {
        document.getElementById("bookFormTitle").value = book.title;
        document.getElementById("bookFormAuthor").value = book.author;
        document.getElementById("bookFormYear").value = book.year;
        document.getElementById("bookFormIsComplete").checked = book.isComplete;

        editingBookId = book.id;
        document.querySelector("#bookForm button").innerText = "Simpan Perubahan";
      });

    // masuk ke rak
    book.isComplete
      ? complete.append(bookElement)
      : incomplete.append(bookElement);
  }
}

/* =====================
   LOAD AWAL
===================== */
loadBooks();
renderBooks();
