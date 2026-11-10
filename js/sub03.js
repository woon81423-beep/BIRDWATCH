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
});
