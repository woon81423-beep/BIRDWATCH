$(function () {
  // con04
  let con04_stop;
  function con04Ctr() {
    con04_stop = setInterval(function () {
      $(".con04_txt li").eq(0).appendTo(".con04_txt");
      $(".con04_img li").eq(0).appendTo(".con04_img");
    }, 3000);
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
