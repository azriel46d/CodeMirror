// CodeMirror, copyright (c) by Marijn Haverbeke and others
// Distributed under an MIT license: http://codemirror.net/LICENSE

(function(mod) {
  if (typeof exports == "object" && typeof module == "object")
    // CommonJS
    mod(require("../../lib/codemirror"));
  else if (typeof define == "function" && define.amd)
    // AMD
    define(["../../lib/codemirror"], mod);
  // Plain browser env
  else mod(CodeMirror);
})(function(CodeMirror) {
  "use strict";
  var intelliModes = {};
  CodeMirror.defineIntellisense = function(name, mode) {
    intelliModes[name] = mode;
  };
  CodeMirror.defineOption("intellisense", false, function(cm, val, old) {
    if (old == CodeMirror.Init) old = false;
    if (!old == !val) return;
    if (val) startIntellisense(cm, val);
    else stopIntellisense(cm);
  });

  function startIntellisense(editor, mode) {
    var modeInstance = (intelliModes[mode] && intelliModes[mode]()) || {};
    var keywords = modeInstance && modeInstance.keywords;

    if (keywords != null && !(keywords instanceof Array)) {
      var d = [];
      for (var x in keywords) {
        var obj = { name: x };
        if (
          !keywords[x].value &&
          keywords[x].parameters &&
          keywords[x].parameters.length
        ) {
          obj.value = x + "(";
        }
        d.push(Object.assign(keywords[x], obj));
      }
      keywords = d;
    }

    //Initialise Intellisense
    var intellisense = new CodeMirrorIntellisense(editor);
    editor.intellisense = intellisense;

    //Set event triggers
    modeInstance.triggers && modeInstance.triggers.forEach(function(t) {
      intellisense.addEventTrigger(t);
    });

    //ON HAVING AN ITEM CHOSEN, show the appropriate tooltip
    var _chosenItem;
    intellisense.decls.onItemChosen(function(item) {
      _chosenItem = {
        item: item,
        pos: editor.getCursor()
      };
      if (item && item.parameters && item.parameters.length) {
        if (item.value.charAt(item.value.length - 1) === "(") {
          intellisense.declarationsCallback({
            keyCode: 57,
            shiftKey: true,
            next: true,
            trigger: "declaration"
          });
        }

        var tooltip = intellisense.formatItemTooltip(item, { highlight: 0 });
        setTimeout(function() {
          intellisense.showHoverTooltip(tooltip);
        }, 200);
      }
    });

    // called when the user has hovered over some text
    intellisense.onHover(function(item) {
      var word = intellisense.getWordAtPosition(item);
      if (word) {
        var defn = keywords.find(function(k) {
          return k.name.toLowerCase() == word.toLowerCase();
        });
        if (defn) {
          var tooltip = intellisense.formatItemTooltip(defn);
          intellisense.showHoverTooltip(tooltip, { cursor: true });
        }
      }
    });

    //PERform the appropriate trigger
    intellisense.onMethod(function(item) {
      if (item.close) {
        intellisense.getDecls().setVisible(false);
        intellisense.getMeths().setVisible(false);
      } else if (item.function) {
        item.function(editor, keywords, item);
      }
    });

    // called when the declarations are triggered
    editor.intellisense.onDeclaration(function(item) {
      if (item.keyCode == 32 && item.ctrlKey) {
        //IF the editor is loaded in mid senetence
        var pos = editor.getCursor();
        var text = editor.getLine(pos.line);
        var sub = text.substring(0, pos.ch);
        var subSplit = sub.split(/[\(,=\) ]/g);
        var filter = subSplit.pop();
        subSplit.push("!!__!!");
        var pos = subSplit.join("_");
        editor.intellisense.setStartColumnIndex(pos.indexOf("!!__!!"));
        editor.intellisense.decls.setFilter(filter);
      }
      var pos = editor.getCursor();
      editor.intellisense._initialFilterPosition = {
        ch: pos.ch + 1,
        line: pos.line
      };
      if (item.next) {
        CodeMirror.on(editor, "keydown", function __lazy(cm, evt) {
          CodeMirror.off(editor, "keydown", __lazy);
          if (
            modeInstance.triggers.find(function(t) {
              t.keyCode === evt.keyCode;
            }) ||
            evt.keyCode === 8
          ) {
            return false;
          }
          editor.intellisense.setStartColumnIndex(editor.getCursor().ch);
          editor.intellisense.setDeclarations(keywords);
        });

        return false;
      }

      editor.intellisense.setDeclarations(keywords);
    });

    CodeMirror.on(editor, "keydown", function __backspace(cm, ev) {
      if (ev.keyCode === 8) {
        var pos = editor.getCursor();
        var intellisenseStart = editor.intellisense._initialFilterPosition;
        if (
          intellisenseStart &&
          pos.ch < intellisenseStart.ch &&
          editor.intellisense.getDecls().isVisible()
        ) {
          editor.intellisense.getDecls().setVisible(false);
        }
      }
    });
  }

  function stopIntellisense(editor) {
    //CodeMirror.off(window, "mouseup", state.hurry)
    //CodeMirror.off(window, "keyup", state.hurry)
  }

  function noop() {}
  function CodeMirrorIntellisense(editor) {
    var _this = this;
    this.decls = new wi.DeclarationsIntellisense(editor);
    this.meths = new wi.MethodsIntellisense(editor);
    this.triggers = { upDecls: [], downDecls: [], upMeths: [], downMeths: [] };
    this.declarationsCallback = noop;
    this.methodsCallback = noop;
    this.autoCompleteStart = { lineIndex: 0, columnIndex: 0 };
    this.hoverTimeout = 300;
    this.tooltip = new wi.Tooltip(editor);
    this.lastMouseX = 0;
    this.lastMouseY = 0;
    this.prevCoords = { line: 0, ch: 0 };
    this.editor = editor;
    // when the visiblity has changed for the declarations, set the position of the methods UI
    this.decls.onVisibleChanged(function(v) {
      if (v) {
        var coords = editor.cursorCoords(true, "page");
        _this.decls.setPosition(coords.left, coords.bottom);
      }
    });
    // when the visiblity has changed for the methods, set the position of the methods UI
    this.meths.onVisibleChanged(function(v) {
      if (v) {
        var coords = editor.cursorCoords(true, "page");
        _this.meths.setPosition(coords.left, coords.bottom);
      }
    });
    // when an item is chosen by the declarations UI, set the value.
    this.decls.onItemChosen(function(item) {
      if (!item) {
        return false;
      }
      var doc = editor.getDoc();
      var itemValue = item.value || item.name;
      var cursor = doc.getCursor();
      var line = doc.getLine(_this.autoCompleteStart.lineIndex);
      var startRange = {
        line: cursor.line,
        ch: _this.autoCompleteStart.columnIndex
      };
      var endRange = { line: cursor.line, ch: cursor.ch };
      doc.replaceRange(itemValue, startRange, endRange);
      doc.setSelection(
        { line: cursor.line, ch: cursor.ch + itemValue.length },
        null
      );
      _this.decls.setVisible(false);
      editor.focus();
    });
    var timer = null;
    editor.getWrapperElement().addEventListener("mousemove", function(evt) {
      _this.lastMouseX = evt.clientX;
      _this.lastMouseY = evt.clientY;
      if (timer) {
        clearTimeout(timer);
      }
      timer = setTimeout(function() {
        _this.tooltip.setVisible(false);
        if (_this.hoverCallback) {
          var source = editor.getDoc().getValue();
          var coords = editor.coordsChar({
            left: _this.lastMouseX,
            top: _this.lastMouseY
          });
          if (coords.outside != true) {
            if (
              _this.prevCoords.line !== coords.line ||
              _this.prevCoords.ch !== coords.ch
            ) {
              _this.prevCoords = coords;
              _this.hoverCallback(coords, evt);
            }
          }
        }
      }, _this.hoverTimeout);
    });
    CodeMirror.on(editor, "cursorActivity", function(cm, evt) {
      _this.tooltip.setVisible(false);
    });
    CodeMirror.on(editor, "keyup", function(cm, evt) {
      _this.tooltip.setVisible(false);
      if (_this.decls.isVisible()) {
        _this.decls.setFilter(_this.getFilterText());
      }
      if (
        !_this.processTriggers(
          _this.triggers.upDecls,
          evt,
          _this.declarationsCallback
        )
      ) {
        _this.processTriggers(
          _this.triggers.upMeths,
          evt,
          _this.methodsCallback
        );
      }
    });
    CodeMirror.on(editor, "keydown", function(cm, evt) {
      _this.tooltip.setVisible(false);
      if (_this.decls.isVisible()) {
        if (evt.keyCode === wi.Keys.Backspace) {
          _this.decls.setFilter(_this.getFilterText());
        } else {
          _this.decls.handleKeyDown(evt);
        }
      }
      if (
        !_this.processTriggers(
          _this.triggers.downDecls,
          evt,
          _this.declarationsCallback
        )
      ) {
        _this.processTriggers(
          _this.triggers.downMeths,
          evt,
          _this.methodsCallback
        );
      }
      if (_this.meths.isVisible()) {
        _this.meths.handleKeyDown(evt);
      }
    });
  }
  CodeMirrorIntellisense.prototype.processTriggers = function(
    triggers,
    evt,
    callback
  ) {
    var _this = this;
    triggers.forEach(function(item) {
      var doc = _this.editor.getDoc();
      var shiftKey = item.shiftKey || false;
      var ctrlKey = item.ctrlKey || false;
      var keyCode = item.keyCode || 0;
      var preventDefault = item.preventDefault || false;
      if (
        evt.keyCode === keyCode &&
        evt.shiftKey === shiftKey &&
        evt.ctrlKey === ctrlKey
      ) {
        var cursor = doc.getCursor();
        _this.autoCompleteStart.columnIndex = cursor.ch;
        _this.autoCompleteStart.lineIndex = cursor.line;
        callback(item);
        if (preventDefault) {
          evt.preventDefault();
          evt.cancelBubble = true;
        }
        return true;
      }
    });
    return false;
  };
  /**
   * Adds a trigger
   * @param trigger The trigger to add
   * @param methsOrDecls The type (either Meths or Decls)
   */
  CodeMirrorIntellisense.prototype.addTrigger = function(
    trigger,
    methsOrDecls
  ) {
    var type = trigger.type || "up";
    if (this.triggers[type + methsOrDecls]) {
      this.triggers[type + methsOrDecls].push(trigger);
    }
  };
  /**
   * Gets the tooltip object
   */
  CodeMirrorIntellisense.prototype.getTooltip = function() {
    return this.tooltip;
  };
  /**
   * Shows a hover tooltip at the last position of the mouse
   * @param tooltipString The tooltip string to show
   */
  CodeMirrorIntellisense.prototype.showHoverTooltip = function(
    tooltipString,
    opts
  ) {
    if (tooltipString == null || tooltipString === "") {
      this.tooltip.setVisible(false);
    } else {
      var pos = this.editor.charCoords(this.editor.getCursor(), "page");
      this.tooltip.setHtml(tooltipString);
      if (opts && opts.cursor) {
        this.tooltip.setPosition(this.lastMouseX, this.lastMouseY);
      } else {
        this.tooltip.setPosition(pos.left, pos.bottom);
      }
      this.tooltip.setVisible(true);
    }
  };

  /**
   * Adds a trigger to the list of triggers that can cause the declarations user interface
   * to popup.
   * @param trigger The trigger to add
   */
  CodeMirrorIntellisense.prototype.addEventTrigger = function(trigger) {
    var t = trigger.trigger === "declaration" ? "Decls" : "Meths";
    this.addTrigger(trigger, t);
  };

  /**
   * Adds a trigger to the list of triggers that can cause the declarations user interface
   * to popup.
   * @param trigger The trigger to add
   */
  CodeMirrorIntellisense.prototype.addDeclarationTrigger = function(trigger) {
    this.addTrigger(trigger, "Decls");
  };
  /**
   * Adds a trigger to the list of triggers that can cause the methods user interface
   * to popup.
   * @param trigger The trigger to add
   */
  CodeMirrorIntellisense.prototype.addMethodsTrigger = function(trigger) {
    this.addTrigger(trigger, "Meths");
  };
  /**
   * When the user hovers over some text, calls the specified function
   * @param callback The callback function
   */
  CodeMirrorIntellisense.prototype.onHover = function(callback) {
    this.hoverCallback = callback;
  };
  /**
   * Sets a callback to invoke when a key is pressed that causes the declarations list to
   * popup.
   * @param callback The callback to set
   */
  CodeMirrorIntellisense.prototype.onDeclaration = function(callback) {
    this.declarationsCallback = callback;
  };
  /**
   * Sets a callback to invoke when a key is pressed that causes the methods list to
   * popup.
   * @param callback The callback to set
   */
  CodeMirrorIntellisense.prototype.onMethod = function(callback) {
    this.methodsCallback = callback;
  };
  /**
   * Gets the text after startColumnIndex but before caret offset.
   */
  CodeMirrorIntellisense.prototype.getFilterText = function() {
    var doc = this.editor.getDoc();
    var cursor = doc.getCursor();
    var line = doc.getLine(this.autoCompleteStart.lineIndex);
    return (
      line && line.substring(this.autoCompleteStart.columnIndex, cursor.ch)
    );
  };
  /**
   * Gets the declarations user interface
   */
  CodeMirrorIntellisense.prototype.getDecls = function() {
    return this.decls;
  };
  /**
   * Gets the methods user interface
   */
  CodeMirrorIntellisense.prototype.getMeths = function() {
    return this.meths;
  };
  /**
   * Delegate for setting the methods to display to the user
   * @param data The methods to display
   */
  CodeMirrorIntellisense.prototype.setMethods = function(data) {
    this.meths.setMethods(data);
  };
  /**
   * Delegate for setting the declarations to display to the user
   * @param data - The declarations to display
   */
  CodeMirrorIntellisense.prototype.setDeclarations = function(data) {
    this.decls.setDeclarations(data);
  };
  /**
   * Sets the starting location where filtering can occur. This is set when
   * a trigger happens that would cause the declarations list to show
   * @param i The index to set
   */
  CodeMirrorIntellisense.prototype.setStartColumnIndex = function(i) {
    this.autoCompleteStart.columnIndex = i;
  };

  /**
   * Get the word at a particular position
   * @param pos CodeMirror posiiotn object
   */
  CodeMirrorIntellisense.prototype.getWordAtPosition = function(pos) {
    if (!pos) {
      return;
    }
    var line = this.editor.getLine(pos.line);
    var char = pos.ch;
    var subSplit = line.split(/[\(,=\) ]/g);
    var counter = 0;
    return subSplit.find(function(item) {
      var len = item.length + 1;
      if (char >= counter && char <= counter + len) {
        return true;
      }
      counter += len;
    });
  };

  /**
   * Given a keyword item , generat a tooltip which has the name, parameters and description
   *
   * @param {*} item
   * @param {*} opts
   * @param {number} opts.highlight Highlight a particular parameter
   */
  CodeMirrorIntellisense.prototype.formatItemTooltip = function(item, opts) {
    var description = item.description || "";
    var name = item.name || "";
    var params = item.parameters || "";
    var commaCounter = -1;
    params =
      "(" +
      params.reduce(function(str, p, i) {
        commaCounter++;
        var isHighlight =
          opts &&
          typeof opts.highlight !== undefined &&
          opts.highlight === commaCounter;
        str += isHighlight ? '<strong class="tooltip-highlight">' : "";
        str += p.name;
        str += isHighlight ? "</strong>" : "";
        str += ", ";

        if (p.repeatable) {
          commaCounter++;
          isHighlight =
            opts &&
            typeof opts.highlight !== undefined &&
            opts.highlight >= commaCounter;
          str += isHighlight ? '<strong class="tooltip-highlight">' : "";
          str += "...";
          str += isHighlight ? "</strong>" : "";
          str += ", ";
        }

        return str;
      }, "");
    params = params.substring(0, params.length - 2) + ")";
    return "<h5>" + name + " <span>" + params + "</h5><hr/>" + description;
  };

  /**
   *
   *  INTELLISENSE
   *
   */

  var wi;
  (function(wi) {
    (function(Keys) {
      Keys[(Keys["Backspace"] = 8)] = "Backspace";
      Keys[(Keys["Tab"] = 9)] = "Tab";
      Keys[(Keys["Enter"] = 13)] = "Enter";
      Keys[(Keys["Escape"] = 27)] = "Escape";
      Keys[(Keys["PageUp"] = 33)] = "PageUp";
      Keys[(Keys["PageDown"] = 34)] = "PageDown";
      Keys[(Keys["Left"] = 37)] = "Left";
      Keys[(Keys["Up"] = 38)] = "Up";
      Keys[(Keys["Right"] = 39)] = "Right";
      Keys[(Keys["Down"] = 40)] = "Down";
    })(wi.Keys || (wi.Keys = {}));
    var Keys = wi.Keys;
    /**
     * Shows or hides an element by setting the display style to 'block' for true
     * or 'none' for false.
     * @param element - The element to show or hide
     * @param b - To show or hide the element
     */
    function showElement(el, b) {
      el.style.display = b ? "block" : "none";
    }
    wi.showElement = showElement;
    /**
     * Checks to see if an element has a CSS class
     * @param element - The element to add the class
     */
    function hasCssClass(el, name) {
      var classes = el.className.split(/\s+/g);
      return classes.indexOf(name) !== -1;
    }
    wi.hasCssClass = hasCssClass;
    /**
     * Adds a CSS class from an element
     * @param element - The element to add the class
     * @param name - The name of the class to add
     */
    function addCssClass(el, name) {
      if (!hasCssClass(el, name)) {
        el.className += " " + name;
      }
    }
    wi.addCssClass = addCssClass;
    /**
     * Removes a CSS class from an element
     * @param element - The element to remove the class
     * @param name - The name of the class to remove
     */
    function removeCssClass(el, name) {
      var classes = el.className.split(/\s+/g);
      while (true) {
        var index = classes.indexOf(name);
        if (index === -1) {
          break;
        }
        classes.splice(index, 1);
      }
      el.className = classes.join(" ");
    }
    wi.removeCssClass = removeCssClass;
    /**
     * Looks for the last index of a number of strings inside of another string
     * @param str - The string to search within
     * @param arr - An array of strings to search for
     * @param [start] - Optional starting position
     */
    function lastIndexOfAny(str, arr, start) {
      var max = -1;
      for (var i = 0; i < arr.length; i++) {
        var val = str.lastIndexOf(arr[i], start);
        max = Math.max(max, val);
      }
      return max;
    }
    wi.lastIndexOfAny = lastIndexOfAny;
    /**
     * An item that is displayed within the declarations user interface.
     */
    var DeclarationItem = (function() {
      function DeclarationItem() {}
      return DeclarationItem;
    })();
    wi.DeclarationItem = DeclarationItem;
    /**
     * Provides a user interface for a tooltip.
     */
    var Tooltip = (function() {
      function Tooltip(editor) {
        this.editor = editor
        this.visible = false;
        this.events = { visibleChanged: [] };
        this.tooltipElement = document.getElementById("br-tooltip-div");
        if (this.tooltipElement == null) {
          this.tooltipElement = document.createElement("div");
          this.tooltipElement.id = "br-tooltip-div";
          this.tooltipElement.className = "br-tooltip";
          this.editor.getWrapperElement().appendChild(this.tooltipElement);
        }
      }
      /**
       * Triggers the visible changed callback events
       */
      Tooltip.prototype.triggerVisibleChanged = function() {
        var _this = this;
        this.events.visibleChanged.forEach(function(callback) {
          callback(_this.visible);
        });
      };
      /**
       * Check to see if the user interface is visible or not
       * @returns True if visible otherwise false
       */
      Tooltip.prototype.isVisible = function() {
        return this.visible;
      };
      /**
       * Sets the visibility of the tooltip element
       * @param b True to set visible, false to hide
       */
      Tooltip.prototype.setVisible = function(b) {
        if (this.visible !== b) {
          this.visible = b;
          showElement(this.tooltipElement, b);
          this.triggerVisibleChanged();
        }
      };
      /**
       * Sets the HTML of the tooltip element
       * @param html The html to set
       */
      Tooltip.prototype.setHtml = function(html) {
        this.tooltipElement.innerHTML = html;
      };
      /**
       * Sets the text of the tooltip element
       * @param text The text to set
       */
      Tooltip.prototype.setText = function(text) {
        this.tooltipElement.innerText = text;
      };
      /**
       * Gets the inner text of the tooltip element
       * @returns The inner text of the element
       */
      Tooltip.prototype.getText = function() {
        return this.tooltipElement.innerText;
      };
      /**
       * Gets the inner html of the tooltip elemnt
       * @returns The inner HTML
       */
      Tooltip.prototype.getHtml = function() {
        return this.tooltipElement.innerHTML;
      };
      /**
       * Sets the position on screen of the tooltip element
       * @param left The left pixel position
       * @param top The top pixel position
       */
      Tooltip.prototype.setPosition = function(left, top) {
        var w = this.tooltipElement.offsetWidth || 300
        if (left + w > window.innerWidth) {
          left = window.innerWidth - w - 15
        }
        this.tooltipElement.style.left = left + "px";
        this.tooltipElement.style.top = top + "px";
      };
      return Tooltip;
    })();
    wi.Tooltip = Tooltip;
    /**
     * Provides a user interface for a methods popup. This class basically generates
     * a div that preview a list of strings.
     */
    var MethodsIntellisense = (function() {
      function MethodsIntellisense(editor) {
        var _this = this;
        this.editor = editor
        this.events = { visibleChanged: [] };
        this.visible = false;
        this.methods = [];
        this.selectedIndex = 0;
        if (document.querySelector('.br-methods')){
          document.querySelector('.br-methods').parentNode.removeChild(document.querySelector('.br-methods'))
        }
        this.methodsElement = document.createElement("div");
        this.methodsTextElement = document.createElement("div");
        this.arrowsElement = document.createElement("div");
        this.upArrowElement = document.createElement("span");
        this.downArrowElement = document.createElement("span");
        this.arrowTextElement = document.createElement("span");
        this.methodsElement.className = "br-methods";
        this.methodsTextElement.className = "br-methods-text";
        this.arrowsElement.className = "br-methods-arrows";
        this.upArrowElement.className = "br-methods-arrow";
        this.upArrowElement.innerHTML = "&#8593;";
        this.downArrowElement.className = "br-methods-arrow";
        this.downArrowElement.innerHTML = "&#8595;";
        this.arrowTextElement.className = "br-methods-arrow-text";
        this.arrowsElement.appendChild(this.upArrowElement);
        this.arrowsElement.appendChild(this.arrowTextElement);
        this.arrowsElement.appendChild(this.downArrowElement);
        this.methodsElement.appendChild(this.arrowsElement);
        this.methodsElement.appendChild(this.methodsTextElement);
        this.editor.getWrapperElement().appendChild(this.methodsElement);
        // arrow click events
        this.downArrowElement.onclick = function() {
          _this.moveSelected(1);
        };
        // arrow click events
        this.upArrowElement.onclick = function() {
          _this.moveSelected(-1);
        };
      }
      /**
       * Sets the selected item by index. Wrapping is performed if the index
       * specified is out of bounds of the methods that are set.
       * @param idx The index of the item to set selected
       */
      MethodsIntellisense.prototype.setSelectedIndex = function(idx) {
        if (idx < 0) {
          idx = this.methods.length - 1;
        } else if (idx >= this.methods.length) {
          idx = 0;
        }
        this.selectedIndex = idx;
        this.methodsTextElement.innerHTML = this.methods[idx];
        this.arrowTextElement.innerHTML =
          idx + 1 + " of " + this.methods.length;
      };
      /**
       * Sets the methods to display. If not empty, the user interface is shown and the
       * first methods is selected.
       * @param methods The methods to populate the interface with
       */
      MethodsIntellisense.prototype.setMethods = function(data) {
        if (data != null && data.length > 0) {
          this.methods = data;
          // show the elements
          this.setVisible(true);
          // show the first item
          this.setSelectedIndex(0);
        }
      };
      /**
       * Sets the position of the UI element.
       * @param left The left position
       * @param top The top position
       */
      MethodsIntellisense.prototype.setPosition = function(left, top) {
        this.methodsElement.style.left = left + "px";
        this.methodsElement.style.top = top + "px";
      };
      /**
       * Sets the currently selected index by delta.
       * @param delta The amount to move
       */
      MethodsIntellisense.prototype.moveSelected = function(delta) {
        this.setSelectedIndex(this.selectedIndex + delta);
      };
      /**
       * Checks to see if the UI is visible
       * @returns True if visible, otherwise false
       */
      MethodsIntellisense.prototype.isVisible = function() {
        return this.visible;
      };
      /**
       * Shows or hides the UI
       * @param b Show or hide the user interface
       */
      MethodsIntellisense.prototype.setVisible = function(b) {
        if (this.visible !== b) {
          this.visible = b;
          showElement(this.methodsElement, b);
          this.triggerVisibleChanged();
        }
      };
      MethodsIntellisense.prototype.triggerVisibleChanged = function() {
        var _this = this;
        this.events.visibleChanged.forEach(function(callback) {
          callback(_this.visible);
        });
      };
      /**
       * Provides common keyboard event handling for a keydown event.
       *
       * escape, left, right -> hide the UI
       * up -> select previous item
       * down -> select next item
       * pageup -> select previous 5th
       * pagedown -> select next 5th
       *
       * @param evt The event
       */
      MethodsIntellisense.prototype.handleKeyDown = function(evt) {
        if (
          evt.keyCode === Keys.Escape ||
          evt.keyCode === Keys.Left ||
          evt.keyCode === Keys.Right
        ) {
          this.setVisible(false);
        } else if (evt.keyCode === Keys.Up) {
          this.moveSelected(-1);
          evt.preventDefault();
          evt.stopPropagation();
        } else if (evt.keyCode === Keys.Down) {
          this.moveSelected(1);
          evt.preventDefault();
          evt.stopPropagation();
        } else if (evt.keyCode === Keys.PageUp) {
          this.moveSelected(-5);
          evt.preventDefault();
        } else if (evt.keyCode === Keys.PageDown) {
          this.moveSelected(5);
          evt.preventDefault();
        }
      };
      /**
       * Adds an event listener for the `onVisibleChanged` event
       * @param callback The callback to add
       */
      MethodsIntellisense.prototype.onVisibleChanged = function(callback) {
        this.events.visibleChanged.push(callback);
      };
      return MethodsIntellisense;
    })();
    wi.MethodsIntellisense = MethodsIntellisense;
    /**
     * Provides a user interface for a declarations popup. This class basically
     * generates a div that acts as a list of items. When items are displayed (usually
     * triggered by a keyboard event), the user can select an item from the list.
     */
    var DeclarationsIntellisense = (function() {
      
      function DeclarationsIntellisense(editor) {
        this.editor = editor
        this.events = { itemChosen: [], itemSelected: [], visibleChanged: [] };
        this.selectedIndex = 0;
        this.filteredDeclarations = [];
        this.filteredDeclarationsUI = [];
        this.visible = false;
        this.declarations = [];
        this.filterText = "";
        this.filterModes = {
          startsWith: function(item, filterText) {
            return (
              item.name
                .toLowerCase()
                .indexOf(filterText && filterText.toLowerCase()) === 0
            );
          },
          contains: function(item, filterText) {
            return (
              item.name
                .toLowerCase()
                .indexOf(filterText && filterText.toLowerCase()) >= 0
            );
          }
        };
        this.filterMode = this.filterModes.startsWith;
        // ui widgets
        this.selectedElement = null;
        if (this.editor.getWrapperElement().querySelector('.br-intellisense')){
          this.editor.getWrapperElement().querySelector('.br-intellisense').parentNode.removeChild(document.querySelector('.br-intellisense'))
        }
        if (this.editor.getWrapperElement().querySelector('.br-documentation')){
          this.editor.getWrapperElement().querySelector('.br-documentation').parentNode.removeChild(document.querySelector('.br-documentation'))
        }
        this.listElement = document.createElement("ul");
        this.documentationElement = document.createElement("div");
        this.listElement.className = "br-intellisense";
        this.documentationElement.className = "br-documentation";
        this.editor.getWrapperElement().appendChild(this.listElement);
        this.editor.getWrapperElement().appendChild(this.documentationElement);
      }

      /**
       * Provides common keyboard event handling for a keydown event.
       *
       * escape, left, right -> hide the UI
       * up -> select previous item
       * down -> select next item
       * pageup -> select previous 5th
       * pagedown -> select next 5th
       * enter, tab -> chooses the currently selected item
       *
       * @param evt The event
       */
      DeclarationsIntellisense.prototype.handleKeyDown = function(evt) {
        if (evt.keyCode == Keys.Escape) {
          this.setVisible(false);
          evt.preventDefault();
          evt.cancelBubble = true;
        } else if (
          evt.keyCode === Keys.Left ||
          evt.keyCode === Keys.Right ||
          evt.keyCode === Keys.Escape
        ) {
          this.setVisible(false);
        } else if (evt.keyCode === Keys.Up) {
          this.moveSelected(-1);
          evt.preventDefault();
          evt.cancelBubble = true;
        } else if (evt.keyCode === Keys.Down) {
          this.moveSelected(1);
          evt.preventDefault();
          evt.cancelBubble = true;
        } else if (evt.keyCode === Keys.PageUp) {
          this.moveSelected(-5);
          evt.preventDefault();
          evt.cancelBubble = true;
        } else if (evt.keyCode === Keys.PageDown) {
          this.moveSelected(5);
          evt.preventDefault();
          evt.cancelBubble = true;
        } else if (evt.keyCode === Keys.Enter || evt.keyCode === Keys.Tab) {
          this.triggerItemChosen(this.getSelectedItem());
          evt.preventDefault();
          evt.cancelBubble = true;
        }
      };
      DeclarationsIntellisense.prototype.triggerVisibleChanged = function() {
        var _this = this;
        this.events.visibleChanged.forEach(function(callback) {
          callback(_this.visible);
        });
      };
      DeclarationsIntellisense.prototype.triggerItemChosen = function(item) {
        this.events.itemChosen.forEach(function(callback) {
          callback(item);
        });
      };
      DeclarationsIntellisense.prototype.triggerItemSelected = function(item) {
        this.events.itemSelected.forEach(function(callback) {
          callback(item);
        });
      };
      /**
       * Gets the currently selected index
       */
      DeclarationsIntellisense.prototype.getSelectedIndex = function() {
        return this.selectedIndex;
      };
      /**
       * Sets the currently selected index
       * @param idx The index to set
       */
      DeclarationsIntellisense.prototype.setSelectedIndex = function(idx) {
        if (idx !== this.selectedIndex) {
          this.selectedIndex = idx;
          this.triggerItemSelected(this.getSelectedItem());
        }
      };
      /**
       * Adds an event listener for the `onItemChosen` event
       * @param callback The callback to call when an item is chosen
       */
      DeclarationsIntellisense.prototype.onItemChosen = function(callback) {
        this.events.itemChosen.push(callback);
      };
      /**
       * Adds an event listener for the `onItemSelected` event
       * @param callback The callback to call when an item is selected
       */
      DeclarationsIntellisense.prototype.onItemSelected = function(callback) {
        this.events.itemSelected.push(callback);
      };
      /**
       * Adds an event listener for the `onVisibleChanged` event
       * @param callback The callback to call when the ui is shown or hidden
       */
      DeclarationsIntellisense.prototype.onVisibleChanged = function(callback) {
        this.events.visibleChanged.push(callback);
      };
      /**
       * Gets the selected item
       */
      DeclarationsIntellisense.prototype.getSelectedItem = function() {
        return this.filteredDeclarations[this.selectedIndex];
      };
      DeclarationsIntellisense.prototype.createListItemDefault = function(
        item,
        key
      ) {
        var listItem = document.createElement("li");
        var name = item.name || key;
        listItem.innerHTML =
          //  '<span class="br-icon icon-glyph-' +
          //  item.glyph +
          //  '"></span> ' +
          name;
        listItem.className = "br-listlink";
        return listItem;
      };
      DeclarationsIntellisense.prototype.refreshSelected = function() {
        if (this.selectedElement != null) {
          removeCssClass(this.selectedElement, "br-selected");
        }
        this.selectedElement = this.filteredDeclarationsUI[this.selectedIndex];
        if (this.selectedElement) {
          addCssClass(this.selectedElement, "br-selected");
          var item = this.getSelectedItem();
          if (item.description == null) {
            this.showDocumentation(false);
          } else {
            this.showDocumentation(true);
            var description = item.description;
            var name = item.name;
            var params = item.parameters || "";
            if (params && params.length) {
              params =
                "(" +
                params.reduce(function(str, p) {
                  str += p.name + ", ";
                  if (p.repeatable) {
                    str += "..., ";
                  }
                  return str;
                }, "");
              params = params.substring(0, params.length - 2) + ")";
            }
            this.documentationElement.innerHTML =
              "<h5>" +
              name +
              " <span>" +
              params +
              "</h5><hr/>" +
              item.description;
          }
          var top = this.selectedElement.offsetTop;
          var bottom = top + this.selectedElement.offsetHeight;
          var scrollTop = this.listElement.scrollTop;
          if (top <= scrollTop) {
            this.listElement.scrollTop = top;
          } else if (bottom >= scrollTop + this.listElement.offsetHeight) {
            this.listElement.scrollTop = bottom - this.listElement.offsetHeight;
          }
        }
      };
      DeclarationsIntellisense.prototype.refreshUI = function() {
        var _this = this;
        this.listElement.innerHTML = "";
        this.filteredDeclarationsUI = [];

        this.filteredDeclarations.forEach(function(item, idx) {
          var listItem = _this.createListItemDefault(item, idx);
          listItem.ondblclick = function() {
            _this.setSelectedIndex(idx);
            _this.triggerItemChosen(_this.getSelectedItem());
            _this.setVisible(false);
            _this.showDocumentation(false);
          };
          listItem.onclick = function() {
            _this.setSelectedIndex(idx);
          };
          _this.listElement.appendChild(listItem);
          _this.filteredDeclarationsUI.push(listItem);
        });
        this.refreshSelected();
        showElement(
          this.listElement,
          this.filteredDeclarations.length ? true : false
        );
        if (!this.filteredDeclarations.length) {
          this.showDocumentation(false);
        }
      };
      DeclarationsIntellisense.prototype.showDocumentation = function(b) {
        showElement(this.documentationElement, b);
      };
      /**
       * Checks to see if the UI is visible
       */
      DeclarationsIntellisense.prototype.setVisible = function(b) {
        if (this.visible !== b) {
          this.visible = b;
          showElement(this.listElement, b);
          showElement(this.documentationElement, b);
          this.triggerVisibleChanged();
        }
      };
      /**
       * Sets the declarations to display. If not empty, the user interface is shown and the
       * first item is selected.
       * @param data The array of declaration items to show
       */
      DeclarationsIntellisense.prototype.setDeclarations = function(data) {
        if (data != null && data.length > 0) {
          // set the data
          this.declarations = data;
          this.filteredDeclarations = data;
          // show the elements
          this.setSelectedIndex(0);
          this.setFilter("");
          this.setVisible(true);
          this.refreshUI();
        }
      };
      /**
       * Sets the position of the UI element.
       * @param left The left position
       * @param top The top position
       */
      DeclarationsIntellisense.prototype.setPosition = function(left, top) {
        // reposition intellisense
        this.listElement.style.left = left + "px";
        this.listElement.style.top = top + "px";
        // reposition documentation (magic number offsets can't figure out why)
        var windowWidth = window.innerWidth
        var overallWidth = left + this.listElement.offsetWidth + 5 + this.documentationElement.offsetWidth
        this.documentationElement.style.top = top + 5 + "px";
        if (overallWidth > windowWidth) {
          this.documentationElement.style.left = left - this.documentationElement.offsetWidth + 'px'
        } else {
          this.documentationElement.style.left = left + this.listElement.offsetWidth + 5 + "px";
        }
       // console.log(windowWidth + '   ' + left   + this.listElement.offsetWidth)

        
        
      };
      /**
       * Setter for how the filter behaves. There are two default implementations
       * startsWith and contains.
       *
       * The `startsWith` mode checks that the `name` property
       * of the item starts with the filter text
       *
       * The `contains` mode checks for any
       * substring of the filter text in the `name` property of the item.
       *
       * @param mode The mode to set
       */
      DeclarationsIntellisense.prototype.setFilterMode = function(mode) {
        if (typeof mode === "function") {
          this.filterMode = mode;
        } else if (typeof mode === "string") {
          this.filterMode = this.filterModes[mode];
        }
      };
      /**
       * Setter for the filter text. When set, the items displayed are
       * automatically filtered
       *
       * @param f The filter to set
       */
      DeclarationsIntellisense.prototype.setFilter = function(f) {
        var _this = this;
        if (this.filterText !== f) {
          this.setSelectedIndex(0);
          this.filterText = f;
        }
        var ret = [];
        this.declarations.forEach(function(item) {
          if (_this.filterMode(item, _this.filterText)) {
            ret.push(item);
          }
        });
        this.filteredDeclarations = ret;
        this.refreshUI();
      };
      /**
       * Sets the currently selected index by delta.
       * @param delta The number of items to move
       */
      DeclarationsIntellisense.prototype.moveSelected = function(delta) {
        var idx = this.selectedIndex + delta;
        idx = Math.max(idx, 0);
        idx = Math.min(idx, this.filteredDeclarations.length - 1);
        // select
        this.setSelectedIndex(idx);
        this.refreshSelected();
      };
      /**
       * Check to see if the declarations div is visible
       */
      DeclarationsIntellisense.prototype.isVisible = function() {
        return this.visible;
      };
      return DeclarationsIntellisense;
    })();
    wi.DeclarationsIntellisense = DeclarationsIntellisense;
  })(wi || (wi = {}));
});
