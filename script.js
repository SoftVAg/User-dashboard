const tableBody = document.querySelector('#postsTable tbody');
const searchInput = document.getElementById('searchInput');
const headers = document.querySelectorAll('.sortable');

let postsData = [];
let filteredPosts = [];
let currentSort = { column: '', order: 'asc' };

// Fetch posts
fetch('https://jsonplaceholder.typicode.com/posts')
  .then(res => res.json())
  .then(data => {
    postsData = data;
    filteredPosts = data;
    renderTable(filteredPosts);
  })

function renderTable(posts) {
  tableBody.innerHTML = '';

  posts.forEach(post => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${post.id}</td>
      <td>${post.title}</td>
      <td>${post.body}</td>
      <td>${post.userId}</td>
    `;
    tableBody.appendChild(row);
  });
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

  if (currentSort.column !== '') {
    sortPosts(currentSort.column);
  } else {
    renderTable(filteredPosts);
  }
});

