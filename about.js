function showAbout(div_id) {
    var icons = document.getElementsByTagName("i");
    for (i = 0; i < icons.length; i++) {
        icons[i].classList.remove("active");
        if (icons[i].className === "fas fa-" + div_id) {
            icons[i].classList.toggle("active");
        }
    }

    var aboutDivs = document.getElementsByClassName("about_div");
    for (i = 0; i < aboutDivs.length; i++) {
        aboutDivs[i].style.display = "none";
    }

    document.getElementById(div_id).style.display = "block";
}