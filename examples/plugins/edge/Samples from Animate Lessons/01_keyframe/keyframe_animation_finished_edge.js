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
            id:'E2',
            type:'image',
            rect:['83','80px','90px','85px','auto','auto'],
            fill:["rgba(0,0,0,0)",im+"E.png",'0px','0px']
         },
         {
            id:'D',
            type:'image',
            rect:['77','163px','96px','85px','auto','auto'],
            fill:["rgba(0,0,0,0)",im+"D.png",'0px','0px']
         },
         {
            id:'G',
            type:'image',
            rect:['79px','246px','97px','89px','auto','auto'],
            fill:["rgba(0,0,0,0)",im+"G.png",'0px','0px']
         },
         {
            id:'shadow',
            type:'image',
            rect:['60px','416px','124px','15px','auto','auto'],
            fill:["rgba(0,0,0,0)",im+"shadow.png",'0px','0px']
         },
         {
            id:'E',
            type:'image',
            rect:['77','331px','90px','85px','auto','auto'],
            fill:["rgba(0,0,0,0)",im+"E.png",'0px','0px']
         }],
         symbolInstances: [

         ]
      },
   states: {
      "Base State": {
         "${_G}": [
            ["style", "top", '-173px'],
            ["style", "left", '79px'],
            ["transform", "rotateZ", '0deg']
         ],
         "${_E2}": [
            ["style", "top", '-339px'],
            ["transform", "rotateZ", '0deg']
         ],
         "${_D}": [
            ["style", "top", '-256px'],
            ["transform", "rotateZ", '0deg']
         ],
         "${_Stage}": [
            ["color", "background-color", 'rgba(255,255,255,1)'],
            ["style", "overflow", 'hidden'],
            ["style", "height", '440px'],
            ["style", "width", '550px']
         ],
         "${_E}": [
            ["style", "top", '-88px'],
            ["transform", "rotateZ", '0deg']
         ],
         "${_shadow}": [
            ["style", "top", '416px'],
            ["transform", "scaleY", '0'],
            ["transform", "rotateZ", '0deg'],
            ["transform", "scaleX", '0'],
            ["style", "left", '60px']
         ]
      }
   },
   timelines: {
      "Default Timeline": {
         fromState: "Base State",
         toState: "",
         duration: 4000,
         autoPlay: true,
         timeline: [
            { id: "eid54", tween: [ "style", "${_E2}", "top", '80px', { fromValue: '-339px'}], position: 3000, duration: 1000, easing: "easeOutBounce" },
            { id: "eid45", tween: [ "transform", "${_shadow}", "scaleX", '1', { fromValue: '0'}], position: 0, duration: 1000, easing: "easeOutBounce" },
            { id: "eid42", tween: [ "transform", "${_E}", "rotateZ", '-10deg', { fromValue: '0deg'}], position: 363, duration: 207, easing: "easeOutBounce" },
            { id: "eid43", tween: [ "transform", "${_E}", "rotateZ", '0deg', { fromValue: '-10deg'}], position: 571, duration: 166, easing: "easeOutBounce" },
            { id: "eid55", tween: [ "transform", "${_E2}", "rotateZ", '-10deg', { fromValue: '0deg'}], position: 3363, duration: 207, easing: "easeOutBounce" },
            { id: "eid56", tween: [ "transform", "${_E2}", "rotateZ", '0deg', { fromValue: '-10deg'}], position: 3571, duration: 166, easing: "easeOutBounce" },
            { id: "eid40", tween: [ "style", "${_E}", "top", '331px', { fromValue: '-88px'}], position: 0, duration: 1000, easing: "easeOutBounce" },
            { id: "eid52", tween: [ "transform", "${_D}", "rotateZ", '-10deg', { fromValue: '0deg'}], position: 2363, duration: 207, easing: "easeOutBounce" },
            { id: "eid53", tween: [ "transform", "${_D}", "rotateZ", '0deg', { fromValue: '-10deg'}], position: 2571, duration: 166, easing: "easeOutBounce" },
            { id: "eid47", tween: [ "transform", "${_shadow}", "scaleY", '1', { fromValue: '0'}], position: 0, duration: 1000, easing: "easeOutBounce" },
            { id: "eid49", tween: [ "transform", "${_G}", "rotateZ", '-10deg', { fromValue: '0deg'}], position: 1363, duration: 207, easing: "easeOutBounce" },
            { id: "eid50", tween: [ "transform", "${_G}", "rotateZ", '0deg', { fromValue: '-10deg'}], position: 1571, duration: 166, easing: "easeOutBounce" },
            { id: "eid51", tween: [ "style", "${_D}", "top", '163px', { fromValue: '-256px'}], position: 2000, duration: 1000, easing: "easeOutBounce" },
            { id: "eid48", tween: [ "style", "${_G}", "top", '246px', { fromValue: '-173px'}], position: 1000, duration: 1000, easing: "easeOutBounce" }         ]
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
})(jQuery, AdobeEdge, "EDGE-109228010");
