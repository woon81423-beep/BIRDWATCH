$(function () {
  //visual 글자바꾸기
  let words = ["Watching", "Discovering", "Observing", "Protecting"];
  let change = document.querySelector(".change");
  let num = 0;
  setInterval(() => {
    change.classList.add("hide");
    setTimeout(() => {
      num++;

      if (num >= words.length) {
        num = 0;
      }
      change.textContent = words[num];
      change.classList.remove("hide");
    }, 350);
  }, 3000);

  //비주얼 나는 새
  $(function () {
    gsap.registerPlugin(MotionPathPlugin);

    let pcPath =
      "m.5,138.68s3.86-73.07,55.32-93.12c51.46-20.06,37.31,133.24,97.78,161.89,60.47,28.65,73.33-286.53,114.5-187.68,41.17,98.85,56.96,179.08,80.59,176.22,23.62-2.87,77.01-78.92,34.55-119.04-42.46-40.11-114.86-10.47-129.01,72.62-3.72,21.85,3.95,55.66,16.98,73.16,36.52,49.04,122.62,60.53,175.72,20.46,72.05-54.36,33.45-85.88,73.33-143.19,39.88-57.31,86.24,27.3,86.24,27.3"
;
    let tabPath =
      "m.07.5s263,37,170,80S3.07,220.5,102.07,188.5s107-112,168-138-13,69,41,95,226-31,185-100-153.65,18.26-151,58";
    let moPath =
      "m.5,75.17s1.82-39.48,26.04-50.32,17.56,72,46.02,87.48c28.46,15.48,34.52-154.83,53.89-101.42s26.81,96.77,37.93,95.22,57.14-38.71,37.16-60.39c-19.98-21.68-68.43-20.13-75.09,24.77s50.26,90.49,84.17,61.12c33.91-29.38,15.74-46.41,34.52-77.37,18.77-30.97,39.36-43.35,39.36-43.35";

    let birdAni;
    let currentMode = "";

    function birdMove() {
      let width = $(window).width();
      let mode;
      let path;

      if (width <= 767) {
        mode = "mobile";
        path = moPath;
      } else if (width <= 1024) {
        mode = "tablet";
        path = tabPath;
      } else {
        mode = "pc";
        path = pcPath;
      }

      // 반응형 구간이 바뀔 때만 실행
      if (currentMode === mode) return;
      currentMode = mode;

      // 기존 애니메이션 제거
      if (birdAni) {
        birdAni.kill();
      }

      // SVG d값 변경
      $(".cls-1").attr("d", path);

      // 기존 위치 초기화
      gsap.set(".circle", { clearProps: "transform" });

      birdAni = gsap.to(".circle", {
        motionPath: {
          path: ".cls-1",
          align: ".cls-1",
          alignOrigin: [0.5, 0.5],
          autoRotate: false,
        },
        duration: 8,
        ease: "none",
      });
    }

    birdMove();

    $(window).on("resize", birdMove);
  });
  //con01 모달창
  let list = document.querySelectorAll(".con01_group li");
  let modal = document.querySelectorAll(".con01 .modal");
  let bg = document.querySelectorAll(".con01 .bg");
  let button = document.querySelectorAll(".con01 .modal button");

  list.forEach((item, index) => {
    // 모달 열기
    item.addEventListener("click", () => {
      modal[index].classList.add("on");
      bg[index].classList.add("on");
    });

    // 모달 닫기
    button[index].addEventListener("click", () => {
      modal[index].classList.remove("on");
      bg[index].classList.remove("on");
    });
  });

  //con03 넓이 조절
  $(".con03 .card").mouseenter(function () {
    $(".con03 .card").removeClass("on");
    $(this).addClass("on");
  });

  $(".con03 .card").mouseleave(function () {
    $(this).removeClass("on");
    $(".card1").addClass("on");
  });

  //con04 글자숨기기
  $("#con04 li").on("click", function () {
    $("#con04 ul p").slideUp();
    $("#con04 i").removeClass("on");
    $(this).find("p").slideToggle();
    $(this).find("i").addClass("on");
  });

  //con05 이미지 페이드
  $(function () {
    let i = 0;
    let total = $(".left li").length;
    start();
    function all() {
      $(".left li").stop().fadeOut();
      $(".left li").eq(i).stop().fadeIn();
    }

    function start() {
      stop = setInterval(function () {
        if (i == total - 1) {
          i = 0;
        } else {
          i++;
        }
        all();
      }, 3000);
    }
  });
});
