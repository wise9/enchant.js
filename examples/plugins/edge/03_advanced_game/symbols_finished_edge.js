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
            id:'Spin',
            type:'rect',
            rect:['121','153','0','0','auto','auto']
         },
         {
            id:'Spin2',
            type:'rect',
            rect:['299','153','0','0','auto','auto']
         },
         {
            id:'Spin3',
            type:'rect',
            rect:['495','153','0','0','auto','auto']
         }],
         symbolInstances: [
         {
            id:'Spin2',
            symbolName:'Spin'
         },
         {
            id:'Spin',
            symbolName:'Spin'
         },
         {
            id:'Spin3',
            symbolName:'Spin'
         }
         ]
      },
   states: {
      "Base State": {
         "${_Spin3}": [
            ["style", "left", '519px']
         ],
         "${_Spin2}": [
            ["style", "left", '322px']
         ],
         "${_stage}": [
            ["color", "background-color", 'rgba(98,98,98,1.00)'],
            ["style", "height", '333px'],
            ["style", "width", '686px']
         ]
      }
   },
   timelines: {
      "Default Timeline": {
         fromState: "Base State",
         toState: "",
         duration: 1500,
         autoPlay: true,
         timeline: [
            { id: "eid37", trigger: [ function executeSymbolFunction(e, data) { this._executeSymbolAction(e, data); }, ['play', '${_Spin}', [] ], ""], position: 0 },
            { id: "eid38", trigger: [ function executeSymbolFunction(e, data) { this._executeSymbolAction(e, data); }, ['play', '${_Spin2}', [] ], ""], position: 750 },
            { id: "eid39", trigger: [ function executeSymbolFunction(e, data) { this._executeSymbolAction(e, data); }, ['play', '${_Spin3}', [] ], ""], position: 1500 }         ]
      }
   }
},
"Spin": {
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
      rect: [-96,-96,200,200],
      transform: [[0,0]],
      id: 'SpinRect',
      stroke: [0,'rgba(0,0,0,1)','none'],
      type: 'rect',
      fill: ['rgba(0,0,0,0.00)'],
      c: [
      {
         rect: [1,0,60,60],
         borderRadius: ['36px 36px','36px 36px','36px 36px','36px 36px'],
         transform: [[0,0]],
         id: 'Ball1',
         stroke: [0,'rgb(0, 0, 0)','none'],
         type: 'rect',
         fill: ['rgba(243,3,3,1.00)']
      },
      {
         rect: [140,140,60,60],
         borderRadius: ['36px 36px','36px 36px','36px 36px','36px 36px'],
         transform: [[0,0]],
         id: 'Ball2',
         stroke: [0,'rgb(0, 0, 0)','none'],
         type: 'rect',
         fill: ['rgba(243,3,3,1.00)']
      },
      {
         rect: [139,1,60,60],
         borderRadius: ['36px 36px','36px 36px','36px 36px','36px 36px'],
         transform: [[0,0]],
         id: 'Ball3',
         stroke: [0,'rgb(0, 0, 0)','none'],
         type: 'rect',
         fill: ['rgba(243,3,3,1.00)']
      },
      {
         rect: [1,137,60,60],
         borderRadius: ['36px 36px','36px 36px','36px 36px','36px 36px'],
         transform: [[0,0]],
         id: 'Ball4',
         stroke: [0,'rgb(0, 0, 0)','none'],
         type: 'rect',
         fill: ['rgba(243,3,3,1.00)']
      },
      {
         rect: [70,70,60,60],
         borderRadius: ['36px 36px','36px 36px','36px 36px','36px 36px'],
         transform: [[0,0]],
         id: 'Center',
         stroke: [0,'rgb(0, 0, 0)','none'],
         type: 'rect',
         fill: ['rgba(134,143,189,1.00)']
      }]
   }],
   symbolInstances: [
   ]
   },
   states: {
      "Base State": {
         "${_SpinRect}": [
            ["color", "background-color", 'rgba(0,0,0,0.00)'],
            ["style", "top", '-96px'],
            ["transform", "scaleY", '0.04'],
            ["transform", "rotateZ", '0deg'],
            ["transform", "scaleX", '0.04'],
            ["style", "height", '200px'],
            ["style", "left", '-96px'],
            ["style", "width", '200px']
         ],
         "${_Ball2}": [
            ["color", "background-color", 'rgba(243,3,3,1.00)'],
            ["style", "border-top-left-radius", [36,36], {valueTemplate:'@@0@@px @@1@@px'} ],
            ["style", "border-bottom-right-radius", [36,36], {valueTemplate:'@@0@@px @@1@@px'} ],
            ["style", "border-top-right-radius", [36,36], {valueTemplate:'@@0@@px @@1@@px'} ],
            ["style", "width", '60px'],
            ["style", "top", '140px'],
            ["style", "border-bottom-left-radius", [36,36], {valueTemplate:'@@0@@px @@1@@px'} ],
            ["style", "height", '60px'],
            ["style", "left", '140px']
         ],
         "${symbolSelector}": [
            ["style", "height", '8px'],
            ["style", "width", '8px']
         ],
         "${_Ball3}": [
            ["color", "background-color", 'rgba(243,3,3,1.00)'],
            ["style", "border-top-left-radius", [36,36], {valueTemplate:'@@0@@px @@1@@px'} ],
            ["style", "border-bottom-right-radius", [36,36], {valueTemplate:'@@0@@px @@1@@px'} ],
            ["style", "border-top-right-radius", [36,36], {valueTemplate:'@@0@@px @@1@@px'} ],
            ["style", "width", '60px'],
            ["style", "top", '0.76px'],
            ["style", "border-bottom-left-radius", [36,36], {valueTemplate:'@@0@@px @@1@@px'} ],
            ["style", "height", '60px'],
            ["style", "left", '138.9px']
         ],
         "${_Ball1}": [
            ["color", "background-color", 'rgba(243,3,3,1.00)'],
            ["style", "border-top-left-radius", [36,36], {valueTemplate:'@@0@@px @@1@@px'} ],
            ["style", "border-bottom-right-radius", [36,36], {valueTemplate:'@@0@@px @@1@@px'} ],
            ["style", "border-top-right-radius", [36,36], {valueTemplate:'@@0@@px @@1@@px'} ],
            ["style", "width", '60px'],
            ["style", "top", '0px'],
            ["style", "border-bottom-left-radius", [36,36], {valueTemplate:'@@0@@px @@1@@px'} ],
            ["style", "height", '60px'],
            ["style", "left", '0.91px']
         ],
         "${_Ball4}": [
            ["color", "background-color", 'rgba(243,3,3,1.00)'],
            ["style", "border-top-left-radius", [36,36], {valueTemplate:'@@0@@px @@1@@px'} ],
            ["style", "border-bottom-right-radius", [36,36], {valueTemplate:'@@0@@px @@1@@px'} ],
            ["style", "border-top-right-radius", [36,36], {valueTemplate:'@@0@@px @@1@@px'} ],
            ["style", "width", '60px'],
            ["style", "top", '137.66px'],
            ["style", "border-bottom-left-radius", [36,36], {valueTemplate:'@@0@@px @@1@@px'} ],
            ["style", "height", '60px'],
            ["style", "left", '0.16px']
         ],
         "${_Center}": [
            ["style", "top", '70px'],
            ["style", "border-bottom-left-radius", [36,36], {valueTemplate:'@@0@@px @@1@@px'} ],
            ["style", "border-bottom-right-radius", [36,36], {valueTemplate:'@@0@@px @@1@@px'} ],
            ["color", "background-color", 'rgba(90,106,189,1.00)'],
            ["style", "left", '70px'],
            ["style", "border-top-right-radius", [36,36], {valueTemplate:'@@0@@px @@1@@px'} ],
            ["style", "border-top-left-radius", [36,36], {valueTemplate:'@@0@@px @@1@@px'} ]
         ]
      }
   },
   timelines: {
      "Default Timeline": {
         fromState: "Base State",
         toState: "",
         duration: 4000,
         autoPlay: false,
         timeline: [
            { id: "eid14", tween: [ "color", "${_Ball3}", "background-color", 'rgba(241,243,2,1.00)', { animationColorSpace: 'RGB', valueTemplate: undefined, fromValue: 'rgba(243,3,3,1)'}], position: 340, duration: 1410 },
            { id: "eid19", tween: [ "color", "${_Ball3}", "background-color", 'rgba(243,3,3,1)', { animationColorSpace: 'RGB', valueTemplate: undefined, fromValue: 'rgba(241,243,2,1.00)'}], position: 2250, duration: 1410 },
            { id: "eid5", tween: [ "transform", "${_SpinRect}", "rotateZ", '1440deg', { fromValue: '0deg'}], position: 0, duration: 2000, easing: "easeOutQuad" },
            { id: "eid10", tween: [ "transform", "${_SpinRect}", "rotateZ", '0deg', { fromValue: '1440deg'}], position: 2000, duration: 2000, easing: "easeOutQuad" },
            { id: "eid15", tween: [ "color", "${_Ball2}", "background-color", 'rgba(55,243,2,1.00)', { animationColorSpace: 'RGB', valueTemplate: undefined, fromValue: 'rgba(243,3,3,1)'}], position: 340, duration: 1410 },
            { id: "eid18", tween: [ "color", "${_Ball2}", "background-color", 'rgba(243,3,3,1)', { animationColorSpace: 'RGB', valueTemplate: undefined, fromValue: 'rgba(55,243,2,1.00)'}], position: 2250, duration: 1410 },
            { id: "eid16", tween: [ "color", "${_Ball1}", "background-color", 'rgba(243,2,188,1.00)', { animationColorSpace: 'RGB', valueTemplate: undefined, fromValue: 'rgba(243,3,3,1)'}], position: 340, duration: 1410 },
            { id: "eid17", tween: [ "color", "${_Ball1}", "background-color", 'rgba(243,3,3,1)', { animationColorSpace: 'RGB', valueTemplate: undefined, fromValue: 'rgba(243,2,188,1.00)'}], position: 2250, duration: 1410 },
            { id: "eid33", tween: [ "color", "${_Center}", "background-color", 'rgba(255,27,27,1.00)', { animationColorSpace: 'RGB', valueTemplate: undefined, fromValue: 'rgba(90,106,189,1.00)'}], position: 340, duration: 1410 },
            { id: "eid34", tween: [ "color", "${_Center}", "background-color", 'rgba(90,106,189,1.00)', { animationColorSpace: 'RGB', valueTemplate: undefined, fromValue: 'rgba(255,27,27,1.00)'}], position: 2250, duration: 1410 },
            { id: "eid24", tween: [ "transform", "${_SpinRect}", "scaleY", '0.8', { fromValue: '0.04'}], position: 0, duration: 835, easing: "easeOutQuad" },
            { id: "eid26", tween: [ "transform", "${_SpinRect}", "scaleY", '0.04', { fromValue: '0.8'}], position: 1171, duration: 828, easing: "easeInQuad" },
            { id: "eid30", tween: [ "transform", "${_SpinRect}", "scaleY", '0.8', { fromValue: '0.04'}], position: 2000, duration: 855, easing: "easeOutQuad" },
            { id: "eid31", tween: [ "transform", "${_SpinRect}", "scaleY", '0.04', { fromValue: '0.8'}], position: 3150, duration: 849, easing: "easeInQuad" },
            { id: "eid22", tween: [ "transform", "${_SpinRect}", "scaleX", '0.8', { fromValue: '0.04'}], position: 0, duration: 835, easing: "easeOutQuad" },
            { id: "eid25", tween: [ "transform", "${_SpinRect}", "scaleX", '0.04', { fromValue: '0.8'}], position: 1171, duration: 828, easing: "easeInQuad" },
            { id: "eid29", tween: [ "transform", "${_SpinRect}", "scaleX", '0.8', { fromValue: '0.04'}], position: 2000, duration: 855, easing: "easeOutQuad" },
            { id: "eid32", tween: [ "transform", "${_SpinRect}", "scaleX", '0.04', { fromValue: '0.8'}], position: 3150, duration: 849, easing: "easeInQuad" },
            { id: "eid13", tween: [ "color", "${_Ball4}", "background-color", 'rgba(102,2,243,1.00)', { animationColorSpace: 'RGB', valueTemplate: undefined, fromValue: 'rgba(243,3,3,1)'}], position: 340, duration: 1410 },
            { id: "eid20", tween: [ "color", "${_Ball4}", "background-color", 'rgba(243,3,3,1)', { animationColorSpace: 'RGB', valueTemplate: undefined, fromValue: 'rgba(102,2,243,1.00)'}], position: 2250, duration: 1410 }         ]
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
})(jQuery, AdobeEdge, "EDGE-130892631");
