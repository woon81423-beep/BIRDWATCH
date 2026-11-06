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
});
