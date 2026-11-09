$(function () {
  $(window).on("scroll", function () {
    let sc = $(this).scrollTop();
    let pg04 = $(".con04_wrap").offset().top;
    if (sc >= pg04 - 500) {
      $(".con04_wrap").stop().animate({ top: "0px", opacity: "1" });
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
