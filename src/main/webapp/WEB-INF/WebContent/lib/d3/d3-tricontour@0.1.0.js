// https://github.com/Fil/d3-tricontour v0.1.0 Copyright 2019 Philippe Rivière
!function (n, t) {
  "object" == typeof exports && "undefined" != typeof module ? t(exports, require("d3-delaunay"), require("d3-scale")) :
    "function" == typeof define && define.amd ? define(["exports", "d3-delaunay", "d3-scale"], t) : t((n = n || self).d3 = n.d3 || {}, n.d3, n.d3);
}(this, function (n, t, e) {
  "use strict";

  function o(n, t) {
    for (var e, o = -1, i = t.length; ++o < i;) {
      if (e = r(n, t[o])) {
        return e;
      }
    }
    return 0;
  }

  function r(n, t) {
    for (var e = t[0], o = t[1], r = -1, u = 0, f = n.length, c = f - 1; u < f; c = u++) {
      var l = n[u], a = l[0], s = l[1], d = n[c], h = d[0], p = d[1];
      if (i(l, d, t)) {
        return 0;
      }
      s > o != p > o && e < (h - a) * (o - s) / (p - s) + a && (r = -r);
    }
    return r;
  }

  function i(n, t, e) {
    var o, r, i, u;
    return function (n, t, e) {
      return (t[0] - n[0]) * (e[1] - n[1]) == (e[0] - n[0]) * (t[1] - n[1]);
    }(n, t, e) && (r = n[o = +(n[0] === t[0])], i = e[o], u = t[o], r <= i && i <= u || u <= i && i <= r);
  }

  function u(n) {
    for (var t = 0, e = n.length, o = n[e - 1][1] * n[0][0] - n[e - 1][0] * n[0][1]; ++t < e;) {
      o += n[t - 1][1] * n[t][0] - n[t - 1][0] * n[t][1];
    }
    return o;
  }

  function f(n) {
    const t = [], e = [];
    for (const o of n) {
      u(o) > 0 ? t.push([o]) : e.push(o);
    }
    return e.forEach(function (n) {
      for (var e, r = 0, i = t.length; r < i; ++r) {
        if (-1 !== o((e = t[r])[0], n)) {
          return void e.push(n);
        }
      }
    }), t;
  }

  n.tricontour = function () {
    let n, o, r, i = n => n[0], u = n => n[1], c = n => isFinite(+n[2]) ? +n[2] : 0, l = t.Delaunay.from, a = (n, t, e) => {
      const {points: o} = r, i = [o[2 * n], o[2 * n + 1]], u = [o[2 * t], o[2 * t + 1]];
      return [e * u[0] + (1 - e) * i[0], e * u[1] + (1 - e) * i[1]];
    }, s = f;

    function d(t) {
      r = l(t, i, u), o = Array.from(t, c), "object" != typeof n && (n = e.scaleLinear().domain(function (n) {
        let t, e;
        for (const o of n) {
          null != o && (void 0 === t ? o >= o && (t = e = o) : (t > o && (t = o), e < o && (e = o)));
        }
        return [t, e];
      }(o)).nice().ticks(n));
    }

    function* h(t) {
      d(t);
      for (const t of n) {
        const n = v(r, o, t);
        yield{type: "MultiPolygon", coordinates: n, value: t};
      }
    }

    const p = function (n) {
      return [...h(n)];
    };
    return p.x = n => n ? (i = n, p) : i, p.y = n => n ? (u = n, p) : u, p.value = n => n ? (c = n, p) : c, p.thresholds = t => t ? (n = t, p) : n, p.triangulate =
      n => n ? (l = n, p) : l, p.pointInterpolate = n => n ? (a = n, p) : a, p.ringsort = n => n ? (s = n, p) : s, p.contours = h, p.contour = function (n, t) {
      return d(n), {type: "MultiPolygon", coordinates: v(r, o, t), value: t};
    }, p.isobands = function* (t) {
      let e, i, u;
      d(t);
      for (const t of n) {
        i && (e = i), f = v(r, o, t), i = Array.from(function* (n) {
          for (const t of n) {
            yield* t;
          }
        }(f)), e && (yield{type: "MultiPolygon", coordinates: s(e.concat(i.map(n => n.slice().reverse()))), value: u, valueMax: t}), u = t;
      }
      var f;
    }, p._values = () => o, p._thresholds = () => n, p._triangulation = () => r, p;

    function y(n) {
      return n % 3 == 2 ? n - 2 : n + 1;
    }

    function g(n) {
      return n % 3 == 0 ? n + 2 : n - 1;
    }

    function v(n, t, e = 0) {
      for (const n of t) {
        if (!isFinite(n)) {
          throw["Invalid value", n];
        }
      }
      const {halfedges: o, hull: r, inedges: i, triangles: u} = n, f = t.length;

      function c(n) {
        return l(u[n], u[y(n)]);
      }

      function l(n, o) {
        const r = t[n], i = t[o];
        if ((r - e) * (i - e) <= 0 && r - i) {
          return (e - r) / Math.abs(r - i);
        }
      }

      const d = [], h = new Uint8Array(o.length).fill(0);
      let p, v, m, j, b;
      for (j = 0; j < o.length; j++) {
        if (!h[j]) {
          for (v = j, p = []; (b = c(v)) > 0;) {
            const [n, a] = [u[v], u[m = y(v)]];
            if (p.length && n === p[0].ti && a === p[0].tj || p.length > 2 * f) {
              break;
            }
            if (h[v] = 1, p.push({ti: n, tj: a, a: b}), (m = o[v]) > -1) {
              if (c(m = y(m)) > 0) {
                v = m;
                continue;
              }
              if (c(m = y(m)) > 0) {
                v = m;
                continue;
              }
            } else {
              let n = (r.indexOf(u[v]) + 1) % r.length;
              for (; t[r[n]] < e;) {
                n = (n + 1) % r.length;
              }
              for (; t[r[n]] >= e;) {
                p.push({ti: r[n], tj: r[n], a: 0}), n = (n + 1) % r.length;
              }
              if (m = i[r[n]], p.push({ti: r[n], tj: u[m], a: l(r[n], u[m])}), c(v = y(m)) > 0) {
                continue;
              }
              if (c(v = g(m)) > 0) {
                continue
              }
            }
          }
          p.length && (p.push(p[0]), d.push(p.map(({ti: n, tj: t, a: e}) => a(n, t, e))))
        }
      }
      return r.every(n => t[n] >= e) && d.unshift(Array.from(r).concat([r[0]]).map(n => a(n, n, 0))), s(d)
    }
  }, Object.defineProperty(n, "__esModule", {value: !0})
});
