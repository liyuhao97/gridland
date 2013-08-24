define([ 'jquery', 'app/events', 'app/graphics' ], function($, Events, Graphics) {
	
	var entity = function(options) {
		
		this.options = $.extend({
			className: "blank",
			animationFrames: 4,
			speed: 40
		}, options);
		
		this.frame = 0;
		this.animationRow = 0;
		this.tempAnimation = null;
		
		/**
		 * Gets the html element for this Entity, creating it if necessary
		 */
		
	};
	
	entity.prototype.el = function() {
		if(this._el == null) {
			this._el = $('<div>').addClass(this.options.className);
		}
		return this._el;
	};
	
	/**
	 * Gets or sets the velocity
	 */
	entity.prototype.v = function(param) {
		if (param != null) {
			this._velocity = param;
		}
		return this._velocity;
	};

	/**
	 * Gets or sets the position
	 */
	entity.prototype.p = function(param) {
		if (param != null) {
			this._position = param;
		}
		return this._position;
	};

	entity.prototype.destroy = function() {
		this.destroyed = true;
		Events.trigger(this, "EntityDestroyed");
	};
	
	entity.prototype.animate = function() {
		if(++this.frame >= this.options.animationFrames) {
			this.frame = 0;
			if(this.tempAnimation != null) {
				this.tempAnimation = null;
			}
		}
		Graphics.updateSprite(this);
	};
	
	entity.prototype.animation = function(row) {
		this.animationRow = row;
		this.frame = 0;
		Graphics.updateSprite(this);
	};
	
	entity.prototype.animationOnce = function(row) {
		this.tempAnimation = row;
		this.frame = 0;
		Graphics.updateSprite(this);
	};

	return entity;
});