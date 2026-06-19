(function () {
  function ready(callback) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', callback);
    } else {
      callback();
    }
  }

  function escapeHtml(value) {
    return String(value || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  ready(function () {
    var input = document.querySelector('[data-search-input]');
    var results = document.querySelector('[data-search-results]');
    var total = document.querySelector('[data-search-total]');
    var data = window.__MOVIE_SEARCH_DATA__ || [];
    var params = new URLSearchParams(window.location.search);
    var initialKeyword = params.get('q');

    if (initialKeyword) {
      input.value = initialKeyword;
    }

    if (!input || !results) {
      return;
    }

    function render(list) {
      results.innerHTML = list.slice(0, 80).map(function (item) {
        return [
          '<article class="list-card">',
          '  <a class="card-poster" href="' + escapeHtml(item.url) + '" data-fallback="' + escapeHtml(item.title) + '">',
          '    <img src="' + escapeHtml(item.cover) + '" alt="' + escapeHtml(item.title) + '" loading="lazy" onerror="this.classList.add(\'is-missing\')">',
          '  </a>',
          '  <div>',
          '    <h3 class="card-title"><a href="' + escapeHtml(item.url) + '">' + escapeHtml(item.title) + '</a></h3>',
          '    <p class="card-line">' + escapeHtml(item.one_line) + '</p>',
          '    <div class="card-meta">',
          '      <span>' + escapeHtml(item.year) + '</span>',
          '      <span>' + escapeHtml(item.region) + '</span>',
          '      <span>' + escapeHtml(item.type) + '</span>',
          '      <span>' + escapeHtml(item.category) + '</span>',
          '    </div>',
          '  </div>',
          '  <div class="list-rank">' + escapeHtml(item.hot_score) + '</div>',
          '</article>'
        ].join('\n');
      }).join('\n');

      if (!list.length) {
        results.innerHTML = '<div class="empty-state">没有找到匹配的影片，请更换关键词。</div>';
      }

      if (total) {
        total.textContent = String(list.length);
      }
    }

    function search() {
      var keyword = input.value.trim().toLowerCase();
      var list = data;

      if (keyword) {
        list = data.filter(function (item) {
          return [item.title, item.year, item.region, item.type, item.genre, item.tags, item.one_line, item.category]
            .join(' ')
            .toLowerCase()
            .indexOf(keyword) !== -1;
        });
      }

      render(list);
    }

    input.addEventListener('input', search);
    search();
  });
})();
