(function() {

    var point2AABB2 = function(p, aabb) {
        var ppx = p.x + p.parent.x;
        var ppy = p.y + p.parent.y;
        var ppz = p.z + p.parent.z;
        var px = aabb.parent.x + aabb.x + aabb.scaleX;
        var py = aabb.parent.y + aabb.y + aabb.scaleY;
        var pz = aabb.parent.z + aabb.z + aabb.scaleZ;
        var nx = aabb.parent.x + (aabb.x - aabb.scaleX);
        var ny = aabb.parent.y + (aabb.y - aabb.scaleY);
        var nz = aabb.parent.z + (aabb.z - aabb.scaleZ);
        var dist = 0;
        if (ppx < nx) {
            dist += (ppx - nx) * (ppx - nx);
        } else if (px < ppx) {
            dist += (ppx - px) * (ppx - px);
        }
        if (ppy < ny) {
            dist += (ppy - ny) * (ppy - ny);
        } else if (py < ppy) {
            dist += (ppy - py) * (ppy - py);
        }
        if (ppz < nz) {
            dist += (ppz - nz) * (ppz - nz);
        } else if (pz < ppz) {
            dist += (ppz - pz) * (ppz - pz);
        }
        return dist;
    };
    var AABB2AABB2 = function(aabb1, aabb2) {
        var px1 = aabb1.parent.x + aabb1.x + aabb1.scale;
        var py1 = aabb1.parent.y + aabb1.y + aabb1.scale;
        var pz1 = aabb1.parent.z + aabb1.z + aabb1.scale;

        var nx1 = aabb1.parent.x + (aabb1.x - aabb1.scale);
        var ny1 = aabb1.parent.y + (aabb1.y - aabb1.scale);
        var nz1 = aabb1.parent.z + (aabb1.z - aabb1.scale);

        var px2 = aabb2.parent.x + aabb2.x + aabb2.scaleX;
        var py2 = aabb2.parent.y + aabb2.y + aabb2.scaleY;
        var pz2 = aabb2.parent.z + aabb2.z + aabb2.scaleZ;

        var nx2 = aabb2.parent.x + (aabb2.x - aabb2.scaleX);
        var ny2 = aabb2.parent.y + (aabb2.y - aabb2.scaleY);
        var nz2 = aabb2.parent.z + (aabb2.z - aabb2.scaleZ);
        return ((nx2 <= px1) && (nx1 <= px2) && (ny2 <= py1) && (ny1 <= py2)
                && (nz2 <= pz1) && (nz1 <= pz2)) ? 0.0 : 1.0;
    };
    var AABB22AABB2 = function(aabb1, aabb2) {
        var px1 = aabb1.parent.x + aabb1.x + aabb1.scaleX;
        var py1 = aabb1.parent.y + aabb1.y + aabb1.scaleY;
        var pz1 = aabb1.parent.z + aabb1.z + aabb1.scaleZ;

        var nx1 = aabb1.parent.x + (aabb1.x - aabb1.scaleX);
        var ny1 = aabb1.parent.y + (aabb1.y - aabb1.scaleY);
        var nz1 = aabb1.parent.z + (aabb1.z - aabb1.scaleZ);

        var px2 = aabb2.parent.x + aabb2.x + aabb2.scaleX;
        var py2 = aabb2.parent.y + aabb2.y + aabb2.scaleY;
        var pz2 = aabb2.parent.z + aabb2.z + aabb2.scaleZ;

        var nx2 = aabb2.parent.x + (aabb2.x - aabb2.scaleX);
        var ny2 = aabb2.parent.y + (aabb2.y - aabb2.scaleY);
        var nz2 = aabb2.parent.z + (aabb2.z - aabb2.scaleZ);
        return ((nx2 <= px1) && (nx1 <= px2) && (ny2 <= py1) && (ny1 <= py2)
                && (nz2 <= pz1) && (nz1 <= pz2)) ? 0.0 : 1.0;
    };

    enchant.gl.collision.Bounding.prototype.intersect = function(another) {
        switch (another.type) {
        case 'point':
            return (this.toBounding(another) < this.threshold);
        case 'BS':
            return (this.toBS(another) < this.threshold);
        case 'AABB':
            return (this.toAABB(another) < this.threshold);
        case 'OBB':
            return (this.toOBB(another) < this.threshold);
        case 'AABB2':
            return (this.toAABB2(another) < this.threshold);
        default:
            return false;
        }
    };
    enchant.gl.collision.Bounding.prototype.toAABB2 = function(another) {
        return point2AABB2(this, another);
    };
    enchant.gl.collision.BS.prototype.toAABB2 = function(another) {
        return (point2AABB2(this, another) - this.radius * this.radius);
    };
    enchant.gl.collision.AABB.prototype.toAABB2 = function(another) {
        return AABB2AABB2(this, another);
    };
    enchant.gl.collision.OBB.prototype.toAABB2 = function(another) {
        return 1;
    };

    /**
     * @scope enchant.gl.collision.AABB2.prototype
     */
    enchant.gl.collision.AABB2 = enchant.Class.create(enchant.gl.collision.Bounding, {
        /**
         [lang:ja]
         * Sprite3Dの衝突判定を設定するクラス.
         * 回転しない直方体として定義されている.
         * @constructs
         * @see enchant.gl.collision.Bounding
         [/lang]
         [lang:en]
         * Class that sets Sprite3D collision detection.
         * Defined as non-rotating box.
         * @constructs
         * @see enchant.gl.collision.Bounding
         [/lang]
         */
        initialize : function() {
            enchant.gl.collision.Bounding.call(this);
            this.type = 'AABB2';
            this.scaleX = 0.5;
            this.scaleY = 0.5;
            this.scaleZ = 0.5;
        },
        toBounding : function(another) {
            return point2AABB2(another, this);
        },
        toBS : function(another) {
            return (point2AABB2(another, this) - another.radius
                    * another.radius);
        },
        toAABB : function(another) {
            return AABB2AABB2(this, another);
        },
        toAABB2 : function(another) {
            return AABB22AABB2(this, another);
        },
        toOBB : function(another) {
            return 1;
        }
    });

})();
