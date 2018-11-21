import 'jquery/dist/jquery.min';
import 'bootstrap/dist/js/bootstrap.bundle';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/js/dist/popover.js';
import 'ol/MapBrowserEventType';
import 'ol/ol.css';
import {
  Map,
  View,
  Overlay
} from 'ol';
//import Overlay from 'ol';
import {
  toStringHDMS
} from 'ol/coordinate';
import {Tile as TileLayer,Vector as VectorLayer} from 'ol/layer';
import {OSM,Vector as VectorSource} from 'ol/source';

import {
  fromLonLat,
  toLonLat
} from 'ol/proj';

import {Draw,Modify} from 'ol/interaction.js';
import { LineString, Polygon } from 'ol/geom';
import { Circle as CircleStyle, Fill, Stroke, Style } from 'ol/style';



var layer = new TileLayer({
  source: new OSM()
});

//var mapCenter = [0,0];
//var pos = fromLonLat([16.3725, 48.208889]);
var pos = fromLonLat([76.87403794962249, 8.569385045000772]);
console.log(pos);
var viewOne = new View({
  center: pos,
  zoom: 18
})

var source =  new VectorSource({wrapX: false});

var vector = new VectorLayer({
    source: source,
    style: new Style({
        fill: new Fill({
            //color: 'rgba(255, 255, 255, 0.2)'
            color: 'red'
        }),
        stroke: new Stroke({
            color: '#ffcc33',
            width: 2
        }),
        image: new CircleStyle({
            radius: 7,
            fill: new Fill({
                color: '#ffcc33'
            })
        })
    })
});


var  draw = new Draw({
    source: source,
    type: ('LineString'),
    style: new Style({
        fill: new Fill({
            //color: 'rgba(255, 255, 255, 0.2)'
            color: 'red'
        }),
        stroke: new Stroke({
            color: 'rgba(0, 0, 0, 0.5)',
            //lineDash: [10, 10],
            width: 4
        }),
        image: new CircleStyle({
            radius: 4,
            stroke: new Stroke({
                //color: 'rgba(0, 0, 0, 0.7)'
                color: 'red'
            }),
            fill: new Fill({
                //color: 'rgba(255, 255, 255, 0.2)'
                color: 'yellow'
            })
        })
    }),
    geometryFunction: customGeometry
});



var map = new Map({
  target: 'map',
  layers: [layer,vector],
  view: viewOne
});

map.addInteraction(draw);

//We have given the zoom and center details in the View declaration
//map.getView().setCenter(pos);
//map.getView().setZoom(10);

// Popup showing the position the user clicked

var popup = new Overlay({
  element: document.getElementById('popup')
});
map.addOverlay(popup);

// Vienna label
var kazha = new Overlay({
  position: pos,
  element: document.getElementById('kazha')
});
map.addOverlay(kazha);

//Vienna Marker
var marker = new Overlay({
  id: 'markerOverlay',
  position: pos,
  positioning: 'center-center',
  element: document.getElementById('marker'),
  stopEvent: true
});
map.addOverlay(marker);


//Making the marker draggable

var markerElement = document.getElementById('marker');

markerElement.addEventListener('mousedown', function (event) {

  function move(event) {

    marker.setPosition(map.getEventCoordinate(event));
  }

  function end(event) {
    window.removeEventListener('mousemove', move);
    window.removeEventListener('mouseup', move);
  }
  window.addEventListener('mousemove', move);
  window.addEventListener('mouseup', end);
})

var element = popup.getElement();

// Adding popover to the map when we click
map.on('click', function (evt) {
  //console.log('clicked!');
  //marker.setPosition(evt.coordinate);
  //console.log(toLonLat(evt.coordinate));
  var coordinate = evt.coordinate;
  var hdms = toStringHDMS(toLonLat(coordinate));
  // map.getView().setCenter(coordinate);
  // map.getView().setZoom(5);

  //popover is a bootstrap plugin
  $(element).popover('destroy');
  popup.setPosition(coordinate);
  $(element).popover({
    placement: 'auto',
    animation: false,
    html: true,
    content: '<p id="locText">The location you clicked is:</p><code id="code1">' + hdms + '</code>'
  });
  //$(element).popover('show');

});

/* map.on('keypress',function(evt){

    var unknown = evt.which;
    console.log(unknown);

});*/

var showKeyOverLay = new Overlay({
    element: document.getElementById('showKey')
  });
  map.addOverlay(showKeyOverLay);

  var showKeyElement = showKeyOverLay.getElement();

$(document).keypress(function(evt)
{

      $(showKeyElement).popover('destroy');

      $(showKeyElement).popover({
        placement: 'auto',
        animation: false,
        html: true,
        content: '<p id="showKeyPara">The value you entered is:</p><code id="code1">' + evt.which + '</code>'
      });
      $(showKeyElement).popover('enable');


    console.log(evt.which);
    });


//adding popover when we click the marker
/*
  * Commenting out this as don't need this now
  * 
  $("#marker").on('click',function(ppt){

    popup.setPosition(map.getEventCoordinate(ppt));

  $(element).popover('show');

  }); 

  */

$("#clearMarker").click(function () {

  //var mark = map.getOverlayById('markerOverlay');
  // map.removeOverlay(mark);
  $("#marker").toggle();
  //marker.setPosition(undefined);

})

function customGeometry(coordinates,geometry)
{
    if (!geometry) {
        geometry = new LineString(coordinates);
} else {
    geometry = geometryFunctionCustom(coordinates, geometry)
}
return geometry;

}


function geometryFunctionCustom(coordinates, geometry)
{


            var len = coordinates.length;
            var customAngle = 0;
            var customLength = 0;
            var rSign = 1;
            
            // remove the hardcorded value while actual one came

             customAngle = 45;
             customLength = 100;

             if (len > 1 && (customAngle > 0 || customLength > 0)) {

                 var secondLast = coordinates[len - 2];
                 var last = coordinates[len - 1];
                 var first = coordinates[0];

                 //
                 // for custom length 
                 var dx1 = secondLast[0] - last[0];
                 var dy1 = secondLast[1] - last[1];

                 // finding active co-ordinate(ac) Angle
                 var acR1 = Math.atan2(dx1, dy1);
                 var acAngle = Math.round(acR1 * (180 / Math.PI));
                 //acAngle = acAngle * -1;
                 //acAngle = (acAngle + 360) % 360;
                 


                 console.log("The angle is :",acAngle);

                 if ((acAngle < 0 && (acAngle < 0 && acAngle >= -89)) || (acAngle > 0 && (acAngle > 0 && acAngle <= 90)))
                 {
                     customAngle = (180 + customAngle);
                     console.log(customAngle);

                 }


                 // setting custom length
                 var line = new LineString([secondLast, last]);
                 var linelength = line.getLength() * 100 / 100;
                 if (customLength == 0) {
                     customLength = linelength;
                 }

                 if (customAngle == 0) {

                     customAngle = acAngle;
                     last[0] = secondLast[0] - (customLength * Math.sin(customAngle * 3.14 / 180.0));
                     last[1] = secondLast[1] - (customLength * Math.cos(customAngle * 3.14 / 180.0));

                 } else {

                     if (len > 2) {
                         // for custom Angle
                         var thirdLast = coordinates[len - 3];
                         var dx2 = secondLast[0] - thirdLast[0];
                         var dy2 = secondLast[1] - thirdLast[1];

                         //finding previous line(pl) Angle
                         var plR2 = Math.atan2(dx2, dy2);
                         var plAngle2 = Math.round(plR2 * (180 / Math.PI));

                         var lastAngle = plAngle2;

                         console.log("The last ange is :", lastAngle);

                         if (dy2 != 0) {
                             if (plAngle2 > 0)
                                 customAngle = plAngle2 + customAngle;
                             else {
                                 customAngle = 360 - (plAngle2 + customAngle);
                             }
                         }
                     }
                     customAngle = (customAngle % 360);
                     last[0] = secondLast[0] + (customLength * Math.cos(customAngle * 3.14 / 180.0));
                     last[1] = secondLast[1] + (customLength * Math.sin(customAngle * 3.14 / 180.0));
                 }
                 coordinates.pop();
                 coordinates.push(last);
             }
        
                 geometry.setCoordinates(coordinates);
        
    
            return geometry;

}
