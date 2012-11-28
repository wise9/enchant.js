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
      
      
      Symbol.bindTriggerAction(compId, symbolName, "Default Timeline", 0, function(sym, e) {
         sym.stop();

      });
      //Edge binding end

      Symbol.bindElementAction(compId, symbolName, "${_play}", "click", function(sym, e) {
         sym.play();
         //set the value of a Symbol variable
         sym.setVariable("count", 1);

      });
      //Edge binding end

      Symbol.bindTimelineAction(compId, symbolName, "Default Timeline", "complete", function(sym, e) {
         // play the timeline from the given position (ms or label)
         //get the value of a Symbol variable
         var count = sym.getVariable("count");
         //set the value of a Symbol variable
         sym.setVariable("count", count+1);
         
         sym.play("loop");
         

      });
      //Edge binding end

      Symbol.bindTriggerAction(compId, symbolName, "Default Timeline", 500, function(sym, e) {
        //get the value of a Symbol variable
        var count = sym.getVariable("count");
        // Change an Element's contents.
        //  (sym.$("name") resolves an Edge element name to a DOM
        //  element that can be used with jQuery)
        sym.$("Text").html(""+count);

      });
      //Edge binding end

   })("stage");
   //Edge symbol end:'stage'

})(jQuery, AdobeEdge, "EDGE-298358922");