/*
	h2. Mooniform
	
	A MooTools implementation of Pixelmatrix Design's jQuery plugin
	Uniform.
	
	A more-or-less direct port of Uniform v1.5

	Mooniform uses the exact same CSS and image sprite files as Uniform.
	
	<pre>Element.mooniform( [options] )</pre>
	<pre>Elements.mooniform( [options] )</pre>

	Usage:

	<pre>	
	document.addEvent( 'domready', function() {
		$$( 'select, input[type=checkbox], input[type=radio], input[type=file]' ).mooniform();
	});
	</pre>
	
	Mooniform doesn't automatically know when you've updated a value by means
	other than direct select (i.e. you've changed the value with some 
	javascript). In that case you'll need to call the 'updateAll' static:
	
	<pre>
	function() {
		$('foo').value = 'Bark';
		Mooniform.updateAll();
	}
	</pre>

	Options:
	 - selectClass (string) class for select boxes
	 - radioClass (string) class for radio inputs
	 - checkboxClass (string) class for checkbox inputs
	 - fileClass (string) class for file inputs
	 - filenameClass (string) class for filename descriptor
	 - fileBtnClass (string) class for add file button
	 - fileDefaultText (string) default text for file box
	 - fileBtnText (string) text for add file button
	 - checkedClass (string) checked class for radios and checkboxes
	 - focusClass (string) focused class
	 - disabledClass (string) disabled class
	 - activeClass (string) active class
	 - hoverClass (string) hover class
	 - useID (bool) attach element ID to styled container
	 - idPrefix (string) prefix text for IDs when above flag is true
	
	Class Methods:
	 - void updateAll( void ) - Updates value and state of all styled elements
	 - void resetAll( void ) - Resets value and state back to default
	
	Instance Methods:
	 - void stylize( void ) - Style element, attach proper events
	 - void update( void ) - Update value and state
	 - void reset( void ) - Reset to default value and state
	
	Disabling text selection is based on jQuery noSelect plugin by
	Mathias Bynens <http://mathiasbynens.be/>
	<http://github.com/mathiasbynens/noSelect-jQuery-Plugin>

	Uniform is Copyright 2009 Josh Pyles / Pixelmatrix Design LLC
	http://pixelmatrixdesign.com
	
	Mooniform is Copyright 2010 The State News, INC
	http://statenews.com

	Requires: Mootools 1.2.4+	

	Author: mike joseph <josephm5@msu.edu>

	License:
	MIT License - http://www.opensource.org/licenses/mit-license.php

*/
(function() {

	Mooniform = {
	
		_elements: [],
		
		updateAll: function() {
			this._elements.each( function(el) {
				el.retrieve( 'mooniform' ).update();
			});
		},
		
		resetAll: function() {
			this._elements.each( function(el) {
				el.retrieve( 'mooniform' ).reset();
			});
		},
		
		mooniform: new Class({
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
			
			_type: false,
			
			_options: $H({}),
			
			_element: false,
			
			_supportOpacity: true,
			
			_defaultState: {
				disabled: 	false,
				value:		false,
				checked:	false
			},
			
			initialize: function() {
				
				if( arguments[1] ) {
					this._options = $H(arguments[1]).combine( this._defaults );
				} else {
					this._options = this._defaults;
				}
				
				if( arguments[0] ) {
					this._element = $( arguments[0] );
				}
				
				Mooniform._elements.push( this._element );
				
				this._defaultState = {
					'disabled': this._element.get( 'disabled' ),
					'value': this._element.get( 'value' ),
					'checked': this._element.get( 'checked' )
				};
				
				this.styleize();
			},
			
			
			styleize: function() {
				var element = this._element;
				if( arguments[0] ) {
					element = $(arguments[0]);
				}
				
				if( element.get( 'tag' ) == 'select' ) {
					this._select( element );
					this._type = 'select';
				} else if( element.get( 'tag' ) == 'input' ) {
					switch( element.get( 'type' ) ) {
						case 'file':
							this._file( element );
							this._type = 'file';
							break;
						case 'checkbox':
							this._checkbox( element );
							this._type = 'checkbox';
							break;
						case 'radio':
							this._radio( element );
							this._type = 'radio';
							break;
					}
				}	
				
			},
			
			update: function() {
				switch( this._type ) {
					case 'select':
					case 'file':
						this._element.fireEvent( 'change' );
						break;
					case 'checkbox':
					case 'radio':
//						this._element.fireEvent( 'click' );
						if( !this._element.get('checked') ) {
							this._element.getParent().removeClass(
								this._options.get('checkedClass'));
						} else {
							this._element.getParent().addClass(
								this._options.get('checkedClass'));
						}
						break;
				}
				
								
				if( this._element.get( 'disabled' ) ) {
					this._element.getParents( 'div' )[0].addClass( 
						this._options.get( 'disabledClass' ) );
				} else {
					this._element.getParents( 'div' )[0].removeClass( 
						this._options.get( 'disabledClass' ) );
				}
				
			},
			
			reset: function() {
			
				if( this._defaultState.value ) {
					this._element.set( 'value', this._defaultState.value );
				}
				
				if( this._defaultState.disabled ) {
					this._element.set( 'disabled', true );
				} else {
					this._element.set( 'disabled', false );
				}
				
				if( this._defaultState.checked ) {
					this._element.set( 'checked', true );
				} else {
					this._element.set( 'checked', false );
				}
				
				this.update();
			
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
						var name = '';
						if( !el.get( 'value' ) ) {
							name = obj._options.get( 'fileDefaultText' );
						} else {
							name = el.get( 'value' ).split( /[\/\\]+/ );
							name = name[(name.length-1)];
						}
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
	
		})
	};

	Element.implement({
		mooniform: function() {
			var opts = {};
			if( arguments[0] ) {
				opts = arguments[0];
			}
			this.store( 'mooniform', new Mooniform.mooniform( this, opts ) );
			return this;
		}
	});

})();