$(function(){

  // var beacons = '{ "rosa": { "x" : 391 ,  "y": 97 }, "verde1": { "x" : 679 ,  "y": 97 }, "roxo": { "x" : 679 ,  "y": 544 }, "verde2": { "x" : 31 ,  "y": 544 } }';
  var beacons = '{ "ponto1": { "x" : 550 ,  "y": 6022 }, "ponto2": { "x" : 667 ,  "y": 6277 }, "ponto3": { "x" : 1228 ,  "y": 2911 }, "ponto4": { "x" : 1723 ,  "y": 6154 } }';
  window.beacons = JSON.parse(beacons);
  $( ".draggable" ).draggable();

    $(document).on('touchstart click mousedown', '#rotas .voltar', function(){
        $('[data-role=dialog]').dialog( "close" );
    });

  $(document).on("touchstart click mousedown", '#rotas .ui-input-btn',function(e){
      e.preventDefault();

      var s_start = $('#rota_start').val();
      var s_end = $('#rota_end').val();

      var start = window.n[ window.beacons[s_start].x ][ window.beacons[s_start].y ];
      var end = window.n[ window.beacons[s_end].x ][ window.beacons[s_end].y ];

      findRoute( start, end );

      $('.maps').css({ 'top': -parseInt( parseInt(window.beacons[s_start].x) - parseInt(50) ), 'left': -parseInt( parseInt(window.beacons[s_start].y) - parseInt(50) )})

      $('[data-role=dialog]').dialog( "close" );
  });


  var nodes = {};


  window.p = new PathFinding();

  $('#map').load(function(){

    window.canvas = document.createElement('canvas');
    window.ctx = window.canvas.getContext("2d");
    window.w = 9000;
    window.h = 4278;
    window.nodeSize = 3;

    window.canvas.width = w;
    window.canvas.height = h;

    window.ctx.drawImage( this , 0, 0);

    var context = window.canvas.getContext("2d");
    context.drawImage( this , 0, 0);

    var data_route = window.ctx.getImageData(0, 0, window.w, window.h);

    var pos = 0;

    for (var r = 1; r <= h; r += window.nodeSize){

      for (var c = 1; c <= w; c += window.nodeSize){

        if ( data_route.data[pos] == 165 && data_route.data[pos + 1] == 191  && data_route.data[pos + 2] == 221 ){
        // if ( data_route.data[pos + 2] == 221 ){


          if (nodes[r] === undefined){
            nodes[r] = {};
          }

          nodes[r][c] = window.p.addNode(c, r);

          // add vertices
          if (nodes[r][c-window.nodeSize] !== undefined){
            nodes[r][c].addVertex(nodes[r][c-window.nodeSize]);
          }

          if (nodes[r-window.nodeSize] !== undefined && nodes[r-window.nodeSize][c] !== undefined){
            nodes[r][c].addVertex(nodes[r-window.nodeSize][c]);
          }


        }

        pos += 4*window.nodeSize;

      }
      pos += 4*w*2;

    }

    window.n = nodes;
    // console.log( nodes  );
  });



});


function findRoute(start, end){

  $(".maps canvas").remove();


  var route = window.p.Solver(start,end);

  if (route === false){
    alert("No route found");
  }else{

    window.ctx.clearRect(0, 0, window.w, window.h);
    window.ctx.beginPath();
    window.ctx.moveTo(start.x, start.y);

    for (var r = 0, rlen = route.length; r < rlen; r++){
      window.ctx.lineTo(route[r].x,route[r].y);
    }

    window.ctx.lineWidth = 3;
    window.ctx.strokeStyle = '#ff0000';
    window.ctx.stroke();
    $('.maps').append( window.canvas );
  }
}
