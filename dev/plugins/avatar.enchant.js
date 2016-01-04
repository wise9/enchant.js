/**
 * @fileOverview
 * avatar.enchant.js
 * @version 0.2 (2012/08/09)
 * @requires enchant.js v0.4.0 or later
 * @author shi3z/UEI Corporation
 *
 * @description
 * enchant.js extension for 9leap.net
 * Avatar character plugin for enchant.js with 9leap.net
 *
 * @example
 * var core = new Core(320, 320);
 * core.preload('avatarBg1.png', 'avatarBg2.png', 'avatarBg3.png', 'bigmonster1.gif');
 * core.onload = function(){
 *     core.rootScene.backgroundColor = "#000000";
 *     // show infinite scrolling background
 *     bg = new AvatarBG(0);
 *     bg.y = 50;
 *     core.rootScene.addChild(bg);
 *     
 *     // show monster
 *     monster = new AvatarMonster(core.assets['bigmonster1.gif']);
 *     monster.x = 200;
 *     monster.y = 100;
 *     core.rootScene.addChild(monster);
 *     
 *     // show avatar
 *     chara = new Avatar("2:2:1:2004:21230:22480");
 *     core.rootScene.addChild(chara);
 *     chara.scaleX = -1;
 *     chara.scaleY = 1;
 *     chara.x = 50;
 *     chara.y = 100;
 * };
 * core.start();
 */

/**
 * avatar namespace object
 * @type {Object}
 */
enchant.avatar = {};

/**
 * AvatarCharacter
 * Base class of enchant.Avatar and enchant.AvatarMonster
 * @scope enchant.avatar.AvatarCharacter.prototype
 */
enchant.avatar.AvatarCharacter = enchant.Class.create(enchant.Sprite, {
    /**
     * Constructor of AvatarCharacter
     * @constructs
     * @param width
     * @param height
     */
    initialize: function(width, height) {
        enchant.Sprite.call(this, width, height);
        this.right();

        /**
         * Name of animation pattern;
         * @type {String}
         */
        this.action = "stop";

        /**
         * Array of animation patterns
         * @type {Object}
         */
        this.animPattern = { "stop": [ 0]};

        /**
         * Frame number of animation
         * @type {Object}
         */
        this.animFrame = 0;
        this.addEventListener('enterframe', function() {
            if ((~~(this.age) & 0x03) !== 0)return;
            if (this.action) {
                var animPattern = this.animPattern[this.action];
                this.frame = animPattern[this.animFrame];
                this.animFrame++;
                if (animPattern[this.animFrame] === -1) {
                    this.animFrame = 0;
                    this.action = "stop";
                }
                if (animPattern[this.animFrame] === -2) {
                    this.parentNode.removeChild(this);
                }
                if (this.animFrame >= animPattern.length) {
                    this.animFrame = 0;
                }
            }
        });
    },

    /**
     * Flip to left
     */
    left: function() {
        this.scaleX = 1;
    },
    /**
     * Flip to right
     */
    right: function() {
        this.scaleX = -1;
    }
});


/**
 * AvatarMonster
 * subclass of enchant.avatar.AvatarCharacter
 * @scope enchant.avatar.AvatarMonster.prototype
 */
enchant.avatar.AvatarMonster = enchant.Class.create(enchant.avatar.AvatarCharacter, {
    /**
     * AvatarMonster
     * Manage a monter animations
     * @constructs
     * @param {image} Image of monster
     * @extends enchant.avatar.AvatarCharacter
     */
    initialize: function(image) {
        var w = ~~(image.width / 4);
        var h = w;
        enchant.avatar.AvatarCharacter.call(this, w, h);
        this.image = image;
        this.animPattern = { "stop": [ 4, 4, 4, 3, 3, 3],
            "walk": [ 2, 3, 4, 3],
            "appear": [ 0, 1, 7, 6, 5, 4, 2, 3, -1],
            "disappear": [ 3, 2, 4, 5, 6, 7, 1, 0, -2],
            "attack": [ 5, 4, 6, 6, 6, -1]
        };
        this.action = "attack";
        this.left();
    }
});

/**
 * AvatarBG
 * @scope enchant.AvatarBG.prototype
 */
enchant.avatar.AvatarBG = enchant.Class.create(enchant.Group, {
    /**
     * A class of infinite scrolling background.
     * @param mode {Number} 0 to 3
     * @constructs
     * @extends enchant.Group
     */
    initialize: function(mode) {
        enchant.Group.call(this);
        var core = enchant.Core.instance;

        this.veryfarbg = new enchant.Sprite(320, 51);
        this.veryfarbg.y = 0;
        this.veryfarbg.image = core.assets["avatarBg2.png"];
        this.veryfarbg.frame = mode;
        this.addChild(this.veryfarbg);
        this.farbgs = [];
        for (i = 0; i < 3; i++) {
            var bg = new enchant.Sprite(320, 32);
            bg.image = core.assets["avatarBg3.png"];
            bg.frame = mode;
            bg.x = i * 320 - 320;
            bg.y = 20;
            this.farbgs[this.farbgs.length] = bg;
            this.addChild(bg);
        }

        this.tiles = [];
        for (i = 0; i < 14; i++) {
            var tile = new enchant.Sprite(32, 128);
            tile.image = core.assets["avatarBg1.png"];
            tile.frame = mode;
            tile.x = i * 31 - 48;
            tile.y = 48;
            this.tiles[this.tiles.length] = tile;
            this.addChild(tile);
        }
    },
    /**
     * horizontal scrolling.
     * @param {int} x Offset of x coordinate.
     */
    scroll: function(x) {
        var dx = ~~(x / 2) % 320, ddx = ~~(x) % 32 * 2;
        for (i = 0; i < 14; i++) {
            this.tiles[i].x = i * 31 - ddx - 48;
        }
        for (i = 0; i < 3; i++) {
            this.farbgs[i].x = i * 320 - dx - 320;
        }
    }
});

/**
 * Avatar
 * @scope enchant.Avatar.prototype
 */
enchant.avatar.Avatar = enchant.Class.create(enchant.avatar.AvatarCharacter, {
    /**
     * @param {int}code  Avatar code
     * @extends enchant.avatar.AvatarCharacter
     * @constructs
     */
    initialize: function(code) {
        enchant.avatar.AvatarCharacter.call(this, 64, 64);
        if (code) {
            this.setCode(code);
        } else {
            this.gender = 1;
            this.hairstyle = 1;
            this.haircolor = 0;
            this.weapon = 2545;
            this.armor = 2135;
            this.headpiece = 0;
            this.loadImage();
        }
        this.animPattern = { "stop": [ 0],
            "run": [ 1, 2, 3, 2],
            "attack": [ 0, 2, 9, 10, 11, 5, 0, 0, 0, -1],
            "special": [ 0, 6, 5, 13, 14, 15, 0, 0, -1],
            "damage": [ 7, 7, 7, 7, 0, 0, 0, -1],
            "dead": [8],
            "demo": [ 1, 2, 3, 2, 1, 2, 3, 2, 1, 2, 3, 2, 1, 2, 3, 2, 1, 2, 3, 2, 1, 2, 3, 2, 0, 0, 0, 0, 2, 9, 10, 11, 5, 0, 0, 0,
                1, 2, 3, 2, 1, 2, 3, 2, 1, 2, 3, 2, 1, 2, 3, 2, 1, 2, 3, 2, 0, 6, 5, 13, 14, 15, 0, 0]
        };


    },
    /**
     * Reflesh avatar animation image
     */
    loadImage: function() {
        var ___EnchantAvatarServerURL = "http://9leap.net/meruru/draw/draw.php";
        this.opt = "gender=" + this.gender + "&job=0&hairstyle=" + this.hairstyle + "&haircolor=" + this.haircolor + "&weapon=" + this.weapon + "&armor=" + this.armor + "&headpiece=" + this.headpiece + "&invisible=0&x=0&y=0&w=4&h=4&dummy=.gif";
        this.src = ___EnchantAvatarServerURL + "?" + this.opt;
        (function(that) {
            var core = enchant.Core.instance;
            core.load(that.src, function() {
                that.image = core.assets[that.src];
            });
        })(this);
    },
    /**
     * Get avatar code from actual object
     * @return {String} code;
     */
    getCode: function() {
        return this.gender + ":" + this.hairstyle + ":" + this.haircolor + ":" +
            this.weapon + ":" + this.armor + ":" + this.headpiece;
    },
    /**
     * Set avatar code and reflesh avatar image.
     * @param {String} code
     */
    setCode: function(code) {
        data = code.split(":");
        this.gender = data[0];
        this.hairstyle = data[1];
        this.haircolor = data[2];
        this.weapon = data[3];
        this.armor = data[4];
        this.headpiece = data[5];
        this.loadImage();
    }
});
