$(function () {
   var btns = $(".btn-container button");
   var lbtn = $("#left");
   var rbtn = $("#right");
   var counter = $("#counter");
   var reset = $("#reset");
   var time = $("#timer");
   var startbtn = $("#start");

   var timer;
   var totalTime = 0;
   var count = 0;
   var trials = {
      times1: [],
      times2: [],
      times3: [],
      current: 1
   };

   // Handler for start button
   startbtn.on('click', function () {
      // Hide the start window
      $(this).parent().hide();

      // Start timer
      timer = setInterval(
         function () {
            totalTime++;
            time.text(inSeconds(totalTime));
         }, 10
      );

      // Turn on a button to start with
      turnOn(lbtn);
   });

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

      if (count < 10) {
         trials['times'+trials.current].push(totalTime);
      } else {
         clearInterval(timer);
         trials['times'+trials.current].push(totalTime);
         count = totalTime = 0; // Reset

         // Disable both buttons since completed
         turnOff(lbtn);
         turnOff(rbtn);

         trials.current++;
         if (trials.current == 2) {
            $('.text').html("<h2>Trial 2</h2>");
            shrink(lbtn, rbtn);
            lbtn.css('top', '0');
            lbtn.css('left', '0');
            rbtn.css('top', '100%');
            rbtn.css('right', '0');
         } else if (trials.current == 3) {
            $('.text').html("<h2>Trial 3</h2>");
            shrink(lbtn, rbtn);
            lbtn.css('top', '100%');
            lbtn.css('left', '0');
            rbtn.css('top', '0');
            rbtn.css('right', '0');
         } else {
            var trialHTML = `
               <h2 class='center-txt'>RESULTS<h2>
               <table>
                  <thead>
                     <tr>
                        <th>Click #</th>
                        <th>Stage 1</th>
                        <th>Stage 2</th>
                        <th>Stage 3</th>
                     </tr>
                  </thead>
                  <tbody>
            `;
            var total = [0,0,0];
            trials.times1.forEach(function (trial, i) {
               total[0] += trials.times1[i];
               total[1] += trials.times2[i];
               total[2] += trials.times3[i];

               trialHTML += `
                  <tr>
                     <td>`+(i+1)+`</td>
                     <td>`+inSeconds(trials.times1[i])+`</td>
                     <td>`+inSeconds(trials.times2[i])+`</td>
                     <td>`+inSeconds(trials.times3[i])+`</td>
                  </tr>
               `;
            });
            trialHTML += `
               <tr>
                  <td><b>TOTAL</b></td>
                  <td><b>`+inSeconds(total[0])+`</b></td>
                  <td><b>`+inSeconds(total[1])+`</b></td>
                  <td><b>`+inSeconds(total[2])+`</b></td>
               </tr>
            `;

            trialHTML += `
                  </tbody>
               </table>
            `;

            $('body').html(trialHTML);
         }
         startbtn.parent().show();
      }
   });

   // Reset the timer/count/buttons
   reset.on("click", function () {
      clearInterval(timer);
      count = totalTime = 0;
      trails.current = 1;
      time.text(inSeconds(totalTime));
      counter.text(count);

      turnOn(lbtn);
      turnOn(rbtn);

      // TODO: Remove when completed - testing
      // lbtn.click();
      // rbtn.click();
   });

   // Toggle the disabled attribute on or off
   // @param element - the dom element to toggle
   function turnOn (element) { element.prop('disabled', false); }
   function turnOff (element) { element.prop('disabled', true); }
   function inSeconds (t) { t = t / 100; return t.toFixed(2); }

   // Shrink the button size
   // @param b1 - the first button element
   // @param b2 - the second button element
   function shrink (b1, b2) {
      b1.width(b1.width() / 2);
      b1.height(b1.height() / 2);
      b2.width(b2.width() / 2);
      b2.height(b2.height() / 2);
   }
});
