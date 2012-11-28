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
            id:'play',
            type:'image',
            rect:['247','160','80','80','auto','auto'],
            fill:["rgba(0,0,0,0)",im+"button.png"],
            transform:[]
         },
         {
            id:'Rectangle',
            type:'rect',
            rect:['212','125','150','150','auto','auto'],
            fill:["rgba(255,177,0,1.00)"],
            stroke:[0,"rgb(0, 0, 0)","none"],
            transform:[]
         },
         {
            id:'Text',
            type:'text',
            rect:['212','142','150','115','auto','auto'],
            text:"1",
            align:"center",
            font:['Arial, Helvetica, sans-serif',100,"rgba(0,0,0,1)","normal","none",""],
            transform:[]
         }],
         symbolInstances: [

         ]
      },
   states: {
      "Base State": {
         "${_Stage}": [
            ["style", "height", '400px'],
            ["color", "background-color", 'rgba(126,167,200,1.00)'],
            ["style", "width", '550px']
         ],
         "${_Rectangle}": [
            ["color", "background-color", 'rgba(255,177,0,1.00)'],
            ["style", "border-top-left-radius", [0,0], {valueTemplate:'@@0@@px @@1@@px'} ],
            ["style", "border-bottom-right-radius", [0,0], {valueTemplate:'@@0@@px @@1@@px'} ],
            ["transform", "scaleX", '0'],
            ["style", "opacity", '0'],
            ["style", "border-top-right-radius", [0,0], {valueTemplate:'@@0@@px @@1@@px'} ],
            ["style", "top", '125px'],
            ["style", "border-bottom-left-radius", [0,0], {valueTemplate:'@@0@@px @@1@@px'} ],
            ["transform", "scaleY", '0'],
            ["transform", "rotateZ", '0deg'],
            ["style", "left", '212px']
         ],
         "${_play}": [
            ["style", "top", '160px'],
            ["style", "opacity", '1'],
            ["style", "left", '247px']
         ],
         "${_Text}": [
            ["style", "top", '142px'],
            ["transform", "scaleY", '0'],
            ["style", "text-align", 'center'],
            ["style", "height", '115px'],
            ["style", "opacity", '0'],
            ["transform", "scaleX", '0'],
            ["style", "font-size", '100px']
         ]
      }
   },
   timelines: {
      "Default Timeline": {
         fromState: "Base State",
         toState: "",
         duration: 2000,
         autoPlay: true,
         labels: {
            "loop": 500
         },
         timeline: [
            { id: "eid21", tween: [ "transform", "${_Rectangle}", "scaleY", '1', { fromValue: '0'}], position: 500, duration: 750 },
            { id: "eid23", tween: [ "transform", "${_Rectangle}", "scaleY", '0', { fromValue: '1'}], position: 1250, duration: 750 },
            { id: "eid20", tween: [ "transform", "${_Rectangle}", "scaleX", '1', { fromValue: '0'}], position: 500, duration: 750 },
            { id: "eid24", tween: [ "transform", "${_Rectangle}", "scaleX", '0', { fromValue: '1'}], position: 1250, duration: 750 },
            { id: "eid1", tween: [ "style", "${_play}", "opacity", '0', { fromValue: '1'}], position: 0, duration: 500 },
            { id: "eid22", tween: [ "style", "${_Rectangle}", "opacity", '1', { fromValue: '0'}], position: 500, duration: 750, easing: "easeOutQuint" },
            { id: "eid25", tween: [ "style", "${_Rectangle}", "opacity", '0', { fromValue: '1'}], position: 1250, duration: 750, easing: "easeInQuint" },
            { id: "eid8", tween: [ "style", "${_Rectangle}", "border-bottom-right-radius", [88,88], { valueTemplate: '@@0@@px @@1@@px', fromValue: [0,0]}], position: 500, duration: 750 },
            { id: "eid9", tween: [ "style", "${_Rectangle}", "border-bottom-right-radius", [0,0], { valueTemplate: '@@0@@px @@1@@px', fromValue: [88,88]}], position: 1250, duration: 750 },
            { id: "eid4", tween: [ "transform", "${_Rectangle}", "rotateZ", '1440deg', { fromValue: '0deg'}], position: 500, duration: 750 },
            { id: "eid11", tween: [ "transform", "${_Rectangle}", "rotateZ", '0deg', { fromValue: '1440deg'}], position: 1250, duration: 750 },
            { id: "eid7", tween: [ "style", "${_Rectangle}", "border-top-right-radius", [88,88], { valueTemplate: '@@0@@px @@1@@px', fromValue: [0,0]}], position: 500, duration: 750 },
            { id: "eid10", tween: [ "style", "${_Rectangle}", "border-top-right-radius", [0,0], { valueTemplate: '@@0@@px @@1@@px', fromValue: [88,88]}], position: 1250, duration: 750 },
            { id: "eid5", tween: [ "style", "${_Rectangle}", "border-bottom-left-radius", [88,88], { valueTemplate: '@@0@@px @@1@@px', fromValue: [0,0]}], position: 500, duration: 750 },
            { id: "eid12", tween: [ "style", "${_Rectangle}", "border-bottom-left-radius", [0,0], { valueTemplate: '@@0@@px @@1@@px', fromValue: [88,88]}], position: 1250, duration: 750 },
            { id: "eid29", tween: [ "transform", "${_Text}", "scaleY", '1', { fromValue: '0'}], position: 500, duration: 750 },
            { id: "eid33", tween: [ "transform", "${_Text}", "scaleY", '0', { fromValue: '1'}], position: 1250, duration: 750 },
            { id: "eid27", tween: [ "transform", "${_Text}", "scaleX", '1', { fromValue: '0'}], position: 500, duration: 750 },
            { id: "eid34", tween: [ "transform", "${_Text}", "scaleX", '0', { fromValue: '1'}], position: 1250, duration: 750 },
            { id: "eid31", tween: [ "style", "${_Text}", "opacity", '1', { fromValue: '0'}], position: 500, duration: 750, easing: "easeOutQuint" },
            { id: "eid32", tween: [ "style", "${_Text}", "opacity", '0', { fromValue: '1'}], position: 1250, duration: 750, easing: "easeInQuint" },
            { id: "eid6", tween: [ "style", "${_Rectangle}", "border-top-left-radius", [88,88], { valueTemplate: '@@0@@px @@1@@px', fromValue: [0,0]}], position: 500, duration: 750 },
            { id: "eid13", tween: [ "style", "${_Rectangle}", "border-top-left-radius", [0,0], { valueTemplate: '@@0@@px @@1@@px', fromValue: [88,88]}], position: 1250, duration: 750 }         ]
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
})(jQuery, AdobeEdge, "EDGE-298358922");
