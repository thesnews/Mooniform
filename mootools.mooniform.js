/*
	Mooniform
	
	A MooTools implementation of Pixelmatrix Design's jQuery plugin
	Uniform.
	
	A more-or-less direct port of Uniform v1.5

	Mooniform uses the exact same CSS and image sprite files as Uniform.
	
	Uniform is Copyright 2009 Josh Pyles / Pixelmatrix Design LLC
	http://pixelmatrixdesign.com
	
	Mooniform is Copyright 2010 The State News, INC
	http://statenews.com

	Requires: Mootools 1.2.4+	

	Author: mike joseph <josephm5@msu.edu>

	License:
	MIT License - http://www.opensource.org/licenses/mit-license.php

	Usage:

	document.addEvent( 'domready', function() {
		new Mooniform( 'select, input[type=checkbox], input[type=radio], input[type=file]' );
	});
	
*/
(function() {

	Mooniform = new Class({
	
		_defaults: $H({
			selectClass:	'selector',
			radioClass:		'radio',
			checkboxClass:	'checker',
			fileClass:		'uploader',
			filenameClass:	'filename',
			fileBtnClass:	'action',
			fileDefaultText:'No file selected',
			fileBtnText:	'Choose File',
			checkedClass:	'checked',
			focusClass:		'focus',
			disabledClass:	'disabled',
			activeClass:	'active',
			hoverClass:		'hover',
			useID:			true,
			idPrefix:		'mooniform',
			resetSelector:	false
		}),
		
		_options: $H({}),
		
		_elements: [],
		
		_supportOpacity: true,
		
		initialize: function() {
			
			if( arguments[1] ) {
				this._options = $H(arguments[1]).combine( this._defaults );
			} else {
				this._options = this._defaults;
			}
			
			if( arguments[0] ) {
				this._elements = $$( arguments[0] );
			}
			
			this.styleize();
		},
		
		styleize: function() {
			var elements = this._elements;
			if( arguments[0] ) {
				elements = $$(arguments[0]);
			}
			
			elements.each( function(el) {
				if( el.get( 'tag' ) == 'select' ) {
					this._select( el );
				} else if( el.get( 'tag' ) == 'input' ) {
					switch( el.get( 'type' ) ) {
						case 'file':
							this._file( el );
							break;
						case 'checkbox':
							this._checkbox( el );
							break;
						case 'radio':
							this._radio( el );
							break;
					}
				}	
			
			}.bind( this ));
		},
		
		reset: function() {
		
		},
		
		_select: function( el ) {
			var div = new Element( 'div' ),
				span = new Element( 'span' );
			
			div.addClass( this._options.get( 'selectClass' ) );

			if( this._options.get( 'useID' ) && el.get( 'id' ) ) {
				div.set( 'id', this._options.get( 'idPrefix' ) + '-' +
					el.get( 'id' ) );
			}
			
			if( el.getSelected().length ) {			
				span.set( 'text', el.getSelected()[0].get( 'text' ) );
			} else {
				span.set( 'text', el.getChildren()[0].get( 'text' ) );
			}
      
			el.setStyle( 'opacity', 0.01 );
			
			div.wraps( el );

			span.inject( div, 'top' );

      		var obj = this;

			el.addEvents({
				'change': function() {
					span.set( 'text', el.getSelected()[0].get( 'text' ) );
					div.removeClass( obj._options.get( 'activeClass' ) );
				},
				'focus': function() {
					div.addClass( obj._options.get( 'focusClass' ) );
				},
				'blur': function() {
					div.removeClass( obj._options.get( 'focusClass' ) );
					div.removeClass( obj._options.get( 'activeClass' ) );
				},
				'mousedown': function() {
					
					div.addClass( obj._options.get( 'activeClass' ) );
				},
				'mouseup': function() {
					div.removeClass( obj._options.get( 'activeClass' ) );
				},
				'click': function() {
					div.removeClass( obj._options.get( 'activeClass' ) );
				},
				'hover': function() {
					div.addClass( obj._options.get( 'hoverClass' ) );
				},
				'keyup': function() {
					span.set( 'text', el.getSelected()[0].get( 'text' ) );
				}
			});
			
			if( el.get( 'disabled' ) ) {
				div.addClass( this._options.get( 'disabledClass' ) );
			}

			this._noSelect( span );
		},
		
		_file: function( el ) {
		
			var div = new Element( 'div' ),
				span = new Element( 'span' ),
				button = new Element( 'span' );
				
			span.set( 'text', this._options.get( 'fileDefaultText' ) );
			button.set( 'text', this._options.get( 'fileBtnText' ) );
		
			div.addClass( this._options.get( 'fileClass' ) );
			span.addClass( this._options.get( 'filenameClass' ) );
			button.addClass( this._options.get( 'fileBtnClass' ) );

			if( this._options.get( 'useID' ) && el.get( 'id' ) ) {
				div.set( 'id', this._options.get( 'idPrefix' ) + '-' +
					el.get( 'id' ) );
			}

			div.wraps( el );
			button.inject( el, 'after' );
			span.inject( el, 'after' )

			if( !el.get( 'size' ) ) {
				el.set( 'size', div.getCoordinates().width/10 );
			}

			el.setStyle( 'opacity', 0.01 );

			var obj = this;

			el.addEvents({
				'focus': function() {
					div.addClass( obj._options.get( 'focusClass' ) );
				},
				'blur': function() {
					div.removeClass( obj._options.get( 'removeClass' ) );
				},
				'change': function() {
					var name = el.get( 'value' ).split( /[\/\\]+/ );
					name = name[(name.length-1)];
					span.set( 'text', name );
				},
				'mousedown': function() {
					if( el.get( 'disabled' ) ) {
						return;
					}
					div.addClass( obj._options.get( 'activeClass' ) );
				},
				'mouseup': function() {
					div.removeClass( obj._options.get( 'activeClass' ) );
				},
				'mouseenter': function() {
					div.addClass( obj._options.get( 'hoverClass' ) );
				},
				'mouseleave': function() {
					div.removeClass( obj._options.get( 'hoverClass' ) );
				}
			});
			
			if( el.get( 'disabled' ) ) {
				div.addClass( this._options.get( 'disabledClass' ) );
			}
			
			this._noSelect( span );
			this._noSelect( button );
		},
		
		_checkbox: function( el ) {
		
			var div = new Element( 'div' ),
				span = new Element( 'span' );
		
			
			div.addClass( this._options.get( 'checkboxClass' ) );

			if( this._options.get( 'useID' ) && el.get( 'id' ) ) {
				div.set( 'id', this._options.get( 'idPrefix' ) + '-' +
					el.get( 'id' ) );
			}

			div.wraps( el );
			span.wraps( el );

			el.setStyle( 'opacity', 0.01 );
			
			var obj = this;
			el.addEvents({
				'focus': function() {
					div.addClass( obj._options.get( 'focusClass' ) );
				},
				'blur': function() {
					div.removeClass( obj._options.get( 'focusClass' ) );
				},
				'click': function() {
					if( !this.get( 'checked' ) ) {
						span.removeClass( obj._options.get( 'checkedClass' ) );
					} else {
						span.addClass( obj._options.get( 'checkedClass' ) );
					}
				},
				'mousedown': function() {
					div.addClass( obj._options.get( 'activeClass' ) );
				},
				'mouseup': function() {
					div.removeClass( obj._options.get( 'activeClass' ) );
				},
				'mouseenter': function() {
					div.addClass( obj._options.get( 'hoverClass' ) );
				},
				'mouseleave': function() {
					div.removeClass( obj._options.get( 'hoverClass' ) );
				}
			});

			if( el.get( 'checked' ) ) {
				span.addClass( this._options.get( 'checkedClass' ) );
			}

			if( el.get( 'disabled' ) ) {
				div.addClass( this._options.get( 'disabledClass' ) );
			}

      	},
		
		_radio: function( el ) {
			var div = new Element( 'div' ),
				span = new Element( 'span' );

			div.addClass( this._options.get( 'radioClass' ) );
			span.set( 'name', el.get( 'name' ) );
			
			if( this._options.get( 'useID' ) && el.get( 'id' ) ) {
				div.set( 'id', this._options.get( 'idPrefix' ) + '-' +
					el.get( 'id' ) );
			}

			
			div.wraps( el );
			span.wraps( el );

			el.setStyle( 'opacity', 0.01 );
			
			var obj = this;
			el.addEvents({
				'focus': function() {
					div.addClass( obj._options.get( 'focusClass' ) );
				},
				'blur': function() {
					div.removeClass( obj._options.get( 'focusClass' ) );
				},
				'click': function() {
					$$('.' + obj._options.get( 'radioClass' ) + ' span.'+
						obj._options.get( 'checkedClass' ) + '[name=' +
						this.get( 'name' ) + ']').removeClass(
							obj._options.get( 'checkedClass' )
						);
					span.addClass( obj._options.get( 'checkedClass' ) );
				},
				'mousedown': function() {
					if( this.get( 'disabled' ) ) {
						return;
					}
					
					div.addClass( obj._options.get( 'activeClass' ) );
				},
				'mouseup': function() {
					div.removeClass( obj._options.get( 'activeClass' ) );
				},
				'mouseenter': function() {
					div.addClass( obj._options.get( 'hoverClass' ) );
				},
				'mouseleave': function() {
					div.removeClass( obj._options.get( 'hoverClass' ) );
				}
			});

			if( el.get( 'checked' ) ) {
				span.addClass( this._options.get( 'checkedClass' ) );
			}
			
			if( el.get( 'disabled' ) ) {
				div.addClass( this._options.get( 'disabledClass' ) );
			}

		},
	
		_noSelect: function( el ) {
			el.onselectstart = this.ontragstart = $lambda( false );
			el.addEvent( 'mousedown', $lambda( false ) );
			el.setStyle( '-moz-user-select', 'none' );
		}

	});

})();