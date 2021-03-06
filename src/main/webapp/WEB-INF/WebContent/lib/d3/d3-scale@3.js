// https://d3js.org/d3-scale/ v3.2.3 Copyright 2020 Mike Bostock
!function (n, t) {
  "object" == typeof exports && "undefined" != typeof module ? t(exports, require("d3-array"), require("d3-interpolate"), require("d3-format"), require("d3-time"), require("d3-time-format")) : "function" == typeof define && define.amd ? define(["exports", "d3-array", "d3-interpolate", "d3-format", "d3-time", "d3-time-format"], t) : t((n = n || self).d3 = n.d3 || {}, n.d3, n.d3, n.d3, n.d3, n.d3)
}(this, function (n, t, r, e, u, i) {
  "use strict";

  function o(n, t) {
    switch (arguments.length) {
      case 0:
        break;
      case 1:
        this.range(n);
        break;
      default:
        this.range(t).domain(n)
    }
    return this
  }

  function a(n, t) {
    switch (arguments.length) {
      case 0:
        break;
      case 1:
        "function" == typeof n ? this.interpolator(n) : this.range(n);
        break;
      default:
        this.domain(n), "function" == typeof t ? this.interpolator(t) : this.range(t)
    }
    return this
  }

  const c = Symbol("implicit");

  function f() {
    var n = new Map, t = [], r = [], e = c;

    function u(u) {
      var i = u + "", o = n.get(i);
      if (!o) {
        if (e !== c) {
          return e;
        }
        n.set(i, o = t.push(u))
      }
      return r[(o - 1) % r.length]
    }

    return u.domain = function (r) {
      if (!arguments.length) {
        return t.slice();
      }
      t = [], n = new Map;
      for (const e of r) {
        const r = e + "";
        n.has(r) || n.set(r, t.push(e))
      }
      return u
    }, u.range = function (n) {
      return arguments.length ? (r = Array.from(n), u) : r.slice()
    }, u.unknown = function (n) {
      return arguments.length ? (e = n, u) : e
    }, u.copy = function () {
      return f(t, r).unknown(e)
    }, o.apply(u, arguments), u
  }

  function l() {
    var n, r, e = f().unknown(void 0), u = e.domain, i = e.range, a = 0, c = 1, p = !1, s = 0, h = 0, g = .5;

    function m() {
      var e = u().length, o = c < a, f = o ? c : a, l = o ? a : c;
      n = (l - f) / Math.max(1, e - s + 2 * h), p && (n = Math.floor(n)), f += (l - f - n * (e - s)) * g, r = n * (1 - s), p && (f = Math.round(f), r = Math.round(r));
      var m = t.range(e).map(function (t) {
        return f + n * t
      });
      return i(o ? m.reverse() : m)
    }

    return delete e.unknown, e.domain = function (n) {
      return arguments.length ? (u(n), m()) : u()
    }, e.range = function (n) {
      return arguments.length ? ([a, c] = n, a = +a, c = +c, m()) : [a, c]
    }, e.rangeRound = function (n) {
      return [a, c] = n, a = +a, c = +c, p = !0, m()
    }, e.bandwidth = function () {
      return r
    }, e.step = function () {
      return n
    }, e.round = function (n) {
      return arguments.length ? (p = !!n, m()) : p
    }, e.padding = function (n) {
      return arguments.length ? (s = Math.min(1, h = +n), m()) : s
    }, e.paddingInner = function (n) {
      return arguments.length ? (s = Math.min(1, n), m()) : s
    }, e.paddingOuter = function (n) {
      return arguments.length ? (h = +n, m()) : h
    }, e.align = function (n) {
      return arguments.length ? (g = Math.max(0, Math.min(1, n)), m()) : g
    }, e.copy = function () {
      return l(u(), [a, c]).round(p).paddingInner(s).paddingOuter(h).align(g)
    }, o.apply(m(), arguments)
  }

  function p(n) {
    return +n
  }

  var s = [0, 1];

  function h(n) {
    return n
  }

  function g(n, t) {
    return (t -= n = +n) ? function (r) {
      return (r - n) / t
    } : (r = isNaN(t) ? NaN : .5, function () {
      return r
    });
    var r
  }

  function m(n, t, r) {
    var e = n[0], u = n[1], i = t[0], o = t[1];
    return u < e ? (e = g(u, e), i = r(o, i)) : (e = g(e, u), i = r(i, o)), function (n) {
      return i(e(n))
    }
  }

  function d(n, r, e) {
    var u = Math.min(n.length, r.length) - 1, i = new Array(u), o = new Array(u), a = -1;
    for (n[u] < n[0] && (n = n.slice().reverse(), r = r.slice().reverse()); ++a < u;) {
      i[a] = g(n[a], n[a + 1]), o[a] = e(r[a], r[a + 1]);
    }
    return function (r) {
      var e = t.bisect(n, r, 1, u) - 1;
      return o[e](i[e](r))
    }
  }

  function y(n, t) {
    return t.domain(n.domain()).range(n.range()).interpolate(n.interpolate()).clamp(n.clamp()).unknown(n.unknown())
  }

  function v() {
    var n, t, e, u, i, o, a = s, c = s, f = r.interpolate, l = h;

    function g() {
      var n, t, r, e = Math.min(a.length, c.length);
      return l !== h && (n = a[0], t = a[e - 1], n > t && (r = n, n = t, t = r), l = function (r) {
        return Math.max(n, Math.min(t, r))
      }), u = e > 2 ? d : m, i = o = null, y
    }

    function y(t) {
      return isNaN(t = +t) ? e : (i || (i = u(a.map(n), c, f)))(n(l(t)))
    }

    return y.invert = function (e) {
      return l(t((o || (o = u(c, a.map(n), r.interpolateNumber)))(e)))
    }, y.domain = function (n) {
      return arguments.length ? (a = Array.from(n, p), g()) : a.slice()
    }, y.range = function (n) {
      return arguments.length ? (c = Array.from(n), g()) : c.slice()
    }, y.rangeRound = function (n) {
      return c = Array.from(n), f = r.interpolateRound, g()
    }, y.clamp = function (n) {
      return arguments.length ? (l = !!n || h, g()) : l !== h
    }, y.interpolate = function (n) {
      return arguments.length ? (f = n, g()) : f
    }, y.unknown = function (n) {
      return arguments.length ? (e = n, y) : e
    }, function (r, e) {
      return n = r, t = e, g()
    }
  }

  function M() {
    return v()(h, h)
  }

  function k(n, r, u, i) {
    var o, a = t.tickStep(n, r, u);
    switch ((i = e.formatSpecifier(null == i ? ",f" : i)).type) {
      case"s":
        var c = Math.max(Math.abs(n), Math.abs(r));
        return null != i.precision || isNaN(o = e.precisionPrefix(a, c)) || (i.precision = o), e.formatPrefix(i, c);
      case"":
      case"e":
      case"g":
      case"p":
      case"r":
        null != i.precision || isNaN(o = e.precisionRound(a, Math.max(Math.abs(n), Math.abs(r)))) || (i.precision = o - ("e" === i.type));
        break;
      case"f":
      case"%":
        null != i.precision || isNaN(o = e.precisionFixed(a)) || (i.precision = o - 2 * ("%" === i.type))
    }
    return e.format(i)
  }

  function w(n) {
    var r = n.domain;
    return n.ticks = function (n) {
      var e = r();
      return t.ticks(e[0], e[e.length - 1], null == n ? 10 : n)
    }, n.tickFormat = function (n, t) {
      var e = r();
      return k(e[0], e[e.length - 1], null == n ? 10 : n, t)
    }, n.nice = function (e) {
      null == e && (e = 10);
      var u, i, o = r(), a = 0, c = o.length - 1, f = o[a], l = o[c], p = 10;
      for (l < f && (i = f, f = l, l = i, i = a, a = c, c = i); p-- > 0;) {
        if ((i = t.tickIncrement(f, l, e)) === u) {
          return o[a] = f, o[c] = l, r(o);
        }
        if (i > 0) {
          f = Math.floor(f / i) * i, l = Math.ceil(l / i) * i;
        } else {
          if (!(i < 0)) {
            break;
          }
          f = Math.ceil(f * i) / i, l = Math.floor(l * i) / i
        }
        u = i
      }
      return n
    }, n
  }

  function N(n, t) {
    var r, e = 0, u = (n = n.slice()).length - 1, i = n[e], o = n[u];
    return o < i && (r = e, e = u, u = r, r = i, i = o, o = r), n[e] = t.floor(i), n[u] = t.ceil(o), n
  }

  function b(n) {
    return Math.log(n)
  }

  function x(n) {
    return Math.exp(n)
  }

  function q(n) {
    return -Math.log(-n)
  }

  function S(n) {
    return -Math.exp(-n)
  }

  function A(n) {
    return isFinite(n) ? +("1e" + n) : n < 0 ? 0 : n
  }

  function D(n) {
    return function (t) {
      return -n(-t)
    }
  }

  function R(n) {
    var r, u, i = n(b, x), o = i.domain, a = 10;

    function c() {
      return r = function (n) {
        return n === Math.E ? Math.log : 10 === n && Math.log10 || 2 === n && Math.log2 || (n = Math.log(n), function (t) {
          return Math.log(t) / n
        })
      }(a), u = function (n) {
        return 10 === n ? A : n === Math.E ? Math.exp : function (t) {
          return Math.pow(n, t)
        }
      }(a), o()[0] < 0 ? (r = D(r), u = D(u), n(q, S)) : n(b, x), i
    }

    return i.base = function (n) {
      return arguments.length ? (a = +n, c()) : a
    }, i.domain = function (n) {
      return arguments.length ? (o(n), c()) : o()
    }, i.ticks = function (n) {
      var e, i = o(), c = i[0], f = i[i.length - 1];
      (e = f < c) && (h = c, c = f, f = h);
      var l, p, s, h = r(c), g = r(f), m = null == n ? 10 : +n, d = [];
      if (!(a % 1) && g - h < m) {
        if (h = Math.floor(h), g = Math.ceil(g), c > 0) {
          for (; h <= g; ++h) {
            for (p = 1, l = u(h); p < a; ++p) {
              if (!((s = l * p) < c)) {
                if (s > f) {
                  break;
                }
                d.push(s)
              }
            }
          }
        } else {
          for (; h <= g; ++h) {
            for (p = a - 1, l = u(h); p >= 1; --p) {
              if (!((s = l * p) < c)) {
                if (s > f) {
                  break;
                }
                d.push(s)
              }
            }
          }
        }
        2 * d.length < m && (d = t.ticks(c, f, m))
      } else {
        d = t.ticks(h, g, Math.min(g - h, m)).map(u);
      }
      return e ? d.reverse() : d
    }, i.tickFormat = function (n, t) {
      if (null == t && (t = 10 === a ? ".0e" : ","), "function" != typeof t && (t = e.format(t)), n === 1 / 0) {
        return t;
      }
      null == n && (n = 10);
      var o = Math.max(1, a * n / i.ticks().length);
      return function (n) {
        var e = n / u(Math.round(r(n)));
        return e * a < a - .5 && (e *= a), e <= o ? t(n) : ""
      }
    }, i.nice = function () {
      return o(N(o(), {
        floor: function (n) {
          return u(Math.floor(r(n)))
        }, ceil: function (n) {
          return u(Math.ceil(r(n)))
        }
      }))
    }, i
  }

  function I(n) {
    return function (t) {
      return Math.sign(t) * Math.log1p(Math.abs(t / n))
    }
  }

  function O(n) {
    return function (t) {
      return Math.sign(t) * Math.expm1(Math.abs(t)) * n
    }
  }

  function F(n) {
    var t = 1, r = n(I(t), O(t));
    return r.constant = function (r) {
      return arguments.length ? n(I(t = +r), O(t)) : t
    }, w(r)
  }

  function P(n) {
    return function (t) {
      return t < 0 ? -Math.pow(-t, n) : Math.pow(t, n)
    }
  }

  function E(n) {
    return n < 0 ? -Math.sqrt(-n) : Math.sqrt(n)
  }

  function L(n) {
    return n < 0 ? -n * n : n * n
  }

  function T(n) {
    var t = n(h, h), r = 1;

    function e() {
      return 1 === r ? n(h, h) : .5 === r ? n(E, L) : n(P(r), P(1 / r))
    }

    return t.exponent = function (n) {
      return arguments.length ? (r = +n, e()) : r
    }, w(t)
  }

  function Q() {
    var n = T(v());
    return n.copy = function () {
      return y(n, Q()).exponent(n.exponent())
    }, o.apply(n, arguments), n
  }

  function U(n) {
    return Math.sign(n) * n * n
  }

  var Y = 1e3, j = 60 * Y, B = 60 * j, C = 24 * B, H = 7 * C, W = 30 * C, _ = 365 * C;

  function z(n) {
    return new Date(n)
  }

  function G(n) {
    return n instanceof Date ? +n : +new Date(+n)
  }

  function J(n, r, e, u, i, o, a, c, f) {
    var l = M(), p = l.invert, s = l.domain, h = f(".%L"), g = f(":%S"), m = f("%I:%M"), d = f("%I %p"), v = f("%a %d"),
      k = f("%b %d"), w = f("%B"), b = f("%Y"),
      x = [[a, 1, Y], [a, 5, 5 * Y], [a, 15, 15 * Y], [a, 30, 30 * Y], [o, 1, j], [o, 5, 5 * j], [o, 15, 15 * j], [o, 30, 30 * j], [i, 1, B], [i, 3, 3 * B], [i, 6, 6 * B], [i, 12, 12 * B], [u, 1, C], [u, 2, 2 * C], [e, 1, H], [r, 1, W], [r, 3, 3 * W], [n, 1, _]];

    function q(t) {
      return (a(t) < t ? h : o(t) < t ? g : i(t) < t ? m : u(t) < t ? d : r(t) < t ? e(t) < t ? v : k : n(t) < t ? w : b)(t)
    }

    function S(r, e, u) {
      if (null == r && (r = 10), "number" == typeof r) {
        var i, o = Math.abs(u - e) / r, a = t.bisector(function (n) {
          return n[2]
        }).right(x, o);
        return a === x.length ? (i = t.tickStep(e / _, u / _, r), r = n) : a ? (i = (a = x[o / x[a - 1][2] < x[a][2] / o ? a - 1 : a])[1], r = a[0]) : (i = Math.max(t.tickStep(e, u, r), 1), r = c), r.every(i)
      }
      return r
    }

    return l.invert = function (n) {
      return new Date(p(n))
    }, l.domain = function (n) {
      return arguments.length ? s(Array.from(n, G)) : s().map(z)
    }, l.ticks = function (n) {
      var t, r = s(), e = r[0], u = r[r.length - 1], i = u < e;
      return i && (t = e, e = u, u = t), t = (t = S(n, e, u)) ? t.range(e, u + 1) : [], i ? t.reverse() : t
    }, l.tickFormat = function (n, t) {
      return null == t ? q : f(t)
    }, l.nice = function (n) {
      var t = s();
      return (n = S(n, t[0], t[t.length - 1])) ? s(N(t, n)) : l
    }, l.copy = function () {
      return y(l, J(n, r, e, u, i, o, a, c, f))
    }, l
  }

  function K() {
    var n, t, e, u, i, o = 0, a = 1, c = h, f = !1;

    function l(t) {
      return isNaN(t = +t) ? i : c(0 === e ? .5 : (t = (u(t) - n) * e, f ? Math.max(0, Math.min(1, t)) : t))
    }

    function p(n) {
      return function (t) {
        var r, e;
        return arguments.length ? ([r, e] = t, c = n(r, e), l) : [c(0), c(1)]
      }
    }

    return l.domain = function (r) {
      return arguments.length ? ([o, a] = r, n = u(o = +o), t = u(a = +a), e = n === t ? 0 : 1 / (t - n), l) : [o, a]
    }, l.clamp = function (n) {
      return arguments.length ? (f = !!n, l) : f
    }, l.interpolator = function (n) {
      return arguments.length ? (c = n, l) : c
    }, l.range = p(r.interpolate), l.rangeRound = p(r.interpolateRound), l.unknown = function (n) {
      return arguments.length ? (i = n, l) : i
    }, function (r) {
      return u = r, n = r(o), t = r(a), e = n === t ? 0 : 1 / (t - n), l
    }
  }

  function V(n, t) {
    return t.domain(n.domain()).interpolator(n.interpolator()).clamp(n.clamp()).unknown(n.unknown())
  }

  function X() {
    var n = T(K());
    return n.copy = function () {
      return V(n, X()).exponent(n.exponent())
    }, a.apply(n, arguments)
  }

  function Z() {
    var n, t, e, u, i, o, a, c = 0, f = .5, l = 1, p = 1, s = h, g = !1;

    function m(n) {
      return isNaN(n = +n) ? a : (n = .5 + ((n = +o(n)) - t) * (p * n < p * t ? u : i), s(g ? Math.max(0, Math.min(1, n)) : n))
    }

    function d(n) {
      return function (t) {
        var e, u, i;
        return arguments.length ? ([e, u, i] = t, s = r.piecewise(n, [e, u, i]), m) : [s(0), s(.5), s(1)]
      }
    }

    return m.domain = function (r) {
      return arguments.length ? ([c, f, l] = r, n = o(c = +c), t = o(f = +f), e = o(l = +l), u = n === t ? 0 : .5 / (t - n), i = t === e ? 0 : .5 / (e - t), p = t < n ? -1 : 1, m) : [c, f, l]
    }, m.clamp = function (n) {
      return arguments.length ? (g = !!n, m) : g
    }, m.interpolator = function (n) {
      return arguments.length ? (s = n, m) : s
    }, m.range = d(r.interpolate), m.rangeRound = d(r.interpolateRound), m.unknown = function (n) {
      return arguments.length ? (a = n, m) : a
    }, function (r) {
      return o = r, n = r(c), t = r(f), e = r(l), u = n === t ? 0 : .5 / (t - n), i = t === e ? 0 : .5 / (e - t), p = t < n ? -1 : 1, m
    }
  }

  function $() {
    var n = T(Z());
    return n.copy = function () {
      return V(n, $()).exponent(n.exponent())
    }, a.apply(n, arguments)
  }

  n.scaleBand = l, n.scaleDiverging = function n() {
    var t = w(Z()(h));
    return t.copy = function () {
      return V(t, n())
    }, a.apply(t, arguments)
  }, n.scaleDivergingLog = function n() {
    var t = R(Z()).domain([.1, 1, 10]);
    return t.copy = function () {
      return V(t, n()).base(t.base())
    }, a.apply(t, arguments)
  }, n.scaleDivergingPow = $, n.scaleDivergingSqrt = function () {
    return $.apply(null, arguments).exponent(.5)
  }, n.scaleDivergingSymlog = function n() {
    var t = F(Z());
    return t.copy = function () {
      return V(t, n()).constant(t.constant())
    }, a.apply(t, arguments)
  }, n.scaleIdentity = function n(t) {
    var r;

    function e(n) {
      return isNaN(n = +n) ? r : n
    }

    return e.invert = e, e.domain = e.range = function (n) {
      return arguments.length ? (t = Array.from(n, p), e) : t.slice()
    }, e.unknown = function (n) {
      return arguments.length ? (r = n, e) : r
    }, e.copy = function () {
      return n(t).unknown(r)
    }, t = arguments.length ? Array.from(t, p) : [0, 1], w(e)
  }, n.scaleImplicit = c, n.scaleLinear = function n() {
    var t = M();
    return t.copy = function () {
      return y(t, n())
    }, o.apply(t, arguments), w(t)
  }, n.scaleLog = function n() {
    var t = R(v()).domain([1, 10]);
    return t.copy = function () {
      return y(t, n()).base(t.base())
    }, o.apply(t, arguments), t
  }, n.scaleOrdinal = f, n.scalePoint = function () {
    return function n(t) {
      var r = t.copy;
      return t.padding = t.paddingOuter, delete t.paddingInner, delete t.paddingOuter, t.copy = function () {
        return n(r())
      }, t
    }(l.apply(null, arguments).paddingInner(1))
  }, n.scalePow = Q, n.scaleQuantile = function n() {
    var r, e = [], u = [], i = [];

    function a() {
      var n = 0, r = Math.max(1, u.length);
      for (i = new Array(r - 1); ++n < r;) {
        i[n - 1] = t.quantileSorted(e, n / r);
      }
      return c
    }

    function c(n) {
      return isNaN(n = +n) ? r : u[t.bisect(i, n)]
    }

    return c.invertExtent = function (n) {
      var t = u.indexOf(n);
      return t < 0 ? [NaN, NaN] : [t > 0 ? i[t - 1] : e[0], t < i.length ? i[t] : e[e.length - 1]]
    }, c.domain = function (n) {
      if (!arguments.length) {
        return e.slice();
      }
      e = [];
      for (let t of n) {
        null == t || isNaN(t = +t) || e.push(t);
      }
      return e.sort(t.ascending), a()
    }, c.range = function (n) {
      return arguments.length ? (u = Array.from(n), a()) : u.slice()
    }, c.unknown = function (n) {
      return arguments.length ? (r = n, c) : r
    }, c.quantiles = function () {
      return i.slice()
    }, c.copy = function () {
      return n().domain(e).range(u).unknown(r)
    }, o.apply(c, arguments)
  }, n.scaleQuantize = function n() {
    var r, e = 0, u = 1, i = 1, a = [.5], c = [0, 1];

    function f(n) {
      return n <= n ? c[t.bisect(a, n, 0, i)] : r
    }

    function l() {
      var n = -1;
      for (a = new Array(i); ++n < i;) {
        a[n] = ((n + 1) * u - (n - i) * e) / (i + 1);
      }
      return f
    }

    return f.domain = function (n) {
      return arguments.length ? ([e, u] = n, e = +e, u = +u, l()) : [e, u]
    }, f.range = function (n) {
      return arguments.length ? (i = (c = Array.from(n)).length - 1, l()) : c.slice()
    }, f.invertExtent = function (n) {
      var t = c.indexOf(n);
      return t < 0 ? [NaN, NaN] : t < 1 ? [e, a[0]] : t >= i ? [a[i - 1], u] : [a[t - 1], a[t]]
    }, f.unknown = function (n) {
      return arguments.length ? (r = n, f) : f
    }, f.thresholds = function () {
      return a.slice()
    }, f.copy = function () {
      return n().domain([e, u]).range(c).unknown(r)
    }, o.apply(w(f), arguments)
  }, n.scaleRadial = function n() {
    var t, r = M(), e = [0, 1], u = !1;

    function i(n) {
      var e = function (n) {
        return Math.sign(n) * Math.sqrt(Math.abs(n))
      }(r(n));
      return isNaN(e) ? t : u ? Math.round(e) : e
    }

    return i.invert = function (n) {
      return r.invert(U(n))
    }, i.domain = function (n) {
      return arguments.length ? (r.domain(n), i) : r.domain()
    }, i.range = function (n) {
      return arguments.length ? (r.range((e = Array.from(n, p)).map(U)), i) : e.slice()
    }, i.rangeRound = function (n) {
      return i.range(n).round(!0)
    }, i.round = function (n) {
      return arguments.length ? (u = !!n, i) : u
    }, i.clamp = function (n) {
      return arguments.length ? (r.clamp(n), i) : r.clamp()
    }, i.unknown = function (n) {
      return arguments.length ? (t = n, i) : t
    }, i.copy = function () {
      return n(r.domain(), e).round(u).clamp(r.clamp()).unknown(t)
    }, o.apply(i, arguments), w(i)
  }, n.scaleSequential = function n() {
    var t = w(K()(h));
    return t.copy = function () {
      return V(t, n())
    }, a.apply(t, arguments)
  }, n.scaleSequentialLog = function n() {
    var t = R(K()).domain([1, 10]);
    return t.copy = function () {
      return V(t, n()).base(t.base())
    }, a.apply(t, arguments)
  }, n.scaleSequentialPow = X, n.scaleSequentialQuantile = function n() {
    var r = [], e = h;

    function u(n) {
      if (!isNaN(n = +n)) {
        return e((t.bisect(r, n, 1) - 1) / (r.length - 1))
      }
    }

    return u.domain = function (n) {
      if (!arguments.length) {
        return r.slice();
      }
      r = [];
      for (let t of n) {
        null == t || isNaN(t = +t) || r.push(t);
      }
      return r.sort(t.ascending), u
    }, u.interpolator = function (n) {
      return arguments.length ? (e = n, u) : e
    }, u.range = function () {
      return r.map((n, t) => e(t / (r.length - 1)))
    }, u.quantiles = function (n) {
      return Array.from({length: n + 1}, (e, u) => t.quantile(r, u / n))
    }, u.copy = function () {
      return n(e).domain(r)
    }, a.apply(u, arguments)
  }, n.scaleSequentialSqrt = function () {
    return X.apply(null, arguments).exponent(.5)
  }, n.scaleSequentialSymlog = function n() {
    var t = F(K());
    return t.copy = function () {
      return V(t, n()).constant(t.constant())
    }, a.apply(t, arguments)
  }, n.scaleSqrt = function () {
    return Q.apply(null, arguments).exponent(.5)
  }, n.scaleSymlog = function n() {
    var t = F(v());
    return t.copy = function () {
      return y(t, n()).constant(t.constant())
    }, o.apply(t, arguments)
  }, n.scaleThreshold = function n() {
    var r, e = [.5], u = [0, 1], i = 1;

    function a(n) {
      return n <= n ? u[t.bisect(e, n, 0, i)] : r
    }

    return a.domain = function (n) {
      return arguments.length ? (e = Array.from(n), i = Math.min(e.length, u.length - 1), a) : e.slice()
    }, a.range = function (n) {
      return arguments.length ? (u = Array.from(n), i = Math.min(e.length, u.length - 1), a) : u.slice()
    }, a.invertExtent = function (n) {
      var t = u.indexOf(n);
      return [e[t - 1], e[t]]
    }, a.unknown = function (n) {
      return arguments.length ? (r = n, a) : r
    }, a.copy = function () {
      return n().domain(e).range(u).unknown(r)
    }, o.apply(a, arguments)
  }, n.scaleTime = function () {
    return o.apply(J(u.timeYear, u.timeMonth, u.timeWeek, u.timeDay, u.timeHour, u.timeMinute, u.timeSecond, u.timeMillisecond, i.timeFormat).domain([new Date(2e3, 0, 1), new Date(2e3, 0, 2)]), arguments)
  }, n.scaleUtc = function () {
    return o.apply(J(u.utcYear, u.utcMonth, u.utcWeek, u.utcDay, u.utcHour, u.utcMinute, u.utcSecond, u.utcMillisecond, i.utcFormat).domain([Date.UTC(2e3, 0, 1), Date.UTC(2e3, 0, 2)]), arguments)
  }, n.tickFormat = k, Object.defineProperty(n, "__esModule", {value: !0})
});
