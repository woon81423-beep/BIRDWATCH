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
  gsap.to(".circle", {
    ease: "none",
    motionPath: {
      path: ".cls-1",
      align: ".cls-1",
      alignOrigin: [0.5, 0.5],
      autoRotate: false,
    },
    duration: 30,
    ease: "none",
    repeat: -1,
  });
  //con01 모달창
  let list = document.querySelectorAll(".con01_group li");
  let modal = document.querySelectorAll(".con01 .modal");
  let bg = document.querySelectorAll(".con01 .bg");
  let button = document.querySelectorAll(".con01 .modal button");

  list.forEach((item, index) => {
    item.addEventListener("click", () => {
      modal[index].classList.add("on");
      bg[index].classList.add("on");
    });

    button[index].addEventListener("click", () => {
      modal[index].classList.remove("on");
      bg[index].classList.remove("on");
    });
  });

  //con01 타이틀
  gsap
    .timeline({
      scrollTrigger: {
        trigger: ".con01",
        start: "top 100%",
        end: "top 10%",
        scrub: 5,
        // markers: true,
      },
    })
    .fromTo(".con01 .my", { x: "-100%", opacity: 0 }, { x: "0%", opacity: 1 })
    .fromTo(
      ".con01 .work",
      { x: "100%", opacity: 0 },
      { x: "0%", opacity: 1 },
      0,
    );
  /* */
  //   gsap
  //       .timeline({
  //         scrollTrigger: {
  //           trigger: ".con01",
  //           start: "top 100%",
  //           end: "top 10%",
  //           scrub: 10,
  //         },
  //       })
  //       .to(".con01", {
  //         backgroundColor: "#000",
  //         color: "#fff",
  //       })
  //       .to(".con01 .title", {
  //         position: "fixed",
  //         left: 0,
  //         top: 0,
  //       });
  // /*나가기 */
  // gsap
  //   .timeline({
  //     scrollTrigger: {
  //       markers: true,
  //       trigger: ".con01",
  //       scrub: 5,
  //       start: "top 20%",
  //       end: "top 0%",
  //     },
  //   })
  //   .to(".con01 .my", { x: "-100%", opacity: 0 }, 0)
  //   .to(".con01 .work", { x: "100%", opacity: 0 }, 0);

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

//자바스크립트
