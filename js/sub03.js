$(function () {
  //visual
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

$(".con03 .card").mouseenter(function () {
    $(".con03 .card").removeClass("on");
    $(this).addClass("on");
  });

  $(".con03 .card").mouseleave(function () {
    $(this).removeClass("on");
    $(".card1").addClass("on");
  });

  
});
