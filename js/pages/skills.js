(() => {
  // Page 04 — Kỹ năng
  const motion = window.AppMotion || {
    reduced: true,
    enter: () => null,
    swap: (container, update) => update()
  };

  // Skill stack
  const skillData={
   problem:{label:'01 — Đặt đúng vấn đề',title:'Biết mình đang giải quyết điều gì.',body:'Trước khi hỏi AI, người sáng tạo cần xác định vấn đề, người xem, mục tiêu và tiêu chí của một kết quả tốt.',points:['Vấn đề là gì?','Dành cho ai?','Điều gì cần thay đổi?','Kết quả tốt trông như thế nào?']},
   direction:{label:'02 — Định hướng sáng tạo',title:'Biết sản phẩm phải hướng tới đâu.',body:'Định hướng sáng tạo xác định ý tưởng, cảm xúc, phong cách, thông điệp, giới hạn và tiêu chuẩn chất lượng trước khi tạo hàng loạt phương án.',points:['Ý tưởng','Cảm xúc','Phong cách','Tiêu chuẩn chất lượng']},
   taste:{label:'03 — Gu thẩm mỹ',title:'Biết cái gì đáng giữ lại.',body:'Khi phương án trở nên dư thừa, lợi thế chuyển sang khả năng so sánh, phát hiện cliché, nhận ra điểm không nhất quán và biết khi nào phải dừng.',points:['So sánh','Phát hiện cliché','Nhận ra inconsistency','Biết khi nào nên dừng']},
   critical:{label:'04 — Tư duy phản biện',title:'Biết khi nào không nên tin AI.',body:'Một câu trả lời trôi chảy không đồng nghĩa chính xác. Người sáng tạo cần kiểm tra nguồn, bối cảnh, bias và trách nhiệm trước khi sử dụng đầu ra.',points:['Nguồn ở đâu?','Có chính xác không?','Có thiên lệch không?','Ai chịu trách nhiệm nếu sai?']},
   voice:{label:'05 — Góc nhìn & tiếng nói riêng',title:'Công cụ có thể giống nhau. Góc nhìn thì không.',body:'Tiếng nói riêng đến từ trải nghiệm, quan sát, văn hóa, lựa chọn và cách nhìn thế giới — những thứ giúp một sản phẩm vượt khỏi việc chỉ “trông ổn”.',points:['Trải nghiệm','Quan sát','Văn hóa','Cách nhìn thế giới']}
  };
  const skillButtons = [...document.querySelectorAll('[data-skill-key]')];
  const skillDetail = document.querySelector('[data-skill-detail]');
  skillButtons.forEach(button => button.addEventListener('click', () => {
    const data = skillData[button.dataset.skillKey];
    if (!data || !skillDetail || button.getAttribute('aria-pressed') === 'true') return;

    skillButtons.forEach(candidate => candidate.setAttribute('aria-pressed', String(candidate === button)));
    motion.swap(skillDetail, () => {
      skillDetail.innerHTML = `<div class="skill-detail-label">${data.label}</div><h3>${data.title}</h3><p>${data.body}</p><ul>${data.points.map(point => `<li>${point}</li>`).join('')}</ul>`;
    }, { y: 0, outDuration: 80, inDuration: 220 });
  }));
})();
