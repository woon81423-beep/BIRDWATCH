document.addEventListener("DOMContentLoaded", () => {
  // 타이틀은 바로, 카드는 0.5초 뒤부터 0.15초 간격으로
  document.querySelectorAll(".con03-list li").forEach((li, i) => {
    li.style.setProperty("--delay", `${0.5 + i * 0.15}s`);
  });

  // 섹션이 화면에 들어오면 is-visible 추가
  const con03Observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          con03Observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.2 }
  );

  document
    .querySelectorAll(".con03")
    .forEach((el) => con03Observer.observe(el));
});
