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



Symbol.bindElementAction(compId, symbolName, "${_europe_btn}", "mouseover", function(sym, e) {
var eur_sym = sym.getSymbol("europetxt_sym");
eur_sym.play();

});
//Edge binding end

Symbol.bindElementAction(compId, symbolName, "${_europe_btn}", "click", function(sym, e) {
sym.play('euzoom');

sym.$("na_btn").hide();
sym.$("natxt_sym").hide();
sym.$("aus_btn").hide();
sym.$("austxt_sym").hide();
sym.$("asia_btn").hide();
sym.$("asiatxt_sym").hide();
sym.$("sa_btn").hide();
sym.$("satxt_sym").hide();
sym.$("af_btn").hide();
sym.$("aftxt_sym").hide();
sym.$("europe_btn").hide();
sym.$("europetxt_sym").hide();

});
//Edge binding end

Symbol.bindElementAction(compId, symbolName, "${_europe_btn}", "mouseout", function(sym, e) {
var eur_sym = sym.getSymbol("europetxt_sym");
eur_sym.playReverse();



});
//Edge binding end

Symbol.bindElementAction(compId, symbolName, "${_na_btn}", "mouseout", function(sym, e) {
var eur_sym = sym.getSymbol("natxt_sym");
eur_sym.playReverse();


});
//Edge binding end

Symbol.bindElementAction(compId, symbolName, "${_na_btn}", "mouseover", function(sym, e) {

var eur_sym = sym.getSymbol("natxt_sym");
eur_sym.play();

});
//Edge binding end


Symbol.bindElementAction(compId, symbolName, "${_af_btn}", "mouseover", function(sym, e) {

var eur_sym = sym.getSymbol("aftxt_sym");
eur_sym.play();

});
//Edge binding end

Symbol.bindElementAction(compId, symbolName, "${_af_btn}", "mouseout", function(sym, e) {
var eur_sym = sym.getSymbol("aftxt_sym");
eur_sym.playReverse();

});
//Edge binding end

Symbol.bindTriggerAction(compId, symbolName, "Default Timeline", 0, function(sym, e) {
sym.stop();

});
//Edge binding end

Symbol.bindElementAction(compId, symbolName, "${_aus_btn}", "mouseout", function(sym, e) {
var eur_sym = sym.getSymbol("austxt_sym");
eur_sym.playReverse();

});
//Edge binding end

Symbol.bindElementAction(compId, symbolName, "${_aus_btn}", "mouseover", function(sym, e) {


var eur_sym = sym.getSymbol("austxt_sym");
eur_sym.play();

});
//Edge binding end

Symbol.bindElementAction(compId, symbolName, "${_sa_btn}", "mouseout", function(sym, e) {
var eur_sym = sym.getSymbol("satxt_sym");
eur_sym.playReverse();


});
//Edge binding end

Symbol.bindElementAction(compId, symbolName, "${_sa_btn}", "mouseover", function(sym, e) {


var eur_sym = sym.getSymbol("satxt_sym");
eur_sym.play();

});
//Edge binding end

Symbol.bindElementAction(compId, symbolName, "${_asia_btn}", "mouseover", function(sym, e) {


var eur_sym = sym.getSymbol("asiatxt_sym");
eur_sym.play();

});
//Edge binding end

Symbol.bindElementAction(compId, symbolName, "${_asia_btn}", "mouseout", function(sym, e) {
var eur_sym = sym.getSymbol("asiatxt_sym");
eur_sym.playReverse();

});
//Edge binding end















Symbol.bindElementAction(compId, symbolName, "${_na_btn}", "click", function(sym, e) {
sym.play('nazoom');

sym.$("na_btn").hide();
sym.$("natxt_sym").hide();
sym.$("aus_btn").hide();
sym.$("austxt_sym").hide();
sym.$("asia_btn").hide();
sym.$("asiatxt_sym").hide();
sym.$("sa_btn").hide();
sym.$("satxt_sym").hide();
sym.$("af_btn").hide();
sym.$("aftxt_sym").hide();
sym.$("europe_btn").hide();
sym.$("europetxt_sym").hide();

});
//Edge binding end

Symbol.bindElementAction(compId, symbolName, "${_sa_btn}", "click", function(sym, e) {
sym.play('sazoom');

sym.$("na_btn").hide();
sym.$("natxt_sym").hide();
sym.$("aus_btn").hide();
sym.$("austxt_sym").hide();
sym.$("asia_btn").hide();
sym.$("asiatxt_sym").hide();
sym.$("sa_btn").hide();
sym.$("satxt_sym").hide();
sym.$("af_btn").hide();
sym.$("aftxt_sym").hide();
sym.$("europe_btn").hide();
sym.$("europetxt_sym").hide();

});
//Edge binding end

Symbol.bindElementAction(compId, symbolName, "${_asia_btn}", "click", function(sym, e) {
sym.play('asiazoom');

sym.$("na_btn").hide();
sym.$("natxt_sym").hide();
sym.$("aus_btn").hide();
sym.$("austxt_sym").hide();
sym.$("asia_btn").hide();
sym.$("asiatxt_sym").hide();
sym.$("sa_btn").hide();
sym.$("satxt_sym").hide();
sym.$("af_btn").hide();
sym.$("aftxt_sym").hide();
sym.$("europe_btn").hide();
sym.$("europetxt_sym").hide();

});
//Edge binding end

Symbol.bindElementAction(compId, symbolName, "${_aus_btn}", "click", function(sym, e) {
sym.play('oczoom');

sym.$("na_btn").hide();
sym.$("natxt_sym").hide();
sym.$("aus_btn").hide();
sym.$("austxt_sym").hide();
sym.$("asia_btn").hide();
sym.$("asiatxt_sym").hide();
sym.$("sa_btn").hide();
sym.$("satxt_sym").hide();
sym.$("af_btn").hide();
sym.$("aftxt_sym").hide();
sym.$("europe_btn").hide();
sym.$("europetxt_sym").hide();

});
//Edge binding end

Symbol.bindElementAction(compId, symbolName, "${_af_btn}", "click", function(sym, e) {
sym.play('africazoom');

sym.$("na_btn").hide();
sym.$("natxt_sym").hide();
sym.$("aus_btn").hide();
sym.$("austxt_sym").hide();
sym.$("asia_btn").hide();
sym.$("asiatxt_sym").hide();
sym.$("sa_btn").hide();
sym.$("satxt_sym").hide();
sym.$("af_btn").hide();
sym.$("aftxt_sym").hide();
sym.$("europe_btn").hide();
sym.$("europetxt_sym").hide();

});
//Edge binding end

Symbol.bindTriggerAction(compId, symbolName, "Default Timeline", 1871, function(sym, e) {
var asgraphplay = sym.getSymbol("asiagraph_sym");
asgraphplay.play('play');

});
//Edge binding end


Symbol.bindTriggerAction(compId, symbolName, "Default Timeline", 2129, function(sym, e) {
sym.stop();

});
//Edge binding end

Symbol.bindElementAction(compId, symbolName, "${_closeasia_btn}", "mouseover", function(sym, e) {
sym.$("closeasia_btn").css('cursor','pointer');

});
//Edge binding end

Symbol.bindElementAction(compId, symbolName, "${_closeasia_btn}", "click", function(sym, e) {
sym.play('asiazoomout');

sym.$("na_btn").show();
sym.$("natxt_sym").show();
sym.$("aus_btn").show();
sym.$("austxt_sym").show();
sym.$("asia_btn").show();
sym.$("asiatxt_sym").show();
sym.$("sa_btn").show();
sym.$("satxt_sym").show();
sym.$("af_btn").show();
sym.$("aftxt_sym").show();
sym.$("europe_btn").show();
sym.$("europetxt_sym").show();

});
//Edge binding end


Symbol.bindTriggerAction(compId, symbolName, "Default Timeline", 4962, function(sym, e) {
var afgraphplay = sym.getSymbol("afgraph_sym");
afgraphplay.play('play');

});
//Edge binding end

Symbol.bindTriggerAction(compId, symbolName, "Default Timeline", 5220, function(sym, e) {
sym.stop();

});
//Edge binding end

Symbol.bindElementAction(compId, symbolName, "${_closeaf_btn}", "mouseover", function(sym, e) {
});
//Edge binding end

Symbol.bindElementAction(compId, symbolName, "${_closeaf_btn}", "click", function(sym, e) {
sym.play('africazoomout');

sym.$("na_btn").show();
sym.$("natxt_sym").show();
sym.$("aus_btn").show();
sym.$("austxt_sym").show();
sym.$("asia_btn").show();
sym.$("asiatxt_sym").show();
sym.$("sa_btn").show();
sym.$("satxt_sym").show();
sym.$("af_btn").show();
sym.$("aftxt_sym").show();
sym.$("europe_btn").show();
sym.$("europetxt_sym").show();

});
//Edge binding end

Symbol.bindTriggerAction(compId, symbolName, "Default Timeline", 2877, function(sym, e) {
sym.stop();

});
//Edge binding end

Symbol.bindTriggerAction(compId, symbolName, "Default Timeline", 5968, function(sym, e) {
sym.stop();

});
//Edge binding end


Symbol.bindTriggerAction(compId, symbolName, "Default Timeline", 8121, function(sym, e) {
var nagraphplay = sym.getSymbol("nagraph_sym");
nagraphplay.play('play');

});
//Edge binding end

Symbol.bindTriggerAction(compId, symbolName, "Default Timeline", 8379, function(sym, e) {
sym.stop();

});
//Edge binding end

Symbol.bindTriggerAction(compId, symbolName, "Default Timeline", 9127, function(sym, e) {
sym.stop();

});
//Edge binding end

Symbol.bindElementAction(compId, symbolName, "${_closena_btn}", "mouseover", function(sym, e) {
});
//Edge binding end

Symbol.bindElementAction(compId, symbolName, "${_closena_btn}", "click", function(sym, e) {
sym.play('nazoomout');

sym.$("na_btn").show();
sym.$("natxt_sym").show();
sym.$("aus_btn").show();
sym.$("austxt_sym").show();
sym.$("asia_btn").show();
sym.$("asiatxt_sym").show();
sym.$("sa_btn").show();
sym.$("satxt_sym").show();
sym.$("af_btn").show();
sym.$("aftxt_sym").show();
sym.$("europe_btn").show();
sym.$("europetxt_sym").show();

});
//Edge binding end



Symbol.bindTriggerAction(compId, symbolName, "Default Timeline", 10871, function(sym, e) {
var sagraphplay = sym.getSymbol("sagraph_sym");
sagraphplay.play('play');

});
//Edge binding end

Symbol.bindTriggerAction(compId, symbolName, "Default Timeline", 11129, function(sym, e) {
sym.stop();

});
//Edge binding end

Symbol.bindTriggerAction(compId, symbolName, "Default Timeline", 11877, function(sym, e) {
sym.stop();

});
//Edge binding end

Symbol.bindElementAction(compId, symbolName, "${_closesa_btn}", "mouseover", function(sym, e) {
});
//Edge binding end

Symbol.bindElementAction(compId, symbolName, "${_closesa_btn}", "click", function(sym, e) {
sym.play('sazoomout');

sym.$("na_btn").show();
sym.$("natxt_sym").show();
sym.$("aus_btn").show();
sym.$("austxt_sym").show();
sym.$("asia_btn").show();
sym.$("asiatxt_sym").show();
sym.$("sa_btn").show();
sym.$("satxt_sym").show();
sym.$("af_btn").show();
sym.$("aftxt_sym").show();
sym.$("europe_btn").show();
sym.$("europetxt_sym").show();

});
//Edge binding end

Symbol.bindTriggerAction(compId, symbolName, "Default Timeline", 13871, function(sym, e) {
var ocgraphplay = sym.getSymbol("ocgraph_sym");
ocgraphplay.play('play');

});
//Edge binding end

Symbol.bindTriggerAction(compId, symbolName, "Default Timeline", 14129, function(sym, e) {
sym.stop();

});
//Edge binding end

Symbol.bindTriggerAction(compId, symbolName, "Default Timeline", 14877, function(sym, e) {
sym.stop();

});
//Edge binding end

Symbol.bindElementAction(compId, symbolName, "${_closeoc_btn}", "mouseover", function(sym, e) {
});
//Edge binding end

Symbol.bindElementAction(compId, symbolName, "${_closeoc_btn}", "click", function(sym, e) {
sym.play('oczoomout');

sym.$("na_btn").show();
sym.$("natxt_sym").show();
sym.$("aus_btn").show();
sym.$("austxt_sym").show();
sym.$("asia_btn").show();
sym.$("asiatxt_sym").show();
sym.$("sa_btn").show();
sym.$("satxt_sym").show();
sym.$("af_btn").show();
sym.$("aftxt_sym").show();
sym.$("europe_btn").show();
sym.$("europetxt_sym").show();

});
//Edge binding end

Symbol.bindTriggerAction(compId, symbolName, "Default Timeline", 2877, function(sym, e) {
sym.stop();
// Lookup the Edge Symbol Javascript Object from an element that is  
// an instance of a symbol. The symbol object can be used to invoke 
// symbol functions like play, stop etc.
var asgraphstop = sym.getSymbol("asiagraph_sym");
asgraphstop.stop();

});
//Edge binding end

Symbol.bindTriggerAction(compId, symbolName, "Default Timeline", 17371, function(sym, e) {
var eugraphplay = sym.getSymbol("eugraph_sym");
eugraphplay.play('play');

});
//Edge binding end

Symbol.bindTriggerAction(compId, symbolName, "Default Timeline", 17629, function(sym, e) {
sym.stop();

});
//Edge binding end

Symbol.bindTriggerAction(compId, symbolName, "Default Timeline", 18393, function(sym, e) {
sym.stop();

});
//Edge binding end

Symbol.bindElementAction(compId, symbolName, "${_closeeu_btn}", "mouseover", function(sym, e) {
});
//Edge binding end

Symbol.bindElementAction(compId, symbolName, "${_closeeu_btn}", "click", function(sym, e) {
sym.play('euzoomout');

sym.$("na_btn").show();
sym.$("natxt_sym").show();
sym.$("aus_btn").show();
sym.$("austxt_sym").show();
sym.$("asia_btn").show();
sym.$("asiatxt_sym").show();
sym.$("sa_btn").show();
sym.$("satxt_sym").show();
sym.$("af_btn").show();
sym.$("aftxt_sym").show();
sym.$("europe_btn").show();
sym.$("europetxt_sym").show();

});
//Edge binding end

























})("stage");
   //Edge symbol end:'stage'

//=========================================================
//Edge symbol: 'map_sym'
(function(symbolName) {













































})("map_sym");
   //Edge symbol end:'map_sym'

//=========================================================
//Edge symbol: 'europetxt_sym'
(function(symbolName) {
Symbol.bindTriggerAction(compId, symbolName, "Default Timeline", 571, function(sym, e) {
sym.stop();

});
//Edge binding end

Symbol.bindTriggerAction(compId, symbolName, "Default Timeline", 0, function(sym, e) {
sym.stop();

// Hide an Element.
//  (sym.$("name") resolves an Edge element name to a DOM
//  element that can be used with jQuery)
sym.$("europe_txt").css('text-shadow', '1px 1px 1px #FFF');

});
//Edge binding end













































})("europetxt_sym");
   //Edge symbol end:'europetxt_sym'

//=========================================================
//Edge symbol: 'natxt_sym'
(function(symbolName) {
Symbol.bindTriggerAction(compId, symbolName, "Default Timeline", 571, function(sym, e) {
sym.stop();

});
//Edge binding end

Symbol.bindTriggerAction(compId, symbolName, "Default Timeline", 0, function(sym, e) {
sym.stop();

// Hide an Element.
//  (sym.$("name") resolves an Edge element name to a DOM
//  element that can be used with jQuery)
sym.$("europe_txt").css('text-shadow', '1px 1px 1px #FFF');

});
//Edge binding end













































})("natxt_sym");
   //Edge symbol end:'natxt_sym'

//=========================================================
//Edge symbol: 'aftxt_sym'
(function(symbolName) {
Symbol.bindTriggerAction(compId, symbolName, "Default Timeline", 571, function(sym, e) {
sym.stop();

});
//Edge binding end

Symbol.bindTriggerAction(compId, symbolName, "Default Timeline", 0, function(sym, e) {
sym.stop();

// Hide an Element.
//  (sym.$("name") resolves an Edge element name to a DOM
//  element that can be used with jQuery)
sym.$("europe_txt").css('text-shadow', '1px 1px 1px #FFF');

});
//Edge binding end













































})("aftxt_sym");
   //Edge symbol end:'aftxt_sym'

//=========================================================
//Edge symbol: 'austxt_sym'
(function(symbolName) {
Symbol.bindTriggerAction(compId, symbolName, "Default Timeline", 571, function(sym, e) {
sym.stop();

});
//Edge binding end

Symbol.bindTriggerAction(compId, symbolName, "Default Timeline", 0, function(sym, e) {
sym.stop();

// Hide an Element.
//  (sym.$("name") resolves an Edge element name to a DOM
//  element that can be used with jQuery)
sym.$("europe_txt").css('text-shadow', '1px 1px 1px #FFF');

});
//Edge binding end













































})("austxt_sym");
   //Edge symbol end:'austxt_sym'

//=========================================================
//Edge symbol: 'asiatxt_sym'
(function(symbolName) {
Symbol.bindTriggerAction(compId, symbolName, "Default Timeline", 571, function(sym, e) {
sym.stop();

});
//Edge binding end

Symbol.bindTriggerAction(compId, symbolName, "Default Timeline", 0, function(sym, e) {
sym.stop();

// Hide an Element.
//  (sym.$("name") resolves an Edge element name to a DOM
//  element that can be used with jQuery)
sym.$("europe_txt").css('text-shadow', '1px 1px 1px #FFF');

});
//Edge binding end













































})("asiatxt_sym");
   //Edge symbol end:'asiatxt_sym'

//=========================================================
//Edge symbol: 'satxt_sym'
(function(symbolName) {
Symbol.bindTriggerAction(compId, symbolName, "Default Timeline", 571, function(sym, e) {
sym.stop();

});
//Edge binding end

Symbol.bindTriggerAction(compId, symbolName, "Default Timeline", 0, function(sym, e) {
sym.stop();

// Hide an Element.
//  (sym.$("name") resolves an Edge element name to a DOM
//  element that can be used with jQuery)
sym.$("europe_txt").css('text-shadow', '1px 1px 1px #FFF');

});
//Edge binding end













































})("satxt_sym");
   //Edge symbol end:'satxt_sym'

//=========================================================
//Edge symbol: 'asia_txt'
(function(symbolName) {
Symbol.bindTriggerAction(compId, symbolName, "Default Timeline", 571, function(sym, e) {
sym.stop();

});
//Edge binding end

Symbol.bindTriggerAction(compId, symbolName, "Default Timeline", 0, function(sym, e) {
sym.stop();

// Hide an Element.
//  (sym.$("name") resolves an Edge element name to a DOM
//  element that can be used with jQuery)
sym.$("europe_txt").css('text-shadow', '1px 1px 1px #FFF');

});
//Edge binding end













































})("asia_txt");
   //Edge symbol end:'asia_txt'

//=========================================================
//Edge symbol: 'asiagraph_sym'
(function(symbolName) {




Symbol.bindTriggerAction(compId, symbolName, "Default Timeline", 250, function(sym, e) {
sym.$("operapercent_txt").html("41.99%");
sym.$("nokiapercent_txt").html("27.67%");
sym.$("bbpercent_txt").html("8.24%");
sym.$("iospercent_txt").html("5.65%");
sym.$("netfrontpercent_txt").html("5.31%");
sym.$("otherpercent_txt").html("11.14%");

});
//Edge binding end







Symbol.bindTriggerAction(compId, symbolName, "Default Timeline", 0, function(sym, e) {
sym.stop();

});
//Edge binding end









Symbol.bindTriggerAction(compId, symbolName, "Default Timeline", 0, function(sym, e) {
sym.stop();

});
//Edge binding end

























})("asiagraph_sym");
   //Edge symbol end:'asiagraph_sym'

//=========================================================
//Edge symbol: 'mapwhole_sym'
(function(symbolName) {

















Symbol.bindElementAction(compId, symbolName, "${_source_txt}", "dblclick", function(sym, e) {


});
//Edge binding end

Symbol.bindElementAction(compId, symbolName, "${_source_txt}", "click", function(sym, e) {
// Navigate to a new URL in the current window
// (replace "_self" with another name for a new window)
window.open("http://gs.statcounter.com", "_blank");

});
//Edge binding end

Symbol.bindElementAction(compId, symbolName, "${_source_txt}", "mouseover", function(sym, e) {
});
//Edge binding end
















Symbol.bindElementAction(compId, symbolName, "${_edge_txt}", "dblclick", function(sym, e) {


});
//Edge binding end

Symbol.bindElementAction(compId, symbolName, "${_edge_txt}", "click", function(sym, e) {
// Navigate to a new URL in the current window
// (replace "_self" with another name for a new window)
window.open("http://labs.adobe.com/technologies/edge/", "_blank");

});
//Edge binding end

Symbol.bindElementAction(compId, symbolName, "${_edge_txt}", "mouseover", function(sym, e) {
});
//Edge binding end








})("mapwhole_sym");
   //Edge symbol end:'mapwhole_sym'

//=========================================================
//Edge symbol: 'otherico_sym'
(function(symbolName) {






































})("otherico_sym");
   //Edge symbol end:'otherico_sym'

//=========================================================
//Edge symbol: 'netfrontico_sym'
(function(symbolName) {






































})("netfrontico_sym");
   //Edge symbol end:'netfrontico_sym'

//=========================================================
//Edge symbol: 'appleico_sym'
(function(symbolName) {






































})("appleico_sym");
   //Edge symbol end:'appleico_sym'

//=========================================================
//Edge symbol: 'bbico_sym'
(function(symbolName) {






































})("bbico_sym");
   //Edge symbol end:'bbico_sym'

//=========================================================
//Edge symbol: 'nokiaico_sy'
(function(symbolName) {






































})("nokiaico_sy");
   //Edge symbol end:'nokiaico_sy'

//=========================================================
//Edge symbol: 'operaico_sym'
(function(symbolName) {






































})("operaico_sym");
   //Edge symbol end:'operaico_sym'

//=========================================================
//Edge symbol: 'afgraph_sym'
(function(symbolName) {




Symbol.bindTriggerAction(compId, symbolName, "Default Timeline", 250, function(sym, e) {
sym.$("operapercent_txt").html("68.34%");
sym.$("nokiapercent_txt").html("19.39%");
sym.$("bbpercent_txt").html("3.12%");
sym.$("iospercent_txt").html("3.62%");
sym.$("netfrontpercent_txt").html("1.78%");
sym.$("otherpercent_txt").html("4.66%");

});
//Edge binding end







Symbol.bindTriggerAction(compId, symbolName, "Default Timeline", 0, function(sym, e) {
sym.stop();

});
//Edge binding end









Symbol.bindTriggerAction(compId, symbolName, "Default Timeline", 0, function(sym, e) {
sym.stop();

});
//Edge binding end

























})("afgraph_sym");
   //Edge symbol end:'afgraph_sym'

//=========================================================
//Edge symbol: 'nagraph_sym'
(function(symbolName) {




Symbol.bindTriggerAction(compId, symbolName, "Default Timeline", 250, function(sym, e) {
sym.$("operapercent_txt").html("37.86%");
sym.$("nokiapercent_txt").html("26.35%");
sym.$("bbpercent_txt").html("21.97%");
sym.$("iospercent_txt").html("3.39%");
sym.$("netfrontpercent_txt").html("3.3%");
sym.$("otherpercent_txt").html("6.95%");

});
//Edge binding end







Symbol.bindTriggerAction(compId, symbolName, "Default Timeline", 0, function(sym, e) {
// Change an Element's contents.
//  (sym.$("name") resolves an Edge element name to a DOM
//  element that can be used with jQuery)
sym.$("operapercent_txt").html("41.99%");

});
//Edge binding end









Symbol.bindTriggerAction(compId, symbolName, "Default Timeline", 0, function(sym, e) {
sym.stop();

});
//Edge binding end

























})("nagraph_sym");
   //Edge symbol end:'nagraph_sym'

//=========================================================
//Edge symbol: 'sagraph_sym'
(function(symbolName) {




Symbol.bindTriggerAction(compId, symbolName, "Default Timeline", 250, function(sym, e) {
sym.$("operapercent_txt").html("35.48%");
sym.$("nokiapercent_txt").html("23.38%");
sym.$("bbpercent_txt").html("8.26%");
sym.$("iospercent_txt").html("6.88%");
sym.$("netfrontpercent_txt").html("8.96%");
sym.$("otherpercent_txt").html("17.04%");

});
//Edge binding end







Symbol.bindTriggerAction(compId, symbolName, "Default Timeline", 0, function(sym, e) {
// Change an Element's contents.
//  (sym.$("name") resolves an Edge element name to a DOM
//  element that can be used with jQuery)
sym.$("operapercent_txt").html("41.99%");

});
//Edge binding end









Symbol.bindTriggerAction(compId, symbolName, "Default Timeline", 0, function(sym, e) {
sym.stop();

});
//Edge binding end

























})("sagraph_sym");
   //Edge symbol end:'sagraph_sym'

//=========================================================
//Edge symbol: 'ocgraph_sym'
(function(symbolName) {




Symbol.bindTriggerAction(compId, symbolName, "Default Timeline", 250, function(sym, e) {
sym.$("operapercent_txt").html("66.69%");
sym.$("nokiapercent_txt").html("11.87%");
sym.$("bbpercent_txt").html("7.84%");
sym.$("iospercent_txt").html("7.26%");
sym.$("netfrontpercent_txt").html("3.47%");
sym.$("otherpercent_txt").html("2.87%");

});
//Edge binding end







Symbol.bindTriggerAction(compId, symbolName, "Default Timeline", 0, function(sym, e) {
// Change an Element's contents.
//  (sym.$("name") resolves an Edge element name to a DOM
//  element that can be used with jQuery)
sym.$("operapercent_txt").html("41.99%");

});
//Edge binding end









Symbol.bindTriggerAction(compId, symbolName, "Default Timeline", 0, function(sym, e) {
sym.stop();

});
//Edge binding end

























})("ocgraph_sym");
   //Edge symbol end:'ocgraph_sym'

//=========================================================
//Edge symbol: 'boltico_sym'
(function(symbolName) {






































})("boltico_sym");
   //Edge symbol end:'boltico_sym'

//=========================================================
//Edge symbol: 'androidico_sym'
(function(symbolName) {






































})("androidico_sym");
   //Edge symbol end:'androidico_sym'

//=========================================================
//Edge symbol: 'samsungico_sym'
(function(symbolName) {






































})("samsungico_sym");
   //Edge symbol end:'samsungico_sym'

//=========================================================
//Edge symbol: 'eugraph_sym'
(function(symbolName) {




Symbol.bindTriggerAction(compId, symbolName, "Default Timeline", 250, function(sym, e) {
sym.$("operapercent_txt").html("44.75%");
sym.$("nokiapercent_txt").html("16.79%");
sym.$("bbpercent_txt").html("12.46%");
sym.$("iospercent_txt").html("10.86%");
sym.$("netfrontpercent_txt").html("9%");
sym.$("otherpercent_txt").html("6.14%");

});
//Edge binding end







Symbol.bindTriggerAction(compId, symbolName, "Default Timeline", 0, function(sym, e) {
// Change an Element's contents.
//  (sym.$("name") resolves an Edge element name to a DOM
//  element that can be used with jQuery)
sym.$("operapercent_txt").html("41.99%");

});
//Edge binding end









Symbol.bindTriggerAction(compId, symbolName, "Default Timeline", 0, function(sym, e) {
sym.stop();

});
//Edge binding end

























})("eugraph_sym");
   //Edge symbol end:'eugraph_sym'

})(jQuery, AdobeEdge, "EDGE-341175953");