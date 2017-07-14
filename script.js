Ion.get(window).on("scroll", function(){
    var scroll = document.body.scrollTop || document.documentElement.scrollTop,
        logo = Ion.get(".logo"),
        logoMini = Ion.get(".logo-mini"),
        video = Ion.get("video");

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
            
            video[0].pause();
        }
        else{
            logo.removeClass("animated");
            logoMini.addClass("hidden");

            video[0].play();
        }
    }
});

Ion.get(".tabs").tabs();

Ion.get(".chips").chips({
    placeholder: "Add a contact",
    autocomplete: [
        {text: "Autocomplete contact", subtitle: "Contact", img: "/img/avatar.jpg"},
        {text: "John Doe", subtitle: "johndoe@email.com", img: "/img/avatar.jpg"},
        {text: "Test", subtitle: "Test contact", img: "/img/avatar.jpg"},
        {text: "Contact2", subtitle: "contact2@email.com", img: "/img/avatar.jpg"},
        {text: "Deletable contact", subtitle: "deletable", img: "/img/avatar.jpg", deletable: true},
    ],
    limit: 4,
    minlengthSearch: 2
});