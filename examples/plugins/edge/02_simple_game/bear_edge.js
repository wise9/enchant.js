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
            id:'bear',
            type:'image',
            rect:['7','7','79px','79px','auto','auto'],
            fill:["rgba(0,0,0,0)",im+"bear.png",'0px','0px']
         }],
         symbolInstances: [

         ]
      },
   states: {
      "Base State": {
         "${_Stage}": [
            ["color", "background-color", 'rgba(255,255,255,0)'],
            ["style", "width", '550px'],
            ["style", "height", '400px'],
            ["style", "overflow", 'hidden']
         ],
         "${_bear}": [
            ["style", "height", '79.29296875px'],
            ["style", "top", '0px'],
            ["style", "left", '0px'],
            ["style", "width", '79.3515625px']
         ]
      }
   },
   timelines: {
      "Default Timeline": {
         fromState: "Base State",
         toState: "",
         duration: 11000,
         autoPlay: true,
         timeline: [
            { id: "eid30", tween: [ "style", "${_bear}", "top", '320.72px', { fromValue: '0px'}], position: 1000, duration: 1000 },
            { id: "eid32", tween: [ "style", "${_bear}", "top", '0px', { fromValue: '320.72px'}], position: 3000, duration: 1000 },
            { id: "eid34", tween: [ "style", "${_bear}", "top", '320.72px', { fromValue: '0px'}], position: 4000, duration: 1500 },
            { id: "eid37", tween: [ "style", "${_bear}", "top", '0px', { fromValue: '320.72px'}], position: 6000, duration: 1500 },
            { id: "eid43", tween: [ "style", "${_bear}", "top", '200px', { fromValue: '0px'}], position: 7500, duration: 500 },
            { id: "eid51", tween: [ "style", "${_bear}", "top", '0px', { fromValue: '200px'}], position: 9000, duration: 1000 },
            { id: "eid53", tween: [ "style", "${_bear}", "top", '160px', { fromValue: '0px'}], position: 10000, duration: 500, easing: "easeInCubic" },
            { id: "eid55", tween: [ "style", "${_bear}", "top", '0px', { fromValue: '160px'}], position: 10500, duration: 500, easing: "easeOutQuad" },
            { id: "eid29", tween: [ "style", "${_bear}", "left", '470.65px', { fromValue: '0px'}], position: 0, duration: 1000 },
            { id: "eid31", tween: [ "style", "${_bear}", "left", '0px', { fromValue: '470.65px'}], position: 2000, duration: 1000 },
            { id: "eid33", tween: [ "style", "${_bear}", "left", '470.65px', { fromValue: '0px'}], position: 4000, duration: 1500 },
            { id: "eid40", tween: [ "style", "${_bear}", "left", '0px', { fromValue: '470.65px'}], position: 5500, duration: 500 },
            { id: "eid41", tween: [ "style", "${_bear}", "left", '470.65px', { fromValue: '0px'}], position: 6000, duration: 1500 },
            { id: "eid42", tween: [ "style", "${_bear}", "left", '0px', { fromValue: '470.65px'}], position: 7500, duration: 500 },
            { id: "eid44", tween: [ "style", "${_bear}", "left", '470.65px', { fromValue: '0px'}], position: 8000, duration: 1000 },
            { id: "eid50", tween: [ "style", "${_bear}", "left", '0px', { fromValue: '470.65px'}], position: 9000, duration: 1000 },
            { id: "eid52", tween: [ "style", "${_bear}", "left", '235px', { fromValue: '0px'}], position: 10000, duration: 500, easing: "easeInCubic" },
            { id: "eid54", tween: [ "style", "${_bear}", "left", '470.65px', { fromValue: '235px'}], position: 10500, duration: 500, easing: "easeOutQuad" }         ]
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
})(jQuery, AdobeEdge, "EDGE-62789179");
