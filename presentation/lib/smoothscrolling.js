// http://stackoverflow.com/questions/17722497/scroll-smoothly-to-specific-element-on-page

/* The code is simplified for this application */

function smoothScroll(eID) {
    var startY = 0;

    var elm = document.getElementById(eID);
    var stopY = elm.offsetTop;
    var node = elm;
    while (node.offsetParent && node.offsetParent != document.body) {
        node = node.offsetParent;
        stopY += node.offsetTop;
    }

    var distance = stopY - startY;
    var step = Math.max(Math.round(distance / 5000), 0.3);
    var leapY = startY + step;

    setInterval(function(){

      window.scrollTo(0, leapY);

      if(leapY==stopY){
        //reset
        leapY = startY;
      }

      leapY += step;
      if (leapY > stopY) {
        leapY = stopY;
      }
    }, 20);
}
