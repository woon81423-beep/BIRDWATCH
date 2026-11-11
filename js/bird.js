$(function(){
        gsap.to(".circle", {
          ease: "none",
        motionPath: {
          path: ".cls-1",
          align: ".cls-1",
          alignOrigin: [0.5, 0.5],
          autoRotate: false,
        },

        scrollTrigger: {
          trigger: "#bird_move",
          start: "top 50%",
          end: "+=200",
          scrub:15,
          // markers: true,
        },
      });
})