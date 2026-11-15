document.addEventListener("DOMContentLoaded", () => {
  /* ---------- 스크롤 등장 (기존 코드) ---------- */
  document.querySelectorAll(".con03-list li").forEach((li, i) => {
    li.style.setProperty("--delay", `${0.5 + i * 0.15}s`);
  });

  const con03Observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          con03Observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.2 },
  );
  document
    .querySelectorAll(".con03")
    .forEach((el) => con03Observer.observe(el));

  /* ---------- 모바일 드래그 슬라이드 ---------- */
  const list = document.querySelector(".con03-list");
  if (!list) return;
  const cards = list.querySelectorAll("li");
  const mq = window.matchMedia("(max-width: 600px)");

  let index = 0;
  let startX = 0;
  let moveX = 0;
  let dragging = false;

  // 점(dots) 만들기
  const dots = document.createElement("div");
  dots.className = "con03-dots";
  cards.forEach((_, i) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.setAttribute("aria-label", `${i + 1}번째 카드`);
    btn.addEventListener("click", () => goTo(i));
    dots.appendChild(btn);
  });
  list.after(dots);
  const dotBtns = dots.querySelectorAll("button");

  // 카드 한 칸의 이동 거리 (카드 너비 + gap)
  function step() {
    return cards.length > 1
      ? cards[1].offsetLeft - cards[0].offsetLeft
      : list.offsetWidth;
  }

  function setX(x) {
    list.style.transform = `translateX(${x}px)`;
  }

  function goTo(i) {
    index = Math.max(0, Math.min(i, cards.length - 1));
    if (mq.matches) setX(-index * step());
    dotBtns.forEach((b, n) => b.classList.toggle("on", n === index));
  }

  list.addEventListener("pointerdown", (e) => {
    if (!mq.matches) return;
    dragging = true;
    startX = e.clientX;
    moveX = 0;
    list.classList.add("is-dragging");
    list.setPointerCapture(e.pointerId);
  });

  list.addEventListener("pointermove", (e) => {
    if (!dragging) return;
    moveX = e.clientX - startX;
    // 첫 장/마지막 장에서는 덜 끌리게(저항감)
    const atEdge =
      (index === 0 && moveX > 0) || (index === cards.length - 1 && moveX < 0);
    if (atEdge) moveX *= 0.3;
    setX(-index * step() + moveX);
  });

  function endDrag() {
    if (!dragging) return;
    dragging = false;
    list.classList.remove("is-dragging");
    const limit = step() * 0.2; // 카드 폭의 20% 이상 밀면 넘어감
    if (moveX < -limit) goTo(index + 1);
    else if (moveX > limit) goTo(index - 1);
    else goTo(index); // 덜 밀었으면 제자리로
  }
  list.addEventListener("pointerup", endDrag);
  list.addEventListener("pointercancel", endDrag); // 세로 스크롤로 바뀌었을 때

  // PC ↔ 모바일 전환 시 위치 정리
  mq.addEventListener("change", () => {
    if (mq.matches) goTo(index);
    else list.style.transform = "";
  });
  window.addEventListener("resize", () => {
    if (mq.matches) goTo(index);
  });

  goTo(0);
});
