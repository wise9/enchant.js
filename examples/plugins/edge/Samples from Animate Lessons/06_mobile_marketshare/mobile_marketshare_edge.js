/**
 * Adobe Edge: symbol definitions
 */
(function($, Edge, compId){
//images folder
var im='images/';

var fonts = {};
   fonts['Armata']='<link href=\'http://fonts.googleapis.com/css?family=Armata\' rel=\'stylesheet\' type=\'text/css\'>';


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
            id:'mapwhole_sym',
            type:'rect',
            rect:['10','21','0','0','undefined','undefined'],
            transform:[]
         },
         {
            id:'glowbg',
            display:'none',
            type:'image',
            rect:['-14','41','900','538','undefined','undefined'],
            fill:["rgba(0,0,0,0)",im+"glowbg.png"],
            transform:[[],[],[],['1.662','1.662']]
         },
         {
            id:'asiatxt_sym',
            type:'rect',
            rect:['567','240','0','0','undefined','undefined'],
            transform:[]
         },
         {
            id:'austxt_sym',
            type:'rect',
            rect:['700','436','0','0','undefined','undefined'],
            transform:[]
         },
         {
            id:'europetxt_sym',
            type:'rect',
            rect:['451','215','0','0','undefined','undefined'],
            opacity:1,
            transform:[]
         },
         {
            id:'natxt_sym',
            type:'rect',
            rect:['96','224','0','0','undefined','undefined'],
            transform:[]
         },
         {
            id:'aftxt_sym',
            type:'rect',
            rect:['365','345','0','0','undefined','undefined'],
            transform:[]
         },
         {
            id:'satxt_sym',
            type:'rect',
            rect:['187','418','0','0','undefined','undefined'],
            transform:[]
         },
         {
            id:'asiagraph_sym',
            display:'none',
            type:'rect',
            rect:['-200','0','0','0','undefined','undefined'],
            transform:[]
         },
         {
            id:'afgraph_sym',
            display:'none',
            type:'rect',
            rect:['-134','-4','0','0','undefined','undefined'],
            transform:[]
         },
         {
            id:'sagraph_sym',
            display:'none',
            type:'rect',
            rect:['-173','-58','0','0','undefined','undefined'],
            transform:[]
         },
         {
            id:'closeasia_btn',
            display:'none',
            type:'text',
            rect:['725','171','51','22','undefined','undefined'],
            text:"close x",
            align:"right",
            font:['Armata',13,"rgba(0,0,0,1)","normal","none",""],
            transform:[]
         },
         {
            id:'ocgraph_sym',
            display:'none',
            type:'rect',
            rect:['-173','-58','0','0','undefined','undefined'],
            transform:[]
         },
         {
            id:'nagraph_sym',
            display:'none',
            type:'rect',
            rect:['-173','-58','0','0','undefined','undefined'],
            transform:[]
         },
         {
            id:'closeaf_btn',
            display:'none',
            type:'text',
            rect:['725','171','51','22','undefined','undefined'],
            text:"close x",
            align:"right",
            font:['Armata',13,"rgba(0,0,0,1)","normal","none",""],
            transform:[]
         },
         {
            id:'closena_btn',
            display:'none',
            type:'text',
            rect:['725','171','51','22','undefined','undefined'],
            text:"close x",
            align:"right",
            font:['Armata',13,"rgba(0,0,0,1)","normal","none",""],
            transform:[]
         },
         {
            id:'closesa_btn',
            display:'none',
            type:'text',
            rect:['725','171','51','22','undefined','undefined'],
            text:"close x",
            align:"right",
            font:['Armata',13,"rgba(0,0,0,1)","normal","none",""],
            transform:[]
         },
         {
            id:'closeoc_btn',
            display:'none',
            type:'text',
            rect:['725','171','51','22','undefined','undefined'],
            text:"close x",
            align:"right",
            font:['Armata',13,"rgba(0,0,0,1)","normal","none",""],
            transform:[]
         },
         {
            id:'closeeu_btn',
            display:'none',
            type:'text',
            rect:['725','171','51','22','undefined','undefined'],
            text:"close x",
            align:"right",
            font:['Armata',13,"rgba(0,0,0,1)","normal","none",""],
            transform:[]
         },
         {
            id:'eugraph_sym',
            display:'none',
            type:'rect',
            rect:['-174','-58','0','0','undefined','undefined'],
            transform:[]
         },
         {
            id:'af_btn',
            type:'rect',
            rect:['406','310','128','151','undefined','undefined'],
            borderRadius:["10px","10px","10px","10px"],
            fill:["rgba(0,0,0,0)"],
            stroke:[0,"","none"],
            transform:[[],['-39']]
         },
         {
            id:'aus_btn',
            type:'rect',
            rect:['708','411','88','97','undefined','undefined'],
            borderRadius:["10px","10px","10px","10px"],
            fill:["rgba(0,0,0,0)"],
            stroke:[0,"","none"],
            transform:[[],['-88'],[],['0.709']]
         },
         {
            id:'na_btn',
            type:'rect',
            rect:['82','174','191','170','undefined','undefined'],
            borderRadius:["10px","10px","10px","10px"],
            fill:["rgba(0,0,0,0)"],
            stroke:[0,"","none"],
            transform:[]
         },
         {
            id:'europe_btn',
            type:'rect',
            rect:['407','203','160','71','undefined','undefined'],
            borderRadius:["10px","10px","10px","10px"],
            fill:["rgba(0,0,0,0)"],
            stroke:[0,"","none"],
            transform:[[],['-11']]
         },
         {
            id:'asia_btn',
            type:'rect',
            rect:['583','178','255','174','undefined','undefined'],
            borderRadius:["10px","10px","10px","10px"],
            fill:["rgba(0,0,0,0)"],
            stroke:[0,"","none"],
            transform:[[],['2'],['-34'],['1.1','1.1']]
         },
         {
            id:'sa_btn',
            type:'rect',
            rect:['241','368','105','170','undefined','undefined'],
            borderRadius:["10px","10px","10px","10px"],
            fill:["rgba(0,0,0,0)"],
            stroke:[0,"","none"],
            transform:[[],['-11']]
         }],
         symbolInstances: [
         {
            id:'sagraph_sym',
            symbolName:'sagraph_sym'
         },
         {
            id:'europetxt_sym',
            symbolName:'europetxt_sym'
         },
         {
            id:'asiatxt_sym',
            symbolName:'asiatxt_sym'
         },
         {
            id:'satxt_sym',
            symbolName:'satxt_sym'
         },
         {
            id:'afgraph_sym',
            symbolName:'afgraph_sym'
         },
         {
            id:'eugraph_sym',
            symbolName:'eugraph_sym'
         },
         {
            id:'asiagraph_sym',
            symbolName:'asiagraph_sym'
         },
         {
            id:'nagraph_sym',
            symbolName:'nagraph_sym'
         },
         {
            id:'austxt_sym',
            symbolName:'austxt_sym'
         },
         {
            id:'aftxt_sym',
            symbolName:'aftxt_sym'
         },
         {
            id:'natxt_sym',
            symbolName:'natxt_sym'
         },
         {
            id:'mapwhole_sym',
            symbolName:'mapwhole_sym'
         },
         {
            id:'ocgraph_sym',
            symbolName:'ocgraph_sym'
         }
         ]
      },
   states: {
      "Base State": {
         "${_europe_btn}": [
            ["transform", "rotateZ", '-11deg'],
            ["style", "height", '71px'],
            ["style", "cursor", 'pointer'],
            ["style", "left", '407px'],
            ["style", "width", '160px']
         ],
         "${_edge_txt}": [
            ["transform", "translateX", '0px'],
            ["transform", "translateY", '0px']
         ],
         "${_mapwhole_sym}": [
            ["transform", "scaleX", '1'],
            ["style", "top", '21px'],
            ["style", "left", '10px'],
            ["transform", "scaleY", '1']
         ],
         "${_closeoc_btn}": [
            ["color", "color", 'rgba(95,95,95,1.00)'],
            ["style", "opacity", '0'],
            ["style", "cursor", 'pointer'],
            ["style", "font-size", '13px'],
            ["style", "top", '170.02px'],
            ["style", "text-align", 'right'],
            ["style", "height", '22px'],
            ["style", "display", 'none'],
            ["style", "font-family", 'Armata'],
            ["style", "width", '51px'],
            ["style", "left", '725.22px']
         ],
         "${_glowbg}": [
            ["style", "top", '40.8px'],
            ["transform", "scaleY", '1.662'],
            ["style", "display", 'none'],
            ["style", "opacity", '0'],
            ["style", "left", '-14.58px'],
            ["transform", "scaleX", '1.662']
         ],
         "${_stage}": [
            ["color", "background-color", 'rgba(255,255,255,1)'],
            ["style", "overflow", 'hidden'],
            ["style", "height", '600px'],
            ["style", "width", '900px']
         ],
         "${_closeaf_btn}": [
            ["color", "color", 'rgba(95,95,95,1.00)'],
            ["style", "opacity", '0'],
            ["style", "cursor", 'pointer'],
            ["style", "font-size", '13px'],
            ["style", "top", '170.02px'],
            ["style", "text-align", 'right'],
            ["style", "width", '51px'],
            ["style", "display", 'none'],
            ["style", "font-family", 'Armata'],
            ["style", "height", '22px'],
            ["style", "left", '725.22px']
         ],
         "${_af_btn}": [
            ["style", "top", '310.54px'],
            ["transform", "rotateZ", '-39deg'],
            ["style", "height", '151px'],
            ["style", "cursor", 'pointer'],
            ["style", "left", '405.75px'],
            ["style", "width", '128px']
         ],
         "${_afgraph_sym}": [
            ["style", "display", 'none'],
            ["style", "opacity", '1'],
            ["style", "left", '-187.27px'],
            ["style", "top", '-57.69px']
         ],
         "${_sa_btn}": [
            ["style", "top", '368.96px'],
            ["transform", "rotateZ", '-11deg'],
            ["style", "height", '170px'],
            ["style", "cursor", 'pointer'],
            ["style", "left", '240.26px'],
            ["style", "width", '105px']
         ],
         "${_satxt_sym}": [
            ["style", "left", '186.5px'],
            ["style", "top", '417.28px']
         ],
         "${_aftxt_sym}": [
            ["style", "left", '365.6px'],
            ["style", "top", '344.01px']
         ],
         "${_asiagraph_sym}": [
            ["style", "display", 'none'],
            ["style", "opacity", '1'],
            ["style", "left", '-132.73px'],
            ["style", "top", '-4.28px']
         ],
         "${_europe_txt}": [
            ["transform", "translateY", '205.3px']
         ],
         "${_closena_btn}": [
            ["color", "color", 'rgba(95,95,95,1.00)'],
            ["style", "opacity", '0'],
            ["style", "cursor", 'pointer'],
            ["style", "font-size", '13px'],
            ["style", "top", '170.02px'],
            ["style", "text-align", 'right'],
            ["style", "display", 'none'],
            ["style", "height", '22px'],
            ["style", "font-family", 'Armata'],
            ["style", "width", '51px'],
            ["style", "left", '725.22px']
         ],
         "${_closeasia_btn}": [
            ["color", "color", 'rgba(95,95,95,1.00)'],
            ["style", "opacity", '0'],
            ["style", "left", '725.22px'],
            ["style", "font-size", '13px'],
            ["style", "top", '170.02px'],
            ["style", "text-align", 'right'],
            ["style", "display", 'none'],
            ["style", "font-family", 'Armata'],
            ["style", "height", '22px'],
            ["style", "width", '51px']
         ],
         "${_nagraph_sym}": [
            ["style", "display", 'none'],
            ["style", "opacity", '1'],
            ["style", "left", '-173.76px'],
            ["style", "top", '-58.32px']
         ],
         "${_eugraph_sym}": [
            ["style", "display", 'none'],
            ["style", "opacity", '1'],
            ["style", "left", '-174px'],
            ["style", "top", '-58px']
         ],
         "${_closesa_btn}": [
            ["color", "color", 'rgba(95,95,95,1.00)'],
            ["style", "opacity", '0'],
            ["style", "cursor", 'pointer'],
            ["style", "font-size", '13px'],
            ["style", "top", '170.02px'],
            ["style", "text-align", 'right'],
            ["style", "width", '51px'],
            ["style", "height", '22px'],
            ["style", "font-family", 'Armata'],
            ["style", "display", 'none'],
            ["style", "left", '725.22px']
         ],
         "${_asia_btn}": [
            ["transform", "rotateZ", '2deg'],
            ["transform", "scaleX", '1.1'],
            ["style", "cursor", 'pointer'],
            ["style", "width", '255px'],
            ["style", "top", '177.29px'],
            ["transform", "scaleY", '1.1'],
            ["transform", "skewX", '-34deg'],
            ["style", "height", '174px'],
            ["style", "left", '583.51px']
         ],
         "${_natxt_sym}": [
            ["style", "left", '95.5px'],
            ["style", "top", '224.1px']
         ],
         "${_asiatxt_sym}": [
            ["style", "left", '567px'],
            ["style", "top", '240px']
         ],
         "${_europetxt_sym}": [
            ["style", "top", '215px'],
            ["style", "left", '450.01px'],
            ["transform", "scaleY", '1'],
            ["transform", "scaleX", '1']
         ],
         "${_austxt_sym}": [
            ["style", "left", '699.36px'],
            ["style", "top", '435.11px']
         ],
         "${_sagraph_sym}": [
            ["style", "display", 'none'],
            ["style", "opacity", '1'],
            ["style", "left", '-173.21px'],
            ["style", "top", '-58.1px']
         ],
         "${_na_btn}": [
            ["style", "top", '174px'],
            ["style", "height", '170px'],
            ["style", "cursor", 'pointer'],
            ["style", "left", '81.68px'],
            ["style", "width", '191px']
         ],
         "${_closeeu_btn}": [
            ["color", "color", 'rgba(95,95,95,1.00)'],
            ["style", "opacity", '0'],
            ["style", "cursor", 'pointer'],
            ["style", "font-size", '13px'],
            ["style", "top", '170.02px'],
            ["style", "text-align", 'right'],
            ["style", "width", '51px'],
            ["style", "display", 'none'],
            ["style", "font-family", 'Armata'],
            ["style", "height", '22px'],
            ["style", "left", '725.22px']
         ],
         "${_aus_btn}": [
            ["style", "top", '411.01px'],
            ["style", "height", '97px'],
            ["transform", "rotateZ", '-88deg'],
            ["transform", "scaleX", '0.709'],
            ["style", "cursor", 'pointer'],
            ["style", "left", '708.33px'],
            ["style", "width", '88px']
         ],
         "${_ocgraph_sym}": [
            ["style", "display", 'none'],
            ["style", "opacity", '1'],
            ["style", "left", '-173.89px'],
            ["style", "top", '-58.38px']
         ]
      }
   },
   timelines: {
      "Default Timeline": {
         fromState: "Base State",
         toState: "",
         duration: 18393,
         autoPlay: true,
         labels: {
            "asiazoom": 1000,
            "asiazoomout": 2377,
            "africazoom": 4091,
            "africazoomout": 5468,
            "nazoom": 7250,
            "nazoomout": 8627,
            "sazoom": 10000,
            "sazoomout": 11377,
            "oczoom": 13000,
            "oczoomout": 14377,
            "euzoom": 16500,
            "euzoomout": 17877
         },
         timeline: [
            { id: "eid5581", tween: [ "style", "${_afgraph_sym}", "top", '-57.69px', { fromValue: '-57.69px'}], position: 5220, duration: 0 },
            { id: "eid3420", tween: [ "style", "${_asiagraph_sym}", "top", '-56.87px', { fromValue: '-4.28px'}], position: 1871, duration: 258 },
            { id: "eid4518", tween: [ "style", "${_closena_btn}", "opacity", '1', { fromValue: '0'}], position: 8121, duration: 258 },
            { id: "eid4519", tween: [ "style", "${_closena_btn}", "opacity", '0', { fromValue: '1'}], position: 8627, duration: 258 },
            { id: "eid4989", tween: [ "style", "${_closeeu_btn}", "opacity", '1', { fromValue: '0'}], position: 17250, duration: 258 },
            { id: "eid4990", tween: [ "style", "${_closeeu_btn}", "opacity", '0', { fromValue: '1'}], position: 17756, duration: 258 },
            { id: "eid4701", tween: [ "style", "${_closeoc_btn}", "opacity", '1', { fromValue: '0'}], position: 13871, duration: 258 },
            { id: "eid4702", tween: [ "style", "${_closeoc_btn}", "opacity", '0', { fromValue: '1'}], position: 14377, duration: 258 },
            { id: "eid3419", tween: [ "style", "${_asiagraph_sym}", "left", '-173.37px', { fromValue: '-132.73px'}], position: 1871, duration: 258 },
            { id: "eid4244", tween: [ "style", "${_closeaf_btn}", "display", 'block', { fromValue: 'none'}], position: 4962, duration: 0 },
            { id: "eid4245", tween: [ "style", "${_closeaf_btn}", "display", 'none', { fromValue: 'block'}], position: 5968, duration: 0 },
            { id: "eid4520", tween: [ "style", "${_closena_btn}", "display", 'block', { fromValue: 'none'}], position: 8121, duration: 0 },
            { id: "eid4521", tween: [ "style", "${_closena_btn}", "display", 'none', { fromValue: 'block'}], position: 9127, duration: 0 },
            { id: "eid5192", tween: [ "style", "${_afgraph_sym}", "opacity", '0', { fromValue: '1'}], position: 5468, duration: 258 },
            { id: "eid10344", tween: [ "style", "${_eugraph_sym}", "display", 'block', { fromValue: 'none'}], position: 17629, duration: 0 },
            { id: "eid3321", tween: [ "style", "${_glowbg}", "opacity", '1', { fromValue: '0'}], position: 1500, duration: 629 },
            { id: "eid3875", tween: [ "style", "${_glowbg}", "opacity", '0', { fromValue: '1'}], position: 2377, duration: 258 },
            { id: "eid4200", tween: [ "style", "${_glowbg}", "opacity", '1', { fromValue: '0'}], position: 4591, duration: 629 },
            { id: "eid4201", tween: [ "style", "${_glowbg}", "opacity", '0', { fromValue: '1'}], position: 5468, duration: 258 },
            { id: "eid4506", tween: [ "style", "${_glowbg}", "opacity", '1', { fromValue: '0'}], position: 7750, duration: 629 },
            { id: "eid4508", tween: [ "style", "${_glowbg}", "opacity", '0', { fromValue: '1'}], position: 8627, duration: 258 },
            { id: "eid4598", tween: [ "style", "${_glowbg}", "opacity", '1', { fromValue: '0'}], position: 10500, duration: 629 },
            { id: "eid4600", tween: [ "style", "${_glowbg}", "opacity", '0', { fromValue: '1'}], position: 11377, duration: 258 },
            { id: "eid4689", tween: [ "style", "${_glowbg}", "opacity", '1', { fromValue: '0'}], position: 13500, duration: 629 },
            { id: "eid4691", tween: [ "style", "${_glowbg}", "opacity", '0', { fromValue: '1'}], position: 14377, duration: 258 },
            { id: "eid4949", tween: [ "style", "${_glowbg}", "opacity", '1', { fromValue: '0'}], position: 17000, duration: 629 },
            { id: "eid4951", tween: [ "style", "${_glowbg}", "opacity", '0', { fromValue: '1'}], position: 17877, duration: 258 },
            { id: "eid2308", tween: [ "transform", "${_mapwhole_sym}", "scaleX", '2.575', { fromValue: '1'}], position: 1250, duration: 500, easing: "easeOutSine" },
            { id: "eid3664", tween: [ "transform", "${_mapwhole_sym}", "scaleX", '1', { fromValue: '2.575'}], position: 2377, duration: 500, easing: "easeOutSine" },
            { id: "eid4206", tween: [ "transform", "${_mapwhole_sym}", "scaleX", '3.134', { fromValue: '1'}], position: 4341, duration: 500, easing: "easeOutSine" },
            { id: "eid4207", tween: [ "transform", "${_mapwhole_sym}", "scaleX", '1', { fromValue: '3.134'}], position: 5468, duration: 500, easing: "easeOutSine" },
            { id: "eid4514", tween: [ "transform", "${_mapwhole_sym}", "scaleX", '2.575', { fromValue: '1'}], position: 7500, duration: 500, easing: "easeOutSine" },
            { id: "eid4515", tween: [ "transform", "${_mapwhole_sym}", "scaleX", '1', { fromValue: '2.575'}], position: 8627, duration: 500, easing: "easeOutSine" },
            { id: "eid4606", tween: [ "transform", "${_mapwhole_sym}", "scaleX", '3.107', { fromValue: '1'}], position: 10250, duration: 500, easing: "easeOutSine" },
            { id: "eid4607", tween: [ "transform", "${_mapwhole_sym}", "scaleX", '1', { fromValue: '3.107'}], position: 11377, duration: 500, easing: "easeOutSine" },
            { id: "eid4693", tween: [ "transform", "${_mapwhole_sym}", "scaleX", '4.006', { fromValue: '1'}], position: 13250, duration: 500, easing: "easeOutSine" },
            { id: "eid4697", tween: [ "transform", "${_mapwhole_sym}", "scaleX", '1', { fromValue: '4.006'}], position: 14377, duration: 500, easing: "easeOutSine" },
            { id: "eid4953", tween: [ "transform", "${_mapwhole_sym}", "scaleX", '3.621', { fromValue: '1'}], position: 16750, duration: 500, easing: "easeOutSine" },
            { id: "eid4957", tween: [ "transform", "${_mapwhole_sym}", "scaleX", '1', { fromValue: '3.621'}], position: 17877, duration: 500, easing: "easeOutSine" },
            { id: "eid2306", tween: [ "style", "${_mapwhole_sym}", "left", '-523.86px', { fromValue: '10px'}], position: 1250, duration: 500, easing: "easeOutSine" },
            { id: "eid3663", tween: [ "style", "${_mapwhole_sym}", "left", '10px', { fromValue: '-523.86px'}], position: 2377, duration: 500, easing: "easeOutSine" },
            { id: "eid4202", tween: [ "style", "${_mapwhole_sym}", "left", '-41.31px', { fromValue: '10px'}], position: 4341, duration: 500, easing: "easeOutSine" },
            { id: "eid4203", tween: [ "style", "${_mapwhole_sym}", "left", '10px', { fromValue: '-41.31px'}], position: 5468, duration: 500, easing: "easeOutSine" },
            { id: "eid4510", tween: [ "style", "${_mapwhole_sym}", "left", '678.99px', { fromValue: '10px'}], position: 7500, duration: 500, easing: "easeOutSine" },
            { id: "eid4511", tween: [ "style", "${_mapwhole_sym}", "left", '10px', { fromValue: '678.99px'}], position: 8627, duration: 500, easing: "easeOutSine" },
            { id: "eid4602", tween: [ "style", "${_mapwhole_sym}", "left", '583.73px', { fromValue: '10px'}], position: 10250, duration: 500, easing: "easeOutSine" },
            { id: "eid4603", tween: [ "style", "${_mapwhole_sym}", "left", '10px', { fromValue: '583.73px'}], position: 11377, duration: 500, easing: "easeOutSine" },
            { id: "eid4694", tween: [ "style", "${_mapwhole_sym}", "left", '-1250.1px', { fromValue: '10px'}], position: 13250, duration: 500, easing: "easeOutSine" },
            { id: "eid4698", tween: [ "style", "${_mapwhole_sym}", "left", '10px', { fromValue: '-1250.1px'}], position: 14377, duration: 500, easing: "easeOutSine" },
            { id: "eid4954", tween: [ "style", "${_mapwhole_sym}", "left", '-160.18px', { fromValue: '10px'}], position: 16750, duration: 500, easing: "easeOutSine" },
            { id: "eid4958", tween: [ "style", "${_mapwhole_sym}", "left", '10px', { fromValue: '-160.18px'}], position: 17877, duration: 500, easing: "easeOutSine" },
            { id: "eid3322", tween: [ "style", "${_glowbg}", "display", 'block', { fromValue: 'none'}], position: 1500, duration: 0 },
            { id: "eid4488", tween: [ "style", "${_glowbg}", "display", 'none', { fromValue: 'block'}], position: 2635, duration: 0 },
            { id: "eid4199", tween: [ "style", "${_glowbg}", "display", 'block', { fromValue: 'none'}], position: 4591, duration: 0 },
            { id: "eid4489", tween: [ "style", "${_glowbg}", "display", 'none', { fromValue: 'block'}], position: 5726, duration: 0 },
            { id: "eid4507", tween: [ "style", "${_glowbg}", "display", 'block', { fromValue: 'none'}], position: 7750, duration: 0 },
            { id: "eid4509", tween: [ "style", "${_glowbg}", "display", 'none', { fromValue: 'block'}], position: 8885, duration: 0 },
            { id: "eid4599", tween: [ "style", "${_glowbg}", "display", 'block', { fromValue: 'none'}], position: 10500, duration: 0 },
            { id: "eid4601", tween: [ "style", "${_glowbg}", "display", 'none', { fromValue: 'block'}], position: 11635, duration: 0 },
            { id: "eid4690", tween: [ "style", "${_glowbg}", "display", 'block', { fromValue: 'none'}], position: 13500, duration: 0 },
            { id: "eid4692", tween: [ "style", "${_glowbg}", "display", 'none', { fromValue: 'block'}], position: 14635, duration: 0 },
            { id: "eid4950", tween: [ "style", "${_glowbg}", "display", 'block', { fromValue: 'none'}], position: 17000, duration: 0 },
            { id: "eid4952", tween: [ "style", "${_glowbg}", "display", 'none', { fromValue: 'block'}], position: 18135, duration: 0 },
            { id: "eid6021", tween: [ "style", "${_nagraph_sym}", "display", 'block', { fromValue: 'none'}], position: 8258, duration: 0 },
            { id: "eid4991", tween: [ "style", "${_closeeu_btn}", "display", 'block', { fromValue: 'none'}], position: 17250, duration: 0 },
            { id: "eid4992", tween: [ "style", "${_closeeu_btn}", "display", 'none', { fromValue: 'block'}], position: 18256, duration: 0 },
            { id: "eid2309", tween: [ "transform", "${_mapwhole_sym}", "scaleY", '2.575', { fromValue: '1'}], position: 1250, duration: 500, easing: "easeOutSine" },
            { id: "eid3666", tween: [ "transform", "${_mapwhole_sym}", "scaleY", '1', { fromValue: '2.575'}], position: 2377, duration: 500, easing: "easeOutSine" },
            { id: "eid4208", tween: [ "transform", "${_mapwhole_sym}", "scaleY", '3.134', { fromValue: '1'}], position: 4341, duration: 500, easing: "easeOutSine" },
            { id: "eid4209", tween: [ "transform", "${_mapwhole_sym}", "scaleY", '1', { fromValue: '3.134'}], position: 5468, duration: 500, easing: "easeOutSine" },
            { id: "eid4516", tween: [ "transform", "${_mapwhole_sym}", "scaleY", '2.575', { fromValue: '1'}], position: 7500, duration: 500, easing: "easeOutSine" },
            { id: "eid4517", tween: [ "transform", "${_mapwhole_sym}", "scaleY", '1', { fromValue: '2.575'}], position: 8627, duration: 500, easing: "easeOutSine" },
            { id: "eid4608", tween: [ "transform", "${_mapwhole_sym}", "scaleY", '3.107', { fromValue: '1'}], position: 10250, duration: 500, easing: "easeOutSine" },
            { id: "eid4609", tween: [ "transform", "${_mapwhole_sym}", "scaleY", '1', { fromValue: '3.107'}], position: 11377, duration: 500, easing: "easeOutSine" },
            { id: "eid4696", tween: [ "transform", "${_mapwhole_sym}", "scaleY", '4.006', { fromValue: '1'}], position: 13250, duration: 500, easing: "easeOutSine" },
            { id: "eid4700", tween: [ "transform", "${_mapwhole_sym}", "scaleY", '1', { fromValue: '4.006'}], position: 14377, duration: 500, easing: "easeOutSine" },
            { id: "eid4956", tween: [ "transform", "${_mapwhole_sym}", "scaleY", '3.621', { fromValue: '1'}], position: 16750, duration: 500, easing: "easeOutSine" },
            { id: "eid4960", tween: [ "transform", "${_mapwhole_sym}", "scaleY", '1', { fromValue: '3.621'}], position: 17877, duration: 500, easing: "easeOutSine" },
            { id: "eid26019", tween: [ "style", "${_mapwhole_sym}", "top", '21px', { fromValue: '21px'}], position: 0, duration: 0 },
            { id: "eid2307", tween: [ "style", "${_mapwhole_sym}", "top", '127.74px', { fromValue: '21px'}], position: 1250, duration: 500, easing: "easeOutSine" },
            { id: "eid3665", tween: [ "style", "${_mapwhole_sym}", "top", '21px', { fromValue: '127.74px'}], position: 2377, duration: 500, easing: "easeOutSine" },
            { id: "eid4204", tween: [ "style", "${_mapwhole_sym}", "top", '-241.39px', { fromValue: '21px'}], position: 4341, duration: 500, easing: "easeOutSine" },
            { id: "eid4205", tween: [ "style", "${_mapwhole_sym}", "top", '21px', { fromValue: '-241.39px'}], position: 5468, duration: 500, easing: "easeOutSine" },
            { id: "eid4512", tween: [ "style", "${_mapwhole_sym}", "top", '171.53px', { fromValue: '21px'}], position: 7500, duration: 500, easing: "easeOutSine" },
            { id: "eid4513", tween: [ "style", "${_mapwhole_sym}", "top", '21px', { fromValue: '171.53px'}], position: 8627, duration: 500, easing: "easeOutSine" },
            { id: "eid4604", tween: [ "style", "${_mapwhole_sym}", "top", '-432.32px', { fromValue: '21px'}], position: 10250, duration: 500, easing: "easeOutSine" },
            { id: "eid4605", tween: [ "style", "${_mapwhole_sym}", "top", '21px', { fromValue: '-432.32px'}], position: 11377, duration: 500, easing: "easeOutSine" },
            { id: "eid4695", tween: [ "style", "${_mapwhole_sym}", "top", '-612.07px', { fromValue: '21px'}], position: 13250, duration: 500, easing: "easeOutSine" },
            { id: "eid4699", tween: [ "style", "${_mapwhole_sym}", "top", '21px', { fromValue: '-612.07px'}], position: 14377, duration: 500, easing: "easeOutSine" },
            { id: "eid4955", tween: [ "style", "${_mapwhole_sym}", "top", '206.51px', { fromValue: '21px'}], position: 16750, duration: 500, easing: "easeOutSine" },
            { id: "eid4959", tween: [ "style", "${_mapwhole_sym}", "top", '21px', { fromValue: '206.51px'}], position: 17877, duration: 500, easing: "easeOutSine" },
            { id: "eid10346", tween: [ "style", "${_eugraph_sym}", "opacity", '0', { fromValue: '1'}], position: 18135, duration: 258 },
            { id: "eid6099", tween: [ "style", "${_sagraph_sym}", "display", 'block', { fromValue: 'none'}], position: 10871, duration: 0 },
            { id: "eid5191", tween: [ "style", "${_afgraph_sym}", "left", '-174.27px', { fromValue: '-187.27px'}], position: 4962, duration: 258 },
            { id: "eid6595", tween: [ "style", "${_ocgraph_sym}", "opacity", '0', { fromValue: '1'}], position: 14256, duration: 258 },
            { id: "eid6023", tween: [ "style", "${_nagraph_sym}", "opacity", '0', { fromValue: '1'}], position: 8764, duration: 258 },
            { id: "eid6594", tween: [ "style", "${_ocgraph_sym}", "display", 'block', { fromValue: 'none'}], position: 13750, duration: 0 },
            { id: "eid3848", tween: [ "style", "${_closeasia_btn}", "opacity", '1', { fromValue: '0'}], position: 1871, duration: 258 },
            { id: "eid3873", tween: [ "style", "${_closeasia_btn}", "opacity", '0', { fromValue: '1'}], position: 2377, duration: 258 },
            { id: "eid4703", tween: [ "style", "${_closeoc_btn}", "display", 'block', { fromValue: 'none'}], position: 13871, duration: 0 },
            { id: "eid4704", tween: [ "style", "${_closeoc_btn}", "display", 'none', { fromValue: 'block'}], position: 14877, duration: 0 },
            { id: "eid6022", tween: [ "style", "${_nagraph_sym}", "top", '-58.32px', { fromValue: '-58.32px'}], position: 8516, duration: 0 },
            { id: "eid4644", tween: [ "style", "${_closesa_btn}", "display", 'block', { fromValue: 'none'}], position: 10871, duration: 0 },
            { id: "eid4645", tween: [ "style", "${_closesa_btn}", "display", 'none', { fromValue: 'block'}], position: 11877, duration: 0 },
            { id: "eid4642", tween: [ "style", "${_closesa_btn}", "opacity", '1', { fromValue: '0'}], position: 10871, duration: 258 },
            { id: "eid4643", tween: [ "style", "${_closesa_btn}", "opacity", '0', { fromValue: '1'}], position: 11377, duration: 258 },
            { id: "eid5388", tween: [ "style", "${_afgraph_sym}", "display", 'block', { fromValue: 'none'}], position: 4962, duration: 0 },
            { id: "eid6101", tween: [ "style", "${_sagraph_sym}", "opacity", '0', { fromValue: '1'}], position: 11377, duration: 258 },
            { id: "eid2697", tween: [ "style", "${_asiagraph_sym}", "display", 'block', { fromValue: 'none'}], position: 1871, duration: 0 },
            { id: "eid5337", tween: [ "style", "${_asiagraph_sym}", "display", 'none', { fromValue: 'block'}], position: 2635, duration: 0 },
            { id: "eid4238", tween: [ "style", "${_closeaf_btn}", "opacity", '1', { fromValue: '0'}], position: 4962, duration: 258 },
            { id: "eid4239", tween: [ "style", "${_closeaf_btn}", "opacity", '0', { fromValue: '1'}], position: 5468, duration: 258 },
            { id: "eid3876", tween: [ "style", "${_asiagraph_sym}", "opacity", '0', { fromValue: '1'}], position: 2377, duration: 258 },
            { id: "eid3985", tween: [ "style", "${_closeasia_btn}", "display", 'block', { fromValue: 'none'}], position: 1871, duration: 0 },
            { id: "eid3986", tween: [ "style", "${_closeasia_btn}", "display", 'none', { fromValue: 'block'}], position: 2877, duration: 0 },
            { id: "eid4064", tween: [ "color", "${_closeasia_btn}", "color", 'rgba(0,0,0,1)', { animationColorSpace: 'RGB', valueTemplate: undefined, fromValue: 'rgba(95,95,95,1.00)'}], position: 2377, duration: 0 }         ]
      }
   }
},
"map_sym": {
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
      rect: [-691.900546,-340.138563,2262,1113],
      id: 'map',
      transform: [[0,0],null,null,[0.38824,0.38824]],
      type: 'image',
      fill: ['rgba(0,0,0,0)','images/map.png']
   }],
   symbolInstances: [
   ]
   },
   states: {
      "Base State": {
         "${symbolSelector}": [
            ["style", "height", '432.11112px'],
            ["style", "width", '878.19888px']
         ],
         "${_map}": [
            ["transform", "scaleX", '0.388'],
            ["style", "top", '-340.13px'],
            ["style", "left", '-691.9px'],
            ["transform", "scaleY", '0.388']
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
         ]
      }
   }
},
"europetxt_sym": {
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
      font: ['Armata',20,'rgba(93,30,156,1.00)','normal','none',''],
      type: 'text',
      rect: [1.2999999967178e-05,0,105,50],
      id: 'europe_txt',
      text: 'Europe',
      align: 'center',
      transform: [[0,0]]
   }],
   symbolInstances: [
   ]
   },
   states: {
      "Base State": {
         "${symbolSelector}": [
            ["style", "height", '50px'],
            ["style", "width", '105px']
         ],
         "${_europe_txt}": [
            ["color", "color", 'rgba(93,30,156,1.00)'],
            ["style", "opacity", '0'],
            ["style", "left", '-0.37px'],
            ["style", "width", '105px'],
            ["style", "top", '-16.53px'],
            ["style", "text-align", 'center'],
            ["style", "height", '50px'],
            ["style", "font-family", 'Armata'],
            ["style", "font-size", '20px']
         ]
      }
   },
   timelines: {
      "Default Timeline": {
         fromState: "Base State",
         toState: "",
         duration: 571.62109375,
         autoPlay: true,
         timeline: [
            { id: "eid8", tween: [ "style", "${_europe_txt}", "opacity", '1', { fromValue: '0'}], position: 0, duration: 571, easing: "swing" },
            { id: "eid6", tween: [ "style", "${_europe_txt}", "top", '0px', { fromValue: '-16.53px'}], position: 0, duration: 571, easing: "swing" }         ]
      }
   }
},
"natxt_sym": {
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
      font: ['Armata',20,'rgba(93,30,156,1.00)','normal','none',''],
      type: 'text',
      rect: [1.2999999967178e-05,0,105,50],
      id: 'europe_txt',
      text: 'North America',
      align: 'center',
      transform: [[0,0]]
   }],
   symbolInstances: [
   ]
   },
   states: {
      "Base State": {
         "${symbolSelector}": [
            ["style", "height", '50px'],
            ["style", "width", '105px']
         ],
         "${_europe_txt}": [
            ["color", "color", 'rgba(93,30,156,1.00)'],
            ["style", "opacity", '0'],
            ["style", "left", '-0.37px'],
            ["style", "width", '105px'],
            ["style", "top", '-16.53px'],
            ["style", "text-align", 'center'],
            ["style", "height", '50px'],
            ["style", "font-family", 'Armata'],
            ["style", "font-size", '20px']
         ]
      }
   },
   timelines: {
      "Default Timeline": {
         fromState: "Base State",
         toState: "",
         duration: 571.62109375,
         autoPlay: true,
         timeline: [
            { id: "eid8", tween: [ "style", "${_europe_txt}", "opacity", '1', { fromValue: '0'}], position: 0, duration: 571, easing: "swing" },
            { id: "eid10", tween: [ "style", "${_europe_txt}", "width", '195px', { fromValue: '195px'}], position: 0, duration: 0 },
            { id: "eid6", tween: [ "style", "${_europe_txt}", "top", '0px', { fromValue: '-16.53px'}], position: 0, duration: 571, easing: "swing" },
            { id: "eid12", tween: [ "color", "${_europe_txt}", "color", 'rgba(19,51,100,1.00)', { animationColorSpace: 'RGB', valueTemplate: undefined, fromValue: 'rgba(19,51,100,1.00)'}], position: 0, duration: 0 }         ]
      }
   }
},
"aftxt_sym": {
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
      font: ['Armata',20,'rgba(93,30,156,1.00)','normal','none',''],
      type: 'text',
      rect: [1.2999999967178e-05,0,105,50],
      id: 'europe_txt',
      text: 'Africa',
      align: 'center',
      transform: [[0,0]]
   }],
   symbolInstances: [
   ]
   },
   states: {
      "Base State": {
         "${_europe_txt}": [
            ["color", "color", 'rgba(93,30,156,1.00)'],
            ["style", "opacity", '0'],
            ["style", "left", '-0.37px'],
            ["style", "width", '105px'],
            ["style", "top", '-16.53px'],
            ["style", "text-align", 'center'],
            ["style", "height", '50px'],
            ["style", "font-family", 'Armata'],
            ["style", "font-size", '20px']
         ],
         "${symbolSelector}": [
            ["style", "height", '50px'],
            ["style", "width", '105px']
         ]
      }
   },
   timelines: {
      "Default Timeline": {
         fromState: "Base State",
         toState: "",
         duration: 571.62109375,
         autoPlay: true,
         timeline: [
            { id: "eid8", tween: [ "style", "${_europe_txt}", "opacity", '1', { fromValue: '0'}], position: 0, duration: 571, easing: "swing" },
            { id: "eid10", tween: [ "style", "${_europe_txt}", "width", '195px', { fromValue: '195px'}], position: 0, duration: 0 },
            { id: "eid13", tween: [ "color", "${_europe_txt}", "color", 'rgba(95,63,1,1.00)', { animationColorSpace: 'RGB', valueTemplate: undefined, fromValue: 'rgba(157,103,0,1.00)'}], position: 0, duration: 0 },
            { id: "eid6", tween: [ "style", "${_europe_txt}", "top", '0px', { fromValue: '-16.53px'}], position: 0, duration: 571, easing: "swing" }         ]
      }
   }
},
"austxt_sym": {
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
      font: ['Armata',20,'rgba(93,30,156,1.00)','normal','none',''],
      type: 'text',
      rect: [-45.367167,0,105,50],
      id: 'europe_txt',
      text: 'Oceania',
      align: 'center',
      transform: [[0,0]]
   }],
   symbolInstances: [
   ]
   },
   states: {
      "Base State": {
         "${_europe_txt}": [
            ["color", "color", 'rgba(93,30,156,1.00)'],
            ["style", "opacity", '0'],
            ["style", "left", '-45.38px'],
            ["style", "width", '105px'],
            ["style", "top", '-7.04px'],
            ["style", "text-align", 'center'],
            ["style", "height", '50px'],
            ["style", "font-family", 'Armata'],
            ["style", "font-size", '20px']
         ],
         "${symbolSelector}": [
            ["style", "height", '50px'],
            ["style", "width", '105px']
         ]
      }
   },
   timelines: {
      "Default Timeline": {
         fromState: "Base State",
         toState: "",
         duration: 571.62109375,
         autoPlay: true,
         timeline: [
            { id: "eid8", tween: [ "style", "${_europe_txt}", "opacity", '1', { fromValue: '0'}], position: 0, duration: 571, easing: "swing" },
            { id: "eid10", tween: [ "style", "${_europe_txt}", "width", '195px', { fromValue: '195px'}], position: 0, duration: 0 },
            { id: "eid6", tween: [ "style", "${_europe_txt}", "top", '11.96px', { fromValue: '-7.04px'}], position: 0, duration: 571, easing: "swing" },
            { id: "eid13", tween: [ "color", "${_europe_txt}", "color", 'rgba(33,110,46,1.00)', { animationColorSpace: 'RGB', valueTemplate: undefined, fromValue: 'rgba(157,103,0,1.00)'}], position: 0, duration: 0 }         ]
      }
   }
},
"asiatxt_sym": {
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
      font: ['Armata',20,'rgba(93,30,156,1.00)','normal','none',''],
      type: 'text',
      rect: [1.2999999967178e-05,0,105,50],
      id: 'europe_txt',
      text: 'Asia',
      align: 'center',
      transform: [[0,0]]
   }],
   symbolInstances: [
   ]
   },
   states: {
      "Base State": {
         "${_europe_txt}": [
            ["color", "color", 'rgba(93,30,156,1.00)'],
            ["style", "opacity", '0'],
            ["style", "left", '-0.37px'],
            ["style", "width", '105px'],
            ["style", "top", '-16.53px'],
            ["style", "text-align", 'center'],
            ["style", "height", '50px'],
            ["style", "font-family", 'Armata'],
            ["style", "font-size", '20px']
         ],
         "${symbolSelector}": [
            ["style", "height", '50px'],
            ["style", "width", '105px']
         ]
      }
   },
   timelines: {
      "Default Timeline": {
         fromState: "Base State",
         toState: "",
         duration: 571.62109375,
         autoPlay: true,
         timeline: [
            { id: "eid8", tween: [ "style", "${_europe_txt}", "opacity", '1', { fromValue: '0'}], position: 0, duration: 571, easing: "swing" },
            { id: "eid10", tween: [ "style", "${_europe_txt}", "width", '195px', { fromValue: '195px'}], position: 0, duration: 0 },
            { id: "eid6", tween: [ "style", "${_europe_txt}", "top", '0px', { fromValue: '-16.53px'}], position: 0, duration: 571, easing: "swing" },
            { id: "eid13", tween: [ "color", "${_europe_txt}", "color", 'rgba(59,59,59,1.00)', { animationColorSpace: 'RGB', valueTemplate: undefined, fromValue: 'rgba(157,103,0,1.00)'}], position: 0, duration: 0 }         ]
      }
   }
},
"satxt_sym": {
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
      font: ['Armata',20,'rgba(93,30,156,1.00)','normal','none',''],
      type: 'text',
      rect: [1.2999999967178e-05,0,105,50],
      id: 'europe_txt',
      text: 'South America',
      align: 'center',
      transform: [[0,0]]
   }],
   symbolInstances: [
   ]
   },
   states: {
      "Base State": {
         "${_europe_txt}": [
            ["color", "color", 'rgba(93,30,156,1.00)'],
            ["style", "opacity", '0'],
            ["style", "left", '-0.37px'],
            ["style", "width", '105px'],
            ["style", "top", '-16.53px'],
            ["style", "text-align", 'center'],
            ["style", "height", '50px'],
            ["style", "font-family", 'Armata'],
            ["style", "font-size", '20px']
         ],
         "${symbolSelector}": [
            ["style", "height", '50px'],
            ["style", "width", '105px']
         ]
      }
   },
   timelines: {
      "Default Timeline": {
         fromState: "Base State",
         toState: "",
         duration: 571.62109375,
         autoPlay: true,
         timeline: [
            { id: "eid8", tween: [ "style", "${_europe_txt}", "opacity", '1', { fromValue: '0'}], position: 0, duration: 571, easing: "swing" },
            { id: "eid10", tween: [ "style", "${_europe_txt}", "width", '195px', { fromValue: '195px'}], position: 0, duration: 0 },
            { id: "eid6", tween: [ "style", "${_europe_txt}", "top", '0px', { fromValue: '-16.53px'}], position: 0, duration: 571, easing: "swing" },
            { id: "eid13", tween: [ "color", "${_europe_txt}", "color", 'rgba(138,91,0,1.00)', { animationColorSpace: 'RGB', valueTemplate: undefined, fromValue: 'rgba(157,103,0,1.00)'}], position: 0, duration: 0 }         ]
      }
   }
},
"asiagraph_sym": {
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
      rect: [267.78508,229.00001,282,149],
      id: 'as1',
      transform: [[0,0],[360]],
      type: 'image',
      fill: ['rgba(0,0,0,0)','images/as1.png']
   },
   {
      rect: [282.00002,243,158,135],
      id: 'as2',
      transform: [[0,0]],
      type: 'image',
      fill: ['rgba(0,0,0,0)','images/as2.png']
   },
   {
      rect: [320.99999,336.00001,25,42],
      id: 'as5',
      transform: [[0,0]],
      type: 'image',
      fill: ['rgba(0,0,0,0)','images/as5.png']
   },
   {
      rect: [335.984355,317.85547875,41,60],
      id: 'as6',
      transform: [[0,0]],
      type: 'image',
      fill: ['rgba(0,0,0,0)','images/as6.png']
   },
   {
      rect: [322.515615,331.09374,25,47],
      id: 'as4',
      transform: [[0,0]],
      type: 'image',
      fill: ['rgba(0,0,0,0)','images/as4.png']
   },
   {
      rect: [296,309.3828025,36,69],
      id: 'as3',
      transform: [[0,0]],
      type: 'image',
      fill: ['rgba(0,0,0,0)','images/as3.png']
   },
   {
      transform: [[0,0]],
      rect: [264.33331298828,377.49997901917,91.360687255859,1.904296875],
      id: 'Rectangle',
      stroke: [0,'rgba(0, 0, 0, 0)','none'],
      type: 'rect',
      fill: ['rgba(88,89,90,1.00)',null]
   },
   {
      id: 'operaico_sym',
      rect: [269.000005,379.500018,0,0],
      type: 'rect',
      transform: {}
   },
   {
      id: 'nokiaico_sym',
      rect: [283.500009,379.500018,0,0],
      type: 'rect',
      transform: {}
   },
   {
      id: 'bbico_sym',
      rect: [294.499997,379.500018,0,0],
      type: 'rect',
      transform: {}
   },
   {
      id: 'appleico_sym',
      rect: [312,379.500018,0,0],
      type: 'rect',
      transform: {}
   },
   {
      id: 'netfrontico_sym',
      rect: [326.333337,379.500018,0,0],
      type: 'rect',
      transform: {}
   },
   {
      id: 'otherico_sym',
      rect: [337.500004,379.500018,0,0],
      type: 'rect',
      transform: {}
   },
   {
      rect: [586.78122,257,433.80078125,31],
      transform: [[0,0]],
      id: 'header',
      text: 'Mobile Browser Marketshare',
      font: ['Armata',24,'rgba(65,64,66,1.00)','normal','none',''],
      type: 'text'
   },
   {
      rect: [586.78122,288.00001,433.80078125,31],
      transform: [[0,0]],
      id: 'TextCopy',
      text: 'Asia',
      font: ['Armata',24,'rgba(144,144,144,1.00)','normal','none',''],
      type: 'text'
   },
   {
      font: ['Armata',13,'rgba(63,215,95,1.00)','normal','none','normal'],
      rect: [587,331,91,16],
      align: 'auto',
      opacity: 1,
      id: 'opera_txt',
      text: 'Opera',
      transform: {},
      type: 'text'
   },
   {
      font: ['Armata',13,'rgba(144,144,144,1.00)','normal','none','normal'],
      rect: [587,347,91,16],
      align: 'auto',
      opacity: 1,
      id: 'operapercent_txt',
      text: 'xxx',
      transform: [[0,0]],
      type: 'text'
   },
   {
      font: ['Armata',13,'rgba(144,144,144,1.00)','normal','none','normal'],
      rect: [587,392.99999,91,16],
      align: 'auto',
      opacity: 1,
      id: 'nokiapercent_txt',
      text: 'xxx',
      transform: [[0,0]],
      type: 'text'
   },
   {
      font: ['Armata',13,'rgba(63,215,95,1.00)','normal','none','normal'],
      rect: [587,376.99999,91,16],
      align: 'auto',
      opacity: 1,
      id: 'nokia_txt',
      text: 'Nokia',
      transform: [[0,0]],
      type: 'text'
   },
   {
      font: ['Armata',13,'rgba(63,215,95,1.00)','normal','none','normal'],
      rect: [587,420.99999,91,16],
      align: 'auto',
      opacity: 1,
      id: 'bb_txt',
      text: 'BlackBerry',
      transform: [[0,0]],
      type: 'text'
   },
   {
      font: ['Armata',13,'rgba(144,144,144,1.00)','normal','none','normal'],
      rect: [587,436.99999,91,16],
      align: 'auto',
      opacity: 1,
      id: 'bbpercent_txt',
      text: 'xxx',
      transform: [[0,0]],
      type: 'text'
   },
   {
      font: ['Armata',13,'rgba(144,144,144,1.00)','normal','none','normal'],
      rect: [722.85937,436.99999,91,16],
      align: 'auto',
      opacity: 1,
      id: 'otherpercent_txt',
      text: 'xxx',
      transform: [[0,0]],
      type: 'text'
   },
   {
      font: ['Armata',13,'rgba(63,215,95,1.00)','normal','none','normal'],
      rect: [722.85937,420.99999,91,16],
      align: 'auto',
      opacity: 1,
      id: 'other_txt',
      text: 'Other',
      transform: [[0,0]],
      type: 'text'
   },
   {
      font: ['Armata',13,'rgba(63,215,95,1.00)','normal','none','normal'],
      rect: [722.85937,376.99999,91,16],
      align: 'auto',
      opacity: 1,
      id: 'netfront_txt',
      text: 'NetFront',
      transform: [[0,0]],
      type: 'text'
   },
   {
      font: ['Armata',13,'rgba(144,144,144,1.00)','normal','none','normal'],
      rect: [722.85937,392.99999,91,16],
      align: 'auto',
      opacity: 1,
      id: 'netfrontpercent_txt',
      text: 'xxx',
      transform: [[0,0]],
      type: 'text'
   },
   {
      font: ['Armata',13,'rgba(144,144,144,1.00)','normal','none','normal'],
      rect: [722.85937,347,91,16],
      align: 'auto',
      opacity: 1,
      id: 'iospercent_txt',
      text: 'xxx',
      transform: [[0,0]],
      type: 'text'
   },
   {
      font: ['Armata',13,'rgba(63,215,95,1.00)','normal','none','normal'],
      rect: [722.85937,331,91,16],
      align: 'auto',
      opacity: 1,
      id: 'apple_txt',
      text: 'iOS',
      transform: [[0,0]],
      type: 'text'
   }],
   symbolInstances: [
   {
      id: 'operaico_sym',
      symbolName: 'operaico_sym'
   },
   {
      id: 'netfrontico_sym',
      symbolName: 'netfrontico_sym'
   },
   {
      id: 'nokiaico_sym',
      symbolName: 'nokiaico_sy'
   },
   {
      id: 'appleico_sym',
      symbolName: 'appleico_sym'
   },
   {
      id: 'bbico_sym',
      symbolName: 'bbico_sym'
   },
   {
      id: 'otherico_sym',
      symbolName: 'otherico_sym'
   }   ]
   },
   states: {
      "Base State": {
         "${_bbpercent_txt}": [
            ["style", "top", '436.99px'],
            ["style", "font-size", '13px'],
            ["style", "height", '16px'],
            ["color", "color", 'rgba(144,144,144,1.00)'],
            ["style", "opacity", '0'],
            ["style", "left", '587px'],
            ["style", "width", '91px']
         ],
         "${_as5}": [
            ["style", "-webkit-transform-origin", [310.72,113.32], {valueTemplate:'@@0@@% @@1@@%'} ],
            ["style", "-moz-transform-origin", [310.72,113.32],{valueTemplate:'@@0@@% @@1@@%'}],
            ["style", "-ms-transform-origin", [310.72,113.32],{valueTemplate:'@@0@@% @@1@@%'}],
            ["style", "msTransformOrigin", [310.72,113.32],{valueTemplate:'@@0@@% @@1@@%'}],
            ["style", "-o-transform-origin", [310.72,113.32],{valueTemplate:'@@0@@% @@1@@%'}],
            ["transform", "rotateZ", '131deg'],
            ["style", "opacity", '0'],
            ["style", "left", '307.35px'],
            ["style", "top", '337.84px']
         ],
         "${_otherico_sym}": [
            ["style", "clip", [0,12,0,0], {valueTemplate:'rect(@@0@@px @@1@@px @@2@@px @@3@@px)'} ]
         ],
         "${_nokiapercent_txt}": [
            ["style", "top", '392.99px'],
            ["style", "width", '91px'],
            ["color", "color", 'rgba(144,144,144,1.00)'],
            ["style", "height", '16px'],
            ["style", "opacity", '0'],
            ["style", "left", '587px'],
            ["style", "font-size", '13px']
         ],
         "${_as1}": [
            ["style", "-webkit-transform-origin", [50.19,103.16], {valueTemplate:'@@0@@% @@1@@%'} ],
            ["style", "-moz-transform-origin", [50.19,103.16],{valueTemplate:'@@0@@% @@1@@%'}],
            ["style", "-ms-transform-origin", [50.19,103.16],{valueTemplate:'@@0@@% @@1@@%'}],
            ["style", "msTransformOrigin", [50.19,103.16],{valueTemplate:'@@0@@% @@1@@%'}],
            ["style", "-o-transform-origin", [50.19,103.16],{valueTemplate:'@@0@@% @@1@@%'}],
            ["transform", "rotateZ", '153deg'],
            ["style", "opacity", '0'],
            ["style", "left", '281.11px'],
            ["style", "top", '261.33px']
         ],
         "${_netfrontpercent_txt}": [
            ["style", "top", '392.99px'],
            ["style", "font-size", '13px'],
            ["style", "height", '16px'],
            ["color", "color", 'rgba(144,144,144,1.00)'],
            ["style", "opacity", '0'],
            ["style", "left", '722.85px'],
            ["style", "width", '91px']
         ],
         "${_as3}": [
            ["style", "-webkit-transform-origin", [279.17,147.48], {valueTemplate:'@@0@@% @@1@@%'} ],
            ["style", "-moz-transform-origin", [279.17,147.48],{valueTemplate:'@@0@@% @@1@@%'}],
            ["style", "-ms-transform-origin", [279.17,147.48],{valueTemplate:'@@0@@% @@1@@%'}],
            ["style", "msTransformOrigin", [279.17,147.48],{valueTemplate:'@@0@@% @@1@@%'}],
            ["style", "-o-transform-origin", [279.17,147.48],{valueTemplate:'@@0@@% @@1@@%'}],
            ["transform", "rotateZ", '289deg'],
            ["style", "opacity", '0'],
            ["style", "left", '296px'],
            ["style", "top", '309.38px']
         ],
         "${symbolSelector}": [
            ["style", "height", '149px'],
            ["style", "width", '282px']
         ],
         "${_nokiaico_sym}": [
            ["style", "clip", [0,12,0,0], {valueTemplate:'rect(@@0@@px @@1@@px @@2@@px @@3@@px)'} ]
         ],
         "${_nokia_txt}": [
            ["style", "top", '376.99px'],
            ["style", "font-size", '13px'],
            ["style", "height", '16px'],
            ["color", "color", 'rgba(171,109,169,1.00)'],
            ["style", "opacity", '0'],
            ["style", "left", '587px'],
            ["style", "width", '91px']
         ],
         "${_netfrontico_sym}": [
            ["style", "clip", [0,12,0,0], {valueTemplate:'rect(@@0@@px @@1@@px @@2@@px @@3@@px)'} ]
         ],
         "${_otherpercent_txt}": [
            ["style", "top", '436.99px'],
            ["style", "width", '91px'],
            ["color", "color", 'rgba(144,144,144,1.00)'],
            ["style", "height", '16px'],
            ["style", "opacity", '0'],
            ["style", "left", '722.85px'],
            ["style", "font-size", '13px']
         ],
         "${_as2}": [
            ["style", "-webkit-transform-origin", [100.06,123.74], {valueTemplate:'@@0@@% @@1@@%'} ],
            ["style", "-moz-transform-origin", [100.06,123.74],{valueTemplate:'@@0@@% @@1@@%'}],
            ["style", "-ms-transform-origin", [100.06,123.74],{valueTemplate:'@@0@@% @@1@@%'}],
            ["style", "msTransformOrigin", [100.06,123.74],{valueTemplate:'@@0@@% @@1@@%'}],
            ["style", "-o-transform-origin", [100.06,123.74],{valueTemplate:'@@0@@% @@1@@%'}],
            ["transform", "rotateZ", '115deg'],
            ["style", "opacity", '0'],
            ["style", "left", '211.48px'],
            ["style", "top", '225.55px']
         ],
         "${_appleico_sym}": [
            ["style", "clip", [0,12,0,0], {valueTemplate:'rect(@@0@@px @@1@@px @@2@@px @@3@@px)'} ]
         ],
         "${_bbico_sym}": [
            ["style", "clip", [0,12,0,0], {valueTemplate:'rect(@@0@@px @@1@@px @@2@@px @@3@@px)'} ]
         ],
         "${_opera_txt}": [
            ["style", "top", '331px'],
            ["style", "width", '91px'],
            ["color", "color", 'rgba(63,215,95,1.00)'],
            ["style", "height", '16px'],
            ["style", "opacity", '0'],
            ["style", "left", '587px'],
            ["style", "font-size", '13px']
         ],
         "${_as6}": [
            ["style", "-webkit-transform-origin", [161.32,128.06], {valueTemplate:'@@0@@% @@1@@%'} ],
            ["style", "-moz-transform-origin", [161.32,128.06],{valueTemplate:'@@0@@% @@1@@%'}],
            ["style", "-ms-transform-origin", [161.32,128.06],{valueTemplate:'@@0@@% @@1@@%'}],
            ["style", "msTransformOrigin", [161.32,128.06],{valueTemplate:'@@0@@% @@1@@%'}],
            ["style", "-o-transform-origin", [161.32,128.06],{valueTemplate:'@@0@@% @@1@@%'}],
            ["transform", "rotateZ", '445deg'],
            ["style", "opacity", '0'],
            ["style", "left", '335.98px'],
            ["style", "top", '317.87px']
         ],
         "${_Rectangle}": [
            ["color", "background-color", 'rgba(88,89,90,1.00)'],
            ["style", "height", '0px'],
            ["style", "left", '264.33px'],
            ["style", "width", '0px']
         ],
         "${_operapercent_txt}": [
            ["style", "top", '347px'],
            ["style", "font-size", '13px'],
            ["style", "height", '16px'],
            ["color", "color", 'rgba(144,144,144,1.00)'],
            ["style", "opacity", '0'],
            ["style", "left", '587px'],
            ["style", "width", '91px']
         ],
         "${_bb_txt}": [
            ["style", "top", '420.99px'],
            ["style", "width", '91px'],
            ["color", "color", 'rgba(207,204,109,1.00)'],
            ["style", "height", '16px'],
            ["style", "opacity", '0'],
            ["style", "left", '587px'],
            ["style", "font-size", '13px']
         ],
         "${_as4}": [
            ["style", "-webkit-transform-origin", [346.53,133.67], {valueTemplate:'@@0@@% @@1@@%'} ],
            ["style", "-moz-transform-origin", [346.53,133.67],{valueTemplate:'@@0@@% @@1@@%'}],
            ["style", "-ms-transform-origin", [346.53,133.67],{valueTemplate:'@@0@@% @@1@@%'}],
            ["style", "msTransformOrigin", [346.53,133.67],{valueTemplate:'@@0@@% @@1@@%'}],
            ["style", "-o-transform-origin", [346.53,133.67],{valueTemplate:'@@0@@% @@1@@%'}],
            ["transform", "rotateZ", '74deg'],
            ["style", "opacity", '0'],
            ["style", "left", '322.52px'],
            ["style", "top", '331.09px']
         ],
         "${_header}": [
            ["style", "top", '257px'],
            ["color", "color", 'rgba(65,64,66,1)'],
            ["style", "height", '31px'],
            ["style", "font-family", 'Armata'],
            ["style", "left", '586.78px'],
            ["style", "clip", [0,0,31,0], {valueTemplate:'rect(@@0@@px @@1@@px @@2@@px @@3@@px)'} ]
         ],
         "${_iospercent_txt}": [
            ["style", "top", '347px'],
            ["style", "width", '91px'],
            ["color", "color", 'rgba(144,144,144,1.00)'],
            ["style", "height", '16px'],
            ["style", "opacity", '0'],
            ["style", "left", '722.85px'],
            ["style", "font-size", '13px']
         ],
         "${_other_txt}": [
            ["style", "top", '420.99px'],
            ["style", "font-size", '13px'],
            ["style", "height", '16px'],
            ["color", "color", 'rgba(117,70,139,1.00)'],
            ["style", "opacity", '0'],
            ["style", "left", '722.85px'],
            ["style", "width", '91px']
         ],
         "${_operaico_sym}": [
            ["style", "clip", [0,12,0,0], {valueTemplate:'rect(@@0@@px @@1@@px @@2@@px @@3@@px)'} ]
         ],
         "${_netfront_txt}": [
            ["style", "top", '376.99px'],
            ["style", "width", '91px'],
            ["color", "color", 'rgba(215,145,63,1.00)'],
            ["style", "height", '16px'],
            ["style", "opacity", '0'],
            ["style", "left", '722.85px'],
            ["style", "font-size", '13px']
         ],
         "${_TextCopy}": [
            ["style", "top", '288.01px'],
            ["color", "color", 'rgba(144,144,144,1.00)'],
            ["style", "height", '31px'],
            ["style", "font-family", 'Armata'],
            ["style", "left", '586.78px'],
            ["style", "clip", [0,0,31,0], {valueTemplate:'rect(@@0@@px @@1@@px @@2@@px @@3@@px)'} ]
         ],
         "${_apple_txt}": [
            ["style", "top", '331px'],
            ["style", "font-size", '13px'],
            ["style", "height", '16px'],
            ["color", "color", 'rgba(83,179,151,1.00)'],
            ["style", "opacity", '0'],
            ["style", "left", '722.85px'],
            ["style", "width", '91px']
         ]
      }
   },
   timelines: {
      "Default Timeline": {
         fromState: "Base State",
         toState: "",
         duration: 4983,
         autoPlay: false,
         labels: {
            "play": 250
         },
         timeline: [
            { id: "eid1111", tween: [ "style", "${_nokiaico_sym}", "clip", [0,11,75,0], { valueTemplate: 'rect(@@0@@px @@1@@px @@2@@px @@3@@px)', fromValue: [0,12,0,0]}], position: 2120, duration: 250, easing: "easeOutSine" },
            { id: "eid1945", tween: [ "style", "${_bbpercent_txt}", "opacity", '1', { fromValue: '0'}], position: 4000, duration: 411 },
            { id: "eid58", tween: [ "style", "${_as5}", "-webkit-transform-origin", [50,50], { valueTemplate: '@@0@@% @@1@@%', fromValue: [310.72,113.32]}], position: 250, duration: 1451, easing: "easeOutCirc" },
            { id: "eid27460", tween: [ "style", "${_as5}", "-moz-transform-origin", [50,50], { valueTemplate: '@@0@@% @@1@@%', fromValue: [310.72,113.32]}], position: 250, duration: 1451, easing: "easeOutCirc" },
            { id: "eid27461", tween: [ "style", "${_as5}", "-ms-transform-origin", [50,50], { valueTemplate: '@@0@@% @@1@@%', fromValue: [310.72,113.32]}], position: 250, duration: 1451, easing: "easeOutCirc" },
            { id: "eid27462", tween: [ "style", "${_as5}", "msTransformOrigin", [50,50], { valueTemplate: '@@0@@% @@1@@%', fromValue: [310.72,113.32]}], position: 250, duration: 1451, easing: "easeOutCirc" },
            { id: "eid27463", tween: [ "style", "${_as5}", "-o-transform-origin", [50,50], { valueTemplate: '@@0@@% @@1@@%', fromValue: [310.72,113.32]}], position: 250, duration: 1451, easing: "easeOutCirc" },
            { id: "eid1965", tween: [ "style", "${_nokia_txt}", "opacity", '1', { fromValue: '0'}], position: 3838, duration: 411 },
            { id: "eid1019", tween: [ "style", "${_Rectangle}", "width", '91px', { fromValue: '0px'}], position: 1701, duration: 299 },
            { id: "eid1973", tween: [ "style", "${_netfrontpercent_txt}", "opacity", '1', { fromValue: '0'}], position: 4411, duration: 411 },
            { id: "eid1969", tween: [ "style", "${_iospercent_txt}", "opacity", '1', { fromValue: '0'}], position: 4160, duration: 411 },
            { id: "eid19", tween: [ "style", "${_as1}", "top", '229px', { fromValue: '261.33px'}], position: 250, duration: 1451, easing: "easeOutCirc" },
            { id: "eid313", tween: [ "style", "${_as1}", "opacity", '1', { fromValue: '0'}], position: 250, duration: 656, easing: "easeOutCirc" },
            { id: "eid4093", tween: [ "color", "${_other_txt}", "color", 'rgba(117,70,139,1.00)', { animationColorSpace: 'RGB', valueTemplate: undefined, fromValue: 'rgba(117,70,139,1.00)'}], position: 4983, duration: 0 },
            { id: "eid63", tween: [ "transform", "${_as6}", "rotateZ", '360deg', { fromValue: '445deg'}], position: 250, duration: 1451, easing: "easeOutCirc" },
            { id: "eid1109", tween: [ "style", "${_bbico_sym}", "clip", [0,13,56,0], { valueTemplate: 'rect(@@0@@px @@1@@px @@2@@px @@3@@px)', fromValue: [0,12,0,0]}], position: 2000, duration: 250, easing: "easeOutSine" },
            { id: "eid1971", tween: [ "style", "${_bb_txt}", "opacity", '1', { fromValue: '0'}], position: 4000, duration: 411 },
            { id: "eid1429", tween: [ "style", "${_header}", "clip", [0,433,31,0], { valueTemplate: 'rect(@@0@@px @@1@@px @@2@@px @@3@@px)', fromValue: [0,0,31,0]}], position: 2589, duration: 1160 },
            { id: "eid44", tween: [ "transform", "${_as2}", "rotateZ", '0deg', { fromValue: '115deg'}], position: 250, duration: 1451, easing: "easeOutCirc" },
            { id: "eid60", tween: [ "transform", "${_as5}", "rotateZ", '360deg', { fromValue: '131deg'}], position: 250, duration: 1451, easing: "easeOutCirc" },
            { id: "eid1947", tween: [ "style", "${_nokiapercent_txt}", "opacity", '1', { fromValue: '0'}], position: 3838, duration: 411 },
            { id: "eid95", tween: [ "transform", "${_as4}", "rotateZ", '360deg', { fromValue: '74deg'}], position: 250, duration: 1451, easing: "easeOutCirc" },
            { id: "eid1963", tween: [ "style", "${_otherpercent_txt}", "opacity", '1', { fromValue: '0'}], position: 4572, duration: 411 },
            { id: "eid4092", tween: [ "color", "${_netfront_txt}", "color", 'rgba(215,145,63,1.00)', { animationColorSpace: 'RGB', valueTemplate: undefined, fromValue: 'rgba(215,145,63,1.00)'}], position: 4983, duration: 0 },
            { id: "eid315", tween: [ "style", "${_as2}", "opacity", '1', { fromValue: '0'}], position: 250, duration: 437, easing: "easeOutCirc" },
            { id: "eid17", tween: [ "style", "${_as1}", "left", '267.85px', { fromValue: '281.11px'}], position: 250, duration: 1451, easing: "easeOutCirc" },
            { id: "eid193", tween: [ "style", "${_as3}", "-webkit-transform-origin", [279.17,147.48], { valueTemplate: '@@0@@% @@1@@%', fromValue: [279.17,147.48]}], position: 250, duration: 0, easing: "easeOutCirc" },
            { id: "eid27464", tween: [ "style", "${_as3}", "-moz-transform-origin", [279.17,147.48], { valueTemplate: '@@0@@% @@1@@%', fromValue: [279.17,147.48]}], position: 250, duration: 0, easing: "easeOutCirc" },
            { id: "eid27465", tween: [ "style", "${_as3}", "-ms-transform-origin", [279.17,147.48], { valueTemplate: '@@0@@% @@1@@%', fromValue: [279.17,147.48]}], position: 250, duration: 0, easing: "easeOutCirc" },
            { id: "eid27466", tween: [ "style", "${_as3}", "msTransformOrigin", [279.17,147.48], { valueTemplate: '@@0@@% @@1@@%', fromValue: [279.17,147.48]}], position: 250, duration: 0, easing: "easeOutCirc" },
            { id: "eid27467", tween: [ "style", "${_as3}", "-o-transform-origin", [279.17,147.48], { valueTemplate: '@@0@@% @@1@@%', fromValue: [279.17,147.48]}], position: 250, duration: 0, easing: "easeOutCirc" },
            { id: "eid4090", tween: [ "color", "${_bb_txt}", "color", 'rgba(207,204,109,1.00)', { animationColorSpace: 'RGB', valueTemplate: undefined, fromValue: 'rgba(207,204,109,1.00)'}], position: 4983, duration: 0 },
            { id: "eid1431", tween: [ "style", "${_TextCopy}", "clip", [0,56,31,0], { valueTemplate: 'rect(@@0@@px @@1@@px @@2@@px @@3@@px)', fromValue: [0,0,31,0]}], position: 3365, duration: 250 },
            { id: "eid311", tween: [ "style", "${_as4}", "opacity", '1', { fromValue: '0'}], position: 250, duration: 500, easing: "easeOutCirc" },
            { id: "eid114", tween: [ "style", "${_as5}", "top", '335.84px', { fromValue: '337.84px'}], position: 250, duration: 0, easing: "easeOutCirc" },
            { id: "eid1105", tween: [ "style", "${_appleico_sym}", "clip", [0,12,85,0], { valueTemplate: 'rect(@@0@@px @@1@@px @@2@@px @@3@@px)', fromValue: [0,12,0,0]}], position: 2250, duration: 250, easing: "easeOutSine" },
            { id: "eid307", tween: [ "style", "${_as6}", "opacity", '1', { fromValue: '0'}], position: 250, duration: 388, easing: "easeOutCirc" },
            { id: "eid4091", tween: [ "color", "${_apple_txt}", "color", 'rgba(83,179,151,1.00)', { animationColorSpace: 'RGB', valueTemplate: undefined, fromValue: 'rgba(83,179,151,1.00)'}], position: 4983, duration: 0 },
            { id: "eid4089", tween: [ "color", "${_nokia_txt}", "color", 'rgba(171,109,169,1.00)', { animationColorSpace: 'RGB', valueTemplate: undefined, fromValue: 'rgba(171,109,169,1.00)'}], position: 4983, duration: 0 },
            { id: "eid195", tween: [ "transform", "${_as3}", "rotateZ", '0deg', { fromValue: '289deg'}], position: 250, duration: 1451, easing: "easeOutCirc" },
            { id: "eid1939", tween: [ "style", "${_netfront_txt}", "opacity", '1', { fromValue: '0'}], position: 4411, duration: 411 },
            { id: "eid309", tween: [ "style", "${_as3}", "opacity", '1', { fromValue: '0'}], position: 250, duration: 388, easing: "easeOutCirc" },
            { id: "eid113", tween: [ "style", "${_as5}", "left", '309.35px', { fromValue: '307.35px'}], position: 250, duration: 0, easing: "easeOutCirc" },
            { id: "eid1017", tween: [ "style", "${_Rectangle}", "height", '2px', { fromValue: '0px'}], position: 1701, duration: 299 },
            { id: "eid1967", tween: [ "style", "${_apple_txt}", "opacity", '1', { fromValue: '0'}], position: 4160, duration: 411 },
            { id: "eid1941", tween: [ "style", "${_opera_txt}", "opacity", '1', { fromValue: '0'}], position: 3749, duration: 411 },
            { id: "eid80", tween: [ "style", "${_as4}", "-webkit-transform-origin", [346.53,133.67], { valueTemplate: '@@0@@% @@1@@%', fromValue: [346.53,133.67]}], position: 250, duration: 0, easing: "easeOutCirc" },
            { id: "eid27468", tween: [ "style", "${_as4}", "-moz-transform-origin", [346.53,133.67], { valueTemplate: '@@0@@% @@1@@%', fromValue: [346.53,133.67]}], position: 250, duration: 0, easing: "easeOutCirc" },
            { id: "eid27469", tween: [ "style", "${_as4}", "-ms-transform-origin", [346.53,133.67], { valueTemplate: '@@0@@% @@1@@%', fromValue: [346.53,133.67]}], position: 250, duration: 0, easing: "easeOutCirc" },
            { id: "eid27470", tween: [ "style", "${_as4}", "msTransformOrigin", [346.53,133.67], { valueTemplate: '@@0@@% @@1@@%', fromValue: [346.53,133.67]}], position: 250, duration: 0, easing: "easeOutCirc" },
            { id: "eid27471", tween: [ "style", "${_as4}", "-o-transform-origin", [346.53,133.67], { valueTemplate: '@@0@@% @@1@@%', fromValue: [346.53,133.67]}], position: 250, duration: 0, easing: "easeOutCirc" },
            { id: "eid1943", tween: [ "style", "${_operapercent_txt}", "opacity", '1', { fromValue: '0'}], position: 3749, duration: 411 },
            { id: "eid1949", tween: [ "style", "${_other_txt}", "opacity", '1', { fromValue: '0'}], position: 4572, duration: 411 },
            { id: "eid15", tween: [ "transform", "${_as1}", "rotateZ", '360deg', { fromValue: '153deg'}], position: 250, duration: 1451, easing: "easeOutCirc" },
            { id: "eid40", tween: [ "style", "${_as2}", "left", '282px', { fromValue: '211.48px'}], position: 250, duration: 1451, easing: "easeOutCirc" },
            { id: "eid1107", tween: [ "style", "${_otherico_sym}", "clip", [0,12,32,0], { valueTemplate: 'rect(@@0@@px @@1@@px @@2@@px @@3@@px)', fromValue: [0,12,0,0]}], position: 2250, duration: 250, easing: "easeOutSine" },
            { id: "eid317", tween: [ "style", "${_as5}", "opacity", '1', { fromValue: '0'}], position: 250, duration: 656, easing: "easeOutCirc" },
            { id: "eid1113", tween: [ "style", "${_operaico_sym}", "clip", [0,12,54,0], { valueTemplate: 'rect(@@0@@px @@1@@px @@2@@px @@3@@px)', fromValue: [0,12,0,0]}], position: 2000, duration: 250, easing: "easeOutSine" },
            { id: "eid42", tween: [ "style", "${_as2}", "top", '243px', { fromValue: '225.55px'}], position: 250, duration: 1451, easing: "easeOutCirc" },
            { id: "eid1115", tween: [ "style", "${_netfrontico_sym}", "clip", [0,13,73,0], { valueTemplate: 'rect(@@0@@px @@1@@px @@2@@px @@3@@px)', fromValue: [0,12,0,0]}], position: 2120, duration: 250, easing: "easeOutSine" }         ]
      }
   }
},
"mapwhole_sym": {
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
      type: 'text',
      id: 'title_txt',
      text: 'Mobile OS Market Share',
      font: ['Armata',36,'rgba(65,64,66,1.00)','normal','none',''],
      rect: [9,0,557,50]
   },
   {
      type: 'text',
      rect: [4,5,557,50],
      opacity: 0.13126070205479,
      id: 'title_txtCopy',
      text: 'Mobile OS Market Share',
      font: ['Armata',36,'rgba(98,98,98,1.00)','normal','none',''],
      transform: [[0,0],[180],[53],[-1,-0.53]]
   },
   {
      transform: [[0,0]],
      type: 'text',
      id: 'subtitle_txt',
      text: 'Top 5 Mobile Operating Systems Used Worldwide',
      font: ['Armata',12.5,'rgba(144,144,144,1.00)','normal','none',''],
      rect: [8,46,557,50]
   },
   {
      type: 'text',
      rect: [653,552,223,15],
      transform: [[0,0]],
      id: 'source_txt',
      align: 'right',
      text: 'Source: http://gs.statcounter.com',
      cursor: ['pointer'],
      font: ['Armata',10,'rgba(144,144,144,1.00)','normal','none','']
   },
   {
      type: 'text',
      rect: [652,539,223,15],
      transform: [[0,0]],
      id: 'edge_txt',
      align: 'right',
      text: 'Made with Adobe Edge',
      cursor: ['pointer'],
      font: ['Armata',10,'rgba(144,144,144,1.00)','normal','none','']
   },
   {
      transform: [[0,0],{},{},[0.3886,0.3886]],
      id: 'map2',
      type: 'image',
      rect: [-690,-248,2259,1110],
      fill: ['rgba(0,0,0,0)','images/map.jpg']
   }],
   symbolInstances: [
   ]
   },
   states: {
      "Base State": {
         "${_source_txt}": [
            ["color", "color", 'rgba(144,144,144,1.00)'],
            ["style", "cursor", 'pointer'],
            ["style", "width", '223px'],
            ["style", "top", '552.99px'],
            ["style", "text-align", 'right'],
            ["style", "height", '15px'],
            ["style", "font-family", 'Armata'],
            ["style", "font-size", '10px'],
            ["style", "left", '653px']
         ],
         "${_edge_txt}": [
            ["color", "color", 'rgba(144,144,144,1.00)'],
            ["style", "cursor", 'pointer'],
            ["style", "font-size", '10px'],
            ["style", "top", '539.72px'],
            ["style", "text-align", 'right'],
            ["style", "height", '15px'],
            ["style", "font-family", 'Armata'],
            ["style", "width", '223px'],
            ["style", "left", '652.49px']
         ],
         "${symbolSelector}": [
            ["style", "height", '567.59768px'],
            ["style", "width", '878.19888px']
         ],
         "${_map2}": [
            ["transform", "scaleX", '0.388'],
            ["style", "top", '-248.29px'],
            ["style", "left", '-690.5px'],
            ["transform", "scaleY", '0.388']
         ],
         "${_subtitle_txt}": [
            ["style", "top", '46px'],
            ["style", "height", '50px'],
            ["color", "color", 'rgba(144,144,144,1.00)'],
            ["style", "font-family", 'Armata'],
            ["style", "left", '8px'],
            ["style", "font-size", '12.5px']
         ],
         "${_title_txt}": [
            ["style", "top", '0.4px'],
            ["style", "height", '50px'],
            ["color", "color", 'rgba(65,64,66,1.00)'],
            ["style", "font-family", 'Armata'],
            ["style", "left", '8.31px'],
            ["style", "font-size", '36px']
         ],
         "${_title_txtCopy}": [
            ["transform", "rotateZ", '180deg'],
            ["color", "color", 'rgba(98,98,98,1.00)'],
            ["style", "opacity", '0.13126070205479'],
            ["style", "left", '3.33px'],
            ["style", "font-size", '36px'],
            ["style", "top", '5.67px'],
            ["transform", "scaleY", '-0.53'],
            ["transform", "skewX", '53deg'],
            ["style", "height", '50px'],
            ["style", "font-family", 'Armata'],
            ["transform", "scaleX", '-1']
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
         ]
      }
   }
},
"otherico_sym": {
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
      rect: [3.98822249414,-0.50001898082999,2,26],
      id: 'Rectangle2Copy3',
      stroke: [0,'rgba(0, 0, 0, 0)','none'],
      type: 'rect',
      fill: ['rgba(88,88,90,1.00)',null]
   },
   {
      transform: [[0,0],[0,0],[0],[1,1]],
      id: 'other_ico2',
      type: 'image',
      rect: [-0.17125864843999,20.000002,12,12],
      fill: ['rgba(0,0,0,0)','images/other_ico.png']
   }],
   symbolInstances: [
   ]
   },
   states: {
      "Base State": {
         "${_Rectangle2Copy3}": [
            ["color", "background-color", 'rgba(88,88,90,1.00)'],
            ["style", "height", '26px'],
            ["style", "top", '-0.5px'],
            ["style", "left", '3.99px'],
            ["style", "width", '2px']
         ],
         "${_other_ico2}": [
            ["style", "left", '-0.16px'],
            ["style", "top", '20px']
         ],
         "${symbolSelector}": [
            ["style", "height", '32.000002px'],
            ["style", "width", '12px']
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
         ]
      }
   }
},
"netfrontico_sym": {
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
      type: 'rect',
      rect: [1.97388949414,-0.50001898082999,2,68],
      id: 'Rectangle2Copy4',
      stroke: [0,'rgba(0, 0, 0, 0)','none'],
      opacity: 1,
      fill: ['rgba(88,88,90,1.00)',null]
   },
   {
      transform: [[0,0]],
      id: 'netfront_ico',
      type: 'image',
      rect: [-0.098996023440009,63.833342,13,9],
      fill: ['rgba(0,0,0,0)','images/netfront_ico.png']
   }],
   symbolInstances: [
   ]
   },
   states: {
      "Base State": {
         "${_Rectangle2Copy4}": [
            ["color", "background-color", 'rgba(88,88,90,1.00)'],
            ["style", "height", '68px'],
            ["style", "top", '-0.5px'],
            ["style", "left", '1.97px'],
            ["style", "width", '2px']
         ],
         "${_netfront_ico}": [
            ["style", "left", '-0.09px'],
            ["style", "top", '63.84px']
         ],
         "${symbolSelector}": [
            ["style", "height", '72.833342px'],
            ["style", "width", '13px']
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
         ]
      }
   }
},
"appleico_sym": {
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
      rect: [2.99996649414,-0.50001898082999,2,75],
      id: 'Rectangle2Copy5',
      stroke: [0,'rgba(0, 0, 0, 0)','none'],
      type: 'rect',
      fill: ['rgba(88,88,90,1.00)',null]
   },
   {
      transform: [[0,0]],
      id: 'apple_ico',
      type: 'image',
      rect: [-0.29949951172,70.95830261768,12,14],
      fill: ['rgba(0,0,0,0)','images/apple_ico.png']
   }],
   symbolInstances: [
   ]
   },
   states: {
      "Base State": {
         "${_Rectangle2Copy5}": [
            ["color", "background-color", 'rgba(88,88,90,1.00)'],
            ["style", "height", '75px'],
            ["style", "top", '-0.5px'],
            ["style", "left", '3px'],
            ["style", "width", '2px']
         ],
         "${_apple_ico}": [
            ["style", "left", '-0.3px'],
            ["style", "top", '70.96px']
         ],
         "${symbolSelector}": [
            ["style", "height", '84.499983px'],
            ["style", "width", '12px']
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
         ]
      }
   }
},
"bbico_sym": {
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
      rect: [5.08977949414,-0.50001898082999,2,47],
      id: 'Rectangle2Copy2',
      stroke: [0,'rgba(0, 0, 0, 0)','none'],
      type: 'rect',
      fill: ['rgba(88,88,90,1.00)',null]
   },
   {
      rect: [-0.37957463672001,47.03317873096,13,9],
      id: 'bb_ico3',
      transform: [[0,0]],
      type: 'image',
      fill: ['rgba(0,0,0,0)','images/bb_ico.png']
   }],
   symbolInstances: [
   ]
   },
   states: {
      "Base State": {
         "${_bb_ico3}": [
            ["style", "left", '-0.38px'],
            ["style", "top", '47.04px']
         ],
         "${_Rectangle2Copy2}": [
            ["color", "background-color", 'rgba(88,88,90,1.00)'],
            ["style", "height", '47px'],
            ["style", "top", '-0.5px'],
            ["style", "left", '5.09px'],
            ["style", "width", '2px']
         ],
         "${symbolSelector}": [
            ["style", "height", '55.833341px'],
            ["style", "width", '13px']
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
         ]
      }
   }
},
"nokiaico_sy": {
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
      rect: [3.90880749414,-0.50001898082999,2,68],
      id: 'Rectangle2Copy',
      stroke: [0,'rgba(0, 0, 0, 0)','none'],
      type: 'rect',
      fill: ['rgba(88,88,90,1.00)',null]
   },
   {
      transform: [[0,0]],
      id: 'nokia_ico',
      type: 'image',
      rect: [-0.18426413672,67.27730636768,11,8],
      fill: ['rgba(0,0,0,0)','images/nokia_ico.png']
   }],
   symbolInstances: [
   ]
   },
   states: {
      "Base State": {
         "${_nokia_ico}": [
            ["style", "left", '-0.17px'],
            ["style", "top", '67.27px']
         ],
         "${_Rectangle2Copy}": [
            ["color", "background-color", 'rgba(88,88,90,1.00)'],
            ["style", "height", '68px'],
            ["style", "top", '-0.5px'],
            ["style", "left", '3.91px'],
            ["style", "width", '2px']
         ],
         "${symbolSelector}": [
            ["style", "height", '74.666642px'],
            ["style", "width", '11px']
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
         ]
      }
   }
},
"operaico_sym": {
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
      rect: [5.10153149414,-0.50001898082999,2,42],
      id: 'Rectangle2',
      stroke: [0,'rgba(0, 0, 0, 0)','none'],
      type: 'rect',
      fill: ['rgba(88,88,90,1.00)',null]
   },
   {
      transform: [[0,0]],
      id: 'opera_ico',
      type: 'image',
      rect: [0.030573613280012,40.76231873096,12,13],
      fill: ['rgba(0,0,0,0)','images/opera_ico.png']
   }],
   symbolInstances: [
   ]
   },
   states: {
      "Base State": {
         "${_Rectangle2}": [
            ["color", "background-color", 'rgba(88,88,90,1.00)'],
            ["style", "height", '42px'],
            ["style", "top", '-0.5px'],
            ["style", "left", '5.1px'],
            ["style", "width", '2px']
         ],
         "${_opera_ico}": [
            ["style", "left", '0.03px'],
            ["style", "top", '40.76px']
         ],
         "${symbolSelector}": [
            ["style", "height", '53.499982px'],
            ["style", "width", '12px']
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
         ]
      }
   }
},
"afgraph_sym": {
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
      rect: [267.99999,220.5664,308,295],
      id: 'af12',
      transform: [[0,0]],
      type: 'image',
      fill: ['rgba(0,0,0,0)','images/af12.png']
   },
   {
      id: 'boltico_sym',
      rect: [310.19921875,379.11328125,0,0],
      type: 'rect',
      transform: [[0,0]]
   },
   {
      rect: [267.99999,220.5664,98,133],
      id: 'af22',
      transform: [[0,0]],
      type: 'image',
      fill: ['rgba(0,0,0,0)','images/af22.png']
   },
   {
      rect: [295,352.99999,17,25],
      id: 'af32',
      transform: [[0,0]],
      type: 'image',
      fill: ['rgba(0,0,0,0)','images/af32.png']
   },
   {
      rect: [307.99999,360,16,19],
      id: 'af42',
      transform: [[0,0]],
      type: 'image',
      fill: ['rgba(0,0,0,0)','images/af42.png']
   },
   {
      rect: [267.99999,220.5664,15,10],
      id: 'af52',
      transform: [[0,0]],
      type: 'image',
      fill: ['rgba(0,0,0,0)','images/af52.png']
   },
   {
      rect: [336.00001,350.99999,19,27],
      id: 'af62',
      transform: [[0,0]],
      type: 'image',
      fill: ['rgba(0,0,0,0)','images/af62.png']
   },
   {
      id: 'operaico_sym',
      rect: [268.000005,378.500018,0,0],
      type: 'rect',
      transform: [[0,0]]
   },
   {
      id: 'nokiaico_sym',
      rect: [283.500009,379.500018,0,0],
      type: 'rect',
      transform: {}
   },
   {
      id: 'appleico_sym',
      rect: [296,379.500018,0,0],
      type: 'rect',
      transform: [[0,0]]
   },
   {
      id: 'netfrontico_sym',
      rect: [326.333337,379.500018,0,0],
      type: 'rect',
      transform: {}
   },
   {
      id: 'otherico_sym',
      rect: [337.500004,379.500018,0,0],
      type: 'rect',
      transform: {}
   },
   {
      rect: [586.78122,257,433.80078125,31],
      transform: [[0,0]],
      id: 'header',
      text: 'Mobile Browser Marketshare',
      font: ['Armata',24,'rgba(65,64,66,1.00)','normal','none',''],
      type: 'text'
   },
   {
      rect: [586.78122,288.00001,433.80078125,31],
      transform: [[0,0]],
      id: 'TextCopy',
      text: 'Africa',
      font: ['Armata',24,'rgba(144,144,144,1.00)','normal','none',''],
      type: 'text'
   },
   {
      font: ['Armata',13,'rgba(63,215,95,1.00)','normal','none','normal'],
      rect: [587,331,91,16],
      align: 'auto',
      opacity: 1,
      id: 'opera_txt',
      text: 'Opera',
      transform: {},
      type: 'text'
   },
   {
      font: ['Armata',13,'rgba(144,144,144,1.00)','normal','none','normal'],
      rect: [587,347,91,16],
      align: 'auto',
      opacity: 1,
      id: 'operapercent_txt',
      text: 'xxx',
      transform: [[0,0]],
      type: 'text'
   },
   {
      font: ['Armata',13,'rgba(144,144,144,1.00)','normal','none','normal'],
      rect: [587,392.99999,91,16],
      align: 'auto',
      opacity: 1,
      id: 'nokiapercent_txt',
      text: 'xxx',
      transform: [[0,0]],
      type: 'text'
   },
   {
      font: ['Armata',13,'rgba(63,215,95,1.00)','normal','none','normal'],
      rect: [587,376.99999,91,16],
      align: 'auto',
      opacity: 1,
      id: 'nokia_txt',
      text: 'Nokia',
      transform: [[0,0]],
      type: 'text'
   },
   {
      font: ['Armata',13,'rgba(63,215,95,1.00)','normal','none','normal'],
      rect: [587,420.99999,91,16],
      align: 'auto',
      opacity: 1,
      id: 'bb_txt',
      text: 'iOS',
      transform: [[0,0]],
      type: 'text'
   },
   {
      font: ['Armata',13,'rgba(144,144,144,1.00)','normal','none','normal'],
      rect: [587,436.99999,91,16],
      align: 'auto',
      opacity: 1,
      id: 'bbpercent_txt',
      text: 'xxx',
      transform: [[0,0]],
      type: 'text'
   },
   {
      font: ['Armata',13,'rgba(144,144,144,1.00)','normal','none','normal'],
      rect: [722.85937,436.99999,91,16],
      align: 'auto',
      opacity: 1,
      id: 'otherpercent_txt',
      text: 'xxx',
      transform: [[0,0]],
      type: 'text'
   },
   {
      font: ['Armata',13,'rgba(63,215,95,1.00)','normal','none','normal'],
      rect: [722.85937,420.99999,91,16],
      align: 'auto',
      opacity: 1,
      id: 'other_txt',
      text: 'Other',
      transform: [[0,0]],
      type: 'text'
   },
   {
      font: ['Armata',13,'rgba(63,215,95,1.00)','normal','none','normal'],
      rect: [722.85937,376.99999,91,16],
      align: 'auto',
      opacity: 1,
      id: 'netfront_txt',
      text: 'NetFront',
      transform: [[0,0]],
      type: 'text'
   },
   {
      font: ['Armata',13,'rgba(144,144,144,1.00)','normal','none','normal'],
      rect: [722.85937,392.99999,91,16],
      align: 'auto',
      opacity: 1,
      id: 'netfrontpercent_txt',
      text: 'xxx',
      transform: [[0,0]],
      type: 'text'
   },
   {
      font: ['Armata',13,'rgba(144,144,144,1.00)','normal','none','normal'],
      rect: [722.85937,347,91,16],
      align: 'auto',
      opacity: 1,
      id: 'iospercent_txt',
      text: 'xxx',
      transform: [[0,0]],
      type: 'text'
   },
   {
      font: ['Armata',13,'rgba(63,215,95,1.00)','normal','none','normal'],
      rect: [722.85937,331,91,16],
      align: 'auto',
      opacity: 1,
      id: 'apple_txt',
      text: 'Bolt',
      transform: [[0,0]],
      type: 'text'
   },
   {
      transform: [[0,0]],
      rect: [264.33331298828,377.49997901917,91.360687255859,1.904296875],
      id: 'Rectangle',
      stroke: [0,'rgba(0, 0, 0, 0)','none'],
      type: 'rect',
      fill: ['rgba(88,89,90,1.00)',null]
   }],
   symbolInstances: [
   {
      id: 'operaico_sym',
      symbolName: 'operaico_sym'
   },
   {
      id: 'netfrontico_sym',
      symbolName: 'netfrontico_sym'
   },
   {
      id: 'nokiaico_sym',
      symbolName: 'nokiaico_sy'
   },
   {
      id: 'appleico_sym',
      symbolName: 'appleico_sym'
   },
   {
      id: 'otherico_sym',
      symbolName: 'otherico_sym'
   },
   {
      id: 'boltico_sym',
      symbolName: 'boltico_sym'
   }   ]
   },
   states: {
      "Base State": {
         "${_af12}": [
            ["style", "top", '252.9px'],
            ["style", "opacity", '0'],
            ["style", "left", '281.26px'],
            ["transform", "rotateZ", '153deg']
         ],
         "${_netfront_txt}": [
            ["style", "top", '376.99px'],
            ["style", "font-size", '13px'],
            ["color", "color", 'rgba(215,145,63,1.00)'],
            ["style", "height", '16px'],
            ["style", "opacity", '0'],
            ["style", "left", '722.85px'],
            ["style", "width", '91px']
         ],
         "${_otherico_sym}": [
            ["style", "clip", [0,12,0,0], {valueTemplate:'rect(@@0@@px @@1@@px @@2@@px @@3@@px)'} ]
         ],
         "${_boltico_sym}": [
            ["style", "top", '379.11px'],
            ["style", "clip", [0,12,0,0], {valueTemplate:'rect(@@0@@px @@1@@px @@2@@px @@3@@px)'} ],
            ["style", "left", '310.2px']
         ],
         "${_nokiapercent_txt}": [
            ["style", "top", '392.99px'],
            ["style", "font-size", '13px'],
            ["color", "color", 'rgba(144,144,144,1.00)'],
            ["style", "height", '16px'],
            ["style", "opacity", '0'],
            ["style", "left", '587px'],
            ["style", "width", '91px']
         ],
         "${_af22}": [
            ["style", "-webkit-transform-origin", [154.62,106.53], {valueTemplate:'@@0@@% @@1@@%'} ],
            ["style", "-moz-transform-origin", [154.62,106.53],{valueTemplate:'@@0@@% @@1@@%'}],
            ["style", "-ms-transform-origin", [154.62,106.53],{valueTemplate:'@@0@@% @@1@@%'}],
            ["style", "msTransformOrigin", [154.62,106.53],{valueTemplate:'@@0@@% @@1@@%'}],
            ["style", "-o-transform-origin", [154.62,106.53],{valueTemplate:'@@0@@% @@1@@%'}],
            ["transform", "rotateZ", '115deg'],
            ["style", "opacity", '0'],
            ["style", "left", '197.48px'],
            ["style", "top", '203.11px']
         ],
         "${_netfrontpercent_txt}": [
            ["style", "top", '392.99px'],
            ["style", "width", '91px'],
            ["style", "height", '16px'],
            ["color", "color", 'rgba(144,144,144,1.00)'],
            ["style", "opacity", '0'],
            ["style", "left", '722.85px'],
            ["style", "font-size", '13px']
         ],
         "${symbolSelector}": [
            ["style", "height", '149px'],
            ["style", "width", '282px']
         ],
         "${_nokiaico_sym}": [
            ["style", "clip", [0,12,0,0], {valueTemplate:'rect(@@0@@px @@1@@px @@2@@px @@3@@px)'} ],
            ["style", "left", '283.5px']
         ],
         "${_nokia_txt}": [
            ["style", "top", '376.99px'],
            ["style", "width", '91px'],
            ["style", "height", '16px'],
            ["color", "color", 'rgba(171,109,169,1.00)'],
            ["style", "opacity", '0'],
            ["style", "left", '587px'],
            ["style", "font-size", '13px']
         ],
         "${_netfrontico_sym}": [
            ["style", "top", '379.5px'],
            ["style", "clip", [0,12,0,0], {valueTemplate:'rect(@@0@@px @@1@@px @@2@@px @@3@@px)'} ],
            ["style", "left", '326.33px']
         ],
         "${_otherpercent_txt}": [
            ["style", "top", '436.99px'],
            ["style", "font-size", '13px'],
            ["color", "color", 'rgba(144,144,144,1.00)'],
            ["style", "height", '16px'],
            ["style", "opacity", '0'],
            ["style", "left", '722.85px'],
            ["style", "width", '91px']
         ],
         "${_apple_txt}": [
            ["style", "top", '331px'],
            ["style", "width", '91px'],
            ["style", "height", '16px'],
            ["color", "color", 'rgba(83,179,151,1.00)'],
            ["style", "opacity", '0'],
            ["style", "left", '722.85px'],
            ["style", "font-size", '13px']
         ],
         "${_operaico_sym}": [
            ["style", "top", '378.5px'],
            ["style", "clip", [0,12,0,0], {valueTemplate:'rect(@@0@@px @@1@@px @@2@@px @@3@@px)'} ],
            ["style", "left", '268px']
         ],
         "${_bbpercent_txt}": [
            ["style", "top", '436.99px'],
            ["style", "width", '91px'],
            ["style", "height", '16px'],
            ["color", "color", 'rgba(144,144,144,1.00)'],
            ["style", "opacity", '0'],
            ["style", "left", '587px'],
            ["style", "font-size", '13px']
         ],
         "${_af42}": [
            ["style", "-webkit-transform-origin", [346.53,133.67], {valueTemplate:'@@0@@% @@1@@%'} ],
            ["style", "-moz-transform-origin", [346.53,133.67],{valueTemplate:'@@0@@% @@1@@%'}],
            ["style", "-ms-transform-origin", [346.53,133.67],{valueTemplate:'@@0@@% @@1@@%'}],
            ["style", "msTransformOrigin", [346.53,133.67],{valueTemplate:'@@0@@% @@1@@%'}],
            ["style", "-o-transform-origin", [346.53,133.67],{valueTemplate:'@@0@@% @@1@@%'}],
            ["transform", "rotateZ", '74deg'],
            ["style", "opacity", '0'],
            ["style", "left", '307.99px'],
            ["style", "top", '360px']
         ],
         "${_opera_txt}": [
            ["style", "top", '331px'],
            ["style", "font-size", '13px'],
            ["color", "color", 'rgba(63,215,95,1.00)'],
            ["style", "height", '16px'],
            ["style", "opacity", '0'],
            ["style", "left", '587px'],
            ["style", "width", '91px']
         ],
         "${_other_txt}": [
            ["style", "top", '420.99px'],
            ["style", "width", '91px'],
            ["style", "height", '16px'],
            ["color", "color", 'rgba(117,70,139,1.00)'],
            ["style", "opacity", '0'],
            ["style", "left", '722.85px'],
            ["style", "font-size", '13px']
         ],
         "${_iospercent_txt}": [
            ["style", "top", '347px'],
            ["style", "font-size", '13px'],
            ["color", "color", 'rgba(144,144,144,1.00)'],
            ["style", "height", '16px'],
            ["style", "opacity", '0'],
            ["style", "left", '722.85px'],
            ["style", "width", '91px']
         ],
         "${_bb_txt}": [
            ["style", "top", '420.99px'],
            ["style", "font-size", '13px'],
            ["color", "color", 'rgba(207,204,109,1.00)'],
            ["style", "height", '16px'],
            ["style", "opacity", '0'],
            ["style", "left", '587px'],
            ["style", "width", '91px']
         ],
         "${_operapercent_txt}": [
            ["style", "top", '347px'],
            ["style", "width", '91px'],
            ["style", "height", '16px'],
            ["color", "color", 'rgba(144,144,144,1.00)'],
            ["style", "opacity", '0'],
            ["style", "left", '587px'],
            ["style", "font-size", '13px']
         ],
         "${_header}": [
            ["style", "top", '257px'],
            ["color", "color", 'rgba(65,64,66,1)'],
            ["style", "height", '31px'],
            ["style", "font-family", 'Armata'],
            ["style", "left", '586.78px'],
            ["style", "clip", [0,0,31,0], {valueTemplate:'rect(@@0@@px @@1@@px @@2@@px @@3@@px)'} ]
         ],
         "${_af52}": [
            ["style", "-webkit-transform-origin", [310.72,113.32], {valueTemplate:'@@0@@% @@1@@%'} ],
            ["style", "-moz-transform-origin", [310.72,113.32],{valueTemplate:'@@0@@% @@1@@%'}],
            ["style", "-ms-transform-origin", [310.72,113.32],{valueTemplate:'@@0@@% @@1@@%'}],
            ["style", "msTransformOrigin", [310.72,113.32],{valueTemplate:'@@0@@% @@1@@%'}],
            ["style", "-o-transform-origin", [310.72,113.32],{valueTemplate:'@@0@@% @@1@@%'}],
            ["transform", "rotateZ", '131deg'],
            ["style", "opacity", '0'],
            ["style", "left", '265.99px'],
            ["style", "top", '222.56px']
         ],
         "${_Rectangle}": [
            ["style", "height", '0px'],
            ["color", "background-color", 'rgba(88,89,90,1.00)'],
            ["style", "left", '264.33px'],
            ["style", "width", '0px']
         ],
         "${_af62}": [
            ["style", "-webkit-transform-origin", [524.22,65.45], {valueTemplate:'@@0@@% @@1@@%'} ],
            ["style", "-moz-transform-origin", [524.22,65.45],{valueTemplate:'@@0@@% @@1@@%'}],
            ["style", "-ms-transform-origin", [524.22,65.45],{valueTemplate:'@@0@@% @@1@@%'}],
            ["style", "msTransformOrigin", [524.22,65.45],{valueTemplate:'@@0@@% @@1@@%'}],
            ["style", "-o-transform-origin", [524.22,65.45],{valueTemplate:'@@0@@% @@1@@%'}],
            ["transform", "rotateZ", '445deg'],
            ["style", "opacity", '0'],
            ["style", "left", '336px'],
            ["style", "top", '350.99px']
         ],
         "${_af32}": [
            ["style", "-webkit-transform-origin", [279.17,147.48], {valueTemplate:'@@0@@% @@1@@%'} ],
            ["style", "-moz-transform-origin", [279.17,147.48],{valueTemplate:'@@0@@% @@1@@%'}],
            ["style", "-ms-transform-origin", [279.17,147.48],{valueTemplate:'@@0@@% @@1@@%'}],
            ["style", "msTransformOrigin", [279.17,147.48],{valueTemplate:'@@0@@% @@1@@%'}],
            ["style", "-o-transform-origin", [279.17,147.48],{valueTemplate:'@@0@@% @@1@@%'}],
            ["transform", "rotateZ", '289deg'],
            ["style", "opacity", '0'],
            ["style", "left", '295px'],
            ["style", "top", '352.99px']
         ],
         "${_TextCopy}": [
            ["style", "top", '288.01px'],
            ["color", "color", 'rgba(144,144,144,1.00)'],
            ["style", "height", '31px'],
            ["style", "font-family", 'Armata'],
            ["style", "left", '586.78px'],
            ["style", "clip", [0,0,31,0], {valueTemplate:'rect(@@0@@px @@1@@px @@2@@px @@3@@px)'} ]
         ],
         "${_appleico_sym}": [
            ["style", "top", '379.5px'],
            ["style", "clip", [0,12,0,0], {valueTemplate:'rect(@@0@@px @@1@@px @@2@@px @@3@@px)'} ],
            ["style", "left", '296px']
         ]
      }
   },
   timelines: {
      "Default Timeline": {
         fromState: "Base State",
         toState: "",
         duration: 4983,
         autoPlay: false,
         labels: {
            "play": 250
         },
         timeline: [
            { id: "eid1111", tween: [ "style", "${_nokiaico_sym}", "clip", [0,11,75,0], { valueTemplate: 'rect(@@0@@px @@1@@px @@2@@px @@3@@px)', fromValue: [0,12,0,0]}], position: 2120, duration: 250, easing: "easeOutSine" },
            { id: "eid7798", tween: [ "style", "${_af12}", "top", '222.56px', { fromValue: '252.9px'}], position: 250, duration: 1451, easing: "easeOutCirc" },
            { id: "eid1965", tween: [ "style", "${_nokia_txt}", "opacity", '1', { fromValue: '0'}], position: 3838, duration: 411 },
            { id: "eid1019", tween: [ "style", "${_Rectangle}", "width", '91px', { fromValue: '0px'}], position: 1701, duration: 299 },
            { id: "eid1973", tween: [ "style", "${_netfrontpercent_txt}", "opacity", '1', { fromValue: '0'}], position: 4411, duration: 411 },
            { id: "eid7801", tween: [ "style", "${_af22}", "left", '281px', { fromValue: '197.48px'}], position: 250, duration: 1451, easing: "easeOutCirc" },
            { id: "eid7803", tween: [ "transform", "${_af22}", "rotateZ", '0deg', { fromValue: '115deg'}], position: 250, duration: 1451, easing: "easeOutCirc" },
            { id: "eid9742", tween: [ "style", "${_boltico_sym}", "clip", [0,12,54,0], { valueTemplate: 'rect(@@0@@px @@1@@px @@2@@px @@3@@px)', fromValue: [0,12,0,0]}], position: 2000, duration: 250, easing: "easeOutSine" },
            { id: "eid4089", tween: [ "color", "${_nokia_txt}", "color", 'rgba(171,109,169,1.00)', { animationColorSpace: 'RGB', valueTemplate: undefined, fromValue: 'rgba(171,109,169,1.00)'}], position: 4983, duration: 0 },
            { id: "eid7812", tween: [ "style", "${_af52}", "-webkit-transform-origin", [676.83,58], { valueTemplate: '@@0@@% @@1@@%', fromValue: [310.72,113.32]}], position: 250, duration: 1451, easing: "easeOutCirc" },
            { id: "eid27472", tween: [ "style", "${_af52}", "-moz-transform-origin", [676.83,58], { valueTemplate: '@@0@@% @@1@@%', fromValue: [310.72,113.32]}], position: 250, duration: 1451, easing: "easeOutCirc" },
            { id: "eid27473", tween: [ "style", "${_af52}", "-ms-transform-origin", [676.83,58], { valueTemplate: '@@0@@% @@1@@%', fromValue: [310.72,113.32]}], position: 250, duration: 1451, easing: "easeOutCirc" },
            { id: "eid27474", tween: [ "style", "${_af52}", "msTransformOrigin", [676.83,58], { valueTemplate: '@@0@@% @@1@@%', fromValue: [310.72,113.32]}], position: 250, duration: 1451, easing: "easeOutCirc" },
            { id: "eid27475", tween: [ "style", "${_af52}", "-o-transform-origin", [676.83,58], { valueTemplate: '@@0@@% @@1@@%', fromValue: [310.72,113.32]}], position: 250, duration: 1451, easing: "easeOutCirc" },
            { id: "eid7817", tween: [ "style", "${_af62}", "opacity", '1', { fromValue: '0'}], position: 250, duration: 388, easing: "easeOutCirc" },
            { id: "eid1971", tween: [ "style", "${_bb_txt}", "opacity", '1', { fromValue: '0'}], position: 4000, duration: 411 },
            { id: "eid1429", tween: [ "style", "${_header}", "clip", [0,433,31,0], { valueTemplate: 'rect(@@0@@px @@1@@px @@2@@px @@3@@px)', fromValue: [0,0,31,0]}], position: 2589, duration: 1160 },
            { id: "eid7806", tween: [ "transform", "${_af32}", "rotateZ", '0deg', { fromValue: '289deg'}], position: 250, duration: 1451, easing: "easeOutCirc" },
            { id: "eid7810", tween: [ "style", "${_af42}", "-webkit-transform-origin", [743.88,63.32], { valueTemplate: '@@0@@% @@1@@%', fromValue: [346.53,133.67]}], position: 250, duration: 0, easing: "easeOutCirc" },
            { id: "eid27476", tween: [ "style", "${_af42}", "-moz-transform-origin", [743.88,63.32], { valueTemplate: '@@0@@% @@1@@%', fromValue: [346.53,133.67]}], position: 250, duration: 0, easing: "easeOutCirc" },
            { id: "eid27477", tween: [ "style", "${_af42}", "-ms-transform-origin", [743.88,63.32], { valueTemplate: '@@0@@% @@1@@%', fromValue: [346.53,133.67]}], position: 250, duration: 0, easing: "easeOutCirc" },
            { id: "eid27478", tween: [ "style", "${_af42}", "msTransformOrigin", [743.88,63.32], { valueTemplate: '@@0@@% @@1@@%', fromValue: [346.53,133.67]}], position: 250, duration: 0, easing: "easeOutCirc" },
            { id: "eid27479", tween: [ "style", "${_af42}", "-o-transform-origin", [743.88,63.32], { valueTemplate: '@@0@@% @@1@@%', fromValue: [346.53,133.67]}], position: 250, duration: 0, easing: "easeOutCirc" },
            { id: "eid7814", tween: [ "style", "${_af52}", "top", '369px', { fromValue: '222.56px'}], position: 250, duration: 0, easing: "easeOutCirc" },
            { id: "eid1431", tween: [ "style", "${_TextCopy}", "clip", [0,89,31,0], { valueTemplate: 'rect(@@0@@px @@1@@px @@2@@px @@3@@px)', fromValue: [0,0,31,0]}], position: 3365, duration: 250 },
            { id: "eid1963", tween: [ "style", "${_otherpercent_txt}", "opacity", '1', { fromValue: '0'}], position: 4572, duration: 411 },
            { id: "eid4092", tween: [ "color", "${_netfront_txt}", "color", 'rgba(215,145,63,1.00)', { animationColorSpace: 'RGB', valueTemplate: undefined, fromValue: 'rgba(215,145,63,1.00)'}], position: 4983, duration: 0 },
            { id: "eid4090", tween: [ "color", "${_bb_txt}", "color", 'rgba(207,204,109,1.00)', { animationColorSpace: 'RGB', valueTemplate: undefined, fromValue: 'rgba(207,204,109,1.00)'}], position: 4983, duration: 0 },
            { id: "eid7807", tween: [ "style", "${_af32}", "-webkit-transform-origin", [781.33,44.76], { valueTemplate: '@@0@@% @@1@@%', fromValue: [279.17,147.48]}], position: 250, duration: 0, easing: "easeOutCirc" },
            { id: "eid27480", tween: [ "style", "${_af32}", "-moz-transform-origin", [781.33,44.76], { valueTemplate: '@@0@@% @@1@@%', fromValue: [279.17,147.48]}], position: 250, duration: 0, easing: "easeOutCirc" },
            { id: "eid27481", tween: [ "style", "${_af32}", "-ms-transform-origin", [781.33,44.76], { valueTemplate: '@@0@@% @@1@@%', fromValue: [279.17,147.48]}], position: 250, duration: 0, easing: "easeOutCirc" },
            { id: "eid27482", tween: [ "style", "${_af32}", "msTransformOrigin", [781.33,44.76], { valueTemplate: '@@0@@% @@1@@%', fromValue: [279.17,147.48]}], position: 250, duration: 0, easing: "easeOutCirc" },
            { id: "eid27483", tween: [ "style", "${_af32}", "-o-transform-origin", [781.33,44.76], { valueTemplate: '@@0@@% @@1@@%', fromValue: [279.17,147.48]}], position: 250, duration: 0, easing: "easeOutCirc" },
            { id: "eid1115", tween: [ "style", "${_netfrontico_sym}", "clip", [0,13,73,0], { valueTemplate: 'rect(@@0@@px @@1@@px @@2@@px @@3@@px)', fromValue: [0,12,0,0]}], position: 2120, duration: 250, easing: "easeOutSine" },
            { id: "eid7808", tween: [ "transform", "${_af42}", "rotateZ", '360deg', { fromValue: '74deg'}], position: 250, duration: 1451, easing: "easeOutCirc" },
            { id: "eid7813", tween: [ "transform", "${_af52}", "rotateZ", '360deg', { fromValue: '131deg'}], position: 250, duration: 1451, easing: "easeOutCirc" },
            { id: "eid1107", tween: [ "style", "${_otherico_sym}", "clip", [0,12,32,0], { valueTemplate: 'rect(@@0@@px @@1@@px @@2@@px @@3@@px)', fromValue: [0,12,0,0]}], position: 2250, duration: 250, easing: "easeOutSine" },
            { id: "eid1969", tween: [ "style", "${_iospercent_txt}", "opacity", '1', { fromValue: '0'}], position: 4160, duration: 411 },
            { id: "eid1945", tween: [ "style", "${_bbpercent_txt}", "opacity", '1', { fromValue: '0'}], position: 4000, duration: 411 },
            { id: "eid1105", tween: [ "style", "${_appleico_sym}", "clip", [0,12,85,0], { valueTemplate: 'rect(@@0@@px @@1@@px @@2@@px @@3@@px)', fromValue: [0,12,0,0]}], position: 2250, duration: 250, easing: "easeOutSine" },
            { id: "eid7815", tween: [ "style", "${_af52}", "left", '322px', { fromValue: '265.99px'}], position: 250, duration: 0, easing: "easeOutCirc" },
            { id: "eid7800", tween: [ "transform", "${_af12}", "rotateZ", '360deg', { fromValue: '153deg'}], position: 250, duration: 1451, easing: "easeOutCirc" },
            { id: "eid1017", tween: [ "style", "${_Rectangle}", "height", '2px', { fromValue: '0px'}], position: 1701, duration: 299 },
            { id: "eid7804", tween: [ "style", "${_af22}", "opacity", '1', { fromValue: '0'}], position: 250, duration: 437, easing: "easeOutCirc" },
            { id: "eid1967", tween: [ "style", "${_apple_txt}", "opacity", '1', { fromValue: '0'}], position: 4160, duration: 411 },
            { id: "eid1947", tween: [ "style", "${_nokiapercent_txt}", "opacity", '1', { fromValue: '0'}], position: 3838, duration: 411 },
            { id: "eid7805", tween: [ "style", "${_af32}", "opacity", '1', { fromValue: '0'}], position: 250, duration: 388, easing: "easeOutCirc" },
            { id: "eid4091", tween: [ "color", "${_apple_txt}", "color", 'rgba(83,179,151,1.00)', { animationColorSpace: 'RGB', valueTemplate: undefined, fromValue: 'rgba(83,179,151,1.00)'}], position: 4983, duration: 0 },
            { id: "eid7799", tween: [ "style", "${_af12}", "opacity", '1', { fromValue: '0'}], position: 250, duration: 656, easing: "easeOutCirc" },
            { id: "eid1941", tween: [ "style", "${_opera_txt}", "opacity", '1', { fromValue: '0'}], position: 3749, duration: 411 },
            { id: "eid7816", tween: [ "transform", "${_af62}", "rotateZ", '360deg', { fromValue: '445deg'}], position: 250, duration: 1451, easing: "easeOutCirc" },
            { id: "eid1943", tween: [ "style", "${_operapercent_txt}", "opacity", '1', { fromValue: '0'}], position: 3749, duration: 411 },
            { id: "eid1949", tween: [ "style", "${_other_txt}", "opacity", '1', { fromValue: '0'}], position: 4572, duration: 411 },
            { id: "eid7797", tween: [ "style", "${_af12}", "left", '267.99px', { fromValue: '281.26px'}], position: 250, duration: 1451, easing: "easeOutCirc" },
            { id: "eid1939", tween: [ "style", "${_netfront_txt}", "opacity", '1', { fromValue: '0'}], position: 4411, duration: 411 },
            { id: "eid4093", tween: [ "color", "${_other_txt}", "color", 'rgba(117,70,139,1.00)', { animationColorSpace: 'RGB', valueTemplate: undefined, fromValue: 'rgba(117,70,139,1.00)'}], position: 4983, duration: 0 },
            { id: "eid7809", tween: [ "style", "${_af42}", "opacity", '1', { fromValue: '0'}], position: 250, duration: 500, easing: "easeOutCirc" },
            { id: "eid1113", tween: [ "style", "${_operaico_sym}", "clip", [0,12,54,0], { valueTemplate: 'rect(@@0@@px @@1@@px @@2@@px @@3@@px)', fromValue: [0,12,0,0]}], position: 2000, duration: 250, easing: "easeOutSine" },
            { id: "eid7811", tween: [ "style", "${_af52}", "opacity", '1', { fromValue: '0'}], position: 250, duration: 656, easing: "easeOutCirc" },
            { id: "eid7802", tween: [ "style", "${_af22}", "top", '245px', { fromValue: '203.11px'}], position: 250, duration: 1451, easing: "easeOutCirc" }         ]
      }
   }
},
"nagraph_sym": {
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
      id: 'operaico_sym',
      rect: [324.250005,377.333308,0,0],
      type: 'rect',
      transform: [[0,0]]
   },
   {
      id: 'nokiaico_sym',
      rect: [298.166659,377.333308,0,0],
      type: 'rect',
      transform: [[0,0]]
   },
   {
      id: 'bbico_sym',
      rect: [269.055547,378.500018,0,0],
      type: 'rect',
      transform: [[0,0]]
   },
   {
      id: 'appleico_sym',
      rect: [285.19444,378.333328,0,0],
      type: 'rect',
      transform: [[0,0]]
   },
   {
      id: 'otherico_sym',
      rect: [337.500004,379.500018,0,0],
      type: 'rect',
      transform: {}
   },
   {
      rect: [586.78122,257,433.80078125,31],
      transform: [[0,0]],
      id: 'header',
      text: 'Mobile Browser Marketshare',
      font: ['Armata',24,'rgba(65,64,66,1.00)','normal','none',''],
      type: 'text'
   },
   {
      rect: [586.78122,288.00001,433.80078125,31],
      transform: [[0,0]],
      id: 'TextCopy',
      text: 'North America',
      font: ['Armata',24,'rgba(144,144,144,1.00)','normal','none',''],
      type: 'text'
   },
   {
      font: ['Armata',13,'rgba(63,215,95,1.00)','normal','none','normal'],
      rect: [587,331,91,16],
      align: 'auto',
      opacity: 1,
      id: 'opera_txt',
      text: 'BlackBerry',
      transform: {},
      type: 'text'
   },
   {
      font: ['Armata',13,'rgba(144,144,144,1.00)','normal','none','normal'],
      rect: [587,347,91,16],
      align: 'auto',
      opacity: 1,
      id: 'operapercent_txt',
      text: 'xxx',
      transform: [[0,0]],
      type: 'text'
   },
   {
      font: ['Armata',13,'rgba(144,144,144,1.00)','normal','none','normal'],
      rect: [587,392.99999,91,16],
      align: 'auto',
      opacity: 1,
      id: 'nokiapercent_txt',
      text: 'xxx',
      transform: [[0,0]],
      type: 'text'
   },
   {
      font: ['Armata',13,'rgba(63,215,95,1.00)','normal','none','normal'],
      rect: [587,376.99999,91,16],
      align: 'auto',
      opacity: 1,
      id: 'nokia_txt',
      text: 'iOS',
      transform: [[0,0]],
      type: 'text'
   },
   {
      font: ['Armata',13,'rgba(63,215,95,1.00)','normal','none','normal'],
      rect: [587,420.99999,91,16],
      align: 'auto',
      opacity: 1,
      id: 'bb_txt',
      text: 'Android',
      transform: [[0,0]],
      type: 'text'
   },
   {
      font: ['Armata',13,'rgba(144,144,144,1.00)','normal','none','normal'],
      rect: [587,436.99999,91,16],
      align: 'auto',
      opacity: 1,
      id: 'bbpercent_txt',
      text: 'xxx',
      transform: [[0,0]],
      type: 'text'
   },
   {
      font: ['Armata',13,'rgba(144,144,144,1.00)','normal','none','normal'],
      rect: [722.85937,436.99999,91,16],
      align: 'auto',
      opacity: 1,
      id: 'otherpercent_txt',
      text: 'xxx',
      transform: [[0,0]],
      type: 'text'
   },
   {
      font: ['Armata',13,'rgba(63,215,95,1.00)','normal','none','normal'],
      rect: [722.85937,420.99999,91,16],
      align: 'auto',
      opacity: 1,
      id: 'other_txt',
      text: 'Other',
      transform: [[0,0]],
      type: 'text'
   },
   {
      font: ['Armata',13,'rgba(63,215,95,1.00)','normal','none','normal'],
      rect: [722.85937,376.99999,91,16],
      align: 'auto',
      opacity: 1,
      id: 'netfront_txt',
      text: 'Opera',
      transform: [[0,0]],
      type: 'text'
   },
   {
      font: ['Armata',13,'rgba(144,144,144,1.00)','normal','none','normal'],
      rect: [722.85937,392.99999,91,16],
      align: 'auto',
      opacity: 1,
      id: 'netfrontpercent_txt',
      text: 'xxx',
      transform: [[0,0]],
      type: 'text'
   },
   {
      font: ['Armata',13,'rgba(144,144,144,1.00)','normal','none','normal'],
      rect: [722.85937,347,91,16],
      align: 'auto',
      opacity: 1,
      id: 'iospercent_txt',
      text: 'xxx',
      transform: [[0,0]],
      type: 'text'
   },
   {
      font: ['Armata',13,'rgba(63,215,95,1.00)','normal','none','normal'],
      rect: [722.85937,331,91,16],
      align: 'auto',
      opacity: 1,
      id: 'apple_txt',
      text: 'Nokia',
      transform: [[0,0]],
      type: 'text'
   },
   {
      id: 'androidico_sym',
      rect: [312.05434881836,378.68466138672,0,0],
      type: 'rect',
      transform: [[0,0]]
   },
   {
      rect: [268,221,264,156],
      id: 'na1',
      transform: [[0,0]],
      type: 'image',
      fill: ['rgba(0,0,0,0)','images/na1.png']
   },
   {
      rect: [268,221,161,142],
      id: 'na2',
      transform: [[0,0]],
      type: 'image',
      fill: ['rgba(0,0,0,0)','images/na2.png']
   },
   {
      rect: [268,221,111,127],
      id: 'na3',
      transform: [[0,0]],
      type: 'image',
      fill: ['rgba(0,0,0,0)','images/na3.png']
   },
   {
      rect: [268,221,16,25],
      id: 'na4',
      transform: [[0,0]],
      type: 'image',
      fill: ['rgba(0,0,0,0)','images/na4.png']
   },
   {
      rect: [268,221,16,22],
      id: 'na5',
      transform: [[0,0]],
      type: 'image',
      fill: ['rgba(0,0,0,0)','images/na5.png']
   },
   {
      rect: [268,221,21,40],
      id: 'na6',
      transform: [[0,0]],
      type: 'image',
      fill: ['rgba(0,0,0,0)','images/na6.png']
   },
   {
      transform: [[0,0]],
      rect: [264.33331298828,377.49997901917,91.360687255859,1.904296875],
      id: 'Rectangle',
      stroke: [0,'rgba(0, 0, 0, 0)','none'],
      type: 'rect',
      fill: ['rgba(88,89,90,1.00)',null]
   }],
   symbolInstances: [
   {
      id: 'operaico_sym',
      symbolName: 'operaico_sym'
   },
   {
      id: 'nokiaico_sym',
      symbolName: 'nokiaico_sy'
   },
   {
      id: 'androidico_sym',
      symbolName: 'androidico_sym'
   },
   {
      id: 'appleico_sym',
      symbolName: 'appleico_sym'
   },
   {
      id: 'bbico_sym',
      symbolName: 'bbico_sym'
   },
   {
      id: 'otherico_sym',
      symbolName: 'otherico_sym'
   }   ]
   },
   states: {
      "Base State": {
         "${_bbpercent_txt}": [
            ["style", "top", '436.99px'],
            ["style", "font-size", '13px'],
            ["style", "height", '16px'],
            ["color", "color", 'rgba(144,144,144,1.00)'],
            ["style", "opacity", '0'],
            ["style", "left", '587px'],
            ["style", "width", '91px']
         ],
         "${_netfront_txt}": [
            ["style", "top", '376.99px'],
            ["style", "width", '91px'],
            ["color", "color", 'rgba(215,145,63,1.00)'],
            ["style", "height", '16px'],
            ["style", "opacity", '0'],
            ["style", "left", '722.85px'],
            ["style", "font-size", '13px']
         ],
         "${_otherico_sym}": [
            ["style", "clip", [0,12,0,0], {valueTemplate:'rect(@@0@@px @@1@@px @@2@@px @@3@@px)'} ]
         ],
         "${_nokiapercent_txt}": [
            ["style", "top", '392.99px'],
            ["style", "width", '91px'],
            ["color", "color", 'rgba(144,144,144,1.00)'],
            ["style", "height", '16px'],
            ["style", "opacity", '0'],
            ["style", "left", '587px'],
            ["style", "font-size", '13px']
         ],
         "${_appleico_sym}": [
            ["style", "top", '378.34px'],
            ["style", "left", '285.2px'],
            ["style", "clip", [0,12,0,0], {valueTemplate:'rect(@@0@@px @@1@@px @@2@@px @@3@@px)'} ]
         ],
         "${_netfrontpercent_txt}": [
            ["style", "top", '392.99px'],
            ["style", "font-size", '13px'],
            ["style", "height", '16px'],
            ["color", "color", 'rgba(144,144,144,1.00)'],
            ["style", "opacity", '0'],
            ["style", "left", '722.85px'],
            ["style", "width", '91px']
         ],
         "${_na6}": [
            ["style", "-webkit-transform-origin", [489.8,103.17], {valueTemplate:'@@0@@% @@1@@%'} ],
            ["style", "-moz-transform-origin", [489.8,103.17],{valueTemplate:'@@0@@% @@1@@%'}],
            ["style", "-ms-transform-origin", [489.8,103.17],{valueTemplate:'@@0@@% @@1@@%'}],
            ["style", "msTransformOrigin", [489.8,103.17],{valueTemplate:'@@0@@% @@1@@%'}],
            ["style", "-o-transform-origin", [489.8,103.17],{valueTemplate:'@@0@@% @@1@@%'}],
            ["transform", "rotateZ", '445deg'],
            ["style", "opacity", '0'],
            ["style", "left", '337.99px'],
            ["style", "top", '338.99px']
         ],
         "${symbolSelector}": [
            ["style", "height", '149px'],
            ["style", "width", '282px']
         ],
         "${_na4}": [
            ["style", "-webkit-transform-origin", [346.53,133.67], {valueTemplate:'@@0@@% @@1@@%'} ],
            ["style", "-moz-transform-origin", [346.53,133.67],{valueTemplate:'@@0@@% @@1@@%'}],
            ["style", "-ms-transform-origin", [346.53,133.67],{valueTemplate:'@@0@@% @@1@@%'}],
            ["style", "msTransformOrigin", [346.53,133.67],{valueTemplate:'@@0@@% @@1@@%'}],
            ["style", "-o-transform-origin", [346.53,133.67],{valueTemplate:'@@0@@% @@1@@%'}],
            ["transform", "rotateZ", '74deg'],
            ["style", "opacity", '0'],
            ["style", "left", '309.99px'],
            ["style", "top", '352.99px']
         ],
         "${_Rectangle}": [
            ["color", "background-color", 'rgba(88,89,90,1.00)'],
            ["style", "height", '0px'],
            ["style", "left", '264.33px'],
            ["style", "width", '0px']
         ],
         "${_operapercent_txt}": [
            ["style", "top", '347px'],
            ["style", "font-size", '13px'],
            ["style", "height", '16px'],
            ["color", "color", 'rgba(144,144,144,1.00)'],
            ["style", "opacity", '0'],
            ["style", "left", '587px'],
            ["style", "width", '91px']
         ],
         "${_otherpercent_txt}": [
            ["style", "top", '436.99px'],
            ["style", "width", '91px'],
            ["color", "color", 'rgba(144,144,144,1.00)'],
            ["style", "height", '16px'],
            ["style", "opacity", '0'],
            ["style", "left", '722.85px'],
            ["style", "font-size", '13px']
         ],
         "${_other_txt}": [
            ["style", "top", '420.99px'],
            ["style", "font-size", '13px'],
            ["style", "height", '16px'],
            ["color", "color", 'rgba(117,70,139,1.00)'],
            ["style", "opacity", '0'],
            ["style", "left", '722.85px'],
            ["style", "width", '91px']
         ],
         "${_operaico_sym}": [
            ["style", "top", '377.34px'],
            ["style", "left", '324.25px'],
            ["style", "clip", [0,12,0,0], {valueTemplate:'rect(@@0@@px @@1@@px @@2@@px @@3@@px)'} ]
         ],
         "${_nokiaico_sym}": [
            ["style", "top", '377.34px'],
            ["style", "left", '298.16px'],
            ["style", "clip", [0,12,0,0], {valueTemplate:'rect(@@0@@px @@1@@px @@2@@px @@3@@px)'} ]
         ],
         "${_na3}": [
            ["style", "-webkit-transform-origin", [322.3,25.88], {valueTemplate:'@@0@@% @@1@@%'} ],
            ["style", "-moz-transform-origin", [322.3,25.88],{valueTemplate:'@@0@@% @@1@@%'}],
            ["style", "-ms-transform-origin", [322.3,25.88],{valueTemplate:'@@0@@% @@1@@%'}],
            ["style", "msTransformOrigin", [322.3,25.88],{valueTemplate:'@@0@@% @@1@@%'}],
            ["style", "-o-transform-origin", [322.3,25.88],{valueTemplate:'@@0@@% @@1@@%'}],
            ["transform", "rotateZ", '289deg'],
            ["style", "opacity", '0'],
            ["style", "left", '118.02px'],
            ["style", "top", '310.31px']
         ],
         "${_bbico_sym}": [
            ["style", "top", '378.5px'],
            ["style", "left", '269.06px'],
            ["style", "clip", [0,12,0,0], {valueTemplate:'rect(@@0@@px @@1@@px @@2@@px @@3@@px)'} ]
         ],
         "${_nokia_txt}": [
            ["style", "top", '376.99px'],
            ["style", "font-size", '13px'],
            ["style", "height", '16px'],
            ["color", "color", 'rgba(171,109,169,1.00)'],
            ["style", "opacity", '0'],
            ["style", "left", '587px'],
            ["style", "width", '91px']
         ],
         "${_header}": [
            ["style", "top", '257px'],
            ["color", "color", 'rgba(65,64,66,1)'],
            ["style", "height", '31px'],
            ["style", "font-family", 'Armata'],
            ["style", "left", '586.78px'],
            ["style", "clip", [0,0,31,0], {valueTemplate:'rect(@@0@@px @@1@@px @@2@@px @@3@@px)'} ]
         ],
         "${_bb_txt}": [
            ["style", "top", '420.99px'],
            ["style", "width", '91px'],
            ["color", "color", 'rgba(207,204,109,1.00)'],
            ["style", "height", '16px'],
            ["style", "opacity", '0'],
            ["style", "left", '587px'],
            ["style", "font-size", '13px']
         ],
         "${_opera_txt}": [
            ["style", "top", '331px'],
            ["style", "width", '91px'],
            ["color", "color", 'rgba(63,215,95,1.00)'],
            ["style", "height", '16px'],
            ["style", "opacity", '0'],
            ["style", "left", '587px'],
            ["style", "font-size", '13px']
         ],
         "${_na1}": [
            ["style", "-webkit-transform-origin", [55.59,111.31], {valueTemplate:'@@0@@% @@1@@%'} ],
            ["style", "-moz-transform-origin", [55.59,111.31],{valueTemplate:'@@0@@% @@1@@%'}],
            ["style", "-ms-transform-origin", [55.59,111.31],{valueTemplate:'@@0@@% @@1@@%'}],
            ["style", "msTransformOrigin", [55.59,111.31],{valueTemplate:'@@0@@% @@1@@%'}],
            ["style", "-o-transform-origin", [55.59,111.31],{valueTemplate:'@@0@@% @@1@@%'}],
            ["transform", "rotateZ", '153deg'],
            ["style", "opacity", '0'],
            ["style", "left", '281.26px'],
            ["style", "top", '253.33px']
         ],
         "${_iospercent_txt}": [
            ["style", "top", '347px'],
            ["style", "width", '91px'],
            ["color", "color", 'rgba(144,144,144,1.00)'],
            ["style", "height", '16px'],
            ["style", "opacity", '0'],
            ["style", "left", '722.85px'],
            ["style", "font-size", '13px']
         ],
         "${_androidico_sym}": [
            ["style", "top", '378.69px'],
            ["style", "left", '312.06px'],
            ["style", "clip", [0,12,0,0], {valueTemplate:'rect(@@0@@px @@1@@px @@2@@px @@3@@px)'} ]
         ],
         "${_na2}": [
            ["style", "-webkit-transform-origin", [110.28,111.24], {valueTemplate:'@@0@@% @@1@@%'} ],
            ["style", "-moz-transform-origin", [110.28,111.24],{valueTemplate:'@@0@@% @@1@@%'}],
            ["style", "-ms-transform-origin", [110.28,111.24],{valueTemplate:'@@0@@% @@1@@%'}],
            ["style", "msTransformOrigin", [110.28,111.24],{valueTemplate:'@@0@@% @@1@@%'}],
            ["style", "-o-transform-origin", [110.28,111.24],{valueTemplate:'@@0@@% @@1@@%'}],
            ["transform", "rotateZ", '115deg'],
            ["style", "opacity", '0'],
            ["style", "left", '197.48px'],
            ["style", "top", '203.55px']
         ],
         "${_na5}": [
            ["style", "-webkit-transform-origin", [310.72,113.32], {valueTemplate:'@@0@@% @@1@@%'} ],
            ["style", "-moz-transform-origin", [310.72,113.32],{valueTemplate:'@@0@@% @@1@@%'}],
            ["style", "-ms-transform-origin", [310.72,113.32],{valueTemplate:'@@0@@% @@1@@%'}],
            ["style", "msTransformOrigin", [310.72,113.32],{valueTemplate:'@@0@@% @@1@@%'}],
            ["style", "-o-transform-origin", [310.72,113.32],{valueTemplate:'@@0@@% @@1@@%'}],
            ["transform", "rotateZ", '131deg'],
            ["style", "opacity", '0'],
            ["style", "left", '266px'],
            ["style", "top", '223px']
         ],
         "${_TextCopy}": [
            ["style", "top", '288.01px'],
            ["color", "color", 'rgba(144,144,144,1.00)'],
            ["style", "height", '31px'],
            ["style", "font-family", 'Armata'],
            ["style", "left", '586.78px'],
            ["style", "clip", [0,0,31,0], {valueTemplate:'rect(@@0@@px @@1@@px @@2@@px @@3@@px)'} ]
         ],
         "${_apple_txt}": [
            ["style", "top", '331px'],
            ["style", "font-size", '13px'],
            ["style", "height", '16px'],
            ["color", "color", 'rgba(83,179,151,1.00)'],
            ["style", "opacity", '0'],
            ["style", "left", '722.85px'],
            ["style", "width", '91px']
         ]
      }
   },
   timelines: {
      "Default Timeline": {
         fromState: "Base State",
         toState: "",
         duration: 4983,
         autoPlay: false,
         labels: {
            "play": 250
         },
         timeline: [
            { id: "eid1111", tween: [ "style", "${_nokiaico_sym}", "clip", [0,11,75,0], { valueTemplate: 'rect(@@0@@px @@1@@px @@2@@px @@3@@px)', fromValue: [0,12,0,0]}], position: 2120, duration: 250, easing: "easeOutSine" },
            { id: "eid1945", tween: [ "style", "${_bbpercent_txt}", "opacity", '1', { fromValue: '0'}], position: 4000, duration: 411 },
            { id: "eid10998", tween: [ "style", "${_na1}", "left", '268px', { fromValue: '281.26px'}], position: 250, duration: 1451, easing: "easeOutCirc" },
            { id: "eid11021", tween: [ "style", "${_na6}", "left", '337.99px', { fromValue: '337.99px'}], position: 1701, duration: 0 },
            { id: "eid1939", tween: [ "style", "${_netfront_txt}", "opacity", '1', { fromValue: '0'}], position: 4411, duration: 411 },
            { id: "eid1973", tween: [ "style", "${_netfrontpercent_txt}", "opacity", '1', { fromValue: '0'}], position: 4411, duration: 411 },
            { id: "eid11026", tween: [ "style", "${_na4}", "top", '352.99px', { fromValue: '352.99px'}], position: 1701, duration: 0 },
            { id: "eid11018", tween: [ "style", "${_na6}", "opacity", '1', { fromValue: '0'}], position: 250, duration: 388, easing: "easeOutCirc" },
            { id: "eid1969", tween: [ "style", "${_iospercent_txt}", "opacity", '1', { fromValue: '0'}], position: 4160, duration: 411 },
            { id: "eid1107", tween: [ "style", "${_otherico_sym}", "clip", [0,12,32,0], { valueTemplate: 'rect(@@0@@px @@1@@px @@2@@px @@3@@px)', fromValue: [0,12,0,0]}], position: 2250, duration: 250, easing: "easeOutSine" },
            { id: "eid4093", tween: [ "color", "${_other_txt}", "color", 'rgba(117,70,139,1.00)', { animationColorSpace: 'RGB', valueTemplate: undefined, fromValue: 'rgba(117,70,139,1.00)'}], position: 4983, duration: 0 },
            { id: "eid11016", tween: [ "transform", "${_na5}", "rotateZ", '360deg', { fromValue: '131deg'}], position: 250, duration: 1451, easing: "easeOutCirc" },
            { id: "eid11006", tween: [ "style", "${_na3}", "opacity", '1', { fromValue: '0'}], position: 250, duration: 388, easing: "easeOutCirc" },
            { id: "eid1109", tween: [ "style", "${_bbico_sym}", "clip", [0,13,56,0], { valueTemplate: 'rect(@@0@@px @@1@@px @@2@@px @@3@@px)', fromValue: [0,12,0,0]}], position: 2000, duration: 250, easing: "easeOutSine" },
            { id: "eid1971", tween: [ "style", "${_bb_txt}", "opacity", '1', { fromValue: '0'}], position: 4000, duration: 411 },
            { id: "eid1429", tween: [ "style", "${_header}", "clip", [0,433,31,0], { valueTemplate: 'rect(@@0@@px @@1@@px @@2@@px @@3@@px)', fromValue: [0,0,31,0]}], position: 2589, duration: 1160 },
            { id: "eid4091", tween: [ "color", "${_apple_txt}", "color", 'rgba(83,179,151,1.00)', { animationColorSpace: 'RGB', valueTemplate: undefined, fromValue: 'rgba(83,179,151,1.00)'}], position: 4983, duration: 0 },
            { id: "eid11007", tween: [ "transform", "${_na3}", "rotateZ", '0deg', { fromValue: '289deg'}], position: 250, duration: 1451, easing: "easeOutCirc" },
            { id: "eid11028", tween: [ "style", "${_na2}", "-webkit-transform-origin", [110.28,111.24], { valueTemplate: '@@0@@% @@1@@%', fromValue: [110.28,111.24]}], position: 1701, duration: 0 },
            { id: "eid27484", tween: [ "style", "${_na2}", "-moz-transform-origin", [110.28,111.24], { valueTemplate: '@@0@@% @@1@@%', fromValue: [110.28,111.24]}], position: 1701, duration: 0 },
            { id: "eid27485", tween: [ "style", "${_na2}", "-ms-transform-origin", [110.28,111.24], { valueTemplate: '@@0@@% @@1@@%', fromValue: [110.28,111.24]}], position: 1701, duration: 0 },
            { id: "eid27486", tween: [ "style", "${_na2}", "msTransformOrigin", [110.28,111.24], { valueTemplate: '@@0@@% @@1@@%', fromValue: [110.28,111.24]}], position: 1701, duration: 0 },
            { id: "eid27487", tween: [ "style", "${_na2}", "-o-transform-origin", [110.28,111.24], { valueTemplate: '@@0@@% @@1@@%', fromValue: [110.28,111.24]}], position: 1701, duration: 0 },
            { id: "eid11005", tween: [ "style", "${_na2}", "opacity", '1', { fromValue: '0'}], position: 250, duration: 437, easing: "easeOutCirc" },
            { id: "eid11025", tween: [ "style", "${_na4}", "left", '309.99px', { fromValue: '309.99px'}], position: 1701, duration: 0 },
            { id: "eid11027", tween: [ "style", "${_na1}", "-webkit-transform-origin", [55.59,111.31], { valueTemplate: '@@0@@% @@1@@%', fromValue: [55.59,111.31]}], position: 1701, duration: 0 },
            { id: "eid27488", tween: [ "style", "${_na1}", "-moz-transform-origin", [55.59,111.31], { valueTemplate: '@@0@@% @@1@@%', fromValue: [55.59,111.31]}], position: 1701, duration: 0 },
            { id: "eid27489", tween: [ "style", "${_na1}", "-ms-transform-origin", [55.59,111.31], { valueTemplate: '@@0@@% @@1@@%', fromValue: [55.59,111.31]}], position: 1701, duration: 0 },
            { id: "eid27490", tween: [ "style", "${_na1}", "msTransformOrigin", [55.59,111.31], { valueTemplate: '@@0@@% @@1@@%', fromValue: [55.59,111.31]}], position: 1701, duration: 0 },
            { id: "eid27491", tween: [ "style", "${_na1}", "-o-transform-origin", [55.59,111.31], { valueTemplate: '@@0@@% @@1@@%', fromValue: [55.59,111.31]}], position: 1701, duration: 0 },
            { id: "eid4090", tween: [ "color", "${_bb_txt}", "color", 'rgba(207,204,109,1.00)', { animationColorSpace: 'RGB', valueTemplate: undefined, fromValue: 'rgba(207,204,109,1.00)'}], position: 4983, duration: 0 },
            { id: "eid4089", tween: [ "color", "${_nokia_txt}", "color", 'rgba(171,109,169,1.00)', { animationColorSpace: 'RGB', valueTemplate: undefined, fromValue: 'rgba(171,109,169,1.00)'}], position: 4983, duration: 0 },
            { id: "eid1963", tween: [ "style", "${_otherpercent_txt}", "opacity", '1', { fromValue: '0'}], position: 4572, duration: 411 },
            { id: "eid11003", tween: [ "style", "${_na2}", "top", '235.99px', { fromValue: '203.55px'}], position: 250, duration: 0, easing: "easeOutCirc" },
            { id: "eid4092", tween: [ "color", "${_netfront_txt}", "color", 'rgba(215,145,63,1.00)', { animationColorSpace: 'RGB', valueTemplate: undefined, fromValue: 'rgba(215,145,63,1.00)'}], position: 4983, duration: 0 },
            { id: "eid11683", tween: [ "style", "${_na3}", "left", '295.99px', { fromValue: '118.02px'}], position: 250, duration: 0 },
            { id: "eid1947", tween: [ "style", "${_nokiapercent_txt}", "opacity", '1', { fromValue: '0'}], position: 3838, duration: 411 },
            { id: "eid11024", tween: [ "style", "${_na5}", "top", '354.99px', { fromValue: '223px'}], position: 250, duration: 0 },
            { id: "eid11400", tween: [ "style", "${_na5}", "top", '355.99px', { fromValue: '354.99px'}], position: 1701, duration: 0 },
            { id: "eid11031", tween: [ "style", "${_na6}", "-webkit-transform-origin", [489.8,103.17], { valueTemplate: '@@0@@% @@1@@%', fromValue: [489.8,103.17]}], position: 1701, duration: 0 },
            { id: "eid27492", tween: [ "style", "${_na6}", "-moz-transform-origin", [489.8,103.17], { valueTemplate: '@@0@@% @@1@@%', fromValue: [489.8,103.17]}], position: 1701, duration: 0 },
            { id: "eid27493", tween: [ "style", "${_na6}", "-ms-transform-origin", [489.8,103.17], { valueTemplate: '@@0@@% @@1@@%', fromValue: [489.8,103.17]}], position: 1701, duration: 0 },
            { id: "eid27494", tween: [ "style", "${_na6}", "msTransformOrigin", [489.8,103.17], { valueTemplate: '@@0@@% @@1@@%', fromValue: [489.8,103.17]}], position: 1701, duration: 0 },
            { id: "eid27495", tween: [ "style", "${_na6}", "-o-transform-origin", [489.8,103.17], { valueTemplate: '@@0@@% @@1@@%', fromValue: [489.8,103.17]}], position: 1701, duration: 0 },
            { id: "eid11022", tween: [ "style", "${_na6}", "top", '338.99px', { fromValue: '338.99px'}], position: 1701, duration: 0 },
            { id: "eid1943", tween: [ "style", "${_operapercent_txt}", "opacity", '1', { fromValue: '0'}], position: 3749, duration: 411 },
            { id: "eid10999", tween: [ "style", "${_na1}", "top", '222px', { fromValue: '253.33px'}], position: 250, duration: 1451, easing: "easeOutCirc" },
            { id: "eid11014", tween: [ "style", "${_na5}", "opacity", '1', { fromValue: '0'}], position: 250, duration: 656, easing: "easeOutCirc" },
            { id: "eid8598", tween: [ "style", "${_androidico_sym}", "clip", [0,13,73,0], { valueTemplate: 'rect(@@0@@px @@1@@px @@2@@px @@3@@px)', fromValue: [0,12,0,0]}], position: 2000, duration: 250, easing: "easeOutSine" },
            { id: "eid1105", tween: [ "style", "${_appleico_sym}", "clip", [0,12,85,0], { valueTemplate: 'rect(@@0@@px @@1@@px @@2@@px @@3@@px)', fromValue: [0,12,0,0]}], position: 2250, duration: 250, easing: "easeOutSine" },
            { id: "eid11004", tween: [ "transform", "${_na2}", "rotateZ", '0deg', { fromValue: '115deg'}], position: 250, duration: 1451, easing: "easeOutCirc" },
            { id: "eid1967", tween: [ "style", "${_apple_txt}", "opacity", '1', { fromValue: '0'}], position: 4160, duration: 411 },
            { id: "eid11000", tween: [ "style", "${_na1}", "opacity", '1', { fromValue: '0'}], position: 250, duration: 656, easing: "easeOutCirc" },
            { id: "eid11015", tween: [ "style", "${_na5}", "-webkit-transform-origin", [723.56,69], { valueTemplate: '@@0@@% @@1@@%', fromValue: [310.72,113.32]}], position: 250, duration: 1451, easing: "easeOutCirc" },
            { id: "eid27496", tween: [ "style", "${_na5}", "-moz-transform-origin", [723.56,69], { valueTemplate: '@@0@@% @@1@@%', fromValue: [310.72,113.32]}], position: 250, duration: 1451, easing: "easeOutCirc" },
            { id: "eid27497", tween: [ "style", "${_na5}", "-ms-transform-origin", [723.56,69], { valueTemplate: '@@0@@% @@1@@%', fromValue: [310.72,113.32]}], position: 250, duration: 1451, easing: "easeOutCirc" },
            { id: "eid27498", tween: [ "style", "${_na5}", "msTransformOrigin", [723.56,69], { valueTemplate: '@@0@@% @@1@@%', fromValue: [310.72,113.32]}], position: 250, duration: 1451, easing: "easeOutCirc" },
            { id: "eid27499", tween: [ "style", "${_na5}", "-o-transform-origin", [723.56,69], { valueTemplate: '@@0@@% @@1@@%', fromValue: [310.72,113.32]}], position: 250, duration: 1451, easing: "easeOutCirc" },
            { id: "eid11010", tween: [ "transform", "${_na4}", "rotateZ", '360deg', { fromValue: '74deg'}], position: 250, duration: 1451, easing: "easeOutCirc" },
            { id: "eid11009", tween: [ "style", "${_na4}", "opacity", '1', { fromValue: '0'}], position: 250, duration: 500, easing: "easeOutCirc" },
            { id: "eid11685", tween: [ "style", "${_na3}", "-webkit-transform-origin", [100.99,100.67], { valueTemplate: '@@0@@% @@1@@%', fromValue: [322.3,25.88]}], position: 250, duration: 0 },
            { id: "eid27500", tween: [ "style", "${_na3}", "-moz-transform-origin", [100.99,100.67], { valueTemplate: '@@0@@% @@1@@%', fromValue: [322.3,25.88]}], position: 250, duration: 0 },
            { id: "eid27501", tween: [ "style", "${_na3}", "-ms-transform-origin", [100.99,100.67], { valueTemplate: '@@0@@% @@1@@%', fromValue: [322.3,25.88]}], position: 250, duration: 0 },
            { id: "eid27502", tween: [ "style", "${_na3}", "msTransformOrigin", [100.99,100.67], { valueTemplate: '@@0@@% @@1@@%', fromValue: [322.3,25.88]}], position: 250, duration: 0 },
            { id: "eid27503", tween: [ "style", "${_na3}", "-o-transform-origin", [100.99,100.67], { valueTemplate: '@@0@@% @@1@@%', fromValue: [322.3,25.88]}], position: 250, duration: 0 },
            { id: "eid11023", tween: [ "style", "${_na5}", "left", '323.99px', { fromValue: '266px'}], position: 250, duration: 0 },
            { id: "eid11001", tween: [ "transform", "${_na1}", "rotateZ", '360deg', { fromValue: '153deg'}], position: 250, duration: 1451, easing: "easeOutCirc" },
            { id: "eid1941", tween: [ "style", "${_opera_txt}", "opacity", '1', { fromValue: '0'}], position: 3749, duration: 411 },
            { id: "eid1965", tween: [ "style", "${_nokia_txt}", "opacity", '1', { fromValue: '0'}], position: 3838, duration: 411 },
            { id: "eid1017", tween: [ "style", "${_Rectangle}", "height", '2px', { fromValue: '0px'}], position: 1701, duration: 299 },
            { id: "eid1949", tween: [ "style", "${_other_txt}", "opacity", '1', { fromValue: '0'}], position: 4572, duration: 411 },
            { id: "eid1431", tween: [ "style", "${_TextCopy}", "clip", [0,185,31,0], { valueTemplate: 'rect(@@0@@px @@1@@px @@2@@px @@3@@px)', fromValue: [0,0,31,0]}], position: 3365, duration: 250 },
            { id: "eid11011", tween: [ "style", "${_na4}", "-webkit-transform-origin", [346.53,133.67], { valueTemplate: '@@0@@% @@1@@%', fromValue: [346.53,133.67]}], position: 250, duration: 0, easing: "easeOutCirc" },
            { id: "eid27504", tween: [ "style", "${_na4}", "-moz-transform-origin", [346.53,133.67], { valueTemplate: '@@0@@% @@1@@%', fromValue: [346.53,133.67]}], position: 250, duration: 0, easing: "easeOutCirc" },
            { id: "eid27505", tween: [ "style", "${_na4}", "-ms-transform-origin", [346.53,133.67], { valueTemplate: '@@0@@% @@1@@%', fromValue: [346.53,133.67]}], position: 250, duration: 0, easing: "easeOutCirc" },
            { id: "eid27506", tween: [ "style", "${_na4}", "msTransformOrigin", [346.53,133.67], { valueTemplate: '@@0@@% @@1@@%', fromValue: [346.53,133.67]}], position: 250, duration: 0, easing: "easeOutCirc" },
            { id: "eid27507", tween: [ "style", "${_na4}", "-o-transform-origin", [346.53,133.67], { valueTemplate: '@@0@@% @@1@@%', fromValue: [346.53,133.67]}], position: 250, duration: 0, easing: "easeOutCirc" },
            { id: "eid11030", tween: [ "style", "${_na4}", "-webkit-transform-origin", [744.41,82.63], { valueTemplate: '@@0@@% @@1@@%', fromValue: [346.53,133.67]}], position: 1701, duration: 0 },
            { id: "eid27508", tween: [ "style", "${_na4}", "-moz-transform-origin", [744.41,82.63], { valueTemplate: '@@0@@% @@1@@%', fromValue: [346.53,133.67]}], position: 1701, duration: 0 },
            { id: "eid27509", tween: [ "style", "${_na4}", "-ms-transform-origin", [744.41,82.63], { valueTemplate: '@@0@@% @@1@@%', fromValue: [346.53,133.67]}], position: 1701, duration: 0 },
            { id: "eid27510", tween: [ "style", "${_na4}", "msTransformOrigin", [744.41,82.63], { valueTemplate: '@@0@@% @@1@@%', fromValue: [346.53,133.67]}], position: 1701, duration: 0 },
            { id: "eid27511", tween: [ "style", "${_na4}", "-o-transform-origin", [744.41,82.63], { valueTemplate: '@@0@@% @@1@@%', fromValue: [346.53,133.67]}], position: 1701, duration: 0 },
            { id: "eid11002", tween: [ "style", "${_na2}", "left", '281.99px', { fromValue: '197.48px'}], position: 250, duration: 0, easing: "easeOutCirc" },
            { id: "eid1019", tween: [ "style", "${_Rectangle}", "width", '91px', { fromValue: '0px'}], position: 1701, duration: 299 },
            { id: "eid1113", tween: [ "style", "${_operaico_sym}", "clip", [0,12,54,0], { valueTemplate: 'rect(@@0@@px @@1@@px @@2@@px @@3@@px)', fromValue: [0,12,0,0]}], position: 2000, duration: 250, easing: "easeOutSine" },
            { id: "eid11684", tween: [ "style", "${_na3}", "top", '250.99px', { fromValue: '310.31px'}], position: 250, duration: 0 },
            { id: "eid11017", tween: [ "transform", "${_na6}", "rotateZ", '360deg', { fromValue: '445deg'}], position: 250, duration: 1451, easing: "easeOutCirc" }         ]
      }
   }
},
"sagraph_sym": {
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
      id: 'operaico_sym',
      rect: [283.250005,377.333328,0,0],
      type: 'rect',
      transform: [[0,0]]
   },
   {
      id: 'nokiaico_sym',
      rect: [270.166669,377.333338,0,0],
      type: 'rect',
      transform: [[0,0]]
   },
   {
      id: 'appleico_sym',
      rect: [327,378.500018,0,0],
      type: 'rect',
      transform: [[0,0]]
   },
   {
      id: 'netfrontico_sym',
      rect: [301.333337,378.500018,0,0],
      type: 'rect',
      transform: [[0,0]]
   },
   {
      id: 'otherico_sym',
      rect: [337.500004,379.500018,0,0],
      type: 'rect',
      transform: {}
   },
   {
      rect: [586.78122,257,433.80078125,31],
      transform: [[0,0]],
      id: 'header',
      text: 'Mobile Browser Marketshare',
      font: ['Armata',24,'rgba(65,64,66,1.00)','normal','none',''],
      type: 'text'
   },
   {
      rect: [586.78122,288.00001,433.80078125,31],
      transform: [[0,0]],
      id: 'TextCopy',
      text: 'South America',
      font: ['Armata',24,'rgba(144,144,144,1.00)','normal','none',''],
      type: 'text'
   },
   {
      font: ['Armata',13,'rgba(63,215,95,1.00)','normal','none','normal'],
      rect: [587,331,91,16],
      align: 'auto',
      opacity: 1,
      id: 'opera_txt',
      text: 'Nokia',
      transform: {},
      type: 'text'
   },
   {
      font: ['Armata',13,'rgba(144,144,144,1.00)','normal','none','normal'],
      rect: [587,347,91,16],
      align: 'auto',
      opacity: 1,
      id: 'operapercent_txt',
      text: 'xxx',
      transform: [[0,0]],
      type: 'text'
   },
   {
      font: ['Armata',13,'rgba(144,144,144,1.00)','normal','none','normal'],
      rect: [587,392.99999,91,16],
      align: 'auto',
      opacity: 1,
      id: 'nokiapercent_txt',
      text: 'xxx',
      transform: [[0,0]],
      type: 'text'
   },
   {
      font: ['Armata',13,'rgba(63,215,95,1.00)','normal','none','normal'],
      rect: [587,376.99999,91,16],
      align: 'auto',
      opacity: 1,
      id: 'nokia_txt',
      text: 'Opera',
      transform: [[0,0]],
      type: 'text'
   },
   {
      font: ['Armata',13,'rgba(63,215,95,1.00)','normal','none','normal'],
      rect: [587,420.99999,91,16],
      align: 'auto',
      opacity: 1,
      id: 'bb_txt',
      text: 'NetFront',
      transform: [[0,0]],
      type: 'text'
   },
   {
      font: ['Armata',13,'rgba(144,144,144,1.00)','normal','none','normal'],
      rect: [587,436.99999,91,16],
      align: 'auto',
      opacity: 1,
      id: 'bbpercent_txt',
      text: 'xxx',
      transform: [[0,0]],
      type: 'text'
   },
   {
      font: ['Armata',13,'rgba(144,144,144,1.00)','normal','none','normal'],
      rect: [722.85937,436.99999,91,16],
      align: 'auto',
      opacity: 1,
      id: 'otherpercent_txt',
      text: 'xxx',
      transform: [[0,0]],
      type: 'text'
   },
   {
      font: ['Armata',13,'rgba(63,215,95,1.00)','normal','none','normal'],
      rect: [722.85937,420.99999,91,16],
      align: 'auto',
      opacity: 1,
      id: 'other_txt',
      text: 'Other',
      transform: [[0,0]],
      type: 'text'
   },
   {
      font: ['Armata',13,'rgba(63,215,95,1.00)','normal','none','normal'],
      rect: [722.85937,376.99999,91,16],
      align: 'auto',
      opacity: 1,
      id: 'netfront_txt',
      text: 'iOS',
      transform: [[0,0]],
      type: 'text'
   },
   {
      font: ['Armata',13,'rgba(144,144,144,1.00)','normal','none','normal'],
      rect: [722.85937,392.99999,91,16],
      align: 'auto',
      opacity: 1,
      id: 'netfrontpercent_txt',
      text: 'xxx',
      transform: [[0,0]],
      type: 'text'
   },
   {
      font: ['Armata',13,'rgba(144,144,144,1.00)','normal','none','normal'],
      rect: [722.85937,347,91,16],
      align: 'auto',
      opacity: 1,
      id: 'iospercent_txt',
      text: 'xxx',
      transform: [[0,0]],
      type: 'text'
   },
   {
      font: ['Armata',13,'rgba(63,215,95,1.00)','normal','none','normal'],
      rect: [722.85937,331,91,16],
      align: 'auto',
      opacity: 1,
      id: 'apple_txt',
      text: 'Samsung',
      transform: [[0,0]],
      type: 'text'
   },
   {
      id: 'samsungico_sym',
      rect: [310.58863005859,378.16675956055,0,0],
      type: 'rect',
      transform: [[0,0]]
   },
   {
      rect: [269.99999,219.99999,250,156],
      id: 'sa1',
      transform: [[0,0]],
      type: 'image',
      fill: ['rgba(0,0,0,0)','images/sa1.png']
   },
   {
      rect: [269.99999,219.99999,127,141],
      id: 'sa2',
      transform: [[0,0]],
      type: 'image',
      fill: ['rgba(0,0,0,0)','images/sa2.png']
   },
   {
      rect: [269.99999,219.99999,29,64],
      id: 'sa3',
      transform: [[0,0]],
      type: 'image',
      fill: ['rgba(0,0,0,0)','images/sa3.png']
   },
   {
      rect: [269.99999,219.99999,23,48],
      id: 'sa4',
      transform: [[0,0]],
      type: 'image',
      fill: ['rgba(0,0,0,0)','images/sa4.png']
   },
   {
      rect: [269.99999,219.99999,22,42],
      id: 'sa5',
      transform: [[0,0]],
      type: 'image',
      fill: ['rgba(0,0,0,0)','images/sa5.png']
   },
   {
      rect: [269.99999,219.99999,56,78],
      id: 'sa6',
      transform: [[0,0]],
      type: 'image',
      fill: ['rgba(0,0,0,0)','images/sa6.png']
   },
   {
      transform: [[0,0]],
      rect: [264.33331298828,377.49997901917,91.360687255859,1.904296875],
      id: 'Rectangle',
      stroke: [0,'rgba(0, 0, 0, 0)','none'],
      type: 'rect',
      fill: ['rgba(88,89,90,1.00)',null]
   }],
   symbolInstances: [
   {
      id: 'operaico_sym',
      symbolName: 'operaico_sym'
   },
   {
      id: 'netfrontico_sym',
      symbolName: 'netfrontico_sym'
   },
   {
      id: 'nokiaico_sym',
      symbolName: 'nokiaico_sy'
   },
   {
      id: 'appleico_sym',
      symbolName: 'appleico_sym'
   },
   {
      id: 'samsungico_sym',
      symbolName: 'samsungico_sym'
   },
   {
      id: 'otherico_sym',
      symbolName: 'otherico_sym'
   }   ]
   },
   states: {
      "Base State": {
         "${_bbpercent_txt}": [
            ["style", "top", '436.99px'],
            ["style", "width", '91px'],
            ["style", "height", '16px'],
            ["color", "color", 'rgba(144,144,144,1.00)'],
            ["style", "opacity", '0'],
            ["style", "left", '587px'],
            ["style", "font-size", '13px']
         ],
         "${_netfront_txt}": [
            ["style", "top", '376.99px'],
            ["style", "font-size", '13px'],
            ["color", "color", 'rgba(215,145,63,1.00)'],
            ["style", "height", '16px'],
            ["style", "opacity", '0'],
            ["style", "left", '722.85px'],
            ["style", "width", '91px']
         ],
         "${_sa5}": [
            ["style", "-webkit-transform-origin", [310.72,113.32], {valueTemplate:'@@0@@% @@1@@%'} ],
            ["style", "-moz-transform-origin", [310.72,113.32],{valueTemplate:'@@0@@% @@1@@%'}],
            ["style", "-ms-transform-origin", [310.72,113.32],{valueTemplate:'@@0@@% @@1@@%'}],
            ["style", "msTransformOrigin", [310.72,113.32],{valueTemplate:'@@0@@% @@1@@%'}],
            ["style", "-o-transform-origin", [310.72,113.32],{valueTemplate:'@@0@@% @@1@@%'}],
            ["transform", "rotateZ", '131deg'],
            ["style", "opacity", '0'],
            ["style", "left", '267.99px'],
            ["style", "top", '221.99px']
         ],
         "${_otherico_sym}": [
            ["style", "clip", [0,12,0,0], {valueTemplate:'rect(@@0@@px @@1@@px @@2@@px @@3@@px)'} ]
         ],
         "${_nokiapercent_txt}": [
            ["style", "top", '392.99px'],
            ["style", "font-size", '13px'],
            ["color", "color", 'rgba(144,144,144,1.00)'],
            ["style", "height", '16px'],
            ["style", "opacity", '0'],
            ["style", "left", '587px'],
            ["style", "width", '91px']
         ],
         "${_netfrontpercent_txt}": [
            ["style", "top", '392.99px'],
            ["style", "width", '91px'],
            ["style", "height", '16px'],
            ["color", "color", 'rgba(144,144,144,1.00)'],
            ["style", "opacity", '0'],
            ["style", "left", '722.85px'],
            ["style", "font-size", '13px']
         ],
         "${_apple_txt}": [
            ["style", "top", '331px'],
            ["style", "width", '91px'],
            ["style", "height", '16px'],
            ["color", "color", 'rgba(83,179,151,1.00)'],
            ["style", "opacity", '0'],
            ["style", "left", '722.85px'],
            ["style", "font-size", '13px']
         ],
         "${symbolSelector}": [
            ["style", "height", '149px'],
            ["style", "width", '282px']
         ],
         "${_nokiaico_sym}": [
            ["style", "top", '377.34px'],
            ["style", "left", '270.17px'],
            ["style", "clip", [0,12,0,0], {valueTemplate:'rect(@@0@@px @@1@@px @@2@@px @@3@@px)'} ]
         ],
         "${_sa3}": [
            ["style", "-webkit-transform-origin", [279.17,147.48], {valueTemplate:'@@0@@% @@1@@%'} ],
            ["style", "-moz-transform-origin", [279.17,147.48],{valueTemplate:'@@0@@% @@1@@%'}],
            ["style", "-ms-transform-origin", [279.17,147.48],{valueTemplate:'@@0@@% @@1@@%'}],
            ["style", "msTransformOrigin", [279.17,147.48],{valueTemplate:'@@0@@% @@1@@%'}],
            ["style", "-o-transform-origin", [279.17,147.48],{valueTemplate:'@@0@@% @@1@@%'}],
            ["transform", "rotateZ", '289deg'],
            ["style", "opacity", '0'],
            ["style", "left", '296px'],
            ["style", "top", '313.99px']
         ],
         "${_netfrontico_sym}": [
            ["style", "top", '378.5px'],
            ["style", "left", '301.33px'],
            ["style", "clip", [0,12,0,0], {valueTemplate:'rect(@@0@@px @@1@@px @@2@@px @@3@@px)'} ]
         ],
         "${_otherpercent_txt}": [
            ["style", "top", '436.99px'],
            ["style", "font-size", '13px'],
            ["color", "color", 'rgba(144,144,144,1.00)'],
            ["style", "height", '16px'],
            ["style", "opacity", '0'],
            ["style", "left", '722.85px'],
            ["style", "width", '91px']
         ],
         "${_samsungico_sym}": [
            ["style", "top", '378.17px'],
            ["style", "left", '310.6px'],
            ["style", "clip", [0,12,0,0], {valueTemplate:'rect(@@0@@px @@1@@px @@2@@px @@3@@px)'} ]
         ],
         "${_TextCopy}": [
            ["style", "top", '288.01px'],
            ["color", "color", 'rgba(144,144,144,1.00)'],
            ["style", "height", '31px'],
            ["style", "font-family", 'Armata'],
            ["style", "left", '586.78px'],
            ["style", "clip", [0,0,31,0], {valueTemplate:'rect(@@0@@px @@1@@px @@2@@px @@3@@px)'} ]
         ],
         "${_sa1}": [
            ["style", "-webkit-transform-origin", [54.63,111.59], {valueTemplate:'@@0@@% @@1@@%'} ],
            ["style", "-moz-transform-origin", [54.63,111.59],{valueTemplate:'@@0@@% @@1@@%'}],
            ["style", "-ms-transform-origin", [54.63,111.59],{valueTemplate:'@@0@@% @@1@@%'}],
            ["style", "msTransformOrigin", [54.63,111.59],{valueTemplate:'@@0@@% @@1@@%'}],
            ["style", "-o-transform-origin", [54.63,111.59],{valueTemplate:'@@0@@% @@1@@%'}],
            ["transform", "rotateZ", '153deg'],
            ["style", "opacity", '0'],
            ["style", "left", '283.26px'],
            ["style", "top", '252.33px']
         ],
         "${_other_txt}": [
            ["style", "top", '420.99px'],
            ["style", "width", '91px'],
            ["style", "height", '16px'],
            ["color", "color", 'rgba(117,70,139,1.00)'],
            ["style", "opacity", '0'],
            ["style", "left", '722.85px'],
            ["style", "font-size", '13px']
         ],
         "${_opera_txt}": [
            ["style", "top", '331px'],
            ["style", "font-size", '13px'],
            ["color", "color", 'rgba(63,215,95,1.00)'],
            ["style", "height", '16px'],
            ["style", "opacity", '0'],
            ["style", "left", '587px'],
            ["style", "width", '91px']
         ],
         "${_operapercent_txt}": [
            ["style", "top", '347px'],
            ["style", "width", '91px'],
            ["style", "height", '16px'],
            ["color", "color", 'rgba(144,144,144,1.00)'],
            ["style", "opacity", '0'],
            ["style", "left", '587px'],
            ["style", "font-size", '13px']
         ],
         "${_nokia_txt}": [
            ["style", "top", '376.99px'],
            ["style", "width", '91px'],
            ["style", "height", '16px'],
            ["color", "color", 'rgba(171,109,169,1.00)'],
            ["style", "opacity", '0'],
            ["style", "left", '587px'],
            ["style", "font-size", '13px']
         ],
         "${_bb_txt}": [
            ["style", "top", '420.99px'],
            ["style", "font-size", '13px'],
            ["color", "color", 'rgba(207,204,109,1.00)'],
            ["style", "height", '16px'],
            ["style", "opacity", '0'],
            ["style", "left", '587px'],
            ["style", "width", '91px']
         ],
         "${_operaico_sym}": [
            ["style", "top", '377.34px'],
            ["style", "left", '283.25px'],
            ["style", "clip", [0,12,0,0], {valueTemplate:'rect(@@0@@px @@1@@px @@2@@px @@3@@px)'} ]
         ],
         "${_header}": [
            ["style", "top", '257px'],
            ["color", "color", 'rgba(65,64,66,1)'],
            ["style", "height", '31px'],
            ["style", "font-family", 'Armata'],
            ["style", "left", '586.78px'],
            ["style", "clip", [0,0,31,0], {valueTemplate:'rect(@@0@@px @@1@@px @@2@@px @@3@@px)'} ]
         ],
         "${_iospercent_txt}": [
            ["style", "top", '347px'],
            ["style", "font-size", '13px'],
            ["color", "color", 'rgba(144,144,144,1.00)'],
            ["style", "height", '16px'],
            ["style", "opacity", '0'],
            ["style", "left", '722.85px'],
            ["style", "width", '91px']
         ],
         "${_sa6}": [
            ["style", "-webkit-transform-origin", [169.81,107.21], {valueTemplate:'@@0@@% @@1@@%'} ],
            ["style", "-moz-transform-origin", [169.81,107.21],{valueTemplate:'@@0@@% @@1@@%'}],
            ["style", "-ms-transform-origin", [169.81,107.21],{valueTemplate:'@@0@@% @@1@@%'}],
            ["style", "msTransformOrigin", [169.81,107.21],{valueTemplate:'@@0@@% @@1@@%'}],
            ["style", "-o-transform-origin", [169.81,107.21],{valueTemplate:'@@0@@% @@1@@%'}],
            ["transform", "rotateZ", '445deg'],
            ["style", "opacity", '0'],
            ["style", "left", '336.18px'],
            ["style", "top", '300px']
         ],
         "${_sa4}": [
            ["style", "-webkit-transform-origin", [346.53,133.67], {valueTemplate:'@@0@@% @@1@@%'} ],
            ["style", "-moz-transform-origin", [346.53,133.67],{valueTemplate:'@@0@@% @@1@@%'}],
            ["style", "-ms-transform-origin", [346.53,133.67],{valueTemplate:'@@0@@% @@1@@%'}],
            ["style", "msTransformOrigin", [346.53,133.67],{valueTemplate:'@@0@@% @@1@@%'}],
            ["style", "-o-transform-origin", [346.53,133.67],{valueTemplate:'@@0@@% @@1@@%'}],
            ["transform", "rotateZ", '74deg'],
            ["style", "opacity", '0'],
            ["style", "left", '310px'],
            ["style", "top", '330px']
         ],
         "${_Rectangle}": [
            ["style", "height", '0px'],
            ["color", "background-color", 'rgba(88,89,90,1.00)'],
            ["style", "left", '264.33px'],
            ["style", "width", '0px']
         ],
         "${_sa2}": [
            ["style", "-webkit-transform-origin", [114.16,114.01], {valueTemplate:'@@0@@% @@1@@%'} ],
            ["style", "-moz-transform-origin", [114.16,114.01],{valueTemplate:'@@0@@% @@1@@%'}],
            ["style", "-ms-transform-origin", [114.16,114.01],{valueTemplate:'@@0@@% @@1@@%'}],
            ["style", "msTransformOrigin", [114.16,114.01],{valueTemplate:'@@0@@% @@1@@%'}],
            ["style", "-o-transform-origin", [114.16,114.01],{valueTemplate:'@@0@@% @@1@@%'}],
            ["transform", "rotateZ", '115deg'],
            ["style", "opacity", '0'],
            ["style", "left", '199.48px'],
            ["style", "top", '202.55px']
         ],
         "${_appleico_sym}": [
            ["style", "top", '378.5px'],
            ["style", "left", '327px'],
            ["style", "clip", [0,12,0,0], {valueTemplate:'rect(@@0@@px @@1@@px @@2@@px @@3@@px)'} ]
         ]
      }
   },
   timelines: {
      "Default Timeline": {
         fromState: "Base State",
         toState: "",
         duration: 11129,
         autoPlay: false,
         labels: {
            "play": 250
         },
         timeline: [
            { id: "eid1111", tween: [ "style", "${_nokiaico_sym}", "clip", [0,11,75,0], { valueTemplate: 'rect(@@0@@px @@1@@px @@2@@px @@3@@px)', fromValue: [0,12,0,0]}], position: 2120, duration: 250, easing: "easeOutSine" },
            { id: "eid1945", tween: [ "style", "${_bbpercent_txt}", "opacity", '1', { fromValue: '0'}], position: 4000, duration: 411 },
            { id: "eid12061", tween: [ "style", "${_sa6}", "opacity", '1', { fromValue: '0'}], position: 250, duration: 388, easing: "easeOutCirc" },
            { id: "eid1965", tween: [ "style", "${_nokia_txt}", "opacity", '1', { fromValue: '0'}], position: 3838, duration: 411 },
            { id: "eid1019", tween: [ "style", "${_Rectangle}", "width", '91px', { fromValue: '0px'}], position: 1701, duration: 299 },
            { id: "eid1973", tween: [ "style", "${_netfrontpercent_txt}", "opacity", '1', { fromValue: '0'}], position: 4411, duration: 411 },
            { id: "eid12051", tween: [ "style", "${_sa3}", "opacity", '1', { fromValue: '0'}], position: 250, duration: 388, easing: "easeOutCirc" },
            { id: "eid12064", tween: [ "style", "${_sa5}", "left", '321.99px', { fromValue: '269.99px'}], position: 250, duration: 0 },
            { id: "eid1969", tween: [ "style", "${_iospercent_txt}", "opacity", '1', { fromValue: '0'}], position: 4160, duration: 411 },
            { id: "eid1107", tween: [ "style", "${_otherico_sym}", "clip", [0,12,32,0], { valueTemplate: 'rect(@@0@@px @@1@@px @@2@@px @@3@@px)', fromValue: [0,12,0,0]}], position: 2250, duration: 250, easing: "easeOutSine" },
            { id: "eid12058", tween: [ "style", "${_sa5}", "-webkit-transform-origin", [421.94,101.01], { valueTemplate: '@@0@@% @@1@@%', fromValue: [310.72,113.32]}], position: 250, duration: 1451, easing: "easeOutCirc" },
            { id: "eid27512", tween: [ "style", "${_sa5}", "-moz-transform-origin", [421.94,101.01], { valueTemplate: '@@0@@% @@1@@%', fromValue: [310.72,113.32]}], position: 250, duration: 1451, easing: "easeOutCirc" },
            { id: "eid27513", tween: [ "style", "${_sa5}", "-ms-transform-origin", [421.94,101.01], { valueTemplate: '@@0@@% @@1@@%', fromValue: [310.72,113.32]}], position: 250, duration: 1451, easing: "easeOutCirc" },
            { id: "eid27514", tween: [ "style", "${_sa5}", "msTransformOrigin", [421.94,101.01], { valueTemplate: '@@0@@% @@1@@%', fromValue: [310.72,113.32]}], position: 250, duration: 1451, easing: "easeOutCirc" },
            { id: "eid27515", tween: [ "style", "${_sa5}", "-o-transform-origin", [421.94,101.01], { valueTemplate: '@@0@@% @@1@@%', fromValue: [310.72,113.32]}], position: 250, duration: 1451, easing: "easeOutCirc" },
            { id: "eid4093", tween: [ "color", "${_other_txt}", "color", 'rgba(117,70,139,1.00)', { animationColorSpace: 'RGB', valueTemplate: undefined, fromValue: 'rgba(117,70,139,1.00)'}], position: 4983, duration: 0 },
            { id: "eid12068", tween: [ "style", "${_sa3}", "left", '296px', { fromValue: '296px'}], position: 1701, duration: 0 },
            { id: "eid12046", tween: [ "transform", "${_sa2}", "rotateZ", '0deg', { fromValue: '115deg'}], position: 250, duration: 1451, easing: "easeOutCirc" },
            { id: "eid1971", tween: [ "style", "${_bb_txt}", "opacity", '1', { fromValue: '0'}], position: 4000, duration: 411 },
            { id: "eid12039", tween: [ "style", "${_bb_txt}", "opacity", '0.93999999761581', { fromValue: '1'}], position: 11129, duration: 0 },
            { id: "eid1429", tween: [ "style", "${_header}", "clip", [0,433,31,0], { valueTemplate: 'rect(@@0@@px @@1@@px @@2@@px @@3@@px)', fromValue: [0,0,31,0]}], position: 2589, duration: 1160 },
            { id: "eid4091", tween: [ "color", "${_apple_txt}", "color", 'rgba(83,179,151,1.00)', { animationColorSpace: 'RGB', valueTemplate: undefined, fromValue: 'rgba(83,179,151,1.00)'}], position: 4983, duration: 0 },
            { id: "eid1947", tween: [ "style", "${_nokiapercent_txt}", "opacity", '1', { fromValue: '0'}], position: 3838, duration: 411 },
            { id: "eid4092", tween: [ "color", "${_netfront_txt}", "color", 'rgba(215,145,63,1.00)', { animationColorSpace: 'RGB', valueTemplate: undefined, fromValue: 'rgba(215,145,63,1.00)'}], position: 4983, duration: 0 },
            { id: "eid12074", tween: [ "style", "${_sa1}", "-webkit-transform-origin", [54.63,111.59], { valueTemplate: '@@0@@% @@1@@%', fromValue: [54.63,111.59]}], position: 1701, duration: 0 },
            { id: "eid27516", tween: [ "style", "${_sa1}", "-moz-transform-origin", [54.63,111.59], { valueTemplate: '@@0@@% @@1@@%', fromValue: [54.63,111.59]}], position: 1701, duration: 0 },
            { id: "eid27517", tween: [ "style", "${_sa1}", "-ms-transform-origin", [54.63,111.59], { valueTemplate: '@@0@@% @@1@@%', fromValue: [54.63,111.59]}], position: 1701, duration: 0 },
            { id: "eid27518", tween: [ "style", "${_sa1}", "msTransformOrigin", [54.63,111.59], { valueTemplate: '@@0@@% @@1@@%', fromValue: [54.63,111.59]}], position: 1701, duration: 0 },
            { id: "eid27519", tween: [ "style", "${_sa1}", "-o-transform-origin", [54.63,111.59], { valueTemplate: '@@0@@% @@1@@%', fromValue: [54.63,111.59]}], position: 1701, duration: 0 },
            { id: "eid12049", tween: [ "transform", "${_sa3}", "rotateZ", '0deg', { fromValue: '289deg'}], position: 250, duration: 1451, easing: "easeOutCirc" },
            { id: "eid12047", tween: [ "style", "${_sa2}", "opacity", '1', { fromValue: '0'}], position: 250, duration: 437, easing: "easeOutCirc" },
            { id: "eid12065", tween: [ "style", "${_sa5}", "top", '336px', { fromValue: '219.99px'}], position: 250, duration: 0 },
            { id: "eid12053", tween: [ "style", "${_sa4}", "-webkit-transform-origin", [346.53,133.67], { valueTemplate: '@@0@@% @@1@@%', fromValue: [346.53,133.67]}], position: 250, duration: 0, easing: "easeOutCirc" },
            { id: "eid27520", tween: [ "style", "${_sa4}", "-moz-transform-origin", [346.53,133.67], { valueTemplate: '@@0@@% @@1@@%', fromValue: [346.53,133.67]}], position: 250, duration: 0, easing: "easeOutCirc" },
            { id: "eid27521", tween: [ "style", "${_sa4}", "-ms-transform-origin", [346.53,133.67], { valueTemplate: '@@0@@% @@1@@%', fromValue: [346.53,133.67]}], position: 250, duration: 0, easing: "easeOutCirc" },
            { id: "eid27522", tween: [ "style", "${_sa4}", "msTransformOrigin", [346.53,133.67], { valueTemplate: '@@0@@% @@1@@%', fromValue: [346.53,133.67]}], position: 250, duration: 0, easing: "easeOutCirc" },
            { id: "eid27523", tween: [ "style", "${_sa4}", "-o-transform-origin", [346.53,133.67], { valueTemplate: '@@0@@% @@1@@%', fromValue: [346.53,133.67]}], position: 250, duration: 0, easing: "easeOutCirc" },
            { id: "eid12072", tween: [ "style", "${_sa4}", "-webkit-transform-origin", [473.73,87.46], { valueTemplate: '@@0@@% @@1@@%', fromValue: [346.53,133.67]}], position: 1701, duration: 0 },
            { id: "eid27524", tween: [ "style", "${_sa4}", "-moz-transform-origin", [473.73,87.46], { valueTemplate: '@@0@@% @@1@@%', fromValue: [346.53,133.67]}], position: 1701, duration: 0 },
            { id: "eid27525", tween: [ "style", "${_sa4}", "-ms-transform-origin", [473.73,87.46], { valueTemplate: '@@0@@% @@1@@%', fromValue: [346.53,133.67]}], position: 1701, duration: 0 },
            { id: "eid27526", tween: [ "style", "${_sa4}", "msTransformOrigin", [473.73,87.46], { valueTemplate: '@@0@@% @@1@@%', fromValue: [346.53,133.67]}], position: 1701, duration: 0 },
            { id: "eid27527", tween: [ "style", "${_sa4}", "-o-transform-origin", [473.73,87.46], { valueTemplate: '@@0@@% @@1@@%', fromValue: [346.53,133.67]}], position: 1701, duration: 0 },
            { id: "eid1963", tween: [ "style", "${_otherpercent_txt}", "opacity", '1', { fromValue: '0'}], position: 4572, duration: 411 },
            { id: "eid12041", tween: [ "style", "${_sa1}", "top", '221.99px', { fromValue: '252.33px'}], position: 250, duration: 1451, easing: "easeOutCirc" },
            { id: "eid12057", tween: [ "style", "${_sa5}", "opacity", '1', { fromValue: '0'}], position: 250, duration: 656, easing: "easeOutCirc" },
            { id: "eid12042", tween: [ "transform", "${_sa1}", "rotateZ", '360deg', { fromValue: '153deg'}], position: 250, duration: 1451, easing: "easeOutCirc" },
            { id: "eid12069", tween: [ "style", "${_sa3}", "top", '313.99px', { fromValue: '313.99px'}], position: 1701, duration: 0 },
            { id: "eid8780", tween: [ "style", "${_samsungico_sym}", "clip", [0,13,73,0], { valueTemplate: 'rect(@@0@@px @@1@@px @@2@@px @@3@@px)', fromValue: [0,12,0,0]}], position: 2291, duration: 250, easing: "easeOutSine" },
            { id: "eid12040", tween: [ "style", "${_sa1}", "left", '269.99px', { fromValue: '283.26px'}], position: 250, duration: 1451, easing: "easeOutCirc" },
            { id: "eid12045", tween: [ "style", "${_sa2}", "top", '236.99px', { fromValue: '202.55px'}], position: 250, duration: 1451, easing: "easeOutCirc" },
            { id: "eid1017", tween: [ "style", "${_Rectangle}", "height", '2px', { fromValue: '0px'}], position: 1701, duration: 299 },
            { id: "eid12073", tween: [ "style", "${_sa2}", "-webkit-transform-origin", [114.16,114.01], { valueTemplate: '@@0@@% @@1@@%', fromValue: [114.16,114.01]}], position: 1701, duration: 0 },
            { id: "eid27528", tween: [ "style", "${_sa2}", "-moz-transform-origin", [114.16,114.01], { valueTemplate: '@@0@@% @@1@@%', fromValue: [114.16,114.01]}], position: 1701, duration: 0 },
            { id: "eid27529", tween: [ "style", "${_sa2}", "-ms-transform-origin", [114.16,114.01], { valueTemplate: '@@0@@% @@1@@%', fromValue: [114.16,114.01]}], position: 1701, duration: 0 },
            { id: "eid27530", tween: [ "style", "${_sa2}", "msTransformOrigin", [114.16,114.01], { valueTemplate: '@@0@@% @@1@@%', fromValue: [114.16,114.01]}], position: 1701, duration: 0 },
            { id: "eid27531", tween: [ "style", "${_sa2}", "-o-transform-origin", [114.16,114.01], { valueTemplate: '@@0@@% @@1@@%', fromValue: [114.16,114.01]}], position: 1701, duration: 0 },
            { id: "eid12060", tween: [ "transform", "${_sa6}", "rotateZ", '360deg', { fromValue: '445deg'}], position: 250, duration: 1451, easing: "easeOutCirc" },
            { id: "eid12063", tween: [ "style", "${_sa6}", "top", '300px', { fromValue: '300px'}], position: 1701, duration: 0 },
            { id: "eid1105", tween: [ "style", "${_appleico_sym}", "clip", [0,12,85,0], { valueTemplate: 'rect(@@0@@px @@1@@px @@2@@px @@3@@px)', fromValue: [0,12,0,0]}], position: 2250, duration: 250, easing: "easeOutSine" },
            { id: "eid1941", tween: [ "style", "${_opera_txt}", "opacity", '1', { fromValue: '0'}], position: 3749, duration: 411 },
            { id: "eid1939", tween: [ "style", "${_netfront_txt}", "opacity", '1', { fromValue: '0'}], position: 4411, duration: 411 },
            { id: "eid1431", tween: [ "style", "${_TextCopy}", "clip", [0,192,31,0], { valueTemplate: 'rect(@@0@@px @@1@@px @@2@@px @@3@@px)', fromValue: [0,0,31,0]}], position: 3365, duration: 250 },
            { id: "eid12054", tween: [ "style", "${_sa4}", "opacity", '1', { fromValue: '0'}], position: 250, duration: 500, easing: "easeOutCirc" },
            { id: "eid4089", tween: [ "color", "${_nokia_txt}", "color", 'rgba(171,109,169,1.00)', { animationColorSpace: 'RGB', valueTemplate: undefined, fromValue: 'rgba(171,109,169,1.00)'}], position: 4983, duration: 0 },
            { id: "eid12052", tween: [ "transform", "${_sa4}", "rotateZ", '360deg', { fromValue: '74deg'}], position: 250, duration: 1451, easing: "easeOutCirc" },
            { id: "eid12050", tween: [ "style", "${_sa3}", "-webkit-transform-origin", [279.17,147.48], { valueTemplate: '@@0@@% @@1@@%', fromValue: [279.17,147.48]}], position: 250, duration: 0, easing: "easeOutCirc" },
            { id: "eid27532", tween: [ "style", "${_sa3}", "-moz-transform-origin", [279.17,147.48], { valueTemplate: '@@0@@% @@1@@%', fromValue: [279.17,147.48]}], position: 250, duration: 0, easing: "easeOutCirc" },
            { id: "eid27533", tween: [ "style", "${_sa3}", "-ms-transform-origin", [279.17,147.48], { valueTemplate: '@@0@@% @@1@@%', fromValue: [279.17,147.48]}], position: 250, duration: 0, easing: "easeOutCirc" },
            { id: "eid27534", tween: [ "style", "${_sa3}", "msTransformOrigin", [279.17,147.48], { valueTemplate: '@@0@@% @@1@@%', fromValue: [279.17,147.48]}], position: 250, duration: 0, easing: "easeOutCirc" },
            { id: "eid27535", tween: [ "style", "${_sa3}", "-o-transform-origin", [279.17,147.48], { valueTemplate: '@@0@@% @@1@@%', fromValue: [279.17,147.48]}], position: 250, duration: 0, easing: "easeOutCirc" },
            { id: "eid12070", tween: [ "style", "${_sa3}", "-webkit-transform-origin", [452.19,103.97], { valueTemplate: '@@0@@% @@1@@%', fromValue: [279.17,147.48]}], position: 1701, duration: 0 },
            { id: "eid27536", tween: [ "style", "${_sa3}", "-moz-transform-origin", [452.19,103.97], { valueTemplate: '@@0@@% @@1@@%', fromValue: [279.17,147.48]}], position: 1701, duration: 0 },
            { id: "eid27537", tween: [ "style", "${_sa3}", "-ms-transform-origin", [452.19,103.97], { valueTemplate: '@@0@@% @@1@@%', fromValue: [279.17,147.48]}], position: 1701, duration: 0 },
            { id: "eid27538", tween: [ "style", "${_sa3}", "msTransformOrigin", [452.19,103.97], { valueTemplate: '@@0@@% @@1@@%', fromValue: [279.17,147.48]}], position: 1701, duration: 0 },
            { id: "eid27539", tween: [ "style", "${_sa3}", "-o-transform-origin", [452.19,103.97], { valueTemplate: '@@0@@% @@1@@%', fromValue: [279.17,147.48]}], position: 1701, duration: 0 },
            { id: "eid4090", tween: [ "color", "${_bb_txt}", "color", 'rgba(207,204,109,1.00)', { animationColorSpace: 'RGB', valueTemplate: undefined, fromValue: 'rgba(207,204,109,1.00)'}], position: 4983, duration: 0 },
            { id: "eid1115", tween: [ "style", "${_netfrontico_sym}", "clip", [0,13,73,0], { valueTemplate: 'rect(@@0@@px @@1@@px @@2@@px @@3@@px)', fromValue: [0,12,0,0]}], position: 2120, duration: 250, easing: "easeOutSine" },
            { id: "eid1967", tween: [ "style", "${_apple_txt}", "opacity", '1', { fromValue: '0'}], position: 4160, duration: 411 },
            { id: "eid12038", tween: [ "style", "${_apple_txt}", "opacity", '0.99000000953674', { fromValue: '1'}], position: 11129, duration: 0 },
            { id: "eid12043", tween: [ "style", "${_sa1}", "opacity", '1', { fromValue: '0'}], position: 250, duration: 656, easing: "easeOutCirc" },
            { id: "eid1943", tween: [ "style", "${_operapercent_txt}", "opacity", '1', { fromValue: '0'}], position: 3749, duration: 411 },
            { id: "eid1949", tween: [ "style", "${_other_txt}", "opacity", '1', { fromValue: '0'}], position: 4572, duration: 411 },
            { id: "eid12066", tween: [ "style", "${_sa4}", "left", '310px', { fromValue: '310px'}], position: 1701, duration: 0 },
            { id: "eid12062", tween: [ "style", "${_sa6}", "left", '336.18px', { fromValue: '336.18px'}], position: 1701, duration: 0 },
            { id: "eid12071", tween: [ "style", "${_sa6}", "-webkit-transform-origin", [169.81,107.21], { valueTemplate: '@@0@@% @@1@@%', fromValue: [169.81,107.21]}], position: 1701, duration: 0 },
            { id: "eid27540", tween: [ "style", "${_sa6}", "-moz-transform-origin", [169.81,107.21], { valueTemplate: '@@0@@% @@1@@%', fromValue: [169.81,107.21]}], position: 1701, duration: 0 },
            { id: "eid27541", tween: [ "style", "${_sa6}", "-ms-transform-origin", [169.81,107.21], { valueTemplate: '@@0@@% @@1@@%', fromValue: [169.81,107.21]}], position: 1701, duration: 0 },
            { id: "eid27542", tween: [ "style", "${_sa6}", "msTransformOrigin", [169.81,107.21], { valueTemplate: '@@0@@% @@1@@%', fromValue: [169.81,107.21]}], position: 1701, duration: 0 },
            { id: "eid27543", tween: [ "style", "${_sa6}", "-o-transform-origin", [169.81,107.21], { valueTemplate: '@@0@@% @@1@@%', fromValue: [169.81,107.21]}], position: 1701, duration: 0 },
            { id: "eid12059", tween: [ "transform", "${_sa5}", "rotateZ", '360deg', { fromValue: '131deg'}], position: 250, duration: 1451, easing: "easeOutCirc" },
            { id: "eid1113", tween: [ "style", "${_operaico_sym}", "clip", [0,12,54,0], { valueTemplate: 'rect(@@0@@px @@1@@px @@2@@px @@3@@px)', fromValue: [0,12,0,0]}], position: 2000, duration: 250, easing: "easeOutSine" },
            { id: "eid12044", tween: [ "style", "${_sa2}", "left", '281.99px', { fromValue: '199.48px'}], position: 250, duration: 1451, easing: "easeOutCirc" },
            { id: "eid12067", tween: [ "style", "${_sa4}", "top", '330px', { fromValue: '330px'}], position: 1701, duration: 0 }         ]
      }
   }
},
"ocgraph_sym": {
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
      id: 'operaico_sym',
      rect: [321.000015,377.500018,0,0],
      type: 'rect',
      transform: [[0,0]]
   },
   {
      id: 'nokiaico_sym',
      rect: [311.500019,378.500018,0,0],
      type: 'rect',
      transform: [[0,0]]
   },
   {
      id: 'bbico_sym',
      rect: [282.499997,379.500018,0,0],
      type: 'rect',
      transform: [[0,0]]
   },
   {
      id: 'appleico_sym',
      rect: [270,379.500018,0,0],
      type: 'rect',
      transform: [[0,0]]
   },
   {
      id: 'otherico_sym',
      rect: [337.500004,379.500018,0,0],
      type: 'rect',
      transform: {}
   },
   {
      rect: [586.78122,257,433.80078125,31],
      transform: [[0,0]],
      id: 'header',
      text: 'Mobile Browser Marketshare',
      font: ['Armata',24,'rgba(65,64,66,1.00)','normal','none',''],
      type: 'text'
   },
   {
      rect: [586.78122,288.00001,433.80078125,31],
      transform: [[0,0]],
      id: 'TextCopy',
      text: 'Oceania',
      font: ['Armata',24,'rgba(144,144,144,1.00)','normal','none',''],
      type: 'text'
   },
   {
      font: ['Armata',13,'rgba(63,215,95,1.00)','normal','none','normal'],
      rect: [587,331,91,16],
      align: 'auto',
      opacity: 1,
      id: 'opera_txt',
      text: 'iOS',
      transform: {},
      type: 'text'
   },
   {
      font: ['Armata',13,'rgba(144,144,144,1.00)','normal','none','normal'],
      rect: [587,347,91,16],
      align: 'auto',
      opacity: 1,
      id: 'operapercent_txt',
      text: 'xxx',
      transform: [[0,0]],
      type: 'text'
   },
   {
      font: ['Armata',13,'rgba(144,144,144,1.00)','normal','none','normal'],
      rect: [587,392.99999,91,16],
      align: 'auto',
      opacity: 1,
      id: 'nokiapercent_txt',
      text: 'xxx',
      transform: [[0,0]],
      type: 'text'
   },
   {
      font: ['Armata',13,'rgba(63,215,95,1.00)','normal','none','normal'],
      rect: [587,376.99999,91,16],
      align: 'auto',
      opacity: 1,
      id: 'nokia_txt',
      text: 'BlackBerry',
      transform: [[0,0]],
      type: 'text'
   },
   {
      font: ['Armata',13,'rgba(63,215,95,1.00)','normal','none','normal'],
      rect: [587,420.99999,91,16],
      align: 'auto',
      opacity: 1,
      id: 'bb_txt',
      text: 'Android',
      transform: [[0,0]],
      type: 'text'
   },
   {
      font: ['Armata',13,'rgba(144,144,144,1.00)','normal','none','normal'],
      rect: [587,436.99999,91,16],
      align: 'auto',
      opacity: 1,
      id: 'bbpercent_txt',
      text: 'xxx',
      transform: [[0,0]],
      type: 'text'
   },
   {
      font: ['Armata',13,'rgba(144,144,144,1.00)','normal','none','normal'],
      rect: [722.85937,436.99999,91,16],
      align: 'auto',
      opacity: 1,
      id: 'otherpercent_txt',
      text: 'xxx',
      transform: [[0,0]],
      type: 'text'
   },
   {
      font: ['Armata',13,'rgba(63,215,95,1.00)','normal','none','normal'],
      rect: [722.85937,420.99999,91,16],
      align: 'auto',
      opacity: 1,
      id: 'other_txt',
      text: 'Other',
      transform: [[0,0]],
      type: 'text'
   },
   {
      font: ['Armata',13,'rgba(63,215,95,1.00)','normal','none','normal'],
      rect: [722.85937,376.99999,91,16],
      align: 'auto',
      opacity: 1,
      id: 'netfront_txt',
      text: 'Opera',
      transform: [[0,0]],
      type: 'text'
   },
   {
      font: ['Armata',13,'rgba(144,144,144,1.00)','normal','none','normal'],
      rect: [722.85937,392.99999,91,16],
      align: 'auto',
      opacity: 1,
      id: 'netfrontpercent_txt',
      text: 'xxx',
      transform: [[0,0]],
      type: 'text'
   },
   {
      font: ['Armata',13,'rgba(144,144,144,1.00)','normal','none','normal'],
      rect: [722.85937,347,91,16],
      align: 'auto',
      opacity: 1,
      id: 'iospercent_txt',
      text: 'xxx',
      transform: [[0,0]],
      type: 'text'
   },
   {
      font: ['Armata',13,'rgba(63,215,95,1.00)','normal','none','normal'],
      rect: [722.85937,331,91,16],
      align: 'auto',
      opacity: 1,
      id: 'apple_txt',
      text: 'Nokia',
      transform: [[0,0]],
      type: 'text'
   },
   {
      id: 'androidico_sym2',
      rect: [299.48828125,378.984375,0,0],
      type: 'rect',
      transform: [[0,0]]
   },
   {
      rect: [234.84065,208,307,287],
      id: 'au1',
      transform: [[0,0]],
      type: 'image',
      fill: ['rgba(0,0,0,0)','images/au1.png']
   },
   {
      rect: [234.84065,208,48,96],
      id: 'au2',
      transform: [[0,0]],
      type: 'image',
      fill: ['rgba(0,0,0,0)','images/au2.png']
   },
   {
      rect: [234.84065,208,28,60],
      id: 'au3',
      transform: [[0,0]],
      type: 'image',
      fill: ['rgba(0,0,0,0)','images/au3.png']
   },
   {
      rect: [234.84065,208,24,50],
      id: 'au4',
      transform: [[0,0]],
      type: 'image',
      fill: ['rgba(0,0,0,0)','images/au4.png']
   },
   {
      rect: [234.84065,208,17,23],
      id: 'au5',
      transform: [[0,0]],
      type: 'image',
      fill: ['rgba(0,0,0,0)','images/au5.png']
   },
   {
      rect: [234.84065,208,16,18],
      id: 'au6',
      transform: [[0,0]],
      type: 'image',
      fill: ['rgba(0,0,0,0)','images/au6.png']
   },
   {
      transform: [[0,0]],
      rect: [264.33331298828,377.49997901917,91.360687255859,1.904296875],
      id: 'Rectangle',
      stroke: [0,'rgba(0, 0, 0, 0)','none'],
      type: 'rect',
      fill: ['rgba(88,89,90,1.00)',null]
   }],
   symbolInstances: [
   {
      id: 'operaico_sym',
      symbolName: 'operaico_sym'
   },
   {
      id: 'androidico_sym2',
      symbolName: 'androidico_sym'
   },
   {
      id: 'nokiaico_sym',
      symbolName: 'nokiaico_sy'
   },
   {
      id: 'appleico_sym',
      symbolName: 'appleico_sym'
   },
   {
      id: 'bbico_sym',
      symbolName: 'bbico_sym'
   },
   {
      id: 'otherico_sym',
      symbolName: 'otherico_sym'
   }   ]
   },
   states: {
      "Base State": {
         "${_operaico_sym}": [
            ["style", "top", '377.5px'],
            ["style", "clip", [0,12,0,0], {valueTemplate:'rect(@@0@@px @@1@@px @@2@@px @@3@@px)'} ],
            ["style", "left", '321px']
         ],
         "${_au5}": [
            ["style", "-webkit-transform-origin", [310.72,113.32], {valueTemplate:'@@0@@% @@1@@%'} ],
            ["style", "-moz-transform-origin", [310.72,113.32],{valueTemplate:'@@0@@% @@1@@%'}],
            ["style", "-ms-transform-origin", [310.72,113.32],{valueTemplate:'@@0@@% @@1@@%'}],
            ["style", "msTransformOrigin", [310.72,113.32],{valueTemplate:'@@0@@% @@1@@%'}],
            ["style", "-o-transform-origin", [310.72,113.32],{valueTemplate:'@@0@@% @@1@@%'}],
            ["transform", "rotateZ", '131deg'],
            ["style", "opacity", '0'],
            ["style", "left", '232.84px'],
            ["style", "top", '210px']
         ],
         "${_otherico_sym}": [
            ["style", "clip", [0,12,0,0], {valueTemplate:'rect(@@0@@px @@1@@px @@2@@px @@3@@px)'} ]
         ],
         "${_nokiapercent_txt}": [
            ["style", "top", '392.99px'],
            ["style", "width", '91px'],
            ["color", "color", 'rgba(144,144,144,1.00)'],
            ["style", "height", '16px'],
            ["style", "opacity", '0'],
            ["style", "left", '587px'],
            ["style", "font-size", '13px']
         ],
         "${_appleico_sym}": [
            ["style", "clip", [0,12,0,0], {valueTemplate:'rect(@@0@@px @@1@@px @@2@@px @@3@@px)'} ],
            ["style", "left", '270px']
         ],
         "${_netfrontpercent_txt}": [
            ["style", "top", '392.99px'],
            ["style", "font-size", '13px'],
            ["style", "height", '16px'],
            ["color", "color", 'rgba(144,144,144,1.00)'],
            ["style", "opacity", '0'],
            ["style", "left", '722.85px'],
            ["style", "width", '91px']
         ],
         "${_au2}": [
            ["style", "-webkit-transform-origin", [-110.21,326.44], {valueTemplate:'@@0@@% @@1@@%'} ],
            ["style", "-moz-transform-origin", [-110.21,326.44],{valueTemplate:'@@0@@% @@1@@%'}],
            ["style", "-ms-transform-origin", [-110.21,326.44],{valueTemplate:'@@0@@% @@1@@%'}],
            ["style", "msTransformOrigin", [-110.21,326.44],{valueTemplate:'@@0@@% @@1@@%'}],
            ["style", "-o-transform-origin", [-110.21,326.44],{valueTemplate:'@@0@@% @@1@@%'}],
            ["transform", "rotateZ", '115deg'],
            ["style", "opacity", '0'],
            ["style", "left", '280px'],
            ["style", "top", '282px']
         ],
         "${symbolSelector}": [
            ["style", "height", '149px'],
            ["style", "width", '282px']
         ],
         "${_other_txt}": [
            ["style", "top", '420.99px'],
            ["style", "font-size", '13px'],
            ["style", "height", '16px'],
            ["color", "color", 'rgba(117,70,139,1.00)'],
            ["style", "opacity", '0'],
            ["style", "left", '722.85px'],
            ["style", "width", '91px']
         ],
         "${_Rectangle}": [
            ["color", "background-color", 'rgba(88,89,90,1.00)'],
            ["style", "height", '0px'],
            ["style", "left", '264.33px'],
            ["style", "width", '0px']
         ],
         "${_operapercent_txt}": [
            ["style", "top", '347px'],
            ["style", "font-size", '13px'],
            ["style", "height", '16px'],
            ["color", "color", 'rgba(144,144,144,1.00)'],
            ["style", "opacity", '0'],
            ["style", "left", '587px'],
            ["style", "width", '91px']
         ],
         "${_otherpercent_txt}": [
            ["style", "top", '436.99px'],
            ["style", "width", '91px'],
            ["color", "color", 'rgba(144,144,144,1.00)'],
            ["style", "height", '16px'],
            ["style", "opacity", '0'],
            ["style", "left", '722.85px'],
            ["style", "font-size", '13px']
         ],
         "${_nokiaico_sym}": [
            ["style", "top", '378.5px'],
            ["style", "clip", [0,12,0,0], {valueTemplate:'rect(@@0@@px @@1@@px @@2@@px @@3@@px)'} ],
            ["style", "left", '311.5px']
         ],
         "${_bbpercent_txt}": [
            ["style", "top", '436.99px'],
            ["style", "font-size", '13px'],
            ["style", "height", '16px'],
            ["color", "color", 'rgba(144,144,144,1.00)'],
            ["style", "opacity", '0'],
            ["style", "left", '587px'],
            ["style", "width", '91px']
         ],
         "${_au3}": [
            ["style", "-webkit-transform-origin", [279.17,147.48], {valueTemplate:'@@0@@% @@1@@%'} ],
            ["style", "-moz-transform-origin", [279.17,147.48],{valueTemplate:'@@0@@% @@1@@%'}],
            ["style", "-ms-transform-origin", [279.17,147.48],{valueTemplate:'@@0@@% @@1@@%'}],
            ["style", "msTransformOrigin", [279.17,147.48],{valueTemplate:'@@0@@% @@1@@%'}],
            ["style", "-o-transform-origin", [279.17,147.48],{valueTemplate:'@@0@@% @@1@@%'}],
            ["transform", "rotateZ", '289deg'],
            ["style", "opacity", '0'],
            ["style", "left", '294px'],
            ["style", "top", '318px']
         ],
         "${_au6}": [
            ["style", "-webkit-transform-origin", [508.85,121.34], {valueTemplate:'@@0@@% @@1@@%'} ],
            ["style", "-moz-transform-origin", [508.85,121.34],{valueTemplate:'@@0@@% @@1@@%'}],
            ["style", "-ms-transform-origin", [508.85,121.34],{valueTemplate:'@@0@@% @@1@@%'}],
            ["style", "msTransformOrigin", [508.85,121.34],{valueTemplate:'@@0@@% @@1@@%'}],
            ["style", "-o-transform-origin", [508.85,121.34],{valueTemplate:'@@0@@% @@1@@%'}],
            ["transform", "rotateZ", '445deg'],
            ["style", "opacity", '0'],
            ["style", "left", '336px'],
            ["style", "top", '361px']
         ],
         "${_opera_txt}": [
            ["style", "top", '331px'],
            ["style", "width", '91px'],
            ["color", "color", 'rgba(63,215,95,1.00)'],
            ["style", "height", '16px'],
            ["style", "opacity", '0'],
            ["style", "left", '587px'],
            ["style", "font-size", '13px']
         ],
         "${_bbico_sym}": [
            ["style", "clip", [0,12,0,0], {valueTemplate:'rect(@@0@@px @@1@@px @@2@@px @@3@@px)'} ],
            ["style", "left", '282.5px']
         ],
         "${_netfront_txt}": [
            ["style", "top", '376.99px'],
            ["style", "width", '91px'],
            ["color", "color", 'rgba(215,145,63,1.00)'],
            ["style", "height", '16px'],
            ["style", "opacity", '0'],
            ["style", "left", '722.85px'],
            ["style", "font-size", '13px']
         ],
         "${_bb_txt}": [
            ["style", "top", '420.99px'],
            ["style", "width", '91px'],
            ["color", "color", 'rgba(207,204,109,1.00)'],
            ["style", "height", '16px'],
            ["style", "opacity", '0'],
            ["style", "left", '587px'],
            ["style", "font-size", '13px']
         ],
         "${_androidico_sym2}": [
            ["style", "top", '378.98px'],
            ["style", "clip", [0,12,0,0], {valueTemplate:'rect(@@0@@px @@1@@px @@2@@px @@3@@px)'} ],
            ["style", "left", '299.49px']
         ],
         "${_header}": [
            ["style", "top", '257px'],
            ["color", "color", 'rgba(65,64,66,1)'],
            ["style", "height", '31px'],
            ["style", "font-family", 'Armata'],
            ["style", "left", '586.78px'],
            ["style", "clip", [0,0,31,0], {valueTemplate:'rect(@@0@@px @@1@@px @@2@@px @@3@@px)'} ]
         ],
         "${_iospercent_txt}": [
            ["style", "top", '347px'],
            ["style", "width", '91px'],
            ["color", "color", 'rgba(144,144,144,1.00)'],
            ["style", "height", '16px'],
            ["style", "opacity", '0'],
            ["style", "left", '722.85px'],
            ["style", "font-size", '13px']
         ],
         "${_au4}": [
            ["style", "-webkit-transform-origin", [346.53,133.67], {valueTemplate:'@@0@@% @@1@@%'} ],
            ["style", "-moz-transform-origin", [346.53,133.67],{valueTemplate:'@@0@@% @@1@@%'}],
            ["style", "-ms-transform-origin", [346.53,133.67],{valueTemplate:'@@0@@% @@1@@%'}],
            ["style", "msTransformOrigin", [346.53,133.67],{valueTemplate:'@@0@@% @@1@@%'}],
            ["style", "-o-transform-origin", [346.53,133.67],{valueTemplate:'@@0@@% @@1@@%'}],
            ["transform", "rotateZ", '74deg'],
            ["style", "opacity", '0'],
            ["style", "left", '308px'],
            ["style", "top", '329px']
         ],
         "${_nokia_txt}": [
            ["style", "top", '376.99px'],
            ["style", "font-size", '13px'],
            ["style", "height", '16px'],
            ["color", "color", 'rgba(171,109,169,1.00)'],
            ["style", "opacity", '0'],
            ["style", "left", '587px'],
            ["style", "width", '91px']
         ],
         "${_au1}": [
            ["style", "-webkit-transform-origin", [50.13,55.41], {valueTemplate:'@@0@@% @@1@@%'} ],
            ["style", "-moz-transform-origin", [50.13,55.41],{valueTemplate:'@@0@@% @@1@@%'}],
            ["style", "-ms-transform-origin", [50.13,55.41],{valueTemplate:'@@0@@% @@1@@%'}],
            ["style", "msTransformOrigin", [50.13,55.41],{valueTemplate:'@@0@@% @@1@@%'}],
            ["style", "-o-transform-origin", [50.13,55.41],{valueTemplate:'@@0@@% @@1@@%'}],
            ["transform", "rotateZ", '153deg'],
            ["style", "opacity", '0'],
            ["style", "left", '248.1px'],
            ["style", "top", '240.33px']
         ],
         "${_TextCopy}": [
            ["style", "top", '288.01px'],
            ["color", "color", 'rgba(144,144,144,1.00)'],
            ["style", "height", '31px'],
            ["style", "font-family", 'Armata'],
            ["style", "left", '586.78px'],
            ["style", "clip", [0,0,31,0], {valueTemplate:'rect(@@0@@px @@1@@px @@2@@px @@3@@px)'} ]
         ],
         "${_apple_txt}": [
            ["style", "top", '331px'],
            ["style", "font-size", '13px'],
            ["style", "height", '16px'],
            ["color", "color", 'rgba(83,179,151,1.00)'],
            ["style", "opacity", '0'],
            ["style", "left", '722.85px'],
            ["style", "width", '91px']
         ]
      }
   },
   timelines: {
      "Default Timeline": {
         fromState: "Base State",
         toState: "",
         duration: 4983,
         autoPlay: false,
         labels: {
            "play": 250
         },
         timeline: [
            { id: "eid1111", tween: [ "style", "${_nokiaico_sym}", "clip", [0,11,75,0], { valueTemplate: 'rect(@@0@@px @@1@@px @@2@@px @@3@@px)', fromValue: [0,12,0,0]}], position: 2120, duration: 250, easing: "easeOutSine" },
            { id: "eid1945", tween: [ "style", "${_bbpercent_txt}", "opacity", '1', { fromValue: '0'}], position: 4000, duration: 411 },
            { id: "eid14663", tween: [ "style", "${_au2}", "-webkit-transform-origin", [296.9,115.04], { valueTemplate: '@@0@@% @@1@@%', fromValue: [-110.21,326.44]}], position: 250, duration: 0 },
            { id: "eid27544", tween: [ "style", "${_au2}", "-moz-transform-origin", [296.9,115.04], { valueTemplate: '@@0@@% @@1@@%', fromValue: [-110.21,326.44]}], position: 250, duration: 0 },
            { id: "eid27545", tween: [ "style", "${_au2}", "-ms-transform-origin", [296.9,115.04], { valueTemplate: '@@0@@% @@1@@%', fromValue: [-110.21,326.44]}], position: 250, duration: 0 },
            { id: "eid27546", tween: [ "style", "${_au2}", "msTransformOrigin", [296.9,115.04], { valueTemplate: '@@0@@% @@1@@%', fromValue: [-110.21,326.44]}], position: 250, duration: 0 },
            { id: "eid27547", tween: [ "style", "${_au2}", "-o-transform-origin", [296.9,115.04], { valueTemplate: '@@0@@% @@1@@%', fromValue: [-110.21,326.44]}], position: 250, duration: 0 },
            { id: "eid12857", tween: [ "style", "${_au4}", "left", '308px', { fromValue: '308px'}], position: 1701, duration: 0 },
            { id: "eid12838", tween: [ "style", "${_au2}", "opacity", '1', { fromValue: '0'}], position: 250, duration: 437, easing: "easeOutCirc" },
            { id: "eid1965", tween: [ "style", "${_nokia_txt}", "opacity", '1', { fromValue: '0'}], position: 3838, duration: 411 },
            { id: "eid1019", tween: [ "style", "${_Rectangle}", "width", '91px', { fromValue: '0px'}], position: 1701, duration: 299 },
            { id: "eid12840", tween: [ "transform", "${_au5}", "rotateZ", '360deg', { fromValue: '131deg'}], position: 250, duration: 1451, easing: "easeOutCirc" },
            { id: "eid12860", tween: [ "style", "${_au6}", "top", '361px', { fromValue: '361px'}], position: 1701, duration: 0 },
            { id: "eid1969", tween: [ "style", "${_iospercent_txt}", "opacity", '1', { fromValue: '0'}], position: 4160, duration: 411 },
            { id: "eid1107", tween: [ "style", "${_otherico_sym}", "clip", [0,12,32,0], { valueTemplate: 'rect(@@0@@px @@1@@px @@2@@px @@3@@px)', fromValue: [0,12,0,0]}], position: 2250, duration: 250, easing: "easeOutSine" },
            { id: "eid12834", tween: [ "style", "${_au1}", "opacity", '1', { fromValue: '0'}], position: 250, duration: 656, easing: "easeOutCirc" },
            { id: "eid4089", tween: [ "color", "${_nokia_txt}", "color", 'rgba(171,109,169,1.00)', { animationColorSpace: 'RGB', valueTemplate: undefined, fromValue: 'rgba(171,109,169,1.00)'}], position: 4983, duration: 0 },
            { id: "eid1109", tween: [ "style", "${_bbico_sym}", "clip", [0,13,56,0], { valueTemplate: 'rect(@@0@@px @@1@@px @@2@@px @@3@@px)', fromValue: [0,12,0,0]}], position: 2000, duration: 250, easing: "easeOutSine" },
            { id: "eid1971", tween: [ "style", "${_bb_txt}", "opacity", '1', { fromValue: '0'}], position: 4000, duration: 411 },
            { id: "eid1429", tween: [ "style", "${_header}", "clip", [0,433,31,0], { valueTemplate: 'rect(@@0@@px @@1@@px @@2@@px @@3@@px)', fromValue: [0,0,31,0]}], position: 2589, duration: 1160 },
            { id: "eid12862", tween: [ "style", "${_au5}", "top", '355px', { fromValue: '210px'}], position: 250, duration: 0 },
            { id: "eid13636", tween: [ "style", "${_au5}", "top", '356px', { fromValue: '355px'}], position: 1701, duration: 0 },
            { id: "eid4091", tween: [ "color", "${_apple_txt}", "color", 'rgba(83,179,151,1.00)', { animationColorSpace: 'RGB', valueTemplate: undefined, fromValue: 'rgba(83,179,151,1.00)'}], position: 4983, duration: 0 },
            { id: "eid12863", tween: [ "style", "${_au6}", "-webkit-transform-origin", [508.85,121.34], { valueTemplate: '@@0@@% @@1@@%', fromValue: [508.85,121.34]}], position: 1701, duration: 0 },
            { id: "eid27548", tween: [ "style", "${_au6}", "-moz-transform-origin", [508.85,121.34], { valueTemplate: '@@0@@% @@1@@%', fromValue: [508.85,121.34]}], position: 1701, duration: 0 },
            { id: "eid27549", tween: [ "style", "${_au6}", "-ms-transform-origin", [508.85,121.34], { valueTemplate: '@@0@@% @@1@@%', fromValue: [508.85,121.34]}], position: 1701, duration: 0 },
            { id: "eid27550", tween: [ "style", "${_au6}", "msTransformOrigin", [508.85,121.34], { valueTemplate: '@@0@@% @@1@@%', fromValue: [508.85,121.34]}], position: 1701, duration: 0 },
            { id: "eid27551", tween: [ "style", "${_au6}", "-o-transform-origin", [508.85,121.34], { valueTemplate: '@@0@@% @@1@@%', fromValue: [508.85,121.34]}], position: 1701, duration: 0 },
            { id: "eid4090", tween: [ "color", "${_bb_txt}", "color", 'rgba(207,204,109,1.00)', { animationColorSpace: 'RGB', valueTemplate: undefined, fromValue: 'rgba(207,204,109,1.00)'}], position: 4983, duration: 0 },
            { id: "eid12854", tween: [ "style", "${_au3}", "opacity", '1', { fromValue: '0'}], position: 250, duration: 388, easing: "easeOutCirc" },
            { id: "eid12839", tween: [ "style", "${_au5}", "-webkit-transform-origin", [516.53,78.09], { valueTemplate: '@@0@@% @@1@@%', fromValue: [310.72,113.32]}], position: 250, duration: 1451, easing: "easeOutCirc" },
            { id: "eid27552", tween: [ "style", "${_au5}", "-moz-transform-origin", [516.53,78.09], { valueTemplate: '@@0@@% @@1@@%', fromValue: [310.72,113.32]}], position: 250, duration: 1451, easing: "easeOutCirc" },
            { id: "eid27553", tween: [ "style", "${_au5}", "-ms-transform-origin", [516.53,78.09], { valueTemplate: '@@0@@% @@1@@%', fromValue: [310.72,113.32]}], position: 250, duration: 1451, easing: "easeOutCirc" },
            { id: "eid27554", tween: [ "style", "${_au5}", "msTransformOrigin", [516.53,78.09], { valueTemplate: '@@0@@% @@1@@%', fromValue: [310.72,113.32]}], position: 250, duration: 1451, easing: "easeOutCirc" },
            { id: "eid27555", tween: [ "style", "${_au5}", "-o-transform-origin", [516.53,78.09], { valueTemplate: '@@0@@% @@1@@%', fromValue: [310.72,113.32]}], position: 250, duration: 1451, easing: "easeOutCirc" },
            { id: "eid12832", tween: [ "style", "${_au1}", "top", '224px', { fromValue: '240.33px'}], position: 250, duration: 1451, easing: "easeOutCirc" },
            { id: "eid1963", tween: [ "style", "${_otherpercent_txt}", "opacity", '1', { fromValue: '0'}], position: 4572, duration: 411 },
            { id: "eid4092", tween: [ "color", "${_netfront_txt}", "color", 'rgba(215,145,63,1.00)', { animationColorSpace: 'RGB', valueTemplate: undefined, fromValue: 'rgba(215,145,63,1.00)'}], position: 4983, duration: 0 },
            { id: "eid12846", tween: [ "style", "${_au4}", "opacity", '1', { fromValue: '0'}], position: 250, duration: 500, easing: "easeOutCirc" },
            { id: "eid1431", tween: [ "style", "${_TextCopy}", "clip", [0,114,31,0], { valueTemplate: 'rect(@@0@@px @@1@@px @@2@@px @@3@@px)', fromValue: [0,0,31,0]}], position: 3365, duration: 250 },
            { id: "eid4093", tween: [ "color", "${_other_txt}", "color", 'rgba(117,70,139,1.00)', { animationColorSpace: 'RGB', valueTemplate: undefined, fromValue: 'rgba(117,70,139,1.00)'}], position: 4983, duration: 0 },
            { id: "eid12844", tween: [ "transform", "${_au6}", "rotateZ", '360deg', { fromValue: '445deg'}], position: 250, duration: 1451, easing: "easeOutCirc" },
            { id: "eid1939", tween: [ "style", "${_netfront_txt}", "opacity", '1', { fromValue: '0'}], position: 4411, duration: 411 },
            { id: "eid12856", tween: [ "style", "${_au3}", "top", '318px', { fromValue: '318px'}], position: 1701, duration: 0 },
            { id: "eid12852", tween: [ "transform", "${_au3}", "rotateZ", '0deg', { fromValue: '289deg'}], position: 250, duration: 1451, easing: "easeOutCirc" },
            { id: "eid12833", tween: [ "transform", "${_au1}", "rotateZ", '360deg', { fromValue: '153deg'}], position: 250, duration: 1451, easing: "easeOutCirc" },
            { id: "eid12859", tween: [ "style", "${_au6}", "left", '336px', { fromValue: '336px'}], position: 1701, duration: 0 },
            { id: "eid12837", tween: [ "transform", "${_au2}", "rotateZ", '0deg', { fromValue: '115deg'}], position: 250, duration: 1451, easing: "easeOutCirc" },
            { id: "eid1017", tween: [ "style", "${_Rectangle}", "height", '2px', { fromValue: '0px'}], position: 1701, duration: 299 },
            { id: "eid12855", tween: [ "style", "${_au3}", "left", '294px', { fromValue: '294px'}], position: 1701, duration: 0 },
            { id: "eid12848", tween: [ "style", "${_au4}", "-webkit-transform-origin", [346.53,133.67], { valueTemplate: '@@0@@% @@1@@%', fromValue: [346.53,133.67]}], position: 250, duration: 0, easing: "easeOutCirc" },
            { id: "eid27556", tween: [ "style", "${_au4}", "-moz-transform-origin", [346.53,133.67], { valueTemplate: '@@0@@% @@1@@%', fromValue: [346.53,133.67]}], position: 250, duration: 0, easing: "easeOutCirc" },
            { id: "eid27557", tween: [ "style", "${_au4}", "-ms-transform-origin", [346.53,133.67], { valueTemplate: '@@0@@% @@1@@%', fromValue: [346.53,133.67]}], position: 250, duration: 0, easing: "easeOutCirc" },
            { id: "eid27558", tween: [ "style", "${_au4}", "msTransformOrigin", [346.53,133.67], { valueTemplate: '@@0@@% @@1@@%', fromValue: [346.53,133.67]}], position: 250, duration: 0, easing: "easeOutCirc" },
            { id: "eid27559", tween: [ "style", "${_au4}", "-o-transform-origin", [346.53,133.67], { valueTemplate: '@@0@@% @@1@@%', fromValue: [346.53,133.67]}], position: 250, duration: 0, easing: "easeOutCirc" },
            { id: "eid12864", tween: [ "style", "${_au4}", "-webkit-transform-origin", [503.19,73.6], { valueTemplate: '@@0@@% @@1@@%', fromValue: [346.53,133.67]}], position: 1701, duration: 0 },
            { id: "eid27560", tween: [ "style", "${_au4}", "-moz-transform-origin", [503.19,73.6], { valueTemplate: '@@0@@% @@1@@%', fromValue: [346.53,133.67]}], position: 1701, duration: 0 },
            { id: "eid27561", tween: [ "style", "${_au4}", "-ms-transform-origin", [503.19,73.6], { valueTemplate: '@@0@@% @@1@@%', fromValue: [346.53,133.67]}], position: 1701, duration: 0 },
            { id: "eid27562", tween: [ "style", "${_au4}", "msTransformOrigin", [503.19,73.6], { valueTemplate: '@@0@@% @@1@@%', fromValue: [346.53,133.67]}], position: 1701, duration: 0 },
            { id: "eid27563", tween: [ "style", "${_au4}", "-o-transform-origin", [503.19,73.6], { valueTemplate: '@@0@@% @@1@@%', fromValue: [346.53,133.67]}], position: 1701, duration: 0 },
            { id: "eid1941", tween: [ "style", "${_opera_txt}", "opacity", '1', { fromValue: '0'}], position: 3749, duration: 411 },
            { id: "eid1947", tween: [ "style", "${_nokiapercent_txt}", "opacity", '1', { fromValue: '0'}], position: 3838, duration: 411 },
            { id: "eid12858", tween: [ "style", "${_au4}", "top", '329px', { fromValue: '329px'}], position: 1701, duration: 0 },
            { id: "eid12831", tween: [ "style", "${_au1}", "left", '267px', { fromValue: '248.1px'}], position: 250, duration: 1451, easing: "easeOutCirc" },
            { id: "eid1105", tween: [ "style", "${_appleico_sym}", "clip", [0,12,85,0], { valueTemplate: 'rect(@@0@@px @@1@@px @@2@@px @@3@@px)', fromValue: [0,12,0,0]}], position: 2250, duration: 250, easing: "easeOutSine" },
            { id: "eid12861", tween: [ "style", "${_au5}", "left", '321px', { fromValue: '232.84px'}], position: 250, duration: 0 },
            { id: "eid1967", tween: [ "style", "${_apple_txt}", "opacity", '1', { fromValue: '0'}], position: 4160, duration: 411 },
            { id: "eid12847", tween: [ "transform", "${_au4}", "rotateZ", '360deg', { fromValue: '74deg'}], position: 250, duration: 1451, easing: "easeOutCirc" },
            { id: "eid1943", tween: [ "style", "${_operapercent_txt}", "opacity", '1', { fromValue: '0'}], position: 3749, duration: 411 },
            { id: "eid1949", tween: [ "style", "${_other_txt}", "opacity", '1', { fromValue: '0'}], position: 4572, duration: 411 },
            { id: "eid12845", tween: [ "style", "${_au6}", "opacity", '1', { fromValue: '0'}], position: 250, duration: 388, easing: "easeOutCirc" },
            { id: "eid12867", tween: [ "style", "${_au1}", "-webkit-transform-origin", [50.13,55.41], { valueTemplate: '@@0@@% @@1@@%', fromValue: [50.13,55.41]}], position: 1701, duration: 0 },
            { id: "eid27564", tween: [ "style", "${_au1}", "-moz-transform-origin", [50.13,55.41], { valueTemplate: '@@0@@% @@1@@%', fromValue: [50.13,55.41]}], position: 1701, duration: 0 },
            { id: "eid27565", tween: [ "style", "${_au1}", "-ms-transform-origin", [50.13,55.41], { valueTemplate: '@@0@@% @@1@@%', fromValue: [50.13,55.41]}], position: 1701, duration: 0 },
            { id: "eid27566", tween: [ "style", "${_au1}", "msTransformOrigin", [50.13,55.41], { valueTemplate: '@@0@@% @@1@@%', fromValue: [50.13,55.41]}], position: 1701, duration: 0 },
            { id: "eid27567", tween: [ "style", "${_au1}", "-o-transform-origin", [50.13,55.41], { valueTemplate: '@@0@@% @@1@@%', fromValue: [50.13,55.41]}], position: 1701, duration: 0 },
            { id: "eid10043", tween: [ "style", "${_androidico_sym2}", "clip", [0,13,73,0], { valueTemplate: 'rect(@@0@@px @@1@@px @@2@@px @@3@@px)', fromValue: [0,12,0,0]}], position: 2120, duration: 250, easing: "easeOutSine" },
            { id: "eid1973", tween: [ "style", "${_netfrontpercent_txt}", "opacity", '1', { fromValue: '0'}], position: 4411, duration: 411 },
            { id: "eid1113", tween: [ "style", "${_operaico_sym}", "clip", [0,12,54,0], { valueTemplate: 'rect(@@0@@px @@1@@px @@2@@px @@3@@px)', fromValue: [0,12,0,0]}], position: 2000, duration: 250, easing: "easeOutSine" },
            { id: "eid12841", tween: [ "style", "${_au5}", "opacity", '1', { fromValue: '0'}], position: 250, duration: 656, easing: "easeOutCirc" },
            { id: "eid12853", tween: [ "style", "${_au3}", "-webkit-transform-origin", [279.17,147.48], { valueTemplate: '@@0@@% @@1@@%', fromValue: [279.17,147.48]}], position: 250, duration: 0, easing: "easeOutCirc" },
            { id: "eid27568", tween: [ "style", "${_au3}", "-moz-transform-origin", [279.17,147.48], { valueTemplate: '@@0@@% @@1@@%', fromValue: [279.17,147.48]}], position: 250, duration: 0, easing: "easeOutCirc" },
            { id: "eid27569", tween: [ "style", "${_au3}", "-ms-transform-origin", [279.17,147.48], { valueTemplate: '@@0@@% @@1@@%', fromValue: [279.17,147.48]}], position: 250, duration: 0, easing: "easeOutCirc" },
            { id: "eid27570", tween: [ "style", "${_au3}", "msTransformOrigin", [279.17,147.48], { valueTemplate: '@@0@@% @@1@@%', fromValue: [279.17,147.48]}], position: 250, duration: 0, easing: "easeOutCirc" },
            { id: "eid27571", tween: [ "style", "${_au3}", "-o-transform-origin", [279.17,147.48], { valueTemplate: '@@0@@% @@1@@%', fromValue: [279.17,147.48]}], position: 250, duration: 0, easing: "easeOutCirc" },
            { id: "eid12865", tween: [ "style", "${_au3}", "-webkit-transform-origin", [476,102.49], { valueTemplate: '@@0@@% @@1@@%', fromValue: [279.17,147.48]}], position: 1701, duration: 0 },
            { id: "eid27572", tween: [ "style", "${_au3}", "-moz-transform-origin", [476,102.49], { valueTemplate: '@@0@@% @@1@@%', fromValue: [279.17,147.48]}], position: 1701, duration: 0 },
            { id: "eid27573", tween: [ "style", "${_au3}", "-ms-transform-origin", [476,102.49], { valueTemplate: '@@0@@% @@1@@%', fromValue: [279.17,147.48]}], position: 1701, duration: 0 },
            { id: "eid27574", tween: [ "style", "${_au3}", "msTransformOrigin", [476,102.49], { valueTemplate: '@@0@@% @@1@@%', fromValue: [279.17,147.48]}], position: 1701, duration: 0 },
            { id: "eid27575", tween: [ "style", "${_au3}", "-o-transform-origin", [476,102.49], { valueTemplate: '@@0@@% @@1@@%', fromValue: [279.17,147.48]}], position: 1701, duration: 0 }         ]
      }
   }
},
"boltico_sym": {
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
      rect: [2.99996649414,-0.50001898082999,2,32],
      id: 'Rectangle2Copy5',
      stroke: [0,'rgba(0, 0, 0, 0)','none'],
      type: 'rect',
      fill: ['rgba(88,88,90,1.00)',null]
   },
   {
      rect: [1.36107,30,8,14],
      id: 'bolt_ico',
      transform: [[0,0],[0,0],[0],[1,1]],
      type: 'image',
      fill: ['rgba(0,0,0,0)','images/bolt_ico.png']
   }],
   symbolInstances: [
   ]
   },
   states: {
      "Base State": {
         "${symbolSelector}": [
            ["style", "height", '84.499983px'],
            ["style", "width", '12px']
         ],
         "${_bolt_ico}": [
            ["style", "left", '1.36px'],
            ["style", "top", '30px']
         ],
         "${_Rectangle2Copy5}": [
            ["color", "background-color", 'rgba(88,88,90,1.00)'],
            ["style", "height", '32px'],
            ["style", "top", '-0.5px'],
            ["style", "left", '3px'],
            ["style", "width", '2px']
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
         ]
      }
   }
},
"androidico_sym": {
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
      rect: [2.99996649414,-0.50001898082999,2,24],
      id: 'Rectangle2Copy5',
      stroke: [0,'rgba(0, 0, 0, 0)','none'],
      type: 'rect',
      fill: ['rgba(88,88,90,1.00)',null]
   },
   {
      rect: [-2,22.69517,13,15],
      id: 'android_ico',
      transform: [[0,0],[0,0],[0],[1,1]],
      type: 'image',
      fill: ['rgba(0,0,0,0)','images/android_ico.png']
   }],
   symbolInstances: [
   ]
   },
   states: {
      "Base State": {
         "${_android_ico}": [
            ["style", "left", '-2px'],
            ["style", "top", '22.69px']
         ],
         "${_Rectangle2Copy5}": [
            ["color", "background-color", 'rgba(88,88,90,1.00)'],
            ["style", "height", '24px'],
            ["style", "top", '-0.5px'],
            ["style", "left", '3px'],
            ["style", "width", '2px']
         ],
         "${symbolSelector}": [
            ["style", "height", '84.499983px'],
            ["style", "width", '12px']
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
         ]
      }
   }
},
"samsungico_sym": {
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
      rect: [5.10153149414,-0.50001898082999,2,46],
      id: 'Rectangle2',
      stroke: [0,'rgba(0, 0, 0, 0)','none'],
      type: 'rect',
      fill: ['rgba(88,88,90,1.00)',null]
   },
   {
      rect: [1,40.99998,10,21],
      id: 'samsung_ico2',
      transform: [[0,0]],
      type: 'image',
      fill: ['rgba(0,0,0,0)','images/samsung_ico2.png']
   }],
   symbolInstances: [
   ]
   },
   states: {
      "Base State": {
         "${_Rectangle2}": [
            ["color", "background-color", 'rgba(88,88,90,1.00)'],
            ["style", "height", '46px'],
            ["style", "top", '-0.5px'],
            ["style", "left", '5.1px'],
            ["style", "width", '2px']
         ],
         "${_samsung_ico2}": [
            ["style", "left", '1px'],
            ["style", "top", '40.99px']
         ],
         "${symbolSelector}": [
            ["style", "height", '53.499982px'],
            ["style", "width", '12px']
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
         ]
      }
   }
},
"eugraph_sym": {
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
      id: 'operaico_sym',
      rect: [310.250005,377.333308,0,0],
      type: 'rect',
      transform: [[0,0]]
   },
   {
      id: 'nokiaico_sym',
      rect: [326.500019,378.500018,0,0],
      type: 'rect',
      transform: [[0,0]]
   },
   {
      id: 'bbico_sym',
      rect: [269.055547,378.500018,0,0],
      type: 'rect',
      transform: [[0,0]]
   },
   {
      id: 'appleico_sym',
      rect: [285.19444,378.333328,0,0],
      type: 'rect',
      transform: [[0,0]]
   },
   {
      id: 'otherico_sym',
      rect: [337.500004,379.500018,0,0],
      type: 'rect',
      transform: {}
   },
   {
      rect: [586.78122,257,433.80078125,31],
      transform: [[0,0]],
      id: 'header',
      text: 'Mobile Browser Marketshare',
      font: ['Armata',24,'rgba(65,64,66,1.00)','normal','none',''],
      type: 'text'
   },
   {
      rect: [586.78122,288.00001,433.80078125,31],
      transform: [[0,0]],
      id: 'TextCopy',
      text: 'Europe',
      font: ['Armata',24,'rgba(144,144,144,1.00)','normal','none',''],
      type: 'text'
   },
   {
      font: ['Armata',13,'rgba(63,215,95,1.00)','normal','none','normal'],
      rect: [587,331,91,16],
      align: 'auto',
      opacity: 1,
      id: 'opera_txt',
      text: 'BlackBerry',
      transform: {},
      type: 'text'
   },
   {
      font: ['Armata',13,'rgba(144,144,144,1.00)','normal','none','normal'],
      rect: [587,347,91,16],
      align: 'auto',
      opacity: 1,
      id: 'operapercent_txt',
      text: 'xxx',
      transform: [[0,0]],
      type: 'text'
   },
   {
      font: ['Armata',13,'rgba(144,144,144,1.00)','normal','none','normal'],
      rect: [587,392.99999,91,16],
      align: 'auto',
      opacity: 1,
      id: 'nokiapercent_txt',
      text: 'xxx',
      transform: [[0,0]],
      type: 'text'
   },
   {
      font: ['Armata',13,'rgba(63,215,95,1.00)','normal','none','normal'],
      rect: [587,376.99999,91,16],
      align: 'auto',
      opacity: 1,
      id: 'nokia_txt',
      text: 'iOS',
      transform: [[0,0]],
      type: 'text'
   },
   {
      font: ['Armata',13,'rgba(63,215,95,1.00)','normal','none','normal'],
      rect: [587,420.99999,91,16],
      align: 'auto',
      opacity: 1,
      id: 'bb_txt',
      text: 'Android',
      transform: [[0,0]],
      type: 'text'
   },
   {
      font: ['Armata',13,'rgba(144,144,144,1.00)','normal','none','normal'],
      rect: [587,436.99999,91,16],
      align: 'auto',
      opacity: 1,
      id: 'bbpercent_txt',
      text: 'xxx',
      transform: [[0,0]],
      type: 'text'
   },
   {
      font: ['Armata',13,'rgba(144,144,144,1.00)','normal','none','normal'],
      rect: [722.85937,436.99999,91,16],
      align: 'auto',
      opacity: 1,
      id: 'otherpercent_txt',
      text: 'xxx',
      transform: [[0,0]],
      type: 'text'
   },
   {
      font: ['Armata',13,'rgba(63,215,95,1.00)','normal','none','normal'],
      rect: [722.85937,420.99999,91,16],
      align: 'auto',
      opacity: 1,
      id: 'other_txt',
      text: 'Other',
      transform: [[0,0]],
      type: 'text'
   },
   {
      font: ['Armata',13,'rgba(63,215,95,1.00)','normal','none','normal'],
      rect: [722.85937,376.99999,91,16],
      align: 'auto',
      opacity: 1,
      id: 'netfront_txt',
      text: 'Nokia',
      transform: [[0,0]],
      type: 'text'
   },
   {
      font: ['Armata',13,'rgba(144,144,144,1.00)','normal','none','normal'],
      rect: [722.85937,392.99999,91,16],
      align: 'auto',
      opacity: 1,
      id: 'netfrontpercent_txt',
      text: 'xxx',
      transform: [[0,0]],
      type: 'text'
   },
   {
      font: ['Armata',13,'rgba(144,144,144,1.00)','normal','none','normal'],
      rect: [722.85937,347,91,16],
      align: 'auto',
      opacity: 1,
      id: 'iospercent_txt',
      text: 'xxx',
      transform: [[0,0]],
      type: 'text'
   },
   {
      font: ['Armata',13,'rgba(63,215,95,1.00)','normal','none','normal'],
      rect: [722.85937,331,91,16],
      align: 'auto',
      opacity: 1,
      id: 'apple_txt',
      text: 'Opera',
      transform: [[0,0]],
      type: 'text'
   },
   {
      id: 'androidico_sym',
      rect: [299.97101881836,378.65692138672,0,0],
      type: 'rect',
      transform: [[0,0]]
   },
   {
      rect: [268.99999,223.00001,305,155],
      id: 'eu1',
      transform: [[0,0]],
      type: 'image',
      fill: ['rgba(0,0,0,0)','images/eu1.png']
   },
   {
      rect: [268.99999,223.00001,91,128],
      id: 'eu2',
      transform: [[0,0]],
      type: 'image',
      fill: ['rgba(0,0,0,0)','images/eu2.png']
   },
   {
      rect: [268.99999,223.00001,72,108],
      id: 'eu3',
      transform: [[0,0]],
      type: 'image',
      fill: ['rgba(0,0,0,0)','images/eu3.png']
   },
   {
      rect: [268.99999,223.00001,42,78],
      id: 'eu4',
      transform: [[0,0]],
      type: 'image',
      fill: ['rgba(0,0,0,0)','images/eu4.png']
   },
   {
      rect: [268.99999,223.00001,35,63],
      id: 'eu5',
      transform: [[0,0]],
      type: 'image',
      fill: ['rgba(0,0,0,0)','images/eu5.png']
   },
   {
      rect: [268.99999,223.00001,28,47],
      id: 'eu6',
      transform: [[0,0]],
      type: 'image',
      fill: ['rgba(0,0,0,0)','images/eu6.png']
   },
   {
      transform: [[0,0]],
      rect: [264.33331298828,377.49997901917,91.360687255859,1.904296875],
      id: 'Rectangle',
      stroke: [0,'rgba(0, 0, 0, 0)','none'],
      type: 'rect',
      fill: ['rgba(88,89,90,1.00)',null]
   }],
   symbolInstances: [
   {
      id: 'operaico_sym',
      symbolName: 'operaico_sym'
   },
   {
      id: 'nokiaico_sym',
      symbolName: 'nokiaico_sy'
   },
   {
      id: 'androidico_sym',
      symbolName: 'androidico_sym'
   },
   {
      id: 'appleico_sym',
      symbolName: 'appleico_sym'
   },
   {
      id: 'bbico_sym',
      symbolName: 'bbico_sym'
   },
   {
      id: 'otherico_sym',
      symbolName: 'otherico_sym'
   }   ]
   },
   states: {
      "Base State": {
         "${_bbpercent_txt}": [
            ["style", "top", '436.99px'],
            ["style", "width", '91px'],
            ["style", "height", '16px'],
            ["color", "color", 'rgba(144,144,144,1.00)'],
            ["style", "opacity", '0'],
            ["style", "left", '587px'],
            ["style", "font-size", '13px']
         ],
         "${_netfront_txt}": [
            ["style", "top", '376.99px'],
            ["style", "font-size", '13px'],
            ["color", "color", 'rgba(215,145,63,1.00)'],
            ["style", "height", '16px'],
            ["style", "opacity", '0'],
            ["style", "left", '722.85px'],
            ["style", "width", '91px']
         ],
         "${_otherico_sym}": [
            ["style", "clip", [0,12,0,0], {valueTemplate:'rect(@@0@@px @@1@@px @@2@@px @@3@@px)'} ]
         ],
         "${_nokiapercent_txt}": [
            ["style", "top", '392.99px'],
            ["style", "font-size", '13px'],
            ["color", "color", 'rgba(144,144,144,1.00)'],
            ["style", "height", '16px'],
            ["style", "opacity", '0'],
            ["style", "left", '587px'],
            ["style", "width", '91px']
         ],
         "${_appleico_sym}": [
            ["style", "top", '378.34px'],
            ["style", "clip", [0,12,0,0], {valueTemplate:'rect(@@0@@px @@1@@px @@2@@px @@3@@px)'} ],
            ["style", "left", '285.2px']
         ],
         "${_netfrontpercent_txt}": [
            ["style", "top", '392.99px'],
            ["style", "width", '91px'],
            ["style", "height", '16px'],
            ["color", "color", 'rgba(144,144,144,1.00)'],
            ["style", "opacity", '0'],
            ["style", "left", '722.85px'],
            ["style", "font-size", '13px']
         ],
         "${_eu4}": [
            ["style", "-webkit-transform-origin", [346.53,133.67], {valueTemplate:'@@0@@% @@1@@%'} ],
            ["style", "-moz-transform-origin", [346.53,133.67],{valueTemplate:'@@0@@% @@1@@%'}],
            ["style", "-ms-transform-origin", [346.53,133.67],{valueTemplate:'@@0@@% @@1@@%'}],
            ["style", "msTransformOrigin", [346.53,133.67],{valueTemplate:'@@0@@% @@1@@%'}],
            ["style", "-o-transform-origin", [346.53,133.67],{valueTemplate:'@@0@@% @@1@@%'}],
            ["transform", "rotateZ", '74deg'],
            ["style", "opacity", '0'],
            ["style", "left", '311px'],
            ["style", "top", '300px']
         ],
         "${symbolSelector}": [
            ["style", "height", '149px'],
            ["style", "width", '282px']
         ],
         "${_other_txt}": [
            ["style", "top", '420.99px'],
            ["style", "width", '91px'],
            ["style", "height", '16px'],
            ["color", "color", 'rgba(117,70,139,1.00)'],
            ["style", "opacity", '0'],
            ["style", "left", '722.85px'],
            ["style", "font-size", '13px']
         ],
         "${_Rectangle}": [
            ["style", "height", '0px'],
            ["color", "background-color", 'rgba(88,89,90,1.00)'],
            ["style", "left", '264.33px'],
            ["style", "width", '0px']
         ],
         "${_operapercent_txt}": [
            ["style", "top", '347px'],
            ["style", "width", '91px'],
            ["style", "height", '16px'],
            ["color", "color", 'rgba(144,144,144,1.00)'],
            ["style", "opacity", '0'],
            ["style", "left", '587px'],
            ["style", "font-size", '13px']
         ],
         "${_otherpercent_txt}": [
            ["style", "top", '436.99px'],
            ["style", "font-size", '13px'],
            ["color", "color", 'rgba(144,144,144,1.00)'],
            ["style", "height", '16px'],
            ["style", "opacity", '0'],
            ["style", "left", '722.85px'],
            ["style", "width", '91px']
         ],
         "${_nokiaico_sym}": [
            ["style", "top", '378.5px'],
            ["style", "clip", [0,12,0,0], {valueTemplate:'rect(@@0@@px @@1@@px @@2@@px @@3@@px)'} ],
            ["style", "left", '326.5px']
         ],
         "${_eu3}": [
            ["style", "-webkit-transform-origin", [279.17,147.48], {valueTemplate:'@@0@@% @@1@@%'} ],
            ["style", "-moz-transform-origin", [279.17,147.48],{valueTemplate:'@@0@@% @@1@@%'}],
            ["style", "-ms-transform-origin", [279.17,147.48],{valueTemplate:'@@0@@% @@1@@%'}],
            ["style", "msTransformOrigin", [279.17,147.48],{valueTemplate:'@@0@@% @@1@@%'}],
            ["style", "-o-transform-origin", [279.17,147.48],{valueTemplate:'@@0@@% @@1@@%'}],
            ["transform", "rotateZ", '289deg'],
            ["style", "opacity", '0'],
            ["style", "left", '296.99px'],
            ["style", "top", '270px']
         ],
         "${_androidico_sym}": [
            ["style", "top", '378.66px'],
            ["style", "clip", [0,12,0,0], {valueTemplate:'rect(@@0@@px @@1@@px @@2@@px @@3@@px)'} ],
            ["style", "left", '299.97px']
         ],
         "${_bbico_sym}": [
            ["style", "top", '378.5px'],
            ["style", "clip", [0,12,0,0], {valueTemplate:'rect(@@0@@px @@1@@px @@2@@px @@3@@px)'} ],
            ["style", "left", '269.06px']
         ],
         "${_opera_txt}": [
            ["style", "top", '331px'],
            ["style", "font-size", '13px'],
            ["color", "color", 'rgba(63,215,95,1.00)'],
            ["style", "height", '16px'],
            ["style", "opacity", '0'],
            ["style", "left", '587px'],
            ["style", "width", '91px']
         ],
         "${_eu2}": [
            ["style", "-webkit-transform-origin", [160.61,118.83], {valueTemplate:'@@0@@% @@1@@%'} ],
            ["style", "-moz-transform-origin", [160.61,118.83],{valueTemplate:'@@0@@% @@1@@%'}],
            ["style", "-ms-transform-origin", [160.61,118.83],{valueTemplate:'@@0@@% @@1@@%'}],
            ["style", "msTransformOrigin", [160.61,118.83],{valueTemplate:'@@0@@% @@1@@%'}],
            ["style", "-o-transform-origin", [160.61,118.83],{valueTemplate:'@@0@@% @@1@@%'}],
            ["transform", "rotateZ", '115deg'],
            ["style", "opacity", '0'],
            ["style", "left", '198.48px'],
            ["style", "top", '205.55px']
         ],
         "${_operaico_sym}": [
            ["style", "top", '377.34px'],
            ["style", "clip", [0,12,0,0], {valueTemplate:'rect(@@0@@px @@1@@px @@2@@px @@3@@px)'} ],
            ["style", "left", '310.25px']
         ],
         "${_bb_txt}": [
            ["style", "top", '420.99px'],
            ["style", "font-size", '13px'],
            ["color", "color", 'rgba(207,204,109,1.00)'],
            ["style", "height", '16px'],
            ["style", "opacity", '0'],
            ["style", "left", '587px'],
            ["style", "width", '91px']
         ],
         "${_eu5}": [
            ["style", "-webkit-transform-origin", [310.72,113.32], {valueTemplate:'@@0@@% @@1@@%'} ],
            ["style", "-moz-transform-origin", [310.72,113.32],{valueTemplate:'@@0@@% @@1@@%'}],
            ["style", "-ms-transform-origin", [310.72,113.32],{valueTemplate:'@@0@@% @@1@@%'}],
            ["style", "msTransformOrigin", [310.72,113.32],{valueTemplate:'@@0@@% @@1@@%'}],
            ["style", "-o-transform-origin", [310.72,113.32],{valueTemplate:'@@0@@% @@1@@%'}],
            ["transform", "rotateZ", '131deg'],
            ["style", "opacity", '0'],
            ["style", "left", '266.99px'],
            ["style", "top", '225px']
         ],
         "${_header}": [
            ["style", "top", '257px'],
            ["color", "color", 'rgba(65,64,66,1)'],
            ["style", "height", '31px'],
            ["style", "font-family", 'Armata'],
            ["style", "left", '586.78px'],
            ["style", "clip", [0,0,31,0], {valueTemplate:'rect(@@0@@px @@1@@px @@2@@px @@3@@px)'} ]
         ],
         "${_iospercent_txt}": [
            ["style", "top", '347px'],
            ["style", "font-size", '13px'],
            ["color", "color", 'rgba(144,144,144,1.00)'],
            ["style", "height", '16px'],
            ["style", "opacity", '0'],
            ["style", "left", '722.85px'],
            ["style", "width", '91px']
         ],
         "${_eu6}": [
            ["style", "-webkit-transform-origin", [270.62,96.02], {valueTemplate:'@@0@@% @@1@@%'} ],
            ["style", "-moz-transform-origin", [270.62,96.02],{valueTemplate:'@@0@@% @@1@@%'}],
            ["style", "-ms-transform-origin", [270.62,96.02],{valueTemplate:'@@0@@% @@1@@%'}],
            ["style", "msTransformOrigin", [270.62,96.02],{valueTemplate:'@@0@@% @@1@@%'}],
            ["style", "-o-transform-origin", [270.62,96.02],{valueTemplate:'@@0@@% @@1@@%'}],
            ["transform", "rotateZ", '445deg'],
            ["style", "opacity", '0'],
            ["style", "left", '337.99px'],
            ["style", "top", '333px']
         ],
         "${_eu1}": [
            ["style", "-webkit-transform-origin", [50.21,100.51], {valueTemplate:'@@0@@% @@1@@%'} ],
            ["style", "-moz-transform-origin", [50.21,100.51],{valueTemplate:'@@0@@% @@1@@%'}],
            ["style", "-ms-transform-origin", [50.21,100.51],{valueTemplate:'@@0@@% @@1@@%'}],
            ["style", "msTransformOrigin", [50.21,100.51],{valueTemplate:'@@0@@% @@1@@%'}],
            ["style", "-o-transform-origin", [50.21,100.51],{valueTemplate:'@@0@@% @@1@@%'}],
            ["transform", "rotateZ", '153deg'],
            ["style", "opacity", '0'],
            ["style", "left", '282.26px'],
            ["style", "top", '255.33px']
         ],
         "${_nokia_txt}": [
            ["style", "top", '376.99px'],
            ["style", "width", '91px'],
            ["style", "height", '16px'],
            ["color", "color", 'rgba(171,109,169,1.00)'],
            ["style", "opacity", '0'],
            ["style", "left", '587px'],
            ["style", "font-size", '13px']
         ],
         "${_TextCopy}": [
            ["style", "top", '288.01px'],
            ["color", "color", 'rgba(144,144,144,1.00)'],
            ["style", "height", '31px'],
            ["style", "font-family", 'Armata'],
            ["style", "left", '586.78px'],
            ["style", "clip", [0,0,31,0], {valueTemplate:'rect(@@0@@px @@1@@px @@2@@px @@3@@px)'} ]
         ],
         "${_apple_txt}": [
            ["style", "top", '331px'],
            ["style", "width", '91px'],
            ["style", "height", '16px'],
            ["color", "color", 'rgba(83,179,151,1.00)'],
            ["style", "opacity", '0'],
            ["style", "left", '722.85px'],
            ["style", "font-size", '13px']
         ]
      }
   },
   timelines: {
      "Default Timeline": {
         fromState: "Base State",
         toState: "",
         duration: 18014,
         autoPlay: false,
         labels: {
            "play": 250
         },
         timeline: [
            { id: "eid8598", tween: [ "style", "${_androidico_sym}", "clip", [0,13,73,0], { valueTemplate: 'rect(@@0@@px @@1@@px @@2@@px @@3@@px)', fromValue: [0,12,0,0]}], position: 2000, duration: 250, easing: "easeOutSine" },
            { id: "eid1945", tween: [ "style", "${_bbpercent_txt}", "opacity", '1', { fromValue: '0'}], position: 4000, duration: 411 },
            { id: "eid15209", tween: [ "style", "${_eu5}", "top", '314.99px', { fromValue: '223px'}], position: 250, duration: 0 },
            { id: "eid15183", tween: [ "style", "${_eu2}", "left", '283px', { fromValue: '198.48px'}], position: 250, duration: 1451, easing: "easeOutCirc" },
            { id: "eid1965", tween: [ "style", "${_nokia_txt}", "opacity", '1', { fromValue: '0'}], position: 3838, duration: 411 },
            { id: "eid1939", tween: [ "style", "${_netfront_txt}", "opacity", '1', { fromValue: '0'}], position: 4411, duration: 411 },
            { id: "eid15212", tween: [ "style", "${_eu6}", "-webkit-transform-origin", [270.62,96.02], { valueTemplate: '@@0@@% @@1@@%', fromValue: [270.62,96.02]}], position: 1701, duration: 0 },
            { id: "eid27576", tween: [ "style", "${_eu6}", "-moz-transform-origin", [270.62,96.02], { valueTemplate: '@@0@@% @@1@@%', fromValue: [270.62,96.02]}], position: 1701, duration: 0 },
            { id: "eid27577", tween: [ "style", "${_eu6}", "-ms-transform-origin", [270.62,96.02], { valueTemplate: '@@0@@% @@1@@%', fromValue: [270.62,96.02]}], position: 1701, duration: 0 },
            { id: "eid27578", tween: [ "style", "${_eu6}", "msTransformOrigin", [270.62,96.02], { valueTemplate: '@@0@@% @@1@@%', fromValue: [270.62,96.02]}], position: 1701, duration: 0 },
            { id: "eid27579", tween: [ "style", "${_eu6}", "-o-transform-origin", [270.62,96.02], { valueTemplate: '@@0@@% @@1@@%', fromValue: [270.62,96.02]}], position: 1701, duration: 0 },
            { id: "eid15180", tween: [ "style", "${_eu1}", "top", '223px', { fromValue: '255.33px'}], position: 250, duration: 1451, easing: "easeOutCirc" },
            { id: "eid1107", tween: [ "style", "${_otherico_sym}", "clip", [0,12,32,0], { valueTemplate: 'rect(@@0@@px @@1@@px @@2@@px @@3@@px)', fromValue: [0,12,0,0]}], position: 2250, duration: 250, easing: "easeOutSine" },
            { id: "eid15182", tween: [ "style", "${_eu1}", "opacity", '1', { fromValue: '0'}], position: 250, duration: 656, easing: "easeOutCirc" },
            { id: "eid4093", tween: [ "color", "${_other_txt}", "color", 'rgba(117,70,139,1.00)', { animationColorSpace: 'RGB', valueTemplate: undefined, fromValue: 'rgba(117,70,139,1.00)'}], position: 4983, duration: 0 },
            { id: "eid1109", tween: [ "style", "${_bbico_sym}", "clip", [0,13,56,0], { valueTemplate: 'rect(@@0@@px @@1@@px @@2@@px @@3@@px)', fromValue: [0,12,0,0]}], position: 2000, duration: 250, easing: "easeOutSine" },
            { id: "eid1971", tween: [ "style", "${_bb_txt}", "opacity", '1', { fromValue: '0'}], position: 4000, duration: 411 },
            { id: "eid1429", tween: [ "style", "${_header}", "clip", [0,433,31,0], { valueTemplate: 'rect(@@0@@px @@1@@px @@2@@px @@3@@px)', fromValue: [0,0,31,0]}], position: 2589, duration: 1160 },
            { id: "eid15200", tween: [ "transform", "${_eu4}", "rotateZ", '360deg', { fromValue: '74deg'}], position: 250, duration: 1451, easing: "easeOutCirc" },
            { id: "eid15207", tween: [ "style", "${_eu6}", "top", '331px', { fromValue: '333px'}], position: 1701, duration: 0 },
            { id: "eid16081", tween: [ "style", "${_eu6}", "top", '331px', { fromValue: '331px'}], position: 4983, duration: 0 },
            { id: "eid16370", tween: [ "style", "${_eu6}", "top", '333px', { fromValue: '331px'}], position: 18014, duration: 0 },
            { id: "eid1947", tween: [ "style", "${_nokiapercent_txt}", "opacity", '1', { fromValue: '0'}], position: 3838, duration: 411 },
            { id: "eid15181", tween: [ "transform", "${_eu1}", "rotateZ", '360deg', { fromValue: '153deg'}], position: 250, duration: 1451, easing: "easeOutCirc" },
            { id: "eid15198", tween: [ "style", "${_eu4}", "opacity", '1', { fromValue: '0'}], position: 250, duration: 500, easing: "easeOutCirc" },
            { id: "eid15203", tween: [ "transform", "${_eu3}", "rotateZ", '0deg', { fromValue: '289deg'}], position: 250, duration: 1451, easing: "easeOutCirc" },
            { id: "eid15185", tween: [ "transform", "${_eu2}", "rotateZ", '0deg', { fromValue: '115deg'}], position: 250, duration: 1451, easing: "easeOutCirc" },
            { id: "eid15196", tween: [ "transform", "${_eu6}", "rotateZ", '360deg', { fromValue: '445deg'}], position: 250, duration: 1451, easing: "easeOutCirc" },
            { id: "eid15201", tween: [ "style", "${_eu3}", "opacity", '1', { fromValue: '0'}], position: 250, duration: 388, easing: "easeOutCirc" },
            { id: "eid15195", tween: [ "transform", "${_eu5}", "rotateZ", '360deg', { fromValue: '131deg'}], position: 250, duration: 1451, easing: "easeOutCirc" },
            { id: "eid4092", tween: [ "color", "${_netfront_txt}", "color", 'rgba(215,145,63,1.00)', { animationColorSpace: 'RGB', valueTemplate: undefined, fromValue: 'rgba(215,145,63,1.00)'}], position: 4983, duration: 0 },
            { id: "eid4091", tween: [ "color", "${_apple_txt}", "color", 'rgba(83,179,151,1.00)', { animationColorSpace: 'RGB', valueTemplate: undefined, fromValue: 'rgba(83,179,151,1.00)'}], position: 4983, duration: 0 },
            { id: "eid15184", tween: [ "style", "${_eu2}", "top", '249.99px', { fromValue: '205.55px'}], position: 250, duration: 1451, easing: "easeOutCirc" },
            { id: "eid15194", tween: [ "style", "${_eu5}", "-webkit-transform-origin", [275.63,89.16], { valueTemplate: '@@0@@% @@1@@%', fromValue: [310.72,113.32]}], position: 250, duration: 1451, easing: "easeOutCirc" },
            { id: "eid27580", tween: [ "style", "${_eu5}", "-moz-transform-origin", [275.63,89.16], { valueTemplate: '@@0@@% @@1@@%', fromValue: [310.72,113.32]}], position: 250, duration: 1451, easing: "easeOutCirc" },
            { id: "eid27581", tween: [ "style", "${_eu5}", "-ms-transform-origin", [275.63,89.16], { valueTemplate: '@@0@@% @@1@@%', fromValue: [310.72,113.32]}], position: 250, duration: 1451, easing: "easeOutCirc" },
            { id: "eid27582", tween: [ "style", "${_eu5}", "msTransformOrigin", [275.63,89.16], { valueTemplate: '@@0@@% @@1@@%', fromValue: [310.72,113.32]}], position: 250, duration: 1451, easing: "easeOutCirc" },
            { id: "eid27583", tween: [ "style", "${_eu5}", "-o-transform-origin", [275.63,89.16], { valueTemplate: '@@0@@% @@1@@%', fromValue: [310.72,113.32]}], position: 250, duration: 1451, easing: "easeOutCirc" },
            { id: "eid4089", tween: [ "color", "${_nokia_txt}", "color", 'rgba(171,109,169,1.00)', { animationColorSpace: 'RGB', valueTemplate: undefined, fromValue: 'rgba(171,109,169,1.00)'}], position: 4983, duration: 0 },
            { id: "eid1969", tween: [ "style", "${_iospercent_txt}", "opacity", '1', { fromValue: '0'}], position: 4160, duration: 411 },
            { id: "eid15215", tween: [ "style", "${_eu2}", "-webkit-transform-origin", [160.61,118.83], { valueTemplate: '@@0@@% @@1@@%', fromValue: [160.61,118.83]}], position: 1701, duration: 0 },
            { id: "eid27584", tween: [ "style", "${_eu2}", "-moz-transform-origin", [160.61,118.83], { valueTemplate: '@@0@@% @@1@@%', fromValue: [160.61,118.83]}], position: 1701, duration: 0 },
            { id: "eid27585", tween: [ "style", "${_eu2}", "-ms-transform-origin", [160.61,118.83], { valueTemplate: '@@0@@% @@1@@%', fromValue: [160.61,118.83]}], position: 1701, duration: 0 },
            { id: "eid27586", tween: [ "style", "${_eu2}", "msTransformOrigin", [160.61,118.83], { valueTemplate: '@@0@@% @@1@@%', fromValue: [160.61,118.83]}], position: 1701, duration: 0 },
            { id: "eid27587", tween: [ "style", "${_eu2}", "-o-transform-origin", [160.61,118.83], { valueTemplate: '@@0@@% @@1@@%', fromValue: [160.61,118.83]}], position: 1701, duration: 0 },
            { id: "eid1017", tween: [ "style", "${_Rectangle}", "height", '2px', { fromValue: '0px'}], position: 1701, duration: 299 },
            { id: "eid15197", tween: [ "style", "${_eu6}", "opacity", '1', { fromValue: '0'}], position: 250, duration: 388, easing: "easeOutCirc" },
            { id: "eid15214", tween: [ "style", "${_eu3}", "-webkit-transform-origin", [172.35,109.56], { valueTemplate: '@@0@@% @@1@@%', fromValue: [279.17,147.48]}], position: 250, duration: 0 },
            { id: "eid27588", tween: [ "style", "${_eu3}", "-moz-transform-origin", [172.35,109.56], { valueTemplate: '@@0@@% @@1@@%', fromValue: [279.17,147.48]}], position: 250, duration: 0 },
            { id: "eid27589", tween: [ "style", "${_eu3}", "-ms-transform-origin", [172.35,109.56], { valueTemplate: '@@0@@% @@1@@%', fromValue: [279.17,147.48]}], position: 250, duration: 0 },
            { id: "eid27590", tween: [ "style", "${_eu3}", "msTransformOrigin", [172.35,109.56], { valueTemplate: '@@0@@% @@1@@%', fromValue: [279.17,147.48]}], position: 250, duration: 0 },
            { id: "eid27591", tween: [ "style", "${_eu3}", "-o-transform-origin", [172.35,109.56], { valueTemplate: '@@0@@% @@1@@%', fromValue: [279.17,147.48]}], position: 250, duration: 0 },
            { id: "eid1105", tween: [ "style", "${_appleico_sym}", "clip", [0,12,85,0], { valueTemplate: 'rect(@@0@@px @@1@@px @@2@@px @@3@@px)', fromValue: [0,12,0,0]}], position: 2250, duration: 250, easing: "easeOutSine" },
            { id: "eid15206", tween: [ "style", "${_eu6}", "left", '337.99px', { fromValue: '337.99px'}], position: 1701, duration: 0 },
            { id: "eid15208", tween: [ "style", "${_eu5}", "left", '324.99px', { fromValue: '268.99px'}], position: 250, duration: 0 },
            { id: "eid15211", tween: [ "style", "${_eu4}", "top", '300px', { fromValue: '300px'}], position: 1701, duration: 0 },
            { id: "eid15186", tween: [ "style", "${_eu2}", "opacity", '1', { fromValue: '0'}], position: 250, duration: 437, easing: "easeOutCirc" },
            { id: "eid15193", tween: [ "style", "${_eu5}", "opacity", '1', { fromValue: '0'}], position: 250, duration: 656, easing: "easeOutCirc" },
            { id: "eid1941", tween: [ "style", "${_opera_txt}", "opacity", '1', { fromValue: '0'}], position: 3749, duration: 411 },
            { id: "eid4090", tween: [ "color", "${_bb_txt}", "color", 'rgba(207,204,109,1.00)', { animationColorSpace: 'RGB', valueTemplate: undefined, fromValue: 'rgba(207,204,109,1.00)'}], position: 4983, duration: 0 },
            { id: "eid1111", tween: [ "style", "${_nokiaico_sym}", "clip", [0,11,75,0], { valueTemplate: 'rect(@@0@@px @@1@@px @@2@@px @@3@@px)', fromValue: [0,12,0,0]}], position: 2120, duration: 250, easing: "easeOutSine" },
            { id: "eid15199", tween: [ "style", "${_eu4}", "-webkit-transform-origin", [346.53,133.67], { valueTemplate: '@@0@@% @@1@@%', fromValue: [346.53,133.67]}], position: 250, duration: 0, easing: "easeOutCirc" },
            { id: "eid27592", tween: [ "style", "${_eu4}", "-moz-transform-origin", [346.53,133.67], { valueTemplate: '@@0@@% @@1@@%', fromValue: [346.53,133.67]}], position: 250, duration: 0, easing: "easeOutCirc" },
            { id: "eid27593", tween: [ "style", "${_eu4}", "-ms-transform-origin", [346.53,133.67], { valueTemplate: '@@0@@% @@1@@%', fromValue: [346.53,133.67]}], position: 250, duration: 0, easing: "easeOutCirc" },
            { id: "eid27594", tween: [ "style", "${_eu4}", "msTransformOrigin", [346.53,133.67], { valueTemplate: '@@0@@% @@1@@%', fromValue: [346.53,133.67]}], position: 250, duration: 0, easing: "easeOutCirc" },
            { id: "eid27595", tween: [ "style", "${_eu4}", "-o-transform-origin", [346.53,133.67], { valueTemplate: '@@0@@% @@1@@%', fromValue: [346.53,133.67]}], position: 250, duration: 0, easing: "easeOutCirc" },
            { id: "eid15213", tween: [ "style", "${_eu4}", "-webkit-transform-origin", [212.96,77.39], { valueTemplate: '@@0@@% @@1@@%', fromValue: [346.53,133.67]}], position: 1701, duration: 0 },
            { id: "eid27596", tween: [ "style", "${_eu4}", "-moz-transform-origin", [212.96,77.39], { valueTemplate: '@@0@@% @@1@@%', fromValue: [346.53,133.67]}], position: 1701, duration: 0 },
            { id: "eid27597", tween: [ "style", "${_eu4}", "-ms-transform-origin", [212.96,77.39], { valueTemplate: '@@0@@% @@1@@%', fromValue: [346.53,133.67]}], position: 1701, duration: 0 },
            { id: "eid27598", tween: [ "style", "${_eu4}", "msTransformOrigin", [212.96,77.39], { valueTemplate: '@@0@@% @@1@@%', fromValue: [346.53,133.67]}], position: 1701, duration: 0 },
            { id: "eid27599", tween: [ "style", "${_eu4}", "-o-transform-origin", [212.96,77.39], { valueTemplate: '@@0@@% @@1@@%', fromValue: [346.53,133.67]}], position: 1701, duration: 0 },
            { id: "eid1967", tween: [ "style", "${_apple_txt}", "opacity", '1', { fromValue: '0'}], position: 4160, duration: 411 },
            { id: "eid15216", tween: [ "style", "${_eu1}", "-webkit-transform-origin", [50.21,100.51], { valueTemplate: '@@0@@% @@1@@%', fromValue: [50.21,100.51]}], position: 1701, duration: 0 },
            { id: "eid27600", tween: [ "style", "${_eu1}", "-moz-transform-origin", [50.21,100.51], { valueTemplate: '@@0@@% @@1@@%', fromValue: [50.21,100.51]}], position: 1701, duration: 0 },
            { id: "eid27601", tween: [ "style", "${_eu1}", "-ms-transform-origin", [50.21,100.51], { valueTemplate: '@@0@@% @@1@@%', fromValue: [50.21,100.51]}], position: 1701, duration: 0 },
            { id: "eid27602", tween: [ "style", "${_eu1}", "msTransformOrigin", [50.21,100.51], { valueTemplate: '@@0@@% @@1@@%', fromValue: [50.21,100.51]}], position: 1701, duration: 0 },
            { id: "eid27603", tween: [ "style", "${_eu1}", "-o-transform-origin", [50.21,100.51], { valueTemplate: '@@0@@% @@1@@%', fromValue: [50.21,100.51]}], position: 1701, duration: 0 },
            { id: "eid1943", tween: [ "style", "${_operapercent_txt}", "opacity", '1', { fromValue: '0'}], position: 3749, duration: 411 },
            { id: "eid1949", tween: [ "style", "${_other_txt}", "opacity", '1', { fromValue: '0'}], position: 4572, duration: 411 },
            { id: "eid1019", tween: [ "style", "${_Rectangle}", "width", '91px', { fromValue: '0px'}], position: 1701, duration: 299 },
            { id: "eid1973", tween: [ "style", "${_netfrontpercent_txt}", "opacity", '1', { fromValue: '0'}], position: 4411, duration: 411 },
            { id: "eid1431", tween: [ "style", "${_TextCopy}", "clip", [0,91,31,0], { valueTemplate: 'rect(@@0@@px @@1@@px @@2@@px @@3@@px)', fromValue: [0,0,31,0]}], position: 3365, duration: 250 },
            { id: "eid15210", tween: [ "style", "${_eu4}", "left", '311px', { fromValue: '311px'}], position: 1701, duration: 0 },
            { id: "eid1113", tween: [ "style", "${_operaico_sym}", "clip", [0,12,54,0], { valueTemplate: 'rect(@@0@@px @@1@@px @@2@@px @@3@@px)', fromValue: [0,12,0,0]}], position: 2000, duration: 250, easing: "easeOutSine" },
            { id: "eid15179", tween: [ "style", "${_eu1}", "left", '268.99px', { fromValue: '282.26px'}], position: 250, duration: 1451, easing: "easeOutCirc" },
            { id: "eid1963", tween: [ "style", "${_otherpercent_txt}", "opacity", '1', { fromValue: '0'}], position: 4572, duration: 411 }         ]
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
})(jQuery, AdobeEdge, "EDGE-341175953");
