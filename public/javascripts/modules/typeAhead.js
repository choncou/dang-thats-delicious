import axios from 'axios';
import dompurify from 'dompurify';

function searchResultsHTML(stores) {
  return stores.map(store =>{
    return `
<a class="search__result" href="/store/${store.slug}">
  <strong>${store.name}</strong>
</a>
    `;
  }).join('');
}

function typeAhead(search) {
  if(!search) return;

  const searchInput = search.querySelector('input[name="search"]');
  const searchResults = search.querySelector('.search__results');

  searchInput.on('input', function() {
    if (!this.value) {
      searchResults.style.display = 'none';
      return;
    }

    searchResults.style.display = 'block';

    axios
      .get(`/api/search?q=${this.value}`)
      .then(res => {
        if (res.data.length) {
          searchResults.innerHTML = dompurify.sanitize(searchResultsHTML(res.data));
        } else {
          searchResults.innerHTML = dompurify.sanitize(`
<div class="search__result">No Results for ${this.value} found!</div>
          `);
        }
      })
      .catch(err => {
        console.error(err);
      });
  });

  // Handle arrow key movements

  searchInput.on('keyup', (e) => {
    const activeClass = 'search__result--active';
    const current = search.querySelector(`.${activeClass}`);
    const items = search.querySelectorAll('.search__result');
    let next;

    switch(e.keyCode) {
      case 40: // Pressed Down
        if (current) {
          next = current.nextElementSibling || items[0];
        } else {
          next = items[0];
        }
        break;
      case 38: // Pressed Up
        if (current) {
          next = current.previousElementSibling || items[items.length - 1];
        } else {
          next = items[items.length - 1];
        }
        break;
      case 13: // Pressed Enter
        if (current.href) window.location = current.href;
        break;
      default: //Who cares
        return;
    }

    if (current) {
      current.classList.remove(activeClass);
    }
    next.classList.add(activeClass);
  });
}

export default typeAhead;
