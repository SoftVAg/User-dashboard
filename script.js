const tableBody = document.querySelector('#postsTable tbody');
const searchInput = document.getElementById('searchInput');
const headers = document.querySelectorAll('.sortable');

const prevButton = document.getElementById('prevPage');
const nextButton = document.getElementById('nextPage');
const pageInfo = document.getElementById('pageInfo');

let postsData = [];
let filteredPosts = [];
let currentSort = { column: '', order: 'asc' };

let postsPerPage = 10;
let currentPage = 1;

fetch('https://jsonplaceholder.typicode.com/posts')
  .then(res => res.json())
  .then(data => {
    postsData = data;
    filteredPosts = data;
    renderTable();
    updatePaginationButtons();
  })
  .catch(err => console.error('Error:', err));

function renderTable() {
  tableBody.innerHTML = '';

  const startIndex = (currentPage - 1) * postsPerPage;
  const endIndex = startIndex + postsPerPage;
  const postsToDisplay = filteredPosts.slice(startIndex, endIndex);

  postsToDisplay.forEach(post => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${post.id}</td>
      <td>${post.title}</td>
      <td>${post.body}</td>
      <td>${post.userId}</td>
    `;
    tableBody.appendChild(row);
  });

  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
  pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;
}

function updatePaginationButtons() {
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
  prevButton.disabled = currentPage === 1;
  nextButton.disabled = currentPage === totalPages || totalPages === 0;
}

searchInput.addEventListener('input', function () {
  let searchTerm = searchInput.value.toLowerCase();
  let matches = [];

  for (let i = 0; i < postsData.length; i++) {
    let post = postsData[i];
    let title = post.title.toLowerCase();
    let body = post.body.toLowerCase();

    if (title.includes(searchTerm) || body.includes(searchTerm)) {
      matches.push(post);
    }
  }

  filteredPosts = matches;
  currentPage = 1;

  if (currentSort.column !== '') {
    sortPosts(currentSort.column);
  } else {
    renderTable();
    updatePaginationButtons();
  }
});

for (var i = 0; i < headers.length; i++) {
  var header = headers[i];

  header.addEventListener('click', function () {
    var columnName = this.dataset.column;

    if (currentSort.column === columnName) {
      currentSort.order = currentSort.order === 'asc' ? 'desc' : 'asc';
    } else {
      currentSort.column = columnName;
      currentSort.order = 'asc';
    }

    for (var j = 0; j < headers.length; j++) {
      headers[j].classList.remove('active-asc', 'active-desc');
    }

    if (currentSort.order === 'asc') {
      this.classList.add('active-asc');
    } else {
      this.classList.add('active-desc');
    }

    sortPosts(columnName);
  });
}

function sortPosts(column) {
  filteredPosts.sort((a, b) => {
    const valA = a[column];
    const valB = b[column];

    if (typeof valA === 'string') {
      return currentSort.order === 'asc'
        ? valA.localeCompare(valB)
        : valB.localeCompare(valA);
    }

    return currentSort.order === 'asc' ? valA - valB : valB - valA;
  });

  renderTable();
  updatePaginationButtons();
}

prevButton.addEventListener('click', function () {
  if (currentPage > 1) {
    currentPage--;
    renderTable();
    updatePaginationButtons();
  }
});

nextButton.addEventListener('click', function () {
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
  if (currentPage < totalPages) {
    currentPage++;
    renderTable();
    updatePaginationButtons();
  }
});
