var currentSection = "", css;

css = [
    "ion/ion.min.css",
    "highlight/style.css",
    "style.css"
];

document.body.style.display = "none";

document.onload = function(){
    var i = 0;
    
    for(; i < css.length; i = i + 1){
        var link = document.createElement("link");
        link.href = css[i];
        link.type = "text/css";
        link.rel = "stylesheet";

        Ion.get("head").append(link);
    }

    Ion.get("body").style({display: "block"});
}

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

    Ion.get(".section").each(function(){
        if(this.id && this.id != currentSection && (this.offsetTop - scroll) < 60 && (this.offsetTop - scroll) > -60){
            currentSection = this.id;
            history.pushState(null, null, window.location.pathname.replace(/\/$/, "") + "/#" + this.id)
        }
    });
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