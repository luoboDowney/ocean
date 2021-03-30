// https://github.com/d3/d3-delaunay v5.3.0 Copyright 2020 Mike Bostock
// https://github.com/mapbox/delaunator v4.0.1. Copyright 2019 Mapbox, Inc.
!function (t, i) {
  "object" == typeof exports && "undefined" != typeof module ? i(exports) : "function" == typeof define && define.amd ? define(["exports"], i) : i((t = t || self).d3 = t.d3 || {})
}(this, function (t) {
  "use strict";
  const i = Math.pow(2, -52), e = new Uint32Array(512);

  class n {
    static from(t, i = u, e = _) {
      const s = t.length, h = new Float64Array(2 * s);
      for (let n = 0; n < s; n++) {
        const s = t[n];
        h[2 * n] = i(s), h[2 * n + 1] = e(s)
      }
      return new n(h)
    }

    constructor(t) {
      const i = t.length >> 1;
      if (i > 0 && "number" != typeof t[0]) {
        throw new Error("Expected coords to contain numbers.");
      }
      this.coords = t;
      const e = Math.max(2 * i - 5, 0);
      this._triangles = new Uint32Array(3 * e), this._halfedges = new Int32Array(3 * e), this._hashSize = Math.ceil(Math.sqrt(i)), this._hullPrev = new Uint32Array(i), this._hullNext = new Uint32Array(i), this._hullTri = new Uint32Array(i), this._hullHash = new Int32Array(this._hashSize).fill(-1), this._ids = new Uint32Array(i), this._dists = new Float64Array(i), this.update()
    }

    update() {
      const {coords: t, _hullPrev: e, _hullNext: n, _hullTri: h, _hullHash: r} = this, c = t.length >> 1;
      let u = 1 / 0, _ = 1 / 0, f = -1 / 0, d = -1 / 0;
      for (let i = 0; i < c; i++) {
        const e = t[2 * i], n = t[2 * i + 1];
        e < u && (u = e), n < _ && (_ = n), e > f && (f = e), n > d && (d = n), this._ids[i] = i
      }
      const g = (u + f) / 2, y = (_ + d) / 2;
      let m, x, p, w = 1 / 0;
      for (let i = 0; i < c; i++) {
        const e = s(g, y, t[2 * i], t[2 * i + 1]);
        e < w && (m = i, w = e)
      }
      const v = t[2 * m], b = t[2 * m + 1];
      w = 1 / 0;
      for (let i = 0; i < c; i++) {
        if (i === m) {
          continue;
        }
        const e = s(v, b, t[2 * i], t[2 * i + 1]);
        e < w && e > 0 && (x = i, w = e)
      }
      let T = t[2 * x], M = t[2 * x + 1], A = 1 / 0;
      for (let i = 0; i < c; i++) {
        if (i === m || i === x) {
          continue;
        }
        const e = o(v, b, T, M, t[2 * i], t[2 * i + 1]);
        e < A && (p = i, A = e)
      }
      let k = t[2 * p], $ = t[2 * p + 1];
      if (A === 1 / 0) {
        for (let i = 0; i < c; i++) {
          this._dists[i] = t[2 * i] - t[0] || t[2 * i + 1] - t[1];
        }
        a(this._ids, this._dists, 0, c - 1);
        const i = new Uint32Array(c);
        let e = 0;
        for (let t = 0, n = -1 / 0; t < c; t++) {
          const s = this._ids[t];
          this._dists[s] > n && (i[e++] = s, n = this._dists[s])
        }
        return this.hull = i.subarray(0, e), this.triangles = new Uint32Array(0), void (this.halfedges = new Uint32Array(0))
      }
      if (l(v, b, T, M, k, $)) {
        const t = x, i = T, e = M;
        x = p, T = k, M = $, p = t, k = i, $ = e
      }
      const P = function (t, i, e, n, s, h) {
        const l = e - t, r = n - i, o = s - t, a = h - i, c = l * l + r * r, u = o * o + a * a,
          _ = .5 / (l * a - r * o);
        return {x: t + (a * c - r * u) * _, y: i + (l * u - o * c) * _}
      }(v, b, T, M, k, $);
      this._cx = P.x, this._cy = P.y;
      for (let i = 0; i < c; i++) {
        this._dists[i] = s(t[2 * i], t[2 * i + 1], P.x, P.y);
      }
      a(this._ids, this._dists, 0, c - 1), this._hullStart = m;
      let S = 3;
      n[m] = e[p] = x, n[x] = e[m] = p, n[p] = e[x] = m, h[m] = 0, h[x] = 1, h[p] = 2, r.fill(-1), r[this._hashKey(v, b)] = m, r[this._hashKey(T, M)] = x, r[this._hashKey(k, $)] = p, this.trianglesLen = 0, this._addTriangle(m, x, p, -1, -1, -1);
      for (let s, o, a = 0; a < this._ids.length; a++) {
        const c = this._ids[a], u = t[2 * c], _ = t[2 * c + 1];
        if (a > 0 && Math.abs(u - s) <= i && Math.abs(_ - o) <= i) {
          continue;
        }
        if (s = u, o = _, c === m || c === x || c === p) {
          continue;
        }
        let f = 0;
        for (let t = 0, i = this._hashKey(u, _); t < this._hashSize && (-1 === (f = r[(i + t) % this._hashSize]) || f === n[f]); t++) {
          ;
        }
        let d, g = f = e[f];
        for (; d = n[g], !l(u, _, t[2 * g], t[2 * g + 1], t[2 * d], t[2 * d + 1]);) {
          if ((g = d) === f) {
            g = -1;
            break
          }
        }
        if (-1 === g) {
          continue;
        }
        let y = this._addTriangle(g, c, n[g], -1, -1, h[g]);
        h[c] = this._legalize(y + 2), h[g] = y, S++;
        let w = n[g];
        for (; d = n[w], l(u, _, t[2 * w], t[2 * w + 1], t[2 * d], t[2 * d + 1]);) {
          y = this._addTriangle(w, c, d, h[c], -1, h[w]), h[c] = this._legalize(y + 2), n[w] = w, S--, w = d;
        }
        if (g === f) {
          for (; l(u, _, t[2 * (d = e[g])], t[2 * d + 1], t[2 * g], t[2 * g + 1]);) {
            y = this._addTriangle(d, c, g, -1, h[g], h[d]), this._legalize(y + 2), h[d] = y, n[g] = g, S--, g = d;
          }
        }
        this._hullStart = e[c] = g, n[g] = e[w] = c, n[c] = w, r[this._hashKey(u, _)] = c, r[this._hashKey(t[2 * g], t[2 * g + 1])] = g
      }
      this.hull = new Uint32Array(S);
      for (let t = 0, i = this._hullStart; t < S; t++) {
        this.hull[t] = i, i = n[i];
      }
      this.triangles = this._triangles.subarray(0, this.trianglesLen), this.halfedges = this._halfedges.subarray(0, this.trianglesLen)
    }

    _hashKey(t, i) {
      return Math.floor(function (t, i) {
        const e = t / (Math.abs(t) + Math.abs(i));
        return (i > 0 ? 3 - e : 1 + e) / 4
      }(t - this._cx, i - this._cy) * this._hashSize) % this._hashSize
    }

    _legalize(t) {
      const {_triangles: i, _halfedges: n, coords: s} = this;
      let h = 0, l = 0;
      for (; ;) {
        const o = n[t], a = t - t % 3;
        if (l = a + (t + 2) % 3, -1 === o) {
          if (0 === h) {
            break;
          }
          t = e[--h];
          continue
        }
        const c = o - o % 3, u = a + (t + 1) % 3, _ = c + (o + 2) % 3, f = i[l], d = i[t], g = i[u], y = i[_];
        if (r(s[2 * f], s[2 * f + 1], s[2 * d], s[2 * d + 1], s[2 * g], s[2 * g + 1], s[2 * y], s[2 * y + 1])) {
          i[t] = y, i[o] = f;
          const s = n[_];
          if (-1 === s) {
            let i = this._hullStart;
            do {
              if (this._hullTri[i] === _) {
                this._hullTri[i] = t;
                break
              }
              i = this._hullPrev[i]
            } while (i !== this._hullStart)
          }
          this._link(t, s), this._link(o, n[l]), this._link(l, _);
          const r = c + (o + 1) % 3;
          h < e.length && (e[h++] = r)
        } else {
          if (0 === h) {
            break;
          }
          t = e[--h]
        }
      }
      return l
    }

    _link(t, i) {
      this._halfedges[t] = i, -1 !== i && (this._halfedges[i] = t)
    }

    _addTriangle(t, i, e, n, s, h) {
      const l = this.trianglesLen;
      return this._triangles[l] = t, this._triangles[l + 1] = i, this._triangles[l + 2] = e, this._link(l, n), this._link(l + 1, s), this._link(l + 2, h), this.trianglesLen += 3, l
    }
  }

  function s(t, i, e, n) {
    const s = t - e, h = i - n;
    return s * s + h * h
  }

  function h(t, i, e, n, s, h) {
    const l = (n - i) * (s - t), r = (e - t) * (h - i);
    return Math.abs(l - r) >= 33306690738754716e-32 * Math.abs(l + r) ? l - r : 0
  }

  function l(t, i, e, n, s, l) {
    return (h(s, l, t, i, e, n) || h(t, i, e, n, s, l) || h(e, n, s, l, t, i)) < 0
  }

  function r(t, i, e, n, s, h, l, r) {
    const o = t - l, a = i - r, c = e - l, u = n - r, _ = s - l, f = h - r, d = c * c + u * u, g = _ * _ + f * f;
    return o * (u * g - d * f) - a * (c * g - d * _) + (o * o + a * a) * (c * f - u * _) < 0
  }

  function o(t, i, e, n, s, h) {
    const l = e - t, r = n - i, o = s - t, a = h - i, c = l * l + r * r, u = o * o + a * a, _ = .5 / (l * a - r * o),
      f = (a * c - r * u) * _, d = (l * u - o * c) * _;
    return f * f + d * d
  }

  function a(t, i, e, n) {
    if (n - e <= 20) {
      for (let s = e + 1; s <= n; s++) {
        const n = t[s], h = i[n];
        let l = s - 1;
        for (; l >= e && i[t[l]] > h;) {
          t[l + 1] = t[l--];
        }
        t[l + 1] = n
      }
    } else {
      let s = e + 1, h = n;
      c(t, e + n >> 1, s), i[t[e]] > i[t[n]] && c(t, e, n), i[t[s]] > i[t[n]] && c(t, s, n), i[t[e]] > i[t[s]] && c(t, e, s);
      const l = t[s], r = i[l];
      for (; ;) {
        do {
          s++
        } while (i[t[s]] < r);
        do {
          h--
        } while (i[t[h]] > r);
        if (h < s) {
          break;
        }
        c(t, s, h)
      }
      t[e + 1] = t[h], t[h] = l, n - s + 1 >= h - e ? (a(t, i, s, n), a(t, i, e, h - 1)) : (a(t, i, e, h - 1), a(t, i, s, n))
    }
  }

  function c(t, i, e) {
    const n = t[i];
    t[i] = t[e], t[e] = n
  }

  function u(t) {
    return t[0]
  }

  function _(t) {
    return t[1]
  }

  const f = 1e-6;

  class d {
    constructor() {
      this._x0 = this._y0 = this._x1 = this._y1 = null, this._ = ""
    }

    moveTo(t, i) {
      this._ += `M${this._x0 = this._x1 = +t},${this._y0 = this._y1 = +i}`
    }

    closePath() {
      null !== this._x1 && (this._x1 = this._x0, this._y1 = this._y0, this._ += "Z")
    }

    lineTo(t, i) {
      this._ += `L${this._x1 = +t},${this._y1 = +i}`
    }

    arc(t, i, e) {
      const n = (t = +t) + (e = +e), s = i = +i;
      if (e < 0) {
        throw new Error("negative radius");
      }
      null === this._x1 ? this._ += `M${n},${s}` : (Math.abs(this._x1 - n) > f || Math.abs(this._y1 - s) > f) && (this._ += "L" + n + "," + s), e && (this._ += `A${e},${e},0,1,1,${t - e},${i}A${e},${e},0,1,1,${this._x1 = n},${this._y1 = s}`)
    }

    rect(t, i, e, n) {
      this._ += `M${this._x0 = this._x1 = +t},${this._y0 = this._y1 = +i}h${+e}v${+n}h${-e}Z`
    }

    value() {
      return this._ || null
    }
  }

  class g {
    constructor() {
      this._ = []
    }

    moveTo(t, i) {
      this._.push([t, i])
    }

    closePath() {
      this._.push(this._[0].slice())
    }

    lineTo(t, i) {
      this._.push([t, i])
    }

    value() {
      return this._.length ? this._ : null
    }
  }

  class y {
    constructor(t, [i, e, n, s] = [0, 0, 960, 500]) {
      if (!((n = +n) >= (i = +i) && (s = +s) >= (e = +e))) {
        throw new Error("invalid bounds");
      }
      this.delaunay = t, this._circumcenters = new Float64Array(2 * t.points.length), this.vectors = new Float64Array(2 * t.points.length), this.xmax = n, this.xmin = i, this.ymax = s, this.ymin = e, this._init()
    }

    update() {
      return this.delaunay.update(), this._init(), this
    }

    _init() {
      const {delaunay: {points: t, hull: i, triangles: e}, vectors: n} = this,
        s = this.circumcenters = this._circumcenters.subarray(0, e.length / 3 * 2);
      for (let i, n, h = 0, l = 0, r = e.length; h < r; h += 3, l += 2) {
        const r = 2 * e[h], o = 2 * e[h + 1], a = 2 * e[h + 2], c = t[r], u = t[r + 1], _ = t[o], f = t[o + 1],
          d = t[a], g = t[a + 1], y = _ - c, m = f - u, x = d - c, p = g - u, w = y * y + m * m, v = x * x + p * p,
          b = 2 * (y * p - m * x);
        if (b) {
          if (Math.abs(b) < 1e-8) {
            i = (c + d) / 2, n = (u + g) / 2;
          } else {
            const t = 1 / b;
            i = c + (p * w - m * v) * t, n = u + (y * v - x * w) * t
          }
        } else {
          i = (c + d) / 2 - 1e8 * p, n = (u + g) / 2 + 1e8 * x;
        }
        s[l] = i, s[l + 1] = n
      }
      let h, l, r, o = i[i.length - 1], a = 4 * o, c = t[2 * o], u = t[2 * o + 1];
      n.fill(0);
      for (let e = 0; e < i.length; ++e) {
        h = a, l = c, r = u, a = 4 * (o = i[e]), c = t[2 * o], u = t[2 * o + 1], n[h + 2] = n[a] = r - u, n[h + 3] = n[a + 1] = c - l
      }
    }

    render(t) {
      const i = null == t ? t = new d : void 0, {
        delaunay: {halfedges: e, inedges: n, hull: s},
        circumcenters: h,
        vectors: l
      } = this;
      if (s.length <= 1) {
        return null;
      }
      for (let i = 0, n = e.length; i < n; ++i) {
        const n = e[i];
        if (n < i) {
          continue;
        }
        const s = 2 * Math.floor(i / 3), l = 2 * Math.floor(n / 3), r = h[s], o = h[s + 1], a = h[l], c = h[l + 1];
        this._renderSegment(r, o, a, c, t)
      }
      let r, o = s[s.length - 1];
      for (let i = 0; i < s.length; ++i) {
        r = o, o = s[i];
        const e = 2 * Math.floor(n[o] / 3), a = h[e], c = h[e + 1], u = 4 * r,
          _ = this._project(a, c, l[u + 2], l[u + 3]);
        _ && this._renderSegment(a, c, _[0], _[1], t)
      }
      return i && i.value()
    }

    renderBounds(t) {
      const i = null == t ? t = new d : void 0;
      return t.rect(this.xmin, this.ymin, this.xmax - this.xmin, this.ymax - this.ymin), i && i.value()
    }

    renderCell(t, i) {
      const e = null == i ? i = new d : void 0, n = this._clip(t);
      if (null === n || !n.length) {
        return;
      }
      i.moveTo(n[0], n[1]);
      let s = n.length;
      for (; n[0] === n[s - 2] && n[1] === n[s - 1] && s > 1;) {
        s -= 2;
      }
      for (let t = 2; t < s; t += 2) {
        n[t] === n[t - 2] && n[t + 1] === n[t - 1] || i.lineTo(n[t], n[t + 1]);
      }
      return i.closePath(), e && e.value()
    }

    * cellPolygons() {
      const {delaunay: {points: t}} = this;
      for (let i = 0, e = t.length / 2; i < e; ++i) {
        const t = this.cellPolygon(i);
        t && (t.index = i, yield t)
      }
    }

    cellPolygon(t) {
      const i = new g;
      return this.renderCell(t, i), i.value()
    }

    _renderSegment(t, i, e, n, s) {
      let h;
      const l = this._regioncode(t, i), r = this._regioncode(e, n);
      0 === l && 0 === r ? (s.moveTo(t, i), s.lineTo(e, n)) : (h = this._clipSegment(t, i, e, n, l, r)) && (s.moveTo(h[0], h[1]), s.lineTo(h[2], h[3]))
    }

    contains(t, i, e) {
      return (i = +i) == i && (e = +e) == e && this.delaunay._step(t, i, e) === t
    }

    * neighbors(t) {
      const i = this._clip(t);
      if (i) {
        for (const e of this.delaunay.neighbors(t)) {
          const t = this._clip(e);
          if (t) {
            t:for (let n = 0, s = i.length; n < s; n += 2) {
              for (let h = 0, l = t.length; h < l; h += 2) {
                if (i[n] == t[h] && i[n + 1] == t[h + 1] && i[(n + 2) % s] == t[(h + l - 2) % l] && i[(n + 3) % s] == t[(h + l - 1) % l]) {
                  yield e;
                  break t
                }
              }
            }
          }
        }
      }
    }

    _cell(t) {
      const {circumcenters: i, delaunay: {inedges: e, halfedges: n, triangles: s}} = this, h = e[t];
      if (-1 === h) {
        return null;
      }
      const l = [];
      let r = h;
      do {
        const e = Math.floor(r / 3);
        if (l.push(i[2 * e], i[2 * e + 1]), s[r = r % 3 == 2 ? r - 2 : r + 1] !== t) {
          break;
        }
        r = n[r]
      } while (r !== h && -1 !== r);
      return l
    }

    _clip(t) {
      if (0 === t && 1 === this.delaunay.hull.length) {
        return [this.xmax, this.ymin, this.xmax, this.ymax, this.xmin, this.ymax, this.xmin, this.ymin];
      }
      const i = this._cell(t);
      if (null === i) {
        return null;
      }
      const {vectors: e} = this, n = 4 * t;
      return e[n] || e[n + 1] ? this._clipInfinite(t, i, e[n], e[n + 1], e[n + 2], e[n + 3]) : this._clipFinite(t, i)
    }

    _clipFinite(t, i) {
      const e = i.length;
      let n, s, h, l, r, o = null, a = i[e - 2], c = i[e - 1], u = this._regioncode(a, c);
      for (let _ = 0; _ < e; _ += 2) {
        if (n = a, s = c, a = i[_], c = i[_ + 1], h = u, u = this._regioncode(a, c), 0 === h && 0 === u) {
          l = r, r = 0, o ? o.push(a, c) : o = [a, c];
        } else {
          let i, e, _, f, d;
          if (0 === h) {
            if (null === (i = this._clipSegment(n, s, a, c, h, u))) {
              continue;
            }
            [e, _, f, d] = i
          } else {
            if (null === (i = this._clipSegment(a, c, n, s, u, h))) {
              continue;
            }
            [f, d, e, _] = i, l = r, r = this._edgecode(e, _), l && r && this._edge(t, l, r, o, o.length), o ? o.push(e, _) : o = [e, _]
          }
          l = r, r = this._edgecode(f, d), l && r && this._edge(t, l, r, o, o.length), o ? o.push(f, d) : o = [f, d]
        }
      }
      if (o) {
        l = r, r = this._edgecode(o[0], o[1]), l && r && this._edge(t, l, r, o, o.length);
      } else if (this.contains(t, (this.xmin + this.xmax) / 2, (this.ymin + this.ymax) / 2)) {
        return [this.xmax, this.ymin, this.xmax, this.ymax, this.xmin, this.ymax, this.xmin, this.ymin];
      }
      return o
    }

    _clipSegment(t, i, e, n, s, h) {
      for (; ;) {
        if (0 === s && 0 === h) {
          return [t, i, e, n];
        }
        if (s & h) {
          return null;
        }
        let l, r, o = s || h;
        8 & o ? (l = t + (e - t) * (this.ymax - i) / (n - i), r = this.ymax) : 4 & o ? (l = t + (e - t) * (this.ymin - i) / (n - i), r = this.ymin) : 2 & o ? (r = i + (n - i) * (this.xmax - t) / (e - t), l = this.xmax) : (r = i + (n - i) * (this.xmin - t) / (e - t), l = this.xmin), s ? (t = l, i = r, s = this._regioncode(t, i)) : (e = l, n = r, h = this._regioncode(e, n))
      }
    }

    _clipInfinite(t, i, e, n, s, h) {
      let l, r = Array.from(i);
      if ((l = this._project(r[0], r[1], e, n)) && r.unshift(l[0], l[1]), (l = this._project(r[r.length - 2], r[r.length - 1], s, h)) && r.push(l[0], l[1]), r = this._clipFinite(t, r)) {
        for (let i, e = 0, n = r.length, s = this._edgecode(r[n - 2], r[n - 1]); e < n; e += 2) {
          i = s, s = this._edgecode(r[e], r[e + 1]), i && s && (e = this._edge(t, i, s, r, e), n = r.length);
        }
      } else {
        this.contains(t, (this.xmin + this.xmax) / 2, (this.ymin + this.ymax) / 2) && (r = [this.xmin, this.ymin, this.xmax, this.ymin, this.xmax, this.ymax, this.xmin, this.ymax]);
      }
      return r
    }

    _edge(t, i, e, n, s) {
      for (; i !== e;) {
        let e, h;
        switch (i) {
          case 5:
            i = 4;
            continue;
          case 4:
            i = 6, e = this.xmax, h = this.ymin;
            break;
          case 6:
            i = 2;
            continue;
          case 2:
            i = 10, e = this.xmax, h = this.ymax;
            break;
          case 10:
            i = 8;
            continue;
          case 8:
            i = 9, e = this.xmin, h = this.ymax;
            break;
          case 9:
            i = 1;
            continue;
          case 1:
            i = 5, e = this.xmin, h = this.ymin
        }
        n[s] === e && n[s + 1] === h || !this.contains(t, e, h) || (n.splice(s, 0, e, h), s += 2)
      }
      if (n.length > 4) {
        for (let t = 0; t < n.length; t += 2) {
          const i = (t + 2) % n.length, e = (t + 4) % n.length;
          (n[t] === n[i] && n[i] === n[e] || n[t + 1] === n[i + 1] && n[i + 1] === n[e + 1]) && (n.splice(i, 2), t -= 2)
        }
      }
      return s
    }

    _project(t, i, e, n) {
      let s, h, l, r = 1 / 0;
      if (n < 0) {
        if (i <= this.ymin) {
          return null;
        }
        (s = (this.ymin - i) / n) < r && (l = this.ymin, h = t + (r = s) * e)
      } else if (n > 0) {
        if (i >= this.ymax) {
          return null;
        }
        (s = (this.ymax - i) / n) < r && (l = this.ymax, h = t + (r = s) * e)
      }
      if (e > 0) {
        if (t >= this.xmax) {
          return null;
        }
        (s = (this.xmax - t) / e) < r && (h = this.xmax, l = i + (r = s) * n)
      } else if (e < 0) {
        if (t <= this.xmin) {
          return null;
        }
        (s = (this.xmin - t) / e) < r && (h = this.xmin, l = i + (r = s) * n)
      }
      return [h, l]
    }

    _edgecode(t, i) {
      return (t === this.xmin ? 1 : t === this.xmax ? 2 : 0) | (i === this.ymin ? 4 : i === this.ymax ? 8 : 0)
    }

    _regioncode(t, i) {
      return (t < this.xmin ? 1 : t > this.xmax ? 2 : 0) | (i < this.ymin ? 4 : i > this.ymax ? 8 : 0)
    }
  }

  const m = 2 * Math.PI, x = Math.pow;

  function p(t) {
    return t[0]
  }

  function w(t) {
    return t[1]
  }

  function v(t, i, e) {
    return [t + Math.sin(t + i) * e, i + Math.cos(t - i) * e]
  }

  class b {
    static from(t, i = p, e = w, n) {
      return new b("length" in t ? function (t, i, e, n) {
        const s = t.length, h = new Float64Array(2 * s);
        for (let l = 0; l < s; ++l) {
          const s = t[l];
          h[2 * l] = i.call(n, s, l, t), h[2 * l + 1] = e.call(n, s, l, t)
        }
        return h
      }(t, i, e, n) : Float64Array.from(function* (t, i, e, n) {
        let s = 0;
        for (const h of t) {
          yield i.call(n, h, s, t), yield e.call(n, h, s, t), ++s
        }
      }(t, i, e, n)))
    }

    constructor(t) {
      this._delaunator = new n(t), this.inedges = new Int32Array(t.length / 2), this._hullIndex = new Int32Array(t.length / 2), this.points = this._delaunator.coords, this._init()
    }

    update() {
      return this._delaunator.update(), this._init(), this
    }

    _init() {
      const t = this._delaunator, i = this.points;
      if (t.hull && t.hull.length > 2 && function (t) {
        const {triangles: i, coords: e} = t;
        for (let t = 0; t < i.length; t += 3) {
          const n = 2 * i[t], s = 2 * i[t + 1], h = 2 * i[t + 2];
          if ((e[h] - e[n]) * (e[s + 1] - e[n + 1]) - (e[s] - e[n]) * (e[h + 1] - e[n + 1]) > 1e-10) {
            return !1
          }
        }
        return !0
      }(t)) {
        this.collinear = Int32Array.from({length: i.length / 2}, (t, i) => i).sort((t, e) => i[2 * t] - i[2 * e] || i[2 * t + 1] - i[2 * e + 1]);
        const t = this.collinear[0], e = this.collinear[this.collinear.length - 1],
          s = [i[2 * t], i[2 * t + 1], i[2 * e], i[2 * e + 1]], h = 1e-8 * Math.hypot(s[3] - s[1], s[2] - s[0]);
        for (let t = 0, e = i.length / 2; t < e; ++t) {
          const e = v(i[2 * t], i[2 * t + 1], h);
          i[2 * t] = e[0], i[2 * t + 1] = e[1]
        }
        this._delaunator = new n(i)
      } else {
        delete this.collinear;
      }
      const e = this.halfedges = this._delaunator.halfedges, s = this.hull = this._delaunator.hull,
        h = this.triangles = this._delaunator.triangles, l = this.inedges.fill(-1), r = this._hullIndex.fill(-1);
      for (let t = 0, i = e.length; t < i; ++t) {
        const i = h[t % 3 == 2 ? t - 2 : t + 1];
        -1 !== e[t] && -1 !== l[i] || (l[i] = t)
      }
      for (let t = 0, i = s.length; t < i; ++t) {
        r[s[t]] = t;
      }
      s.length <= 2 && s.length > 0 && (this.triangles = new Int32Array(3).fill(-1), this.halfedges = new Int32Array(3).fill(-1), this.triangles[0] = s[0], this.triangles[1] = s[1], this.triangles[2] = s[1], l[s[0]] = 1, 2 === s.length && (l[s[1]] = 0))
    }

    voronoi(t) {
      return new y(this, t)
    }

    * neighbors(t) {
      const {inedges: i, hull: e, _hullIndex: n, halfedges: s, triangles: h, collinear: l} = this;
      if (l) {
        const i = l.indexOf(t);
        return i > 0 && (yield l[i - 1]), void (i < l.length - 1 && (yield l[i + 1]))
      }
      const r = i[t];
      if (-1 === r) {
        return;
      }
      let o = r, a = -1;
      do {
        if (yield a = h[o], h[o = o % 3 == 2 ? o - 2 : o + 1] !== t) {
          return;
        }
        if (-1 === (o = s[o])) {
          const i = e[(n[t] + 1) % e.length];
          return void (i !== a && (yield i))
        }
      } while (o !== r)
    }

    find(t, i, e = 0) {
      if ((t = +t) != t || (i = +i) != i) {
        return -1;
      }
      const n = e;
      let s;
      for (; (s = this._step(e, t, i)) >= 0 && s !== e && s !== n;) {
        e = s;
      }
      return s
    }

    _step(t, i, e) {
      const {inedges: n, hull: s, _hullIndex: h, halfedges: l, triangles: r, points: o} = this;
      if (-1 === n[t] || !o.length) {
        return (t + 1) % (o.length >> 1);
      }
      let a = t, c = x(i - o[2 * t], 2) + x(e - o[2 * t + 1], 2);
      const u = n[t];
      let _ = u;
      do {
        let n = r[_];
        const u = x(i - o[2 * n], 2) + x(e - o[2 * n + 1], 2);
        if (u < c && (c = u, a = n), r[_ = _ % 3 == 2 ? _ - 2 : _ + 1] !== t) {
          break;
        }
        if (-1 === (_ = l[_])) {
          if ((_ = s[(h[t] + 1) % s.length]) !== n && x(i - o[2 * _], 2) + x(e - o[2 * _ + 1], 2) < c) {
            return _;
          }
          break
        }
      } while (_ !== u);
      return a
    }

    render(t) {
      const i = null == t ? t = new d : void 0, {points: e, halfedges: n, triangles: s} = this;
      for (let i = 0, h = n.length; i < h; ++i) {
        const h = n[i];
        if (h < i) {
          continue;
        }
        const l = 2 * s[i], r = 2 * s[h];
        t.moveTo(e[l], e[l + 1]), t.lineTo(e[r], e[r + 1])
      }
      return this.renderHull(t), i && i.value()
    }

    renderPoints(t, i = 2) {
      const e = null == t ? t = new d : void 0, {points: n} = this;
      for (let e = 0, s = n.length; e < s; e += 2) {
        const s = n[e], h = n[e + 1];
        t.moveTo(s + i, h), t.arc(s, h, i, 0, m)
      }
      return e && e.value()
    }

    renderHull(t) {
      const i = null == t ? t = new d : void 0, {hull: e, points: n} = this, s = 2 * e[0], h = e.length;
      t.moveTo(n[s], n[s + 1]);
      for (let i = 1; i < h; ++i) {
        const s = 2 * e[i];
        t.lineTo(n[s], n[s + 1])
      }
      return t.closePath(), i && i.value()
    }

    hullPolygon() {
      const t = new g;
      return this.renderHull(t), t.value()
    }

    renderTriangle(t, i) {
      const e = null == i ? i = new d : void 0, {points: n, triangles: s} = this, h = 2 * s[t *= 3], l = 2 * s[t + 1],
        r = 2 * s[t + 2];
      return i.moveTo(n[h], n[h + 1]), i.lineTo(n[l], n[l + 1]), i.lineTo(n[r], n[r + 1]), i.closePath(), e && e.value()
    }

    * trianglePolygons() {
      const {triangles: t} = this;
      for (let i = 0, e = t.length / 3; i < e; ++i) {
        yield this.trianglePolygon(i)
      }
    }

    trianglePolygon(t) {
      const i = new g;
      return this.renderTriangle(t, i), i.value()
    }
  }

  t.Delaunay = b, t.Voronoi = y, Object.defineProperty(t, "__esModule", {value: !0})
});
