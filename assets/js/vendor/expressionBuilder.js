/*! jQuery Expression Builder - v0.1.0 - 2014-01-05
* https://github.com/jonmbake/jquery-expression-builder
* Copyright (c) 2014 Jon Bake; Licensed MIT */

(function($, _) {
  //TO DO: Extract this to a template
  var layout =
    '<div class="exprBldrMain panel panel-primary">\
    <div class="panel-heading"><h3 class="panel-title">Expression Builder</h3></div>\
      <div class="panel-body">\
      <div class="bldrBottom" style="margin-bottom: 5px">\
      <div style="float: left">\
        <label>Expression:</label>\
      </div>\
      <div class="btn-toolbar" style="float: right">\
            <div class="btn-group btn-group-xs">\
              <!--<button type="button" class="btn btn-default back-btn">Back</button>-->\
              <button type="button" class="btn btn-default clear-btn">Clear</button>\
              <button type="button" class="btn btn-default save-as-btn">Save As Template</button>\
            </div>\
          </div>\
          </div>\
      <div class="exprOuter" >\
        <div class="exprInner input-group input-group-sm ">\
          <input type="text" class="subExprActive"></input>\
        </div>\
      </div>\
      <div class="bldrBottom">\
        <div style="float: left">\
          <label>Sub-Expression:</label><br/>\
          <input type="hidden" style="width:200px" class="subExpr"/>\
        </div>\
        <div class="panel panel-info" style="float: right; width: 250px">\
          <div class="panel-heading" >\
            <h6 class="panel-title" style="font-size: 14px">Help Text</h6>\
          </div>\
          <div class="panel-body">\
            <strong>Description</strong><br/><span class="helpDescription"></span>\
            <strong>Signature</strong><br/><span class="seSignature"></span>\
          </div>\
        </div>\
      </div>\
      </div>\
    </div>';

  var defaults = {
    'returnType': 'NUMBER'
  };

  /**
   * The base prototype for all select elements, including groupings and sub-exressions.
   * @constructor
   */
  function SelectElement () {
    /**
     * ABSTRACT - Action to take when this element is selected.
     *
     * @memberOf SelectElement
     * @return {void}
     */
    this.onSelect = function () {};
    /**
     * The text that will be displayed as an option in the select.
     *
     * @memberOf SelectElement
     * @return {String} display text
     */
    this.getDisplayText = function () {
      return '' + this.displayName + (this.displayNameParens ? ' (' + this.displayNameParens + ')' : '');
    };
    /**
     * Get the description of the select element.
     *
     * This is displayed in the help text.
     * @memberOf SelectElement
     * @return {String} description
     */
    this.getDescription = function () {
      return this.description;
    };
    /**
     * An select element has an id (not an html element id) that uniquely identifies it.
     *
     * Default to using display name.
     * @memberOf SelectElement
     * @return {String} id of element
     */
    this.getId = function () {
      return this.displayName;
    };
    /**
     * The Select Object is used to populate this select element within Select2.
     *
     * @memberOf SelectElement
     * @return {Object} select object
     */
    this.getSelectObject = function () {
      return {'text': this.getDisplayText(), 'id': this.getId()};
    };
    /**
     * Filter this select element in Select2.
     *
     * Returns select object if this element should be displayed.
     * @memberOf SelectElement
     * @param  {Object} query Select2 Query Object
     * @return {Object} select object if this element should be displayed, otherwise undefined
     */
    this.filter = function (query) {
      var activeExprType = this.s$('div.exprInner input.subExprActive').data('returnType');
      if ((!query.term || query.matcher.call(null, query.term, this.getDisplayText())) && (!this.returnType || _.contains(activeExprType instanceof Array ? activeExprType : [activeExprType], this.returnType)))
      {
        return this.getSelectObject();
      }
    };
  }
  /**
   * Select element for a sub-expression value.
   *
   * @constructor
   * @augments {SelectElement}
   * @param {Object} data   sub-expression data
   * @param {Function} s$   scoped jQuery selector
   */
  function SubExpressionSelect (data, s$) {
    this.s$ = s$;
    _.extend(this, data);
  }
  SubExpressionSelect.prototype = new SelectElement();
  /**
   * Sub Expression on select.
   *
   * When selecting a sub-expression, we create a {@see SubExpressionElement} and trigger the subExpressionSelect event, which renders the sub-expressions ui elements.
   * @override
   * @return {void}
   */
  SubExpressionSelect.prototype.onSelect = function () {
    var subExpr = new SubExpressionElement(this.s$, {'leftComponent': this.leftType, 'displayText': this.displayName, 'expressionValue': this.expressionValue ? this.expressionValue : this.displayName, 'rightComponent': this.rightType, 'returnType': this.returnType});
    this.s$('div.exprInner input.subExprActive').trigger('subExpressionSelect', subExpr);
    subExpr.focusNextInput();
  };
  
  SubExpressionSelect.prototype.getSignature = function () {
    return (this.leftType ? '{' + this.leftType + '} ' : '') + this.displayName + (this.rightType ? ' {' + this.rightType + '} ' : '');
  };
  /**
   * A template select element.
   *
   * A template element differs from a {@link SubExpressionSelect} in that it is composed of a partially applied Expression, and not a sub-expression.
   * @constructor
   * @augments {SelectElement}
   * @param {Object} subExprJSON json describing the partially applied expression
   * @param {Function}        s$      scoped jQuery selector
   */
  function TemplateElement (subExprJSON, s$) {
    this.s$ = s$;
    this.displayName = subExprJSON.displayName;
    this.returnType = subExprJSON.returnType;
    this.subExprJSON = subExprJSON;
  }
  TemplateElement.prototype = new SelectElement();
  TemplateElement.prototype.onSelect = function () {
    var subExpr = new SubExpressionElement(this.s$, this.subExprJSON);
    subExpr.render();
    subExpr.focusNextInput();
  };
  TemplateElement.prototype.getSignature = function () {
    return '';
  };
  TemplateElement.prototype.filter = function (query) {
    var activeExprType = this.s$('div.exprInner input.subExprActive').data('returnType');
    if ((!query.term || query.matcher.call(null, query.term, this.getDisplayText())) && (!this.returnType || _.contains(activeExprType instanceof Array ? activeExprType : [activeExprType], this.returnType)))
    {
      return this.getSelectObject();
    } else {
      return null;
    }
  };
  /**
   * A Select Element to close a multi-sized list.
   *
   * @constructor
   * @augments {SelectElement}
   * @param {Function} s$ scoped jquery selector
   */
  function MultiSizedListCloser (s$) {
    this.displayName = 'Close List';
    this.description = 'Close the currently selected multi-sized list';
    this.s$ = s$;
  }
  MultiSizedListCloser.prototype = new SelectElement();
  /**
   * Filter this element.
   *
   * Show when query term is empty and the active element is from a {@see MultipleSizedListComponent}.
   * @override
   * @param  {Object} query Select2 Query Object
   * @return {Object}       select object if this element should be displayed, otherwise undefined
   */
  MultiSizedListCloser.prototype.filter = function (query) {
    var activeExprIsMultiSized = this.s$('div.exprInner input.subExprActive').data('isMultiSized');
    if (!query.term && activeExprIsMultiSized) {
      return this.getSelectObject();
    } else {
      return null;
    }
  };
  /**
   * Action when selecting this element.
   *
   * Remove the active expandble input and previous span.  Focus next input.
   * @override
   * @return {void}
   */
  MultiSizedListCloser.prototype.onSelect = function () {
    var curActive = this.s$('div.exprInner input.subExprActive');
    curActive.prev('span:contains(",")').remove();
    var compData = curActive.data('component');
    curActive.data('component').expandableInputs.pop();
    curActive.remove();
    compData.focusNextInput();
  };
  /**
   * Signature of element.
   *
   * For a MultiSizedListCloser, this is empty.
   * @override
   * @return {String} signature of element
   */
  MultiSizedListCloser.prototype.getSignature = function () {
    return '';
  };
  /**
   * A grouping select groups a subexpression when selected.
   *
   * @constructor
   * @augments {SelectElement}
   * @param {Function} s$ scoped jQuery selector
   */
  function GroupingSelect (s$) {
    this.displayName = 'Grouping';
    this.description = 'Group sub-expressions together';
    this.s$ = s$;
  }
  GroupingSelect.prototype = new SelectElement();
  /**
   * Filter this element.
   *
   * Show Grouping Select element when query term is blank.
   * @override
   * @param  {Object} query Select2 Query Object
   * @return {Object}       select object if this element should be displayed, otherwise undefined
   */
  GroupingSelect.prototype.filter = function (query) {
    if (!query.term) {
      return this.getSelectObject();
    } else {
      return null;
    }
  };
  /**
   * Action when selecting this element.
   *
   * When selecting a grouping, we wrap the expandable input with parens and set a data element of 'isGrouped'.
   * @override
   * @param  {Object} query Select2 Query Object
   * @return {Object}       select object if this element should be displayed, otherwise undefined
   */
  GroupingSelect.prototype.onSelect = function (query) {
    var curActive = this.s$('div.exprInner input.subExprActive');
    curActive.data('isGrouped', true);
    curActive.before($('<span></span>').addClass("input-group-addon input-small").text('('));
    curActive.after($('<span></span>').addClass("input-group-addon input-small").text(')'));
    curActive.focus();
  };
  /**
   * The grouping signature is a set of parens.
   *
   * @override
   * @return {String} grouping signature
   */
  GroupingSelect.prototype.getSignature = function () {
    return '( )';
  };
  /**
   * Generate instances of the system select elements.
   *
   * @param  {Function} s$ scoped jQuery selector
   * @return {Object}      map of id to instance of select element
   */
  function generateSystemSelectElements (s$) {
    var idMap = {};
    var mlc = new MultiSizedListCloser(s$);
    idMap[mlc.displayName] = mlc;
    var grouping = new GroupingSelect(s$);
    idMap[grouping.displayName] = grouping;

    var NUMBER_LIT_ID = 'Number Literal';
    var numberLiteral = new SubExpressionSelect({'returnType': 'NUMBER', 'description': 'A number literal'}, s$);
    /**
     * Filter the number literal select element.
     *
     * Number literal select elements are shown when the return type is NUMBER and query term is a number.
     * @override
     * @param  {Object} query Select2 Query Object
     * @return {Object}       select object if this element should be displayed, otherwise undefined
     */
    numberLiteral.filter = function (query) {
      var activeExprType = s$('div.exprInner input.subExprActive').data('returnType');
      if (_.contains(activeExprType instanceof Array ? activeExprType : [activeExprType], 'NUMBER') && (!query.term || query.term.match(/^(\+|-)?((\d+)|(\d+\.(\d+)?)|(\.(\d+)))$/g))) {
        if (!query.term) {
          this.displayName = "0";
        } else if (query.term.charAt(query.term.length - 1) === '.') {
          this.displayName = query.term + '0';
        } else {
          this.displayName = query.term;
        }
        return {'text': NUMBER_LIT_ID, 'id': NUMBER_LIT_ID};
      } else {
        return null;
      }
    };
    idMap[NUMBER_LIT_ID] = numberLiteral;

    var STRING_LIT_ID = 'String Literal';
    var stringLiteral = new SubExpressionSelect({'returnType': 'TEXT', 'description': 'A string literal'}, s$);
    /**
     * Filter the String Literal element.
     *
     * String Literals are filtered when the active type is TEXT and the query starts with a double quote.
     * @override
     * @param  {Object} query Select2 Query Object
     * @return {Object}       select object if this element should be displayed, otherwise undefined
     */
    stringLiteral.filter = function (query) {
      var activeExprType = s$('div.exprInner input.subExprActive').data('returnType');
      if (_.contains(activeExprType instanceof Array ? activeExprType : [activeExprType], 'TEXT') && (!query.term || query.term.charAt(0) === '"')) {
        //always ensure string lit ends with a double quote
        if (!query.term) {
          this.displayName = '""';
        } else if (query.term.charAt(query.term.length - 1) !== '"') {
          this.displayName = query.term + '"';
        } else {
          this.displayName = query.term;
        }
        return {'text': STRING_LIT_ID, 'id': STRING_LIT_ID};
      } else {
        return null;
      }
    };
    idMap[STRING_LIT_ID] = stringLiteral;
    return idMap;
  }
  /**
   * The aggregate of select elements used to populate the sub-expression select.
   *
   * @constructor
   * @param {Array} data of all of the sub-expressions and groupings
   * @param {function} s$   a jquery selector scoped to elements within this plugin
   */
  function SelectElementCollection (data, templates, s$) {
    //maintain an id Map for fast lookup by id
    this.idMap = generateSystemSelectElements(s$);
    this.selectElements = _.values(this.idMap);
    
    this.s$ = s$;
    _.each(data, function (dataElement) {
      if (dataElement.values instanceof Array) {
        this.selectElements.push(new SelectGrouping(dataElement, s$, this.idMap));
      } else {
        var se = new SubExpressionSelect(dataElement, s$);
        this.selectElements.push(se);
        this.idMap[se.getId()] = se;
      }
    }, this);
    //also add a grouping for the templates
    this.templateGrouping = new SelectGrouping({'groupName': 'Templates', 'values': templates}, s$, this.idMap, true);
    this.selectElements.push(this.templateGrouping);
  }
  SelectElementCollection.prototype = {
    /**
     * Filter elements in this collection.
     *
     * We use composition to filter the elements: both groupings and individual select elements that make up
     * this collection can be filtered.
     * @param  {Object} query Select2 Query Object
     * @return {Object}       select object if this element should be displayed, otherwise undefined
     */
    filter: function (query) {
      var filteredSelectElements = [];
      _.each(this.selectElements, function (se) {
        if (se.filter(query)) {
          filteredSelectElements.push(se.filter(query));
        }
      });
      return filteredSelectElements;
    },
    /**
     * Get element by id.
     *
     * @param  {String} id element id
     * @return {Object}    select element with id
     */
    getById: function (id) {
      return this.idMap[id];
    },
    /**
     * Add a template grouping to this collection.
     *
     * @param {Object} template the template grouping
     */
    addTemplate: function (template) {
      this.templateGrouping.addSubExpressionToGrouping(template);
    }
  };
  /**
   * A grouping consists of the parent group name and child subexpressions.
   *
   * Data should be in the form:
   *   {'groupName': <group name>,
   *    'values': [<subexprssion values>]
   *   }
   * @constructor
   * @augments {SelectElement}
   * @param {Object}    data               items in this grouping
   * @param {Function}  s$                 scoped jquery selector
   * @param {Object}    idMap              map of id to sub expression element
   * @param {Boolean}   isTemplateGrouping is this a SelectGrouping for templates?
   */
  function SelectGrouping (data, s$, idMap, isTemplateGrouping) {
    this.displayName = isTemplateGrouping ? 'Template' : data.groupName;
    this.s$ = s$;
    this.idMap = idMap;
    this.isTemplateGrouping = isTemplateGrouping;
    this.subExpressions = [];
    _.each(data.values, function (subExpr) {
      this.addSubExpressionToGrouping(subExpr);
    }, this);
  }
  SelectGrouping.prototype = new SelectElement();
  /**
   * Add a Sub-Expression (select element) to this grouping.
   *
   * @param {Object} subExpr sub-expression to add
   */
  SelectGrouping.prototype.addSubExpressionToGrouping = function (subExpr) {
    var se = this.isTemplateGrouping ? new TemplateElement(subExpr, this.s$) : new SubExpressionSelect(subExpr, this.s$);
    this.subExpressions.push(se);
    this.idMap[se.getId()] = se;
    return se;
  };
  /**
   * Filter the select grouping.
   *
   * @override
   * @param  {Object} query Select2 Query Object
   * @return {Object}       select object if this element should be displayed, otherwise undefined
   */
  SelectGrouping.prototype.filter = function (query) {
    var children = [];
    _.each(this.subExpressions, function (se) {
      if (se.filter(query)) {
        children.push(se.filter(query));
      }
    });
    //do not show grouping if there is not at least one non-filtered child
    if (children.length !== 0) {
      return {'text': this.getDisplayText(), 'id': this.displayName, 'children': children};
    } else {
     return null;
    }
  };
  /**
   * A SubExpression UI component is a UI component that gets added on sub expression select.
   * @constructor
   */
  function SubExpressionUIComponent () {
    /**
     * Get the currently active element.
     *
     * The currently active element will have the subExprActive.  There should only be one element per plugin instance.
     * @return {jQuery Object} the active element
     */
    this.getActiveElement = function () {
      return this.s$('div.exprInner .subExprActive');
    };
    /**
     * Make an element active.
     *
     * First the subExprActive class is removed from any other element.  Then subExprActive class is added to param element.
     * @param  {jQuery element} $elem element to make active
     * @return {jQuery element}       newly active element
     */
    this.makeActive = function ($elem) {
      this.s$('div.exprInner *').removeClass('subExprActive');
      $elem.addClass('subExprActive');
      return $elem;
    };
    /**
     * Insert an element after active.
     *
     * @param  {jQuery element} $elem element to insert
     * @return {jQuery element}       newly inserted element
     */
    this.afterActive = function ($elem) {
      this.getActiveElement().after($elem);
      this.getActiveElement().removeClass('subExprActive');
      this.makeActive($elem);
      return $elem;
    };
    /**
     * Center the elements within the active expression div taking into account a new element.
     *
     * @param  {jQuery element} $subExprInput a newly added element
     * @return {void}
     */
    this.centerExpr = function ($subExprInput) {
      var exprInner = this.s$('div.exprInner');
      exprInner.width($subExprInput.width() + 5);
    };
    /**
     * Focus next expandable input or trigger eb-expression-complete if complete.
     *
     * @return {void}
     */
    this.focusNextInput = function () {
      var inputToFocus = this.s$('div.exprInner > input:visible:eq(0)');
      if (inputToFocus.length) {
        inputToFocus.focus();
      } else { //expression is comlete!
        this.s$().trigger('eb-expression-complete', api.getExpressionValue.call(this.s$()));
        this.s$('input.subExpr').select2('enable', false);
      }
    };
    /**
     * Insert an expression elements (span) after the currently active element.
     *
     * @param {String}  text       text of the expression element
     * @param {Boolean} isOperator is this an operator?
     */
    this.addExpressionElement = function (text, isOperator) {
      var $span = $('<span></span>').addClass("input-group-addon input-small").text(text);
      if (isOperator) {
        $span.css({'font-weight': 'bold'});
      }
      this.afterActive($span);
      this.expressionElements.push($span);
      //attempted to do this with css, but failed miserably
      //since we are hiding input, we have to find the first first
      //visible element and give it a border radius
      this.s$('.exprInner span.input-small').removeAttr('style');
      this.s$('.exprInner .input-small:visible:first').css({'border-top-left-radius': '3px', 'border-bottom-left-radius': '3px', 'padding-left': '10px', 'border-left': '1px solid #cccccc'});
      return $span;
    };
    /**
     * Insert an expandable type input after active element.
     *
     * @param {Object} data data to attach to input
     */
    this.addExpandableTypeInput = function (data) {
      if (data.returnType === 'PARENT') {
        return;
      }
      //append an input to the currently active element
      var $input = $('<input></input>')
        .attr({'type': 'text', 'placeholder': '?'})
        .data(data)
        .addClass('form-control input-small')
        .css({'width': '30px'});
      this.afterActive($input);
      //set open sub exression selector on sub-expression input focus
      $input.focus(_.bind(function (e) {
        var $target = $(e.target);
        //remove focus from any other input
        this.makeActive($target);
        this.s$('input.subExpr').select2('open');
      }, this));
      //when a subexpression is selected, we hide the input and render the new SubExpression
      $input.on('subExpressionSelect', _.bind(function (e, subExpr) {
        var $target = $(e.target);
        $target.data('subExpr', subExpr);
        if (data.isMultiSized) {
          //this.makeActive($target);
          this.addExpressionElement(',');
          this.addExpandableTypeInput(data);
          this.makeActive($target);
        }
        subExpr.render();
      }, this));
      this.centerExpr($input);
      this.expandableInputs.push($input);
      return $input;
    };
    /**
     * Get expression value.
     *
     * If it is an expanded input, a subexpression is attached, so just delegate to {@link SubExpressionElement#getExpressionValue}.
     * Otherwise just return the returnType of the input wrapped in curly braces.
     * @return {[type]} [description]
     */
    this.getExpressionValue = function () {
      var ei = this.expandableInputs[0].data('subExpr');
      if (ei) {
        return ei.getExpressionValue();
      } else {
        return '{' + this.expandableInputs[0].data('returnType') + '}';
      }
    };
    /**
     * A JSON representation of this component.
     *
     * This is used when saving the state of an expression.
     * @return {String} JSON representation as a string
     */
    this.toJSON = function () {
      var ei = this.expandableInputs[0];
      if (ei.data('subExpr')) {
        return ei.data('subExpr').toJSON();
      } else {
        return JSON.stringify(ei.data('returnType'));
      }
    };
    /**
     * Remove this component from the DOM.
     *
     * @return {void}
     */
    this.remove = function () {
      _.each(this.expandableInputs, function (ei) {
        ei.remove();
      });
      _.each(this.expressionElements, function (ee) {
        ee.remove();
      });
    };
  }

  /**
   * An Array Type component is a typed component with an Array type.
   *
   * Array Type components are typically used for overloaded operators.
   * @constructor
   * @augments {SubExpressionUIComponent}
   * @param {Function} s$   scoped jQuery selector
   * @param {Array} type    component type
   */
  function ArrayTypeComponent (s$, type) {
    this.s$ = s$;
    this.expressionElements = [];
    this.expandableInputs = [];
    this.addExpandableTypeInput({'returnType': type});
  }
  ArrayTypeComponent.prototype = new SubExpressionUIComponent();

  /**
   * A component with a single type.
   *
   * @constructor
   * @augments {SubExpressionUIComponent}
   * @param {Function} s$   scoped jQuery selector
   * @param {String} type    component type
   */
  function TypeComponent (s$, type) {
    this.s$ = s$;
    this.expressionElements = [];
    this.expandableInputs = [];
    this.expandableInputs = [this.addExpandableTypeInput({'returnType': type})];
  }
  TypeComponent.prototype = new SubExpressionUIComponent();

  /**
   * The UI Component for statically-sized lists.
   *
   * @constructor
   * @augments {SubExpressionUIComponent}
   * @param {Function}        s$      scoped jQuery selector
   * @param {String or Array} type    component type as string list representation or Array
   */
  function ListComponent (s$, type) {
    this.s$ = s$;
    this.expressionElements = [];
    this.expandableInputs = [];
    this.isMultiSized = false;
    this.addExpressionElement('(');
    if (typeof type === 'string') {
      var parsedTypes = this.parseType(type);
      $.each(parsedTypes, _.bind(function(index, t) {
        this.addExpandableTypeInput({'returnType': t});
        if (index !== parsedTypes.length-1) {
          this.addExpressionElement(',');
        }
      }, this));
    } else { //an array, in which case we iterate through the array and add an expandable input for each item
     $.each(type, _.bind(function (index, v) {
        if (typeof v === 'string') {
          this.addExpandableTypeInput({'returnType': v, 'component': this});
        } else { //object which means it is an expanded input (hidden input with a sub-expression)
          var ei = this.addExpandableTypeInput({'returnType': v.returnType, 'component': this});
          ei.trigger("subExpressionSelect", new SubExpressionElement(this.s$, v));
        }
        if (index !== type.length-1) {
          this.addExpressionElement(',');
        }
      }, this));
    }
    this.addExpressionElement(')');
  }
  ListComponent.prototype = new SubExpressionUIComponent();
  /**
   * Parse the string list representation into its type components.
   *
   * @param  {String} typeString string list representation, which will in the form of: '(Type1, Type2...)'
   * @return {Array}             types that make up this list
   */
  ListComponent.prototype.parseType = function (typeString) {
    //the type is list if the first char is a left paren
    if (typeString.charAt(0) === '(') {
      var list = typeString.substring(1, typeString.length-1);
      //make sure there is at least one type
      if (/\S/.test(list)) {
        return _.map(list.split(","), function (t) {
          return t.trim();
        });
      } else {
        return [];
      }
    } //else single type
    return typeString;
  };
  /**
   * Get the expression value for this component.
   *
   * @return {String} expression value
   */
  var listGetExpressionValue = ListComponent.prototype.getExpressionValue = function () {
    return "(" + _.map(this.expandableInputs, function (ei) {
      if (ei.data('subExpr')) {
        return ei.data('subExpr').getExpressionValue();
      } else {
        return '{' + ei.data('returnType') + '}';
      }
    }).join(",") + ')';
  };
  /**
   * Get JSON representation of this component.
   *
   * This is used when saving the state of an expression.
   * @override
   * @return {String} JSON representation as a string
   */
  var listToJSON = ListComponent.prototype.toJSON = function () {
    return '{ "type": "LIST", "isMultiSized": ' + JSON.stringify(this.isMultiSized) + ', "values": [' +
      _.map(this.expandableInputs, function (ei) {
      if (ei.data('subExpr')) {
        return ei.data('subExpr').toJSON();
      } else {
        return JSON.stringify(ei.data('returnType'));
      }
    }).join(",") + ']}';
  };

  /**
   * A UI component for a dynamically sized list.
   *
   * @constructor
   * @augments {SubExpressionUIComponent}
   * @param {Function}        s$      scoped jQuery selector
   * @param {String or Array} type    component type as string list representation or Array
   */
  function MultipleSizedListComponent (s$, type) {
    this.s$ = s$;
    this.expressionElements = [];
    this.expandableInputs = [];
    this.isMultiSized = true;
    this.addExpressionElement('(');
    if (type) {
      if (typeof type === 'string') {
        this.addExpandableTypeInput({'returnType': type, 'isMultiSized': true, 'component': this});
      } else {
        //need an expandable input to build off of
        var expandableInput = this.addExpandableTypeInput({'returnType': 'NUMBER', 'isMultiSized': true, 'component': this});
        _.each(type, function (v) {
          if (typeof v === 'string') {
            //do nothing this is an expandable input which will be automatically added when we add any expanded elementa
          } else { //object which means it is an expanded input (hidden input with a sub-expression)
            this.getActiveElement().trigger("subExpressionSelect", new SubExpressionElement(this.s$, v));
          }
        }, this);
      }
    }
    this.addExpressionElement(')');
  }
  MultipleSizedListComponent.prototype = new SubExpressionUIComponent();
  MultipleSizedListComponent.prototype.getExpressionValue = listGetExpressionValue;
  MultipleSizedListComponent.prototype.toJSON = listToJSON;

  /**
   * The UI component added when selecting a sub-expression.
   * 
   * @constructor
   * @augments {SubExpressionUIComponent}
   * @param {Function}  s$      scoped jQuery selector
   * @param {Object}    data    sub-expression data
   */
  function SubExpressionElement (s$, data) {
    this.s$ = s$;
    this.expressionElements = [];
    this.expandableInputs = [];
    _.extend(this, data);
    if (_.isUndefined(data.expressionValue)) {
      this.expressionValue = this.displayText;
    }
  }
  SubExpressionElement.prototype = new SubExpressionUIComponent();
  /**
   * Resolve a component to this SubExpressionElement.
   *
   * @param  {String, Array, or Object} component component to resolve
   * @return {void}
   */
  SubExpressionElement.prototype.resolveComponent = function (component) {
    if (!component) {
      return;
    }
    if (typeof component === 'string' && component.charAt(0) === '(') {
      if (component.substring(component.length - 4, component.length - 1) === '...') {
        return new MultipleSizedListComponent(this.s$, component.substring(1, component.length - 4));
      } else {
        return new ListComponent(this.s$, component);
      }
    } else if (typeof component === 'string') {
      return new TypeComponent(this.s$, component);
    } else if (component instanceof Array) {
      return new ArrayTypeComponent(this.s$, component);
    } else { //object
      //speical deserialization for list components
      if (component.type && component.type === 'LIST') {
        var listComp;
        if (component.isMultiSized) {
          return new MultipleSizedListComponent(this.s$, component.values);
        } else {
          return new ListComponent(this.s$, component.values);
        }
      } else {
        this.addExpandableTypeInput({'returnType': component.returnType});
        return new SubExpressionElement(this.s$, component);
      }
    }
  };
  /**
   * Render this element.
   *
   * @return {void}
   */
  SubExpressionElement.prototype.render = function () {
    this.parentElement = this.getActiveElement();
    this.isGrouped = this.parentElement.data('isGrouped');
    this.parentElement.hide().trigger('hide', this.returnType);
    this.leftComponent = this.resolveComponent(this.leftComponent);
    if (this.leftComponent && this.leftComponent.render instanceof Function) {
      this.leftComponent.render();
    }
    if (this.displayText) {
      this.expressionElement = this.addExpressionElement(this.displayText);
    }
    this.rightComponent = this.resolveComponent(this.rightComponent);
    if (this.rightComponent && this.rightComponent.render instanceof Function) {
      this.rightComponent.render();
    }
    //if both components are array type components, we have to ensure that the types stay in sync when a sub-expression is
    //chosen for either componet
    if (this.rightComponent instanceof ArrayTypeComponent && this.leftComponent instanceof ArrayTypeComponent) {
      var leftInput = this.leftComponent.expandableInputs[0];
      var rightInput = this.rightComponent.expandableInputs[0];
      leftInput.on("hide", function (e, returnType) {
        rightInput.data('returnType', returnType);
      });
      rightInput.on("hide", function (e, returnType) {
        leftInput.data('returnType', returnType);
      });
    }
    this.s$().trigger('eb-subexpression-add', this);
  };
  /**
   * Get expression value for this sub expresion element.
   *
   * @return {String} expression value for this element
   */
  SubExpressionElement.prototype.getExpressionValue = function () {
    var exprValue = [];
    if (this.isGrouped) {
      exprValue.push('(');
    }
    if (this.leftComponent && this.leftComponent.getExpressionValue() !== undefined) {
      exprValue.push(this.leftComponent.getExpressionValue());
    }
    if (this.expressionValue !== undefined) {
      exprValue.push(this.expressionValue);
    }
    if (this.rightComponent && this.rightComponent.getExpressionValue() !== undefined) {
      exprValue.push(this.rightComponent.getExpressionValue());
    }
    if (this.isGrouped) {
      exprValue.push(')');
    }
    return exprValue.join(" ");
  };
  /**
   * Get JSON represenation of this element.
   *
   * This is used when saving the state of an expression.
   * @override
   * @return {String} [description]
   */
  SubExpressionElement.prototype.toJSON = function () {
    var thisJSON = [];
    thisJSON.push('"isGrouped": ' + JSON.stringify(!!this.isGrouped));
    thisJSON.push('"returnType": ' + JSON.stringify(this.returnType));
    if (this.leftComponent && this.leftComponent.toJSON() !== undefined) {
      thisJSON.push('"leftComponent": ' + this.leftComponent.toJSON());
    }
    _.each(['expressionValue', 'displayText', 'returnType'], function (v) {
      if (this[v] !== undefined) {
        thisJSON.push(JSON.stringify(v) + ': ' + JSON.stringify(this[v]));
      }
    }, this);
    if (this.rightComponent && this.rightComponent.getExpressionValue() !== undefined) {
      thisJSON.push('"rightComponent": ' + this.rightComponent.toJSON());
    }
    return '{' + thisJSON.join(", ") + '}';
  };
  /**
   * Remove this Sub Expression Element from the DOM.
   *
   * Remove any components and expression elements.  Then show parent element again.
   * @override
   * @return {void}
   */
  SubExpressionElement.prototype.remove = function () {
    if (this.leftComponent) {
      this.leftComponent.remove();
    }
    _.each(this.expressionElements, function (ee) {
      ee.remove();
    });
    if (this.rightComponent) {
      this.rightComponent.remove();
    }
    this.parentElement.show();
  };
  /**
   * The Expression Builder object.
   *
   * Contains init method and api methods.
   * @type {Object}
   */
  var ExpressionBuilder = {
    /**
     * Initialize the Expression Builder.
     * 
     * @param  {jQuery element} $elem   element to attach expression builder to
     * @param  {Array} subExprsGrouped  list of sub expressions
     * @param  {Object} options         options to the expression builder
     * @return {void}
     */
    init: function ($elem, subExprsGrouped, options) {
      this.$elem = $elem;
      this.options = $.extend({}, defaults, options);
      $elem.append(layout);
      //a jquery selector scoped to elements within this plugin
      var s$ = function (selector) {
        if (selector) {
          return $elem.find(selector);
        } else {
          return $elem;
        }
      };
      this.s$ = s$;
      this.expressionReturnType = this.options.returnType;
      this.addStartSubExpresion();

      if (this.options.expressionURL) {
        $.get(this.options.getExpressionURL, function(data) {
          _.extend(subExprsGrouped, data);
        });
      }
      this.selectElementCollection = new SelectElementCollection(subExprsGrouped, this.getTemplates(), s$);

      var subExprSelect = $('input.subExpr');
      this.subExprSelect = subExprSelect;

      //initialize select2
      var $subExpr = subExprSelect.select2({
        placeholder: "Select a Sub-Expression",
        initSelection: _.bind(function (element, callback) {
          if (element.val()) {
            this.selectElementCollection.getById(element.val()).onSelect();
            //is there a bettter way to get select2 to "reset" (call query)?
            subExprSelect.select2('val', '').select2('close').select2('open');
          }
          callback({id: '', text: ''});
        }, this),
        query: _.bind(function(query) {
          var data = {};
          data.results = this.selectElementCollection.filter(query);
          query.callback (data);
        }, this)
      });
      //call {@link SelectElement#onSelect} when selecting an element
      subExprSelect.on('change', _.bind(function(e) {
        subExprSelect.select2('val', '').select2('close');
        var selectedSubExpr = this.selectElementCollection.getById(e.added.id);
        if (selectedSubExpr) {
          selectedSubExpr.onSelect();
        }
      }, this));
      //show help text on highlight
      subExprSelect.on('select2-highlight', _.bind(function (e) {
        var highlightedElement = this.selectElementCollection.getById(e.choice.id);
        if (highlightedElement) {
          s$('span.helpDescription').text(highlightedElement.getDescription());
          if (highlightedElement.getSignature instanceof Function) {
            s$('span.seSignature').text(highlightedElement.getSignature());
          }
        } else {
          s$('span.helpDescription').text('N/A');
          s$('span.seSignature').text('N/A');
        }
      }, this));
      //clear help text on close
      subExprSelect.on('select2-close', function (e) {
        s$('span.helpDescription').text('N/A');
        s$('span.seSignature').text('N/A');
      });
      //set up buttons
      /*
      s$('.back-btn').on('click', _.bind(function () {
        this.back();
      }, this));
      */
      s$('.clear-btn').on('click', _.bind(function () {
        this.clear();
      }, this));
      s$('.save-as-btn').on('click', _.bind(function () {
        this.saveAsTemplate();
      }, this));
      //focus on start expression input
      s$('div.exprInner input:visible').eq(0).focus();
    },
    /**
     * Get expression.
     *
     * @return {String} Expression value of current expression
     */
    getExpression: function () {
      return this.startSubExpression.getExpressionValue();
    },
    /**
     * Get JSON.
     *
     * @return {Object} JSON representation of current expression
     */
    getJSON: function () {
      return $.parseJSON(this.startSubExpression.toJSON());
    },
    /**
     * Get things started by adding type component for expression return type.
     */
    addStartSubExpresion: function () {
      this.startSubExpression = new TypeComponent(this.s$, this.expressionReturnType);
      this.s$('div.exprInner input:first').remove();
      this.startSubExpression.focusNextInput();
    },
    /**
     * Clear the expression value.
     *
     * The eb-clear event is also triggered.
     * @return {void} [description]
     */
    clear: function () {
      this.subExprSelect.select2('data', null).select2('enable', true).select2('close');
      this.s$('.exprInner').empty().append('<input type="text" class="subExprActive"></input>');
      this.addStartSubExpresion();
      this.s$().trigger('eb-clear');
    },
    /*
    back: function () {
      var $hiddenInput = this.s$('.exprInner input:not(:visible)').last();
      if ($hiddenInput && $hiddenInput.data('subExpr')) {
        $hiddenInput.data('subExpr').remove();
      }
    },
    */
   getTemplates: function () {
    if (this.options.templateURL) {
      var returnVal;
      $.get(this.options.templateURL, function( data ) {
        returnVal = data;
      });
      return returnVal;
    } else {
      if (!window.localStorage.getItem('ebTemplates')) {
        return {};
      }
      return $.parseJSON(window.localStorage.getItem('ebTemplates'));
    }
   },
   saveAsTemplate: function (templateName) {
    //get template name
    if (!templateName) {
      templateName = window.prompt("Please enter a name for the template");
    }
    if (templateName === '') {
      return;
    }
    //if template url is specified do a post to the url to save template, otherwise default to using localStorage
    var newTemp = _.extend(this.getJSON(), {'displayName': templateName});
    if (this.options.templateURL) {
      $.ajax({
        type: "POST",
        url: this.options.templateURL,
        data: newTemp,
        success: _.bind(function() {
          this.selectElementCollection.addTemplate(newTemp);
        }, this),
        dataType: 'json'
      });
    } else {
      if (!window.localStorage.getItem('ebTemplates')) {
        window.localStorage.setItem('ebTemplates', '[]');
      }
      var curTemplates = $.parseJSON(window.localStorage.getItem('ebTemplates'));
      curTemplates.push(newTemp);
      window.localStorage.setItem('ebTemplates', JSON.stringify(curTemplates));
      this.selectElementCollection.addTemplate(newTemp);
    }

   }
  };

  /**
   * Expression Builder API.
   *
   * Most methods just delegate directly to {@link ExpressionBuilder} object.
   * @type {Object}
   */
  var api = {
    init: function (subExprsGrouped, options) {
      var eb = Object.create(ExpressionBuilder);
      eb.init(this, subExprsGrouped, options);
      this.data('expressionBuilder', eb);
      return this;
    },
    getExpressionValue: function () {
      return this.data('expressionBuilder').getExpression();
    },
    getExpressionJSON: function () {
      return this.data('expressionBuilder').getJSON();
    },
    clearExpression: function () {
      this.data('expressionBuilder').clear();
    },
    /*
    back: function () {
      this.data('expressionBuilder').back();
    },
    */
    saveAsTemplate: function (templateName) {
      this.data('expressionBuilder').saveAsTemplate(templateName);
    },
    getTemplates: function () {
      return this.data('expressionBuilder').getTemplates();
    },
    setReturnType: function (type) {
      this.data('expressionBuilder').expressionReturnType = type;
      this.data('expressionBuilder').clear();
    }
  };

  //Expose the plugin
  $.fn.expressionBuilder = function(method) {
    var plugingArgs = arguments;
    var returnVal = this.map(function () {
      var $this = $(this);
       if(api[method]) {
          return api[method].apply($(this), _.rest(plugingArgs));
        } else {
          return api.init.apply($(this), plugingArgs);
        }
    });
    if (returnVal.length === 1) {
      return returnVal[0];
    } else {
      return returnVal;
    }
  };
}(jQuery, _));
