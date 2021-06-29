// -f <function> -s <string> -o <{additional params}>
const flagF = { f : "f", o: "o", s: "s", _: "_" }
const Jatchy = module.exports = {}
const fns = ["capital", "encrypt"]; // future function chain []
const argv = require('minimist')(process.argv.slice(2));

const helpers = {
    gExpose: function (methodName, fn) {
        Jatchy[methodName] = fn
    },
    gRequire: function (name) {
        return Jatchy[name]; //= require('./jatchy/' + name);
    },
    compose: function () {
        const fn = [...arguments];
        function inner() {
            var res = argv;
            fn.push(...arguments);
            fn.map(f => {
                res = f(res);
            })
        }
        return inner;
    },
    wrap: function (fn) {
        return fn
    }
};

const validators = {
    /**
     * @param - { _: [] } 
     */
    Vflag: function (obj) {
        if (obj["_"].length > 0) {
            throw new Error("Check Params!");
        }
        for ( let prop in obj ) {
            if ( !flagF[prop]) {
                throw new Error("Check Params!");
            }
        }
        if (!obj["f"]) {
            throw new Error("Function Is Required! Please Specify A Function");
        }
        if (!obj["s"]) {
            throw new Error("String Is Required!");
        }
        return obj;
    }
};

const exec = {
    start: function (obj) {
        const _str = obj["s"];
        const _oth = obj["o"]
        Jatchy[obj["f"]](_str, _oth);
    }
};

(function () {
    /** 
     * @str string
     * @others { symbol, index }
     * @index string index to be Capitalized
     * @symbol ["Lorem,ipsum,dolor"] = (",") => ["Lorem", "ipsum", "dolor"]
     */
    helpers.gExpose(fns[0], function (str, others) {
        if (!others) {
            console.log('Output: ', str[0].toUpperCase() + str.slice(1))
            return true;
        }
        var o = JSON.parse(others);
        if (o["index"] >= 0) {
            var _idx = o["index"];
            var _sym = o["symbol"] || " "
            var formatStr = str.split(_sym).map(t => ( t.slice(0, _idx) + t[_idx].toUpperCase() + t.slice(_idx + 1)) ).join(" ");
            console.log("Formatted String: " + formatStr);
        }
    });

    helpers.compose(validators.Vflag)(exec.start)
})();
