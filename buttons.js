$(function () {
   var btns = $(".btn-container button");
   var lbtn = $("#left");
   var rbtn = $("#right");
   var counter = $("#counter");
   var reset = $("#reset");
   var time = $("#timer");

   var timer;
   var totalTime = 0;
   var count = 0;

   // Event handler for the button clicks
   btns.on("click", function () {
      var id = $(this).prop("id");

      // Determine what button to toggle
      if (id == "right") {
         // Right was clicked so turn on the left and disable right
         turnOn(lbtn);
         turnOff(rbtn);
      } else {
         // Left was clicked so turn it off and enable right
         turnOn(rbtn);
         turnOff(lbtn)
      }

      count++;
      counter.text(count); // Print the number of clicks to the screen

      if (count == 1) {
         timer = setInterval(
            function () {
               totalTime++;
               time.text(inSeconds(totalTime));
            }, 10
         );
      } else if (count == 10) {
         clearInterval(timer);
         count = totalTime = 0; // Reset

         // Disable both buttons since completed
         turnOff(lbtn);
         turnOff(rbtn);
      }
   });

   // Reset the timer/count/buttons
   reset.on("click", function () {
      clearInterval(timer);
      count = totalTime = 0;
      time.text(inSeconds(totalTime));
      counter.text(count);

      turnOn(lbtn);
      turnOn(rbtn);
   });

   // Toggle the disabled attribute on or off
   // @param element - the dom element to toggle
   function turnOn (element) { element.prop('disabled', false); }
   function turnOff (element) { element.prop('disabled', true); }
   function inSeconds (t) { t = t / 100; return t.toFixed(2); }
});
