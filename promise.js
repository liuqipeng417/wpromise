// Generated by CoffeeScript 1.10.0
(function() {
  'use strict';
  var Promise, STATUS;

  STATUS = {
    PENDING: 0,
    FULFILLED: 1,
    REJECTED: 2
  };

  Promise = (function() {
    var test, test1;

    function Promise(resolver) {
      this.status = STATUS.PENDING;
      this.value = null;
      this.handlers = [];
      this._doPromise.call(this, resolver);
    }

    Promise.prototype._doPromise = function(resolver, x) {
      var called, e, error, self;
      called = false;
      self = this;
      try {
        if (!x) {
          return resolver(function(value) {
            if (!called) {
              self.resolve(value);
              return called = true;
            }
          }, function(reason) {
            if (!called) {
              self.reject(reason);
              return called = true;
            }
          });
        } else {
          return resolver.call(x, function(value) {
            if (!called) {
              self.resolve(value);
              return called = true;
            }
          }, function(reason) {
            if (!called) {
              self.reject(reason);
              return called = true;
            }
          });
        }
      } catch (error) {
        e = error;
        if (!called) {
          self.reject(e);
          return called = true;
        }
      }
    };

    Promise.prototype.resolve = function(value) {
      var e, error, self;
      self = this;
      try {
        if (this === value) {
          throw new TypeError('dead loop');
        }
        if (value instanceof Promise) {
          return this._doPromise(value.then, value);

          /*
          value.then (x) ->
            self.resolve x
          , (x) ->
            self.reject x
           */
        } else {
          this.status = STATUS.FULFILLED;
          this.value = value;
          return this._dequeue();
        }
      } catch (error) {
        e = error;
        return this.reject(e);
      }
    };

    Promise.prototype.reject = function(reason) {
      this.status = STATUS.REJECTED;
      this.value = reason;
      return this._dequeue();
    };

    Promise.prototype._dequeue = function() {
      var i, len, ref, results, x;
      ref = this.handlers;
      results = [];
      for (i = 0, len = ref.length; i < len; i++) {
        x = ref[i];
        results.push(this._handle(x.nextPromise, x.onFulfilled, x.onRejected));
      }
      return results;
    };

    Promise.prototype._handle = function(nextPromise, onFulFilled, onRejected) {
      var callback, e, error, self;
      self = this;
      if (self.status === STATUS.FULFILLED) {
        callback = onFulFilled;
      } else {
        callback = onRejected;
      }
      if (typeof callback === 'function') {
        try {
          return self.resolve.call(nextPromise, callback(self.value));
        } catch (error) {
          e = error;
          return self.reject.call(nextPromise, e);
        }
      } else {
        if (self.status === STATUS.FULFILLED) {
          return self.resolve.call(nextPromise, self.value);
        } else {
          return self.reject.call(nextPromise, self.value);
        }
      }
    };

    Promise.prototype.then = function(onFulFilled, onRejected) {
      var nextPromise;
      nextPromise = new Promise(function(x) {});
      this.handlers.push({
        nextPromise: nextPromise,
        onFulFilled: onFulFilled,
        onRejected: onRejected
      });
      console.log(this.handlers.length);
      if (this.status !== STATUS.PENDING) {
        this._handle(nextPromise, onFulFilled, onRejected);
      }
      return nextPromise;
    };

    test = new Promise(function(resolve, reject) {
      return resolve('yes');
    });


    /*
    test.then () ->
    ,
    (x) ->
      console.log x
     */

    test1 = new Promise(function(resolve, reject) {
      return resolve(test);
    });

    test1.then(function(x) {
      return console.log(x);
    }, function(x) {
      return console.log(x);
    });

    return Promise;

  })();

}).call(this);

//# sourceMappingURL=promise.js.map
