define([ 'app', 'stache!apps/form/main', 'stache!apps/form/parsley', 'stache!apps/form/cities', 'stache!apps/form/at', 'stache!apps/form/signup', 
         'stache!apps/form/chained', 'stache!apps/form/progress', 'stache!apps/form/cube', 'stache!apps/form/velocity', 'stache!apps/form/fontsize',
         'stache!apps/form/matter','stache!apps/form/svg', 'stache!apps/form/webcom', 'stache!apps/form/slider', 'stache!apps/form/triangle','stache!apps/form/menu',
         'stache!apps/form/table', 'stache!apps/form/mutation',
         'H5F', 
         'css!apps/form/style', 'css!apps/form/parsley', 'css!apps/form/signup', 'css!apps/form/matter','css!apps/form/svg', 'css!apps/form/menu', 'css!apps/form/table', 
         'css!apps/form/progress', 'css!apps/form/cube','css!apps/form/velocity', 'css!vendor/css/stackicons-social-codepen',
         'css!apps/form/fontsize', 'css!apps/form/doughnut', 'css!apps/form/compound', 'css!apps/form/absolute', 'css!apps/form/stylesheets/test',
         'css!apps/form/stylesheets/circle', 'css!apps/form/stylesheets/triangle',
         // 'css!vendor/css/social-sharing-css', "css!vendor/css/kraken-buttons",
         'parsley', 'jquery.fineuploader', 'selectize', 'picker.date', 'picker.time', 
         'jquery.atwho', 'jquery-ui-timepicker-addon', 'jquery.form', 'jquery.tokeninput' ,
          'garlic', 'pwstrength', 'jquery.mask' , 'behave', 'jquery.idealforms', 'jquery.multi-select', 'bbcode', 'hideShowPassword', 'vendor/jquery.chained',
          'vendor/jquery.chained.remote', 'vendor/expanding', 'vendor/filereader', 'progression', 'jquery.velocity', 'velocity.ui', 'vendor/picturefill', 'vendor/Chart.min',
          'vendor/modernizr-2.6.2-respond-1.1.0.min', 'vendor/jquery.drawDoughnutChart', 'apps/form/heavytable'], 
         function(App, viewTpl, parsleyTpl, citiesTpl, atTpl, signupTpl, chainedTpl, progressTpl, 
        		 cubeTpl, velocityTpl, fontsizeTpl, matterTpl,svgTpl, webcomTpl, sliderTpl, triangleTpl,menuTpl,tableTpl,mutationTpl,
        		 H5F) {
	

	  $.fn.visible = function(partial) {
	    
	      var $t            = $(this),
	          $w            = $(window),
	          viewTop       = $w.scrollTop(),
	          viewBottom    = viewTop + $w.height(),
	          _top          = $t.offset().top,
	          _bottom       = _top + $t.height(),
	          compareTop    = partial === true ? _bottom : _top,
	          compareBottom = partial === true ? _top : _bottom;
	    
	    return ((compareBottom <= viewBottom) && (compareTop >= viewTop));

	  };
	  
	App.module('form', function(form, App, Backbone, Marionette, $, _) {
		var loadCSS = function(url, callback){
			var link = document.createElement('link');
			link.type = 'text/css';
			link.rel = 'stylesheet';
			link.href = url;
			link.id = 'theme-style';

			document.getElementsByTagName('head')[0].appendChild(link);

			var img = document.createElement('img');
			img.onerror = function(){
				if(callback) callback(link);
			}
			img.src = url;
		};
		
		
		var emojis = [ "smile", "iphone", "girl", "smiley", "heart", "kiss", "copyright", "coffee", "a", "ab", "airplane", "alien", "ambulance", "angel", "anger", "angry", "arrow_forward", "arrow_left", "arrow_lower_left", "arrow_lower_right", "arrow_right", "arrow_up", "arrow_upper_left", "arrow_upper_right", "art", "astonished", "atm", "b", "baby", "baby_chick", "baby_symbol", "balloon",
				"bamboo", "bank", "barber", "baseball", "basketball", "bath", "bear", "beer", "beers", "beginner", "bell", "bento", "bike", "bikini", "bird", "birthday", "black_square", "blue_car", "blue_heart", "blush", "boar", "boat", "bomb", "book", "boot", "bouquet", "bow", "bowtie", "boy", "bread", "briefcase", "broken_heart", "bug", "bulb", "person_with_blond_hair", "phone", "pig", "pill",
				"pisces", "plus1", "point_down", "point_left", "point_right", "point_up", "point_up_2", "police_car", "poop", "post_office", "postbox", "pray", "princess", "punch", "purple_heart", "question", "rabbit", "racehorse", "radio", "up", "us", "v", "vhs", "vibration_mode", "virgo", "vs", "walking", "warning", "watermelon", "wave", "wc", "wedding", "whale", "wheelchair", "white_square",
				"wind_chime", "wink", "wink2", "wolf", "woman", "womans_hat", "womens", "x", "yellow_heart", "zap", "zzz", "+1", "-1" ]
		var names = [ "Jacob", "Isabella", "Ethan", "Emma", "Michael", "Olivia", "Alexander", "Sophia", "William", "Ava", "Joshua", "Emily", "Daniel", "Madison", "Jayden", "Abigail", "Noah", "Chloe", "你好", "你你你" ];		
		
		var names = $.map(names, function(value, i) {
			return {
				'id' : i,
				'name' : value,
				'email' : value + "@email.com"
			};
		});
		var emojis = $.map(emojis, function(value, i) {
			return {
				key : value,
				name : value
			}
		});

		form.MainView = Marionette.Layout.extend({
			template : viewTpl,
			regions : {
				content : '#form-container'
			},
			onShow: function(){
				$('#header-region').hide();
			},
			onClose: function(){
				$('#header-region').show();
			}
		});
		
		form.velocityView = Marionette.ItemView.extend({
			template : velocityTpl,
			onShow: function(){
				require(['apps/form/dots'], function(run){
					run()
				})
			}
		});
		
		form.mutationView = Marionette.ItemView.extend({
			template : mutationTpl,
			onShow: function(){
				var MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;
				  var list = document.querySelector('ol.mutation');
				  
				  var observer = new MutationObserver(function(mutations) {  
				    mutations.forEach(function(mutation) {
				      if (mutation.type === 'childList') {
				        var list_values = [].slice.call(list.children)
				            .map( function(node) { return node.innerHTML; })
				            .filter( function(s) {
				              if (s === '<br>') {
				                return false;
				              }
				              else {
				                return true;
				              }
				         });
				        console.log(list_values);
				      }
				    });
				  });
				  
				  observer.observe(list, {
				  	attributes: true, 
				  	childList: true, 
				  	characterData: true
				  });
			}
		});
		
		form.tableView = Marionette.ItemView.extend({
			template : tableTpl,
			onShow: function(){
				// search
				var searchStyle = document.getElementById('search_style');
				document.getElementById('searchme').addEventListener('input', function() {
				  if (!this.value) {
				    searchStyle.innerHTML = "";
				    return;
				  }
				  searchStyle.innerHTML = ".searchable:not([data-index*=\"" + this.value.toLowerCase() + "\"]) { display: none; }";
				});
				
				require(['apps/form/tablefilter'], function(tablefilter){
					tablefilter.init()
				});
				$('#search').keyup(function() {
					  var regex = new RegExp($('#search').val(), "i");
					  var rows = $('.titlesearch > table tr:gt(0)');
					  rows.each(function (index) {
					    title = $(this).children("#title").html()
					    if (title.search(regex) != -1) {
					      $(this).show();
					    } else {
					      $(this).hide();
					    }
					  });
					});
				$('.heavytable > table').heavyTable({
				    xPosition: 2,
				    yPosition: 2
				  });
			}
		});
		
		form.menuView = Marionette.ItemView.extend({
			template : menuTpl,
			onShow: function(){
				
			}
		});
		
		form.triangleView = Marionette.ItemView.extend({
			template : triangleTpl,
			onShow: function(){
				require(['apps/form/triangle'], function(run){
					run()
				})
			}
		});
		
		form.sliderView = Marionette.ItemView.extend({
			template : sliderTpl,
			onShow: function(){
				HTMLElement.prototype.createShadowRoot = 
					  HTMLElement.prototype.createShadowRoot ||
					  HTMLElement.prototype.webkitCreateShadowRoot ||
					  function() {};

					// Add the template to the Shadow DOM
					var tmpl = document.querySelector('template');
					var host = document.querySelector('.img-slider');
					var root = host.createShadowRoot();
					root.appendChild(document.importNode(tmpl.content, true));
			   // email suggester
					require(['apps/form/EmailSuggester'], function(EmailSuggester){
						EmailSuggester.init();
					})
			}
		});
		
		form.webcomView = Marionette.ItemView.extend({
			template : webcomTpl,
			onShow: function(){
				HTMLElement.prototype.createShadowRoot = 
					  HTMLElement.prototype.createShadowRoot ||
					  HTMLElement.prototype.webkitCreateShadowRoot ||
					  function() {};

					// Add the template to the Shadow DOM
					var tmpl = document.querySelector('template');
					var host = document.querySelector('.img-slider');
					var root = host.createShadowRoot();
					root.appendChild(document.importNode(tmpl.content, true));
			}
		});
		
		form.svgView = Marionette.ItemView.extend({
			template : svgTpl,
			className : 'svgDemo',
			onShow: function(){
				// before demo
				var list = document.querySelector('ul.beforedemo');
				list.addEventListener('click', function(ev) {
				  if( ev.target.tagName === 'LI') {
				     ev.target.classList.toggle('done'); 
				  }
				}, false);
				// speech recognition API test
				var cc = document.getElementById('cc-text');
				var button = document.getElementById('cc-button');
				
				var recognizing = false;

				var recognition = new webkitSpeechRecognition();
				recognition.continuous = true;
				recognition.interimResults = true;
				  
				recognition.onstart = function() {
				  recognizing = true;
				};

				recognition.onerror = function(event) {};
				recognition.onend = function() {
				  recognizing = false;
				};

				recognition.onresult = function(event) {
				  for (var i = event.resultIndex; i < event.results.length; ++i) {
				    if(event.results[i][0].confidence > 0.4) {
				      cc.innerHTML = capitalize(event.results[i][0].transcript);
				    }
				  }
				};

				function capitalize(s) {
				  var first_char = /\S/;
				 return s.replace(first_char, function(m) { 
				    return m.toUpperCase(); 
				  }); 
				}

				function toggleSpeechRecognition(event) {
				  if(recognizing) {
				    recognition.stop();
				    cc.style.display = "none";
				    button.style.display = "inline-block";
				    return;
				  } else {
				    cc.style.display = "inline-block";
				    button.style.display = "none";
				    recognition.start();
				  }
				}
				
				$(button).on('click',toggleSpeechRecognition );
				
				$(cc).on('click',toggleSpeechRecognition );

				// restart animation
				$("#logo").click(function() {	
		      	      
					 var el     = $(this),  
					     newone = el.clone(true);
					           
					 el.before(newone);
					        
					 el.remove();

					});
				// restart not working
				$("#logo2").click(function() {	
		      	      
					var elm = this;
					var newOne = elm.cloneNode(true);
					elm.parentNode.replaceChild(newOne, elm);

					});
				//
				var menuItems = $('.main-navigation li');

				menuItems.on("click", function(event) {
				    
				  menuItems.removeClass("active");
				  
				  $(this).addClass("active");
				  
				  $(".main-content").css({
				    "background": $(this).data("bg-color")
				  });
				  
				  event.preventDefault();
				});
			}
		});
		
		form.doughnutChartView = Marionette.ItemView.extend({
			template : _.template('<div id="doughnutChart" class="chart"></div>'),
			onShow: function(){
				$("#doughnutChart").drawDoughnutChart([
				                                       { 
				                                         title: "Nope, It's all just the web",
				                                         value : 4822,  
				                                         color: "#f3e32b" 
				                                       },
				                                       { 
				                                         title: "Yep. They are different things with different concerns",
				                                         value:  12339,   
				                                         color: "#35a8ff" 
				                                       }
				                                     ]);
			}
		});
		
		form.canvasView = Marionette.ItemView.extend({
			template : _.template('<canvas id="c" width="500" height="300"></canvas>'),
			onShow: function(){
				var el = document.getElementById('c');
				var ctx = el.getContext('2d');

				ctx.lineWidth = 1;
				ctx.lineJoin = ctx.lineCap = 'round';

				var isDrawing, points = [ ];
				
				var cl = $(el).offset().left, ct = $(el).offset().top;

				el.onmousedown = function(e) {
				  points = [ ];
				  isDrawing = true;
				  points.push({ x: e.clientX -cl, y: e.clientY - ct });
				};

				el.onmousemove = function(e) {
				  if (!isDrawing) return;

				  //ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
				  points.push({ x: e.clientX - cl, y: e.clientY - ct });

				  ctx.beginPath();
				  ctx.moveTo(points[points.length - 2].x, points[points.length - 2].y);
				  ctx.lineTo(points[points.length - 1].x, points[points.length - 1].y);
				  ctx.stroke();
				  
				  for (var i = 0, len = points.length; i < len; i++) {
				    dx = points[i].x - points[points.length-1].x;
				    dy = points[i].y - points[points.length-1].y;
				    d = dx * dx + dy * dy;

				    if (d < 2000 && Math.random() > d / 2000) {
				      ctx.beginPath();
				      ctx.strokeStyle = 'rgba(0,0,0,0.3)';
				      ctx.moveTo( points[points.length-1].x + (dx * 0.5), points[points.length-1].y + (dy * 0.5));
				      ctx.lineTo( points[points.length-1].x - (dx * 0.5), points[points.length-1].y - (dy * 0.5));
				      ctx.stroke();
				    }
				  }
				};

				el.onmouseup = function() {
				  isDrawing = false;
				  points.length = 0;
				};
			}
		});
		
		form.matterView = Marionette.ItemView.extend({
			template : matterTpl,
			className: 'matter-container',
			onShow: function(){
				setTimeout(function() {
					  $(".col:nth-child(2)").append("<div class='module added'><img src='http://placekitten.com/g/300/300'></div>");
					}, 1500);

					setTimeout(function() {
					  $(".col:nth-child(1)").append("<div class='module added'><img src='http://placekitten.com/g/301/301'></div>");
					  $(".loader").fadeOut();
					}, 3000);
					
			   // navigation menu
					$('<button class="close-button">\
						    <b class="visually-hidden">Close</b>\
						    <span aria-hidden="true">\
						      ×\
						    </span>\
						  </button>').appendTo(".main-nav");

						$(".main-nav").on("click", function() {
						   $(this).toggleClass("open");
						  return false;
						});
			  // translate Z demo
						var el  = document.getElementById('element'),
					    css = document.getElementById('css'),
					    z   = 0;

					document.getElementById('zslider').addEventListener('change', function() {
					  z = this.value;
					  update();
					}, false);

					function update() {
					  var prop = 'translateZ(' + z + 'px)';
					  //el.style[Modernizr.prefixed('transform')] = prop + ' rotateY(60deg)';
					  $(el).css(Modernizr.prefixed('transform'), prop + ' rotateY(60deg)' );
					  css.innerText = 'transform: ' + prop;
					}
			}
		});
		
		form.fontsizeView = Marionette.ItemView.extend({
			template : fontsizeTpl,
			onShow: function(){
				// visible
				var allMods = $(".demo-module");

				allMods.each(function(i, el) {
				  var el = $(el);
				  if (el.visible(true)) {
				    el.addClass("already-visible"); 
				  } 
				});
				
				var win = $(window);
				
				win.scroll(function(event) {
					  
					  allMods.each(function(i, el) {
					    var el = $(el);
					    if (el.visible(true)) {
					      el.addClass("come-in"); 
					    } 
					  });
				});
				
				// blend mode
				function blendModeChanged() {
					  var blendMode = document.getElementById("blendModesList").options[
					    document.getElementById("blendModesList").selectedIndex].value;
					  document.getElementById("bg-wrapper").style.backgroundBlendMode = blendMode + ', normal';
					  document.getElementById("bg-wrapper").style.webkitBackgroundBlendMode = blendMode + ', normal';
					}

					function backgroundColorChanged() {
					  var backgroundColor = document.getElementById("backgroundColorPicker").value;
					  document.getElementById("bg-wrapper").style.backgroundColor = backgroundColor;
					}

					function backgroundImageChanged() {
					  var selectedImage = document.getElementById("backgroundImageList").options[
					    document.getElementById("backgroundImageList").selectedIndex];

					  var backgroundImage = selectedImage.value;
					  document.getElementById("bg-wrapper").style.backgroundImage = "url(" + backgroundImage + ")";
					}
					
					 document.getElementById("blendModesList").addEventListener("change", blendModeChanged, false);
					  document.getElementById("backgroundColorPicker").addEventListener("change", backgroundColorChanged, false);
					  document.getElementById("backgroundImageList").addEventListener("change", backgroundImageChanged, false);
				// nav choices
				$("#menu-items-position").on("change", function(e) {
					  $("#main-nav-list").css("justify-content", $(this).find("option:selected").val());
					});

					$("#menu-items").on("change", function(e) {
					  $("#main-nav-list li").css("flex", $(this).find("option:selected").val());
					});

					$("#show").on("change", function(e) {
					  $("#main-nav").removeClass("outlines").addClass($(this).find("option:selected").val());
					});
				// flex box add button
				$("#add").on("click", function() {
					  $("#parent").append("<div class='child' />");
					});
				
				// module
				$(".module").prepend("<div class='module-control font-size-control'>Module: <input type='range'></div>");

				$("input[type='range']").each(function() {
				  var el = $(this);
				  el.attr("min", 0.5);
				  el.attr("max", 3.0);
				  el.attr("step", 0.2);
				  el.attr("value", el.parent().data("font-size-in-rem"));
				})
				.on("change", function() {
				  $(this).closest(".module").css("font-size", $(this).val() + "rem");
				});

				$("#document-font-size-control")
				.on("change", function() {
				  $("html").css("font-size", $(this).val() + "rem");
				});
				
				// chart
				var c1 = document.getElementById("c1");
				var parent = document.getElementById("p1");
				c1.width = parent.offsetWidth - 40;
				c1.height = parent.offsetHeight - 40;

				var data1 = {
				  labels : ["Never","1-10","10-50","50-100","100-1000","1000+"],
				  datasets : [
				    {
				      fillColor : "rgba(255,255,255,.1)",
				      strokeColor : "rgba(255,255,255,1)",
				      pointColor : "#b66e5d",
				      pointStrokeColor : "rgba(255,255,255,1)",
				      data : [4202,5960,3882,3206,3312,1280]
				    }
				  ]
				}

				var options1 = {
				  scaleFontColor : "rgba(255,255,255,1)",
				  scaleLineColor : "rgba(255,255,255,1)",
				  scaleGridLineColor : "transparent",
				  bezierCurve : false,
				  scaleOverride : true,
				  scaleSteps : 6,
				  scaleStepWidth : 1000,
				  scaleStartValue : 0
				}

				new Chart(c1.getContext("2d")).Line(data1,options1)
			}
		});
		
		form.cubeView = Marionette.ItemView.extend({
			template : cubeTpl,
			onShow: function(){
				// icon font
				$("#font-size-slider").change(function(e) {
					$("tr:first-child td").css("font-size", $(this).val() + "px");	
				});
				
				$(".color-slider").change(function(e) {
					$("tr:first-child td").css("color", "hsla(" + $("#color-slider-1").val() + ", " + $("#color-slider-2").val() + "%, " + $("#color-slider-3").val() + "%, 1)");	
				});
				
				$(".shadow-slider").change(function(e) {	
					$("tr:first-child td").css("text-shadow", $("#shadow-slider-1").val() + "px " + $("#shadow-slider-2").val() + "px " + $("#shadow-slider-3").val() + "px black");	 
				});
				// Sometimes you don't have a `this` though
				$(document).on("click", "a.link", doSomething);


				function doSomething(event) {
				  
				  // We still have access to `this` here
				  
				  // But still could be issues with event.target...
				  // console.log(event.target);
				  
				  // But what if we for sure want the <a>, because, for example, we need a data-attribute on it.
				  var el;
				  
				  // we can check the tag type, and if it's not the <a>, move up.
				  if (event.target.tagType != "A") {
				    el = $(event.target).closest("a");
				  } else {
				    el = $(event.target);
				  }
				  console.log(el.data("data"));
				  
				}
			}
		});
		
		form.progressView = Marionette.ItemView.extend({
			template : progressTpl,
			onShow: function(){
				  var getMax = function(){
				        return $(document).height() - $(window).height();
				    }
				    
				    var getValue = function(){
				        return $(window).scrollTop();
				    }
				    
				    if('max' in document.createElement('progress')){
				        // Browser supports progress element
				        var progressBar = $('progress');
				        
				        // Set the Max attr for the first time
				        progressBar.attr({ max: getMax() });

				        $(document).on('scroll', function(){
				            // On scroll only Value attr needs to be calculated
				            progressBar.attr({ value: getValue() });
				        });
				      
				        $(window).resize(function(){
				            // On resize, both Max/Value attr needs to be calculated
				            progressBar.attr({ max: getMax(), value: getValue() });
				        });   
				    }
				    else {
				        var progressBar = $('.progress-bar'), 
				            max = getMax(), 
				            value, width;
				        
				        var getWidth = function(){
				            // Calculate width in percentage
				            value = getValue();            
				            width = (value/max) * 100;
				            width = width + '%';
				            return width;
				        }
				        
				        var setWidth = function(){
				            progressBar.css({ width: getWidth() });
				        }
				        
				        $(document).on('scroll', setWidth);
				        $(window).on('resize', function(){
				            // Need to reset the Max attr
				            max = getMax();
				            setWidth();
				        });
				    }

			  $('#flat').addClass("active");
			  $('#progressBar').addClass('flat');
			    
			  $('#flat').on('click', function(){
			    $('#progressBar').removeClass().addClass('flat');
			    $('a').removeClass();
			    $(this).addClass('active');
			    $(this).preventDefault();
			  });

			  $('#single').on('click', function(){
			    $('#progressBar').removeClass().addClass('single');
			    $('a').removeClass();    
			    $(this).addClass('active');
			    $(this).preventDefault();    
			  });

			  $('#multiple').on('click', function(){
			    $('#progressBar').removeClass().addClass('multiple');
			    $('a').removeClass();    
			    $(this).addClass('active');
			    $(this).preventDefault();    
			  });

			  $('#semantic').on('click', function(){
			    $('#progressBar').removeClass().addClass('semantic');
			    $('a').removeClass();    
			    $(this).addClass('active');
			    $(this).preventDefault();
			    alert('hello');
			  });

			}
		});
		
		form.chainedView = Marionette.ItemView.extend({
			template : chainedTpl,
			onShow: function(){
				$("#size").on("click", function() {
					 $(".col").toggleClass("large");
					});

					$("#fonts").on("click", function() {
					  if ($(this).is(":checked")) {
					    $(".script").attr("class", "script on");
					    $(".sans").attr("class", "sans on");
					  } else {
					    $(".script").attr("class", "script");
					    $(".sans").attr("class", "sans");
					  }
					  
					});
				require(['apps/form/chained'], function(run){
					run();
				});			
				$(".expanding").expanding();
			}
		});
		
		form.signupView = Marionette.ItemView.extend({
			template : signupTpl,		
			className: 'signupHolder',
			onShow: function(){
				H5F.setup(document.getElementById("signup"));
				$('#password-1').hidePassword(true);

				$('#password-2').showPassword('focus', {
				  toggle: { className: 'my-toggle' }
				});

				$('#show-password').change(function(){
				  $('#password-3').hideShowPassword($(this).prop('checked'));
				});
			}
		});

		form.atView = Marionette.ItemView.extend({
			template : atTpl,
			onShow : function() {
				var at_config = {
					at : "@",
					data : names,
					tpl : "<li data-value='@${name}'>${name} <small>${email}</small></li>",
					show_the_at : true
				}
				var emoji_config = {
					at : ":",
					data : emojis,
					tpl : "<li data-value=':${key}:'>${name} <img src='http://a248.e.akamai.net/assets.github.com/images/icons/emoji/${name}.png'  height='20' width='20' /></li>",
					insert_tpl : "<img src='http://a248.e.akamai.net/assets.github.com/images/icons/emoji/${name}.png'  height='20' width='20' />",
				}
				$inputor = $('#inputor').atwho(at_config).atwho(emoji_config);
				$inputor.caret('pos', 47);
				$inputor.focus().atwho('run');
				$('#editable').atwho(at_config).atwho(emoji_config);

				ifr = $('#iframe1')[0]
				ifrBody = ifr.contentDocument.body
				ifrBody.contentEditable = true
				ifrBody.id = 'ifrBody'
				ifrBody.innerHTML = 'For <strong>WYSIWYG</strong> which using <strong>iframe</strong> such as <strong>ckeditor</strong>'
				$(ifrBody).atwho(at_config);
				
				$('#tabs').tabs();
				
				$('.example-container > pre').each(function(i){
					eval($(this).text());
				});
				
				// bind 'myForm' and provide a simple callback function 
	            $('#myForm').ajaxForm(function() { 
	                alert("Thank you for your comment!"); 
	            });
	            
	            $("#demo-input-facebook-theme").tokenInput("http://shell.loopj.com/tokeninput/tvshows.php", {
	                theme: "facebook"
	            });	    
	            
	            var options = {};
	            options.ui = {
	                showPopover: true,
	                showErrors: true,
	                showProgressBar: false
	            };
	            options.rules = {
	                activated: {
	                    wordTwoCharacterClasses: true,
	                    wordRepetitions: true
	                }
	            };
	            $(':password').pwstrength(options);
	            
	            $('.date').mask('11/11/1111');
	            $('.time').mask('00:00:00');
	            $('.date_time').mask('00/00/0000 00:00:00');
	            $('.cep').mask('00000-000');
	            $('.phone').mask('0000-0000');
	            $('.phone_with_ddd').mask('(00) 0000-0000');
	            $('.phone_us').mask('(000) 000-0000');
	            $('.mixed').mask('AAA 000-S0S');
	            $('.cpf').mask('000.000.000-00', {reverse: true});
	            $('.money').mask('000.000.000.000.000,00', {reverse: true});
	            $('.money2').mask("#.##0,00", {reverse: true, maxlength: false});
	            $('.ip_address').mask('0ZZ.0ZZ.0ZZ.0ZZ', {translation: {'Z': {pattern: /[0-9]/, optional: true}}});
	            $('.ip_address').mask('099.099.099.099');
	            $('.percent').mask('##0,00%', {reverse: true});
	            $('.clear-if-not-match').mask("00/00/0000", {clearIfNotMatch: true});
	            $('.placeholder').mask("00/00/0000", {placeholder: "__/__/____"});
	            
	            var editor = new Behave({
	    			
					textarea: 		document.getElementById('demo'),
					replaceTab: 	true,
				    softTabs: 		true,
				    tabSize: 		4,
				    autoOpen: 		true,
				    overwrite: 		true,
				    autoStrip: 		true,
				    autoIndent: 	true
				});
	            
	            this.editor = editor;
	            
	            $('form').idealforms({
	            	  onSubmit: function(invalid, e) {
	            	    e.preventDefault();

	            	    if (invalid) {
	            	      alert(invalid +' fields!');
	            	    } else {
	            	      $.post('form.php', this.$form.serialize(), function(response) {  
	            	        // do something with response
	            	      }, 'json');
	            	    }    
	            	  }
	            });
	            
	            $('#my-select').multiSelect();
	            
			},
			onClose: function(){
				this.editor.destroy()
			}
		});

		form.uploaderView = Marionette.ItemView.extend({
			template : _.template('<div id="fine-uploader"></div>'),
			onShow : function() {
				$('#fine-uploader').fineUploader({
					request : {
						endpoint : 'fineuploader.php'
					}
				});
			}
		});

		form.citiesView = Marionette.ItemView.extend({
			template : citiesTpl,
			onShow : function() {
				var xhr;
				var select_state, $select_state;
				var select_city, $select_city;

				$select_state = $('#select-state').selectize({
					onChange : function(value) {
						if (!value.length)
							return;
						select_city.disable();
						select_city.clearOptions();
						select_city.load(function(callback) {
							xhr && xhr.abort();
							xhr = $.ajax({
								url : 'http://www.corsproxy.com/api.sba.gov/geodata/primary_city_links_for_state_of/' + value + '.json',
								success : function(results) {
									select_city.enable();
									callback(results);
								},
								error : function() {
									callback();
								}
							})
						});
					}
				});

				$select_city = $('#select-city').selectize({
					valueField : 'name',
					labelField : 'name',
					searchField : [ 'name' ]
				});

				select_city = $select_city[0].selectize;
				select_state = $select_state[0].selectize;

				select_city.disable();
				require([ 'apps/form/pickdateDemo' ], function(run) {
					run()
				});
				require([ 'apps/form/editable' ], function(run) {
					run()
				})
			}
		});

		form.parsleyView = Marionette.ItemView.extend({
			template : parsleyTpl,
			onShow : function() {
				$.listen('parsley:field:validate', function() {
					validateFront();
				});

				$('#demo-form .btn').on('click', function() {
					$('#demo-form').parsley().validate();
					validateFront();
				});

				var validateFront = function() {
					if (true === $('#demo-form').parsley().isValid()) {
						$('.bs-callout-info').removeClass('hidden');
						$('.bs-callout-warning').addClass('hidden');
					} else {
						$('.bs-callout-info').addClass('hidden');
						$('.bs-callout-warning').removeClass('hidden');
					}
				};
			}
		});

		form.mainView = new form.MainView;

		form.controller = {
			show : function() {
				App.navigate("form");
				App.mainRegion.show(form.mainView);
			},
			showParsley : function() {
				form.mainView.content.show(new form.parsleyView)
			},
			showuploader : function() {
				form.mainView.content.show(new form.uploaderView)
			},
			showcities : function() {
				form.mainView.content.show(new form.citiesView)
			},
			showat : function() {
				form.mainView.content.show(new form.atView)
			},
			showsignup: function(){
				form.mainView.content.show(new form.signupView)
			},
			showchained: function(){
				form.mainView.content.show(new form.chainedView)
			},
			showprogress: function(){
				form.mainView.content.show(new form.progressView)
			},
			showcube: function(){
				form.mainView.content.show(new form.cubeView)
			},
			showvelocity: function(){
				form.mainView.content.show(new form.velocityView)
			},
			showfontsize: function(){
				form.mainView.content.show(new form.fontsizeView)
			},
			showmatter: function(){
				form.mainView.content.show(new form.matterView)
			},
			showcanvas: function(){
				form.mainView.content.show(new form.canvasView)
			},
			showdoughnutChart: function(){
				form.mainView.content.show(new form.doughnutChartView)
			},
			showsvg: function(){
				form.mainView.content.show(new form.svgView)
			},
			showwebcom: function(){
				form.mainView.content.show(new form.webcomView)
			},
			showslider: function(){
				form.mainView.content.show(new form.sliderView)
			},
			showtriangle: function(){
				form.mainView.content.show(new form.triangleView)
			},
			showmenu: function(){
				form.mainView.content.show(new form.menuView)
			},
			showtable: function(){
				form.mainView.content.show(new form.tableView)
			},
			showmutation: function(){
				form.mainView.content.show(new form.mutationView)
			}
		}

		App.on("form:show", function() {
			form.controller.show();
		});

		form.Router = Marionette.AppRouter.extend({
			appRoutes : {
				"form" : "show",
				'form/parsley' : 'showParsley',
				'form/fineuploader' : 'showuploader',
				'form/cities' : 'showcities',
				'form/at' : 'showat',
				'form/signup' : 'showsignup',
				'form/chained' : 'showchained',
				'form/progress' : 'showprogress',
				'form/cube' : 'showcube',
				'form/velocity' : 'showvelocity',
				'form/fontsize' : 'showfontsize',
				'form/matter' : 'showmatter',
				'form/canvas' : 'showcanvas',
				'form/doughnutChart' : 'showdoughnutChart',
				'form/svg' : 'showsvg',
				'form/webcom' : 'showwebcom',
				'form/slider' : 'showslider',
				'form/triangle' : 'showtriangle',
				'form/menu' : 'showmenu',
				'form/table' : 'showtable',
				'form/mobserver' : 'showmutation',
			}
		});

		App.addInitializer(function() {
			new form.Router({
				controller : form.controller
			});
		});
	});
	return App.form.controller;
})