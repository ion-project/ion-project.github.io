Ion.get(window).on("scroll", function(){
    var scroll = document.body.scrollTop || document.documentElement.scrollTop;

    if(scroll > 0){
        Ion.get(".toolbar").removeClass("no-elevation");
    }
    else{
        Ion.get(".toolbar").addClass("no-elevation");
    }
});