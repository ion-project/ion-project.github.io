Ion.get(window).on("scroll", function(){
    var scroll = document.body.scrollTop || document.documentElement.scrollTop,
        logo = Ion.get(".logo");

    if(scroll > 0){
        Ion.get(".toolbar").removeClass("no-elevation");
    }
    else{
        Ion.get(".toolbar").addClass("no-elevation");
    }

    if(logo[0].offsetTop - scroll < 0){
        logo.addClass("animated");
    }
    else{
        logo.removeClass("animated");
    }
})