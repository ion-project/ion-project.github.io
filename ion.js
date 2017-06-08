"use strict";

var Ion = new IonFramework();

function IonFramework(){
    const DURATION = {
        in: 225,
        out: 195,
        ripple: 425
    }
    var hideRipple = null, 
        hideFlatRipple = null,
        hideTooltip = null,
        lastMouseMoveTarget = null,
        closeMenu = null,
        addChip = null,
        selectChip = null,
        clickChip = null,

        Navbar = function(){

            this.toggle = function(){
                toggleNavbar();
            }

            this.show = function(){
                showNavbar();
            }

            this.hide = function(){
                hideNavbar();
            }
        },

        getNavbar = function(){
            var $navbar = document.querySelector(".navbar");

            if(!$navbar){
                $navbar = document.createElement("ASIDE");
                $navbar.className = "navbar";

                document.body.insertBefore($navbar, document.body.children[0]);

                window.getComputedStyle($navbar).transform;
            }

            return $navbar;
        },

        toggleNavbar = function(){
            var $navbar = getNavbar();
            var $overlay;

            if($navbar.classList.toggle("show")){
                Ion.overlay(true);

                $overlay = document.getElementById("overlay");

                $overlay.addEventListener("click", toggleNavbar);
            }
            else{
                Ion.overlay(false);

                $overlay = document.getElementById("overlay");

                $overlay.removeEventListener("click", toggleNavbar);
            }
        },

        showNavbar = function(){
            var $navbar = getNavbar();

            Ion.overlay(true);
            var $overlay = document.getElementById("overlay");

            $overlay.addEventListener("click", toggleNavbar);

            $navbar.classList.add("show");
        },

        hideNavbar = function(){
            var $navbar = getNavbar();
            var $overlay = document.getElementById("overlay");
            
            $overlay.removeEventListener("click", toggleNavbar);

            Ion.overlay(false);

            $navbar.classList.remove("show");
        },

        responsiveDialog = function(){
            var dialog = document.querySelector(".dialog");
            var dialogContent = dialog.querySelector(".content");

            dialog.style.marginTop = - dialog.offsetHeight / 2 + "px"; 
            dialog.style.marginLeft = - dialog.offsetWidth / 2 + "px";

            if(dialogContent.scrollHeight > dialogContent.offsetHeight){
                dialogContent.classList.add("scrollable");
            }
            else{
                dialogContent.classList.remove("scrollable");
            }
        },

        closeDialog = function(){
            var $dialog = document.querySelector(".dialog");

            Ion.overlay(false);

            $dialog.classList.remove("show");

            setTimeout(function(){
                $dialog.remove();
                window.removeEventListener("resize", responsiveDialog);
            }, DURATION.in);
        },
        
        chipInput = function(event){
            addChip(event);
        },
        
        chipClick = function(event){
            selectChip(event);
        },
        
        chipEvents = function(event){
            clickChip(event);
        };

    this.getPosition = function($element){
        var position = {x: 0, y: 0};

        if(typeof $element.getBoundingClientRect === "undefined"){
            position.x = $element.getBoundingClientRect().left;
            position.y = $element.getBoundingClientRect().top;
        }
        else{
            while($element){
                position.x = position.x + ($element.offsetLeft - $element.scrollLeft + $element.clientLeft);
                position.y = position.y + ($element.offsetTop - $element.scrollTop + $element.clientTop);

                $element = $element.offsetParent;
            }
        }

        return position;
    }

    this.stopPropagation = function(event){
        event.stopPropagation();
    }

    this.matches = function($element, selector){
        if($element.matches || $element.matchesSelector || $element.webkitMatchesSelector || $element.mozMatchesSelector || $element.msMatchesSelector || $element.oMatchesSelector){
            return ($element.matches || $element.matchesSelector || $element.webkitMatchesSelector || $element.mozMatchesSelector || $element.msMatchesSelector || $element.oMatchesSelector).call($element, selector);
        }

        return false;
    }

    this.parents = function($element, selector){
        do{
            if(this.matches($element, selector)){
                return $element;
            }
            $element = $element.parentNode;
        }
        while($element);
    }

    this.path = function(event, selector){
        if(event.path){
            for(var i = 0; i < event.path.length; i = i + 1){
                if(this.matches(event.path[i], selector)){
                    return event.path[i];
                }
            }
            return false;
        }
        else{
            return this.parents(event.target, selector);
        }
    }

    this.search = function(array, key, filter){
        var results = [];

        if(filter != ""){
            for(var i = 0; i < array.length; i = i + 1){
                if(Array.isArray(key)){
                    for(var j = 0; j < key.length; j = j + 1){
                        if(array[i][key[j]] && array[i][key[j]].toLowerCase().indexOf(filter.toLowerCase()) > -1){
                            results.push(array[i]);
                            break;
                        }
                    }
                }
                else{
                    if(array[i][key] && array[i][key].toLowerCase().indexOf(filter.toLowerCase()) > -1){
                        results.push(array[i]);
                    }
                }
            }
        }

        return results;
    }

    this.ripple = function($element){
        var properties = {x: 0, y: 0, scale: 0};
        var wave = document.createElement("SPAN");

        var position = this.getPosition($element.target);
    
        properties.scale = Math.max($element.target.clientWidth, $element.target.clientHeight);
        properties.x = $element.clientX - position.x - properties.scale / 2;
        properties.y = $element.clientY - position.y - properties.scale / 2;
        
        wave.className = "wave";
        wave.style.top = properties.y + "px";
        wave.style.left = properties.x + "px";
        wave.style.width = properties.scale + "px";
        wave.style.height = properties.scale + "px";

        $element.target.appendChild(wave);

        window.getComputedStyle(wave).transform;
        wave.style.transform = "scale(3)";

        hideRipple = function(){
            if(wave){
                wave.style.opacity = "0";
                wave.style.transform = "scale(3)";
                document.removeEventListener("mouseup", hideRipple);
                $element.target.removeEventListener("mouseleave", hideRipple);

                setTimeout(function(){
                    wave.remove();
                }, DURATION.ripple);
            }
        }

        document.addEventListener("mouseup", hideRipple);
        $element.target.addEventListener("mouseleave", hideRipple);
    }

    this.flatRipple = function($element){
        var wave = document.createElement("SPAN");
        
        wave.className = "wave";

        $element.target.appendChild(wave);

        window.getComputedStyle(wave).transform;
        wave.style.transform = "scale(1)";

        hideFlatRipple = function(){
            if(wave){
                wave.style.opacity = "0";
                wave.style.transform = "scale(1)";
                document.removeEventListener("mouseup", hideFlatRipple);
                $element.target.removeEventListener("mouseleave", hideFlatRipple);

                setTimeout(function(){
                    wave.remove();
                }, DURATION.out);
            }
        }

        document.addEventListener("mouseup", hideFlatRipple);
        $element.target.addEventListener("mouseleave", hideFlatRipple);
    }

    this.tooltip = function(event){
        if(event.target != lastMouseMoveTarget){
            lastMouseMoveTarget = event.target;

            var position = this.getPosition(event.target);
            var orientation = event.target.getAttribute("data-position");
            var $tooltip = document.createElement("DIV");

            $tooltip.className = "tooltip";
            $tooltip.innerHTML = event.target.getAttribute("data-tooltip");

            switch(orientation){
                case "top":
                    $tooltip.className = $tooltip.className + " top";
                break;
                case "right":
                    $tooltip.className = $tooltip.className + " right";
                break;
                case "left":
                    $tooltip.className = $tooltip.className + " left";
                break;
                default:
                    $tooltip.className = $tooltip.className + " bottom";
                break;
            }

            document.body.appendChild($tooltip);

            switch(orientation){
                case "top":
                    position.x = position.x + event.target.offsetWidth / 2 - $tooltip.offsetWidth / 2;
                    position.y = position.y - $tooltip.offsetHeight;
                break;
                case "right":
                    position.x = position.x + event.target.offsetWidth;
                    position.y = position.y + event.target.offsetHeight / 2 - $tooltip.offsetHeight / 2;
                break;
                case "left":
                    position.x = position.x - $tooltip.offsetWidth;
                    position.y = position.y + event.target.offsetHeight / 2 - $tooltip.offsetHeight / 2;
                break;
                default:
                    position.x = position.x + event.target.offsetWidth / 2 - $tooltip.offsetWidth / 2;
                    position.y = position.y + event.target.offsetHeight;
                break;
            }

            $tooltip.style.top = position.y + document.body.scrollTop + "px";
            $tooltip.style.left = position.x + document.body.scrollLeft + "px";

            window.getComputedStyle($tooltip).opacity;

            $tooltip.classList.add("show");

            hideTooltip = function(){
                $tooltip.classList.remove("show");
                event.target.removeEventListener("mouseout", hideTooltip);

                lastMouseMoveTarget = null;

                setTimeout(function(){
                    $tooltip.remove();
                }, DURATION.out);
            }

            event.target.addEventListener("mouseout", hideTooltip);
        }
    }

    this.input = function($input){
        if($input.value != ""){
            $input.classList.add("active");
        }
        else{
            $input.classList.remove("active");
        }
    }

    this.card = function(event){
        var cards = document.getElementsByClassName("card");
        var $card = this.parents(event.target, ".card");

        for(var i = 0; i < cards.length; i = i + 1){
            cards[i].classList.remove("active");
        }

        if($card){
            $card.classList.add("active");
        }
    }

    this.toast = function(data){
        if(!data.text){
            data.text = "";
        }
        if(!data.duration){
            data.duration = 3000;
        }

        var toasts = document.getElementsByClassName("toasts");
        var toast = document.querySelector(".toast");
        var $toastContainer = null;
        var $toast = document.createElement("DIV");
        
        $toast.className = "toast";
        $toast.innerHTML = data.text;

        if(toasts.length){
            $toastContainer = toasts[0];
        }
        else{
            $toastContainer = document.createElement("DIV");
            $toastContainer.className = "toasts";

            document.body.appendChild($toastContainer);
        }

        if(toast){
            toast.classList.remove("show");
            setTimeout(function(){
                toast.remove();
                newToast();
            }, DURATION.out);
        }
        else{
            newToast();
        }

        function newToast(){
            $toastContainer.appendChild($toast);
            window.getComputedStyle($toast).transform;
            $toast.classList.add("show");

            setTimeout(function(){
                if($toast){
                    $toast.classList.remove("show");
                    setTimeout(function(){
                        $toast.remove();
                    }, DURATION.out);
                }
            }, data.duration);
        }
    }

    this.menu = function(event, $element){
        event.stopPropagation();

        var $menu = $element.parentNode;

        if($menu.classList.contains("menu")){
            $menu.classList.add("show");
        }
        
        closeMenu = function(){
            if(event.target != $menu.querySelector(".content")){
                $menu.classList.remove("show");
            }
            document.removeEventListener("click", closeMenu);
        }

        document.addEventListener("click", closeMenu);
    }

    this.overlay = function(toggle){
        var $overlay = document.getElementById("overlay");

        if(toggle){
            document.body.classList.add("fixed");

            if($overlay){
                $overlay.style.display = "block";
                $overlay.classList.add("show");
            }
            else{
                var $newOverlay = document.createElement("DIV");
                $newOverlay.id = "overlay";

                $newOverlay.style.display = "block";
                document.body.appendChild($newOverlay);

                window.getComputedStyle($newOverlay).opacity;

                $newOverlay.className = "show";
            }

            return true;
        }
        else{
            document.body.classList.remove("fixed");

            if($overlay){
                $overlay.classList.remove("show");
                
                setTimeout(function(){
                    $overlay.style.display = "none";
                }, DURATION.in);
            }
        }
    }

    this.dialog = function(data){
        if(data){
            var $dialog = document.createElement("DIV");
            $dialog.className = "dialog";

            if(data.title){
                var header = document.createElement("HEADER");
                var title = document.createElement("H1");
                title.innerHTML = data.title;
                title.className = "title";

                header.appendChild(title);

                if(data.subtitle){
                    var subtitle = document.createElement("P");
                    subtitle.innerHTML = data.subtitle;
                    subtitle.className = "subheading";

                    header.appendChild(subtitle);
                }

                $dialog.appendChild(header);
            }
            if(data.content){
                var content = document.createElement("DIV");
                content.className = "content";

                content.innerHTML = data.content;

                $dialog.appendChild(content);
            }
            if(data.affirmativeText || data.dismissiveText){
                var group = document.createElement("DIV");
                group.className = "group";

                if(data.affirmativeText){
                    var affirmative = document.createElement("BUTTON");
                    affirmative.className = "button flat";

                    affirmative.innerHTML = data.affirmativeText;

                    group.appendChild(affirmative);
                }
                if(data.dismissiveText){
                    var dismissive = document.createElement("BUTTON");
                    dismissive.className = "button flat";

                    dismissive.innerHTML = data.dismissiveText;

                    group.appendChild(dismissive);
                }

                $dialog.appendChild(group);
            }
            if(data.class){
                $dialog.classList.add(data.class);
            }

            if(this.overlay(true)){
                var $overlay = document.getElementById("overlay");

                $overlay.appendChild($dialog);

                responsiveDialog();

                window.getComputedStyle($dialog).opacity;

                $dialog.classList.add("show");

                $overlay.addEventListener("click", closeDialog);

                $dialog.addEventListener("click", this.stopPropagation);

                window.addEventListener("resize", responsiveDialog);

            }
        }
        else{
            return false;
        }
    }

    this.navbar = function(){
        var navbarFn = new Navbar();

        navbarFn.toggle();

        return navbarFn;
    }

    this.expansionPanel = function($element){
        var $content = $element.querySelector(".content");
        
        if($content){
            var contentHeight = 0;

            if($element.classList.contains("active")){
                $content.style.height = "0px";

                setTimeout(function(){
                    $element.classList.remove("active");
                }, DURATION.in);
            }
            else{
                $content.style.height = "auto";

                $element.classList.add("active");
                contentHeight = $content.offsetHeight;
                $content.style.height = "0px";

                window.getComputedStyle($content).height;

                $content.style.height = contentHeight + "px";
            }

            if(this.parents($element, ".expansion-panel")){
                document.body.scrollTop = $element.offsetTop;
            }
        }
    }

    this.tabs = function(selector){
        var $tabs = document.querySelector(selector);

        if($tabs){
            var $tab = $tabs.getElementsByClassName("tab");
            var $active = $tabs.querySelector(".tab.active");
            var $indicator = getIndicator();

            if($tab.length){
                if(!$active){
                    $active = $tab[0];
                }

                getTabContent($tabs.getAttribute("data-tabs"), $active.getAttribute("data-tab-id"));

                indicatorPosition();
                window.addEventListener("resize", indicatorPosition);

                function indicatorPosition(){
                    $indicator.style.left = $active.getBoundingClientRect().left + $tabs.scrollLeft - $tabs.getBoundingClientRect().left + "px";
                    $indicator.style.right = getIndicatorRight() + "px";
                }
            }
        }
        else{
            return false;
        }

        function getIndicator(){
            var $indicator = $tabs.querySelector(".indicator");

            if(!$indicator){
                $indicator = document.createElement("SPAN");
                $indicator.className = "indicator";

                $tabs.appendChild($indicator);
            }

            return $indicator;
        }

        function getIndicatorRight(){
            return $tabs.getBoundingClientRect().right - $tabs.scrollLeft - $active.getBoundingClientRect().right;
        }

        function getTabContent(context, id){
            var $tabContent;

            context = document.getElementById("tabs-content");

            for(var i = 0; i < context.children.length; i = i + 1){
                context.children[i].classList.remove("show");
            }

            if(context){
                $tabContent = document.getElementById(id);

                if($tabContent){
                    $tabContent.classList.add("show");
                }
            }
        }

        $tabs.addEventListener("click", function(e){
            if(e.target && e.target.classList.contains("tab")){
                var tabsContent = this.getAttribute("data-tabs");

                if(this.querySelector(".tab.active").getBoundingClientRect().left > e.target.getBoundingClientRect().left){
                    $indicator.classList.remove("left");
                    $indicator.classList.add("right");
                }
                else{
                    $indicator.classList.remove("right");
                    $indicator.classList.add("left");
                }

                this.querySelector(".tab.active").classList.remove("active");

                e.target.classList.add("active");

                getTabContent(tabsContent, e.target.getAttribute("data-tab-id"));

                $active = $tabs.querySelector(".tab.active");

                $indicator.style.left =  e.target.getBoundingClientRect().left + this.scrollLeft - this.getBoundingClientRect().left + "px";
                $indicator.style.right = getIndicatorRight() + "px";
            }
        });
    }

    this.searchbar = {
        fixed: function($event){
            var $searchbar = Ion.parents($event.target, ".searchbar.fixed");

            if($searchbar.classList.toggle("show")){
                $searchbar.querySelector(".search-field INPUT").focus();
            }
            else{
                $searchbar.querySelector(".search-field INPUT").blur();
            }
        }
    }

    this.chips = function($chips){
        $chips = document.querySelector($chips);

        if($chips){
            var content = $chips.getElementsByClassName("content")[0], 
                chipsAutocompleteData = null,
                chipsAutocomplete,
                chipsItem = null,
                chipsImg = null,
                chipsContent,
                chipsText = null,
                chipsSubtitle = null;

            if(!content){
                content = document.createElement("DIV");
                content.className = "content";
                $chips.appendChild(content);
            }

            var input = content.getElementsByTagName("INPUT")[0],
                lastInputLength = input.value.length;

            if(!input){
                input = document.createElement("INPUT");
                input.type = "text";
                content.appendChild(input);
            }

            addChip = function(event){
                var selectedChip = content.querySelector(".list .item.active");

                if(event.keyCode == 13){
                    if(selectedChip){
                        createChip({
                            img: selectedChip.chipData.img,
                            text: selectedChip.chipData.text,
                            subtitle: selectedChip.chipData.subtitle,
                            deletable: selectedChip.chipData.deletable
                        });
                    }
                    else{
                        createChip({
                            text: event.target.value,
                            deletable: true
                        });
                    }

                    event.target.value = "";
                }

                if(event.keyCode == 8 && !input.value.length){
                    var lastChip = $chips.getElementsByClassName("chip");
                    if(lastChip.length){

                        if($chips.onDelete){
                            $chips.onDelete();
                        }

                        lastChip[lastChip.length - 1].remove();
                    }
                }

                if($chips.chips.autocomplete){
                    var autocompleteList = null,
                        autocompleteItem = null;

                    chipsAutocomplete = content.getElementsByClassName("list")[0];
                    chipsAutocompleteData = Ion.search($chips.chips.autocomplete, ["text", "subtitle"], event.target.value);

                    if(chipsAutocompleteData.length && input.value.length >= $chips.chips.minlengthSearch){
                        if(lastInputLength != input.value.length){
                            chipsAutocomplete.innerHTML = "";

                            for(var i = 0; i < chipsAutocompleteData.length; i = i + 1){

                                if($chips.chips && $chips.chips.autocompleteLimit && i >= $chips.chips.autocompleteLimit){
                                    break;
                                }

                                chipsItem = document.createElement("LI");
                                chipsItem.className = "item";
                                chipsItem.chipData = {};
                                chipsContent = document.createElement("DIV");
                                chipsContent.className = "content single-line";

                                if(chipsAutocompleteData[i].img){
                                    chipsImg = document.createElement("IMG");
                                    chipsImg.src = chipsAutocompleteData[i].img;
                                    chipsItem.chipData.img = chipsAutocompleteData[i].img;
                                    chipsItem.appendChild(chipsImg);
                                }
                                if(chipsAutocompleteData[i].text){
                                    chipsText = document.createElement("P");
                                    chipsText.innerHTML = chipsAutocompleteData[i].text;
                                    chipsItem.chipData.text = chipsAutocompleteData[i].text;
                                    chipsContent.appendChild(chipsText);
                                }
                                if(chipsAutocompleteData[i].subtitle){
                                    chipsSubtitle = document.createElement("P");
                                    chipsSubtitle.className = "body-1";
                                    chipsSubtitle.innerHTML = chipsAutocompleteData[i].subtitle;
                                    chipsItem.chipData.subtitle = chipsAutocompleteData[i].subtitle;
                                    chipsContent.appendChild(chipsSubtitle);
                                }
                                if(chipsAutocompleteData[i].deletable){
                                    chipsItem.chipData.deletable = true;
                                    chipsItem.setAttribute("data-deletable", "true");
                                }
                                
                                chipsItem.appendChild(chipsContent);
                                chipsAutocomplete.appendChild(chipsItem);
                            }

                            chipsAutocomplete.classList.add("show");
                        }

                        autocompleteList = $chips.getElementsByClassName("list")[0];

                        if(autocompleteList.classList.contains("show")){
                            if(event.keyCode == 38){
                                autocompleteItem = autocompleteList.getElementsByClassName("active");

                                if(autocompleteItem[0] && autocompleteItem[0].previousElementSibling){
                                    autocompleteItem[0].previousElementSibling.classList.add("active");
                                    autocompleteItem[1].classList.remove("active");
                                }
                                else if(autocompleteItem[0]){
                                    autocompleteItem[0].classList.remove("active");
                                }

                                event.preventDefault();
                            }
                            else if(event.keyCode == 40){
                                autocompleteItem = autocompleteList.getElementsByClassName("active");

                                if(autocompleteItem[0] && autocompleteItem[0].nextElementSibling){
                                    autocompleteItem[0].nextElementSibling.classList.add("active");
                                    autocompleteItem[0].classList.remove("active");
                                }
                                else{
                                    if(autocompleteItem[0]){
                                        autocompleteItem[0].classList.remove("active");
                                    }
                                    autocompleteList.getElementsByClassName("item")[0].classList.add("active");
                                }
                            }
                        }
                    }
                    else{
                        chipsAutocomplete.classList.remove("show");
                    }

                    lastInputLength = input.value.length;
                }
            }

            function createChip(chip){
                var newChip,
                    newChipImg,
                    newChipText,
                    newChipDeletable;

                newChip = document.createElement("DIV");
                newChip.className = "chip";

                if(chip.img){
                    newChipImg = document.createElement("IMG");
                    newChipImg.src = chip.img;
                    newChip.appendChild(newChipImg);
                }
                if(chip.text){
                    newChipText = document.createElement("SPAN");
                    newChipText.innerHTML = chip.text;
                    newChip.appendChild(newChipText);
                }
                if(chip.subtitle){
                    newChip.setAttribute("data-subtitle", chip.subtitle);
                }
                if(chip.deletable){
                    newChipDeletable = document.createElement("I");
                    newChipDeletable.className = "icon";
                    newChipDeletable.innerHTML = "&#xE5CD;";
                    newChip.appendChild(newChipDeletable);
                }

                if($chips.onBeforeAdd){
                    $chips.onBeforeAdd(newChip);
                }

                content.insertBefore(newChip, input);

                if($chips.onAfterAdd){
                    $chips.onAfterAdd(newChip);
                }
            }

            clickChip = function(event){
                if(event.target.classList.contains("icon")){

                    if($chips.onDelete){
                        $chips.onDelete();
                    }

                    Ion.path(event, ".chip").remove();
                }
            }

            $chips.addEventListener("click", chipEvents);
            input.addEventListener("keydown", chipInput);

            return new function(){
                this.data = function(data){
                    if(data.placeholder){
                        input.placeholder = data.placeholder;
                    }

                    if(data.autocomplete){
                        $chips.chips = {};
                        $chips.chips.autocomplete = data.autocomplete.sort(function(a, b){
                            var compare = a.text.localeCompare(b.text);

                            if(compare > 0){
                                return 1;
                            }
                            else if(compare < 0){
                                return -1;
                            }
                            else{
                                return 0;
                            }
                        });

                        if(!content.getElementsByClassName("list")[0]){
                            var chipsList = document.createElement("UL");
                            chipsList.className = "list";
                            content.appendChild(chipsList);
                        }

                        selectChip = function(event){
                            var item = Ion.path(event, ".item");
                            if(item){
                                createChip({
                                    img: item.chipData.img,
                                    text: item.chipData.text,
                                    subtitle: item.chipData.subtitle,
                                    deletable: item.chipData.deletable
                                });

                                input.value = "";
                                chipsList.classList.remove("show");
                            }
                        }
                        
                        chipsList.addEventListener("click", chipClick);
                    }

                    if(data.limit){
                        $chips.chips.autocompleteLimit = data.limit;
                    }

                    if(data.minlengthSearch){
                        $chips.chips.minlengthSearch = data.minlengthSearch;
                    }
                    else{
                        $chips.chips.minlengthSearch = 0;
                    }
                }

                this.on = function(event, callback){
                    switch(event){
                        case "beforeAdd":
                            $chips.onBeforeAdd = callback;
                        break;
                        case "afterAdd":
                            $chips.onAfterAdd = callback;
                        break;
                        case "delete":
                            $chips.onDelete = callback;
                        break;
                        case "select":
                            $chips.onSelect = callback;
                        break;
                        case "selectAutocomplete":
                            $chips.onSelectAutocomplete = callback;
                        break;
                    }
                }

                this.get = function(){
                    var data = [],
                    chipContent = null,
                    chipText = null,
                    chipImage = null,
                    chipDeletable = null,
                    chip = content.getElementsByClassName("chip");

                    for(var i = 0; i < chip.length; i = i + 1){
                        chipContent = {};
                        chipText = chip[i].getElementsByTagName("SPAN");
                        chipImage = chip[i].getElementsByTagName("IMG");
                        chipDeletable = chip[i].getElementsByClassName("icon");

                        if(chipText[0]){
                            chipContent.text = chipText[0].innerText;
                        }

                        if(chipImage[0]){
                            chipContent.img = chipImage[0].src;
                        }

                        if(chipDeletable[0]){
                            chipContent.deletable = true;
                        }
                        else{
                            chipContent.deletable = false;
                        }

                        data.push(chipContent);
                    }

                    return data;
                }
            }
        }
        else{
            return false;
        }
    }
}

document.addEventListener("click", function(e){
    Ion.card(e);

    if(e.target && (e.target.nodeName == "A" && Ion.matches(e.target.parentNode, ".item.expansion"))){
        Ion.expansionPanel(e.target.parentNode);
    }

    if(e.target && e.target.nodeName == "HEADER" && Ion.path(e, ".expansion-panel")){
        Ion.expansionPanel(Ion.path(e, ".item"));
    }

    if(e.target && e.target.classList.contains("icon") && Ion.parents(e.target, ".searchbar.fixed")){
        Ion.searchbar.fixed(e);
    }
});

document.addEventListener("mousedown", function(e){
    if(e.target && (e.target.classList.contains("ripple") || e.target.classList.contains("button") || e.target.classList.contains("tab"))){
        Ion.ripple(e);
    }
    if(e.target && (e.target.classList.contains("radial") || e.target.classList.contains("radio") || e.target.classList.contains("checkbox"))){
        Ion.flatRipple(e);
    }
});

document.addEventListener("mousemove", function(e){
    if(e.target && e.target.getAttribute("data-tooltip")){
        Ion.tooltip(e);
    }
});

document.addEventListener("blur", function(e){
    if(e.target && e.target.nodeName == "INPUT"){
        Ion.input(e.target);
    }
}, true);