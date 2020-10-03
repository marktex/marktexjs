/**
 * class Token
 *
 * Create new ast and fill passed properties.
 */

export class Token {
    constructor(type, value, map, raw) {
        /**
         * Token#type: String
         *
         * Type of the Token (string, e.g. "paragraph")
         */
        this.type = type;

        /**
         * Token#value: Array
         *
         * results of RegExp matched value
         */
        this.value = value;

        /**
         * Token#map: Array
         *
         * Format: [start, end, line]
         */
        this.map = map;


        /**
         * Token#raw: String
         */
        this.raw = raw;
    }
}

export default Token;
