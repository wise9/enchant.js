/**
 * @fileOverview
 * Example for enchant.widget.LazyListView and enchant.widget.LazyListItem 
 * @version 0.0.1
 * @require enchant.js v0.8.3+
 * @author Kevin Kratzer (UEI Corporation)
 *
 * @description
 * Dynamically load the content of ListItems using the enchant.widget.LazyListItem and enchant.widget.LazyListView upon scrolling to enable the usage of large lists which might not be displayed completely.
 */

enchant();

var ImageListItem = enchant.Class.create(enchant.widget.LazyListItem, {
    initialize: function(width, height, imgUrl) {
        enchant.widget.LazyListItem.call(this, width, height);
        var preview = new enchant.Sprite(this.width, this.height);
        preview.originX = 0;
        preview.originY = 0;
        preview.maxWidth = this.width;
        preview.maxHeight = this.height;
        preview.imgUrl = imgUrl;
        this.content = preview;
    },
    loadResources: function() {
        var preview = this.content;
        console.log("The image for the ListItem", preview.imgUrl,"has been requested.");
        if(preview.image) return;
        enchant.Surface.load(preview.imgUrl, function() {
            console.log("\t* Loaded", preview.imgUrl);
            preview.width = this.width;
            preview.height = this.height;
            var scale = Math.min(preview.maxWidth/this.width, preview.maxHeight/this.height); 
            preview.scaleX = preview.scaleY = scale;
            preview.image = this;
        }, function() {
            console.log("\t* Load Error", preview.imgUrl);
            preview.image = null;
        });
    }
});

window.addEventListener("load", function() {
    var core = new enchant.Core(320, 320);
    core.preload({
        googleSearchResultsPageOne: "http://ajax.googleapis.com/ajax/services/search/images?v=1.0&imgsz=large&rsz=8&q=enchant.js",
        googleSearchResultsPageTwo: "http://ajax.googleapis.com/ajax/services/search/images?v=1.0&imgsz=large&rsz=8&start=8&q=enchant.js",
        googleSearchResultsPageThree: "http://ajax.googleapis.com/ajax/services/search/images?v=1.0&imgsz=large&rsz=8&start=16&q=enchant.js"
    });
    core.addEventListener("load", function() {
        // prepare result set, 8 images per page, 3 pages, 24 images, none preloaded.
        var resultsOne = JSON.parse(core.assets.googleSearchResultsPageOne).responseData.results;
        var resultsTwo = JSON.parse(core.assets.googleSearchResultsPageTwo).responseData.results;
        var resultsThree = JSON.parse(core.assets.googleSearchResultsPageThree).responseData.results;
        var results = resultsOne;
        Array.prototype.push.apply(results, resultsTwo);
        Array.prototype.push.apply(results, resultsThree);

        var lazyListView = new enchant.widget.LazyListView(320, 320, false);
        for(var i = 0, j = results.length; i < j; i++) {
            var item = new ImageListItem(lazyListView.width, lazyListView.height/2, results[i].url);
            lazyListView.addChild(item);
        }
        core.rootScene.addChild(lazyListView);
        
        
        /**
         * The above code showed how to initialze a LazyListView with many elements which will be initialized dynamically upon scrolling.
         * The following code demonstrates how to dynamically add new content to the LazyListView.
         * (The code contains redundant parts however, to make the example simple this is intended.) 
         */
        
        var itemFactory = function() {
            console.log("The LazyListView ran out of items to display. The enchant.Event.CONTENT_REQUESTED event has been dispatched to trigger the creation of new items");
            lazyListView.removeEventListener(enchant.Event.CONTENT_REQUESTED, itemFactory); // avoid double updates
            if(!this._pageIndex) {
                this._pageIndex = 0;
            }
            var newRequestUrl =  "http://ajax.googleapis.com/ajax/services/search/images?v=1.0&imgsz=large&rsz=8&start=" + this._pageIndex*8 + "&q=enchant.js+OR+Ubiquitous+Entertainment+Inc.+OR+enchant.js+Inc.+OR+enchantMOON";
            console.log("\t* Searching for Images (page:", this._pageIndex, ")");
            core.load(newRequestUrl, function() {
                console.log("\t* Search Completed -> Adding new Items");
                lazyListView.addEventListener(enchant.Event.CONTENT_REQUESTED, itemFactory);
                var newResults = JSON.parse(core.assets[newRequestUrl]).responseData.results;
                for(var i = 0, j = newResults.length; i < j; i++) {
                    var item = new ImageListItem(lazyListView.width, lazyListView.height/2, newResults[i].url);
                    lazyListView.addChild(item);
                }
                // update complete, enable update again
                lazyListView.addEventListener(enchant.Event.CONTENT_REQUESTED, itemFactory);
            }, function() {
                console.log("\t* Search Produced Error");
                // error enable update again
                lazyListView.addEventListener(enchant.Event.CONTENT_REQUESTED, itemFactory);
            });
            this._pageIndex++;
        }
        
        lazyListView.addEventListener(enchant.Event.CONTENT_REQUESTED, itemFactory);
    });
    core.start();
});
