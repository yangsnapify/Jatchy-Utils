// -f <function> -s <string> -o <{additional params}>
const flagF = { f : "f", o: "o", s: "s", _: "_" }
const Jatchy = module.exports = {}
const fns = ["capital"];
const argv = require('minimist')(process.argv.slice(2));

const helpers = {
    gExpose: function (methodName, fn) {
        Jatchy[methodName] = fn
    },
    gRequire: function (name) {
        return Jatchy[name] = require('./jatchy/' + name);
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
        return obj;
    }
};

const exec = {
    start: function (obj) {
        console.log(obj, 'start');
    }
};

(function () {
    /** 
     * @str string
     * @idx string index to be Capitalized
     * @split boolean
     * @symbol ["Lorem,ipsum,dolor"] = (",") => ["Lorem", "ipsum", "dolor"]
     */
    helpers.gExpose(fns[0], function (str, { split, symbol, idx }) {
        var _idx = idx || 0;
    });

    helpers.compose(validators.Vflag)(exec.start)

    // minimist read input from cmd
    // validate params
    // execute selected function
})();
