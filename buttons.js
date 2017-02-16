$(function () {
   var btns = $(".btn-container button");
   var lbtn = $(".left");
   var rbtn = $(".right");
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
      var className = $(this).prop("class");

      // Determine what button to toggle
      if (className == "right") {
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
            $('.btn-container').hide();
            $('.btn-container.p2').show();

         } else if (trials.current == 3) {
            $('.text').html("<h2>Trial 3</h2>");
            $('.btn-container').hide();
            $('.btn-container.p3').show();
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
            var previous = [0,0,0];
            trials.times1.forEach(function (trial, i) {
               total[0] += trials.times1[i] - previous[0];
               total[1] += trials.times2[i] - previous[1];
               total[2] += trials.times3[i] - previous[2];

               trialHTML += `
                  <tr>
                     <td>`+(i+1)+`</td>
                     <td>`+inSeconds(trials.times1[i] - previous[0])+`</td>
                     <td>`+inSeconds(trials.times2[i] - previous[1])+`</td>
                     <td>`+inSeconds(trials.times3[i] - previous[2])+`</td>
                  </tr>
               `;

               previous[0] = trials.times1[i];
               previous[1] = trials.times2[i];
               previous[2] = trials.times3[i];
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
      trials.current = 1;
      time.text(inSeconds(totalTime));
      counter.text(count);
      $('.text').html("<h2>Trials have been reset</h2>" +
                      "<p> Click between the buttons as fast as you can 10 times.  Your time will be recorded for each click! </p>");
      $(".readyCheck").show();
      turnOn(lbtn);
      turnOff(rbtn);

      $('.btn-container').hide();
      $('.btn-container.p1').show();
   });

   // Toggle the disabled attribute on or off
   // @param element - the dom element to toggle
   function turnOn (element) { element.prop('disabled', false); }
   function turnOff (element) { element.prop('disabled', true); }
   function inSeconds (t) { t = t / 100; return t.toFixed(2); }


});
