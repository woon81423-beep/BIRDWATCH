// =========================================
//  sub02 : FLYWAY
// =========================================

// 새로고침 시 브라우저가 이전 스크롤 위치를 복원하지 않게 함
if ("scrollRestoration" in history) history.scrollRestoration = "manual";

$(function () {
  window.scrollTo(0, 0);

  const inner = document.querySelector("#fy_visual .v_inner");
  const target1 = document.querySelector("#fy_visual .img_target"); // 파도 자리
  const target2 = document.querySelector("#fy_visual .img_target2"); // con01 사진 자리
  const target3 = document.querySelector("#fy_visual .img_target3"); // con03 첫 카드 자리
  const card2 = document.querySelector("#fy_visual .c2 .hab_img"); // 뽑혀 나올 카드
  const card3 = document.querySelector("#fy_visual .c3 .hab_img");
  const mapSvg = document.querySelector("#fy_visual .map_svg"); // con04 경로를 그릴 SVG
  const vImg = document.querySelector("#fy_visual .v_img"); // 장면마다 이동하는 사진
  const seasons = gsap.utils.toArray("#fy_visual .season"); // 봄, 여름, 가을, 겨울
  const con06 = document.querySelector("#fy_visual .v_con06");
  const flyTrack = document.querySelector("#fy_visual .fly_track");
  const flyBirds = gsap.utils.toArray("#fy_visual .fly_bird .bird");
  const flyCaps = gsap.utils.toArray("#fy_visual .fly_caps li");

  // 이 비주얼이 없는 페이지이거나 GSAP이 안 불러와졌으면 실행하지 않음
  if (
    !inner ||
    !target1 ||
    !target2 ||
    !target3 ||
    !card2 ||
    !card3 ||
    !mapSvg ||
    !vImg ||
    seasons.length < 4 ||
    !con06 ||
    !flyTrack ||
    typeof gsap === "undefined"
  )
    return;

  gsap.registerPlugin(ScrollTrigger);

  // 사진이 들어갈 자리의 위치·크기 (v_inner 기준)
  const rect = (el) => {
    const c = inner.getBoundingClientRect();
    const t = el.getBoundingClientRect();
    return {
      top: t.top - c.top,
      left: t.left - c.left,
      width: t.width,
      height: t.height,
    };
  };

  // transform(이동·회전)의 영향을 받지 않는 실제 배치 위치 (v_inner 기준)
  const pos = (el) => {
    let x = 0,
      y = 0,
      n = el;
    while (n && n !== inner) {
      x += n.offsetLeft;
      y += n.offsetTop;
      n = n.offsetParent;
    }
    return { x, y, w: el.offsetWidth, h: el.offsetHeight };
  };
  // 카드가 첫 카드 뒤(중심)에서 출발하도록 하는 거리
  const fromCard1 = (el) => {
    const a = pos(target3);
    const b = pos(el);
    return {
      x: a.x + a.w / 2 - (b.x + b.w / 2),
      y: a.y + a.h / 2 - (b.y + b.h / 2),
    };
  };

  // el이 target 중심으로 가는 거리 (사계절 카드 모으기)
  const toCenter = (el, target) => {
    const a = pos(target);
    const b = pos(el);
    return {
      x: a.x + a.w / 2 - (b.x + b.w / 2),
      y: a.y + a.h / 2 - (b.y + b.h / 2),
    };
  };

  // 카드가 마지막 카드(월동지) 중심으로 모이는 거리
  const toCard3 = (el) => {
    const a = pos(card3);
    const b = pos(el);
    return {
      x: a.x + a.w / 2 - (b.x + b.w / 2),
      y: a.y + a.h / 2 - (b.y + b.h / 2),
    };
  };

  const NAVY = "#0b1530";
  const PAPER = "#f5f6f8";

  // 밝은 배경 구간 (타임라인 시간 기준) → 헤더·커서 네이비
  const LIGHT = [
    [0.35, 3.1], // 파도 장면
    [4.85, 8.15], // 서식지 장면
    [13.6, 17.4], // 사계절 장면
  ];

  // =========================================
  //  CON04 지도 경로 데이터
  //  좌표는 지도 이미지 기준 (viewBox 1600 x 900)
  //  → 지도 이미지가 바뀌면 MAP_DEBUG = true 로 두고 지도를 클릭해서
  //    콘솔에 찍히는 좌표로 아래 x, y 를 고치면 됨
  // =========================================
  const MAP_DEBUG = false;

  // 경로를 따라 나는 새 이미지
  const BIRD_SRC = "img/sub02/fy_con03_02.png";
  const BIRD_W = 46; // 크기 (viewBox 단위)
  const BIRD_H = 46;
  const BIRD_ANGLE = 0; // 이미지 속 새 머리 방향: 오른쪽 0, 위 90, 왼쪽 180, 아래 -90
  const BIRD_STOP = 0.5; // 첫 번째 새가 멈춰 남는 위치 (0.5 = 경로 한가운데)
  const ARRIVE_STOP = 0.92; // 두 번째 새가 도착해서 멈추는 위치 (1에 가까울수록 목적지 점에 가까움)
  const HUB = { x: 820, y: 400, ko: "부산", en: "Busan" };
  const ROUTES = [
    // ko, en: 지명 / x, y: 도착 좌표 / bend: 곡선 휘는 정도(+,- 방향)
    // lx, ly, anchor: 지명 글자 위치 / at: 시작 시점 / dur: 그려지는 시간 / from: 출발지(없으면 부산)
    {
      ko: "시베리아",
      en: "Siberia",
      x: 674,
      y: 192,
      bend: 40,
      lx: -14,
      ly: -26,
      anchor: "end",
      at: 9.6,
      dur: 0.9,
    },
    {
      ko: "캄차카",
      en: "Kamchatka",
      x: 961,
      y: 192,
      bend: -50,
      lx: 14,
      ly: -26,
      anchor: "start",
      at: 9.8,
      dur: 0.9,
    },
    {
      ko: "몽골",
      en: "Mongolia",
      x: 470,
      y: 322,
      bend: 40,
      lx: -14,
      ly: 6,
      anchor: "end",
      at: 10.0,
      dur: 0.9,
    },
    {
      ko: "중국 남부",
      en: "Southern China",
      x: 562,
      y: 407,
      bend: -40,
      lx: -14,
      ly: 6,
      anchor: "end",
      at: 10.2,
      dur: 0.9,
    },
    {
      ko: "일본",
      en: "Japan",
      x: 899,
      y: 419,
      bend: -30,
      lx: 14,
      ly: -2,
      anchor: "start",
      at: 10.4,
      dur: 0.8,
    },
    {
      ko: "필리핀",
      en: "Philippines",
      x: 858,
      y: 516,
      bend: 50,
      lx: -16,
      ly: 14,
      anchor: "end",
      at: 10.5,
      dur: 0.7,
    },
    {
      ko: "호주",
      en: "Australia",
      x: 754,
      y: 761,
      bend: 60,
      lx: -14,
      ly: -24,
      anchor: "end",
      at: 11.2,
      dur: 0.8,
      from: { x: 858, y: 516 },
    },
  ];

  // con05로 넘어갈 때 확대할 지도 위 지점 (한반도 남쪽 가운데) / 확대 배율
  const ZOOM_AT = { x: 775, y: 375 };
  const ZOOM_SCALE = 5;

  // 지도 좌표(viewBox) → 화면 좌표(v_inner 기준). slice 맞춤 계산
  const mapToScreen = (pt) => {
    const W = inner.clientWidth;
    const H = inner.clientHeight;
    const vbox = mapSvg.viewBox.baseVal;
    const sc = Math.max(W / vbox.width, H / vbox.height);
    return {
      x: (W - vbox.width * sc) / 2 + pt.x * sc,
      y: (H - vbox.height * sc) / 2 + pt.y * sc,
    };
  };
  const zoomOrigin = () => {
    const z = mapToScreen(ZOOM_AT);
    return `${z.x}px ${z.y}px`;
  };

  const NS = "http://www.w3.org/2000/svg";
  const mk = (tag, attrs, parent) => {
    const n = document.createElementNS(NS, tag);
    for (const k in attrs) n.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(n);
    return n;
  };
  const addLabel = (parent, x, y, ko, en, anchor) => {
    const t = mk(
      "text",
      { x, y, "text-anchor": anchor, class: "map_label" },
      parent
    );
    mk("tspan", { x, class: "ko" }, t).textContent = ko;
    mk("tspan", { x, dy: 17, class: "en" }, t).textContent = en;
    return t;
  };

  const vb = mapSvg.viewBox.baseVal;
  const defs = mk("defs", {}, mapSvg);
  const routeLayer = mk("g", { class: "map_routes" }, mapSvg);

  const routes = ROUTES.map((r, i) => {
    const f = r.from || HUB;
    const dx = r.x - f.x;
    const dy = r.y - f.y;
    const L = Math.hypot(dx, dy);
    const cx = (f.x + r.x) / 2 + (-dy / L) * r.bend;
    const cy = (f.y + r.y) / 2 + (dx / L) * r.bend;
    const d = `M${f.x} ${f.y} Q${cx} ${cy} ${r.x} ${r.y}`;

    // 점선을 앞에서부터 드러내는 마스크
    const mask = mk(
      "mask",
      {
        id: `fyRoute${i}`,
        maskUnits: "userSpaceOnUse",
        x: 0,
        y: 0,
        width: vb.width,
        height: vb.height,
      },
      defs
    );
    const maskPath = mk("path", { d, class: "route_mask" }, mask);
    const path = mk(
      "path",
      { d, class: "route", mask: `url(#fyRoute${i})` },
      routeLayer
    );
    const len = path.getTotalLength();
    maskPath.style.strokeDasharray = `${len} ${len}`;

    const dot = mk(
      "circle",
      { cx: r.x, cy: r.y, r: 5, class: "route_dot" },
      routeLayer
    );
    const label = addLabel(
      routeLayer,
      r.x + r.lx,
      r.y + r.ly,
      r.ko,
      r.en,
      r.anchor
    );
    const addBird = () => {
      const g = mk("g", { class: "route_bird" }, routeLayer);
      mk(
        "image",
        {
          href: BIRD_SRC,
          x: -BIRD_W / 2,
          y: -BIRD_H / 2,
          width: BIRD_W,
          height: BIRD_H,
        },
        g
      );
      return g;
    };
    const bird = addBird(); // 중간에 남는 새
    const bird2 = addBird(); // 목적지까지 날아가는 새

    return { ...r, path, maskPath, len, dot, label, bird, bird2 };
  });

  // 부산(출발지)
  const hub = mk("g", { class: "map_hub" }, mapSvg);
  mk("circle", { cx: HUB.x, cy: HUB.y, r: 6, class: "hub_ring" }, hub);
  mk("circle", { cx: HUB.x, cy: HUB.y, r: 6, class: "hub_dot" }, hub);
  addLabel(hub, HUB.x + 14, HUB.y + 24, HUB.ko, HUB.en, "start");

  // 새를 경로의 t(0~1) 지점에 진행 방향으로 놓기
  const placeBird = (r, el, t) => {
    const at = t * r.len;
    const a = r.path.getPointAtLength(at);
    const b = r.path.getPointAtLength(Math.min(at + 1, r.len));
    const ang = (Math.atan2(b.y - a.y, b.x - a.x) * 180) / Math.PI;
    el.setAttribute(
      "transform",
      `translate(${a.x} ${a.y}) rotate(${ang + BIRD_ANGLE})`
    );
  };

  // p: 0 ~ 1 (경로가 그려진 정도)
  // 새 한 마리가 선의 앞을 따라가다 중간(BIRD_STOP)에 남고,
  // 그 자리에서 다른 한 마리가 이어서 날아가 목적지(ARRIVE_STOP)에 도착
  const drawRoute = (r, p) => {
    r.maskPath.style.strokeDashoffset = r.len * (1 - p);
    placeBird(r, r.bird, Math.min(p, BIRD_STOP));
    r.bird.style.opacity = p > 0.01 ? 1 : 0;
    placeBird(r, r.bird2, gsap.utils.clamp(BIRD_STOP, ARRIVE_STOP, p));
    r.bird2.style.opacity = p > BIRD_STOP ? 1 : 0;
    const arrive = gsap.utils.clamp(0, 1, (p - 0.88) / 0.12);
    r.dot.style.opacity = arrive;
    r.label.style.opacity = arrive;
  };
  routes.forEach((r) => drawRoute(r, 0));

  if (MAP_DEBUG) {
    mapSvg.style.pointerEvents = "auto";
    mapSvg.addEventListener("click", (e) => {
      const pt = mapSvg.createSVGPoint();
      pt.x = e.clientX;
      pt.y = e.clientY;
      const p = pt.matrixTransform(mapSvg.getScreenCTM().inverse());
      console.log(`x: ${Math.round(p.x)}, y: ${Math.round(p.y)}`);
    });
  }

  const tl = gsap.timeline({
    defaults: { ease: "none" },
    scrollTrigger: {
      trigger: "#fy_visual",
      start: "top top",
      end: "+=2450%", // 스크롤 길이 (늘리면 더 천천히)
      pin: true,
      scrub: 1,
      invalidateOnRefresh: true,
    },
    onUpdate: () => {
      const t = tl.time();
      document.body.classList.toggle(
        "fy_light",
        LIGHT.some(([a, b]) => t > a && t < b)
      );
    },
  });

  tl
    // ===== VISUAL → 파도 =====
    // 1. 첫 화면 문구·배지·SCROLL 사라짐
    .to("#fy_visual .v_hero_txt, #fy_visual .v_badge, #fy_visual .v_scroll", {
      autoAlpha: 0,
      y: -40,
      duration: 0.3,
      stagger: 0.05,
    })
    // 2. 배경 네이비 → 밝은 색, 그라데이션 걷힘
    .to(inner, { backgroundColor: PAPER, duration: 1 }, 0.1)
    .to("#fy_visual .v_shade", { autoAlpha: 0, duration: 0.5 }, 0.1)
    // 3. 사진이 줄어들며 파도 자리로
    .to(
      "#fy_visual .v_img",
      {
        top: () => rect(target1).top,
        left: () => rect(target1).left,
        width: () => rect(target1).width,
        height: () => rect(target1).height,
        duration: 1,
        ease: "power2.inOut",
      },
      0.1
    )
    // 4. 줄어드는 도중 파도 사진으로 교체
    .to("#fy_visual .v_img .img2", { opacity: 1, duration: 0.5 }, 0.45)
    // 5. 오른쪽 문구 등장
    .to(
      "#fy_visual .v_txt .fade",
      { autoAlpha: 1, y: 0, duration: 0.4, stagger: 0.15 },
      1.05
    )
    .to("#fy_visual .v_txt .line", { scaleX: 1, duration: 0.4 }, 1.2)
    // 6. 사인 로고: 선 그리기 → 채우기
    .to("#fy_visual .v_sign text", { strokeDashoffset: 0, duration: 1.2 }, 1.2)
    .to(
      "#fy_visual .v_sign text",
      { fillOpacity: 1, strokeOpacity: 0, duration: 0.4 },
      2.2
    )

    // ===== 파도 → CON01 새의 여정 =====
    // 7. 파도 장면 문구·사인 사라짐
    .to(
      "#fy_visual .v_txt, #fy_visual .v_sign",
      { autoAlpha: 0, y: -30, duration: 0.4, stagger: 0.08 },
      2.8
    )
    // 8. 배경 다시 네이비로
    .to(inner, { backgroundColor: NAVY, duration: 0.6 }, 2.9)
    // 9. 사진이 con01 자리로 이동하며 커짐
    .to(
      "#fy_visual .v_img",
      {
        top: () => rect(target2).top,
        left: () => rect(target2).left,
        width: () => rect(target2).width,
        height: () => rect(target2).height,
        duration: 1,
        ease: "power2.inOut",
      },
      2.9
    )
    // 10. 이동 도중 con01 사진으로 교체
    .to("#fy_visual .v_img .img3", { opacity: 1, duration: 0.5 }, 3.15)
    // 11. 제목 등장
    .to(
      "#fy_visual .con01_tit > *",
      { autoAlpha: 1, y: 0, duration: 0.4, stagger: 0.12 },
      3.4
    )
    // 12. 타임라인 선 → 월별 항목
    .to("#fy_visual .time_line", { scaleX: 1, duration: 0.8 }, 3.7)
    .to(
      "#fy_visual .con01_time li",
      { autoAlpha: 1, y: 0, duration: 0.35, stagger: 0.15 },
      3.85
    )

    // ===== CON01 → CON03 새의 서식지 =====
    // 13. con01 제목·타임라인 사라짐
    .to(
      "#fy_visual .con01_tit, #fy_visual .con01_time",
      { autoAlpha: 0, y: -30, duration: 0.4, stagger: 0.08 },
      4.6
    )
    // 14. 배경 밝은 색으로
    .to(inner, { backgroundColor: PAPER, duration: 0.6 }, 4.7)
    // 15. 사진이 첫 카드 자리로 이동하며 모서리가 둥글어짐
    .to(
      "#fy_visual .v_img",
      {
        top: () => rect(target3).top,
        left: () => rect(target3).left,
        width: () => rect(target3).width,
        height: () => rect(target3).height,
        borderRadius: 14,
        duration: 1,
        ease: "power2.inOut",
      },
      4.7
    )
    // 16. 이동 도중 번식지 사진으로 교체
    .to("#fy_visual .v_img .img4", { opacity: 1, duration: 0.5 }, 4.95)
    // 17. 제목 등장
    .to(
      "#fy_visual .con03_tit > *",
      { autoAlpha: 1, y: 0, duration: 0.4, stagger: 0.12 },
      5.3
    )
    // 18. 나머지 두 카드가 첫 카드 뒤에서 뽑혀 나옴
    .set([card2, card3], { autoAlpha: 1 }, 5.6)
    .fromTo(
      card2,
      {
        x: () => fromCard1(card2).x,
        y: () => fromCard1(card2).y,
        rotation: -6,
        scale: 0.9,
      },
      { x: 0, y: 0, rotation: 0, scale: 1, duration: 0.7, ease: "power3.out" },
      5.6
    )
    .fromTo(
      card3,
      {
        x: () => fromCard1(card3).x,
        y: () => fromCard1(card3).y,
        rotation: -10,
        scale: 0.85,
      },
      { x: 0, y: 0, rotation: 0, scale: 1, duration: 0.8, ease: "power3.out" },
      5.8
    )
    // 19. 카드 설명·오른쪽 문구 등장
    .to(
      "#fy_visual .hab_cap",
      { autoAlpha: 1, y: 0, duration: 0.35, stagger: 0.12 },
      6.3
    )
    .to("#fy_visual .hab_note", { autoAlpha: 1, y: 0, duration: 0.4 }, 6.6)

    // ===== CON03 → CON04 비행길 지도 =====
    // 20. 서식지 제목·설명 사라짐
    .to(
      "#fy_visual .con03_tit, #fy_visual .hab_cap, #fy_visual .hab_note",
      { autoAlpha: 0, y: -20, duration: 0.4, stagger: 0.04 },
      7.2
    )
    // 21. 카드들이 마지막 카드(월동지)로 다시 모임
    .to(
      card2,
      {
        x: () => toCard3(card2).x,
        y: () => toCard3(card2).y,
        rotation: 6,
        scale: 0.92,
        duration: 0.6,
        ease: "power2.in",
      },
      7.4
    )
    .to(
      "#fy_visual .v_img",
      {
        top: () => pos(card3).y,
        left: () => pos(card3).x,
        width: () => pos(card3).w,
        height: () => pos(card3).h,
        duration: 0.7,
        ease: "power2.inOut",
      },
      7.4
    )
    // 첫 카드가 마지막 카드에 겹쳐지며 같은 사진으로
    .to("#fy_visual .v_img .img5", { opacity: 1, duration: 0.3 }, 7.75)
    .set([card2, card3], { autoAlpha: 0 }, 8.1)
    // 22. 배경 네이비, 모인 카드가 화면 가득 지도로 펼쳐짐
    .to(inner, { backgroundColor: NAVY, duration: 0.5 }, 8.1)
    .to(
      "#fy_visual .v_img",
      {
        top: 0,
        left: 0,
        width: () => inner.clientWidth,
        height: () => inner.clientHeight,
        borderRadius: 0,
        duration: 1,
        ease: "power2.inOut",
      },
      8.1
    )
    .to("#fy_visual .v_img .img6", { opacity: 1, duration: 0.5 }, 8.35)
    .to("#fy_visual .map_fade", { opacity: 1, duration: 0.5 }, 8.8)
    // 23. 제목, 출발지(부산) 등장
    .to(
      "#fy_visual .con04_tit > *",
      { autoAlpha: 1, y: 0, duration: 0.4, stagger: 0.12 },
      9.2
    )
    .to(hub, { autoAlpha: 1, duration: 0.3 }, 9.4)

    // 경로가 다 그려진 지도 잠시 유지
    .to({}, { duration: 0.5 }, 12.0)

    // ===== CON04 → CON05 한국의 사계절 =====
    // 25. 지도 제목·경로 사라지며 한국으로 확대
    .to(
      "#fy_visual .con04_tit, #fy_visual .map_fade",
      { autoAlpha: 0, duration: 0.4 },
      12.5
    )
    .to(mapSvg, { autoAlpha: 0, duration: 0.5 }, 12.6)
    .to(
      [vImg, mapSvg],
      {
        scale: ZOOM_SCALE,
        transformOrigin: zoomOrigin,
        duration: 1.3,
        ease: "power2.in",
      },
      12.5
    )
    // 26. 확대가 끝날 즈음 밝은 배경으로 전환
    .to(inner, { backgroundColor: PAPER, duration: 0.3 }, 13.3)
    .to(vImg, { autoAlpha: 0, duration: 0.5 }, 13.4)
    // 27. 제목 등장
    .to(
      "#fy_visual .con05_tit > *",
      { autoAlpha: 1, y: 0, duration: 0.4, stagger: 0.12 },
      13.9
    )
    // 28. 사계절 카드가 아래에서 차례로 올라옴
    .fromTo(
      "#fy_visual .season",
      { autoAlpha: 0, y: () => inner.clientHeight * 0.6 },
      { autoAlpha: 1, y: 0, duration: 0.7, stagger: 0.3, ease: "power3.out" },
      14.1
    )
    // 29. 아래 진행선이 봄 → 겨울 방향으로 그어짐
    .to(
      "#fy_visual .season_line",
      { scaleX: 1, duration: 1.2, ease: "power1.inOut" },
      14.3
    )

    // 사계절 화면 잠시 유지
    .to({}, { duration: 0.5 }, 15.6)

    // ===== CON05 → CON06 비행길 =====
    // 30. 제목·진행선 사라짐
    .to(
      "#fy_visual .con05_tit, #fy_visual .season_line",
      { autoAlpha: 0, duration: 0.4 },
      16.1
    )
    // 31. 겨울이 가을 뒤로 들어가 사라짐
    .to(
      seasons[3],
      {
        x: () => toCenter(seasons[3], seasons[2]).x,
        scale: 0.9,
        duration: 0.5,
        ease: "power2.in",
      },
      16.2
    )
    .set(seasons[3], { autoAlpha: 0 }, 16.7)
    // 32. 봄과 가을이 여름 뒤로 모임
    .to(
      seasons[0],
      {
        x: () => toCenter(seasons[0], seasons[1]).x,
        scale: 0.9,
        duration: 0.6,
        ease: "power2.in",
      },
      16.7
    )
    .to(
      seasons[2],
      {
        x: () => toCenter(seasons[2], seasons[1]).x,
        scale: 0.9,
        duration: 0.6,
        ease: "power2.in",
      },
      16.7
    )
    .set([seasons[0], seasons[2]], { autoAlpha: 0 }, 17.3)
    // 33. 여름 카드를 움직이는 사진(v_img)이 이어받음
    .set(
      vImg,
      {
        scale: 1,
        transformOrigin: "50% 50%",
        top: () => pos(seasons[1]).y,
        left: () => pos(seasons[1]).x,
        width: () => pos(seasons[1]).w,
        height: () => pos(seasons[1]).h,
        borderRadius: 6,
        autoAlpha: 1,
      },
      17.3
    )
    .set("#fy_visual .v_img .img7", { opacity: 1 }, 17.3)
    .set(seasons[1], { autoAlpha: 0 }, 17.3)
    // 34. 세로 카드가 가로로 펼쳐지며 화면 가득
    .to(inner, { backgroundColor: NAVY, duration: 0.4 }, 17.4)
    .to(
      vImg,
      {
        top: 0,
        left: 0,
        width: () => inner.clientWidth,
        height: () => inner.clientHeight,
        borderRadius: 0,
        duration: 1,
        ease: "power2.inOut",
      },
      17.4
    )
    // 35. 더 커지며 사라지고 비행길 첫 장면 등장
    .to(
      vImg,
      { scale: 1.15, autoAlpha: 0, duration: 0.6, ease: "power1.in" },
      18.3
    )
    .to(con06, { autoAlpha: 1, duration: 0.6 }, 18.3)
    .fromTo(
      "#fy_visual .con06_tit > *",
      { autoAlpha: 0, y: 24 },
      { autoAlpha: 1, y: 0, duration: 0.4, stagger: 0.12 },
      18.6
    );

  // ===== CON06 장면 진행 =====
  // 새는 제자리에서 날개 올림 → 내림 한 번, 그다음 배경이 왼쪽으로 넘어감
  const SCENE_START = 18.8; // 첫 장면 시작 시점
  const SCENE_LEN = 1.6; // 장면 하나의 길이
  const SCENE_COUNT = flyCaps.length; // 배경 수 (5)
  const FLAP_AT = 0.5; // 장면 시작 후 날개를 내리는 시점
  const SLIDE_AT = 1.0; // 장면 시작 후 배경이 넘어가는 시점
  const lastEnd = SCENE_START + SCENE_COUNT * SCENE_LEN;

  gsap.set("#fy_visual .fly_bird", { xPercent: -50, yPercent: -50 });

  // 뒤 새 무리는 비행길 내내 천천히 흘러감
  tl.fromTo(
    "#fy_visual .fly_flock",
    { xPercent: 15 },
    { xPercent: -70, duration: lastEnd - 18.3 },
    18.3
  );

  for (let i = 0; i < SCENE_COUNT; i++) {
    const S = SCENE_START + i * SCENE_LEN;
    const isLast = i === SCENE_COUNT - 1;

    // 장면 문구
    tl.to(flyCaps[i], { autoAlpha: 1, y: 0, duration: 0.4 }, S);
    if (!isLast)
      tl.to(flyCaps[i], { autoAlpha: 0, y: -10, duration: 0.3 }, S + SLIDE_AT);

    // 이 장면의 주인공 새
    const bird = flyBirds.find((b) => Number(b.dataset.scene) === i);
    if (bird) {
      const appear = i === 0 ? 18.5 : S - 0.45; // 앞 장면에서 넘어올 때 겹치듯 교체
      tl.to(bird, { autoAlpha: 1, duration: 0.3 }, appear);
      // 날갯짓에 맞춰 살짝 떠오름
      tl.fromTo(
        bird,
        { y: 8 },
        { y: -10, duration: SLIDE_AT + 0.2, ease: "sine.inOut" },
        S
      );
      // 날개 올림 → 내림
      tl.set(bird.querySelector(".up"), { opacity: 0 }, S + FLAP_AT);
      tl.set(bird.querySelector(".down"), { opacity: 1 }, S + FLAP_AT);
      if (!isLast)
        tl.to(bird, { autoAlpha: 0, duration: 0.25 }, S + SLIDE_AT + 0.05);
    }

    // 다음 배경으로 넘어감
    if (!isLast) {
      tl.to(
        flyTrack,
        {
          xPercent: -(100 / SCENE_COUNT) * (i + 1),
          duration: 0.7,
          ease: "power2.inOut",
        },
        S + SLIDE_AT
      );
    }
  }

  // 마지막 장면 잠시 유지
  tl.to({}, { duration: 0.4 }, lastEnd);

  // 24. 부산에서 각 지역으로 점선이 그려지고 새가 따라 날아감
  routes.forEach((r) => {
    const prog = { p: 0 };
    tl.to(
      prog,
      { p: 1, duration: r.dur, onUpdate: () => drawRoute(r, prog.p) },
      r.at
    );
  });

  // ---------- 맨 위로 버튼 ----------
  // 스크롤 애니메이션이 거꾸로 재생되지 않고 바로 첫 화면으로 이동
  $(".sc_top").off("click");
  $(".sc_top")
    .closest("a")
    .off("click")
    .on("click", function (e) {
      e.preventDefault();
      $("html, body").stop(true); // 다른 스크립트의 스크롤 애니메이션 중지
      window.scrollTo({ top: 0, behavior: "instant" });
      ScrollTrigger.update();
      const scrub = tl.scrollTrigger && tl.scrollTrigger.getTween();
      if (scrub) scrub.progress(1); // scrub 지연 없이 바로 첫 장면
    });

  // 이미지·폰트 로드 후 위치 재계산
  $(window).on("load", () => ScrollTrigger.refresh());
  if (document.fonts) document.fonts.ready.then(() => ScrollTrigger.refresh());
});
