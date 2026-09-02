(() => {
  // Page 03 — Cơ hội & Rủi ro
  const motion = window.AppMotion || {
    reduced: true,
    enter: () => null,
    swap: (container, update) => update()
  };

  // Opportunity / risk detail
  const balanceData={
   prototype:{type:'Cơ hội',risk:false,title:'Tạo mẫu nhanh hơn',summary:'Ý tưởng có thể trở thành một bản thử sớm hơn, trước khi tốn nhiều thời gian cho sản xuất hoàn chỉnh.',points:['Tạo bản thử để kiểm tra concept sớm.','Nhận phản hồi trước khi đầu tư nhiều nguồn lực.','Dành thêm thời gian cho các vòng chỉnh sửa.']},
   explore:{type:'Cơ hội',risk:false,title:'Thử nhiều hướng hơn',summary:'Khi chi phí tạo bản thử giảm, người sáng tạo có thể khám phá nhiều hướng trước khi chốt một phương án.',points:['So sánh nhiều cách tiếp cận.','Phát hiện sớm hướng yếu hoặc quá quen thuộc.','Dùng chuyên môn để chọn hướng đáng phát triển.'],source:{name:'OECD · 2025',text:'OECD tổng hợp nhiều nghiên cứu cho thấy GenAI có thể hỗ trợ hình thành ý tưởng và năng suất ở một số nhiệm vụ, nhưng kết quả phụ thuộc vào loại công việc và kinh nghiệm người dùng.',url:'https://www.oecd.org/en/publications/the-effects-of-generative-ai-on-productivity-innovation-and-entrepreneurship_b21df222-en.html'}},
   personalize:{type:'Cơ hội',risk:false,title:'Điều chỉnh nội dung linh hoạt hơn',summary:'Một ý tưởng có thể được chuyển đổi cho nhiều định dạng, ngôn ngữ hoặc nhóm người xem nhanh hơn.',points:['Điều chỉnh format theo nền tảng.','Tạo bản nháp cho nhiều ngữ cảnh.','Cần giữ thông điệp và bản sắc nhất quán.']},
   smallteam:{type:'Cơ hội',risk:false,title:'Nhóm nhỏ có thể làm nhiều việc hơn',summary:'GenAI có thể hạ rào cản ở một số công việc và giúp nhóm nhỏ tiếp cận những năng lực trước đây tốn nhiều thời gian hoặc nguồn lực.',points:['Hỗ trợ một số phần nghiên cứu, bản nháp và chỉnh sửa.','Giảm chi phí thử nghiệm ở giai đoạn sớm.','Không đồng nghĩa một người có thể thay thế toàn bộ studio.'],source:{name:'OECD · 2025',text:'OECD ghi nhận GenAI có thể hạ rào cản gia nhập và thay đổi cách tổ chức công việc, nhưng kết quả phụ thuộc vào cách công nghệ được tích hợp.',url:'https://www.oecd.org/en/publications/the-effects-of-generative-ai-on-productivity-innovation-and-entrepreneurship_b21df222-en.html'}},
   trust:{type:'Rủi ro',risk:true,title:'Sai sót dễ bị bỏ qua hơn',summary:'Đầu ra có thể mạch lạc hoặc đẹp nhưng vẫn sai dữ kiện, sai ngữ cảnh hoặc không phù hợp với mục tiêu.',points:['Thêm bước kiểm chứng trước khi xuất bản.','Đánh giá chất lượng bằng chuyên môn, không chỉ bằng vẻ ngoài.','Giữ trách nhiệm cuối cùng ở người sử dụng và tổ chức.'],source:{name:'OECD · 2025',text:'OECD nêu các thách thức liên quan tới niềm tin, chuyên môn con người và mức độ người lao động hiểu giới hạn của công cụ GenAI.',url:'https://www.oecd.org/en/publications/the-effects-of-generative-ai-on-productivity-innovation-and-entrepreneurship_b21df222-en.html'}},
   sameness:{type:'Rủi ro',risk:true,title:'Sự khác biệt trở nên khó giữ',summary:'Khi quá trình sáng tạo phụ thuộc vào cùng nền tảng, xu hướng và hệ gợi ý, bản sắc riêng cần được bảo vệ có chủ đích hơn.',points:['Không nên coi một phong cách “đẹp” là đủ.','Cần chủ động xây dựng góc nhìn và tiêu chuẩn riêng.','Đa dạng văn hóa và tiếng nói ít được nhìn thấy có thể chịu áp lực.'],source:{name:'UNESCO · 2026',text:'Re|Shaping Policies for Creativity nhấn mạnh rằng chuyển đổi số và AI đang tái cấu trúc ngành sáng tạo, đồng thời đặt ra thách thức về bất bình đẳng, quyền sở hữu trí tuệ và sự đa dạng biểu đạt văn hóa.',url:'https://www.unesco.org/en/reshaping-creativity-reports'}},
   copyright:{type:'Rủi ro',risk:true,title:'Quyền & tác giả trở nên phức tạp hơn',summary:'Không phải mọi phần do AI sinh ra đều có thể được xem là đóng góp tác giả của người dùng.',points:['Prompt đơn thuần không đủ để tạo quyền tác giả đối với phần AI sinh ra theo kết luận hiện tại của U.S. Copyright Office.','Đóng góp sáng tạo, sắp xếp hoặc chỉnh sửa của con người vẫn có thể được bảo hộ.','Nguồn dữ liệu huấn luyện và quyền sử dụng nội dung vẫn là vấn đề chính sách rộng hơn.'],source:{name:'U.S. Copyright Office · 2025',text:'Part 2 của báo cáo Copyright and Artificial Intelligence kết luận rằng output AI chỉ có thể được bảo hộ khi có đủ yếu tố biểu đạt do con người quyết định; việc chỉ cung cấp prompt không đủ.',url:'https://www.copyright.gov/newsnet/2025/1060.html'}},
   dependence:{type:'Rủi ro',risk:true,title:'Phụ thuộc công cụ',summary:'Rủi ro lớn không chỉ là “dùng AI nhiều”, mà là bỏ qua việc tự hiểu vấn đề và đánh giá giới hạn của đầu ra.',points:['Không để phương án đầu tiên của AI thành đáp án mặc định.','Giữ kỹ năng nền để biết khi nào công cụ sai hoặc không phù hợp.','Dùng AI như phần hỗ trợ của quy trình, không thay thế toàn bộ quá trình suy nghĩ.'],source:{name:'OECD · 2025',text:'OECD nhấn mạnh hiệu quả của GenAI phụ thuộc vào kinh nghiệm người dùng, loại nhiệm vụ và khả năng đánh giá đầu ra.',url:'https://www.oecd.org/en/publications/the-effects-of-generative-ai-on-productivity-innovation-and-entrepreneurship_b21df222-en.html'}}
  };
  const balanceButtons = [...document.querySelectorAll('[data-balance-key]')];
  const balanceDetail = document.querySelector('[data-balance-detail]');
  function renderBalance(key) {
    if (!balanceDetail || !balanceData[key]) return;
    const data = balanceData[key];
    balanceButtons.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.balanceKey === key)));
    balanceDetail.classList.toggle('is-risk', data.risk);

    motion.swap(balanceDetail, () => {
      balanceDetail.innerHTML = `<div class="balance-detail-type">${data.type}</div><div><h3>${data.title}</h3><p>${data.summary}</p><ul class="detail-points">${data.points.map(point => `<li>${point}</li>`).join('')}</ul>${data.source ? `<div class="evidence-note"><div class="evidence-source">${data.source.name}</div><div><p>${data.source.text}</p><a class="text-link" href="${data.source.url}" target="_blank" rel="noopener">Mở nguồn ↗</a></div></div>` : ''}</div>`;
    }, { y: 8, outDuration: 110, inDuration: 310 });
  }
  balanceButtons.forEach(button => button.addEventListener('click', () => {
    if (button.getAttribute('aria-pressed') === 'true') return;
    renderBalance(button.dataset.balanceKey);
  }));

  // Research drawer — details remains native, only its entering content is animated.
  for (const drawer of document.querySelectorAll('.research-drawer')) {
    drawer.addEventListener('toggle', () => {
      if (!drawer.open) return;
      const list = drawer.querySelector('.research-list');
      motion.enter(list, { y: -4, duration: 300, opacityFrom: 0 });
      if (!motion.reduced) {
        [...drawer.querySelectorAll('.research-item')].forEach((item, index) => {
          item.animate([
            { opacity: 0, transform: 'translate3d(0, 8px, 0)' },
            { opacity: 1, transform: 'translate3d(0, 0, 0)' }
          ], {
            duration: 300,
            delay: 30 + index * 34,
            easing: 'cubic-bezier(.22,1,.36,1)',
            fill: 'both'
          });
        });
      }
    });
  }
})();
