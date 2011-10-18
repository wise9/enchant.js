/******************************************************************************
 *
 * TMX maps loader engine.
 * Loads maps made with Tiled Map Editor.
 * See http://www.mapeditor.org
 *
 * This work is licensed under GNU Lesser GPL License.
 * License: http://www.gnu.org/licenses/lgpl.html
 * Version: 1.0
 * Author:  Javier de la Dehesa, 2011
 * Mail:    javidcf at gmail dot com
 *
 ******************************************************************************
 *
 * FEATURES
 * · Multiple layer TMX maps.
 * · Asynchronous behaviour.
 * · CSV format support.
 * · External or internal TSX tileset information.
 * · One tileset without transparent key color.
 * · Advanced blocking information (tile level and border level).
 * · Binding between map entities (not tile-entities) and game objects.
 * · Tile animations (tested with Google Chrome).
 * · Layer visibility and opacity tuning.
 *
 ******************************************************************************
 *
 * TODO
 * · Review animation handler and test it on other browsers.
 * · Base64 encoding support.
 * · Compressed encoding support (hard).
 * · Transparent key color support for tilesets (hard).
 * · Several tilesets support (hard).
 * · Tile-entities support (does it make sense in this context?).
 *
 ******************************************************************************
 *
 * USAGE
 *
 * · This plugin is intended to be used along with Tiled Map Editor. Visit
 * http://www.mapeditor.org to find information about it and get the last
 * version of the software.
 *
 * · The plugin uses AJAX petitions to do asynchronous loading. Firefox allows
 * to use AJAX with local files, but other browsers like Chrome and Opera do
 * not, so it is necessary to use at least some minimal development server.
 * Java Mini Web Server (http://www.jibble.org/miniwebserver/) is a good
 * multiplatform solution.
 *
 * · Each tile can hold a "block" property detailing its desired
 * blocking behaviour. Possible blocking data values are:
 *   - "none"   -> Tile does not block.
 *   - "always" -> Tile blocks.
 *   - "north"  -> Tile does not allow to go through its north border.
 *   - "east"   -> Tile does not allow to go through its east border.
 *   - "south"  -> Tile does not allow to go through its south border.
 *   - "west"   -> Tile does not allow to go through its west border.
 * Several restrictions can be added separated by commas; for example,
 * an upper left corner should be "west,north". Restrictions are
 * cumulative, so, for example, "west,always" would be the same as
 * "always" and "east,none,north" would be the same as "east,north".
 *
 * · Tile blocking information is useful in combination with the "moveTest"
 * method. This method checks if a movement is allowed for the a given hit box.
 * The origin coordinates correspond to the upper left corner of the object and
 * the hit box represent its collision area given as "x", "y", "width" and
 * "height", positioned by its upper left corner with respect to the object
 * upper left corner. If no hit box is given, a tile box at the upper left
 * corner of the object will be used.
 * This method checks if the movement is allowed taking account of blocking
 * information of every enabled layer in the map.
 *
 * · Map layers may have also a "block" property with one of the following
 * values:
 *   - "never"   : Tiles in this layer never block.
 *   - "always"  : Tiles in this layer always block.
 *   - "tileset" : Tiles in this layer block as it is indicated by the tileset.
 * Note that "never" and "always" override any blocking information associated
 * to a tile.
 * This property cannot be changed in runtime.
 *
 * · Map layers opacity and visibility may be changed with Tiled Map Editor
 * controls. These settings will take effect in the map appearance in the game.
 * To change this values during runtime, "visible" and "opacity" properties can
 * be tuned after retrieving the layer with the "getLayer" method.
 * Note that an invisible map layer still has effect on blocking. To avoid this
 * use the "disableLayer" method (which is also valid for objects layers).
 *
 * · Every layer can be disabled adding an "enable" property set to "false".
 * This property can be set during runtime through the methods "enableLayer",
 * "disableLayer" and "toggleLayer".
 *
 * · Tile animations are described with several properties. Main property is
 * "animationSequence" in a tile, which describes the animation loop as a comma
 * separated sequence of frames given by the offset to the current tile; thus,
 * "0,1,-2" would mean a repeating sequence starting with the tile itself,
 * then the following tile and then the tile situated two positions before the
 * base tile. Notice that it is not necessary to use the base tile in the
 * animation.
 * As a shortcut, the animation sequence can be defined with an
 * "animationLength" property set to positive integer, say n, which will mean a
 * sequence starting in the tile and followed by the n-1 next tiles.
 * By default the blocking information of the tile is always the same as the
 * base tile, but if the tile has an "animateBlock" property set to "true" the
 * blocking information will be set to the current tile's in the animation.
 * This feature should be handled with care by the objects over the map.
 * Animation can be disabled at tile, layer and map level with an "animate"
 * property set to "false". Animation must be enabled at every level to work.
 * This "animate" property can be set during runtime at map level and at layer
 * level after retrieving the layer with the "getLayer" method.
 * Animation speed is set to an arbitrary value of 10 game frames by animation
 * frame. This value can be tuned at tile, layer and map level with an
 * "animationFrames" property set to a positive integer, having the highest
 * priority the layer, then the map and then the tile (tilesets can be shared
 * between different maps, so they are in some way more general than maps and
 * layers). As before, this "animateFrames" property can be set during runtime
 * at map and layer level.
 *
 * · Entities in objects layers can be bound to game objects through method
 * "addNodeByName", which will add the node to the map and position it in the
 * entity position. If the node has a "hitBox" property with "x" and "y"
 * values, it will be positioned so this hit box is at the entity coordinates.
 *
 * · TMXMapLoader class allows to define the way that loaded maps should be
 * treated. It allows to add handlers to be executed at different moments of
 * the loading process: before loading the map, with "addOnPreloadHandler",
 * after the map is loaded but before the loading callback is executed, with
 * "addOnLoadingHandler", and after the map is loaded and the loading callback
 * is executed, with "addOnLoadedHandler".
 * Besides, it allows to associate entity names and entity types to game
 * instances and classes respectively with the methods "bindName" and
 * "bindType". Every time a map is loaded every instance associated to a name
 * held by an entity in the map will be put in there, and for every entity with
 * a type associated to a class a new instance of it will be created and put in
 * there (unless the entity name was bound to an instance). Constructors of the
 * new instances will receive a single parameter corresponding to the entity
 * information: "name", "type", "x", "y", "width", "height" and a "properties"
 * key/value collection corresponding to defined entity properties.
 *
 * · Every layer in the map must have a different name (even if they do not
 * have the same type). In the same way, every instance in the map must have a
 * different name (even if the are not in the same layer). A layer and an
 * instance may have the same name. Both of these restrictions are case
 * insensitive.
 *
 * · Names of properties used by the engine are case sensitive, but values are
 * not.
 *
 *****************************************************************************/

/**
 * @scope enchant.TMX
 */
enchant.TMX = {

  /**
   * Transforms XML data to JSON.
   * This work is licensed under Creative Commons GNU LGPL License.
   * License: http://www.gnu.org/licenses/lgpl-2.1.html
   * Version: 0.9
   * Author:  Stefan Goessner/2006
   * Web:     http://goessner.net/
   * @param {XMLDocument} xml XML document to parse.
   * @param {String} tab Tabulator string. Space by default.
   */
  xml2json : function(xml, tab) {
    tab = tab || " ";
    var X = {
      toObj: function(xml, num) {
        num = parseInt(num) || 0;
        var o = { };
        o["#"] = num;
        if (xml.nodeType==1) {   // element node ..
          if (xml.attributes.length)   // element with attributes  ..
            for (var i=0; i<xml.attributes.length; i++)
              o["@"+xml.attributes[i].nodeName] = (xml.attributes[i].nodeValue||"").toString();
          if (xml.firstChild) { // element has child nodes ..
            var textChild=0, cdataChild=0, hasElementChild=false;
            for (var n=xml.firstChild; n; n=n.nextSibling) {
              if (n.nodeType==1) hasElementChild = true;
              else if (n.nodeType==3 && n.nodeValue.match(/[^ \f\n\r\t\v]/)) textChild++; // non-whitespace text
              else if (n.nodeType==4) cdataChild++; // cdata section node
            }
            if (hasElementChild) {
              if (textChild < 2 && cdataChild < 2) { // structured element with evtl. a single text or/and cdata node ..
                X.removeWhite(xml);
                var elementChild = 0;
                for (var n=xml.firstChild; n; n=n.nextSibling) {
                  if (n.nodeType == 3)  // text node
                    o["#text"] = X.escape(n.nodeValue);
                  else if (n.nodeType == 4)  // cdata node
                    o["#cdata"] = X.escape(n.nodeValue);
                  else {
                    if (o[n.nodeName]) {  // multiple occurence of element ..
                      if (o[n.nodeName] instanceof Array) {
                        o[n.nodeName][o[n.nodeName].length] = X.toObj(n, elementChild);
                      } else {
                        o[n.nodeName] = [o[n.nodeName], X.toObj(n, elementChild)];
                      }
                    } else {  // first occurence of element..
                      o[n.nodeName] = X.toObj(n, elementChild);
                    }
                    elementChild++;
                  }
                }
              } else { // mixed content
                if (!xml.attributes.length)
                  o = X.escape(X.innerXml(xml));
                else
                  o["#text"] = X.escape(X.innerXml(xml));
              }
            } else if (textChild) { // pure text
              if (!xml.attributes.length)
                o = X.escape(X.innerXml(xml));
              else
                o["#text"] = X.escape(X.innerXml(xml));
            } else if (cdataChild) { // cdata
              if (cdataChild > 1)
                o = X.escape(X.innerXml(xml));
              else
                for (var n=xml.firstChild; n; n=n.nextSibling)
                  o["#cdata"] = X.escape(n.nodeValue);
            }
          }
          if (!xml.attributes.length && !xml.firstChild) o = null;
        } else if (xml.nodeType==9) { // document.node
          o = X.toObj(xml.documentElement);
        } else
          alert("unhandled node type: " + xml.nodeType);
          return o;
      },
      toJson: function(o, name, ind) {
        var json = name ? ("\""+name+"\"") : "";
        if (o instanceof Array) {
          for (var i=0,n=o.length; i<n; i++)
             o[i] = X.toJson(o[i], "", ind+"\t");
          json += (name?":[":"[") + (o.length > 1 ? ("\n"+ind+"\t"+o.join(",\n"+ind+"\t")+"\n"+ind) : o.join("")) + "]";
        } else if (o == null)
          json += (name&&":") + "null";
        else if (typeof(o) == "object") {
          var arr = [];
          for (var m in o)
             arr[arr.length] = X.toJson(o[m], m, ind+"\t");
          json += (name?":{":"{") + (arr.length > 1 ? ("\n"+ind+"\t"+arr.join(",\n"+ind+"\t")+"\n"+ind) : arr.join("")) + "}";
        } else if (typeof(o) == "string")
          json += (name&&":") + "\"" + o.toString() + "\"";
        else
          json += (name&&":") + o.toString();
        return json;
      },
      innerXml: function(node) {
        var s = ""
        if ("innerHTML" in node)
          s = node.innerHTML;
        else {
          var asXml = function(n) {
            var s = "";
            if (n.nodeType == 1) {
              s += "<" + n.nodeName;
              for (var i=0; i<n.attributes.length;i++)
                s += " " + n.attributes[i].nodeName + "=\"" + (n.attributes[i].nodeValue||"").toString() + "\"";
              if (n.firstChild) {
                s += ">";
                for (var c=n.firstChild; c; c=c.nextSibling)
                  s += asXml(c);
                s += "</"+n.nodeName+">";
              } else
                s += "/>";
            } else if (n.nodeType == 3)
              s += n.nodeValue;
            else if (n.nodeType == 4)
              s += "<![CDATA[" + n.nodeValue + "]]>";
            return s;
          };
          for (var c=node.firstChild; c; c=c.nextSibling)
            s += asXml(c);
        }
        return s;
      },
      escape: function(txt) {
        return txt.replace(/[\\]/g, "\\\\")
                  .replace(/[\"]/g, '\\"')
                  .replace(/[\n]/g, '\\n')
                  .replace(/[\r]/g, '\\r');
      },
      removeWhite: function(e) {
        e.normalize();
        for (var n = e.firstChild; n; ) {
          if (n.nodeType == 3) {  // text node
            if (!n.nodeValue.match(/[^ \f\n\r\t\v]/)) { // pure whitespace text node
              var nxt = n.nextSibling;
              e.removeChild(n);
              n = nxt;
            } else
              n = n.nextSibling;
          } else if (n.nodeType == 1) {  // element node
            X.removeWhite(n);
            n = n.nextSibling;
          } else                      // any other node
            n = n.nextSibling;
        }
        return e;
      }
    };
    if (xml.nodeType == 9) // document node
      xml = xml.documentElement;
    var json = X.toJson(X.toObj(X.removeWhite(xml)), xml.nodeName, "\t");
    return "{\n" + tab + (tab ? json.replace(/\t/g, tab) : json.replace(/\t|\n/g, "")) + "\n}";
  },

  /**
   * Get blocking type codes for tiles.
   * Supported blocking types are "none", "north", "east", "south", "west" and "always".
   *
   * @param {String} type Blocking type.
   * @return {Number} Code of the blocking type.
   */
  blockType : function(type)
  {
    type = type.toLowerCase();
    switch (type) {
      case "none"   : return parseInt("0000", 2);
      case "north"  : return parseInt("0001", 2);
      case "east"   : return parseInt("0010", 2);
      case "south"  : return parseInt("0100", 2);
      case "west"   : return parseInt("1000", 2);
      case "always" : return parseInt("1111", 2);
      default       : return 0;
    }
  },

  /**
   * Transforms CSV matrix to numeric matrix.
   *
   * @param {String} csv Map data in CSV format.
   */
  parseCSV : function(csv) {
    // split in rows
    var dataRows = csv.split("\n").filter(function(row) { return row !== ""; });
    // parse rows
    var matrix = dataRows.map(function(dataRow, iRow) {
      // split in cells
      var dataCells = dataRow.split(",").filter(function(cell) { return cell !== ""; });
      // parse cells
      var row = dataCells.map(function(cell, iCell) {
        // get tile number
        var tileNumber = parseInt(cell)
        // return tile number without offset
        return tileNumber;
      });
      return row;
    });
    return matrix;
  },

  /**
   * @scope enchant.TMX.TMXMap.prototype
   */
  TMXMap : enchant.Class.create(enchant.Group, {
    /**
     * Load TMX map at given URL.
     *
     * @param {String} url URL of the TMX map.
     * @param {Function(map:enchant.TMX.TMXMap)} callback Callback to execute when map is loaded.
     * @param {*} context Context where the callback is executed. By default the new object.
     * @construct
     * @extends enchant.Group
     */
    initialize : function(url, callback, context) {
      // call superclass constructor
      enchant.Group.call(this);

      // utility functions
      var ensureArray = function(obj) {
        if (obj) {
          if (Array.isArray(obj)) {
            return obj;
          } else {
            return [obj];
          }
        } else {
          return new Array();
        }
      };
      var trim = function(str) {
        return str.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
      };

      var game = enchant.Game.instance;
      // split url
      var index = url.lastIndexOf('/');
      if (index > 0) {
        this._basePath = url.slice(0, index + 1);
        this._fileName = url.slice(index + 1);
      } else {
        this._basePath = "./";
        this._fileName = url;
      }
      // this reference
      var tmxMap = this;

      // get map
      var ajaxMap;
      if (XMLHttpRequest) {
        ajaxMap = new XMLHttpRequest();
        if (ajaxMap.overrideMimeType) {
          ajaxMap.overrideMimeType("text/xml");
        }
      } else {
        ajaxMap = new ActiveXObject("Microsoft.XMLHTTP");
      }
      // process TMX file
      ajaxMap.onreadystatechange = function () {
        // map received
        if (ajaxMap.readyState === 4) {
          // get TMX data
          var tmx = eval("(" + enchant.TMX.xml2json(ajaxMap.responseXML) + ")").map;
          if (!tmx["@orientation"]
            || tmx["@orientation"].toLowerCase() !== "orthogonal") {
            throw new Error("TMX map orientation must be orthogonal.");
          }
          if (ensureArray(tmx.tileset).length > 1) {
            throw new Error("TMX map cannot contain more than one tileset.");
          }
          tmxMap._tileWidth = parseInt(tmx["@tilewidth"]);
          tmxMap._tileHeight = parseInt(tmx["@tileheight"]);
          tmxMap._columns = parseInt(tmx["@width"]);
          tmxMap._rows = parseInt(tmx["@height"]);
          // get properties
          tmxMap._properties = { };
          if (tmx.properties) {
            var property = ensureArray(tmx.properties.property);
            property.forEach(function(prop) {
              tmxMap._properties[trim(prop["@name"])] = trim(prop["@value"]);
            });
          }
          // set animation
          tmxMap._animate = !(tmxMap._properties.animate
            && trim(tmxMap._properties.animate.toLowerCase()) === "false");
          /**
           * Animation default number of frames per tile.
           * @type {Number}
           */
          tmxMap.animationFrames = parseInt(tmxMap._properties.animationFrames) | 0;

          // define function to process when tileset is retrieved
          var processTSX = function() {
            // get image URL
            tsxURL =
              tsxBasePath + tsx.image["@source"];
            // transparent color not supported
            if (tsx.image["@trans"]) {
              throw new Error("TMX map cannot use tilesets with transparent color.");
            }
            // load image
            game.load(tsxURL, function() {
              // get tile properties and animation information
              tmxMap._tileProperties = { };
              tmxMap._animation = { };
              var tiles = ensureArray(tsx.tile);
              // for each tile
              tiles.forEach(function(tile) {
                // get properties
                var properties = { };
                if (tile.properties) {
                  var property = ensureArray(tile.properties.property);
                  property.forEach(function(prop) {
                    properties[trim(prop["@name"])] = trim(prop["@value"]);
                  });
                }
                // assign properties to tile
                tmxMap._tileProperties[tile["@id"]] = properties;
                // parse animation information if any
                if (properties.animationSequence || properties.animationLength) {
                  var animationSequence = new Array();
                  // try with sequence first
                  if (properties.animationSequence) {
                    animationSequence = properties.animationSequence.split(",").filter(function(e) {
                      return e !== "";
                    }).map(function(e) {
                      return parseInt(e) || 0;
                    });
                  } else if (animationSequence.length === 0 && properties.animationLength) {
                    // try with length
                    var animationLength = Math.max(parseInt(properties.animationLength) | 0, 0);
                    for (var i = 0; i < animationLength; i++) {
                      animationSequence.push(i);
                    }
                  }
                  // if animation information was found
                  if (animationSequence.length > 0) {
                    var animationData = {
                      sequence : animationSequence,
                      animationFrames : Math.max(parseInt(properties.animationFrames) | 0, 0),
                      enabled : !(properties.animate
                        && trim(properties.animate.toLowerCase()) === "false"),
                      animateBlock : !!(properties.animateBlock
                        && trim(properties.animateBlock.toLowerCase()) === "true")
                    };
                    tmxMap._animation[tile["@id"]] = animationData;
                  }
                }
              });
              // function to get tile blocking info
              var getBlocking = function(tile) {
                // if there is blocking data
                if (tmxMap._tileProperties[tile]
                  && tmxMap._tileProperties[tile].block) {
                  var blockString = tmxMap._tileProperties[tile].block;
                  // parse block string
                  return blockString.split(",").map(function(blockStr) {
                    return enchant.TMX.blockType(trim(blockStr)) || 0;
                  }).reduce(function(cum, current) {
                    return cum | current;
                  }, 0);
                } else {  // otherwise default to non blocking
                  return enchant.TMX.blockType("none");
                }
              };

              // retrieve layers
              var layers = ensureArray(tmx.layer);

              // create a map for each layer
              tmxMap._maps = [];
              layers.forEach(function(layer) {
                // parse layer (only CSV now)
                var mapData;
                switch (layer.data["@encoding"].toLowerCase()) {
                  case "csv":
                    mapData = enchant.TMX.parseCSV(layer.data["#text"])
                    break;
                  default:
                    throw new Error("TMX map must be enconded in CSV format.");
                }
                // correct offset
                mapData = mapData.map(function(row) {
                  return row.map(function(cell) {
                    return cell - tmxMap._firstGID;
                  });
                });

                // create map object
                var map = new Map(tmxMap._tileWidth, tmxMap._tileHeight);
                map.image = game.assets[tsxURL];
                map.loadData(mapData);
                // put name
                map.name = layer["@name"] || "";
                tmxMap._maps.forEach(function(otherMap) {
                  if (map.name.toLowerCase() === otherMap.name.toLowerCase()) {
                    throw new Error("TMX map layers names have different names( " + map.name + ").");
                  }
                });
                // add visibility
                map.visible = parseInt(layer["@visible"]) !== 0;
                // add opacity
                map.opacity = parseFloat(layer["@opacity"]) || 1;
                // add layer properties to map
                map.properties = { };
                if (layer.properties) {
                  var property = ensureArray(layer.properties.property);
                  property.forEach(function(prop) {
                    map.properties[prop["@name"]] = prop["@value"];
                  });
                }
                // enabled data
                map._enable = !(map.properties.enable
                  && trim(map.properties.enable.toLowerCase()) === "false");

                // map collision type
                map._blockType = trim((map.properties.block || "tileset").toLowerCase());
                // create collision data
                map.collisionData = mapData.map(function(row) {
                  return row.map(function(cell) {
                    switch (map._blockType) {
                      case "never":
                        return enchant.TMX.blockType("none");
                        break;
                      case "always":
                        if (cell >= 0) return enchant.TMX.blockType("always");
                        else return enchant.TMX.blockType("none");
                        break;
                      default:
                        return getBlocking(cell);
                    }
                  });
                });

                // set animation
                map.animate = !(map.properties.animate
                  && trim(map.properties.animate.toLowerCase()) === "false");
                map.animationFrames = parseInt(map.properties.animationFrames) || 0;
                // create animation data
                map._animation = mapData.map(function(row) {
                  return row.map(function(cell) {
                    // for animated tiles
                    if (tmxMap._animation[cell]) {
                      return {
                        baseTile : cell,
                        currentFrame : 0,
                        frameCount : 0
                      };
                    } else {
                      return null;
                    }
                  });
                });
                // set animation handler
                map.addEventListener("enterframe", function() {
                  // if map animation is enabled
                  if (tmxMap._animate && map.animate) {
                    map._animation.forEach(function(row, iRow) {
                      row.forEach(function(cell, iCell) {
                        // for every animated tile
                        if (cell) {
                          var animation = tmxMap._animation[cell.baseTile];
                          // if animation is enabled
                          if (animation.enabled) {
                            // update frame counter
                            var animationFrames = map.animationFrames || tmxMap.animationFrames
                              || animation.animationFrames || 10;
                            cell.frameCount = (cell.frameCount + 1) % animationFrames;
                            if (cell.frameCount === 0) {
                              // update frame
                              cell.currentFrame = (cell.currentFrame + 1) % animation.sequence.length;
                              var currentTile = cell.baseTile + animation.sequence[cell.currentFrame];
                              map._data[0][iRow][iCell] = currentTile;
                              // update blocking info if applies
                              if (animation.animateBlock && map._blockType !== "always"
                                && map._blockType !== "never") {
                                map.collisionData[iRow][iCell] = getBlocking(currentTile);
                              }
                              // TODO works weird on Firefox
                              // redraw if tile is within bounds
                              var w = tmxMap._tileWidth; var h = tmxMap._tileHeight;
                              var x = w * iCell + map._offsetX; var y = h * iRow + map._offsetY;
                              if (x + w >= 0 && x < game.width && y + h >= 0 && y < game.height) {
                                map.redraw(x, y, w, h);
                              }
                            }
                          }
                        }
                      });
                    });
                  }
                });

                // insert into maps array
                tmxMap._maps[layer["#"]] = map;
              });

              // retrieve object groups (entity layers)
              var objectGroups = ensureArray(tmx.objectgroup);
              tmxMap._entities = { };
              tmxMap._groups = [];

              objectGroups.forEach(function(objectGroup) {
                // save group entities
                var objects = ensureArray(objectGroup.object);
                objects.forEach(function(object) {
                  // tile entities are not supported
                  if (object["@gid"]) {
                    throw new Error("TMX map cannot contain tile objects.");
                  }
                  var entity = { };
                  entity._layer = objectGroup["#"];
                  entity.name = trim(object["@name"] || "");
                  entity.type = trim(object["@type"] || "");
                  // location data
                  entity.width = parseInt(object["@width"]) || 0;
                  entity.height = parseInt(object["@height"]) || 0;
                  entity.x = parseInt(object["@x"]) || 0;
                  entity.y = parseInt(object["@y"]) || 0;
                  // align to grid
                  entity.x = entity.x - (entity.x % tmxMap._tileWidth);
                  entity.y = entity.y - (entity.y % tmxMap._tileHeight);
                  // add properties
                  entity.properties = { };
                  if (object.properties) {
                    var property = ensureArray(object.properties.property);
                    property.forEach(function(prop) {
                      entity.properties[trim(prop["@name"])] = trim(prop["@value"]);
                    });
                  }
                  // node associated with the entity
                  entity.node = null;
                  // entities must have different name even in different layers
                  if (tmxMap._entities[entity.name.toLowerCase()]) {
                    throw new Error("TMX map objects must have different names (" + entity.name + ").");
                  }
                  // add to entities collection
                  tmxMap._entities[entity.name.toLowerCase()] = entity;
                });

                // create a group for each object group
                var group = new enchant.Group();
                // add name
                group.name = objectGroup["@name"] || "";
                tmxMap._maps.forEach(function(otherMap) {
                  if (group.name === otherMap.name) {
                    throw new Error("TMX map layers must have different names (" + group.name + ").");
                  }
                });
                tmxMap._groups.forEach(function(otherGroup) {
                  if (group.name === otherGroup.name) {
                    throw new Error("TMX map layers must have different names (" + group.name + ").");
                  }
                });
                // add object group properties to group
                group.properties = { };
                if (objectGroup.properties) {
                  var property = ensureArray(objectGroup.properties.property);
                  property.forEach(function(prop) {
                    group.properties[trim(prop["@name"])] = trim(prop["@value"]);
                  });
                }
                // enabled data
                group._enable = !(group.properties.enable
                  && group.properties.enable.toLowerCase() === "false");

                // add to groups
                tmxMap._groups[objectGroup["#"]] = group;
              });

              // add entities location data updater
              tmxMap.addEventListener(enchant.Event.ENTER_FRAME, function() {
                for (var ent in tmxMap._entities) {
                  var entity = tmxMap._entities[ent];
                  if (ent.node && ent.node.x && ent.node.y) {
                    var newX = ent.node.x;
                    var newY = ent.node.y;
                    if (node.hitBox) {
                      newX = newX + (parseInt(node.hitBox.x) || 0);
                      newY = newY + (parseInt(node.hitBox.y) || 0);
                    }
                    ent.x = newX;
                    ent.y = newY;
                  }
                }
              });

              // add layers to group
              tmxMap._updateLayers();

              // callback
              if (callback) {
                if (context) {
                  callback.call(context, tmxMap);
                } else {
                  callback(tmxMap);
                }
              };
            });
          };

          // get TSX data from same file or from external file
          var tsx = { };
          if (!Array.isArray(tmx.tileset)) {
            // tile numeration offset
            tmxMap._firstGID = tmx.tileset["@firstgid"];
            var tilesetSource = tmx.tileset["@source"];
            if (!tilesetSource) {
              // tileset is included within the map
              tsxBasePath = tmxMap._basePath;
              tsx = tmx.tileset;
              processTSX();
            } else {
              // tileset is in an external TSX file
              index = tilesetSource.lastIndexOf("/");
              if (index > 0) {
                tsxBasePath =
                  tmxMap._basePath + tilesetSource.slice(0, index + 1);
              } else {
                tsxBasePath = tmxMap._basePath;
              }

              // load TSX
              var ajaxTileset;
              if (XMLHttpRequest) {
                ajaxTileset = new XMLHttpRequest();
                if (ajaxTileset.overrideMimeType) {
                  ajaxTileset.overrideMimeType("text/xml");
                }
              } else {
                ajaxTileset = new ActiveXObject("Microsoft.XMLHTTP");
              }
              ajaxTileset.onreadystatechange = function () {
                if (ajaxTileset.readyState === 4) {
                  tsx = eval("(" + enchant.TMX.xml2json(ajaxTileset.responseXML) + ")").tileset;
                  processTSX();
                }
              };
              ajaxTileset.open("GET", tmxMap._basePath + tilesetSource);
              ajaxTileset.send();
            }
          } else {
            // multiple tilesets are not supported
            throw new Error("TMX maps with mutiple tilesets are not supported.");
          }
        }
      };
      ajaxMap.open("GET", this._basePath + this._fileName);
      ajaxMap.send();
    },

    /**
     * Updates layers in the group.
     *
     * @private
     */
    _updateLayers : function() {
      // clear group
      var children = this.childNodes.slice(0);
      children.forEach(function(child) {
        this.removeChild(child);
      }, this);
      // add layers
      var maxLayers = Math.max(this._maps.length, this._groups.length);
      for (var i = 0; i < maxLayers; i++) {
        if (this._maps[i] && this._maps[i]._enable) {
          this.addChild(this._maps[i]);
        }
        if (this._groups[i] && this._groups[i]._enable) {
          this.addChild(this._groups[i]);
        }
      }
    },

    /**
     * Map width.
     * @type {Number}
     */
    width : {
      get : function() {
        return this._tileWidth * this._columns;
      }
    },

    /**
     * Map height.
     * @type {Number}
     */
    height : {
      get : function() {
        return this._tileHeight * this._rows;
      }
    },

    /**
     * Tile width.
     * @type {Number}
     */
    tileWidth : {
      get : function() {
        return this._tileWidth;
      }
    },

    /**
     * Tile height.
     * @type {Number}
     */
    tileHeight : {
      get : function() {
        return this._tileHeight;
      }
    },

    /**
     * Map entities.
     * @type {Array}
     */
    entities : {
      get : function() {
        var ents = new Array();
        for (var name in this._entities) {
          ents.push(this._entities[name]);
        }
        return ents;
      }
    },

    /**
     * Map custom properties.
     * @type {Object}
     */
    properties : {
      get : function() {
        return this._properties;
      }
    },

    /**
     * Animation enabled status.
     * @type {Boolean}
     */
    animate : {
      get : function() {
        return this._animate;
      },
      set : function(value) {
        this._animate = !!value;
      }
    },

    /**
     * Gets the entity with the given name.
     *
     * @param {String} name Name of the entity.
     * @returns {*} Entity information or null if it does not exist.
     */
    getEntity : function(name) {
      if (this._entities[name.toLowerCase()]) {
        return this._entities[name.toLowerCase()];
      }
      else return null;
    },

    /**
     * Gets the entities with the given given type.
     *
     * @param {String} type Type of the entities.
     * @returns {Array} Entities information.
     */
    getEntitiesByType : function(type) {
      var entities = new Array();
      for (var name in this._entities) {
        if (this._entities[name].type.toLowerCase() === type.toLowerCase()) {
          entities.push(this._entities[name]);
        }
      }
      return entities;
    },

    /**
     * Puts a node in the position of the object with
     * the given name in the map.
     *
     * @param {enchant.Node} node Node to be added.
     * @param {String} name Reference name of the object in the map.
     */
    addNodeByName : function(node, name) {
      var entity = this.getEntity(name);
      if (entity) {
        var group = this._groups[entity._layer]
        if (group) {
          // align to grid
          entity.x = entity.x - (entity.x % this._tileWidth);
          entity.y = entity.y - (entity.y % this._tileHeight);
          var xPos = entity.x;
          var yPos = entity.y;
          // try to use hit box
          if (node.hitBox) {
            xPos = xPos - (parseInt(node.hitBox.x) || 0);
            yPos = yPos - (parseInt(node.hitBox.y) || 0);
          }
          // remove previous association if there was any
          if (entity.node) group.removeChild(entity.node);
          entity.node = node;
          // place node
          node.moveTo(xPos, yPos);
          group.addChild(node);
        } else {
          throw new Error("TMX map internals are misconfigured.");
        }
      } else {
        throw new Error("TMX map does not contain the entity (" + name + ").");
      }
    },

    /**
     * Calulates the tile coordinates at the given position.
     *
     * @param {Number} x X coordinate.
     * @param {Number} y Y coordinate.
     * @return {*} Object with tile coordinates in fields "row" and "column".
     */
    tileAt : function(x, y) {
      var coordinates = { };
      // check coordinates are within map
      if (x >= 0 && x < this.width && y >= 0 && y < this.height) {
        coordinates.row = (y - y % this._tileHeight) / this._tileHeight;
        coordinates.column = (x - x % this._tileWidth) / this._tileWidth;
      } else {
        return null;
      }
      return coordinates;
    },

    /**
     * Determines whether a movement from a position to another is allowed
     * taking account of the blocking information on the first and last tile.
     * Movements of more than a tile are considered as not allowed.
     *
     * @param {Number} xFrom X coordinate of the intial position.
     * @param {Number} yFrom Y coordinate of the intial position.
     * @param {Number} xMove Movement along X axis.
     * @param {Number} yMove Movement along Y axis.
     * @param {*} hitBox Hit box information with x, y, width and height. Defaults to a tile;
     * @return {Boolean} True if the movement is allowed, false otherwise.
     */
    moveTest : function(xFrom, yFrom, xMove, yMove, hitBox) {
      // movements of more than a tile are not allowed
      if (Math.abs(xMove) > this._tileWidth || Math.abs(yMove) > this._tileHeight) {
        return false;
      }
      // without hit box defaults to a tile
      if (!hitBox) {
        hitBox = { x : 0, y : 0, width : this._tileWidth, height : this._tileHeight };
      } else {
        hitBox = { x : hitBox.x || 0, y : hitBox.y || 0,
          width : hitBox.width || this._tileWidth, height : hitBox.height || this._tileHeight };
      }
      // hit box origin
      xFrom = xFrom + hitBox.x; yFrom = yFrom + hitBox.y;
      // focus on the corner of the movement
      if (xMove > 0) xFrom = xFrom + hitBox.width - 1;
      if (yMove > 0) yFrom = yFrom + hitBox.height - 1;
      // calculate initial and final tiles
      var tileFrom = this.tileAt(xFrom, yFrom);
      var tileTo = this.tileAt(xFrom + xMove, yFrom + yMove);
      // check coordinates are valid
      if (tileFrom && tileTo) {
        // get block codes
        var blockFrom = this._maps.filter(function(map) {
          return map._enable;
        }).reduce(function(cum, current) {
          return current.collisionData[tileFrom.row][tileFrom.column] | cum;
        }, 0);
        var blockTo = this._maps.filter(function(map) {
          return map._enable;
        }).reduce(function(cum, current) {
          return current.collisionData[tileTo.row][tileTo.column] | cum;
        }, 0);

        // if destination blocks always
        if (enchant.TMX.blockType("always") === blockTo) {
          return false;

        // if both are the same tile
        } else if ((tileFrom.row === tileTo.row)
          && (tileFrom.column === tileTo.column)) {
          return true;

        // moving up
        } else if ((tileFrom.row > tileTo.row)
          && ((enchant.TMX.blockType("north") & blockFrom)
            || (enchant.TMX.blockType("south") & blockTo))) {
          return false;

        // moving down
        } else if ((tileFrom.row < tileTo.row)
          && ((enchant.TMX.blockType("south") & blockFrom)
            || (enchant.TMX.blockType("north") & blockTo))) {
          return false;

        // moving right
        } else if ((tileFrom.column < tileTo.column)
          && ((enchant.TMX.blockType("east") & blockFrom)
            || (enchant.TMX.blockType("west") & blockTo))) {
          return false;

        // moving left
        } else if ((tileFrom.column > tileTo.column)
          && ((enchant.TMX.blockType("west") & blockFrom)
            || (enchant.TMX.blockType("east") & blockTo))) {
          return false;

        // if no blocking found
        } else {
          return true;
        }
      } else {
        return false;
      }
    },

    /**
     * Finds a map layer with the given name.
     *
     * @param {String} name Name of the layer.
     * @return {enchant.Map} Map with the given name or null if does not exist.
     */
    getMapLayer : function(name) {
      for (var i = 0; i < this._maps.length; i++) {
        if (this._maps[i] && this._maps[i].name.toLowerCase() === name.toLowerCase()) {
          return this._maps[i];
        }
      }
      return null;
    },

    /**
     * Finds an entities layer with the given name.
     *
     * @param {String} name Name of the layer.
     * @return {enchant.Group} Group with the given name or null if does not exist.
     */
    getEntitiesLayer : function(name) {
      for (var i = 0; i < this._groups.length; i++) {
        if (this._groups[i] && this._groups[i].name.toLowerCase() === name.toLowerCase()) {
          return this._groups[i];
        }
      }
      return null;
    },

    /**
     * Finds a layer with the given name.
     *
     * @param {String} name Name of the layer.
     * @return {*} Layer with the given name or null if does not exist.
     */
    getLayer : function(name) {
      var layer = this.getMapLayer(name);
      if (!layer) {
        layer = this.getEntitiesLayer(name);
      }
      return layer;
    },

    /**
     * Enables the layer with the given name.
     *
     * @param {String} name Name of the layer.
     */
    enableLayer : function(name) {
      var layer = this.getLayer(name);
      if (layer) {
        layer._enable = true;
        this._updateLayers();
      } else {
        throw new Error("TMX map does not contain a layer called " + name + ".");
      }
    },

    /**
     * Disables the layer with the given name.
     *
     * @param {String} name Name of the layer.
     */
    disableLayer : function(name) {
      var layer = this.getLayer(name);
      if (layer) {
        layer._enable = false;
        this._updateLayers();
      } else {
        throw new Error("TMX map does not contain a layer called " + name + ".");
      }
    },

    /**
     * Toggles the layer with the given name.
     *
     * @param {String} name Name of the layer.
     */
    toggleLayer : function(name) {
      var layer = this.getLayer(name);
      if (layer) {
        layer._enable = !layer._enable;
        this._updateLayers();
      } else {
        throw new Error("TMX map does not contain a layer called " + name + ".");
      }
    },

    /**
     * Checks if the layer with the given name is enabled
     *
     * @param {String} name Name of the layer.
     * @return {Boolean} True if the layer is enabled, false otherwise.
     */
    isEnabledLayer : function(name) {
      var layer = this.getLayer(name);
      if (layer) {
        return !!layer._enable;
      } else {
        throw new Error("TMX map does not contain a layer called " + name + ".");
      }
    }
  }),

  /**
   * @scope enchant.TMX.TMXMapLoader.prototype
   */
  TMXMapLoader : enchant.Class.create(enchant.EventTarget, {
    /**
     * Loads TMX maps specifying the content of the entities in the map.
     * Associates entity types to classes and entity names to instances.
     * Defines handlers to execute when a map is loaded.
     *
     * @construct
     */
    initialize : function() {
      enchant.EventTarget.call(this);
      // types associations
      this._types = { };
      // names associations
      this._names = { };
      // preload handlers
      this._preload = new Array();
      // loading handlers
      this._loading = new Array();
      // loaded handlers
      this._loaded = new Array();
    },

    /**
     * Loads a TMX map and put the corresponding instances on the entities.
     *
     * @param {String} url URL of the TMX map.
     * @param {Function(map:enchant.TMX.TMXMap)} callback Callback to execute when map is loaded.
     * @param {*} context Context where the callback is executed. By default the loaded map.
     * @return {enchant.TMX.TMXMap} Loaded map.
     */
    loadMap : function(url, callback, context) {
      // on preload handlers
      this._preload.forEach(function(handler) {
        handler(this, url);
      }, this);
      // load map
      var map = new enchant.TMX.TMXMap(url, function() {
        // associate names
        for (var name in this._names) {
          if (map.getEntity(name)) {
            map.addNodeByName(this._names[name], name);
          }
        }
        // associate types
        for (var type in this._types) {
          map.getEntitiesByType(type).forEach(function(entity) {
            // check the name is not bound
            if (!(this._names[entity.name.toLowerCase()])) {
              // create object
              var obj = new this._types[type](entity);
              map.addNodeByName(obj, entity.name);
            }
          }, this);
        }
        // on loading handlers
        this._loading.forEach(function(handler) {
          handler(this, url, map);
        }, this);
        // loading callback
        if (callback) {
          if (context) {
            callback.call(context, map);
          } else {
            callback(map);
          }
        }
        // on loaded handlers
        this._loaded.forEach(function(handler) {
          handler(this, url, map);
        }, this);
      }, this);
      return map;
    },

    /*
     * Associates an entity name to an instance so an entity with the
     * name in a map have it in it.
     *
     * @param {String} name Name of the entity to bind.
     * @param {Object} object Instance to place on the entity.
     */
    bindName : function(name, object) {
      this._names[name.toLowerCase()] = object;
    },

    /*
     * Dissociates an entity name to any instance.
     *
     * @param {String} name Name of the entity to unbind.
     */
    unbindName : function(name) {
      this._names[name.toLowerCase()] = undefined;
    },

    /*
     * Associates an entity type to an object type so every entity with the
     * type in a map have an instance of it in it. New instances will be created
     * with matching entity as an argument.
     *
     * @param {String} type Type of the entities to bind.
     * @param {Class} objectType Class of the instances to create.
     */
    bindType : function(type, objectType, args) {
      args = args || new Array();
      this._types[type.toLowerCase()] = objectType;
    },

    /*
     * Dissociates an entity type to any object type.
     *
     * @param {String} type Type of the entities to unbind.
     */
    unbindType : function(type) {
      this._types[type.toLowerCase()] = undefined;
    },

    /**
     * Adds a handler to execute before the map is loaded.
     *
     * @param {Function(loader:enchant.TMX.TMXMapLoader, url:String)} handler Handler to execute before the map is loaded.
     */
    addOnPreloadHandler : function(handler) {
      this._preload.push(handler);
    },

    /**
     * Removes a handler to execute before the map is loaded.
     *
     * @param {Function(loader:enchant.TMX.TMXMapLoader, url:String)}
     *   handler Handler to remove.
     */
    removeOnPreloadHandler : function(handler) {
      var i = this._preload.indexOf(handler);
      if (i >= 0) {
        this._preload.splice(i, 1);
      }
    },

    /**
     * Adds a handler to execute after the map is loaded but before its loading
     * callback.
     *
     * @param {Function(loader:enchant.TMX.TMXMapLoader, url:String, map:enchant.TMX.TMXMap)}
     *   handler Handler to execute before the map loading callback.
     */
    addOnLoadingHandler : function(handler) {
      this._loading.push(handler);
    },

    /**
     * Removes a handler to execute after the map is loaded but before its
     * loading callback.
     *
     * @param {Function(loader:enchant.TMX.TMXMapLoader, url:String, map:enchant.TMX.TMXMap)}
     *   handler Handler to remove.
     */
    removeOnLoadingHandler : function(handler) {
      var i = this._loading.indexOf(handler);
      if (i >= 0) {
        this._loading.splice(i, 1);
      }
    },

    /**
     * Adds a handler to execute after the map is loaded and after its loading
     * callback.
     *
     * @param {Function(loader:enchant.TMX.TMXMapLoader, url:String, map:enchant.TMX.TMXMap)}
     *   handler Handler to execute after the map loading callback.
     */
    addOnLoadedHandler : function(handler) {
      this._loaded.push(handler);
    },

    /**
     * Removes a handler to execute after the map is loaded and after its
     * loading callback.
     *
     * @param {Function(loader:enchant.TMX.TMXMapLoader, url:String, map:enchant.TMX.TMXMap)}
     *   handler Handler to remove.
     */
    removeOnLoadedHandler : function(handler) {
      var i = this._loaded.indexOf(handler);
      if (i >= 0) {
        this._loaded.splice(i, 1);
      }
    }

  })

};

