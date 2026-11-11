$(function () {
  // 마우스
  $(document).on("mousemove", function (e) {
    $(".cursor").css({ left: `${e.clientX}px`, top: `${e.clientY}px` });
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
  // 서브메뉴
  $(".header_lnb").on("click", function () {
    $(".header_lnb i").toggleClass("on");
    $(".header_gnb").toggle();
    $("#visual h2").toggle();
    $("#visual p").toggle();
  });
});
