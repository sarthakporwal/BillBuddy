var index = 0;
var colour = ['color_family', 'color_other', 'color_date', 'color_trip'];
var img_src = ['../Image/family_homepage.png', '../Image/other_homepage.png', '../Image/date.png', '../Image/trip_homepage.png']
var texts = ["with Home Mates", "with Others", "on Date", "on Trip"]

var img = document.querySelector(".col-lg-6 img");
var text = document.querySelector(".col-lg-6 span h2");

console.log(img);
console.log(text);

var i = 0;
for(var i = 0; i < document.querySelectorAll('.btn').length; i++) {
    document.querySelectorAll('.btn')[i].addEventListener("click", function() {
        var buttonClicked = this;
        var temp = buttonClicked.textContent
        console.log(temp.slice(0,1).toLowerCase())
        changePage(temp.slice(0,1).toLowerCase())
    })
}

function changePage(character) {
    window.location.href = "/Users/snehpatel/Desktop/Page1/template/views/home.html";
    switch (character) {
        case "l":
            window.location.replace('/Users/snehpatel/Desktop/Page1/public/html/login.html');
            break;
        case "s":
            window.location.replace('/Users/snehpatel/Desktop/Page1/template/views/signup.hbs');
            break;
        default:
            window.location.replace('/Users/snehpatel/Desktop/Page1/template/views/login.html');
            break;
    }
}

setInterval(function () {
    text.innerHTML = texts[i];
    img.src = img_src[i];
    setTimeout(function () {
        i = (i+1)%4;
    }, 6000)
}, 6000);

