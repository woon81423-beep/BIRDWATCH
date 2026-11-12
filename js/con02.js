$(function () {
  $(window).on("scroll", function () {
    let sc = $(window).scrollTop();
    // console.log(sc);
    let pg02 = $("#con02").offset().top;

    if (sc >= pg02 - 500) {
      $("#con02 ul li").addClass("on");
    }
  });
});
