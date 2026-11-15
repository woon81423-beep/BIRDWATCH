// =========================================
//  sub02 : FLYWAY
//  - 비주얼(#fy_visual)과 비행길(#fy_con06)만 풀스크린 고정(pin)
//  - 나머지 섹션은 일반 스크롤 + 화면에 들어올 때 효과
//
//  ※ 창 크기 대응
//    gsap.matchMedia()로 PC(769px 이상) / 모바일(768px 이하) 두 가지로 나눠 만듦.
//    두 크기를 넘나들면 GSAP이 모든 효과·고정(pin)을 깨끗하게 지우고 처음부터 다시 만듦
//    → 컴퓨터 크기 ↔ 휴대폰 크기로 바꿔도 고장 나지 않음
// =========================================

// 새로고침 시 브라우저가 이전 스크롤 위치를 복원하지 않게 함
if ("scrollRestoration" in history) history.scrollRestoration = "manual";

$(function () {
  if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined")
    return;

  gsap.registerPlugin(ScrollTrigger);
  // 휴대폰 주소창이 나타났다 사라질 때마다 전체를 다시 계산하지 않게 함
  ScrollTrigger.config({ ignoreMobileResize: true });

  window.scrollTo(0, 0);

  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const NAVY = "#0b1530";
  const PAPER = "#f5f6f8";
  const NO_IR = { immediateRender: false }; // 만들 때 미리 적용하지 않음 (CSS 처음 상태 그대로)

  // 화면에 들어오면 재생 / 위로 스크롤해서 요소가 화면 아래로 완전히 내려가면 처음 상태로 되돌림
  // → 다시 내려올 때 또 아래에서 올라오며 등장
  const PLAY_AT = "top 82%"; // 재생 시점: 요소 윗부분이 화면 위에서 82% 지점에 닿을 때
  const RESET_AT = "top bottom"; // 초기화 시점: 요소 윗부분이 화면 맨 아래보다 내려갈 때 (안 보일 때라 티가 안 남)
  const replay = (anim, trigger, start = PLAY_AT) => {
    ScrollTrigger.create({ trigger, start, onEnter: () => anim.play() });
    ScrollTrigger.create({
      trigger,
      start: RESET_AT,
      onLeaveBack: () => anim.pause(0),
    });
    return anim;
  };

  // =========================================
  //  요소
  // =========================================
  const visual = document.querySelector("#fy_visual");
  const inner = document.querySelector("#fy_visual .v_inner");
  const vImg = document.querySelector("#fy_visual .v_img");
  const target = document.querySelector("#fy_visual .img_target");

  const mapSvg = document.querySelector("#fy_con04 .map_svg");

  const con06 = document.querySelector("#fy_con06");
  const flyTrack = document.querySelector("#fy_con06 .fly_track");
  const flyBirdWrap = document.querySelector("#fy_con06 .fly_bird");
  const flyBirds = gsap.utils.toArray("#fy_con06 .fly_bird .bird");
  const flyCaps = gsap.utils.toArray("#fy_con06 .fly_caps li");
  const flyNum = document.querySelector("#fy_con06 .fly_count b");

  let vtl = null; // 비주얼 타임라인 (헤더 색 계산에 사용)

  // =========================================
  //  헤더·커서 색
  //  헤더 바로 아래에 있는 구역의 배경이 밝으면 body.fy_light
  // =========================================
  const themed = gsap.utils.toArray("#fy_visual, .fy_main .fy_sec");
  const HEADER_LINE = 60; // 화면 위에서 이 높이에 걸친 구역 기준

  const updateTheme = () => {
    let light = false;
    for (const sec of themed) {
      const r = sec.getBoundingClientRect();
      if (r.top <= HEADER_LINE && r.bottom > HEADER_LINE) {
        light =
          sec === visual
            ? !!vtl && vtl.progress() > 0.15 // 비주얼: 배경이 밝아진 뒤부터
            : sec.dataset.theme === "light";
        break;
      }
    }
    document.body.classList.toggle("fy_light", light);
  };
  ScrollTrigger.addEventListener("refresh", updateTheme);

  // =========================================
  //  CON04 지도 : 경로·새·지명 SVG 만들기 (한 번만)
  //  좌표는 지도 이미지 기준 (viewBox 1600 x 900)
  //  → 지도 이미지가 바뀌면 MAP_DEBUG = true 로 두고 지도를 클릭해서
  //    콘솔에 찍히는 좌표로 아래 x, y 를 고치면 됨
  // =========================================
  const MAP_DEBUG = false;
  const MAP_W = 1600;
  const MAP_H = 900;
  // 휴대폰에서는 경로가 있는 부분만 잘라서 보여줌 (viewBox 좌표)
  const MAP_FOCUS = { x: 400, y: 120, w: 680, h: 720 };

  const BIRD_SRC = "img/sub02/fy_con03_02.png"; // 경로를 따라 나는 새 이미지
  const BIRD_W = 46; // 크기 (viewBox 단위)
  const BIRD_H = 46;
  const BIRD_ANGLE = 0; // 이미지 속 새 머리 방향: 오른쪽 0, 위 90, 왼쪽 180, 아래 -90
  const BIRD_STOP = 0.5; // 첫 번째 새가 멈춰 남는 위치 (0.5 = 경로 한가운데)
  const ARRIVE_STOP = 0.92; // 두 번째 새가 도착해서 멈추는 위치
  const HUB = { x: 800, y: 400, ko: "부산", en: "Busan" };
  const ROUTES = [
    // ko, en: 지명 / x, y: 도착 좌표 / bend: 곡선 휘는 정도(+,- 방향)
    // lx, ly, anchor: 지명 글자 위치 / at: 시작 시점(초) / dur: 그려지는 시간 / from: 출발지(없으면 부산)
    {
      ko: "시베리아",
      en: "Siberia",
      x: 674,
      y: 192,
      bend: 40,
      lx: -14,
      ly: -26,
      anchor: "end",
      at: 0.0,
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
      at: 0.2,
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
      at: 0.4,
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
      at: 0.6,
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
      at: 0.8,
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
      at: 0.9,
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
      at: 1.6,
      dur: 0.8,
      from: { x: 858, y: 516 },
    },
  ];

  let routes = [];
  let hub = null;

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
      parent,
    );
    mk("tspan", { x, class: "ko" }, t).textContent = ko;
    mk("tspan", { x, dy: "1.1em", class: "en" }, t).textContent = en;
    return t;
  };

  // 새를 경로의 t(0~1) 지점에 진행 방향으로 놓기
  const placeBird = (r, el, t) => {
    const at = t * r.len;
    const a = r.path.getPointAtLength(at);
    const b = r.path.getPointAtLength(Math.min(at + 1, r.len));
    const ang = (Math.atan2(b.y - a.y, b.x - a.x) * 180) / Math.PI;
    el.setAttribute(
      "transform",
      `translate(${a.x} ${a.y}) rotate(${ang + BIRD_ANGLE})`,
    );
  };

  // p: 0 ~ 1 (경로가 그려진 정도)
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

  if (mapSvg) {
    const defs = mk("defs", {}, mapSvg);
    const routeLayer = mk("g", { class: "map_routes" }, mapSvg);

    routes = ROUTES.map((r, i) => {
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
          width: MAP_W,
          height: MAP_H,
        },
        defs,
      );
      const maskPath = mk("path", { d, class: "route_mask" }, mask);
      const path = mk(
        "path",
        { d, class: "route", mask: `url(#fyRoute${i})` },
        routeLayer,
      );
      const len = path.getTotalLength();
      maskPath.style.strokeDasharray = `${len} ${len}`;

      const dot = mk(
        "circle",
        { cx: r.x, cy: r.y, r: 5, class: "route_dot" },
        routeLayer,
      );
      const label = addLabel(
        routeLayer,
        r.x + r.lx,
        r.y + r.ly,
        r.ko,
        r.en,
        r.anchor,
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
          g,
        );
        return g;
      };
      const bird = addBird(); // 중간에 남는 새
      const bird2 = addBird(); // 목적지까지 날아가는 새

      return { ...r, path, maskPath, len, dot, label, bird, bird2 };
    });

    // 부산(출발지)
    hub = mk("g", { class: "map_hub" }, mapSvg);
    mk("circle", { cx: HUB.x, cy: HUB.y, r: 6, class: "hub_ring" }, hub);
    mk("circle", { cx: HUB.x, cy: HUB.y, r: 6, class: "hub_dot" }, hub);
    addLabel(hub, HUB.x + 14, HUB.y + 24, HUB.ko, HUB.en, "start");

    routes.forEach((r) => drawRoute(r, 0));

    if (MAP_DEBUG) {
      mapSvg.addEventListener("click", (e) => {
        const pt = mapSvg.createSVGPoint();
        pt.x = e.clientX;
        pt.y = e.clientY;
        const p = pt.matrixTransform(mapSvg.getScreenCTM().inverse());
        console.log(`x: ${Math.round(p.x)}, y: ${Math.round(p.y)}`);
      });
    }
  }

  // =========================================
  //  01. VISUAL : 풀스크린 고정 구역
  // =========================================
  const initVisual = () => {
    if (!visual || !inner || !vImg || !target) return;

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

    vtl = gsap.timeline({
      defaults: { ease: "none" },
      onUpdate: updateTheme, // scrub 지연 중에도 헤더 색 맞춤
      scrollTrigger: {
        trigger: visual,
        start: "top top",
        end: "+=180%", // 고정 구간 길이 (화면 높이의 1.8배)
        pin: true,
        scrub: 1,
        invalidateOnRefresh: true, // 창 크기가 바뀌면 사진 자리를 다시 계산
        // 중간에 멈추면 첫 화면 / 완성 화면 중 스크롤 방향 쪽으로 붙음
        snap: {
          snapTo: [0, 1],
          directional: true,
          duration: { min: 0.3, max: 0.8 },
          delay: 0.12,
          ease: "power1.inOut",
        },
      },
    });

    // ※ 모든 애니메이션의 시작값을 직접 적어 둠 (fromTo)
    //   .to()만 쓰면 창 크기가 바뀔 때 '지금 화면 상태'를 시작값으로 다시 기록해서
    //   거꾸로 스크롤해도 처음 상태로 돌아가지 않음
    vtl
      // 1. 첫 화면 문구·배지·SCROLL 사라짐
      .fromTo(
        "#fy_visual .v_hero_txt, #fy_visual .v_badge, #fy_visual .v_scroll",
        { autoAlpha: 1, y: 0 },
        { autoAlpha: 0, y: -40, duration: 0.3, stagger: 0.05, ...NO_IR },
        0,
      )
      // 2. 배경 네이비 → 밝은 색, 그라데이션 걷힘
      .fromTo(
        inner,
        { backgroundColor: NAVY },
        { backgroundColor: PAPER, duration: 1, ...NO_IR },
        0.1,
      )
      .fromTo(
        "#fy_visual .v_shade",
        { autoAlpha: 1 },
        { autoAlpha: 0, duration: 0.5, ...NO_IR },
        0.1,
      )
      // 3. 사진이 줄어들며 파도 자리로 (위치는 함수 → 창 크기가 바뀌면 다시 계산)
      .fromTo(
        vImg,
        {
          top: 0,
          left: 0,
          width: () => inner.clientWidth,
          height: () => inner.clientHeight,
        },
        {
          top: () => rect(target).top,
          left: () => rect(target).left,
          width: () => rect(target).width,
          height: () => rect(target).height,
          duration: 1,
          ease: "power2.inOut",
        },
        0.1,
      )
      // 4. 줄어드는 도중 파도 사진으로 교체
      .fromTo(
        "#fy_visual .v_img .img2",
        { opacity: 0 },
        { opacity: 1, duration: 0.5, ...NO_IR },
        0.45,
      )
      // 5. 오른쪽 문구 등장
      .fromTo(
        "#fy_visual .v_txt .fade",
        { autoAlpha: 0, y: 30 },
        { autoAlpha: 1, y: 0, duration: 0.4, stagger: 0.15, ...NO_IR },
        1.05,
      )
      .fromTo(
        "#fy_visual .v_txt .line",
        { scaleX: 0 },
        { scaleX: 1, duration: 0.4, ...NO_IR },
        1.2,
      )
      // 6. 사인 로고: 선 그리기 → 채우기
      .fromTo(
        "#fy_visual .v_sign text",
        { strokeDashoffset: 2200 },
        { strokeDashoffset: 0, duration: 1.2, ...NO_IR },
        1.2,
      )
      .fromTo(
        "#fy_visual .v_sign text",
        { fillOpacity: 0, strokeOpacity: 1 },
        { fillOpacity: 1, strokeOpacity: 0, duration: 0.4, ...NO_IR },
        2.2,
      )
      // 완성 화면 잠시 유지
      .to({}, { duration: 0.4 });
  };

  // =========================================
  //  02 ~ 05. 일반 섹션 : 화면에 들어올 때 효과
  // =========================================
  // 아래에서 떠오름
  const rise = (targets, trigger, vars = {}) =>
    replay(
      gsap.from(targets, {
        autoAlpha: 0,
        y: 40,
        duration: 0.9,
        ease: "power3.out",
        stagger: 0.12,
        ...vars,
        paused: true,
      }),
      trigger,
    );

  // 사진 틀이 열리며 등장
  const openFig = (fig) =>
    replay(
      gsap.fromTo(
        fig,
        { clipPath: "inset(100% 0% 0% 0%)" },
        {
          clipPath: "inset(0% 0% 0% 0%)",
          duration: 1.3,
          ease: "power3.inOut",
          paused: true,
        },
      ),
      fig,
      "top 80%",
    );

  // 스크롤에 따라 사진이 틀 안에서 천천히 움직임
  const parallax = (fig) => {
    const img = fig.querySelector(".p_img");
    if (!img) return;
    gsap.fromTo(
      img,
      { yPercent: -6 },
      {
        yPercent: 6,
        ease: "none",
        scrollTrigger: {
          trigger: fig,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      },
    );
  };

  const initSections = () => {
    if (reduce) return;

    // 섹션 제목 (고정되는 con06 제목은 제외)
    gsap.utils
      .toArray(".fy_main .fy_sec:not(.fy_full) .sec_tit")
      .forEach((tit) => {
        rise(tit.querySelectorAll(":scope > *"), tit);
      });

    gsap.utils
      .toArray(".fy_main .fy_sec:not(.fy_full) .fy_parallax")
      .forEach(parallax);

    // ----- CON01 새의 여정 -----
    const con01Img = document.querySelector("#fy_con01 .con01_img");
    if (con01Img) openFig(con01Img);

    const time = document.querySelector("#fy_con01 .con01_time");
    if (time) {
      const tl01 = gsap
        .timeline({ paused: true })
        .from(time.querySelector(".time_line"), {
          scaleX: 0,
          duration: 1,
          ease: "power2.inOut",
        })
        .from(
          time.querySelectorAll("li"),
          { autoAlpha: 0, y: 24, duration: 0.5, stagger: 0.15 },
          0.3,
        );
      replay(tl01, time, "top 80%");
    }

    // ----- CON03 서식지 -----
    const habs = gsap.utils.toArray("#fy_con03 .hab");
    if (habs.length) {
      rise(habs, "#fy_con03 .hab_list", {
        y: 80,
        duration: 1.1,
        stagger: 0.18,
      });
      rise("#fy_con03 .hab_note", "#fy_con03 .hab_note");
    }

    // ----- CON04 지도 틀 -----
    const mapBoxEl = document.querySelector("#fy_con04 .map_box");
    if (mapBoxEl) openFig(mapBoxEl);

    // ----- CON05 사계절 -----
    const seasonList = document.querySelector("#fy_con05 .season_list");
    if (seasonList) {
      const tl05 = gsap
        .timeline({ paused: true })
        .from(seasonList.children, {
          autoAlpha: 0,
          y: 70,
          duration: 0.9,
          ease: "power3.out",
          stagger: 0.15,
        })
        .from(
          "#fy_con05 .season_line",
          { scaleX: 0, duration: 1.2, ease: "power1.inOut" },
          0.3,
        );
      replay(tl05, seasonList, "top 80%");
    }
  };

  // =========================================
  //  04. CON04 지도 : 크기별 보기 + 경로 그리기
  // =========================================
  const initMap = (isMobile) => {
    if (!mapSvg) return;

    mapSvg.setAttribute(
      "viewBox",
      isMobile
        ? `${MAP_FOCUS.x} ${MAP_FOCUS.y} ${MAP_FOCUS.w} ${MAP_FOCUS.h}`
        : `0 0 ${MAP_W} ${MAP_H}`,
    );
    mapSvg.classList.toggle("is_narrow", isMobile);

    const mapTl = gsap.timeline({ paused: true });
    mapTl.fromTo(hub, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.4 }, 0);
    routes.forEach((r) => {
      const prog = { p: 0 };
      mapTl.to(
        prog,
        {
          p: 1,
          duration: r.dur * 1.3,
          ease: "power1.inOut",
          onUpdate: () => drawRoute(r, prog.p),
        },
        0.5 + r.at * 1.3,
      );
    });

    // 움직임 줄이기 설정이면 다 그려진 상태로
    if (reduce) {
      mapTl.progress(1);
      routes.forEach((r) => drawRoute(r, 1));
      return;
    }
    routes.forEach((r) => drawRoute(r, 0));
    // 화면에 들어오면 경로를 그리고, 위로 올라가 지도가 안 보이게 되면 지워 둠 → 다시 내려오면 또 그려짐
    replay(mapTl, mapSvg, "top 65%");
  };

  // =========================================
  //  06. CON06 비행길 : 풀스크린 고정
  //  스크롤하면 배경이 왼쪽으로 넘어가며 주인공 새와 문구가 다음 장면으로 바뀜
  //  날갯짓은 스크롤할 때만 (멈추면 날개를 편 채로 활공)
  // =========================================
  const initCon06 = () => {
    if (!con06 || !flyTrack || !flyBirdWrap || flyCaps.length < 2)
      return () => {};

    const N = flyCaps.length; // 장면 수 (5)
    const SCENE = 1.5; // 장면 하나 길이 (넘어가기 + 머무르기)
    const MOVE = 0.9; // 배경이 넘어가는 시간
    const SCROLL_PER_SCENE = 100; // 장면 하나당 스크롤 길이 (화면 높이의 %)

    // 날갯짓 설정
    const FLAP_PX = 120; // 스크롤 몇 px마다 날개를 올렸다 내리는지 (클수록 느긋하게)
    const BOB_PX = 5; // 날갯짓할 때 위아래로 움직이는 정도 (px)
    const GLIDE_DELAY = 180; // 스크롤이 멈추고 이 시간(ms) 뒤 날개를 편 상태로 돌아감

    const step = 100 / N;

    // 새 위치: 가운데 정렬은 GSAP이 맡음 (위아래 움직임과 겹치지 않게)
    gsap.set(flyBirdWrap, { xPercent: -50, yPercent: -50, y: 0 });
    gsap.set(flyTrack, { xPercent: 0 });

    let glideTimer = null;
    let lastScroll = null;
    const flap = (scrollY) => {
      // 처음 한 번은 기준점만 잡음 (페이지가 다시 만들어질 때 혼자 퍼덕이지 않게)
      if (lastScroll === null || Math.abs(scrollY - lastScroll) < 1) {
        lastScroll = scrollY;
        return;
      }
      lastScroll = scrollY;
      const phase = scrollY / FLAP_PX;
      flyBirdWrap.classList.toggle("flap", Math.floor(phase) % 2 === 1);
      gsap.set(flyBirdWrap, {
        y: Math.sin(phase * Math.PI) * -BOB_PX,
        overwrite: true,
      });
      clearTimeout(glideTimer);
      glideTimer = setTimeout(() => {
        flyBirdWrap.classList.remove("flap");
        gsap.to(flyBirdWrap, { y: 0, duration: 0.5, ease: "power2.out" });
      }, GLIDE_DELAY);
    };

    const ftl = gsap.timeline({
      defaults: { ease: "none" },
      scrollTrigger: {
        trigger: con06,
        start: "top top",
        end: () => `+=${(N - 1) * SCROLL_PER_SCENE + 60}%`,
        pin: true,
        scrub: 1,
        // 중간에 멈추면 스크롤 방향 쪽 장면으로 붙음
        snap: {
          snapTo: "labelsDirectional",
          duration: { min: 0.3, max: 0.8 },
          delay: 0.12,
          ease: "power1.inOut",
        },
        onUpdate: (self) => {
          // 장면 번호 (01 / 05)
          if (flyNum) {
            const n = Math.min(N, Math.round(self.progress * (N - 1)) + 1);
            flyNum.textContent = String(n).padStart(2, "0");
          }
          // 스크롤할 때만 날갯짓
          flap(self.scroll());
        },
      },
    });

    ftl.addLabel("s0", 0);
    for (let i = 0; i < N - 1; i++) {
      const T = 0.3 + i * SCENE; // 이 장면에서 다음 장면으로 넘어가기 시작하는 시점

      // 지금 문구·새 사라짐
      ftl.fromTo(
        flyCaps[i],
        { autoAlpha: 1, y: 0 },
        { autoAlpha: 0, y: -10, duration: 0.3, ...NO_IR },
        T,
      );
      if (flyBirds[i])
        ftl.fromTo(
          flyBirds[i],
          { autoAlpha: 1, x: 0 },
          { autoAlpha: 0, x: 60, duration: 0.3, ...NO_IR },
          T,
        );

      // 배경이 왼쪽으로 한 장 넘어감
      ftl.fromTo(
        flyTrack,
        { xPercent: -step * i },
        {
          xPercent: -step * (i + 1),
          duration: MOVE,
          ease: "power2.inOut",
          ...NO_IR,
        },
        T,
      );

      // 다음 새·문구 등장
      if (flyBirds[i + 1])
        ftl.fromTo(
          flyBirds[i + 1],
          { autoAlpha: 0, x: -60 },
          { autoAlpha: 1, x: 0, duration: 0.4, ease: "power2.out", ...NO_IR },
          T + 0.55,
        );
      ftl.fromTo(
        flyCaps[i + 1],
        { autoAlpha: 0, y: 16 },
        { autoAlpha: 1, y: 0, duration: 0.4, ...NO_IR },
        T + 0.65,
      );

      ftl.addLabel(`s${i + 1}`, T + 1.2);
    }
    // 마지막 장면에서 조금 머문 뒤 푸터로
    ftl.to({}, { duration: 0.4 });

    // 뒤 새 무리는 비행길 내내 천천히 흘러감
    const flock = document.querySelector("#fy_con06 .fly_flock");
    if (flock)
      ftl.fromTo(
        flock,
        { xPercent: 15 },
        { xPercent: -70, duration: ftl.duration() },
        0,
      );

    // 크기가 바뀌어 다시 만들 때 정리
    return () => {
      clearTimeout(glideTimer);
      flyBirdWrap.classList.remove("flap");
      if (flyNum) flyNum.textContent = "01";
    };
  };

  // =========================================
  //  만들기 : PC / 모바일 기준으로 나눠서
  //  768px 경계를 넘으면 전부 지우고 다시 만듦 (위에서 아래 순서로 만들어야 위치 계산이 맞음)
  // =========================================
  const mm = gsap.matchMedia();
  mm.add(
    { isMobile: "(max-width: 768px)", isDesktop: "(min-width: 769px)" },
    (ctx) => {
      const { isMobile } = ctx.conditions;

      initVisual();
      initSections();
      initMap(isMobile);
      const cleanCon06 = initCon06();

      // 헤더 색은 스크롤할 때마다 확인
      ScrollTrigger.create({ start: 0, end: "max", onUpdate: updateTheme });
      updateTheme();

      return () => {
        cleanCon06();
        vtl = null;
        document.body.classList.remove("fy_light");
      };
    },
  );

  // =========================================
  //  위치 다시 계산
  // =========================================
  // 이미지·폰트가 늦게 들어와 높이가 바뀌는 경우
  $(window).on("load", () => ScrollTrigger.refresh());
  if (document.fonts) document.fonts.ready.then(() => ScrollTrigger.refresh());
  // 다른 페이지에 갔다가 '뒤로 가기'로 돌아온 경우 (브라우저가 페이지를 저장해 두었다가 그대로 꺼냄)
  window.addEventListener("pageshow", (e) => {
    if (e.persisted) ScrollTrigger.refresh();
  });
});
