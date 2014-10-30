define([ 'app', 
         'dropzone',
         'drap-drop',
         'tpl!apps/bootstrap/main.tpl', 'tpl!apps/bootstrap/wysiwyg.tpl', 
         'stache!apps/bootstrap/stickyfooter', 'stache!apps/bootstrap/modal', 'stache!apps/bootstrap/lightbox', 
         'stache!apps/bootstrap/select', 
         'stache!apps/bootstrap/select2', 
         'stache!apps/bootstrap/responsivetabs', 
         'stache!apps/bootstrap/collapse', 
         'stache!apps/bootstrap/carousel', 
         'stache!apps/bootstrap/wizard',
         'stache!apps/bootstrap/contextmenu',
         'stache!apps/bootstrap/tree',
         'stache!apps/bootstrap/bootstrap-tree',
         'stache!apps/bootstrap/dropzone',
         'stache!apps/bootstrap/dragdrop',
         'stache!apps/bootstrap/checkboxtree',
         'css!apps/bootstrap/style', 'bootstrap/bootstrap-wysiwyg', 'bootstrap/bootstrap', 'bootstrap/bootstrap-select', 
         'bootstrap/bootstrap-modalmanager', 'bootstrap/bootstrap-lightbox', 'select2', 'jquery.bootstrap.wizard',
         'bootstrap/bootstrap-contextmenu', 'bootstrap/bootstrap-tree/js/bootstrap-tree', 'bootstrap-checkbox-tree', 'jquery.collapsible', 'jquery.jstree'
         ,'SyntaxHighlighter'
         ], 
         function(App, Dropzone, DragDrop,
        		 mainTpl, wysiwygTpl, stickyfooter, modalTpl, lightboxTpl, selectTpl, select2Tpl,  
        		 responsivetabsTpl, collapseTpl, carouselTpl, wizardTpl, contextmenuTpl, treeTpl, bootstrapTreeTpl, dropzoneTpl, dragdropTpl,
        		 checkboxtreeTpl) {
	App.module('bootstrapdemo', function(bootstrapdemo, App, Backbone, Marionette, $, _) {
		
		  function setupExampleCode(id) {
              var s = $("#script_"+id).html();
              s = s.replace(/</g, "&lt;");
              s = s.substr(s.indexOf("\n") + 1);
              s = s.substr(s.indexOf("\n") + 1);
              s = s.substr(0, s.lastIndexOf("\n"));
              s = s.substr(0, s.lastIndexOf("\n"));
              $("#code_"+id).html(s);
          }
		  
		  function setupPrettyPrint(){
				$('[data-source]').each(function() {
					var $this = $(this), $source = $($this.data('source'));

					var text = [];
					$source.each(function() {
						var $s = $(this);
						if ($s.attr('type') == 'text/javascript') {
							text.push($s.html().replace(/(\n)*/, ''));
						} else {
							text.push($s.clone().wrap('<div>').parent().html());
						}
					});

					$this.text(text.join('\n\n').replace(/\t/g, '    '));
				});

				prettyPrint();
		  }
		  
		bootstrapdemo.collapseView = Marionette.ItemView.extend({
			template : collapseTpl,
			onShow: function(){
				$('#accordion').carousel();
				setupPrettyPrint();
			}
		});
		
		bootstrapdemo.dropzoneView = Marionette.ItemView.extend({
			template : dropzoneTpl,
			onShow: function(){
				Dropzone.discover();
			}
		});
		
		bootstrapdemo.checkboxtreeView = Marionette.ItemView.extend({
			template : checkboxtreeTpl,
			onShow: function(){
				 var cbTree = $('.checkbox-tree').checkboxTree({
				      checkChildren : true,
				      singleBranchOpen: true,
				      openBranches: ['.liverpool', '.chelsea']
				    });
				    $('#tree-expand').on('click', function(e) {
				      cbTree.expandAll();
				    });
				    $('#tree-collapse').on('click', function(e) {
				      cbTree.collapseAll();
				    });
				    $('#tree-default').on('click', function(e) {
				      cbTree.defaultExpand();
				    });
				    $('#tree-select-all').on('click', function(e) {
				      cbTree.checkAll();
				    });
				    $('#tree-deselect-all').on('click', function(e) {
				      cbTree.uncheckAll();
				    });
				    $('.checkbox-tree').on('checkboxTicked', function(e) {
				      var checkedCbs = $(e.currentTarget).find("input[type='checkbox']:checked");
				      console.log('checkbox tick', checkedCbs.length);
				    });
			}
		});
		
		bootstrapdemo.dragdropView = Marionette.ItemView.extend({
			template : dragdropTpl,
			onShow: function(){
				var dragMe = document.getElementById('dragMe');
				var withMe = document.getElementById('withMe');
				
				var shouldntHappen = function() {
					console.log('THIS SHOULDN\'T HAPPEN');
				};
				
				
				var dragRef = DragDrop.bind(dragMe, {
					anchor: withMe,
					boundingBox: 'offsetParent',
					dragstart: function(evt) {
						console.log('DragDrop.bind dragstart', evt);
					},
					drag: function(evt) {
						console.log('DragDrop.bind drag', evt);
					},
					dragend: function(evt) {
						console.log('DragDrop.bind dragend', evt);
					}
				});

				
				dragRef.bindEvent('dragstart', function(evt) {
					console.log('DragDrop.bindEvent dragstart', evt);
				});
				dragRef.bindEvent('drag', function(evt) {
					console.log('DragDrop.bindEvent drag', evt);
				});
				dragRef.bindEvent('dragend', function(evt) {
					console.log('DragDrop.bindEvent dragend', evt);
				});

				
				dragRef.bindEvent('dragstart', shouldntHappen);
				dragRef.unbindEvent('dragstart', shouldntHappen);
				
				dragRef.bindEvent('drag', shouldntHappen);
				dragRef.unbindEvent('drag', shouldntHappen);
				
				dragRef.bindEvent('dragend', shouldntHappen);
				dragRef.unbindEvent('dragend', shouldntHappen);
			}
		});
		
		bootstrapdemo.bootstraptreeView = Marionette.ItemView.extend({
			template : bootstrapTreeTpl,
			onShow: function(){
				$('.tree > ul').attr('role', 'tree').find('ul').attr('role', 'group');
				$('.tree').find('li:has(ul)').addClass('parent_li').attr('role', 'treeitem').find(' > span').attr('title', 'Collapse this branch').on('click', function (e) {
			        var children = $(this).parent('li.parent_li').find(' > ul > li');
			        if (children.is(':visible')) {
			    		children.hide('fast');
			    		$(this).attr('title', 'Expand this branch').find(' > i').addClass('icon-plus-sign').removeClass('icon-minus-sign');
			        }
			        else {
			    		children.show('fast');
			    		$(this).attr('title', 'Collapse this branch').find(' > i').addClass('icon-minus-sign').removeClass('icon-plus-sign');
			        }
			        e.stopPropagation();
			    });
			      $(".collap").collapsible();
			      $(".startClosed").collapsible({collapsed: true});
			  	$("#container .source").each(function () {
					var code = $(this).html().replace(/</g,'&lt;').replace(/>/g,'&gt;'),
						div  = $('<div class="code"><pre class="brush:' + ( $(this).is("script") ? 'js' : 'xml' ) + ';">' + code + '</pre></div>'),
						demo = $(this).prevAll(".demo:eq(0)");
					if($(this).nextAll('div.code').length == 0){
						$(this).after(div);
					}
				});
				SyntaxHighlighter.highlight();
			}
		});
		
		bootstrapdemo.treeView = Marionette.ItemView.extend({
			template : treeTpl,
			onShow: function(){

				  $("body").on("nodeselect.tree.data-api", "[role=leaf]", function (e) {
				    
				    var output = "<p>Node <b>nodeselect</b> event fired:<br>"
				      + "Node Type: leaf<br>"
				      + "Value: " + ((e.node.value) ? e.node.value : e.node.el.text()) + "<br>"
				      + "Parentage: " + e.node.parentage.join("/") + "</p>"
				      
				      $('div#reporter').prepend(output)
				    
				  })
				  

				  $("body").on("nodeselect.tree.data-api", "[role=branch]", function (e) {
				    
				    var output = "<p>Node <b>nodeselect</b> event fired:<br>"
				      + "Node Type: branch<br>"
				      + "Value: " + ((e.node.value) ? e.node.value : e.node.el.text()) + "<br>"
				      + "Parentage: " + e.node.parentage.join("/") + "</p>"
				      
				      $('div#reporter').prepend(output)
				    
				  })
				  

				  $("body").on("openbranch.tree", "[data-toggle=branch]", function (e) {
				    
				    var output = "<p>Node <b>openbranch</b> event fired:<br>"
				      + "Node Type: branch<br>"
				      + "Value: " + ((e.node.value) ? e.node.value : e.node.el.text()) + "<br>"
				      + "Parentage: " + e.node.parentage.join("/") + "</p>"
				      
				      $('div#reporter').prepend(output)
				      
				  })
				  

				  $("body").on("closebranch.tree", "[data-toggle=branch]", function (e) {
				    
				    var output = "<p>Node <b>closebranch</b> event fired:<br>"
				      + "Node Type: branch<br>"
				      + "Value: " + ((e.node.value) ? e.node.value : e.node.el.text()) + "<br>"
				      + "Parentage: " + e.node.parentage.join("/") + "</p>"
				      
				      $('div#reporter').prepend(output)
				    
				  })
			}
		});
		
		bootstrapdemo.contextmenuView = Marionette.ItemView.extend({
			template : contextmenuTpl,
			onShow: function(){
				 // Demo 2
			      $('#main').contextmenu({
			          target: '#context-menu2',
			          before: function (e) {
			              // This function is optional.
			              // Here we use it to stop the event if the user clicks a span
			              e.preventDefault();
			              if (e.target.tagName == 'SPAN') {
			                  e.preventDefault();
			                  this.closemenu();
			                  return false;
			              }
			              this.getMenu().find("li").eq(2).find('a').html("This was dynamically changed");
			              return true;
			          }
			      });
			      // Demo 3
			      $('#context2').contextmenu({
			         target: '#context-menu2',
			         onItem: function(e, item) {
			           alert($(item).text());
			         }
			      });

				setupPrettyPrint();
			}
		});
		
		bootstrapdemo.wizardView = Marionette.ItemView.extend({
			template : wizardTpl,
			onShow: function(){
				var $validator = $("#commentForm").validate({
					rules : {
						emailfield : {
							required : true,
							email : true,
							minlength : 3
						},
						namefield : {
							required : true,
							minlength : 3
						},
						urlfield : {
							required : true,
							minlength : 3,
							url : true
						}
					}
				});

				$('#rootwizard').bootstrapWizard({
					'tabClass' : 'nav nav-pills',
					'onNext' : function(tab, navigation, index) {
						var $valid = $("#commentForm").valid();
						if (!$valid) {
							$validator.focusInvalid();
							return false;
						}
					}
				});
				window.prettyPrint && prettyPrint()
			}
		});
		
		bootstrapdemo.carouselView = Marionette.Layout.extend({
			template : carouselTpl,
			onShow: function(){
				$('.carousel').carousel({
					  interval: 2000
				});
				setupPrettyPrint();
			}
		});

		bootstrapdemo.MainView = Marionette.Layout.extend({
			template : mainTpl,
			regions : {
				content : '#bootstrap-demo'
			},
			onShow: function(){
				$('#header-region').hide();
			},
			onClose: function(){
				$('#header-region').show();
			}
		});

		bootstrapdemo.responsivetabsView = Marionette.Layout.extend({
			template : responsivetabsTpl,
			onShow: function(){
			      $('#myTab a').click(function (e) {
			          e.preventDefault()
			          $(this).tab('show')
			        });

			        $('#moreTabs a').click(function (e) {
			          e.preventDefault()
			          $(this).tab('show')
			        });
			}
		});

		bootstrapdemo.selectView = Marionette.Layout.extend({
			template : selectTpl,
			onShow : function() {
				$('.selectpicker').selectpicker({
					'selectedText' : 'cat'
				});
			}
		});
		
		bootstrapdemo.select2View = Marionette.Layout.extend({
			template : select2Tpl,
			onShow : function() {

	              var i, e;
	              for (i = 2; ; i++) {
	                  e = $("#script_e" + i);
	                  if (e.length == 0) break;
	                  setupExampleCode("e" + i);
	              }

	              prettyPrint();
	         }
		});

		bootstrapdemo.modalView = Marionette.Layout.extend({
			template : modalTpl,
			onShow : function() {
				setupPrettyPrint();
			}
		});

		bootstrapdemo.stickyFooterView = Marionette.ItemView.extend({
			template : stickyfooter,
		});

		bootstrapdemo.lightboxView = Marionette.ItemView.extend({
			template : lightboxTpl,
			onShow : function() {
				prettyPrint();
			}
		});

		bootstrapdemo.wysiwygView = Marionette.ItemView.extend({
			template : wysiwygTpl,
			onShow : function() {
				function initToolbarBootstrapBindings() {
					var fonts = [ 'Serif', 'Sans', 'Arial', 'Arial Black', 'Courier', 'Courier New', 'Comic Sans MS', 'Helvetica', 'Impact', 'Lucida Grande', 'Lucida Sans', 'Tahoma', 'Times', 'Times New Roman', 'Verdana' ], fontTarget = $('[title=Font]').siblings('.dropdown-menu');
					$.each(fonts, function(idx, fontName) {
						fontTarget.append($('<li><a data-edit="fontName ' + fontName + '" style="font-family:\'' + fontName + '\'">' + fontName + '</a></li>'));
					});
					$('a[title]').tooltip({
						container : 'body'
					});
					$('.dropdown-menu input').click(function() {
						return false;
					}).change(function() {
						$(this).parent('.dropdown-menu').siblings('.dropdown-toggle').dropdown('toggle');
					}).keydown('esc', function() {
						this.value = '';
						$(this).change();
					});

					$('[data-role=magic-overlay]').each(function() {
						var overlay = $(this), target = $(overlay.data('target'));
						overlay.css('opacity', 0).css('position', 'absolute').offset(target.offset()).width(target.outerWidth()).height(target.outerHeight());
					});
					if ("onwebkitspeechchange" in document.createElement("input")) {
						var editorOffset = $('#bootstrap-container').offset();
						$('#voiceBtn').css('position', 'absolute').offset({
							top : editorOffset.top,
							left : editorOffset.left + $('#bootstrap-container').innerWidth() - 35
						});
					} else {
						$('#voiceBtn').hide();
					}
				}
				;
				function showErrorAlert(reason, detail) {
					var msg = '';
					if (reason === 'unsupported-file-type') {
						msg = "Unsupported format " + detail;
					} else {
						console.log("error uploading file", reason, detail);
					}
					$('<div class="alert"> <button type="button" class="close" data-dismiss="alert">&times;</button>' + '<strong>File upload error</strong> ' + msg + ' </div>').prependTo('#alerts');
				}
				;
				initToolbarBootstrapBindings();
				$('#bootstrap-container').wysiwyg({
					fileUploadError : showErrorAlert
				});
			}
		});
		var mainView = new bootstrapdemo.MainView();

		bootstrapdemo.controller = {
			show : function() {
				App.navigate("bootstrapdemo");
				App.mainRegion.show(mainView);
			},
			showWysiwyg : function() {
				App.navigate("bootstrap/wysiwyg");
				mainView.content.show(new bootstrapdemo.wysiwygView());
			},
			showStickyFooter : function() {
				App.navigate("bootstrap/stickyfooter");
				mainView.content.show(new bootstrapdemo.stickyFooterView());
			},
			showModal : function() {
				App.navigate("bootstrap/modal");
				mainView.content.show(new bootstrapdemo.modalView());
			},
			showLightbox : function() {
				App.navigate("bootstrap/lightbox");
				mainView.content.show(new bootstrapdemo.lightboxView());
			},
			showSelect : function() {
				App.navigate("bootstrap/select");
				mainView.content.show(new bootstrapdemo.selectView());
			},
			showSelect2 : function() {
				App.navigate("bootstrap/select2");
				mainView.content.show(new bootstrapdemo.select2View());
			},
			showResponsiveTabs : function() {
				App.navigate("bootstrap/responsivetabs");
				mainView.content.show(new bootstrapdemo.responsivetabsView());
			},
			showCollapse : function() {
				App.navigate("bootstrap/collapse");
				mainView.content.show(new bootstrapdemo.collapseView());
			},
			showCarousel : function() {
				App.navigate("bootstrap/carousel");
				mainView.content.show(new bootstrapdemo.carouselView());
			},
			showWizard : function() {
				App.navigate("bootstrap/wizard");
				mainView.content.show(new bootstrapdemo.wizardView());
			},
			showContextMenu : function() {
				App.navigate("bootstrap/contextmenu");
				mainView.content.show(new bootstrapdemo.contextmenuView());
			},
			showTree : function() {
				App.navigate("bootstrap/tree");
				mainView.content.show(new bootstrapdemo.treeView());
			},
			showDropZone : function() {
				App.navigate("bootstrap/dropzone");
				mainView.content.show(new bootstrapdemo.dropzoneView());
			},
			showBootStrapTree : function() {
				App.navigate("bootstrap/bootstrap-tree");
				mainView.content.show(new bootstrapdemo.bootstraptreeView());
			},
			showDragdrop : function() {
				App.navigate("bootstrap/dragdrop");
				mainView.content.show(new bootstrapdemo.dragdropView());
			},
			showCheckboxTree: function(){
				App.navigate("bootstrap/checkboxtree");
				mainView.content.show(new bootstrapdemo.checkboxtreeView());
			}
		}

		App.on("bootstrapdemo:show", function() {
			bootstrapdemo.controller.show();
		});

		bootstrapdemo.Router = Marionette.AppRouter.extend({
			appRoutes : {
				"bootstrapdemo" : "show",
				'bootstrap/wysiwyg' : 'showWysiwyg',
				'bootstrap/stickyfooter' : 'showStickyFooter',
				'bootstrap/modal' : 'showModal',
				'bootstrap/lightbox' : 'showLightbox',
				'bootstrap/select' : 'showSelect',
				'bootstrap/select2' : 'showSelect2',
				'bootstrap/responsivetabs' : 'showResponsiveTabs',
				'bootstrap/collapse' : 'showCollapse',
				'bootstrap/carousel' : 'showCarousel',
				'bootstrap/wizard' : 'showWizard',
				'bootstrap/contextmenu' : 'showContextMenu',
				'bootstrap/tree' : 'showTree',
				"bootstrap/bootstrap-tree": 'showBootStrapTree',
				'bootstrap/dropzone' : 'showDropZone',
				'bootstrap/dragdrop' : 'showDragdrop',
				'bootstrap/checkboxtree' : 'showCheckboxTree',
			}
		});

		App.addInitializer(function() {
			new bootstrapdemo.Router({
				controller : bootstrapdemo.controller
			});
		});
	});
	return App.bootstrapdemo.controller;
})