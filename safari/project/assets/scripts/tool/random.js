var ns = require('safariNamingSpace');

ns.Random = cc.Class({
    name:"Random",

    properties: {
        /**
         * Upper 32-bit of the seed.
         * @private
         * @type {Number}
         */
        _seedHi: 0,

        /**
         * Lower 32-bit of the seed.
         * @private
         * @type {Number}
         */
        _seedLo: 0
    },

    /**
     * Constructor
     * @classdesc PRNG implementing a XORShift generator.
     * @constructs
     * @param {Array} seed - Two-element array, with the low 32-bit in first place, and the high 32-bit in second place.
     */
    ctor: function (seed = 0) {
        this._seedLo = seed & 0x0000ffff;
        this._seedHi = seed & 0xffff0000;
     },

    /**
     * Generate the next 32-bit number and update the seed.
     * @protected
     * @returns {Number}
     */
    _next: function () {
        this._seedHi ^= (this._seedHi << 21) | (this._seedLo >>> 11);
        this._seedLo ^= this._seedLo << 21;
        this._seedLo ^= this._seedHi >>> 3;
        this._seedHi ^= (this._seedHi << 4) | (this._seedLo >>> 28);
        this._seedLo ^= this._seedLo << 4;
        return this._seedLo;
    },

    /**
     * Get a random integer between 0 (inclusive) and <i>bound</i> (exclusive).
     * @param {Number} bound - Upper limit of the random.
     * @returns {Number}
     */
    nextInt: function (bound) {
        if (bound <= 0) {
            throw new Error("bound must be positive");
        }
        // apply bound twice to fix JavaScript modulo bug
        return (this._next() % bound + bound) % bound;
    },

    /**
     * Get a random boolean value.
     * @returns {Boolean}
     */
    nextBoolean: function() {
        return this.nextInt(2) != 0;
    },

    /**
     * Get a random floating-point number between 0 (inclusive) and 1 (exclusive).
     * @returns {Number}
     */
    nextFloat: function() {
        return (this._next() & 0xffffff) / (1 << 24);
    }
});

module.exports = ns.Random;
