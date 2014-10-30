/**
 * Provides utilities to draw onto the canvas.
 *
 * @ignore
 */

// LAYER ----------------------------------------------------------------------

/**
 * The Layer object (basically a new, utility canvas).
 *
 * Layers allow efficient rendering of complex scenes by acting as caches for
 * parts of the scene that are grouped together. For example, it is recommended
 * to create a Layer for your canvas's background so that you can render the
 * background once and then draw the completely rendered background onto the
 * main canvas in each frame instead of re-computing the background for each
 * frame. This can significantly speed up animation.
 *
 * In general you should create a layer for any significant grouping of items
 * if that grouping moves together when animated. It is more memory-efficient
 * to specify a smaller layer size if possible; otherwise the layer will
 * default to the size of the whole canvas.
 *
 * Draw onto a Layer by using its "context" property, which is a
 * {@link CanvasRenderingContext2D canvas graphics context}.
 *
 * @param {Object} [options]
 *   A set of options.
 * @param {Number} [options.x=0]
 *   The x-coordinate of the top-left corner of the Layer.
 * @param {Number} [options.y=0]
 *   The y-coordinate of the top-left corner of the Layer.
 * @param {Number} [options.width]
 *   The width of the Layer.
 * @param {Number} [options.height]
 *   The height of the Layer.
 * @param {"world"/"canvas"} [options.relative="world"]
 *   Indicates what to draw the Layer relative to:
 *
 *   - 'world': Draw the layer relative to the world so that it will appear
 *     to be in one specific place as the player or viewport moves.
 *   - 'canvas': Draw the layer relative to the canvas so that it stays fixed
 *     as the player moves. This is useful for a HUD, for example.
 *
 *   This option is irrelevant if the world is the same size as the canvas.
 * @param {Number} [options.opacity=1]
 *   A fractional percentage [0, 1] indicating the opacity of the Layer.
 *   0 (zero) means fully transparent; 1 means fully opaque. This value is
 *   applied when {@link Layer#draw drawing} the layer.
 * @param {Number} [options.parallax=1]
 *   A fractional percentage indicating how much to {@link Layer#scroll scroll}
 *   the Layer relative to the viewport's movement.
 * @param {Mixed} [options.src]
 *   Anything that can be passed to the `src` parameter of
 *   {@link CanvasRenderingContext2D#drawImage drawImage()}. This will be used
 *   to draw an image stretched over the whole Layer as a convenience.
 * @param {HTMLElement} [options.canvas]
 *   A Canvas element in which to hold the Layer. If not specified, a new,
 *   invisible canvas is created. Careful; if width and height are specified,
 *   the canvas will be resized (and therefore cleared). This is mainly for
 *   internal use.
 */
function Layer(options) {
  options = options || {};
  /**
   * @property {HTMLElement} canvas
   *   The canvas backing the Layer.
   * @readonly
   */
  this.canvas = options.canvas || document.createElement('canvas');
  /**
   * @property {CanvasRenderingContext2D} context
   *   The Layer's graphics context. Use this to draw onto the Layer.
   * @readonly
   */
  this.context = this.canvas.getContext('2d');
  this.context.__layer = this;
  /**
   * @property {Number} width
   *   The width of the Layer.
   * @readonly
   */
  this.width = options.width || (options.canvas ? options.canvas.width : 0) || (options.relative == 'canvas' ? canvas.width : world.width);
  /**
   * @property {Number} height
   *   The height of the Layer.
   * @readonly
   */
  this.height = options.height || (options.canvas ? options.canvas.height : 0) || (options.relative == 'canvas' ? canvas.height : world.height);
  /**
   * @property {Number} x
   *   The x-coordinate on the {@link global#canvas global canvas} of the
   *   upper-left corner of the Layer.
   */
  this.x = options.x || 0;
  /**
   * @property {Number} y
   *   The y-coordinate on the {@link global#canvas global canvas} of the
   *   upper-left corner of the Layer.
   */
  this.y = options.y || 0;
  /**
   * @property {"world"/"canvas"} relative
   *   What to draw the Layer relative to.
   */
  this.relative = options.relative || 'world';
  /**
   * @property {Number} opacity
   *   A fractional percentage [0, 1] indicating the opacity of the Layer.
   *   0 (zero) means fully transparent; 1 means fully opaque. This value is
   *   applied when {@link Layer#draw drawing} the layer.
   */
  this.opacity = options.opacity || 1;
  /**
   * @property {Number} parallax
   *   A fractional percentage indicating how much to
   *   {@link Layer#scroll scroll} the Layer relative to the viewport's
   *   movement.
   */
  this.parallax = options.parallax || 1;
  if (this.canvas.width != this.width) {
    this.canvas.width = this.width;
  }
  if (this.canvas.height != this.height) {
    this.canvas.height = this.height;
  }
  /**
   * @property {Number} xOffset
   *   The horizontal distance in pixels that the Layer has
   *   {@link Layer#scroll scrolled}.
   */
  this.xOffset = 0;
  /**
   * @property {Number} yOffset
   *   The vertical distance in pixels that the Layer has
   *   {@link Layer#scroll scrolled}.
   */
  this.yOffset = 0;
  if (options.src) {
    this.context.drawImage(options.src, 0, 0, this.width, this.height);
  }
  /**
   * Draw the Layer.
   *
   * This method can be invoked in two ways:
   *
   * - `draw(x, y)`
   * - `draw(ctx, x, y)`
   *
   * All parameters are optional either way.
   *
   * @param {CanvasRenderingContext2D} [ctx]
   *   A canvas graphics context onto which this Layer should be drawn. This is
   *   useful for drawing onto other Layers. If not specified, defaults to the
   *   {@link global#context global context} for the default canvas.
   * @param {Number} [x]
   *   An x-coordinate on the canvas specifying where to draw the upper-left
   *   corner of the Layer. The actual position that the coordinate equates to
   *   depends on the value of the
   *   {@link Layer#relative Layer's "relative" property}. Defaults to the
   *   {@link Layer#x Layer's "x" property} (which defaults to 0 [zero]).
   * @param {Number} [y]
   *   A y-coordinate on the canvas specifying where to draw the upper-left
   *   corner of the Layer. The actual position that the coordinate equates to
   *   depends on the value of the
   *   {@link Layer#relative Layer's "relative" property}. Defaults to the
   *   {@link Layer#y Layer's "y" property} (which defaults to 0 [zero]).
   */
  this.draw = function(ctx, x, y) {
    if (!(ctx instanceof CanvasRenderingContext2D)) {
      y = x;
      x = ctx;
      ctx = context;
    }
    x = typeof x === 'undefined' ? this.x : x;
    y = typeof y === 'undefined' ? this.y : y;
    ctx.save();
    ctx.globalAlpha = this.opacity;
    if (this.relative == 'canvas') {
      ctx.translate(world.xOffset, world.yOffset);
    }
    if (this.xOffset || this.yOffset) {
      ctx.translate(this.xOffset, this.yOffset);
    }
    ctx.drawImage(this.canvas, x, y);
    ctx.restore();
    return this;
  };
  /**
   * Clear the layer, optionally by filling it with a given style.
   *
   * @param {Mixed} [fillStyle]
   *   A canvas graphics context fill style. If not passed, the Layer will
   *   simply be cleared. If passed, the Layer will be filled with the given
   *   style.
   */
  this.clear = function(fillStyle) {
    this.context.clear(fillStyle);
    return this;
  };
  /**
   * Scroll the Layer.
   *
   * @param {Number} x
   *   The horizontal distance the target has shifted.
   * @param {Number} y
   *   The vertical distance the target has shifted.
   * @param {Number} [p]
   *   The parallax factor. Defaults to {@link Layer#parallax this.parallax}.
   */
  this.scroll = function(x, y, p) {
    p = p || this.parallax;
    this.xOffset += -x*p;
    this.yOffset += -y*p;
    return this;
  };
  /**
   * Position the Layer's canvas over the primary canvas.
   *
   * This is an alternative to drawing the Layer directly onto the primary
   * canvas. It is mostly useful when the `relative` property is `"canvas"`.
   * It is also useful when the primary canvas is scaled with
   * World#scaleResolution but this Layer should stay a consistent size.
   * However, since it is literally in front of the primary canvas, any other
   * Layers that need to be drawn in front of this one must also be positioned
   * over the primary canvas instead of drawn directly onto it.
   *
   * @return {HTMLElement}
   *   A jQuery representation of a div containing the Layer's canvas.
   */
  this.positionOverCanvas = function() {
    var $d = jQuery('<div></div>');
    var o = $canvas.offset();
    $d.css({
      left: o.left,
      pointerEvents: 'none',
      position: 'absolute',
      top: o.top,
    });
    var $c = jQuery(this.canvas);
    $c.css({
      backgroundColor: 'transparent',
      margin: '0 auto',
      overflow: 'hidden',
      pointerEvents: 'none',
      position: 'absolute',
      'z-index': 50,
    });
    $d.append($c);
    jQuery('body').append($d);
    return $d;
  };
  /**
   * Display this Layer's canvas in an overlay (for debugging purposes).
   *
   * Clicking the overlay will remove it.
   *
   * @return {HTMLElement}
   *   A jQuery representation of a div containing the Layer's canvas.
   */
  this.showCanvasOverlay = function() {
    stopAnimating();
    var $d = jQuery('<div></div>');
    $d.css({
      cursor: 'pointer',
      display: 'block',
      height: '100%',
      left: 0,
      position: 'absolute',
      top: 0,
      width: '100%',
    });
    var $c = jQuery(this.canvas);
    $c.css({
      border: '1px solid black',
      display: 'block',
      margin: '0 auto',
      position: 'absolute',
      'z-index': 100,
    }).click(function() {
      $d.remove();
      startAnimating();
    });
    $d.append($c);
    jQuery('body').append($d);
    $d.click(function(e) {
      if (e.which != 3) { // Don't intercept right-click events
        $d.remove();
      }
    });
    return $d;
  };
}

//RENDERING ------------------------------------------------------------------

/**
 * @class CanvasRenderingContext2D
 *   The native JavaScript canvas graphics context class.
 *
 * This class has been extended with custom methods (and one overridden
 * method).
 *
 * The canvas graphics context for the main canvas is stored in the
 * {@link global#context context} global variable.
 */

/**
 * Clear the canvas.
 *
 * If the rendering context is the {@link global#context global context} for
 * the main canvas or if it belongs to a {@link Layer}, the visible area of the
 * relevant canvas will be cleared. Otherwise, the context doesn't know its
 * transformation matrix, so we have to temporarily reset it to clear the
 * canvas. This has the effect of clearing the visible area of the canvas, but
 * if the fillStyle is being used to draw something, it will not scroll with
 * the rest of the canvas.
 *
 * @param {Mixed} [fillStyle]
 *   If this parameter is passed, the visible area of the canvas will be filled
 *   in with the specified style. Otherwise, the canvas is simply wiped.
 *
 * @member CanvasRenderingContext2D
 */
CanvasRenderingContext2D.prototype.clear = function(fillStyle) {
  this.save();
  var x = 0, y = 0;
  if (this.__layer) {
    x = this.__layer.xOffset;
    y = this.__layer.yOffset;
  }
  else {
    this.setTransform(1, 0, 0, 1, 0, 0);
  }
  if (fillStyle) {
    this.fillStyle = fillStyle;
    this.fillRect(x, y, this.canvas.width, this.canvas.height);
  }
  else {
    this.clearRect(x, y, this.canvas.width, this.canvas.height);
  }
  this.restore();
};

// Store the original drawImage function so we can actually use it.
CanvasRenderingContext2D.prototype.__drawImage = CanvasRenderingContext2D.prototype.drawImage;
/**
 * Draw an image onto the canvas.
 *
 * This method is better than the original `drawImage()` for several reasons:
 *
 * - It uses a cache to allow images to be drawn immediately if they were
 *   pre-loaded and to store images that were not pre-loaded so that they can
 *   be drawn immediately later.
 * - It can draw {@link Sprite}, {@link SpriteMap}, and {@link Layer} objects
 *   as well as the usual images, videos, and canvases. (Note that when Layers
 *   are drawn using this method, their "relative" property IS taken into
 *   account.)
 * - It allows drawing an image by passing in the file path instead of an
 *   Image object.
 *
 * Additionally, this method has an optional `finished` parameter which is a
 * callback that runs when the image passed in the `src` parameter is finished
 * loading (or immediately if the image is already loaded or is a video). The
 * callback's context (its `this` object) is the canvas graphics object. Having
 * this callback is useful because if you do not pre-load images, the image
 * will not be loaded (and therefore will not be drawn) for at least the first
 * time that drawing it is attempted. You can use the `finished` callback to
 * draw the image after it has been loaded if you want.
 *
 * Apart from the additions above, this method works the same way as the
 * [original in the spec](http://www.w3.org/TR/2dcontext/#drawing-images-to-the-canvas).
 *
 * As a summary, this method can be invoked three ways:
 *
 * - `drawImage(src, x, y[, finished])`
 * - `drawImage(src, x, y, w, h[, finished])`
 * - `drawImage(src, sx, sy, sw, sh, x, y, w, h[, finished])`
 *
 * In each case, the `src` parameter accepts one of the following:
 *
 *   - The file path of an image to draw
 *   - A {@link Sprite} or {@link SpriteMap} object
 *   - A {@link Layer} object
 *   - An HTMLCanvasElement
 *   - An HTMLImageElement (same thing as an Image)
 *   - An HTMLVideoElement
 *
 * The `x` and `y` parameters indicate the coordinates of the canvas graphics
 * context at which to draw the top-left corner of the image. (Often this is
 * the number of pixels from the top-left corner of the canvas, though the
 * context can be larger than the canvas if the viewport has scrolled, e.g.
 * with context.translate().)
 *
 * The `w` and `h` parameters indicate the width and height of the image,
 * respectively. Defaults to the image width and height, respectively (or, for
 * a Sprite or SpriteMap, defaults to the projectedW and projectedH,
 * respectively).
 *
 * The `sx`, `sy`, `sw`, and `sh` parameters define a rectangle within the
 * image that will be drawn onto the canvas. `sx` and `sy` are the x- and y-
 * coordinates (within the image) of the upper-left corner of the source
 * rectangle, respectively, and `sw` and `sh` are the width and height of the
 * source rectangle, respectively. These parameters are ignored when drawing a
 * Sprite or SpriteMap. The W3C provides a helpful image to understand these
 * parameters:
 *
 * <img src="http://www.w3.org/TR/2dcontext/images/drawImage.png" alt="drawImage" />
 *
 * See also {@link CanvasRenderingContext2D#drawPattern}() and
 * Caches.preloadImages().
 *
 * @param {Mixed} src
 * @param {Number} [sx]
 * @param {Number} [sy]
 * @param {Number} [sw]
 * @param {Number} [sh]
 * @param {Number} x
 * @param {Number} y
 * @param {Number} [w]
 * @param {Number} [h]
 * @param {Function} [finished]
 * @param {Array} [finished.args]
 *   An array containing the arguments passed to the drawImage() invocation.
 * @param {Boolean} [finished.drawn]
 *   Whether the image was actually drawn (it will not be drawn if the image
 *   wasn't loaded before drawImage() attempted to draw it).
 *
 * @member CanvasRenderingContext2D
 */
CanvasRenderingContext2D.prototype.drawImage = function(src, sx, sy, sw, sh, x, y, w, h, finished) {
  // Allow the finished parameter to come last,
  // regardless of how many parameters there are.
  if (arguments.length % 2 === 0) {
    finished = Array.prototype.pop.call(arguments);
    // Don't let finished interfere with other arguments.
    if (sw instanceof Function) sw = undefined;
    else if (x instanceof Function) x = undefined;
    else if (w instanceof Function) w = undefined;
    if (typeof finished != 'function') {
      finished = undefined;
    }
  }
  var t = this, a = arguments;
  // Keep the stupid order of parameters specified by the W3C.
  // It doesn't matter that we're not providing the correct default values;
  // those will be implemented by the original __drawImage() later.
  if (typeof x != 'number' && typeof y === 'undefined' &&
      typeof w != 'number' && typeof h === 'undefined') {
    x = sx;
    y = sy;
    if (typeof sw == 'number' && typeof sh !== 'undefined') {
      w = sw;
      h = sh;
    }
    sx = undefined;
    sy = undefined;
    sw = undefined;
    sh = undefined;
  }
  // Wrapper function for doing the actual drawing
  var _drawImage = function(image, x, y, w, h, sx, sy, sw, sh) {
    if (w && h) {
      if (sw && sh) {
        t.__drawImage(image, sx, sy, sw, sh, x, y, w, h);
      }
      else {
        t.__drawImage(image, x, y, w, h);
      }
    }
    else {
      t.__drawImage(image, x, y);
    }
    if (finished instanceof Function) {
      finished.call(t, a, true);
    }
  };
  var image;
  if ((typeof Sprite !== 'undefined' && src instanceof Sprite) ||
      (typeof SpriteMap !== 'undefined' && src instanceof SpriteMap)) { // draw a sprite
    src.draw(this, x, y, w, h);
    if (finished instanceof Function) {
      finished.call(t, a, true); // Sprite images are loaded on instantiation
    }
  }
  else if (typeof Layer !== 'undefined' && src instanceof Layer) { // Draw the Layer's canvas
    t.save();
    t.globalAlpha = src.opacity;
    if (src.relative == 'canvas') {
      t.translate(world.xOffset, world.yOffset);
    }
    var f = finished;
    finished = undefined; // Don't call finished() until after translating back
    _drawImage(src.canvas, x, y, w, h, sx, sy, sw, sh);
    t.restore();
    finished = f;
    if (finished instanceof Function) {
      finished.call(t, a, true);
    }
  }
  else if (src instanceof HTMLCanvasElement || // draw a canvas
      src instanceof HTMLVideoElement) { // draw a video
    _drawImage(src, x, y, w, h, sx, sy, sw, sh);
  }
  else if (src instanceof HTMLImageElement || // draw an image directly
      src instanceof Image) { // same thing
    image = src;
    src = image._src || image.src; // check for preloaded src
    if (!src) { // can't draw an empty image
      if (finished instanceof Function) {
        finished.call(t, a, false);
      }
      return;
    }
    if (!Caches.images[src]) { // cache the image by source
      Caches.images[src] = image;
    }
    if (image.complete || (image.width && image.height)) { // draw loaded images
      _drawImage(image, x, y, w, h, sx, sy, sw, sh);
    }
    else { // if the image is not loaded, don't draw it
      if (image._src) { // We've already tried to draw this one
        // The finished callback will run from the first time it was attempted to be drawn
        return;
      }
      var o = image.onload;
      image.onload = function() {
        if (typeof o == 'function') { // don't overwrite any existing handler
          o();
        }
        if (finished instanceof Function) {
          finished.call(t, a, false);
        }
      };
    }
  }
  else if (typeof src == 'string' && Caches.images[src]) { // cached image path
    image = Caches.images[src];
    if (image.complete || (image.width && image.height)) { // Cached image is loaded
      _drawImage(image, x, y, w, h, sx, sy, sw, sh);
    }
    // If cached image is not loaded, bail; the finished callback will run
    // from the first time it was attempted to be drawn
  }
  else if (typeof src == 'string') { // uncached image path
    image = new Image();
    image.onload = function() {
      if (finished instanceof Function) {
        finished.call(t, a, false);
      }
    };
    image._src = src;
    image.src = src;
    Caches.images[src] = image; // prevent loading an unloaded image multiple times
  }
  else {
    throw new TypeMismatchError('Image type not recognized.');
  }
};

/**
 * Draw a pattern onto the canvas.
 *
 * This function is preferred over createPattern() with fillRect() for drawing
 * patterns for several reasons:
 *
 * - It uses a cache to allow images to be drawn immediately if they were
 *   pre-loaded and to store images that were not pre-loaded so that they can
 *   be drawn immediately later.
 * - It can draw {@link Layer} objects as well as the usual images, videos, and
 *   canvases. (Note that when Layers are drawn using this method, their
 *   "relative" property IS taken into account.)
 * - It allows drawing an image by passing in the file path instead of an
 *   Image object.
 *
 * Unlike our modified `drawImage()`, this method cannot draw {@link Sprite}s
 * or {@link SpriteMap}s. If you need to draw a Sprite or SpriteMap as a
 * pattern, draw the part you want onto a Layer or a new canvas and then pass
 * that as the src.
 *
 * See also {@link CanvasRenderingContext2D#drawImage}() and
 * Caches.preloadImages().
 *
 * @param {Mixed} src
 *   The image to draw as a pattern. Accepts one of the following types:
 *
 *   - The file path of an image to draw
 *   - A {@link Layer} object
 *   - An HTMLCanvasElement
 *   - An HTMLImageElement (same thing as an Image)
 *   - An HTMLVideoElement
 *   - A CanvasPattern
 * @param {Number} [x=0]
 *   The x-coordinate at which to draw the top-left corner of the pattern.
 * @param {Number} [y=0]
 *   The y-coordinate at which to draw the top-left corner of the pattern.
 * @param {Number} [w]
 *   The width of the pattern. Defaults to the canvas width.
 * @param {Number} [h]
 *   The height of the pattern. Defaults to the canvas height.
 * @param {"repeat"/"repeat-x"/"repeat-y"/"no-repeat"} [rpt="repeat"]
 *   The repeat pattern type. This parameter can be omitted even if a finished
 *   callback is passed, so the call `drawPattern(src, x, y, w, h, finished)`
 *   is legal.
 * @param {Function} [finished]
 *   A callback that runs when the image passed in the "src" parameter is
 *   finished loading (or immediately if the image is already loaded or is a
 *   video). The callback's context (its `this` object) is the canvas graphics
 *   object. Having this callback is useful because if you do not pre-load
 *   images, the image will not be loaded (and therefore will not be drawn) for
 *   at least the first time that drawing it is attempted. You can use the
 *   finished callback to draw the image after it has been loaded if you want.
 * @param {Array} [finished.args]
 *   An array containing the arguments passed to the drawPattern() invocation.
 * @param {Boolean} [finished.drawn]
 *   Whether the image was actually drawn (it will not be drawn if the image
 *   wasn't loaded before drawPattern() attempted to draw it).
 *
 * @return {CanvasPattern}
 *   The CanvasPattern object for the pattern that was drawn, if possible; or
 *   undefined if a pattern could not be drawn (usually because the image
 *   specified for drawing had not yet been loaded). If your source parameter
 *   is anything other than an image or a file path, the image and pattern
 *   drawn cannot be cached, so it can be helpful for performance to store this
 *   return value and pass it in as the src parameter in the future if you need
 *   to draw the same pattern repeatedly. (Another option is to cache the
 *   drawn pattern in a {@link Layer}.)
 *
 * @member CanvasRenderingContext2D
 */
CanvasRenderingContext2D.prototype.drawPattern = function(src, x, y, w, h, rpt, finished) {
  if (typeof x === 'undefined') x = 0;
  if (typeof y === 'undefined') y = 0;
  if (typeof w === 'undefined') w = this.canvas.width;
  if (typeof h === 'undefined') h = this.canvas.height;
  if (typeof rpt == 'function') {
    finished = rpt;
    rpt = 'repeat';
  }
  else if (!rpt) {
    rpt = 'repeat';
  }
  if (typeof Layer !== 'undefined' && src instanceof Layer) { // Draw the Layer's canvas
    src = src.canvas;
  }
  var image;
  if (src instanceof CanvasPattern) { // draw an already-created pattern
    this.fillStyle = src;
    this.fillRect(x, y, w, h);
    if (finished instanceof Function) {
      finished.call(this, arguments, true);
    }
  }
  else if (typeof Layer !== 'undefined' && src instanceof Layer) { // Draw the Layer's canvas
    this.save();
    this.globalAlpha = src.opacity;
    if (src.relative == 'canvas') {
      this.translate(world.xOffset, world.yOffset);
    }
    this.fillStyle = this.createPattern(src.canvas, rpt);
    this.fillRect(x, y, w, h);
    this.restore();
    if (finished instanceof Function) {
      finished.call(this, arguments, true);
    }
  }
  else if (src instanceof HTMLCanvasElement || // draw a canvas
      src instanceof HTMLVideoElement) { // draw a video
    this.fillStyle = this.createPattern(src, rpt);
    this.fillRect(x, y, w, h);
    if (finished instanceof Function) {
      finished.call(this, arguments, true);
    }
  }
  else if (src instanceof HTMLImageElement || // draw an image directly
      src instanceof Image) { // same thing
    image = src;
    src = image._src || image.src; // check for preloaded src
    if (!src) { // can't draw an empty image
      if (finished instanceof Function) {
        finished.call(this, arguments, false);
      }
      return;
    }
    if (Caches.imagePatterns[src]) { // We already have a pattern; just draw it
      this.fillStyle = Caches.imagePatterns[src];
      this.fillRect(x, y, w, h);
      if (finished instanceof Function) {
        finished.call(this, arguments, true);
      }
      return this.fillStyle;
    }
    if (!Caches.images[src]) { // cache the image by source
      Caches.images[src] = image;
    }
    if (image.complete || (image.width && image.height)) { // draw loaded images
      this.fillStyle = this.createPattern(image, rpt);
      this.fillRect(x, y, w, h);
      Caches.imagePatterns[src] = this.fillStyle;
      if (finished instanceof Function) {
        finished.call(this, arguments, true);
      }
    }
    else { // if the image is not loaded, don't draw it
      if (image._src) { // We've already tried to draw this one
        // The finished callback will run from the first time it was attempted to be drawn
        return;
      }
      var t = this, o = image.onload;
      image.onload = function() {
        if (typeof o == 'function') { // don't overwrite any existing handler
          o();
        }
        Caches.imagePatterns[src] = this.createPattern(image, rpt);
        if (finished instanceof Function) {
          finished.call(t, arguments, false);
        }
      };
    }
  }
  else if (typeof src == 'string') { // file path
    if (Caches.imagePatterns[src]) { // We already have a pattern; just draw it
      this.fillStyle = Caches.imagePatterns[src];
      this.fillRect(x, y, w, h);
      if (finished instanceof Function) {
        finished.call(this, arguments, true);
      }
    }
    else if (Caches.images[src]) { // Image is cached, but no pattern
      image = Caches.images[src];
      if (image.complete || (image.width && image.height)) { // Cached image is loaded
        this.fillStyle = this.createPattern(image, rpt);
        this.fillRect(x, y, w, h);
        Caches.imagePatterns[src] = this.fillStyle;
        if (finished instanceof Function) {
          finished.call(this, arguments, true);
        }
      }
      // If cached image is not loaded, bail; the finished callback will run
      // from the first time it was attempted to be drawn
    }
    else { // Image not loaded yet
      var that = this;
      image = new Image();
      image.onload = function() {
        Caches.imagePatterns[src] = this.createPattern(image, rpt);
        if (finished instanceof Function) {
          finished.call(that, arguments, false);
        }
      };
      image._src = src;
      image.src = src;
      Caches.images[src] = image;
    }
  }
  if (Caches.imagePatterns[src]) {
    return Caches.imagePatterns[src];
  }
};

/**
 * Draw a checkerboard pattern.
 *
 * This method can be invoked in two ways:
 *
 * - `drawCheckered(squareSize, x, y, w, h, color1, color2);`
 * - `drawCheckered(color1, color2, squareSize, x, y, w, h);`
 *
 * All parameters are optional either way.
 *
 * @param {Number} [squareSize=80]
 *   The width and height, in pixels, of each square in the checkerboard
 *   pattern.
 * @param {Number} [x=0]
 *   The x-coordinate of where the pattern's upper-left corner should be drawn
 *   on the canvas.
 * @param {Number} [y=0]
 *   The y-coordinate of where the pattern's upper-left corner should be drawn
 *   on the canvas.
 * @param {Number} [w=squareSize*2]
 *   The width of the pattern to draw onto the canvas.
 * @param {Number} [h=squareSize*2]
 *   The height of the pattern to draw onto the canvas.
 * @param {String} [color1="silver"]
 *   The color of one set of squares in the checkerboard.
 * @param {String} [color2="lightGray"]
 *   The color of the other set of squares in the checkerboard.
 *
 * @return {CanvasPattern}
 *   The CanvasPattern object for the pattern that was drawn. It can be helpful
 *   for performance to store this return value and use it to call
 *   {@link CanvasRenderingContext2D#drawPattern}() in the future if you need
 *   to draw this same pattern repeatedly. (Another option is to cache the
 *   drawn pattern in a {@link Layer}.)
 *
 * @member CanvasRenderingContext2D
 */
CanvasRenderingContext2D.prototype.drawCheckered = function(squareSize, x, y, w, h, color1, color2) {
  if (typeof squareSize === 'undefined') squareSize = 80;
  if (typeof squareSize == 'string' && typeof x == 'string') {
    var c1 = squareSize, c2 = x;
    squareSize = y;
    x = w;
    y = h;
    w = color1;
    h = color2;
    color1 = c1;
    color2 = c2;
  }
  var pattern = document.createElement('canvas'), pctx = pattern.getContext('2d');
  pattern.width = squareSize*2;
  pattern.height = squareSize*2;
  pctx.fillStyle = color1 || 'silver';
  pctx.fillRect(0, 0, squareSize, squareSize);
  pctx.fillRect(squareSize, squareSize, squareSize, squareSize);
  pctx.fillStyle = color2 || 'lightGray';
  pctx.fillRect(squareSize, 0, squareSize, squareSize);
  pctx.fillRect(0, squareSize, squareSize, squareSize);
  return this.drawPattern(pattern, x || 0, y || 0, w || this.canvas.width, h || this.canvas.height);
};

// DRAW SHAPES ----------------------------------------------------------------

/**
 * Draw a circle.
 *
 * @param {Number} x
 *   The x-coordinate of the center of the circle.
 * @param {Number} y
 *   The y-coordinate of the center of the circle.
 * @param {Number} r
 *   The radius of the circle.
 * @param {Mixed} [fillStyle]
 *   A canvas fillStyle used to fill the circle. If not specified, the circle
 *   uses the current fillStyle. If null, the circle is not filled.
 * @param {Mixed} [strokeStyle]
 *   A canvas strokeStyle used to draw the circle's border. If not specified,
 *   no border is drawn on the circle. If null, the border uses the current
 *   strokeStyle.
 *
 * @member CanvasRenderingContext2D
 */
CanvasRenderingContext2D.prototype.circle = function(x, y, r, fillStyle, strokeStyle) {
  // Circle
  this.beginPath();
  this.arc(x, y, r, 0, 2 * Math.PI, false);
  if (fillStyle !== null) {
    if (fillStyle) {
      this.fillStyle = fillStyle;
    }
    this.fill();
  }
  if (strokeStyle !== undefined) {
    this.lineWidth = Math.max(Math.ceil(r/15), 1);
    if (strokeStyle) {
      this.strokeStyle = strokeStyle;
    }
    this.stroke();
  }
};
