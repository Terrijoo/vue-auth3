/*!
 * @websanova/vue-auth v4.2.1
 * https://websanova.com/docs/vue-auth
 * Released under the MIT License.
 */

'use strict';

var vueRouter_2_x = {
  init: function () {
    if (!this.plugins.router) {
      return 'drivers/router/vue-router.2.x.js: router plugin has not been set.';
    }
  },
  beforeEach: function (routerBeforeEach, transitionEach, setTransitions, getAuthMeta) {
    var _this = this,
      router = this.plugins.router;
    function processTransition(transition, done) {
      setTransitions(transition);
      routerBeforeEach.call(_this, function () {
        var auth = getAuthMeta(transition);
        transitionEach.call(_this, transition, auth, function (redirect) {
          done(redirect);
        });
      });
    }

    // router v4.x+: the `next` callback is deprecated, so the guard must
    // not declare a third argument and returns the result instead.
    if (typeof router.isReady === 'function') {
      router.beforeEach(function (transition) {
        return new Promise(function (resolve) {
          processTransition(transition, function (redirect) {
            resolve(redirect || undefined);
          });
        });
      });
      return;
    }
    router.beforeEach(function (transition, location, next) {
      processTransition(transition, function (redirect) {
        if (!redirect) {
          (next || transition.next)();
          return;
        }

        // router v2.x / v3.x
        if (next) {
          next(redirect);
        } else {
          _this.drivers.router.routerReplace.call(_this, redirect);
        }
      });
    });
  },
  routerReplace: function (data) {
    var router = this.plugins.router;
    router.replace.call(router, data);
  },
  routerGo: function (data) {
    var router = this.plugins.router;
    (router.push || router.go).call(router, data).catch(function (err) {});
  }
};

module.exports = vueRouter_2_x;
