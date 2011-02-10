test("Popcorn Candy Plugin", function () {
  
  var popped = Popcorn("#video"),
      expects = 6, 
      count = 0,
      interval,
      interval2;
      //twitterdiv = document.getElementById('twitterdiv');
  
  expect( expects );
  
  function plus() {
    if ( ++count === expects) {
      start();
    }
  }

  stop();   
 
  ok('candy' in popped, "candy is a method of the popped instance");
  plus();
  
  try {
    
    //ok( TWTR, "Twitter constructor exists");
    //plus();
    
  } catch (e) {};

  popped.candy({
    start: 2, // seconds
    end: 12, // seconds
    filter: 'emboss'
  } );
/*
  interval = setInterval( function() {
    if( popped.currentTime() > 1 && popped.currentTime() < 3 ) {
      ok( /display: inline;/.test( twitterdiv.innerHTML ), "Div contents are displayed" );
      plus();
      ok( /twtr-widget/.test( twitterdiv.innerHTML ), "A Twitter widget exists" );
      plus();
      clearInterval( interval );
    }
  }, 500);
  
  interval2 = setInterval( function() {
    if( popped.currentTime() > 3 ) {
      ok( /display: none;/.test( twitterdiv.innerHTML ), "Div contents are hidden again" );
      plus();
      clearInterval( interval2 );
    }
  }, 500);
  */
  popped.play();
  
});
