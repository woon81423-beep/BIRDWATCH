$(function () {
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
      x: "200%",
      y: "100%",
      duration: 1,
    })
    .to(".con01_bird", {
      x: "0%",
      y: "250%",
      duration: 1,
    })
    .to(".con01_bird", {
      x: "200%",
      y: "450%",
      duration: 1,
    });
});
