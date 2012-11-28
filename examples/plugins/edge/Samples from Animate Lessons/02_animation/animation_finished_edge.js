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
   gpuAccelerate: true,
   resizeInstances: false,
   content: {
         dom: [
         {
            id:'background',
            type:'image',
            rect:['0','0','500','350','auto','auto'],
            fill:["rgba(0,0,0,0)",im+"background.jpg"]
         },
         {
            id:'RoundRect',
            type:'rect',
            rect:['140','110','220','130','auto','auto'],
            borderRadius:["10px","10px","10px","10px"],
            fill:["rgba(192,192,192,1)"],
            stroke:[0,"rgba(0,0,0,1)","none"],
            transform:[],
            c:[
            {
               id:'Text',
               type:'text',
               rect:['49','51','0','0','auto','auto'],
               text:"Hello World",
               font:['Arial, Helvetica, sans-serif',24,"rgba(0,0,0,1)","normal","none",""],
               transform:[]
            }]
         }],
         symbolInstances: [

         ]
      },
   states: {
      "Base State": {
         "${_Stage}": [
            ["style", "height", '350px'],
            ["style", "width", '500px'],
            ["color", "background-color", 'rgba(255,255,255,1)'],
            ["style", "overflow", 'hidden']
         ],
         "${_RoundRect}": [
            ["style", "top", '110px'],
            ["transform", "rotateZ", '720deg'],
            ["style", "height", '130px'],
            ["style", "left", '-237px'],
            ["style", "width", '220px']
         ],
         "${_Text}": [
            ["style", "top", '51px'],
            ["transform", "scaleY", '0'],
            ["transform", "scaleX", '0'],
            ["style", "opacity", '0'],
            ["style", "left", '49px']
         ]
      }
   },
   timelines: {
      "Default Timeline": {
         fromState: "Base State",
         toState: "",
         duration: 2500,
         autoPlay: true,
         timeline: [
            { id: "eid13", tween: [ "transform", "${_Text}", "scaleY", '1', { fromValue: '0'}], position: 750, duration: 500, easing: "easeOutQuad" },
            { id: "eid9", tween: [ "transform", "${_RoundRect}", "rotateZ", '0deg', { fromValue: '720deg'}], position: 500, duration: 250, easing: "easeOutQuad" },
            { id: "eid15", tween: [ "style", "${_Text}", "opacity", '1', { fromValue: '0'}], position: 750, duration: 500, easing: "easeOutQuad" },
            { id: "eid16", tween: [ "style", "${_Text}", "opacity", '0', { fromValue: '1'}], position: 1750, duration: 500, easing: "easeInQuad" },
            { id: "eid7", tween: [ "style", "${_RoundRect}", "left", '140px', { fromValue: '-237px'}], position: 250, duration: 500, easing: "easeOutQuad" },
            { id: "eid17", tween: [ "style", "${_RoundRect}", "left", '516px', { fromValue: '140px'}], position: 2000, duration: 500, easing: "easeInQuad" },
            { id: "eid11", tween: [ "transform", "${_Text}", "scaleX", '1', { fromValue: '0'}], position: 750, duration: 500, easing: "easeOutQuad" }         ]
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
})(jQuery, AdobeEdge, "EDGE-455333329");
