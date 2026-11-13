$(function () {
  function res() {
    ScrollTrigger.getAll().forEach((trigger) => trigger.kill());

    let w = $(window).width();
    if (w > 769) {
    }
    ScrollTrigger.refresh();
  }
  res();

  $(window).on("resize", function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
      res();
    }, 200);
  });
  // 비쥬얼
  // gsap.from("#visual h2", {
  //   x: "-100%",
  //   y: "-100%",
  //   opacity: 0,
  //   duration: 2,
  // });
  let visualText = "우리가 지켜야 할 하늘의 길,";
  var k = 0;
  function vt() {
    if (k < visualText.length) {
      $("#visual h2 span").append(visualText.charAt(k));
      k++;
      setTimeout(vt, 200);
    }
  }
  vt();
  gsap
    .timeline({
      scrollTrigger: {
        trigger: "#visual",
        start: "top top",
      },
    })
    .from("#visual p", {
      y: 300,
      duration: 2,
      opacity: 0,
    })
    .from("#visual img", { y: 300, duration: 1, opacity: 0 });

  // con01
  gsap.from(".con01_wrap", {
    scrollTrigger: {
      trigger: "#con01",
      start: "-=300 top",
      // scrub: 1,
    },
    y: 200,
    opacity: 0,
    duration: 2,
  });
  setInterval(function () {
    $(".con01_wrap li").eq(0).appendTo(".con01_wrap");
  }, 3000);
  // con02
  gsap
    .timeline({
      scrollTrigger: {
        trigger: "#con02",
        start: "-=100 top",
      },
    })
    .to(".con02_bird", {
      x: "250%",
      y: "120%",
      ease: "bounce.out",
      duration: 2,
    })
    .to(".con02_bird p", { opacity: 1 }, 2)
    .to(".con02_btn", { y: -400 });

  $(".con02_btn").on("click", () => {
    $(".con02_bird").toggle();
    $(".con02_bg").stop().toggleClass("on");
    $(".con02_btn").stop().toggleClass("on");
    let con02_text = $(".con02_btn").html();
    console.log(con02_text);
    if (con02_text === `새를 구해주셔서<br>감사합니다`) {
      $(".con02_btn").html(
        `클 릭<br />10cm X 4cm 패턴 규칙<br>새들을 구하세요`,
      );
    } else {
      $(".con02_btn").html("새를 구해주셔서<br>감사합니다");
    }
  });

  // con03
  gsap.from(".con03_wrap li", {
    scrollTrigger: {
      trigger: "#con03",
      start: "-=300 top",
    },
    y: 200,
    ease: "back.out",
    duration: 1,
    opacity: 0,
  });
  $(".con03_wrap li").on("mouseenter", function () {
    $(".con03_wrap li").stop().removeClass("on");
    $(this).stop().addClass("on");
    $(this)
      .find(".con03_txt")
      .stop()
      .animate({ top: "50%", opacity: "1" }, 1500);
  });
  $(".con03_wrap li").on("mouseleave", function () {
    $(".con03_txt").stop().css({ top: "100%", opacity: "0" });
  });

  // con04
  let con04Timer;
  function con04Rolling() {
    con04Timer = setInterval(function () {
      $(".con04_wrap li").eq(0).appendTo(".con04_wrap");
    }, 1500);
  }

  con04Rolling();
  $(".con04_wrap li").on("click", function () {
    clearInterval(con04Timer);
    let j = $(this).index();
    $(".con04_modalBg").addClass("on");
    $(".con04_video li").removeClass("on");
    $(".con04_video li").eq(j).addClass("on");
  });
  $(".con04_modal button").on("click", function () {
    $(".con04_modalBg").removeClass("on");
    con04Rolling();
  });
  //   con05
  gsap.from(".con05_wrap", {
    scrollTrigger: {
      trigger: "#con05",
      start: "-=300 top",
      scrub: 1,
    },
    y: 200,
    ease: "back.out",
    duration: 1,
    opacity: 0,
  });
  let i = 1;
  setInterval(function () {
    if (i == 4) {
      i = 0;
    }
    $(".con05_img li").removeClass("on");
    $(".con05_img li").eq(i).addClass("on");
    $(".con05_txt li").removeClass("on");
    $(".con05_txt li").eq(i).addClass("on");
    i++;
  }, 1500);
  // con06
  gsap.from(".con06_wrap", {
    scrollTrigger: {
      trigger: "#con06",
      start: "-=300 top",
      scrub: 1,
    },
    y: 200,
    ease: "back.out",
    duration: 1,
    opacity: 0,
  });
});
