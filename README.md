Leaflet.Control.FullScreen
============

What ?
------

Simple plugin for Leaflet that adds fullscreen button to your maps.

Inspired by http://elidupuis.github.com/leaflet.zoomfs/

Use the native javascript fullscreen API http://johndyer.name/native-fullscreen-javascript-api-plus-jquery-plugin/

How ?
------

Add the fullscreen control to the map:

```
var map = new L.Map('map');
var fullScreen = new L.Control.FullScreen(); 
map.addControl(fullScreen);
```

If your map have a zoomControl the fullscreen button will be added at the bottom of this one.

If your map doesn't have a zoomContron the fullscreen button will be added to topleft corner of the map (same as the zoomcontrol).

Detect fullscreen toggling:

```
map.on('enterFullscreen', function(){
  if(window.console) window.console.log('enterFullscreen');
});

map.on('exitFullscreen', function(){
  if(window.console) window.console.log('exitFullscreen');
});
```

Add this styles to your css :

```
.leaflet-control-zoom-fullscreen { background-image: url(icon-fullscreen.png); }
.leaflet-control-zoom-fullscreen.last { margin-top: 5px }
```

Where ?
------

Source code : https://github.com/brunob/leaflet.fullscreen

Demo : http://brunob.github.com/leaflet.fullscreen/
