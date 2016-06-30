var curtime= 0;
var maxtime= 600;
var slidespeakmap= [
  ['Leonard'],
  ['Leonard', 'Leonard', 'Lenard',  'Lenard'],
  ['Lenard',  'Lenard',  'Lenard',  'Leonard'],
  ['Leonard', 'Leonard', 'Lenard',  'Leonard', 'Leonard', 'Lenard',
   'Lenard',  'Lenard',  'Leonard'],
  ['Leonard']
]

var speaksymbolmap= {
  'Leonard' : ['rgb(96, 255, 0)', 'LG'],
  'Lenard' : ['#42affa', 'LW'],
}


function getTimer()
{
  if (curtime < maxtime) curtime++;

  return (curtime/maxtime);
}

Reveal.initialize ({
  controls: false,
  progress: true,
  slideNumber: true,
  history: true,
  center: true,
  transition: 'slide',
});

Reveal.addEventListener( 'slidechanged', function( event ) {
  var state=Reveal.getState();

  if (state.indexh == 1 && state.indexv == 0) {
    curtime= 0;
  }

  // Na. Sieht das eklig aus ?
  setTimeout(function() {
    var parent= document.getElementsByClassName('slide-number')[0]
    var span= document.createElement('span');
    var symbol= speaksymbolmap[slidespeakmap[state.indexh][state.indexv]];

    span.innerText= ' '+symbol[1];

    span.style.color= symbol[0];

    parent.appendChild(span);
  }, 0);



});

hljs.initHighlightingOnLoad();
