Leaflet.Control.FullScreen
============

What ?
------

Simple plugin for Leaflet that adds fullscreen button to your maps.

Inspired by http://elidupuis.github.com/leaflet.zoomfs/

Use the native javascript fullscreen API http://johndyer.name/native-fullscreen-javascript-api-plus-jquery-plugin/

Released under the MIT License http://opensource.org/licenses/mit-license.php

How ?
------

Include Control.FullScreen.js and Control.FullScreen.css in your page:

```
 <link rel="stylesheet" href="Control.FullScreen.css" />
 <script src="Control.FullScreen.js"></script>
```

Add the fullscreen control to the map:

```
var map = new L.Map('map');
var fullScreen = new L.Control.FullScreen(); 
map.addControl(fullScreen);
```

Other ways to add fullscreen control to the map:

```
var map = new L.Map('map', {
  fullscreenControl: true
});
```

or

```
var map = new L.Map('map', {
  fullscreenControl: true,
  fullscreenControlOptions: {
    title:"Show me the fullscreen !",
    forceSeparateButton:true
  }
});
```

or


```
L.control.fullscreen({
  position: 'topleft',
  title: 'Show me the fullscreen !'
}).addTo(map);
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

If you don't want to add the Control.FullScreen.css stylesheet to your
HTML-head, Add this style to your css:

```
.leaflet-control-zoom-fullscreen { background-image: url(icon-fullscreen.png); }
```

And add this style to your css if you're using Leaflet < 0.5:

```
.leaflet-control-zoom-fullscreen.last { margin-top: 5px }
```

And this style to get the fullscreen for Chrome
```
.leaflet-container:-webkit-full-screen { width: 100% !important; height: 100% !important; }
```

Where ?
------

Source code : https://github.com/brunob/leaflet.fullscreen

Demo : http://brunob.github.com/leaflet.fullscreen/
