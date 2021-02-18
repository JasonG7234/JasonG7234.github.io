
var acc = document.getElementsByClassName("accordion"), i;

for (i = 0; i < acc.length; i++) {
    acc[i].addEventListener("click", function() {
        var oldAcc = undefined;
        for (i = 0; i < acc.length; i++) {
            if(acc[i].className.length > 9) {
                oldAcc = acc[i];
                break;
            }
        }
        if(oldAcc && oldAcc != this) {
            var oldPanel = oldAcc.nextElementSibling;
            var oldTabContent = oldPanel.querySelectorAll(".tabcontent");
            for(i = 0; i < oldTabContent.length; i++) {
                if(oldTabContent[i].style.display === "block") {
                    var oldTablinks = oldPanel.querySelector(".tab").querySelectorAll(".tablinks");
                    oldTabContent[i].style.display = "none";
                    oldTablinks[i].classList.toggle("active");
                    break;
                };
            }
            oldPanel.style.display = "none";
            oldAcc.className = "accordion";
        }
        this.classList.toggle("active");
        var panel = this.nextElementSibling;
        if (panel.style.display === "block") {
            panel.style.display = "none";
        } else {
            panel.style.display = "block";
        }
    });
}

function openTab(evt, tabName) {
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tablinks");
    var oldTab = undefined;
    for (i = 0; i < tablinks.length; i++) {
        if(tablinks[i].className.length > 8) {
            oldTab = tablinks[i];
            oldTab.classList.toggle("active");
            break;
        }
    }
    var panel = evt.target.parentElement.parentElement;  
    if (oldTab === evt.target) {
        panel.querySelector(`.${tabName}`).style.display = "none";
    } else {
        panel.querySelector(`.${tabName}`).style.display = "block";
        evt.target.classList.toggle("active");
    }
}
