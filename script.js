Ion.get(window).on("scroll", function(){
    var scroll = document.body.scrollTop || document.documentElement.scrollTop,
        logo = Ion.get(".logo"),
        logoMini = Ion.get(".logo-mini"),
        video = Ion.get("video");

    if(scroll > 0){
        Ion.get(".toolbar").removeClass("no-elevation");
    }
    else{
        Ion.get(".toolbar").addClass("no-elevation");
    }

    if(logo[0].offsetTop - scroll < 0){
        logo.addClass("animated");
        logoMini.removeClass("hidden");
        
        video[0].pause();
    }
    else{
        logo.removeClass("animated");
        logoMini.addClass("hidden");

        video[0].play();
    }
})