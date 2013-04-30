/**
 * @scope enchant.LoadingScene.prototype
 */
enchant.LoadingScene = enchant.Class.create(enchant.Scene, {
    /**
     * @name enchant.LoadingScene.
     * @class
     * @constructs
     * @extends enchant.Scene
     * Default loading scene. If you want to use your own loading animation, overwrite (don't inherit) this class.
     * Referred from enchant.Core in default, as `new enchant.LoadingScene` etc.
     *
     * @usage
     * enchant.LoadingScene = enchant.Class.create(enchant.Scene, {
     *    initialize: function(){
     *        enchant.Scene.call(this);
     *        this.backgroundColor = 'red';
     *        // ...
     *        this.addEventListener('progress', function(e){
     *            progress = e.loaded / e.total;
     *        });
     *        this.addEventListener('enterframe', function(){
     *            // animation
     *        });
     *    }
     * });
     */
    initialize: function() {
        enchant.Scene.call(this);
        this.backgroundColor = '#000';
        var barWidth = this.width * 0.4 | 0;
        var barHeight = this.width * 0.05 | 0;
        var border = barWidth * 0.03 | 0;
        var bar = new enchant.Sprite(barWidth, barHeight);
        bar.disableCollection();
        bar.x = (this.width - barWidth) / 2;
        bar.y = (this.height - barHeight) / 2;
        var image = new enchant.Surface(barWidth, barHeight);
        image.context.fillStyle = '#fff';
        image.context.fillRect(0, 0, barWidth, barHeight);
        image.context.fillStyle = '#000';
        image.context.fillRect(border, border, barWidth - border * 2, barHeight - border * 2);
        bar.image = image;
        var progress = 0, _progress = 0;
        this.addEventListener('progress', function(e) {
            // avoid #167 https://github.com/wise9/enchant.js/issues/177
            progress = e.loaded / e.total * 1.0;
        });
        bar.addEventListener('enterframe', function() {
            _progress *= 0.9;
            _progress += progress * 0.1;
            image.context.fillStyle = '#fff';
            image.context.fillRect(border, 0, (barWidth - border * 2) * _progress, barHeight);
        });
        this.addChild(bar);
        this.addEventListener('load', function(e) {
            var core = enchant.Core.instance;
            core.removeScene(core.loadingScene);
            core.dispatchEvent(e);
        });
    }
});
