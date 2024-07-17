document.addEventListener('DOMContentLoaded', function() {
    fetch('items.txt')
        .then(response => response.text())
        .then(data => {
            const items = data.split('\n'); // Assuming each item is on a new line
            const randomItems = [];
            while(randomItems.length < 5) {
                const index = Math.floor(Math.random() * items.length);
                if(!randomItems.includes(items[index])) {
                    randomItems.push(items[index]);
                }
            }
            const draggableDivs = document.querySelectorAll('.container .draggable');
            randomItems.forEach((item, index) => {
                draggableDivs[index].textContent = item;
            });
        })
        .catch(error => console.error('Error fetching items:', error));
});

var x = document.getElementById('all');
for(var n=0; n<x.children.length; n++) {
    ;(function(c) {
        c.addEventListener('mousedown', function(e) {
            this.style.position = 'fixed'
            var h = window.innerHeight;
            var mousemoveHandler;
            document.addEventListener('mousemove', mousemoveHandler  = function(e) {
                //console.log(e.pageX, e.pageY);
                c.style.top = (e.pageY / h)*100 + "%"
            })
            document.addEventListener('mouseup', function(e) {
                document.removeEventListener('mousemove', mousemoveHandler)
            })
        })
    })(x.children[n])
}


for(var n=0; n<x.children.length; n++) {
    ;(function(c) {
        c.addEventListener('touchstart', function(e) {
            this.style.position = 'fixed'
            var h = window.innerHeight;
            var mousemoveHandler;
            document.addEventListener('touchmove', mousemoveHandler  = function(e) {
                //console.log(e.touches[0].clientX, e.touches[0].clientX);
                c.style.top = (e.touches[0].clientY / h)*100 + "%"
            })
            document.addEventListener('touchend', function(e) {
                document.removeEventListener('touchmove', mousemoveHandler)
            })
        })
    })(x.children[n])
}
