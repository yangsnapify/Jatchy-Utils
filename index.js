// -f <function> -s <string> -o <{additional params}>
const flagF = { f : "f", o: "o", s: "s", _: "_" }
const Jatchy = module.exports = {}
const fns = ["capital", "encrypt", "replace", "sort" ]; // future function chain []
const argv = require('minimist')(process.argv.slice(2));

const helpers = {
    gExpose: function (methodName, fn) {
        Jatchy[methodName] = fn
    },
    gRequire: function (name) {
        return Jatchy[name]; //= require('./jatchy/' + name);
    },
    gRet: function () {
        if (arguments.length > 0) {
            return 35;
        }
        return "a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w,x,y,z,1,2,3,4,5,6,7,8,9".split(","); //35
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
    },
    parse: function(str) {
        return JSON.parse(str);
    },
    /**
     * @param oAray Original Array 
     * @param mAray Compare Array
     * @returns []
     */
    quickS: function(oAray, mAray) {
        return [];
    },
    idxOpet(type, actualInt, optInt) {
        let v = 0;
        if (type === "encrypt") {
            v = actualInt + optInt
            return v > this.gRet(0) ? actualInt : v ;
        }
        v = actualInt - optInt;
        return v <= 0 ? actualInt : v
    }
};

const validators = {
    /**
     * @param obj { _: [] } 
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
        const _o = helpers.parse(obj["o"])
        if (_o["type"] !== "" && !["encrypt", "decrypt"].includes(_o["type"]) ) {
            throw new Error("Encrypt and Decrypt is supported!");
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
            return true;
        }
    });

    /**
     * @str string
     * @hops number
     * @description  [a, b, c] => (3) => [c, d, e] 
     */
    helpers.gExpose(fns[1], function (str, others) {
        const _o = helpers.parse(others);
        const _h = _o["hops"];
        const _t = _o["type"] || null;
        const charList = helpers.gRet();

        if (_t) {
            const _pos = str.split("").map((t) => (helpers.idxOpet(_t, charList.indexOf(t.toLowerCase()), _h)));
            const _f = _pos.map((t) => charList[t]).join("");
            console.log("Final Result Is: " + _f)
        }   
        return str;
    })

    // retrieve params need to change
    helpers.compose(validators.Vflag)(exec.start)
})();
