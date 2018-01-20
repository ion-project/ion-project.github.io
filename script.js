var currentSection = "", css;

css = [
    "/ion/ion.min.css",
    "/highlight/style.css",
    "/style.min.css"
];

for(let i = 0; i < css.length; i = i + 1){
    var link = document.createElement("link");
    link.href = css[i];
    link.type = "text/css";
    link.rel = "stylesheet";

    document.querySelector("HEAD").appendChild(link);
}

window.onload = function(){
    checkStyleSheets();

    Ion.get(document).on("scroll", function(){
        Ion.get(".section").each(function(){
            if(this.id && this.id != currentSection && (this.offsetTop - scroll) < 60 && (this.offsetTop - scroll) > -60){
                currentSection = this.id;
                history.pushState(null, null, window.location.pathname.replace(/\/$/, "") + "/#" + this.id)
            }
        });
    });   
    
    Ion.get(".tabs").tabs();
}

function checkStyleSheets(){
    var i, loaded = false;

    var interval = setInterval(function(){
        for(i = 0; i < document.styleSheets.length; i = i + 1){
            if(document.styleSheets[i].cssRules.length){
                loaded = true;
            }
            else{
                loaded = false;
                break;
            }
        }

        if(loaded){
            clearInterval(interval);
            document.body.classList.remove("loading");
        }
    }, 10);
}