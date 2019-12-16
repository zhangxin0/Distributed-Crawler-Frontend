var address = 0;
var port = 0;
var seed = 0;
var interval = 0;

var Start = document.getElementById('Start');
Start.addEventListener('click', function(){
    address = document.getElementById('input_address').value;
    port = document.getElementById('input_port').value;
    seed = document.getElementById('input_seed').value;

    // set cycling:
    // http://books.toscrape.com/
    interval = setInterval(function(){ $(function(){
      $.ajax({
        url: 'http://' + address + ':' + port + '/api/assign-seed',  // Interface1 : "address + port" 
        type:'POST',
        contentType: 'application/json',
        data: '{ "url":\"'+ seed + '\"}',
        success: function() {
          $.ajax({
            url: 'http://' + address + ':' + port + '/api/start',  // Interface1 : "address + port" 
            type:'get'
          });
        }
      });
      
      $.ajax({
          url: 'http://' + address + ':' + port + '/api/get-slaves',  // Interface1 : "address + port" 
          type:'get',
          dataType:'json',
          success:function(data){
              var size = Object.keys(data).length

              $("#tabletest tr:not(:first)").empty();

              for(i = 0; i < size; i++) 
              {
                  var tr;
                  tr='<td>'+i+'</td>' + '<td>'+data[i.toString()].nodeName+'</td>'+'<td>'+data[i.toString()].nodePort+'</td>'+'<td>'+data[i.toString()].nodeAddress+'</td>'
                  $("#tabletest").append('<tr>'+tr+'</tr>')
              }
          }
      })
    });

    // Draw chart:
    var labels_display =new Array();
    var datasets_display = new Array();
    var borderColor_display = new Array();
    var backgroundColor_display = new Array();
    
    $(function(){
      $.ajax({
        url: 'http://' + address + ':' + port + '/api/inspect-slaves', // Interface 2 : 
        type:'get',
        dataType:'json',
        success:function(data){
          var size = Object.keys(data).length;

            for(i = 0; i < size; i++) 
            {
                var index = i.toString()
                labels_display[i] = data[index].nodeName;
                datasets_display[i] = data[index].nodeCount;
                var arr = new Array(Math.floor(Math.random() * 255),Math.floor(Math.random() * 255),Math.floor(Math.random() * 255),0.2)
                var r = (0).toString();
                var g = (128).toString();
                var b = (128).toString();
                borderColor_display[i] = 'rgba('+ r + ',' + g + ',' + b + ',' + '1' + ')';
                backgroundColor_display[i] = 'rgba('+ r + ',' + g + ',' + b + ',' + '0.2' + ')';
            };
            let massPopChart = new Chart(myChart,{
              type:'line', // bar, pie, line, doughnut, radar, polarArea, horizentalBar
              data:{
                labels: labels_display,
                datasets: [{
                    label: '# of Urls Distributed to Each Nodes',
                    data: datasets_display,
                    borderColor: borderColor_display,
                    backgroundColor: backgroundColor_display,
                    borderWidth: 1
                }]
              },
              options: {
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true
                        }
                    }]
                }
            }
         });     
        }
      })
      //
    }); }, 1500);
    
});




var Stop = document.getElementById('Stop');
Stop.addEventListener('click', function(){
  clearInterval(interval);
  $(function(){
    $.ajax({
      url: 'http://' + address + ':' + port + '/api/stop',  // Interface1 : "address + port" 
      type:'get',
    });
  }
)});

