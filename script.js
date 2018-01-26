var currentSection = "", css, cssLoaded = 0;

css = [
    "/ion/ion.min.css",
    "/highlight/style.css",
    "/style.min.css"
];

window.onload = function(){
    loadStyleSheets();

    Ion.get(document).on("scroll", function(){
        var scroll = document.body.scrollTop || document.documentElement.scrollTop;
        
        Ion.get(".section").each(function(){
            if(this.id && this.id != currentSection && (this.offsetTop - scroll) < 50 && (this.offsetTop - scroll) > -50){
                currentSection = this.id;
                history.pushState(null, null, window.location.pathname.replace(/\/$/, "") + "/#" + this.id)
            }
        });
    });
}

function loadStyleSheets(){
    for(let i = 0; i < css.length; i = i + 1){
        var link = document.createElement("link");
        link.href = css[i];
        link.type = "text/css";
        link.rel = "stylesheet";
    
        document.querySelector("HEAD").appendChild(link);

        link.onload = function(){
            checkStyleSheets();
        }
    }
}

function checkStyleSheets(){
    cssLoaded = cssLoaded + 1;

    if(cssLoaded >= css.length){
        document.body.classList.remove("loading");
        
        Ion.get(".tabs").tabs();
    }
}