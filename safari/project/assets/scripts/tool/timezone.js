var ZONE_DATA = {
    "America/Los_Angeles":"America/Los_Angeles|PST PDT PWT PPT|80 70 70 70|010102301010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010|-261q0 1nX0 11B0 1nX0 SgN0 8x10 iy0 5Wp1 1VaX 3dA0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1a00 1fA0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1fz0 1cN0 1cL0 1cN0 1cL0 s10 1Vz0 LB0 1BX0 1cN0 1fz0 1a10 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1fz0 1a10 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0|15e6",
};

var AMERICA_LOS_ANGELES = 'America/Los_Angeles';

module.exports = {
    /**
     * get LA timezone offset
     * daylight saving included.
     * @return {Number} in milliseconds
     */
    getZoneOffset:function(utc){
        var _z = getZone(AMERICA_LOS_ANGELES);
        var offset;
        if(_z){
            offset = _z.offset(utc);
            return offset * 60000;
        }
        return 0;
    }
};

function getZone(key){
    var _z = ZONE_DATA[key];
    if(_z instanceof Zone){
        return _z;
    }

    if(typeof _z === 'string'){
        _z = new Zone(_z);
        ZONE_DATA[key] = _z;
        return _z;
    }
    
    return null;
};

function unpack (string) {
    var data = string.split('|'),
        offsets = data[2].split(' '),
        indices = data[3].split(''),
        untils  = data[4].split(' ');

    arrayToInt(offsets);
    arrayToInt(indices);
    arrayToInt(untils);

    intToUntil(untils, indices.length);

    return {
        name       : data[0],
        abbrs      : mapIndices(data[1].split(' '), indices),
        offsets    : mapIndices(offsets, indices),
        untils     : untils,
        population : data[5] | 0
    };
};

function arrayToInt (array) {
    for (var i = 0; i < array.length; i++) {
        array[i] = unpackBase60(array[i]);
    }
};

function intToUntil (array, length) {
    for (var i = 0; i < length; i++) {
        array[i] = Math.round((array[i - 1] || 0) + (array[i] * 60000)); // minutes to milliseconds
    }

    array[length - 1] = Infinity;
};

function mapIndices (source, indices) {
    var out = [], i;

    for (i = 0; i < indices.length; i++) {
        out[i] = source[indices[i]];
    }

    return out;
};

function unpackBase60(string) {
    var i = 0,
        parts = string.split('.'),
        whole = parts[0],
        fractional = parts[1] || '',
        multiplier = 1,
        num,
        out = 0,
        sign = 1;

    // handle negative numbers
    if (string.charCodeAt(0) === 45) {
        i = 1;
        sign = -1;
    }

    // handle digits before the decimal
    for (i; i < whole.length; i++) {
        num = charCodeToInt(whole.charCodeAt(i));
        out = 60 * out + num;
    }

    // handle digits after the decimal
    for (i = 0; i < fractional.length; i++) {
        multiplier = multiplier / 60;
        num = charCodeToInt(fractional.charCodeAt(i));
        out += num * multiplier;
    }

    return out * sign;
};

function charCodeToInt(charCode) {
    if (charCode > 96) {
        return charCode - 87;
    } else if (charCode > 64) {
        return charCode - 29;
    }
    return charCode - 48;
};
/************************************
    Zone object
************************************/

function Zone (packedString) {
    if (packedString) {
        this._set(unpack(packedString));
    }
}

Zone.prototype = {
    _set : function (unpacked) {
        this.name       = unpacked.name;
        this.abbrs      = unpacked.abbrs;
        this.untils     = unpacked.untils;
        this.offsets    = unpacked.offsets;
        this.population = unpacked.population;
    },

    _index : function (timestamp) {
        var target = +timestamp,
            untils = this.untils,
            i;

        for (i = 0; i < untils.length; i++) {
            if (target < untils[i]) {
                return i;
            }
        }
    },

    parse : function (timestamp) {
        var target  = +timestamp,
            offsets = this.offsets,
            untils  = this.untils,
            max     = untils.length - 1,
            offset, offsetNext, offsetPrev, i;

        for (i = 0; i < max; i++) {
            offset     = offsets[i];
            offsetNext = offsets[i + 1];
            offsetPrev = offsets[i ? i - 1 : i];

            if (offset < offsetNext) {
                offset = offsetNext;
            } else if (offset > offsetPrev) {
                offset = offsetPrev;
            }

            if (target < untils[i] - (offset * 60000)) {
                return offsets[i];
            }
        }

        return offsets[max];
    },

    abbr : function (utc) {
        return this.abbrs[this._index(utc)];
    },

    offset : function (utc) {
        return this.offsets[this._index(utc)];
    }
};

function normalizeObjectUnits(inputObject) {
    var normalizedInput = {},
        normalizedProp,
        prop;

    for (prop in inputObject) {
        if (hasOwnProp(inputObject, prop)) {
            normalizedProp = normalizeUnits(prop);
            if (normalizedProp) {
                normalizedInput[normalizedProp] = inputObject[prop];
            }
        }
    }

    return normalizedInput;
};

var ordering = ['year', 'quarter', 'month', 'week', 'day', 'hour', 'minute', 'second', 'millisecond'];

function isDurationValid(m) {
    for (var key in m) {
        if (!(ordering.indexOf(key) !== -1 && (m[key] == null || !isNaN(m[key])))) {
            return false;
        }
    }

    var unitHasDecimal = false;
    for (var i = 0; i < ordering.length; ++i) {
        if (m[ordering[i]]) {
            if (unitHasDecimal) {
                return false; // only allow non-integers for smallest unit
            }
            if (parseFloat(m[ordering[i]]) !== toInt(m[ordering[i]])) {
                unitHasDecimal = true;
            }
        }
    }

    return true;
};

function toInt(argumentForCoercion) {
    var coercedNumber = +argumentForCoercion,
        value = 0;

    if (coercedNumber !== 0 && isFinite(coercedNumber)) {
        value = absFloor(coercedNumber);
    }

    return value;
};

function absFloor(number) {
    if (number < 0) {
        // -0 -> 0
        return Math.ceil(number) || 0;
    } else {
        return Math.floor(number);
    }
};

/************************************
    Duration object
************************************/
function Duration (duration) {
    var normalizedInput = normalizeObjectUnits(duration),
        years = normalizedInput.year || 0,
        quarters = normalizedInput.quarter || 0,
        months = normalizedInput.month || 0,
        weeks = normalizedInput.week || 0,
        days = normalizedInput.day || 0,
        hours = normalizedInput.hour || 0,
        minutes = normalizedInput.minute || 0,
        seconds = normalizedInput.second || 0,
        milliseconds = normalizedInput.millisecond || 0;

    this._isValid = isDurationValid(normalizedInput);

    // representation for dateAddRemove
    this._milliseconds = +milliseconds +
        seconds * 1e3 + // 1000
        minutes * 6e4 + // 1000 * 60
        hours * 1000 * 60 * 60; //using 1000 * 60 * 60 instead of 36e5 to avoid floating point rounding errors https://github.com/moment/moment/issues/2978
    // Because of dateAddRemove treats 24 hours as different from a
    // day when working around DST, we need to store them separately
    this._days = +days +
        weeks * 7;
    // It is impossible translate months into days without knowing
    // which months you are are talking about, so we have to store
    // it separately.
    this._months = +months +
        quarters * 3 +
        years * 12;
};
