export class Ruler {
    constructor() {
        /**
         * Parser#rules: Array
         *
         * List of added rules. Each element is:
         * {
         *      name: String,
         *      enabled: Boolean,
         *      state: Number,
         *      apply: Function(),
         *      options: Object
         * }
         */
        this.rules = [];
    }

    /**
     * Ruler.indexOf(name)
     * @param {String} name
     *
     * Find rule index by name
     */
    indexOf(name) {
        for (let i = 0; i < this.rules.length; i++) {
            if (this.rules[i].name === name) {
                return i;
            }
        }
        return -1;
    }

    before(beforeName, ruleName, apply, options = {}) {
        let index = this.indexOf(beforeName);
        // let opt = options || {};

        if (index === -1) {
            throw new Error(`Parser rule not found: ${beforeName}`);
        }

        this.rules.splice(index, 0, {
            name: ruleName,
            enabled: true,
            apply: apply,
            options,
        });

        // this.__cache__ = null;
    }

    after(afterName, ruleName, apply, options = {}) {
        let index = this.indexOf(afterName);
        // let opt = options || {};

        if (index === -1) {
            throw new Error(`Parser rule not found: ${afterName}`);
        }

        this.rules.splice(index + 1, 0, {
            name: ruleName,
            enabled: true,
            apply: apply,
            options,
        });

        // this.__cache__ = null;
    }

    push(rules) {
        // let opt = options || {};
        // ruleName, apply, options = {}

        if (!Array.isArray(rules)) {
            rules = [rules];
        }

        rules.forEach(([name, apply, enabled, options])=>{
            this.rules.push({
                name,
                enabled: enabled || true,
                apply,
                options: options|| {},
            });
        })
        // this.__cache__ = null;
    }

    enable(list, ignoreInvalid) {
        if (!Array.isArray(list)) {
            list = [list];
        }

        let result = [];

        // Search by name and enable
        list.forEach(function (name) {
            let idx = this.indexOf(name);

            if (idx < 0) {
                if (ignoreInvalid) {
                    return;
                }
                throw new Error(`Rules manager: invalid rule name ${name}`);
            }
            this.rules[idx].enabled = true;
            result.push(name);
        }, this);

        // this.__cache__ = null;
        return result;
    }

    disable(list, ignoreInvalid) {
        if (!Array.isArray(list)) {
            list = [list];
        }

        let result = [];

        // Search by name and disable
        list.forEach(function (name) {
            let idx = this.indexOf(name);

            if (idx < 0) {
                if (ignoreInvalid) {
                    return;
                }
                throw new Error(`Rules manager: invalid rule name ${name}`);
            }
            this.rules[idx].enabled = false;
            result.push(name);
        }, this);

        // this.__cache__ = null;
        return result;
    };
}

export default Ruler;
