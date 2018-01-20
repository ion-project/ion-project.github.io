document.getElementById("ion-script").onload = function(){
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
}