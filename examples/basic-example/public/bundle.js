(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var diagram_1 = require("@carnelian-diagram/core");
var interaction_1 = require("@carnelian-diagram/interaction");
var basic_1 = require("@carnelian-diagram/shapes/basic");
var root = document.getElementById("root");
if (root && root instanceof SVGGraphicsElement) {
    var diagram = new diagram_1.Diagram();
    diagram.add(basic_1.InteractiveRoundedRect, { x: 100, y: 100, width: 200, height: 150, radius: "25%", style: { fill: "yellow" } });
    diagram.add(basic_1.InteractiveCircle, { x: 280, y: 220, radius: 80, style: { fill: "blue" } });
    var controller = new interaction_1.InteractionController(diagram);
    var diagramDOM = diagram_1.DiagramDOM.createRoot(diagram, root, (0, interaction_1.withInteraction)(diagram_1.DiagramRoot, controller));
    controller.attach(root);
    diagramDOM.attach();
}

},{"@carnelian-diagram/core":16,"@carnelian-diagram/interaction":87,"@carnelian-diagram/shapes/basic":114}],2:[function(require,module,exports){

},{}],3:[function(require,module,exports){
// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],4:[function(require,module,exports){
(function (setImmediate,clearImmediate){(function (){
var nextTick = require('process/browser.js').nextTick;
var apply = Function.prototype.apply;
var slice = Array.prototype.slice;
var immediateIds = {};
var nextImmediateId = 0;

// DOM APIs, for completeness

exports.setTimeout = function() {
  return new Timeout(apply.call(setTimeout, window, arguments), clearTimeout);
};
exports.setInterval = function() {
  return new Timeout(apply.call(setInterval, window, arguments), clearInterval);
};
exports.clearTimeout =
exports.clearInterval = function(timeout) { timeout.close(); };

function Timeout(id, clearFn) {
  this._id = id;
  this._clearFn = clearFn;
}
Timeout.prototype.unref = Timeout.prototype.ref = function() {};
Timeout.prototype.close = function() {
  this._clearFn.call(window, this._id);
};

// Does not start the time, just sets up the members needed.
exports.enroll = function(item, msecs) {
  clearTimeout(item._idleTimeoutId);
  item._idleTimeout = msecs;
};

exports.unenroll = function(item) {
  clearTimeout(item._idleTimeoutId);
  item._idleTimeout = -1;
};

exports._unrefActive = exports.active = function(item) {
  clearTimeout(item._idleTimeoutId);

  var msecs = item._idleTimeout;
  if (msecs >= 0) {
    item._idleTimeoutId = setTimeout(function onTimeout() {
      if (item._onTimeout)
        item._onTimeout();
    }, msecs);
  }
};

// That's not how node.js implements it but the exposed api is the same.
exports.setImmediate = typeof setImmediate === "function" ? setImmediate : function(fn) {
  var id = nextImmediateId++;
  var args = arguments.length < 2 ? false : slice.call(arguments, 1);

  immediateIds[id] = true;

  nextTick(function onNextTick() {
    if (immediateIds[id]) {
      // fn.call() is faster so we optimize for the common use-case
      // @see http://jsperf.com/call-apply-segu
      if (args) {
        fn.apply(null, args);
      } else {
        fn.call(null);
      }
      // Prevent ids from leaking
      exports.clearImmediate(id);
    }
  });

  return id;
};

exports.clearImmediate = typeof clearImmediate === "function" ? clearImmediate : function(id) {
  delete immediateIds[id];
};
}).call(this)}).call(this,require("timers").setImmediate,require("timers").clearImmediate)
},{"process/browser.js":3,"timers":4}],5:[function(require,module,exports){
"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.App = void 0;
var jsx_runtime_1 = require("../jsx-runtime");
/** @jsxImportSource .. */
var __1 = require("..");
var App = function (props) {
    __1.RenderContext.provide(this, props.renderContext);
    var DiagramRoot = props.diagramRoot;
    var defaultStyles = [
        ".carnelian-diagram { stroke: black; fill: white }",
        ".carnelian-diagram text { stroke: none; fill: black; user-select: none }"
    ];
    return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)("style", { children: defaultStyles.join("\n") }), (0, jsx_runtime_1.jsx)(DiagramRoot, __assign({}, props.diagramRootProps))] }));
};
exports.App = App;

},{"..":16,"../jsx-runtime":17}],6:[function(require,module,exports){
"use strict";
/** @jsxImportSource .. */
Object.defineProperty(exports, "__esModule", { value: true });
exports.DiagramRoot = void 0;
var DiagramRoot = function (props) { return props.children; };
exports.DiagramRoot = DiagramRoot;

},{}],7:[function(require,module,exports){
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
__exportStar(require("./app"), exports);
__exportStar(require("./diagram-root"), exports);

},{"./app":5,"./diagram-root":6}],8:[function(require,module,exports){
"use strict";
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createContext = void 0;
var diagram_1 = require("./diagram");
function createContext(defaultValue) {
    var context = {
        defaultValue: defaultValue,
        consume: function () { return defaultValue; },
        provide: function (node, value) { },
        Provider: function (props) { return undefined; },
        Consumer: function (props) { return undefined; }
    };
    context.consume = function () {
        var _a, _b;
        var curNode = (_a = context.renderContext) === null || _a === void 0 ? void 0 : _a.currentNode;
        if (curNode) {
            var componentState = curNode.state = curNode.state || new diagram_1.ComponentState();
            var _c = __read(componentState.current({ current: undefined }), 1), storedCleanup = _c[0];
            var node = curNode;
            while (node && node.context !== context) {
                node = node.parent;
            }
            if (node && curNode && !((_b = node.subscriptions) === null || _b === void 0 ? void 0 : _b.has(curNode))) {
                var subscriptions_1 = node.subscriptions = node.subscriptions || new Set();
                subscriptions_1.add(curNode);
                var cleanups = curNode.cleanups = curNode.cleanups || new diagram_1.ComponentCleanups();
                storedCleanup.current && cleanups.invokeCleanup(storedCleanup.current);
                storedCleanup.current = function () {
                    subscriptions_1.delete(curNode);
                };
                cleanups.registerCleanup(storedCleanup.current);
            }
            return (node === null || node === void 0 ? void 0 : node.contextValue) || context.defaultValue;
        }
    };
    context.provide = function (node, value) {
        var _a;
        node.context = context;
        node.contextValue = value;
        // Root element context must be RenderContext
        var root = node;
        while (root.parent) {
            root = root.parent;
        }
        context.renderContext = root.contextValue;
        if (value !== node.contextValue) {
            (_a = node.subscriptions) === null || _a === void 0 ? void 0 : _a.forEach(function (x) { return x.isValid = false; });
        }
    };
    context.Provider = function (props) {
        context.provide(this, props.value);
        return props.children;
    };
    context.Consumer = function (props) {
        var _a;
        return (_a = props.children) === null || _a === void 0 ? void 0 : _a.call(props, context.consume());
    };
    return context;
}
exports.createContext = createContext;

},{"./diagram":9}],9:[function(require,module,exports){
"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RenderContext = exports.RenderContextType = exports.DiagramDOM = exports.Diagram = exports.isVirtualNode = exports.isDiagramNode = exports.ComponentCleanups = exports.ComponentState = void 0;
var jsx_runtime_1 = require("./jsx-runtime");
var app_1 = require("./components/app");
var dom_builder_1 = require("./dom-builder");
var schedule_1 = require("./utils/schedule");
var context_1 = require("./context");
var ComponentState = /** @class */ (function () {
    function ComponentState() {
        this.hookIndex = 0;
        this.states = [];
    }
    ComponentState.prototype.reset = function () {
        this.hookIndex = 0;
    };
    ComponentState.prototype.current = function (initialValue) {
        if (this.hookIndex >= this.states.length) {
            this.states.push(initialValue);
        }
        var hookIndex = this.hookIndex;
        this.hookIndex++;
        return [this.states[hookIndex], hookIndex];
    };
    ComponentState.prototype.get = function (index) {
        return this.states[index];
    };
    ComponentState.prototype.set = function (index, newValue) {
        this.states[index] = newValue;
    };
    return ComponentState;
}());
exports.ComponentState = ComponentState;
var ComponentCleanups = /** @class */ (function () {
    function ComponentCleanups() {
        this.cleanupFunctions = [];
    }
    ComponentCleanups.prototype.registerCleanup = function (cleanup) {
        this.cleanupFunctions.push(cleanup);
    };
    ComponentCleanups.prototype.invokeCleanup = function (cleanup) {
        cleanup();
        this.cleanupFunctions = this.cleanupFunctions.filter(function (x) { return x !== cleanup; });
    };
    ComponentCleanups.prototype.cleanupAll = function () {
        this.cleanupFunctions = this.cleanupFunctions.reduce(function (result, cleanup) {
            cleanup();
            return result;
        }, []);
    };
    return ComponentCleanups;
}());
exports.ComponentCleanups = ComponentCleanups;
var createElement = function (type, props, key) {
    if (key === void 0) { key = undefined; }
    return {
        type: type,
        props: props,
        key: key,
        children: [],
        node_type: "diagram-node"
    };
};
jsx_runtime_1.jsxCore.createElement = createElement;
function isDiagramNode(node) {
    return !!node && typeof node === 'object' && node.node_type === 'diagram-node';
}
exports.isDiagramNode = isDiagramNode;
function isVirtualNode(node) {
    return isDiagramNode(node);
}
exports.isVirtualNode = isVirtualNode;
var Diagram = /** @class */ (function () {
    function Diagram() {
        this.lastElementId = 0;
        this.elements = [];
        this.subscriptions = [];
    }
    Diagram.prototype.createElementNode = function (type, props, key) {
        var _this = this;
        var onChange = function (callback) {
            _this.update(element, callback(element.props));
        };
        var element = createElement(type, __assign(__assign({}, props), { onChange: onChange }), key);
        return element;
    };
    Diagram.prototype.subscribe = function (callback) {
        var _this = this;
        var subscription = {
            callback: callback,
            unsubscribe: function () {
                _this.subscriptions = _this.subscriptions.filter(function (x) { return x !== subscription; });
            }
        };
        this.subscriptions.push(subscription);
        return subscription;
    };
    Diagram.prototype.invalidate = function (node) {
        this.subscriptions.forEach(function (s) { return s.callback(node); });
    };
    Diagram.prototype.getElements = function () {
        return __spreadArray([], __read(this.elements), false);
    };
    Diagram.prototype.add = function (type, props) {
        var element = this.createElementNode(type, props, this.lastElementId++);
        element.element = element;
        this.elements.push(element);
        this.invalidate(element);
        return element;
    };
    Diagram.prototype.update = function (element, props) {
        element.props = props;
        this.invalidate(element);
    };
    Diagram.prototype.delete = function (elements) {
        if (!Array.isArray(elements)) {
            this.delete([elements]);
        }
        else {
            this.elements = this.elements.filter(function (x) { return !elements.includes(x); });
            this.invalidate();
        }
    };
    Diagram.prototype.clear = function () {
        this.elements = [];
        this.invalidate();
    };
    return Diagram;
}());
exports.Diagram = Diagram;
var DiagramDOM;
(function (DiagramDOM) {
    function createRoot(diagram, root, rootComponent) {
        var domBuilder = new dom_builder_1.DiagramDOMBuilder(root);
        var isAttached = false;
        var isValid = false;
        var subscription = undefined;
        var storedRootNode = undefined;
        var renderContext = new RenderContextType(function (node) { return invalidate(node); });
        var storedNodesMap = new Map();
        var initNode = function (node, prevNode, parent) {
            var _a;
            node.state = prevNode === null || prevNode === void 0 ? void 0 : prevNode.state;
            node.cleanups = prevNode === null || prevNode === void 0 ? void 0 : prevNode.cleanups;
            node.context = prevNode === null || prevNode === void 0 ? void 0 : prevNode.context;
            node.contextValue = prevNode === null || prevNode === void 0 ? void 0 : prevNode.contextValue;
            node.subscriptions = prevNode === null || prevNode === void 0 ? void 0 : prevNode.subscriptions;
            if (node.isValid !== undefined) { //  Newly created nodes should be always invalid
                node.isValid = prevNode === null || prevNode === void 0 ? void 0 : prevNode.isValid;
            }
            node.parent = parent;
            if (parent === null || parent === void 0 ? void 0 : parent.element) {
                node.element = parent.element;
            }
            (_a = node.state) === null || _a === void 0 ? void 0 : _a.reset();
        };
        var unmount = function (node) {
            var _a;
            if (isDiagramNode(node)) {
                node.children.forEach(function (x) { return unmount(x); });
                (_a = node.cleanups) === null || _a === void 0 ? void 0 : _a.cleanupAll();
            }
        };
        var renderNode = function (node, prevNode, parent) {
            var _a;
            renderContext.currentNode = node;
            initNode(node, prevNode, parent);
            var nodesToRender = [];
            if (node.isValid) {
                node.children.forEach(function (child, i) {
                    if (isDiagramNode(child)) {
                        var prevChild = prevNode === null || prevNode === void 0 ? void 0 : prevNode.children[i];
                        nodesToRender.push({ node: child, prevNode: prevChild, parent: node });
                    }
                });
            }
            else {
                var children = void 0;
                var prevChildren_1 = (_a = prevNode === null || prevNode === void 0 ? void 0 : prevNode.children) === null || _a === void 0 ? void 0 : _a.slice();
                if (typeof node.type === 'function') {
                    children = node.type.call(node, node.props);
                }
                else {
                    children = node.props.children;
                }
                if (children) {
                    if (Array.isArray(children)) {
                        // @ts-ignore
                        node.children = children.flat(Infinity);
                    }
                    else {
                        node.children = [children];
                    }
                }
                else {
                    node.children = [];
                }
                node.children.forEach(function (child) {
                    if (isDiagramNode(child)) {
                        var prevChild = void 0;
                        if (prevChildren_1) {
                            var prevChildIndex = prevChildren_1
                                .findIndex(function (x) { return isDiagramNode(x) && x.type === child.type && x.key === child.key; });
                            if (prevChildIndex >= 0) {
                                prevChild = prevChildren_1[prevChildIndex];
                                prevChildren_1.splice(prevChildIndex, 1);
                            }
                        }
                        // First unmount then render
                        nodesToRender.push({ node: child, prevNode: prevChild, parent: node });
                    }
                });
                prevChildren_1 === null || prevChildren_1 === void 0 ? void 0 : prevChildren_1.forEach(function (x) { return unmount(x); });
            }
            nodesToRender.forEach(function (x) { return renderNode(x.node, x.prevNode, x.parent); });
            node.isValid = true;
            return node;
        };
        // Stores the node state to avoid sudden changes when it has been rendered to another DOM
        function storeRootNode(node, parent) {
            function storeNode(node, parent) {
                var result = __assign({}, node);
                result.parent = parent;
                result.children = node.children.map(function (x) { return isDiagramNode(x) ? storeNode(x, result) : x; });
                storedNodesMap.set(node, result);
                return result;
            }
            storedNodesMap.clear();
            return storeNode(node, parent);
        }
        var render = function (commitInvalid) {
            if (commitInvalid === void 0) { commitInvalid = true; }
            var rootNode = createElement(app_1.App, {
                renderContext: renderContext,
                diagramRoot: rootComponent,
                diagramRootProps: { svg: root, children: diagram.getElements() }
            });
            storedRootNode = storeRootNode(renderNode(rootNode, storedRootNode));
            isValid = true;
            renderContext.invokePendingActions();
            renderContext.reset();
            return isValid || commitInvalid ? commit(rootNode) : root;
        };
        var clear = function () {
            domBuilder.updateDOM(null);
        };
        var commit = function (node) {
            return domBuilder.updateDOM(node);
        };
        var invalidate = function (node) {
            var storedNode;
            while (node && !storedNode) { // Find nearest stored node
                storedNode = node ? storedNodesMap.get(node) : undefined;
                node = node.parent;
            }
            storedNode = storedNode || storedRootNode;
            storedNode && (storedNode.isValid = false);
            if (isValid) {
                isValid = false;
                scheduleRender();
            }
        };
        var attach = function () {
            if (!isAttached) {
                isAttached = true;
                scheduleRender();
                subscription = diagram.subscribe(function (node) { return invalidate(node); });
            }
        };
        var detach = function (clearDom) {
            if (isAttached) {
                isAttached = false;
                if (clearDom) {
                    clear();
                }
                subscription === null || subscription === void 0 ? void 0 : subscription.unsubscribe();
                subscription = undefined;
            }
        };
        var scheduleRender = function () {
            renderContext.schedule(function () {
                isAttached && render(false);
            });
        };
        return {
            isValid: function () { return isValid; },
            invalidate: invalidate,
            render: render,
            clear: clear,
            isAttached: function () { return isAttached; },
            attach: attach,
            detach: detach
        };
    }
    DiagramDOM.createRoot = createRoot;
})(DiagramDOM = exports.DiagramDOM || (exports.DiagramDOM = {}));
var RenderContextType = /** @class */ (function () {
    function RenderContextType(invalidate) {
        this.invalidate = invalidate;
        this.pendingActions = [];
        this.tasks = [];
    }
    RenderContextType.prototype.schedule = function (task) {
        var _this = this;
        this.tasks.push(task);
        if (!this.unschedule) {
            this.unschedule = (0, schedule_1.scheduleImmediate)(function () {
                _this.unschedule = undefined;
                var tasks = __spreadArray([], __read(_this.tasks), false);
                _this.tasks = [];
                tasks.forEach(function (task) { return task(); });
            });
        }
    };
    RenderContextType.prototype.queue = function (action) {
        if (this.isRendering()) {
            this.pendingActions.push(action);
        }
        else {
            this.schedule(function () {
                action();
            });
        }
    };
    RenderContextType.prototype.reset = function () {
        this.currentNode = undefined;
    };
    RenderContextType.prototype.currentElement = function () {
        var _a;
        return (_a = this.currentNode) === null || _a === void 0 ? void 0 : _a.element;
    };
    RenderContextType.prototype.invokePendingActions = function () {
        var action = this.pendingActions.shift();
        while (action) {
            action();
            action = this.pendingActions.shift();
        }
    };
    RenderContextType.prototype.isRendering = function () {
        return !!this.currentNode;
    };
    return RenderContextType;
}());
exports.RenderContextType = RenderContextType;
exports.RenderContext = (0, context_1.createContext)(undefined);

},{"./components/app":5,"./context":8,"./dom-builder":10,"./jsx-runtime":17,"./utils/schedule":19}],10:[function(require,module,exports){
"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DiagramDOMBuilder = exports.svg = exports.h = void 0;
var virtual_dom_1 = require("virtual-dom");
var diagram_1 = require("./diagram");
exports.h = require("virtual-dom/h");
exports.svg = require("virtual-dom/virtual-hyperscript/svg");
var DiagramDOMBuilder = /** @class */ (function () {
    function DiagramDOMBuilder(root) {
        var _a, _b;
        this.root = root;
        this.oldClass = (_b = (_a = root.attributes) === null || _a === void 0 ? void 0 : _a.getNamedItem("class")) === null || _b === void 0 ? void 0 : _b.nodeValue;
        this.lastTree = (0, exports.svg)("", {}, []);
    }
    DiagramDOMBuilder.prototype.transformProperties = function (properties) {
        properties.class = properties.className;
        delete properties.className;
        return properties;
    };
    DiagramDOMBuilder.prototype.transformNode = function (node) {
        var _this = this;
        var createVDomNode = function (child) {
            if (Array.isArray(child)) {
                return child.map(createVDomNode);
            }
            if ((0, diagram_1.isVirtualNode)(child)) {
                return _this.transformNode(child);
            }
            else {
                return child;
            }
        };
        if (node) {
            if (typeof node.type === 'string') {
                var _a = node.props, children = _a.children, properties = __rest(_a, ["children"]);
                return (0, exports.svg)(node.type, this.transformProperties(properties), node.children.map(createVDomNode));
            }
            else {
                return createVDomNode(node.children);
            }
        }
    };
    DiagramDOMBuilder.prototype.updateDOM = function (rootNode) {
        var props = rootNode ? this.transformProperties({
            className: this.oldClass ? "".concat(this.oldClass, " carnelian-diagram") : "carnelian-diagram"
        }) : {};
        var tree = (0, exports.svg)("", props, this.transformNode(rootNode));
        var lastTree = this.lastTree;
        var patches = (0, virtual_dom_1.diff)(lastTree, tree);
        this.lastTree = tree;
        return (0, virtual_dom_1.patch)(this.root, patches);
    };
    return DiagramDOMBuilder;
}());
exports.DiagramDOMBuilder = DiagramDOMBuilder;

},{"./diagram":9,"virtual-dom":30,"virtual-dom/h":29,"virtual-dom/virtual-hyperscript/svg":44}],11:[function(require,module,exports){
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
__exportStar(require("./use-state"), exports);
__exportStar(require("./use-context"), exports);
__exportStar(require("./use-effect"), exports);
__exportStar(require("./use-ref"), exports);

},{"./use-context":12,"./use-effect":13,"./use-ref":14,"./use-state":15}],12:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useContext = void 0;
function useContext(context) {
    return context.consume();
}
exports.useContext = useContext;

},{}],13:[function(require,module,exports){
"use strict";
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useEffect = void 0;
var _1 = require(".");
var __1 = require("..");
function compareArrays(a, b) {
    return a.length === b.length && a.every(function (x, i) { return Object.is(x, b[i]); });
}
function useEffect(effect, dependencies) {
    var renderContext = (0, _1.useContext)(__1.RenderContext);
    var curNode = renderContext === null || renderContext === void 0 ? void 0 : renderContext.currentNode;
    if (!curNode) {
        throw new Error("The useEffect hook is not allowed to be called from here. Current element is not defined");
    }
    var cleanups = curNode.cleanups = (curNode.cleanups || new __1.ComponentCleanups());
    var _a = __read((0, _1.useState)({}), 1), storedEffect = _a[0];
    if (!dependencies || !storedEffect.dependencies || !compareArrays(dependencies, storedEffect.dependencies)) {
        storedEffect.dependencies = dependencies;
        renderContext === null || renderContext === void 0 ? void 0 : renderContext.queue(function () {
            storedEffect.cleanup && cleanups.invokeCleanup(storedEffect.cleanup);
            var cleanup = storedEffect.cleanup = effect();
            if (cleanup) {
                cleanups.registerCleanup(cleanup);
            }
        });
    }
}
exports.useEffect = useEffect;

},{".":11,"..":16}],14:[function(require,module,exports){
"use strict";
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useRef = void 0;
var use_state_1 = require("./use-state");
function useRef(initialValue) {
    var _a = __read((0, use_state_1.useState)({ current: initialValue }), 1), ref = _a[0];
    return ref;
}
exports.useRef = useRef;

},{"./use-state":15}],15:[function(require,module,exports){
"use strict";
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useState = void 0;
var use_context_1 = require("./use-context");
var diagram_1 = require("../diagram");
function useState(initialValue) {
    var renderContext = (0, use_context_1.useContext)(diagram_1.RenderContext);
    var curNode = renderContext === null || renderContext === void 0 ? void 0 : renderContext.currentNode;
    if (!curNode) {
        throw new Error("The useState hook is not allowed to be called from here. Current element is not defined");
    }
    var componentState = curNode.state = (curNode.state || new diagram_1.ComponentState());
    var _a = __read(componentState.current(initialValue), 2), currentState = _a[0], hookIndex = _a[1];
    var updateState = function (newValue) {
        var currentState = componentState.get(hookIndex); // Don't use the currentState from closure, can work incorrectly inside useEffect and other callbacks
        if (!Object.is(currentState, newValue)) {
            renderContext === null || renderContext === void 0 ? void 0 : renderContext.queue(function () {
                componentState.set(hookIndex, newValue);
                renderContext === null || renderContext === void 0 ? void 0 : renderContext.invalidate(curNode);
            });
        }
    };
    return [currentState, updateState];
}
exports.useState = useState;

},{"../diagram":9,"./use-context":12}],16:[function(require,module,exports){
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
__exportStar(require("./diagram"), exports);
__exportStar(require("./context"), exports);
__exportStar(require("./components"), exports);
__exportStar(require("./hooks"), exports);

},{"./components":7,"./context":8,"./diagram":9,"./hooks":11}],17:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Fragment = exports.jsxDEV = exports.jsxs = exports.jsx = exports.createElement = exports.jsxCore = void 0;
exports.jsxCore = {
    createElement: function (type, props, key) {
        return {
            type: type,
            props: props,
            key: key
        };
    }
};
function createElement(type, props, key) {
    return exports.jsxCore.createElement(type, props, key);
}
exports.createElement = createElement;
exports.jsx = createElement;
exports.jsxs = createElement;
exports.jsxDEV = createElement;
function Fragment(props) {
    return props.children;
}
exports.Fragment = Fragment;

},{}],18:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomPropHook = void 0;
var CustomPropHook = /** @class */ (function () {
    function CustomPropHook(value) {
        this.value = value;
    }
    CustomPropHook.prototype.hook = function (node, propertyName) {
        node[propertyName] = this.value;
    };
    CustomPropHook.prototype.unhook = function (node, propertyName) {
        node[propertyName] = undefined;
    };
    return CustomPropHook;
}());
exports.CustomPropHook = CustomPropHook;

},{}],19:[function(require,module,exports){
(function (setImmediate,clearImmediate){(function (){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.scheduleIdle = exports.scheduleImmediate = void 0;
require("setimmediate");
var localSetImmediate = setImmediate;
var localClearImmediate = clearImmediate;
var localSetTimeout = setTimeout;
var localClearTimeout = clearTimeout;
var requestIdleCallbackShim = function (callback) {
    return localSetTimeout(callback, 0);
};
var cancelIdleCallbackShim = function (id) {
    localClearTimeout(id);
};
var localRequestIdleCallback = typeof requestIdleCallback === 'function' ? requestIdleCallback : requestIdleCallbackShim;
var localCancelIdleCallback = typeof cancelIdleCallback === 'function' ? cancelIdleCallback : cancelIdleCallbackShim;
function scheduleImmediate(callback) {
    var scheduleId = localSetImmediate(callback);
    return function () {
        localClearImmediate(scheduleId);
    };
}
exports.scheduleImmediate = scheduleImmediate;
;
function scheduleIdle(callback) {
    var scheduleId = localRequestIdleCallback(callback);
    return function () {
        localCancelIdleCallback(scheduleId);
    };
}
exports.scheduleIdle = scheduleIdle;
;

}).call(this)}).call(this,require("timers").setImmediate,require("timers").clearImmediate)
},{"setimmediate":26,"timers":4}],20:[function(require,module,exports){
/*!
 * Cross-Browser Split 1.1.1
 * Copyright 2007-2012 Steven Levithan <stevenlevithan.com>
 * Available under the MIT License
 * ECMAScript compliant, uniform cross-browser split method
 */

/**
 * Splits a string into an array of strings using a regex or string separator. Matches of the
 * separator are not included in the result array. However, if `separator` is a regex that contains
 * capturing groups, backreferences are spliced into the result each time `separator` is matched.
 * Fixes browser bugs compared to the native `String.prototype.split` and can be used reliably
 * cross-browser.
 * @param {String} str String to split.
 * @param {RegExp|String} separator Regex or string to use for separating the string.
 * @param {Number} [limit] Maximum number of items to include in the result array.
 * @returns {Array} Array of substrings.
 * @example
 *
 * // Basic use
 * split('a b c d', ' ');
 * // -> ['a', 'b', 'c', 'd']
 *
 * // With limit
 * split('a b c d', ' ', 2);
 * // -> ['a', 'b']
 *
 * // Backreferences in result array
 * split('..word1 word2..', /([a-z]+)(\d+)/i);
 * // -> ['..', 'word', '1', ' ', 'word', '2', '..']
 */
module.exports = (function split(undef) {

  var nativeSplit = String.prototype.split,
    compliantExecNpcg = /()??/.exec("")[1] === undef,
    // NPCG: nonparticipating capturing group
    self;

  self = function(str, separator, limit) {
    // If `separator` is not a regex, use `nativeSplit`
    if (Object.prototype.toString.call(separator) !== "[object RegExp]") {
      return nativeSplit.call(str, separator, limit);
    }
    var output = [],
      flags = (separator.ignoreCase ? "i" : "") + (separator.multiline ? "m" : "") + (separator.extended ? "x" : "") + // Proposed for ES6
      (separator.sticky ? "y" : ""),
      // Firefox 3+
      lastLastIndex = 0,
      // Make `global` and avoid `lastIndex` issues by working with a copy
      separator = new RegExp(separator.source, flags + "g"),
      separator2, match, lastIndex, lastLength;
    str += ""; // Type-convert
    if (!compliantExecNpcg) {
      // Doesn't need flags gy, but they don't hurt
      separator2 = new RegExp("^" + separator.source + "$(?!\\s)", flags);
    }
    /* Values for `limit`, per the spec:
     * If undefined: 4294967295 // Math.pow(2, 32) - 1
     * If 0, Infinity, or NaN: 0
     * If positive number: limit = Math.floor(limit); if (limit > 4294967295) limit -= 4294967296;
     * If negative number: 4294967296 - Math.floor(Math.abs(limit))
     * If other: Type-convert, then use the above rules
     */
    limit = limit === undef ? -1 >>> 0 : // Math.pow(2, 32) - 1
    limit >>> 0; // ToUint32(limit)
    while (match = separator.exec(str)) {
      // `separator.lastIndex` is not reliable cross-browser
      lastIndex = match.index + match[0].length;
      if (lastIndex > lastLastIndex) {
        output.push(str.slice(lastLastIndex, match.index));
        // Fix browsers whose `exec` methods don't consistently return `undefined` for
        // nonparticipating capturing groups
        if (!compliantExecNpcg && match.length > 1) {
          match[0].replace(separator2, function() {
            for (var i = 1; i < arguments.length - 2; i++) {
              if (arguments[i] === undef) {
                match[i] = undef;
              }
            }
          });
        }
        if (match.length > 1 && match.index < str.length) {
          Array.prototype.push.apply(output, match.slice(1));
        }
        lastLength = match[0].length;
        lastLastIndex = lastIndex;
        if (output.length >= limit) {
          break;
        }
      }
      if (separator.lastIndex === match.index) {
        separator.lastIndex++; // Avoid an infinite loop
      }
    }
    if (lastLastIndex === str.length) {
      if (lastLength || !separator.test("")) {
        output.push("");
      }
    } else {
      output.push(str.slice(lastLastIndex));
    }
    return output.length > limit ? output.slice(0, limit) : output;
  };

  return self;
})();

},{}],21:[function(require,module,exports){
'use strict';

var OneVersionConstraint = require('individual/one-version');

var MY_VERSION = '7';
OneVersionConstraint('ev-store', MY_VERSION);

var hashKey = '__EV_STORE_KEY@' + MY_VERSION;

module.exports = EvStore;

function EvStore(elem) {
    var hash = elem[hashKey];

    if (!hash) {
        hash = elem[hashKey] = {};
    }

    return hash;
}

},{"individual/one-version":24}],22:[function(require,module,exports){
(function (global){(function (){
var topLevel = typeof global !== 'undefined' ? global :
    typeof window !== 'undefined' ? window : {}
var minDoc = require('min-document');

var doccy;

if (typeof document !== 'undefined') {
    doccy = document;
} else {
    doccy = topLevel['__GLOBAL_DOCUMENT_CACHE@4'];

    if (!doccy) {
        doccy = topLevel['__GLOBAL_DOCUMENT_CACHE@4'] = minDoc;
    }
}

module.exports = doccy;

}).call(this)}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"min-document":2}],23:[function(require,module,exports){
(function (global){(function (){
'use strict';

/*global window, global*/

var root = typeof window !== 'undefined' ?
    window : typeof global !== 'undefined' ?
    global : {};

module.exports = Individual;

function Individual(key, value) {
    if (key in root) {
        return root[key];
    }

    root[key] = value;

    return value;
}

}).call(this)}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],24:[function(require,module,exports){
'use strict';

var Individual = require('./index.js');

module.exports = OneVersion;

function OneVersion(moduleName, version, defaultValue) {
    var key = '__INDIVIDUAL_ONE_VERSION_' + moduleName;
    var enforceKey = key + '_ENFORCE_SINGLETON';

    var versionValue = Individual(enforceKey, version);

    if (versionValue !== version) {
        throw new Error('Can only have one copy of ' +
            moduleName + '.\n' +
            'You already have version ' + versionValue +
            ' installed.\n' +
            'This means you cannot install version ' + version);
    }

    return Individual(key, defaultValue);
}

},{"./index.js":23}],25:[function(require,module,exports){
'use strict';

module.exports = function isObject(x) {
	return typeof x === 'object' && x !== null;
};

},{}],26:[function(require,module,exports){
(function (process,global){(function (){
(function (global, undefined) {
    "use strict";

    if (global.setImmediate) {
        return;
    }

    var nextHandle = 1; // Spec says greater than zero
    var tasksByHandle = {};
    var currentlyRunningATask = false;
    var doc = global.document;
    var registerImmediate;

    function setImmediate(callback) {
      // Callback can either be a function or a string
      if (typeof callback !== "function") {
        callback = new Function("" + callback);
      }
      // Copy function arguments
      var args = new Array(arguments.length - 1);
      for (var i = 0; i < args.length; i++) {
          args[i] = arguments[i + 1];
      }
      // Store and register the task
      var task = { callback: callback, args: args };
      tasksByHandle[nextHandle] = task;
      registerImmediate(nextHandle);
      return nextHandle++;
    }

    function clearImmediate(handle) {
        delete tasksByHandle[handle];
    }

    function run(task) {
        var callback = task.callback;
        var args = task.args;
        switch (args.length) {
        case 0:
            callback();
            break;
        case 1:
            callback(args[0]);
            break;
        case 2:
            callback(args[0], args[1]);
            break;
        case 3:
            callback(args[0], args[1], args[2]);
            break;
        default:
            callback.apply(undefined, args);
            break;
        }
    }

    function runIfPresent(handle) {
        // From the spec: "Wait until any invocations of this algorithm started before this one have completed."
        // So if we're currently running a task, we'll need to delay this invocation.
        if (currentlyRunningATask) {
            // Delay by doing a setTimeout. setImmediate was tried instead, but in Firefox 7 it generated a
            // "too much recursion" error.
            setTimeout(runIfPresent, 0, handle);
        } else {
            var task = tasksByHandle[handle];
            if (task) {
                currentlyRunningATask = true;
                try {
                    run(task);
                } finally {
                    clearImmediate(handle);
                    currentlyRunningATask = false;
                }
            }
        }
    }

    function installNextTickImplementation() {
        registerImmediate = function(handle) {
            process.nextTick(function () { runIfPresent(handle); });
        };
    }

    function canUsePostMessage() {
        // The test against `importScripts` prevents this implementation from being installed inside a web worker,
        // where `global.postMessage` means something completely different and can't be used for this purpose.
        if (global.postMessage && !global.importScripts) {
            var postMessageIsAsynchronous = true;
            var oldOnMessage = global.onmessage;
            global.onmessage = function() {
                postMessageIsAsynchronous = false;
            };
            global.postMessage("", "*");
            global.onmessage = oldOnMessage;
            return postMessageIsAsynchronous;
        }
    }

    function installPostMessageImplementation() {
        // Installs an event handler on `global` for the `message` event: see
        // * https://developer.mozilla.org/en/DOM/window.postMessage
        // * http://www.whatwg.org/specs/web-apps/current-work/multipage/comms.html#crossDocumentMessages

        var messagePrefix = "setImmediate$" + Math.random() + "$";
        var onGlobalMessage = function(event) {
            if (event.source === global &&
                typeof event.data === "string" &&
                event.data.indexOf(messagePrefix) === 0) {
                runIfPresent(+event.data.slice(messagePrefix.length));
            }
        };

        if (global.addEventListener) {
            global.addEventListener("message", onGlobalMessage, false);
        } else {
            global.attachEvent("onmessage", onGlobalMessage);
        }

        registerImmediate = function(handle) {
            global.postMessage(messagePrefix + handle, "*");
        };
    }

    function installMessageChannelImplementation() {
        var channel = new MessageChannel();
        channel.port1.onmessage = function(event) {
            var handle = event.data;
            runIfPresent(handle);
        };

        registerImmediate = function(handle) {
            channel.port2.postMessage(handle);
        };
    }

    function installReadyStateChangeImplementation() {
        var html = doc.documentElement;
        registerImmediate = function(handle) {
            // Create a <script> element; its readystatechange event will be fired asynchronously once it is inserted
            // into the document. Do so, thus queuing up the task. Remember to clean up once it's been called.
            var script = doc.createElement("script");
            script.onreadystatechange = function () {
                runIfPresent(handle);
                script.onreadystatechange = null;
                html.removeChild(script);
                script = null;
            };
            html.appendChild(script);
        };
    }

    function installSetTimeoutImplementation() {
        registerImmediate = function(handle) {
            setTimeout(runIfPresent, 0, handle);
        };
    }

    // If supported, we should attach to the prototype of global, since that is where setTimeout et al. live.
    var attachTo = Object.getPrototypeOf && Object.getPrototypeOf(global);
    attachTo = attachTo && attachTo.setTimeout ? attachTo : global;

    // Don't get fooled by e.g. browserify environments.
    if ({}.toString.call(global.process) === "[object process]") {
        // For Node.js before 0.9
        installNextTickImplementation();

    } else if (canUsePostMessage()) {
        // For non-IE10 modern browsers
        installPostMessageImplementation();

    } else if (global.MessageChannel) {
        // For web workers, where supported
        installMessageChannelImplementation();

    } else if (doc && "onreadystatechange" in doc.createElement("script")) {
        // For IE 6–8
        installReadyStateChangeImplementation();

    } else {
        // For older browsers
        installSetTimeoutImplementation();
    }

    attachTo.setImmediate = setImmediate;
    attachTo.clearImmediate = clearImmediate;
}(typeof self === "undefined" ? typeof global === "undefined" ? this : global : self));

}).call(this)}).call(this,require('_process'),typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"_process":3}],27:[function(require,module,exports){
var createElement = require("./vdom/create-element.js")

module.exports = createElement

},{"./vdom/create-element.js":33}],28:[function(require,module,exports){
var diff = require("./vtree/diff.js")

module.exports = diff

},{"./vtree/diff.js":56}],29:[function(require,module,exports){
var h = require("./virtual-hyperscript/index.js")

module.exports = h

},{"./virtual-hyperscript/index.js":41}],30:[function(require,module,exports){
var diff = require("./diff.js")
var patch = require("./patch.js")
var h = require("./h.js")
var create = require("./create-element.js")
var VNode = require('./vnode/vnode.js')
var VText = require('./vnode/vtext.js')

module.exports = {
    diff: diff,
    patch: patch,
    h: h,
    create: create,
    VNode: VNode,
    VText: VText
}

},{"./create-element.js":27,"./diff.js":28,"./h.js":29,"./patch.js":31,"./vnode/vnode.js":52,"./vnode/vtext.js":54}],31:[function(require,module,exports){
var patch = require("./vdom/patch.js")

module.exports = patch

},{"./vdom/patch.js":36}],32:[function(require,module,exports){
var isObject = require("is-object")
var isHook = require("../vnode/is-vhook.js")

module.exports = applyProperties

function applyProperties(node, props, previous) {
    for (var propName in props) {
        var propValue = props[propName]

        if (propValue === undefined) {
            removeProperty(node, propName, propValue, previous);
        } else if (isHook(propValue)) {
            removeProperty(node, propName, propValue, previous)
            if (propValue.hook) {
                propValue.hook(node,
                    propName,
                    previous ? previous[propName] : undefined)
            }
        } else {
            if (isObject(propValue)) {
                patchObject(node, props, previous, propName, propValue);
            } else {
                node[propName] = propValue
            }
        }
    }
}

function removeProperty(node, propName, propValue, previous) {
    if (previous) {
        var previousValue = previous[propName]

        if (!isHook(previousValue)) {
            if (propName === "attributes") {
                for (var attrName in previousValue) {
                    node.removeAttribute(attrName)
                }
            } else if (propName === "style") {
                for (var i in previousValue) {
                    node.style[i] = ""
                }
            } else if (typeof previousValue === "string") {
                node[propName] = ""
            } else {
                node[propName] = null
            }
        } else if (previousValue.unhook) {
            previousValue.unhook(node, propName, propValue)
        }
    }
}

function patchObject(node, props, previous, propName, propValue) {
    var previousValue = previous ? previous[propName] : undefined

    // Set attributes
    if (propName === "attributes") {
        for (var attrName in propValue) {
            var attrValue = propValue[attrName]

            if (attrValue === undefined) {
                node.removeAttribute(attrName)
            } else {
                node.setAttribute(attrName, attrValue)
            }
        }

        return
    }

    if(previousValue && isObject(previousValue) &&
        getPrototype(previousValue) !== getPrototype(propValue)) {
        node[propName] = propValue
        return
    }

    if (!isObject(node[propName])) {
        node[propName] = {}
    }

    var replacer = propName === "style" ? "" : undefined

    for (var k in propValue) {
        var value = propValue[k]
        node[propName][k] = (value === undefined) ? replacer : value
    }
}

function getPrototype(value) {
    if (Object.getPrototypeOf) {
        return Object.getPrototypeOf(value)
    } else if (value.__proto__) {
        return value.__proto__
    } else if (value.constructor) {
        return value.constructor.prototype
    }
}

},{"../vnode/is-vhook.js":47,"is-object":25}],33:[function(require,module,exports){
var document = require("global/document")

var applyProperties = require("./apply-properties")

var isVNode = require("../vnode/is-vnode.js")
var isVText = require("../vnode/is-vtext.js")
var isWidget = require("../vnode/is-widget.js")
var handleThunk = require("../vnode/handle-thunk.js")

module.exports = createElement

function createElement(vnode, opts) {
    var doc = opts ? opts.document || document : document
    var warn = opts ? opts.warn : null

    vnode = handleThunk(vnode).a

    if (isWidget(vnode)) {
        return vnode.init()
    } else if (isVText(vnode)) {
        return doc.createTextNode(vnode.text)
    } else if (!isVNode(vnode)) {
        if (warn) {
            warn("Item is not a valid virtual dom node", vnode)
        }
        return null
    }

    var node = (vnode.namespace === null) ?
        doc.createElement(vnode.tagName) :
        doc.createElementNS(vnode.namespace, vnode.tagName)

    var props = vnode.properties
    applyProperties(node, props)

    var children = vnode.children

    for (var i = 0; i < children.length; i++) {
        var childNode = createElement(children[i], opts)
        if (childNode) {
            node.appendChild(childNode)
        }
    }

    return node
}

},{"../vnode/handle-thunk.js":45,"../vnode/is-vnode.js":48,"../vnode/is-vtext.js":49,"../vnode/is-widget.js":50,"./apply-properties":32,"global/document":22}],34:[function(require,module,exports){
// Maps a virtual DOM tree onto a real DOM tree in an efficient manner.
// We don't want to read all of the DOM nodes in the tree so we use
// the in-order tree indexing to eliminate recursion down certain branches.
// We only recurse into a DOM node if we know that it contains a child of
// interest.

var noChild = {}

module.exports = domIndex

function domIndex(rootNode, tree, indices, nodes) {
    if (!indices || indices.length === 0) {
        return {}
    } else {
        indices.sort(ascending)
        return recurse(rootNode, tree, indices, nodes, 0)
    }
}

function recurse(rootNode, tree, indices, nodes, rootIndex) {
    nodes = nodes || {}


    if (rootNode) {
        if (indexInRange(indices, rootIndex, rootIndex)) {
            nodes[rootIndex] = rootNode
        }

        var vChildren = tree.children

        if (vChildren) {

            var childNodes = rootNode.childNodes

            for (var i = 0; i < tree.children.length; i++) {
                rootIndex += 1

                var vChild = vChildren[i] || noChild
                var nextIndex = rootIndex + (vChild.count || 0)

                // skip recursion down the tree if there are no nodes down here
                if (indexInRange(indices, rootIndex, nextIndex)) {
                    recurse(childNodes[i], vChild, indices, nodes, rootIndex)
                }

                rootIndex = nextIndex
            }
        }
    }

    return nodes
}

// Binary search for an index in the interval [left, right]
function indexInRange(indices, left, right) {
    if (indices.length === 0) {
        return false
    }

    var minIndex = 0
    var maxIndex = indices.length - 1
    var currentIndex
    var currentItem

    while (minIndex <= maxIndex) {
        currentIndex = ((maxIndex + minIndex) / 2) >> 0
        currentItem = indices[currentIndex]

        if (minIndex === maxIndex) {
            return currentItem >= left && currentItem <= right
        } else if (currentItem < left) {
            minIndex = currentIndex + 1
        } else  if (currentItem > right) {
            maxIndex = currentIndex - 1
        } else {
            return true
        }
    }

    return false;
}

function ascending(a, b) {
    return a > b ? 1 : -1
}

},{}],35:[function(require,module,exports){
var applyProperties = require("./apply-properties")

var isWidget = require("../vnode/is-widget.js")
var VPatch = require("../vnode/vpatch.js")

var updateWidget = require("./update-widget")

module.exports = applyPatch

function applyPatch(vpatch, domNode, renderOptions) {
    var type = vpatch.type
    var vNode = vpatch.vNode
    var patch = vpatch.patch

    switch (type) {
        case VPatch.REMOVE:
            return removeNode(domNode, vNode)
        case VPatch.INSERT:
            return insertNode(domNode, patch, renderOptions)
        case VPatch.VTEXT:
            return stringPatch(domNode, vNode, patch, renderOptions)
        case VPatch.WIDGET:
            return widgetPatch(domNode, vNode, patch, renderOptions)
        case VPatch.VNODE:
            return vNodePatch(domNode, vNode, patch, renderOptions)
        case VPatch.ORDER:
            reorderChildren(domNode, patch)
            return domNode
        case VPatch.PROPS:
            applyProperties(domNode, patch, vNode.properties)
            return domNode
        case VPatch.THUNK:
            return replaceRoot(domNode,
                renderOptions.patch(domNode, patch, renderOptions))
        default:
            return domNode
    }
}

function removeNode(domNode, vNode) {
    var parentNode = domNode.parentNode

    if (parentNode) {
        parentNode.removeChild(domNode)
    }

    destroyWidget(domNode, vNode);

    return null
}

function insertNode(parentNode, vNode, renderOptions) {
    var newNode = renderOptions.render(vNode, renderOptions)

    if (parentNode) {
        parentNode.appendChild(newNode)
    }

    return parentNode
}

function stringPatch(domNode, leftVNode, vText, renderOptions) {
    var newNode

    if (domNode.nodeType === 3) {
        domNode.replaceData(0, domNode.length, vText.text)
        newNode = domNode
    } else {
        var parentNode = domNode.parentNode
        newNode = renderOptions.render(vText, renderOptions)

        if (parentNode && newNode !== domNode) {
            parentNode.replaceChild(newNode, domNode)
        }
    }

    return newNode
}

function widgetPatch(domNode, leftVNode, widget, renderOptions) {
    var updating = updateWidget(leftVNode, widget)
    var newNode

    if (updating) {
        newNode = widget.update(leftVNode, domNode) || domNode
    } else {
        newNode = renderOptions.render(widget, renderOptions)
    }

    var parentNode = domNode.parentNode

    if (parentNode && newNode !== domNode) {
        parentNode.replaceChild(newNode, domNode)
    }

    if (!updating) {
        destroyWidget(domNode, leftVNode)
    }

    return newNode
}

function vNodePatch(domNode, leftVNode, vNode, renderOptions) {
    var parentNode = domNode.parentNode
    var newNode = renderOptions.render(vNode, renderOptions)

    if (parentNode && newNode !== domNode) {
        parentNode.replaceChild(newNode, domNode)
    }

    return newNode
}

function destroyWidget(domNode, w) {
    if (typeof w.destroy === "function" && isWidget(w)) {
        w.destroy(domNode)
    }
}

function reorderChildren(domNode, moves) {
    var childNodes = domNode.childNodes
    var keyMap = {}
    var node
    var remove
    var insert

    for (var i = 0; i < moves.removes.length; i++) {
        remove = moves.removes[i]
        node = childNodes[remove.from]
        if (remove.key) {
            keyMap[remove.key] = node
        }
        domNode.removeChild(node)
    }

    var length = childNodes.length
    for (var j = 0; j < moves.inserts.length; j++) {
        insert = moves.inserts[j]
        node = keyMap[insert.key]
        // this is the weirdest bug i've ever seen in webkit
        domNode.insertBefore(node, insert.to >= length++ ? null : childNodes[insert.to])
    }
}

function replaceRoot(oldRoot, newRoot) {
    if (oldRoot && newRoot && oldRoot !== newRoot && oldRoot.parentNode) {
        oldRoot.parentNode.replaceChild(newRoot, oldRoot)
    }

    return newRoot;
}

},{"../vnode/is-widget.js":50,"../vnode/vpatch.js":53,"./apply-properties":32,"./update-widget":37}],36:[function(require,module,exports){
var document = require("global/document")
var isArray = require("x-is-array")

var render = require("./create-element")
var domIndex = require("./dom-index")
var patchOp = require("./patch-op")
module.exports = patch

function patch(rootNode, patches, renderOptions) {
    renderOptions = renderOptions || {}
    renderOptions.patch = renderOptions.patch && renderOptions.patch !== patch
        ? renderOptions.patch
        : patchRecursive
    renderOptions.render = renderOptions.render || render

    return renderOptions.patch(rootNode, patches, renderOptions)
}

function patchRecursive(rootNode, patches, renderOptions) {
    var indices = patchIndices(patches)

    if (indices.length === 0) {
        return rootNode
    }

    var index = domIndex(rootNode, patches.a, indices)
    var ownerDocument = rootNode.ownerDocument

    if (!renderOptions.document && ownerDocument !== document) {
        renderOptions.document = ownerDocument
    }

    for (var i = 0; i < indices.length; i++) {
        var nodeIndex = indices[i]
        rootNode = applyPatch(rootNode,
            index[nodeIndex],
            patches[nodeIndex],
            renderOptions)
    }

    return rootNode
}

function applyPatch(rootNode, domNode, patchList, renderOptions) {
    if (!domNode) {
        return rootNode
    }

    var newNode

    if (isArray(patchList)) {
        for (var i = 0; i < patchList.length; i++) {
            newNode = patchOp(patchList[i], domNode, renderOptions)

            if (domNode === rootNode) {
                rootNode = newNode
            }
        }
    } else {
        newNode = patchOp(patchList, domNode, renderOptions)

        if (domNode === rootNode) {
            rootNode = newNode
        }
    }

    return rootNode
}

function patchIndices(patches) {
    var indices = []

    for (var key in patches) {
        if (key !== "a") {
            indices.push(Number(key))
        }
    }

    return indices
}

},{"./create-element":33,"./dom-index":34,"./patch-op":35,"global/document":22,"x-is-array":57}],37:[function(require,module,exports){
var isWidget = require("../vnode/is-widget.js")

module.exports = updateWidget

function updateWidget(a, b) {
    if (isWidget(a) && isWidget(b)) {
        if ("name" in a && "name" in b) {
            return a.id === b.id
        } else {
            return a.init === b.init
        }
    }

    return false
}

},{"../vnode/is-widget.js":50}],38:[function(require,module,exports){
'use strict';

module.exports = AttributeHook;

function AttributeHook(namespace, value) {
    if (!(this instanceof AttributeHook)) {
        return new AttributeHook(namespace, value);
    }

    this.namespace = namespace;
    this.value = value;
}

AttributeHook.prototype.hook = function (node, prop, prev) {
    if (prev && prev.type === 'AttributeHook' &&
        prev.value === this.value &&
        prev.namespace === this.namespace) {
        return;
    }

    node.setAttributeNS(this.namespace, prop, this.value);
};

AttributeHook.prototype.unhook = function (node, prop, next) {
    if (next && next.type === 'AttributeHook' &&
        next.namespace === this.namespace) {
        return;
    }

    var colonPosition = prop.indexOf(':');
    var localName = colonPosition > -1 ? prop.substr(colonPosition + 1) : prop;
    node.removeAttributeNS(this.namespace, localName);
};

AttributeHook.prototype.type = 'AttributeHook';

},{}],39:[function(require,module,exports){
'use strict';

var EvStore = require('ev-store');

module.exports = EvHook;

function EvHook(value) {
    if (!(this instanceof EvHook)) {
        return new EvHook(value);
    }

    this.value = value;
}

EvHook.prototype.hook = function (node, propertyName) {
    var es = EvStore(node);
    var propName = propertyName.substr(3);

    es[propName] = this.value;
};

EvHook.prototype.unhook = function(node, propertyName) {
    var es = EvStore(node);
    var propName = propertyName.substr(3);

    es[propName] = undefined;
};

},{"ev-store":21}],40:[function(require,module,exports){
'use strict';

module.exports = SoftSetHook;

function SoftSetHook(value) {
    if (!(this instanceof SoftSetHook)) {
        return new SoftSetHook(value);
    }

    this.value = value;
}

SoftSetHook.prototype.hook = function (node, propertyName) {
    if (node[propertyName] !== this.value) {
        node[propertyName] = this.value;
    }
};

},{}],41:[function(require,module,exports){
'use strict';

var isArray = require('x-is-array');

var VNode = require('../vnode/vnode.js');
var VText = require('../vnode/vtext.js');
var isVNode = require('../vnode/is-vnode');
var isVText = require('../vnode/is-vtext');
var isWidget = require('../vnode/is-widget');
var isHook = require('../vnode/is-vhook');
var isVThunk = require('../vnode/is-thunk');

var parseTag = require('./parse-tag.js');
var softSetHook = require('./hooks/soft-set-hook.js');
var evHook = require('./hooks/ev-hook.js');

module.exports = h;

function h(tagName, properties, children) {
    var childNodes = [];
    var tag, props, key, namespace;

    if (!children && isChildren(properties)) {
        children = properties;
        props = {};
    }

    props = props || properties || {};
    tag = parseTag(tagName, props);

    // support keys
    if (props.hasOwnProperty('key')) {
        key = props.key;
        props.key = undefined;
    }

    // support namespace
    if (props.hasOwnProperty('namespace')) {
        namespace = props.namespace;
        props.namespace = undefined;
    }

    // fix cursor bug
    if (tag === 'INPUT' &&
        !namespace &&
        props.hasOwnProperty('value') &&
        props.value !== undefined &&
        !isHook(props.value)
    ) {
        props.value = softSetHook(props.value);
    }

    transformProperties(props);

    if (children !== undefined && children !== null) {
        addChild(children, childNodes, tag, props);
    }


    return new VNode(tag, props, childNodes, key, namespace);
}

function addChild(c, childNodes, tag, props) {
    if (typeof c === 'string') {
        childNodes.push(new VText(c));
    } else if (typeof c === 'number') {
        childNodes.push(new VText(String(c)));
    } else if (isChild(c)) {
        childNodes.push(c);
    } else if (isArray(c)) {
        for (var i = 0; i < c.length; i++) {
            addChild(c[i], childNodes, tag, props);
        }
    } else if (c === null || c === undefined) {
        return;
    } else {
        throw UnexpectedVirtualElement({
            foreignObject: c,
            parentVnode: {
                tagName: tag,
                properties: props
            }
        });
    }
}

function transformProperties(props) {
    for (var propName in props) {
        if (props.hasOwnProperty(propName)) {
            var value = props[propName];

            if (isHook(value)) {
                continue;
            }

            if (propName.substr(0, 3) === 'ev-') {
                // add ev-foo support
                props[propName] = evHook(value);
            }
        }
    }
}

function isChild(x) {
    return isVNode(x) || isVText(x) || isWidget(x) || isVThunk(x);
}

function isChildren(x) {
    return typeof x === 'string' || isArray(x) || isChild(x);
}

function UnexpectedVirtualElement(data) {
    var err = new Error();

    err.type = 'virtual-hyperscript.unexpected.virtual-element';
    err.message = 'Unexpected virtual child passed to h().\n' +
        'Expected a VNode / Vthunk / VWidget / string but:\n' +
        'got:\n' +
        errorString(data.foreignObject) +
        '.\n' +
        'The parent vnode is:\n' +
        errorString(data.parentVnode)
        '\n' +
        'Suggested fix: change your `h(..., [ ... ])` callsite.';
    err.foreignObject = data.foreignObject;
    err.parentVnode = data.parentVnode;

    return err;
}

function errorString(obj) {
    try {
        return JSON.stringify(obj, null, '    ');
    } catch (e) {
        return String(obj);
    }
}

},{"../vnode/is-thunk":46,"../vnode/is-vhook":47,"../vnode/is-vnode":48,"../vnode/is-vtext":49,"../vnode/is-widget":50,"../vnode/vnode.js":52,"../vnode/vtext.js":54,"./hooks/ev-hook.js":39,"./hooks/soft-set-hook.js":40,"./parse-tag.js":42,"x-is-array":57}],42:[function(require,module,exports){
'use strict';

var split = require('browser-split');

var classIdSplit = /([\.#]?[a-zA-Z0-9\u007F-\uFFFF_:-]+)/;
var notClassId = /^\.|#/;

module.exports = parseTag;

function parseTag(tag, props) {
    if (!tag) {
        return 'DIV';
    }

    var noId = !(props.hasOwnProperty('id'));

    var tagParts = split(tag, classIdSplit);
    var tagName = null;

    if (notClassId.test(tagParts[1])) {
        tagName = 'DIV';
    }

    var classes, part, type, i;

    for (i = 0; i < tagParts.length; i++) {
        part = tagParts[i];

        if (!part) {
            continue;
        }

        type = part.charAt(0);

        if (!tagName) {
            tagName = part;
        } else if (type === '.') {
            classes = classes || [];
            classes.push(part.substring(1, part.length));
        } else if (type === '#' && noId) {
            props.id = part.substring(1, part.length);
        }
    }

    if (classes) {
        if (props.className) {
            classes.push(props.className);
        }

        props.className = classes.join(' ');
    }

    return props.namespace ? tagName : tagName.toUpperCase();
}

},{"browser-split":20}],43:[function(require,module,exports){
'use strict';

var DEFAULT_NAMESPACE = null;
var EV_NAMESPACE = 'http://www.w3.org/2001/xml-events';
var XLINK_NAMESPACE = 'http://www.w3.org/1999/xlink';
var XML_NAMESPACE = 'http://www.w3.org/XML/1998/namespace';

// http://www.w3.org/TR/SVGTiny12/attributeTable.html
// http://www.w3.org/TR/SVG/attindex.html
var SVG_PROPERTIES = {
    'about': DEFAULT_NAMESPACE,
    'accent-height': DEFAULT_NAMESPACE,
    'accumulate': DEFAULT_NAMESPACE,
    'additive': DEFAULT_NAMESPACE,
    'alignment-baseline': DEFAULT_NAMESPACE,
    'alphabetic': DEFAULT_NAMESPACE,
    'amplitude': DEFAULT_NAMESPACE,
    'arabic-form': DEFAULT_NAMESPACE,
    'ascent': DEFAULT_NAMESPACE,
    'attributeName': DEFAULT_NAMESPACE,
    'attributeType': DEFAULT_NAMESPACE,
    'azimuth': DEFAULT_NAMESPACE,
    'bandwidth': DEFAULT_NAMESPACE,
    'baseFrequency': DEFAULT_NAMESPACE,
    'baseProfile': DEFAULT_NAMESPACE,
    'baseline-shift': DEFAULT_NAMESPACE,
    'bbox': DEFAULT_NAMESPACE,
    'begin': DEFAULT_NAMESPACE,
    'bias': DEFAULT_NAMESPACE,
    'by': DEFAULT_NAMESPACE,
    'calcMode': DEFAULT_NAMESPACE,
    'cap-height': DEFAULT_NAMESPACE,
    'class': DEFAULT_NAMESPACE,
    'clip': DEFAULT_NAMESPACE,
    'clip-path': DEFAULT_NAMESPACE,
    'clip-rule': DEFAULT_NAMESPACE,
    'clipPathUnits': DEFAULT_NAMESPACE,
    'color': DEFAULT_NAMESPACE,
    'color-interpolation': DEFAULT_NAMESPACE,
    'color-interpolation-filters': DEFAULT_NAMESPACE,
    'color-profile': DEFAULT_NAMESPACE,
    'color-rendering': DEFAULT_NAMESPACE,
    'content': DEFAULT_NAMESPACE,
    'contentScriptType': DEFAULT_NAMESPACE,
    'contentStyleType': DEFAULT_NAMESPACE,
    'cursor': DEFAULT_NAMESPACE,
    'cx': DEFAULT_NAMESPACE,
    'cy': DEFAULT_NAMESPACE,
    'd': DEFAULT_NAMESPACE,
    'datatype': DEFAULT_NAMESPACE,
    'defaultAction': DEFAULT_NAMESPACE,
    'descent': DEFAULT_NAMESPACE,
    'diffuseConstant': DEFAULT_NAMESPACE,
    'direction': DEFAULT_NAMESPACE,
    'display': DEFAULT_NAMESPACE,
    'divisor': DEFAULT_NAMESPACE,
    'dominant-baseline': DEFAULT_NAMESPACE,
    'dur': DEFAULT_NAMESPACE,
    'dx': DEFAULT_NAMESPACE,
    'dy': DEFAULT_NAMESPACE,
    'edgeMode': DEFAULT_NAMESPACE,
    'editable': DEFAULT_NAMESPACE,
    'elevation': DEFAULT_NAMESPACE,
    'enable-background': DEFAULT_NAMESPACE,
    'end': DEFAULT_NAMESPACE,
    'ev:event': EV_NAMESPACE,
    'event': DEFAULT_NAMESPACE,
    'exponent': DEFAULT_NAMESPACE,
    'externalResourcesRequired': DEFAULT_NAMESPACE,
    'fill': DEFAULT_NAMESPACE,
    'fill-opacity': DEFAULT_NAMESPACE,
    'fill-rule': DEFAULT_NAMESPACE,
    'filter': DEFAULT_NAMESPACE,
    'filterRes': DEFAULT_NAMESPACE,
    'filterUnits': DEFAULT_NAMESPACE,
    'flood-color': DEFAULT_NAMESPACE,
    'flood-opacity': DEFAULT_NAMESPACE,
    'focusHighlight': DEFAULT_NAMESPACE,
    'focusable': DEFAULT_NAMESPACE,
    'font-family': DEFAULT_NAMESPACE,
    'font-size': DEFAULT_NAMESPACE,
    'font-size-adjust': DEFAULT_NAMESPACE,
    'font-stretch': DEFAULT_NAMESPACE,
    'font-style': DEFAULT_NAMESPACE,
    'font-variant': DEFAULT_NAMESPACE,
    'font-weight': DEFAULT_NAMESPACE,
    'format': DEFAULT_NAMESPACE,
    'from': DEFAULT_NAMESPACE,
    'fx': DEFAULT_NAMESPACE,
    'fy': DEFAULT_NAMESPACE,
    'g1': DEFAULT_NAMESPACE,
    'g2': DEFAULT_NAMESPACE,
    'glyph-name': DEFAULT_NAMESPACE,
    'glyph-orientation-horizontal': DEFAULT_NAMESPACE,
    'glyph-orientation-vertical': DEFAULT_NAMESPACE,
    'glyphRef': DEFAULT_NAMESPACE,
    'gradientTransform': DEFAULT_NAMESPACE,
    'gradientUnits': DEFAULT_NAMESPACE,
    'handler': DEFAULT_NAMESPACE,
    'hanging': DEFAULT_NAMESPACE,
    'height': DEFAULT_NAMESPACE,
    'horiz-adv-x': DEFAULT_NAMESPACE,
    'horiz-origin-x': DEFAULT_NAMESPACE,
    'horiz-origin-y': DEFAULT_NAMESPACE,
    'id': DEFAULT_NAMESPACE,
    'ideographic': DEFAULT_NAMESPACE,
    'image-rendering': DEFAULT_NAMESPACE,
    'in': DEFAULT_NAMESPACE,
    'in2': DEFAULT_NAMESPACE,
    'initialVisibility': DEFAULT_NAMESPACE,
    'intercept': DEFAULT_NAMESPACE,
    'k': DEFAULT_NAMESPACE,
    'k1': DEFAULT_NAMESPACE,
    'k2': DEFAULT_NAMESPACE,
    'k3': DEFAULT_NAMESPACE,
    'k4': DEFAULT_NAMESPACE,
    'kernelMatrix': DEFAULT_NAMESPACE,
    'kernelUnitLength': DEFAULT_NAMESPACE,
    'kerning': DEFAULT_NAMESPACE,
    'keyPoints': DEFAULT_NAMESPACE,
    'keySplines': DEFAULT_NAMESPACE,
    'keyTimes': DEFAULT_NAMESPACE,
    'lang': DEFAULT_NAMESPACE,
    'lengthAdjust': DEFAULT_NAMESPACE,
    'letter-spacing': DEFAULT_NAMESPACE,
    'lighting-color': DEFAULT_NAMESPACE,
    'limitingConeAngle': DEFAULT_NAMESPACE,
    'local': DEFAULT_NAMESPACE,
    'marker-end': DEFAULT_NAMESPACE,
    'marker-mid': DEFAULT_NAMESPACE,
    'marker-start': DEFAULT_NAMESPACE,
    'markerHeight': DEFAULT_NAMESPACE,
    'markerUnits': DEFAULT_NAMESPACE,
    'markerWidth': DEFAULT_NAMESPACE,
    'mask': DEFAULT_NAMESPACE,
    'maskContentUnits': DEFAULT_NAMESPACE,
    'maskUnits': DEFAULT_NAMESPACE,
    'mathematical': DEFAULT_NAMESPACE,
    'max': DEFAULT_NAMESPACE,
    'media': DEFAULT_NAMESPACE,
    'mediaCharacterEncoding': DEFAULT_NAMESPACE,
    'mediaContentEncodings': DEFAULT_NAMESPACE,
    'mediaSize': DEFAULT_NAMESPACE,
    'mediaTime': DEFAULT_NAMESPACE,
    'method': DEFAULT_NAMESPACE,
    'min': DEFAULT_NAMESPACE,
    'mode': DEFAULT_NAMESPACE,
    'name': DEFAULT_NAMESPACE,
    'nav-down': DEFAULT_NAMESPACE,
    'nav-down-left': DEFAULT_NAMESPACE,
    'nav-down-right': DEFAULT_NAMESPACE,
    'nav-left': DEFAULT_NAMESPACE,
    'nav-next': DEFAULT_NAMESPACE,
    'nav-prev': DEFAULT_NAMESPACE,
    'nav-right': DEFAULT_NAMESPACE,
    'nav-up': DEFAULT_NAMESPACE,
    'nav-up-left': DEFAULT_NAMESPACE,
    'nav-up-right': DEFAULT_NAMESPACE,
    'numOctaves': DEFAULT_NAMESPACE,
    'observer': DEFAULT_NAMESPACE,
    'offset': DEFAULT_NAMESPACE,
    'opacity': DEFAULT_NAMESPACE,
    'operator': DEFAULT_NAMESPACE,
    'order': DEFAULT_NAMESPACE,
    'orient': DEFAULT_NAMESPACE,
    'orientation': DEFAULT_NAMESPACE,
    'origin': DEFAULT_NAMESPACE,
    'overflow': DEFAULT_NAMESPACE,
    'overlay': DEFAULT_NAMESPACE,
    'overline-position': DEFAULT_NAMESPACE,
    'overline-thickness': DEFAULT_NAMESPACE,
    'panose-1': DEFAULT_NAMESPACE,
    'path': DEFAULT_NAMESPACE,
    'pathLength': DEFAULT_NAMESPACE,
    'patternContentUnits': DEFAULT_NAMESPACE,
    'patternTransform': DEFAULT_NAMESPACE,
    'patternUnits': DEFAULT_NAMESPACE,
    'phase': DEFAULT_NAMESPACE,
    'playbackOrder': DEFAULT_NAMESPACE,
    'pointer-events': DEFAULT_NAMESPACE,
    'points': DEFAULT_NAMESPACE,
    'pointsAtX': DEFAULT_NAMESPACE,
    'pointsAtY': DEFAULT_NAMESPACE,
    'pointsAtZ': DEFAULT_NAMESPACE,
    'preserveAlpha': DEFAULT_NAMESPACE,
    'preserveAspectRatio': DEFAULT_NAMESPACE,
    'primitiveUnits': DEFAULT_NAMESPACE,
    'propagate': DEFAULT_NAMESPACE,
    'property': DEFAULT_NAMESPACE,
    'r': DEFAULT_NAMESPACE,
    'radius': DEFAULT_NAMESPACE,
    'refX': DEFAULT_NAMESPACE,
    'refY': DEFAULT_NAMESPACE,
    'rel': DEFAULT_NAMESPACE,
    'rendering-intent': DEFAULT_NAMESPACE,
    'repeatCount': DEFAULT_NAMESPACE,
    'repeatDur': DEFAULT_NAMESPACE,
    'requiredExtensions': DEFAULT_NAMESPACE,
    'requiredFeatures': DEFAULT_NAMESPACE,
    'requiredFonts': DEFAULT_NAMESPACE,
    'requiredFormats': DEFAULT_NAMESPACE,
    'resource': DEFAULT_NAMESPACE,
    'restart': DEFAULT_NAMESPACE,
    'result': DEFAULT_NAMESPACE,
    'rev': DEFAULT_NAMESPACE,
    'role': DEFAULT_NAMESPACE,
    'rotate': DEFAULT_NAMESPACE,
    'rx': DEFAULT_NAMESPACE,
    'ry': DEFAULT_NAMESPACE,
    'scale': DEFAULT_NAMESPACE,
    'seed': DEFAULT_NAMESPACE,
    'shape-rendering': DEFAULT_NAMESPACE,
    'slope': DEFAULT_NAMESPACE,
    'snapshotTime': DEFAULT_NAMESPACE,
    'spacing': DEFAULT_NAMESPACE,
    'specularConstant': DEFAULT_NAMESPACE,
    'specularExponent': DEFAULT_NAMESPACE,
    'spreadMethod': DEFAULT_NAMESPACE,
    'startOffset': DEFAULT_NAMESPACE,
    'stdDeviation': DEFAULT_NAMESPACE,
    'stemh': DEFAULT_NAMESPACE,
    'stemv': DEFAULT_NAMESPACE,
    'stitchTiles': DEFAULT_NAMESPACE,
    'stop-color': DEFAULT_NAMESPACE,
    'stop-opacity': DEFAULT_NAMESPACE,
    'strikethrough-position': DEFAULT_NAMESPACE,
    'strikethrough-thickness': DEFAULT_NAMESPACE,
    'string': DEFAULT_NAMESPACE,
    'stroke': DEFAULT_NAMESPACE,
    'stroke-dasharray': DEFAULT_NAMESPACE,
    'stroke-dashoffset': DEFAULT_NAMESPACE,
    'stroke-linecap': DEFAULT_NAMESPACE,
    'stroke-linejoin': DEFAULT_NAMESPACE,
    'stroke-miterlimit': DEFAULT_NAMESPACE,
    'stroke-opacity': DEFAULT_NAMESPACE,
    'stroke-width': DEFAULT_NAMESPACE,
    'surfaceScale': DEFAULT_NAMESPACE,
    'syncBehavior': DEFAULT_NAMESPACE,
    'syncBehaviorDefault': DEFAULT_NAMESPACE,
    'syncMaster': DEFAULT_NAMESPACE,
    'syncTolerance': DEFAULT_NAMESPACE,
    'syncToleranceDefault': DEFAULT_NAMESPACE,
    'systemLanguage': DEFAULT_NAMESPACE,
    'tableValues': DEFAULT_NAMESPACE,
    'target': DEFAULT_NAMESPACE,
    'targetX': DEFAULT_NAMESPACE,
    'targetY': DEFAULT_NAMESPACE,
    'text-anchor': DEFAULT_NAMESPACE,
    'text-decoration': DEFAULT_NAMESPACE,
    'text-rendering': DEFAULT_NAMESPACE,
    'textLength': DEFAULT_NAMESPACE,
    'timelineBegin': DEFAULT_NAMESPACE,
    'title': DEFAULT_NAMESPACE,
    'to': DEFAULT_NAMESPACE,
    'transform': DEFAULT_NAMESPACE,
    'transformBehavior': DEFAULT_NAMESPACE,
    'type': DEFAULT_NAMESPACE,
    'typeof': DEFAULT_NAMESPACE,
    'u1': DEFAULT_NAMESPACE,
    'u2': DEFAULT_NAMESPACE,
    'underline-position': DEFAULT_NAMESPACE,
    'underline-thickness': DEFAULT_NAMESPACE,
    'unicode': DEFAULT_NAMESPACE,
    'unicode-bidi': DEFAULT_NAMESPACE,
    'unicode-range': DEFAULT_NAMESPACE,
    'units-per-em': DEFAULT_NAMESPACE,
    'v-alphabetic': DEFAULT_NAMESPACE,
    'v-hanging': DEFAULT_NAMESPACE,
    'v-ideographic': DEFAULT_NAMESPACE,
    'v-mathematical': DEFAULT_NAMESPACE,
    'values': DEFAULT_NAMESPACE,
    'version': DEFAULT_NAMESPACE,
    'vert-adv-y': DEFAULT_NAMESPACE,
    'vert-origin-x': DEFAULT_NAMESPACE,
    'vert-origin-y': DEFAULT_NAMESPACE,
    'viewBox': DEFAULT_NAMESPACE,
    'viewTarget': DEFAULT_NAMESPACE,
    'visibility': DEFAULT_NAMESPACE,
    'width': DEFAULT_NAMESPACE,
    'widths': DEFAULT_NAMESPACE,
    'word-spacing': DEFAULT_NAMESPACE,
    'writing-mode': DEFAULT_NAMESPACE,
    'x': DEFAULT_NAMESPACE,
    'x-height': DEFAULT_NAMESPACE,
    'x1': DEFAULT_NAMESPACE,
    'x2': DEFAULT_NAMESPACE,
    'xChannelSelector': DEFAULT_NAMESPACE,
    'xlink:actuate': XLINK_NAMESPACE,
    'xlink:arcrole': XLINK_NAMESPACE,
    'xlink:href': XLINK_NAMESPACE,
    'xlink:role': XLINK_NAMESPACE,
    'xlink:show': XLINK_NAMESPACE,
    'xlink:title': XLINK_NAMESPACE,
    'xlink:type': XLINK_NAMESPACE,
    'xml:base': XML_NAMESPACE,
    'xml:id': XML_NAMESPACE,
    'xml:lang': XML_NAMESPACE,
    'xml:space': XML_NAMESPACE,
    'y': DEFAULT_NAMESPACE,
    'y1': DEFAULT_NAMESPACE,
    'y2': DEFAULT_NAMESPACE,
    'yChannelSelector': DEFAULT_NAMESPACE,
    'z': DEFAULT_NAMESPACE,
    'zoomAndPan': DEFAULT_NAMESPACE
};

module.exports = SVGAttributeNamespace;

function SVGAttributeNamespace(value) {
  if (SVG_PROPERTIES.hasOwnProperty(value)) {
    return SVG_PROPERTIES[value];
  }
}

},{}],44:[function(require,module,exports){
'use strict';

var isArray = require('x-is-array');

var h = require('./index.js');


var SVGAttributeNamespace = require('./svg-attribute-namespace');
var attributeHook = require('./hooks/attribute-hook');

var SVG_NAMESPACE = 'http://www.w3.org/2000/svg';

module.exports = svg;

function svg(tagName, properties, children) {
    if (!children && isChildren(properties)) {
        children = properties;
        properties = {};
    }

    properties = properties || {};

    // set namespace for svg
    properties.namespace = SVG_NAMESPACE;

    var attributes = properties.attributes || (properties.attributes = {});

    for (var key in properties) {
        if (!properties.hasOwnProperty(key)) {
            continue;
        }

        var namespace = SVGAttributeNamespace(key);

        if (namespace === undefined) { // not a svg attribute
            continue;
        }

        var value = properties[key];

        if (typeof value !== 'string' &&
            typeof value !== 'number' &&
            typeof value !== 'boolean'
        ) {
            continue;
        }

        if (namespace !== null) { // namespaced attribute
            properties[key] = attributeHook(namespace, value);
            continue;
        }

        attributes[key] = value
        properties[key] = undefined
    }

    return h(tagName, properties, children);
}

function isChildren(x) {
    return typeof x === 'string' || isArray(x);
}

},{"./hooks/attribute-hook":38,"./index.js":41,"./svg-attribute-namespace":43,"x-is-array":57}],45:[function(require,module,exports){
var isVNode = require("./is-vnode")
var isVText = require("./is-vtext")
var isWidget = require("./is-widget")
var isThunk = require("./is-thunk")

module.exports = handleThunk

function handleThunk(a, b) {
    var renderedA = a
    var renderedB = b

    if (isThunk(b)) {
        renderedB = renderThunk(b, a)
    }

    if (isThunk(a)) {
        renderedA = renderThunk(a, null)
    }

    return {
        a: renderedA,
        b: renderedB
    }
}

function renderThunk(thunk, previous) {
    var renderedThunk = thunk.vnode

    if (!renderedThunk) {
        renderedThunk = thunk.vnode = thunk.render(previous)
    }

    if (!(isVNode(renderedThunk) ||
            isVText(renderedThunk) ||
            isWidget(renderedThunk))) {
        throw new Error("thunk did not return a valid node");
    }

    return renderedThunk
}

},{"./is-thunk":46,"./is-vnode":48,"./is-vtext":49,"./is-widget":50}],46:[function(require,module,exports){
module.exports = isThunk

function isThunk(t) {
    return t && t.type === "Thunk"
}

},{}],47:[function(require,module,exports){
module.exports = isHook

function isHook(hook) {
    return hook &&
      (typeof hook.hook === "function" && !hook.hasOwnProperty("hook") ||
       typeof hook.unhook === "function" && !hook.hasOwnProperty("unhook"))
}

},{}],48:[function(require,module,exports){
var version = require("./version")

module.exports = isVirtualNode

function isVirtualNode(x) {
    return x && x.type === "VirtualNode" && x.version === version
}

},{"./version":51}],49:[function(require,module,exports){
var version = require("./version")

module.exports = isVirtualText

function isVirtualText(x) {
    return x && x.type === "VirtualText" && x.version === version
}

},{"./version":51}],50:[function(require,module,exports){
module.exports = isWidget

function isWidget(w) {
    return w && w.type === "Widget"
}

},{}],51:[function(require,module,exports){
module.exports = "2"

},{}],52:[function(require,module,exports){
var version = require("./version")
var isVNode = require("./is-vnode")
var isWidget = require("./is-widget")
var isThunk = require("./is-thunk")
var isVHook = require("./is-vhook")

module.exports = VirtualNode

var noProperties = {}
var noChildren = []

function VirtualNode(tagName, properties, children, key, namespace) {
    this.tagName = tagName
    this.properties = properties || noProperties
    this.children = children || noChildren
    this.key = key != null ? String(key) : undefined
    this.namespace = (typeof namespace === "string") ? namespace : null

    var count = (children && children.length) || 0
    var descendants = 0
    var hasWidgets = false
    var hasThunks = false
    var descendantHooks = false
    var hooks

    for (var propName in properties) {
        if (properties.hasOwnProperty(propName)) {
            var property = properties[propName]
            if (isVHook(property) && property.unhook) {
                if (!hooks) {
                    hooks = {}
                }

                hooks[propName] = property
            }
        }
    }

    for (var i = 0; i < count; i++) {
        var child = children[i]
        if (isVNode(child)) {
            descendants += child.count || 0

            if (!hasWidgets && child.hasWidgets) {
                hasWidgets = true
            }

            if (!hasThunks && child.hasThunks) {
                hasThunks = true
            }

            if (!descendantHooks && (child.hooks || child.descendantHooks)) {
                descendantHooks = true
            }
        } else if (!hasWidgets && isWidget(child)) {
            if (typeof child.destroy === "function") {
                hasWidgets = true
            }
        } else if (!hasThunks && isThunk(child)) {
            hasThunks = true;
        }
    }

    this.count = count + descendants
    this.hasWidgets = hasWidgets
    this.hasThunks = hasThunks
    this.hooks = hooks
    this.descendantHooks = descendantHooks
}

VirtualNode.prototype.version = version
VirtualNode.prototype.type = "VirtualNode"

},{"./is-thunk":46,"./is-vhook":47,"./is-vnode":48,"./is-widget":50,"./version":51}],53:[function(require,module,exports){
var version = require("./version")

VirtualPatch.NONE = 0
VirtualPatch.VTEXT = 1
VirtualPatch.VNODE = 2
VirtualPatch.WIDGET = 3
VirtualPatch.PROPS = 4
VirtualPatch.ORDER = 5
VirtualPatch.INSERT = 6
VirtualPatch.REMOVE = 7
VirtualPatch.THUNK = 8

module.exports = VirtualPatch

function VirtualPatch(type, vNode, patch) {
    this.type = Number(type)
    this.vNode = vNode
    this.patch = patch
}

VirtualPatch.prototype.version = version
VirtualPatch.prototype.type = "VirtualPatch"

},{"./version":51}],54:[function(require,module,exports){
var version = require("./version")

module.exports = VirtualText

function VirtualText(text) {
    this.text = String(text)
}

VirtualText.prototype.version = version
VirtualText.prototype.type = "VirtualText"

},{"./version":51}],55:[function(require,module,exports){
var isObject = require("is-object")
var isHook = require("../vnode/is-vhook")

module.exports = diffProps

function diffProps(a, b) {
    var diff

    for (var aKey in a) {
        if (!(aKey in b)) {
            diff = diff || {}
            diff[aKey] = undefined
        }

        var aValue = a[aKey]
        var bValue = b[aKey]

        if (aValue === bValue) {
            continue
        } else if (isObject(aValue) && isObject(bValue)) {
            if (getPrototype(bValue) !== getPrototype(aValue)) {
                diff = diff || {}
                diff[aKey] = bValue
            } else if (isHook(bValue)) {
                 diff = diff || {}
                 diff[aKey] = bValue
            } else {
                var objectDiff = diffProps(aValue, bValue)
                if (objectDiff) {
                    diff = diff || {}
                    diff[aKey] = objectDiff
                }
            }
        } else {
            diff = diff || {}
            diff[aKey] = bValue
        }
    }

    for (var bKey in b) {
        if (!(bKey in a)) {
            diff = diff || {}
            diff[bKey] = b[bKey]
        }
    }

    return diff
}

function getPrototype(value) {
  if (Object.getPrototypeOf) {
    return Object.getPrototypeOf(value)
  } else if (value.__proto__) {
    return value.__proto__
  } else if (value.constructor) {
    return value.constructor.prototype
  }
}

},{"../vnode/is-vhook":47,"is-object":25}],56:[function(require,module,exports){
var isArray = require("x-is-array")

var VPatch = require("../vnode/vpatch")
var isVNode = require("../vnode/is-vnode")
var isVText = require("../vnode/is-vtext")
var isWidget = require("../vnode/is-widget")
var isThunk = require("../vnode/is-thunk")
var handleThunk = require("../vnode/handle-thunk")

var diffProps = require("./diff-props")

module.exports = diff

function diff(a, b) {
    var patch = { a: a }
    walk(a, b, patch, 0)
    return patch
}

function walk(a, b, patch, index) {
    if (a === b) {
        return
    }

    var apply = patch[index]
    var applyClear = false

    if (isThunk(a) || isThunk(b)) {
        thunks(a, b, patch, index)
    } else if (b == null) {

        // If a is a widget we will add a remove patch for it
        // Otherwise any child widgets/hooks must be destroyed.
        // This prevents adding two remove patches for a widget.
        if (!isWidget(a)) {
            clearState(a, patch, index)
            apply = patch[index]
        }

        apply = appendPatch(apply, new VPatch(VPatch.REMOVE, a, b))
    } else if (isVNode(b)) {
        if (isVNode(a)) {
            if (a.tagName === b.tagName &&
                a.namespace === b.namespace &&
                a.key === b.key) {
                var propsPatch = diffProps(a.properties, b.properties)
                if (propsPatch) {
                    apply = appendPatch(apply,
                        new VPatch(VPatch.PROPS, a, propsPatch))
                }
                apply = diffChildren(a, b, patch, apply, index)
            } else {
                apply = appendPatch(apply, new VPatch(VPatch.VNODE, a, b))
                applyClear = true
            }
        } else {
            apply = appendPatch(apply, new VPatch(VPatch.VNODE, a, b))
            applyClear = true
        }
    } else if (isVText(b)) {
        if (!isVText(a)) {
            apply = appendPatch(apply, new VPatch(VPatch.VTEXT, a, b))
            applyClear = true
        } else if (a.text !== b.text) {
            apply = appendPatch(apply, new VPatch(VPatch.VTEXT, a, b))
        }
    } else if (isWidget(b)) {
        if (!isWidget(a)) {
            applyClear = true
        }

        apply = appendPatch(apply, new VPatch(VPatch.WIDGET, a, b))
    }

    if (apply) {
        patch[index] = apply
    }

    if (applyClear) {
        clearState(a, patch, index)
    }
}

function diffChildren(a, b, patch, apply, index) {
    var aChildren = a.children
    var orderedSet = reorder(aChildren, b.children)
    var bChildren = orderedSet.children

    var aLen = aChildren.length
    var bLen = bChildren.length
    var len = aLen > bLen ? aLen : bLen

    for (var i = 0; i < len; i++) {
        var leftNode = aChildren[i]
        var rightNode = bChildren[i]
        index += 1

        if (!leftNode) {
            if (rightNode) {
                // Excess nodes in b need to be added
                apply = appendPatch(apply,
                    new VPatch(VPatch.INSERT, null, rightNode))
            }
        } else {
            walk(leftNode, rightNode, patch, index)
        }

        if (isVNode(leftNode) && leftNode.count) {
            index += leftNode.count
        }
    }

    if (orderedSet.moves) {
        // Reorder nodes last
        apply = appendPatch(apply, new VPatch(
            VPatch.ORDER,
            a,
            orderedSet.moves
        ))
    }

    return apply
}

function clearState(vNode, patch, index) {
    // TODO: Make this a single walk, not two
    unhook(vNode, patch, index)
    destroyWidgets(vNode, patch, index)
}

// Patch records for all destroyed widgets must be added because we need
// a DOM node reference for the destroy function
function destroyWidgets(vNode, patch, index) {
    if (isWidget(vNode)) {
        if (typeof vNode.destroy === "function") {
            patch[index] = appendPatch(
                patch[index],
                new VPatch(VPatch.REMOVE, vNode, null)
            )
        }
    } else if (isVNode(vNode) && (vNode.hasWidgets || vNode.hasThunks)) {
        var children = vNode.children
        var len = children.length
        for (var i = 0; i < len; i++) {
            var child = children[i]
            index += 1

            destroyWidgets(child, patch, index)

            if (isVNode(child) && child.count) {
                index += child.count
            }
        }
    } else if (isThunk(vNode)) {
        thunks(vNode, null, patch, index)
    }
}

// Create a sub-patch for thunks
function thunks(a, b, patch, index) {
    var nodes = handleThunk(a, b)
    var thunkPatch = diff(nodes.a, nodes.b)
    if (hasPatches(thunkPatch)) {
        patch[index] = new VPatch(VPatch.THUNK, null, thunkPatch)
    }
}

function hasPatches(patch) {
    for (var index in patch) {
        if (index !== "a") {
            return true
        }
    }

    return false
}

// Execute hooks when two nodes are identical
function unhook(vNode, patch, index) {
    if (isVNode(vNode)) {
        if (vNode.hooks) {
            patch[index] = appendPatch(
                patch[index],
                new VPatch(
                    VPatch.PROPS,
                    vNode,
                    undefinedKeys(vNode.hooks)
                )
            )
        }

        if (vNode.descendantHooks || vNode.hasThunks) {
            var children = vNode.children
            var len = children.length
            for (var i = 0; i < len; i++) {
                var child = children[i]
                index += 1

                unhook(child, patch, index)

                if (isVNode(child) && child.count) {
                    index += child.count
                }
            }
        }
    } else if (isThunk(vNode)) {
        thunks(vNode, null, patch, index)
    }
}

function undefinedKeys(obj) {
    var result = {}

    for (var key in obj) {
        result[key] = undefined
    }

    return result
}

// List diff, naive left to right reordering
function reorder(aChildren, bChildren) {
    // O(M) time, O(M) memory
    var bChildIndex = keyIndex(bChildren)
    var bKeys = bChildIndex.keys
    var bFree = bChildIndex.free

    if (bFree.length === bChildren.length) {
        return {
            children: bChildren,
            moves: null
        }
    }

    // O(N) time, O(N) memory
    var aChildIndex = keyIndex(aChildren)
    var aKeys = aChildIndex.keys
    var aFree = aChildIndex.free

    if (aFree.length === aChildren.length) {
        return {
            children: bChildren,
            moves: null
        }
    }

    // O(MAX(N, M)) memory
    var newChildren = []

    var freeIndex = 0
    var freeCount = bFree.length
    var deletedItems = 0

    // Iterate through a and match a node in b
    // O(N) time,
    for (var i = 0 ; i < aChildren.length; i++) {
        var aItem = aChildren[i]
        var itemIndex

        if (aItem.key) {
            if (bKeys.hasOwnProperty(aItem.key)) {
                // Match up the old keys
                itemIndex = bKeys[aItem.key]
                newChildren.push(bChildren[itemIndex])

            } else {
                // Remove old keyed items
                itemIndex = i - deletedItems++
                newChildren.push(null)
            }
        } else {
            // Match the item in a with the next free item in b
            if (freeIndex < freeCount) {
                itemIndex = bFree[freeIndex++]
                newChildren.push(bChildren[itemIndex])
            } else {
                // There are no free items in b to match with
                // the free items in a, so the extra free nodes
                // are deleted.
                itemIndex = i - deletedItems++
                newChildren.push(null)
            }
        }
    }

    var lastFreeIndex = freeIndex >= bFree.length ?
        bChildren.length :
        bFree[freeIndex]

    // Iterate through b and append any new keys
    // O(M) time
    for (var j = 0; j < bChildren.length; j++) {
        var newItem = bChildren[j]

        if (newItem.key) {
            if (!aKeys.hasOwnProperty(newItem.key)) {
                // Add any new keyed items
                // We are adding new items to the end and then sorting them
                // in place. In future we should insert new items in place.
                newChildren.push(newItem)
            }
        } else if (j >= lastFreeIndex) {
            // Add any leftover non-keyed items
            newChildren.push(newItem)
        }
    }

    var simulate = newChildren.slice()
    var simulateIndex = 0
    var removes = []
    var inserts = []
    var simulateItem

    for (var k = 0; k < bChildren.length;) {
        var wantedItem = bChildren[k]
        simulateItem = simulate[simulateIndex]

        // remove items
        while (simulateItem === null && simulate.length) {
            removes.push(remove(simulate, simulateIndex, null))
            simulateItem = simulate[simulateIndex]
        }

        if (!simulateItem || simulateItem.key !== wantedItem.key) {
            // if we need a key in this position...
            if (wantedItem.key) {
                if (simulateItem && simulateItem.key) {
                    // if an insert doesn't put this key in place, it needs to move
                    if (bKeys[simulateItem.key] !== k + 1) {
                        removes.push(remove(simulate, simulateIndex, simulateItem.key))
                        simulateItem = simulate[simulateIndex]
                        // if the remove didn't put the wanted item in place, we need to insert it
                        if (!simulateItem || simulateItem.key !== wantedItem.key) {
                            inserts.push({key: wantedItem.key, to: k})
                        }
                        // items are matching, so skip ahead
                        else {
                            simulateIndex++
                        }
                    }
                    else {
                        inserts.push({key: wantedItem.key, to: k})
                    }
                }
                else {
                    inserts.push({key: wantedItem.key, to: k})
                }
                k++
            }
            // a key in simulate has no matching wanted key, remove it
            else if (simulateItem && simulateItem.key) {
                removes.push(remove(simulate, simulateIndex, simulateItem.key))
            }
        }
        else {
            simulateIndex++
            k++
        }
    }

    // remove all the remaining nodes from simulate
    while(simulateIndex < simulate.length) {
        simulateItem = simulate[simulateIndex]
        removes.push(remove(simulate, simulateIndex, simulateItem && simulateItem.key))
    }

    // If the only moves we have are deletes then we can just
    // let the delete patch remove these items.
    if (removes.length === deletedItems && !inserts.length) {
        return {
            children: newChildren,
            moves: null
        }
    }

    return {
        children: newChildren,
        moves: {
            removes: removes,
            inserts: inserts
        }
    }
}

function remove(arr, index, key) {
    arr.splice(index, 1)

    return {
        from: index,
        key: key
    }
}

function keyIndex(children) {
    var keys = {}
    var free = []
    var length = children.length

    for (var i = 0; i < length; i++) {
        var child = children[i]

        if (child.key) {
            keys[child.key] = i
        } else {
            free.push(i)
        }
    }

    return {
        keys: keys,     // A hash of key name to index
        free: free      // An array of unkeyed item indices
    }
}

function appendPatch(apply, patch) {
    if (apply) {
        if (isArray(apply)) {
            apply.push(patch)
        } else {
            apply = [apply, patch]
        }

        return apply
    } else {
        return patch
    }
}

},{"../vnode/handle-thunk":45,"../vnode/is-thunk":46,"../vnode/is-vnode":48,"../vnode/is-vtext":49,"../vnode/is-widget":50,"../vnode/vpatch":53,"./diff-props":55,"x-is-array":57}],57:[function(require,module,exports){
var nativeIsArray = Array.isArray
var toString = Object.prototype.toString

module.exports = nativeIsArray || isArray

function isArray(obj) {
    return toString.call(obj) === "[object Array]"
}

},{}],58:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ACT_EDIT_TEXT = exports.ACT_DRAW_POINT_CANCEL = exports.ACT_DRAW_POINT_MOVE = exports.ACT_DRAW_POINT_PLACE = exports.ACT_MOVE = void 0;
exports.ACT_MOVE = "move";
exports.ACT_DRAW_POINT_PLACE = "draw_point:place";
exports.ACT_DRAW_POINT_MOVE = "draw_point:move";
exports.ACT_DRAW_POINT_CANCEL = "draw_point:cancel";
exports.ACT_EDIT_TEXT = "edit_text";

},{}],59:[function(require,module,exports){
"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CollisionDetections = exports.isPolygonCollider = exports.isEllipseCollider = exports.isCircleCollider = exports.isRectCollider = exports.isLineCollider = exports.isPointCollider = exports.DiffCollider = exports.InverseCollider = exports.IntersectionCollider = exports.UnionCollider = exports.EmptyCollider = exports.HalfPlaneCollider = exports.PolygonCollider = exports.EllipseCollider = exports.CircleCollider = exports.RectCollider = exports.LineCollider = exports.PointCollider = exports.collide = exports.Collider = void 0;
var geometry_1 = require("../geometry");
var collisions_1 = require("./collisions");
function Collider(type, props, bounds) {
    return {
        type: type,
        props: props,
        bounds: bounds
    };
}
exports.Collider = Collider;
function collide(a, b, tolerance) {
    if (tolerance === void 0) { tolerance = 0; }
    if (typeof a.type === "function") {
        return a.type(a.props, b, tolerance);
    }
    else if (typeof b.type === "function") {
        return (0, collisions_1.flipCollisionResult)(b.type(b.props, a, tolerance));
    }
    else {
        var algorythm = CollisionDetections.get(a.type, b.type);
        return (algorythm === null || algorythm === void 0 ? void 0 : algorythm(a.props, b.props, tolerance)) || null;
    }
}
exports.collide = collide;
function PointCollider(point) {
    return Collider("point", point, __assign(__assign({}, point), { width: 0, height: 0 }));
}
exports.PointCollider = PointCollider;
function LineCollider(line) {
    return Collider("line", line, (0, geometry_1.lineBounds)(line));
}
exports.LineCollider = LineCollider;
function RectCollider(rect) {
    return Collider("rect", rect, rect);
}
exports.RectCollider = RectCollider;
function CircleCollider(circle) {
    return Collider("circle", circle, (0, geometry_1.circleBounds)(circle));
}
exports.CircleCollider = CircleCollider;
function EllipseCollider(ellipse) {
    return Collider("ellipse", ellipse, (0, geometry_1.ellipseBounds)(ellipse));
}
exports.EllipseCollider = EllipseCollider;
function PolygonCollider(polygon) {
    return Collider("polygon", polygon, (0, geometry_1.polygonBounds)(polygon));
}
exports.PolygonCollider = PolygonCollider;
function HalfPlaneCollider(hs) {
    return Collider("halfplane", hs, null);
}
exports.HalfPlaneCollider = HalfPlaneCollider;
function EmptyCollider() {
    return Collider(function () { return null; }, null, { x: 0, y: 0, width: 0, height: 0 });
}
exports.EmptyCollider = EmptyCollider;
function UnionCollider() {
    var children = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        children[_i] = arguments[_i];
    }
    var childrenBounds = children.map(function (x) { return x.bounds; });
    var bounds = childrenBounds.some(function (x) { return !x; }) ? null : (0, geometry_1.unionRects)(childrenBounds);
    return {
        type: function (children, other, tolerance) {
            var results = children.map(function (child) { return collide(child, other, tolerance); });
            var points = results.reduce(function (acc, cur) { return cur ? acc.concat(cur.points) : acc; }, []);
            return results.some(function (x) { return !!x; }) ? {
                inside: results.every(function (x) { return x === null || x === void 0 ? void 0 : x.inside; }),
                contains: results.some(function (x) { return x === null || x === void 0 ? void 0 : x.contains; }) || (!!points.length && points.every(function (p) {
                    var results = children.map(function (child) { return collide(PointCollider(p), child); });
                    return results.some(function (x) { return x && x.inside; });
                })),
                points: points
            } : null;
        },
        props: children,
        bounds: bounds
    };
}
exports.UnionCollider = UnionCollider;
function IntersectionCollider() {
    var children = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        children[_i] = arguments[_i];
    }
    var bounds = (0, geometry_1.intersectRects)(children.filter(function (x) { return x.bounds; }).map(function (x) { return x.bounds; }));
    return {
        type: function (children, other, tolerance) {
            var results = children.map(function (child) { return collide(child, other, tolerance); });
            if (results.some(function (x) { return !x; })) {
                return null;
            }
            // Filter only the points inside one of the children
            var points = results
                .reduce(function (acc, cur) { return cur ? acc.concat(cur.points) : acc; }, [])
                .filter(function (p) {
                var results = children.map(function (child) { return collide(PointCollider(p), child); });
                return results.some(function (x) { return x && x.inside; });
            });
            if (points.length) {
                return {
                    inside: false,
                    contains: false,
                    points: points
                };
            }
            else {
                var inside = results.some(function (x) { return x === null || x === void 0 ? void 0 : x.inside; });
                var contains = results.every(function (x) { return x === null || x === void 0 ? void 0 : x.contains; });
                return inside || contains ? {
                    inside: inside,
                    contains: contains,
                    points: points
                } : null;
            }
        },
        props: children,
        bounds: bounds
    };
}
exports.IntersectionCollider = IntersectionCollider;
// Fixme: Make inverse operation involutory: A == !!A
function InverseCollider(child) {
    return {
        type: function (child, other, tolerance) { return (0, collisions_1.invertCollisionResult)(collide(child, other, tolerance)); },
        props: child,
        bounds: null
    };
}
exports.InverseCollider = InverseCollider;
function DiffCollider(a, b) {
    return IntersectionCollider(a, InverseCollider(b));
}
exports.DiffCollider = DiffCollider;
function isPointCollider(collider) {
    return collider.type === "point";
}
exports.isPointCollider = isPointCollider;
function isLineCollider(collider) {
    return collider.type === "line";
}
exports.isLineCollider = isLineCollider;
function isRectCollider(collider) {
    return collider.type === "rect";
}
exports.isRectCollider = isRectCollider;
function isCircleCollider(collider) {
    return collider.type === "circle";
}
exports.isCircleCollider = isCircleCollider;
function isEllipseCollider(collider) {
    return collider.type === "ellipse";
}
exports.isEllipseCollider = isEllipseCollider;
function isPolygonCollider(collider) {
    return collider.type === "polygon";
}
exports.isPolygonCollider = isPolygonCollider;
var CollisionDetections;
(function (CollisionDetections) {
    var map = new Map();
    function key(t1, t2) {
        return "".concat(t1, "|").concat(t2);
    }
    function get(t1, t2) {
        return map.get(key(t1, t2));
    }
    CollisionDetections.get = get;
    function register(t1, t2, fn) {
        map.set(key(t1, t2), fn);
        map.set(key(t2, t1), function (a, b, tolerance) { return (0, collisions_1.flipCollisionResult)(fn(b, a, tolerance)); });
    }
    CollisionDetections.register = register;
})(CollisionDetections = exports.CollisionDetections || (exports.CollisionDetections = {}));
CollisionDetections.register("point", "point", collisions_1.CollisionFunctions.pointPoint);
CollisionDetections.register("point", "line", collisions_1.CollisionFunctions.pointLine);
CollisionDetections.register("point", "circle", collisions_1.CollisionFunctions.pointCircle);
CollisionDetections.register("point", "ellipse", collisions_1.CollisionFunctions.pointEllipse);
CollisionDetections.register("point", "rect", collisions_1.CollisionFunctions.pointRect);
CollisionDetections.register("point", "polygon", collisions_1.CollisionFunctions.pointPolygon);
CollisionDetections.register("point", "halfplane", collisions_1.CollisionFunctions.pointHalfplane);
CollisionDetections.register("line", "line", collisions_1.CollisionFunctions.lineLine);
CollisionDetections.register("line", "circle", collisions_1.CollisionFunctions.lineCircle);
CollisionDetections.register("line", "ellipse", collisions_1.CollisionFunctions.lineEllipse);
CollisionDetections.register("line", "rect", collisions_1.CollisionFunctions.lineRect);
CollisionDetections.register("line", "polygon", collisions_1.CollisionFunctions.linePolygon);
CollisionDetections.register("line", "halfplane", collisions_1.CollisionFunctions.lineHalfplane);
CollisionDetections.register("circle", "circle", collisions_1.CollisionFunctions.circleCircle);
CollisionDetections.register("circle", "ellipse", collisions_1.CollisionFunctions.circleEllipse);
CollisionDetections.register("circle", "rect", collisions_1.CollisionFunctions.circleRect);
CollisionDetections.register("circle", "polygon", collisions_1.CollisionFunctions.circlePolygon);
CollisionDetections.register("circle", "halfplane", collisions_1.CollisionFunctions.circleHalfplane);
CollisionDetections.register("ellipse", "ellipse", collisions_1.CollisionFunctions.ellipseEllipse);
CollisionDetections.register("ellipse", "rect", collisions_1.CollisionFunctions.ellipseRect);
CollisionDetections.register("ellipse", "polygon", collisions_1.CollisionFunctions.ellipsePolygon);
CollisionDetections.register("ellipse", "halfplane", collisions_1.CollisionFunctions.ellipseHalfplane);
CollisionDetections.register("rect", "rect", collisions_1.CollisionFunctions.rectRect);
CollisionDetections.register("rect", "polygon", collisions_1.CollisionFunctions.rectPolygon);
CollisionDetections.register("rect", "halfplane", collisions_1.CollisionFunctions.rectHalfplane);
CollisionDetections.register("polygon", "polygon", collisions_1.CollisionFunctions.polygonPolygon);
CollisionDetections.register("polygon", "halfplane", collisions_1.CollisionFunctions.polygonHalfplane);
CollisionDetections.register("halfplane", "halfplane", collisions_1.CollisionFunctions.halfplaneHalfplane);

},{"../geometry":69,"./collisions":60}],60:[function(require,module,exports){
"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CollisionFunctions = exports.invertCollisionResult = exports.flipCollisionResult = void 0;
var geometry_1 = require("../geometry");
var kld_intersections_1 = require("kld-intersections");
function flipCollisionResult(result) {
    if (result) {
        var inside = result.inside, contains = result.contains, points = result.points;
        result = { inside: contains, contains: inside, points: points };
    }
    return result;
}
exports.flipCollisionResult = flipCollisionResult;
function invertCollisionResult(result) {
    if (result === null) {
        return {
            inside: false,
            contains: true,
            points: []
        };
    }
    else if (result.contains) {
        return null;
    }
    else if (result.inside) {
        return {
            inside: false,
            contains: false,
            points: result.points
        };
    }
    else
        return __assign({}, result);
}
exports.invertCollisionResult = invertCollisionResult;
var CollisionFunctions;
(function (CollisionFunctions) {
    function pointPoint(p1, p2, tolerance) {
        var result = (0, geometry_1.distanceSquared)(p1, p2) <= (0, geometry_1.sqr)(tolerance);
        return result ? {
            inside: true,
            contains: true,
            points: []
        } : null;
    }
    CollisionFunctions.pointPoint = pointPoint;
    function pointLine(p, line, tolerance) {
        var result = (0, geometry_1.segmentDistance)(p, line.a, line.b) <= tolerance;
        return result ? {
            inside: true,
            contains: false,
            points: []
        } : null;
    }
    CollisionFunctions.pointLine = pointLine;
    function pointCircle(p, circle) {
        var result = (0, geometry_1.pointInCircle)(p, circle);
        if (result) {
            var inside = !(0, geometry_1.pointOnCircle)(p, circle, 0.01);
            return {
                inside: inside,
                contains: false,
                points: inside ? [] : [p]
            };
        }
        return null;
    }
    CollisionFunctions.pointCircle = pointCircle;
    function pointEllipse(p, e) {
        var result = (0, geometry_1.pointInEllipse)(p, e);
        if (result) {
            var inside = !(0, geometry_1.pointOnEllipse)(p, e, 0.01);
            return {
                inside: inside,
                contains: false,
                points: inside ? [] : [p]
            };
        }
        return null;
    }
    CollisionFunctions.pointEllipse = pointEllipse;
    function pointRect(p, r) {
        var result = (0, geometry_1.pointInRect)(p, r);
        if (result) {
            var inside = !(0, geometry_1.pointOnRect)(p, r, 0.01);
            return {
                inside: inside,
                contains: false,
                points: inside ? [] : [p]
            };
        }
        return null;
    }
    CollisionFunctions.pointRect = pointRect;
    function pointPolygon(p, polygon) {
        if (!polygon.length)
            return null;
        var result = (0, geometry_1.pointInPolygon)(p, polygon);
        if (result) {
            var inside = !(0, geometry_1.pointOnPolygon)(p, polygon, 0.01);
            return {
                inside: inside,
                contains: false,
                points: inside ? [] : [p]
            };
        }
        return null;
    }
    CollisionFunctions.pointPolygon = pointPolygon;
    function pointHalfplane(p, hs) {
        var result = (0, geometry_1.pointInHalfplane)(p, hs.a, hs.b);
        if (result) {
            var inside = (0, geometry_1.lineDistance)(p, hs.a, hs.b) > 0.01;
            return {
                inside: inside,
                contains: false,
                points: inside ? [] : [p]
            };
        }
        return null;
    }
    CollisionFunctions.pointHalfplane = pointHalfplane;
    function lineLine(l1, l2) {
        var a1 = l1.a, b1 = l1.b;
        var a2 = l2.a, b2 = l2.b;
        var shape1 = kld_intersections_1.Shapes.line(new kld_intersections_1.Point2D(a1.x, a1.y), new kld_intersections_1.Point2D(b1.x, b1.y));
        var shape2 = kld_intersections_1.Shapes.line(new kld_intersections_1.Point2D(a2.x, a2.y), new kld_intersections_1.Point2D(b2.x, b2.y));
        var pts = kld_intersections_1.Intersection.intersect(shape1, shape2).points;
        return pts.length ? {
            inside: false,
            contains: false,
            points: pts.map(function (p) { return ({ x: p.x, y: p.y }); })
        } : null;
    }
    CollisionFunctions.lineLine = lineLine;
    function lineRect(line, rect) {
        var points = (0, geometry_1.rectPoints)(rect);
        var pts = points.reduce(function (acc, p, i) {
            var next = i < points.length - 1 ? i + 1 : 0;
            var result = lineLine({ a: p, b: points[next] }, line);
            return result ? acc.concat(result.points) : acc;
        }, []);
        if (pts.length) {
            return {
                inside: false,
                contains: false,
                points: pts
            };
        }
        else {
            return (0, geometry_1.pointInRect)(line.a, rect) && (0, geometry_1.pointInRect)(line.b, rect) ? ({
                inside: true,
                contains: false,
                points: []
            }) : null;
        }
    }
    CollisionFunctions.lineRect = lineRect;
    function lineCircle(line, circle) {
        var a = line.a, b = line.b;
        var shape1 = kld_intersections_1.Shapes.line(new kld_intersections_1.Point2D(a.x, a.y), new kld_intersections_1.Point2D(b.x, b.y));
        var shape2 = kld_intersections_1.Shapes.circle(new kld_intersections_1.Point2D(circle.center.x, circle.center.y), circle.radius);
        var pts = kld_intersections_1.Intersection.intersect(shape1, shape2).points;
        if (pts.length) {
            return {
                inside: false,
                contains: false,
                points: pts.map(function (p) { return ({ x: p.x, y: p.y }); })
            };
        }
        else {
            return (0, geometry_1.pointInCircle)(a, circle) && (0, geometry_1.pointInCircle)(b, circle) ? ({
                inside: true,
                contains: false,
                points: []
            }) : null;
        }
    }
    CollisionFunctions.lineCircle = lineCircle;
    function lineEllipse(line, e) {
        if (e.ry === 0) {
            return lineLine(line, { a: { x: e.center.x - e.rx, y: e.center.y }, b: { x: e.center.x + e.rx, y: e.center.y } });
        }
        if (e.rx === 0) {
            return lineLine(line, { a: { y: e.center.y - e.ry, x: e.center.x }, b: { y: e.center.y + e.ry, x: e.center.x } });
        }
        var a = line.a, b = line.b;
        var shape1 = kld_intersections_1.Shapes.line(new kld_intersections_1.Point2D(a.x, a.y), new kld_intersections_1.Point2D(b.x, b.y));
        var shape2 = kld_intersections_1.Shapes.ellipse(new kld_intersections_1.Point2D(e.center.x, e.center.y), e.rx, e.ry);
        var pts = kld_intersections_1.Intersection.intersect(shape1, shape2).points;
        if (pts.length) {
            return {
                inside: false,
                contains: false,
                points: pts.map(function (p) { return ({ x: p.x, y: p.y }); })
            };
        }
        else {
            return (0, geometry_1.pointInEllipse)(a, e) && (0, geometry_1.pointInEllipse)(b, e) ? ({
                inside: true,
                contains: false,
                points: []
            }) : null;
        }
    }
    CollisionFunctions.lineEllipse = lineEllipse;
    function linePolygon(line, polygon) {
        if (!polygon.length)
            return null;
        var pts = polygon.reduce(function (acc, p, i) {
            var next = i < polygon.length - 1 ? i + 1 : 0;
            var result = lineLine(line, { a: p, b: polygon[next] });
            return result ? acc.concat(result.points) : acc;
        }, []);
        if (pts.length) {
            return {
                inside: false,
                contains: false,
                points: pts
            };
        }
        else {
            return (0, geometry_1.pointInPolygon)(line.a, polygon) && (0, geometry_1.pointInPolygon)(line.b, polygon) ? ({
                inside: true,
                contains: false,
                points: []
            }) : null;
        }
    }
    CollisionFunctions.linePolygon = linePolygon;
    function lineHalfplane(line, hs) {
        var p = (0, geometry_1.intersectLines)(line, hs, false, true);
        if (p) {
            return {
                inside: false,
                contains: false,
                points: [p]
            };
        }
        else {
            return (0, geometry_1.pointInHalfplane)(line.a, hs.a, hs.b) && (0, geometry_1.pointInHalfplane)(line.b, hs.a, hs.b) ? ({
                inside: true,
                contains: false,
                points: []
            }) : null;
        }
    }
    CollisionFunctions.lineHalfplane = lineHalfplane;
    function circleCircle(c1, c2) {
        var d = (0, geometry_1.distance)(c1.center, c2.center);
        if (d > c1.radius + c2.radius) {
            return null;
        }
        var inside = d <= c2.radius - c1.radius;
        var contains = d <= c1.radius - c2.radius;
        if (inside || contains) {
            return { inside: inside, contains: contains, points: [] };
        }
        else {
            var shape1 = kld_intersections_1.Shapes.circle(new kld_intersections_1.Point2D(c1.center.x, c1.center.y), c1.radius);
            var shape2 = kld_intersections_1.Shapes.circle(new kld_intersections_1.Point2D(c2.center.x, c2.center.y), c2.radius);
            var pts = kld_intersections_1.Intersection.intersect(shape1, shape2).points;
            return pts.length ? {
                inside: false,
                contains: false,
                points: pts.map(function (p) { return ({ x: p.x, y: p.y }); })
            } : null;
        }
    }
    CollisionFunctions.circleCircle = circleCircle;
    function circleEllipse(c, e) {
        var shape1 = kld_intersections_1.Shapes.circle(new kld_intersections_1.Point2D(c.center.x, c.center.y), c.radius);
        var shape2 = kld_intersections_1.Shapes.ellipse(new kld_intersections_1.Point2D(e.center.x, e.center.y), e.rx, e.ry);
        var pts = kld_intersections_1.Intersection.intersect(shape1, shape2).points;
        if (pts.length) {
            return {
                inside: false,
                contains: false,
                points: pts.map(function (p) { return ({ x: p.x, y: p.y }); })
            };
        }
        else {
            var PinE = (0, geometry_1.pointInEllipse)(c.center, e);
            var PinC = (0, geometry_1.pointInCircle)(e.center, c);
            if (PinE || PinC) {
                return {
                    inside: (0, geometry_1.pointInEllipse)({ x: c.center.x + c.radius, y: c.center.y }, e),
                    contains: (0, geometry_1.pointInCircle)({ x: e.center.x + e.rx, y: e.center.y }, c),
                    points: []
                };
            }
            else {
                return null;
            }
        }
    }
    CollisionFunctions.circleEllipse = circleEllipse;
    function circleRect(circle, rect) {
        var points = (0, geometry_1.rectPoints)(rect);
        var pts = points.reduce(function (acc, p, i) {
            var next = i < points.length - 1 ? i + 1 : 0;
            var result = lineCircle({ a: p, b: points[next] }, circle);
            return result ? acc.concat(result.points) : acc;
        }, []);
        if (!pts.length) {
            if ((0, geometry_1.pointInCircle)(points[0], circle)) {
                return {
                    inside: false,
                    contains: true,
                    points: pts
                };
            }
            else if ((0, geometry_1.pointInRect)(circle.center, rect)) {
                return {
                    inside: true,
                    contains: false,
                    points: pts
                };
            }
            else {
                return null;
            }
        }
        else
            return {
                inside: false,
                contains: false,
                points: pts
            };
    }
    CollisionFunctions.circleRect = circleRect;
    function circlePolygon(circle, polygon) {
        if (!polygon.length)
            return null;
        var pts = polygon.reduce(function (acc, p, i) {
            var next = i < polygon.length - 1 ? i + 1 : 0;
            var result = lineCircle({ a: p, b: polygon[next] }, circle);
            return result ? acc.concat(result.points) : acc;
        }, []);
        if (!pts.length) {
            if ((0, geometry_1.pointInCircle)(polygon[0], circle)) {
                return {
                    inside: false,
                    contains: true,
                    points: pts
                };
            }
            else if ((0, geometry_1.pointInPolygon)(circle.center, polygon)) {
                return {
                    inside: true,
                    contains: false,
                    points: pts
                };
            }
            else {
                return null;
            }
        }
        else
            return {
                inside: false,
                contains: false,
                points: pts
            };
    }
    CollisionFunctions.circlePolygon = circlePolygon;
    function circleHalfplane(circle, hs) {
        var line = (0, geometry_1.extendLine)(hs, (0, geometry_1.circleBounds)(circle));
        var result = lineCircle(line, circle);
        if (result) {
            return {
                inside: false,
                contains: false,
                points: result.points
            };
        }
        else {
            return (0, geometry_1.pointInHalfplane)(circle.center, hs.a, hs.b) ? ({
                inside: true,
                contains: false,
                points: []
            }) : null;
        }
    }
    CollisionFunctions.circleHalfplane = circleHalfplane;
    function ellipseEllipse(a, b) {
        var shape1 = kld_intersections_1.Shapes.ellipse(new kld_intersections_1.Point2D(a.center.x, a.center.y), a.rx, a.ry);
        var shape2 = kld_intersections_1.Shapes.ellipse(new kld_intersections_1.Point2D(b.center.x, b.center.y), b.rx, b.ry);
        var pts = kld_intersections_1.Intersection.intersect(shape1, shape2).points;
        if (pts.length) {
            return {
                inside: false,
                contains: false,
                points: pts.map(function (p) { return ({ x: p.x, y: p.y }); })
            };
        }
        else {
            var PinA = (0, geometry_1.pointInEllipse)(a.center, b);
            var PinB = (0, geometry_1.pointInEllipse)(b.center, a);
            if (PinA || PinB) {
                return {
                    inside: (0, geometry_1.pointInEllipse)({ x: a.center.x + a.rx, y: a.center.y }, b),
                    contains: (0, geometry_1.pointInEllipse)({ x: b.center.x + b.rx, y: b.center.y }, a),
                    points: []
                };
            }
            else {
                return null;
            }
        }
    }
    CollisionFunctions.ellipseEllipse = ellipseEllipse;
    function ellipseRect(e, rect) {
        var points = (0, geometry_1.rectPoints)(rect);
        var pts = points.reduce(function (acc, p, i) {
            var next = i < points.length - 1 ? i + 1 : 0;
            var result = lineEllipse({ a: p, b: points[next] }, e);
            return result ? acc.concat(result.points) : acc;
        }, []);
        if (!pts.length) {
            if ((0, geometry_1.pointInEllipse)(points[0], e)) {
                return {
                    inside: false,
                    contains: true,
                    points: pts
                };
            }
            else if ((0, geometry_1.pointInRect)(e.center, rect)) {
                return {
                    inside: true,
                    contains: false,
                    points: pts
                };
            }
            else {
                return null;
            }
        }
        else
            return {
                inside: false,
                contains: false,
                points: pts
            };
    }
    CollisionFunctions.ellipseRect = ellipseRect;
    function ellipsePolygon(e, polygon) {
        if (!polygon.length)
            return null;
        var pts = polygon.reduce(function (acc, p, i) {
            var next = i < polygon.length - 1 ? i + 1 : 0;
            var result = lineEllipse({ a: p, b: polygon[next] }, e);
            return result ? acc.concat(result.points) : acc;
        }, []);
        if (!pts.length) {
            if ((0, geometry_1.pointInEllipse)(polygon[0], e)) {
                return {
                    inside: false,
                    contains: true,
                    points: pts
                };
            }
            else if ((0, geometry_1.pointInPolygon)(e.center, polygon)) {
                return {
                    inside: true,
                    contains: false,
                    points: pts
                };
            }
            else {
                return null;
            }
        }
        else
            return {
                inside: false,
                contains: false,
                points: pts
            };
    }
    CollisionFunctions.ellipsePolygon = ellipsePolygon;
    function ellipseHalfplane(e, hs) {
        var line = (0, geometry_1.extendLine)(hs, (0, geometry_1.ellipseBounds)(e));
        var result = lineEllipse(line, e);
        if (result) {
            return {
                inside: false,
                contains: false,
                points: result.points
            };
        }
        else {
            return (0, geometry_1.pointInHalfplane)(e.center, hs.a, hs.b) ? ({
                inside: true,
                contains: false,
                points: []
            }) : null;
        }
    }
    CollisionFunctions.ellipseHalfplane = ellipseHalfplane;
    function rectRect(a, b) {
        var ir = (0, geometry_1.intersectRect)(a, b);
        if (!ir) {
            return null;
        }
        else {
            var inside = (0, geometry_1.containsRect)(b, a);
            var contains = (0, geometry_1.containsRect)(a, b);
            if (inside || contains) {
                return { inside: inside, contains: contains, points: [] };
            }
            else {
                var points_1 = (0, geometry_1.rectPoints)(a);
                var pts = points_1.reduce(function (acc, p, i) {
                    var next = i < points_1.length - 1 ? i + 1 : 0;
                    var result = lineRect({ a: p, b: points_1[next] }, b);
                    return result ? acc.concat(result.points) : acc;
                }, []);
                return pts.length ? {
                    inside: false,
                    contains: false,
                    points: pts
                } : null;
            }
        }
    }
    CollisionFunctions.rectRect = rectRect;
    function rectPolygon(r, polygon) {
        if (!polygon.length)
            return null;
        var pts = polygon.reduce(function (acc, p, i) {
            var next = i < polygon.length - 1 ? i + 1 : 0;
            var result = lineRect({ a: p, b: polygon[next] }, r);
            return result ? acc.concat(result.points) : acc;
        }, []);
        if (!pts.length) {
            if ((0, geometry_1.pointInPolygon)((0, geometry_1.rectPoints)(r)[0], polygon)) {
                return {
                    inside: true,
                    contains: false,
                    points: pts
                };
            }
            else if (polygon.some(function (p) { return (0, geometry_1.pointInRect)(p, r); })) {
                return {
                    inside: false,
                    contains: true,
                    points: pts
                };
            }
            else {
                return null;
            }
        }
        else
            return {
                inside: false,
                contains: false,
                points: pts
            };
    }
    CollisionFunctions.rectPolygon = rectPolygon;
    function rectHalfplane(r, hs) {
        var line = (0, geometry_1.extendLine)(hs, r);
        var result = lineRect(line, r);
        if (result) {
            return {
                inside: false,
                contains: false,
                points: result.points
            };
        }
        else {
            return (0, geometry_1.pointInHalfplane)({ x: r.x, y: r.y }, hs.a, hs.b) ? ({
                inside: true,
                contains: false,
                points: []
            }) : null;
        }
    }
    CollisionFunctions.rectHalfplane = rectHalfplane;
    function polygonPolygon(a, b) {
        if (!a.length)
            return null;
        var pts = a.reduce(function (acc, p, i) {
            var next = i < a.length - 1 ? i + 1 : 0;
            var result = linePolygon({ a: p, b: a[next] }, b);
            return result ? acc.concat(result.points) : acc;
        }, []);
        if (!pts.length) {
            if ((0, geometry_1.pointInPolygon)(a[0], b)) {
                return {
                    inside: true,
                    contains: false,
                    points: pts
                };
            }
            else if ((0, geometry_1.pointInPolygon)(b[0], a)) {
                return {
                    inside: false,
                    contains: true,
                    points: pts
                };
            }
            else {
                return null;
            }
        }
        else
            return {
                inside: false,
                contains: false,
                points: pts
            };
    }
    CollisionFunctions.polygonPolygon = polygonPolygon;
    function polygonHalfplane(polygon, hs) {
        if (!polygon.length)
            return null;
        var line = (0, geometry_1.extendLine)(hs, (0, geometry_1.polygonBounds)(polygon));
        var result = linePolygon(line, polygon);
        if (result) {
            return {
                inside: false,
                contains: false,
                points: result.points
            };
        }
        else {
            return (0, geometry_1.pointInHalfplane)(polygon[0], hs.a, hs.b) ? ({
                inside: true,
                contains: false,
                points: []
            }) : null;
        }
    }
    CollisionFunctions.polygonHalfplane = polygonHalfplane;
    function halfplaneHalfplane(a, b) {
        var p = (0, geometry_1.intersectLines)(a, b, true, true);
        if (p) {
            return {
                inside: false,
                contains: false,
                points: [p]
            };
        }
        else {
            var AinB = (0, geometry_1.pointInHalfplane)(a.a, b.a, b.b);
            var BinA = (0, geometry_1.pointInHalfplane)(b.a, a.a, a.b);
            return AinB || BinA ? {
                inside: AinB && !BinA,
                contains: BinA && !AinB,
                points: []
            } : null;
        }
    }
    CollisionFunctions.halfplaneHalfplane = halfplaneHalfplane;
})(CollisionFunctions = exports.CollisionFunctions || (exports.CollisionFunctions = {}));

},{"../geometry":69,"kld-intersections":99}],61:[function(require,module,exports){
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
__exportStar(require("./colliders"), exports);
__exportStar(require("./collisions"), exports);

},{"./colliders":59,"./collisions":60}],62:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ControlsContext = void 0;
var diagram_1 = require("@carnelian-diagram/core");
exports.ControlsContext = (0, diagram_1.createContext)({
    renderHandle: function () { return null; },
    renderEdge: function () { return null; }
});

},{"@carnelian-diagram/core":16}],63:[function(require,module,exports){
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
__exportStar(require("./controls-context"), exports);
__exportStar(require("./interaction-context"), exports);
__exportStar(require("./selection-context"), exports);

},{"./controls-context":62,"./interaction-context":64,"./selection-context":65}],64:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InteractionContext = void 0;
var diagram_1 = require("@carnelian-diagram/core");
exports.InteractionContext = (0, diagram_1.createContext)(null);

},{"@carnelian-diagram/core":16}],65:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SelectionContext = void 0;
var diagram_1 = require("@carnelian-diagram/core");
exports.SelectionContext = (0, diagram_1.createContext)([]);

},{"@carnelian-diagram/core":16}],66:[function(require,module,exports){
"use strict";
/** @jsxImportSource @carnelian-diagram/core */
Object.defineProperty(exports, "__esModule", { value: true });
exports.EdgeControl = void 0;
var diagram_1 = require("@carnelian-diagram/core");
var __1 = require("..");
function EdgeControl(props) {
    var p1 = new DOMPoint(props.x1, props.y1).matrixTransform(props.transform);
    var p2 = new DOMPoint(props.x2, props.y2).matrixTransform(props.transform);
    (0, __1.useHitTest)((0, __1.lineHitTest)(props.x1, props.y1, props.x2, props.y2, 2), props.hitArea, 1, props.element);
    (0, __1.useAction)(props.hitArea.action, props.onDrag && (function (payload) {
        var _a;
        if (props.hitArea.index === payload.hitArea.index) {
            (_a = props.onDrag) === null || _a === void 0 ? void 0 : _a.call(props, payload);
        }
    }), props.element);
    var controlsContext = (0, diagram_1.useContext)(__1.ControlsContext);
    return controlsContext.renderEdge(props.kind, p1.x, p1.y, p2.x, p2.y, {
        className: "control-edge control-edge-".concat(props.kind)
    });
}
exports.EdgeControl = EdgeControl;

},{"..":87,"@carnelian-diagram/core":16}],67:[function(require,module,exports){
"use strict";
/** @jsxImportSource @carnelian-diagram/core */
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HandleControl = void 0;
var diagram_1 = require("@carnelian-diagram/core");
var __1 = require("..");
function HandleControl(props) {
    var p = new DOMPoint(props.x, props.y).matrixTransform(props.transform);
    var hitTestProps = (0, __1.createHitTestProps)(props.hitArea, props.element);
    (0, __1.useAction)(props.hitArea.action, props.onDrag && (function (payload) {
        var _a;
        if (props.hitArea.index === payload.hitArea.index) {
            (_a = props.onDrag) === null || _a === void 0 ? void 0 : _a.call(props, payload);
        }
    }), props.element);
    var controlsContext = (0, diagram_1.useContext)(__1.ControlsContext);
    return controlsContext.renderHandle(props.kind, p.x, p.y, __assign({ className: "control-handle control-handle-".concat(props.kind) }, hitTestProps));
}
exports.HandleControl = HandleControl;

},{"..":87,"@carnelian-diagram/core":16}],68:[function(require,module,exports){
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
__exportStar(require("./handle"), exports);
__exportStar(require("./edge"), exports);

},{"./edge":66,"./handle":67}],69:[function(require,module,exports){
"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.pointOnPolygon = exports.pointOnEllipse = exports.pointOnRect = exports.pointOnCircle = exports.pointOnLine = exports.pointOnSegment = exports.polygonBounds = exports.ellipseBounds = exports.circleBounds = exports.lineBounds = exports.rectPoints = exports.unionRects = exports.intersectRects = exports.containsRect = exports.inflateRect = exports.unionRect = exports.intersectRect = exports.pointInHalfplane = exports.pointInRect = exports.pointInPolygon = exports.pointInEllipse = exports.pointInCircle = exports.extendLine = exports.intersectLines = exports.segmentBounds = exports.segmentDistance = exports.segmentDistanceSquared = exports.segmentClosestPoint = exports.lineDistance = exports.lineDistanceSquared = exports.lineClosestPoint = exports.distance = exports.distanceSquared = exports.radToDeg = exports.degToRad = exports.clamp = exports.sqr = void 0;
function sqr(x) {
    return x * x;
}
exports.sqr = sqr;
function clamp(x, a, b) {
    return Math.max(a, Math.min(b, x));
}
exports.clamp = clamp;
function degToRad(angle) {
    return angle * Math.PI / 180;
}
exports.degToRad = degToRad;
function radToDeg(angle) {
    return angle * 180 / Math.PI;
}
exports.radToDeg = radToDeg;
function distanceSquared(p1, p2) {
    return sqr(p1.x - p2.x) + sqr(p1.y - p2.y);
}
exports.distanceSquared = distanceSquared;
function distance(p1, p2) {
    return Math.sqrt(distanceSquared(p1, p2));
}
exports.distance = distance;
function lineClosestPoint(p, a, b) {
    var l = distanceSquared(a, b);
    if (l === 0) {
        b = __assign({}, b);
        b.x = a.x + 1;
        l = 1;
    }
    var t = ((p.x - a.x) * (b.x - a.x) + (p.y - a.y) * (b.y - a.y)) / l;
    return {
        x: a.x + t * (b.x - a.x),
        y: a.y + t * (b.y - a.y)
    };
}
exports.lineClosestPoint = lineClosestPoint;
function lineDistanceSquared(p, a, b) {
    return distanceSquared(p, lineClosestPoint(p, a, b));
}
exports.lineDistanceSquared = lineDistanceSquared;
function lineDistance(p, a, b) {
    return Math.sqrt(lineDistanceSquared(p, a, b));
}
exports.lineDistance = lineDistance;
function segmentClosestPoint(p, a, b) {
    var l = distanceSquared(a, b);
    if (l === 0)
        return a;
    var t = clamp(((p.x - a.x) * (b.x - a.x) + (p.y - a.y) * (b.y - a.y)) / l, 0, 1);
    return {
        x: a.x + t * (b.x - a.x),
        y: a.y + t * (b.y - a.y)
    };
}
exports.segmentClosestPoint = segmentClosestPoint;
function segmentDistanceSquared(p, a, b) {
    return distanceSquared(p, segmentClosestPoint(p, a, b));
}
exports.segmentDistanceSquared = segmentDistanceSquared;
function segmentDistance(p, a, b) {
    return Math.sqrt(segmentDistanceSquared(p, a, b));
}
exports.segmentDistance = segmentDistance;
function segmentBounds(a, b) {
    var x1 = Math.min(a.x, b.x);
    var y1 = Math.min(a.y, b.y);
    var x2 = Math.max(a.x, b.x);
    var y2 = Math.max(a.y, b.y);
    return {
        x: x1,
        y: y1,
        width: x2 - x1,
        height: y2 - y1
    };
}
exports.segmentBounds = segmentBounds;
function intersectLines(a, b, inf1, inf2) {
    var _a = a.a, x1 = _a.x, y1 = _a.y;
    var _b = a.b, x2 = _b.x, y2 = _b.y;
    var _c = b.a, x3 = _c.x, y3 = _c.y;
    var _d = b.b, x4 = _d.x, y4 = _d.y;
    var d = (y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1);
    if (d === 0) {
        return null;
    }
    var ua = ((x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3)) / d;
    var ub = ((x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3)) / d;
    var p = { x: x1 + (x2 - x1) * ua, y: y1 + (y2 - y1) * ua };
    return ((inf1 && inf2) ||
        (inf1 && ub >= 0 && ub <= 1) ||
        (inf2 && ua >= 0 && ua <= 1) ||
        (ua >= 0 && ua <= 1 && ub >= 0 && ub <= 1)) ? p : null;
}
exports.intersectLines = intersectLines;
function extendLine(l, r) {
    function extend(a, b, r) {
        var dx = b.x - a.x;
        var dy = b.y - a.y;
        var e = {
            x: dx > 0 ? r.x + r.width : r.x,
            y: dy > 0 ? r.y + r.height : r.y
        };
        if (dx === 0) {
            return { x: a.x, y: e.y };
        }
        if (dy === 0) {
            return { x: e.x, y: a.y };
        }
        var tx = (e.x - a.x) / dx;
        var ty = (e.y - a.y) / dy;
        return {
            x: tx <= ty ? e.x : a.x + ty * dx,
            y: tx <= ty ? a.y + tx * dy : e.y
        };
    }
    return {
        a: extend(l.b, l.a, r),
        b: extend(l.a, l.b, r)
    };
}
exports.extendLine = extendLine;
function pointInCircle(p, circle) {
    return distanceSquared(p, circle.center) <= sqr(circle.radius);
}
exports.pointInCircle = pointInCircle;
function pointInEllipse(p, e) {
    if (e.rx === 0) {
        return p.x == e.center.x && p.y >= e.center.y - e.ry && p.y <= e.center.y + e.ry;
    }
    if (e.ry === 0) {
        return p.y == e.center.y && p.x >= e.center.x - e.rx && p.x <= e.center.x + e.rx;
    }
    var t = sqr(p.x - e.center.x) / sqr(e.rx) + sqr(p.y - e.center.y) / sqr(e.ry);
    return t <= 1;
}
exports.pointInEllipse = pointInEllipse;
function pointInPolygon(p, polygon) {
    var x = p.x, y = p.y;
    var result = false;
    for (var i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
        var xi = polygon[i].x, yi = polygon[i].y;
        var xj = polygon[j].x, yj = polygon[j].y;
        var intersect = ((yi > y) !== (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
        result = intersect ? !result : result;
    }
    return result;
}
exports.pointInPolygon = pointInPolygon;
function pointInRect(p, r) {
    return p.x >= r.x && p.y >= r.y && p.x <= r.x + r.width && p.y <= r.y + r.height;
}
exports.pointInRect = pointInRect;
function pointInHalfplane(p, a, b) {
    return ((b.x - a.x) * (p.y - a.y) - (b.y - a.y) * (p.x - a.x)) >= 0;
}
exports.pointInHalfplane = pointInHalfplane;
function intersectRect(a, b) {
    var x1 = Math.max(a.x, b.x);
    var x2 = Math.min(a.x + a.width, b.x + b.width);
    if (x2 < x1) {
        return null;
    }
    var y1 = Math.max(a.y, b.y);
    var y2 = Math.min(a.y + a.height, b.y + b.height);
    if (y2 < y1) {
        return null;
    }
    return {
        x: x1,
        y: y1,
        width: x2 - x1,
        height: y2 - y1,
    };
}
exports.intersectRect = intersectRect;
function unionRect(a, b) {
    var x1 = Math.min(a.x, b.x);
    var y1 = Math.min(a.y, b.y);
    var x2 = Math.max(a.x + a.width, b.x + b.width);
    var y2 = Math.max(a.y + a.height, b.y + b.height);
    return {
        x: x1,
        y: y1,
        width: x2 - x1,
        height: y2 - y1
    };
}
exports.unionRect = unionRect;
function inflateRect(r, value) {
    return {
        x: r.x - value,
        y: r.y - value,
        width: r.width + value * 2,
        height: r.height + value * 2
    };
}
exports.inflateRect = inflateRect;
function containsRect(a, b) {
    return b.x >= a.x && b.x + b.width <= a.x + a.width && b.y >= a.y && b.y + b.height <= a.y + a.height;
}
exports.containsRect = containsRect;
function intersectRects(rects) {
    var e_1, _a;
    if (!rects)
        return null;
    var _b = __read(rects), first = _b[0], rest = _b.slice(1);
    var result = first;
    try {
        for (var rest_1 = __values(rest), rest_1_1 = rest_1.next(); !rest_1_1.done; rest_1_1 = rest_1.next()) {
            var rect = rest_1_1.value;
            if (!result)
                return null;
            result = intersectRect(result, rect);
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (rest_1_1 && !rest_1_1.done && (_a = rest_1.return)) _a.call(rest_1);
        }
        finally { if (e_1) throw e_1.error; }
    }
    return result;
}
exports.intersectRects = intersectRects;
function unionRects(rects) {
    var e_2, _a;
    if (!rects)
        return null;
    var _b = __read(rects), result = _b[0], rest = _b.slice(1);
    try {
        for (var rest_2 = __values(rest), rest_2_1 = rest_2.next(); !rest_2_1.done; rest_2_1 = rest_2.next()) {
            var rect = rest_2_1.value;
            result = unionRect(result, rect);
        }
    }
    catch (e_2_1) { e_2 = { error: e_2_1 }; }
    finally {
        try {
            if (rest_2_1 && !rest_2_1.done && (_a = rest_2.return)) _a.call(rest_2);
        }
        finally { if (e_2) throw e_2.error; }
    }
    return result;
}
exports.unionRects = unionRects;
function rectPoints(r) {
    return [
        { x: r.x, y: r.y },
        { x: r.x + r.width, y: r.y },
        { x: r.x + r.width, y: r.y + r.height },
        { x: r.x, y: r.y + r.height }
    ];
}
exports.rectPoints = rectPoints;
function lineBounds(line) {
    var x1 = Math.min(line.a.x, line.b.x);
    var y1 = Math.min(line.a.y, line.b.y);
    var x2 = Math.max(line.a.x, line.b.x);
    var y2 = Math.max(line.a.y, line.b.y);
    return {
        x: x1,
        y: y1,
        width: x2 - x1,
        height: y2 - y1
    };
}
exports.lineBounds = lineBounds;
function circleBounds(c) {
    return {
        x: c.center.x - c.radius,
        y: c.center.y - c.radius,
        width: c.radius * 2,
        height: c.radius * 2
    };
}
exports.circleBounds = circleBounds;
function ellipseBounds(e) {
    return {
        x: e.center.x - e.rx,
        y: e.center.y - e.ry,
        width: e.rx * 2,
        height: e.ry * 2
    };
}
exports.ellipseBounds = ellipseBounds;
function polygonBounds(polygon) {
    return unionRects(polygon.map(function (x) { return (__assign(__assign({}, x), { width: 0, height: 0 })); }));
}
exports.polygonBounds = polygonBounds;
function pointOnSegment(p, line, tolerance) {
    return segmentDistance(p, line.a, line.b) <= tolerance;
}
exports.pointOnSegment = pointOnSegment;
function pointOnLine(p, line, tolerance) {
    return lineDistance(p, line.a, line.b) <= tolerance;
}
exports.pointOnLine = pointOnLine;
function pointOnCircle(p, circle, tolerance) {
    return Math.abs(distance(p, circle.center) - circle.radius) <= tolerance;
}
exports.pointOnCircle = pointOnCircle;
function pointOnRect(p, r, tolerance) {
    return ((Math.abs(p.x - r.x) <= tolerance && p.y >= r.y && p.y <= r.y + r.height) ||
        (Math.abs(p.y - r.y) <= tolerance && p.x >= r.x && p.x <= r.x + r.width) ||
        (Math.abs(p.x - r.x + r.width) <= tolerance && p.y >= r.y && p.y <= r.y + r.height) ||
        (Math.abs(p.y - r.y + r.height) <= tolerance && p.x >= r.x && p.x <= r.x + r.width));
}
exports.pointOnRect = pointOnRect;
function pointOnEllipse(p, e, tolerance) {
    if (e.rx <= tolerance) {
        return Math.abs(p.x - e.center.x) <= tolerance && p.y >= e.center.y - e.ry && p.y <= e.center.y + e.ry;
    }
    if (e.ry <= tolerance) {
        return Math.abs(p.y - e.center.y) <= tolerance && p.x >= e.center.x - e.rx && p.x <= e.center.x + e.rx;
    }
    var t1 = sqr(p.x - e.center.x) / sqr(e.rx - tolerance) + sqr(p.y - e.center.y) / sqr(e.ry - tolerance);
    var t2 = sqr(p.x - e.center.x) / sqr(e.rx + tolerance) + sqr(p.y - e.center.y) / sqr(e.ry + tolerance);
    return t1 >= 1 && t2 <= 1;
}
exports.pointOnEllipse = pointOnEllipse;
function pointOnPolygon(p, polygon, tolerance) {
    return polygon.some(function (x, i) {
        var next = i < polygon.length - 1 ? i + 1 : 0;
        return pointOnSegment(p, { a: x, b: polygon[next] }, tolerance);
    });
}
exports.pointOnPolygon = pointOnPolygon;

},{}],70:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.polygonHitTest = exports.lineHitTest = exports.circleHitTest = exports.rectHitTest = exports.pointHitTest = exports.createHitTestProps = exports.addHitTestProps = exports.hasHitTestProps = void 0;
var diagram_1 = require("@carnelian-diagram/core");
var custom_prop_hook_1 = require("@carnelian-diagram/core/utils/custom-prop-hook");
var geometry_1 = require("./geometry");
function hasHitTestProps(target) {
    return target.__hitTest !== undefined;
}
exports.hasHitTestProps = hasHitTestProps;
function addHitTestProps(e, hitArea, element) {
    e.__hitTest = { hitArea: hitArea, element: element };
}
exports.addHitTestProps = addHitTestProps;
function createHitTestProps(hitArea, element) {
    var renderContext = (0, diagram_1.useContext)(diagram_1.RenderContext);
    var elem = element || (renderContext === null || renderContext === void 0 ? void 0 : renderContext.currentElement);
    if (!elem) {
        throw new Error("The createHitTestProps function is not allowed to be called from here. Current element is not defined");
    }
    return {
        style: hitArea.cursor ? {
            cursor: hitArea.cursor
        } : undefined,
        __hitTest: new custom_prop_hook_1.CustomPropHook({
            element: elem,
            hitArea: hitArea
        })
    };
}
exports.createHitTestProps = createHitTestProps;
function pointHitTest(x, y, tolerance) {
    return function (point, transform) {
        var p = new DOMPoint(x, y).matrixTransform(transform.inverse());
        return Math.abs(p.x - point.x) <= tolerance && Math.abs(p.y - point.y) <= tolerance;
    };
}
exports.pointHitTest = pointHitTest;
function rectHitTest(x, y, width, height) {
    return function (point, transform) {
        var elemPoint = point.matrixTransform(transform);
        return elemPoint.x >= x && elemPoint.y >= y && elemPoint.x <= x + width && elemPoint.y <= y + height;
    };
}
exports.rectHitTest = rectHitTest;
function circleHitTest(x, y, radius) {
    return function (point, transform) {
        var elemPoint = point.matrixTransform(transform);
        return (0, geometry_1.distance)(elemPoint, { x: x, y: y }) <= radius;
    };
}
exports.circleHitTest = circleHitTest;
function lineHitTest(x1, y1, x2, y2, tolerance) {
    return function (point, transform) {
        var p1 = new DOMPoint(x1, y1).matrixTransform(transform.inverse());
        var p2 = new DOMPoint(x2, y2).matrixTransform(transform.inverse());
        var d = (0, geometry_1.segmentDistance)(point, p1, p2);
        return d <= tolerance;
    };
}
exports.lineHitTest = lineHitTest;
function polygonHitTest(polygon) {
    return function (point, transform) {
        var elemPoint = point.matrixTransform(transform);
        return (0, geometry_1.pointInPolygon)(elemPoint, polygon);
    };
}
exports.polygonHitTest = polygonHitTest;

},{"./geometry":69,"@carnelian-diagram/core":16,"@carnelian-diagram/core/utils/custom-prop-hook":18}],71:[function(require,module,exports){
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
__exportStar(require("./with-interaction"), exports);
__exportStar(require("./with-interactive-line"), exports);
__exportStar(require("./with-interactive-polyline"), exports);
__exportStar(require("./with-interactive-rect"), exports);
__exportStar(require("./with-interactive-square"), exports);
__exportStar(require("./with-interactive-circle"), exports);
__exportStar(require("./with-interactive-text"), exports);
__exportStar(require("./with-knob"), exports);

},{"./with-interaction":72,"./with-interactive-circle":73,"./with-interactive-line":74,"./with-interactive-polyline":75,"./with-interactive-rect":76,"./with-interactive-square":77,"./with-interactive-text":78,"./with-knob":79}],72:[function(require,module,exports){
"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.withInteraction = void 0;
var jsx_runtime_1 = require("@carnelian-diagram/core/jsx-runtime");
/** @jsxImportSource @carnelian-diagram/core */
var diagram_1 = require("@carnelian-diagram/core");
var __1 = require("..");
var schedule_1 = require("@carnelian-diagram/core/utils/schedule");
function getTransformAttribute(matrix) {
    return matrix
        ? "matrix(".concat(matrix.a, " ").concat(matrix.b, " ").concat(matrix.c, " ").concat(matrix.d, " ").concat(matrix.e, " ").concat(matrix.f, ")")
        : undefined;
}
function DiagramPaper(props) {
    var x = props.x, y = props.y, width = props.width, height = props.height, matrix = props.matrix;
    var p1 = new DOMPoint(x, y).matrixTransform(matrix);
    var p2 = new DOMPoint(x + width, y + height).matrixTransform(matrix);
    var scale = matrix ? matrix.a : 1;
    x = p1.x;
    y = p1.y;
    width = p2.x - p1.x;
    height = p2.y - p1.y;
    var patternSize = Math.max(props.majorGridSize || 0, props.minorGridSize || 0) * scale;
    var minorGridSize = props.minorGridSize ? props.minorGridSize * scale : props.minorGridSize;
    var majorGridSize = props.majorGridSize ? props.majorGridSize * scale : props.majorGridSize;
    function drawGridLines(gridSize, color) {
        var lines = [];
        var x = 0;
        var y = 0;
        while (x < patternSize) {
            lines.push((0, jsx_runtime_1.jsx)("line", { x1: x, y1: 0, x2: x, y2: patternSize, stroke: color }));
            x += gridSize;
        }
        while (y < patternSize) {
            lines.push((0, jsx_runtime_1.jsx)("line", { x1: 0, y1: y, x2: patternSize, y2: y, stroke: color }));
            y += gridSize;
        }
        return lines;
    }
    return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [patternSize > 0 && (0, jsx_runtime_1.jsx)("defs", { children: (0, jsx_runtime_1.jsxs)("pattern", __assign({ id: "paper-grid", x: x, y: y, width: patternSize, height: patternSize, patternUnits: "userSpaceOnUse" }, { children: [(0, jsx_runtime_1.jsx)("rect", { x: 0, y: 0, width: patternSize, height: patternSize, fill: "white", stroke: "none" }), minorGridSize && drawGridLines(minorGridSize, props.minorGridColor || "#eee"), majorGridSize && drawGridLines(majorGridSize, props.majorGridColor || "#bbb")] })) }), (0, jsx_runtime_1.jsx)("g", __assign({ className: "paper-container", transform: getTransformAttribute(matrix === null || matrix === void 0 ? void 0 : matrix.inverse()) }, { children: (0, jsx_runtime_1.jsx)("rect", { x: x, y: y, width: width, height: height, className: "paper", fill: "url(#paper-grid)" }) }))] }));
}
function DiagramElements(props) {
    return ((0, jsx_runtime_1.jsx)("g", __assign({}, props.rootProps, { children: props.children })));
}
function DiagramControls(props) {
    var _a;
    var matrix = props.matrix, controller = props.controller;
    var _b = __read((0, diagram_1.useState)(null), 2), rectSelection = _b[0], setRectSelection = _b[1];
    var rect = null;
    if (rectSelection) {
        var p1 = new DOMPoint(rectSelection.x, rectSelection.y).matrixTransform(matrix);
        var p2 = new DOMPoint(rectSelection.x + rectSelection.width, rectSelection.y + rectSelection.height).matrixTransform(matrix);
        rect = {
            x: p1.x,
            y: p1.y,
            width: p2.x - p1.x,
            height: p2.y - p1.y
        };
    }
    var handleRectSelection = function (e) { return setRectSelection(e.selectionRect); };
    (0, diagram_1.useEffect)(function () {
        controller.addEventListener(__1.RECT_SELECTION_EVENT, handleRectSelection);
        return function () {
            controller.removeEventListener(__1.RECT_SELECTION_EVENT, handleRectSelection);
        };
    }, [controller]);
    var renderControlsContext = ((_a = controller.getService(__1.isControlRenderingService)) === null || _a === void 0 ? void 0 : _a.controlsContext) || __1.ControlsContext.defaultValue;
    return ((0, jsx_runtime_1.jsx)(__1.ControlsContext.Provider, __assign({ value: renderControlsContext }, { children: (0, jsx_runtime_1.jsxs)("g", __assign({ transform: getTransformAttribute(matrix === null || matrix === void 0 ? void 0 : matrix.inverse()) }, { children: [controller.renderControls(matrix || new DOMMatrix()), rect && (0, jsx_runtime_1.jsx)("rect", __assign({ className: "selection-rect" }, rect, { fill: "none", stroke: "black", "stroke-dasharray": "4" }))] })) })));
}
function withInteraction(WrappedComponent, controller, options) {
    return function (props) {
        var _a;
        var _b = __read((0, diagram_1.useState)(undefined), 2), matrix = _b[0], setMatrix = _b[1];
        var _c = __read((0, diagram_1.useState)([]), 2), selectedElements = _c[0], setSelectedElements = _c[1];
        var _d = __read((0, diagram_1.useState)(((_a = controller.getService(__1.isPaperService)) === null || _a === void 0 ? void 0 : _a.paper) || null), 2), paper = _d[0], setPaper = _d[1];
        var handleSelect = function (e) { return setSelectedElements(e.selectedElements); };
        var handlePaperChange = function (e) { return setPaper(e.paper); };
        var calcCTM = function () { var _a, _b; return ((_b = (_a = props.svg).getCTM) === null || _b === void 0 ? void 0 : _b.call(_a)) || undefined; };
        var calcScreenCTM = function () { var _a, _b; return ((_b = (_a = props.svg).getScreenCTM) === null || _b === void 0 ? void 0 : _b.call(_a)) || undefined; };
        var ctm = calcCTM();
        (0, diagram_1.useEffect)(function () {
            controller.addEventListener(__1.SELECT_EVENT, handleSelect);
            controller.addEventListener(__1.PAPER_CHANGE_EVENT, handlePaperChange);
            return function () {
                controller.removeEventListener(__1.SELECT_EVENT, handleSelect);
                controller.removeEventListener(__1.PAPER_CHANGE_EVENT, handlePaperChange);
            };
        }, [controller]);
        (0, diagram_1.useEffect)(function () {
            var cancelSchedule;
            var curMatrix = matrix;
            var workloop = function () {
                var CMT = calcCTM();
                if ((CMT && !curMatrix) ||
                    (curMatrix && !CMT) ||
                    (CMT && curMatrix && (CMT.a !== curMatrix.a || CMT.b !== curMatrix.b || CMT.c !== curMatrix.c || CMT.d !== curMatrix.d || CMT.e !== curMatrix.e || CMT.f !== curMatrix.f))) {
                    curMatrix = CMT;
                    setMatrix(CMT);
                }
                controller.screenCTM = calcScreenCTM();
                cancelSchedule = (0, schedule_1.scheduleIdle)(workloop);
            };
            cancelSchedule = (0, schedule_1.scheduleIdle)(workloop);
            return function () {
                cancelSchedule();
            };
        }, []);
        return ((0, jsx_runtime_1.jsx)(__1.InteractionContext.Provider, __assign({ value: controller.interactionContext }, { children: (0, jsx_runtime_1.jsxs)(__1.SelectionContext.Provider, __assign({ value: selectedElements }, { children: [paper && (0, jsx_runtime_1.jsx)(DiagramPaper, __assign({}, paper, { matrix: ctm })), (0, jsx_runtime_1.jsx)(DiagramElements, __assign({ rootProps: options === null || options === void 0 ? void 0 : options.elementsRootProps }, { children: (0, jsx_runtime_1.jsx)(WrappedComponent, __assign({}, props)) })), (0, jsx_runtime_1.jsx)(DiagramControls, { matrix: ctm, controller: controller })] })) })));
    };
}
exports.withInteraction = withInteraction;

},{"..":87,"@carnelian-diagram/core":16,"@carnelian-diagram/core/jsx-runtime":17,"@carnelian-diagram/core/utils/schedule":19}],73:[function(require,module,exports){
"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.withInteractiveCircle = void 0;
var jsx_runtime_1 = require("@carnelian-diagram/core/jsx-runtime");
var with_interactive_square_1 = require("./with-interactive-square");
function withInteractiveCircle(WrappedElement, options) {
    return function (props) {
        var x = props.x, y = props.y, radius = props.radius, onChange = props.onChange;
        var squareOnChange = function (callback) {
            var circleCallback = function (props) {
                var x = props.x, y = props.y, radius = props.radius, onChange = props.onChange, rest = __rest(props, ["x", "y", "radius", "onChange"]);
                var squareProps = __assign(__assign({}, rest), { x: x - radius, y: y - radius, size: radius * 2, onChange: squareOnChange });
                squareProps = callback(squareProps);
                return __assign(__assign({}, props), { x: squareProps.x + squareProps.size / 2, y: squareProps.y + squareProps.size / 2, radius: squareProps.size / 2 });
            };
            onChange(circleCallback);
        };
        var squareProps = {
            x: x - radius,
            y: y - radius,
            size: radius * 2,
            onChange: squareOnChange
        };
        var colliderFactory = options === null || options === void 0 ? void 0 : options.collider;
        var squareColliderFactory = colliderFactory
            ? function (_) { return colliderFactory(props); } : undefined;
        (0, with_interactive_square_1.useInteractiveSquare)(squareProps, __assign(__assign({}, options), { collider: squareColliderFactory }));
        return (0, jsx_runtime_1.jsx)(WrappedElement, __assign({}, props));
    };
}
exports.withInteractiveCircle = withInteractiveCircle;

},{"./with-interactive-square":77,"@carnelian-diagram/core/jsx-runtime":17}],74:[function(require,module,exports){
"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.withInteractiveLine = exports.useInteractiveLine = void 0;
var jsx_runtime_1 = require("@carnelian-diagram/core/jsx-runtime");
var __1 = require("..");
function useInteractiveLine(props, colliderFactory) {
    var x1 = props.x1, y1 = props.y1, x2 = props.x2, y2 = props.y2, onChange = props.onChange;
    function move(payload) {
        onChange(function (props) { return (__assign(__assign({}, props), { x1: props.x1 + payload.deltaX, y1: props.y1 + payload.deltaY, x2: props.x2 + payload.deltaX, y2: props.y2 + payload.deltaY })); });
    }
    function moveVertex(payload) {
        onChange(function (props) { return (__assign(__assign({}, props), { x1: payload.hitArea.index === 0 ? payload.position.x : props.x1, y1: payload.hitArea.index === 0 ? payload.position.y : props.y1, x2: payload.hitArea.index === 1 ? payload.position.x : props.x2, y2: payload.hitArea.index === 1 ? payload.position.y : props.y2 })); });
    }
    var collider = (colliderFactory === null || colliderFactory === void 0 ? void 0 : colliderFactory(props)) || (0, __1.LineCollider)({ a: { x: x1, y: y1 }, b: { x: x2, y: y2 } });
    (0, __1.useCollider)(collider, { type: "in", cursor: "move", action: __1.ACT_MOVE }, 0, 2);
    (0, __1.useAction)(__1.ACT_MOVE, move);
    (0, __1.useAction)("vertex_move", moveVertex);
    (0, __1.useAction)(__1.ACT_DRAW_POINT_PLACE, function (payload) {
        if (payload.pointIndex === 0) {
            onChange(function (props) { return (__assign(__assign({}, props), { x1: payload.position.x, y1: payload.position.y, x2: payload.position.x, y2: payload.position.y })); });
        }
        else {
            onChange(function (props) { return (__assign(__assign({}, props), { x2: payload.position.x, y2: payload.position.y })); });
        }
        payload.result.current = payload.pointIndex > 0;
    });
    (0, __1.useAction)(__1.ACT_DRAW_POINT_MOVE, function (payload) {
        onChange(function (props) { return (__assign(__assign({}, props), { x2: payload.position.x, y2: payload.position.y })); });
    });
    (0, __1.useAction)(__1.ACT_DRAW_POINT_CANCEL, function (payload) {
        payload.result.current = false;
    });
    function createHandleControl(index, x, y) {
        return {
            x: x,
            y: y,
            hitArea: {
                type: "vertex_handle",
                index: index,
                cursor: "move",
                action: "vertex_move"
            }
        };
    }
    (0, __1.useControls)(function (transform, element) {
        var handles = [
            createHandleControl(0, x1, y1),
            createHandleControl(1, x2, y2)
        ];
        return ((0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: handles.map(function (control) { return ((0, jsx_runtime_1.jsx)(__1.HandleControl, { kind: "default", x: control.x, y: control.y, hitArea: control.hitArea, transform: transform, element: element }, control.hitArea.index)); }) }));
    });
}
exports.useInteractiveLine = useInteractiveLine;
function withInteractiveLine(WrappedElement, colliderFactory) {
    return function (props) {
        useInteractiveLine(props, colliderFactory);
        return (0, jsx_runtime_1.jsx)(WrappedElement, __assign({}, props));
    };
}
exports.withInteractiveLine = withInteractiveLine;

},{"..":87,"@carnelian-diagram/core/jsx-runtime":17}],75:[function(require,module,exports){
"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.withInteractivePolyline = exports.useInteractivePolyline = exports.PolylineCollider = void 0;
var jsx_runtime_1 = require("@carnelian-diagram/core/jsx-runtime");
var __1 = require("..");
function PolylineCollider(points) {
    if (points.length === 1) {
        return (0, __1.PointCollider)(points[0]);
    }
    var lines = points.reduce(function (acc, cur, i) {
        return i > 0 ? acc.concat({ a: points[i - 1], b: cur }) : acc;
    }, []);
    return __1.UnionCollider.apply(void 0, __spreadArray([], __read(lines.map(__1.LineCollider)), false));
}
exports.PolylineCollider = PolylineCollider;
function useInteractivePolyline(props, isClosed, minPoints, options) {
    var _a;
    var points = props.points, onChange = props.onChange;
    function move(payload) {
        onChange(function (props) { return (__assign(__assign({}, props), { points: points.map(function (p) { return ({ x: p.x + payload.deltaX, y: p.y + payload.deltaY }); }) })); });
    }
    function moveVertex(payload) {
        onChange(function (props) { return (__assign(__assign({}, props), { points: points.map(function (p, i) { return i !== payload.hitArea.index ? p : { x: payload.position.x, y: payload.position.y }; }) })); });
    }
    var collider = ((_a = options === null || options === void 0 ? void 0 : options.collider) === null || _a === void 0 ? void 0 : _a.call(options, props)) || PolylineCollider(points);
    var hitArea = { type: "in", action: __1.ACT_MOVE, cursor: "move" };
    if (options === null || options === void 0 ? void 0 : options.innerHitArea) {
        hitArea = options.innerHitArea(hitArea);
    }
    (0, __1.useCollider)(collider, hitArea);
    (0, __1.useAction)(hitArea.action, move);
    (0, __1.useAction)("vertex_move", moveVertex);
    (0, __1.useAction)(__1.ACT_DRAW_POINT_PLACE, function (payload) {
        onChange(function (props) { return (__assign(__assign({}, props), { points: props.points.concat({ x: payload.position.x, y: payload.position.y }) })); });
    });
    (0, __1.useAction)(__1.ACT_DRAW_POINT_MOVE, function (payload) {
        onChange(function (props) { return (__assign(__assign({}, props), { points: props.points.map(function (p, i) { return i !== payload.pointIndex ? p : { x: payload.position.x, y: payload.position.y }; }) })); });
    });
    (0, __1.useAction)(__1.ACT_DRAW_POINT_CANCEL, function (payload) {
        if (payload.pointIndex < minPoints) {
            payload.result.current = false;
        }
        else {
            onChange(function (props) { return (__assign(__assign({}, props), { points: props.points.slice(0, props.points.length - 1) })); });
        }
    });
    (0, __1.useAction)("vertex_remove", function (payload) {
        if (typeof payload.hitArea.index === "number" && points.length > minPoints) {
            onChange(function (props) { return (__assign(__assign({}, props), { points: props.points.filter(function (x, i) { return i !== payload.hitArea.index; }) })); });
        }
    });
    (0, __1.useAction)("vertex_insert", function (payload) {
        if (typeof payload.hitArea.index === "number") {
            var index = payload.hitArea.index;
            var newPoints_1 = __spreadArray([], __read(props.points), false);
            newPoints_1.splice(index + 1, 0, { x: payload.position.x, y: payload.position.y });
            onChange(function (props) { return (__assign(__assign({}, props), { points: newPoints_1 })); });
        }
    });
    function createHandleControl(index, x, y) {
        return {
            x: x,
            y: y,
            hitArea: {
                type: "vertex_handle",
                index: index,
                cursor: "move",
                action: "vertex_move",
                dblClickAction: "vertex_remove"
            }
        };
    }
    function createEdgeControl(index, x1, y1, x2, y2) {
        return {
            x1: x1,
            y1: y1,
            x2: x2,
            y2: y2,
            hitArea: {
                type: "edge",
                index: index,
                cursor: "move",
                action: __1.ACT_MOVE,
                dblClickAction: "vertex_insert"
            },
        };
    }
    (0, __1.useControls)(function (transform, element) {
        var handles = points.map(function (p, i) { return createHandleControl(i, p.x, p.y); });
        var lines = points.reduce(function (acc, cur, i) {
            return i < points.length - 1
                ? acc.concat({ a: cur, b: points[i + 1] })
                : isClosed
                    ? acc.concat({ a: cur, b: points[0] })
                    : acc;
        }, []);
        var edges = lines.map(function (l, i) { return createEdgeControl(i, l.a.x, l.a.y, l.b.x, l.b.y); });
        return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [edges.map(function (control) { return ((0, jsx_runtime_1.jsx)(__1.EdgeControl, { kind: "default", x1: control.x1, y1: control.y1, x2: control.x2, y2: control.y2, hitArea: control.hitArea, transform: transform, element: element }, control.hitArea.index)); }), handles.map(function (control) { return ((0, jsx_runtime_1.jsx)(__1.HandleControl, { kind: "default", x: control.x, y: control.y, hitArea: control.hitArea, transform: transform, element: element }, control.hitArea.index)); })] }));
    });
}
exports.useInteractivePolyline = useInteractivePolyline;
function withInteractivePolyline(WrappedElement, isClosed, minPoints, options) {
    return function (props) {
        useInteractivePolyline(props, isClosed, minPoints, options);
        return (0, jsx_runtime_1.jsx)(WrappedElement, __assign({}, props));
    };
}
exports.withInteractivePolyline = withInteractivePolyline;

},{"..":87,"@carnelian-diagram/core/jsx-runtime":17}],76:[function(require,module,exports){
"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.withInteractiveRect = exports.useInteractiveRectControls = exports.useInteractiveRect = void 0;
var jsx_runtime_1 = require("@carnelian-diagram/core/jsx-runtime");
var __1 = require("..");
var collisions_1 = require("../collisions");
function useInteractiveRect(props, options) {
    var _a;
    var x = props.x, y = props.y, width = props.width, height = props.height, onChange = props.onChange;
    function move(payload) {
        onChange(function (props) { return (__assign(__assign({}, props), { x: props.x + payload.deltaX, y: props.y + payload.deltaY })); });
    }
    function resizeTopLeft(payload) {
        onChange(function (props) { return (__assign(__assign({}, props), { x: Math.min(payload.position.x, props.x + props.width), y: Math.min(payload.position.y, props.y + props.height), width: Math.max(0, props.x + props.width - payload.position.x), height: Math.max(0, props.y + props.height - payload.position.y) })); });
    }
    function resizeTopRight(payload) {
        onChange(function (props) { return (__assign(__assign({}, props), { y: Math.min(payload.position.y, props.y + props.height), width: Math.max(0, payload.position.x - props.x), height: Math.max(0, props.y + props.height - payload.position.y) })); });
    }
    function resizeBottomLeft(payload) {
        onChange(function (props) { return (__assign(__assign({}, props), { x: Math.min(payload.position.x, props.x + props.width), width: Math.max(0, props.x + props.width - payload.position.x), height: Math.max(0, payload.position.y - props.y) })); });
    }
    function resizeBottomRight(payload) {
        onChange(function (props) { return (__assign(__assign({}, props), { width: Math.max(0, payload.position.x - props.x), height: Math.max(0, payload.position.y - props.y) })); });
    }
    function resizeLeft(payload) {
        onChange(function (props) { return (__assign(__assign({}, props), { x: Math.min(payload.position.x, props.x + props.width), width: Math.max(0, props.x + props.width - payload.position.x) })); });
    }
    function resizeTop(payload) {
        onChange(function (props) { return (__assign(__assign({}, props), { y: Math.min(payload.position.y, props.y + props.height), height: Math.max(0, props.y + props.height - payload.position.y) })); });
    }
    function resizeRight(payload) {
        onChange(function (props) { return (__assign(__assign({}, props), { width: Math.max(0, payload.position.x - props.x) })); });
    }
    function resizeBottom(payload) {
        onChange(function (props) { return (__assign(__assign({}, props), { height: Math.max(0, payload.position.y - props.y) })); });
    }
    function defaultCollider() {
        var result = (0, collisions_1.RectCollider)(props);
        result.bounds = null; // No need to perform broad phase testing for rect colliders
        return result;
    }
    var collider = ((_a = options === null || options === void 0 ? void 0 : options.collider) === null || _a === void 0 ? void 0 : _a.call(options, props)) || defaultCollider();
    var hitArea = { type: "in", action: __1.ACT_MOVE, cursor: "move" };
    if (options === null || options === void 0 ? void 0 : options.innerHitArea) {
        hitArea = options.innerHitArea(hitArea);
    }
    (0, __1.useCollider)(collider, hitArea);
    (0, __1.useAction)(hitArea.action, move);
    (0, __1.useAction)(__1.ACT_DRAW_POINT_PLACE, function (payload) {
        if (payload.pointIndex === 0) {
            onChange(function (props) { return (__assign(__assign({}, props), { x: payload.position.x, y: payload.position.y, width: 0, height: 0 })); });
        }
        else {
            onChange(function (props) { return (__assign(__assign({}, props), { width: Math.max(0, payload.position.x - props.x), height: Math.max(0, payload.position.y - props.y) })); });
        }
        payload.result.current = payload.pointIndex > 0;
    });
    (0, __1.useAction)(__1.ACT_DRAW_POINT_MOVE, function (payload) {
        onChange(function (props) { return (__assign(__assign({}, props), { width: Math.max(0, payload.position.x - props.x), height: Math.max(0, payload.position.y - props.y) })); });
    });
    (0, __1.useAction)(__1.ACT_DRAW_POINT_CANCEL, function (payload) {
        payload.result.current = false;
    });
    useInteractiveRectControls(x, y, width, height, resizeTopLeft, resizeTopRight, resizeBottomLeft, resizeBottomRight, resizeLeft, resizeTop, resizeRight, resizeBottom);
}
exports.useInteractiveRect = useInteractiveRect;
function useInteractiveRectControls(x, y, width, height, resizeTopLeft, resizeTopRight, resizeBottomLeft, resizeBottomRight, resizeLeft, resizeTop, resizeRight, resizeBottom) {
    function createHandleControl(index, x, y, cursor, dragHandler) {
        return {
            x: x,
            y: y,
            hitArea: {
                type: "resize_handle",
                index: index,
                cursor: cursor,
                action: "resize_handle_move"
            },
            dragHandler: dragHandler
        };
    }
    function createEdgeControl(index, x1, y1, x2, y2, cursor, dragHandler) {
        return {
            x1: x1,
            y1: y1,
            x2: x2,
            y2: y2,
            hitArea: {
                type: "resize_edge",
                index: index,
                cursor: cursor,
                action: "resize_edge_move"
            },
            dragHandler: dragHandler
        };
    }
    (0, __1.useControls)(function (transform, element) {
        var handles = [
            createHandleControl(0, x, y, "nwse-resize", resizeTopLeft),
            createHandleControl(1, x + width, y, "nesw-resize", resizeTopRight),
            createHandleControl(2, x, y + height, "nesw-resize", resizeBottomLeft),
            createHandleControl(3, x + width, y + height, "nwse-resize", resizeBottomRight),
        ];
        var edges = [
            createEdgeControl(0, x, y, x, y + height, "ew-resize", resizeLeft),
            createEdgeControl(1, x, y, x + width, y, "ns-resize", resizeTop),
            createEdgeControl(2, x + width, y, x + width, y + height, "ew-resize", resizeRight),
            createEdgeControl(3, x, y + height, x + width, y + height, "ns-resize", resizeBottom)
        ];
        return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [edges.map(function (control) { return ((0, jsx_runtime_1.jsx)(__1.EdgeControl, { kind: "default", x1: control.x1, y1: control.y1, x2: control.x2, y2: control.y2, hitArea: control.hitArea, transform: transform, element: element, onDrag: control.dragHandler }, control.hitArea.index)); }), handles.map(function (control) { return ((0, jsx_runtime_1.jsx)(__1.HandleControl, { kind: "default", x: control.x, y: control.y, hitArea: control.hitArea, transform: transform, element: element, onDrag: control.dragHandler }, control.hitArea.index)); })] }));
    });
}
exports.useInteractiveRectControls = useInteractiveRectControls;
function withInteractiveRect(WrappedElement, options) {
    return function (props) {
        useInteractiveRect(props, options);
        return (0, jsx_runtime_1.jsx)(WrappedElement, __assign({}, props));
    };
}
exports.withInteractiveRect = withInteractiveRect;

},{"..":87,"../collisions":61,"@carnelian-diagram/core/jsx-runtime":17}],77:[function(require,module,exports){
"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.withInteractiveSquare = exports.useInteractiveSquare = void 0;
var jsx_runtime_1 = require("@carnelian-diagram/core/jsx-runtime");
var __1 = require("..");
var collisions_1 = require("../collisions");
var with_interactive_rect_1 = require("./with-interactive-rect");
function useInteractiveSquare(props, options) {
    var _a;
    var x = props.x, y = props.y, size = props.size, onChange = props.onChange;
    function move(payload) {
        onChange(function (props) { return (__assign(__assign({}, props), { x: props.x + payload.deltaX, y: props.y + payload.deltaY })); });
    }
    function resizeTopLeft(payload) {
        onChange(function (props) {
            var d = Math.max(props.x - payload.position.x, props.y - payload.position.y);
            return __assign(__assign({}, props), { x: Math.min(props.x - d, props.x + props.size), y: Math.min(props.y - d, props.y + props.size), size: Math.max(0, props.size + d) });
        });
    }
    function resizeTopRight(payload) {
        onChange(function (props) {
            var d = Math.max(payload.position.x - props.x - props.size, props.y - payload.position.y);
            return __assign(__assign({}, props), { y: Math.min(props.y - d, props.y + props.size), size: Math.max(0, props.size + d) });
        });
    }
    function resizeBottomLeft(payload) {
        onChange(function (props) {
            var d = Math.max(props.x - payload.position.x, payload.position.y - props.y - props.size);
            return __assign(__assign({}, props), { x: Math.min(props.x - d, props.x + props.size), size: Math.max(0, props.size + d) });
        });
    }
    function resizeBottomRight(payload) {
        onChange(function (props) {
            var d = Math.max(payload.position.x - props.x - props.size, payload.position.y - props.y - props.size);
            return __assign(__assign({}, props), { size: Math.max(0, props.size + d) });
        });
    }
    function resizeLeft(payload) {
        onChange(function (props) { return (__assign(__assign({}, props), { x: Math.min(payload.position.x, props.x + props.size), size: Math.max(0, props.x + props.size - payload.position.x) })); });
    }
    function resizeTop(payload) {
        onChange(function (props) { return (__assign(__assign({}, props), { y: Math.min(payload.position.y, props.y + props.size), size: Math.max(0, props.y + props.size - payload.position.y) })); });
    }
    function resizeRight(payload) {
        onChange(function (props) { return (__assign(__assign({}, props), { size: Math.max(0, payload.position.x - props.x) })); });
    }
    function resizeBottom(payload) {
        onChange(function (props) { return (__assign(__assign({}, props), { size: Math.max(0, payload.position.y - props.y) })); });
    }
    function defaultCollider() {
        var result = (0, collisions_1.RectCollider)({ x: props.x, y: props.y, width: props.size, height: props.size });
        result.bounds = null; // No need to perform broad phase testing for rect colliders
        return result;
    }
    var collider = ((_a = options === null || options === void 0 ? void 0 : options.collider) === null || _a === void 0 ? void 0 : _a.call(options, props)) || defaultCollider();
    var hitArea = { type: "in", action: __1.ACT_MOVE, cursor: "move" };
    if (options === null || options === void 0 ? void 0 : options.innerHitArea) {
        hitArea = options.innerHitArea(hitArea);
    }
    (0, __1.useCollider)(collider, hitArea);
    (0, __1.useAction)(hitArea.action, move);
    (0, __1.useAction)(__1.ACT_DRAW_POINT_PLACE, function (payload) {
        if (payload.pointIndex === 0) {
            onChange(function (props) { return (__assign(__assign({}, props), { x: payload.position.x, y: payload.position.y, size: 0 })); });
        }
        else {
            var d_1 = Math.max(payload.position.x - props.x - props.size, payload.position.y - props.y - props.size);
            onChange(function (props) { return (__assign(__assign({}, props), { size: Math.max(0, props.size + d_1) })); });
        }
        payload.result.current = payload.pointIndex > 0;
    });
    (0, __1.useAction)(__1.ACT_DRAW_POINT_MOVE, function (payload) {
        var d = Math.max(payload.position.x - props.x - props.size, payload.position.y - props.y - props.size);
        onChange(function (props) { return (__assign(__assign({}, props), { size: Math.max(0, props.size + d) })); });
    });
    (0, __1.useAction)(__1.ACT_DRAW_POINT_CANCEL, function (payload) {
        payload.result.current = false;
    });
    (0, with_interactive_rect_1.useInteractiveRectControls)(x, y, size, size, resizeTopLeft, resizeTopRight, resizeBottomLeft, resizeBottomRight, resizeLeft, resizeTop, resizeRight, resizeBottom);
}
exports.useInteractiveSquare = useInteractiveSquare;
function withInteractiveSquare(WrappedElement, options) {
    return function (props) {
        useInteractiveSquare(props, options);
        return (0, jsx_runtime_1.jsx)(WrappedElement, __assign({}, props));
    };
}
exports.withInteractiveSquare = withInteractiveSquare;

},{"..":87,"../collisions":61,"./with-interactive-rect":76,"@carnelian-diagram/core/jsx-runtime":17}],78:[function(require,module,exports){
"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.withInteractiveText = void 0;
var jsx_runtime_1 = require("@carnelian-diagram/core/jsx-runtime");
/** @jsxImportSource @carnelian-diagram/core */
var diagram_1 = require("@carnelian-diagram/core");
var __1 = require("..");
function withInteractiveText(WrappedElement, textBounds, editorStyle, options) {
    return function (props) {
        var _a = __read((0, diagram_1.useState)(false), 2), isEditing = _a[0], setEditing = _a[1];
        var elementNode = this.element;
        function showEditor(controller, updateProps) {
            var textEdititngService = controller.getService(__1.isTextEditingService);
            if (textEdititngService) {
                textEdititngService.showEditor(props.text, textBounds(props), editorStyle(props), function (text) {
                    if (!text.length && (options === null || options === void 0 ? void 0 : options.deleteOnEmpty)) {
                        elementNode && controller.diagram.delete(elementNode);
                    }
                    else {
                        props.onChange(function (props) { return updateProps(props, text); });
                    }
                    setEditing(false);
                });
                setEditing(true);
            }
        }
        (0, __1.useAction)(__1.ACT_EDIT_TEXT, function (_a) {
            var controller = _a.controller;
            showEditor(controller, function (props, text) { return (__assign(__assign({}, props), { text: text })); });
        });
        var onPlaceText = options === null || options === void 0 ? void 0 : options.onPlaceText;
        onPlaceText && (0, __1.useAction)(__1.ACT_DRAW_POINT_PLACE, function (payload) {
            showEditor(payload.controller, function (props, text) {
                return onPlaceText(__assign(__assign({}, props), { text: text }));
            });
            payload.result.current = true;
        });
        return !isEditing ? (0, jsx_runtime_1.jsx)(WrappedElement, __assign({}, props)) : null;
    };
}
exports.withInteractiveText = withInteractiveText;

},{"..":87,"@carnelian-diagram/core":16,"@carnelian-diagram/core/jsx-runtime":17}],79:[function(require,module,exports){
"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.withKnobs = exports.withKnob = exports.useKnob = void 0;
var jsx_runtime_1 = require("@carnelian-diagram/core/jsx-runtime");
var __1 = require("..");
function useKnob(knobController, props) {
    var pos = knobController.getPosition(props);
    var hitArea = typeof knobController.hitArea === "function" ? knobController.hitArea(props) : knobController.hitArea;
    function dragHandler(payload) {
        props.onChange(function (props) { return knobController.setPosition(props, payload, payload.hitArea); });
    }
    (0, __1.useControls)(function (transform, element) {
        return ((0, jsx_runtime_1.jsx)(__1.HandleControl, { kind: "knob", x: pos.x, y: pos.y, hitArea: hitArea, transform: transform, element: element, onDrag: dragHandler }));
    });
}
exports.useKnob = useKnob;
function withKnob(WrappedElement, knobController) {
    return function (props) {
        useKnob(knobController, props);
        return (0, jsx_runtime_1.jsx)(WrappedElement, __assign({}, props));
    };
}
exports.withKnob = withKnob;
function withKnobs(WrappedElement) {
    var knobControllers = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        knobControllers[_i - 1] = arguments[_i];
    }
    return function (props) {
        knobControllers.forEach(function (knobController) { return useKnob(knobController, props); });
        return (0, jsx_runtime_1.jsx)(WrappedElement, __assign({}, props));
    };
}
exports.withKnobs = withKnobs;

},{"..":87,"@carnelian-diagram/core/jsx-runtime":17}],80:[function(require,module,exports){
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
__exportStar(require("./use-action"), exports);
__exportStar(require("./use-controls"), exports);
__exportStar(require("./use-hit-test"), exports);
__exportStar(require("./use-intersection-test"), exports);
__exportStar(require("./use-selection"), exports);
__exportStar(require("./use-collider"), exports);

},{"./use-action":81,"./use-collider":82,"./use-controls":83,"./use-hit-test":84,"./use-intersection-test":85,"./use-selection":86}],81:[function(require,module,exports){
"use strict";
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useAction = void 0;
var diagram_1 = require("@carnelian-diagram/core");
var __1 = require("..");
function useAction(actionType, callback, element) {
    var renderContext = (0, diagram_1.useContext)(diagram_1.RenderContext);
    var curElement = element || (renderContext === null || renderContext === void 0 ? void 0 : renderContext.currentElement());
    if (!curElement) {
        throw new Error("The useAction hook is not allowed to be called from here. Current element is not defined");
    }
    var interactions = (0, diagram_1.useContext)(__1.InteractionContext);
    if (!interactions) {
        return;
    }
    var _a = __read((0, diagram_1.useState)({}), 1), key = _a[0];
    var action = callback && actionType ? {
        element: curElement,
        callback: callback,
        action: actionType
    } : undefined;
    interactions.updateActions(key, action);
    (0, diagram_1.useEffect)(function () {
        return function () {
            interactions.updateActions(key, undefined);
        };
    }, []);
}
exports.useAction = useAction;

},{"..":87,"@carnelian-diagram/core":16}],82:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useCollider = void 0;
var colliders_1 = require("../collisions/colliders");
var _1 = require(".");
var geometry_1 = require("../geometry");
function useCollider(collider, hitArea, priority, hitTestTolerance, element) {
    if (priority === void 0) { priority = 0; }
    if (hitTestTolerance === void 0) { hitTestTolerance = 0; }
    var hitTestCallback = function (point, transform) {
        var elemPoint = point.matrixTransform(transform);
        var tolerance = hitTestTolerance * transform.a;
        var bounds = collider.bounds ? (0, geometry_1.inflateRect)(collider.bounds, tolerance) : null;
        return (!bounds || (0, geometry_1.pointInRect)(elemPoint, bounds)) && !!(0, colliders_1.collide)((0, colliders_1.PointCollider)(elemPoint), collider, tolerance);
    };
    var intersectionTestCallback = function (selectionRect) {
        return !!(0, colliders_1.collide)((0, colliders_1.RectCollider)(selectionRect), collider, 0);
    };
    (0, _1.useHitTest)(hitTestCallback, hitArea, priority, element);
    (0, _1.useIntersectionTest)(intersectionTestCallback, collider.bounds);
}
exports.useCollider = useCollider;

},{".":80,"../collisions/colliders":59,"../geometry":69}],83:[function(require,module,exports){
"use strict";
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useControls = void 0;
var diagram_1 = require("@carnelian-diagram/core");
var __1 = require("..");
function useControls(callback) {
    var renderContext = (0, diagram_1.useContext)(diagram_1.RenderContext);
    var curElement = renderContext === null || renderContext === void 0 ? void 0 : renderContext.currentElement();
    if (!curElement) {
        throw new Error("The useControls hook is not allowed to be called from here. It must be called when element is rendering");
    }
    var interactions = (0, diagram_1.useContext)(__1.InteractionContext);
    if (!interactions) {
        return;
    }
    var _a = __read((0, diagram_1.useState)({}), 1), key = _a[0];
    var controls = {
        element: curElement,
        callback: callback
    };
    interactions.updateControls(curElement, key, controls);
    (0, diagram_1.useEffect)(function () {
        return function () {
            interactions.updateControls(curElement, key, undefined);
        };
    }, []);
}
exports.useControls = useControls;

},{"..":87,"@carnelian-diagram/core":16}],84:[function(require,module,exports){
"use strict";
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useHitTest = void 0;
var diagram_1 = require("@carnelian-diagram/core");
var __1 = require("..");
function useHitTest(callback, hitArea, priority, element) {
    if (priority === void 0) { priority = 0; }
    var renderContext = (0, diagram_1.useContext)(diagram_1.RenderContext);
    var curElement = element || (renderContext === null || renderContext === void 0 ? void 0 : renderContext.currentElement());
    if (!curElement) {
        throw new Error("The useHitTest hook is not allowed to be called from here. Current element is not defined");
    }
    var interactions = (0, diagram_1.useContext)(__1.InteractionContext);
    if (!interactions) {
        return;
    }
    var _a = __read((0, diagram_1.useState)({}), 1), key = _a[0];
    var hitTest = {
        element: curElement,
        callback: callback,
        hitArea: hitArea,
        priority: priority
    };
    interactions.updateHitTests(curElement, priority, key, hitTest);
    (0, diagram_1.useEffect)(function () {
        return function () {
            interactions.updateHitTests(curElement, priority, key, undefined);
        };
    }, []);
}
exports.useHitTest = useHitTest;

},{"..":87,"@carnelian-diagram/core":16}],85:[function(require,module,exports){
"use strict";
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useIntersectionTest = void 0;
var diagram_1 = require("@carnelian-diagram/core");
var __1 = require("..");
function useIntersectionTest(callback, bounds) {
    var renderContext = (0, diagram_1.useContext)(diagram_1.RenderContext);
    var curElement = renderContext === null || renderContext === void 0 ? void 0 : renderContext.currentElement();
    if (!curElement) {
        throw new Error("The useIntersectionTest hook is not allowed to be called from here. Current element is not defined");
    }
    var interactions = (0, diagram_1.useContext)(__1.InteractionContext);
    if (!interactions) {
        return;
    }
    var _a = __read((0, diagram_1.useState)({}), 1), key = _a[0];
    var intersectionTest = {
        element: curElement,
        callback: callback,
        bounds: bounds
    };
    interactions.updateIntersectionTests(key, intersectionTest);
    (0, diagram_1.useEffect)(function () {
        return function () {
            interactions.updateIntersectionTests(key, undefined);
        };
    }, []);
}
exports.useIntersectionTest = useIntersectionTest;

},{"..":87,"@carnelian-diagram/core":16}],86:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useSelection = void 0;
var diagram_1 = require("@carnelian-diagram/core");
var __1 = require("..");
function useSelection(element) {
    var renderContext = (0, diagram_1.useContext)(diagram_1.RenderContext);
    var curElement = element || (renderContext === null || renderContext === void 0 ? void 0 : renderContext.currentElement());
    if (!curElement) {
        throw new Error("The useSelection hook is not allowed to be called from here. Current element is not defined");
    }
    var selectedElements = (0, diagram_1.useContext)(__1.SelectionContext);
    return {
        isSelected: selectedElements.indexOf(curElement) >= 0
    };
}
exports.useSelection = useSelection;

},{"..":87,"@carnelian-diagram/core":16}],87:[function(require,module,exports){
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
__exportStar(require("./actions"), exports);
__exportStar(require("./hit-tests"), exports);
__exportStar(require("./intersection-tests"), exports);
__exportStar(require("./interaction-controller"), exports);
__exportStar(require("./context"), exports);
__exportStar(require("./controls"), exports);
__exportStar(require("./collisions"), exports);
__exportStar(require("./hooks"), exports);
__exportStar(require("./hocs"), exports);
__exportStar(require("./services"), exports);

},{"./actions":58,"./collisions":61,"./context":63,"./controls":68,"./hit-tests":70,"./hocs":71,"./hooks":80,"./interaction-controller":88,"./intersection-tests":89,"./services":95}],88:[function(require,module,exports){
"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InteractionController = exports.SELECT_EVENT = void 0;
var jsx_runtime_1 = require("@carnelian-diagram/core/jsx-runtime");
var hit_tests_1 = require("./hit-tests");
var geometry_1 = require("./geometry");
var services_1 = require("./services");
var type_pubsub_1 = require("type-pubsub");
exports.SELECT_EVENT = "select";
var InteractionController = /** @class */ (function () {
    function InteractionController(diagram, configureServices) {
        this.diagram = diagram;
        this.controls = new Map();
        this.hitTests = {};
        this.intersectionTests = new Map;
        this.actions = new Map();
        this.pendingActions = new Map();
        this.selectedElements = new Set();
        this.serviceCapture = null;
        this.channel = new type_pubsub_1.Channel;
        this.interactionContext = this.createInteractionContext();
        this.services = [
            new services_1.DefaultPaperService(this),
            new services_1.DefaultGridSnappingService(),
            new services_1.DefaultSelectionService(this),
            new services_1.DefaultElementInteractionService(this),
            new services_1.DefaultDeletionService(this),
            new services_1.DefaultElementDrawingService(this),
            new services_1.DefaultTextEditingService(this),
            new services_1.DefaultControlRenderingService(),
        ];
        configureServices === null || configureServices === void 0 ? void 0 : configureServices(new services_1.InteractiveServiceCollection(this.services));
    }
    InteractionController.prototype.attach = function (root) {
        var _this = this;
        this.detach();
        this.services.forEach(function (s) { var _a; return (_a = s.activate) === null || _a === void 0 ? void 0 : _a.call(s, _this.diagram, root); });
        var tabIndex = root.getAttribute("tabindex");
        if (!tabIndex || +tabIndex < 0) {
            root.setAttribute("tabindex", "0");
        }
        this.detach = function () {
            _this.detach = function () { };
            _this.services.forEach(function (s) { var _a; return (_a = s.deactivate) === null || _a === void 0 ? void 0 : _a.call(s); });
            if (!tabIndex) {
                root.removeAttribute("tabindex");
            }
            else if (+tabIndex < 0) {
                root.setAttribute("tabindex", tabIndex);
            }
        };
    };
    InteractionController.prototype.detach = function () { };
    ;
    InteractionController.prototype.getService = function (predicate) {
        return this.services.find(predicate);
    };
    InteractionController.prototype.setInputCapture = function (service) {
        if (this.serviceCapture !== service) {
            this.services.forEach(function (s) {
                var _a;
                if (s !== service) {
                    (_a = s.deactivate) === null || _a === void 0 ? void 0 : _a.call(s);
                }
            });
            this.serviceCapture = service;
        }
    };
    InteractionController.prototype.releaseInputCapture = function (root, service) {
        var _this = this;
        var _a;
        if (this.serviceCapture === service) {
            this.serviceCapture = null;
            (_a = service.deactivate) === null || _a === void 0 ? void 0 : _a.call(service); // Release to initialize all services at the same order
            this.services.forEach(function (s) {
                var _a;
                (_a = s.activate) === null || _a === void 0 ? void 0 : _a.call(s, _this.diagram, root);
            });
        }
    };
    InteractionController.prototype.createInteractionContext = function () {
        var _this = this;
        var updateControls = function (element, key, controls) {
            var map = _this.controls.get(element);
            if (!map) {
                map = new Map();
                _this.controls.set(element, map);
            }
            if (controls) {
                map.set(key, controls);
            }
            else {
                map.delete(key);
                if (map.size === 0) {
                    _this.controls.delete(element);
                }
            }
        };
        var updateHitTests = function (element, priority, key, hitTest) {
            var map = _this.hitTests[priority];
            if (!map) {
                map = _this.hitTests[priority] = new Map();
            }
            var hitTestMap = map.get(element);
            if (!hitTestMap) {
                hitTestMap = new Map();
                map.set(element, hitTestMap);
            }
            if (hitTest) {
                hitTestMap.set(key, hitTest);
            }
            else {
                hitTestMap.delete(key);
                if (hitTestMap.size === 0) {
                    map.delete(element);
                }
            }
        };
        var updateIntersectionTests = function (key, intersectionTest) {
            if (intersectionTest) {
                _this.intersectionTests.set(key, intersectionTest);
            }
            else {
                _this.intersectionTests.delete(key);
            }
        };
        var updateActions = function (key, action) {
            if (action) {
                _this.actions.set(key, action);
                var pendingActions = _this.pendingActions.get(action.element);
                if (pendingActions) {
                    pendingActions = pendingActions.filter(function (x) {
                        if (x.action === action.action) {
                            try {
                                action.callback(x.payload);
                                x.resolve();
                            }
                            catch (e) {
                                x.reject(e);
                            }
                            return false;
                        }
                        return true;
                    });
                    _this.pendingActions.set(action.element, pendingActions);
                    if (!pendingActions.length) {
                        _this.pendingActions.delete(action.element);
                    }
                }
            }
            else {
                _this.actions.delete(key);
            }
        };
        return {
            updateControls: updateControls,
            updateHitTests: updateHitTests,
            updateIntersectionTests: updateIntersectionTests,
            updateActions: updateActions
        };
    };
    InteractionController.prototype.clientToDiagram = function (point) {
        var _a;
        return point.matrixTransform((_a = this.screenCTM) === null || _a === void 0 ? void 0 : _a.inverse());
    };
    InteractionController.prototype.diagramToClient = function (point) {
        return point.matrixTransform(this.screenCTM);
    };
    InteractionController.prototype.isSelected = function (element) {
        return this.selectedElements.has(element);
    };
    InteractionController.prototype.getSelectedElements = function () {
        return __spreadArray([], __read(this.selectedElements), false);
    };
    InteractionController.prototype.select = function (elements) {
        if (!Array.isArray(elements)) {
            elements = [elements];
        }
        this.selectedElements = new Set(elements);
        this.dispatchEvent(exports.SELECT_EVENT, { selectedElements: elements });
    };
    InteractionController.prototype.renderControls = function (transform) {
        var _this = this;
        return __spreadArray([], __read(this.controls), false).filter(function (x) { return _this.isSelected(x[0]); })
            .map(function (x) {
            var key = x[0].key;
            var controls = __spreadArray([], __read(x[1].values()), false);
            return (0, jsx_runtime_1.createElement)(jsx_runtime_1.Fragment, { children: controls.map(function (x) { return x.callback(transform, x.element); }) }, key);
        });
    };
    InteractionController.prototype.hitTest = function (e) {
        var e_1, _a, e_2, _b;
        var _c, _d;
        if (this.screenCTM) {
            var transform_1 = this.screenCTM.inverse();
            var point_1 = new DOMPoint(e.clientX, e.clientY);
            var elementPoint = this.clientToDiagram(point_1);
            if ((0, hit_tests_1.hasHitTestProps)(e)) {
                return __assign(__assign({}, e.__hitTest), { screenX: point_1.x, screenY: point_1.y, elementX: elementPoint.x, elementY: elementPoint.y });
            }
            if (e.target && (0, hit_tests_1.hasHitTestProps)(e.target)) {
                (0, hit_tests_1.addHitTestProps)(e, e.target.__hitTest.hitArea, e.target.__hitTest.element);
                return __assign(__assign({}, e.target.__hitTest), { screenX: point_1.x, screenY: point_1.y, elementX: elementPoint.x, elementY: elementPoint.y });
            }
            else {
                var priorities = Object.keys(this.hitTests).map(function (x) { return parseInt(x); }).reverse();
                var sortedElements = this.diagram.getElements().slice().reverse();
                try {
                    for (var priorities_1 = __values(priorities), priorities_1_1 = priorities_1.next(); !priorities_1_1.done; priorities_1_1 = priorities_1.next()) {
                        var priority = priorities_1_1.value;
                        var hit = void 0;
                        try {
                            for (var sortedElements_1 = (e_2 = void 0, __values(sortedElements)), sortedElements_1_1 = sortedElements_1.next(); !sortedElements_1_1.done; sortedElements_1_1 = sortedElements_1.next()) {
                                var element = sortedElements_1_1.value;
                                var list = __spreadArray([], __read((((_d = (_c = this.hitTests[priority]) === null || _c === void 0 ? void 0 : _c.get(element)) === null || _d === void 0 ? void 0 : _d.values()) || [])), false);
                                hit = list.find(function (x) { return x.callback(point_1, transform_1); });
                                if (hit)
                                    break;
                            }
                        }
                        catch (e_2_1) { e_2 = { error: e_2_1 }; }
                        finally {
                            try {
                                if (sortedElements_1_1 && !sortedElements_1_1.done && (_b = sortedElements_1.return)) _b.call(sortedElements_1);
                            }
                            finally { if (e_2) throw e_2.error; }
                        }
                        if (hit) {
                            (0, hit_tests_1.addHitTestProps)(e, hit.hitArea, hit.element);
                            return {
                                element: hit.element,
                                screenX: point_1.x,
                                screenY: point_1.y,
                                elementX: elementPoint.x,
                                elementY: elementPoint.y,
                                hitArea: hit.hitArea
                            };
                        }
                    }
                }
                catch (e_1_1) { e_1 = { error: e_1_1 }; }
                finally {
                    try {
                        if (priorities_1_1 && !priorities_1_1.done && (_a = priorities_1.return)) _a.call(priorities_1);
                    }
                    finally { if (e_1) throw e_1.error; }
                }
            }
        }
    };
    InteractionController.prototype.rectIntersectionTest = function (rect) {
        // Broad phase
        var tests = __spreadArray([], __read(this.intersectionTests.values()), false).filter(function (test) { return !test.bounds || (0, geometry_1.intersectRect)(test.bounds, rect); });
        // Narrow phase
        return tests
            .filter(function (test) { return test.callback(rect); })
            .map(function (test) { return test.element; });
    };
    InteractionController.prototype.dispatchAction = function (elements, action, payload) {
        var _this = this;
        var actions = __spreadArray([], __read(this.actions.values()), false);
        var results = [];
        elements.forEach(function (element) {
            if (!element.parent) { // Newly added element, never rendered
                var promise = new Promise(function (resolve, reject) {
                    var pendingActions = _this.pendingActions.get(element);
                    if (!pendingActions) {
                        pendingActions = [];
                        _this.pendingActions.set(element, pendingActions);
                    }
                    pendingActions.push({ action: action, payload: payload, resolve: resolve, reject: reject });
                });
                results.push(promise);
            }
            else {
                var callbacks = actions
                    .filter(function (x) { return x.element === element && x.action === action; })
                    .map(function (x) { return x.callback; });
                if (callbacks) {
                    callbacks.forEach(function (cb) { return cb(payload); });
                }
            }
        });
        return Promise.all(results).then(function () { });
    };
    InteractionController.prototype.dispatchEvent = function (eventType, eventArgs) {
        this.channel.publish(eventType, eventArgs);
    };
    InteractionController.prototype.addEventListener = function (eventType, listener) {
        this.channel.subscribe(eventType, listener);
    };
    InteractionController.prototype.removeEventListener = function (eventType, listener) {
        this.channel.unsubscribe(eventType, listener);
    };
    return InteractionController;
}());
exports.InteractionController = InteractionController;

},{"./geometry":69,"./hit-tests":70,"./services":95,"@carnelian-diagram/core/jsx-runtime":17,"type-pubsub":107}],89:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.polygonIntersectionTest = exports.circleIntersectionTest = exports.rectIntersectionTest = exports.lineIntersectionTest = void 0;
var collisions_1 = require("./collisions");
function lineIntersectionTest(x1, y1, x2, y2) {
    return function (selectionRect) { return !!collisions_1.CollisionFunctions.lineRect({ a: { x: x1, y: y1 }, b: { x: x2, y: y2 } }, selectionRect); };
}
exports.lineIntersectionTest = lineIntersectionTest;
function rectIntersectionTest(x, y, width, height) {
    return function (selectionRect) { return !!collisions_1.CollisionFunctions.rectRect(selectionRect, { x: x, y: y, width: width, height: height }); };
}
exports.rectIntersectionTest = rectIntersectionTest;
function circleIntersectionTest(x, y, radius) {
    return function (selectionRect) { return !!collisions_1.CollisionFunctions.circleRect({ center: { x: x, y: y }, radius: radius }, selectionRect); };
}
exports.circleIntersectionTest = circleIntersectionTest;
function polygonIntersectionTest(points) {
    return function (selectionRect) { return !!collisions_1.CollisionFunctions.rectPolygon(selectionRect, points); };
}
exports.polygonIntersectionTest = polygonIntersectionTest;

},{"./collisions":61}],90:[function(require,module,exports){
"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DefaultControlRenderingService = exports.isControlRenderingService = void 0;
var jsx_runtime_1 = require("@carnelian-diagram/core/jsx-runtime");
function isControlRenderingService(service) {
    return service.type === "control_rendering_service";
}
exports.isControlRenderingService = isControlRenderingService;
var DefaultControlRenderingService = /** @class */ (function () {
    function DefaultControlRenderingService() {
        this.type = "control_rendering_service";
        this.controlsContext = {
            renderHandle: this.renderHandle,
            renderEdge: this.renderEdge
        };
    }
    DefaultControlRenderingService.prototype.renderHandle = function (kind, x, y, otherProps) {
        var size = 8;
        switch (kind) {
            case "knob":
                size = 9;
                var points = [
                    { x: x - size / 2, y: y },
                    { x: x, y: y - size / 2 },
                    { x: x + size / 2, y: y },
                    { x: x, y: y + size / 2 }
                ];
                return (0, jsx_runtime_1.jsx)("polygon", __assign({ points: points.map(function (p) { return "".concat(p.x, ",").concat(p.y); }).join(" "), fill: "orange" }, otherProps));
            default:
                return (0, jsx_runtime_1.jsx)("rect", __assign({ x: x - size / 2, y: y - size / 2, width: size, height: size, fill: "yellow" }, otherProps));
        }
    };
    DefaultControlRenderingService.prototype.renderEdge = function (kind, x1, y1, x2, y2, otherProps) {
        return ((0, jsx_runtime_1.jsx)("line", __assign({ x1: x1, y1: y1, x2: x2, y2: y2, "stroke-dasharray": 4 }, otherProps)));
    };
    return DefaultControlRenderingService;
}());
exports.DefaultControlRenderingService = DefaultControlRenderingService;

},{"@carnelian-diagram/core/jsx-runtime":17}],91:[function(require,module,exports){
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DefaultDeletionService = exports.DELETE_EVENT = exports.isDeletionService = void 0;
var _1 = require(".");
function isDeletionService(service) {
    return service.type === "deletion_service";
}
exports.isDeletionService = isDeletionService;
exports.DELETE_EVENT = "delete";
var DefaultDeletionService = /** @class */ (function () {
    function DefaultDeletionService(controller) {
        this.controller = controller;
        this.diagram = null;
        this.type = "deletion_service";
    }
    DefaultDeletionService.prototype.activate = function (diagram, root) {
        var _this = this;
        this.diagram = diagram;
        var keyDownHandler = function (e) { return _this.keyDownHandler(root, e); };
        root.addEventListener("keydown", keyDownHandler);
        this.deactivate = function () {
            _this.deactivate = undefined;
            _this.diagram = null;
            root.removeEventListener("keydown", keyDownHandler);
        };
    };
    DefaultDeletionService.prototype.delete = function (elements) {
        return __awaiter(this, void 0, void 0, function () {
            var promises_1, confirmations, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!this.diagram) return [3 /*break*/, 4];
                        promises_1 = [];
                        this.controller.dispatchEvent(exports.DELETE_EVENT, {
                            elements: elements,
                            requestConfirmation: function (promise) {
                                promises_1.push(promise);
                            }
                        });
                        confirmations = void 0;
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, Promise.all(promises_1)];
                    case 2:
                        confirmations = _b.sent();
                        if (confirmations.every(function (x) { return x; })) {
                            this.diagram.delete(elements);
                            this.controller.select([]);
                            return [2 /*return*/, true];
                        }
                        return [3 /*break*/, 4];
                    case 3:
                        _a = _b.sent();
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/, false];
                }
            });
        });
    };
    DefaultDeletionService.prototype.keyDownHandler = function (root, e) {
        return __awaiter(this, void 0, void 0, function () {
            var selectedElements, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        selectedElements = this.controller.getSelectedElements();
                        if (!((e.key === "Delete" || e.key === "Del") && selectedElements.length)) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.delete(selectedElements)];
                    case 1:
                        result = _a.sent();
                        if (result) {
                            (0, _1.setElementCursor)(root, null);
                        }
                        _a.label = 2;
                    case 2: return [2 /*return*/];
                }
            });
        });
    };
    return DefaultDeletionService;
}());
exports.DefaultDeletionService = DefaultDeletionService;

},{".":95}],92:[function(require,module,exports){
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DefaultElementDrawingService = exports.DRAW_ELEMENT_EVENT = exports.isElementDrawingService = void 0;
var _1 = require(".");
var actions_1 = require("../actions");
function isElementDrawingService(service) {
    return service.type === "element_drawing_service";
}
exports.isElementDrawingService = isElementDrawingService;
exports.DRAW_ELEMENT_EVENT = "draw_element";
var DefaultElementDrawingService = /** @class */ (function () {
    function DefaultElementDrawingService(controller, drawingModeFactory) {
        if (drawingModeFactory === void 0) { drawingModeFactory = null; }
        this.controller = controller;
        this.drawingModeFactory = drawingModeFactory;
        this.drawing = false;
        this.diagram = null;
        this.type = "element_drawing_service";
    }
    DefaultElementDrawingService.prototype.activate = function (diagram, root) {
        var _this = this;
        this.diagram = diagram;
        this.root = root;
        this.gridSnappingService = this.controller.getService(_1.isGridSnappingService);
        this.updateControllerInputCapture();
        var mouseDownHandler = function (e) { return _this.mouseDownHandler(root, e); };
        root.addEventListener("pointerdown", mouseDownHandler);
        this.deactivate = function () {
            _this.deactivate = undefined;
            _this.diagram = null;
            root.removeEventListener("pointerdown", mouseDownHandler);
        };
    };
    DefaultElementDrawingService.prototype.updateControllerInputCapture = function () {
        if (this.diagram && this.root) {
            if (this.drawingModeFactory) {
                this.controller.setInputCapture(this);
                (0, _1.setElementCursor)(this.root, "copy");
            }
            else {
                this.controller.releaseInputCapture(this.root, this);
                (0, _1.setElementCursor)(this.root, null);
            }
        }
    };
    DefaultElementDrawingService.prototype.switchDrawingMode = function (elementFactory) {
        this.drawingModeFactory = elementFactory;
        this.updateControllerInputCapture();
    };
    DefaultElementDrawingService.prototype.beginDraw = function (root, e, diagram, factory) {
        var _this = this;
        var _a;
        this.drawing = true;
        root.setPointerCapture(e.pointerId);
        var point = new DOMPoint(e.clientX, e.clientY);
        var snapGridSize = !e.altKey && this.gridSnappingService ? this.gridSnappingService.snapGridSize : null;
        var elementPoint = this.controller.clientToDiagram(point);
        var snappedElementPoint = ((_a = this.gridSnappingService) === null || _a === void 0 ? void 0 : _a.snapToGrid(elementPoint, snapGridSize)) || elementPoint;
        var element = factory(diagram, snappedElementPoint.x, snappedElementPoint.y);
        this.controller.select(element);
        var endDraw = function (element, result) {
            var _a;
            _this.drawing = false;
            root.releasePointerCapture(e.pointerId);
            if (!result) {
                (_a = _this.diagram) === null || _a === void 0 ? void 0 : _a.delete(element);
                (0, _1.setElementCursor)(root, null);
            }
            root.removeEventListener("pointermove", mouseMoveHandler);
            root.removeEventListener("pointerdown", mouseDownHandler);
            root.removeEventListener("keydown", keyDownHandler);
            _this.controller.dispatchEvent(exports.DRAW_ELEMENT_EVENT, { element: element, result: result });
        };
        var pointIndex = 0;
        var result = { current: false };
        var drawPoint = function (e) { return __awaiter(_this, void 0, void 0, function () {
            var point, snapGridSize, elementPoint, snappedElementPoint;
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        point = new DOMPoint(e.clientX, e.clientY);
                        snapGridSize = !e.altKey && this.gridSnappingService ? this.gridSnappingService.snapGridSize : null;
                        elementPoint = this.controller.clientToDiagram(point);
                        snappedElementPoint = ((_a = this.gridSnappingService) === null || _a === void 0 ? void 0 : _a.snapToGrid(elementPoint, snapGridSize)) || elementPoint;
                        return [4 /*yield*/, this.controller.dispatchAction([element], actions_1.ACT_DRAW_POINT_PLACE, {
                                controller: this.controller,
                                position: snappedElementPoint,
                                rawPosition: elementPoint,
                                snapGridSize: snapGridSize,
                                snapAngle: !e.altKey && this.gridSnappingService ? this.gridSnappingService.snapAngle : null,
                                snapToGrid: (_b = this.gridSnappingService) === null || _b === void 0 ? void 0 : _b.snapToGrid.bind(this.gridSnappingService),
                                pointIndex: pointIndex,
                                result: result
                            })];
                    case 1:
                        _c.sent();
                        pointIndex++;
                        if (result.current) {
                            endDraw(element, true);
                        }
                        return [2 /*return*/];
                }
            });
        }); };
        var mouseMoveHandler = function (e) {
            var _a, _b;
            var point = new DOMPoint(e.clientX, e.clientY);
            var snapGridSize = !e.altKey && _this.gridSnappingService ? _this.gridSnappingService.snapGridSize : null;
            var elementPoint = _this.controller.clientToDiagram(point);
            var snappedElementPoint = ((_a = _this.gridSnappingService) === null || _a === void 0 ? void 0 : _a.snapToGrid(elementPoint, snapGridSize)) || elementPoint;
            _this.controller.dispatchAction([element], actions_1.ACT_DRAW_POINT_MOVE, {
                controller: _this.controller,
                position: snappedElementPoint,
                rawPosition: elementPoint,
                snapGridSize: snapGridSize,
                snapAngle: !e.altKey && _this.gridSnappingService ? _this.gridSnappingService.snapAngle : null,
                snapToGrid: (_b = _this.gridSnappingService) === null || _b === void 0 ? void 0 : _b.snapToGrid.bind(_this.gridSnappingService),
                pointIndex: pointIndex
            });
        };
        var mouseDownHandler = function (e) {
            if (e.button === 0) {
                drawPoint(e);
            }
            else if (e.button === 2) {
                var result_1 = { current: true };
                _this.controller.dispatchAction([element], actions_1.ACT_DRAW_POINT_CANCEL, { controller: _this.controller, pointIndex: pointIndex, result: result_1 });
                endDraw(element, result_1.current);
            }
        };
        var keyDownHandler = function (e) {
            // Firefox 36 and earlier uses "Esc" instead of "Escape" for the Esc key
            // https://developer.mozilla.org/en-US/docs/Web/API/UI_Events/Keyboard_event_key_values
            if (e.key === "Escape" || e.key === "Esc") {
                var result_2 = { current: true };
                _this.controller.dispatchAction([element], actions_1.ACT_DRAW_POINT_CANCEL, { controller: _this.controller, pointIndex: pointIndex, result: result_2 });
                endDraw(element, result_2.current);
            }
        };
        root.addEventListener("pointermove", mouseMoveHandler);
        root.addEventListener("pointerdown", mouseDownHandler);
        root.addEventListener("keydown", keyDownHandler);
        drawPoint(e);
    };
    DefaultElementDrawingService.prototype.mouseDownHandler = function (root, e) {
        if (e.button === 0 && this.drawingModeFactory && this.diagram && !this.drawing) {
            this.beginDraw(root, e, this.diagram, this.drawingModeFactory);
        }
    };
    return DefaultElementDrawingService;
}());
exports.DefaultElementDrawingService = DefaultElementDrawingService;

},{".":95,"../actions":58}],93:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DefaultElementInteractionService = exports.isElementInteractionService = void 0;
var _1 = require(".");
var actions_1 = require("../actions");
function isElementInteractionService(service) {
    return service.type === "element_interaction_service";
}
exports.isElementInteractionService = isElementInteractionService;
var DefaultElementInteractionService = /** @class */ (function () {
    function DefaultElementInteractionService(controller) {
        this.controller = controller;
        this.dragging = false;
        this.type = "element_interaction_service";
    }
    DefaultElementInteractionService.prototype.activate = function (diagram, root) {
        var _this = this;
        this.gridSnappingService = this.controller.getService(_1.isGridSnappingService);
        var mouseDownHandler = function (e) { return _this.mouseDownHandler(root, e); };
        var mouseMoveHandler = function (e) { return _this.mouseMoveHandler(root, e); };
        var dblClickHandler = function (e) { return _this.dblClickHandler(root, e); };
        root.addEventListener("pointerdown", mouseDownHandler);
        root.addEventListener("pointermove", mouseMoveHandler);
        root.addEventListener("dblclick", dblClickHandler);
        this.deactivate = function () {
            _this.deactivate = undefined;
            root.removeEventListener("pointerdown", mouseDownHandler);
            root.removeEventListener("pointermove", mouseMoveHandler);
            root.removeEventListener("dblclick", dblClickHandler);
        };
    };
    DefaultElementInteractionService.prototype.beginDrag = function (root, e, hitInfo) {
        var _this = this;
        this.dragging = true;
        var targetElement = e.target;
        targetElement.setPointerCapture(e.pointerId); // Set capture to target element to receive dblclick events for this target
        this.controller.setInputCapture(this);
        var lastPoint = this.controller.clientToDiagram(new DOMPoint(e.clientX, e.clientY));
        var action = hitInfo.hitArea.action;
        if (action) {
            var mouseMoveHandler_1 = function (e) {
                var _a, _b;
                var point = new DOMPoint(e.clientX, e.clientY);
                var snapGridSize = !e.altKey && _this.gridSnappingService ? _this.gridSnappingService.snapGridSize : null;
                var elementPoint = _this.controller.clientToDiagram(point);
                var snappedElementPoint = ((_a = _this.gridSnappingService) === null || _a === void 0 ? void 0 : _a.snapToGrid(elementPoint, snapGridSize)) || elementPoint;
                var rawDeltaX = elementPoint.x - lastPoint.x;
                var rawDeltaY = elementPoint.y - lastPoint.y;
                var elements = action === actions_1.ACT_MOVE ? _this.controller.getSelectedElements() : [hitInfo.element];
                _this.controller.dispatchAction(elements, action, {
                    controller: _this.controller,
                    position: snappedElementPoint,
                    deltaX: _this.gridSnappingService ? _this.gridSnappingService.snapToGrid(snappedElementPoint.x - lastPoint.x, snapGridSize) : rawDeltaX,
                    deltaY: _this.gridSnappingService ? _this.gridSnappingService.snapToGrid(snappedElementPoint.y - lastPoint.y, snapGridSize) : rawDeltaY,
                    rawPosition: elementPoint,
                    rawDeltaX: rawDeltaX,
                    rawDeltaY: rawDeltaY,
                    hitArea: hitInfo.hitArea,
                    snapGridSize: snapGridSize,
                    snapAngle: !e.altKey && _this.gridSnappingService ? _this.gridSnappingService.snapAngle : null,
                    snapToGrid: (_b = _this.gridSnappingService) === null || _b === void 0 ? void 0 : _b.snapToGrid.bind(_this.gridSnappingService)
                });
                lastPoint = elementPoint;
            };
            var mouseUpHandler_1 = function (e) {
                _this.dragging = false;
                targetElement.releasePointerCapture(e.pointerId);
                _this.controller.releaseInputCapture(root, _this);
                targetElement.removeEventListener("pointermove", mouseMoveHandler_1);
                targetElement.removeEventListener("pointerup", mouseUpHandler_1);
            };
            targetElement.addEventListener("pointermove", mouseMoveHandler_1);
            targetElement.addEventListener("pointerup", mouseUpHandler_1);
        }
    };
    DefaultElementInteractionService.prototype.mouseDownHandler = function (root, e) {
        if (e.button === 0) {
            var hitInfo = this.controller.hitTest(e);
            var isSelected = hitInfo && this.controller.isSelected(hitInfo.element);
            if (hitInfo && isSelected) {
                (0, _1.setElementCursor)(root, hitInfo.hitArea.cursor);
                this.beginDrag(root, e, hitInfo);
            }
        }
    };
    DefaultElementInteractionService.prototype.mouseMoveHandler = function (root, e) {
        if (!this.dragging) {
            var hitInfo = this.controller.hitTest(e);
            var isSelected = hitInfo && this.controller.isSelected(hitInfo.element);
            (0, _1.setElementCursor)(root, isSelected ? hitInfo === null || hitInfo === void 0 ? void 0 : hitInfo.hitArea.cursor : null);
        }
    };
    DefaultElementInteractionService.prototype.dblClickHandler = function (root, e) {
        var _a, _b;
        if (e.button === 0) {
            var hitInfo = this.controller.hitTest(e);
            if (hitInfo && hitInfo.hitArea.dblClickAction) {
                var point = new DOMPoint(e.clientX, e.clientY);
                var snapGridSize = !e.altKey && this.gridSnappingService ? this.gridSnappingService.snapGridSize : null;
                var elementPoint = this.controller.clientToDiagram(point);
                var snappedElementPoint = ((_a = this.gridSnappingService) === null || _a === void 0 ? void 0 : _a.snapToGrid(elementPoint, snapGridSize)) || elementPoint;
                this.controller.dispatchAction([hitInfo.element], hitInfo.hitArea.dblClickAction, {
                    controller: this.controller,
                    position: snappedElementPoint,
                    rawPosition: elementPoint,
                    hitArea: hitInfo.hitArea,
                    snapGridSize: snapGridSize,
                    snapAngle: !e.altKey && this.gridSnappingService ? this.gridSnappingService.snapAngle : null,
                    snapToGrid: (_b = this.gridSnappingService) === null || _b === void 0 ? void 0 : _b.snapToGrid.bind(this.gridSnappingService)
                });
            }
        }
    };
    return DefaultElementInteractionService;
}());
exports.DefaultElementInteractionService = DefaultElementInteractionService;

},{".":95,"../actions":58}],94:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DefaultGridSnappingService = exports.isGridSnappingService = void 0;
function isGridSnappingService(service) {
    return service.type === "grid_snapping_service";
}
exports.isGridSnappingService = isGridSnappingService;
var DefaultGridSnappingService = /** @class */ (function () {
    function DefaultGridSnappingService(snapGridSize, snapAngle) {
        if (snapGridSize === void 0) { snapGridSize = null; }
        if (snapAngle === void 0) { snapAngle = null; }
        this.snapGridSize = snapGridSize;
        this.snapAngle = snapAngle;
        this.type = "grid_snapping_service";
    }
    DefaultGridSnappingService.prototype.snapToGrid = function (value, snapGridSize) {
        snapGridSize = snapGridSize !== undefined ? snapGridSize : this.snapGridSize;
        if (typeof value === "number") {
            return snapGridSize ? Math.round(value / snapGridSize) * snapGridSize : value;
        }
        else {
            return snapGridSize ? new DOMPoint(this.snapToGrid(value.x, snapGridSize), this.snapToGrid(value.y, snapGridSize)) : value;
        }
    };
    return DefaultGridSnappingService;
}());
exports.DefaultGridSnappingService = DefaultGridSnappingService;

},{}],95:[function(require,module,exports){
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setElementCursor = exports.InteractiveServiceCollection = void 0;
var InteractiveServiceCollection = /** @class */ (function () {
    function InteractiveServiceCollection(services) {
        this.services = services;
    }
    InteractiveServiceCollection.prototype.configure = function (predicate, configure) {
        var service = this.services.find(predicate);
        if (service) {
            configure(service);
        }
    };
    InteractiveServiceCollection.prototype.push = function (service) {
        this.services.push(service);
    };
    InteractiveServiceCollection.prototype.unshift = function (service) {
        this.services.unshift(service);
    };
    InteractiveServiceCollection.prototype.insert = function (position, service) {
        this.services.splice(position, 0, service);
    };
    InteractiveServiceCollection.prototype.remove = function (predicate) {
        var index = this.findIndex(predicate);
        if (index >= 0) {
            this.services.splice(index, 1);
        }
    };
    InteractiveServiceCollection.prototype.removeAt = function (index) {
        this.services.splice(index, 1);
    };
    InteractiveServiceCollection.prototype.replace = function (predicate, service) {
        var index = this.findIndex(predicate);
        if (index >= 0) {
            this.services[index] = service;
        }
    };
    InteractiveServiceCollection.prototype.find = function (predicate) {
        return this.services.find(predicate);
    };
    InteractiveServiceCollection.prototype.findIndex = function (predicate) {
        return this.services.findIndex(predicate);
    };
    InteractiveServiceCollection.prototype.toArray = function () {
        return __spreadArray([], __read(this.services), false);
    };
    return InteractiveServiceCollection;
}());
exports.InteractiveServiceCollection = InteractiveServiceCollection;
function setElementCursor(element, cursor) {
    if (cursor) {
        element.style.cursor = cursor;
    }
    else {
        element.style.removeProperty("cursor");
    }
}
exports.setElementCursor = setElementCursor;
__exportStar(require("./selection-service"), exports);
__exportStar(require("./element-interaction-service"), exports);
__exportStar(require("./grid-snapping-service"), exports);
__exportStar(require("./deletion-service"), exports);
__exportStar(require("./element-drawing-service"), exports);
__exportStar(require("./control-rendering-service"), exports);
__exportStar(require("./paper-service"), exports);
__exportStar(require("./text-editing-service"), exports);

},{"./control-rendering-service":90,"./deletion-service":91,"./element-drawing-service":92,"./element-interaction-service":93,"./grid-snapping-service":94,"./paper-service":96,"./selection-service":97,"./text-editing-service":98}],96:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DefaultPaperService = exports.PAPER_CHANGE_EVENT = exports.isPaperService = void 0;
function isPaperService(service) {
    return service.type === "paper_service";
}
exports.isPaperService = isPaperService;
exports.PAPER_CHANGE_EVENT = "paper_change";
var DefaultPaperService = /** @class */ (function () {
    function DefaultPaperService(controller) {
        this.controller = controller;
        this._paper = null;
        this.type = "paper_service";
    }
    Object.defineProperty(DefaultPaperService.prototype, "paper", {
        get: function () { return this._paper; },
        set: function (value) {
            this._paper = value;
            this.controller.dispatchEvent(exports.PAPER_CHANGE_EVENT, { paper: this._paper });
        },
        enumerable: false,
        configurable: true
    });
    return DefaultPaperService;
}());
exports.DefaultPaperService = DefaultPaperService;

},{}],97:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DefaultSelectionService = exports.RECT_SELECTION_EVENT = exports.isSelectionService = void 0;
function isSelectionService(service) {
    return service.type === "selection_service";
}
exports.isSelectionService = isSelectionService;
exports.RECT_SELECTION_EVENT = "rect_selection";
var DefaultSelectionService = /** @class */ (function () {
    function DefaultSelectionService(controller) {
        this.controller = controller;
        this.type = "selection_service";
    }
    DefaultSelectionService.prototype.activate = function (diagram, root) {
        var _this = this;
        var mouseDownHandler = function (e) { return _this.mouseDownHandler(root, e); };
        root.addEventListener("pointerdown", mouseDownHandler);
        this.deactivate = function () {
            _this.deactivate = undefined;
            root.removeEventListener("pointerdown", mouseDownHandler);
        };
    };
    DefaultSelectionService.prototype.beginSelect = function (root, e) {
        var _this = this;
        root.setPointerCapture(e.pointerId);
        this.controller.setInputCapture(this);
        var startPoint = this.controller.clientToDiagram(new DOMPoint(e.clientX, e.clientY));
        var mouseMoveHandler = function (e) {
            var point = _this.controller.clientToDiagram(new DOMPoint(e.clientX, e.clientY));
            var selectionRect = {
                x: Math.min(startPoint.x, point.x),
                y: Math.min(startPoint.y, point.y),
                width: Math.max(startPoint.x, point.x) - Math.min(startPoint.x, point.x),
                height: Math.max(startPoint.y, point.y) - Math.min(startPoint.y, point.y),
            };
            _this.controller.dispatchEvent(exports.RECT_SELECTION_EVENT, { selectionRect: selectionRect });
        };
        var mouseUpHandler = function (e) {
            _this.controller.dispatchEvent(exports.RECT_SELECTION_EVENT, { selectionRect: null });
            var point = _this.controller.clientToDiagram(new DOMPoint(e.clientX, e.clientY));
            if (startPoint.x !== point.x || startPoint.y !== point.y) {
                var selectionRect = {
                    x: Math.min(startPoint.x, point.x),
                    y: Math.min(startPoint.y, point.y),
                    width: Math.max(startPoint.x, point.x) - Math.min(startPoint.x, point.x),
                    height: Math.max(startPoint.y, point.y) - Math.min(startPoint.y, point.y),
                };
                _this.controller.select(_this.controller.rectIntersectionTest(selectionRect));
            }
            root.releasePointerCapture(e.pointerId);
            _this.controller.releaseInputCapture(root, _this);
            root.removeEventListener("pointermove", mouseMoveHandler);
            root.removeEventListener("pointerup", mouseUpHandler);
        };
        root.addEventListener("pointermove", mouseMoveHandler);
        root.addEventListener("pointerup", mouseUpHandler);
    };
    DefaultSelectionService.prototype.mouseDownHandler = function (root, e) {
        if (e.button === 0) {
            var hitInfo_1 = this.controller.hitTest(e);
            if (hitInfo_1) {
                var isSelected = this.controller.isSelected(hitInfo_1.element);
                if (e.shiftKey) {
                    if (isSelected) {
                        this.controller.select(this.controller.getSelectedElements().filter(function (x) { return x !== hitInfo_1.element; }));
                    }
                    else {
                        this.controller.select(this.controller.getSelectedElements().concat(hitInfo_1.element));
                    }
                }
                else {
                    if (!isSelected) {
                        this.controller.select(hitInfo_1.element);
                    }
                }
            }
            else {
                if (this.controller.getSelectedElements().length) {
                    this.controller.select([]);
                }
                this.beginSelect(root, e);
            }
        }
    };
    return DefaultSelectionService;
}());
exports.DefaultSelectionService = DefaultSelectionService;

},{}],98:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DefaultTextEditingService = exports.isTextEditingService = void 0;
function isTextEditingService(service) {
    return service.type === "text_editing_service";
}
exports.isTextEditingService = isTextEditingService;
var DefaultTextEditingService = /** @class */ (function () {
    function DefaultTextEditingService(controller) {
        this.controller = controller;
        this.type = "text_editing_service";
    }
    DefaultTextEditingService.prototype.showEditor = function (text, rect, style, onClose) {
        var _a;
        function closeEditor(value) {
            onClose === null || onClose === void 0 ? void 0 : onClose(value);
            backdrop.remove();
        }
        var backdrop = document.createElement("div");
        backdrop.className = "inplace-text-editor-backdrop";
        backdrop.style.position = "fixed";
        backdrop.style.zIndex = "1000";
        backdrop.style.left = "0";
        backdrop.style.top = "0";
        backdrop.style.right = "0";
        backdrop.style.bottom = "0";
        backdrop.onclick = function (e) {
            if (e.target === backdrop) {
                closeEditor(inplaceEditor.value);
            }
        };
        var x = rect.x;
        var y = rect.y;
        var translateX = "0";
        switch (style === null || style === void 0 ? void 0 : style.textAlign) {
            case "center":
                x = rect.x + rect.width / 2;
                translateX = "-50%";
                break;
            case "right":
                x = rect.x + rect.width;
                translateX = "-100%";
                break;
        }
        var translateY = "0";
        switch (style === null || style === void 0 ? void 0 : style.verticalAlign) {
            case "middle":
                y = rect.y + rect.height / 2;
                translateY = "-50%";
                break;
            case "bottom":
                y = rect.y + rect.height;
                translateY = "-100%";
                break;
        }
        var p = this.controller.diagramToClient(new DOMPoint(x, y));
        var inplaceEditor = document.createElement("input");
        inplaceEditor.className = "inplace-text-editor";
        inplaceEditor.style.position = "relative";
        inplaceEditor.style.left = "".concat(p.x, "px");
        inplaceEditor.style.top = "".concat(p.y, "px");
        inplaceEditor.style.transform = "translate(".concat(translateX, ", ").concat(translateY, ")");
        var fontSize = style === null || style === void 0 ? void 0 : style.fontSize;
        if (fontSize) {
            fontSize = parseInt(fontSize);
            if (!isNaN(fontSize)) {
                var scale = ((_a = this.controller.screenCTM) === null || _a === void 0 ? void 0 : _a.a) || 1;
                inplaceEditor.style.fontSize = "".concat(Math.round(fontSize * scale), "px");
            }
        }
        inplaceEditor.style.fontFamily = (style === null || style === void 0 ? void 0 : style.fontFamily) || "";
        inplaceEditor.style.fontStyle = (style === null || style === void 0 ? void 0 : style.fontStyle) || "";
        inplaceEditor.style.fontWeight = "".concat(style === null || style === void 0 ? void 0 : style.fontWeight) || "";
        inplaceEditor.style.textAlign = (style === null || style === void 0 ? void 0 : style.textAlign) || "";
        inplaceEditor.value = text;
        inplaceEditor.onkeydown = function (e) {
            if (e.code === "Esc" || e.code === "Escape") {
                closeEditor(text);
            }
            if (e.code === "Enter") {
                closeEditor(inplaceEditor.value);
            }
        };
        backdrop.appendChild(inplaceEditor);
        document.body.appendChild(backdrop);
        inplaceEditor.focus();
    };
    return DefaultTextEditingService;
}());
exports.DefaultTextEditingService = DefaultTextEditingService;

},{}],99:[function(require,module,exports){
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = global || self, factory(global.KldIntersections = {}));
}(this, (function (exports) { 'use strict';

  function _typeof(obj) {
    "@babel/helpers - typeof";

    if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
      _typeof = function (obj) {
        return typeof obj;
      };
    } else {
      _typeof = function (obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
      };
    }

    return _typeof(obj);
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }

  function _slicedToArray(arr, i) {
    return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
  }

  function _toConsumableArray(arr) {
    return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
  }

  function _arrayWithoutHoles(arr) {
    if (Array.isArray(arr)) return _arrayLikeToArray(arr);
  }

  function _arrayWithHoles(arr) {
    if (Array.isArray(arr)) return arr;
  }

  function _iterableToArray(iter) {
    if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter);
  }

  function _iterableToArrayLimit(arr, i) {
    if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return;
    var _arr = [];
    var _n = true;
    var _d = false;
    var _e = undefined;

    try {
      for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value);

        if (i && _arr.length === i) break;
      }
    } catch (err) {
      _d = true;
      _e = err;
    } finally {
      try {
        if (!_n && _i["return"] != null) _i["return"]();
      } finally {
        if (_d) throw _e;
      }
    }

    return _arr;
  }

  function _unsupportedIterableToArray(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _arrayLikeToArray(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(o);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
  }

  function _arrayLikeToArray(arr, len) {
    if (len == null || len > arr.length) len = arr.length;

    for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

    return arr2;
  }

  function _nonIterableSpread() {
    throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }

  function _nonIterableRest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }

  function _createForOfIteratorHelper(o) {
    if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) {
      if (Array.isArray(o) || (o = _unsupportedIterableToArray(o))) {
        var i = 0;

        var F = function () {};

        return {
          s: F,
          n: function () {
            if (i >= o.length) return {
              done: true
            };
            return {
              done: false,
              value: o[i++]
            };
          },
          e: function (e) {
            throw e;
          },
          f: F
        };
      }

      throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
    }

    var it,
        normalCompletion = true,
        didErr = false,
        err;
    return {
      s: function () {
        it = o[Symbol.iterator]();
      },
      n: function () {
        var step = it.next();
        normalCompletion = step.done;
        return step;
      },
      e: function (e) {
        didErr = true;
        err = e;
      },
      f: function () {
        try {
          if (!normalCompletion && it.return != null) it.return();
        } finally {
          if (didErr) throw err;
        }
      }
    };
  }

  /**
   *  Point2D.js
   *  @module Point2D
   *  @copyright 2001-2019 Kevin Lindsey
   */

  /**
   *  Point2D
   *
   *  @memberof module:kld-affine
   */
  var Point2D = /*#__PURE__*/function () {
    /**
     *  Point2D
     *
     *  @param {number} x
     *  @param {number} y
     *  @returns {module:kld-affine.Point2D}
     */
    function Point2D() {
      var x = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
      var y = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

      _classCallCheck(this, Point2D);

      this.x = x;
      this.y = y;
    }
    /**
     *  clone
     *
     *  @returns {module:kld-affine.Point2D}
     */


    _createClass(Point2D, [{
      key: "clone",
      value: function clone() {
        return new this.constructor(this.x, this.y);
      }
      /**
       *  add
       *
       *  @param {module:kld-affine.Point2D} that
       *  @returns {module:kld-affine.Point2D}
       */

    }, {
      key: "add",
      value: function add(that) {
        return new this.constructor(this.x + that.x, this.y + that.y);
      }
      /**
       *  subtract
       *
       *  @param {module:kld-affine.Point2D} that
       *  @returns {module:kld-affine.Point2D}
       */

    }, {
      key: "subtract",
      value: function subtract(that) {
        return new this.constructor(this.x - that.x, this.y - that.y);
      }
      /**
       *  multiply
       *
       *  @param {number} scalar
       *  @returns {module:kld-affine.Point2D}
       */

    }, {
      key: "multiply",
      value: function multiply(scalar) {
        return new this.constructor(this.x * scalar, this.y * scalar);
      }
      /**
       *  divide
       *
       *  @param {number} scalar
       *  @returns {module:kld-affine.Point2D}
       */

    }, {
      key: "divide",
      value: function divide(scalar) {
        return new this.constructor(this.x / scalar, this.y / scalar);
      }
      /**
       *  equals
       *
       *  @param {module:kld-affine.Point2D} that
       *  @returns {boolean}
       */

    }, {
      key: "equals",
      value: function equals(that) {
        return this.x === that.x && this.y === that.y;
      }
      /**
       *  precisionEquals
       *
       *  @param {module:kld-affine.Point2D} that
       *  @param {number} precision
       *  @returns {boolean}
       */

    }, {
      key: "precisionEquals",
      value: function precisionEquals(that, precision) {
        return Math.abs(this.x - that.x) < precision && Math.abs(this.y - that.y) < precision;
      } // utility methods

      /**
       *  lerp
       *
       *  @param {module:kld-affine.Point2D} that
       *  @param {number} t
       *  @returns {module:kld-affine.Point2D}
       */

    }, {
      key: "lerp",
      value: function lerp(that, t) {
        var omt = 1.0 - t;
        return new this.constructor(this.x * omt + that.x * t, this.y * omt + that.y * t);
      }
      /**
       *  distanceFrom
       *
       *  @param {module:kld-affine.Point2D} that
       *  @returns {number}
       */

    }, {
      key: "distanceFrom",
      value: function distanceFrom(that) {
        var dx = this.x - that.x;
        var dy = this.y - that.y;
        return Math.sqrt(dx * dx + dy * dy);
      }
      /**
       *  min
       *
       *  @param {module:kld-affine.Point2D} that
       *  @returns {number}
       */

    }, {
      key: "min",
      value: function min(that) {
        return new this.constructor(Math.min(this.x, that.x), Math.min(this.y, that.y));
      }
      /**
       *  max
       *
       *  @param {module:kld-affine.Point2D} that
       *  @returns {number}
       */

    }, {
      key: "max",
      value: function max(that) {
        return new this.constructor(Math.max(this.x, that.x), Math.max(this.y, that.y));
      }
      /**
       *  transform
       *
       *  @param {module:kld-affine.Matrix2D} matrix
       *  @returns {module:kld-affine.Point2D}
       */

    }, {
      key: "transform",
      value: function transform(matrix) {
        return new this.constructor(matrix.a * this.x + matrix.c * this.y + matrix.e, matrix.b * this.x + matrix.d * this.y + matrix.f);
      }
      /**
       *  toString
       *
       *  @returns {string}
       */

    }, {
      key: "toString",
      value: function toString() {
        return "point(".concat(this.x, ",").concat(this.y, ")");
      }
    }]);

    return Point2D;
  }();

  /**
   *  Vector2D.js
   *  @module Vector2D
   *  @copyright 2001-2019 Kevin Lindsey
   */

  /**
   *  Vector2D
   *
   *  @memberof module:kld-affine
   */
  var Vector2D = /*#__PURE__*/function () {
    /**
     *  Vector2D
     *
     *  @param {number} x
     *  @param {number} y
     *  @returns {module:kld-affine.Vector2D}
     */
    function Vector2D() {
      var x = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
      var y = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

      _classCallCheck(this, Vector2D);

      this.x = x;
      this.y = y;
    }
    /**
     *  fromPoints
     *
     *  @param {module:kld-affine.Point2D} p1
     *  @param {module:kld-affine.Point2D} p2
     *  @returns {module:kld-affine.Vector2D}
     */


    _createClass(Vector2D, [{
      key: "length",

      /**
       *  length
       *
       *  @returns {number}
       */
      value: function length() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
      }
      /**
       *  magnitude
       *
       *  @returns {number}
       */

    }, {
      key: "magnitude",
      value: function magnitude() {
        return this.x * this.x + this.y * this.y;
      }
      /**
       *  dot
       *
       *  @param {module:kld-affine.Vector2D} that
       *  @returns {number}
       */

    }, {
      key: "dot",
      value: function dot(that) {
        return this.x * that.x + this.y * that.y;
      }
      /**
       *  cross
       *
       *  @param {module:kld-affine.Vector2D} that
       *  @returns {number}
       */

    }, {
      key: "cross",
      value: function cross(that) {
        return this.x * that.y - this.y * that.x;
      }
      /**
       *  determinant
       *
       *  @param {module:kld-affine.Vector2D} that
       *  @returns {number}
       */

    }, {
      key: "determinant",
      value: function determinant(that) {
        return this.x * that.y - this.y * that.x;
      }
      /**
       *  unit
       *
       *  @returns {module:kld-affine.Vector2D}
       */

    }, {
      key: "unit",
      value: function unit() {
        return this.divide(this.length());
      }
      /**
       *  add
       *
       *  @param {module:kld-affine.Vector2D} that
       *  @returns {module:kld-affine.Vector2D}
       */

    }, {
      key: "add",
      value: function add(that) {
        return new this.constructor(this.x + that.x, this.y + that.y);
      }
      /**
       *  subtract
       *
       *  @param {module:kld-affine.Vector2D} that
       *  @returns {module:kld-affine.Vector2D}
       */

    }, {
      key: "subtract",
      value: function subtract(that) {
        return new this.constructor(this.x - that.x, this.y - that.y);
      }
      /**
       *  multiply
       *
       *  @param {number} scalar
       *  @returns {module:kld-affine.Vector2D}
       */

    }, {
      key: "multiply",
      value: function multiply(scalar) {
        return new this.constructor(this.x * scalar, this.y * scalar);
      }
      /**
       *  divide
       *
       *  @param {number} scalar
       *  @returns {module:kld-affine.Vector2D}
       */

    }, {
      key: "divide",
      value: function divide(scalar) {
        return new this.constructor(this.x / scalar, this.y / scalar);
      }
      /**
       *  angleBetween
       *
       *  @param {module:kld-affine.Vector2D} that
       *  @returns {number}
       */

    }, {
      key: "angleBetween",
      value: function angleBetween(that) {
        var cos = this.dot(that) / (this.length() * that.length());
        cos = Math.max(-1, Math.min(cos, 1));
        var radians = Math.acos(cos);
        return this.cross(that) < 0.0 ? -radians : radians;
      }
      /**
       *  Find a vector is that is perpendicular to this vector
       *
       *  @returns {module:kld-affine.Vector2D}
       */

    }, {
      key: "perp",
      value: function perp() {
        return new this.constructor(-this.y, this.x);
      }
      /**
       *  Find the component of the specified vector that is perpendicular to
       *  this vector
       *
       *  @param {module:kld-affine.Vector2D} that
       *  @returns {module:kld-affine.Vector2D}
       */

    }, {
      key: "perpendicular",
      value: function perpendicular(that) {
        return this.subtract(this.project(that));
      }
      /**
       *  project
       *
       *  @param {module:kld-affine.Vector2D} that
       *  @returns {module:kld-affine.Vector2D}
       */

    }, {
      key: "project",
      value: function project(that) {
        var percent = this.dot(that) / that.dot(that);
        return that.multiply(percent);
      }
      /**
       *  transform
       *
       *  @param {module:kld-affine.Matrix2D} matrix
       *  @returns {module:kld-affine.Vector2D}
       */

    }, {
      key: "transform",
      value: function transform(matrix) {
        return new this.constructor(matrix.a * this.x + matrix.c * this.y, matrix.b * this.x + matrix.d * this.y);
      }
      /**
       *  equals
       *
       *  @param {module:kld-affine.Vector2D} that
       *  @returns {boolean}
       */

    }, {
      key: "equals",
      value: function equals(that) {
        return this.x === that.x && this.y === that.y;
      }
      /**
       *  precisionEquals
       *
       *  @param {module:kld-affine.Vector2D} that
       *  @param {number} precision
       *  @returns {boolean}
       */

    }, {
      key: "precisionEquals",
      value: function precisionEquals(that, precision) {
        return Math.abs(this.x - that.x) < precision && Math.abs(this.y - that.y) < precision;
      }
      /**
       *  toString
       *
       *  @returns {string}
       */

    }, {
      key: "toString",
      value: function toString() {
        return "vector(".concat(this.x, ",").concat(this.y, ")");
      }
    }], [{
      key: "fromPoints",
      value: function fromPoints(p1, p2) {
        return new Vector2D(p2.x - p1.x, p2.y - p1.y);
      }
    }]);

    return Vector2D;
  }();

  /**
   *  Matrix2D.js
   *  @module Matrix2D
   *  @copyright 2001-2019 Kevin Lindsey
   */

  /**
   *  Matrix2D
   *
   *  @memberof module:kld-affine
   */
  var Matrix2D = /*#__PURE__*/function () {
    /**
     *  A 2D Matrix of the form:<br>
     *  [a c e]<br>
     *  [b d f]<br>
     *  [0 0 1]<br>
     *
     *  @param {number} a
     *  @param {number} b
     *  @param {number} c
     *  @param {number} d
     *  @param {number} e
     *  @param {number} f
     *  @returns {module:kld-affine.Matrix2D}
     */
    function Matrix2D() {
      var a = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
      var b = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
      var c = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
      var d = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 1;
      var e = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 0;
      var f = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : 0;

      _classCallCheck(this, Matrix2D);

      this.a = a;
      this.b = b;
      this.c = c;
      this.d = d;
      this.e = e;
      this.f = f;
    }
    /**
     *  translation
     *
     *  @param {number} tx
     *  @param {number} ty
     *  @returns {module:kld-affine.Matrix2D}
     */


    _createClass(Matrix2D, [{
      key: "multiply",

      /**
       *  multiply
       *
       *  @param {module:kld-affine.Matrix2D} that
       *  @returns {module:kld-affine.Matrix2D}
       */
      value: function multiply(that) {
        if (this.isIdentity()) {
          return that;
        }

        if (that.isIdentity()) {
          return this;
        }

        return new this.constructor(this.a * that.a + this.c * that.b, this.b * that.a + this.d * that.b, this.a * that.c + this.c * that.d, this.b * that.c + this.d * that.d, this.a * that.e + this.c * that.f + this.e, this.b * that.e + this.d * that.f + this.f);
      }
      /**
       *  inverse
       *
       *  @returns {module:kld-affine.Matrix2D}
       */

    }, {
      key: "inverse",
      value: function inverse() {
        if (this.isIdentity()) {
          return this;
        }

        var det1 = this.a * this.d - this.b * this.c;

        if (det1 === 0.0) {
          throw new Error("Matrix is not invertible");
        }

        var idet = 1.0 / det1;
        var det2 = this.f * this.c - this.e * this.d;
        var det3 = this.e * this.b - this.f * this.a;
        return new this.constructor(this.d * idet, -this.b * idet, -this.c * idet, this.a * idet, det2 * idet, det3 * idet);
      }
      /**
       *  translate
       *
       *  @param {number} tx
       *  @param {number} ty
       *  @returns {module:kld-affine.Matrix2D}
       */

    }, {
      key: "translate",
      value: function translate(tx, ty) {
        return new this.constructor(this.a, this.b, this.c, this.d, this.a * tx + this.c * ty + this.e, this.b * tx + this.d * ty + this.f);
      }
      /**
       *  scale
       *
       *  @param {number} scale
       *  @returns {module:kld-affine.Matrix2D}
       */

    }, {
      key: "scale",
      value: function scale(_scale) {
        return new this.constructor(this.a * _scale, this.b * _scale, this.c * _scale, this.d * _scale, this.e, this.f);
      }
      /**
       *  scaleAt
       *
       *  @param {number} scale
       *  @param {module:kld-affine.Point2D} center
       *  @returns {module:kld-affine.Matrix2D}
       */

    }, {
      key: "scaleAt",
      value: function scaleAt(scale, center) {
        var dx = center.x - scale * center.x;
        var dy = center.y - scale * center.y;
        return new this.constructor(this.a * scale, this.b * scale, this.c * scale, this.d * scale, this.a * dx + this.c * dy + this.e, this.b * dx + this.d * dy + this.f);
      }
      /**
       *  scaleNonUniform
       *
       *  @param {number} scaleX
       *  @param {number} scaleY
       *  @returns {module:kld-affine.Matrix2D}
       */

    }, {
      key: "scaleNonUniform",
      value: function scaleNonUniform(scaleX, scaleY) {
        return new this.constructor(this.a * scaleX, this.b * scaleX, this.c * scaleY, this.d * scaleY, this.e, this.f);
      }
      /**
       *  scaleNonUniformAt
       *
       *  @param {number} scaleX
       *  @param {number} scaleY
       *  @param {module:kld-affine.Point2D} center
       *  @returns {module:kld-affine.Matrix2D}
       */

    }, {
      key: "scaleNonUniformAt",
      value: function scaleNonUniformAt(scaleX, scaleY, center) {
        var dx = center.x - scaleX * center.x;
        var dy = center.y - scaleY * center.y;
        return new this.constructor(this.a * scaleX, this.b * scaleX, this.c * scaleY, this.d * scaleY, this.a * dx + this.c * dy + this.e, this.b * dx + this.d * dy + this.f);
      }
      /**
       *  rotate
       *
       *  @param {number} radians
       *  @returns {module:kld-affine.Matrix2D}
       */

    }, {
      key: "rotate",
      value: function rotate(radians) {
        var c = Math.cos(radians);
        var s = Math.sin(radians);
        return new this.constructor(this.a * c + this.c * s, this.b * c + this.d * s, this.a * -s + this.c * c, this.b * -s + this.d * c, this.e, this.f);
      }
      /**
       *  rotateAt
       *
       *  @param {number} radians
       *  @param {module:kld-affine.Point2D} center
       *  @returns {module:kld-affine.Matrix2D}
       */

    }, {
      key: "rotateAt",
      value: function rotateAt(radians, center) {
        var cos = Math.cos(radians);
        var sin = Math.sin(radians);
        var cx = center.x;
        var cy = center.y;
        var a = this.a * cos + this.c * sin;
        var b = this.b * cos + this.d * sin;
        var c = this.c * cos - this.a * sin;
        var d = this.d * cos - this.b * sin;
        return new this.constructor(a, b, c, d, (this.a - a) * cx + (this.c - c) * cy + this.e, (this.b - b) * cx + (this.d - d) * cy + this.f);
      }
      /**
       *  rotateFromVector
       *
       *  @param {module:kld-affine.Vector2D} vector
       *  @returns {module:kld-affine.Matrix2D}
       */

    }, {
      key: "rotateFromVector",
      value: function rotateFromVector(vector) {
        var unit = vector.unit();
        var c = unit.x; // cos

        var s = unit.y; // sin

        return new this.constructor(this.a * c + this.c * s, this.b * c + this.d * s, this.a * -s + this.c * c, this.b * -s + this.d * c, this.e, this.f);
      }
      /**
       *  flipX
       *
       *  @returns {module:kld-affine.Matrix2D}
       */

    }, {
      key: "flipX",
      value: function flipX() {
        return new this.constructor(-this.a, -this.b, this.c, this.d, this.e, this.f);
      }
      /**
       *  flipY
       *
       *  @returns {module:kld-affine.Matrix2D}
       */

    }, {
      key: "flipY",
      value: function flipY() {
        return new this.constructor(this.a, this.b, -this.c, -this.d, this.e, this.f);
      }
      /**
       *  skewX
       *
       *  @param {number} radians
       *  @returns {module:kld-affine.Matrix2D}
       */

    }, {
      key: "skewX",
      value: function skewX(radians) {
        var t = Math.tan(radians);
        return new this.constructor(this.a, this.b, this.c + this.a * t, this.d + this.b * t, this.e, this.f);
      } // TODO: skewXAt

      /**
       *  skewY
       *
       *  @param {number} radians
       *  @returns {module:kld-affine.Matrix2D}
       */

    }, {
      key: "skewY",
      value: function skewY(radians) {
        var t = Math.tan(radians);
        return new this.constructor(this.a + this.c * t, this.b + this.d * t, this.c, this.d, this.e, this.f);
      } // TODO: skewYAt

      /**
       *  isIdentity
       *
       *  @returns {boolean}
       */

    }, {
      key: "isIdentity",
      value: function isIdentity() {
        return this.a === 1.0 && this.b === 0.0 && this.c === 0.0 && this.d === 1.0 && this.e === 0.0 && this.f === 0.0;
      }
      /**
       *  isInvertible
       *
       *  @returns {boolean}
       */

    }, {
      key: "isInvertible",
      value: function isInvertible() {
        return this.a * this.d - this.b * this.c !== 0.0;
      }
      /**
       *  getScale
       *
       *  @returns {{ scaleX: number, scaleY: number }}
       */

    }, {
      key: "getScale",
      value: function getScale() {
        return {
          scaleX: Math.sqrt(this.a * this.a + this.c * this.c),
          scaleY: Math.sqrt(this.b * this.b + this.d * this.d)
        };
      }
      /**
       *  Calculates matrix Singular Value Decomposition
       *
       *  The resulting matrices — translation, rotation, scale, and rotation0 — return
       *  this matrix when they are multiplied together in the listed order
       *
       *  @see Jim Blinn's article {@link http://dx.doi.org/10.1109/38.486688}
       *  @see {@link http://math.stackexchange.com/questions/861674/decompose-a-2d-arbitrary-transform-into-only-scaling-and-rotation}
       *
       *  @returns {{
       *    translation: module:kld-affine.Matrix2D,
       *    rotation: module:kld-affine.Matrix2D,
       *    scale: module:kld-affine.Matrix2D,
       *    rotation0: module:kld-affine.Matrix2D
       *  }}
       */

    }, {
      key: "getDecomposition",
      value: function getDecomposition() {
        var E = (this.a + this.d) * 0.5;
        var F = (this.a - this.d) * 0.5;
        var G = (this.b + this.c) * 0.5;
        var H = (this.b - this.c) * 0.5;
        var Q = Math.sqrt(E * E + H * H);
        var R = Math.sqrt(F * F + G * G);
        var scaleX = Q + R;
        var scaleY = Q - R;
        var a1 = Math.atan2(G, F);
        var a2 = Math.atan2(H, E);
        var theta = (a2 - a1) * 0.5;
        var phi = (a2 + a1) * 0.5;
        return {
          translation: this.constructor.translation(this.e, this.f),
          rotation: this.constructor.rotation(phi),
          scale: this.constructor.nonUniformScaling(scaleX, scaleY),
          rotation0: this.constructor.rotation(theta)
        };
      }
      /**
       *  equals
       *
       *  @param {module:kld-affine.Matrix2D} that
       *  @returns {boolean}
       */

    }, {
      key: "equals",
      value: function equals(that) {
        return this.a === that.a && this.b === that.b && this.c === that.c && this.d === that.d && this.e === that.e && this.f === that.f;
      }
      /**
       *  precisionEquals
       *
       *  @param {module:kld-affine.Matrix2D} that
       *  @param {number} precision
       *  @returns {boolean}
       */

    }, {
      key: "precisionEquals",
      value: function precisionEquals(that, precision) {
        return Math.abs(this.a - that.a) < precision && Math.abs(this.b - that.b) < precision && Math.abs(this.c - that.c) < precision && Math.abs(this.d - that.d) < precision && Math.abs(this.e - that.e) < precision && Math.abs(this.f - that.f) < precision;
      }
      /**
       *  toString
       *
       *  @returns {string}
       */

    }, {
      key: "toString",
      value: function toString() {
        return "matrix(".concat(this.a, ",").concat(this.b, ",").concat(this.c, ",").concat(this.d, ",").concat(this.e, ",").concat(this.f, ")");
      }
    }], [{
      key: "translation",
      value: function translation(tx, ty) {
        return new Matrix2D(1, 0, 0, 1, tx, ty);
      }
      /**
       *  scaling
       *
       *  @param {number} scale
       *  @returns {module:kld-affine.Matrix2D}
       */

    }, {
      key: "scaling",
      value: function scaling(scale) {
        return new Matrix2D(scale, 0, 0, scale, 0, 0);
      }
      /**
       *  scalingAt
       *
       *  @param {number} scale
       *  @param {module:kld-affine.Point2D} center
       *  @returns {module:kld-affine.Matrix2D}
       */

    }, {
      key: "scalingAt",
      value: function scalingAt(scale, center) {
        return new Matrix2D(scale, 0, 0, scale, center.x - center.x * scale, center.y - center.y * scale);
      }
      /**
       *  nonUniformScaling
       *
       *  @param {number} scaleX
       *  @param {number} scaleY
       *  @returns {module:kld-affine.Matrix2D}
       */

    }, {
      key: "nonUniformScaling",
      value: function nonUniformScaling(scaleX, scaleY) {
        return new Matrix2D(scaleX, 0, 0, scaleY, 0, 0);
      }
      /**
       *  nonUniformScalingAt
       *
       *  @param {number} scaleX
       *  @param {number} scaleY
       *  @param {module:kld-affine.Point2D} center
       *  @returns {module:kld-affine.Matrix2D}
       */

    }, {
      key: "nonUniformScalingAt",
      value: function nonUniformScalingAt(scaleX, scaleY, center) {
        return new Matrix2D(scaleX, 0, 0, scaleY, center.x - center.x * scaleX, center.y - center.y * scaleY);
      }
      /**
       *  rotation
       *
       *  @param {number} radians
       *  @returns {module:kld-affine.Matrix2D}
       */

    }, {
      key: "rotation",
      value: function rotation(radians) {
        var c = Math.cos(radians);
        var s = Math.sin(radians);
        return new Matrix2D(c, s, -s, c, 0, 0);
      }
      /**
       *  rotationAt
       *
       *  @param {number} radians
       *  @param {module:kld-affine.Point2D} center
       *  @returns {module:kld-affine.Matrix2D}
       */

    }, {
      key: "rotationAt",
      value: function rotationAt(radians, center) {
        var c = Math.cos(radians);
        var s = Math.sin(radians);
        return new Matrix2D(c, s, -s, c, center.x - center.x * c + center.y * s, center.y - center.y * c - center.x * s);
      }
      /**
       *  rotationFromVector
       *
       *  @param {module:kld-affine.Vector2D} vector
       *  @returns {module:kld-affine.Matrix2D}
       */

    }, {
      key: "rotationFromVector",
      value: function rotationFromVector(vector) {
        var unit = vector.unit();
        var c = unit.x; // cos

        var s = unit.y; // sin

        return new Matrix2D(c, s, -s, c, 0, 0);
      }
      /**
       *  xFlip
       *
       *  @returns {module:kld-affine.Matrix2D}
       */

    }, {
      key: "xFlip",
      value: function xFlip() {
        return new Matrix2D(-1, 0, 0, 1, 0, 0);
      }
      /**
       *  yFlip
       *
       *  @returns {module:kld-affine.Matrix2D}
       */

    }, {
      key: "yFlip",
      value: function yFlip() {
        return new Matrix2D(1, 0, 0, -1, 0, 0);
      }
      /**
       *  xSkew
       *
       *  @param {number} radians
       *  @returns {module:kld-affine.Matrix2D}
       */

    }, {
      key: "xSkew",
      value: function xSkew(radians) {
        var t = Math.tan(radians);
        return new Matrix2D(1, 0, t, 1, 0, 0);
      }
      /**
       *  ySkew
       *
       *  @param {number} radians
       *  @returns {module:kld-affine.Matrix2D}
       */

    }, {
      key: "ySkew",
      value: function ySkew(radians) {
        var t = Math.tan(radians);
        return new Matrix2D(1, t, 0, 1, 0, 0);
      }
    }]);

    return Matrix2D;
  }();
  /**
   *  Identity matrix
   *
   *  @returns {module:kld-affine.Matrix2D}
   */


  Matrix2D.IDENTITY = new Matrix2D();

  Matrix2D.IDENTITY.isIdentity = function () {
    return true;
  };

  /* eslint-disable camelcase */

  /**
   *  Polynomial.js
   *
   *  @module Polynomial
   *  @copyright 2002-2019 Kevin Lindsey<br>
   *  -<br>
   *  Contribution {@link http://github.com/Quazistax/kld-polynomial}<br>
   *  copyright 2015 Robert Benko (Quazistax) <quazistax@gmail.com><br>
   *  MIT license
   */

  /**
   *  Sign of a number (+1, -1, +0, -0).
   *
   *  @param {number} x
   *  @returns {number}
   */
  function sign(x) {
    // eslint-disable-next-line no-self-compare
    return typeof x === "number" ? x ? x < 0 ? -1 : 1 : x === x ? x : NaN : NaN;
  }
  /**
   *  Polynomial
   *
   *  @memberof module:kld-polynomial
   */


  var Polynomial = /*#__PURE__*/function () {
    /**
     *  Polynomial
     *
     *  @param {Array<number>} coefs
     *  @returns {module:kld-polynomial.Polynomial}
     */
    function Polynomial() {
      _classCallCheck(this, Polynomial);

      this.coefs = [];

      for (var i = arguments.length - 1; i >= 0; i--) {
        this.coefs.push(i < 0 || arguments.length <= i ? undefined : arguments[i]);
      }

      this._variable = "t";
      this._s = 0;
    }
    /**
     *  Based on polint in "Numerical Recipes in C, 2nd Edition", pages 109-110
     *
     *  @param {Array<number>} xs
     *  @param {Array<number>} ys
     *  @param {number} n
     *  @param {number} offset
     *  @param {number} x
     *
     *  @returns {{y: number, dy: number}}
     */


    _createClass(Polynomial, [{
      key: "clone",

      /**
       *  Clones this polynomial and return the clone.
       *
       *  @returns {module:kld-polynomial.Polynomial}
       */
      value: function clone() {
        var poly = new Polynomial();
        poly.coefs = this.coefs.slice();
        return poly;
      }
      /**
       *  eval
       *
       *  @param {number} x
       */

    }, {
      key: "eval",
      value: function _eval(x) {
        if (isNaN(x)) {
          throw new TypeError("Parameter must be a number. Found '".concat(x, "'"));
        }

        var result = 0;

        for (var i = this.coefs.length - 1; i >= 0; i--) {
          result = result * x + this.coefs[i];
        }

        return result;
      }
      /**
       *  add
       *
       *  @param {module:kld-polynomial.Polynomial} that
       *  @returns {module:kld-polynomial.Polynomial}
       */

    }, {
      key: "add",
      value: function add(that) {
        var result = new Polynomial();
        var d1 = this.getDegree();
        var d2 = that.getDegree();
        var dmax = Math.max(d1, d2);

        for (var i = 0; i <= dmax; i++) {
          var v1 = i <= d1 ? this.coefs[i] : 0;
          var v2 = i <= d2 ? that.coefs[i] : 0;
          result.coefs[i] = v1 + v2;
        }

        return result;
      }
      /**
       *  multiply
       *
       *  @param {module:kld-polynomial.Polynomial} that
       *  @returns {module:kld-polynomial.Polynomial}
       */

    }, {
      key: "multiply",
      value: function multiply(that) {
        var result = new Polynomial();

        for (var i = 0; i <= this.getDegree() + that.getDegree(); i++) {
          result.coefs.push(0);
        }

        for (var _i = 0; _i <= this.getDegree(); _i++) {
          for (var j = 0; j <= that.getDegree(); j++) {
            result.coefs[_i + j] += this.coefs[_i] * that.coefs[j];
          }
        }

        return result;
      }
      /**
       *  divideEqualsScalar
       *
       *  @deprecated To be replaced by divideScalar
       *  @param {number} scalar
       */

    }, {
      key: "divideEqualsScalar",
      value: function divideEqualsScalar(scalar) {
        for (var i = 0; i < this.coefs.length; i++) {
          this.coefs[i] /= scalar;
        }
      }
      /**
       *  simplifyEquals
       *
       *  @deprecated To be replaced by simplify
       *  @param {number} TOLERANCE
       */

    }, {
      key: "simplifyEquals",
      value: function simplifyEquals() {
        var TOLERANCE = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1e-12;

        for (var i = this.getDegree(); i >= 0; i--) {
          if (Math.abs(this.coefs[i]) <= TOLERANCE) {
            this.coefs.pop();
          } else {
            break;
          }
        }
      }
      /**
       *  Sets small coefficients to zero.
       *
       *  @deprecated To be replaced by removeZeros
       *  @param {number} TOLERANCE
       *  @returns {module:kld-polynomial.Polynomial}
       */

    }, {
      key: "removeZerosEquals",
      value: function removeZerosEquals() {
        var TOLERANCE = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1e-15;
        var c = this.coefs;
        var err = 10 * TOLERANCE * Math.abs(c.reduce(function (pv, cv) {
          return Math.abs(cv) > Math.abs(pv) ? cv : pv;
        }));

        for (var i = 0; i < c.length - 1; i++) {
          if (Math.abs(c[i]) < err) {
            c[i] = 0;
          }
        }

        return this;
      }
      /**
       *  Scales polynomial so that leading coefficient becomes 1.
       *
       *  @deprecated To be replaced by getMonic
       *  @returns {module:kld-polynomial.Polynomial}
       */

    }, {
      key: "monicEquals",
      value: function monicEquals() {
        var c = this.coefs;

        if (c[c.length - 1] !== 1) {
          this.divideEqualsScalar(c[c.length - 1]);
        }

        return this;
      }
      /**
       *  toString
       *
       *  @returns {string}
       */

    }, {
      key: "toString",
      value: function toString() {
        var coefs = [];
        var signs = [];

        for (var i = this.coefs.length - 1; i >= 0; i--) {
          var value = Math.round(this.coefs[i] * 1000) / 1000;

          if (value !== 0) {
            var signString = value < 0 ? " - " : " + ";
            value = Math.abs(value);

            if (i > 0) {
              if (value === 1) {
                value = this._variable;
              } else {
                value += this._variable;
              }
            }

            if (i > 1) {
              value += "^" + i;
            }

            signs.push(signString);
            coefs.push(value);
          }
        }

        signs[0] = signs[0] === " + " ? "" : "-";
        var result = "";

        for (var _i2 = 0; _i2 < coefs.length; _i2++) {
          result += signs[_i2] + coefs[_i2];
        }

        return result;
      }
      /**
       *  bisection
       *
       *  @param {number} min
       *  @param {number} max
       *  @param {number} [TOLERANCE]
       *  @param {number} [ACCURACY]
       *  @returns {number}
       */

    }, {
      key: "bisection",
      value: function bisection(min, max) {
        var TOLERANCE = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1e-6;
        var ACCURACY = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 15;
        var minValue = this.eval(min);
        var maxValue = this.eval(max);
        var result;

        if (Math.abs(minValue) <= TOLERANCE) {
          result = min;
        } else if (Math.abs(maxValue) <= TOLERANCE) {
          result = max;
        } else if (minValue * maxValue <= 0) {
          var tmp1 = Math.log(max - min);
          var tmp2 = Math.LN10 * ACCURACY;
          var maxIterations = Math.ceil((tmp1 + tmp2) / Math.LN2);

          for (var i = 0; i < maxIterations; i++) {
            result = 0.5 * (min + max);
            var value = this.eval(result);

            if (Math.abs(value) <= TOLERANCE) {
              break;
            }

            if (value * minValue < 0) {
              max = result;
              maxValue = value;
            } else {
              min = result;
              minValue = value;
            }
          }
        }

        return result;
      }
      /**
       *  Based on trapzd in "Numerical Recipes in C, 2nd Edition", page 137
       *
       *  @param {number} min
       *  @param {number} max
       *  @param {number} n
       *  @returns {number}
       */

    }, {
      key: "trapezoid",
      value: function trapezoid(min, max, n) {
        if (isNaN(min) || isNaN(max) || isNaN(n)) {
          throw new TypeError("Parameters must be numbers");
        }

        var range = max - min;

        if (n === 1) {
          var minValue = this.eval(min);
          var maxValue = this.eval(max);
          this._s = 0.5 * range * (minValue + maxValue);
        } else {
          var iter = 1 << n - 2;
          var delta = range / iter;
          var x = min + 0.5 * delta;
          var sum = 0;

          for (var i = 0; i < iter; i++) {
            sum += this.eval(x);
            x += delta;
          }

          this._s = 0.5 * (this._s + range * sum / iter);
        }

        if (isNaN(this._s)) {
          throw new TypeError("this._s is NaN");
        }

        return this._s;
      }
      /**
       *  Based on trapzd in "Numerical Recipes in C, 2nd Edition", page 139
       *
       *  @param {number} min
       *  @param {number} max
       *  @returns {number}
       */

    }, {
      key: "simpson",
      value: function simpson(min, max) {
        if (isNaN(min) || isNaN(max)) {
          throw new TypeError("Parameters must be numbers");
        }

        var range = max - min;
        var st = 0.5 * range * (this.eval(min) + this.eval(max));
        var t = st;
        var s = 4.0 * st / 3.0;
        var os = s;
        var ost = st;
        var TOLERANCE = 1e-7;
        var iter = 1;

        for (var n = 2; n <= 20; n++) {
          var delta = range / iter;
          var x = min + 0.5 * delta;
          var sum = 0;

          for (var i = 1; i <= iter; i++) {
            sum += this.eval(x);
            x += delta;
          }

          t = 0.5 * (t + range * sum / iter);
          st = t;
          s = (4.0 * st - ost) / 3.0;

          if (Math.abs(s - os) < TOLERANCE * Math.abs(os)) {
            break;
          }

          os = s;
          ost = st;
          iter <<= 1;
        }

        return s;
      }
      /**
       *  romberg
       *
       *  @param {number} min
       *  @param {number} max
       *  @returns {number}
       */

    }, {
      key: "romberg",
      value: function romberg(min, max) {
        if (isNaN(min) || isNaN(max)) {
          throw new TypeError("Parameters must be numbers");
        }

        var MAX = 20;
        var K = 3;
        var TOLERANCE = 1e-6;
        var s = new Array(MAX + 1);
        var h = new Array(MAX + 1);
        var result = {
          y: 0,
          dy: 0
        };
        h[0] = 1.0;

        for (var j = 1; j <= MAX; j++) {
          s[j - 1] = this.trapezoid(min, max, j);

          if (j >= K) {
            result = Polynomial.interpolate(h, s, K, j - K, 0.0);

            if (Math.abs(result.dy) <= TOLERANCE * result.y) {
              break;
            }
          }

          s[j] = s[j - 1];
          h[j] = 0.25 * h[j - 1];
        }

        return result.y;
      }
      /**
       *  Estimate what is the maximum polynomial evaluation error value under which polynomial evaluation could be in fact 0.
       *
       *  @param {number} maxAbsX
       *  @returns {number}
       */

    }, {
      key: "zeroErrorEstimate",
      value: function zeroErrorEstimate(maxAbsX) {
        var poly = this;
        var ERRF = 1e-15;

        if (typeof maxAbsX === "undefined") {
          var rb = poly.bounds();
          maxAbsX = Math.max(Math.abs(rb.minX), Math.abs(rb.maxX));
        }

        if (maxAbsX < 0.001) {
          return 2 * Math.abs(poly.eval(ERRF));
        }

        var n = poly.coefs.length - 1;
        var an = poly.coefs[n];
        return 10 * ERRF * poly.coefs.reduce(function (m, v, i) {
          var nm = v / an * Math.pow(maxAbsX, i);
          return nm > m ? nm : m;
        }, 0);
      }
      /**
       *  Calculates upper Real roots bounds. <br/>
       *  Real roots are in interval [negX, posX]. Determined by Fujiwara method.
       *  @see {@link http://en.wikipedia.org/wiki/Properties_of_polynomial_roots}
       *
       *  @returns {{ negX: number, posX: number }}
       */

    }, {
      key: "boundsUpperRealFujiwara",
      value: function boundsUpperRealFujiwara() {
        var a = this.coefs;
        var n = a.length - 1;
        var an = a[n];

        if (an !== 1) {
          a = this.coefs.map(function (v) {
            return v / an;
          });
        }

        var b = a.map(function (v, i) {
          return i < n ? Math.pow(Math.abs(i === 0 ? v / 2 : v), 1 / (n - i)) : v;
        });
        var coefSelectionFunc;

        var find2Max = function find2Max(acc, bi, i) {
          if (coefSelectionFunc(i)) {
            if (acc.max < bi) {
              acc.nearmax = acc.max;
              acc.max = bi;
            } else if (acc.nearmax < bi) {
              acc.nearmax = bi;
            }
          }

          return acc;
        };

        coefSelectionFunc = function coefSelectionFunc(i) {
          return i < n && a[i] < 0;
        }; // eslint-disable-next-line unicorn/no-fn-reference-in-iterator


        var max_nearmax_pos = b.reduce(find2Max, {
          max: 0,
          nearmax: 0
        });

        coefSelectionFunc = function coefSelectionFunc(i) {
          return i < n && (n % 2 === i % 2 ? a[i] < 0 : a[i] > 0);
        }; // eslint-disable-next-line unicorn/no-fn-reference-in-iterator


        var max_nearmax_neg = b.reduce(find2Max, {
          max: 0,
          nearmax: 0
        });
        return {
          negX: -2 * max_nearmax_neg.max,
          posX: 2 * max_nearmax_pos.max
        };
      }
      /**
       *  Calculates lower Real roots bounds. <br/>
       *  There are no Real roots in interval <negX, posX>. Determined by Fujiwara method.
       *  @see {@link http://en.wikipedia.org/wiki/Properties_of_polynomial_roots}
       *
       *  @returns {{ negX: number, posX: number }}
       */

    }, {
      key: "boundsLowerRealFujiwara",
      value: function boundsLowerRealFujiwara() {
        var poly = new Polynomial();
        poly.coefs = this.coefs.slice().reverse();
        var res = poly.boundsUpperRealFujiwara();
        res.negX = 1 / res.negX;
        res.posX = 1 / res.posX;
        return res;
      }
      /**
       *  Calculates left and right Real roots bounds. <br/>
       *  Real roots are in interval [minX, maxX]. Combines Fujiwara lower and upper bounds to get minimal interval.
       *  @see {@link http://en.wikipedia.org/wiki/Properties_of_polynomial_roots}
       *
       *  @returns {{ minX: number, maxX: number }}
      */

    }, {
      key: "bounds",
      value: function bounds() {
        var urb = this.boundsUpperRealFujiwara();
        var rb = {
          minX: urb.negX,
          maxX: urb.posX
        };

        if (urb.negX === 0 && urb.posX === 0) {
          return rb;
        }

        if (urb.negX === 0) {
          rb.minX = this.boundsLowerRealFujiwara().posX;
        } else if (urb.posX === 0) {
          rb.maxX = this.boundsLowerRealFujiwara().negX;
        }

        if (rb.minX > rb.maxX) {
          rb.minX = rb.maxX = 0;
        }

        return rb; // TODO: if sure that there are no complex roots
        // (maybe by using Sturm's theorem) use:
        // return this.boundsRealLaguerre();
      }
      /**
       *  Calculates absolute upper roots bound. <br/>
       *  All (Complex and Real) roots magnitudes are &lt;= result. Determined by Rouche method.
       *  @see {@link http://en.wikipedia.org/wiki/Properties_of_polynomial_roots}
       *
       *  @returns {number}
       */

    }, {
      key: "boundUpperAbsRouche",
      value: function boundUpperAbsRouche() {
        var a = this.coefs;
        var n = a.length - 1;
        var max = a.reduce(function (prev, curr, i) {
          if (i !== n) {
            curr = Math.abs(curr);
            return prev < curr ? curr : prev;
          }

          return prev;
        }, 0);
        return 1 + max / Math.abs(a[n]);
      }
      /**
       *  Calculates absolute lower roots bound. <br/>
       *  All (Complex and Real) roots magnitudes are &gt;= result. Determined by Rouche method.
       *  @see {@link http://en.wikipedia.org/wiki/Properties_of_polynomial_roots}
       *
       *  @returns {number}
       */

    }, {
      key: "boundLowerAbsRouche",
      value: function boundLowerAbsRouche() {
        var a = this.coefs;
        var max = a.reduce(function (prev, curr, i) {
          if (i !== 0) {
            curr = Math.abs(curr);
            return prev < curr ? curr : prev;
          }

          return prev;
        }, 0);
        return Math.abs(a[0]) / (Math.abs(a[0]) + max);
      }
      /**
       *  Calculates left and right Real roots bounds.<br/>
       *  WORKS ONLY if all polynomial roots are Real.
       *  Real roots are in interval [minX, maxX]. Determined by Laguerre method.
       *  @see {@link http://en.wikipedia.org/wiki/Properties_of_polynomial_roots}
       *
       *  @returns {{ minX: number, maxX: number }}
       */

    }, {
      key: "boundsRealLaguerre",
      value: function boundsRealLaguerre() {
        var a = this.coefs;
        var n = a.length - 1;
        var p1 = -a[n - 1] / (n * a[n]);
        var undersqrt = a[n - 1] * a[n - 1] - 2 * n / (n - 1) * a[n] * a[n - 2];
        var p2 = (n - 1) / (n * a[n]) * Math.sqrt(undersqrt);

        if (p2 < 0) {
          p2 = -p2;
        }

        return {
          minX: p1 - p2,
          maxX: p1 + p2
        };
      }
      /**
       *  Root count by Descartes rule of signs. <br/>
       *  Returns maximum number of positive and negative real roots and minimum number of complex roots.
       *  @see {@link http://en.wikipedia.org/wiki/Descartes%27_rule_of_signs}
       *
       *  @returns {{maxRealPos: number, maxRealNeg: number, minComplex: number}}
       */

    }, {
      key: "countRootsDescartes",
      value: function countRootsDescartes() {
        var a = this.coefs;
        var n = a.length - 1;
        var accum = a.reduce(function (acc, ai, i) {
          if (acc.prev_a !== 0 && ai !== 0) {
            if (acc.prev_a < 0 === ai > 0) {
              acc.pos++;
            }

            if (i % 2 === 0 !== acc.prev_a < 0 === (i % 2 === 1 !== ai > 0)) {
              acc.neg++;
            }
          }

          acc.prev_a = ai;
          return acc;
        }, {
          pos: 0,
          neg: 0,
          prev_a: 0
        });
        return {
          maxRealPos: accum.pos,
          maxRealNeg: accum.neg,
          minComplex: n - (accum.pos + accum.neg)
        };
      } // getters and setters

      /**
       *  get degree
       *
       *  @returns {number}
       */

    }, {
      key: "getDegree",
      value: function getDegree() {
        return this.coefs.length - 1;
      }
      /**
       *  getDerivative
       *
       *  @returns {module:kld-polynomial.Polynomial}
       */

    }, {
      key: "getDerivative",
      value: function getDerivative() {
        var derivative = new Polynomial();

        for (var i = 1; i < this.coefs.length; i++) {
          derivative.coefs.push(i * this.coefs[i]);
        }

        return derivative;
      }
      /**
       *  getRoots
       *
       *  @returns {Array<number>}
       */

    }, {
      key: "getRoots",
      value: function getRoots() {
        var result;
        this.simplifyEquals();

        switch (this.getDegree()) {
          case 0:
            result = [];
            break;

          case 1:
            result = this.getLinearRoot();
            break;

          case 2:
            result = this.getQuadraticRoots();
            break;

          case 3:
            result = this.getCubicRoots();
            break;

          case 4:
            result = this.getQuarticRoots();
            break;

          default:
            result = [];
        }

        return result;
      }
      /**
       *  getRootsInInterval
       *
       *  @param {number} min
       *  @param {number} max
       *  @returns {Array<number>}
       */

    }, {
      key: "getRootsInInterval",
      value: function getRootsInInterval(min, max) {
        var roots = [];
        /**
         *  @param {number} value
         */

        function push(value) {
          if (typeof value === "number") {
            roots.push(value);
          }
        }

        if (this.getDegree() === 0) {
          throw new RangeError("Unexpected empty polynomial");
        } else if (this.getDegree() === 1) {
          push(this.bisection(min, max));
        } else {
          // get roots of derivative
          var deriv = this.getDerivative();
          var droots = deriv.getRootsInInterval(min, max);

          if (droots.length > 0) {
            // find root on [min, droots[0]]
            push(this.bisection(min, droots[0])); // find root on [droots[i],droots[i+1]] for 0 <= i <= count-2

            for (var i = 0; i <= droots.length - 2; i++) {
              push(this.bisection(droots[i], droots[i + 1]));
            } // find root on [droots[count-1],xmax]


            push(this.bisection(droots[droots.length - 1], max));
          } else {
            // polynomial is monotone on [min,max], has at most one root
            push(this.bisection(min, max));
          }
        }

        return roots;
      }
      /**
       *  getLinearRoot
       *
       *  @returns {number}
       */

    }, {
      key: "getLinearRoot",
      value: function getLinearRoot() {
        var result = [];
        var a = this.coefs[1];

        if (a !== 0) {
          result.push(-this.coefs[0] / a);
        }

        return result;
      }
      /**
       *  getQuadraticRoots
       *
       *  @returns {Array<number>}
       */

    }, {
      key: "getQuadraticRoots",
      value: function getQuadraticRoots() {
        var results = [];

        if (this.getDegree() === 2) {
          var a = this.coefs[2];
          var b = this.coefs[1] / a;
          var c = this.coefs[0] / a;
          var d = b * b - 4 * c;

          if (d > 0) {
            var e = Math.sqrt(d);
            results.push(0.5 * (-b + e));
            results.push(0.5 * (-b - e));
          } else if (d === 0) {
            // really two roots with same value, but we only return one
            results.push(0.5 * -b);
          } // else imaginary results

        }

        return results;
      }
      /**
       *  getCubicRoots
       *
       *  This code is based on MgcPolynomial.cpp written by David Eberly.  His
       *  code along with many other excellent examples are avaiable at his site:
       *  http://www.geometrictools.com
       *
       *  @returns {Array<number>}
       */

    }, {
      key: "getCubicRoots",
      value: function getCubicRoots() {
        var results = [];

        if (this.getDegree() === 3) {
          var c3 = this.coefs[3];
          var c2 = this.coefs[2] / c3;
          var c1 = this.coefs[1] / c3;
          var c0 = this.coefs[0] / c3;
          var a = (3 * c1 - c2 * c2) / 3;
          var b = (2 * c2 * c2 * c2 - 9 * c1 * c2 + 27 * c0) / 27;
          var offset = c2 / 3;
          var discrim = b * b / 4 + a * a * a / 27;
          var halfB = b / 2;
          var ZEROepsilon = this.zeroErrorEstimate();

          if (Math.abs(discrim) <= ZEROepsilon) {
            discrim = 0;
          }

          if (discrim > 0) {
            var e = Math.sqrt(discrim);
            var root; // eslint-disable-line no-shadow

            var tmp = -halfB + e;

            if (tmp >= 0) {
              root = Math.pow(tmp, 1 / 3);
            } else {
              root = -Math.pow(-tmp, 1 / 3);
            }

            tmp = -halfB - e;

            if (tmp >= 0) {
              root += Math.pow(tmp, 1 / 3);
            } else {
              root -= Math.pow(-tmp, 1 / 3);
            }

            results.push(root - offset);
          } else if (discrim < 0) {
            var distance = Math.sqrt(-a / 3);
            var angle = Math.atan2(Math.sqrt(-discrim), -halfB) / 3;
            var cos = Math.cos(angle);
            var sin = Math.sin(angle);
            var sqrt3 = Math.sqrt(3);
            results.push(2 * distance * cos - offset);
            results.push(-distance * (cos + sqrt3 * sin) - offset);
            results.push(-distance * (cos - sqrt3 * sin) - offset);
          } else {
            var _tmp;

            if (halfB >= 0) {
              _tmp = -Math.pow(halfB, 1 / 3);
            } else {
              _tmp = Math.pow(-halfB, 1 / 3);
            }

            results.push(2 * _tmp - offset); // really should return next root twice, but we return only one

            results.push(-_tmp - offset);
          }
        }

        return results;
      }
      /**
       *  Calculates roots of quartic polynomial. <br/>
       *  First, derivative roots are found, then used to split quartic polynomial
       *  into segments, each containing one root of quartic polynomial.
       *  Segments are then passed to newton's method to find roots.
       *
       *  @returns {Array<number>} roots
       */

    }, {
      key: "getQuarticRoots",
      value: function getQuarticRoots() {
        var results = [];
        var n = this.getDegree();

        if (n === 4) {
          var poly = new Polynomial();
          poly.coefs = this.coefs.slice();
          poly.divideEqualsScalar(poly.coefs[n]);
          var ERRF = 1e-15;

          if (Math.abs(poly.coefs[0]) < 10 * ERRF * Math.abs(poly.coefs[3])) {
            poly.coefs[0] = 0;
          }

          var poly_d = poly.getDerivative();
          var derrt = poly_d.getRoots().sort(function (a, b) {
            return a - b;
          });
          var dery = [];
          var nr = derrt.length - 1;
          var rb = this.bounds();
          var maxabsX = Math.max(Math.abs(rb.minX), Math.abs(rb.maxX));
          var ZEROepsilon = this.zeroErrorEstimate(maxabsX);

          for (var _i3 = 0; _i3 <= nr; _i3++) {
            dery.push(poly.eval(derrt[_i3]));
          }

          for (var _i4 = 0; _i4 <= nr; _i4++) {
            if (Math.abs(dery[_i4]) < ZEROepsilon) {
              dery[_i4] = 0;
            }
          }

          var i = 0;
          var dx = Math.max(0.1 * (rb.maxX - rb.minX) / n, ERRF);
          var guesses = [];
          var minmax = [];

          if (nr > -1) {
            if (dery[0] !== 0) {
              if (sign(dery[0]) !== sign(poly.eval(derrt[0] - dx) - dery[0])) {
                guesses.push(derrt[0] - dx);
                minmax.push([rb.minX, derrt[0]]);
              }
            } else {
              results.push(derrt[0], derrt[0]);
              i++;
            }

            for (; i < nr; i++) {
              if (dery[i + 1] === 0) {
                results.push(derrt[i + 1], derrt[i + 1]);
                i++;
              } else if (sign(dery[i]) !== sign(dery[i + 1])) {
                guesses.push((derrt[i] + derrt[i + 1]) / 2);
                minmax.push([derrt[i], derrt[i + 1]]);
              }
            }

            if (dery[nr] !== 0 && sign(dery[nr]) !== sign(poly.eval(derrt[nr] + dx) - dery[nr])) {
              guesses.push(derrt[nr] + dx);
              minmax.push([derrt[nr], rb.maxX]);
            }
          }
          /**
           *  @param {number} x
           *  @returns {number}
           */


          var f = function f(x) {
            return poly.eval(x);
          };
          /**
           *  @param {number} x
           *  @returns {number}
           */


          var df = function df(x) {
            return poly_d.eval(x);
          };

          if (guesses.length > 0) {
            for (i = 0; i < guesses.length; i++) {
              guesses[i] = Polynomial.newtonSecantBisection(guesses[i], f, df, 32, minmax[i][0], minmax[i][1]);
            }
          }

          results = results.concat(guesses);
        }

        return results;
      }
    }], [{
      key: "interpolate",
      value: function interpolate(xs, ys, n, offset, x) {
        if (xs.constructor !== Array || ys.constructor !== Array) {
          throw new TypeError("xs and ys must be arrays");
        }

        if (isNaN(n) || isNaN(offset) || isNaN(x)) {
          throw new TypeError("n, offset, and x must be numbers");
        }

        var i, y;
        var dy = 0;
        var c = new Array(n);
        var d = new Array(n);
        var ns = 0;
        var diff = Math.abs(x - xs[offset]);

        for (i = 0; i < n; i++) {
          var dift = Math.abs(x - xs[offset + i]);

          if (dift < diff) {
            ns = i;
            diff = dift;
          }

          c[i] = d[i] = ys[offset + i];
        }

        y = ys[offset + ns];
        ns--;

        for (var m = 1; m < n; m++) {
          for (i = 0; i < n - m; i++) {
            var ho = xs[offset + i] - x;
            var hp = xs[offset + i + m] - x;
            var w = c[i + 1] - d[i];
            var den = ho - hp;

            if (den === 0.0) {
              throw new RangeError("Unable to interpolate polynomial. Two numbers in n were identical (to within roundoff)");
            }

            den = w / den;
            d[i] = hp * den;
            c[i] = ho * den;
          }

          dy = 2 * (ns + 1) < n - m ? c[ns + 1] : d[ns--];
          y += dy;
        }

        return {
          y: y,
          dy: dy
        };
      }
      /**
       *  Newton's (Newton-Raphson) method for finding Real roots on univariate function. <br/>
       *  When using bounds, algorithm falls back to secant if newton goes out of range.
       *  Bisection is fallback for secant when determined secant is not efficient enough.
       *  @see {@link http://en.wikipedia.org/wiki/Newton%27s_method}
       *  @see {@link http://en.wikipedia.org/wiki/Secant_method}
       *  @see {@link http://en.wikipedia.org/wiki/Bisection_method}
       *
       *  @param {number} x0 - Initial root guess
       *  @param {Function} f - Function which root we are trying to find
       *  @param {Function} df - Derivative of function f
       *  @param {number} max_iterations - Maximum number of algorithm iterations
       *  @param {number} [min] - Left bound value
       *  @param {number} [max] - Right bound value
       *  @returns {number} root
       */

    }, {
      key: "newtonSecantBisection",
      value: function newtonSecantBisection(x0, f, df, max_iterations, min, max) {
        var x,
            prev_dfx = 0,
            dfx,
            prev_x_ef_correction = 0,
            x_correction,
            x_new;
        var y, y_atmin, y_atmax;
        x = x0;
        var ACCURACY = 14;
        var min_correction_factor = Math.pow(10, -ACCURACY);
        var isBounded = typeof min === "number" && typeof max === "number";

        if (isBounded) {
          if (min > max) {
            throw new RangeError("Min must be greater than max");
          }

          y_atmin = f(min);
          y_atmax = f(max);

          if (sign(y_atmin) === sign(y_atmax)) {
            throw new RangeError("Y values of bounds must be of opposite sign");
          }
        }

        var isEnoughCorrection = function isEnoughCorrection() {
          // stop if correction is too small or if correction is in simple loop
          return Math.abs(x_correction) <= min_correction_factor * Math.abs(x) || prev_x_ef_correction === x - x_correction - x;
        };

        for (var i = 0; i < max_iterations; i++) {
          dfx = df(x);

          if (dfx === 0) {
            if (prev_dfx === 0) {
              // error
              throw new RangeError("df(x) is zero");
            } else {
              // use previous derivation value
              dfx = prev_dfx;
            } // or move x a little?
            // dfx = df(x != 0 ? x + x * 1e-15 : 1e-15);

          }

          prev_dfx = dfx;
          y = f(x);
          x_correction = y / dfx;
          x_new = x - x_correction;

          if (isEnoughCorrection()) {
            break;
          }

          if (isBounded) {
            if (sign(y) === sign(y_atmax)) {
              max = x;
              y_atmax = y;
            } else if (sign(y) === sign(y_atmin)) {
              min = x;
              y_atmin = y;
            } else {
              x = x_new;
              break;
            }

            if (x_new < min || x_new > max) {
              if (sign(y_atmin) === sign(y_atmax)) {
                break;
              }

              var RATIO_LIMIT = 50;
              var AIMED_BISECT_OFFSET = 0.25; // [0, 0.5)

              var dy = y_atmax - y_atmin;
              var dx = max - min;

              if (dy === 0) {
                x_correction = x - (min + dx * 0.5);
              } else if (Math.abs(dy / Math.min(y_atmin, y_atmax)) > RATIO_LIMIT) {
                x_correction = x - (min + dx * (0.5 + (Math.abs(y_atmin) < Math.abs(y_atmax) ? -AIMED_BISECT_OFFSET : AIMED_BISECT_OFFSET)));
              } else {
                x_correction = x - (min - y_atmin / dy * dx);
              }

              x_new = x - x_correction;

              if (isEnoughCorrection()) {
                break;
              }
            }
          }

          prev_x_ef_correction = x - x_new;
          x = x_new;
        }

        return x;
      }
    }]);

    return Polynomial;
  }();

  /**
   *  PathLexeme.js
   *
   *  @copyright 2002, 2013 Kevin Lindsey
   *  @module PathLexeme
   */

  /**
   *  PathLexeme
   */
  var PathLexeme = /*#__PURE__*/function () {
    /**
     *  PathLexeme
     *
     *  @param {number} type
     *  @param {string} text
     */
    function PathLexeme(type, text) {
      _classCallCheck(this, PathLexeme);

      this.type = type;
      this.text = text;
    }
    /**
     *  Determine if this lexeme is of the given type
     *
     *  @param {number} type
     *  @returns {boolean}
     */


    _createClass(PathLexeme, [{
      key: "typeis",
      value: function typeis(type) {
        return this.type === type;
      }
    }]);

    return PathLexeme;
  }();
  /*
   * token type enumerations
   */


  PathLexeme.UNDEFINED = 0;
  PathLexeme.COMMAND = 1;
  PathLexeme.NUMBER = 2;
  PathLexeme.EOD = 3;

  /**
   *  Create a new instance of PathLexer
   */

  var PathLexer = /*#__PURE__*/function () {
    /**
     *  @param {string} [pathData]
     */
    function PathLexer(pathData) {
      _classCallCheck(this, PathLexer);

      if (pathData === null || pathData === undefined) {
        pathData = "";
      }

      this.setPathData(pathData);
    }
    /**
     *  setPathData
     *
     *  @param {string} pathData
     */


    _createClass(PathLexer, [{
      key: "setPathData",
      value: function setPathData(pathData) {
        if (typeof pathData !== "string") {
          throw new TypeError("The first parameter must be a string");
        }

        this._pathData = pathData;
      }
      /**
       *  getNextToken
       *
       *  @returns {PathLexeme}
       */

    }, {
      key: "getNextToken",
      value: function getNextToken() {
        var result = null;
        var d = this._pathData;

        while (result === null) {
          if (d === null || d === "") {
            result = new PathLexeme(PathLexeme.EOD, "");
          } else if (d.match(/^([ \t\r\n,]+)/)) {
            d = d.substr(RegExp.$1.length);
          } else if (d.match(/^([AaCcHhLlMmQqSsTtVvZz])/)) {
            result = new PathLexeme(PathLexeme.COMMAND, RegExp.$1);
            d = d.substr(RegExp.$1.length);
          }
          /* eslint-disable-next-line unicorn/no-unsafe-regex */
          else if (d.match(/^(([-+]?\d+(\.\d*)?|[-+]?\.\d+)([eE][-+]?\d+)?)/)) {
              result = new PathLexeme(PathLexeme.NUMBER, RegExp.$1);
              d = d.substr(RegExp.$1.length);
            } else {
              throw new SyntaxError("Unrecognized path data: ".concat(d));
            }
        }

        this._pathData = d;
        return result;
      }
    }]);

    return PathLexer;
  }();

  var BOP = "BOP";
  /**
   *  PathParser
   */

  var PathParser = /*#__PURE__*/function () {
    /**
     * constructor
     */
    function PathParser() {
      _classCallCheck(this, PathParser);

      this._lexer = new PathLexer();
      this._handler = null;
    }
    /**
     *  parseData
     *
     *  @param {string} pathData
     *  @throws {Error}
     */


    _createClass(PathParser, [{
      key: "parseData",
      value: function parseData(pathData) {
        if (typeof pathData !== "string") {
          throw new TypeError("The first parameter must be a string: ".concat(pathData));
        } // begin parse


        if (this._handler !== null && typeof this._handler.beginParse === "function") {
          this._handler.beginParse();
        } // pass the pathData to the lexer


        var lexer = this._lexer;
        lexer.setPathData(pathData); // set mode to signify new path - Beginning Of Path

        var mode = BOP; // Process all tokens

        var lastToken = null;
        var token = lexer.getNextToken();

        while (token.typeis(PathLexeme.EOD) === false) {
          var parameterCount = void 0;
          var params = []; // process current token

          switch (token.type) {
            case PathLexeme.COMMAND:
              if (mode === BOP && token.text !== "M" && token.text !== "m") {
                throw new SyntaxError("New paths must begin with a moveto command. Found '".concat(token.text, "'"));
              } // Set new parsing mode


              mode = token.text; // Get count of numbers that must follow this command

              parameterCount = PathParser.PARAMCOUNT[token.text.toUpperCase()]; // Advance past command token

              token = lexer.getNextToken();
              break;

            case PathLexeme.NUMBER:
              // Most commands allow you to keep repeating parameters
              // without specifying the command again.  We just assume
              // that is the case and do nothing since the mode remains
              // the same
              if (mode === BOP) {
                throw new SyntaxError("New paths must begin with a moveto command. Found '".concat(token.text, "'"));
              } else {
                parameterCount = PathParser.PARAMCOUNT[mode.toUpperCase()];
              }

              break;

            default:
              throw new SyntaxError("Unrecognized command type: ".concat(token.type));
          } // Get parameters


          for (var i = 0; i < parameterCount; i++) {
            switch (token.type) {
              case PathLexeme.COMMAND:
                throw new SyntaxError("Parameter must be a number. Found '".concat(token.text, "'"));

              case PathLexeme.NUMBER:
                // convert current parameter to a float and add to
                // parameter list
                params[i] = parseFloat(token.text);
                break;

              case PathLexeme.EOD:
                throw new SyntaxError("Unexpected end of string");

              default:
                throw new SyntaxError("Unrecognized parameter type. Found type '".concat(token.type, "'"));
            }

            token = lexer.getNextToken();
          } // fire handler


          if (this._handler !== null) {
            var handler = this._handler;
            var methodName = PathParser.METHODNAME[mode]; // convert types for arcs

            if (mode === "a" || mode === "A") {
              params[3] = params[3] !== 0;
              params[4] = params[4] !== 0;
            }

            if (handler !== null && typeof handler[methodName] === "function") {
              handler[methodName].apply(handler, params);
            }
          } // Lineto's follow moveto when no command follows moveto params.  Go
          // ahead and set the mode just in case no command follows the moveto
          // command


          switch (mode) {
            case "M":
              mode = "L";
              break;

            case "m":
              mode = "l";
              break;

            case "Z":
            case "z":
              mode = "BOP";
              break;

          }

          if (token === lastToken) {
            throw new SyntaxError("Parser stalled on '".concat(token.text, "'"));
          } else {
            lastToken = token;
          }
        } // end parse


        if (this._handler !== null && typeof this._handler.endParse === "function") {
          this._handler.endParse();
        }
      }
      /**
       *  setHandler
       *
       *  @param {Object} handler
       */

    }, {
      key: "setHandler",
      value: function setHandler(handler) {
        this._handler = handler;
      }
    }]);

    return PathParser;
  }();
  /*
   * class constants
   */


  PathParser.PARAMCOUNT = {
    A: 7,
    C: 6,
    H: 1,
    L: 2,
    M: 2,
    Q: 4,
    S: 4,
    T: 2,
    V: 1,
    Z: 0
  };
  PathParser.METHODNAME = {
    A: "arcAbs",
    a: "arcRel",
    C: "curvetoCubicAbs",
    c: "curvetoCubicRel",
    H: "linetoHorizontalAbs",
    h: "linetoHorizontalRel",
    L: "linetoAbs",
    l: "linetoRel",
    M: "movetoAbs",
    m: "movetoRel",
    Q: "curvetoQuadraticAbs",
    q: "curvetoQuadraticRel",
    S: "curvetoCubicSmoothAbs",
    s: "curvetoCubicSmoothRel",
    T: "curvetoQuadraticSmoothAbs",
    t: "curvetoQuadraticSmoothRel",
    V: "linetoVerticalAbs",
    v: "linetoVerticalRel",
    Z: "closePath",
    z: "closePath"
  };

  var TWO_PI = 2.0 * Math.PI;
  /**
   * Based on the SVG 1.1 specification, Appendix F: Implementation Requirements,
   * Section F.6 "Elliptical arc implementation notes"
   * {@see https://www.w3.org/TR/SVG11/implnote.html#ArcImplementationNotes}
   *
   * @param {module:kld-affine.Point2D} startPoint
   * @param {module:kld-affine.Point2D} endPoint
   * @param {number} rx
   * @param {number} ry
   * @param {number} angle
   * @param {boolean} arcFlag
   * @param {boolean} sweepFlag
   * @returns {Array}
   */

  function getArcParameters(startPoint, endPoint, rx, ry, angle, arcFlag, sweepFlag) {
    angle = angle * Math.PI / 180;
    var c = Math.cos(angle);
    var s = Math.sin(angle);
    var TOLERANCE = 1e-6; // Section (F.6.5.1)

    var halfDiff = startPoint.subtract(endPoint).multiply(0.5);
    var x1p = halfDiff.x * c + halfDiff.y * s;
    var y1p = halfDiff.x * -s + halfDiff.y * c; // Section (F.6.6.1)

    rx = Math.abs(rx);
    ry = Math.abs(ry); // Section (F.6.6.2)

    var x1px1p = x1p * x1p;
    var y1py1p = y1p * y1p;
    var lambda = x1px1p / (rx * rx) + y1py1p / (ry * ry); // Section (F.6.6.3)

    if (lambda > 1) {
      var _factor = Math.sqrt(lambda);

      rx *= _factor;
      ry *= _factor;
    } // Section (F.6.5.2)


    var rxrx = rx * rx;
    var ryry = ry * ry;
    var rxy1 = rxrx * y1py1p;
    var ryx1 = ryry * x1px1p;
    var factor = (rxrx * ryry - rxy1 - ryx1) / (rxy1 + ryx1);

    if (Math.abs(factor) < TOLERANCE) {
      factor = 0;
    }

    var sq = Math.sqrt(factor);

    if (arcFlag === sweepFlag) {
      sq = -sq;
    } // Section (F.6.5.3)


    var mid = startPoint.add(endPoint).multiply(0.5);
    var cxp = sq * rx * y1p / ry;
    var cyp = sq * -ry * x1p / rx; // Section (F.6.5.5 - F.6.5.6)

    var xcr1 = (x1p - cxp) / rx;
    var xcr2 = (x1p + cxp) / rx;
    var ycr1 = (y1p - cyp) / ry;
    var ycr2 = (y1p + cyp) / ry;
    var theta1 = new Vector2D(1, 0).angleBetween(new Vector2D(xcr1, ycr1)); // let deltaTheta = normalizeAngle(new Vector2D(xcr1, ycr1).angleBetween(new Vector2D(-xcr2, -ycr2)));

    var deltaTheta = new Vector2D(xcr1, ycr1).angleBetween(new Vector2D(-xcr2, -ycr2));

    if (sweepFlag === false) {
      deltaTheta -= TWO_PI;
    }

    return [cxp * c - cyp * s + mid.x, cxp * s + cyp * c + mid.y, rx, ry, theta1, theta1 + deltaTheta];
  }
  /**
   *  PathHandler
   */


  var PathHandler = /*#__PURE__*/function () {
    /**
     * PathHandler
     *
     * @param {ShapeInfo} shapeCreator
     */
    function PathHandler(shapeCreator) {
      _classCallCheck(this, PathHandler);

      this.shapeCreator = shapeCreator;
      this.shapes = [];
      this.firstX = null;
      this.firstY = null;
      this.lastX = null;
      this.lastY = null;
      this.lastCommand = null;
    }
    /**
     * beginParse
     */


    _createClass(PathHandler, [{
      key: "beginParse",
      value: function beginParse() {
        // zero out the sub-path array
        this.shapes = []; // clear firstX, firstY, lastX, and lastY

        this.firstX = null;
        this.firstY = null;
        this.lastX = null;
        this.lastY = null; // need to remember last command type to determine how to handle the
        // relative Bezier commands

        this.lastCommand = null;
      }
      /**
       *  addShape
       *
       *  @param {ShapeInfo} shape
       */

    }, {
      key: "addShape",
      value: function addShape(shape) {
        this.shapes.push(shape);
      }
      /**
       *  arcAbs - A
       *
       *  @param {number} rx
       *  @param {number} ry
       *  @param {number} xAxisRotation
       *  @param {boolean} arcFlag
       *  @param {boolean} sweepFlag
       *  @param {number} x
       *  @param {number} y
       */

    }, {
      key: "arcAbs",
      value: function arcAbs(rx, ry, xAxisRotation, arcFlag, sweepFlag, x, y) {
        if (rx === 0 || ry === 0) {
          this.addShape(this.shapeCreator.line(this.lastX, this.lastY, x, y));
        } else {
          var _this$shapeCreator;

          var arcParameters = getArcParameters(new Point2D(this.lastX, this.lastY), new Point2D(x, y), rx, ry, xAxisRotation, arcFlag, sweepFlag);
          this.addShape((_this$shapeCreator = this.shapeCreator).arc.apply(_this$shapeCreator, _toConsumableArray(arcParameters)));
        }

        this.lastCommand = "A";
        this.lastX = x;
        this.lastY = y;
      }
      /**
       *  arcRel - a
       *
       *  @param {number} rx
       *  @param {number} ry
       *  @param {number} xAxisRotation
       *  @param {boolean} arcFlag
       *  @param {boolean} sweepFlag
       *  @param {number} x
       *  @param {number} y
       */

    }, {
      key: "arcRel",
      value: function arcRel(rx, ry, xAxisRotation, arcFlag, sweepFlag, x, y) {
        if (rx === 0 || ry === 0) {
          this.addShape(this.shapeCreator.line(this.lastX, this.lastY, this.lastX + x, this.lastY + y));
        } else {
          var _this$shapeCreator2;

          var arcParameters = getArcParameters(new Point2D(this.lastX, this.lastY), new Point2D(this.lastX + x, this.lastY + y), rx, ry, xAxisRotation, arcFlag, sweepFlag);
          this.addShape((_this$shapeCreator2 = this.shapeCreator).arc.apply(_this$shapeCreator2, _toConsumableArray(arcParameters)));
        }

        this.lastCommand = "a";
        this.lastX += x;
        this.lastY += y;
      }
      /**
       *  curvetoCubicAbs - C
       *
       *  @param {number} x1
       *  @param {number} y1
       *  @param {number} x2
       *  @param {number} y2
       *  @param {number} x
       *  @param {number} y
       */

    }, {
      key: "curvetoCubicAbs",
      value: function curvetoCubicAbs(x1, y1, x2, y2, x, y) {
        this.addShape(this.shapeCreator.cubicBezier(this.lastX, this.lastY, x1, y1, x2, y2, x, y));
        this.lastX = x;
        this.lastY = y;
        this.lastCommand = "C";
      }
      /**
       *  curvetoCubicRel - c
       *
       *  @param {number} x1
       *  @param {number} y1
       *  @param {number} x2
       *  @param {number} y2
       *  @param {number} x
       *  @param {number} y
       */

    }, {
      key: "curvetoCubicRel",
      value: function curvetoCubicRel(x1, y1, x2, y2, x, y) {
        this.addShape(this.shapeCreator.cubicBezier(this.lastX, this.lastY, this.lastX + x1, this.lastY + y1, this.lastX + x2, this.lastY + y2, this.lastX + x, this.lastY + y));
        this.lastX += x;
        this.lastY += y;
        this.lastCommand = "c";
      }
      /**
       *  linetoHorizontalAbs - H
       *
       *  @param {number} x
       */

    }, {
      key: "linetoHorizontalAbs",
      value: function linetoHorizontalAbs(x) {
        this.addShape(this.shapeCreator.line(this.lastX, this.lastY, x, this.lastY));
        this.lastX = x;
        this.lastCommand = "H";
      }
      /**
       *  linetoHorizontalRel - h
       *
       *  @param {number} x
       */

    }, {
      key: "linetoHorizontalRel",
      value: function linetoHorizontalRel(x) {
        this.addShape(this.shapeCreator.line(this.lastX, this.lastY, this.lastX + x, this.lastY));
        this.lastX += x;
        this.lastCommand = "h";
      }
      /**
       *  linetoAbs - L
       *
       *  @param {number} x
       *  @param {number} y
       */

    }, {
      key: "linetoAbs",
      value: function linetoAbs(x, y) {
        this.addShape(this.shapeCreator.line(this.lastX, this.lastY, x, y));
        this.lastX = x;
        this.lastY = y;
        this.lastCommand = "L";
      }
      /**
       *  linetoRel - l
       *
       *  @param {number} x
       *  @param {number} y
       */

    }, {
      key: "linetoRel",
      value: function linetoRel(x, y) {
        this.addShape(this.shapeCreator.line(this.lastX, this.lastY, this.lastX + x, this.lastY + y));
        this.lastX += x;
        this.lastY += y;
        this.lastCommand = "l";
      }
      /**
       *  movetoAbs - M
       *
       *  @param {number} x
       *  @param {number} y
       */

    }, {
      key: "movetoAbs",
      value: function movetoAbs(x, y) {
        this.firstX = x;
        this.firstY = y;
        this.lastX = x;
        this.lastY = y;
        this.lastCommand = "M";
      }
      /**
       *  movetoRel - m
       *
       *  @param {number} x
       *  @param {number} y
       */

    }, {
      key: "movetoRel",
      value: function movetoRel(x, y) {
        this.firstX += x;
        this.firstY += y;
        this.lastX += x;
        this.lastY += y;
        this.lastCommand = "m";
      }
      /**
       *  curvetoQuadraticAbs - Q
       *
       *  @param {number} x1
       *  @param {number} y1
       *  @param {number} x
       *  @param {number} y
       */

    }, {
      key: "curvetoQuadraticAbs",
      value: function curvetoQuadraticAbs(x1, y1, x, y) {
        this.addShape(this.shapeCreator.quadraticBezier(this.lastX, this.lastY, x1, y1, x, y));
        this.lastX = x;
        this.lastY = y;
        this.lastCommand = "Q";
      }
      /**
       *  curvetoQuadraticRel - q
       *
       *  @param {number} x1
       *  @param {number} y1
       *  @param {number} x
       *  @param {number} y
       */

    }, {
      key: "curvetoQuadraticRel",
      value: function curvetoQuadraticRel(x1, y1, x, y) {
        this.addShape(this.shapeCreator.quadraticBezier(this.lastX, this.lastY, this.lastX + x1, this.lastY + y1, this.lastX + x, this.lastY + y));
        this.lastX += x;
        this.lastY += y;
        this.lastCommand = "q";
      }
      /**
       *  curvetoCubicSmoothAbs - S
       *
       *  @param {number} x2
       *  @param {number} y2
       *  @param {number} x
       *  @param {number} y
       */

    }, {
      key: "curvetoCubicSmoothAbs",
      value: function curvetoCubicSmoothAbs(x2, y2, x, y) {
        var controlX, controlY;

        if (this.lastCommand.match(/^[SsCc]$/)) {
          var secondToLast = this.shapes[this.shapes.length - 1].args[2];
          controlX = 2 * this.lastX - secondToLast.x;
          controlY = 2 * this.lastY - secondToLast.y;
        } else {
          controlX = this.lastX;
          controlY = this.lastY;
        }

        this.addShape(this.shapeCreator.cubicBezier(this.lastX, this.lastY, controlX, controlY, x2, y2, x, y));
        this.lastX = x;
        this.lastY = y;
        this.lastCommand = "S";
      }
      /**
       *  curvetoCubicSmoothRel - s
       *
       *  @param {number} x2
       *  @param {number} y2
       *  @param {number} x
       *  @param {number} y
       */

    }, {
      key: "curvetoCubicSmoothRel",
      value: function curvetoCubicSmoothRel(x2, y2, x, y) {
        var controlX, controlY;

        if (this.lastCommand.match(/^[SsCc]$/)) {
          var secondToLast = this.shapes[this.shapes.length - 1].args[2];
          controlX = 2 * this.lastX - secondToLast.x;
          controlY = 2 * this.lastY - secondToLast.y;
        } else {
          controlX = this.lastX;
          controlY = this.lastY;
        }

        this.addShape(this.shapeCreator.cubicBezier(this.lastX, this.lastY, controlX, controlY, this.lastX + x2, this.lastY + y2, this.lastX + x, this.lastY + y));
        this.lastX += x;
        this.lastY += y;
        this.lastCommand = "s";
      }
      /**
       *  curvetoQuadraticSmoothAbs - T
       *
       *  @param {number} x
       *  @param {number} y
       */

    }, {
      key: "curvetoQuadraticSmoothAbs",
      value: function curvetoQuadraticSmoothAbs(x, y) {
        var controlX, controlY;

        if (this.lastCommand.match(/^[QqTt]$/)) {
          var secondToLast = this.shapes[this.shapes.length - 1].args[1];
          controlX = 2 * this.lastX - secondToLast.x;
          controlY = 2 * this.lastY - secondToLast.y;
        } else {
          controlX = this.lastX;
          controlY = this.lastY;
        }

        this.addShape(this.shapeCreator.quadraticBezier(this.lastX, this.lastY, controlX, controlY, x, y));
        this.lastX = x;
        this.lastY = y;
        this.lastCommand = "T";
      }
      /**
       *  curvetoQuadraticSmoothRel - t
       *
       *  @param {number} x
       *  @param {number} y
       */

    }, {
      key: "curvetoQuadraticSmoothRel",
      value: function curvetoQuadraticSmoothRel(x, y) {
        var controlX, controlY;

        if (this.lastCommand.match(/^[QqTt]$/)) {
          var secondToLast = this.shapes[this.shapes.length - 1].args[1];
          controlX = 2 * this.lastX - secondToLast.x;
          controlY = 2 * this.lastY - secondToLast.y;
        } else {
          controlX = this.lastX;
          controlY = this.lastY;
        }

        this.addShape(this.shapeCreator.quadraticBezier(this.lastX, this.lastY, controlX, controlY, this.lastX + x, this.lastY + y));
        this.lastX += x;
        this.lastY += y;
        this.lastCommand = "t";
      }
      /**
       *  linetoVerticalAbs - V
       *
       *  @param {number} y
       */

    }, {
      key: "linetoVerticalAbs",
      value: function linetoVerticalAbs(y) {
        this.addShape(this.shapeCreator.line(this.lastX, this.lastY, this.lastX, y));
        this.lastY = y;
        this.lastCommand = "V";
      }
      /**
       *  linetoVerticalRel - v
       *
       *  @param {number} y
       */

    }, {
      key: "linetoVerticalRel",
      value: function linetoVerticalRel(y) {
        this.addShape(this.shapeCreator.line(this.lastX, this.lastY, this.lastX, this.lastY + y));
        this.lastY += y;
        this.lastCommand = "v";
      }
      /**
       *  closePath - z or Z
       */

    }, {
      key: "closePath",
      value: function closePath() {
        this.addShape(this.shapeCreator.line(this.lastX, this.lastY, this.firstX, this.firstY));
        this.lastX = this.firstX;
        this.lastY = this.firstY;
        this.lastCommand = "z";
      }
    }]);

    return PathHandler;
  }();

  var degree90 = Math.PI * 0.5;
  var parser = new PathParser();
  /**
   * getValues
   *
   * @param {Array} types
   * @param {Array} args
   * @returns {Array}
   */

  function getValues(types, args) {
    var result = [];

    var _iterator = _createForOfIteratorHelper(types),
        _step;

    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var _step$value = _slicedToArray(_step.value, 2),
            names = _step$value[0],
            type = _step$value[1];

        var value = null;

        if (type === "Point2D") {
          value = parsePoint(names, args);
        } else if (type === "Number") {
          value = parseNumber(names, args);
        } else if (type === "Array<Point2D>" || type === "Point2D[]") {
          var values = [];

          while (args.length > 0) {
            values.push(parsePoint(names, args));
          }

          if (values.length > 0) {
            value = values;
          }
        } else if (type === "Optional<Number>" || type === "Number?") {
          value = parseNumber(names, args);

          if (value === null) {
            value = undefined;
          }
        } else {
          throw new TypeError("Unrecognized value type: ".concat(type));
        }

        if (value !== null) {
          result.push(value);
        } else {
          throw new TypeError("Unable to extract value for ".concat(names));
        }
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }

    return result;
  }
  /**
   * parseNumber
   *
   * @param {Array} names
   * @param {Array} args
   * @returns {number}
   */

  function parseNumber(names, args) {
    var result = null;

    if (args.length > 0) {
      var item = args[0];

      var itemType = _typeof(item);

      if (itemType === "number") {
        return args.shift();
      } else if (itemType === "object") {
        var _iterator2 = _createForOfIteratorHelper(names),
            _step2;

        try {
          for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
            var prop = _step2.value;

            if (prop in item && typeof item[prop] === "number") {
              result = item[prop];
              break;
            }
          }
        } catch (err) {
          _iterator2.e(err);
        } finally {
          _iterator2.f();
        }
      }
    }

    return result;
  }
  /**
   * parsePoint
   *
   * @param {Array} names
   * @param {Array} args
   * @returns {Array}
   */

  function parsePoint(names, args) {
    var result = null;

    if (args.length > 0) {
      (function () {
        var item = args[0];

        var itemType = _typeof(item);

        if (itemType === "number") {
          if (args.length > 1) {
            var x = args.shift();
            var y = args.shift();
            result = new Point2D(x, y);
          }
        } else if (Array.isArray(item) && item.length > 1) {
          if (item.length === 2) {
            var _args$shift = args.shift(),
                _args$shift2 = _slicedToArray(_args$shift, 2),
                _x = _args$shift2[0],
                _y = _args$shift2[1];

            result = new Point2D(_x, _y);
          } else {
            throw new TypeError("Unhandled array of length ".concat(item.length));
          }
        } else if (itemType === "object") {
          if ("x" in item && "y" in item) {
            result = new Point2D(item.x, item.y);
            args.shift();
          } else {
            var _iterator3 = _createForOfIteratorHelper(names),
                _step3;

            try {
              for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
                var props = _step3.value;

                if (Array.isArray(props)) {
                  if (props.every(function (p) {
                    return p in item;
                  })) {
                    result = new Point2D(item[props[0]], item[props[1]]);
                    break;
                  }
                } else if (props in item) {
                  result = parsePoint([], [item[props]]);
                  break;
                }
              }
            } catch (err) {
              _iterator3.e(err);
            } finally {
              _iterator3.f();
            }
          }
        }
      })();
    }

    return result;
  }
  /**
   *  ShapeInfo
   *  @memberof module:kld-intersections
   */

  var ShapeInfo = /*#__PURE__*/function () {
    /**
     *  @param {string} name
     *  @param {Array} args
     *  @returns {module:kld-intersections.ShapeInfo}
     */
    function ShapeInfo(name, args) {
      _classCallCheck(this, ShapeInfo);

      this.name = name;
      this.args = args;
    }

    _createClass(ShapeInfo, null, [{
      key: "arc",
      value: function arc() {
        var types = [[["center", ["centerX", "centerY"], ["cx", "cy"]], "Point2D"], [["radiusX", "rx"], "Number"], [["radiusY", "ry"], "Number"], [["startRadians"], "Number"], [["endRadians"], "Number"]];

        for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }

        var values = getValues(types, args);
        return new ShapeInfo(ShapeInfo.ARC, values);
      }
    }, {
      key: "quadraticBezier",
      value: function quadraticBezier() {
        var types = [[["p1", ["p1x", "p1y"]], "Point2D"], [["p2", ["p2x", "p2y"]], "Point2D"], [["p3", ["p3x", "p3y"]], "Point2D"]];

        for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
          args[_key2] = arguments[_key2];
        }

        var values = getValues(types, args);
        return new ShapeInfo(ShapeInfo.QUADRATIC_BEZIER, values);
      }
    }, {
      key: "cubicBezier",
      value: function cubicBezier() {
        var types = [[["p1", ["p1x", "p1y"]], "Point2D"], [["p2", ["p2x", "p2y"]], "Point2D"], [["p3", ["p3x", "p3y"]], "Point2D"], [["p4", ["p4x", "p4y"]], "Point2D"]];

        for (var _len3 = arguments.length, args = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
          args[_key3] = arguments[_key3];
        }

        var values = getValues(types, args);
        return new ShapeInfo(ShapeInfo.CUBIC_BEZIER, values);
      }
    }, {
      key: "circle",
      value: function circle() {
        var types = [[["center", ["centerX", "centerY"], ["cx", "cy"]], "Point2D"], [["radius", "r"], "Number"]];

        for (var _len4 = arguments.length, args = new Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
          args[_key4] = arguments[_key4];
        }

        var values = getValues(types, args);
        return new ShapeInfo(ShapeInfo.CIRCLE, values);
      }
    }, {
      key: "ellipse",
      value: function ellipse() {
        var types = [[["center", ["centerX", "centerY"], ["cx", "cy"]], "Point2D"], [["radiusX", "rx"], "Number"], [["radiusY", "ry"], "Number"]];

        for (var _len5 = arguments.length, args = new Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
          args[_key5] = arguments[_key5];
        }

        var values = getValues(types, args);
        return new ShapeInfo(ShapeInfo.ELLIPSE, values);
      }
    }, {
      key: "line",
      value: function line() {
        var types = [[["p1", ["p1x", "p1y"], ["x1", "y1"]], "Point2D"], [["p2", ["p2x", "p2y"], ["x2", "y2"]], "Point2D"]];

        for (var _len6 = arguments.length, args = new Array(_len6), _key6 = 0; _key6 < _len6; _key6++) {
          args[_key6] = arguments[_key6];
        }

        var values = getValues(types, args);
        return new ShapeInfo(ShapeInfo.LINE, values);
      }
    }, {
      key: "path",
      value: function path() {
        parser.parseData(arguments.length <= 0 ? undefined : arguments[0]);
        return new ShapeInfo(ShapeInfo.PATH, handler.shapes);
      }
    }, {
      key: "polygon",
      value: function polygon() {
        var types = [[[], "Array<Point2D>"]];

        for (var _len7 = arguments.length, args = new Array(_len7), _key7 = 0; _key7 < _len7; _key7++) {
          args[_key7] = arguments[_key7];
        }

        var values = getValues(types, args.length === 1 && Array.isArray(args[0]) ? args[0] : args);
        return new ShapeInfo(ShapeInfo.POLYGON, values);
      }
    }, {
      key: "polyline",
      value: function polyline() {
        var types = [[[], "Array<Point2D>"]];

        for (var _len8 = arguments.length, args = new Array(_len8), _key8 = 0; _key8 < _len8; _key8++) {
          args[_key8] = arguments[_key8];
        }

        var values = getValues(types, args.length === 1 && Array.isArray(args[0]) ? args[0] : args);
        return new ShapeInfo(ShapeInfo.POLYLINE, values);
      }
    }, {
      key: "rectangle",
      value: function rectangle() {
        var types = [[["topLeft", ["x", "y"], ["left", "top"]], "Point2D"], [["size", ["width", "height"], ["w", "h"]], "Point2D"], [["radiusX", "rx"], "Optional<Number>"], [["radiusY", "ry"], "Optional<Number>"]];

        for (var _len9 = arguments.length, args = new Array(_len9), _key9 = 0; _key9 < _len9; _key9++) {
          args[_key9] = arguments[_key9];
        }

        var values = getValues(types, args); // fix up bottom-right point

        var p1 = values[0];
        var p2 = values[1];
        values[1] = new Point2D(p1.x + p2.x, p1.y + p2.y); // create shape info

        var result = new ShapeInfo(ShapeInfo.RECTANGLE, values); // handle possible rounded rectangle values

        var ry = result.args.pop();
        var rx = result.args.pop();
        rx = rx === undefined ? 0 : rx;
        ry = ry === undefined ? 0 : ry;

        if (rx === 0 && ry === 0) {
          return result;
        }

        var _result$args$ = result.args[0],
            p1x = _result$args$.x,
            p1y = _result$args$.y;
        var _result$args$2 = result.args[1],
            p2x = _result$args$2.x,
            p2y = _result$args$2.y;
        var width = p2x - p1x;
        var height = p2y - p1y;

        if (rx === 0) {
          rx = ry;
        }

        if (ry === 0) {
          ry = rx;
        }

        if (rx > width * 0.5) {
          rx = width * 0.5;
        }

        if (ry > height * 0.5) {
          ry = height * 0.5;
        }

        var x0 = p1x;
        var y0 = p1y;
        var x1 = p1x + rx;
        var y1 = p1y + ry;
        var x2 = p2x - rx;
        var y2 = p2y - ry;
        var x3 = p2x;
        var y3 = p2y;
        var segments = [ShapeInfo.arc(x1, y1, rx, ry, 2 * degree90, 3 * degree90), ShapeInfo.line(x1, y0, x2, y0), ShapeInfo.arc(x2, y1, rx, ry, 3 * degree90, 4 * degree90), ShapeInfo.line(x3, y1, x3, y2), ShapeInfo.arc(x2, y2, rx, ry, 0, degree90), ShapeInfo.line(x2, y3, x1, y3), ShapeInfo.arc(x1, y2, rx, ry, degree90, 2 * degree90), ShapeInfo.line(x0, y2, x0, y1)];
        return new ShapeInfo(ShapeInfo.PATH, segments);
      }
    }]);

    return ShapeInfo;
  }(); // define shape name constants
  ShapeInfo.ARC = "Arc";
  ShapeInfo.QUADRATIC_BEZIER = "Bezier2";
  ShapeInfo.CUBIC_BEZIER = "Bezier3";
  ShapeInfo.CIRCLE = "Circle";
  ShapeInfo.ELLIPSE = "Ellipse";
  ShapeInfo.LINE = "Line";
  ShapeInfo.PATH = "Path";
  ShapeInfo.POLYGON = "Polygon";
  ShapeInfo.POLYLINE = "Polyline";
  ShapeInfo.RECTANGLE = "Rectangle"; // setup path parser handler after ShapeInfo has been defined

  var handler = new PathHandler(ShapeInfo);
  parser.setHandler(handler);

  var TWO_PI$1 = 2.0 * Math.PI;
  var UNIT_X = new Vector2D(1, 0);
  /**
   * @memberof module:kld-intersections.Intersection
   * @param {*} o
   * @returns {boolean}
   */

  function isNullish(o) {
    return o === null || o === undefined;
  }
  /**
   *  bezout
   *
   *  This code is based on MgcIntr2DElpElp.cpp written by David Eberly.  His
   *  code along with many other excellent examples are avaiable at his site:
   *  http://www.magic-software.com
   *
   *  @param {Array<module:kld-intersections.Point2D>} e1
   *  @param {Array<module:kld-intersections.Point2D>} e2
   *  @returns {external:Polynomial}
   */


  function bezout(e1, e2) {
    var AB = e1[0] * e2[1] - e2[0] * e1[1];
    var AC = e1[0] * e2[2] - e2[0] * e1[2];
    var AD = e1[0] * e2[3] - e2[0] * e1[3];
    var AE = e1[0] * e2[4] - e2[0] * e1[4];
    var AF = e1[0] * e2[5] - e2[0] * e1[5];
    var BC = e1[1] * e2[2] - e2[1] * e1[2];
    var BE = e1[1] * e2[4] - e2[1] * e1[4];
    var BF = e1[1] * e2[5] - e2[1] * e1[5];
    var CD = e1[2] * e2[3] - e2[2] * e1[3];
    var DE = e1[3] * e2[4] - e2[3] * e1[4];
    var DF = e1[3] * e2[5] - e2[3] * e1[5];
    var BFpDE = BF + DE;
    var BEmCD = BE - CD;
    return new Polynomial(AB * BC - AC * AC, AB * BEmCD + AD * BC - 2 * AC * AE, AB * BFpDE + AD * BEmCD - AE * AE - 2 * AC * AF, AB * DF + AD * BFpDE - 2 * AE * AF, AD * DF - AF * AF);
  }
  /**
   * normalizeAngle
   *
   * @param {number} radians
   * @returns {number}
   */


  function normalizeAngle(radians) {
    var normal = radians % TWO_PI$1;
    return normal < 0.0 ? normal + TWO_PI$1 : normal;
  }
  /**
   * restrictPointsToArc
   *
   * @param {module:kld-intersections.Intersection} intersections
   * @param {module:kld-intersections.Point2D} center
   * @param {number} radiusX
   * @param {number} radiusY
   * @param {number} startRadians
   * @param {number} endRadians
   * @returns {module:kld-intersections.Intersection}
   */


  function restrictPointsToArc(intersections, center, radiusX, radiusY, startRadians, endRadians) {
    if (intersections.points.length === 0) {
      return intersections;
    }

    var result = new Intersection("No Intersection"); // swap if end is lower, so start is always the lower one

    if (endRadians < startRadians) {
      var _ref = [endRadians, startRadians];
      startRadians = _ref[0];
      endRadians = _ref[1];
    } // move everything to the positive domain, simultaneously


    if (startRadians < 0 || endRadians < 0) {
      startRadians += TWO_PI$1;
      endRadians += TWO_PI$1;
    }

    var _iterator = _createForOfIteratorHelper(intersections.points),
        _step;

    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var p = _step.value;
        var a = normalizeAngle(UNIT_X.angleBetween(Vector2D.fromPoints(center, p))); // a angle smaller than start, it may still be between
        // this happens if end > TWO_PI

        if (a < startRadians) {
          a += TWO_PI$1;
        }

        if (startRadians <= a && a <= endRadians) {
          result.appendPoint(p);
        }
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }

    if (result.points.length > 0) {
      result.status = "Intersection";
    }

    return result;
  }
  /**
   *  closePolygon
   *  @memberof module:kld-intersections.Intersection
   *  @param {Array<module:kld-intersections.Point2D>} points
   *  @returns {Array<module:kld-intersections.Point2D>}
   */


  function closePolygon(points) {
    var copy = points.slice();
    copy.push(points[0]);
    return copy;
  }
  /**
   * Intersection
   * @memberof module:kld-intersections
   */


  var Intersection = /*#__PURE__*/function () {
    /**
     *  @param {string} status
     *  @returns {module:kld-intersections.Intersection}
     */
    function Intersection(status) {
      _classCallCheck(this, Intersection);

      this.init(status);
    }
    /**
     *  init
     *
     *  @param {string} status
     *  @returns {module:kld-intersections.Intersection}
     */


    _createClass(Intersection, [{
      key: "init",
      value: function init(status) {
        this.status = status;
        this.points = [];
      }
      /**
       *  intersect
       *
       *  @param {module:kld-intersections.ShapeInfo} shape1
       *  @param {module:kld-intersections.ShapeInfo} shape2
       *  @returns {module:kld-intersections.Intersection}
       */

    }, {
      key: "appendPoint",

      /**
       *  appendPoint
       *
       *  @param {module:kld-intersections.Point2D} point
       */
      value: function appendPoint(point) {
        this.points.push(point);
      }
      /**
       *  appendPoints
       *
       *  @param {Array<module:kld-intersections.Point2D>} points
       */

    }, {
      key: "appendPoints",
      value: function appendPoints(points) {
        this.points = this.points.concat(points);
      }
    }], [{
      key: "intersect",
      value: function intersect(shape1, shape2) {
        var result;

        if (!isNullish(shape1) && !isNullish(shape2)) {
          if (shape1.name === "Path") {
            result = Intersection.intersectPathShape(shape1, shape2);
          } else if (shape2.name === "Path") {
            result = Intersection.intersectPathShape(shape2, shape1);
          } else if (shape1.name === "Arc") {
            result = Intersection.intersectArcShape(shape1, shape2);
          } else if (shape2.name === "Arc") {
            result = Intersection.intersectArcShape(shape2, shape1);
          } else {
            var method;
            var args;

            if (shape1.name < shape2.name) {
              method = "intersect" + shape1.name + shape2.name;
              args = shape1.args.concat(shape2.args);
            } else {
              method = "intersect" + shape2.name + shape1.name;
              args = shape2.args.concat(shape1.args);
            }

            if (!(method in Intersection)) {
              throw new TypeError("Intersection not available: " + method);
            }

            result = Intersection[method].apply(null, args);
          }
        } else {
          result = new Intersection("No Intersection");
        }

        return result;
      }
      /**
       *  intersectPathShape
       *
       *  @param {module:kld-intersections.ShapeInfo} path
       *  @param {module:kld-intersections.ShapeInfo} shape
       *  @returns {module:kld-intersections.Intersection}
       */

    }, {
      key: "intersectPathShape",
      value: function intersectPathShape(path, shape) {
        var result = new Intersection("No Intersection");

        var _iterator2 = _createForOfIteratorHelper(path.args),
            _step2;

        try {
          for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
            var segment = _step2.value;
            var inter = Intersection.intersect(segment, shape);
            result.appendPoints(inter.points);
          }
        } catch (err) {
          _iterator2.e(err);
        } finally {
          _iterator2.f();
        }

        if (result.points.length > 0) {
          result.status = "Intersection";
        }

        return result;
      }
      /**
       * intersectArcShape
       *
       * @param {module:kld-intersections.ShapeInfo} arc
       * @param {module:kld-intersections.ShapeInfo} shape
       * @returns {module:kld-intersections.Intersection}
       */

    }, {
      key: "intersectArcShape",
      value: function intersectArcShape(arc, shape) {
        var _arc$args = _slicedToArray(arc.args, 5),
            center = _arc$args[0],
            radiusX = _arc$args[1],
            radiusY = _arc$args[2],
            startRadians = _arc$args[3],
            endRadians = _arc$args[4];

        var ellipse = new ShapeInfo(ShapeInfo.ELLIPSE, [center, radiusX, radiusY]);
        var ellipse_result = Intersection.intersect(ellipse, shape); // return ellipse_result;

        return restrictPointsToArc(ellipse_result, center, radiusX, radiusY, startRadians, endRadians);
      }
      /**
       *  intersectBezier2Bezier2
       *
       *  @param {module:kld-intersections.Point2D} a1
       *  @param {module:kld-intersections.Point2D} a2
       *  @param {module:kld-intersections.Point2D} a3
       *  @param {module:kld-intersections.Point2D} b1
       *  @param {module:kld-intersections.Point2D} b2
       *  @param {module:kld-intersections.Point2D} b3
       *  @returns {module:kld-intersections.Intersection}
       */

    }, {
      key: "intersectBezier2Bezier2",
      value: function intersectBezier2Bezier2(a1, a2, a3, b1, b2, b3) {
        var a, b;
        var result = new Intersection("No Intersection");
        a = a2.multiply(-2);
        var c12 = a1.add(a.add(a3));
        a = a1.multiply(-2);
        b = a2.multiply(2);
        var c11 = a.add(b);
        var c10 = new Point2D(a1.x, a1.y);
        a = b2.multiply(-2);
        var c22 = b1.add(a.add(b3));
        a = b1.multiply(-2);
        b = b2.multiply(2);
        var c21 = a.add(b);
        var c20 = new Point2D(b1.x, b1.y); // bezout

        a = c12.x * c11.y - c11.x * c12.y;
        b = c22.x * c11.y - c11.x * c22.y;
        var c = c21.x * c11.y - c11.x * c21.y;
        var d = c11.x * (c10.y - c20.y) + c11.y * (-c10.x + c20.x);
        var e = c22.x * c12.y - c12.x * c22.y;
        var f = c21.x * c12.y - c12.x * c21.y;
        var g = c12.x * (c10.y - c20.y) + c12.y * (-c10.x + c20.x); // determinant

        var poly = new Polynomial(-e * e, -2 * e * f, a * b - f * f - 2 * e * g, a * c - 2 * f * g, a * d - g * g);
        var roots = poly.getRoots();

        var _iterator3 = _createForOfIteratorHelper(roots),
            _step3;

        try {
          for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
            var s = _step3.value;

            if (0 <= s && s <= 1) {
              var xp = new Polynomial(c12.x, c11.x, c10.x - c20.x - s * c21.x - s * s * c22.x);
              xp.simplifyEquals();
              var xRoots = xp.getRoots();
              var yp = new Polynomial(c12.y, c11.y, c10.y - c20.y - s * c21.y - s * s * c22.y);
              yp.simplifyEquals();
              var yRoots = yp.getRoots();

              if (xRoots.length > 0 && yRoots.length > 0) {
                var TOLERANCE = 1e-4;

                var _iterator4 = _createForOfIteratorHelper(xRoots),
                    _step4;

                try {
                  checkRoots: for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
                    var xRoot = _step4.value;

                    if (0 <= xRoot && xRoot <= 1) {
                      for (var k = 0; k < yRoots.length; k++) {
                        if (Math.abs(xRoot - yRoots[k]) < TOLERANCE) {
                          result.points.push(c22.multiply(s * s).add(c21.multiply(s).add(c20)));
                          break checkRoots;
                        }
                      }
                    }
                  }
                } catch (err) {
                  _iterator4.e(err);
                } finally {
                  _iterator4.f();
                }
              }
            }
          }
        } catch (err) {
          _iterator3.e(err);
        } finally {
          _iterator3.f();
        }

        if (result.points.length > 0) {
          result.status = "Intersection";
        }

        return result;
      }
      /**
       *  intersectBezier2Bezier3
       *
       *  @param {module:kld-intersections.Point2D} a1
       *  @param {module:kld-intersections.Point2D} a2
       *  @param {module:kld-intersections.Point2D} a3
       *  @param {module:kld-intersections.Point2D} b1
       *  @param {module:kld-intersections.Point2D} b2
       *  @param {module:kld-intersections.Point2D} b3
       *  @param {module:kld-intersections.Point2D} b4
       *  @returns {module:kld-intersections.Intersection}
       */

    }, {
      key: "intersectBezier2Bezier3",
      value: function intersectBezier2Bezier3(a1, a2, a3, b1, b2, b3, b4) {
        var a, b, c, d;
        var result = new Intersection("No Intersection");
        a = a2.multiply(-2);
        var c12 = a1.add(a.add(a3));
        a = a1.multiply(-2);
        b = a2.multiply(2);
        var c11 = a.add(b);
        var c10 = new Point2D(a1.x, a1.y);
        a = b1.multiply(-1);
        b = b2.multiply(3);
        c = b3.multiply(-3);
        d = a.add(b.add(c.add(b4)));
        var c23 = new Point2D(d.x, d.y);
        a = b1.multiply(3);
        b = b2.multiply(-6);
        c = b3.multiply(3);
        d = a.add(b.add(c));
        var c22 = new Point2D(d.x, d.y);
        a = b1.multiply(-3);
        b = b2.multiply(3);
        c = a.add(b);
        var c21 = new Point2D(c.x, c.y);
        var c20 = new Point2D(b1.x, b1.y);
        var c10x2 = c10.x * c10.x;
        var c10y2 = c10.y * c10.y;
        var c11x2 = c11.x * c11.x;
        var c11y2 = c11.y * c11.y;
        var c12x2 = c12.x * c12.x;
        var c12y2 = c12.y * c12.y;
        var c20x2 = c20.x * c20.x;
        var c20y2 = c20.y * c20.y;
        var c21x2 = c21.x * c21.x;
        var c21y2 = c21.y * c21.y;
        var c22x2 = c22.x * c22.x;
        var c22y2 = c22.y * c22.y;
        var c23x2 = c23.x * c23.x;
        var c23y2 = c23.y * c23.y;
        var poly = new Polynomial(-2 * c12.x * c12.y * c23.x * c23.y + c12x2 * c23y2 + c12y2 * c23x2, -2 * c12.x * c12.y * c22.x * c23.y - 2 * c12.x * c12.y * c22.y * c23.x + 2 * c12y2 * c22.x * c23.x + 2 * c12x2 * c22.y * c23.y, -2 * c12.x * c21.x * c12.y * c23.y - 2 * c12.x * c12.y * c21.y * c23.x - 2 * c12.x * c12.y * c22.x * c22.y + 2 * c21.x * c12y2 * c23.x + c12y2 * c22x2 + c12x2 * (2 * c21.y * c23.y + c22y2), 2 * c10.x * c12.x * c12.y * c23.y + 2 * c10.y * c12.x * c12.y * c23.x + c11.x * c11.y * c12.x * c23.y + c11.x * c11.y * c12.y * c23.x - 2 * c20.x * c12.x * c12.y * c23.y - 2 * c12.x * c20.y * c12.y * c23.x - 2 * c12.x * c21.x * c12.y * c22.y - 2 * c12.x * c12.y * c21.y * c22.x - 2 * c10.x * c12y2 * c23.x - 2 * c10.y * c12x2 * c23.y + 2 * c20.x * c12y2 * c23.x + 2 * c21.x * c12y2 * c22.x - c11y2 * c12.x * c23.x - c11x2 * c12.y * c23.y + c12x2 * (2 * c20.y * c23.y + 2 * c21.y * c22.y), 2 * c10.x * c12.x * c12.y * c22.y + 2 * c10.y * c12.x * c12.y * c22.x + c11.x * c11.y * c12.x * c22.y + c11.x * c11.y * c12.y * c22.x - 2 * c20.x * c12.x * c12.y * c22.y - 2 * c12.x * c20.y * c12.y * c22.x - 2 * c12.x * c21.x * c12.y * c21.y - 2 * c10.x * c12y2 * c22.x - 2 * c10.y * c12x2 * c22.y + 2 * c20.x * c12y2 * c22.x - c11y2 * c12.x * c22.x - c11x2 * c12.y * c22.y + c21x2 * c12y2 + c12x2 * (2 * c20.y * c22.y + c21y2), 2 * c10.x * c12.x * c12.y * c21.y + 2 * c10.y * c12.x * c21.x * c12.y + c11.x * c11.y * c12.x * c21.y + c11.x * c11.y * c21.x * c12.y - 2 * c20.x * c12.x * c12.y * c21.y - 2 * c12.x * c20.y * c21.x * c12.y - 2 * c10.x * c21.x * c12y2 - 2 * c10.y * c12x2 * c21.y + 2 * c20.x * c21.x * c12y2 - c11y2 * c12.x * c21.x - c11x2 * c12.y * c21.y + 2 * c12x2 * c20.y * c21.y, -2 * c10.x * c10.y * c12.x * c12.y - c10.x * c11.x * c11.y * c12.y - c10.y * c11.x * c11.y * c12.x + 2 * c10.x * c12.x * c20.y * c12.y + 2 * c10.y * c20.x * c12.x * c12.y + c11.x * c20.x * c11.y * c12.y + c11.x * c11.y * c12.x * c20.y - 2 * c20.x * c12.x * c20.y * c12.y - 2 * c10.x * c20.x * c12y2 + c10.x * c11y2 * c12.x + c10.y * c11x2 * c12.y - 2 * c10.y * c12x2 * c20.y - c20.x * c11y2 * c12.x - c11x2 * c20.y * c12.y + c10x2 * c12y2 + c10y2 * c12x2 + c20x2 * c12y2 + c12x2 * c20y2);
        var roots = poly.getRootsInInterval(0, 1);

        var _iterator5 = _createForOfIteratorHelper(roots),
            _step5;

        try {
          for (_iterator5.s(); !(_step5 = _iterator5.n()).done;) {
            var s = _step5.value;
            var xRoots = new Polynomial(c12.x, c11.x, c10.x - c20.x - s * c21.x - s * s * c22.x - s * s * s * c23.x).getRoots();
            var yRoots = new Polynomial(c12.y, c11.y, c10.y - c20.y - s * c21.y - s * s * c22.y - s * s * s * c23.y).getRoots();

            if (xRoots.length > 0 && yRoots.length > 0) {
              var TOLERANCE = 1e-4;

              var _iterator6 = _createForOfIteratorHelper(xRoots),
                  _step6;

              try {
                checkRoots: for (_iterator6.s(); !(_step6 = _iterator6.n()).done;) {
                  var xRoot = _step6.value;

                  if (0 <= xRoot && xRoot <= 1) {
                    for (var k = 0; k < yRoots.length; k++) {
                      if (Math.abs(xRoot - yRoots[k]) < TOLERANCE) {
                        result.points.push(c23.multiply(s * s * s).add(c22.multiply(s * s).add(c21.multiply(s).add(c20))));
                        break checkRoots;
                      }
                    }
                  }
                }
              } catch (err) {
                _iterator6.e(err);
              } finally {
                _iterator6.f();
              }
            }
          }
        } catch (err) {
          _iterator5.e(err);
        } finally {
          _iterator5.f();
        }

        if (result.points.length > 0) {
          result.status = "Intersection";
        }

        return result;
      }
      /**
       *  intersectBezier2Circle
       *
       *  @param {module:kld-intersections.Point2D} p1
       *  @param {module:kld-intersections.Point2D} p2
       *  @param {module:kld-intersections.Point2D} p3
       *  @param {module:kld-intersections.Point2D} c
       *  @param {number} r
       *  @returns {module:kld-intersections.Intersection}
       */

    }, {
      key: "intersectBezier2Circle",
      value: function intersectBezier2Circle(p1, p2, p3, c, r) {
        return Intersection.intersectBezier2Ellipse(p1, p2, p3, c, r, r);
      }
      /**
       *  intersectBezier2Ellipse
       *
       *  @param {module:kld-intersections.Point2D} p1
       *  @param {module:kld-intersections.Point2D} p2
       *  @param {module:kld-intersections.Point2D} p3
       *  @param {module:kld-intersections.Point2D} ec
       *  @param {number} rx
       *  @param {number} ry
       *  @returns {module:kld-intersections.Intersection}
       */

    }, {
      key: "intersectBezier2Ellipse",
      value: function intersectBezier2Ellipse(p1, p2, p3, ec, rx, ry) {
        var a; // temporary variables
        // c2, c1, c0; // coefficients of quadratic

        var result = new Intersection("No Intersection");
        a = p2.multiply(-2);
        var c2 = p1.add(a.add(p3));
        a = p1.multiply(-2);
        var b = p2.multiply(2);
        var c1 = a.add(b);
        var c0 = new Point2D(p1.x, p1.y);
        var rxrx = rx * rx;
        var ryry = ry * ry;
        var roots = new Polynomial(ryry * c2.x * c2.x + rxrx * c2.y * c2.y, 2 * (ryry * c2.x * c1.x + rxrx * c2.y * c1.y), ryry * (2 * c2.x * c0.x + c1.x * c1.x) + rxrx * (2 * c2.y * c0.y + c1.y * c1.y) - 2 * (ryry * ec.x * c2.x + rxrx * ec.y * c2.y), 2 * (ryry * c1.x * (c0.x - ec.x) + rxrx * c1.y * (c0.y - ec.y)), ryry * (c0.x * c0.x + ec.x * ec.x) + rxrx * (c0.y * c0.y + ec.y * ec.y) - 2 * (ryry * ec.x * c0.x + rxrx * ec.y * c0.y) - rxrx * ryry).getRoots();

        var _iterator7 = _createForOfIteratorHelper(roots),
            _step7;

        try {
          for (_iterator7.s(); !(_step7 = _iterator7.n()).done;) {
            var t = _step7.value;

            if (0 <= t && t <= 1) {
              result.points.push(c2.multiply(t * t).add(c1.multiply(t).add(c0)));
            }
          }
        } catch (err) {
          _iterator7.e(err);
        } finally {
          _iterator7.f();
        }

        if (result.points.length > 0) {
          result.status = "Intersection";
        }

        return result;
      }
      /**
       *  intersectBezier2Line
       *
       *  @param {module:kld-intersections.Point2D} p1
       *  @param {module:kld-intersections.Point2D} p2
       *  @param {module:kld-intersections.Point2D} p3
       *  @param {module:kld-intersections.Point2D} a1
       *  @param {module:kld-intersections.Point2D} a2
       *  @returns {module:kld-intersections.Intersection}
       */

    }, {
      key: "intersectBezier2Line",
      value: function intersectBezier2Line(p1, p2, p3, a1, a2) {
        var a; // temporary variables
        // let c2, c1, c0; // coefficients of quadratic
        // cl; // c coefficient for normal form of line
        // n; // normal for normal form of line

        var min = a1.min(a2); // used to determine if point is on line segment

        var max = a1.max(a2); // used to determine if point is on line segment

        var result = new Intersection("No Intersection");
        a = p2.multiply(-2);
        var c2 = p1.add(a.add(p3));
        a = p1.multiply(-2);
        var b = p2.multiply(2);
        var c1 = a.add(b);
        var c0 = new Point2D(p1.x, p1.y); // Convert line to normal form: ax + by + c = 0
        // Find normal to line: negative inverse of original line's slope

        var n = new Vector2D(a1.y - a2.y, a2.x - a1.x); // Determine new c coefficient

        var cl = a1.x * a2.y - a2.x * a1.y; // Transform cubic coefficients to line's coordinate system and find roots
        // of cubic

        var roots = new Polynomial(n.dot(c2), n.dot(c1), n.dot(c0) + cl).getRoots(); // Any roots in closed interval [0,1] are intersections on Bezier, but
        // might not be on the line segment.
        // Find intersections and calculate point coordinates

        var _iterator8 = _createForOfIteratorHelper(roots),
            _step8;

        try {
          for (_iterator8.s(); !(_step8 = _iterator8.n()).done;) {
            var t = _step8.value;

            if (0 <= t && t <= 1) {
              // We're within the Bezier curve
              // Find point on Bezier
              var p4 = p1.lerp(p2, t);
              var p5 = p2.lerp(p3, t);
              var p6 = p4.lerp(p5, t); // See if point is on line segment
              // Had to make special cases for vertical and horizontal lines due
              // to slight errors in calculation of p6

              if (a1.x === a2.x) {
                if (min.y <= p6.y && p6.y <= max.y) {
                  result.status = "Intersection";
                  result.appendPoint(p6);
                }
              } else if (a1.y === a2.y) {
                if (min.x <= p6.x && p6.x <= max.x) {
                  result.status = "Intersection";
                  result.appendPoint(p6);
                }
              } else if (min.x <= p6.x && p6.x <= max.x && min.y <= p6.y && p6.y <= max.y) {
                result.status = "Intersection";
                result.appendPoint(p6);
              }
            }
          }
        } catch (err) {
          _iterator8.e(err);
        } finally {
          _iterator8.f();
        }

        return result;
      }
      /**
       *  intersectBezier2Polygon
       *
       *  @param {module:kld-intersections.Point2D} p1
       *  @param {module:kld-intersections.Point2D} p2
       *  @param {module:kld-intersections.Point2D} p3
       *  @param {Array<module:kld-intersections.Point2D>} points
       *  @returns {module:kld-intersections.Intersection}
       */

    }, {
      key: "intersectBezier2Polygon",
      value: function intersectBezier2Polygon(p1, p2, p3, points) {
        return Intersection.intersectBezier2Polyline(p1, p2, p3, closePolygon(points));
      }
      /**
       *  intersectBezier2Polyline
       *
       *  @param {module:kld-intersections.Point2D} p1
       *  @param {module:kld-intersections.Point2D} p2
       *  @param {module:kld-intersections.Point2D} p3
       *  @param {Array<module:kld-intersections.Point2D>} points
       *  @returns {module:kld-intersections.Intersection}
       */

    }, {
      key: "intersectBezier2Polyline",
      value: function intersectBezier2Polyline(p1, p2, p3, points) {
        var result = new Intersection("No Intersection");
        var len = points.length;

        for (var i = 0; i < len - 1; i++) {
          var a1 = points[i];
          var a2 = points[i + 1];
          var inter = Intersection.intersectBezier2Line(p1, p2, p3, a1, a2);
          result.appendPoints(inter.points);
        }

        if (result.points.length > 0) {
          result.status = "Intersection";
        }

        return result;
      }
      /**
       *  intersectBezier2Rectangle
       *
       *  @param {module:kld-intersections.Point2D} p1
       *  @param {module:kld-intersections.Point2D} p2
       *  @param {module:kld-intersections.Point2D} p3
       *  @param {module:kld-intersections.Point2D} r1
       *  @param {module:kld-intersections.Point2D} r2
       *  @returns {module:kld-intersections.Intersection}
       */

    }, {
      key: "intersectBezier2Rectangle",
      value: function intersectBezier2Rectangle(p1, p2, p3, r1, r2) {
        var min = r1.min(r2);
        var max = r1.max(r2);
        var topRight = new Point2D(max.x, min.y);
        var bottomLeft = new Point2D(min.x, max.y);
        var inter1 = Intersection.intersectBezier2Line(p1, p2, p3, min, topRight);
        var inter2 = Intersection.intersectBezier2Line(p1, p2, p3, topRight, max);
        var inter3 = Intersection.intersectBezier2Line(p1, p2, p3, max, bottomLeft);
        var inter4 = Intersection.intersectBezier2Line(p1, p2, p3, bottomLeft, min);
        var result = new Intersection("No Intersection");
        result.appendPoints(inter1.points);
        result.appendPoints(inter2.points);
        result.appendPoints(inter3.points);
        result.appendPoints(inter4.points);

        if (result.points.length > 0) {
          result.status = "Intersection";
        }

        return result;
      }
      /**
       *  intersectBezier3Bezier3
       *
       *  @param {module:kld-intersections.Point2D} a1
       *  @param {module:kld-intersections.Point2D} a2
       *  @param {module:kld-intersections.Point2D} a3
       *  @param {module:kld-intersections.Point2D} a4
       *  @param {module:kld-intersections.Point2D} b1
       *  @param {module:kld-intersections.Point2D} b2
       *  @param {module:kld-intersections.Point2D} b3
       *  @param {module:kld-intersections.Point2D} b4
       *  @returns {module:kld-intersections.Intersection}
       */

    }, {
      key: "intersectBezier3Bezier3",
      value: function intersectBezier3Bezier3(a1, a2, a3, a4, b1, b2, b3, b4) {
        var a, b, c, d; // temporary variables
        // c13, c12, c11, c10; // coefficients of cubic
        // c23, c22, c21, c20; // coefficients of cubic

        var result = new Intersection("No Intersection"); // Calculate the coefficients of cubic polynomial

        a = a1.multiply(-1);
        b = a2.multiply(3);
        c = a3.multiply(-3);
        d = a.add(b.add(c.add(a4)));
        var c13 = new Point2D(d.x, d.y);
        a = a1.multiply(3);
        b = a2.multiply(-6);
        c = a3.multiply(3);
        d = a.add(b.add(c));
        var c12 = new Point2D(d.x, d.y);
        a = a1.multiply(-3);
        b = a2.multiply(3);
        c = a.add(b);
        var c11 = new Point2D(c.x, c.y);
        var c10 = new Point2D(a1.x, a1.y);
        a = b1.multiply(-1);
        b = b2.multiply(3);
        c = b3.multiply(-3);
        d = a.add(b.add(c.add(b4)));
        var c23 = new Point2D(d.x, d.y);
        a = b1.multiply(3);
        b = b2.multiply(-6);
        c = b3.multiply(3);
        d = a.add(b.add(c));
        var c22 = new Point2D(d.x, d.y);
        a = b1.multiply(-3);
        b = b2.multiply(3);
        c = a.add(b);
        var c21 = new Point2D(c.x, c.y);
        var c20 = new Point2D(b1.x, b1.y); // bezout

        a = c13.x * c12.y - c12.x * c13.y;
        b = c13.x * c11.y - c11.x * c13.y;
        var c0 = c13.x * c10.y - c10.x * c13.y + c20.x * c13.y - c13.x * c20.y;
        var c1 = c21.x * c13.y - c13.x * c21.y;
        var c2 = c22.x * c13.y - c13.x * c22.y;
        var c3 = c23.x * c13.y - c13.x * c23.y;
        d = c13.x * c11.y - c11.x * c13.y;
        var e0 = c13.x * c10.y + c12.x * c11.y - c11.x * c12.y - c10.x * c13.y + c20.x * c13.y - c13.x * c20.y;
        var e1 = c21.x * c13.y - c13.x * c21.y;
        var e2 = c22.x * c13.y - c13.x * c22.y;
        var e3 = c23.x * c13.y - c13.x * c23.y;
        var f0 = c12.x * c10.y - c10.x * c12.y + c20.x * c12.y - c12.x * c20.y;
        var f1 = c21.x * c12.y - c12.x * c21.y;
        var f2 = c22.x * c12.y - c12.x * c22.y;
        var f3 = c23.x * c12.y - c12.x * c23.y;
        var g0 = c13.x * c10.y - c10.x * c13.y + c20.x * c13.y - c13.x * c20.y;
        var g1 = c21.x * c13.y - c13.x * c21.y;
        var g2 = c22.x * c13.y - c13.x * c22.y;
        var g3 = c23.x * c13.y - c13.x * c23.y;
        var h0 = c12.x * c10.y - c10.x * c12.y + c20.x * c12.y - c12.x * c20.y;
        var h1 = c21.x * c12.y - c12.x * c21.y;
        var h2 = c22.x * c12.y - c12.x * c22.y;
        var h3 = c23.x * c12.y - c12.x * c23.y;
        var i0 = c11.x * c10.y - c10.x * c11.y + c20.x * c11.y - c11.x * c20.y;
        var i1 = c21.x * c11.y - c11.x * c21.y;
        var i2 = c22.x * c11.y - c11.x * c22.y;
        var i3 = c23.x * c11.y - c11.x * c23.y; // determinant

        var poly = new Polynomial(-c3 * e3 * g3, -c3 * e3 * g2 - c3 * e2 * g3 - c2 * e3 * g3, -c3 * e3 * g1 - c3 * e2 * g2 - c2 * e3 * g2 - c3 * e1 * g3 - c2 * e2 * g3 - c1 * e3 * g3, -c3 * e3 * g0 - c3 * e2 * g1 - c2 * e3 * g1 - c3 * e1 * g2 - c2 * e2 * g2 - c1 * e3 * g2 - c3 * e0 * g3 - c2 * e1 * g3 - c1 * e2 * g3 - c0 * e3 * g3 + b * f3 * g3 + c3 * d * h3 - a * f3 * h3 + a * e3 * i3, -c3 * e2 * g0 - c2 * e3 * g0 - c3 * e1 * g1 - c2 * e2 * g1 - c1 * e3 * g1 - c3 * e0 * g2 - c2 * e1 * g2 - c1 * e2 * g2 - c0 * e3 * g2 + b * f3 * g2 - c2 * e0 * g3 - c1 * e1 * g3 - c0 * e2 * g3 + b * f2 * g3 + c3 * d * h2 - a * f3 * h2 + c2 * d * h3 - a * f2 * h3 + a * e3 * i2 + a * e2 * i3, -c3 * e1 * g0 - c2 * e2 * g0 - c1 * e3 * g0 - c3 * e0 * g1 - c2 * e1 * g1 - c1 * e2 * g1 - c0 * e3 * g1 + b * f3 * g1 - c2 * e0 * g2 - c1 * e1 * g2 - c0 * e2 * g2 + b * f2 * g2 - c1 * e0 * g3 - c0 * e1 * g3 + b * f1 * g3 + c3 * d * h1 - a * f3 * h1 + c2 * d * h2 - a * f2 * h2 + c1 * d * h3 - a * f1 * h3 + a * e3 * i1 + a * e2 * i2 + a * e1 * i3, -c3 * e0 * g0 - c2 * e1 * g0 - c1 * e2 * g0 - c0 * e3 * g0 + b * f3 * g0 - c2 * e0 * g1 - c1 * e1 * g1 - c0 * e2 * g1 + b * f2 * g1 - c1 * e0 * g2 - c0 * e1 * g2 + b * f1 * g2 - c0 * e0 * g3 + b * f0 * g3 + c3 * d * h0 - a * f3 * h0 + c2 * d * h1 - a * f2 * h1 + c1 * d * h2 - a * f1 * h2 + c0 * d * h3 - a * f0 * h3 + a * e3 * i0 + a * e2 * i1 + a * e1 * i2 - b * d * i3 + a * e0 * i3, -c2 * e0 * g0 - c1 * e1 * g0 - c0 * e2 * g0 + b * f2 * g0 - c1 * e0 * g1 - c0 * e1 * g1 + b * f1 * g1 - c0 * e0 * g2 + b * f0 * g2 + c2 * d * h0 - a * f2 * h0 + c1 * d * h1 - a * f1 * h1 + c0 * d * h2 - a * f0 * h2 + a * e2 * i0 + a * e1 * i1 - b * d * i2 + a * e0 * i2, -c1 * e0 * g0 - c0 * e1 * g0 + b * f1 * g0 - c0 * e0 * g1 + b * f0 * g1 + c1 * d * h0 - a * f1 * h0 + c0 * d * h1 - a * f0 * h1 + a * e1 * i0 - b * d * i1 + a * e0 * i1, -c0 * e0 * g0 + b * f0 * g0 + c0 * d * h0 - a * f0 * h0 - b * d * i0 + a * e0 * i0);
        poly.simplifyEquals();
        var roots = poly.getRootsInInterval(0, 1);

        var _iterator9 = _createForOfIteratorHelper(roots),
            _step9;

        try {
          for (_iterator9.s(); !(_step9 = _iterator9.n()).done;) {
            var s = _step9.value;
            var xp = new Polynomial(c13.x, c12.x, c11.x, c10.x - c20.x - s * c21.x - s * s * c22.x - s * s * s * c23.x);
            xp.simplifyEquals();
            var xRoots = xp.getRoots();
            var yp = new Polynomial(c13.y, c12.y, c11.y, c10.y - c20.y - s * c21.y - s * s * c22.y - s * s * s * c23.y);
            yp.simplifyEquals();
            var yRoots = yp.getRoots();

            if (xRoots.length > 0 && yRoots.length > 0) {
              var TOLERANCE = 1e-4;

              var _iterator10 = _createForOfIteratorHelper(xRoots),
                  _step10;

              try {
                checkRoots: for (_iterator10.s(); !(_step10 = _iterator10.n()).done;) {
                  var xRoot = _step10.value;

                  if (0 <= xRoot && xRoot <= 1) {
                    for (var k = 0; k < yRoots.length; k++) {
                      if (Math.abs(xRoot - yRoots[k]) < TOLERANCE) {
                        result.points.push(c23.multiply(s * s * s).add(c22.multiply(s * s).add(c21.multiply(s).add(c20))));
                        break checkRoots;
                      }
                    }
                  }
                }
              } catch (err) {
                _iterator10.e(err);
              } finally {
                _iterator10.f();
              }
            }
          }
        } catch (err) {
          _iterator9.e(err);
        } finally {
          _iterator9.f();
        }

        if (result.points.length > 0) {
          result.status = "Intersection";
        }

        return result;
      }
      /**
       *  intersectBezier3Circle
       *
       *  @param {module:kld-intersections.Point2D} p1
       *  @param {module:kld-intersections.Point2D} p2
       *  @param {module:kld-intersections.Point2D} p3
       *  @param {module:kld-intersections.Point2D} p4
       *  @param {module:kld-intersections.Point2D} c
       *  @param {number} r
       *  @returns {module:kld-intersections.Intersection}
       */

    }, {
      key: "intersectBezier3Circle",
      value: function intersectBezier3Circle(p1, p2, p3, p4, c, r) {
        return Intersection.intersectBezier3Ellipse(p1, p2, p3, p4, c, r, r);
      }
      /**
       *  intersectBezier3Ellipse
       *
       *  @param {module:kld-intersections.Point2D} p1
       *  @param {module:kld-intersections.Point2D} p2
       *  @param {module:kld-intersections.Point2D} p3
       *  @param {module:kld-intersections.Point2D} p4
       *  @param {module:kld-intersections.Point2D} ec
       *  @param {number} rx
       *  @param {number} ry
       *  @returns {module:kld-intersections.Intersection}
       */

    }, {
      key: "intersectBezier3Ellipse",
      value: function intersectBezier3Ellipse(p1, p2, p3, p4, ec, rx, ry) {
        var a, b, c, d; // temporary variables
        // c3, c2, c1, c0; // coefficients of cubic

        var result = new Intersection("No Intersection"); // Calculate the coefficients of cubic polynomial

        a = p1.multiply(-1);
        b = p2.multiply(3);
        c = p3.multiply(-3);
        d = a.add(b.add(c.add(p4)));
        var c3 = new Point2D(d.x, d.y);
        a = p1.multiply(3);
        b = p2.multiply(-6);
        c = p3.multiply(3);
        d = a.add(b.add(c));
        var c2 = new Point2D(d.x, d.y);
        a = p1.multiply(-3);
        b = p2.multiply(3);
        c = a.add(b);
        var c1 = new Point2D(c.x, c.y);
        var c0 = new Point2D(p1.x, p1.y);
        var rxrx = rx * rx;
        var ryry = ry * ry;
        var poly = new Polynomial(c3.x * c3.x * ryry + c3.y * c3.y * rxrx, 2 * (c3.x * c2.x * ryry + c3.y * c2.y * rxrx), 2 * (c3.x * c1.x * ryry + c3.y * c1.y * rxrx) + c2.x * c2.x * ryry + c2.y * c2.y * rxrx, 2 * c3.x * ryry * (c0.x - ec.x) + 2 * c3.y * rxrx * (c0.y - ec.y) + 2 * (c2.x * c1.x * ryry + c2.y * c1.y * rxrx), 2 * c2.x * ryry * (c0.x - ec.x) + 2 * c2.y * rxrx * (c0.y - ec.y) + c1.x * c1.x * ryry + c1.y * c1.y * rxrx, 2 * c1.x * ryry * (c0.x - ec.x) + 2 * c1.y * rxrx * (c0.y - ec.y), c0.x * c0.x * ryry - 2 * c0.y * ec.y * rxrx - 2 * c0.x * ec.x * ryry + c0.y * c0.y * rxrx + ec.x * ec.x * ryry + ec.y * ec.y * rxrx - rxrx * ryry);
        var roots = poly.getRootsInInterval(0, 1);

        var _iterator11 = _createForOfIteratorHelper(roots),
            _step11;

        try {
          for (_iterator11.s(); !(_step11 = _iterator11.n()).done;) {
            var t = _step11.value;
            result.points.push(c3.multiply(t * t * t).add(c2.multiply(t * t).add(c1.multiply(t).add(c0))));
          }
        } catch (err) {
          _iterator11.e(err);
        } finally {
          _iterator11.f();
        }

        if (result.points.length > 0) {
          result.status = "Intersection";
        }

        return result;
      }
      /**
       *  intersectBezier3Line
       *
       *  Many thanks to Dan Sunday at SoftSurfer.com.  He gave me a very thorough
       *  sketch of the algorithm used here.  Without his help, I'm not sure when I
       *  would have figured out this intersection problem.
       *
       *  @param {module:kld-intersections.Point2D} p1
       *  @param {module:kld-intersections.Point2D} p2
       *  @param {module:kld-intersections.Point2D} p3
       *  @param {module:kld-intersections.Point2D} p4
       *  @param {module:kld-intersections.Point2D} a1
       *  @param {module:kld-intersections.Point2D} a2
       *  @returns {module:kld-intersections.Intersection}
       */

    }, {
      key: "intersectBezier3Line",
      value: function intersectBezier3Line(p1, p2, p3, p4, a1, a2) {
        var a, b, c, d; // temporary variables
        // c3, c2, c1, c0; // coefficients of cubic
        // cl; // c coefficient for normal form of line
        // n; // normal for normal form of line

        var min = a1.min(a2); // used to determine if point is on line segment

        var max = a1.max(a2); // used to determine if point is on line segment

        var result = new Intersection("No Intersection"); // Start with Bezier using Bernstein polynomials for weighting functions:
        //     (1-t^3)P1 + 3t(1-t)^2P2 + 3t^2(1-t)P3 + t^3P4
        //
        // Expand and collect terms to form linear combinations of original Bezier
        // controls.  This ends up with a vector cubic in t:
        //     (-P1+3P2-3P3+P4)t^3 + (3P1-6P2+3P3)t^2 + (-3P1+3P2)t + P1
        //             /\                  /\                /\       /\
        //             ||                  ||                ||       ||
        //             c3                  c2                c1       c0
        // Calculate the coefficients

        a = p1.multiply(-1);
        b = p2.multiply(3);
        c = p3.multiply(-3);
        d = a.add(b.add(c.add(p4)));
        var c3 = new Vector2D(d.x, d.y);
        a = p1.multiply(3);
        b = p2.multiply(-6);
        c = p3.multiply(3);
        d = a.add(b.add(c));
        var c2 = new Vector2D(d.x, d.y);
        a = p1.multiply(-3);
        b = p2.multiply(3);
        c = a.add(b);
        var c1 = new Vector2D(c.x, c.y);
        var c0 = new Vector2D(p1.x, p1.y); // Convert line to normal form: ax + by + c = 0
        // Find normal to line: negative inverse of original line's slope

        var n = new Vector2D(a1.y - a2.y, a2.x - a1.x); // Determine new c coefficient

        var cl = a1.x * a2.y - a2.x * a1.y; // ?Rotate each cubic coefficient using line for new coordinate system?
        // Find roots of rotated cubic

        var roots = new Polynomial(n.dot(c3), n.dot(c2), n.dot(c1), n.dot(c0) + cl).getRoots(); // Any roots in closed interval [0,1] are intersections on Bezier, but
        // might not be on the line segment.
        // Find intersections and calculate point coordinates

        var _iterator12 = _createForOfIteratorHelper(roots),
            _step12;

        try {
          for (_iterator12.s(); !(_step12 = _iterator12.n()).done;) {
            var t = _step12.value;

            if (0 <= t && t <= 1) {
              // We're within the Bezier curve
              // Find point on Bezier
              var p5 = p1.lerp(p2, t);
              var p6 = p2.lerp(p3, t);
              var p7 = p3.lerp(p4, t);
              var p8 = p5.lerp(p6, t);
              var p9 = p6.lerp(p7, t);
              var p10 = p8.lerp(p9, t); // See if point is on line segment
              // Had to make special cases for vertical and horizontal lines due
              // to slight errors in calculation of p10

              if (a1.x === a2.x) {
                if (min.y <= p10.y && p10.y <= max.y) {
                  result.status = "Intersection";
                  result.appendPoint(p10);
                }
              } else if (a1.y === a2.y) {
                if (min.x <= p10.x && p10.x <= max.x) {
                  result.status = "Intersection";
                  result.appendPoint(p10);
                }
              } else if (min.x <= p10.x && p10.x <= max.x && min.y <= p10.y && p10.y <= max.y) {
                result.status = "Intersection";
                result.appendPoint(p10);
              }
            }
          }
        } catch (err) {
          _iterator12.e(err);
        } finally {
          _iterator12.f();
        }

        return result;
      }
      /**
       *  intersectBezier3Polygon
       *
       *  @param {module:kld-intersections.Point2D} p1
       *  @param {module:kld-intersections.Point2D} p2
       *  @param {module:kld-intersections.Point2D} p3
       *  @param {module:kld-intersections.Point2D} p4
       *  @param {Array<module:kld-intersections.Point2D>} points
       *  @returns {module:kld-intersections.Intersection}
       */

    }, {
      key: "intersectBezier3Polygon",
      value: function intersectBezier3Polygon(p1, p2, p3, p4, points) {
        return Intersection.intersectBezier3Polyline(p1, p2, p3, p4, closePolygon(points));
      }
      /**
       *  intersectBezier3Polyline
       *
       *  @param {module:kld-intersections.Point2D} p1
       *  @param {module:kld-intersections.Point2D} p2
       *  @param {module:kld-intersections.Point2D} p3
       *  @param {module:kld-intersections.Point2D} p4
       *  @param {Array<module:kld-intersections.Point2D>} points
       *  @returns {module:kld-intersections.Intersection}
       */

    }, {
      key: "intersectBezier3Polyline",
      value: function intersectBezier3Polyline(p1, p2, p3, p4, points) {
        var result = new Intersection("No Intersection");
        var len = points.length;

        for (var i = 0; i < len - 1; i++) {
          var a1 = points[i];
          var a2 = points[i + 1];
          var inter = Intersection.intersectBezier3Line(p1, p2, p3, p4, a1, a2);
          result.appendPoints(inter.points);
        }

        if (result.points.length > 0) {
          result.status = "Intersection";
        }

        return result;
      }
      /**
       *  intersectBezier3Rectangle
       *
       *  @param {module:kld-intersections.Point2D} p1
       *  @param {module:kld-intersections.Point2D} p2
       *  @param {module:kld-intersections.Point2D} p3
       *  @param {module:kld-intersections.Point2D} p4
       *  @param {module:kld-intersections.Point2D} r1
       *  @param {module:kld-intersections.Point2D} r2
       *  @returns {module:kld-intersections.Intersection}
       */

    }, {
      key: "intersectBezier3Rectangle",
      value: function intersectBezier3Rectangle(p1, p2, p3, p4, r1, r2) {
        var min = r1.min(r2);
        var max = r1.max(r2);
        var topRight = new Point2D(max.x, min.y);
        var bottomLeft = new Point2D(min.x, max.y);
        var inter1 = Intersection.intersectBezier3Line(p1, p2, p3, p4, min, topRight);
        var inter2 = Intersection.intersectBezier3Line(p1, p2, p3, p4, topRight, max);
        var inter3 = Intersection.intersectBezier3Line(p1, p2, p3, p4, max, bottomLeft);
        var inter4 = Intersection.intersectBezier3Line(p1, p2, p3, p4, bottomLeft, min);
        var result = new Intersection("No Intersection");
        result.appendPoints(inter1.points);
        result.appendPoints(inter2.points);
        result.appendPoints(inter3.points);
        result.appendPoints(inter4.points);

        if (result.points.length > 0) {
          result.status = "Intersection";
        }

        return result;
      }
      /**
       *  intersectCircleCircle
       *
       *  @param {module:kld-intersections.Point2D} c1
       *  @param {number} r1
       *  @param {module:kld-intersections.Point2D} c2
       *  @param {number} r2
       *  @returns {module:kld-intersections.Intersection}
       */

    }, {
      key: "intersectCircleCircle",
      value: function intersectCircleCircle(c1, r1, c2, r2) {
        var result; // Determine minimum and maximum radii where circles can intersect

        var r_max = r1 + r2;
        var r_min = Math.abs(r1 - r2); // Determine actual distance between circle circles

        var c_dist = c1.distanceFrom(c2);

        if (c_dist > r_max) {
          result = new Intersection("Outside");
        } else if (c_dist < r_min) {
          result = new Intersection("Inside");
        } else {
          result = new Intersection("Intersection");
          var a = (r1 * r1 - r2 * r2 + c_dist * c_dist) / (2 * c_dist);
          var h = Math.sqrt(r1 * r1 - a * a);
          var p = c1.lerp(c2, a / c_dist);
          var b = h / c_dist;
          result.points.push(new Point2D(p.x - b * (c2.y - c1.y), p.y + b * (c2.x - c1.x)));
          result.points.push(new Point2D(p.x + b * (c2.y - c1.y), p.y - b * (c2.x - c1.x)));
        }

        return result;
      }
      /**
       *  intersectCircleEllipse
       *
       *  @param {module:kld-intersections.Point2D} cc
       *  @param {number} r
       *  @param {module:kld-intersections.Point2D} ec
       *  @param {number} rx
       *  @param {number} ry
       *  @returns {module:kld-intersections.Intersection}
       */

    }, {
      key: "intersectCircleEllipse",
      value: function intersectCircleEllipse(cc, r, ec, rx, ry) {
        return Intersection.intersectEllipseEllipse(cc, r, r, ec, rx, ry);
      }
      /**
       *  intersectCircleLine
       *
       *  @param {module:kld-intersections.Point2D} c
       *  @param {number} r
       *  @param {module:kld-intersections.Point2D} a1
       *  @param {module:kld-intersections.Point2D} a2
       *  @returns {module:kld-intersections.Intersection}
       */

    }, {
      key: "intersectCircleLine",
      value: function intersectCircleLine(c, r, a1, a2) {
        var result;
        var a = (a2.x - a1.x) * (a2.x - a1.x) + (a2.y - a1.y) * (a2.y - a1.y);
        var b = 2 * ((a2.x - a1.x) * (a1.x - c.x) + (a2.y - a1.y) * (a1.y - c.y));
        var cc = c.x * c.x + c.y * c.y + a1.x * a1.x + a1.y * a1.y - 2 * (c.x * a1.x + c.y * a1.y) - r * r;
        var deter = b * b - 4 * a * cc;

        if (deter < 0) {
          result = new Intersection("Outside");
        } else if (deter === 0) {
          result = new Intersection("Tangent"); // NOTE: should calculate this point
        } else {
          var e = Math.sqrt(deter);
          var u1 = (-b + e) / (2 * a);
          var u2 = (-b - e) / (2 * a);

          if ((u1 < 0 || u1 > 1) && (u2 < 0 || u2 > 1)) {
            if (u1 < 0 && u2 < 0 || u1 > 1 && u2 > 1) {
              result = new Intersection("Outside");
            } else {
              result = new Intersection("Inside");
            }
          } else {
            result = new Intersection("Intersection");

            if (0 <= u1 && u1 <= 1) {
              result.points.push(a1.lerp(a2, u1));
            }

            if (0 <= u2 && u2 <= 1) {
              result.points.push(a1.lerp(a2, u2));
            }
          }
        }

        return result;
      }
      /**
       *  intersectCirclePolygon
       *
       *  @param {module:kld-intersections.Point2D} c
       *  @param {number} r
       *  @param {Array<module:kld-intersections.Point2D>} points
       *  @returns {module:kld-intersections.Intersection}
       */

    }, {
      key: "intersectCirclePolygon",
      value: function intersectCirclePolygon(c, r, points) {
        return Intersection.intersectCirclePolyline(c, r, closePolygon(points));
      }
      /**
       *  intersectCirclePolyline
       *
       *  @param {module:kld-intersections.Point2D} c
       *  @param {number} r
       *  @param {Array<module:kld-intersections.Point2D>} points
       *  @returns {module:kld-intersections.Intersection}
       */

    }, {
      key: "intersectCirclePolyline",
      value: function intersectCirclePolyline(c, r, points) {
        var result = new Intersection("No Intersection");
        var len = points.length;
        var inter;

        for (var i = 0; i < len - 1; i++) {
          var a1 = points[i];
          var a2 = points[i + 1];
          inter = Intersection.intersectCircleLine(c, r, a1, a2);
          result.appendPoints(inter.points);
        }

        if (result.points.length > 0) {
          result.status = "Intersection";
        } else {
          result.status = inter.status;
        }

        return result;
      }
      /**
       *  intersectCircleRectangle
       *
       *  @param {module:kld-intersections.Point2D} c
       *  @param {number} r
       *  @param {module:kld-intersections.Point2D} r1
       *  @param {module:kld-intersections.Point2D} r2
       *  @returns {module:kld-intersections.Intersection}
       */

    }, {
      key: "intersectCircleRectangle",
      value: function intersectCircleRectangle(c, r, r1, r2) {
        var min = r1.min(r2);
        var max = r1.max(r2);
        var topRight = new Point2D(max.x, min.y);
        var bottomLeft = new Point2D(min.x, max.y);
        var inter1 = Intersection.intersectCircleLine(c, r, min, topRight);
        var inter2 = Intersection.intersectCircleLine(c, r, topRight, max);
        var inter3 = Intersection.intersectCircleLine(c, r, max, bottomLeft);
        var inter4 = Intersection.intersectCircleLine(c, r, bottomLeft, min);
        var result = new Intersection("No Intersection");
        result.appendPoints(inter1.points);
        result.appendPoints(inter2.points);
        result.appendPoints(inter3.points);
        result.appendPoints(inter4.points);

        if (result.points.length > 0) {
          result.status = "Intersection";
        } else {
          result.status = inter1.status;
        }

        return result;
      }
      /**
       *  intersectEllipseEllipse
       *
       *  This code is based on MgcIntr2DElpElp.cpp written by David Eberly.  His
       *  code along with many other excellent examples are avaiable at his site:
       *  http://www.magic-software.com
       *
       *  NOTE: Rotation will need to be added to this function
       *
       *  @param {module:kld-intersections.Point2D} c1
       *  @param {number} rx1
       *  @param {number} ry1
       *  @param {module:kld-intersections.Point2D} c2
       *  @param {number} rx2
       *  @param {number} ry2
       *  @returns {module:kld-intersections.Intersection}
       */

    }, {
      key: "intersectEllipseEllipse",
      value: function intersectEllipseEllipse(c1, rx1, ry1, c2, rx2, ry2) {
        var a = [ry1 * ry1, 0, rx1 * rx1, -2 * ry1 * ry1 * c1.x, -2 * rx1 * rx1 * c1.y, ry1 * ry1 * c1.x * c1.x + rx1 * rx1 * c1.y * c1.y - rx1 * rx1 * ry1 * ry1];
        var b = [ry2 * ry2, 0, rx2 * rx2, -2 * ry2 * ry2 * c2.x, -2 * rx2 * rx2 * c2.y, ry2 * ry2 * c2.x * c2.x + rx2 * rx2 * c2.y * c2.y - rx2 * rx2 * ry2 * ry2];
        var yPoly = bezout(a, b);
        var yRoots = yPoly.getRoots();
        var epsilon = 1e-3;
        var norm0 = (a[0] * a[0] + 2 * a[1] * a[1] + a[2] * a[2]) * epsilon;
        var norm1 = (b[0] * b[0] + 2 * b[1] * b[1] + b[2] * b[2]) * epsilon;
        var result = new Intersection("No Intersection");

        for (var y = 0; y < yRoots.length; y++) {
          var xPoly = new Polynomial(a[0], a[3] + yRoots[y] * a[1], a[5] + yRoots[y] * (a[4] + yRoots[y] * a[2]));
          var xRoots = xPoly.getRoots();

          for (var x = 0; x < xRoots.length; x++) {
            var tst = (a[0] * xRoots[x] + a[1] * yRoots[y] + a[3]) * xRoots[x] + (a[2] * yRoots[y] + a[4]) * yRoots[y] + a[5];

            if (Math.abs(tst) < norm0) {
              tst = (b[0] * xRoots[x] + b[1] * yRoots[y] + b[3]) * xRoots[x] + (b[2] * yRoots[y] + b[4]) * yRoots[y] + b[5];

              if (Math.abs(tst) < norm1) {
                result.appendPoint(new Point2D(xRoots[x], yRoots[y]));
              }
            }
          }
        }

        if (result.points.length > 0) {
          result.status = "Intersection";
        }

        return result;
      }
      /**
       *  intersectEllipseLine
       *
       *  NOTE: Rotation will need to be added to this function
       *
       *  @param {module:kld-intersections.Point2D} c
       *  @param {number} rx
       *  @param {number} ry
       *  @param {module:kld-intersections.Point2D} a1
       *  @param {module:kld-intersections.Point2D} a2
       *  @returns {module:kld-intersections.Intersection}
       */

    }, {
      key: "intersectEllipseLine",
      value: function intersectEllipseLine(c, rx, ry, a1, a2) {
        var result;
        var orign = new Vector2D(a1.x, a1.y);
        var dir = Vector2D.fromPoints(a1, a2);
        var center = new Vector2D(c.x, c.y);
        var diff = orign.subtract(center);
        var mDir = new Vector2D(dir.x / (rx * rx), dir.y / (ry * ry));
        var mDiff = new Vector2D(diff.x / (rx * rx), diff.y / (ry * ry));
        var a = dir.dot(mDir);
        var b = dir.dot(mDiff);
        c = diff.dot(mDiff) - 1.0;
        var d = b * b - a * c;

        if (d < 0) {
          result = new Intersection("Outside");
        } else if (d > 0) {
          var root = Math.sqrt(d); // eslint-disable-line no-shadow

          var t_a = (-b - root) / a;
          var t_b = (-b + root) / a;

          if ((t_a < 0 || 1 < t_a) && (t_b < 0 || 1 < t_b)) {
            if (t_a < 0 && t_b < 0 || t_a > 1 && t_b > 1) {
              result = new Intersection("Outside");
            } else {
              result = new Intersection("Inside");
            }
          } else {
            result = new Intersection("Intersection");

            if (0 <= t_a && t_a <= 1) {
              result.appendPoint(a1.lerp(a2, t_a));
            }

            if (0 <= t_b && t_b <= 1) {
              result.appendPoint(a1.lerp(a2, t_b));
            }
          }
        } else {
          var t = -b / a;

          if (0 <= t && t <= 1) {
            result = new Intersection("Intersection");
            result.appendPoint(a1.lerp(a2, t));
          } else {
            result = new Intersection("Outside");
          }
        }

        return result;
      }
      /**
       *  intersectEllipsePolygon
       *
       *  @param {module:kld-intersections.Point2D} c
       *  @param {number} rx
       *  @param {number} ry
       *  @param {Array<module:kld-intersections.Point2D>} points
       *  @returns {module:kld-intersections.Intersection}
       */

    }, {
      key: "intersectEllipsePolygon",
      value: function intersectEllipsePolygon(c, rx, ry, points) {
        return Intersection.intersectEllipsePolyline(c, rx, ry, closePolygon(points));
      }
      /**
       *  intersectEllipsePolyline
       *
       *  @param {module:kld-intersections.Point2D} c
       *  @param {number} rx
       *  @param {number} ry
       *  @param {Array<module:kld-intersections.Point2D>} points
       *  @returns {module:kld-intersections.Intersection}
       */

    }, {
      key: "intersectEllipsePolyline",
      value: function intersectEllipsePolyline(c, rx, ry, points) {
        var result = new Intersection("No Intersection");
        var len = points.length;

        for (var i = 0; i < len - 1; i++) {
          var b1 = points[i];
          var b2 = points[i + 1];
          var inter = Intersection.intersectEllipseLine(c, rx, ry, b1, b2);
          result.appendPoints(inter.points);
        }

        if (result.points.length > 0) {
          result.status = "Intersection";
        }

        return result;
      }
      /**
       *  intersectEllipseRectangle
       *
       *  @param {module:kld-intersections.Point2D} c
       *  @param {number} rx
       *  @param {number} ry
       *  @param {module:kld-intersections.Point2D} r1
       *  @param {module:kld-intersections.Point2D} r2
       *  @returns {module:kld-intersections.Intersection}
       */

    }, {
      key: "intersectEllipseRectangle",
      value: function intersectEllipseRectangle(c, rx, ry, r1, r2) {
        var min = r1.min(r2);
        var max = r1.max(r2);
        var topRight = new Point2D(max.x, min.y);
        var bottomLeft = new Point2D(min.x, max.y);
        var inter1 = Intersection.intersectEllipseLine(c, rx, ry, min, topRight);
        var inter2 = Intersection.intersectEllipseLine(c, rx, ry, topRight, max);
        var inter3 = Intersection.intersectEllipseLine(c, rx, ry, max, bottomLeft);
        var inter4 = Intersection.intersectEllipseLine(c, rx, ry, bottomLeft, min);
        var result = new Intersection("No Intersection");
        result.appendPoints(inter1.points);
        result.appendPoints(inter2.points);
        result.appendPoints(inter3.points);
        result.appendPoints(inter4.points);

        if (result.points.length > 0) {
          result.status = "Intersection";
        }

        return result;
      }
      /**
       *  intersectLineLine
       *
       *  @param {module:kld-intersections.Point2D} a1
       *  @param {module:kld-intersections.Point2D} a2
       *  @param {module:kld-intersections.Point2D} b1
       *  @param {module:kld-intersections.Point2D} b2
       *  @returns {module:kld-intersections.Intersection}
       */

    }, {
      key: "intersectLineLine",
      value: function intersectLineLine(a1, a2, b1, b2) {
        var result;
        var ua_t = (b2.x - b1.x) * (a1.y - b1.y) - (b2.y - b1.y) * (a1.x - b1.x);
        var ub_t = (a2.x - a1.x) * (a1.y - b1.y) - (a2.y - a1.y) * (a1.x - b1.x);
        var u_b = (b2.y - b1.y) * (a2.x - a1.x) - (b2.x - b1.x) * (a2.y - a1.y);

        if (u_b !== 0) {
          var ua = ua_t / u_b;
          var ub = ub_t / u_b;

          if (0 <= ua && ua <= 1 && 0 <= ub && ub <= 1) {
            result = new Intersection("Intersection");
            result.points.push(new Point2D(a1.x + ua * (a2.x - a1.x), a1.y + ua * (a2.y - a1.y)));
          } else {
            result = new Intersection("No Intersection");
          }
        } else if (ua_t === 0 || ub_t === 0) {
          result = new Intersection("Coincident");
        } else {
          result = new Intersection("Parallel");
        }

        return result;
      }
      /**
       *  intersectLinePolygon
       *
       *  @param {module:kld-intersections.Point2D} a1
       *  @param {module:kld-intersections.Point2D} a2
       *  @param {Array<module:kld-intersections.Point2D>} points
       *  @returns {module:kld-intersections.Intersection}
       */

    }, {
      key: "intersectLinePolygon",
      value: function intersectLinePolygon(a1, a2, points) {
        return Intersection.intersectLinePolyline(a1, a2, closePolygon(points));
      }
      /**
       *  intersectLinePolyline
       *
       *  @param {module:kld-intersections.Point2D} a1
       *  @param {module:kld-intersections.Point2D} a2
       *  @param {Array<module:kld-intersections.Point2D>} points
       *  @returns {module:kld-intersections.Intersection}
       */

    }, {
      key: "intersectLinePolyline",
      value: function intersectLinePolyline(a1, a2, points) {
        var result = new Intersection("No Intersection");
        var len = points.length;

        for (var i = 0; i < len - 1; i++) {
          var b1 = points[i];
          var b2 = points[i + 1];
          var inter = Intersection.intersectLineLine(a1, a2, b1, b2);
          result.appendPoints(inter.points);
        }

        if (result.points.length > 0) {
          result.status = "Intersection";
        }

        return result;
      }
      /**
       *  intersectLineRectangle
       *
       *  @param {module:kld-intersections.Point2D} a1
       *  @param {module:kld-intersections.Point2D} a2
       *  @param {module:kld-intersections.Point2D} r1
       *  @param {module:kld-intersections.Point2D} r2
       *  @returns {module:kld-intersections.Intersection}
       */

    }, {
      key: "intersectLineRectangle",
      value: function intersectLineRectangle(a1, a2, r1, r2) {
        var min = r1.min(r2);
        var max = r1.max(r2);
        var topRight = new Point2D(max.x, min.y);
        var bottomLeft = new Point2D(min.x, max.y);
        var inter1 = Intersection.intersectLineLine(min, topRight, a1, a2);
        var inter2 = Intersection.intersectLineLine(topRight, max, a1, a2);
        var inter3 = Intersection.intersectLineLine(max, bottomLeft, a1, a2);
        var inter4 = Intersection.intersectLineLine(bottomLeft, min, a1, a2);
        var result = new Intersection("No Intersection");
        result.appendPoints(inter1.points);
        result.appendPoints(inter2.points);
        result.appendPoints(inter3.points);
        result.appendPoints(inter4.points);

        if (result.points.length > 0) {
          result.status = "Intersection";
        }

        return result;
      }
      /**
       *  intersectPolygonPolygon
       *
       *  @param {Array<module:kld-intersections.Point2D>} points1
       *  @param {Array<module:kld-intersections.Point2D>} points2
       *  @returns {module:kld-intersections.Intersection}
       */

    }, {
      key: "intersectPolygonPolygon",
      value: function intersectPolygonPolygon(points1, points2) {
        return Intersection.intersectPolylinePolyline(closePolygon(points1), closePolygon(points2));
      }
      /**
       *  intersectPolygonPolyline
       *
       *  @param {Array<module:kld-intersections.Point2D>} points1
       *  @param {Array<module:kld-intersections.Point2D>} points2
       *  @returns {module:kld-intersections.Intersection}
       */

    }, {
      key: "intersectPolygonPolyline",
      value: function intersectPolygonPolyline(points1, points2) {
        return Intersection.intersectPolylinePolyline(closePolygon(points1), points2);
      }
      /**
       *  intersectPolygonRectangle
       *
       *  @param {Array<module:kld-intersections.Point2D>} points
       *  @param {module:kld-intersections.Point2D} r1
       *  @param {module:kld-intersections.Point2D} r2
       *  @returns {module:kld-intersections.Intersection}
       */

    }, {
      key: "intersectPolygonRectangle",
      value: function intersectPolygonRectangle(points, r1, r2) {
        return Intersection.intersectPolylineRectangle(closePolygon(points), r1, r2);
      }
      /**
       *  intersectPolylinePolyline
       *
       *  @param {Array<module:kld-intersections.Point2D>} points1
       *  @param {Array<module:kld-intersections.Point2D>} points2
       *  @returns {module:kld-intersections.Intersection}
       */

    }, {
      key: "intersectPolylinePolyline",
      value: function intersectPolylinePolyline(points1, points2) {
        var result = new Intersection("No Intersection");
        var len = points1.length;

        for (var i = 0; i < len - 1; i++) {
          var a1 = points1[i];
          var a2 = points1[i + 1];
          var inter = Intersection.intersectLinePolyline(a1, a2, points2);
          result.appendPoints(inter.points);
        }

        if (result.points.length > 0) {
          result.status = "Intersection";
        }

        return result;
      }
      /**
       *  intersectPolylineRectangle
       *
       *  @param {Array<module:kld-intersections.Point2D>} points
       *  @param {module:kld-intersections.Point2D} r1
       *  @param {module:kld-intersections.Point2D} r2
       *  @returns {module:kld-intersections.Intersection}
       */

    }, {
      key: "intersectPolylineRectangle",
      value: function intersectPolylineRectangle(points, r1, r2) {
        var min = r1.min(r2);
        var max = r1.max(r2);
        var topRight = new Point2D(max.x, min.y);
        var bottomLeft = new Point2D(min.x, max.y);
        var inter1 = Intersection.intersectLinePolyline(min, topRight, points);
        var inter2 = Intersection.intersectLinePolyline(topRight, max, points);
        var inter3 = Intersection.intersectLinePolyline(max, bottomLeft, points);
        var inter4 = Intersection.intersectLinePolyline(bottomLeft, min, points);
        var result = new Intersection("No Intersection");
        result.appendPoints(inter1.points);
        result.appendPoints(inter2.points);
        result.appendPoints(inter3.points);
        result.appendPoints(inter4.points);

        if (result.points.length > 0) {
          result.status = "Intersection";
        }

        return result;
      }
      /**
       *  intersectRectangleRectangle
       *
       *  @param {module:kld-intersections.Point2D} a1
       *  @param {module:kld-intersections.Point2D} a2
       *  @param {module:kld-intersections.Point2D} b1
       *  @param {module:kld-intersections.Point2D} b2
       *  @returns {module:kld-intersections.Intersection}
       */

    }, {
      key: "intersectRectangleRectangle",
      value: function intersectRectangleRectangle(a1, a2, b1, b2) {
        var min = a1.min(a2);
        var max = a1.max(a2);
        var topRight = new Point2D(max.x, min.y);
        var bottomLeft = new Point2D(min.x, max.y);
        var inter1 = Intersection.intersectLineRectangle(min, topRight, b1, b2);
        var inter2 = Intersection.intersectLineRectangle(topRight, max, b1, b2);
        var inter3 = Intersection.intersectLineRectangle(max, bottomLeft, b1, b2);
        var inter4 = Intersection.intersectLineRectangle(bottomLeft, min, b1, b2);
        var result = new Intersection("No Intersection");
        result.appendPoints(inter1.points);
        result.appendPoints(inter2.points);
        result.appendPoints(inter3.points);
        result.appendPoints(inter4.points);

        if (result.points.length > 0) {
          result.status = "Intersection";
        }

        return result;
      }
      /**
       *  intersectRayRay
       *
       *  @param {module:kld-intersections.Point2D} a1
       *  @param {module:kld-intersections.Point2D} a2
       *  @param {module:kld-intersections.Point2D} b1
       *  @param {module:kld-intersections.Point2D} b2
       *  @returns {module:kld-intersections.Intersection}
       */

    }, {
      key: "intersectRayRay",
      value: function intersectRayRay(a1, a2, b1, b2) {
        var result;
        var ua_t = (b2.x - b1.x) * (a1.y - b1.y) - (b2.y - b1.y) * (a1.x - b1.x);
        var ub_t = (a2.x - a1.x) * (a1.y - b1.y) - (a2.y - a1.y) * (a1.x - b1.x);
        var u_b = (b2.y - b1.y) * (a2.x - a1.x) - (b2.x - b1.x) * (a2.y - a1.y);

        if (u_b !== 0) {
          var ua = ua_t / u_b;
          result = new Intersection("Intersection");
          result.points.push(new Point2D(a1.x + ua * (a2.x - a1.x), a1.y + ua * (a2.y - a1.y)));
        } else if (ua_t === 0 || ub_t === 0) {
          result = new Intersection("Coincident");
        } else {
          result = new Intersection("Parallel");
        }

        return result;
      }
    }]);

    return Intersection;
  }();

  /**
   * Build shapes for intersection
   */

  var Shapes = /*#__PURE__*/function () {
    function Shapes() {
      _classCallCheck(this, Shapes);
    }

    _createClass(Shapes, null, [{
      key: "arc",

      /**
       *  arc
       *
       *  @deprecated use ShapeInfo.arc
       *  @param {number} centerX
       *  @param {number} centerY
       *  @param {number} radiusX
       *  @param {number} radiusY
       *  @param {number} startRadians
       *  @param {number} endRadians
       *  @returns {module:kld-intersections.ShapeInfo}
       */
      value: function arc(centerX, centerY, radiusX, radiusY, startRadians, endRadians) {
        return ShapeInfo.arc.apply(ShapeInfo, arguments);
      }
      /**
       *  quadraticBezier
       *
       *  @deprecated use ShapeInfo.quadraticBezier
       *  @param {number} p1x
       *  @param {number} p1y
       *  @param {number} p2x
       *  @param {number} p2y
       *  @param {number} p3x
       *  @param {number} p3y
       *  @returns {module:kld-intersections.ShapeInfo}
       */

    }, {
      key: "quadraticBezier",
      value: function quadraticBezier(p1x, p1y, p2x, p2y, p3x, p3y) {
        return ShapeInfo.quadraticBezier.apply(ShapeInfo, arguments);
      }
      /**
       *  cubicBezier
       *
       *  @deprecated use ShapeInfo.cubicBezier
       *  @param {number} p1x
       *  @param {number} p1y
       *  @param {number} p2x
       *  @param {number} p2y
       *  @param {number} p3x
       *  @param {number} p3y
       *  @param {number} p4x
       *  @param {number} p4y
       *  @returns {module:kld-intersections.ShapeInfo}
       */

    }, {
      key: "cubicBezier",
      value: function cubicBezier(p1x, p1y, p2x, p2y, p3x, p3y, p4x, p4y) {
        return ShapeInfo.cubicBezier.apply(ShapeInfo, arguments);
      }
      /**
       *  circle
       *
       *  @deprecated use ShapeInfo.circle
       *  @param {number} centerX
       *  @param {number} centerY
       *  @param {number} radius
       *  @returns {module:kld-intersections.ShapeInfo}
       */

    }, {
      key: "circle",
      value: function circle(centerX, centerY, radius) {
        return ShapeInfo.circle.apply(ShapeInfo, arguments);
      }
      /**
       *  ellipse
       *
       *  @deprecated use ShapeInfo.ellipse
       *  @param {number} centerX
       *  @param {number} centerY
       *  @param {number} radiusX
       *  @param {number} radiusY
       *  @returns {module:kld-intersections.ShapeInfo}
       */

    }, {
      key: "ellipse",
      value: function ellipse(centerX, centerY, radiusX, radiusY) {
        return ShapeInfo.ellipse.apply(ShapeInfo, arguments);
      }
      /**
       *  line
       *
       *  @deprecated use ShapeInfo.line
       *  @param {number} p1x
       *  @param {number} p1y
       *  @param {number} p2x
       *  @param {number} p2y
       *  @returns {module:kld-intersections.ShapeInfo}
       */

    }, {
      key: "line",
      value: function line(p1x, p1y, p2x, p2y) {
        return ShapeInfo.line.apply(ShapeInfo, arguments);
      }
      /**
       *  path
       *
       *  @deprecated use ShapeInfo.path
       *  @param {string} pathData
       *  @returns {module:kld-intersections.ShapeInfo}
       */

    }, {
      key: "path",
      value: function path(pathData) {
        return ShapeInfo.path.apply(ShapeInfo, arguments);
      }
      /**
       *  polygon
       *
       *  @deprecated use ShapeInfo.polygon
       *  @param {Array<number>} coords
       *  @returns {module:kld-intersections.ShapeInfo}
       */

    }, {
      key: "polygon",
      value: function polygon(coords) {
        return ShapeInfo.polygon.apply(ShapeInfo, arguments);
      }
      /**
       *  polyline
       *
       *  @deprecated use ShapeInfo.polyline
       *  @param {Array<number>} coords
       *  @returns {module:kld-intersections.ShapeInfo}
       */

    }, {
      key: "polyline",
      value: function polyline(coords) {
        return ShapeInfo.polyline.apply(ShapeInfo, arguments);
      }
      /**
       *  rectangle
       *
       *  @deprecated use ShapeInfo.rectangle
       *  @param {number} x
       *  @param {number} y
       *  @param {number} width
       *  @param {number} height
       *  @param {number} [rx]
       *  @param {number} [ry]
       *  @returns {module:kld-intersections.ShapeInfo}
       */

    }, {
      key: "rectangle",
      value: function rectangle(x, y, width, height) {
        return ShapeInfo.rectangle.apply(ShapeInfo, arguments);
      }
    }]);

    return Shapes;
  }();

  /**
   * Build shapes for intersection
   */

  var AffineShapes = /*#__PURE__*/function () {
    function AffineShapes() {
      _classCallCheck(this, AffineShapes);
    }

    _createClass(AffineShapes, null, [{
      key: "arc",

      /**
       *  arc
       *
       *  @deprecated use ShapeInfo.arc
       *  @param {module:kld-intersections.Point2D} center
       *  @param {number} radiusX
       *  @param {number} radiusY
       *  @param {number} startRadians
       *  @param {number} endRadians
       *  @returns {module:kld-intersections.ShapeInfo}
       */
      value: function arc(center, radiusX, radiusY, startRadians, endRadians) {
        return ShapeInfo.arc.apply(ShapeInfo, arguments);
      }
      /**
       *  quadraticBezier
       *
       *   @deprecated use ShapeInfo.quadraticBezier
       *  @param {module:kld-intersections.Point2D} p1
       *  @param {module:kld-intersections.Point2D} p2
       *  @param {module:kld-intersections.Point2D} p3
       *  @returns {module:kld-intersections.ShapeInfo}
       */

    }, {
      key: "quadraticBezier",
      value: function quadraticBezier(p1, p2, p3) {
        return ShapeInfo.quadraticBezier.apply(ShapeInfo, arguments);
      }
      /**
       *  cubicBezier
       *
       *  @deprecated use ShapeInfo.cubicBezier
       *  @param {module:kld-intersections.Point2D} p1
       *  @param {module:kld-intersections.Point2D} p2
       *  @param {module:kld-intersections.Point2D} p3
       *  @param {module:kld-intersections.Point2D} p4
       *  @returns {module:kld-intersections.ShapeInfo}
       */

    }, {
      key: "cubicBezier",
      value: function cubicBezier(p1, p2, p3, p4) {
        return ShapeInfo.cubicBezier.apply(ShapeInfo, arguments);
      }
      /**
       *  circle
       *
       *  @deprecated use ShapeInfo.circle
       *  @param {module:kld-intersections.Point2D} center
       *  @param {number} radius
       *  @returns {module:kld-intersections.ShapeInfo}
       */

    }, {
      key: "circle",
      value: function circle(center, radius) {
        return ShapeInfo.circle.apply(ShapeInfo, arguments);
      }
      /**
       *  ellipse
       *
       *  @deprecated use ShapeInfo.ellipse
       *  @param {module:kld-intersections.Point2D} center
       *  @param {number} radiusX
       *  @param {number} radiusY
       *  @returns {module:kld-intersections.ShapeInfo}
       */

    }, {
      key: "ellipse",
      value: function ellipse(center, radiusX, radiusY) {
        return ShapeInfo.ellipse.apply(ShapeInfo, arguments);
      }
      /**
       *  line
       *
       *  @deprecated use ShapeInfo.line
       *  @param {module:kld-intersections.Point2D} p1
       *  @param {module:kld-intersections.Point2D} p2
       *  @returns {module:kld-intersections.ShapeInfo}
       */

    }, {
      key: "line",
      value: function line(p1, p2) {
        return ShapeInfo.line.apply(ShapeInfo, arguments);
      }
      /**
       *  path
       *
       *  @deprecated use ShapeInfo.path
       *  @param {string} pathData
       *  @returns {module:kld-intersections.ShapeInfo}
       */

    }, {
      key: "path",
      value: function path(pathData) {
        return ShapeInfo.path.apply(ShapeInfo, arguments);
      }
      /**
       *  polygon
       *
       *  @deprecated use ShapeInfo.polygon
       *  @param {Array<module:kld-intersections.Point2D>} points
       *  @returns {module:kld-intersections.ShapeInfo}
       */

    }, {
      key: "polygon",
      value: function polygon(points) {
        return ShapeInfo.polygon.apply(ShapeInfo, arguments);
      }
      /**
       *  polyline
       *
       *  @deprecated use ShapeInfo.polyline
       *  @param {Array<module:kld-intersections.Point2D>} points
       *  @returns {module:kld-intersections.ShapeInfo}
       */

    }, {
      key: "polyline",
      value: function polyline(points) {
        return ShapeInfo.polyline.apply(ShapeInfo, arguments);
      }
      /**
       *  rectangle
       *
       *  @deprecated use ShapeInfo.rectangle
       *  @param {module:kld-intersections.Point2D} topLeft
       *  @param {module:kld-intersections.Vector2D} size
       *  @param {number} [rx]
       *  @param {number} [ry]
       *  @returns {module:kld-intersections.ShapeInfo}
       */

    }, {
      key: "rectangle",
      value: function rectangle(topLeft, size) {
        return ShapeInfo.rectangle.apply(ShapeInfo, arguments);
      }
    }]);

    return AffineShapes;
  }();

  var SvgShapes = /*#__PURE__*/function () {
    function SvgShapes() {
      _classCallCheck(this, SvgShapes);
    }

    _createClass(SvgShapes, null, [{
      key: "circle",

      /**
       * circle
       *
       * @param {SVGCircleElement} circle
       * @returns {module:kld-intersections.ShapeInfo}
       */
      value: function circle(_circle) {
        if (_circle instanceof SVGCircleElement === false) {
          throw new TypeError("Expected SVGCircleElement, but found ".concat(_circle));
        }

        var center = new Point2D(_circle.cx.baseVal.value, _circle.cy.baseVal.value);
        var radius = _circle.r.baseVal.value;
        return ShapeInfo.circle(center, radius);
      }
      /**
       * ellipse
       *
       * @param {SVGEllipseElement} ellipse
       * @returns {module:kld-intersections.ShapeInfo}
       */

    }, {
      key: "ellipse",
      value: function ellipse(_ellipse) {
        if (_ellipse instanceof SVGEllipseElement === false) {
          throw new TypeError("Expected SVGEllipseElement, but found ".concat(_ellipse));
        }

        var center = new Point2D(_ellipse.cx.baseVal.value, _ellipse.cy.baseVal.value);
        var radiusX = _ellipse.rx.baseVal.value;
        var radiusY = _ellipse.ry.baseVal.value;
        return ShapeInfo.ellipse(center, radiusX, radiusY);
      }
      /**
       * line
       *
       * @param {SVGLineElement} line
       * @returns {module:kld-intersections.ShapeInfo}
       */

    }, {
      key: "line",
      value: function line(_line) {
        if (_line instanceof SVGLineElement === false) {
          throw new TypeError("Expected SVGLineElement, but found ".concat(_line));
        }

        var p1 = new Point2D(_line.x1.baseVal.value, _line.y1.baseVal.value);
        var p2 = new Point2D(_line.x2.baseVal.value, _line.y2.baseVal.value);
        return ShapeInfo.line(p1, p2);
      }
      /**
       * path
       *
       * @param {SVGPathElement} path
       * @returns {module:kld-intersections.ShapeInfo}
       */

    }, {
      key: "path",
      value: function path(_path) {
        if (_path instanceof SVGPathElement === false) {
          throw new TypeError("Expected SVGPathElement, but found ".concat(_path));
        }

        var pathData = _path.getAttributeNS(null, "d");

        return ShapeInfo.path(pathData);
      }
      /**
       * polygon
       *
       * @param {SVGPolygonElement} polygon
       * @returns {module:kld-intersections.ShapeInfo}
       */

    }, {
      key: "polygon",
      value: function polygon(_polygon) {
        if (_polygon instanceof SVGPolygonElement === false) {
          throw new TypeError("Expected SVGPolygonElement, but found ".concat(_polygon));
        }

        var points = [];

        for (var i = 0; i < _polygon.points.numberOfItems; i++) {
          var point = _polygon.points.getItem(i);

          points.push(new Point2D(point.x, point.y));
        }

        return ShapeInfo.polygon(points);
      }
      /**
       * polyline
       *
       * @param {SVGPolylineElement} polyline
       * @returns {module:kld-intersections.ShapeInfo}
       */

    }, {
      key: "polyline",
      value: function polyline(_polyline) {
        if (_polyline instanceof SVGPolylineElement === false) {
          throw new TypeError("Expected SVGPolylineElement, but found ".concat(_polyline));
        }

        var points = [];

        for (var i = 0; i < _polyline.points.numberOfItems; i++) {
          var point = _polyline.points.getItem(i);

          points.push(new Point2D(point.x, point.y));
        }

        return ShapeInfo.polyline(points);
      }
      /**
       * rect
       *
       * @param {SVGRectElement} rect
       * @returns {module:kld-intersections.ShapeInfo}
       */

    }, {
      key: "rect",
      value: function rect(_rect) {
        if (_rect instanceof SVGRectElement === false) {
          throw new TypeError("Expected SVGRectElement, but found ".concat(_rect));
        }

        return ShapeInfo.rectangle(_rect.x.baseVal.value, _rect.y.baseVal.value, _rect.width.baseVal.value, _rect.height.baseVal.value, _rect.rx.baseVal.value, _rect.ry.baseVal.value);
      }
      /**
       * element
       *
       * @param {SVGElement} element
       * @returns {module:kld-intersections.ShapeInfo}
       */

    }, {
      key: "element",
      value: function element(_element) {
        if (_element instanceof SVGElement === false) {
          throw new TypeError("Expected SVGElement, but found ".concat(_element));
        }
        /* eslint-disable-next-line prefer-destructuring */


        var tagName = _element.tagName;

        switch (tagName) {
          case "circle":
            return SvgShapes.circle(_element);

          case "ellipse":
            return SvgShapes.ellipse(_element);

          case "line":
            return SvgShapes.line(_element);

          case "path":
            return SvgShapes.path(_element);

          case "polygon":
            return SvgShapes.polygon(_element);

          case "polyline":
            return SvgShapes.polyline(_element);

          case "rect":
            return SvgShapes.rect(_element);

          default:
            throw new TypeError("Unrecognized element type: '".concat(tagName, "'"));
        }
      }
    }]);

    return SvgShapes;
  }();

  /**
   *
   *  IntersectionQuery.js
   *
   *  @copyright 2017 Kevin Lindsey
   * @module IntersectionQuery
   */
  /**
   * @namespace
   */

  var IntersectionQuery = {};
  /**
   *  pointInCircle
   *
   *  @param {module:kld-intersections.Point2D} point
   *  @param {module:kld-intersections.Point2D} center
   *  @param {number} radius
   *  @returns {boolean}
   */

  IntersectionQuery.pointInCircle = function (point, center, radius) {
    var v = Vector2D.fromPoints(center, point);
    return v.length() <= radius;
  };
  /**
   *  pointInEllipse
   *
   *  @param {module:kld-intersections.Point2D} point
   *  @param {module:kld-intersections.Point2D} center
   *  @param {number} radiusX
   *  @param {number} radiusY
   *  @returns {boolean}
   */


  IntersectionQuery.pointInEllipse = function (point, center, radiusX, radiusY) {
    var len = point.subtract(center);
    return len.x * len.x / (radiusX * radiusX) + len.y * len.y / (radiusY * radiusY) <= 1;
  };
  /**
   *  pointInPolyline
   *
   *  @param {module:kld-intersections.Point2D} point
   *  @param {Array<module:kld-intersections.Point2D>} points
   */


  IntersectionQuery.pointInPolyline = function (point, points) {
    var len = points.length;
    var counter = 0;
    var xInter;
    var p1 = points[0];

    for (var i = 1; i <= len; i++) {
      var p2 = points[i % len];
      var minY = Math.min(p1.y, p2.y);
      var maxY = Math.max(p1.y, p2.y);
      var maxX = Math.max(p1.x, p2.x);

      if (p1.y !== p2.y && minY < point.y && point.y <= maxY && point.x <= maxX) {
        xInter = (point.y - p1.y) * (p2.x - p1.x) / (p2.y - p1.y) + p1.x;

        if (p1.x === p2.x || point.x <= xInter) {
          counter++;
        }
      }

      p1 = p2;
    }

    return counter % 2 === 1;
  };
  /**
   *  pointInPolyline
   *
   *  @param {module:kld-intersections.Point2D} point
   *  @param {Array<module:kld-intersections.Point2D>} points
   */


  IntersectionQuery.pointInPolygon = IntersectionQuery.pointInPolyline;
  /**
   *  pointInRectangle
   *
   *  @param {module:kld-intersections.Point2D} point
   *  @param {module:kld-intersections.Point2D} topLeft
   *  @param {module:kld-intersections.Point2D} bottomRight
   *  @returns {boolean}
   */

  IntersectionQuery.pointInRectangle = function (point, topLeft, bottomRight) {
    return topLeft.x <= point.x && point.x < bottomRight.x && topLeft.y <= point.y && point.y < bottomRight.y;
  };

  exports.AffineShapes = AffineShapes;
  exports.Intersection = Intersection;
  exports.IntersectionArgs = ShapeInfo;
  exports.IntersectionQuery = IntersectionQuery;
  exports.Matrix2D = Matrix2D;
  exports.Point2D = Point2D;
  exports.ShapeInfo = ShapeInfo;
  exports.Shapes = Shapes;
  exports.SvgShapes = SvgShapes;
  exports.Vector2D = Vector2D;

  Object.defineProperty(exports, '__esModule', { value: true });

})));

},{}],100:[function(require,module,exports){
(function (process,global){(function (){
/*! *****************************************************************************
Copyright (C) Microsoft. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */
var Reflect;
(function (Reflect) {
    // Metadata Proposal
    // https://rbuckton.github.io/reflect-metadata/
    (function (factory) {
        var root = typeof global === "object" ? global :
            typeof self === "object" ? self :
                typeof this === "object" ? this :
                    Function("return this;")();
        var exporter = makeExporter(Reflect);
        if (typeof root.Reflect === "undefined") {
            root.Reflect = Reflect;
        }
        else {
            exporter = makeExporter(root.Reflect, exporter);
        }
        factory(exporter);
        function makeExporter(target, previous) {
            return function (key, value) {
                if (typeof target[key] !== "function") {
                    Object.defineProperty(target, key, { configurable: true, writable: true, value: value });
                }
                if (previous)
                    previous(key, value);
            };
        }
    })(function (exporter) {
        var hasOwn = Object.prototype.hasOwnProperty;
        // feature test for Symbol support
        var supportsSymbol = typeof Symbol === "function";
        var toPrimitiveSymbol = supportsSymbol && typeof Symbol.toPrimitive !== "undefined" ? Symbol.toPrimitive : "@@toPrimitive";
        var iteratorSymbol = supportsSymbol && typeof Symbol.iterator !== "undefined" ? Symbol.iterator : "@@iterator";
        var supportsCreate = typeof Object.create === "function"; // feature test for Object.create support
        var supportsProto = { __proto__: [] } instanceof Array; // feature test for __proto__ support
        var downLevel = !supportsCreate && !supportsProto;
        var HashMap = {
            // create an object in dictionary mode (a.k.a. "slow" mode in v8)
            create: supportsCreate
                ? function () { return MakeDictionary(Object.create(null)); }
                : supportsProto
                    ? function () { return MakeDictionary({ __proto__: null }); }
                    : function () { return MakeDictionary({}); },
            has: downLevel
                ? function (map, key) { return hasOwn.call(map, key); }
                : function (map, key) { return key in map; },
            get: downLevel
                ? function (map, key) { return hasOwn.call(map, key) ? map[key] : undefined; }
                : function (map, key) { return map[key]; },
        };
        // Load global or shim versions of Map, Set, and WeakMap
        var functionPrototype = Object.getPrototypeOf(Function);
        var usePolyfill = typeof process === "object" && process.env && process.env["REFLECT_METADATA_USE_MAP_POLYFILL"] === "true";
        var _Map = !usePolyfill && typeof Map === "function" && typeof Map.prototype.entries === "function" ? Map : CreateMapPolyfill();
        var _Set = !usePolyfill && typeof Set === "function" && typeof Set.prototype.entries === "function" ? Set : CreateSetPolyfill();
        var _WeakMap = !usePolyfill && typeof WeakMap === "function" ? WeakMap : CreateWeakMapPolyfill();
        // [[Metadata]] internal slot
        // https://rbuckton.github.io/reflect-metadata/#ordinary-object-internal-methods-and-internal-slots
        var Metadata = new _WeakMap();
        /**
         * Applies a set of decorators to a property of a target object.
         * @param decorators An array of decorators.
         * @param target The target object.
         * @param propertyKey (Optional) The property key to decorate.
         * @param attributes (Optional) The property descriptor for the target key.
         * @remarks Decorators are applied in reverse order.
         * @example
         *
         *     class Example {
         *         // property declarations are not part of ES6, though they are valid in TypeScript:
         *         // static staticProperty;
         *         // property;
         *
         *         constructor(p) { }
         *         static staticMethod(p) { }
         *         method(p) { }
         *     }
         *
         *     // constructor
         *     Example = Reflect.decorate(decoratorsArray, Example);
         *
         *     // property (on constructor)
         *     Reflect.decorate(decoratorsArray, Example, "staticProperty");
         *
         *     // property (on prototype)
         *     Reflect.decorate(decoratorsArray, Example.prototype, "property");
         *
         *     // method (on constructor)
         *     Object.defineProperty(Example, "staticMethod",
         *         Reflect.decorate(decoratorsArray, Example, "staticMethod",
         *             Object.getOwnPropertyDescriptor(Example, "staticMethod")));
         *
         *     // method (on prototype)
         *     Object.defineProperty(Example.prototype, "method",
         *         Reflect.decorate(decoratorsArray, Example.prototype, "method",
         *             Object.getOwnPropertyDescriptor(Example.prototype, "method")));
         *
         */
        function decorate(decorators, target, propertyKey, attributes) {
            if (!IsUndefined(propertyKey)) {
                if (!IsArray(decorators))
                    throw new TypeError();
                if (!IsObject(target))
                    throw new TypeError();
                if (!IsObject(attributes) && !IsUndefined(attributes) && !IsNull(attributes))
                    throw new TypeError();
                if (IsNull(attributes))
                    attributes = undefined;
                propertyKey = ToPropertyKey(propertyKey);
                return DecorateProperty(decorators, target, propertyKey, attributes);
            }
            else {
                if (!IsArray(decorators))
                    throw new TypeError();
                if (!IsConstructor(target))
                    throw new TypeError();
                return DecorateConstructor(decorators, target);
            }
        }
        exporter("decorate", decorate);
        // 4.1.2 Reflect.metadata(metadataKey, metadataValue)
        // https://rbuckton.github.io/reflect-metadata/#reflect.metadata
        /**
         * A default metadata decorator factory that can be used on a class, class member, or parameter.
         * @param metadataKey The key for the metadata entry.
         * @param metadataValue The value for the metadata entry.
         * @returns A decorator function.
         * @remarks
         * If `metadataKey` is already defined for the target and target key, the
         * metadataValue for that key will be overwritten.
         * @example
         *
         *     // constructor
         *     @Reflect.metadata(key, value)
         *     class Example {
         *     }
         *
         *     // property (on constructor, TypeScript only)
         *     class Example {
         *         @Reflect.metadata(key, value)
         *         static staticProperty;
         *     }
         *
         *     // property (on prototype, TypeScript only)
         *     class Example {
         *         @Reflect.metadata(key, value)
         *         property;
         *     }
         *
         *     // method (on constructor)
         *     class Example {
         *         @Reflect.metadata(key, value)
         *         static staticMethod() { }
         *     }
         *
         *     // method (on prototype)
         *     class Example {
         *         @Reflect.metadata(key, value)
         *         method() { }
         *     }
         *
         */
        function metadata(metadataKey, metadataValue) {
            function decorator(target, propertyKey) {
                if (!IsObject(target))
                    throw new TypeError();
                if (!IsUndefined(propertyKey) && !IsPropertyKey(propertyKey))
                    throw new TypeError();
                OrdinaryDefineOwnMetadata(metadataKey, metadataValue, target, propertyKey);
            }
            return decorator;
        }
        exporter("metadata", metadata);
        /**
         * Define a unique metadata entry on the target.
         * @param metadataKey A key used to store and retrieve metadata.
         * @param metadataValue A value that contains attached metadata.
         * @param target The target object on which to define metadata.
         * @param propertyKey (Optional) The property key for the target.
         * @example
         *
         *     class Example {
         *         // property declarations are not part of ES6, though they are valid in TypeScript:
         *         // static staticProperty;
         *         // property;
         *
         *         constructor(p) { }
         *         static staticMethod(p) { }
         *         method(p) { }
         *     }
         *
         *     // constructor
         *     Reflect.defineMetadata("custom:annotation", options, Example);
         *
         *     // property (on constructor)
         *     Reflect.defineMetadata("custom:annotation", options, Example, "staticProperty");
         *
         *     // property (on prototype)
         *     Reflect.defineMetadata("custom:annotation", options, Example.prototype, "property");
         *
         *     // method (on constructor)
         *     Reflect.defineMetadata("custom:annotation", options, Example, "staticMethod");
         *
         *     // method (on prototype)
         *     Reflect.defineMetadata("custom:annotation", options, Example.prototype, "method");
         *
         *     // decorator factory as metadata-producing annotation.
         *     function MyAnnotation(options): Decorator {
         *         return (target, key?) => Reflect.defineMetadata("custom:annotation", options, target, key);
         *     }
         *
         */
        function defineMetadata(metadataKey, metadataValue, target, propertyKey) {
            if (!IsObject(target))
                throw new TypeError();
            if (!IsUndefined(propertyKey))
                propertyKey = ToPropertyKey(propertyKey);
            return OrdinaryDefineOwnMetadata(metadataKey, metadataValue, target, propertyKey);
        }
        exporter("defineMetadata", defineMetadata);
        /**
         * Gets a value indicating whether the target object or its prototype chain has the provided metadata key defined.
         * @param metadataKey A key used to store and retrieve metadata.
         * @param target The target object on which the metadata is defined.
         * @param propertyKey (Optional) The property key for the target.
         * @returns `true` if the metadata key was defined on the target object or its prototype chain; otherwise, `false`.
         * @example
         *
         *     class Example {
         *         // property declarations are not part of ES6, though they are valid in TypeScript:
         *         // static staticProperty;
         *         // property;
         *
         *         constructor(p) { }
         *         static staticMethod(p) { }
         *         method(p) { }
         *     }
         *
         *     // constructor
         *     result = Reflect.hasMetadata("custom:annotation", Example);
         *
         *     // property (on constructor)
         *     result = Reflect.hasMetadata("custom:annotation", Example, "staticProperty");
         *
         *     // property (on prototype)
         *     result = Reflect.hasMetadata("custom:annotation", Example.prototype, "property");
         *
         *     // method (on constructor)
         *     result = Reflect.hasMetadata("custom:annotation", Example, "staticMethod");
         *
         *     // method (on prototype)
         *     result = Reflect.hasMetadata("custom:annotation", Example.prototype, "method");
         *
         */
        function hasMetadata(metadataKey, target, propertyKey) {
            if (!IsObject(target))
                throw new TypeError();
            if (!IsUndefined(propertyKey))
                propertyKey = ToPropertyKey(propertyKey);
            return OrdinaryHasMetadata(metadataKey, target, propertyKey);
        }
        exporter("hasMetadata", hasMetadata);
        /**
         * Gets a value indicating whether the target object has the provided metadata key defined.
         * @param metadataKey A key used to store and retrieve metadata.
         * @param target The target object on which the metadata is defined.
         * @param propertyKey (Optional) The property key for the target.
         * @returns `true` if the metadata key was defined on the target object; otherwise, `false`.
         * @example
         *
         *     class Example {
         *         // property declarations are not part of ES6, though they are valid in TypeScript:
         *         // static staticProperty;
         *         // property;
         *
         *         constructor(p) { }
         *         static staticMethod(p) { }
         *         method(p) { }
         *     }
         *
         *     // constructor
         *     result = Reflect.hasOwnMetadata("custom:annotation", Example);
         *
         *     // property (on constructor)
         *     result = Reflect.hasOwnMetadata("custom:annotation", Example, "staticProperty");
         *
         *     // property (on prototype)
         *     result = Reflect.hasOwnMetadata("custom:annotation", Example.prototype, "property");
         *
         *     // method (on constructor)
         *     result = Reflect.hasOwnMetadata("custom:annotation", Example, "staticMethod");
         *
         *     // method (on prototype)
         *     result = Reflect.hasOwnMetadata("custom:annotation", Example.prototype, "method");
         *
         */
        function hasOwnMetadata(metadataKey, target, propertyKey) {
            if (!IsObject(target))
                throw new TypeError();
            if (!IsUndefined(propertyKey))
                propertyKey = ToPropertyKey(propertyKey);
            return OrdinaryHasOwnMetadata(metadataKey, target, propertyKey);
        }
        exporter("hasOwnMetadata", hasOwnMetadata);
        /**
         * Gets the metadata value for the provided metadata key on the target object or its prototype chain.
         * @param metadataKey A key used to store and retrieve metadata.
         * @param target The target object on which the metadata is defined.
         * @param propertyKey (Optional) The property key for the target.
         * @returns The metadata value for the metadata key if found; otherwise, `undefined`.
         * @example
         *
         *     class Example {
         *         // property declarations are not part of ES6, though they are valid in TypeScript:
         *         // static staticProperty;
         *         // property;
         *
         *         constructor(p) { }
         *         static staticMethod(p) { }
         *         method(p) { }
         *     }
         *
         *     // constructor
         *     result = Reflect.getMetadata("custom:annotation", Example);
         *
         *     // property (on constructor)
         *     result = Reflect.getMetadata("custom:annotation", Example, "staticProperty");
         *
         *     // property (on prototype)
         *     result = Reflect.getMetadata("custom:annotation", Example.prototype, "property");
         *
         *     // method (on constructor)
         *     result = Reflect.getMetadata("custom:annotation", Example, "staticMethod");
         *
         *     // method (on prototype)
         *     result = Reflect.getMetadata("custom:annotation", Example.prototype, "method");
         *
         */
        function getMetadata(metadataKey, target, propertyKey) {
            if (!IsObject(target))
                throw new TypeError();
            if (!IsUndefined(propertyKey))
                propertyKey = ToPropertyKey(propertyKey);
            return OrdinaryGetMetadata(metadataKey, target, propertyKey);
        }
        exporter("getMetadata", getMetadata);
        /**
         * Gets the metadata value for the provided metadata key on the target object.
         * @param metadataKey A key used to store and retrieve metadata.
         * @param target The target object on which the metadata is defined.
         * @param propertyKey (Optional) The property key for the target.
         * @returns The metadata value for the metadata key if found; otherwise, `undefined`.
         * @example
         *
         *     class Example {
         *         // property declarations are not part of ES6, though they are valid in TypeScript:
         *         // static staticProperty;
         *         // property;
         *
         *         constructor(p) { }
         *         static staticMethod(p) { }
         *         method(p) { }
         *     }
         *
         *     // constructor
         *     result = Reflect.getOwnMetadata("custom:annotation", Example);
         *
         *     // property (on constructor)
         *     result = Reflect.getOwnMetadata("custom:annotation", Example, "staticProperty");
         *
         *     // property (on prototype)
         *     result = Reflect.getOwnMetadata("custom:annotation", Example.prototype, "property");
         *
         *     // method (on constructor)
         *     result = Reflect.getOwnMetadata("custom:annotation", Example, "staticMethod");
         *
         *     // method (on prototype)
         *     result = Reflect.getOwnMetadata("custom:annotation", Example.prototype, "method");
         *
         */
        function getOwnMetadata(metadataKey, target, propertyKey) {
            if (!IsObject(target))
                throw new TypeError();
            if (!IsUndefined(propertyKey))
                propertyKey = ToPropertyKey(propertyKey);
            return OrdinaryGetOwnMetadata(metadataKey, target, propertyKey);
        }
        exporter("getOwnMetadata", getOwnMetadata);
        /**
         * Gets the metadata keys defined on the target object or its prototype chain.
         * @param target The target object on which the metadata is defined.
         * @param propertyKey (Optional) The property key for the target.
         * @returns An array of unique metadata keys.
         * @example
         *
         *     class Example {
         *         // property declarations are not part of ES6, though they are valid in TypeScript:
         *         // static staticProperty;
         *         // property;
         *
         *         constructor(p) { }
         *         static staticMethod(p) { }
         *         method(p) { }
         *     }
         *
         *     // constructor
         *     result = Reflect.getMetadataKeys(Example);
         *
         *     // property (on constructor)
         *     result = Reflect.getMetadataKeys(Example, "staticProperty");
         *
         *     // property (on prototype)
         *     result = Reflect.getMetadataKeys(Example.prototype, "property");
         *
         *     // method (on constructor)
         *     result = Reflect.getMetadataKeys(Example, "staticMethod");
         *
         *     // method (on prototype)
         *     result = Reflect.getMetadataKeys(Example.prototype, "method");
         *
         */
        function getMetadataKeys(target, propertyKey) {
            if (!IsObject(target))
                throw new TypeError();
            if (!IsUndefined(propertyKey))
                propertyKey = ToPropertyKey(propertyKey);
            return OrdinaryMetadataKeys(target, propertyKey);
        }
        exporter("getMetadataKeys", getMetadataKeys);
        /**
         * Gets the unique metadata keys defined on the target object.
         * @param target The target object on which the metadata is defined.
         * @param propertyKey (Optional) The property key for the target.
         * @returns An array of unique metadata keys.
         * @example
         *
         *     class Example {
         *         // property declarations are not part of ES6, though they are valid in TypeScript:
         *         // static staticProperty;
         *         // property;
         *
         *         constructor(p) { }
         *         static staticMethod(p) { }
         *         method(p) { }
         *     }
         *
         *     // constructor
         *     result = Reflect.getOwnMetadataKeys(Example);
         *
         *     // property (on constructor)
         *     result = Reflect.getOwnMetadataKeys(Example, "staticProperty");
         *
         *     // property (on prototype)
         *     result = Reflect.getOwnMetadataKeys(Example.prototype, "property");
         *
         *     // method (on constructor)
         *     result = Reflect.getOwnMetadataKeys(Example, "staticMethod");
         *
         *     // method (on prototype)
         *     result = Reflect.getOwnMetadataKeys(Example.prototype, "method");
         *
         */
        function getOwnMetadataKeys(target, propertyKey) {
            if (!IsObject(target))
                throw new TypeError();
            if (!IsUndefined(propertyKey))
                propertyKey = ToPropertyKey(propertyKey);
            return OrdinaryOwnMetadataKeys(target, propertyKey);
        }
        exporter("getOwnMetadataKeys", getOwnMetadataKeys);
        /**
         * Deletes the metadata entry from the target object with the provided key.
         * @param metadataKey A key used to store and retrieve metadata.
         * @param target The target object on which the metadata is defined.
         * @param propertyKey (Optional) The property key for the target.
         * @returns `true` if the metadata entry was found and deleted; otherwise, false.
         * @example
         *
         *     class Example {
         *         // property declarations are not part of ES6, though they are valid in TypeScript:
         *         // static staticProperty;
         *         // property;
         *
         *         constructor(p) { }
         *         static staticMethod(p) { }
         *         method(p) { }
         *     }
         *
         *     // constructor
         *     result = Reflect.deleteMetadata("custom:annotation", Example);
         *
         *     // property (on constructor)
         *     result = Reflect.deleteMetadata("custom:annotation", Example, "staticProperty");
         *
         *     // property (on prototype)
         *     result = Reflect.deleteMetadata("custom:annotation", Example.prototype, "property");
         *
         *     // method (on constructor)
         *     result = Reflect.deleteMetadata("custom:annotation", Example, "staticMethod");
         *
         *     // method (on prototype)
         *     result = Reflect.deleteMetadata("custom:annotation", Example.prototype, "method");
         *
         */
        function deleteMetadata(metadataKey, target, propertyKey) {
            if (!IsObject(target))
                throw new TypeError();
            if (!IsUndefined(propertyKey))
                propertyKey = ToPropertyKey(propertyKey);
            var metadataMap = GetOrCreateMetadataMap(target, propertyKey, /*Create*/ false);
            if (IsUndefined(metadataMap))
                return false;
            if (!metadataMap.delete(metadataKey))
                return false;
            if (metadataMap.size > 0)
                return true;
            var targetMetadata = Metadata.get(target);
            targetMetadata.delete(propertyKey);
            if (targetMetadata.size > 0)
                return true;
            Metadata.delete(target);
            return true;
        }
        exporter("deleteMetadata", deleteMetadata);
        function DecorateConstructor(decorators, target) {
            for (var i = decorators.length - 1; i >= 0; --i) {
                var decorator = decorators[i];
                var decorated = decorator(target);
                if (!IsUndefined(decorated) && !IsNull(decorated)) {
                    if (!IsConstructor(decorated))
                        throw new TypeError();
                    target = decorated;
                }
            }
            return target;
        }
        function DecorateProperty(decorators, target, propertyKey, descriptor) {
            for (var i = decorators.length - 1; i >= 0; --i) {
                var decorator = decorators[i];
                var decorated = decorator(target, propertyKey, descriptor);
                if (!IsUndefined(decorated) && !IsNull(decorated)) {
                    if (!IsObject(decorated))
                        throw new TypeError();
                    descriptor = decorated;
                }
            }
            return descriptor;
        }
        function GetOrCreateMetadataMap(O, P, Create) {
            var targetMetadata = Metadata.get(O);
            if (IsUndefined(targetMetadata)) {
                if (!Create)
                    return undefined;
                targetMetadata = new _Map();
                Metadata.set(O, targetMetadata);
            }
            var metadataMap = targetMetadata.get(P);
            if (IsUndefined(metadataMap)) {
                if (!Create)
                    return undefined;
                metadataMap = new _Map();
                targetMetadata.set(P, metadataMap);
            }
            return metadataMap;
        }
        // 3.1.1.1 OrdinaryHasMetadata(MetadataKey, O, P)
        // https://rbuckton.github.io/reflect-metadata/#ordinaryhasmetadata
        function OrdinaryHasMetadata(MetadataKey, O, P) {
            var hasOwn = OrdinaryHasOwnMetadata(MetadataKey, O, P);
            if (hasOwn)
                return true;
            var parent = OrdinaryGetPrototypeOf(O);
            if (!IsNull(parent))
                return OrdinaryHasMetadata(MetadataKey, parent, P);
            return false;
        }
        // 3.1.2.1 OrdinaryHasOwnMetadata(MetadataKey, O, P)
        // https://rbuckton.github.io/reflect-metadata/#ordinaryhasownmetadata
        function OrdinaryHasOwnMetadata(MetadataKey, O, P) {
            var metadataMap = GetOrCreateMetadataMap(O, P, /*Create*/ false);
            if (IsUndefined(metadataMap))
                return false;
            return ToBoolean(metadataMap.has(MetadataKey));
        }
        // 3.1.3.1 OrdinaryGetMetadata(MetadataKey, O, P)
        // https://rbuckton.github.io/reflect-metadata/#ordinarygetmetadata
        function OrdinaryGetMetadata(MetadataKey, O, P) {
            var hasOwn = OrdinaryHasOwnMetadata(MetadataKey, O, P);
            if (hasOwn)
                return OrdinaryGetOwnMetadata(MetadataKey, O, P);
            var parent = OrdinaryGetPrototypeOf(O);
            if (!IsNull(parent))
                return OrdinaryGetMetadata(MetadataKey, parent, P);
            return undefined;
        }
        // 3.1.4.1 OrdinaryGetOwnMetadata(MetadataKey, O, P)
        // https://rbuckton.github.io/reflect-metadata/#ordinarygetownmetadata
        function OrdinaryGetOwnMetadata(MetadataKey, O, P) {
            var metadataMap = GetOrCreateMetadataMap(O, P, /*Create*/ false);
            if (IsUndefined(metadataMap))
                return undefined;
            return metadataMap.get(MetadataKey);
        }
        // 3.1.5.1 OrdinaryDefineOwnMetadata(MetadataKey, MetadataValue, O, P)
        // https://rbuckton.github.io/reflect-metadata/#ordinarydefineownmetadata
        function OrdinaryDefineOwnMetadata(MetadataKey, MetadataValue, O, P) {
            var metadataMap = GetOrCreateMetadataMap(O, P, /*Create*/ true);
            metadataMap.set(MetadataKey, MetadataValue);
        }
        // 3.1.6.1 OrdinaryMetadataKeys(O, P)
        // https://rbuckton.github.io/reflect-metadata/#ordinarymetadatakeys
        function OrdinaryMetadataKeys(O, P) {
            var ownKeys = OrdinaryOwnMetadataKeys(O, P);
            var parent = OrdinaryGetPrototypeOf(O);
            if (parent === null)
                return ownKeys;
            var parentKeys = OrdinaryMetadataKeys(parent, P);
            if (parentKeys.length <= 0)
                return ownKeys;
            if (ownKeys.length <= 0)
                return parentKeys;
            var set = new _Set();
            var keys = [];
            for (var _i = 0, ownKeys_1 = ownKeys; _i < ownKeys_1.length; _i++) {
                var key = ownKeys_1[_i];
                var hasKey = set.has(key);
                if (!hasKey) {
                    set.add(key);
                    keys.push(key);
                }
            }
            for (var _a = 0, parentKeys_1 = parentKeys; _a < parentKeys_1.length; _a++) {
                var key = parentKeys_1[_a];
                var hasKey = set.has(key);
                if (!hasKey) {
                    set.add(key);
                    keys.push(key);
                }
            }
            return keys;
        }
        // 3.1.7.1 OrdinaryOwnMetadataKeys(O, P)
        // https://rbuckton.github.io/reflect-metadata/#ordinaryownmetadatakeys
        function OrdinaryOwnMetadataKeys(O, P) {
            var keys = [];
            var metadataMap = GetOrCreateMetadataMap(O, P, /*Create*/ false);
            if (IsUndefined(metadataMap))
                return keys;
            var keysObj = metadataMap.keys();
            var iterator = GetIterator(keysObj);
            var k = 0;
            while (true) {
                var next = IteratorStep(iterator);
                if (!next) {
                    keys.length = k;
                    return keys;
                }
                var nextValue = IteratorValue(next);
                try {
                    keys[k] = nextValue;
                }
                catch (e) {
                    try {
                        IteratorClose(iterator);
                    }
                    finally {
                        throw e;
                    }
                }
                k++;
            }
        }
        // 6 ECMAScript Data Typ0es and Values
        // https://tc39.github.io/ecma262/#sec-ecmascript-data-types-and-values
        function Type(x) {
            if (x === null)
                return 1 /* Null */;
            switch (typeof x) {
                case "undefined": return 0 /* Undefined */;
                case "boolean": return 2 /* Boolean */;
                case "string": return 3 /* String */;
                case "symbol": return 4 /* Symbol */;
                case "number": return 5 /* Number */;
                case "object": return x === null ? 1 /* Null */ : 6 /* Object */;
                default: return 6 /* Object */;
            }
        }
        // 6.1.1 The Undefined Type
        // https://tc39.github.io/ecma262/#sec-ecmascript-language-types-undefined-type
        function IsUndefined(x) {
            return x === undefined;
        }
        // 6.1.2 The Null Type
        // https://tc39.github.io/ecma262/#sec-ecmascript-language-types-null-type
        function IsNull(x) {
            return x === null;
        }
        // 6.1.5 The Symbol Type
        // https://tc39.github.io/ecma262/#sec-ecmascript-language-types-symbol-type
        function IsSymbol(x) {
            return typeof x === "symbol";
        }
        // 6.1.7 The Object Type
        // https://tc39.github.io/ecma262/#sec-object-type
        function IsObject(x) {
            return typeof x === "object" ? x !== null : typeof x === "function";
        }
        // 7.1 Type Conversion
        // https://tc39.github.io/ecma262/#sec-type-conversion
        // 7.1.1 ToPrimitive(input [, PreferredType])
        // https://tc39.github.io/ecma262/#sec-toprimitive
        function ToPrimitive(input, PreferredType) {
            switch (Type(input)) {
                case 0 /* Undefined */: return input;
                case 1 /* Null */: return input;
                case 2 /* Boolean */: return input;
                case 3 /* String */: return input;
                case 4 /* Symbol */: return input;
                case 5 /* Number */: return input;
            }
            var hint = PreferredType === 3 /* String */ ? "string" : PreferredType === 5 /* Number */ ? "number" : "default";
            var exoticToPrim = GetMethod(input, toPrimitiveSymbol);
            if (exoticToPrim !== undefined) {
                var result = exoticToPrim.call(input, hint);
                if (IsObject(result))
                    throw new TypeError();
                return result;
            }
            return OrdinaryToPrimitive(input, hint === "default" ? "number" : hint);
        }
        // 7.1.1.1 OrdinaryToPrimitive(O, hint)
        // https://tc39.github.io/ecma262/#sec-ordinarytoprimitive
        function OrdinaryToPrimitive(O, hint) {
            if (hint === "string") {
                var toString_1 = O.toString;
                if (IsCallable(toString_1)) {
                    var result = toString_1.call(O);
                    if (!IsObject(result))
                        return result;
                }
                var valueOf = O.valueOf;
                if (IsCallable(valueOf)) {
                    var result = valueOf.call(O);
                    if (!IsObject(result))
                        return result;
                }
            }
            else {
                var valueOf = O.valueOf;
                if (IsCallable(valueOf)) {
                    var result = valueOf.call(O);
                    if (!IsObject(result))
                        return result;
                }
                var toString_2 = O.toString;
                if (IsCallable(toString_2)) {
                    var result = toString_2.call(O);
                    if (!IsObject(result))
                        return result;
                }
            }
            throw new TypeError();
        }
        // 7.1.2 ToBoolean(argument)
        // https://tc39.github.io/ecma262/2016/#sec-toboolean
        function ToBoolean(argument) {
            return !!argument;
        }
        // 7.1.12 ToString(argument)
        // https://tc39.github.io/ecma262/#sec-tostring
        function ToString(argument) {
            return "" + argument;
        }
        // 7.1.14 ToPropertyKey(argument)
        // https://tc39.github.io/ecma262/#sec-topropertykey
        function ToPropertyKey(argument) {
            var key = ToPrimitive(argument, 3 /* String */);
            if (IsSymbol(key))
                return key;
            return ToString(key);
        }
        // 7.2 Testing and Comparison Operations
        // https://tc39.github.io/ecma262/#sec-testing-and-comparison-operations
        // 7.2.2 IsArray(argument)
        // https://tc39.github.io/ecma262/#sec-isarray
        function IsArray(argument) {
            return Array.isArray
                ? Array.isArray(argument)
                : argument instanceof Object
                    ? argument instanceof Array
                    : Object.prototype.toString.call(argument) === "[object Array]";
        }
        // 7.2.3 IsCallable(argument)
        // https://tc39.github.io/ecma262/#sec-iscallable
        function IsCallable(argument) {
            // NOTE: This is an approximation as we cannot check for [[Call]] internal method.
            return typeof argument === "function";
        }
        // 7.2.4 IsConstructor(argument)
        // https://tc39.github.io/ecma262/#sec-isconstructor
        function IsConstructor(argument) {
            // NOTE: This is an approximation as we cannot check for [[Construct]] internal method.
            return typeof argument === "function";
        }
        // 7.2.7 IsPropertyKey(argument)
        // https://tc39.github.io/ecma262/#sec-ispropertykey
        function IsPropertyKey(argument) {
            switch (Type(argument)) {
                case 3 /* String */: return true;
                case 4 /* Symbol */: return true;
                default: return false;
            }
        }
        // 7.3 Operations on Objects
        // https://tc39.github.io/ecma262/#sec-operations-on-objects
        // 7.3.9 GetMethod(V, P)
        // https://tc39.github.io/ecma262/#sec-getmethod
        function GetMethod(V, P) {
            var func = V[P];
            if (func === undefined || func === null)
                return undefined;
            if (!IsCallable(func))
                throw new TypeError();
            return func;
        }
        // 7.4 Operations on Iterator Objects
        // https://tc39.github.io/ecma262/#sec-operations-on-iterator-objects
        function GetIterator(obj) {
            var method = GetMethod(obj, iteratorSymbol);
            if (!IsCallable(method))
                throw new TypeError(); // from Call
            var iterator = method.call(obj);
            if (!IsObject(iterator))
                throw new TypeError();
            return iterator;
        }
        // 7.4.4 IteratorValue(iterResult)
        // https://tc39.github.io/ecma262/2016/#sec-iteratorvalue
        function IteratorValue(iterResult) {
            return iterResult.value;
        }
        // 7.4.5 IteratorStep(iterator)
        // https://tc39.github.io/ecma262/#sec-iteratorstep
        function IteratorStep(iterator) {
            var result = iterator.next();
            return result.done ? false : result;
        }
        // 7.4.6 IteratorClose(iterator, completion)
        // https://tc39.github.io/ecma262/#sec-iteratorclose
        function IteratorClose(iterator) {
            var f = iterator["return"];
            if (f)
                f.call(iterator);
        }
        // 9.1 Ordinary Object Internal Methods and Internal Slots
        // https://tc39.github.io/ecma262/#sec-ordinary-object-internal-methods-and-internal-slots
        // 9.1.1.1 OrdinaryGetPrototypeOf(O)
        // https://tc39.github.io/ecma262/#sec-ordinarygetprototypeof
        function OrdinaryGetPrototypeOf(O) {
            var proto = Object.getPrototypeOf(O);
            if (typeof O !== "function" || O === functionPrototype)
                return proto;
            // TypeScript doesn't set __proto__ in ES5, as it's non-standard.
            // Try to determine the superclass constructor. Compatible implementations
            // must either set __proto__ on a subclass constructor to the superclass constructor,
            // or ensure each class has a valid `constructor` property on its prototype that
            // points back to the constructor.
            // If this is not the same as Function.[[Prototype]], then this is definately inherited.
            // This is the case when in ES6 or when using __proto__ in a compatible browser.
            if (proto !== functionPrototype)
                return proto;
            // If the super prototype is Object.prototype, null, or undefined, then we cannot determine the heritage.
            var prototype = O.prototype;
            var prototypeProto = prototype && Object.getPrototypeOf(prototype);
            if (prototypeProto == null || prototypeProto === Object.prototype)
                return proto;
            // If the constructor was not a function, then we cannot determine the heritage.
            var constructor = prototypeProto.constructor;
            if (typeof constructor !== "function")
                return proto;
            // If we have some kind of self-reference, then we cannot determine the heritage.
            if (constructor === O)
                return proto;
            // we have a pretty good guess at the heritage.
            return constructor;
        }
        // naive Map shim
        function CreateMapPolyfill() {
            var cacheSentinel = {};
            var arraySentinel = [];
            var MapIterator = /** @class */ (function () {
                function MapIterator(keys, values, selector) {
                    this._index = 0;
                    this._keys = keys;
                    this._values = values;
                    this._selector = selector;
                }
                MapIterator.prototype["@@iterator"] = function () { return this; };
                MapIterator.prototype[iteratorSymbol] = function () { return this; };
                MapIterator.prototype.next = function () {
                    var index = this._index;
                    if (index >= 0 && index < this._keys.length) {
                        var result = this._selector(this._keys[index], this._values[index]);
                        if (index + 1 >= this._keys.length) {
                            this._index = -1;
                            this._keys = arraySentinel;
                            this._values = arraySentinel;
                        }
                        else {
                            this._index++;
                        }
                        return { value: result, done: false };
                    }
                    return { value: undefined, done: true };
                };
                MapIterator.prototype.throw = function (error) {
                    if (this._index >= 0) {
                        this._index = -1;
                        this._keys = arraySentinel;
                        this._values = arraySentinel;
                    }
                    throw error;
                };
                MapIterator.prototype.return = function (value) {
                    if (this._index >= 0) {
                        this._index = -1;
                        this._keys = arraySentinel;
                        this._values = arraySentinel;
                    }
                    return { value: value, done: true };
                };
                return MapIterator;
            }());
            return /** @class */ (function () {
                function Map() {
                    this._keys = [];
                    this._values = [];
                    this._cacheKey = cacheSentinel;
                    this._cacheIndex = -2;
                }
                Object.defineProperty(Map.prototype, "size", {
                    get: function () { return this._keys.length; },
                    enumerable: true,
                    configurable: true
                });
                Map.prototype.has = function (key) { return this._find(key, /*insert*/ false) >= 0; };
                Map.prototype.get = function (key) {
                    var index = this._find(key, /*insert*/ false);
                    return index >= 0 ? this._values[index] : undefined;
                };
                Map.prototype.set = function (key, value) {
                    var index = this._find(key, /*insert*/ true);
                    this._values[index] = value;
                    return this;
                };
                Map.prototype.delete = function (key) {
                    var index = this._find(key, /*insert*/ false);
                    if (index >= 0) {
                        var size = this._keys.length;
                        for (var i = index + 1; i < size; i++) {
                            this._keys[i - 1] = this._keys[i];
                            this._values[i - 1] = this._values[i];
                        }
                        this._keys.length--;
                        this._values.length--;
                        if (key === this._cacheKey) {
                            this._cacheKey = cacheSentinel;
                            this._cacheIndex = -2;
                        }
                        return true;
                    }
                    return false;
                };
                Map.prototype.clear = function () {
                    this._keys.length = 0;
                    this._values.length = 0;
                    this._cacheKey = cacheSentinel;
                    this._cacheIndex = -2;
                };
                Map.prototype.keys = function () { return new MapIterator(this._keys, this._values, getKey); };
                Map.prototype.values = function () { return new MapIterator(this._keys, this._values, getValue); };
                Map.prototype.entries = function () { return new MapIterator(this._keys, this._values, getEntry); };
                Map.prototype["@@iterator"] = function () { return this.entries(); };
                Map.prototype[iteratorSymbol] = function () { return this.entries(); };
                Map.prototype._find = function (key, insert) {
                    if (this._cacheKey !== key) {
                        this._cacheIndex = this._keys.indexOf(this._cacheKey = key);
                    }
                    if (this._cacheIndex < 0 && insert) {
                        this._cacheIndex = this._keys.length;
                        this._keys.push(key);
                        this._values.push(undefined);
                    }
                    return this._cacheIndex;
                };
                return Map;
            }());
            function getKey(key, _) {
                return key;
            }
            function getValue(_, value) {
                return value;
            }
            function getEntry(key, value) {
                return [key, value];
            }
        }
        // naive Set shim
        function CreateSetPolyfill() {
            return /** @class */ (function () {
                function Set() {
                    this._map = new _Map();
                }
                Object.defineProperty(Set.prototype, "size", {
                    get: function () { return this._map.size; },
                    enumerable: true,
                    configurable: true
                });
                Set.prototype.has = function (value) { return this._map.has(value); };
                Set.prototype.add = function (value) { return this._map.set(value, value), this; };
                Set.prototype.delete = function (value) { return this._map.delete(value); };
                Set.prototype.clear = function () { this._map.clear(); };
                Set.prototype.keys = function () { return this._map.keys(); };
                Set.prototype.values = function () { return this._map.values(); };
                Set.prototype.entries = function () { return this._map.entries(); };
                Set.prototype["@@iterator"] = function () { return this.keys(); };
                Set.prototype[iteratorSymbol] = function () { return this.keys(); };
                return Set;
            }());
        }
        // naive WeakMap shim
        function CreateWeakMapPolyfill() {
            var UUID_SIZE = 16;
            var keys = HashMap.create();
            var rootKey = CreateUniqueKey();
            return /** @class */ (function () {
                function WeakMap() {
                    this._key = CreateUniqueKey();
                }
                WeakMap.prototype.has = function (target) {
                    var table = GetOrCreateWeakMapTable(target, /*create*/ false);
                    return table !== undefined ? HashMap.has(table, this._key) : false;
                };
                WeakMap.prototype.get = function (target) {
                    var table = GetOrCreateWeakMapTable(target, /*create*/ false);
                    return table !== undefined ? HashMap.get(table, this._key) : undefined;
                };
                WeakMap.prototype.set = function (target, value) {
                    var table = GetOrCreateWeakMapTable(target, /*create*/ true);
                    table[this._key] = value;
                    return this;
                };
                WeakMap.prototype.delete = function (target) {
                    var table = GetOrCreateWeakMapTable(target, /*create*/ false);
                    return table !== undefined ? delete table[this._key] : false;
                };
                WeakMap.prototype.clear = function () {
                    // NOTE: not a real clear, just makes the previous data unreachable
                    this._key = CreateUniqueKey();
                };
                return WeakMap;
            }());
            function CreateUniqueKey() {
                var key;
                do
                    key = "@@WeakMap@@" + CreateUUID();
                while (HashMap.has(keys, key));
                keys[key] = true;
                return key;
            }
            function GetOrCreateWeakMapTable(target, create) {
                if (!hasOwn.call(target, rootKey)) {
                    if (!create)
                        return undefined;
                    Object.defineProperty(target, rootKey, { value: HashMap.create() });
                }
                return target[rootKey];
            }
            function FillRandomBytes(buffer, size) {
                for (var i = 0; i < size; ++i)
                    buffer[i] = Math.random() * 0xff | 0;
                return buffer;
            }
            function GenRandomBytes(size) {
                if (typeof Uint8Array === "function") {
                    if (typeof crypto !== "undefined")
                        return crypto.getRandomValues(new Uint8Array(size));
                    if (typeof msCrypto !== "undefined")
                        return msCrypto.getRandomValues(new Uint8Array(size));
                    return FillRandomBytes(new Uint8Array(size), size);
                }
                return FillRandomBytes(new Array(size), size);
            }
            function CreateUUID() {
                var data = GenRandomBytes(UUID_SIZE);
                // mark as random - RFC 4122 § 4.4
                data[6] = data[6] & 0x4f | 0x40;
                data[8] = data[8] & 0xbf | 0x80;
                var result = "";
                for (var offset = 0; offset < UUID_SIZE; ++offset) {
                    var byte = data[offset];
                    if (offset === 4 || offset === 6 || offset === 8)
                        result += "-";
                    if (byte < 16)
                        result += "0";
                    result += byte.toString(16).toLowerCase();
                }
                return result;
            }
        }
        // uses a heuristic used by v8 and chakra to force an object into dictionary mode.
        function MakeDictionary(obj) {
            obj.__ = undefined;
            delete obj.__;
            return obj;
        }
    });
})(Reflect || (Reflect = {}));

}).call(this)}).call(this,require('_process'),typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"_process":3}],101:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Channel = void 0;
var Channel = /** @class */ (function () {
    function Channel() {
        this.subscriptions = new Map();
    }
    Channel.prototype.publish = function (message, data) {
        var _this = this;
        var handlers = this.subscriptions.get(message);
        if (handlers) {
            handlers.forEach(function (handler) {
                handler(data, message, _this, handler);
            });
        }
    };
    Channel.prototype.subscribe = function (message, handler) {
        var handlers = this.subscriptions.get(message);
        if (!handlers) {
            handlers = [];
            this.subscriptions.set(message, handlers);
        }
        handlers.push(handler);
    };
    Channel.prototype.unsubscribe = function (message, handler) {
        var handlers = this.subscriptions.get(message);
        if (handlers) {
            handlers = handlers.filter(function (x) { return x !== handler; });
            if (handlers.length) {
                this.subscriptions.set(message, handlers);
            }
            else {
                this.subscriptions.delete(message);
            }
        }
    };
    /**
     * Unregister all subscriptions for the channel
     */
    Channel.prototype.unsubscribeAll = function () {
        this.subscriptions.clear();
    };
    return Channel;
}());
exports.Channel = Channel;

},{}],102:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SUBSCRIPTIONS_METADATA_KEY = exports.CHANNEL_METADATA_KEY = void 0;
exports.CHANNEL_METADATA_KEY = Symbol('pubsub:channel');
exports.SUBSCRIPTIONS_METADATA_KEY = Symbol('pubsub:subscriptions');

},{}],103:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PubSub = void 0;
var channel_class_1 = require("../channel.class");
exports.PubSub = new channel_class_1.Channel();

},{"../channel.class":101}],104:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Subscribe = void 0;
var metadata_keys_consts_1 = require("../consts/metadata-keys.consts");
/**
 * Marks a method as a message handler. The method can have the following signature: (data, message, channel, handler) => void, where
 * - data - a message specific data passed by a publisher
 * - message - the message code
 * - channel - the instance of `PubSubService` that published the message
 * - handler - the reference to the handler function, can be used for unsubscription
 * @param message - the message to subscribe to
 */
function Subscribe(message) {
    return function (target, propertyKey, descriptor) {
        var subscriptions = Reflect.getMetadata(metadata_keys_consts_1.SUBSCRIPTIONS_METADATA_KEY, target) || new Set();
        subscriptions.add({ message: message, handler: descriptor.value });
        Reflect.defineMetadata(metadata_keys_consts_1.SUBSCRIPTIONS_METADATA_KEY, subscriptions, target);
    };
}
exports.Subscribe = Subscribe;

},{"../consts/metadata-keys.consts":102}],105:[function(require,module,exports){
"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Subscriber = void 0;
var metadata_keys_consts_1 = require("../consts/metadata-keys.consts");
var pubsub_const_1 = require("../consts/pubsub.const");
/**
 * Marks class as a Subscriber. Instances of this will be automatically subscribed to a message channel
 * @param config Subscriber configuration
 */
function Subscriber(config) {
    var channel = (config === null || config === void 0 ? void 0 : config.channel) || pubsub_const_1.PubSub;
    return function (target) {
        Reflect.defineMetadata(metadata_keys_consts_1.CHANNEL_METADATA_KEY, channel, target.prototype);
        var newConstructor = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            var targetConstructor = target;
            var instance = new (targetConstructor.bind.apply(targetConstructor, __spreadArray([void 0], args)))();
            var subscriptions = Reflect.getMetadata(metadata_keys_consts_1.SUBSCRIPTIONS_METADATA_KEY, target.prototype);
            if (subscriptions) {
                var handlers_1 = [];
                Reflect.defineMetadata(metadata_keys_consts_1.SUBSCRIPTIONS_METADATA_KEY, handlers_1, instance);
                subscriptions.forEach(function (subscription) {
                    var handler = subscription.handler.bind(instance);
                    handlers_1.push({ message: subscription.message, handler: handler });
                    channel.subscribe(subscription.message, handler);
                });
            }
            return instance;
        };
        newConstructor.prototype = target.prototype;
        if (config === null || config === void 0 ? void 0 : config.createInstance) {
            new newConstructor(config.constructorParameters);
        }
        return newConstructor;
    };
}
exports.Subscriber = Subscriber;

},{"../consts/metadata-keys.consts":102,"../consts/pubsub.const":103}],106:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Unsubscribe = void 0;
var metadata_keys_consts_1 = require("../consts/metadata-keys.consts");
/**
 * Wraps the function with the logic to unsubscribe the class instance from a pubsub service, the function can be called manually if you need to stop observation
 */
function Unsubscribe() {
    return function (target, propertyKey, descriptor) {
        var targetMethod = descriptor.value;
        descriptor.value = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            var pubsub = Reflect.getMetadata(metadata_keys_consts_1.CHANNEL_METADATA_KEY, target);
            var subscriptions = Reflect.getMetadata(metadata_keys_consts_1.SUBSCRIPTIONS_METADATA_KEY, this);
            if (pubsub && subscriptions) {
                subscriptions.forEach(function (subscription) {
                    pubsub.unsubscribe(subscription.message, subscription.handler);
                });
            }
            return targetMethod(args);
        };
        return descriptor;
    };
}
exports.Unsubscribe = Unsubscribe;

},{"../consts/metadata-keys.consts":102}],107:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Unsubscribe = exports.Subscriber = exports.Subscribe = exports.PubSub = exports.Channel = void 0;
require("reflect-metadata");
var channel_class_1 = require("./channel.class");
Object.defineProperty(exports, "Channel", { enumerable: true, get: function () { return channel_class_1.Channel; } });
var pubsub_const_1 = require("./consts/pubsub.const");
Object.defineProperty(exports, "PubSub", { enumerable: true, get: function () { return pubsub_const_1.PubSub; } });
var subscribe_decorator_1 = require("./decorators/subscribe.decorator");
Object.defineProperty(exports, "Subscribe", { enumerable: true, get: function () { return subscribe_decorator_1.Subscribe; } });
var subscriber_decorator_1 = require("./decorators/subscriber.decorator");
Object.defineProperty(exports, "Subscriber", { enumerable: true, get: function () { return subscriber_decorator_1.Subscriber; } });
var unsubscribe_decorator_1 = require("./decorators/unsubscribe.decorator");
Object.defineProperty(exports, "Unsubscribe", { enumerable: true, get: function () { return unsubscribe_decorator_1.Unsubscribe; } });

},{"./channel.class":101,"./consts/pubsub.const":103,"./decorators/subscribe.decorator":104,"./decorators/subscriber.decorator":105,"./decorators/unsubscribe.decorator":106,"reflect-metadata":100}],108:[function(require,module,exports){
"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InteractiveCircleWithText = exports.InteractiveCircle = exports.Circle = void 0;
var jsx_runtime_1 = require("@carnelian-diagram/core/jsx-runtime");
var interaction_1 = require("@carnelian-diagram/interaction");
var hocs_1 = require("../hocs");
var utils_1 = require("../utils");
var multiline_text_1 = require("./multiline-text");
var Circle = function (props) {
    var onChange = props.onChange, x = props.x, y = props.y, radius = props.radius, rest = __rest(props, ["onChange", "x", "y", "radius"]);
    return ((0, jsx_runtime_1.jsx)("circle", __assign({ cx: x, cy: y, r: radius }, rest)));
};
exports.Circle = Circle;
exports.InteractiveCircle = (0, interaction_1.withInteractiveCircle)(exports.Circle, {
    collider: function (props) { return (0, interaction_1.CircleCollider)({ center: { x: props.x, y: props.y }, radius: props.radius }); },
    innerHitArea: function (hitArea) { return (__assign(__assign({}, hitArea), { dblClickAction: interaction_1.ACT_EDIT_TEXT })); }
});
exports.InteractiveCircleWithText = (0, hocs_1.withText)(exports.InteractiveCircle, (0, interaction_1.withInteractiveText)(multiline_text_1.MultilineText, function (props) { return props; }, function (props) { return (0, utils_1.textEditorStyles)(props.textStyle); }), function (props) { return ({
    x: props.x - props.radius,
    y: props.y - props.radius,
    width: props.radius * 2,
    height: props.radius * 2,
    text: props.text,
    textStyle: props.textStyle
}); });

},{"../hocs":126,"../utils":129,"./multiline-text":116,"@carnelian-diagram/core/jsx-runtime":17,"@carnelian-diagram/interaction":87}],109:[function(require,module,exports){
"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InteractiveCrossWithText = exports.InteractiveCross = exports.Cross = void 0;
var jsx_runtime_1 = require("@carnelian-diagram/core/jsx-runtime");
var interaction_1 = require("@carnelian-diagram/interaction");
var geometry_1 = require("@carnelian-diagram/interaction/geometry");
var hocs_1 = require("../hocs");
var utils_1 = require("../utils");
var multiline_text_1 = require("./multiline-text");
var knobController = {
    hitArea: {
        type: "knob_handle",
        cursor: "default",
        action: "offset_x_knob_move"
    },
    getPosition: function (props) {
        var baseX = props.width;
        var baseY = props.height;
        var offsetX = (0, geometry_1.clamp)((0, utils_1.convertPercentage)(props.offsetX, baseX), 0, baseX / 2);
        var offsetY = (0, geometry_1.clamp)((0, utils_1.convertPercentage)(props.offsetY, baseY), 0, baseY / 2);
        return {
            x: props.x + offsetX,
            y: props.y + offsetY
        };
    },
    setPosition: function (props, _a) {
        var position = _a.position;
        var baseX = props.width;
        var baseY = props.height;
        var offsetX = (0, geometry_1.clamp)(position.x - props.x, 0, baseX / 2);
        var offsetY = (0, geometry_1.clamp)(position.y - props.y, 0, baseY / 2);
        offsetX = (0, utils_1.isPercentage)(props.offsetX)
            ? baseX > 0 ? "".concat(offsetX / baseX * 100, "%") : props.offsetX
            : offsetX;
        offsetY = (0, utils_1.isPercentage)(props.offsetY)
            ? baseY > 0 ? "".concat(offsetY / baseY * 100, "%") : props.offsetY
            : offsetY;
        return __assign(__assign({}, props), { offsetX: offsetX, offsetY: offsetY });
    }
};
function toPolygon(props) {
    var x = props.x, y = props.y, width = props.width, height = props.height, offsetX = props.offsetX, offsetY = props.offsetY;
    offsetX = (0, geometry_1.clamp)((0, utils_1.convertPercentage)(offsetX, width), 0, width / 2);
    offsetY = (0, geometry_1.clamp)((0, utils_1.convertPercentage)(offsetY, height), 0, height / 2);
    return [
        { x: x + offsetX, y: y },
        { x: x + width - offsetX, y: y },
        { x: x + width - offsetX, y: y + offsetY },
        { x: x + width, y: y + offsetY },
        { x: x + width, y: y + height - offsetY },
        { x: x + width - offsetX, y: y + height - offsetY },
        { x: x + width - offsetX, y: y + height },
        { x: x + offsetX, y: y + height },
        { x: x + offsetX, y: y + height - offsetY },
        { x: x, y: y + height - offsetY },
        { x: x, y: y + offsetY },
        { x: x + offsetX, y: y + offsetY }
    ];
}
;
var Cross = function (props) {
    var onChange = props.onChange, x = props.x, y = props.y, width = props.width, height = props.height, offsetX = props.offsetX, offsetY = props.offsetY, rest = __rest(props, ["onChange", "x", "y", "width", "height", "offsetX", "offsetY"]);
    var points = toPolygon(props);
    return ((0, jsx_runtime_1.jsx)("polygon", __assign({ points: points.map(function (p) { return "".concat(p.x, ",").concat(p.y); }).join(" ") }, rest)));
};
exports.Cross = Cross;
exports.InteractiveCross = (0, interaction_1.withInteractiveRect)((0, interaction_1.withKnob)(exports.Cross, knobController), {
    collider: function (props) { return (0, interaction_1.PolygonCollider)(toPolygon(props)); },
    innerHitArea: function (hitArea) { return (__assign(__assign({}, hitArea), { dblClickAction: interaction_1.ACT_EDIT_TEXT })); }
});
exports.InteractiveCrossWithText = (0, hocs_1.withText)(exports.InteractiveCross, (0, interaction_1.withInteractiveText)(multiline_text_1.MultilineText, function (props) { return props; }, function (props) { return (0, utils_1.textEditorStyles)(props.textStyle); }), function (props) { return props; });

},{"../hocs":126,"../utils":129,"./multiline-text":116,"@carnelian-diagram/core/jsx-runtime":17,"@carnelian-diagram/interaction":87,"@carnelian-diagram/interaction/geometry":69}],110:[function(require,module,exports){
"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InteractiveDiamondWithText = exports.InteractiveDiamond = exports.Diamond = void 0;
var jsx_runtime_1 = require("@carnelian-diagram/core/jsx-runtime");
var interaction_1 = require("@carnelian-diagram/interaction");
var hocs_1 = require("../hocs");
var utils_1 = require("../utils");
var multiline_text_1 = require("./multiline-text");
function toPolygon(props) {
    var x = props.x, y = props.y, width = props.width, height = props.height;
    var rx = width / 2;
    var ry = height / 2;
    return [
        { x: x, y: y + ry },
        { x: x + rx, y: y },
        { x: x + width, y: y + ry },
        { x: x + rx, y: y + height }
    ];
}
var Diamond = function (props) {
    var onChange = props.onChange, x = props.x, y = props.y, width = props.width, height = props.height, rest = __rest(props, ["onChange", "x", "y", "width", "height"]);
    var points = toPolygon(props);
    return ((0, jsx_runtime_1.jsx)("polygon", __assign({ points: points.map(function (p) { return "".concat(p.x, ",").concat(p.y); }).join(" ") }, rest)));
};
exports.Diamond = Diamond;
exports.InteractiveDiamond = (0, interaction_1.withInteractiveRect)(exports.Diamond, {
    collider: function (props) { return (0, interaction_1.PolygonCollider)(toPolygon(props)); },
    innerHitArea: function (hitArea) { return (__assign(__assign({}, hitArea), { dblClickAction: interaction_1.ACT_EDIT_TEXT })); }
});
exports.InteractiveDiamondWithText = (0, hocs_1.withText)(exports.InteractiveDiamond, (0, interaction_1.withInteractiveText)(multiline_text_1.MultilineText, function (props) { return props; }, function (props) { return (0, utils_1.textEditorStyles)(props.textStyle); }), function (props) { return props; });

},{"../hocs":126,"../utils":129,"./multiline-text":116,"@carnelian-diagram/core/jsx-runtime":17,"@carnelian-diagram/interaction":87}],111:[function(require,module,exports){
"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InteractiveDonut = exports.Donut = void 0;
var jsx_runtime_1 = require("@carnelian-diagram/core/jsx-runtime");
var interaction_1 = require("@carnelian-diagram/interaction");
var geometry_1 = require("@carnelian-diagram/interaction/geometry");
var utils_1 = require("../utils");
function calcInnerRadius(props) {
    return Math.min((0, utils_1.convertPercentage)(props.innerRadius, props.radius), props.radius);
}
var knobController = {
    hitArea: {
        type: "knob_handle",
        cursor: "default",
        action: "knob_move"
    },
    getPosition: function (props) {
        var ir = calcInnerRadius(props);
        return {
            x: props.x,
            y: props.y - ir
        };
    },
    setPosition: function (props, _a) {
        var position = _a.position;
        var ir = (0, geometry_1.clamp)(props.y - position.y, 0, props.radius);
        ir = (0, utils_1.isPercentage)(props.innerRadius)
            ? props.radius > 0 ? "".concat(ir / props.radius * 100, "%") : props.innerRadius
            : ir;
        return __assign(__assign({}, props), { innerRadius: ir });
    }
};
var Donut = function (props) {
    var onChange = props.onChange, x = props.x, y = props.y, or = props.radius, ir = props.innerRadius, rest = __rest(props, ["onChange", "x", "y", "radius", "innerRadius"]);
    ir = calcInnerRadius(props);
    var path = "\n        M".concat(x - or, " ").concat(y, " a").concat(or, " ").concat(or, " 0 1 0 ").concat(or * 2, " 0 a").concat(or, " ").concat(or, " 0 1 0 -").concat(or * 2, " 0\n        M").concat(x - ir, " ").concat(y, " a").concat(ir, " ").concat(ir, " 0 0 1 ").concat(ir * 2, " 0 a").concat(ir, " ").concat(ir, " 0 0 1 -").concat(ir * 2, " 0");
    return ((0, jsx_runtime_1.jsx)("path", __assign({ d: path }, rest)));
};
exports.Donut = Donut;
exports.InteractiveDonut = (0, interaction_1.withInteractiveCircle)((0, interaction_1.withKnob)(exports.Donut, knobController), {
    collider: function (props) { return (0, interaction_1.DiffCollider)((0, interaction_1.CircleCollider)({ center: { x: props.x, y: props.y }, radius: props.radius }), (0, interaction_1.CircleCollider)({ center: { x: props.x, y: props.y }, radius: calcInnerRadius(props) })); }
});

},{"../utils":129,"@carnelian-diagram/core/jsx-runtime":17,"@carnelian-diagram/interaction":87,"@carnelian-diagram/interaction/geometry":69}],112:[function(require,module,exports){
"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InteractiveEllipseWithText = exports.InteractiveEllipse = exports.Ellipse = void 0;
var jsx_runtime_1 = require("@carnelian-diagram/core/jsx-runtime");
var interaction_1 = require("@carnelian-diagram/interaction");
var hocs_1 = require("../hocs");
var utils_1 = require("../utils");
var multiline_text_1 = require("./multiline-text");
var Ellipse = function (props) {
    var onChange = props.onChange, x = props.x, y = props.y, width = props.width, height = props.height, rest = __rest(props, ["onChange", "x", "y", "width", "height"]);
    var rx = width / 2;
    var ry = height / 2;
    var cx = x + rx;
    var cy = y + ry;
    return ((0, jsx_runtime_1.jsx)("ellipse", __assign({}, { cx: cx, cy: cy, rx: rx, ry: ry }, rest)));
};
exports.Ellipse = Ellipse;
exports.InteractiveEllipse = (0, interaction_1.withInteractiveRect)(exports.Ellipse, {
    collider: function (props) { return (0, interaction_1.EllipseCollider)({ center: { x: props.x + props.width / 2, y: props.y + props.height / 2 }, rx: props.width / 2, ry: props.height / 2 }); },
    innerHitArea: function (hitArea) { return (__assign(__assign({}, hitArea), { dblClickAction: interaction_1.ACT_EDIT_TEXT })); }
});
exports.InteractiveEllipseWithText = (0, hocs_1.withText)(exports.InteractiveEllipse, (0, interaction_1.withInteractiveText)(multiline_text_1.MultilineText, function (props) { return props; }, function (props) { return (0, utils_1.textEditorStyles)(props.textStyle); }), function (props) { return props; });

},{"../hocs":126,"../utils":129,"./multiline-text":116,"@carnelian-diagram/core/jsx-runtime":17,"@carnelian-diagram/interaction":87}],113:[function(require,module,exports){
"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InteractiveHexagonWithText = exports.InteractiveHexagon = exports.Hexagon = void 0;
var jsx_runtime_1 = require("@carnelian-diagram/core/jsx-runtime");
var interaction_1 = require("@carnelian-diagram/interaction");
var geometry_1 = require("@carnelian-diagram/interaction/geometry");
var hocs_1 = require("../hocs");
var utils_1 = require("../utils");
var multiline_text_1 = require("./multiline-text");
var knobController = {
    hitArea: {
        type: "knob_handle",
        cursor: "default",
        action: "knob_move"
    },
    getPosition: function (props) {
        var base = props.width;
        var offset = (0, geometry_1.clamp)((0, utils_1.convertPercentage)(props.offset, base), 0, base / 2);
        return {
            x: props.x + offset,
            y: props.y
        };
    },
    setPosition: function (props, _a) {
        var position = _a.position;
        var base = props.width;
        var offset = (0, geometry_1.clamp)(position.x - props.x, 0, base / 2);
        offset = (0, utils_1.isPercentage)(props.offset)
            ? base > 0 ? "".concat(offset / base * 100, "%") : props.offset
            : offset;
        return __assign(__assign({}, props), { offset: offset });
    }
};
function toPolygon(props) {
    var x = props.x, y = props.y, width = props.width, height = props.height, offset = props.offset;
    offset = (0, geometry_1.clamp)((0, utils_1.convertPercentage)(offset, width), 0, width / 2);
    return [
        { x: x, y: y + height / 2 },
        { x: x + offset, y: y },
        { x: x + width - offset, y: y },
        { x: x + width, y: y + height / 2 },
        { x: x + width - offset, y: y + height },
        { x: x + offset, y: y + height }
    ];
}
;
var Hexagon = function (props) {
    var onChange = props.onChange, x = props.x, y = props.y, width = props.width, height = props.height, offset = props.offset, rest = __rest(props, ["onChange", "x", "y", "width", "height", "offset"]);
    var points = toPolygon(props);
    return ((0, jsx_runtime_1.jsx)("polygon", __assign({ points: points.map(function (p) { return "".concat(p.x, ",").concat(p.y); }).join(" ") }, rest)));
};
exports.Hexagon = Hexagon;
exports.InteractiveHexagon = (0, interaction_1.withInteractiveRect)((0, interaction_1.withKnob)(exports.Hexagon, knobController), {
    collider: function (props) { return (0, interaction_1.PolygonCollider)(toPolygon(props)); },
    innerHitArea: function (hitArea) { return (__assign(__assign({}, hitArea), { dblClickAction: interaction_1.ACT_EDIT_TEXT })); }
});
exports.InteractiveHexagonWithText = (0, hocs_1.withText)(exports.InteractiveHexagon, (0, interaction_1.withInteractiveText)(multiline_text_1.MultilineText, function (props) { return props; }, function (props) { return (0, utils_1.textEditorStyles)(props.textStyle); }), function (props) { return props; });

},{"../hocs":126,"../utils":129,"./multiline-text":116,"@carnelian-diagram/core/jsx-runtime":17,"@carnelian-diagram/interaction":87,"@carnelian-diagram/interaction/geometry":69}],114:[function(require,module,exports){
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
__exportStar(require("./line"), exports);
__exportStar(require("./polyline"), exports);
__exportStar(require("./polygon"), exports);
__exportStar(require("./rect"), exports);
__exportStar(require("./ellipse"), exports);
__exportStar(require("./diamond"), exports);
__exportStar(require("./rounded-rect"), exports);
__exportStar(require("./parallelogram"), exports);
__exportStar(require("./trapezoid"), exports);
__exportStar(require("./hexagon"), exports);
__exportStar(require("./square"), exports);
__exportStar(require("./circle"), exports);
__exportStar(require("./donut"), exports);
__exportStar(require("./cross"), exports);
__exportStar(require("./pie"), exports);
__exportStar(require("./text"), exports);
__exportStar(require("./multiline-text"), exports);

},{"./circle":108,"./cross":109,"./diamond":110,"./donut":111,"./ellipse":112,"./hexagon":113,"./line":115,"./multiline-text":116,"./parallelogram":117,"./pie":118,"./polygon":119,"./polyline":120,"./rect":121,"./rounded-rect":122,"./square":123,"./text":124,"./trapezoid":125}],115:[function(require,module,exports){
"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InteractiveLine = exports.Line = void 0;
var jsx_runtime_1 = require("@carnelian-diagram/core/jsx-runtime");
var interaction_1 = require("@carnelian-diagram/interaction");
var Line = function (props) {
    var onChange = props.onChange, rest = __rest(props, ["onChange"]);
    return ((0, jsx_runtime_1.jsx)("line", __assign({}, rest)));
};
exports.Line = Line;
exports.InteractiveLine = (0, interaction_1.withInteractiveLine)(exports.Line);

},{"@carnelian-diagram/core/jsx-runtime":17,"@carnelian-diagram/interaction":87}],116:[function(require,module,exports){
"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InteractiveMultilineText = exports.MultilineText = void 0;
var jsx_runtime_1 = require("@carnelian-diagram/core/jsx-runtime");
var interaction_1 = require("@carnelian-diagram/interaction");
var __1 = require("..");
var utils_1 = require("../utils");
var MultilineText = function (props) {
    var x = props.x, y = props.y, width = props.width, height = props.height, textStyle = props.textStyle, text = props.text;
    var textElementStyle;
    var lineHeight = (textStyle === null || textStyle === void 0 ? void 0 : textStyle.lineHeight) || 1;
    if (textStyle) {
        var textAlign = textStyle.textAlign, verticalAlign = textStyle.verticalAlign, lineHeight_1 = textStyle.lineHeight, rest = __rest(textStyle, ["textAlign", "verticalAlign", "lineHeight"]);
        textElementStyle = rest;
    }
    else {
        textElementStyle = {};
    }
    textElementStyle = __assign(__assign({}, textElementStyle), { fontFamily: (textStyle === null || textStyle === void 0 ? void 0 : textStyle.fontFamily) || __1.DEFAULT_FONT_FAMILY, fontSize: (textStyle === null || textStyle === void 0 ? void 0 : textStyle.fontSize) || __1.DEFAULT_FONT_SIZE });
    var _a = (0, utils_1.wrapText)(text, width, textStyle), lines = _a.lines, textMetrics = _a.textMetrics;
    var fontHeight = textMetrics.fontBoundingBoxAscent + textMetrics.fontBoundingBoxDescent;
    switch ((textStyle === null || textStyle === void 0 ? void 0 : textStyle.textAlign) || "center") {
        case "center":
            x = x + width / 2;
            textElementStyle.textAnchor = "middle";
            break;
        case "right":
            x = x + width;
            textElementStyle.textAnchor = "end";
            break;
        default:
            textElementStyle.textAnchor = "start";
    }
    var alignmentBaseline;
    switch ((textStyle === null || textStyle === void 0 ? void 0 : textStyle.verticalAlign) || "middle") {
        case "middle":
            y = y + height / 2 - (fontHeight * lineHeight * (lines.length - 1)) / 2;
            alignmentBaseline = "middle";
            break;
        case "bottom":
            y = y + height;
            alignmentBaseline = "text-after-edge";
            break;
        default:
            alignmentBaseline = "text-before-edge";
    }
    return ((0, jsx_runtime_1.jsx)("text", __assign({ x: x, y: y, style: textElementStyle }, { children: lines.map(function (line, i) { return ((0, jsx_runtime_1.jsx)("tspan", __assign({ x: x, dy: i > 0 ? fontHeight * lineHeight : undefined, style: { alignmentBaseline: alignmentBaseline } }, { children: line }))); }) })));
};
exports.MultilineText = MultilineText;
exports.InteractiveMultilineText = (0, interaction_1.withInteractiveText)((0, interaction_1.withInteractiveRect)(exports.MultilineText, {
    innerHitArea: function (hitArea) { return (__assign(__assign({}, hitArea), { dblClickAction: interaction_1.ACT_EDIT_TEXT })); }
}), function (props) { return props; }, function (props) { return (0, utils_1.textEditorStyles)(props.textStyle); }, {
    onPlaceText: function (props) { return (__assign(__assign({}, props), (0, utils_1.getTextBounds)(props.x, props.y, props.text, props.textStyle))); },
    deleteOnEmpty: true
});

},{"..":128,"../utils":129,"@carnelian-diagram/core/jsx-runtime":17,"@carnelian-diagram/interaction":87}],117:[function(require,module,exports){
"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InteractiveParallelogramWithText = exports.InteractiveParallelogram = exports.Parallelogram = void 0;
var jsx_runtime_1 = require("@carnelian-diagram/core/jsx-runtime");
var interaction_1 = require("@carnelian-diagram/interaction");
var geometry_1 = require("@carnelian-diagram/interaction/geometry");
var hocs_1 = require("../hocs");
var utils_1 = require("../utils");
var multiline_text_1 = require("./multiline-text");
var knobController = {
    hitArea: function (props) { return ({
        type: "knob_handle",
        cursor: "default",
        action: "knob_move",
        data: (0, utils_1.convertPercentage)(props.offset, props.width) >= 0 ? 0 : 1
    }); },
    getPosition: function (props) {
        var offset = (0, geometry_1.clamp)((0, utils_1.convertPercentage)(props.offset, props.width), -props.width, props.width);
        return {
            x: props.x + Math.abs(offset),
            y: offset >= 0 ? props.y : props.y + props.height
        };
    },
    setPosition: function (props, _a, hitArea) {
        var position = _a.position;
        var sign = hitArea.data === 0 ? 1 : -1;
        var offset = (0, geometry_1.clamp)(position.x - props.x, -props.width, props.width) * sign;
        offset = (0, utils_1.isPercentage)(props.offset)
            ? props.width > 0 ? "".concat(offset / props.width * 100, "%") : props.offset
            : offset;
        return __assign(__assign({}, props), { offset: offset });
    }
};
function toPolygon(props) {
    var x = props.x, y = props.y, width = props.width, height = props.height, offset = props.offset;
    offset = (0, geometry_1.clamp)((0, utils_1.convertPercentage)(offset, width), -width, width);
    return offset >= 0 ? [
        { x: x + offset, y: y },
        { x: x + width, y: y },
        { x: x + width - offset, y: y + height },
        { x: x, y: y + height }
    ] : [
        { x: x, y: y },
        { x: x + width + offset, y: y },
        { x: x + width, y: y + height },
        { x: x - offset, y: y + height }
    ];
}
var Parallelogram = function (props) {
    var onChange = props.onChange, x = props.x, y = props.y, width = props.width, height = props.height, offset = props.offset, rest = __rest(props, ["onChange", "x", "y", "width", "height", "offset"]);
    var points = toPolygon(props);
    return ((0, jsx_runtime_1.jsx)("polygon", __assign({ points: points.map(function (p) { return "".concat(p.x, ",").concat(p.y); }).join(" ") }, rest)));
};
exports.Parallelogram = Parallelogram;
exports.InteractiveParallelogram = (0, interaction_1.withInteractiveRect)((0, interaction_1.withKnob)(exports.Parallelogram, knobController), {
    collider: function (props) { return (0, interaction_1.PolygonCollider)(toPolygon(props)); },
    innerHitArea: function (hitArea) { return (__assign(__assign({}, hitArea), { dblClickAction: interaction_1.ACT_EDIT_TEXT })); }
});
exports.InteractiveParallelogramWithText = (0, hocs_1.withText)(exports.InteractiveParallelogram, (0, interaction_1.withInteractiveText)(multiline_text_1.MultilineText, function (props) { return props; }, function (props) { return (0, utils_1.textEditorStyles)(props.textStyle); }), function (props) { return props; });

},{"../hocs":126,"../utils":129,"./multiline-text":116,"@carnelian-diagram/core/jsx-runtime":17,"@carnelian-diagram/interaction":87,"@carnelian-diagram/interaction/geometry":69}],118:[function(require,module,exports){
"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InteractivePie = exports.Pie = void 0;
var jsx_runtime_1 = require("@carnelian-diagram/core/jsx-runtime");
var interaction_1 = require("@carnelian-diagram/interaction");
var geometry_1 = require("@carnelian-diagram/interaction/geometry");
function getCirclePoint(x, y, radius, angle) {
    return {
        x: x + radius * Math.cos((0, geometry_1.degToRad)(angle)),
        y: y + radius * Math.sin((0, geometry_1.degToRad)(angle))
    };
}
function knobController(index) {
    return {
        hitArea: {
            type: "knob_handle",
            index: index,
            cursor: "default",
            action: "knob_move",
        },
        getPosition: function (props) {
            var angle = index === 0 ? props.startAngle : props.endAngle;
            return getCirclePoint(props.x, props.y, props.radius, angle);
        },
        setPosition: function (props, _a) {
            var position = _a.rawPosition, snapAngle = _a.snapAngle, snapToGrid = _a.snapToGrid;
            var angle = (0, geometry_1.radToDeg)(Math.atan2(position.y - props.y, position.x - props.x));
            angle = snapToGrid ? snapToGrid(angle, snapAngle) : angle;
            return __assign(__assign({}, props), { startAngle: index === 0 ? angle : props.startAngle, endAngle: index === 1 ? angle : props.endAngle });
        }
    };
}
;
function PieCollider(props) {
    var x = props.x, y = props.y, radius = props.radius, startAngle = props.startAngle, endAngle = props.endAngle;
    var center = { x: x, y: y };
    var start = getCirclePoint(x, y, radius, startAngle);
    var end = getCirclePoint(x, y, radius, endAngle);
    var AngleCollider = Math.sin((0, geometry_1.degToRad)(endAngle - startAngle)) < 0 ? interaction_1.UnionCollider : interaction_1.IntersectionCollider;
    return (0, interaction_1.IntersectionCollider)((0, interaction_1.CircleCollider)({ center: center, radius: radius }), AngleCollider((0, interaction_1.HalfPlaneCollider)({ a: center, b: start }), (0, interaction_1.HalfPlaneCollider)({ a: end, b: center })));
}
var Pie = function (props) {
    var onChange = props.onChange, x = props.x, y = props.y, radius = props.radius, startAngle = props.startAngle, endAngle = props.endAngle, rest = __rest(props, ["onChange", "x", "y", "radius", "startAngle", "endAngle"]);
    var isCircle = endAngle - startAngle === 360;
    endAngle = isCircle ? endAngle - 1 : endAngle;
    var largeArcFlag = Math.sin((0, geometry_1.degToRad)(endAngle - startAngle)) >= 0 ? 0 : 1;
    var start = getCirclePoint(x, y, radius, startAngle);
    var end = getCirclePoint(x, y, radius, endAngle);
    var path = "M".concat(start.x, " ").concat(start.y, " A").concat(radius, ",").concat(radius, " 0 ").concat(largeArcFlag, " 1 ").concat(end.x, " ").concat(end.y);
    path += isCircle ? "Z" : "L".concat(x, " ").concat(y, "Z");
    return ((0, jsx_runtime_1.jsx)("path", __assign({ d: path }, rest)));
};
exports.Pie = Pie;
exports.InteractivePie = (0, interaction_1.withInteractiveCircle)((0, interaction_1.withKnobs)(exports.Pie, knobController(0), knobController(1)), { collider: PieCollider });

},{"@carnelian-diagram/core/jsx-runtime":17,"@carnelian-diagram/interaction":87,"@carnelian-diagram/interaction/geometry":69}],119:[function(require,module,exports){
"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InteractivePolygon = exports.Polygon = void 0;
var jsx_runtime_1 = require("@carnelian-diagram/core/jsx-runtime");
var interaction_1 = require("@carnelian-diagram/interaction");
var Polygon = function (props) {
    var points = props.points, onChange = props.onChange, rest = __rest(props, ["points", "onChange"]);
    var polygonProps = __assign(__assign({}, rest), { style: __assign(__assign({}, rest.style), { fillRule: "evenodd" }) });
    return ((0, jsx_runtime_1.jsx)("polygon", __assign({ points: points.map(function (p) { return "".concat(p.x, ",").concat(p.y); }).join(" ") }, polygonProps)));
};
exports.Polygon = Polygon;
exports.InteractivePolygon = (0, interaction_1.withInteractivePolyline)(exports.Polygon, true, 3, { collider: function (props) { return (0, interaction_1.PolygonCollider)(props.points); } });

},{"@carnelian-diagram/core/jsx-runtime":17,"@carnelian-diagram/interaction":87}],120:[function(require,module,exports){
"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InteractivePolyline = exports.Polyline = void 0;
var jsx_runtime_1 = require("@carnelian-diagram/core/jsx-runtime");
var interaction_1 = require("@carnelian-diagram/interaction");
var Polyline = function (props) {
    var points = props.points, onChange = props.onChange, rest = __rest(props, ["points", "onChange"]);
    var polylineProps = __assign(__assign({}, rest), { style: __assign(__assign({}, rest.style), { fill: "none" }) });
    return ((0, jsx_runtime_1.jsx)("polyline", __assign({ points: points.map(function (p) { return "".concat(p.x, ",").concat(p.y); }).join(" ") }, polylineProps)));
};
exports.Polyline = Polyline;
exports.InteractivePolyline = (0, interaction_1.withInteractivePolyline)(exports.Polyline, false, 2);

},{"@carnelian-diagram/core/jsx-runtime":17,"@carnelian-diagram/interaction":87}],121:[function(require,module,exports){
"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InteractiveRectWithText = exports.InteractiveRect = exports.Rect = void 0;
var jsx_runtime_1 = require("@carnelian-diagram/core/jsx-runtime");
var interaction_1 = require("@carnelian-diagram/interaction");
var hocs_1 = require("../hocs");
var utils_1 = require("../utils");
var multiline_text_1 = require("./multiline-text");
var Rect = function (props) {
    var onChange = props.onChange, rest = __rest(props, ["onChange"]);
    return ((0, jsx_runtime_1.jsx)("rect", __assign({}, rest)));
};
exports.Rect = Rect;
exports.InteractiveRect = (0, interaction_1.withInteractiveRect)(exports.Rect, {
    innerHitArea: function (hitArea) { return (__assign(__assign({}, hitArea), { dblClickAction: interaction_1.ACT_EDIT_TEXT })); }
});
exports.InteractiveRectWithText = (0, hocs_1.withText)(exports.InteractiveRect, (0, interaction_1.withInteractiveText)(multiline_text_1.MultilineText, function (props) { return props; }, function (props) { return (0, utils_1.textEditorStyles)(props.textStyle); }), function (props) { return props; });

},{"../hocs":126,"../utils":129,"./multiline-text":116,"@carnelian-diagram/core/jsx-runtime":17,"@carnelian-diagram/interaction":87}],122:[function(require,module,exports){
"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InteractiveRoundedRectWithText = exports.InteractiveRoundedRect = exports.RoundedRect = void 0;
var jsx_runtime_1 = require("@carnelian-diagram/core/jsx-runtime");
var interaction_1 = require("@carnelian-diagram/interaction");
var geometry_1 = require("@carnelian-diagram/interaction/geometry");
var hocs_1 = require("../hocs");
var utils_1 = require("../utils");
var multiline_text_1 = require("./multiline-text");
var knobController = {
    hitArea: {
        type: "knob_handle",
        cursor: "default",
        action: "knob_move"
    },
    getPosition: function (props) {
        var base = Math.min(props.width, props.height) / 2;
        var offset = (0, geometry_1.clamp)((0, utils_1.convertPercentage)(props.radius, base), 0, base);
        return {
            x: props.x + offset,
            y: props.y
        };
    },
    setPosition: function (props, _a) {
        var position = _a.position;
        var base = Math.min(props.width, props.height) / 2;
        var radius = (0, geometry_1.clamp)(position.x - props.x, 0, base);
        radius = (0, utils_1.isPercentage)(props.radius)
            ? base > 0 ? "".concat(radius / base * 100, "%") : props.radius
            : radius;
        return __assign(__assign({}, props), { radius: radius });
    }
};
var RoundedRect = function (props) {
    var onChange = props.onChange, radius = props.radius, rest = __rest(props, ["onChange", "radius"]);
    var base = Math.min(props.width, props.height) / 2;
    radius = (0, geometry_1.clamp)((0, utils_1.convertPercentage)(radius, base), 0, base);
    return ((0, jsx_runtime_1.jsx)("rect", __assign({ rx: radius }, rest)));
};
exports.RoundedRect = RoundedRect;
exports.InteractiveRoundedRect = (0, interaction_1.withInteractiveRect)((0, interaction_1.withKnob)(exports.RoundedRect, knobController), {
    innerHitArea: function (hitArea) { return (__assign(__assign({}, hitArea), { dblClickAction: interaction_1.ACT_EDIT_TEXT })); }
});
exports.InteractiveRoundedRectWithText = (0, hocs_1.withText)(exports.InteractiveRoundedRect, (0, interaction_1.withInteractiveText)(multiline_text_1.MultilineText, function (props) { return props; }, function (props) { return (0, utils_1.textEditorStyles)(props.textStyle); }), function (props) { return props; });

},{"../hocs":126,"../utils":129,"./multiline-text":116,"@carnelian-diagram/core/jsx-runtime":17,"@carnelian-diagram/interaction":87,"@carnelian-diagram/interaction/geometry":69}],123:[function(require,module,exports){
"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InteractiveSquareWithText = exports.InteractiveSquare = exports.Square = void 0;
var jsx_runtime_1 = require("@carnelian-diagram/core/jsx-runtime");
;
var interaction_1 = require("@carnelian-diagram/interaction");
var hocs_1 = require("../hocs");
var utils_1 = require("../utils");
var multiline_text_1 = require("./multiline-text");
var Square = function (props) {
    var onChange = props.onChange, x = props.x, y = props.y, size = props.size, rest = __rest(props, ["onChange", "x", "y", "size"]);
    return ((0, jsx_runtime_1.jsx)("rect", __assign({ x: x, y: y, width: size, height: size }, rest)));
};
exports.Square = Square;
exports.InteractiveSquare = (0, interaction_1.withInteractiveSquare)(exports.Square, {
    innerHitArea: function (hitArea) { return (__assign(__assign({}, hitArea), { dblClickAction: interaction_1.ACT_EDIT_TEXT })); }
});
exports.InteractiveSquareWithText = (0, hocs_1.withText)(exports.InteractiveSquare, (0, interaction_1.withInteractiveText)(multiline_text_1.MultilineText, function (props) { return props; }, function (props) { return (0, utils_1.textEditorStyles)(props.textStyle); }), function (props) { return ({
    x: props.x,
    y: props.y,
    width: props.size,
    height: props.size,
    text: props.text,
    textStyle: props.textStyle
}); });

},{"../hocs":126,"../utils":129,"./multiline-text":116,"@carnelian-diagram/core/jsx-runtime":17,"@carnelian-diagram/interaction":87}],124:[function(require,module,exports){
"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InteractiveText = exports.Text = void 0;
var jsx_runtime_1 = require("@carnelian-diagram/core/jsx-runtime");
var interaction_1 = require("@carnelian-diagram/interaction");
var __1 = require("..");
var utils_1 = require("../utils");
var Text = function (props) {
    var x = props.x, y = props.y, width = props.width, height = props.height, textStyle = props.textStyle, text = props.text;
    var textElementStyle;
    if (textStyle) {
        var textAlign = textStyle.textAlign, verticalAlign = textStyle.verticalAlign, rest = __rest(textStyle, ["textAlign", "verticalAlign"]);
        textElementStyle = rest;
    }
    else {
        textElementStyle = {};
    }
    textElementStyle = __assign(__assign({}, textElementStyle), { fontFamily: (textStyle === null || textStyle === void 0 ? void 0 : textStyle.fontFamily) || __1.DEFAULT_FONT_FAMILY, fontSize: (textStyle === null || textStyle === void 0 ? void 0 : textStyle.fontSize) || __1.DEFAULT_FONT_SIZE });
    switch ((textStyle === null || textStyle === void 0 ? void 0 : textStyle.textAlign) || "center") {
        case "center":
            x = x + width / 2;
            textElementStyle.textAnchor = "middle";
            break;
        case "right":
            x = x + width;
            textElementStyle.textAnchor = "end";
            break;
        default:
            textElementStyle.textAnchor = "start";
    }
    switch ((textStyle === null || textStyle === void 0 ? void 0 : textStyle.verticalAlign) || "middle") {
        case "middle":
            y = y + height / 2;
            textElementStyle.alignmentBaseline = "middle";
            break;
        case "bottom":
            y = y + height;
            textElementStyle.alignmentBaseline = "text-after-edge";
            break;
        default:
            textElementStyle.alignmentBaseline = "text-before-edge";
    }
    return ((0, jsx_runtime_1.jsx)("text", __assign({ x: x, y: y, style: textElementStyle }, { children: text })));
};
exports.Text = Text;
exports.InteractiveText = (0, interaction_1.withInteractiveText)((0, interaction_1.withInteractiveRect)(exports.Text, {
    innerHitArea: function (hitArea) { return (__assign(__assign({}, hitArea), { dblClickAction: interaction_1.ACT_EDIT_TEXT })); }
}), function (props) { return props; }, function (props) { return (0, utils_1.textEditorStyles)(props.textStyle); }, {
    onPlaceText: function (props) { return (__assign(__assign({}, props), (0, utils_1.getTextBounds)(props.x, props.y, props.text, props.textStyle))); },
    deleteOnEmpty: true
});

},{"..":128,"../utils":129,"@carnelian-diagram/core/jsx-runtime":17,"@carnelian-diagram/interaction":87}],125:[function(require,module,exports){
"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InteractiveTrapezoidWithText = exports.InteractiveTrapezoid = exports.Trapezoid = void 0;
var jsx_runtime_1 = require("@carnelian-diagram/core/jsx-runtime");
var interaction_1 = require("@carnelian-diagram/interaction");
var geometry_1 = require("@carnelian-diagram/interaction/geometry");
var hocs_1 = require("../hocs");
var utils_1 = require("../utils");
var multiline_text_1 = require("./multiline-text");
var knobController = {
    hitArea: {
        type: "knob_handle",
        cursor: "default",
        action: "knob_move"
    },
    getPosition: function (props) {
        var base = props.width;
        var offset = (0, geometry_1.clamp)((0, utils_1.convertPercentage)(props.offset, base), 0, base / 2);
        return {
            x: props.x + offset,
            y: props.y
        };
    },
    setPosition: function (props, _a) {
        var position = _a.position;
        var base = props.width;
        var offset = (0, geometry_1.clamp)(position.x - props.x, 0, base / 2);
        offset = (0, utils_1.isPercentage)(props.offset)
            ? base > 0 ? "".concat(offset / base * 100, "%") : props.offset
            : offset;
        return __assign(__assign({}, props), { offset: offset });
    }
};
function toPolygon(props) {
    var x = props.x, y = props.y, width = props.width, height = props.height, offset = props.offset;
    offset = (0, geometry_1.clamp)((0, utils_1.convertPercentage)(offset, width), 0, width / 2);
    return [
        { x: x + offset, y: y },
        { x: x + width - offset, y: y },
        { x: x + width, y: y + height },
        { x: x, y: y + height }
    ];
}
var Trapezoid = function (props) {
    var onChange = props.onChange, x = props.x, y = props.y, width = props.width, height = props.height, offset = props.offset, rest = __rest(props, ["onChange", "x", "y", "width", "height", "offset"]);
    var points = toPolygon(props);
    return ((0, jsx_runtime_1.jsx)("polygon", __assign({ points: points.map(function (p) { return "".concat(p.x, ",").concat(p.y); }).join(" ") }, rest)));
};
exports.Trapezoid = Trapezoid;
exports.InteractiveTrapezoid = (0, interaction_1.withInteractiveRect)((0, interaction_1.withKnob)(exports.Trapezoid, knobController), {
    collider: function (props) { return (0, interaction_1.PolygonCollider)(toPolygon(props)); },
    innerHitArea: function (hitArea) { return (__assign(__assign({}, hitArea), { dblClickAction: interaction_1.ACT_EDIT_TEXT })); }
});
exports.InteractiveTrapezoidWithText = (0, hocs_1.withText)(exports.InteractiveTrapezoid, (0, interaction_1.withInteractiveText)(multiline_text_1.MultilineText, function (props) { return props; }, function (props) { return (0, utils_1.textEditorStyles)(props.textStyle); }), function (props) { return props; });

},{"../hocs":126,"../utils":129,"./multiline-text":116,"@carnelian-diagram/core/jsx-runtime":17,"@carnelian-diagram/interaction":87,"@carnelian-diagram/interaction/geometry":69}],126:[function(require,module,exports){
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
__exportStar(require("./with-text"), exports);

},{"./with-text":127}],127:[function(require,module,exports){
"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.withText = void 0;
var jsx_runtime_1 = require("@carnelian-diagram/core/jsx-runtime");
function withText(WrappedElement, TextElement, textElementProps) {
    return function (props) {
        var text = props.text, textStyle = props.textStyle, rest = __rest(props, ["text", "textStyle"]);
        var elementProps = rest;
        var textProps = __assign(__assign({}, textElementProps(props)), { onChange: function (callback) {
                props.onChange(function (props) {
                    var _a = callback(textProps), text = _a.text, textStyle = _a.textStyle;
                    return __assign(__assign({}, props), { text: text, textStyle: textStyle });
                });
            } });
        return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(WrappedElement, __assign({}, elementProps)), (0, jsx_runtime_1.jsx)(TextElement, __assign({}, textProps))] }));
    };
}
exports.withText = withText;

},{"@carnelian-diagram/core/jsx-runtime":17}],128:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT_FONT_FAMILY = exports.DEFAULT_FONT_SIZE = void 0;
exports.DEFAULT_FONT_SIZE = "10px";
exports.DEFAULT_FONT_FAMILY = "sans-serif";

},{}],129:[function(require,module,exports){
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertPercentage = exports.isPercentage = void 0;
__exportStar(require("./text-utils"), exports);
function isPercentage(value) {
    return typeof value === "string" && value.charAt(value.length - 1) === "%";
}
exports.isPercentage = isPercentage;
function convertPercentage(value, base) {
    return isPercentage(value) ? parseFloat(value) * base / 100 : +value;
}
exports.convertPercentage = convertPercentage;

},{"./text-utils":130}],130:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.textEditorStyles = exports.getTextBounds = exports.wrapText = exports.measureText = void 0;
var __1 = require("..");
function with2dContext(action, style) {
    var canvas = document.createElement('canvas');
    try {
        var ctx = canvas.getContext("2d");
        if (ctx) {
            var fontSize = (style === null || style === void 0 ? void 0 : style.fontSize) || __1.DEFAULT_FONT_SIZE;
            var fontFamily = (style === null || style === void 0 ? void 0 : style.fontFamily) || __1.DEFAULT_FONT_FAMILY;
            var font = [style === null || style === void 0 ? void 0 : style.fontStyle, style === null || style === void 0 ? void 0 : style.fontVariant, style === null || style === void 0 ? void 0 : style.fontWeight, style === null || style === void 0 ? void 0 : style.fontStretch, fontSize, fontFamily]
                .filter(function (x) { return x !== undefined; })
                .join(' ');
            ctx.font = font;
            return action(ctx);
        }
        else {
            throw new Error("An error has occured while getting a canvas 2d context");
        }
    }
    finally {
        canvas.remove();
    }
}
function measureText(text, style) {
    return with2dContext(function (ctx) { return ctx.measureText(text); }, style);
}
exports.measureText = measureText;
function wrapText(text, width, style) {
    return with2dContext(function (ctx) {
        var lines = [];
        var words = text.split(' ');
        var line = [];
        while (words.length > 0) {
            var word = words.shift();
            line.push(word);
            var size = ctx.measureText(line.join(' '));
            if (size.width > width || words.length === 0) {
                if (size.width > width && line.length > 1) {
                    line.pop();
                    words.unshift(word);
                }
                lines.push(line.join(' '));
                line = [];
            }
        }
        var textMetrics = ctx.measureText(text);
        return { lines: lines, textMetrics: textMetrics };
    }, style);
}
exports.wrapText = wrapText;
function getTextBounds(x, y, text, style) {
    var textMetrics = measureText(text, style);
    var width = textMetrics.width;
    var height = textMetrics.fontBoundingBoxAscent + textMetrics.fontBoundingBoxDescent;
    switch ((style === null || style === void 0 ? void 0 : style.textAlign) || "center") {
        case "center":
            x = x - width / 2;
            break;
        case "right":
            x = x - width;
            break;
    }
    switch ((style === null || style === void 0 ? void 0 : style.verticalAlign) || "middle") {
        case "middle":
            y = y - height / 2;
            break;
        case "bottom":
            y = y - height;
            break;
    }
    return { x: x, y: y, width: width, height: height };
}
exports.getTextBounds = getTextBounds;
function textEditorStyles(style) {
    return {
        fontSize: (style === null || style === void 0 ? void 0 : style.fontSize) || __1.DEFAULT_FONT_SIZE,
        fontFamily: (style === null || style === void 0 ? void 0 : style.fontFamily) || __1.DEFAULT_FONT_FAMILY,
        fontStyle: style === null || style === void 0 ? void 0 : style.fontStyle,
        fontWeight: style === null || style === void 0 ? void 0 : style.fontWeight,
        textAlign: (style === null || style === void 0 ? void 0 : style.textAlign) || "center",
        verticalAlign: (style === null || style === void 0 ? void 0 : style.verticalAlign) || "middle"
    };
}
exports.textEditorStyles = textEditorStyles;

},{"..":128}]},{},[1]);
