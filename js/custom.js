$(function () {
  function res() {
    ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    let w = $(window).width();
    if (w >= 1200) {
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
});
