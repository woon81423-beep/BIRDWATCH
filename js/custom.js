$(function () {
  let resizeTimer;

  function res() {
    ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    let w = $(window).width();

    // 비쥬얼 스크롤 이벤트 함수
    function visualBg() {
      gsap
        .timeline({
          scrollTrigger: {
            trigger: "#visual",
            start: "top top",
            scrub: 2,
            pin: true,
          },
        })
        .from(".visual_bg02", {
          y: 300,
          duration: 3,
          opacity: 0,
        })
        .from(".visual_bg03", {
          y: 300,
          duration: 4,
          opacity: 0,
        })
        .from(".visual_bg04", {
          y: 300,
          duration: 5,
          opacity: 0,
        });
    }
    visualBg();
    if (w >= 1200) {
      gsap
        .timeline({
          scrollTrigger: {
            trigger: "#con01",
            start: "top top",
            scrub: 3,
            pin: true,
          },
        })
        .from(".con01_txt", {
          y: 200,
          duration: 0.5,
          opacity: 0.5,
        })
        .from(".con01_tree", {
          y: 200,
          duration: 0.5,
          opacity: 0.5,
        })
        .to(".con01_bird", {
          x: "300",
          y: "200",
          duration: 1,
        })
        .to(".con01_bird", {
          x: "0",
          y: "500",
          duration: 1,
        })
        .to(".con01_bird", {
          x: "400",
          y: "800",
          duration: 1,
        });
    } else if (w < 1200 && w >= 800) {
      gsap
        .timeline({
          scrollTrigger: {
            trigger: "#con01",
            start: "top top",
            scrub: 3,
            pin: true,
          },
        })
        .from(".con01_txt", {
          y: 200,
          duration: 0.5,
          opacity: 0.5,
        })
        .from(".con01_tree", {
          y: 200,
          duration: 0.5,
          opacity: 0.5,
        })
        .to(".con01_bird", {
          x: "200",
          y: "200",
          duration: 1,
        })
        .to(".con01_bird", {
          x: "0",
          y: "300",
          duration: 1,
        })
        .to(".con01_bird", {
          x: "300",
          y: "600",
          duration: 1,
        });
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
  //   res();
  // $(window).on("resize", function () {
  //   res();
  // });

  $(window).on("scroll", function () {
    let sc = $(this).scrollTop();
    let pg04 = $(".con04_wrap").offset().top;
    if (sc >= pg04 - 500) {
      $(".con04_wrap").stop().animate({ top: "0px", opacity: "1" }, 1000);
    }
  });

  // con04
  let con04_stop;
  function con04Ctr() {
    con04_stop = setInterval(function () {
      $(".con04_txt li").eq(0).appendTo(".con04_txt");
      $(".con04_img li").eq(0).appendTo(".con04_img");
    }, 1500);
  }
  $(".con04_prev").on("click", function () {
    clearInterval(con04_stop);
    $(".con04_txt li").eq(3).prependTo(".con04_txt");
    $(".con04_img li").eq(3).prependTo(".con04_img");
    con04Ctr();
  });
  $(".con04_next").on("click", function () {
    clearInterval(con04_stop);
    $(".con04_txt li").eq(0).appendTo(".con04_txt");
    $(".con04_img li").eq(0).appendTo(".con04_img");
    con04Ctr();
  });
  con04Ctr();
});
