/**
 * Created by lqp on 2016/1/15.
 */

"use strict";

var Resolver = (function (win) {
    var STATUS = {
        PENDING: 0,
        FULFILLED: 1,
        REJECTED: 2
    }

    function resolve(resolver, value) {
        var called;

        function onFulfilled(data) {
            if (!called) {
                resolve(resolver, data);
                called = true;
            }
        }

        function onRejected(reason) {
            if (!called) {
                resolver.reject(reason)
            }
        }

        function doIt() {
            if (value instanceof Resolver) {
                value.then.call(value, onFulfilled, onRejected);
            }
            else {
                resolver.fulfill(value);
            }
        }

        doIt();
    }


    function then(resolver, onFulfilled, onRejected) {
        var n
    }

    function Resolver () {

    }

    return Resolver
})(this)