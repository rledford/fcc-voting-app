(function () {
   var tbl = document.getElementById('pollTable'),
      pollAPI = '/api/v1/polls';

   function updatePollTable (poll) {
      tbl.insertRow(-1).innerHTML = "<a href='/poll/"+poll._id+"'>"+poll.title+"</a>";
   }


   function getPollList () {
      var xmlhttp = new XMLHttpRequest();
      xmlhttp.onreadystatechange = function () {
         if (xmlhttp.readyState === 4 && xmlhttp.status === 200){
            console.log(xmlhttp.response);
            var items = JSON.parse(xmlhttp.response);
            items.forEach( function (poll) {
               updatePollTable(poll);
            });
         }
      };
      xmlhttp.open('GET', pollAPI, true);
      xmlhttp.send();
   }

   document.addEventListener('DOMContentLoaded', getPollList(), false);

})();
