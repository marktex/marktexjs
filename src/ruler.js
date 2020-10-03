export class Ruler {
    constructor(rules=null) {
        /**
         * Parser#__rules__: Array
         *
         * List of added rules. Each element is:
         * {
         *      name: String,
         *      enabled: Boolean,
         *      state: Number,
         *      apply: Function(),
         *      options: Object,
         *      level: Number, // 规则等级
         * }
         */
        this.__rules__ = [];
        /**
         * [TO DO]:
         *
         * Ruler#levelMap: Object
         *
         * Format:
         * {
         *      '0': [{name, apply, enable, level, options}, ...]
         *      '3': [{name, apply, enable, level, options}, ...]
         * }
         */

        /**
         * Ruler#__cache__: Array | null
         *
         * 缓存 enabled rules，，以提升性能
         */
        this.__cache__ = null;

        /**
         * Parser#__tower__: Array
         *
         * List of added tower. Each element is:
         * {
         *      name: String,
         *      enabled: Boolean,
         *      state: Number,
         *      apply: Function(),
         *      options: Object,
         *      level: Number, // 规则等级
         * }
         */
        this.__tower__ = {}

        if (rules) {
            rules = Array.isArray(rules) ? rules: [rules];
            rules.forEach(([name, apply, step, options={}]) => {
                let {level, enabled,} = options;
                options =  options || {};
                enabled =  enabled || true;
                level = level || 0;
                /**
                 * @deprecated
                 */
                this.__rules__.push({
                    name,
                    enabled,
                    apply,
                    options,
                });
                this.__tower__[level] = this.__tower__[level] ? this.__tower__[level] : [];
                this.__tower__[level].push({
                    name,
                    apply,
                    level,
                    enabled,
                    options,
                });

            });
        }
    }

    get tower(){
        /**
         * [TO DO]
         */
        return this.__tower__;
    }

    get rules() {
        const { __rules__, __cache__ } = this;
        return __cache__
            ? __cache__
            : __rules__.filter(({ enabled }) => {
                  return enabled;
              });
    }

    /**
     * Ruler.indexOf(name)
     * @param {String} name
     *
     * Find rule index by name
     */
    indexOf(name) {
        for (let i = 0; i < this.__rules__.length; i++) {
            if (this.__rules__[i].name === name) {
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

        this.__rules__.splice(index, 0, {
            name: ruleName,
            enabled: true,
            apply: apply,
            options,
        });

        this.__cache__ = null;
    }

    after(afterName, ruleName, apply, options = {}) {
        let index = this.indexOf(afterName);
        // let opt = options || {};

        if (index === -1) {
            throw new Error(`Parser rule not found: ${afterName}`);
        }

        this.__rules__.splice(index + 1, 0, {
            name: ruleName,
            enabled: true,
            apply: apply,
            options,
        });

        this.__cache__ = null;
    }

    push(rules) {
        // let opt = options || {};
        // ruleName, apply, options = {}

        if (!Array.isArray(rules)) {
            rules = [rules];
        }

        rules.forEach(([name, apply, enabled, options]) => {
            this.__rules__.push({
                name,
                enabled: enabled || true,
                apply,
                options: options || {},
            });
        });

        this.__cache__ = null;
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
            this.__rules__[idx].enabled = true;
            result.push(name);
        }, this);

        this.__cache__ = null;
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
            this.__rules__[idx].enabled = false;
            result.push(name);
        }, this);

        this.__cache__ = null;
        return result;
    }
}

export default Ruler;
