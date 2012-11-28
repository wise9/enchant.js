/**
 * Adobe Edge: symbol definitions
 */
(function($, Edge, compId){
//images folder
var im='images/';

var fonts = {};


var resources = [
];
var symbols = {
"stage": {
   version: "1.0.0",
   minimumCompatibleVersion: "0.1.7",
   build: "1.0.0.185",
   baseState: "Base State",
   initialState: "Base State",
   gpuAccelerate: false,
   resizeInstances: false,
   content: {
         dom: [
         {
            id:'enchant',
            type:'image',
            rect:['-500px','-500px','100px','100px','auto','auto'],
            fill:["rgba(0,0,0,0)",im+"enchant.png",'0px','0px']
         }],
         symbolInstances: [

         ]
      },
   states: {
      "Base State": {
         "${_Stage}": [
            ["color", "background-color", 'rgba(255,255,255,1)'],
            ["style", "width", '550px'],
            ["style", "height", '400px'],
            ["style", "overflow", 'hidden']
         ],
         "${_enchant}": [
            ["style", "top", '0px'],
            ["transform", "scaleY", '1'],
            ["transform", "rotateZ", '0deg'],
            ["style", "height", '100px'],
            ["transform", "scaleX", '1'],
            ["style", "left", '0px'],
            ["style", "width", '100px']
         ]
      }
   },
   timelines: {
      "Default Timeline": {
         fromState: "Base State",
         toState: "",
         duration: 3000,
         autoPlay: true,
         timeline: [
            { id: "eid14", tween: [ "transform", "${_enchant}", "scaleY", '4', { fromValue: '1'}], position: 2000, duration: 1000, easing: "easeInOutQuad" },
            { id: "eid8", tween: [ "style", "${_enchant}", "left", '225px', { fromValue: '0px'}], position: 0, duration: 2000, easing: "easeInOutQuad" },
            { id: "eid13", tween: [ "transform", "${_enchant}", "scaleX", '4', { fromValue: '1'}], position: 2000, duration: 1000, easing: "easeInOutQuad" },
            { id: "eid9", tween: [ "style", "${_enchant}", "top", '150px', { fromValue: '0px'}], position: 0, duration: 2000, easing: "easeInOutQuad" },
            { id: "eid15", tween: [ "transform", "${_enchant}", "rotateZ", '360deg', { fromValue: '0deg'}], position: 2000, duration: 1000, easing: "easeInOutQuad" }         ]
      }
   }
}
};


Edge.registerCompositionDefn(compId, symbols, fonts, resources);

/**
 * Adobe Edge DOM Ready Event Handler
 */
$(window).ready(function() {
     Edge.launchComposition(compId);
});
})(jQuery, AdobeEdge, "EDGE-17094758");
