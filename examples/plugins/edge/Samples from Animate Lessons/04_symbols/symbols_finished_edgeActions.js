/***********************
* Adobe Edge Composition Actions
*
* Edit this file with caution, being careful to preserve 
* function signatures and comments starting with 'Edge' to maintain the 
* ability to interact with these actions from within Adobe Edge
*
***********************/
(function($, Edge, compId){
var Composition = Edge.Composition, Symbol = Edge.Symbol; // aliases for commonly used Edge classes
//Edge symbol: 'stage'
(function(symbolName) {









})("stage");
   //Edge symbol end:'stage'

//=========================================================
   //Edge symbol: 'Spin'
   (function(symbolName) {

      Symbol.bindTimelineAction(compId, symbolName, "Default Timeline", "complete", function(sym, e) {
         // play the timeline from the given position (ms or label)
         sym.play(0);
         // insert code to be run at timeline end here

      });
      //Edge binding end

      Symbol.bindElementAction(compId, symbolName, "${_Center}", "click", function(sym, e) {
         if (sym.isPlaying())
         	sym.stop();
         else
         	sym.play();
         

      });
      //Edge binding end

   })("Spin");
   //Edge symbol end:'Spin'

})(jQuery, AdobeEdge, "EDGE-130892631");