$(function () {
  // 마우스
  $(document).on("mousemove", function (e) {
    $(".cursor").css({ left: `${e.clientX}px`, top: `${e.clientY}px` });
  });
  $(".txt01, .txt03").on("mouseenter", function () {
    $(".cursor").addClass("on");
  });
  $(".txt01, .txt03").on("mouseleave", function () {
    $(".cursor").removeClass("on");
  });
  // 맨위로
  $(window).on("scroll", function () {
    let sc = $(this).scrollTop();
    if (sc >= 500) {
      $(".sc_top").show();
    } else {
      $(".sc_top").hide();
    }
  });

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
