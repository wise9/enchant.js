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
      
      
      Symbol.bindElementAction(compId, symbolName, "document", "compositionReady", function(sym, e) {
         sym.setParameter("counter", 0);
         

      });
      //Edge binding end

      Symbol.bindElementAction(compId, symbolName, "${_reset}", "click", function(sym, e) {
         var countDisplay = sym.composition.getStage().getParameter("counter");
         countDisplay = 0;
         sym.setParameter("counter", countDisplay);
         
         sym.$("text").html(countDisplay);
         sym.$("title").html("bubble noob");

      });
      //Edge binding end

   })("stage");
   //Edge symbol end:'stage'

//=========================================================
   (function(symbolName) {

      Symbol.bindTriggerAction(compId, symbolName, "Default Timeline", 5500, function(sym, e) {
         sym.play(0);

      });
      //Edge binding end

   })("greenline_sym");
   //Edge symbol end:'greenline_sym'

//=========================================================
   (function(symbolName) {

      Symbol.bindTriggerAction(compId, symbolName, "Default Timeline", 6500, function(sym, e) {
         sym.play(0);

      });
      //Edge binding end

   })("redline_sym");
   //Edge symbol end:'redline_sym'

//=========================================================
   (function(symbolName) {

   })("bg_sym");
   //Edge symbol end:'bg_sym'

//=========================================================
   (function(symbolName) {

      Symbol.bindTriggerAction(compId, symbolName, "Default Timeline", 6562, function(sym, e) {
         sym.play(0);

      });
      //Edge binding end

   })("splotch1_sym");
   //Edge symbol end:'splotch1_sym'

//=========================================================
   (function(symbolName) {

      Symbol.bindTriggerAction(compId, symbolName, "Default Timeline", 6750, function(sym, e) {
         sym.play(0);

      });
      //Edge binding end

   })("splotch2_sym");
   //Edge symbol end:'splotch2_sym'

//=========================================================
   (function(symbolName) {

      Symbol.bindTriggerAction(compId, symbolName, "Default Timeline", 8000, function(sym, e) {
         sym.play(0);

      });
      //Edge binding end

   })("splotch3_sym");
   //Edge symbol end:'splotch3_sym'

//=========================================================
   (function(symbolName) {

      Symbol.bindTriggerAction(compId, symbolName, "Default Timeline", 4000, function(sym, e) {
         sym.play(0);

      });
      //Edge binding end

   })("splotch4_sym");
   //Edge symbol end:'splotch4_sym'

//=========================================================
   (function(symbolName) {

      Symbol.bindTriggerAction(compId, symbolName, "Default Timeline", 4000, function(sym, e) {
         sym.play(0);

      });
      //Edge binding end

   })("splotch5_sym");
   //Edge symbol end:'splotch5_sym'

//=========================================================
   //Edge symbol: 'pop'
   (function(symbolName) {

      

   })("pop");
   //Edge symbol end:'pop'

//=========================================================
   (function(symbolName) {

      Symbol.bindTriggerAction(compId, symbolName, "Default Timeline", 1750, function(sym, e) {
         // play the timeline from the given position (ms or label)
         sym.play(0);

      });
      //Edge binding end

      Symbol.bindElementAction(compId, symbolName, "${_bubble}", "click", function(sym, e) {
var countDisplay = sym.composition.getStage().getParameter("counter");
countDisplay = countDisplay + 1;
sym.composition.getStage().setParameter("counter", countDisplay);

sym.getComposition().getStage().$("text").html(countDisplay);

sym.getComposition().getStage().$("title").show();

if (countDisplay == 1) {
sym.getComposition().getStage().$("title").html("bubble novice");
}

else if (countDisplay == 10) {
sym.getComposition().getStage().$("title").html("recreational bubbler");
}

else if (countDisplay == 20) {
sym.getComposition().getStage().$("title").html("bubble hobbyist");
}

else if (countDisplay == 30) {
sym.getComposition().getStage().$("title").html("popping enthusiast");
}

else if (countDisplay == 40) {
sym.getComposition().getStage().$("title").html("senior bubbler");
}

else if (countDisplay == 50) {
sym.getComposition().getStage().$("title").html("advanced popper");
}

else if (countDisplay == 60) {
sym.getComposition().getStage().$("title").html("bubble king");
}

else if (countDisplay == 70) {
sym.getComposition().getStage().$("title").html("bubble guru");
}

else if (countDisplay == 80) {
sym.getComposition().getStage().$("title").html("bubble master");
}

else if (countDisplay == 90) {
sym.getComposition().getStage().$("title").html("bubble inventor");
}

else if (countDisplay == 100) {
sym.getComposition().getStage().$("title").html("you are a bubble");
}

      });
      //Edge binding end

      Symbol.bindTriggerAction(compId, symbolName, "Default Timeline", 0, function(sym, e) {
         sym.stop();

      });
      //Edge binding end

      

      Symbol.bindElementAction(compId, symbolName, "${_bubble}", "mouseover", function(sym, e) {
         sym.play("jiggle");
         

      });
      //Edge binding end

      

   })("bubble_sym");
   //Edge symbol end:'bubble_sym'

//=========================================================
   (function(symbolName) {

      

   })("bubblesall_sym");
   //Edge symbol end:'bubblesall_sym'

//=========================================================
   (function(symbolName) {

      Symbol.bindElementAction(compId, symbolName, "${_b17}", "click", function(sym, e) {
         sym.getComposition().getStage().getSymbol("bubblesall_sym").getSymbol("b17_sym").getSymbol("b17").play("pop");
         
         setTimeout(function() {
            sym.$("b17").hide();
         }, 250);

      });
      //Edge binding end

      Symbol.bindTimelineAction(compId, symbolName, "Default Timeline", "complete", function(sym, e) {
         sym.play(0);

      });
      //Edge binding end

      Symbol.bindTriggerAction(compId, symbolName, "Default Timeline", 11750, function(sym, e) {
         sym.play(0);
         sym.getSymbol("b17").$("bubble").show();

      });
      //Edge binding end

   })("b17_sym");
   //Edge symbol end:'b17_sym'

//=========================================================
   (function(symbolName) {

      Symbol.bindElementAction(compId, symbolName, "${_b28}", "click", function(sym, e) {
         sym.getComposition().getStage().getSymbol("bubblesall_sym").getSymbol("b28_sym").getSymbol("b28").play("pop");
         
         setTimeout(function() {
            sym.$("b28").hide();
         }, 250);

      });
      //Edge binding end

      Symbol.bindTimelineAction(compId, symbolName, "Default Timeline", "complete", function(sym, e) {
         sym.play(0);

      });
      //Edge binding end

      Symbol.bindTriggerAction(compId, symbolName, "Default Timeline", 57999, function(sym, e) {
         sym.play(0);
         sym.getSymbol("b28").$("bubble").show();

      });
      //Edge binding end

   })("b28_sym");
   //Edge symbol end:'b28_sym'

//=========================================================
   (function(symbolName) {

      Symbol.bindElementAction(compId, symbolName, "${_b27}", "click", function(sym, e) {
         sym.getComposition().getStage().getSymbol("bubblesall_sym").getSymbol("b27_sym").getSymbol("b27").play("pop");
         
         setTimeout(function() {
            sym.$("b27").hide();
         }, 250);

      });
      //Edge binding end

      Symbol.bindTimelineAction(compId, symbolName, "Default Timeline", "complete", function(sym, e) {
         sym.play(0);

      });
      //Edge binding end

      Symbol.bindTriggerAction(compId, symbolName, "Default Timeline", 70000, function(sym, e) {
         sym.play(0);
         sym.getSymbol("b27").$("bubble").show();

      });
      //Edge binding end

   })("b27_sym");
   //Edge symbol end:'b27_sym'

//=========================================================
   (function(symbolName) {

      Symbol.bindElementAction(compId, symbolName, "${_b26}", "click", function(sym, e) {
         sym.getComposition().getStage().getSymbol("bubblesall_sym").getSymbol("b26_sym").getSymbol("b26").play("pop");
         
         setTimeout(function() {
            sym.$("b26").hide();
         }, 250);

      });
      //Edge binding end

      Symbol.bindTimelineAction(compId, symbolName, "Default Timeline", "complete", function(sym, e) {
         sym.play(0);

      });
      //Edge binding end

      Symbol.bindTriggerAction(compId, symbolName, "Default Timeline", 38605, function(sym, e) {
         sym.play(0);
         sym.getSymbol("b26").$("bubble").show();

      });
      //Edge binding end

   })("b26_sym");
   //Edge symbol end:'b26_sym'

//=========================================================
   (function(symbolName) {

      Symbol.bindElementAction(compId, symbolName, "${_b25}", "click", function(sym, e) {
         sym.getComposition().getStage().getSymbol("bubblesall_sym").getSymbol("b25_sym").getSymbol("b25").play("pop");
         
         setTimeout(function() {
            sym.$("b25").hide();
         }, 250);

      });
      //Edge binding end

      Symbol.bindTimelineAction(compId, symbolName, "Default Timeline", "complete", function(sym, e) {
         sym.play(0);

      });
      //Edge binding end

      Symbol.bindTriggerAction(compId, symbolName, "Default Timeline", 41508, function(sym, e) {
         sym.play(0);
         sym.getSymbol("b25").$("bubble").show();

      });
      //Edge binding end

   })("b25_Sym");
   //Edge symbol end:'b25_Sym'

//=========================================================
   (function(symbolName) {

      Symbol.bindElementAction(compId, symbolName, "${_b24}", "click", function(sym, e) {
         sym.getComposition().getStage().getSymbol("bubblesall_sym").getSymbol("b24_sym").getSymbol("b24").play("pop");
         
         setTimeout(function() {
            sym.$("b24").hide();
         }, 250);

      });
      //Edge binding end

      Symbol.bindTimelineAction(compId, symbolName, "Default Timeline", "complete", function(sym, e) {
         sym.play(0);

      });
      //Edge binding end

      Symbol.bindTriggerAction(compId, symbolName, "Default Timeline", 53000, function(sym, e) {
         sym.play(0);
         sym.getSymbol("b24").$("bubble").show();

      });
      //Edge binding end

   })("b24_sym");
   //Edge symbol end:'b24_sym'

//=========================================================
   (function(symbolName) {

      Symbol.bindElementAction(compId, symbolName, "${_b22}", "click", function(sym, e) {
         sym.getComposition().getStage().getSymbol("bubblesall_sym").getSymbol("b22_sym").getSymbol("b22").play("pop");
         
         setTimeout(function() {
            sym.$("b22").hide();
         }, 250);

      });
      //Edge binding end

      Symbol.bindTimelineAction(compId, symbolName, "Default Timeline", "complete", function(sym, e) {
         sym.play(0);

      });
      //Edge binding end

      Symbol.bindTriggerAction(compId, symbolName, "Default Timeline", 35645, function(sym, e) {
         sym.play(0);
         sym.getSymbol("b22").$("bubble").show();

      });
      //Edge binding end

   })("b22_sym");
   //Edge symbol end:'b22_sym'

//=========================================================
   (function(symbolName) {

      Symbol.bindElementAction(compId, symbolName, "${_b23}", "click", function(sym, e) {
         sym.getComposition().getStage().getSymbol("bubblesall_sym").getSymbol("b23_sym").getSymbol("b23").play("pop");
         
         setTimeout(function() {
            sym.$("b23").hide();
         }, 250);

      });
      //Edge binding end

      Symbol.bindTimelineAction(compId, symbolName, "Default Timeline", "complete", function(sym, e) {
         sym.play(0);

      });
      //Edge binding end

      Symbol.bindTriggerAction(compId, symbolName, "Default Timeline", 38605, function(sym, e) {
         sym.play(0);
         sym.getSymbol("b23").$("bubble").show();

      });
      //Edge binding end

   })("b23_sym");
   //Edge symbol end:'b23_sym'

//=========================================================
   (function(symbolName) {

      Symbol.bindElementAction(compId, symbolName, "${_b21}", "click", function(sym, e) {
         sym.getComposition().getStage().getSymbol("bubblesall_sym").getSymbol("b21_sym").getSymbol("b21").play("pop");
         
         setTimeout(function() {
            sym.$("b21").hide();
         }, 250);

      });
      //Edge binding end

      Symbol.bindTimelineAction(compId, symbolName, "Default Timeline", "complete", function(sym, e) {
         sym.play(0);

      });
      //Edge binding end

      Symbol.bindTriggerAction(compId, symbolName, "Default Timeline", 21250, function(sym, e) {
         sym.play(0);
         sym.getSymbol("b21").$("bubble").show();

      });
      //Edge binding end

   })("b21_sym");
   //Edge symbol end:'b21_sym'

//=========================================================
   (function(symbolName) {

      Symbol.bindElementAction(compId, symbolName, "${_b20}", "click", function(sym, e) {
         sym.getComposition().getStage().getSymbol("bubblesall_sym").getSymbol("b20_sym").getSymbol("b20").play("pop");
         
         setTimeout(function() {
            sym.$("b20").hide();
         }, 250);

      });
      //Edge binding end

      Symbol.bindTimelineAction(compId, symbolName, "Default Timeline", "complete", function(sym, e) {
         sym.play(0);

      });
      //Edge binding end

      Symbol.bindTriggerAction(compId, symbolName, "Default Timeline", 7000, function(sym, e) {
         sym.play(0);
         sym.getSymbol("b20").$("bubble").show();

      });
      //Edge binding end

   })("b20_sym");
   //Edge symbol end:'b20_sym'

//=========================================================
   (function(symbolName) {

      Symbol.bindElementAction(compId, symbolName, "${_b19}", "click", function(sym, e) {
         sym.getComposition().getStage().getSymbol("bubblesall_sym").getSymbol("b19_sym").getSymbol("b19").play("pop");
         
         setTimeout(function() {
            sym.$("b19").hide();
         }, 250);

      });
      //Edge binding end

      Symbol.bindTimelineAction(compId, symbolName, "Default Timeline", "complete", function(sym, e) {
         sym.play(0);

      });
      //Edge binding end

      Symbol.bindTriggerAction(compId, symbolName, "Default Timeline", 12750, function(sym, e) {
         sym.play(0);
         sym.getSymbol("b19").$("bubble").show();

      });
      //Edge binding end

   })("b19_sym");
   //Edge symbol end:'b19_sym'

//=========================================================
   (function(symbolName) {

      Symbol.bindElementAction(compId, symbolName, "${_b18}", "click", function(sym, e) {
         sym.getComposition().getStage().getSymbol("bubblesall_sym").getSymbol("b18_sym").getSymbol("b18").play("pop");
         
         setTimeout(function() {
            sym.$("b18").hide();
         }, 250);

      });
      //Edge binding end

      Symbol.bindTimelineAction(compId, symbolName, "Default Timeline", "complete", function(sym, e) {
         sym.play(0);

      });
      //Edge binding end

      Symbol.bindTriggerAction(compId, symbolName, "Default Timeline", 11000, function(sym, e) {
         sym.play(0);
         sym.getSymbol("b18").$("bubble").show();

      });
      //Edge binding end

   })("b18_sym");
   //Edge symbol end:'b18_sym'

//=========================================================
   (function(symbolName) {

      Symbol.bindElementAction(compId, symbolName, "${_b16}", "click", function(sym, e) {
         sym.getComposition().getStage().getSymbol("bubblesall_sym").getSymbol("b16_sym").getSymbol("b16").play("pop");
         
         setTimeout(function() {
            sym.$("b16").hide();
         }, 250);

      });
      //Edge binding end

      Symbol.bindTimelineAction(compId, symbolName, "Default Timeline", "complete", function(sym, e) {
         sym.play(0);

      });
      //Edge binding end

      

      Symbol.bindTriggerAction(compId, symbolName, "Default Timeline", 53000, function(sym, e) {
         sym.play(0);
         sym.getSymbol("b16").$("bubble").show();

      });
      //Edge binding end

   })("b16_Sym");
   //Edge symbol end:'b16_Sym'

//=========================================================
   (function(symbolName) {

      Symbol.bindElementAction(compId, symbolName, "${_b1}", "click", function(sym, e) {
         sym.getComposition().getStage().getSymbol("bubblesall_sym").getSymbol("b1_sym").getSymbol("b1").play("pop");
         
         setTimeout(function() {
            sym.$("b1").hide();
         }, 250);

      });
      //Edge binding end

      Symbol.bindTimelineAction(compId, symbolName, "Default Timeline", "complete", function(sym, e) {
         sym.play(0);

      });
      //Edge binding end

      Symbol.bindTriggerAction(compId, symbolName, "Default Timeline", 36500, function(sym, e) {
         sym.play(0);
         sym.getSymbol("b1").$("bubble").show();

      });
      //Edge binding end

   })("b1_sym");
   //Edge symbol end:'b1_sym'

//=========================================================
   (function(symbolName) {

      Symbol.bindElementAction(compId, symbolName, "${_b2}", "click", function(sym, e) {
         sym.getComposition().getStage().getSymbol("bubblesall_sym").getSymbol("b2_sym").getSymbol("b2").play("pop");
         
         setTimeout(function() {
            sym.$("b2").hide();
         }, 250);

      });
      //Edge binding end

      Symbol.bindTimelineAction(compId, symbolName, "Default Timeline", "complete", function(sym, e) {
         sym.play(0);

      });
      //Edge binding end

      Symbol.bindTriggerAction(compId, symbolName, "Default Timeline", 70000, function(sym, e) {
         sym.play(0);
         sym.getSymbol("b2").$("bubble").show();

      });
      //Edge binding end

   })("b2_sym");
   //Edge symbol end:'b2_sym'

//=========================================================
   (function(symbolName) {

      Symbol.bindElementAction(compId, symbolName, "${_b4}", "click", function(sym, e) {
         sym.getComposition().getStage().getSymbol("bubblesall_sym").getSymbol("b4_sym").getSymbol("b4").play("pop");
         
         setTimeout(function() {
            sym.$("b4").hide();
         }, 250);

      });
      //Edge binding end

      Symbol.bindTimelineAction(compId, symbolName, "Default Timeline", "complete", function(sym, e) {
         sym.play(0);

      });
      //Edge binding end

   })("b4_sym");
   //Edge symbol end:'b4_sym'

//=========================================================
   (function(symbolName) {

      Symbol.bindElementAction(compId, symbolName, "${_b5}", "click", function(sym, e) {
         sym.getComposition().getStage().getSymbol("bubblesall_sym").getSymbol("b5_sym").getSymbol("b5").play("pop");
         
         setTimeout(function() {
            sym.$("b5").hide();
         }, 250);

      });
      //Edge binding end

      Symbol.bindTimelineAction(compId, symbolName, "Default Timeline", "complete", function(sym, e) {
         sym.play(0);

      });
      //Edge binding end

      Symbol.bindTriggerAction(compId, symbolName, "Default Timeline", 71550, function(sym, e) {
         sym.play(0);
         sym.getSymbol("b6").$("bubble").show();

      });
      //Edge binding end

   })("b5_sym");
   //Edge symbol end:'b5_sym'

//=========================================================
   (function(symbolName) {

      Symbol.bindElementAction(compId, symbolName, "${_b15}", "click", function(sym, e) {
         sym.getComposition().getStage().getSymbol("bubblesall_sym").getSymbol("b15_sym").getSymbol("b15").play("pop");
         
         setTimeout(function() {
            sym.$("b15").hide();
         }, 250);

      });
      //Edge binding end

      Symbol.bindTimelineAction(compId, symbolName, "Default Timeline", "complete", function(sym, e) {
         sym.play(0);

      });
      //Edge binding end

      

      Symbol.bindTriggerAction(compId, symbolName, "Default Timeline", 36250, function(sym, e) {
         sym.play(0);
         sym.getSymbol("b15").$("bubble").show();

      });
      //Edge binding end

   })("b15_sym");
   //Edge symbol end:'b15_sym'

//=========================================================
   (function(symbolName) {

      Symbol.bindElementAction(compId, symbolName, "${_b6}", "click", function(sym, e) {
         sym.getComposition().getStage().getSymbol("bubblesall_sym").getSymbol("b6_sym").getSymbol("b6").play("pop");
         
         setTimeout(function() {
            sym.$("b6").hide();
         }, 250);

      });
      //Edge binding end

      Symbol.bindTimelineAction(compId, symbolName, "Default Timeline", "complete", function(sym, e) {
         sym.play(0);

      });
      //Edge binding end

   })("b6_sym");
   //Edge symbol end:'b6_sym'

//=========================================================
   (function(symbolName) {

      Symbol.bindElementAction(compId, symbolName, "${_b14}", "click", function(sym, e) {
         sym.getComposition().getStage().getSymbol("bubblesall_sym").getSymbol("b14_sym").getSymbol("b14").play("pop");
         
         setTimeout(function() {
            sym.$("b14").hide();
         }, 250);

      });
      //Edge binding end

      Symbol.bindTimelineAction(compId, symbolName, "Default Timeline", "complete", function(sym, e) {
         sym.play(0);

      });
      //Edge binding end

      

      Symbol.bindTriggerAction(compId, symbolName, "Default Timeline", 22749, function(sym, e) {
         sym.play(0);
         sym.getSymbol("b14").$("bubble").show();

      });
      //Edge binding end

   })("b14_sym");
   //Edge symbol end:'b14_sym'

//=========================================================
   (function(symbolName) {

      Symbol.bindElementAction(compId, symbolName, "${_b12}", "click", function(sym, e) {
         sym.getComposition().getStage().getSymbol("bubblesall_sym").getSymbol("b12_sym").getSymbol("b12").play("pop");
         
         setTimeout(function() {
            sym.$("b12").hide();
         }, 250);

      });
      //Edge binding end

      Symbol.bindTimelineAction(compId, symbolName, "Default Timeline", "complete", function(sym, e) {
         sym.play(0);

      });
      //Edge binding end

      

      Symbol.bindTriggerAction(compId, symbolName, "Default Timeline", 36500, function(sym, e) {
         sym.play(0);
         sym.getSymbol("b12").$("bubble").show();

      });
      //Edge binding end

   })("b12_sym");
   //Edge symbol end:'b12_sym'

//=========================================================
   (function(symbolName) {

      Symbol.bindElementAction(compId, symbolName, "${_b13}", "click", function(sym, e) {
         sym.getComposition().getStage().getSymbol("bubblesall_sym").getSymbol("b13_sym").getSymbol("b13").play("pop");
         
         setTimeout(function() {
            sym.$("b13").hide();
         }, 250);

      });
      //Edge binding end

      Symbol.bindTimelineAction(compId, symbolName, "Default Timeline", "complete", function(sym, e) {
         sym.play(0);
         sym.$("b13").show();

      });
      //Edge binding end

      

      Symbol.bindTriggerAction(compId, symbolName, "Default Timeline", 21250, function(sym, e) {
         sym.play(0);
         sym.getSymbol("b13").$("bubble").show();

      });
      //Edge binding end

   })("b13_sym");
   //Edge symbol end:'b13_sym'

//=========================================================
   (function(symbolName) {

      Symbol.bindElementAction(compId, symbolName, "${_b11}", "click", function(sym, e) {
         sym.getComposition().getStage().getSymbol("bubblesall_sym").getSymbol("b11_sym").getSymbol("b11").play("pop");
         
         setTimeout(function() {
            sym.$("b11").hide();
         }, 250);

      });
      //Edge binding end

      Symbol.bindTimelineAction(compId, symbolName, "Default Timeline", "complete", function(sym, e) {
         sym.play(0);

      });
      //Edge binding end

      

      Symbol.bindTriggerAction(compId, symbolName, "Default Timeline", 30499, function(sym, e) {
         sym.play(0);
         sym.getSymbol("b11").$("bubble").show();

      });
      //Edge binding end

   })("b11_sym");
   //Edge symbol end:'b11_sym'

//=========================================================
   (function(symbolName) {

      Symbol.bindElementAction(compId, symbolName, "${_b10}", "click", function(sym, e) {
         sym.getComposition().getStage().getSymbol("bubblesall_sym").getSymbol("b10_sym").getSymbol("b10").play("pop");
         
         setTimeout(function() {
            sym.$("b10").hide();
         }, 250);

      });
      //Edge binding end

      Symbol.bindTimelineAction(compId, symbolName, "Default Timeline", "complete", function(sym, e) {
         sym.play(0);

      });
      //Edge binding end

      

      Symbol.bindTriggerAction(compId, symbolName, "Default Timeline", 26000, function(sym, e) {
         sym.play(0);
         sym.getSymbol("b10").$("bubble").show();

      });
      //Edge binding end

   })("b10_sym");
   //Edge symbol end:'b10_sym'

//=========================================================
   (function(symbolName) {

      Symbol.bindElementAction(compId, symbolName, "${_b8}", "click", function(sym, e) {
         sym.getComposition().getStage().getSymbol("bubblesall_sym").getSymbol("b8_sym").getSymbol("b8").play("pop");
         
         setTimeout(function() {
            sym.$("b8").hide();
         }, 250);

      });
      //Edge binding end

      Symbol.bindTimelineAction(compId, symbolName, "Default Timeline", "complete", function(sym, e) {
         sym.play(0);

      });
      //Edge binding end

      Symbol.bindTriggerAction(compId, symbolName, "Default Timeline", 38605, function(sym, e) {
         sym.play(0);
         sym.getSymbol("b8").$("bubble").show();

      });
      //Edge binding end

   })("b8_sym");
   //Edge symbol end:'b8_sym'

//=========================================================
   (function(symbolName) {

      Symbol.bindElementAction(compId, symbolName, "${_b9}", "click", function(sym, e) {
         sym.getComposition().getStage().getSymbol("bubblesall_sym").getSymbol("b9_sym").getSymbol("b9").play("pop");
         
         setTimeout(function() {
            sym.$("b9").hide();
         }, 250);

      });
      //Edge binding end

      Symbol.bindTimelineAction(compId, symbolName, "Default Timeline", "complete", function(sym, e) {
         sym.play(0);

      });
      //Edge binding end

      Symbol.bindTriggerAction(compId, symbolName, "Default Timeline", 70000, function(sym, e) {
         sym.play(0);
         sym.getSymbol("b9").$("bubble").show();

      });
      //Edge binding end

   })("b9_sym");
   //Edge symbol end:'b9_sym'

//=========================================================
   (function(symbolName) {

      Symbol.bindElementAction(compId, symbolName, "${_b7}", "click", function(sym, e) {
         sym.getComposition().getStage().getSymbol("bubblesall_sym").getSymbol("b7_sym").getSymbol("b7").play("pop");
         
         setTimeout(function() {
            sym.$("b7").hide();
         }, 250);

      });
      //Edge binding end

      Symbol.bindTimelineAction(compId, symbolName, "Default Timeline", "complete", function(sym, e) {
         sym.play(0);

      });
      //Edge binding end

      Symbol.bindTriggerAction(compId, symbolName, "Default Timeline", 70000, function(sym, e) {
         sym.play(0);
         sym.getSymbol("b7").$("bubble").show();

      });
      //Edge binding end

   })("b7_sym");
   //Edge symbol end:'b7_sym'

//=========================================================
   (function(symbolName) {

      Symbol.bindElementAction(compId, symbolName, "${_b3}", "click", function(sym, e) {
         sym.getComposition().getStage().getSymbol("bubblesall_sym").getSymbol("b3_sym").getSymbol("b3").play("pop");
         
         setTimeout(function() {
            sym.$("b3").hide();
         }, 250);

      });
      //Edge binding end

      Symbol.bindTimelineAction(compId, symbolName, "Default Timeline", "complete", function(sym, e) {
         sym.play(0);

      });
      //Edge binding end

      Symbol.bindTriggerAction(compId, symbolName, "Default Timeline", 70000, function(sym, e) {
         sym.play(0);
         sym.getSymbol("b3").$("bubble").show();

      });
      //Edge binding end

   })("b3_sym");
   //Edge symbol end:'b3_sym'

//=========================================================
   //Edge symbol: 'preloader'
   (function(symbolName) {

   })("preloader");
   //Edge symbol end:'preloader'

})(jQuery, AdobeEdge, "EDGE-206060553");