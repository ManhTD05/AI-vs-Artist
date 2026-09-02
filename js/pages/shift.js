(() => {
  // Page 02 — Chuyển dịch
  const motion = window.AppMotion || {
    reduced: true,
    enter: () => null,
    swap: (container, update) => update()
  };

  // Shift rows — only one row stays open; CSS handles the height and content easing.
  for (const list of document.querySelectorAll('.shift-list')) {
    const items = [...list.querySelectorAll('.shift-item')];
    items.forEach(item => {
      const button = item.querySelector('.shift-trigger');
      if (!button) return;

      button.addEventListener('click', () => {
        const shouldOpen = !item.classList.contains('is-open');

        items.forEach(other => {
          other.classList.remove('is-open');
          other.querySelector('.shift-trigger')?.setAttribute('aria-expanded', 'false');
        });

        if (shouldOpen) {
          item.classList.add('is-open');
          button.setAttribute('aria-expanded', 'true');
        }
      });
    });
  }

  // Tabs with keyboard support and a composited entrance for the newly selected panel.
  for (const tabs of document.querySelectorAll('[data-tabs]')) {
    const buttons = [...tabs.querySelectorAll('[role="tab"]')];
    const panels = buttons.map(button => document.getElementById(button.getAttribute('aria-controls')));
    const stage = panels.find(Boolean)?.parentElement;

    if (stage) stage.classList.add('tab-stage');

    // Keep the tab area at the tallest panel height. Without this, switching
    // between panels of different heights can trigger browser scroll anchoring,
    // which makes the sticky header appear to jump.
    const syncStageHeight = () => {
      if (!stage || !stage.clientWidth) return;
      const width = stage.clientWidth;
      let maxHeight = 0;

      panels.filter(Boolean).forEach(panel => {
        const wasHidden = panel.hidden;
        const previousStyle = panel.getAttribute('style');

        panel.hidden = false;
        Object.assign(panel.style, {
          position: 'absolute',
          visibility: 'hidden',
          pointerEvents: 'none',
          width: `${width}px`,
          left: '0',
          top: '0'
        });

        maxHeight = Math.max(maxHeight, panel.scrollHeight);

        if (previousStyle === null) panel.removeAttribute('style');
        else panel.setAttribute('style', previousStyle);
        panel.hidden = wasHidden;
      });

      if (maxHeight) stage.style.setProperty('--tab-stage-min-height', `${Math.ceil(maxHeight)}px`);
    };

    requestAnimationFrame(syncStageHeight);
    addEventListener('load', syncStageHeight, { once: true });

    let resizeTimer = 0;
    addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(syncStageHeight, 120);
    }, { passive: true });

    const activate = (button, focus = false) => {
      const target = document.getElementById(button.getAttribute('aria-controls'));
      if (!target || button.getAttribute('aria-selected') === 'true') {
        if (focus) button.focus();
        return;
      }

      buttons.forEach((candidate, index) => {
        const active = candidate === button;
        candidate.setAttribute('aria-selected', String(active));
        candidate.tabIndex = active ? 0 : -1;
        if (panels[index]) panels[index].hidden = !active;
      });

      target.classList.remove('is-entering');
      requestAnimationFrame(() => {
        target.classList.add('is-entering');
        motion.enter(target, { y: 6, duration: 300, opacityFrom: 0 });
        syncStageHeight();
      });

      if (focus) button.focus();
    };

    buttons.forEach((button, index) => {
      button.addEventListener('click', () => activate(button));
      button.addEventListener('keydown', event => {
        let next = null;
        if (event.key === 'ArrowRight' || event.key === 'ArrowDown') next = (index + 1) % buttons.length;
        if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') next = (index - 1 + buttons.length) % buttons.length;
        if (event.key === 'Home') next = 0;
        if (event.key === 'End') next = buttons.length - 1;
        if (next !== null) {
          event.preventDefault();
          activate(buttons[next], true);
        }
      });
    });
  }

  // Human values
  const valueData={
   idea:{label:'01 — Ý tưởng lớn',title:'Biết điều gì đáng làm.',body:'AI có thể giúp phát triển một ý tưởng. Con người vẫn phải lựa chọn vấn đề, góc nhìn và câu hỏi đáng theo đuổi.'},
   taste:{label:'02 — Gu thẩm mỹ',title:'Biết điều gì thực sự tốt.',body:'Khi số lượng phương án tăng, gu thẩm mỹ trở thành bộ lọc: nhận ra cái gì chỉ ổn, cái gì có sức nặng và cái gì đáng giữ lại.'},
   edit:{label:'03 — Chọn lọc & biên tập',title:'Biết giữ cái gì và bỏ cái gì.',body:'Giá trị không nằm ở việc tạo thật nhiều phương án, mà ở khả năng chọn, loại bỏ, kết hợp và hoàn thiện chúng.'},
   story:{label:'04 — Kể chuyện',title:'Biết kết nối các phần thành một câu chuyện.',body:'Một hình ảnh, đoạn âm thanh hay đoạn văn riêng lẻ chưa tạo nên trải nghiệm. Con người quyết định nhịp điệu, mạch kể và dụng ý.'},
   meaning:{label:'05 — Tạo ý nghĩa',title:'Biết tại sao sản phẩm này đáng tồn tại.',body:'Công cụ có thể tạo ra hình thức. Con người đặt hình thức ấy vào bối cảnh bằng trải nghiệm, văn hóa, ký ức và góc nhìn.'}
  };
  const valueButtons = [...document.querySelectorAll('[data-value]')];
  const valueDisplay = document.querySelector('[data-value-display]');
  valueButtons.forEach(button => button.addEventListener('click', () => {
    const data = valueData[button.dataset.value];
    if (!data || !valueDisplay || button.getAttribute('aria-pressed') === 'true') return;

    valueButtons.forEach(candidate => candidate.setAttribute('aria-pressed', String(candidate === button)));
    valueDisplay.classList.add('is-updating');
    valueDisplay.innerHTML = `<div class="value-display-label">${data.label}</div><h3>${data.title}</h3><p>${data.body}</p>`;
    window.clearTimeout(valueDisplay._updateTimer);
    valueDisplay._updateTimer = window.setTimeout(() => valueDisplay.classList.remove('is-updating'), 180);
  }));
})();
