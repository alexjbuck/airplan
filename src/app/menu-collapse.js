$("#menu-collapse").on("click", () => {
  $("#list").css("width", $(window).width() / 2); //set menu width here
});

$("#close-menu").on("click", () => {
  $("#list").css("width", 0);
});
