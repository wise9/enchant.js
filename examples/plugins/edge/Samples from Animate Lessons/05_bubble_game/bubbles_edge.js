/**
 * Adobe Edge: symbol definitions
 */
(function($, Edge, compId){
//images folder
var im='images/';

var fonts = {};
   fonts['Homenaje']='<link href=\'http://fonts.googleapis.com/css?family=Homenaje\' rel=\'stylesheet\' type=\'text/css\'>';


var resources = [
];
var symbols = {
"stage": {
   version: "1.0.0",
   minimumCompatibleVersion: "0.1.7",
   build: "1.0.0.180",
   baseState: "Base State",
   initialState: "Base State",
   gpuAccelerate: true,
   resizeInstances: false,
   content: {
         dom: [
         {
            id:'bg',
            type:'image',
            rect:['0','2','1024','680','undefined','undefined'],
            fill:["rgba(0,0,0,0)",im+"bg.jpg"],
            transform:[]
         },
         {
            id:'bg_sym',
            type:'rect',
            rect:['0','0','0','0','undefined','undefined']
         },
         {
            id:'text',
            type:'text',
            rect:['3','133','1022','326','undefined','undefined'],
            text:"pop!",
            align:"center",
            font:['Homenaje',333,"rgba(255,255,255,0.26)","normal","none",""],
            transform:[]
         },
         {
            id:'greenline_sym',
            type:'rect',
            rect:['-1','156','0','0','undefined','undefined'],
            transform:[]
         },
         {
            id:'redline_sym',
            type:'rect',
            rect:['1024','156','0','0','undefined','undefined'],
            transform:[]
         },
         {
            id:'title',
            display:'none',
            type:'text',
            rect:['263','460','505','70','undefined','undefined'],
            text:"bubble noob",
            align:"center",
            font:['Homenaje',30,"rgba(255,255,255,0.2539)","normal","none","normal"],
            transform:[]
         },
         {
            id:'bubblesall_sym',
            type:'rect',
            rect:['539','273','0','0','undefined','undefined']
         },
         {
            id:'reset',
            type:'text',
            rect:['29','17','100','36','undefined','undefined'],
            cursor:['pointer'],
            text:"reset pops",
            align:"right",
            font:['Homenaje',30,"rgba(255,255,255,0.2578)","normal","none","normal"],
            transform:[]
         }],
         symbolInstances: [
         {
            id:'bg_sym',
            symbolName:'bg_sym'
         },
         {
            id:'bubblesall_sym',
            symbolName:'bubblesall_sym'
         },
         {
            id:'redline_sym',
            symbolName:'redline_sym'
         },
         {
            id:'greenline_sym',
            symbolName:'greenline_sym'
         }
         ]
      },
   states: {
      "Base State": {
         "${_bg}": [
            ["style", "left", '-0.99px'],
            ["style", "top", '1.01px']
         ],
         "${_title}": [
            ["style", "top", '459.1px'],
            ["style", "left", '262.01px'],
            ["style", "display", 'none']
         ],
         "${_redline_sym}": [
            ["style", "top", '156px'],
            ["style", "opacity", '1'],
            ["style", "left", '1024px']
         ],
         "${_text}": [
            ["style", "top", '133.56px'],
            ["style", "font-size", '333px'],
            ["style", "text-align", 'center'],
            ["style", "height", '326px'],
            ["color", "color", 'rgba(255,255,255,0.26)'],
            ["style", "font-family", 'Homenaje'],
            ["style", "left", '3px'],
            ["style", "width", '1022px']
         ],
         "${_Stage}": [
            ["style", "height", '680px'],
            ["style", "overflow", 'hidden'],
            ["style", "width", '1024px']
         ],
         "${_reset}": [
            ["style", "top", '16.3px'],
            ["style", "text-align", 'right'],
            ["style", "font-size", '30px'],
            ["style", "height", '36px'],
            ["style", "cursor", 'pointer'],
            ["style", "left", '28.36px'],
            ["style", "width", '100px']
         ],
         "${_bg_sym}": [
            ["style", "opacity", '0.8013698630137']
         ],
         "${_greenline_sym}": [
            ["style", "top", '155.99px'],
            ["style", "opacity", '1'],
            ["style", "left", '1023.99px']
         ]
      }
   },
   timelines: {
      "Default Timeline": {
         fromState: "Base State",
         toState: "",
         duration: 0,
         autoPlay: true,
         timeline: [
            { id: "eid317", tween: [ "style", "${_greenline_sym}", "opacity", '1', { fromValue: '1'}], position: 0, duration: 0, easing: "swing" },
            { id: "eid121", tween: [ "style", "${_bg_sym}", "opacity", '0.8013698630137', { fromValue: '0.8013698630137'}], position: 0, duration: 0 },
            { id: "eid316", tween: [ "style", "${_redline_sym}", "opacity", '1', { fromValue: '1'}], position: 0, duration: 0, easing: "swing" },
            { id: "eid434", tween: [ "style", "${_title}", "display", 'none', { fromValue: 'block'}], position: 0, duration: 0 }         ]
      }
   }
},
"greenline_sym": {
   version: "1.0.0",
   minimumCompatibleVersion: "0.1.7",
   build: "1.0.0.180",
   baseState: "Base State",
   initialState: "Base State",
   gpuAccelerate: true,
   resizeInstances: false,
   content: {
   dom: [
   {
      transform: [[0,0]],
      id: 'greenline1',
      type: 'image',
      rect: [-1024,0,1024,276],
      fill: ['rgba(0,0,0,0)','images/greenline1.png']
   },
   {
      transform: [[0,0]],
      id: 'greenline12',
      type: 'image',
      rect: [3023,-1,1024,276],
      fill: ['rgba(0,0,0,0)','images/greenline1.png']
   },
   {
      transform: [[0,0]],
      id: 'greenline2',
      type: 'image',
      rect: [-1,0,1024,276],
      fill: ['rgba(0,0,0,0)','images/greenline2.png']
   },
   {
      transform: [[0,0]],
      id: 'greenline3',
      type: 'image',
      rect: [1023,0,1024,276],
      fill: ['rgba(0,0,0,0)','images/greenline3.png']
   },
   {
      transform: [[0,0]],
      id: 'greenline4',
      type: 'image',
      rect: [2047,1,978,276],
      fill: ['rgba(0,0,0,0)','images/greenline4.png']
   }],
   symbolInstances: [
   ]
   },
   states: {
      "Base State": {
         "${_greenline4}": [
            ["style", "left", '2046.11px'],
            ["style", "top", '-0.75px']
         ],
         "${_greenline2}": [
            ["style", "left", '-1.26px'],
            ["style", "top", '-0.76px']
         ],
         "${_greenline3}": [
            ["style", "left", '1022.45px'],
            ["style", "top", '-0.76px']
         ],
         "${symbolSelector}": [
            ["style", "height", '276.259995px'],
            ["style", "width", '4048.339997px']
         ],
         "${_greenline12}": [
            ["style", "left", '3023px'],
            ["style", "top", '-1px']
         ],
         "${_greenline1}": [
            ["style", "left", '-1024.24px'],
            ["style", "top", '-1.01px']
         ]
      }
   },
   timelines: {
      "Default Timeline": {
         fromState: "Base State",
         toState: "",
         duration: 5500,
         autoPlay: true,
         timeline: [
            { id: "eid38", tween: [ "style", "${_greenline4}", "left", '-2001.86px', { fromValue: '2046.11px'}], position: 0, duration: 5500 },
            { id: "eid39", tween: [ "style", "${_greenline2}", "left", '-4049.24px', { fromValue: '-1.26px'}], position: 0, duration: 5500 },
            { id: "eid42", tween: [ "style", "${_greenline3}", "left", '-3025.53px', { fromValue: '1022.45px'}], position: 0, duration: 5500 },
            { id: "eid41", tween: [ "style", "${_greenline1}", "left", '-5072.22px', { fromValue: '-1024.24px'}], position: 0, duration: 5500 },
            { id: "eid40", tween: [ "style", "${_greenline12}", "left", '-1025px', { fromValue: '3023px'}], position: 0, duration: 5500 }         ]
      }
   }
},
"redline_sym": {
   version: "1.0.0",
   minimumCompatibleVersion: "0.1.7",
   build: "1.0.0.180",
   baseState: "Base State",
   initialState: "Base State",
   gpuAccelerate: true,
   resizeInstances: false,
   content: {
   dom: [
   {
      transform: [[0,0]],
      id: 'redline12',
      type: 'image',
      rect: [-5074,7,1024,276],
      fill: ['rgba(0,0,0,0)','images/redline1.png']
   },
   {
      transform: [[0,0]],
      id: 'redline2',
      type: 'image',
      rect: [-4050,9,1024,276],
      fill: ['rgba(0,0,0,0)','images/redline2.png']
   },
   {
      transform: [[0,0]],
      id: 'redline3',
      type: 'image',
      rect: [-3024,9,1024,276],
      fill: ['rgba(0,0,0,0)','images/redline3.png']
   },
   {
      transform: [[0,0]],
      id: 'redline4',
      type: 'image',
      rect: [-2002,7,978,276],
      fill: ['rgba(0,0,0,0)','images/redline4.png']
   },
   {
      transform: [[0,0]],
      id: 'redline13',
      type: 'image',
      rect: [-1023,8,1024,276],
      fill: ['rgba(0,0,0,0)','images/redline1.png']
   }],
   symbolInstances: [
   ]
   },
   states: {
      "Base State": {
         "${_redline4}": [
            ["style", "left", '-2002.88px'],
            ["style", "top", '7px']
         ],
         "${_redline3}": [
            ["style", "left", '-3024.79px'],
            ["style", "top", '8.01px']
         ],
         "${symbolSelector}": [
            ["style", "height", '276.259995px'],
            ["style", "width", '4048.339997px']
         ],
         "${_redline12}": [
            ["style", "left", '-5074.59px'],
            ["style", "top", '6.9px']
         ],
         "${_redline13}": [
            ["style", "left", '-1023.99px'],
            ["style", "top", '7.01px']
         ],
         "${_redline2}": [
            ["style", "left", '-4050.8px'],
            ["style", "top", '8.01px']
         ]
      }
   },
   timelines: {
      "Default Timeline": {
         fromState: "Base State",
         toState: "",
         duration: 6500,
         autoPlay: true,
         timeline: [
            { id: "eid104", tween: [ "style", "${_redline4}", "left", '2045.12px', { fromValue: '-2002.88px'}], position: 0, duration: 6500 },
            { id: "eid100", tween: [ "style", "${_redline2}", "left", '-2.78px', { fromValue: '-4050.8px'}], position: 0, duration: 6500 },
            { id: "eid101", tween: [ "style", "${_redline12}", "left", '-1026.56px', { fromValue: '-5074.59px'}], position: 0, duration: 6500 },
            { id: "eid103", tween: [ "style", "${_redline13}", "left", '3023.99px', { fromValue: '-1023.99px'}], position: 0, duration: 6500 },
            { id: "eid102", tween: [ "style", "${_redline3}", "left", '1023.21px', { fromValue: '-3024.79px'}], position: 0, duration: 6500 }         ]
      }
   }
},
"bg_sym": {
   version: "1.0.0",
   minimumCompatibleVersion: "0.1.7",
   build: "1.0.0.180",
   baseState: "Base State",
   initialState: "Base State",
   gpuAccelerate: true,
   resizeInstances: false,
   content: {
   dom: [
   {
      id: 'splotch5_sym',
      type: 'rect',
      rect: [85,-195,0,0],
      transform: [[0,0]]
   },
   {
      id: 'splotch4_sym',
      type: 'rect',
      rect: [616,-148,0,0],
      transform: [[0,0]]
   },
   {
      id: 'splotch3_sym',
      type: 'rect',
      rect: [239,438,0,0],
      transform: [[0,0]]
   },
   {
      id: 'splotch2_sym',
      type: 'rect',
      rect: [675,351,0,0],
      transform: [[0,0]]
   },
   {
      id: 'splotch1_sym',
      type: 'rect',
      rect: [-36,182,0,0],
      transform: [[0,0],{},{},[1.549,1.549]]
   }],
   symbolInstances: [
   {
      id: 'splotch3_sym',
      symbolName: 'splotch3_sym'
   },
   {
      id: 'splotch5_sym',
      symbolName: 'splotch5_sym'
   },
   {
      id: 'splotch4_sym',
      symbolName: 'splotch4_sym'
   },
   {
      id: 'splotch2_sym',
      symbolName: 'splotch2_sym'
   },
   {
      id: 'splotch1_sym',
      symbolName: 'splotch1_sym'
   }   ]
   },
   states: {
      "Base State": {
         "${_splotch1_sym}": [
            ["style", "top", '181.69px'],
            ["style", "left", '-36.9px'],
            ["transform", "scaleY", '1.54'],
            ["transform", "scaleX", '1.54']
         ],
         "${_splotch3_sym}": [
            ["style", "left", '239.04px'],
            ["style", "top", '438.42px']
         ],
         "${symbolSelector}": [
            ["style", "height", '679px'],
            ["style", "width", '1023px']
         ],
         "${_splotch2_sym}": [
            ["style", "left", '675.78px'],
            ["style", "top", '351px']
         ],
         "${_splotch5_sym}": [
            ["style", "left", '85.09px'],
            ["style", "top", '-195.68px']
         ],
         "${_splotch4_sym}": [
            ["style", "left", '616.19px'],
            ["style", "top", '-148.65px']
         ]
      }
   },
   timelines: {
      "Default Timeline": {
         fromState: "Base State",
         toState: "",
         duration: 0,
         autoPlay: true,
         timeline: [
         ]
      }
   }
},
"splotch1_sym": {
   version: "1.0.0",
   minimumCompatibleVersion: "0.1.7",
   build: "1.0.0.180",
   baseState: "Base State",
   initialState: "Base State",
   gpuAccelerate: true,
   resizeInstances: false,
   content: {
   dom: [
   {
      transform: [[0,0]],
      id: 'splotch5',
      type: 'image',
      rect: [0,0,385,385],
      fill: ['rgba(0,0,0,0)','images/splotch5.png']
   }],
   symbolInstances: [
   ]
   },
   states: {
      "Base State": {
         "${_splotch5}": [
            ["style", "top", '0.05px'],
            ["style", "opacity", '0'],
            ["style", "left", '0.46px']
         ],
         "${symbolSelector}": [
            ["style", "height", '384px'],
            ["style", "width", '384px']
         ]
      }
   },
   timelines: {
      "Default Timeline": {
         fromState: "Base State",
         toState: "",
         duration: 6562.5,
         autoPlay: true,
         timeline: [
            { id: "eid80", tween: [ "style", "${_splotch5}", "opacity", '0.55998501712329', { fromValue: '0'}], position: 0, duration: 1562 },
            { id: "eid81", tween: [ "style", "${_splotch5}", "opacity", '0', { fromValue: '0.55998501712329'}], position: 5000, duration: 1562 }         ]
      }
   }
},
"splotch2_sym": {
   version: "1.0.0",
   minimumCompatibleVersion: "0.1.7",
   build: "1.0.0.180",
   baseState: "Base State",
   initialState: "Base State",
   gpuAccelerate: true,
   resizeInstances: false,
   content: {
   dom: [
   {
      transform: [[0,0]],
      id: 'splotch4',
      type: 'image',
      rect: [0,0,385,385],
      fill: ['rgba(0,0,0,0)','images/splotch4.png']
   }],
   symbolInstances: [
   ]
   },
   states: {
      "Base State": {
         "${_splotch4}": [
            ["style", "top", '0.08px'],
            ["style", "opacity", '0'],
            ["style", "left", '0.78px']
         ],
         "${symbolSelector}": [
            ["style", "height", '384px'],
            ["style", "width", '384px']
         ]
      }
   },
   timelines: {
      "Default Timeline": {
         fromState: "Base State",
         toState: "",
         duration: 6750,
         autoPlay: true,
         timeline: [
            { id: "eid79", tween: [ "style", "${_splotch4}", "opacity", '0', { fromValue: '1'}], position: 0, duration: 2250 },
            { id: "eid82", tween: [ "style", "${_splotch4}", "opacity", '1', { fromValue: '0'}], position: 4750, duration: 2000 }         ]
      }
   }
},
"splotch3_sym": {
   version: "1.0.0",
   minimumCompatibleVersion: "0.1.7",
   build: "1.0.0.180",
   baseState: "Base State",
   initialState: "Base State",
   gpuAccelerate: true,
   resizeInstances: false,
   content: {
   dom: [
   {
      id: 'splotch3',
      type: 'image',
      rect: [0,0,405,405],
      fill: ['rgba(0,0,0,0)','images/splotch3.png']
   }],
   symbolInstances: [
   ]
   },
   states: {
      "Base State": {
         "${_splotch3}": [
            ["style", "opacity", '0']
         ],
         "${symbolSelector}": [
            ["style", "height", '404px'],
            ["style", "width", '404px']
         ]
      }
   },
   timelines: {
      "Default Timeline": {
         fromState: "Base State",
         toState: "",
         duration: 8000,
         autoPlay: true,
         timeline: [
            { id: "eid76", tween: [ "style", "${_splotch3}", "opacity", '1', { fromValue: '0'}], position: 0, duration: 2500 },
            { id: "eid77", tween: [ "style", "${_splotch3}", "opacity", '0', { fromValue: '1'}], position: 5500, duration: 2500 }         ]
      }
   }
},
"splotch4_sym": {
   version: "1.0.0",
   minimumCompatibleVersion: "0.1.7",
   build: "1.0.0.180",
   baseState: "Base State",
   initialState: "Base State",
   gpuAccelerate: true,
   resizeInstances: false,
   content: {
   dom: [
   {
      id: 'splotch2',
      type: 'image',
      rect: [0,0,548,548],
      fill: ['rgba(0,0,0,0)','images/splotch2.png']
   }],
   symbolInstances: [
   ]
   },
   states: {
      "Base State": {
         "${_splotch2}": [
            ["style", "opacity", '0']
         ],
         "${symbolSelector}": [
            ["style", "height", '548px'],
            ["style", "width", '548px']
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
            { id: "eid69", tween: [ "style", "${_splotch2}", "opacity", '1', { fromValue: '0'}], position: 0, duration: 1250 },
            { id: "eid73", tween: [ "style", "${_splotch2}", "opacity", '0', { fromValue: '1'}], position: 2750, duration: 1250 }         ]
      }
   }
},
"splotch5_sym": {
   version: "1.0.0",
   minimumCompatibleVersion: "0.1.7",
   build: "1.0.0.180",
   baseState: "Base State",
   initialState: "Base State",
   gpuAccelerate: true,
   resizeInstances: false,
   content: {
   dom: [
   {
      id: 'splotch1',
      type: 'image',
      rect: [0,0,548,547],
      fill: ['rgba(0,0,0,0)','images/splotch1.png']
   }],
   symbolInstances: [
   ]
   },
   states: {
      "Base State": {
         "${_splotch1}": [
            ["style", "opacity", '0']
         ],
         "${symbolSelector}": [
            ["style", "height", '546px'],
            ["style", "width", '548px']
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
            { id: "eid74", tween: [ "style", "${_splotch1}", "opacity", '1', { fromValue: '0'}], position: 0, duration: 1250 },
            { id: "eid75", tween: [ "style", "${_splotch1}", "opacity", '0', { fromValue: '1'}], position: 2750, duration: 1250 }         ]
      }
   }
},
"pop": {
   version: "1.0.0",
   minimumCompatibleVersion: "0.1.7",
   build: "1.0.0.180",
   baseState: "Base State",
   initialState: "Base State",
   gpuAccelerate: true,
   resizeInstances: false,
   content: {
   dom: [
   {
      transform: [[0,0]],
      id: 'burst',
      type: 'image',
      rect: [105,90,222,228],
      fill: ['rgba(0,0,0,0)','images/burst.png']
   },
   {
      transform: [[0,0]],
      id: 'pop',
      type: 'image',
      rect: [0,0,418,419],
      fill: ['rgba(0,0,0,0)','images/pop.png']
   },
   {
      transform: [[0,0]],
      id: 'popCopy',
      type: 'image',
      rect: [0,0,418,419],
      fill: ['rgba(0,0,0,0)','images/pop.png']
   },
   {
      transform: [[0,0]],
      id: 'popCopy2',
      type: 'image',
      rect: [0,0,418,419],
      fill: ['rgba(0,0,0,0)','images/pop.png']
   }],
   symbolInstances: [
   ]
   },
   states: {
      "Base State": {
         "${_popCopy}": [
            ["style", "top", '0.07px'],
            ["transform", "scaleY", '0'],
            ["transform", "scaleX", '0'],
            ["style", "opacity", '0'],
            ["style", "left", '0.45px']
         ],
         "${symbolSelector}": [
            ["style", "height", '418px'],
            ["style", "width", '418px']
         ],
         "${_burst}": [
            ["style", "top", '90.11px'],
            ["transform", "scaleY", '0'],
            ["transform", "scaleX", '0'],
            ["style", "opacity", '0'],
            ["style", "left", '105.17px']
         ],
         "${_popCopy2}": [
            ["style", "top", '0.07px'],
            ["transform", "scaleY", '0'],
            ["transform", "scaleX", '0'],
            ["style", "opacity", '0'],
            ["style", "left", '0.45px']
         ],
         "${_pop}": [
            ["style", "top", '0.07px'],
            ["transform", "scaleY", '0'],
            ["transform", "scaleX", '0'],
            ["style", "opacity", '0'],
            ["style", "left", '0.45px']
         ]
      }
   },
   timelines: {
      "Default Timeline": {
         fromState: "Base State",
         toState: "",
         duration: 250,
         autoPlay: true,
         timeline: [
            { id: "eid156", tween: [ "style", "${_popCopy}", "opacity", '1', { fromValue: '0'}], position: 49, duration: 85, easing: "swing" },
            { id: "eid157", tween: [ "style", "${_popCopy}", "opacity", '0', { fromValue: '1'}], position: 135, duration: 114, easing: "swing" },
            { id: "eid143", tween: [ "transform", "${_pop}", "scaleX", '0.59', { fromValue: '0'}], position: 0, duration: 147, easing: "swing" },
            { id: "eid144", tween: [ "transform", "${_pop}", "scaleY", '0.59', { fromValue: '0'}], position: 0, duration: 147, easing: "swing" },
            { id: "eid158", tween: [ "transform", "${_popCopy}", "scaleX", '0.81', { fromValue: '0'}], position: 49, duration: 200, easing: "swing" },
            { id: "eid134", tween: [ "transform", "${_burst}", "scaleX", '1', { fromValue: '0'}], position: 0, duration: 80 },
            { id: "eid159", tween: [ "transform", "${_popCopy}", "scaleY", '0.81', { fromValue: '0'}], position: 49, duration: 200, easing: "swing" },
            { id: "eid137", tween: [ "style", "${_burst}", "opacity", '0.52183219178082', { fromValue: '0'}], position: 0, duration: 80 },
            { id: "eid138", tween: [ "style", "${_burst}", "opacity", '0', { fromValue: '0.52183219178082'}], position: 80, duration: 12 },
            { id: "eid146", tween: [ "style", "${_pop}", "opacity", '1', { fromValue: '0'}], position: 0, duration: 63, easing: "swing" },
            { id: "eid147", tween: [ "style", "${_pop}", "opacity", '0', { fromValue: '1'}], position: 63, duration: 84, easing: "swing" },
            { id: "eid135", tween: [ "transform", "${_burst}", "scaleY", '1', { fromValue: '0'}], position: 0, duration: 80 }         ]
      }
   }
},
"bubble_sym": {
   version: "1.0.0",
   minimumCompatibleVersion: "0.1.7",
   build: "1.0.0.180",
   baseState: "Base State",
   initialState: "Base State",
   gpuAccelerate: true,
   resizeInstances: false,
   content: {
   dom: [
   {
      rect: [-49,-49,0,0],
      display: 'none',
      transform: [[0,0]],
      id: 'pop',
      type: 'rect'
   },
   {
      rect: [0,0,319,320],
      transform: [[0,0]],
      id: 'bubble',
      type: 'image',
      cursor: ['pointer'],
      fill: ['rgba(0,0,0,0)','images/bubble.png']
   }],
   symbolInstances: [
   {
      id: 'pop',
      symbolName: 'pop'
   }   ]
   },
   states: {
      "Base State": {
         "${_bubble}": [
            ["style", "top", '0.5px'],
            ["transform", "scaleY", '1'],
            ["style", "display", 'block'],
            ["style", "cursor", 'pointer'],
            ["style", "left", '0.17px']
         ],
         "${_pop}": [
            ["style", "top", '-49.99px'],
            ["style", "left", '-49.99px'],
            ["style", "display", 'none']
         ],
         "${symbolSelector}": [
            ["style", "height", '320px'],
            ["style", "width", '318px']
         ]
      }
   },
   timelines: {
      "Default Timeline": {
         fromState: "Base State",
         toState: "",
         duration: 2817.3792973253,
         autoPlay: true,
         labels: {
            "jiggle": 299,
            "pop": 2817
         },
         timeline: [
            { id: "eid179", tween: [ "style", "${_bubble}", "top", '31.01px', { fromValue: '0.5px'}], position: 299, duration: 196, easing: "swing" },
            { id: "eid181", tween: [ "style", "${_bubble}", "top", '-0.53px', { fromValue: '31.01px'}], position: 495, duration: 1255, easing: "easeOutBounce" },
            { id: "eid184", tween: [ "style", "${_bubble}", "display", 'none', { fromValue: 'block'}], position: 2817, duration: 0 },
            { id: "eid180", tween: [ "transform", "${_bubble}", "scaleY", '0.79', { fromValue: '1'}], position: 299, duration: 196, easing: "swing" },
            { id: "eid182", tween: [ "transform", "${_bubble}", "scaleY", '0.99', { fromValue: '0.79'}], position: 495, duration: 1255, easing: "easeOutBounce" },
            { id: "eid186", tween: [ "style", "${_pop}", "display", 'block', { fromValue: 'none'}], position: 2817, duration: 0 },
            { id: "eid185", trigger: [ function executeSymbolFunction(e, data) { this._executeSymbolAction(e, data); }, ['play', '${_pop}', [0] ], ""], position: 2817.3792973253 }         ]
      }
   }
},
"bubblesall_sym": {
   version: "1.0.0",
   minimumCompatibleVersion: "0.1.7",
   build: "1.0.0.180",
   baseState: "Base State",
   initialState: "Base State",
   gpuAccelerate: true,
   resizeInstances: false,
   content: {
   dom: [
   {
      id: 'b1_sym',
      type: 'rect',
      rect: [-687,386,0,0],
      transform: [[0,0]]
   },
   {
      id: 'b2_sym',
      type: 'rect',
      rect: [-236,460,0,0]
   },
   {
      id: 'b3_sym',
      type: 'rect',
      rect: [-314,446,0,0]
   },
   {
      id: 'b4_sym',
      type: 'rect',
      rect: [14,486,0,0]
   },
   {
      id: 'b5_sym',
      type: 'rect',
      rect: [-297,582,0,0]
   },
   {
      id: 'b6_sym',
      type: 'rect',
      rect: [384,442,0,0],
      transform: {}
   },
   {
      id: 'b7_sym',
      type: 'rect',
      rect: [-571,497,0,0]
   },
   {
      id: 'b8_sym',
      type: 'rect',
      rect: [-227,408,0,0]
   },
   {
      id: 'b9_sym',
      type: 'rect',
      rect: [-114,382,0,0],
      transform: {}
   },
   {
      id: 'b10_sym',
      type: 'rect',
      rect: [-138,424,0,0]
   },
   {
      id: 'b11_sym',
      type: 'rect',
      rect: [223,509,0,0],
      transform: {}
   },
   {
      id: 'b12_sym',
      type: 'rect',
      rect: [-179,412,0,0]
   },
   {
      id: 'b13_sym',
      type: 'rect',
      rect: [-133,379,0,0]
   },
   {
      id: 'b14_sym',
      type: 'rect',
      rect: [75,498,0,0],
      transform: {}
   },
   {
      id: 'b15_sym',
      type: 'rect',
      rect: [-448,392,0,0]
   },
   {
      id: 'b16_sym',
      type: 'rect',
      rect: [-229,395,0,0]
   },
   {
      id: 'b18_sym',
      type: 'rect',
      rect: [14,486,0,0]
   },
   {
      id: 'b19_sym',
      type: 'rect',
      rect: [-134,461,0,0]
   },
   {
      id: 'b20_sym',
      type: 'rect',
      rect: [183,607,0,0],
      transform: {}
   },
   {
      id: 'b21_sym',
      type: 'rect',
      rect: [-95,485,0,0]
   },
   {
      id: 'b22_sym',
      type: 'rect',
      rect: [-73,376,0,0]
   },
   {
      id: 'b23_sym',
      type: 'rect',
      rect: [126,386,0,0],
      transform: {}
   },
   {
      id: 'b24_sym',
      type: 'rect',
      rect: [317,407,0,0]
   },
   {
      id: 'b25_sym',
      type: 'rect',
      rect: [-505,388,0,0]
   },
   {
      id: 'b26_sym',
      type: 'rect',
      rect: [40,424,0,0],
      transform: {}
   },
   {
      id: 'b27_sym',
      type: 'rect',
      rect: [-261,465,0,0]
   },
   {
      id: 'b28_sym',
      type: 'rect',
      rect: [-384,502,0,0]
   },
   {
      id: 'b17_sym',
      type: 'rect',
      rect: [-36,91,0,0],
      transform: {}
   }],
   symbolInstances: [
   {
      id: 'b19_sym',
      symbolName: 'b19_sym'
   },
   {
      id: 'b13_sym',
      symbolName: 'b13_sym'
   },
   {
      id: 'b9_sym',
      symbolName: 'b9_sym'
   },
   {
      id: 'b23_sym',
      symbolName: 'b23_sym'
   },
   {
      id: 'b4_sym',
      symbolName: 'b4_sym'
   },
   {
      id: 'b3_sym',
      symbolName: 'b3_sym'
   },
   {
      id: 'b2_sym',
      symbolName: 'b2_sym'
   },
   {
      id: 'b1_sym',
      symbolName: 'b1_sym'
   },
   {
      id: 'b7_sym',
      symbolName: 'b7_sym'
   },
   {
      id: 'b8_sym',
      symbolName: 'b8_sym'
   },
   {
      id: 'b5_sym',
      symbolName: 'b5_sym'
   },
   {
      id: 'b6_sym',
      symbolName: 'b6_sym'
   },
   {
      id: 'b11_sym',
      symbolName: 'b11_sym'
   },
   {
      id: 'b21_sym',
      symbolName: 'b21_sym'
   },
   {
      id: 'b17_sym',
      symbolName: 'b17_sym'
   },
   {
      id: 'b15_sym',
      symbolName: 'b15_sym'
   },
   {
      id: 'b28_sym',
      symbolName: 'b28_sym'
   },
   {
      id: 'b25_sym',
      symbolName: 'b25_Sym'
   },
   {
      id: 'b27_sym',
      symbolName: 'b27_sym'
   },
   {
      id: 'b26_sym',
      symbolName: 'b26_sym'
   },
   {
      id: 'b14_sym',
      symbolName: 'b14_sym'
   },
   {
      id: 'b16_sym',
      symbolName: 'b16_Sym'
   },
   {
      id: 'b20_sym',
      symbolName: 'b20_sym'
   },
   {
      id: 'b10_sym',
      symbolName: 'b10_sym'
   },
   {
      id: 'b22_sym',
      symbolName: 'b22_sym'
   },
   {
      id: 'b18_sym',
      symbolName: 'b18_sym'
   },
   {
      id: 'b24_sym',
      symbolName: 'b24_sym'
   },
   {
      id: 'b12_sym',
      symbolName: 'b12_sym'
   }   ]
   },
   states: {
      "Base State": {
         "${symbolSelector}": [
            ["style", "height", '418px'],
            ["style", "width", '418px']
         ],
         "${_b1_sym}": [
            ["style", "left", '-686.89px'],
            ["style", "top", '386.99px']
         ]
      }
   },
   timelines: {
      "Default Timeline": {
         fromState: "Base State",
         toState: "",
         duration: 0,
         autoPlay: true,
         timeline: [
         ]
      }
   }
},
"b17_sym": {
   version: "1.0.0",
   minimumCompatibleVersion: "0.1.7",
   build: "1.0.0.180",
   baseState: "Base State",
   initialState: "Base State",
   gpuAccelerate: true,
   resizeInstances: false,
   content: {
   dom: [
   {
      transform: [[0,0],{},{},[0.28,0.28]],
      id: 'b17',
      type: 'rect',
      cursor: ['pointer'],
      rect: [-246,203,0,0]
   }],
   symbolInstances: [
   {
      id: 'b17',
      symbolName: 'bubble_sym'
   }   ]
   },
   states: {
      "Base State": {
         "${_b17}": [
            ["style", "top", '249.06px'],
            ["transform", "scaleY", '0.28'],
            ["style", "display", 'block'],
            ["transform", "scaleX", '0.28'],
            ["style", "left", '-120.93px'],
            ["style", "cursor", 'pointer']
         ],
         "${symbolSelector}": [
            ["style", "height", '117.04px'],
            ["style", "width", '117.04px']
         ]
      }
   },
   timelines: {
      "Default Timeline": {
         fromState: "Base State",
         toState: "",
         duration: 11750,
         autoPlay: true,
         timeline: [
            { id: "eid314", tween: [ "style", "${_b17}", "left", '126.52px', { fromValue: '-120.93px'}], position: 355, duration: 11395, easing: "swing" },
            { id: "eid315", tween: [ "style", "${_b17}", "top", '-578.2px', { fromValue: '249.06px'}], position: 355, duration: 11395, easing: "swing" },
            { id: "eid413", tween: [ "style", "${_b17}", "display", 'block', { fromValue: 'none'}], position: 0, duration: 0, easing: "swing" }         ]
      }
   }
},
"b28_sym": {
   version: "1.0.0",
   minimumCompatibleVersion: "0.1.7",
   build: "1.0.0.180",
   baseState: "Base State",
   initialState: "Base State",
   gpuAccelerate: true,
   resizeInstances: false,
   content: {
   dom: [
   {
      id: 'b28',
      type: 'rect',
      transform: [[0,0],{},{},[0.7,0.7]],
      rect: [-90,-20,0,0]
   }],
   symbolInstances: [
   {
      id: 'b28',
      symbolName: 'bubble_sym'
   }   ]
   },
   states: {
      "Base State": {
         "${_b28}": [
            ["style", "top", '-13px'],
            ["transform", "scaleY", '0.7'],
            ["transform", "scaleX", '0.7'],
            ["style", "left", '-14.7px'],
            ["style", "display", 'block']
         ],
         "${symbolSelector}": [
            ["style", "height", '292.6px'],
            ["style", "width", '292.6px']
         ]
      }
   },
   timelines: {
      "Default Timeline": {
         fromState: "Base State",
         toState: "",
         duration: 58000,
         autoPlay: true,
         timeline: [
            { id: "eid284", tween: [ "style", "${_b28}", "left", '-14.7px', { fromValue: '-14.7px'}], position: 58000, duration: 0, easing: "swing" },
            { id: "eid425", tween: [ "style", "${_b28}", "display", 'block', { fromValue: 'none'}], position: 0, duration: 0, easing: "swing" },
            { id: "eid226", tween: [ "style", "${_b28}", "top", '-20px', { fromValue: '-13px'}], position: 0, duration: 19561, easing: "swing" },
            { id: "eid240", tween: [ "style", "${_b28}", "top", '-1086px', { fromValue: '-20px'}], position: 19561, duration: 38438, easing: "swing" }         ]
      }
   }
},
"b27_sym": {
   version: "1.0.0",
   minimumCompatibleVersion: "0.1.7",
   build: "1.0.0.180",
   baseState: "Base State",
   initialState: "Base State",
   gpuAccelerate: true,
   resizeInstances: false,
   content: {
   dom: [
   {
      id: 'b27',
      type: 'rect',
      transform: [[0,0],{},{},[0.64,0.64]],
      rect: [-27,-26,0,0]
   }],
   symbolInstances: [
   {
      id: 'b27',
      symbolName: 'bubble_sym'
   }   ]
   },
   states: {
      "Base State": {
         "${_b27}": [
            ["style", "top", '-25.6px'],
            ["transform", "scaleY", '0.64'],
            ["transform", "scaleX", '0.64'],
            ["style", "left", '-27.23px'],
            ["style", "display", 'block']
         ],
         "${symbolSelector}": [
            ["style", "height", '267.52px'],
            ["style", "width", '267.52px']
         ]
      }
   },
   timelines: {
      "Default Timeline": {
         fromState: "Base State",
         toState: "",
         duration: 70000,
         autoPlay: true,
         timeline: [
            { id: "eid313", tween: [ "style", "${_b27}", "top", '-1036.59px', { fromValue: '-25.6px'}], position: 21250, duration: 48750, easing: "swing" },
            { id: "eid312", tween: [ "style", "${_b27}", "left", '-363.22px', { fromValue: '-27.23px'}], position: 21250, duration: 48750, easing: "swing" },
            { id: "eid424", tween: [ "style", "${_b27}", "display", 'block', { fromValue: 'none'}], position: 0, duration: 0, easing: "swing" }         ]
      }
   }
},
"b26_sym": {
   version: "1.0.0",
   minimumCompatibleVersion: "0.1.7",
   build: "1.0.0.180",
   baseState: "Base State",
   initialState: "Base State",
   gpuAccelerate: true,
   resizeInstances: false,
   content: {
   dom: [
   {
      id: 'b26',
      type: 'rect',
      transform: [[0,0],{},{},[0.64,0.64]],
      rect: [86,-77,0,0]
   }],
   symbolInstances: [
   {
      id: 'b26',
      symbolName: 'bubble_sym'
   }   ]
   },
   states: {
      "Base State": {
         "${_b26}": [
            ["style", "top", '-25.49px'],
            ["transform", "scaleY", '0.64'],
            ["transform", "scaleX", '0.64'],
            ["style", "left", '-25.25px'],
            ["style", "display", 'block']
         ],
         "${symbolSelector}": [
            ["style", "height", '267.52px'],
            ["style", "width", '267.52px']
         ]
      }
   },
   timelines: {
      "Default Timeline": {
         fromState: "Base State",
         toState: "",
         duration: 38605,
         autoPlay: true,
         timeline: [
            { id: "eid260", tween: [ "style", "${_b26}", "top", '-1091.49px', { fromValue: '-25.49px'}], position: 0, duration: 38605, easing: "swing" },
            { id: "eid423", tween: [ "style", "${_b26}", "display", 'block', { fromValue: 'none'}], position: 0, duration: 0, easing: "swing" },
            { id: "eid264", tween: [ "style", "${_b26}", "left", '86.75px', { fromValue: '-25.25px'}], position: 0, duration: 31395, easing: "swing" },
            { id: "eid285", tween: [ "style", "${_b26}", "left", '-157.24px', { fromValue: '86.75px'}], position: 31395, duration: 7210, easing: "swing" }         ]
      }
   }
},
"b25_Sym": {
   version: "1.0.0",
   minimumCompatibleVersion: "0.1.7",
   build: "1.0.0.180",
   baseState: "Base State",
   initialState: "Base State",
   gpuAccelerate: true,
   resizeInstances: false,
   content: {
   dom: [
   {
      id: 'b25',
      type: 'rect',
      transform: [[0,0],{},{},[0.64,0.64]],
      rect: [423,44,0,0]
   }],
   symbolInstances: [
   {
      id: 'b25',
      symbolName: 'bubble_sym'
   }   ]
   },
   states: {
      "Base State": {
         "${_b25}": [
            ["style", "top", '-24.89px'],
            ["transform", "scaleY", '0.64'],
            ["transform", "scaleX", '0.64'],
            ["style", "left", '-26.64px'],
            ["style", "display", 'block']
         ],
         "${symbolSelector}": [
            ["style", "height", '267.52px'],
            ["style", "width", '267.52px']
         ]
      }
   },
   timelines: {
      "Default Timeline": {
         fromState: "Base State",
         toState: "",
         duration: 41508,
         autoPlay: true,
         timeline: [
            { id: "eid229", tween: [ "style", "${_b25}", "top", '96.11px', { fromValue: '-24.89px'}], position: 0, duration: 14395, easing: "swing" },
            { id: "eid251", tween: [ "style", "${_b25}", "top", '-969.89px', { fromValue: '96.11px'}], position: 14395, duration: 27113, easing: "swing" },
            { id: "eid422", tween: [ "style", "${_b25}", "display", 'block', { fromValue: 'none'}], position: 0, duration: 0, easing: "swing" },
            { id: "eid290", tween: [ "style", "${_b25}", "left", '-26.64px', { fromValue: '-26.64px'}], position: 41508, duration: 0, easing: "swing" }         ]
      }
   }
},
"b24_sym": {
   version: "1.0.0",
   minimumCompatibleVersion: "0.1.7",
   build: "1.0.0.180",
   baseState: "Base State",
   initialState: "Base State",
   gpuAccelerate: true,
   resizeInstances: false,
   content: {
   dom: [
   {
      id: 'b24',
      type: 'rect',
      rect: [-59,46,0,0],
      transform: [[0,0],{},{},[0.73,0.73]]
   }],
   symbolInstances: [
   {
      id: 'b24',
      symbolName: 'bubble_sym'
   }   ]
   },
   states: {
      "Base State": {
         "${symbolSelector}": [
            ["style", "height", '305.14px'],
            ["style", "width", '305.14px']
         ],
         "${_b24}": [
            ["style", "top", '-6.2px'],
            ["transform", "scaleY", '0.73'],
            ["transform", "scaleX", '0.73'],
            ["style", "left", '-6.93px'],
            ["style", "display", 'block']
         ]
      }
   },
   timelines: {
      "Default Timeline": {
         fromState: "Base State",
         toState: "",
         duration: 53000,
         autoPlay: true,
         timeline: [
            { id: "eid230", tween: [ "style", "${_b24}", "top", '46.8px', { fromValue: '-6.2px'}], position: 0, duration: 14395, easing: "swing" },
            { id: "eid245", tween: [ "style", "${_b24}", "top", '-974.2px', { fromValue: '46.8px'}], position: 14395, duration: 38605, easing: "swing" },
            { id: "eid266", tween: [ "style", "${_b24}", "left", '-101.93px', { fromValue: '-6.93px'}], position: 0, duration: 53000, easing: "swing" },
            { id: "eid421", tween: [ "style", "${_b24}", "display", 'block', { fromValue: 'none'}], position: 0, duration: 0, easing: "swing" }         ]
      }
   }
},
"b22_sym": {
   version: "1.0.0",
   minimumCompatibleVersion: "0.1.7",
   build: "1.0.0.180",
   baseState: "Base State",
   initialState: "Base State",
   gpuAccelerate: true,
   resizeInstances: false,
   content: {
   dom: [
   {
      id: 'b22',
      type: 'rect',
      transform: [[0,0],{},{},[0.7,0.7]],
      rect: [-13,108,0,0]
   }],
   symbolInstances: [
   {
      id: 'b22',
      symbolName: 'bubble_sym'
   }   ]
   },
   states: {
      "Base State": {
         "${_b22}": [
            ["style", "top", '-13px'],
            ["transform", "scaleY", '0.7'],
            ["transform", "scaleX", '0.7'],
            ["style", "left", '-12.71px'],
            ["style", "display", 'block']
         ],
         "${symbolSelector}": [
            ["style", "height", '292.6px'],
            ["style", "width", '292.6px']
         ]
      }
   },
   timelines: {
      "Default Timeline": {
         fromState: "Base State",
         toState: "",
         duration: 35645,
         autoPlay: true,
         timeline: [
            { id: "eid309", tween: [ "style", "${_b22}", "left", '247.29px', { fromValue: '-12.71px'}], position: 0, duration: 35645, easing: "swing" },
            { id: "eid224", tween: [ "style", "${_b22}", "top", '108px', { fromValue: '-13px'}], position: 0, duration: 14395, easing: "swing" },
            { id: "eid256", tween: [ "style", "${_b22}", "top", '-947.99px', { fromValue: '108px'}], position: 14395, duration: 21250, easing: "swing" },
            { id: "eid419", tween: [ "style", "${_b22}", "display", 'block', { fromValue: 'none'}], position: 0, duration: 0, easing: "swing" }         ]
      }
   }
},
"b23_sym": {
   version: "1.0.0",
   minimumCompatibleVersion: "0.1.7",
   build: "1.0.0.180",
   baseState: "Base State",
   initialState: "Base State",
   gpuAccelerate: true,
   resizeInstances: false,
   content: {
   dom: [
   {
      id: 'b23',
      type: 'rect',
      transform: [[0,0],{},{},[0.97,0.97]],
      rect: [30,-13,0,0]
   }],
   symbolInstances: [
   {
      id: 'b23',
      symbolName: 'bubble_sym'
   }   ]
   },
   states: {
      "Base State": {
         "${_b23}": [
            ["style", "top", '42.8px'],
            ["transform", "scaleY", '0.97'],
            ["style", "display", 'block'],
            ["style", "left", '43.23px'],
            ["transform", "scaleX", '0.97']
         ],
         "${symbolSelector}": [
            ["style", "height", '405.46px'],
            ["style", "width", '405.46px']
         ]
      }
   },
   timelines: {
      "Default Timeline": {
         fromState: "Base State",
         toState: "",
         duration: 38605,
         autoPlay: true,
         timeline: [
            { id: "eid420", tween: [ "style", "${_b23}", "display", 'block', { fromValue: 'none'}], position: 0, duration: 0, easing: "swing" },
            { id: "eid268", tween: [ "style", "${_b23}", "left", '-154.78px', { fromValue: '43.23px'}], position: 0, duration: 38605, easing: "swing" },
            { id: "eid231", tween: [ "style", "${_b23}", "top", '38.8px', { fromValue: '42.8px'}], position: 0, duration: 14395, easing: "swing" },
            { id: "eid246", tween: [ "style", "${_b23}", "top", '-1011.2px', { fromValue: '38.8px'}], position: 14395, duration: 24210, easing: "swing" }         ]
      }
   }
},
"b21_sym": {
   version: "1.0.0",
   minimumCompatibleVersion: "0.1.7",
   build: "1.0.0.180",
   baseState: "Base State",
   initialState: "Base State",
   gpuAccelerate: true,
   resizeInstances: false,
   content: {
   dom: [
   {
      id: 'b21',
      type: 'rect',
      transform: [[0,0],{},{},[0.7,0.7]],
      rect: [-14,-59,0,0]
   }],
   symbolInstances: [
   {
      id: 'b21',
      symbolName: 'bubble_sym'
   }   ]
   },
   states: {
      "Base State": {
         "${_b21}": [
            ["style", "top", '-13.04px'],
            ["transform", "scaleY", '0.7'],
            ["transform", "scaleX", '0.7'],
            ["style", "left", '-13.33px'],
            ["style", "display", 'block']
         ],
         "${symbolSelector}": [
            ["style", "height", '292.6px'],
            ["style", "width", '292.6px']
         ]
      }
   },
   timelines: {
      "Default Timeline": {
         fromState: "Base State",
         toState: "",
         duration: 21250,
         autoPlay: true,
         timeline: [
            { id: "eid293", tween: [ "style", "${_b21}", "left", '-109.29px', { fromValue: '-13.33px'}], position: 0, duration: 21250, easing: "swing" },
            { id: "eid418", tween: [ "style", "${_b21}", "display", 'block', { fromValue: 'none'}], position: 0, duration: 0, easing: "swing" },
            { id: "eid223", tween: [ "style", "${_b21}", "top", '-7.04px', { fromValue: '-13.04px'}], position: 0, duration: 10075, easing: "swing" },
            { id: "eid259", tween: [ "style", "${_b21}", "top", '-1056.99px', { fromValue: '-7.04px'}], position: 10075, duration: 11174, easing: "swing" }         ]
      }
   }
},
"b20_sym": {
   version: "1.0.0",
   minimumCompatibleVersion: "0.1.7",
   build: "1.0.0.180",
   baseState: "Base State",
   initialState: "Base State",
   gpuAccelerate: true,
   resizeInstances: false,
   content: {
   dom: [
   {
      id: 'b20',
      type: 'rect',
      rect: [-101,-317,0,0],
      transform: [[0,0],{},{},[0.289,0.289]]
   }],
   symbolInstances: [
   {
      id: 'b20',
      symbolName: 'bubble_sym'
   }   ]
   },
   states: {
      "Base State": {
         "${_b20}": [
            ["style", "top", '-100.21px'],
            ["transform", "scaleY", '0.28'],
            ["style", "display", 'block'],
            ["style", "left", '-100.49px'],
            ["transform", "scaleX", '0.28']
         ],
         "${symbolSelector}": [
            ["style", "height", '117.04px'],
            ["style", "width", '117.04px']
         ]
      }
   },
   timelines: {
      "Default Timeline": {
         fromState: "Base State",
         toState: "",
         duration: 7000,
         autoPlay: true,
         timeline: [
            { id: "eid417", tween: [ "style", "${_b20}", "display", 'block', { fromValue: 'none'}], position: 0, duration: 0, easing: "swing" },
            { id: "eid294", tween: [ "style", "${_b20}", "left", '25.52px', { fromValue: '-100.49px'}], position: 0, duration: 7000, easing: "swing" },
            { id: "eid222", tween: [ "style", "${_b20}", "top", '-265.69px', { fromValue: '-100.21px'}], position: 0, duration: 4741, easing: "swing" },
            { id: "eid247", tween: [ "style", "${_b20}", "top", '-1331.69px', { fromValue: '-265.69px'}], position: 4741, duration: 2258, easing: "swing" }         ]
      }
   }
},
"b19_sym": {
   version: "1.0.0",
   minimumCompatibleVersion: "0.1.7",
   build: "1.0.0.180",
   baseState: "Base State",
   initialState: "Base State",
   gpuAccelerate: true,
   resizeInstances: false,
   content: {
   dom: [
   {
      id: 'b19',
      type: 'rect',
      transform: [[0,0],{},{},[0.28,0.28]],
      rect: [-102,-31,0,0]
   }],
   symbolInstances: [
   {
      id: 'b19',
      symbolName: 'bubble_sym'
   }   ]
   },
   states: {
      "Base State": {
         "${_b19}": [
            ["style", "top", '-100.09px'],
            ["transform", "scaleY", '0.28'],
            ["transform", "scaleX", '0.28'],
            ["style", "left", '-102.48px'],
            ["style", "display", 'block']
         ],
         "${symbolSelector}": [
            ["style", "height", '117.04px'],
            ["style", "width", '117.04px']
         ]
      }
   },
   timelines: {
      "Default Timeline": {
         fromState: "Base State",
         toState: "",
         duration: 12750,
         autoPlay: true,
         timeline: [
            { id: "eid232", tween: [ "style", "${_b19}", "top", '20.91px', { fromValue: '-100.09px'}], position: 0, duration: 7581, easing: "swing" },
            { id: "eid241", tween: [ "style", "${_b19}", "top", '-1005.2px', { fromValue: '20.91px'}], position: 7581, duration: 5168, easing: "swing" },
            { id: "eid295", tween: [ "style", "${_b19}", "left", '-96.52px', { fromValue: '-102.48px'}], position: 0, duration: 12750, easing: "swing" },
            { id: "eid415", tween: [ "style", "${_b19}", "display", 'block', { fromValue: 'none'}], position: 0, duration: 0, easing: "swing" }         ]
      }
   }
},
"b18_sym": {
   version: "1.0.0",
   minimumCompatibleVersion: "0.1.7",
   build: "1.0.0.180",
   baseState: "Base State",
   initialState: "Base State",
   gpuAccelerate: true,
   resizeInstances: false,
   content: {
   dom: [
   {
      id: 'b18',
      type: 'rect',
      transform: [[0,0],{},{},[0.28,0.28]],
      rect: [-102,-152,0,0]
   }],
   symbolInstances: [
   {
      id: 'b18',
      symbolName: 'bubble_sym'
   }   ]
   },
   states: {
      "Base State": {
         "${_b18}": [
            ["style", "top", '-100.08px'],
            ["transform", "scaleY", '0.28'],
            ["transform", "scaleX", '0.28'],
            ["style", "left", '-101.48px'],
            ["style", "display", 'block']
         ],
         "${symbolSelector}": [
            ["style", "height", '117.04px'],
            ["style", "width", '117.04px']
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
            { id: "eid243", tween: [ "style", "${_b18}", "top", '-1166.08px', { fromValue: '-100.08px'}], position: 0, duration: 11000, easing: "swing" },
            { id: "eid414", tween: [ "style", "${_b18}", "display", 'block', { fromValue: 'none'}], position: 0, duration: 0, easing: "swing" },
            { id: "eid296", tween: [ "style", "${_b18}", "left", '137.52px', { fromValue: '-101.48px'}], position: 0, duration: 11000, easing: "swing" }         ]
      }
   }
},
"b16_Sym": {
   version: "1.0.0",
   minimumCompatibleVersion: "0.1.7",
   build: "1.0.0.180",
   baseState: "Base State",
   initialState: "Base State",
   gpuAccelerate: true,
   resizeInstances: false,
   content: {
   dom: [
   {
      id: 'b16',
      type: 'rect',
      transform: [[0,0],{},{},[0.52,0.52]],
      rect: [-51,14,0,0]
   }],
   symbolInstances: [
   {
      id: 'b16',
      symbolName: 'bubble_sym'
   }   ]
   },
   states: {
      "Base State": {
         "${_b16}": [
            ["style", "top", '-50.8px'],
            ["transform", "scaleY", '0.52'],
            ["transform", "scaleX", '0.52'],
            ["style", "left", '-51.67px'],
            ["style", "display", 'block']
         ],
         "${symbolSelector}": [
            ["style", "height", '217.36px'],
            ["style", "width", '217.36px']
         ]
      }
   },
   timelines: {
      "Default Timeline": {
         fromState: "Base State",
         toState: "",
         duration: 53000,
         autoPlay: true,
         timeline: [
            { id: "eid233", tween: [ "style", "${_b16}", "top", '14.19px', { fromValue: '-50.8px'}], position: 0, duration: 14395, easing: "swing" },
            { id: "eid239", tween: [ "style", "${_b16}", "top", '-1051.81px', { fromValue: '14.19px'}], position: 14395, duration: 38605, easing: "swing" },
            { id: "eid412", tween: [ "style", "${_b16}", "display", 'block', { fromValue: 'none'}], position: 0, duration: 0, easing: "swing" },
            { id: "eid297", tween: [ "style", "${_b16}", "left", '-283.32px', { fromValue: '-51.67px'}], position: 0, duration: 53000, easing: "swing" }         ]
      }
   }
},
"b1_sym": {
   version: "1.0.0",
   minimumCompatibleVersion: "0.1.7",
   build: "1.0.0.180",
   baseState: "Base State",
   initialState: "Base State",
   gpuAccelerate: true,
   resizeInstances: false,
   content: {
   dom: [
   {
      id: 'b1',
      type: 'rect',
      rect: [49,-16,0,0],
      transform: [[0,0]]
   }],
   symbolInstances: [
   {
      id: 'b1',
      symbolName: 'bubble_sym'
   }   ]
   },
   states: {
      "Base State": {
         "${_b1}": [
            ["style", "top", '48.99px'],
            ["style", "left", '48.92px'],
            ["style", "display", 'block']
         ],
         "${symbolSelector}": [
            ["style", "height", '418px'],
            ["style", "width", '418px']
         ]
      }
   },
   timelines: {
      "Default Timeline": {
         fromState: "Base State",
         toState: "",
         duration: 36500,
         autoPlay: true,
         timeline: [
            { id: "eid252", tween: [ "style", "${_b1}", "top", '-1017.01px', { fromValue: '48.99px'}], position: 0, duration: 36500, easing: "swing" },
            { id: "eid416", tween: [ "style", "${_b1}", "display", 'block', { fromValue: 'none'}], position: 0, duration: 0, easing: "swing" }         ]
      }
   }
},
"b2_sym": {
   version: "1.0.0",
   minimumCompatibleVersion: "0.1.7",
   build: "1.0.0.180",
   baseState: "Base State",
   initialState: "Base State",
   gpuAccelerate: true,
   resizeInstances: false,
   content: {
   dom: [
   {
      id: 'b2',
      type: 'rect',
      transform: [[0,0],{},{},[0.52,0.52]],
      rect: [-52,-87,0,0]
   }],
   symbolInstances: [
   {
      id: 'b2',
      symbolName: 'bubble_sym'
   }   ]
   },
   states: {
      "Base State": {
         "${_b2}": [
            ["style", "top", '-50.81px'],
            ["transform", "scaleY", '0.52'],
            ["transform", "scaleX", '0.52'],
            ["style", "left", '-52.31px'],
            ["style", "display", 'block']
         ],
         "${symbolSelector}": [
            ["style", "height", '217.36px'],
            ["style", "width", '217.36px']
         ]
      }
   },
   timelines: {
      "Default Timeline": {
         fromState: "Base State",
         toState: "",
         duration: 70000,
         autoPlay: true,
         timeline: [
            { id: "eid311", tween: [ "style", "${_b2}", "left", '137.67px', { fromValue: '-52.31px'}], position: 21250, duration: 48750, easing: "swing" },
            { id: "eid426", tween: [ "style", "${_b2}", "display", 'block', { fromValue: 'none'}], position: 0, duration: 0, easing: "swing" },
            { id: "eid199", tween: [ "style", "${_b2}", "top", '-2146.86px', { fromValue: '-50.81px'}], position: 21250, duration: 48750, easing: "swing" }         ]
      }
   }
},
"b4_sym": {
   version: "1.0.0",
   minimumCompatibleVersion: "0.1.7",
   build: "1.0.0.180",
   baseState: "Base State",
   initialState: "Base State",
   gpuAccelerate: true,
   resizeInstances: false,
   content: {
   dom: [
   {
      id: 'b4',
      type: 'rect',
      transform: [[0,0],{},{},[0.28,0.28]],
      rect: [-102,-152,0,0]
   }],
   symbolInstances: [
   {
      id: 'b4',
      symbolName: 'bubble_sym'
   }   ]
   },
   states: {
      "Base State": {
         "${_b4}": [
            ["style", "top", '-100.08px'],
            ["transform", "scaleY", '0.28'],
            ["style", "display", 'block'],
            ["style", "left", '-101.48px'],
            ["transform", "scaleX", '0.28']
         ],
         "${symbolSelector}": [
            ["style", "height", '117.04px'],
            ["style", "width", '117.04px']
         ]
      }
   },
   timelines: {
      "Default Timeline": {
         fromState: "Base State",
         toState: "",
         duration: 70000,
         autoPlay: true,
         timeline: [
            { id: "eid244", tween: [ "style", "${_b4}", "top", '-991px', { fromValue: '-100.08px'}], position: 34000, duration: 36000, easing: "swing" },
            { id: "eid428", tween: [ "style", "${_b4}", "display", 'block', { fromValue: 'none'}], position: 0, duration: 0, easing: "swing" }         ]
      }
   }
},
"b5_sym": {
   version: "1.0.0",
   minimumCompatibleVersion: "0.1.7",
   build: "1.0.0.180",
   baseState: "Base State",
   initialState: "Base State",
   gpuAccelerate: true,
   resizeInstances: false,
   content: {
   dom: [
   {
      id: 'b5',
      type: 'rect',
      transform: [[0,0],{},{},[0.28,0.28]],
      rect: [-101,-152,0,0]
   }],
   symbolInstances: [
   {
      id: 'b5',
      symbolName: 'bubble_sym'
   }   ]
   },
   states: {
      "Base State": {
         "${_b5}": [
            ["style", "top", '-100.09px'],
            ["transform", "scaleY", '0.28'],
            ["transform", "scaleX", '0.28'],
            ["style", "left", '-101.52px'],
            ["style", "display", 'block']
         ],
         "${symbolSelector}": [
            ["style", "height", '117.04px'],
            ["style", "width", '117.04px']
         ]
      }
   },
   timelines: {
      "Default Timeline": {
         fromState: "Base State",
         toState: "",
         duration: 71550,
         autoPlay: true,
         timeline: [
            { id: "eid195", tween: [ "style", "${_b5}", "top", '-1166.09px', { fromValue: '-100.09px'}], position: 0, duration: 71550, easing: "swing" },
            { id: "eid429", tween: [ "style", "${_b5}", "display", 'block', { fromValue: 'none'}], position: 0, duration: 0, easing: "swing" },
            { id: "eid310", tween: [ "style", "${_b5}", "left", '115.53px', { fromValue: '-101.52px'}], position: 0, duration: 71550, easing: "swing" }         ]
      }
   }
},
"b15_sym": {
   version: "1.0.0",
   minimumCompatibleVersion: "0.1.7",
   build: "1.0.0.180",
   baseState: "Base State",
   initialState: "Base State",
   gpuAccelerate: true,
   resizeInstances: false,
   content: {
   dom: [
   {
      id: 'b15',
      type: 'rect',
      transform: [[0,0]],
      rect: [48,-26,0,0]
   }],
   symbolInstances: [
   {
      id: 'b15',
      symbolName: 'bubble_sym'
   }   ]
   },
   states: {
      "Base State": {
         "${_b15}": [
            ["style", "top", '48.99px'],
            ["style", "left", '48px'],
            ["style", "display", 'block']
         ],
         "${symbolSelector}": [
            ["style", "height", '418px'],
            ["style", "width", '418px']
         ]
      }
   },
   timelines: {
      "Default Timeline": {
         fromState: "Base State",
         toState: "",
         duration: 36250,
         autoPlay: true,
         timeline: [
            { id: "eid298", tween: [ "style", "${_b15}", "left", '125px', { fromValue: '48px'}], position: 0, duration: 36250, easing: "swing" },
            { id: "eid234", tween: [ "style", "${_b15}", "top", '-1038.99px', { fromValue: '48.99px'}], position: 0, duration: 36250, easing: "swing" },
            { id: "eid411", tween: [ "style", "${_b15}", "display", 'block', { fromValue: 'none'}], position: 0, duration: 0, easing: "swing" }         ]
      }
   }
},
"b6_sym": {
   version: "1.0.0",
   minimumCompatibleVersion: "0.1.7",
   build: "1.0.0.180",
   baseState: "Base State",
   initialState: "Base State",
   gpuAccelerate: true,
   resizeInstances: false,
   content: {
   dom: [
   {
      id: 'b6',
      type: 'rect',
      rect: [-102,-152,0,0],
      transform: [[0,0],{},{},[0.28,0.28]]
   }],
   symbolInstances: [
   {
      id: 'b6',
      symbolName: 'bubble_sym'
   }   ]
   },
   states: {
      "Base State": {
         "${_b6}": [
            ["style", "top", '-100.69px'],
            ["transform", "scaleY", '0.28'],
            ["transform", "scaleX", '0.28'],
            ["style", "left", '-101.35px'],
            ["style", "display", 'block']
         ],
         "${symbolSelector}": [
            ["style", "height", '117.04px'],
            ["style", "width", '117.04px']
         ]
      }
   },
   timelines: {
      "Default Timeline": {
         fromState: "Base State",
         toState: "",
         duration: 21500,
         autoPlay: true,
         timeline: [
            { id: "eid192", tween: [ "style", "${_b6}", "top", '-915.2px', { fromValue: '-100.69px'}], position: 0, duration: 21500, easing: "swing" },
            { id: "eid430", tween: [ "style", "${_b6}", "display", 'block', { fromValue: 'none'}], position: 0, duration: 0, easing: "swing" }         ]
      }
   }
},
"b14_sym": {
   version: "1.0.0",
   minimumCompatibleVersion: "0.1.7",
   build: "1.0.0.180",
   baseState: "Base State",
   initialState: "Base State",
   gpuAccelerate: true,
   resizeInstances: false,
   content: {
   dom: [
   {
      id: 'b14',
      type: 'rect',
      transform: [[0,0],{},{},[0.7,0.7]],
      rect: [-13,-64,0,0]
   }],
   symbolInstances: [
   {
      id: 'b14',
      symbolName: 'bubble_sym'
   }   ]
   },
   states: {
      "Base State": {
         "${_b14}": [
            ["style", "top", '-12.88px'],
            ["transform", "scaleY", '0.7'],
            ["style", "display", 'block'],
            ["style", "left", '-12.84px'],
            ["transform", "scaleX", '0.7']
         ],
         "${symbolSelector}": [
            ["style", "height", '292.6px'],
            ["style", "width", '292.6px']
         ]
      }
   },
   timelines: {
      "Default Timeline": {
         fromState: "Base State",
         toState: "",
         duration: 22750,
         autoPlay: true,
         timeline: [
            { id: "eid200", tween: [ "style", "${_b14}", "top", '-2116.98px', { fromValue: '-12.88px'}], position: 0, duration: 22749, easing: "swing" },
            { id: "eid300", tween: [ "style", "${_b14}", "left", '-137.3px', { fromValue: '-12.84px'}], position: 0, duration: 22750, easing: "swing" },
            { id: "eid410", tween: [ "style", "${_b14}", "display", 'block', { fromValue: 'none'}], position: 0, duration: 0, easing: "swing" }         ]
      }
   }
},
"b12_sym": {
   version: "1.0.0",
   minimumCompatibleVersion: "0.1.7",
   build: "1.0.0.180",
   baseState: "Base State",
   initialState: "Base State",
   gpuAccelerate: true,
   resizeInstances: false,
   content: {
   dom: [
   {
      id: 'b12',
      type: 'rect',
      transform: [[0,0],{},{},[0.64,0.64]],
      rect: [-27,-65,0,0]
   }],
   symbolInstances: [
   {
      id: 'b12',
      symbolName: 'bubble_sym'
   }   ]
   },
   states: {
      "Base State": {
         "${_b12}": [
            ["style", "top", '-25.6px'],
            ["transform", "scaleY", '0.64'],
            ["transform", "scaleX", '0.64'],
            ["style", "left", '-27.24px'],
            ["style", "display", 'block']
         ],
         "${symbolSelector}": [
            ["style", "height", '267.52px'],
            ["style", "width", '267.52px']
         ]
      }
   },
   timelines: {
      "Default Timeline": {
         fromState: "Base State",
         toState: "",
         duration: 36500,
         autoPlay: true,
         timeline: [
            { id: "eid304", tween: [ "style", "${_b12}", "left", '350.72px', { fromValue: '-27.24px'}], position: 0, duration: 36500, easing: "swing" },
            { id: "eid408", tween: [ "style", "${_b12}", "display", 'block', { fromValue: 'none'}], position: 0, duration: 0, easing: "swing" },
            { id: "eid203", tween: [ "style", "${_b12}", "top", '-2078.89px', { fromValue: '-25.6px'}], position: 0, duration: 36500, easing: "swing" }         ]
      }
   }
},
"b13_sym": {
   version: "1.0.0",
   minimumCompatibleVersion: "0.1.7",
   build: "1.0.0.180",
   baseState: "Base State",
   initialState: "Base State",
   gpuAccelerate: true,
   resizeInstances: false,
   content: {
   dom: [
   {
      id: 'b13',
      type: 'rect',
      transform: [[0,0],{},{},[0.64,0.64]],
      rect: [-27,-12,0,0]
   }],
   symbolInstances: [
   {
      id: 'b13',
      symbolName: 'bubble_sym'
   }   ]
   },
   states: {
      "Base State": {
         "${_b13}": [
            ["style", "top", '-25.61px'],
            ["transform", "scaleY", '0.64'],
            ["transform", "scaleX", '0.64'],
            ["style", "left", '-27.23px'],
            ["style", "display", 'block']
         ],
         "${symbolSelector}": [
            ["style", "height", '267.52px'],
            ["style", "width", '267.52px']
         ]
      }
   },
   timelines: {
      "Default Timeline": {
         fromState: "Base State",
         toState: "",
         duration: 21250,
         autoPlay: true,
         timeline: [
            { id: "eid409", tween: [ "style", "${_b13}", "display", 'block', { fromValue: 'none'}], position: 0, duration: 0, easing: "swing" },
            { id: "eid301", tween: [ "style", "${_b13}", "left", '239.75px', { fromValue: '-27.23px'}], position: 0, duration: 21250, easing: "swing" },
            { id: "eid235", tween: [ "style", "${_b13}", "top", '39.51px', { fromValue: '-25.61px'}], position: 0, duration: 14395, easing: "swing" },
            { id: "eid258", tween: [ "style", "${_b13}", "top", '-1025.39px', { fromValue: '39.51px'}], position: 14395, duration: 6855, easing: "swing" }         ]
      }
   }
},
"b11_sym": {
   version: "1.0.0",
   minimumCompatibleVersion: "0.1.7",
   build: "1.0.0.180",
   baseState: "Base State",
   initialState: "Base State",
   gpuAccelerate: true,
   resizeInstances: false,
   content: {
   dom: [
   {
      id: 'b11',
      type: 'rect',
      transform: [[0,0],{},{},[0.64,0.64]],
      rect: [-26,-77,0,0]
   }],
   symbolInstances: [
   {
      id: 'b11',
      symbolName: 'bubble_sym'
   }   ]
   },
   states: {
      "Base State": {
         "${_b11}": [
            ["style", "top", '-24.89px'],
            ["transform", "scaleY", '0.64'],
            ["style", "display", 'block'],
            ["style", "left", '-26px'],
            ["transform", "scaleX", '0.64']
         ],
         "${symbolSelector}": [
            ["style", "height", '267.52px'],
            ["style", "width", '267.52px']
         ]
      }
   },
   timelines: {
      "Default Timeline": {
         fromState: "Base State",
         toState: "",
         duration: 30500,
         autoPlay: true,
         timeline: [
            { id: "eid305", tween: [ "style", "${_b11}", "left", '-481.21px', { fromValue: '-26px'}], position: 58, duration: 30441, easing: "swing" },
            { id: "eid254", tween: [ "style", "${_b11}", "top", '-1090.89px', { fromValue: '-24.89px'}], position: 0, duration: 30500, easing: "swing" },
            { id: "eid407", tween: [ "style", "${_b11}", "display", 'block', { fromValue: 'none'}], position: 0, duration: 0, easing: "swing" }         ]
      }
   }
},
"b10_sym": {
   version: "1.0.0",
   minimumCompatibleVersion: "0.1.7",
   build: "1.0.0.180",
   baseState: "Base State",
   initialState: "Base State",
   gpuAccelerate: true,
   resizeInstances: false,
   content: {
   dom: [
   {
      id: 'b10',
      type: 'rect',
      transform: [[0,0],{},{},[0.73,0.73]],
      rect: [229,-48,0,0]
   }],
   symbolInstances: [
   {
      id: 'b10',
      symbolName: 'bubble_sym'
   }   ]
   },
   states: {
      "Base State": {
         "${_b10}": [
            ["style", "top", '-6.2px'],
            ["transform", "scaleY", '0.73'],
            ["style", "display", 'block'],
            ["style", "left", '-7.93px'],
            ["transform", "scaleX", '0.73']
         ],
         "${symbolSelector}": [
            ["style", "height", '305.14px'],
            ["style", "width", '305.14px']
         ]
      }
   },
   timelines: {
      "Default Timeline": {
         fromState: "Base State",
         toState: "",
         duration: 26000,
         autoPlay: true,
         timeline: [
            { id: "eid406", tween: [ "style", "${_b10}", "display", 'block', { fromValue: 'none'}], position: 0, duration: 0, easing: "swing" },
            { id: "eid262", tween: [ "style", "${_b10}", "left", '-244.47px', { fromValue: '-7.93px'}], position: 0, duration: 26000, easing: "swing" },
            { id: "eid257", tween: [ "style", "${_b10}", "top", '-1063.8px', { fromValue: '-6.2px'}], position: 0, duration: 26000, easing: "swing" }         ]
      }
   }
},
"b8_sym": {
   version: "1.0.0",
   minimumCompatibleVersion: "0.1.7",
   build: "1.0.0.180",
   baseState: "Base State",
   initialState: "Base State",
   gpuAccelerate: true,
   resizeInstances: false,
   content: {
   dom: [
   {
      id: 'b8',
      type: 'rect',
      transform: [[0,0],{},{},[0.7,0.7]],
      rect: [-13,-64,0,0]
   }],
   symbolInstances: [
   {
      id: 'b8',
      symbolName: 'bubble_sym'
   }   ]
   },
   states: {
      "Base State": {
         "${_b8}": [
            ["style", "top", '-12.89px'],
            ["transform", "scaleY", '0.7'],
            ["transform", "scaleX", '0.7'],
            ["style", "left", '-13.85px'],
            ["style", "display", 'block']
         ],
         "${symbolSelector}": [
            ["style", "height", '292.6px'],
            ["style", "width", '292.6px']
         ]
      }
   },
   timelines: {
      "Default Timeline": {
         fromState: "Base State",
         toState: "",
         duration: 38605,
         autoPlay: true,
         timeline: [
            { id: "eid432", tween: [ "style", "${_b8}", "display", 'block', { fromValue: 'none'}], position: 0, duration: 0, easing: "swing" },
            { id: "eid242", tween: [ "style", "${_b8}", "top", '-1078.89px', { fromValue: '-12.89px'}], position: 0, duration: 38605, easing: "swing" }         ]
      }
   }
},
"b9_sym": {
   version: "1.0.0",
   minimumCompatibleVersion: "0.1.7",
   build: "1.0.0.180",
   baseState: "Base State",
   initialState: "Base State",
   gpuAccelerate: true,
   resizeInstances: false,
   content: {
   dom: [
   {
      id: 'b9',
      type: 'rect',
      transform: [[0,0],{},{},[0.97,0.97]],
      rect: [43,-9,0,0]
   }],
   symbolInstances: [
   {
      id: 'b9',
      symbolName: 'bubble_sym'
   }   ]
   },
   states: {
      "Base State": {
         "${_b9}": [
            ["style", "top", '42.8px'],
            ["transform", "scaleY", '0.97'],
            ["transform", "scaleX", '0.97'],
            ["style", "left", '43.31px'],
            ["style", "display", 'block']
         ],
         "${symbolSelector}": [
            ["style", "height", '405.46px'],
            ["style", "width", '405.46px']
         ]
      }
   },
   timelines: {
      "Default Timeline": {
         fromState: "Base State",
         toState: "",
         duration: 70000,
         autoPlay: true,
         timeline: [
            { id: "eid433", tween: [ "style", "${_b9}", "display", 'block', { fromValue: 'none'}], position: 0, duration: 0, easing: "swing" },
            { id: "eid193", tween: [ "style", "${_b9}", "top", '-1002.31px', { fromValue: '42.8px'}], position: 21250, duration: 12750, easing: "swing" },
            { id: "eid237", tween: [ "style", "${_b9}", "top", '-2068.3px', { fromValue: '-1002.31px'}], position: 34000, duration: 36000, easing: "swing" },
            { id: "eid308", tween: [ "style", "${_b9}", "left", '370.23px', { fromValue: '43.31px'}], position: 21250, duration: 48750, easing: "swing" }         ]
      }
   }
},
"b7_sym": {
   version: "1.0.0",
   minimumCompatibleVersion: "0.1.7",
   build: "1.0.0.180",
   baseState: "Base State",
   initialState: "Base State",
   gpuAccelerate: true,
   resizeInstances: false,
   content: {
   dom: [
   {
      id: 'b7',
      type: 'rect',
      transform: [[0,0],{},{},[0.7,0.7]],
      rect: [-14,-71,0,0]
   }],
   symbolInstances: [
   {
      id: 'b7',
      symbolName: 'bubble_sym'
   }   ]
   },
   states: {
      "Base State": {
         "${_b7}": [
            ["style", "top", '-13px'],
            ["transform", "scaleY", '0.7'],
            ["style", "display", 'block'],
            ["style", "left", '-14.7px'],
            ["transform", "scaleX", '0.7']
         ],
         "${symbolSelector}": [
            ["style", "height", '292.6px'],
            ["style", "width", '292.6px']
         ]
      }
   },
   timelines: {
      "Default Timeline": {
         fromState: "Base State",
         toState: "",
         duration: 70000,
         autoPlay: true,
         timeline: [
            { id: "eid431", tween: [ "style", "${_b7}", "display", 'block', { fromValue: 'none'}], position: 0, duration: 0, easing: "swing" },
            { id: "eid201", tween: [ "style", "${_b7}", "top", '-1064.16px', { fromValue: '-13px'}], position: 4308, duration: 55941, easing: "swing" },
            { id: "eid238", tween: [ "style", "${_b7}", "top", '-2130.15px', { fromValue: '-1064.16px'}], position: 60250, duration: 9750, easing: "swing" }         ]
      }
   }
},
"b3_sym": {
   version: "1.0.0",
   minimumCompatibleVersion: "0.1.7",
   build: "1.0.0.180",
   baseState: "Base State",
   initialState: "Base State",
   gpuAccelerate: true,
   resizeInstances: false,
   content: {
   dom: [
   {
      id: 'b3',
      type: 'rect',
      transform: [[0,0],{},{},[0.28,0.28]],
      rect: [-101,-152,0,0]
   }],
   symbolInstances: [
   {
      id: 'b3',
      symbolName: 'bubble_sym'
   }   ]
   },
   states: {
      "Base State": {
         "${_b3}": [
            ["style", "top", '-100.35px'],
            ["transform", "scaleY", '0.28'],
            ["transform", "scaleX", '0.28'],
            ["style", "left", '-101.86px'],
            ["style", "display", 'block']
         ],
         "${symbolSelector}": [
            ["style", "height", '117.04px'],
            ["style", "width", '117.04px']
         ]
      }
   },
   timelines: {
      "Default Timeline": {
         fromState: "Base State",
         toState: "",
         duration: 70000,
         autoPlay: true,
         timeline: [
            { id: "eid427", tween: [ "style", "${_b3}", "display", 'block', { fromValue: 'none'}], position: 0, duration: 0, easing: "swing" },
            { id: "eid196", tween: [ "style", "${_b3}", "top", '-1166.35px', { fromValue: '-100.35px'}], position: 0, duration: 70000, easing: "swing" }         ]
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
})(jQuery, AdobeEdge, "EDGE-206060553");
