document.getElementById("ion-script").onload = function(){
    Ion.get(document).on("scroll", function(){
        var scroll = document.body.scrollTop || document.documentElement.scrollTop,
            logo = Ion.get(".logo"),
            logoMini = Ion.get(".logo-mini");
    
        if(scroll > 0){
            Ion.get(".toolbar.shadow-transition").removeClass("no-elevation");
        }
        else{
            Ion.get(".toolbar.shadow-transition").addClass("no-elevation");
        }
    
        if(logo[0]){
            if(logo[0].offsetTop - scroll < 0){
                logo.addClass("animated");
                logoMini.removeClass("hidden");
            }
            else{
                logo.removeClass("animated");
                logoMini.addClass("hidden");
            }
        }
    });
}