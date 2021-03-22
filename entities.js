
(function() {
  var me; // namespace for the functions.

  if (typeof module !== 'undefined') { // otherwise, try to be a node module.
    me = module.exports;
  } else { // failing the above, just attach to the window.
    me = window;
  }

  /*
   * deep copy
   */
  me.copy = function(obj) {
    if (obj == null || typeof(obj) != 'object')
      return obj;

    var temp = obj.constructor(); // changed

    for (var key in obj)
      temp[key] = copy(obj[key]);
    return temp;
  }

  /*
   * Classic Crockford Beget, for reference.
   */
  me.beget = function(o) {
    function F() {}
    F.prototype = o;
    return new F();
  }

  /**
   * Generalized object merge.
   *
   * Wwith macros to control recursive object merging and prototyping.
   * When merging two objects, the inline __mix property indicates a recursive merge.
   * The inline __inherit property indicates the use of the original object as a prototype for the resulting object.
   **/
  me.mix = function(o) { // [e1, e2 ...]

    var e, ak, k, fnTest = /xyz/.test(function() {
      xyz;
    }) ? /\b_super\b/ : /.*/;
    for (ak = 1; ak < arguments.length; ak++) {
      e = arguments[ak];
      for (k in e) {
        if (e.hasOwnProperty(k) && typeof e[k] !== 'undefined') {
          if (e[k].hasOwnProperty('__mix')) {
            o[k] = me.mix({}, o[k], e[k]);
          } else if (e[k].hasOwnProperty('__inherit')) {
            if (e[k].__inherit === true) { // point prototype to overridden instance.
              o[k] = me.inherit(o[k], e[k]);
            } else {
              o[k] = me.inherit(e[k].__inherit, e[k]);
            }
          } else if (
            typeof o[k] == "function" && typeof e[k] == "function" && fnTest.test(e[k])) { // supermethods:
            o[k] = (function(kk, fn, _super) {
              return function() {
                var tmp = this._super;
                // Add a new ._super() method that is the same method
                // but on the super-class
                this._super = _super;
                // The method only need to be bound temporarily, so we
                // remove it when we're done executing
                var ret = fn.apply(this, arguments);
                this._super = tmp;
                return ret;
              };
            })(k, e[k], o[k]); // pass in references to original properties.
          } else if (!(k.substr(0, 2) === '__')) { // ignore "special" properties, beginning with double underscore.
            o[k] = e[k];
          }
        }
      }
    }
    return o;
  };
  // Based on the Douglas Crockford "beget".
  //
  // @param proto - the object to use as the prototype
  // @param [props] - optionally me.mix the object too.
  // @param [classname] - give a name to the constructor to give debuggers something to call the Class.
  // returns another object whose prototype is the provided (@param c) object.
  me.inherit = function(proto, props, classname) {
    classname = classname || proto.name || 'unnamed';
	classname = classname.replace(/[\s\-]/g,'')
    var o;
    var code = "function " + classname + "(){};" + classname + ".prototype=proto;o=new " + classname + "()";
    eval(code);
    if (props) me.mix(o, props);
    o.init && o.init(props)
    return o;
  };
  // demos which are also tests:
  /*
      Organism = {
          alive: true,
          bones: {
              legs:0,
              spine:1
          }
      };

      Animal = me.inherit(Organism, {
          bones: {
              __mix: true,
              legs:4
          },
          photosynthesizes: false
      });

      Mammal = me.mix({
          __inherit: Animal,
          warmblood: true,

          bones: {
              __mix: true,
              legs:4
          }
      });

      */
})();


;



(function() { // Closure


  var me; // namespace for the functions.

  if (typeof module !== 'undefined') { // otherwise, try to be a node module.
    me = module.exports;
  } else { // failing the above, just attach to the window.
    me = window;
  }
  // a convenient way to define game objects, the Entity Tree.
  // takes a list of objects with name and parent attributes (referencing parent object's name.)
  // ie, new EntityTree([
  //     {name: 'base'},
  //     {name: 'child', parent: 'base'}
  //  ]);
  const EntityTree = function(opts, all) {
    this.opts = opts || {};
    all = all || [];
    this.by_name = {};
    this.add(all);
  }
  EntityTree.prototype.random = function() {
    var names = Object.keys(this.by_name);
    var name = names[Math.floor(Math.random() * names.length)];
    return this.create(name);
  }
  EntityTree.prototype.add = function(entity) {
    var tree = this;

    if (entity instanceof Array) {

      entity.forEach(function(item) {
        tree.add(item);
      });

    } else {
      if (tree.opts.on_create) tree.opts.on_create(entity);

      if (entity.parent) {
        var parent = tree.by_name[entity.parent];
        if (!parent) throw ('parent ' + entity.parent + ' of ' + entity.name + ' does not exist');
        tree.by_name[entity.name] = inherit(parent, entity, entity.name);

      } else {

        tree.by_name[entity.name] = entity;
        entity.is_a = function(name) {
          if (this.name === name) return true;
          if (!this.parent) return false;
          return tree.get(this.parent).is_a(name);
        }

      }
    }
  }
  // instantiate a tree node.
  EntityTree.prototype.create = function(name, overrides) {
    var kls = this.by_name[name];
    if (!kls) throw kls + " is not a valid object."
    return inherit(kls, overrides || {}, name + "Instance");
  };
  EntityTree.prototype.get = function(name) {
	if (!name) return null;
    return this.by_name[name];
  };
  EntityTree.prototype.from_list = function(list) {
    var tree = this;
    return list.map(function(name) {
      return tree.create(name);
    });
  };
  EntityTree.prototype.all = function() {
    var that = this;
    return Object.keys(this.by_name).map(function(k) {
      return that.by_name[k];
    });
  }
  
  me.EntityTree = EntityTree

})(); // End closure
