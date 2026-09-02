(() => {
  const NAV_ITEMS = [
    ['home', 'index.html', 'Tổng quan'],
    ['shift', 'chuyen-dich.html', 'Chuyển dịch'],
    ['impact', 'co-hoi-rui-ro.html', 'Cơ hội & Rủi ro'],
    ['skills', 'ky-nang.html', 'Kỹ năng']
  ];

  class SiteHeader extends HTMLElement {
    connectedCallback() {
      const currentPage = document.body.dataset.page;
      const links = NAV_ITEMS.map(([key, href, label]) => {
        const active = key === currentPage;
        return `<a data-nav="${key}" href="${href}"${active ? ' class="active" aria-current="page"' : ''}>${label}</a>`;
      }).join('');

      this.innerHTML = `
        <header class="site-header">
          <div class="container header-inner">
            <a class="brand" href="index.html" aria-label="Về trang tổng quan">
              <span class="brand-mark" aria-hidden="true"><i></i><i></i><i></i><i></i></span>
              <span class="brand-label">AI × SÁNG TẠO</span>
            </a>
            <nav class="site-nav" aria-label="Điều hướng chính">${links}</nav>
          </div>
        </header>`;
    }
  }

  class SiteFooter extends HTMLElement {
    connectedCallback() {
      const isHome = document.body.dataset.page === 'home';
      this.innerHTML = `
        <footer class="site-footer">
          <div class="container footer-inner">
            <span>Interactive infographic · AI & ngành sáng tạo</span>
            <span>${isHome ? 'Team Duy Mạnh, Nguyệt Ánh' : 'Đừng coi AI như kẻ thù, hãy dùng nó như công cụ'}</span>
          </div>
        </footer>`;
    }
  }

  if (!customElements.get('site-header')) customElements.define('site-header', SiteHeader);
  if (!customElements.get('site-footer')) customElements.define('site-footer', SiteFooter);
})();
