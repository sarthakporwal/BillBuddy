var images = ['../Image/login_image.webp', '../Image/Login_img.jpg', '../Image/Login_img2.jpg', '../Image/Login_img3.jpg']

var img = document.querySelector('.text-center img')

var buttons = document.querySelectorAll('button')
console.log(buttons)

for(var i = 1; i < buttons.length; i++) {
    buttons[i].addEventListener('click', function () {
        buttonClicked = this;
        var text = this.textContent.slice(0,1).toLowerCase();
        changeRegisterPage(text);
    })
}

function changeRegisterPage(character) {
    window.location.href = '../html/register.html';
    switch (character) {
        case "h":
            window.location.href = "../html/homepage.html";
            break;
        case "l" : 
            window.location.href = "../html/login.html";
            break;
        // case "r" :
        //     /* Implement register  logic */
        //     break;
        default:
            break;
    }
}

var i = 0;
setInterval(function () {
    img.src = images[i];
    setTimeout(function () {
        i = (i + 1) % images.length;
    }, 10000)
}, 10000);