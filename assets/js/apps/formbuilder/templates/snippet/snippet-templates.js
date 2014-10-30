define(function(require) {
  var formname               = require('text!apps/formbuilder/templates/snippet/formname.html')
  , prependedtext            = require('text!apps/formbuilder/templates/snippet/prependedtext.html')
  , search                   = require('text!apps/formbuilder/templates/snippet/searchinput.html')
  , textinput                = require('text!apps/formbuilder/templates/snippet/textinput.html')
  , appendedcheckbox         = require('text!apps/formbuilder/templates/snippet/appendedcheckbox.html')
  , appendedtext             = require('text!apps/formbuilder/templates/snippet/appendedtext.html')
  , filebutton               = require('text!apps/formbuilder/templates/snippet/filebutton.html')
  , button                   = require('text!apps/formbuilder/templates/snippet/button.html')
  , buttondouble             = require('text!apps/formbuilder/templates/snippet/buttondouble.html')
  , buttondropdown           = require('text!apps/formbuilder/templates/snippet/buttondropdown.html')
  , multiplecheckboxes       = require('text!apps/formbuilder/templates/snippet/multiplecheckboxes.html')
  , multiplecheckboxesinline = require('text!apps/formbuilder/templates/snippet/multiplecheckboxesinline.html')
  , multipleradios           = require('text!apps/formbuilder/templates/snippet/multipleradios.html')
  , multipleradiosinline     = require('text!apps/formbuilder/templates/snippet/multipleradiosinline.html')
  , passwordinput            = require('text!apps/formbuilder/templates/snippet/passwordinput.html')
  , prependedcheckbox        = require('text!apps/formbuilder/templates/snippet/prependedcheckbox.html')
  , prependedtext            = require('text!apps/formbuilder/templates/snippet/prependedtext.html')
  , searchinput              = require('text!apps/formbuilder/templates/snippet/searchinput.html')
  , selectbasic              = require('text!apps/formbuilder/templates/snippet/selectbasic.html')
  , selectmultiple           = require('text!apps/formbuilder/templates/snippet/selectmultiple.html')
  , textarea                 = require('text!apps/formbuilder/templates/snippet/textarea.html')
  , textinput                = require('text!apps/formbuilder/templates/snippet/textinput.html');

  return {
    formname                   : formname
    , prependedtext            : prependedtext
    , search                   : search
    , textinput                : textinput
    , appendedcheckbox         : appendedcheckbox
    , appendedtext             : appendedtext
    , filebutton               : filebutton
    , singlebutton             : button
    , doublebutton             : buttondouble
    , buttondropdown           : buttondropdown
    , multiplecheckboxes       : multiplecheckboxes
    , multiplecheckboxesinline : multiplecheckboxesinline
    , multipleradios           : multipleradios
    , multipleradiosinline     : multipleradiosinline
    , passwordinput            : passwordinput
    , prependedcheckbox        : prependedcheckbox
    , prependedtext            : prependedtext
    , searchinput              : searchinput
    , selectbasic              : selectbasic
    , selectmultiple           : selectmultiple
    , textarea                 : textarea
    , textinput                : textinput
  }
});
