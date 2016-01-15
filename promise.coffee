'use strict';

STATUS =
  PENDING: 0
  FULFILLED: 1
  REJECTED: 2

class Promise

  constructor: (resolver) ->
    this.status = STATUS.PENDING
    this.value = null
    this.handlers = []
    this._doPromise.call this, resolver

  _doPromise: (resolver, x) ->
    called = false
    self = this
    try
      # 立即调用 resolve
      if !x
        resolver (value) ->
          if !called
            self.resolve value
            called = yes
        , (reason) ->
          if !called
            self.reject reason
            called = yes
      else
        resolver.call x, (value) ->
            if !called
              self.resolve value
              called = yes
          , (reason) ->
            if !called
              self.reject reason
              called = yes
    catch e
      if !called
        self.reject e
        called = yes


  resolve: (value) ->
    self = this
    try
      if this is value
        throw new TypeError 'dead loop'

      if value instanceof Promise
        this._doPromise(value.then, value)
        ###
        value.then (x) ->
          self.resolve x
        , (x) ->
          self.reject x
        ###

      else
        this.status = STATUS.FULFILLED
        this.value = value
        this._dequeue()
    catch e
      this.reject e


  reject: (reason) ->
    this.status = STATUS.REJECTED
    this.value = reason
    this._dequeue()

  _dequeue: () ->
    for x in this.handlers
      this._handle x.nextPromise, x.onFulfilled, x.onRejected

  _handle: (nextPromise, onFulFilled, onRejected) ->
    self = this

    if self.status is STATUS.FULFILLED
      callback = onFulFilled
    else
      callback = onRejected

    if typeof callback is 'function'
      try
        self.resolve.call nextPromise, callback self.value
      catch e
        self.reject.call nextPromise, e
    else
      if self.status is STATUS.FULFILLED
        self.resolve.call nextPromise, self.value
      else
        self.reject.call nextPromise, self.value

  then: (onFulFilled, onRejected) ->
    nextPromise = new Promise (x) ->
    this.handlers.push
      nextPromise: nextPromise
      onFulFilled: onFulFilled
      onRejected: onRejected
    console.log this.handlers.length
    if this.status isnt STATUS.PENDING
      this._handle nextPromise, onFulFilled, onRejected

    nextPromise

  test = new Promise (resolve, reject) ->
    resolve 'yes'

  ###
  test.then () ->
  ,
  (x) ->
    console.log x
###

  test1 = new Promise (resolve, reject) ->
    resolve test


  test1.then (x) ->
    console.log x
  , (x) ->
    console.log x

