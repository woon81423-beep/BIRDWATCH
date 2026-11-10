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
      duration: 1,
      opacity: 0,
    })
    .from(".visual_bg03", {
      y: 300,
      duration: 1,
      opacity: 0,
    });
});
