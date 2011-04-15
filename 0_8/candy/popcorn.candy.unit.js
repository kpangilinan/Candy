test("Popcorn Candy Plugin", function () {
  
  var popped = Popcorn('#video'),
      expects = 4, 
      count = 0,
      theiFrame = document.getElementsByTagName('iframe'),
      video = document.getElementById('video');

  expect(expects);
  
  function plus() {
    if ( ++count===expects) {
      start();
    }
  }
   
  ok ('candy' in popped, "candy is a method of the popped instance");
  plus();
  
  equals (theiFrame.length, 0, "initially, there is no iframes on the page" );
  plus();
  
  popped.candy({
      start: 0, // seconds
      end: 5, // seconds
      filter: 'rotate'
    })
    
    .candy({
      start: 5, // seconds
      end: 10, // seconds
      filter: 'rgb|100|0|0'
    })
  .volume(0);
  
  popped.exec( 0, function() {
    ok (!!theiFrame[0], "iframe was created" );
    plus();
  });

  popped.exec( 2, function() {
    ok (video.style.display === 'none');
    plus();
  });

  
  popped.play();
});
