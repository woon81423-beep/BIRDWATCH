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
  gsap.from(".con04_wrap", {
    scrollTrigger: {
      trigger: "#con04",
      start: "-=300 top",
      scrub: 1,
    },
    y: 200,
    ease: "back.out",
    duration: 1,
    opacity: 0,
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
});
