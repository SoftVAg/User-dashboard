const tableBody = document.querySelector('#postsTable tbody');
const searchInput = document.getElementById('searchInput');
const headers = document.querySelectorAll('.sortable');

const prevButton = document.getElementById('prevPage');
const nextButton = document.getElementById('nextPage');
const pageNumbersContainer = document.getElementById('pageNumbers');

let postsData = [];
let filteredPosts = [];
let currentSort = { column: '', order: 'asc' };

let currentPage = 1;
let postsPerPage = 10;


fetch('https://jsonplaceholder.typicode.com/posts')
  .then(res => res.json())
  .then(data => {
    postsData = data;
    filteredPosts = data;
    showTable();
    showPagination();
  });


function showTable() {
  tableBody.innerHTML = "";

  const start = (currentPage - 1) * postsPerPage;
  const end = start + postsPerPage;
  const pageData = filteredPosts.slice(start, end);

  for (let i = 0; i < pageData.length; i++) {
    const post = pageData[i];
    const row = document.createElement('tr');

    row.innerHTML = `
      <td>${post.id}</td>
      <td>${post.title}</td>
      <td>${post.body}</td>
      <td>${post.userId}</td>
    `;

    tableBody.appendChild(row);
  }
}


function showPagination() {
  pageNumbersContainer.innerHTML = "";

  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);

  // Show page numbers
  for (let i = 1; i <= totalPages; i++) {
    const btn = document.createElement('button');
    btn.textContent = i;

    if (i === currentPage) {
      btn.style.fontWeight = 'bold';
      btn.style.backgroundColor = '#ddd';
    }

    btn.addEventListener('click', function () {
      currentPage = i;
      showTable();
      showPagination();
    });

    pageNumbersContainer.appendChild(btn);
  }

  
  prevButton.disabled = currentPage === 1;
  nextButton.disabled = currentPage === totalPages;
}

prevButton.addEventListener('click', function () {
  if (currentPage > 1) {
    currentPage--;
    showTable();
    showPagination();
  }
});

nextButton.addEventListener('click', function () {
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
  if (currentPage < totalPages) {
    currentPage++;
    showTable();
    showPagination();
  }
});

searchInput.addEventListener('input', function () {
  const term = searchInput.value.toLowerCase();
  filteredPosts = [];

  for (let i = 0; i < postsData.length; i++) {
    const post = postsData[i];
    const title = post.title.toLowerCase();
    const body = post.body.toLowerCase();

    if (title.includes(term) || body.includes(term)) {
      filteredPosts.push(post);
    }
  }

  currentPage = 1;

  if (currentSort.column !== '') {
    sortPosts(currentSort.column);
  } else {
    showTable();
    showPagination();
  }
});

for (let i = 0; i < headers.length; i++) {
  const header = headers[i];

  header.addEventListener('click', function () {
    const column = this.dataset.column;

    if (currentSort.column === column) {
      currentSort.order = currentSort.order === 'asc' ? 'desc' : 'asc';
    } else {
      currentSort.column = column;
      currentSort.order = 'asc';
    }

    for (let j = 0; j < headers.length; j++) {
      headers[j].classList.remove('active-asc', 'active-desc');
    }

    if (currentSort.order === 'asc') {
      this.classList.add('active-asc');
    } else {
      this.classList.add('active-desc');
    }

    sortPosts(column);
  });
}

function sortPosts(column) {
  filteredPosts.sort(function (a, b) {
    let valA = a[column];
    let valB = b[column];

    if (typeof valA === 'string') {
      return currentSort.order === 'asc'
        ? valA.localeCompare(valB)
        : valB.localeCompare(valA);
    } else {
      return currentSort.order === 'asc' ? valA - valB : valB - valA;
    }
  });

  showTable();
  showPagination();
}
