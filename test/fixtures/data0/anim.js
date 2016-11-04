var end = function(event){
  console.log("AR", event.type);
};

window.addEventListener("AR_BEGIN", end);
window.addEventListener("AR_END", end);

$(document).ready(function(){
  setTimeout(function(){
    $(window).trigger("AR_BEGIN");
    window.dispatchEvent(new Event("AR_BEGIN"));

    $("#drawing").addClass("animate");
    setTimeout(function(){
      window.dispatchEvent(new Event("AR_END"));
    }, 4000);

  }, 1000);
});