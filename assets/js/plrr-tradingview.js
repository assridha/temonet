function y(n) {
  var t = n.width, i = n.height;
  if (t < 0)
    throw new Error("Negative width is not allowed for Size");
  if (i < 0)
    throw new Error("Negative height is not allowed for Size");
  return {
    width: t,
    height: i
  };
}
function F(n, t) {
  return n.width === t.width && n.height === t.height;
}
var Js = (
  /** @class */
  function() {
    function n(t) {
      var i = this;
      this._resolutionListener = function() {
        return i._onResolutionChanged();
      }, this._resolutionMediaQueryList = null, this._observers = [], this._window = t, this._installResolutionListener();
    }
    return n.prototype.dispose = function() {
      this._uninstallResolutionListener(), this._window = null;
    }, Object.defineProperty(n.prototype, "value", {
      get: function() {
        return this._window.devicePixelRatio;
      },
      enumerable: !1,
      configurable: !0
    }), n.prototype.subscribe = function(t) {
      var i = this, s = { next: t };
      return this._observers.push(s), {
        unsubscribe: function() {
          i._observers = i._observers.filter(function(e) {
            return e !== s;
          });
        }
      };
    }, n.prototype._installResolutionListener = function() {
      if (this._resolutionMediaQueryList !== null)
        throw new Error("Resolution listener is already installed");
      var t = this._window.devicePixelRatio;
      this._resolutionMediaQueryList = this._window.matchMedia("all and (resolution: ".concat(t, "dppx)")), this._resolutionMediaQueryList.addListener(this._resolutionListener);
    }, n.prototype._uninstallResolutionListener = function() {
      this._resolutionMediaQueryList !== null && (this._resolutionMediaQueryList.removeListener(this._resolutionListener), this._resolutionMediaQueryList = null);
    }, n.prototype._reinstallResolutionListener = function() {
      this._uninstallResolutionListener(), this._installResolutionListener();
    }, n.prototype._onResolutionChanged = function() {
      var t = this;
      this._observers.forEach(function(i) {
        return i.next(t._window.devicePixelRatio);
      }), this._reinstallResolutionListener();
    }, n;
  }()
);
function Hs(n) {
  return new Js(n);
}
var Zs = (
  /** @class */
  function() {
    function n(t, i, s) {
      var e;
      this._canvasElement = null, this._bitmapSizeChangedListeners = [], this._suggestedBitmapSize = null, this._suggestedBitmapSizeChangedListeners = [], this._devicePixelRatioObservable = null, this._canvasElementResizeObserver = null, this._canvasElement = t, this._canvasElementClientSize = y({
        width: this._canvasElement.clientWidth,
        height: this._canvasElement.clientHeight
      }), this._transformBitmapSize = i ?? function(h) {
        return h;
      }, this._allowResizeObserver = (e = s == null ? void 0 : s.allowResizeObserver) !== null && e !== void 0 ? e : !0, this._chooseAndInitObserver();
    }
    return n.prototype.dispose = function() {
      var t, i;
      if (this._canvasElement === null)
        throw new Error("Object is disposed");
      (t = this._canvasElementResizeObserver) === null || t === void 0 || t.disconnect(), this._canvasElementResizeObserver = null, (i = this._devicePixelRatioObservable) === null || i === void 0 || i.dispose(), this._devicePixelRatioObservable = null, this._suggestedBitmapSizeChangedListeners.length = 0, this._bitmapSizeChangedListeners.length = 0, this._canvasElement = null;
    }, Object.defineProperty(n.prototype, "canvasElement", {
      get: function() {
        if (this._canvasElement === null)
          throw new Error("Object is disposed");
        return this._canvasElement;
      },
      enumerable: !1,
      configurable: !0
    }), Object.defineProperty(n.prototype, "canvasElementClientSize", {
      get: function() {
        return this._canvasElementClientSize;
      },
      enumerable: !1,
      configurable: !0
    }), Object.defineProperty(n.prototype, "bitmapSize", {
      get: function() {
        return y({
          width: this.canvasElement.width,
          height: this.canvasElement.height
        });
      },
      enumerable: !1,
      configurable: !0
    }), n.prototype.resizeCanvasElement = function(t) {
      this._canvasElementClientSize = y(t), this.canvasElement.style.width = "".concat(this._canvasElementClientSize.width, "px"), this.canvasElement.style.height = "".concat(this._canvasElementClientSize.height, "px"), this._invalidateBitmapSize();
    }, n.prototype.subscribeBitmapSizeChanged = function(t) {
      this._bitmapSizeChangedListeners.push(t);
    }, n.prototype.unsubscribeBitmapSizeChanged = function(t) {
      this._bitmapSizeChangedListeners = this._bitmapSizeChangedListeners.filter(function(i) {
        return i !== t;
      });
    }, Object.defineProperty(n.prototype, "suggestedBitmapSize", {
      get: function() {
        return this._suggestedBitmapSize;
      },
      enumerable: !1,
      configurable: !0
    }), n.prototype.subscribeSuggestedBitmapSizeChanged = function(t) {
      this._suggestedBitmapSizeChangedListeners.push(t);
    }, n.prototype.unsubscribeSuggestedBitmapSizeChanged = function(t) {
      this._suggestedBitmapSizeChangedListeners = this._suggestedBitmapSizeChangedListeners.filter(function(i) {
        return i !== t;
      });
    }, n.prototype.applySuggestedBitmapSize = function() {
      if (this._suggestedBitmapSize !== null) {
        var t = this._suggestedBitmapSize;
        this._suggestedBitmapSize = null, this._resizeBitmap(t), this._emitSuggestedBitmapSizeChanged(t, this._suggestedBitmapSize);
      }
    }, n.prototype._resizeBitmap = function(t) {
      var i = this.bitmapSize;
      F(i, t) || (this.canvasElement.width = t.width, this.canvasElement.height = t.height, this._emitBitmapSizeChanged(i, t));
    }, n.prototype._emitBitmapSizeChanged = function(t, i) {
      var s = this;
      this._bitmapSizeChangedListeners.forEach(function(e) {
        return e.call(s, t, i);
      });
    }, n.prototype._suggestNewBitmapSize = function(t) {
      var i = this._suggestedBitmapSize, s = y(this._transformBitmapSize(t, this._canvasElementClientSize)), e = F(this.bitmapSize, s) ? null : s;
      i === null && e === null || i !== null && e !== null && F(i, e) || (this._suggestedBitmapSize = e, this._emitSuggestedBitmapSizeChanged(i, e));
    }, n.prototype._emitSuggestedBitmapSizeChanged = function(t, i) {
      var s = this;
      this._suggestedBitmapSizeChangedListeners.forEach(function(e) {
        return e.call(s, t, i);
      });
    }, n.prototype._chooseAndInitObserver = function() {
      var t = this;
      if (!this._allowResizeObserver) {
        this._initDevicePixelRatioObservable();
        return;
      }
      Gs().then(function(i) {
        return i ? t._initResizeObserver() : t._initDevicePixelRatioObservable();
      });
    }, n.prototype._initDevicePixelRatioObservable = function() {
      var t = this;
      if (this._canvasElement !== null) {
        var i = zi(this._canvasElement);
        if (i === null)
          throw new Error("No window is associated with the canvas");
        this._devicePixelRatioObservable = Hs(i), this._devicePixelRatioObservable.subscribe(function() {
          return t._invalidateBitmapSize();
        }), this._invalidateBitmapSize();
      }
    }, n.prototype._invalidateBitmapSize = function() {
      var t, i;
      if (this._canvasElement !== null) {
        var s = zi(this._canvasElement);
        if (s !== null) {
          var e = (i = (t = this._devicePixelRatioObservable) === null || t === void 0 ? void 0 : t.value) !== null && i !== void 0 ? i : s.devicePixelRatio, h = this._canvasElement.getClientRects(), r = (
            // eslint-disable-next-line no-negated-condition
            h[0] !== void 0 ? qs(h[0], e) : y({
              width: this._canvasElementClientSize.width * e,
              height: this._canvasElementClientSize.height * e
            })
          );
          this._suggestNewBitmapSize(r);
        }
      }
    }, n.prototype._initResizeObserver = function() {
      var t = this;
      this._canvasElement !== null && (this._canvasElementResizeObserver = new ResizeObserver(function(i) {
        var s = i.find(function(r) {
          return r.target === t._canvasElement;
        });
        if (!(!s || !s.devicePixelContentBoxSize || !s.devicePixelContentBoxSize[0])) {
          var e = s.devicePixelContentBoxSize[0], h = y({
            width: e.inlineSize,
            height: e.blockSize
          });
          t._suggestNewBitmapSize(h);
        }
      }), this._canvasElementResizeObserver.observe(this._canvasElement, { box: "device-pixel-content-box" }));
    }, n;
  }()
);
function Ys(n, t) {
  if (t.type === "device-pixel-content-box")
    return new Zs(n, t.transform, t.options);
  throw new Error("Unsupported binding target");
}
function zi(n) {
  return n.ownerDocument.defaultView;
}
function Gs() {
  return new Promise(function(n) {
    var t = new ResizeObserver(function(i) {
      n(i.every(function(s) {
        return "devicePixelContentBoxSize" in s;
      })), t.disconnect();
    });
    t.observe(document.body, { box: "device-pixel-content-box" });
  }).catch(function() {
    return !1;
  });
}
function qs(n, t) {
  return y({
    width: Math.round(n.left * t + n.width * t) - Math.round(n.left * t),
    height: Math.round(n.top * t + n.height * t) - Math.round(n.top * t)
  });
}
var Qs = (
  /** @class */
  function() {
    function n(t, i, s) {
      if (i.width === 0 || i.height === 0)
        throw new TypeError("Rendering target could only be created on a media with positive width and height");
      if (this._mediaSize = i, s.width === 0 || s.height === 0)
        throw new TypeError("Rendering target could only be created using a bitmap with positive integer width and height");
      this._bitmapSize = s, this._context = t;
    }
    return n.prototype.useMediaCoordinateSpace = function(t) {
      try {
        return this._context.save(), this._context.setTransform(1, 0, 0, 1, 0, 0), this._context.scale(this._horizontalPixelRatio, this._verticalPixelRatio), t({
          context: this._context,
          mediaSize: this._mediaSize
        });
      } finally {
        this._context.restore();
      }
    }, n.prototype.useBitmapCoordinateSpace = function(t) {
      try {
        return this._context.save(), this._context.setTransform(1, 0, 0, 1, 0, 0), t({
          context: this._context,
          mediaSize: this._mediaSize,
          bitmapSize: this._bitmapSize,
          horizontalPixelRatio: this._horizontalPixelRatio,
          verticalPixelRatio: this._verticalPixelRatio
        });
      } finally {
        this._context.restore();
      }
    }, Object.defineProperty(n.prototype, "_horizontalPixelRatio", {
      get: function() {
        return this._bitmapSize.width / this._mediaSize.width;
      },
      enumerable: !1,
      configurable: !0
    }), Object.defineProperty(n.prototype, "_verticalPixelRatio", {
      get: function() {
        return this._bitmapSize.height / this._mediaSize.height;
      },
      enumerable: !1,
      configurable: !0
    }), n;
  }()
);
function A(n, t) {
  var i = n.canvasElementClientSize;
  if (i.width === 0 || i.height === 0)
    return null;
  var s = n.bitmapSize;
  if (s.width === 0 || s.height === 0)
    return null;
  var e = n.canvasElement.getContext("2d", t);
  return e === null ? null : new Qs(e, i, s);
}
/*!
 * @license
 * TradingView Lightweight Charts™ v4.2.1
 * Copyright (c) 2024 TradingView, Inc.
 * Licensed under Apache License 2.0 https://www.apache.org/licenses/LICENSE-2.0
 */
const te = { upColor: "#26a69a", downColor: "#ef5350", wickVisible: !0, borderVisible: !0, borderColor: "#378658", borderUpColor: "#26a69a", borderDownColor: "#ef5350", wickColor: "#737375", wickUpColor: "#26a69a", wickDownColor: "#ef5350" }, ie = { upColor: "#26a69a", downColor: "#ef5350", openVisible: !0, thinBars: !0 }, se = { color: "#2196f3", lineStyle: 0, lineWidth: 3, lineType: 0, lineVisible: !0, crosshairMarkerVisible: !0, crosshairMarkerRadius: 4, crosshairMarkerBorderColor: "", crosshairMarkerBorderWidth: 2, crosshairMarkerBackgroundColor: "", lastPriceAnimation: 0, pointMarkersVisible: !1 }, ee = { topColor: "rgba( 46, 220, 135, 0.4)", bottomColor: "rgba( 40, 221, 100, 0)", invertFilledArea: !1, lineColor: "#33D778", lineStyle: 0, lineWidth: 3, lineType: 0, lineVisible: !0, crosshairMarkerVisible: !0, crosshairMarkerRadius: 4, crosshairMarkerBorderColor: "", crosshairMarkerBorderWidth: 2, crosshairMarkerBackgroundColor: "", lastPriceAnimation: 0, pointMarkersVisible: !1 }, ne = { baseValue: { type: "price", price: 0 }, topFillColor1: "rgba(38, 166, 154, 0.28)", topFillColor2: "rgba(38, 166, 154, 0.05)", topLineColor: "rgba(38, 166, 154, 1)", bottomFillColor1: "rgba(239, 83, 80, 0.05)", bottomFillColor2: "rgba(239, 83, 80, 0.28)", bottomLineColor: "rgba(239, 83, 80, 1)", lineWidth: 3, lineStyle: 0, lineType: 0, lineVisible: !0, crosshairMarkerVisible: !0, crosshairMarkerRadius: 4, crosshairMarkerBorderColor: "", crosshairMarkerBorderWidth: 2, crosshairMarkerBackgroundColor: "", lastPriceAnimation: 0, pointMarkersVisible: !1 }, he = { color: "#26a69a", base: 0 }, Ss = { color: "#2196f3" }, ys = { title: "", visible: !0, lastValueVisible: !0, priceLineVisible: !0, priceLineSource: 0, priceLineWidth: 1, priceLineColor: "", priceLineStyle: 2, baseLineVisible: !0, baseLineWidth: 1, baseLineColor: "#B2B5BE", baseLineStyle: 0, priceFormat: { type: "price", precision: 2, minMove: 0.01 } };
var Ci, Li;
function K(n, t) {
  const i = { 0: [], 1: [n.lineWidth, n.lineWidth], 2: [2 * n.lineWidth, 2 * n.lineWidth], 3: [6 * n.lineWidth, 6 * n.lineWidth], 4: [n.lineWidth, 4 * n.lineWidth] }[t];
  n.setLineDash(i);
}
function Ms(n, t, i, s) {
  n.beginPath();
  const e = n.lineWidth % 2 ? 0.5 : 0;
  n.moveTo(i, t + e), n.lineTo(s, t + e), n.stroke();
}
function I(n, t) {
  if (!n) throw new Error("Assertion failed" + (t ? ": " + t : ""));
}
function k(n) {
  if (n === void 0) throw new Error("Value is undefined");
  return n;
}
function v(n) {
  if (n === null) throw new Error("Value is null");
  return n;
}
function Z(n) {
  return v(k(n));
}
(function(n) {
  n[n.Simple = 0] = "Simple", n[n.WithSteps = 1] = "WithSteps", n[n.Curved = 2] = "Curved";
})(Ci || (Ci = {})), function(n) {
  n[n.Solid = 0] = "Solid", n[n.Dotted = 1] = "Dotted", n[n.Dashed = 2] = "Dashed", n[n.LargeDashed = 3] = "LargeDashed", n[n.SparseDotted = 4] = "SparseDotted";
}(Li || (Li = {}));
const ki = { khaki: "#f0e68c", azure: "#f0ffff", aliceblue: "#f0f8ff", ghostwhite: "#f8f8ff", gold: "#ffd700", goldenrod: "#daa520", gainsboro: "#dcdcdc", gray: "#808080", green: "#008000", honeydew: "#f0fff0", floralwhite: "#fffaf0", lightblue: "#add8e6", lightcoral: "#f08080", lemonchiffon: "#fffacd", hotpink: "#ff69b4", lightyellow: "#ffffe0", greenyellow: "#adff2f", lightgoldenrodyellow: "#fafad2", limegreen: "#32cd32", linen: "#faf0e6", lightcyan: "#e0ffff", magenta: "#f0f", maroon: "#800000", olive: "#808000", orange: "#ffa500", oldlace: "#fdf5e6", mediumblue: "#0000cd", transparent: "#0000", lime: "#0f0", lightpink: "#ffb6c1", mistyrose: "#ffe4e1", moccasin: "#ffe4b5", midnightblue: "#191970", orchid: "#da70d6", mediumorchid: "#ba55d3", mediumturquoise: "#48d1cc", orangered: "#ff4500", royalblue: "#4169e1", powderblue: "#b0e0e6", red: "#f00", coral: "#ff7f50", turquoise: "#40e0d0", white: "#fff", whitesmoke: "#f5f5f5", wheat: "#f5deb3", teal: "#008080", steelblue: "#4682b4", bisque: "#ffe4c4", aquamarine: "#7fffd4", aqua: "#0ff", sienna: "#a0522d", silver: "#c0c0c0", springgreen: "#00ff7f", antiquewhite: "#faebd7", burlywood: "#deb887", brown: "#a52a2a", beige: "#f5f5dc", chocolate: "#d2691e", chartreuse: "#7fff00", cornflowerblue: "#6495ed", cornsilk: "#fff8dc", crimson: "#dc143c", cadetblue: "#5f9ea0", tomato: "#ff6347", fuchsia: "#f0f", blue: "#00f", salmon: "#fa8072", blanchedalmond: "#ffebcd", slateblue: "#6a5acd", slategray: "#708090", thistle: "#d8bfd8", tan: "#d2b48c", cyan: "#0ff", darkblue: "#00008b", darkcyan: "#008b8b", darkgoldenrod: "#b8860b", darkgray: "#a9a9a9", blueviolet: "#8a2be2", black: "#000", darkmagenta: "#8b008b", darkslateblue: "#483d8b", darkkhaki: "#bdb76b", darkorchid: "#9932cc", darkorange: "#ff8c00", darkgreen: "#006400", darkred: "#8b0000", dodgerblue: "#1e90ff", darkslategray: "#2f4f4f", dimgray: "#696969", deepskyblue: "#00bfff", firebrick: "#b22222", forestgreen: "#228b22", indigo: "#4b0082", ivory: "#fffff0", lavenderblush: "#fff0f5", feldspar: "#d19275", indianred: "#cd5c5c", lightgreen: "#90ee90", lightgrey: "#d3d3d3", lightskyblue: "#87cefa", lightslategray: "#789", lightslateblue: "#8470ff", snow: "#fffafa", lightseagreen: "#20b2aa", lightsalmon: "#ffa07a", darksalmon: "#e9967a", darkviolet: "#9400d3", mediumpurple: "#9370d8", mediumaquamarine: "#66cdaa", skyblue: "#87ceeb", lavender: "#e6e6fa", lightsteelblue: "#b0c4de", mediumvioletred: "#c71585", mintcream: "#f5fffa", navajowhite: "#ffdead", navy: "#000080", olivedrab: "#6b8e23", palevioletred: "#d87093", violetred: "#d02090", yellow: "#ff0", yellowgreen: "#9acd32", lawngreen: "#7cfc00", pink: "#ffc0cb", paleturquoise: "#afeeee", palegoldenrod: "#eee8aa", darkolivegreen: "#556b2f", darkseagreen: "#8fbc8f", darkturquoise: "#00ced1", peachpuff: "#ffdab9", deeppink: "#ff1493", violet: "#ee82ee", palegreen: "#98fb98", mediumseagreen: "#3cb371", peru: "#cd853f", saddlebrown: "#8b4513", sandybrown: "#f4a460", rosybrown: "#bc8f8f", purple: "#800080", seagreen: "#2e8b57", seashell: "#fff5ee", papayawhip: "#ffefd5", mediumslateblue: "#7b68ee", plum: "#dda0dd", mediumspringgreen: "#00fa9a" };
function T(n) {
  return n < 0 ? 0 : n > 255 ? 255 : Math.round(n) || 0;
}
function _s(n) {
  return n <= 0 || n > 1 ? Math.min(Math.max(n, 0), 1) : Math.round(1e4 * n) / 1e4;
}
const re = /^#([0-9a-f])([0-9a-f])([0-9a-f])([0-9a-f])?$/i, oe = /^#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})?$/i, le = /^rgb\(\s*(-?\d{1,10})\s*,\s*(-?\d{1,10})\s*,\s*(-?\d{1,10})\s*\)$/, ae = /^rgba\(\s*(-?\d{1,10})\s*,\s*(-?\d{1,10})\s*,\s*(-?\d{1,10})\s*,\s*(-?\d*\.?\d+)\s*\)$/;
function ot(n) {
  (n = n.toLowerCase()) in ki && (n = ki[n]);
  {
    const t = ae.exec(n) || le.exec(n);
    if (t) return [T(parseInt(t[1], 10)), T(parseInt(t[2], 10)), T(parseInt(t[3], 10)), _s(t.length < 5 ? 1 : parseFloat(t[4]))];
  }
  {
    const t = oe.exec(n);
    if (t) return [T(parseInt(t[1], 16)), T(parseInt(t[2], 16)), T(parseInt(t[3], 16)), 1];
  }
  {
    const t = re.exec(n);
    if (t) return [T(17 * parseInt(t[1], 16)), T(17 * parseInt(t[2], 16)), T(17 * parseInt(t[3], 16)), 1];
  }
  throw new Error(`Cannot parse color: ${n}`);
}
function xs(n) {
  return 0.199 * n[0] + 0.687 * n[1] + 0.114 * n[2];
}
function kt(n) {
  const t = ot(n);
  return { t: `rgb(${t[0]}, ${t[1]}, ${t[2]})`, i: xs(t) > 160 ? "black" : "white" };
}
class _ {
  constructor() {
    this.h = [];
  }
  l(t, i, s) {
    const e = { o: t, _: i, u: s === !0 };
    this.h.push(e);
  }
  v(t) {
    const i = this.h.findIndex((s) => t === s.o);
    i > -1 && this.h.splice(i, 1);
  }
  p(t) {
    this.h = this.h.filter((i) => i._ !== t);
  }
  m(t, i, s) {
    const e = [...this.h];
    this.h = this.h.filter((h) => !h.u), e.forEach((h) => h.o(t, i, s));
  }
  M() {
    return this.h.length > 0;
  }
  S() {
    this.h = [];
  }
}
function W(n, ...t) {
  for (const i of t) for (const s in i) i[s] !== void 0 && (typeof i[s] != "object" || n[s] === void 0 || Array.isArray(i[s]) ? n[s] = i[s] : W(n[s], i[s]));
  return n;
}
function $(n) {
  return typeof n == "number" && isFinite(n);
}
function lt(n) {
  return typeof n == "number" && n % 1 == 0;
}
function dt(n) {
  return typeof n == "string";
}
function pt(n) {
  return typeof n == "boolean";
}
function D(n) {
  const t = n;
  if (!t || typeof t != "object") return t;
  let i, s, e;
  for (s in i = Array.isArray(t) ? [] : {}, t) t.hasOwnProperty(s) && (e = t[s], i[s] = e && typeof e == "object" ? D(e) : e);
  return i;
}
function ce(n) {
  return n !== null;
}
function at(n) {
  return n === null ? void 0 : n;
}
const ai = "-apple-system, BlinkMacSystemFont, 'Trebuchet MS', Roboto, Ubuntu, sans-serif";
function Q(n, t, i) {
  return t === void 0 && (t = ai), `${i = i !== void 0 ? `${i} ` : ""}${n}px ${t}`;
}
class ue {
  constructor(t) {
    this.k = { C: 1, T: 5, P: NaN, R: "", D: "", V: "", O: "", B: 0, A: 0, I: 0, L: 0, N: 0 }, this.F = t;
  }
  W() {
    const t = this.k, i = this.j(), s = this.H();
    return t.P === i && t.D === s || (t.P = i, t.D = s, t.R = Q(i, s), t.L = 2.5 / 12 * i, t.B = t.L, t.A = i / 12 * t.T, t.I = i / 12 * t.T, t.N = 0), t.V = this.$(), t.O = this.U(), this.k;
  }
  $() {
    return this.F.W().layout.textColor;
  }
  U() {
    return this.F.q();
  }
  j() {
    return this.F.W().layout.fontSize;
  }
  H() {
    return this.F.W().layout.fontFamily;
  }
}
class ci {
  constructor() {
    this.Y = [];
  }
  Z(t) {
    this.Y = t;
  }
  X(t, i, s) {
    this.Y.forEach((e) => {
      e.X(t, i, s);
    });
  }
}
class P {
  X(t, i, s) {
    t.useBitmapCoordinateSpace((e) => this.K(e, i, s));
  }
}
class de extends P {
  constructor() {
    super(...arguments), this.G = null;
  }
  J(t) {
    this.G = t;
  }
  K({ context: t, horizontalPixelRatio: i, verticalPixelRatio: s }) {
    if (this.G === null || this.G.tt === null) return;
    const e = this.G.tt, h = this.G, r = Math.max(1, Math.floor(i)) % 2 / 2, o = (l) => {
      t.beginPath();
      for (let a = e.to - 1; a >= e.from; --a) {
        const c = h.it[a], u = Math.round(c.nt * i) + r, d = c.st * s, f = l * s + r;
        t.moveTo(u, d), t.arc(u, d, f, 0, 2 * Math.PI);
      }
      t.fill();
    };
    h.et > 0 && (t.fillStyle = h.rt, o(h.ht + h.et)), t.fillStyle = h.lt, o(h.ht);
  }
}
function fe() {
  return { it: [{ nt: 0, st: 0, ot: 0, _t: 0 }], lt: "", rt: "", ht: 0, et: 0, tt: null };
}
const me = { from: 0, to: 1 };
class pe {
  constructor(t, i) {
    this.ut = new ci(), this.ct = [], this.dt = [], this.ft = !0, this.F = t, this.vt = i, this.ut.Z(this.ct);
  }
  bt(t) {
    const i = this.F.wt();
    i.length !== this.ct.length && (this.dt = i.map(fe), this.ct = this.dt.map((s) => {
      const e = new de();
      return e.J(s), e;
    }), this.ut.Z(this.ct)), this.ft = !0;
  }
  gt() {
    return this.ft && (this.Mt(), this.ft = !1), this.ut;
  }
  Mt() {
    const t = this.vt.W().mode === 2, i = this.F.wt(), s = this.vt.xt(), e = this.F.St();
    i.forEach((h, r) => {
      var o;
      const l = this.dt[r], a = h.kt(s);
      if (t || a === null || !h.yt()) return void (l.tt = null);
      const c = v(h.Ct());
      l.lt = a.Tt, l.ht = a.ht, l.et = a.Pt, l.it[0]._t = a._t, l.it[0].st = h.Dt().Rt(a._t, c.Vt), l.rt = (o = a.Ot) !== null && o !== void 0 ? o : this.F.Bt(l.it[0].st / h.Dt().At()), l.it[0].ot = s, l.it[0].nt = e.It(s), l.tt = me;
    });
  }
}
class ve extends P {
  constructor(t) {
    super(), this.zt = t;
  }
  K({ context: t, bitmapSize: i, horizontalPixelRatio: s, verticalPixelRatio: e }) {
    if (this.zt === null) return;
    const h = this.zt.Lt.yt, r = this.zt.Et.yt;
    if (!h && !r) return;
    const o = Math.round(this.zt.nt * s), l = Math.round(this.zt.st * e);
    t.lineCap = "butt", h && o >= 0 && (t.lineWidth = Math.floor(this.zt.Lt.et * s), t.strokeStyle = this.zt.Lt.V, t.fillStyle = this.zt.Lt.V, K(t, this.zt.Lt.Nt), function(a, c, u, d) {
      a.beginPath();
      const f = a.lineWidth % 2 ? 0.5 : 0;
      a.moveTo(c + f, u), a.lineTo(c + f, d), a.stroke();
    }(t, o, 0, i.height)), r && l >= 0 && (t.lineWidth = Math.floor(this.zt.Et.et * e), t.strokeStyle = this.zt.Et.V, t.fillStyle = this.zt.Et.V, K(t, this.zt.Et.Nt), Ms(t, l, 0, i.width));
  }
}
class be {
  constructor(t) {
    this.ft = !0, this.Ft = { Lt: { et: 1, Nt: 0, V: "", yt: !1 }, Et: { et: 1, Nt: 0, V: "", yt: !1 }, nt: 0, st: 0 }, this.Wt = new ve(this.Ft), this.jt = t;
  }
  bt() {
    this.ft = !0;
  }
  gt() {
    return this.ft && (this.Mt(), this.ft = !1), this.Wt;
  }
  Mt() {
    const t = this.jt.yt(), i = v(this.jt.Ht()), s = i.$t().W().crosshair, e = this.Ft;
    if (s.mode === 2) return e.Et.yt = !1, void (e.Lt.yt = !1);
    e.Et.yt = t && this.jt.Ut(i), e.Lt.yt = t && this.jt.qt(), e.Et.et = s.horzLine.width, e.Et.Nt = s.horzLine.style, e.Et.V = s.horzLine.color, e.Lt.et = s.vertLine.width, e.Lt.Nt = s.vertLine.style, e.Lt.V = s.vertLine.color, e.nt = this.jt.Yt(), e.st = this.jt.Zt();
  }
}
function ge(n, t, i, s, e, h) {
  n.fillRect(t + h, i, s - 2 * h, h), n.fillRect(t + h, i + e - h, s - 2 * h, h), n.fillRect(t, i, h, e), n.fillRect(t + s - h, i, h, e);
}
function Et(n, t, i, s, e, h) {
  n.save(), n.globalCompositeOperation = "copy", n.fillStyle = h, n.fillRect(t, i, s, e), n.restore();
}
function Ei(n, t, i, s, e, h) {
  n.beginPath(), n.roundRect ? n.roundRect(t, i, s, e, h) : (n.lineTo(t + s - h[1], i), h[1] !== 0 && n.arcTo(t + s, i, t + s, i + h[1], h[1]), n.lineTo(t + s, i + e - h[2]), h[2] !== 0 && n.arcTo(t + s, i + e, t + s - h[2], i + e, h[2]), n.lineTo(t + h[3], i + e), h[3] !== 0 && n.arcTo(t, i + e, t, i + e - h[3], h[3]), n.lineTo(t, i + h[0]), h[0] !== 0 && n.arcTo(t, i, t + h[0], i, h[0]));
}
function Vi(n, t, i, s, e, h, r = 0, o = [0, 0, 0, 0], l = "") {
  if (n.save(), !r || !l || l === h) return Ei(n, t, i, s, e, o), n.fillStyle = h, n.fill(), void n.restore();
  const a = r / 2;
  var c;
  Ei(n, t + a, i + a, s - r, e - r, (c = -a, o.map((u) => u === 0 ? u : u + c))), h !== "transparent" && (n.fillStyle = h, n.fill()), l !== "transparent" && (n.lineWidth = r, n.strokeStyle = l, n.closePath(), n.stroke()), n.restore();
}
function zs(n, t, i, s, e, h, r) {
  n.save(), n.globalCompositeOperation = "copy";
  const o = n.createLinearGradient(0, 0, 0, e);
  o.addColorStop(0, h), o.addColorStop(1, r), n.fillStyle = o, n.fillRect(t, i, s, e), n.restore();
}
class Ti {
  constructor(t, i) {
    this.J(t, i);
  }
  J(t, i) {
    this.zt = t, this.Xt = i;
  }
  At(t, i) {
    return this.zt.yt ? t.P + t.L + t.B : 0;
  }
  X(t, i, s, e) {
    if (!this.zt.yt || this.zt.Kt.length === 0) return;
    const h = this.zt.V, r = this.Xt.t, o = t.useBitmapCoordinateSpace((l) => {
      const a = l.context;
      a.font = i.R;
      const c = this.Gt(l, i, s, e), u = c.Jt;
      return c.Qt ? Vi(a, u.ti, u.ii, u.ni, u.si, r, u.ei, [u.ht, 0, 0, u.ht], r) : Vi(a, u.ri, u.ii, u.ni, u.si, r, u.ei, [0, u.ht, u.ht, 0], r), this.zt.hi && (a.fillStyle = h, a.fillRect(u.ri, u.li, u.ai - u.ri, u.oi)), this.zt._i && (a.fillStyle = i.O, a.fillRect(c.Qt ? u.ui - u.ei : 0, u.ii, u.ei, u.ci - u.ii)), c;
    });
    t.useMediaCoordinateSpace(({ context: l }) => {
      const a = o.di;
      l.font = i.R, l.textAlign = o.Qt ? "right" : "left", l.textBaseline = "middle", l.fillStyle = h, l.fillText(this.zt.Kt, a.fi, (a.ii + a.ci) / 2 + a.pi);
    });
  }
  Gt(t, i, s, e) {
    var h;
    const { context: r, bitmapSize: o, mediaSize: l, horizontalPixelRatio: a, verticalPixelRatio: c } = t, u = this.zt.hi || !this.zt.mi ? i.T : 0, d = this.zt.bi ? i.C : 0, f = i.L + this.Xt.wi, m = i.B + this.Xt.gi, p = i.A, b = i.I, g = this.zt.Kt, w = i.P, M = s.Mi(r, g), S = Math.ceil(s.xi(r, g)), x = w + f + m, V = i.C + p + b + S + u, L = Math.max(1, Math.floor(c));
    let C = Math.round(x * c);
    C % 2 != L % 2 && (C += 1);
    const O = d > 0 ? Math.max(1, Math.floor(d * a)) : 0, J = Math.round(V * a), yi = Math.round(u * a), Xs = (h = this.Xt.Si) !== null && h !== void 0 ? h : this.Xt.ki, Mi = Math.round(Xs * c) - Math.floor(0.5 * c), Rt = Math.floor(Mi + L / 2 - C / 2), _i = Rt + C, mt = e === "right", xi = mt ? l.width - d : d, it = mt ? o.width - O : O;
    let $t, Dt, Nt;
    return mt ? ($t = it - J, Dt = it - yi, Nt = xi - u - p - d) : ($t = it + J, Dt = it + yi, Nt = xi + u + p), { Qt: mt, Jt: { ii: Rt, li: Mi, ci: _i, ni: J, si: C, ht: 2 * a, ei: O, ti: $t, ri: it, ai: Dt, oi: L, ui: o.width }, di: { ii: Rt / c, ci: _i / c, fi: Nt, pi: M } };
  }
}
class Vt {
  constructor(t) {
    this.yi = { ki: 0, t: "#000", gi: 0, wi: 0 }, this.Ci = { Kt: "", yt: !1, hi: !0, mi: !1, Ot: "", V: "#FFF", _i: !1, bi: !1 }, this.Ti = { Kt: "", yt: !1, hi: !1, mi: !0, Ot: "", V: "#FFF", _i: !0, bi: !0 }, this.ft = !0, this.Pi = new (t || Ti)(this.Ci, this.yi), this.Ri = new (t || Ti)(this.Ti, this.yi);
  }
  Kt() {
    return this.Di(), this.Ci.Kt;
  }
  ki() {
    return this.Di(), this.yi.ki;
  }
  bt() {
    this.ft = !0;
  }
  At(t, i = !1) {
    return Math.max(this.Pi.At(t, i), this.Ri.At(t, i));
  }
  Vi() {
    return this.yi.Si || 0;
  }
  Oi(t) {
    this.yi.Si = t;
  }
  Bi() {
    return this.Di(), this.Ci.yt || this.Ti.yt;
  }
  Ai() {
    return this.Di(), this.Ci.yt;
  }
  gt(t) {
    return this.Di(), this.Ci.hi = this.Ci.hi && t.W().ticksVisible, this.Ti.hi = this.Ti.hi && t.W().ticksVisible, this.Pi.J(this.Ci, this.yi), this.Ri.J(this.Ti, this.yi), this.Pi;
  }
  Ii() {
    return this.Di(), this.Pi.J(this.Ci, this.yi), this.Ri.J(this.Ti, this.yi), this.Ri;
  }
  Di() {
    this.ft && (this.Ci.hi = !0, this.Ti.hi = !1, this.zi(this.Ci, this.Ti, this.yi));
  }
}
class we extends Vt {
  constructor(t, i, s) {
    super(), this.jt = t, this.Li = i, this.Ei = s;
  }
  zi(t, i, s) {
    if (t.yt = !1, this.jt.W().mode === 2) return;
    const e = this.jt.W().horzLine;
    if (!e.labelVisible) return;
    const h = this.Li.Ct();
    if (!this.jt.yt() || this.Li.Ni() || h === null) return;
    const r = kt(e.labelBackgroundColor);
    s.t = r.t, t.V = r.i;
    const o = 2 / 12 * this.Li.P();
    s.wi = o, s.gi = o;
    const l = this.Ei(this.Li);
    s.ki = l.ki, t.Kt = this.Li.Fi(l._t, h), t.yt = !0;
  }
}
const Se = /[1-9]/g;
class Cs {
  constructor() {
    this.zt = null;
  }
  J(t) {
    this.zt = t;
  }
  X(t, i) {
    if (this.zt === null || this.zt.yt === !1 || this.zt.Kt.length === 0) return;
    const s = t.useMediaCoordinateSpace(({ context: d }) => (d.font = i.R, Math.round(i.Wi.xi(d, v(this.zt).Kt, Se))));
    if (s <= 0) return;
    const e = i.ji, h = s + 2 * e, r = h / 2, o = this.zt.Hi;
    let l = this.zt.ki, a = Math.floor(l - r) + 0.5;
    a < 0 ? (l += Math.abs(0 - a), a = Math.floor(l - r) + 0.5) : a + h > o && (l -= Math.abs(o - (a + h)), a = Math.floor(l - r) + 0.5);
    const c = a + h, u = Math.ceil(0 + i.C + i.T + i.L + i.P + i.B);
    t.useBitmapCoordinateSpace(({ context: d, horizontalPixelRatio: f, verticalPixelRatio: m }) => {
      const p = v(this.zt);
      d.fillStyle = p.t;
      const b = Math.round(a * f), g = Math.round(0 * m), w = Math.round(c * f), M = Math.round(u * m), S = Math.round(2 * f);
      if (d.beginPath(), d.moveTo(b, g), d.lineTo(b, M - S), d.arcTo(b, M, b + S, M, S), d.lineTo(w - S, M), d.arcTo(w, M, w, M - S, S), d.lineTo(w, g), d.fill(), p.hi) {
        const x = Math.round(p.ki * f), V = g, L = Math.round((V + i.T) * m);
        d.fillStyle = p.V;
        const C = Math.max(1, Math.floor(f)), O = Math.floor(0.5 * f);
        d.fillRect(x - O, V, C, L - V);
      }
    }), t.useMediaCoordinateSpace(({ context: d }) => {
      const f = v(this.zt), m = 0 + i.C + i.T + i.L + i.P / 2;
      d.font = i.R, d.textAlign = "left", d.textBaseline = "middle", d.fillStyle = f.V;
      const p = i.Wi.Mi(d, "Apr0");
      d.translate(a + e, m + p), d.fillText(f.Kt, 0, 0);
    });
  }
}
class ye {
  constructor(t, i, s) {
    this.ft = !0, this.Wt = new Cs(), this.Ft = { yt: !1, t: "#4c525e", V: "white", Kt: "", Hi: 0, ki: NaN, hi: !0 }, this.vt = t, this.$i = i, this.Ei = s;
  }
  bt() {
    this.ft = !0;
  }
  gt() {
    return this.ft && (this.Mt(), this.ft = !1), this.Wt.J(this.Ft), this.Wt;
  }
  Mt() {
    const t = this.Ft;
    if (t.yt = !1, this.vt.W().mode === 2) return;
    const i = this.vt.W().vertLine;
    if (!i.labelVisible) return;
    const s = this.$i.St();
    if (s.Ni()) return;
    t.Hi = s.Hi();
    const e = this.Ei();
    if (e === null) return;
    t.ki = e.ki;
    const h = s.Ui(this.vt.xt());
    t.Kt = s.qi(v(h)), t.yt = !0;
    const r = kt(i.labelBackgroundColor);
    t.t = r.t, t.V = r.i, t.hi = s.W().ticksVisible;
  }
}
class ui {
  constructor() {
    this.Yi = null, this.Zi = 0;
  }
  Xi() {
    return this.Zi;
  }
  Ki(t) {
    this.Zi = t;
  }
  Dt() {
    return this.Yi;
  }
  Gi(t) {
    this.Yi = t;
  }
  Ji(t) {
    return [];
  }
  Qi() {
    return [];
  }
  yt() {
    return !0;
  }
}
var Wi;
(function(n) {
  n[n.Normal = 0] = "Normal", n[n.Magnet = 1] = "Magnet", n[n.Hidden = 2] = "Hidden";
})(Wi || (Wi = {}));
class Me extends ui {
  constructor(t, i) {
    super(), this.tn = null, this.nn = NaN, this.sn = 0, this.en = !0, this.rn = /* @__PURE__ */ new Map(), this.hn = !1, this.ln = NaN, this.an = NaN, this._n = NaN, this.un = NaN, this.$i = t, this.cn = i, this.dn = new pe(t, this), this.fn = /* @__PURE__ */ ((e, h) => (r) => {
      const o = h(), l = e();
      if (r === v(this.tn).vn()) return { _t: l, ki: o };
      {
        const a = v(r.Ct());
        return { _t: r.pn(o, a), ki: o };
      }
    })(() => this.nn, () => this.an);
    const s = /* @__PURE__ */ ((e, h) => () => {
      const r = this.$i.St().mn(e()), o = h();
      return r && Number.isFinite(o) ? { ot: r, ki: o } : null;
    })(() => this.sn, () => this.Yt());
    this.bn = new ye(this, t, s), this.wn = new be(this);
  }
  W() {
    return this.cn;
  }
  gn(t, i) {
    this._n = t, this.un = i;
  }
  Mn() {
    this._n = NaN, this.un = NaN;
  }
  xn() {
    return this._n;
  }
  Sn() {
    return this.un;
  }
  kn(t, i, s) {
    this.hn || (this.hn = !0), this.en = !0, this.yn(t, i, s);
  }
  xt() {
    return this.sn;
  }
  Yt() {
    return this.ln;
  }
  Zt() {
    return this.an;
  }
  yt() {
    return this.en;
  }
  Cn() {
    this.en = !1, this.Tn(), this.nn = NaN, this.ln = NaN, this.an = NaN, this.tn = null, this.Mn();
  }
  Pn(t) {
    return this.tn !== null ? [this.wn, this.dn] : [];
  }
  Ut(t) {
    return t === this.tn && this.cn.horzLine.visible;
  }
  qt() {
    return this.cn.vertLine.visible;
  }
  Rn(t, i) {
    this.en && this.tn === t || this.rn.clear();
    const s = [];
    return this.tn === t && s.push(this.Dn(this.rn, i, this.fn)), s;
  }
  Qi() {
    return this.en ? [this.bn] : [];
  }
  Ht() {
    return this.tn;
  }
  Vn() {
    this.wn.bt(), this.rn.forEach((t) => t.bt()), this.bn.bt(), this.dn.bt();
  }
  On(t) {
    return t && !t.vn().Ni() ? t.vn() : null;
  }
  yn(t, i, s) {
    this.Bn(t, i, s) && this.Vn();
  }
  Bn(t, i, s) {
    const e = this.ln, h = this.an, r = this.nn, o = this.sn, l = this.tn, a = this.On(s);
    this.sn = t, this.ln = isNaN(t) ? NaN : this.$i.St().It(t), this.tn = s;
    const c = a !== null ? a.Ct() : null;
    return a !== null && c !== null ? (this.nn = i, this.an = a.Rt(i, c)) : (this.nn = NaN, this.an = NaN), e !== this.ln || h !== this.an || o !== this.sn || r !== this.nn || l !== this.tn;
  }
  Tn() {
    const t = this.$i.wt().map((s) => s.In().An()).filter(ce), i = t.length === 0 ? null : Math.max(...t);
    this.sn = i !== null ? i : NaN;
  }
  Dn(t, i, s) {
    let e = t.get(i);
    return e === void 0 && (e = new we(this, i, s), t.set(i, e)), e;
  }
}
function Tt(n) {
  return n === "left" || n === "right";
}
class z {
  constructor(t) {
    this.zn = /* @__PURE__ */ new Map(), this.Ln = [], this.En = t;
  }
  Nn(t, i) {
    const s = function(e, h) {
      return e === void 0 ? h : { Fn: Math.max(e.Fn, h.Fn), Wn: e.Wn || h.Wn };
    }(this.zn.get(t), i);
    this.zn.set(t, s);
  }
  jn() {
    return this.En;
  }
  Hn(t) {
    const i = this.zn.get(t);
    return i === void 0 ? { Fn: this.En } : { Fn: Math.max(this.En, i.Fn), Wn: i.Wn };
  }
  $n() {
    this.Un(), this.Ln = [{ qn: 0 }];
  }
  Yn(t) {
    this.Un(), this.Ln = [{ qn: 1, Vt: t }];
  }
  Zn(t) {
    this.Xn(), this.Ln.push({ qn: 5, Vt: t });
  }
  Un() {
    this.Xn(), this.Ln.push({ qn: 6 });
  }
  Kn() {
    this.Un(), this.Ln = [{ qn: 4 }];
  }
  Gn(t) {
    this.Un(), this.Ln.push({ qn: 2, Vt: t });
  }
  Jn(t) {
    this.Un(), this.Ln.push({ qn: 3, Vt: t });
  }
  Qn() {
    return this.Ln;
  }
  ts(t) {
    for (const i of t.Ln) this.ns(i);
    this.En = Math.max(this.En, t.En), t.zn.forEach((i, s) => {
      this.Nn(s, i);
    });
  }
  static ss() {
    return new z(2);
  }
  static es() {
    return new z(3);
  }
  ns(t) {
    switch (t.qn) {
      case 0:
        this.$n();
        break;
      case 1:
        this.Yn(t.Vt);
        break;
      case 2:
        this.Gn(t.Vt);
        break;
      case 3:
        this.Jn(t.Vt);
        break;
      case 4:
        this.Kn();
        break;
      case 5:
        this.Zn(t.Vt);
        break;
      case 6:
        this.Xn();
    }
  }
  Xn() {
    const t = this.Ln.findIndex((i) => i.qn === 5);
    t !== -1 && this.Ln.splice(t, 1);
  }
}
const Pi = ".";
function N(n, t) {
  if (!$(n)) return "n/a";
  if (!lt(t)) throw new TypeError("invalid length");
  if (t < 0 || t > 16) throw new TypeError("invalid length");
  return t === 0 ? n.toString() : ("0000000000000000" + n.toString()).slice(-t);
}
class Wt {
  constructor(t, i) {
    if (i || (i = 1), $(t) && lt(t) || (t = 100), t < 0) throw new TypeError("invalid base");
    this.Li = t, this.rs = i, this.hs();
  }
  format(t) {
    const i = t < 0 ? "−" : "";
    return t = Math.abs(t), i + this.ls(t);
  }
  hs() {
    if (this.os = 0, this.Li > 0 && this.rs > 0) {
      let t = this.Li;
      for (; t > 1; ) t /= 10, this.os++;
    }
  }
  ls(t) {
    const i = this.Li / this.rs;
    let s = Math.floor(t), e = "";
    const h = this.os !== void 0 ? this.os : NaN;
    if (i > 1) {
      let r = +(Math.round(t * i) - s * i).toFixed(this.os);
      r >= i && (r -= i, s += 1), e = Pi + N(+r.toFixed(this.os) * this.rs, h);
    } else s = Math.round(s * i) / i, h > 0 && (e = Pi + N(0, h));
    return s.toFixed(0) + e;
  }
}
class Ls extends Wt {
  constructor(t = 100) {
    super(t);
  }
  format(t) {
    return `${super.format(t)}%`;
  }
}
class _e {
  constructor(t) {
    this._s = t;
  }
  format(t) {
    let i = "";
    return t < 0 && (i = "-", t = -t), t < 995 ? i + this.us(t) : t < 999995 ? i + this.us(t / 1e3) + "K" : t < 999999995 ? (t = 1e3 * Math.round(t / 1e3), i + this.us(t / 1e6) + "M") : (t = 1e6 * Math.round(t / 1e6), i + this.us(t / 1e9) + "B");
  }
  us(t) {
    let i;
    const s = Math.pow(10, this._s);
    return i = (t = Math.round(t * s) / s) >= 1e-15 && t < 1 ? t.toFixed(this._s).replace(/\.?0+$/, "") : String(t), i.replace(/(\.[1-9]*)0+$/, (e, h) => h);
  }
}
function ks(n, t, i, s, e, h, r) {
  if (t.length === 0 || s.from >= t.length || s.to <= 0) return;
  const { context: o, horizontalPixelRatio: l, verticalPixelRatio: a } = n, c = t[s.from];
  let u = h(n, c), d = c;
  if (s.to - s.from < 2) {
    const f = e / 2;
    o.beginPath();
    const m = { nt: c.nt - f, st: c.st }, p = { nt: c.nt + f, st: c.st };
    o.moveTo(m.nt * l, m.st * a), o.lineTo(p.nt * l, p.st * a), r(n, u, m, p);
  } else {
    const f = (p, b) => {
      r(n, u, d, b), o.beginPath(), u = p, d = b;
    };
    let m = d;
    o.beginPath(), o.moveTo(c.nt * l, c.st * a);
    for (let p = s.from + 1; p < s.to; ++p) {
      m = t[p];
      const b = h(n, m);
      switch (i) {
        case 0:
          o.lineTo(m.nt * l, m.st * a);
          break;
        case 1:
          o.lineTo(m.nt * l, t[p - 1].st * a), b !== u && (f(b, m), o.lineTo(m.nt * l, t[p - 1].st * a)), o.lineTo(m.nt * l, m.st * a);
          break;
        case 2: {
          const [g, w] = xe(t, p - 1, p);
          o.bezierCurveTo(g.nt * l, g.st * a, w.nt * l, w.st * a, m.nt * l, m.st * a);
          break;
        }
      }
      i !== 1 && b !== u && (f(b, m), o.moveTo(m.nt * l, m.st * a));
    }
    (d !== m || d === m && i === 1) && r(n, u, d, m);
  }
}
const Ri = 6;
function Ot(n, t) {
  return { nt: n.nt - t.nt, st: n.st - t.st };
}
function $i(n, t) {
  return { nt: n.nt / t, st: n.st / t };
}
function xe(n, t, i) {
  const s = Math.max(0, t - 1), e = Math.min(n.length - 1, i + 1);
  var h, r;
  return [(h = n[t], r = $i(Ot(n[i], n[s]), Ri), { nt: h.nt + r.nt, st: h.st + r.st }), Ot(n[i], $i(Ot(n[e], n[t]), Ri))];
}
function ze(n, t, i, s, e) {
  const { context: h, horizontalPixelRatio: r, verticalPixelRatio: o } = t;
  h.lineTo(e.nt * r, n * o), h.lineTo(s.nt * r, n * o), h.closePath(), h.fillStyle = i, h.fill();
}
class Es extends P {
  constructor() {
    super(...arguments), this.G = null;
  }
  J(t) {
    this.G = t;
  }
  K(t) {
    var i;
    if (this.G === null) return;
    const { it: s, tt: e, cs: h, et: r, Nt: o, ds: l } = this.G, a = (i = this.G.fs) !== null && i !== void 0 ? i : this.G.vs ? 0 : t.mediaSize.height;
    if (e === null) return;
    const c = t.context;
    c.lineCap = "butt", c.lineJoin = "round", c.lineWidth = r, K(c, o), c.lineWidth = 1, ks(t, s, l, e, h, this.ps.bind(this), ze.bind(null, a));
  }
}
function ei(n, t, i) {
  return Math.min(Math.max(n, t), i);
}
function vt(n, t, i) {
  return t - n <= i;
}
function Vs(n) {
  const t = Math.ceil(n);
  return t % 2 == 0 ? t - 1 : t;
}
class di {
  bs(t, i) {
    const s = this.ws, { gs: e, Ms: h, xs: r, Ss: o, ks: l, fs: a } = i;
    if (this.ys === void 0 || s === void 0 || s.gs !== e || s.Ms !== h || s.xs !== r || s.Ss !== o || s.fs !== a || s.ks !== l) {
      const c = t.context.createLinearGradient(0, 0, 0, l);
      if (c.addColorStop(0, e), a != null) {
        const u = ei(a * t.verticalPixelRatio / l, 0, 1);
        c.addColorStop(u, h), c.addColorStop(u, r);
      }
      c.addColorStop(1, o), this.ys = c, this.ws = i;
    }
    return this.ys;
  }
}
class Ce extends Es {
  constructor() {
    super(...arguments), this.Cs = new di();
  }
  ps(t, i) {
    return this.Cs.bs(t, { gs: i.Ts, Ms: "", xs: "", Ss: i.Ps, ks: t.bitmapSize.height });
  }
}
function Le(n, t) {
  const i = n.context;
  i.strokeStyle = t, i.stroke();
}
class Ts extends P {
  constructor() {
    super(...arguments), this.G = null;
  }
  J(t) {
    this.G = t;
  }
  K(t) {
    if (this.G === null) return;
    const { it: i, tt: s, cs: e, ds: h, et: r, Nt: o, Rs: l } = this.G;
    if (s === null) return;
    const a = t.context;
    a.lineCap = "butt", a.lineWidth = r * t.verticalPixelRatio, K(a, o), a.lineJoin = "round";
    const c = this.Ds.bind(this);
    h !== void 0 && ks(t, i, h, s, e, c, Le), l && function(u, d, f, m, p) {
      const { horizontalPixelRatio: b, verticalPixelRatio: g, context: w } = u;
      let M = null;
      const S = Math.max(1, Math.floor(b)) % 2 / 2, x = f * g + S;
      for (let V = m.to - 1; V >= m.from; --V) {
        const L = d[V];
        if (L) {
          const C = p(u, L);
          C !== M && (w.beginPath(), M !== null && w.fill(), w.fillStyle = C, M = C);
          const O = Math.round(L.nt * b) + S, J = L.st * g;
          w.moveTo(O, J), w.arc(O, J, x, 0, 2 * Math.PI);
        }
      }
      w.fill();
    }(t, i, l, s, c);
  }
}
class Ws extends Ts {
  Ds(t, i) {
    return i.lt;
  }
}
function Ps(n, t, i, s, e = 0, h = t.length) {
  let r = h - e;
  for (; 0 < r; ) {
    const o = r >> 1, l = e + o;
    s(t[l], i) === n ? (e = l + 1, r -= o + 1) : r = o;
  }
  return e;
}
const ft = Ps.bind(null, !0), Rs = Ps.bind(null, !1);
function ke(n, t) {
  return n.ot < t;
}
function Ee(n, t) {
  return t < n.ot;
}
function $s(n, t, i) {
  const s = t.Vs(), e = t.ui(), h = ft(n, s, ke), r = Rs(n, e, Ee);
  if (!i) return { from: h, to: r };
  let o = h, l = r;
  return h > 0 && h < n.length && n[h].ot >= s && (o = h - 1), r > 0 && r < n.length && n[r - 1].ot <= e && (l = r + 1), { from: o, to: l };
}
class fi {
  constructor(t, i, s) {
    this.Os = !0, this.Bs = !0, this.As = !0, this.Is = [], this.zs = null, this.Ls = t, this.Es = i, this.Ns = s;
  }
  bt(t) {
    this.Os = !0, t === "data" && (this.Bs = !0), t === "options" && (this.As = !0);
  }
  gt() {
    return this.Ls.yt() ? (this.Fs(), this.zs === null ? null : this.Ws) : null;
  }
  js() {
    this.Is = this.Is.map((t) => Object.assign(Object.assign({}, t), this.Ls.$s().Hs(t.ot)));
  }
  Us() {
    this.zs = null;
  }
  Fs() {
    this.Bs && (this.qs(), this.Bs = !1), this.As && (this.js(), this.As = !1), this.Os && (this.Ys(), this.Os = !1);
  }
  Ys() {
    const t = this.Ls.Dt(), i = this.Es.St();
    if (this.Us(), i.Ni() || t.Ni()) return;
    const s = i.Zs();
    if (s === null || this.Ls.In().Xs() === 0) return;
    const e = this.Ls.Ct();
    e !== null && (this.zs = $s(this.Is, s, this.Ns), this.Ks(t, i, e.Vt), this.Gs());
  }
}
class Pt extends fi {
  constructor(t, i) {
    super(t, i, !0);
  }
  Ks(t, i, s) {
    i.Js(this.Is, at(this.zs)), t.Qs(this.Is, s, at(this.zs));
  }
  te(t, i) {
    return { ot: t, _t: i, nt: NaN, st: NaN };
  }
  qs() {
    const t = this.Ls.$s();
    this.Is = this.Ls.In().ie().map((i) => {
      const s = i.Vt[3];
      return this.ne(i.se, s, t);
    });
  }
}
class Ve extends Pt {
  constructor(t, i) {
    super(t, i), this.Ws = new ci(), this.ee = new Ce(), this.re = new Ws(), this.Ws.Z([this.ee, this.re]);
  }
  ne(t, i, s) {
    return Object.assign(Object.assign({}, this.te(t, i)), s.Hs(t));
  }
  Gs() {
    const t = this.Ls.W();
    this.ee.J({ ds: t.lineType, it: this.Is, Nt: t.lineStyle, et: t.lineWidth, fs: null, vs: t.invertFilledArea, tt: this.zs, cs: this.Es.St().he() }), this.re.J({ ds: t.lineVisible ? t.lineType : void 0, it: this.Is, Nt: t.lineStyle, et: t.lineWidth, tt: this.zs, cs: this.Es.St().he(), Rs: t.pointMarkersVisible ? t.pointMarkersRadius || t.lineWidth / 2 + 2 : void 0 });
  }
}
class Te extends P {
  constructor() {
    super(...arguments), this.zt = null, this.le = 0, this.ae = 0;
  }
  J(t) {
    this.zt = t;
  }
  K({ context: t, horizontalPixelRatio: i, verticalPixelRatio: s }) {
    if (this.zt === null || this.zt.In.length === 0 || this.zt.tt === null) return;
    this.le = this.oe(i), this.le >= 2 && Math.max(1, Math.floor(i)) % 2 != this.le % 2 && this.le--, this.ae = this.zt._e ? Math.min(this.le, Math.floor(i)) : this.le;
    let e = null;
    const h = this.ae <= this.le && this.zt.he >= Math.floor(1.5 * i);
    for (let r = this.zt.tt.from; r < this.zt.tt.to; ++r) {
      const o = this.zt.In[r];
      e !== o.ue && (t.fillStyle = o.ue, e = o.ue);
      const l = Math.floor(0.5 * this.ae), a = Math.round(o.nt * i), c = a - l, u = this.ae, d = c + u - 1, f = Math.min(o.ce, o.de), m = Math.max(o.ce, o.de), p = Math.round(f * s) - l, b = Math.round(m * s) + l, g = Math.max(b - p, this.ae);
      t.fillRect(c, p, u, g);
      const w = Math.ceil(1.5 * this.le);
      if (h) {
        if (this.zt.fe) {
          const V = a - w;
          let L = Math.max(p, Math.round(o.ve * s) - l), C = L + u - 1;
          C > p + g - 1 && (C = p + g - 1, L = C - u + 1), t.fillRect(V, L, c - V, C - L + 1);
        }
        const M = a + w;
        let S = Math.max(p, Math.round(o.pe * s) - l), x = S + u - 1;
        x > p + g - 1 && (x = p + g - 1, S = x - u + 1), t.fillRect(d + 1, S, M - d, x - S + 1);
      }
    }
  }
  oe(t) {
    const i = Math.floor(t);
    return Math.max(i, Math.floor(function(s, e) {
      return Math.floor(0.3 * s * e);
    }(v(this.zt).he, t)));
  }
}
class Ds extends fi {
  constructor(t, i) {
    super(t, i, !1);
  }
  Ks(t, i, s) {
    i.Js(this.Is, at(this.zs)), t.me(this.Is, s, at(this.zs));
  }
  be(t, i, s) {
    return { ot: t, we: i.Vt[0], ge: i.Vt[1], Me: i.Vt[2], xe: i.Vt[3], nt: NaN, ve: NaN, ce: NaN, de: NaN, pe: NaN };
  }
  qs() {
    const t = this.Ls.$s();
    this.Is = this.Ls.In().ie().map((i) => this.ne(i.se, i, t));
  }
}
class We extends Ds {
  constructor() {
    super(...arguments), this.Ws = new Te();
  }
  ne(t, i, s) {
    return Object.assign(Object.assign({}, this.be(t, i, s)), s.Hs(t));
  }
  Gs() {
    const t = this.Ls.W();
    this.Ws.J({ In: this.Is, he: this.Es.St().he(), fe: t.openVisible, _e: t.thinBars, tt: this.zs });
  }
}
class Pe extends Es {
  constructor() {
    super(...arguments), this.Cs = new di();
  }
  ps(t, i) {
    const s = this.G;
    return this.Cs.bs(t, { gs: i.Se, Ms: i.ke, xs: i.ye, Ss: i.Ce, ks: t.bitmapSize.height, fs: s.fs });
  }
}
class Re extends Ts {
  constructor() {
    super(...arguments), this.Te = new di();
  }
  Ds(t, i) {
    const s = this.G;
    return this.Te.bs(t, { gs: i.Pe, Ms: i.Pe, xs: i.Re, Ss: i.Re, ks: t.bitmapSize.height, fs: s.fs });
  }
}
class $e extends Pt {
  constructor(t, i) {
    super(t, i), this.Ws = new ci(), this.De = new Pe(), this.Ve = new Re(), this.Ws.Z([this.De, this.Ve]);
  }
  ne(t, i, s) {
    return Object.assign(Object.assign({}, this.te(t, i)), s.Hs(t));
  }
  Gs() {
    const t = this.Ls.Ct();
    if (t === null) return;
    const i = this.Ls.W(), s = this.Ls.Dt().Rt(i.baseValue.price, t.Vt), e = this.Es.St().he();
    this.De.J({ it: this.Is, et: i.lineWidth, Nt: i.lineStyle, ds: i.lineType, fs: s, vs: !1, tt: this.zs, cs: e }), this.Ve.J({ it: this.Is, et: i.lineWidth, Nt: i.lineStyle, ds: i.lineVisible ? i.lineType : void 0, Rs: i.pointMarkersVisible ? i.pointMarkersRadius || i.lineWidth / 2 + 2 : void 0, fs: s, tt: this.zs, cs: e });
  }
}
class De extends P {
  constructor() {
    super(...arguments), this.zt = null, this.le = 0;
  }
  J(t) {
    this.zt = t;
  }
  K(t) {
    if (this.zt === null || this.zt.In.length === 0 || this.zt.tt === null) return;
    const { horizontalPixelRatio: i } = t;
    this.le = function(h, r) {
      if (h >= 2.5 && h <= 4) return Math.floor(3 * r);
      const o = 1 - 0.2 * Math.atan(Math.max(4, h) - 4) / (0.5 * Math.PI), l = Math.floor(h * o * r), a = Math.floor(h * r), c = Math.min(l, a);
      return Math.max(Math.floor(r), c);
    }(this.zt.he, i), this.le >= 2 && Math.floor(i) % 2 != this.le % 2 && this.le--;
    const s = this.zt.In;
    this.zt.Oe && this.Be(t, s, this.zt.tt), this.zt._i && this.Ae(t, s, this.zt.tt);
    const e = this.Ie(i);
    (!this.zt._i || this.le > 2 * e) && this.ze(t, s, this.zt.tt);
  }
  Be(t, i, s) {
    if (this.zt === null) return;
    const { context: e, horizontalPixelRatio: h, verticalPixelRatio: r } = t;
    let o = "", l = Math.min(Math.floor(h), Math.floor(this.zt.he * h));
    l = Math.max(Math.floor(h), Math.min(l, this.le));
    const a = Math.floor(0.5 * l);
    let c = null;
    for (let u = s.from; u < s.to; u++) {
      const d = i[u];
      d.Le !== o && (e.fillStyle = d.Le, o = d.Le);
      const f = Math.round(Math.min(d.ve, d.pe) * r), m = Math.round(Math.max(d.ve, d.pe) * r), p = Math.round(d.ce * r), b = Math.round(d.de * r);
      let g = Math.round(h * d.nt) - a;
      const w = g + l - 1;
      c !== null && (g = Math.max(c + 1, g), g = Math.min(g, w));
      const M = w - g + 1;
      e.fillRect(g, p, M, f - p), e.fillRect(g, m + 1, M, b - m), c = w;
    }
  }
  Ie(t) {
    let i = Math.floor(1 * t);
    this.le <= 2 * i && (i = Math.floor(0.5 * (this.le - 1)));
    const s = Math.max(Math.floor(t), i);
    return this.le <= 2 * s ? Math.max(Math.floor(t), Math.floor(1 * t)) : s;
  }
  Ae(t, i, s) {
    if (this.zt === null) return;
    const { context: e, horizontalPixelRatio: h, verticalPixelRatio: r } = t;
    let o = "";
    const l = this.Ie(h);
    let a = null;
    for (let c = s.from; c < s.to; c++) {
      const u = i[c];
      u.Ee !== o && (e.fillStyle = u.Ee, o = u.Ee);
      let d = Math.round(u.nt * h) - Math.floor(0.5 * this.le);
      const f = d + this.le - 1, m = Math.round(Math.min(u.ve, u.pe) * r), p = Math.round(Math.max(u.ve, u.pe) * r);
      if (a !== null && (d = Math.max(a + 1, d), d = Math.min(d, f)), this.zt.he * h > 2 * l) ge(e, d, m, f - d + 1, p - m + 1, l);
      else {
        const b = f - d + 1;
        e.fillRect(d, m, b, p - m + 1);
      }
      a = f;
    }
  }
  ze(t, i, s) {
    if (this.zt === null) return;
    const { context: e, horizontalPixelRatio: h, verticalPixelRatio: r } = t;
    let o = "";
    const l = this.Ie(h);
    for (let a = s.from; a < s.to; a++) {
      const c = i[a];
      let u = Math.round(Math.min(c.ve, c.pe) * r), d = Math.round(Math.max(c.ve, c.pe) * r), f = Math.round(c.nt * h) - Math.floor(0.5 * this.le), m = f + this.le - 1;
      if (c.ue !== o) {
        const p = c.ue;
        e.fillStyle = p, o = p;
      }
      this.zt._i && (f += l, u += l, m -= l, d -= l), u > d || e.fillRect(f, u, m - f + 1, d - u + 1);
    }
  }
}
class Ne extends Ds {
  constructor() {
    super(...arguments), this.Ws = new De();
  }
  ne(t, i, s) {
    return Object.assign(Object.assign({}, this.be(t, i, s)), s.Hs(t));
  }
  Gs() {
    const t = this.Ls.W();
    this.Ws.J({ In: this.Is, he: this.Es.St().he(), Oe: t.wickVisible, _i: t.borderVisible, tt: this.zs });
  }
}
class Oe {
  constructor(t, i) {
    this.Ne = t, this.Li = i;
  }
  X(t, i, s) {
    this.Ne.draw(t, this.Li, i, s);
  }
}
class Bt extends fi {
  constructor(t, i, s) {
    super(t, i, !1), this.wn = s, this.Ws = new Oe(this.wn.renderer(), (e) => {
      const h = t.Ct();
      return h === null ? null : t.Dt().Rt(e, h.Vt);
    });
  }
  Fe(t) {
    return this.wn.priceValueBuilder(t);
  }
  We(t) {
    return this.wn.isWhitespace(t);
  }
  qs() {
    const t = this.Ls.$s();
    this.Is = this.Ls.In().ie().map((i) => Object.assign(Object.assign({ ot: i.se, nt: NaN }, t.Hs(i.se)), { je: i.He }));
  }
  Ks(t, i) {
    i.Js(this.Is, at(this.zs));
  }
  Gs() {
    this.wn.update({ bars: this.Is.map(Be), barSpacing: this.Es.St().he(), visibleRange: this.zs }, this.Ls.W());
  }
}
function Be(n) {
  return { x: n.nt, time: n.ot, originalData: n.je, barColor: n.ue };
}
class Ie extends P {
  constructor() {
    super(...arguments), this.zt = null, this.$e = [];
  }
  J(t) {
    this.zt = t, this.$e = [];
  }
  K({ context: t, horizontalPixelRatio: i, verticalPixelRatio: s }) {
    if (this.zt === null || this.zt.it.length === 0 || this.zt.tt === null) return;
    this.$e.length || this.Ue(i);
    const e = Math.max(1, Math.floor(s)), h = Math.round(this.zt.qe * s) - Math.floor(e / 2), r = h + e;
    for (let o = this.zt.tt.from; o < this.zt.tt.to; o++) {
      const l = this.zt.it[o], a = this.$e[o - this.zt.tt.from], c = Math.round(l.st * s);
      let u, d;
      t.fillStyle = l.ue, c <= h ? (u = c, d = r) : (u = h, d = c - Math.floor(e / 2) + e), t.fillRect(a.Vs, u, a.ui - a.Vs + 1, d - u);
    }
  }
  Ue(t) {
    if (this.zt === null || this.zt.it.length === 0 || this.zt.tt === null) return void (this.$e = []);
    const i = Math.ceil(this.zt.he * t) <= 1 ? 0 : Math.max(1, Math.floor(t)), s = Math.round(this.zt.he * t) - i;
    this.$e = new Array(this.zt.tt.to - this.zt.tt.from);
    for (let h = this.zt.tt.from; h < this.zt.tt.to; h++) {
      const r = this.zt.it[h], o = Math.round(r.nt * t);
      let l, a;
      if (s % 2) {
        const c = (s - 1) / 2;
        l = o - c, a = o + c;
      } else {
        const c = s / 2;
        l = o - c, a = o + c - 1;
      }
      this.$e[h - this.zt.tt.from] = { Vs: l, ui: a, Ye: o, Ze: r.nt * t, ot: r.ot };
    }
    for (let h = this.zt.tt.from + 1; h < this.zt.tt.to; h++) {
      const r = this.$e[h - this.zt.tt.from], o = this.$e[h - this.zt.tt.from - 1];
      r.ot === o.ot + 1 && r.Vs - o.ui !== i + 1 && (o.Ye > o.Ze ? o.ui = r.Vs - i - 1 : r.Vs = o.ui + i + 1);
    }
    let e = Math.ceil(this.zt.he * t);
    for (let h = this.zt.tt.from; h < this.zt.tt.to; h++) {
      const r = this.$e[h - this.zt.tt.from];
      r.ui < r.Vs && (r.ui = r.Vs);
      const o = r.ui - r.Vs + 1;
      e = Math.min(o, e);
    }
    if (i > 0 && e < 4) for (let h = this.zt.tt.from; h < this.zt.tt.to; h++) {
      const r = this.$e[h - this.zt.tt.from];
      r.ui - r.Vs + 1 > e && (r.Ye > r.Ze ? r.ui -= 1 : r.Vs += 1);
    }
  }
}
class je extends Pt {
  constructor() {
    super(...arguments), this.Ws = new Ie();
  }
  ne(t, i, s) {
    return Object.assign(Object.assign({}, this.te(t, i)), s.Hs(t));
  }
  Gs() {
    const t = { it: this.Is, he: this.Es.St().he(), tt: this.zs, qe: this.Ls.Dt().Rt(this.Ls.W().base, v(this.Ls.Ct()).Vt) };
    this.Ws.J(t);
  }
}
class Fe extends Pt {
  constructor() {
    super(...arguments), this.Ws = new Ws();
  }
  ne(t, i, s) {
    return Object.assign(Object.assign({}, this.te(t, i)), s.Hs(t));
  }
  Gs() {
    const t = this.Ls.W(), i = { it: this.Is, Nt: t.lineStyle, ds: t.lineVisible ? t.lineType : void 0, et: t.lineWidth, Rs: t.pointMarkersVisible ? t.pointMarkersRadius || t.lineWidth / 2 + 2 : void 0, tt: this.zs, cs: this.Es.St().he() };
    this.Ws.J(i);
  }
}
const Ae = /[2-9]/g;
class ct {
  constructor(t = 50) {
    this.Xe = 0, this.Ke = 1, this.Ge = 1, this.Je = {}, this.Qe = /* @__PURE__ */ new Map(), this.tr = t;
  }
  ir() {
    this.Xe = 0, this.Qe.clear(), this.Ke = 1, this.Ge = 1, this.Je = {};
  }
  xi(t, i, s) {
    return this.nr(t, i, s).width;
  }
  Mi(t, i, s) {
    const e = this.nr(t, i, s);
    return ((e.actualBoundingBoxAscent || 0) - (e.actualBoundingBoxDescent || 0)) / 2;
  }
  nr(t, i, s) {
    const e = s || Ae, h = String(i).replace(e, "0");
    if (this.Qe.has(h)) return k(this.Qe.get(h)).sr;
    if (this.Xe === this.tr) {
      const o = this.Je[this.Ge];
      delete this.Je[this.Ge], this.Qe.delete(o), this.Ge++, this.Xe--;
    }
    t.save(), t.textBaseline = "middle";
    const r = t.measureText(h);
    return t.restore(), r.width === 0 && i.length || (this.Qe.set(h, { sr: r, er: this.Ke }), this.Je[this.Ke] = h, this.Xe++, this.Ke++), r;
  }
}
class Ke {
  constructor(t) {
    this.rr = null, this.k = null, this.hr = "right", this.lr = t;
  }
  ar(t, i, s) {
    this.rr = t, this.k = i, this.hr = s;
  }
  X(t) {
    this.k !== null && this.rr !== null && this.rr.X(t, this.k, this.lr, this.hr);
  }
}
class Ns {
  constructor(t, i, s) {
    this._r = t, this.lr = new ct(50), this.ur = i, this.F = s, this.j = -1, this.Wt = new Ke(this.lr);
  }
  gt() {
    const t = this.F.cr(this.ur);
    if (t === null) return null;
    const i = t.dr(this.ur) ? t.vr() : this.ur.Dt();
    if (i === null) return null;
    const s = t.pr(i);
    if (s === "overlay") return null;
    const e = this.F.mr();
    return e.P !== this.j && (this.j = e.P, this.lr.ir()), this.Wt.ar(this._r.Ii(), e, s), this.Wt;
  }
}
class Ue extends P {
  constructor() {
    super(...arguments), this.zt = null;
  }
  J(t) {
    this.zt = t;
  }
  br(t, i) {
    var s;
    if (!(!((s = this.zt) === null || s === void 0) && s.yt)) return null;
    const { st: e, et: h, wr: r } = this.zt;
    return i >= e - h - 7 && i <= e + h + 7 ? { gr: this.zt, wr: r } : null;
  }
  K({ context: t, bitmapSize: i, horizontalPixelRatio: s, verticalPixelRatio: e }) {
    if (this.zt === null || this.zt.yt === !1) return;
    const h = Math.round(this.zt.st * e);
    h < 0 || h > i.height || (t.lineCap = "butt", t.strokeStyle = this.zt.V, t.lineWidth = Math.floor(this.zt.et * s), K(t, this.zt.Nt), Ms(t, h, 0, i.width));
  }
}
class mi {
  constructor(t) {
    this.Mr = { st: 0, V: "rgba(0, 0, 0, 0)", et: 1, Nt: 0, yt: !1 }, this.Sr = new Ue(), this.ft = !0, this.Ls = t, this.Es = t.$t(), this.Sr.J(this.Mr);
  }
  bt() {
    this.ft = !0;
  }
  gt() {
    return this.Ls.yt() ? (this.ft && (this.kr(), this.ft = !1), this.Sr) : null;
  }
}
class Xe extends mi {
  constructor(t) {
    super(t);
  }
  kr() {
    this.Mr.yt = !1;
    const t = this.Ls.Dt(), i = t.yr().yr;
    if (i !== 2 && i !== 3) return;
    const s = this.Ls.W();
    if (!s.baseLineVisible || !this.Ls.yt()) return;
    const e = this.Ls.Ct();
    e !== null && (this.Mr.yt = !0, this.Mr.st = t.Rt(e.Vt, e.Vt), this.Mr.V = s.baseLineColor, this.Mr.et = s.baseLineWidth, this.Mr.Nt = s.baseLineStyle);
  }
}
class Je extends P {
  constructor() {
    super(...arguments), this.zt = null;
  }
  J(t) {
    this.zt = t;
  }
  He() {
    return this.zt;
  }
  K({ context: t, horizontalPixelRatio: i, verticalPixelRatio: s }) {
    const e = this.zt;
    if (e === null) return;
    const h = Math.max(1, Math.floor(i)), r = h % 2 / 2, o = Math.round(e.Ze.x * i) + r, l = e.Ze.y * s;
    t.fillStyle = e.Cr, t.beginPath();
    const a = Math.max(2, 1.5 * e.Tr) * i;
    t.arc(o, l, a, 0, 2 * Math.PI, !1), t.fill(), t.fillStyle = e.Pr, t.beginPath(), t.arc(o, l, e.ht * i, 0, 2 * Math.PI, !1), t.fill(), t.lineWidth = h, t.strokeStyle = e.Rr, t.beginPath(), t.arc(o, l, e.ht * i + h / 2, 0, 2 * Math.PI, !1), t.stroke();
  }
}
const He = [{ Dr: 0, Vr: 0.25, Or: 4, Br: 10, Ar: 0.25, Ir: 0, zr: 0.4, Lr: 0.8 }, { Dr: 0.25, Vr: 0.525, Or: 10, Br: 14, Ar: 0, Ir: 0, zr: 0.8, Lr: 0 }, { Dr: 0.525, Vr: 1, Or: 14, Br: 14, Ar: 0, Ir: 0, zr: 0, Lr: 0 }];
function Di(n, t, i, s) {
  return function(e, h) {
    if (e === "transparent") return e;
    const r = ot(e), o = r[3];
    return `rgba(${r[0]}, ${r[1]}, ${r[2]}, ${h * o})`;
  }(n, i + (s - i) * t);
}
function Ni(n, t) {
  const i = n % 2600 / 2600;
  let s;
  for (const l of He) if (i >= l.Dr && i <= l.Vr) {
    s = l;
    break;
  }
  I(s !== void 0, "Last price animation internal logic error");
  const e = (i - s.Dr) / (s.Vr - s.Dr);
  return { Pr: Di(t, e, s.Ar, s.Ir), Rr: Di(t, e, s.zr, s.Lr), ht: (h = e, r = s.Or, o = s.Br, r + (o - r) * h) };
  var h, r, o;
}
class Ze {
  constructor(t) {
    this.Wt = new Je(), this.ft = !0, this.Er = !0, this.Nr = performance.now(), this.Fr = this.Nr - 1, this.Wr = t;
  }
  jr() {
    this.Fr = this.Nr - 1, this.bt();
  }
  Hr() {
    if (this.bt(), this.Wr.W().lastPriceAnimation === 2) {
      const t = performance.now(), i = this.Fr - t;
      if (i > 0) return void (i < 650 && (this.Fr += 2600));
      this.Nr = t, this.Fr = t + 2600;
    }
  }
  bt() {
    this.ft = !0;
  }
  $r() {
    this.Er = !0;
  }
  yt() {
    return this.Wr.W().lastPriceAnimation !== 0;
  }
  Ur() {
    switch (this.Wr.W().lastPriceAnimation) {
      case 0:
        return !1;
      case 1:
        return !0;
      case 2:
        return performance.now() <= this.Fr;
    }
  }
  gt() {
    return this.ft ? (this.Mt(), this.ft = !1, this.Er = !1) : this.Er && (this.qr(), this.Er = !1), this.Wt;
  }
  Mt() {
    this.Wt.J(null);
    const t = this.Wr.$t().St(), i = t.Zs(), s = this.Wr.Ct();
    if (i === null || s === null) return;
    const e = this.Wr.Yr(!0);
    if (e.Zr || !i.Xr(e.se)) return;
    const h = { x: t.It(e.se), y: this.Wr.Dt().Rt(e._t, s.Vt) }, r = e.V, o = this.Wr.W().lineWidth, l = Ni(this.Kr(), r);
    this.Wt.J({ Cr: r, Tr: o, Pr: l.Pr, Rr: l.Rr, ht: l.ht, Ze: h });
  }
  qr() {
    const t = this.Wt.He();
    if (t !== null) {
      const i = Ni(this.Kr(), t.Cr);
      t.Pr = i.Pr, t.Rr = i.Rr, t.ht = i.ht;
    }
  }
  Kr() {
    return this.Ur() ? performance.now() - this.Nr : 2599;
  }
}
function et(n, t) {
  return Vs(Math.min(Math.max(n, 12), 30) * t);
}
function ut(n, t) {
  switch (n) {
    case "arrowDown":
    case "arrowUp":
      return et(t, 1);
    case "circle":
      return et(t, 0.8);
    case "square":
      return et(t, 0.7);
  }
}
function Os(n) {
  return function(t) {
    const i = Math.ceil(t);
    return i % 2 != 0 ? i - 1 : i;
  }(et(n, 1));
}
function Oi(n) {
  return Math.max(et(n, 0.1), 3);
}
function Bi(n, t, i) {
  return t ? n : i ? Math.ceil(n / 2) : 0;
}
function Bs(n, t, i, s, e) {
  const h = ut("square", i), r = (h - 1) / 2, o = n - r, l = t - r;
  return s >= o && s <= o + h && e >= l && e <= l + h;
}
function Ii(n, t, i, s) {
  const e = (ut("arrowUp", s) - 1) / 2 * i.Gr, h = (Vs(s / 2) - 1) / 2 * i.Gr;
  t.beginPath(), n ? (t.moveTo(i.nt - e, i.st), t.lineTo(i.nt, i.st - e), t.lineTo(i.nt + e, i.st), t.lineTo(i.nt + h, i.st), t.lineTo(i.nt + h, i.st + e), t.lineTo(i.nt - h, i.st + e), t.lineTo(i.nt - h, i.st)) : (t.moveTo(i.nt - e, i.st), t.lineTo(i.nt, i.st + e), t.lineTo(i.nt + e, i.st), t.lineTo(i.nt + h, i.st), t.lineTo(i.nt + h, i.st - e), t.lineTo(i.nt - h, i.st - e), t.lineTo(i.nt - h, i.st)), t.fill();
}
function Ye(n, t, i, s, e, h) {
  return Bs(t, i, s, e, h);
}
class Ge extends P {
  constructor() {
    super(...arguments), this.zt = null, this.lr = new ct(), this.j = -1, this.H = "", this.Jr = "";
  }
  J(t) {
    this.zt = t;
  }
  ar(t, i) {
    this.j === t && this.H === i || (this.j = t, this.H = i, this.Jr = Q(t, i), this.lr.ir());
  }
  br(t, i) {
    if (this.zt === null || this.zt.tt === null) return null;
    for (let s = this.zt.tt.from; s < this.zt.tt.to; s++) {
      const e = this.zt.it[s];
      if (Qe(e, t, i)) return { gr: e.Qr, wr: e.wr };
    }
    return null;
  }
  K({ context: t, horizontalPixelRatio: i, verticalPixelRatio: s }, e, h) {
    if (this.zt !== null && this.zt.tt !== null) {
      t.textBaseline = "middle", t.font = this.Jr;
      for (let r = this.zt.tt.from; r < this.zt.tt.to; r++) {
        const o = this.zt.it[r];
        o.Kt !== void 0 && (o.Kt.Hi = this.lr.xi(t, o.Kt.th), o.Kt.At = this.j, o.Kt.nt = o.nt - o.Kt.Hi / 2), qe(o, t, i, s);
      }
    }
  }
}
function qe(n, t, i, s) {
  t.fillStyle = n.V, n.Kt !== void 0 && function(e, h, r, o, l, a) {
    e.save(), e.scale(l, a), e.fillText(h, r, o), e.restore();
  }(t, n.Kt.th, n.Kt.nt, n.Kt.st, i, s), function(e, h, r) {
    if (e.Xs !== 0) {
      switch (e.ih) {
        case "arrowDown":
          return void Ii(!1, h, r, e.Xs);
        case "arrowUp":
          return void Ii(!0, h, r, e.Xs);
        case "circle":
          return void function(o, l, a) {
            const c = (ut("circle", a) - 1) / 2;
            o.beginPath(), o.arc(l.nt, l.st, c * l.Gr, 0, 2 * Math.PI, !1), o.fill();
          }(h, r, e.Xs);
        case "square":
          return void function(o, l, a) {
            const c = ut("square", a), u = (c - 1) * l.Gr / 2, d = l.nt - u, f = l.st - u;
            o.fillRect(d, f, c * l.Gr, c * l.Gr);
          }(h, r, e.Xs);
      }
      e.ih;
    }
  }(n, t, function(e, h, r) {
    const o = Math.max(1, Math.floor(h)) % 2 / 2;
    return { nt: Math.round(e.nt * h) + o, st: e.st * r, Gr: h };
  }(n, i, s));
}
function Qe(n, t, i) {
  return !(n.Kt === void 0 || !function(s, e, h, r, o, l) {
    const a = r / 2;
    return o >= s && o <= s + h && l >= e - a && l <= e + a;
  }(n.Kt.nt, n.Kt.st, n.Kt.Hi, n.Kt.At, t, i)) || function(s, e, h) {
    if (s.Xs === 0) return !1;
    switch (s.ih) {
      case "arrowDown":
      case "arrowUp":
        return Ye(0, s.nt, s.st, s.Xs, e, h);
      case "circle":
        return function(r, o, l, a, c) {
          const u = 2 + ut("circle", l) / 2, d = r - a, f = o - c;
          return Math.sqrt(d * d + f * f) <= u;
        }(s.nt, s.st, s.Xs, e, h);
      case "square":
        return Bs(s.nt, s.st, s.Xs, e, h);
    }
  }(n, t, i);
}
function tn(n, t, i, s, e, h, r, o, l) {
  const a = $(i) ? i : i.xe, c = $(i) ? i : i.ge, u = $(i) ? i : i.Me, d = $(t.size) ? Math.max(t.size, 0) : 1, f = Os(o.he()) * d, m = f / 2;
  switch (n.Xs = f, t.position) {
    case "inBar":
      return n.st = r.Rt(a, l), void (n.Kt !== void 0 && (n.Kt.st = n.st + m + h + 0.6 * e));
    case "aboveBar":
      return n.st = r.Rt(c, l) - m - s.nh, n.Kt !== void 0 && (n.Kt.st = n.st - m - 0.6 * e, s.nh += 1.2 * e), void (s.nh += f + h);
    case "belowBar":
      return n.st = r.Rt(u, l) + m + s.sh, n.Kt !== void 0 && (n.Kt.st = n.st + m + h + 0.6 * e, s.sh += 1.2 * e), void (s.sh += f + h);
  }
  t.position;
}
class sn {
  constructor(t, i) {
    this.ft = !0, this.eh = !0, this.rh = !0, this.hh = null, this.ah = null, this.Wt = new Ge(), this.Wr = t, this.$i = i, this.zt = { it: [], tt: null };
  }
  bt(t) {
    this.ft = !0, this.rh = !0, t === "data" && (this.eh = !0, this.ah = null);
  }
  gt(t) {
    if (!this.Wr.yt()) return null;
    this.ft && this.oh();
    const i = this.$i.W().layout;
    return this.Wt.ar(i.fontSize, i.fontFamily), this.Wt.J(this.zt), this.Wt;
  }
  _h() {
    if (this.rh) {
      if (this.Wr.uh().length > 0) {
        const t = this.$i.St().he(), i = Oi(t), s = 1.5 * Os(t) + 2 * i, e = this.dh();
        this.hh = { above: Bi(s, e.aboveBar, e.inBar), below: Bi(s, e.belowBar, e.inBar) };
      } else this.hh = null;
      this.rh = !1;
    }
    return this.hh;
  }
  dh() {
    return this.ah === null && (this.ah = this.Wr.uh().reduce((t, i) => (t[i.position] || (t[i.position] = !0), t), { inBar: !1, aboveBar: !1, belowBar: !1 })), this.ah;
  }
  oh() {
    const t = this.Wr.Dt(), i = this.$i.St(), s = this.Wr.uh();
    this.eh && (this.zt.it = s.map((c) => ({ ot: c.time, nt: 0, st: 0, Xs: 0, ih: c.shape, V: c.color, Qr: c.Qr, wr: c.id, Kt: void 0 })), this.eh = !1);
    const e = this.$i.W().layout;
    this.zt.tt = null;
    const h = i.Zs();
    if (h === null) return;
    const r = this.Wr.Ct();
    if (r === null || this.zt.it.length === 0) return;
    let o = NaN;
    const l = Oi(i.he()), a = { nh: l, sh: l };
    this.zt.tt = $s(this.zt.it, h, !0);
    for (let c = this.zt.tt.from; c < this.zt.tt.to; c++) {
      const u = s[c];
      u.time !== o && (a.nh = l, a.sh = l, o = u.time);
      const d = this.zt.it[c];
      d.nt = i.It(u.time), u.text !== void 0 && u.text.length > 0 && (d.Kt = { th: u.text, nt: 0, st: 0, Hi: 0, At: 0 });
      const f = this.Wr.fh(u.time);
      f !== null && tn(d, u, f, a, e.fontSize, l, t, i, r.Vt);
    }
    this.ft = !1;
  }
}
class en extends mi {
  constructor(t) {
    super(t);
  }
  kr() {
    const t = this.Mr;
    t.yt = !1;
    const i = this.Ls.W();
    if (!i.priceLineVisible || !this.Ls.yt()) return;
    const s = this.Ls.Yr(i.priceLineSource === 0);
    s.Zr || (t.yt = !0, t.st = s.ki, t.V = this.Ls.ph(s.V), t.et = i.priceLineWidth, t.Nt = i.priceLineStyle);
  }
}
class nn extends Vt {
  constructor(t) {
    super(), this.jt = t;
  }
  zi(t, i, s) {
    t.yt = !1, i.yt = !1;
    const e = this.jt;
    if (!e.yt()) return;
    const h = e.W(), r = h.lastValueVisible, o = e.mh() !== "", l = h.seriesLastValueMode === 0, a = e.Yr(!1);
    if (a.Zr) return;
    r && (t.Kt = this.bh(a, r, l), t.yt = t.Kt.length !== 0), (o || l) && (i.Kt = this.wh(a, r, o, l), i.yt = i.Kt.length > 0);
    const c = e.ph(a.V), u = kt(c);
    s.t = u.t, s.ki = a.ki, i.Ot = e.$t().Bt(a.ki / e.Dt().At()), t.Ot = c, t.V = u.i, i.V = u.i;
  }
  wh(t, i, s, e) {
    let h = "";
    const r = this.jt.mh();
    return s && r.length !== 0 && (h += `${r} `), i && e && (h += this.jt.Dt().gh() ? t.Mh : t.xh), h.trim();
  }
  bh(t, i, s) {
    return i ? s ? this.jt.Dt().gh() ? t.xh : t.Mh : t.Kt : "";
  }
}
function ji(n, t, i, s) {
  const e = Number.isFinite(t), h = Number.isFinite(i);
  return e && h ? n(t, i) : e || h ? e ? t : i : s;
}
class E {
  constructor(t, i) {
    this.Sh = t, this.kh = i;
  }
  yh(t) {
    return t !== null && this.Sh === t.Sh && this.kh === t.kh;
  }
  Ch() {
    return new E(this.Sh, this.kh);
  }
  Th() {
    return this.Sh;
  }
  Ph() {
    return this.kh;
  }
  Rh() {
    return this.kh - this.Sh;
  }
  Ni() {
    return this.kh === this.Sh || Number.isNaN(this.kh) || Number.isNaN(this.Sh);
  }
  ts(t) {
    return t === null ? this : new E(ji(Math.min, this.Th(), t.Th(), -1 / 0), ji(Math.max, this.Ph(), t.Ph(), 1 / 0));
  }
  Dh(t) {
    if (!$(t) || this.kh - this.Sh === 0) return;
    const i = 0.5 * (this.kh + this.Sh);
    let s = this.kh - i, e = this.Sh - i;
    s *= t, e *= t, this.kh = i + s, this.Sh = i + e;
  }
  Vh(t) {
    $(t) && (this.kh += t, this.Sh += t);
  }
  Oh() {
    return { minValue: this.Sh, maxValue: this.kh };
  }
  static Bh(t) {
    return t === null ? null : new E(t.minValue, t.maxValue);
  }
}
class Ct {
  constructor(t, i) {
    this.Ah = t, this.Ih = i || null;
  }
  zh() {
    return this.Ah;
  }
  Lh() {
    return this.Ih;
  }
  Oh() {
    return this.Ah === null ? null : { priceRange: this.Ah.Oh(), margins: this.Ih || void 0 };
  }
  static Bh(t) {
    return t === null ? null : new Ct(E.Bh(t.priceRange), t.margins);
  }
}
class hn extends mi {
  constructor(t, i) {
    super(t), this.Eh = i;
  }
  kr() {
    const t = this.Mr;
    t.yt = !1;
    const i = this.Eh.W();
    if (!this.Ls.yt() || !i.lineVisible) return;
    const s = this.Eh.Nh();
    s !== null && (t.yt = !0, t.st = s, t.V = i.color, t.et = i.lineWidth, t.Nt = i.lineStyle, t.wr = this.Eh.W().id);
  }
}
class rn extends Vt {
  constructor(t, i) {
    super(), this.Wr = t, this.Eh = i;
  }
  zi(t, i, s) {
    t.yt = !1, i.yt = !1;
    const e = this.Eh.W(), h = e.axisLabelVisible, r = e.title !== "", o = this.Wr;
    if (!h || !o.yt()) return;
    const l = this.Eh.Nh();
    if (l === null) return;
    r && (i.Kt = e.title, i.yt = !0), i.Ot = o.$t().Bt(l / o.Dt().At()), t.Kt = this.Fh(e.price), t.yt = !0;
    const a = kt(e.axisLabelColor || e.color);
    s.t = a.t;
    const c = e.axisLabelTextColor || a.i;
    t.V = c, i.V = c, s.ki = l;
  }
  Fh(t) {
    const i = this.Wr.Ct();
    return i === null ? "" : this.Wr.Dt().Fi(t, i.Vt);
  }
}
class on {
  constructor(t, i) {
    this.Wr = t, this.cn = i, this.Wh = new hn(t, this), this._r = new rn(t, this), this.jh = new Ns(this._r, t, t.$t());
  }
  Hh(t) {
    W(this.cn, t), this.bt(), this.Wr.$t().$h();
  }
  W() {
    return this.cn;
  }
  Uh() {
    return this.Wh;
  }
  qh() {
    return this.jh;
  }
  Yh() {
    return this._r;
  }
  bt() {
    this.Wh.bt(), this._r.bt();
  }
  Nh() {
    const t = this.Wr, i = t.Dt();
    if (t.$t().St().Ni() || i.Ni()) return null;
    const s = t.Ct();
    return s === null ? null : i.Rt(this.cn.price, s.Vt);
  }
}
class ln extends ui {
  constructor(t) {
    super(), this.$i = t;
  }
  $t() {
    return this.$i;
  }
}
const an = { Bar: (n, t, i, s) => {
  var e;
  const h = t.upColor, r = t.downColor, o = v(n(i, s)), l = Z(o.Vt[0]) <= Z(o.Vt[3]);
  return { ue: (e = o.V) !== null && e !== void 0 ? e : l ? h : r };
}, Candlestick: (n, t, i, s) => {
  var e, h, r;
  const o = t.upColor, l = t.downColor, a = t.borderUpColor, c = t.borderDownColor, u = t.wickUpColor, d = t.wickDownColor, f = v(n(i, s)), m = Z(f.Vt[0]) <= Z(f.Vt[3]);
  return { ue: (e = f.V) !== null && e !== void 0 ? e : m ? o : l, Ee: (h = f.Ot) !== null && h !== void 0 ? h : m ? a : c, Le: (r = f.Zh) !== null && r !== void 0 ? r : m ? u : d };
}, Custom: (n, t, i, s) => {
  var e;
  return { ue: (e = v(n(i, s)).V) !== null && e !== void 0 ? e : t.color };
}, Area: (n, t, i, s) => {
  var e, h, r, o;
  const l = v(n(i, s));
  return { ue: (e = l.lt) !== null && e !== void 0 ? e : t.lineColor, lt: (h = l.lt) !== null && h !== void 0 ? h : t.lineColor, Ts: (r = l.Ts) !== null && r !== void 0 ? r : t.topColor, Ps: (o = l.Ps) !== null && o !== void 0 ? o : t.bottomColor };
}, Baseline: (n, t, i, s) => {
  var e, h, r, o, l, a;
  const c = v(n(i, s));
  return { ue: c.Vt[3] >= t.baseValue.price ? t.topLineColor : t.bottomLineColor, Pe: (e = c.Pe) !== null && e !== void 0 ? e : t.topLineColor, Re: (h = c.Re) !== null && h !== void 0 ? h : t.bottomLineColor, Se: (r = c.Se) !== null && r !== void 0 ? r : t.topFillColor1, ke: (o = c.ke) !== null && o !== void 0 ? o : t.topFillColor2, ye: (l = c.ye) !== null && l !== void 0 ? l : t.bottomFillColor1, Ce: (a = c.Ce) !== null && a !== void 0 ? a : t.bottomFillColor2 };
}, Line: (n, t, i, s) => {
  var e, h;
  const r = v(n(i, s));
  return { ue: (e = r.V) !== null && e !== void 0 ? e : t.color, lt: (h = r.V) !== null && h !== void 0 ? h : t.color };
}, Histogram: (n, t, i, s) => {
  var e;
  return { ue: (e = v(n(i, s)).V) !== null && e !== void 0 ? e : t.color };
} };
class cn {
  constructor(t) {
    this.Xh = (i, s) => s !== void 0 ? s.Vt : this.Wr.In().Kh(i), this.Wr = t, this.Gh = an[t.Jh()];
  }
  Hs(t, i) {
    return this.Gh(this.Xh, this.Wr.W(), t, i);
  }
}
var Fi;
(function(n) {
  n[n.NearestLeft = -1] = "NearestLeft", n[n.None = 0] = "None", n[n.NearestRight = 1] = "NearestRight";
})(Fi || (Fi = {}));
const B = 30;
class un {
  constructor() {
    this.Qh = [], this.tl = /* @__PURE__ */ new Map(), this.il = /* @__PURE__ */ new Map();
  }
  nl() {
    return this.Xs() > 0 ? this.Qh[this.Qh.length - 1] : null;
  }
  sl() {
    return this.Xs() > 0 ? this.el(0) : null;
  }
  An() {
    return this.Xs() > 0 ? this.el(this.Qh.length - 1) : null;
  }
  Xs() {
    return this.Qh.length;
  }
  Ni() {
    return this.Xs() === 0;
  }
  Xr(t) {
    return this.rl(t, 0) !== null;
  }
  Kh(t) {
    return this.hl(t);
  }
  hl(t, i = 0) {
    const s = this.rl(t, i);
    return s === null ? null : Object.assign(Object.assign({}, this.ll(s)), { se: this.el(s) });
  }
  ie() {
    return this.Qh;
  }
  al(t, i, s) {
    if (this.Ni()) return null;
    let e = null;
    for (const h of s)
      e = bt(e, this.ol(t, i, h));
    return e;
  }
  J(t) {
    this.il.clear(), this.tl.clear(), this.Qh = t;
  }
  el(t) {
    return this.Qh[t].se;
  }
  ll(t) {
    return this.Qh[t];
  }
  rl(t, i) {
    const s = this._l(t);
    if (s === null && i !== 0) switch (i) {
      case -1:
        return this.ul(t);
      case 1:
        return this.cl(t);
      default:
        throw new TypeError("Unknown search mode");
    }
    return s;
  }
  ul(t) {
    let i = this.dl(t);
    return i > 0 && (i -= 1), i !== this.Qh.length && this.el(i) < t ? i : null;
  }
  cl(t) {
    const i = this.fl(t);
    return i !== this.Qh.length && t < this.el(i) ? i : null;
  }
  _l(t) {
    const i = this.dl(t);
    return i === this.Qh.length || t < this.Qh[i].se ? null : i;
  }
  dl(t) {
    return ft(this.Qh, t, (i, s) => i.se < s);
  }
  fl(t) {
    return Rs(this.Qh, t, (i, s) => i.se > s);
  }
  vl(t, i, s) {
    let e = null;
    for (let h = t; h < i; h++) {
      const r = this.Qh[h].Vt[s];
      Number.isNaN(r) || (e === null ? e = { pl: r, ml: r } : (r < e.pl && (e.pl = r), r > e.ml && (e.ml = r)));
    }
    return e;
  }
  ol(t, i, s) {
    if (this.Ni()) return null;
    let e = null;
    const h = v(this.sl()), r = v(this.An()), o = Math.max(t, h), l = Math.min(i, r), a = Math.ceil(o / B) * B, c = Math.max(a, Math.floor(l / B) * B);
    {
      const d = this.dl(o), f = this.fl(Math.min(l, a, i));
      e = bt(e, this.vl(d, f, s));
    }
    let u = this.tl.get(s);
    u === void 0 && (u = /* @__PURE__ */ new Map(), this.tl.set(s, u));
    for (let d = Math.max(a + 1, o); d < c; d += B) {
      const f = Math.floor(d / B);
      let m = u.get(f);
      if (m === void 0) {
        const p = this.dl(f * B), b = this.fl((f + 1) * B - 1);
        m = this.vl(p, b, s), u.set(f, m);
      }
      e = bt(e, m);
    }
    {
      const d = this.dl(c), f = this.fl(l);
      e = bt(e, this.vl(d, f, s));
    }
    return e;
  }
}
function bt(n, t) {
  return n === null ? t : t === null ? n : { pl: Math.min(n.pl, t.pl), ml: Math.max(n.ml, t.ml) };
}
class dn {
  constructor(t) {
    this.bl = t;
  }
  X(t, i, s) {
    this.bl.draw(t);
  }
  wl(t, i, s) {
    var e, h;
    (h = (e = this.bl).drawBackground) === null || h === void 0 || h.call(e, t);
  }
}
class It {
  constructor(t) {
    this.Qe = null, this.wn = t;
  }
  gt() {
    var t;
    const i = this.wn.renderer();
    if (i === null) return null;
    if (((t = this.Qe) === null || t === void 0 ? void 0 : t.gl) === i) return this.Qe.Ml;
    const s = new dn(i);
    return this.Qe = { gl: i, Ml: s }, s;
  }
  xl() {
    var t, i, s;
    return (s = (i = (t = this.wn).zOrder) === null || i === void 0 ? void 0 : i.call(t)) !== null && s !== void 0 ? s : "normal";
  }
}
function Is(n) {
  var t, i, s, e, h;
  return { Kt: n.text(), ki: n.coordinate(), Si: (t = n.fixedCoordinate) === null || t === void 0 ? void 0 : t.call(n), V: n.textColor(), t: n.backColor(), yt: (s = (i = n.visible) === null || i === void 0 ? void 0 : i.call(n)) === null || s === void 0 || s, hi: (h = (e = n.tickVisible) === null || e === void 0 ? void 0 : e.call(n)) === null || h === void 0 || h };
}
class fn {
  constructor(t, i) {
    this.Wt = new Cs(), this.Sl = t, this.kl = i;
  }
  gt() {
    return this.Wt.J(Object.assign({ Hi: this.kl.Hi() }, Is(this.Sl))), this.Wt;
  }
}
class mn extends Vt {
  constructor(t, i) {
    super(), this.Sl = t, this.Li = i;
  }
  zi(t, i, s) {
    const e = Is(this.Sl);
    s.t = e.t, t.V = e.V;
    const h = 2 / 12 * this.Li.P();
    s.wi = h, s.gi = h, s.ki = e.ki, s.Si = e.Si, t.Kt = e.Kt, t.yt = e.yt, t.hi = e.hi;
  }
}
class pn {
  constructor(t, i) {
    this.yl = null, this.Cl = null, this.Tl = null, this.Pl = null, this.Rl = null, this.Dl = t, this.Wr = i;
  }
  Vl() {
    return this.Dl;
  }
  Vn() {
    var t, i;
    (i = (t = this.Dl).updateAllViews) === null || i === void 0 || i.call(t);
  }
  Pn() {
    var t, i, s, e;
    const h = (s = (i = (t = this.Dl).paneViews) === null || i === void 0 ? void 0 : i.call(t)) !== null && s !== void 0 ? s : [];
    if (((e = this.yl) === null || e === void 0 ? void 0 : e.gl) === h) return this.yl.Ml;
    const r = h.map((o) => new It(o));
    return this.yl = { gl: h, Ml: r }, r;
  }
  Qi() {
    var t, i, s, e;
    const h = (s = (i = (t = this.Dl).timeAxisViews) === null || i === void 0 ? void 0 : i.call(t)) !== null && s !== void 0 ? s : [];
    if (((e = this.Cl) === null || e === void 0 ? void 0 : e.gl) === h) return this.Cl.Ml;
    const r = this.Wr.$t().St(), o = h.map((l) => new fn(l, r));
    return this.Cl = { gl: h, Ml: o }, o;
  }
  Rn() {
    var t, i, s, e;
    const h = (s = (i = (t = this.Dl).priceAxisViews) === null || i === void 0 ? void 0 : i.call(t)) !== null && s !== void 0 ? s : [];
    if (((e = this.Tl) === null || e === void 0 ? void 0 : e.gl) === h) return this.Tl.Ml;
    const r = this.Wr.Dt(), o = h.map((l) => new mn(l, r));
    return this.Tl = { gl: h, Ml: o }, o;
  }
  Ol() {
    var t, i, s, e;
    const h = (s = (i = (t = this.Dl).priceAxisPaneViews) === null || i === void 0 ? void 0 : i.call(t)) !== null && s !== void 0 ? s : [];
    if (((e = this.Pl) === null || e === void 0 ? void 0 : e.gl) === h) return this.Pl.Ml;
    const r = h.map((o) => new It(o));
    return this.Pl = { gl: h, Ml: r }, r;
  }
  Bl() {
    var t, i, s, e;
    const h = (s = (i = (t = this.Dl).timeAxisPaneViews) === null || i === void 0 ? void 0 : i.call(t)) !== null && s !== void 0 ? s : [];
    if (((e = this.Rl) === null || e === void 0 ? void 0 : e.gl) === h) return this.Rl.Ml;
    const r = h.map((o) => new It(o));
    return this.Rl = { gl: h, Ml: r }, r;
  }
  Al(t, i) {
    var s, e, h;
    return (h = (e = (s = this.Dl).autoscaleInfo) === null || e === void 0 ? void 0 : e.call(s, t, i)) !== null && h !== void 0 ? h : null;
  }
  br(t, i) {
    var s, e, h;
    return (h = (e = (s = this.Dl).hitTest) === null || e === void 0 ? void 0 : e.call(s, t, i)) !== null && h !== void 0 ? h : null;
  }
}
function jt(n, t, i, s) {
  n.forEach((e) => {
    t(e).forEach((h) => {
      h.xl() === i && s.push(h);
    });
  });
}
function Ft(n) {
  return n.Pn();
}
function vn(n) {
  return n.Ol();
}
function bn(n) {
  return n.Bl();
}
class pi extends ln {
  constructor(t, i, s, e, h) {
    super(t), this.zt = new un(), this.Wh = new en(this), this.Il = [], this.zl = new Xe(this), this.Ll = null, this.El = null, this.Nl = [], this.Fl = [], this.Wl = null, this.jl = [], this.cn = i, this.Hl = s;
    const r = new nn(this);
    this.rn = [r], this.jh = new Ns(r, this, t), s !== "Area" && s !== "Line" && s !== "Baseline" || (this.Ll = new Ze(this)), this.$l(), this.Ul(h);
  }
  S() {
    this.Wl !== null && clearTimeout(this.Wl);
  }
  ph(t) {
    return this.cn.priceLineColor || t;
  }
  Yr(t) {
    const i = { Zr: !0 }, s = this.Dt();
    if (this.$t().St().Ni() || s.Ni() || this.zt.Ni()) return i;
    const e = this.$t().St().Zs(), h = this.Ct();
    if (e === null || h === null) return i;
    let r, o;
    if (t) {
      const u = this.zt.nl();
      if (u === null) return i;
      r = u, o = u.se;
    } else {
      const u = this.zt.hl(e.ui(), -1);
      if (u === null || (r = this.zt.Kh(u.se), r === null)) return i;
      o = u.se;
    }
    const l = r.Vt[3], a = this.$s().Hs(o, { Vt: r }), c = s.Rt(l, h.Vt);
    return { Zr: !1, _t: l, Kt: s.Fi(l, h.Vt), Mh: s.ql(l), xh: s.Yl(l, h.Vt), V: a.ue, ki: c, se: o };
  }
  $s() {
    return this.El !== null || (this.El = new cn(this)), this.El;
  }
  W() {
    return this.cn;
  }
  Hh(t) {
    const i = t.priceScaleId;
    i !== void 0 && i !== this.cn.priceScaleId && this.$t().Zl(this, i), W(this.cn, t), t.priceFormat !== void 0 && (this.$l(), this.$t().Xl()), this.$t().Kl(this), this.$t().Gl(), this.wn.bt("options");
  }
  J(t, i) {
    this.zt.J(t), this.Jl(), this.wn.bt("data"), this.dn.bt("data"), this.Ll !== null && (i && i.Ql ? this.Ll.Hr() : t.length === 0 && this.Ll.jr());
    const s = this.$t().cr(this);
    this.$t().ta(s), this.$t().Kl(this), this.$t().Gl(), this.$t().$h();
  }
  ia(t) {
    this.Nl = t, this.Jl();
    const i = this.$t().cr(this);
    this.dn.bt("data"), this.$t().ta(i), this.$t().Kl(this), this.$t().Gl(), this.$t().$h();
  }
  na() {
    return this.Nl;
  }
  uh() {
    return this.Fl;
  }
  sa(t) {
    const i = new on(this, t);
    return this.Il.push(i), this.$t().Kl(this), i;
  }
  ea(t) {
    const i = this.Il.indexOf(t);
    i !== -1 && this.Il.splice(i, 1), this.$t().Kl(this);
  }
  Jh() {
    return this.Hl;
  }
  Ct() {
    const t = this.ra();
    return t === null ? null : { Vt: t.Vt[3], ha: t.ot };
  }
  ra() {
    const t = this.$t().St().Zs();
    if (t === null) return null;
    const i = t.Vs();
    return this.zt.hl(i, 1);
  }
  In() {
    return this.zt;
  }
  fh(t) {
    const i = this.zt.Kh(t);
    return i === null ? null : this.Hl === "Bar" || this.Hl === "Candlestick" || this.Hl === "Custom" ? { we: i.Vt[0], ge: i.Vt[1], Me: i.Vt[2], xe: i.Vt[3] } : i.Vt[3];
  }
  la(t) {
    const i = [];
    jt(this.jl, Ft, "top", i);
    const s = this.Ll;
    return s !== null && s.yt() && (this.Wl === null && s.Ur() && (this.Wl = setTimeout(() => {
      this.Wl = null, this.$t().aa();
    }, 0)), s.$r(), i.unshift(s)), i;
  }
  Pn() {
    const t = [];
    this.oa() || t.push(this.zl), t.push(this.wn, this.Wh, this.dn);
    const i = this.Il.map((s) => s.Uh());
    return t.push(...i), jt(this.jl, Ft, "normal", t), t;
  }
  _a() {
    return this.ua(Ft, "bottom");
  }
  ca(t) {
    return this.ua(vn, t);
  }
  da(t) {
    return this.ua(bn, t);
  }
  fa(t, i) {
    return this.jl.map((s) => s.br(t, i)).filter((s) => s !== null);
  }
  Ji(t) {
    return [this.jh, ...this.Il.map((i) => i.qh())];
  }
  Rn(t, i) {
    if (i !== this.Yi && !this.oa()) return [];
    const s = [...this.rn];
    for (const e of this.Il) s.push(e.Yh());
    return this.jl.forEach((e) => {
      s.push(...e.Rn());
    }), s;
  }
  Qi() {
    const t = [];
    return this.jl.forEach((i) => {
      t.push(...i.Qi());
    }), t;
  }
  Al(t, i) {
    if (this.cn.autoscaleInfoProvider !== void 0) {
      const s = this.cn.autoscaleInfoProvider(() => {
        const e = this.va(t, i);
        return e === null ? null : e.Oh();
      });
      return Ct.Bh(s);
    }
    return this.va(t, i);
  }
  pa() {
    return this.cn.priceFormat.minMove;
  }
  ma() {
    return this.ba;
  }
  Vn() {
    var t;
    this.wn.bt(), this.dn.bt();
    for (const i of this.rn) i.bt();
    for (const i of this.Il) i.bt();
    this.Wh.bt(), this.zl.bt(), (t = this.Ll) === null || t === void 0 || t.bt(), this.jl.forEach((i) => i.Vn());
  }
  Dt() {
    return v(super.Dt());
  }
  kt(t) {
    if (!((this.Hl === "Line" || this.Hl === "Area" || this.Hl === "Baseline") && this.cn.crosshairMarkerVisible)) return null;
    const i = this.zt.Kh(t);
    return i === null ? null : { _t: i.Vt[3], ht: this.wa(), Ot: this.ga(), Pt: this.Ma(), Tt: this.xa(t) };
  }
  mh() {
    return this.cn.title;
  }
  yt() {
    return this.cn.visible;
  }
  Sa(t) {
    this.jl.push(new pn(t, this));
  }
  ka(t) {
    this.jl = this.jl.filter((i) => i.Vl() !== t);
  }
  ya() {
    if (this.wn instanceof Bt) return (t) => this.wn.Fe(t);
  }
  Ca() {
    if (this.wn instanceof Bt) return (t) => this.wn.We(t);
  }
  oa() {
    return !Tt(this.Dt().Ta());
  }
  va(t, i) {
    if (!lt(t) || !lt(i) || this.zt.Ni()) return null;
    const s = this.Hl === "Line" || this.Hl === "Area" || this.Hl === "Baseline" || this.Hl === "Histogram" ? [3] : [2, 1], e = this.zt.al(t, i, s);
    let h = e !== null ? new E(e.pl, e.ml) : null;
    if (this.Jh() === "Histogram") {
      const o = this.cn.base, l = new E(o, o);
      h = h !== null ? h.ts(l) : l;
    }
    let r = this.dn._h();
    return this.jl.forEach((o) => {
      const l = o.Al(t, i);
      if (l != null && l.priceRange) {
        const f = new E(l.priceRange.minValue, l.priceRange.maxValue);
        h = h !== null ? h.ts(f) : f;
      }
      var a, c, u, d;
      l != null && l.margins && (a = r, c = l.margins, r = { above: Math.max((u = a == null ? void 0 : a.above) !== null && u !== void 0 ? u : 0, c.above), below: Math.max((d = a == null ? void 0 : a.below) !== null && d !== void 0 ? d : 0, c.below) });
    }), new Ct(h, r);
  }
  wa() {
    switch (this.Hl) {
      case "Line":
      case "Area":
      case "Baseline":
        return this.cn.crosshairMarkerRadius;
    }
    return 0;
  }
  ga() {
    switch (this.Hl) {
      case "Line":
      case "Area":
      case "Baseline": {
        const t = this.cn.crosshairMarkerBorderColor;
        if (t.length !== 0) return t;
      }
    }
    return null;
  }
  Ma() {
    switch (this.Hl) {
      case "Line":
      case "Area":
      case "Baseline":
        return this.cn.crosshairMarkerBorderWidth;
    }
    return 0;
  }
  xa(t) {
    switch (this.Hl) {
      case "Line":
      case "Area":
      case "Baseline": {
        const i = this.cn.crosshairMarkerBackgroundColor;
        if (i.length !== 0) return i;
      }
    }
    return this.$s().Hs(t).ue;
  }
  $l() {
    switch (this.cn.priceFormat.type) {
      case "custom":
        this.ba = { format: this.cn.priceFormat.formatter };
        break;
      case "volume":
        this.ba = new _e(this.cn.priceFormat.precision);
        break;
      case "percent":
        this.ba = new Ls(this.cn.priceFormat.precision);
        break;
      default: {
        const t = Math.pow(10, this.cn.priceFormat.precision);
        this.ba = new Wt(t, this.cn.priceFormat.minMove * t);
      }
    }
    this.Yi !== null && this.Yi.Pa();
  }
  Jl() {
    const t = this.$t().St();
    if (!t.Ra() || this.zt.Ni()) return void (this.Fl = []);
    const i = v(this.zt.sl());
    this.Fl = this.Nl.map((s, e) => {
      const h = v(t.Da(s.time, !0)), r = h < i ? 1 : -1;
      return { time: v(this.zt.hl(h, r)).se, position: s.position, shape: s.shape, color: s.color, id: s.id, Qr: e, text: s.text, size: s.size, originalTime: s.originalTime };
    });
  }
  Ul(t) {
    switch (this.dn = new sn(this, this.$t()), this.Hl) {
      case "Bar":
        this.wn = new We(this, this.$t());
        break;
      case "Candlestick":
        this.wn = new Ne(this, this.$t());
        break;
      case "Line":
        this.wn = new Fe(this, this.$t());
        break;
      case "Custom":
        this.wn = new Bt(this, this.$t(), k(t));
        break;
      case "Area":
        this.wn = new Ve(this, this.$t());
        break;
      case "Baseline":
        this.wn = new $e(this, this.$t());
        break;
      case "Histogram":
        this.wn = new je(this, this.$t());
        break;
      default:
        throw Error("Unknown chart style assigned: " + this.Hl);
    }
  }
  ua(t, i) {
    const s = [];
    return jt(this.jl, t, i, s), s;
  }
}
class gn {
  constructor(t) {
    this.cn = t;
  }
  Va(t, i, s) {
    let e = t;
    if (this.cn.mode === 0) return e;
    const h = s.vn(), r = h.Ct();
    if (r === null) return e;
    const o = h.Rt(t, r), l = s.Oa().filter((c) => c instanceof pi).reduce((c, u) => {
      if (s.dr(u) || !u.yt()) return c;
      const d = u.Dt(), f = u.In();
      if (d.Ni() || !f.Xr(i)) return c;
      const m = f.Kh(i);
      if (m === null) return c;
      const p = Z(u.Ct());
      return c.concat([d.Rt(m.Vt[3], p.Vt)]);
    }, []);
    if (l.length === 0) return e;
    l.sort((c, u) => Math.abs(c - o) - Math.abs(u - o));
    const a = l[0];
    return e = h.pn(a, r), e;
  }
}
class wn extends P {
  constructor() {
    super(...arguments), this.zt = null;
  }
  J(t) {
    this.zt = t;
  }
  K({ context: t, bitmapSize: i, horizontalPixelRatio: s, verticalPixelRatio: e }) {
    if (this.zt === null) return;
    const h = Math.max(1, Math.floor(s));
    t.lineWidth = h, function(r, o) {
      r.save(), r.lineWidth % 2 && r.translate(0.5, 0.5), o(), r.restore();
    }(t, () => {
      const r = v(this.zt);
      if (r.Ba) {
        t.strokeStyle = r.Aa, K(t, r.Ia), t.beginPath();
        for (const o of r.za) {
          const l = Math.round(o.La * s);
          t.moveTo(l, -h), t.lineTo(l, i.height + h);
        }
        t.stroke();
      }
      if (r.Ea) {
        t.strokeStyle = r.Na, K(t, r.Fa), t.beginPath();
        for (const o of r.Wa) {
          const l = Math.round(o.La * e);
          t.moveTo(-h, l), t.lineTo(i.width + h, l);
        }
        t.stroke();
      }
    });
  }
}
class Sn {
  constructor(t) {
    this.Wt = new wn(), this.ft = !0, this.tn = t;
  }
  bt() {
    this.ft = !0;
  }
  gt() {
    if (this.ft) {
      const t = this.tn.$t().W().grid, i = { Ea: t.horzLines.visible, Ba: t.vertLines.visible, Na: t.horzLines.color, Aa: t.vertLines.color, Fa: t.horzLines.style, Ia: t.vertLines.style, Wa: this.tn.vn().ja(), za: (this.tn.$t().St().ja() || []).map((s) => ({ La: s.coord })) };
      this.Wt.J(i), this.ft = !1;
    }
    return this.Wt;
  }
}
class yn {
  constructor(t) {
    this.wn = new Sn(t);
  }
  Uh() {
    return this.wn;
  }
}
const At = { Ha: 4, $a: 1e-4 };
function Y(n, t) {
  const i = 100 * (n - t) / t;
  return t < 0 ? -i : i;
}
function Mn(n, t) {
  const i = Y(n.Th(), t), s = Y(n.Ph(), t);
  return new E(i, s);
}
function nt(n, t) {
  const i = 100 * (n - t) / t + 100;
  return t < 0 ? -i : i;
}
function _n(n, t) {
  const i = nt(n.Th(), t), s = nt(n.Ph(), t);
  return new E(i, s);
}
function Lt(n, t) {
  const i = Math.abs(n);
  if (i < 1e-15) return 0;
  const s = Math.log10(i + t.$a) + t.Ha;
  return n < 0 ? -s : s;
}
function ht(n, t) {
  const i = Math.abs(n);
  if (i < 1e-15) return 0;
  const s = Math.pow(10, i - t.Ha) - t.$a;
  return n < 0 ? -s : s;
}
function st(n, t) {
  if (n === null) return null;
  const i = Lt(n.Th(), t), s = Lt(n.Ph(), t);
  return new E(i, s);
}
function gt(n, t) {
  if (n === null) return null;
  const i = ht(n.Th(), t), s = ht(n.Ph(), t);
  return new E(i, s);
}
function Kt(n) {
  if (n === null) return At;
  const t = Math.abs(n.Ph() - n.Th());
  if (t >= 1 || t < 1e-15) return At;
  const i = Math.ceil(Math.abs(Math.log10(t))), s = At.Ha + i;
  return { Ha: s, $a: 1 / Math.pow(10, s) };
}
class Ut {
  constructor(t, i) {
    if (this.Ua = t, this.qa = i, function(s) {
      if (s < 0) return !1;
      for (let e = s; e > 1; e /= 10) if (e % 10 != 0) return !1;
      return !0;
    }(this.Ua)) this.Ya = [2, 2.5, 2];
    else {
      this.Ya = [];
      for (let s = this.Ua; s !== 1; ) {
        if (s % 2 == 0) this.Ya.push(2), s /= 2;
        else {
          if (s % 5 != 0) throw new Error("unexpected base");
          this.Ya.push(2, 2.5), s /= 5;
        }
        if (this.Ya.length > 100) throw new Error("something wrong with base");
      }
    }
  }
  Za(t, i, s) {
    const e = this.Ua === 0 ? 0 : 1 / this.Ua;
    let h = Math.pow(10, Math.max(0, Math.ceil(Math.log10(t - i)))), r = 0, o = this.qa[0];
    for (; ; ) {
      const u = vt(h, e, 1e-14) && h > e + 1e-14, d = vt(h, s * o, 1e-14), f = vt(h, 1, 1e-14);
      if (!(u && d && f)) break;
      h /= o, o = this.qa[++r % this.qa.length];
    }
    if (h <= e + 1e-14 && (h = e), h = Math.max(1, h), this.Ya.length > 0 && (l = h, a = 1, c = 1e-14, Math.abs(l - a) < c)) for (r = 0, o = this.Ya[0]; vt(h, s * o, 1e-14) && h > e + 1e-14; ) h /= o, o = this.Ya[++r % this.Ya.length];
    var l, a, c;
    return h;
  }
}
class Ai {
  constructor(t, i, s, e) {
    this.Xa = [], this.Li = t, this.Ua = i, this.Ka = s, this.Ga = e;
  }
  Za(t, i) {
    if (t < i) throw new Error("high < low");
    const s = this.Li.At(), e = (t - i) * this.Ja() / s, h = new Ut(this.Ua, [2, 2.5, 2]), r = new Ut(this.Ua, [2, 2, 2.5]), o = new Ut(this.Ua, [2.5, 2, 2]), l = [];
    return l.push(h.Za(t, i, e), r.Za(t, i, e), o.Za(t, i, e)), function(a) {
      if (a.length < 1) throw Error("array is empty");
      let c = a[0];
      for (let u = 1; u < a.length; ++u) a[u] < c && (c = a[u]);
      return c;
    }(l);
  }
  Qa() {
    const t = this.Li, i = t.Ct();
    if (i === null) return void (this.Xa = []);
    const s = t.At(), e = this.Ka(s - 1, i), h = this.Ka(0, i), r = this.Li.W().entireTextOnly ? this.io() / 2 : 0, o = r, l = s - 1 - r, a = Math.max(e, h), c = Math.min(e, h);
    if (a === c) return void (this.Xa = []);
    let u = this.Za(a, c), d = a % u;
    d += d < 0 ? u : 0;
    const f = a >= c ? 1 : -1;
    let m = null, p = 0;
    for (let b = a - d; b > c; b -= u) {
      const g = this.Ga(b, i, !0);
      m !== null && Math.abs(g - m) < this.Ja() || g < o || g > l || (p < this.Xa.length ? (this.Xa[p].La = g, this.Xa[p].no = t.so(b)) : this.Xa.push({ La: g, no: t.so(b) }), p++, m = g, t.eo() && (u = this.Za(b * f, c)));
    }
    this.Xa.length = p;
  }
  ja() {
    return this.Xa;
  }
  io() {
    return this.Li.P();
  }
  Ja() {
    return Math.ceil(2.5 * this.io());
  }
}
function js(n) {
  return n.slice().sort((t, i) => v(t.Xi()) - v(i.Xi()));
}
var G;
(function(n) {
  n[n.Normal = 0] = "Normal", n[n.Logarithmic = 1] = "Logarithmic", n[n.Percentage = 2] = "Percentage", n[n.IndexedTo100 = 3] = "IndexedTo100";
})(G || (G = {}));
const Ki = new Ls(), Ui = new Wt(100, 1);
class xn {
  constructor(t, i, s, e) {
    this.ro = 0, this.ho = null, this.Ah = null, this.lo = null, this.ao = { oo: !1, _o: null }, this.uo = 0, this.co = 0, this.do = new _(), this.fo = new _(), this.vo = [], this.po = null, this.mo = null, this.bo = null, this.wo = null, this.ba = Ui, this.Mo = Kt(null), this.xo = t, this.cn = i, this.So = s, this.ko = e, this.yo = new Ai(this, 100, this.Co.bind(this), this.To.bind(this));
  }
  Ta() {
    return this.xo;
  }
  W() {
    return this.cn;
  }
  Hh(t) {
    if (W(this.cn, t), this.Pa(), t.mode !== void 0 && this.Po({ yr: t.mode }), t.scaleMargins !== void 0) {
      const i = k(t.scaleMargins.top), s = k(t.scaleMargins.bottom);
      if (i < 0 || i > 1) throw new Error(`Invalid top margin - expect value between 0 and 1, given=${i}`);
      if (s < 0 || s > 1) throw new Error(`Invalid bottom margin - expect value between 0 and 1, given=${s}`);
      if (i + s > 1) throw new Error(`Invalid margins - sum of margins must be less than 1, given=${i + s}`);
      this.Ro(), this.mo = null;
    }
  }
  Do() {
    return this.cn.autoScale;
  }
  eo() {
    return this.cn.mode === 1;
  }
  gh() {
    return this.cn.mode === 2;
  }
  Vo() {
    return this.cn.mode === 3;
  }
  yr() {
    return { Wn: this.cn.autoScale, Oo: this.cn.invertScale, yr: this.cn.mode };
  }
  Po(t) {
    const i = this.yr();
    let s = null;
    t.Wn !== void 0 && (this.cn.autoScale = t.Wn), t.yr !== void 0 && (this.cn.mode = t.yr, t.yr !== 2 && t.yr !== 3 || (this.cn.autoScale = !0), this.ao.oo = !1), i.yr === 1 && t.yr !== i.yr && (function(h, r) {
      if (h === null) return !1;
      const o = ht(h.Th(), r), l = ht(h.Ph(), r);
      return isFinite(o) && isFinite(l);
    }(this.Ah, this.Mo) ? (s = gt(this.Ah, this.Mo), s !== null && this.Bo(s)) : this.cn.autoScale = !0), t.yr === 1 && t.yr !== i.yr && (s = st(this.Ah, this.Mo), s !== null && this.Bo(s));
    const e = i.yr !== this.cn.mode;
    e && (i.yr === 2 || this.gh()) && this.Pa(), e && (i.yr === 3 || this.Vo()) && this.Pa(), t.Oo !== void 0 && i.Oo !== t.Oo && (this.cn.invertScale = t.Oo, this.Ao()), this.fo.m(i, this.yr());
  }
  Io() {
    return this.fo;
  }
  P() {
    return this.So.fontSize;
  }
  At() {
    return this.ro;
  }
  zo(t) {
    this.ro !== t && (this.ro = t, this.Ro(), this.mo = null);
  }
  Lo() {
    if (this.ho) return this.ho;
    const t = this.At() - this.Eo() - this.No();
    return this.ho = t, t;
  }
  zh() {
    return this.Fo(), this.Ah;
  }
  Bo(t, i) {
    const s = this.Ah;
    (i || s === null && t !== null || s !== null && !s.yh(t)) && (this.mo = null, this.Ah = t);
  }
  Ni() {
    return this.Fo(), this.ro === 0 || !this.Ah || this.Ah.Ni();
  }
  Wo(t) {
    return this.Oo() ? t : this.At() - 1 - t;
  }
  Rt(t, i) {
    return this.gh() ? t = Y(t, i) : this.Vo() && (t = nt(t, i)), this.To(t, i);
  }
  Qs(t, i, s) {
    this.Fo();
    const e = this.No(), h = v(this.zh()), r = h.Th(), o = h.Ph(), l = this.Lo() - 1, a = this.Oo(), c = l / (o - r), u = s === void 0 ? 0 : s.from, d = s === void 0 ? t.length : s.to, f = this.jo();
    for (let m = u; m < d; m++) {
      const p = t[m], b = p._t;
      if (isNaN(b)) continue;
      let g = b;
      f !== null && (g = f(p._t, i));
      const w = e + c * (g - r), M = a ? w : this.ro - 1 - w;
      p.st = M;
    }
  }
  me(t, i, s) {
    this.Fo();
    const e = this.No(), h = v(this.zh()), r = h.Th(), o = h.Ph(), l = this.Lo() - 1, a = this.Oo(), c = l / (o - r), u = s === void 0 ? 0 : s.from, d = s === void 0 ? t.length : s.to, f = this.jo();
    for (let m = u; m < d; m++) {
      const p = t[m];
      let b = p.we, g = p.ge, w = p.Me, M = p.xe;
      f !== null && (b = f(p.we, i), g = f(p.ge, i), w = f(p.Me, i), M = f(p.xe, i));
      let S = e + c * (b - r), x = a ? S : this.ro - 1 - S;
      p.ve = x, S = e + c * (g - r), x = a ? S : this.ro - 1 - S, p.ce = x, S = e + c * (w - r), x = a ? S : this.ro - 1 - S, p.de = x, S = e + c * (M - r), x = a ? S : this.ro - 1 - S, p.pe = x;
    }
  }
  pn(t, i) {
    const s = this.Co(t, i);
    return this.Ho(s, i);
  }
  Ho(t, i) {
    let s = t;
    return this.gh() ? s = function(e, h) {
      return h < 0 && (e = -e), e / 100 * h + h;
    }(s, i) : this.Vo() && (s = function(e, h) {
      return e -= 100, h < 0 && (e = -e), e / 100 * h + h;
    }(s, i)), s;
  }
  Oa() {
    return this.vo;
  }
  $o() {
    if (this.po) return this.po;
    let t = [];
    for (let i = 0; i < this.vo.length; i++) {
      const s = this.vo[i];
      s.Xi() === null && s.Ki(i + 1), t.push(s);
    }
    return t = js(t), this.po = t, this.po;
  }
  Uo(t) {
    this.vo.indexOf(t) === -1 && (this.vo.push(t), this.Pa(), this.qo());
  }
  Yo(t) {
    const i = this.vo.indexOf(t);
    if (i === -1) throw new Error("source is not attached to scale");
    this.vo.splice(i, 1), this.vo.length === 0 && (this.Po({ Wn: !0 }), this.Bo(null)), this.Pa(), this.qo();
  }
  Ct() {
    let t = null;
    for (const i of this.vo) {
      const s = i.Ct();
      s !== null && (t === null || s.ha < t.ha) && (t = s);
    }
    return t === null ? null : t.Vt;
  }
  Oo() {
    return this.cn.invertScale;
  }
  ja() {
    const t = this.Ct() === null;
    if (this.mo !== null && (t || this.mo.Zo === t)) return this.mo.ja;
    this.yo.Qa();
    const i = this.yo.ja();
    return this.mo = { ja: i, Zo: t }, this.do.m(), i;
  }
  Xo() {
    return this.do;
  }
  Ko(t) {
    this.gh() || this.Vo() || this.bo === null && this.lo === null && (this.Ni() || (this.bo = this.ro - t, this.lo = v(this.zh()).Ch()));
  }
  Go(t) {
    if (this.gh() || this.Vo() || this.bo === null) return;
    this.Po({ Wn: !1 }), (t = this.ro - t) < 0 && (t = 0);
    let i = (this.bo + 0.2 * (this.ro - 1)) / (t + 0.2 * (this.ro - 1));
    const s = v(this.lo).Ch();
    i = Math.max(i, 0.1), s.Dh(i), this.Bo(s);
  }
  Jo() {
    this.gh() || this.Vo() || (this.bo = null, this.lo = null);
  }
  Qo(t) {
    this.Do() || this.wo === null && this.lo === null && (this.Ni() || (this.wo = t, this.lo = v(this.zh()).Ch()));
  }
  t_(t) {
    if (this.Do() || this.wo === null) return;
    const i = v(this.zh()).Rh() / (this.Lo() - 1);
    let s = t - this.wo;
    this.Oo() && (s *= -1);
    const e = s * i, h = v(this.lo).Ch();
    h.Vh(e), this.Bo(h, !0), this.mo = null;
  }
  i_() {
    this.Do() || this.wo !== null && (this.wo = null, this.lo = null);
  }
  ma() {
    return this.ba || this.Pa(), this.ba;
  }
  Fi(t, i) {
    switch (this.cn.mode) {
      case 2:
        return this.n_(Y(t, i));
      case 3:
        return this.ma().format(nt(t, i));
      default:
        return this.Fh(t);
    }
  }
  so(t) {
    switch (this.cn.mode) {
      case 2:
        return this.n_(t);
      case 3:
        return this.ma().format(t);
      default:
        return this.Fh(t);
    }
  }
  ql(t) {
    return this.Fh(t, v(this.s_()).ma());
  }
  Yl(t, i) {
    return t = Y(t, i), this.n_(t, Ki);
  }
  e_() {
    return this.vo;
  }
  r_(t) {
    this.ao = { _o: t, oo: !1 };
  }
  Vn() {
    this.vo.forEach((t) => t.Vn());
  }
  Pa() {
    this.mo = null;
    const t = this.s_();
    let i = 100;
    t !== null && (i = Math.round(1 / t.pa())), this.ba = Ui, this.gh() ? (this.ba = Ki, i = 100) : this.Vo() ? (this.ba = new Wt(100, 1), i = 100) : t !== null && (this.ba = t.ma()), this.yo = new Ai(this, i, this.Co.bind(this), this.To.bind(this)), this.yo.Qa();
  }
  qo() {
    this.po = null;
  }
  s_() {
    return this.vo[0] || null;
  }
  Eo() {
    return this.Oo() ? this.cn.scaleMargins.bottom * this.At() + this.co : this.cn.scaleMargins.top * this.At() + this.uo;
  }
  No() {
    return this.Oo() ? this.cn.scaleMargins.top * this.At() + this.uo : this.cn.scaleMargins.bottom * this.At() + this.co;
  }
  Fo() {
    this.ao.oo || (this.ao.oo = !0, this.h_());
  }
  Ro() {
    this.ho = null;
  }
  To(t, i) {
    if (this.Fo(), this.Ni()) return 0;
    t = this.eo() && t ? Lt(t, this.Mo) : t;
    const s = v(this.zh()), e = this.No() + (this.Lo() - 1) * (t - s.Th()) / s.Rh();
    return this.Wo(e);
  }
  Co(t, i) {
    if (this.Fo(), this.Ni()) return 0;
    const s = this.Wo(t), e = v(this.zh()), h = e.Th() + e.Rh() * ((s - this.No()) / (this.Lo() - 1));
    return this.eo() ? ht(h, this.Mo) : h;
  }
  Ao() {
    this.mo = null, this.yo.Qa();
  }
  h_() {
    const t = this.ao._o;
    if (t === null) return;
    let i = null;
    const s = this.e_();
    let e = 0, h = 0;
    for (const l of s) {
      if (!l.yt()) continue;
      const a = l.Ct();
      if (a === null) continue;
      const c = l.Al(t.Vs(), t.ui());
      let u = c && c.zh();
      if (u !== null) {
        switch (this.cn.mode) {
          case 1:
            u = st(u, this.Mo);
            break;
          case 2:
            u = Mn(u, a.Vt);
            break;
          case 3:
            u = _n(u, a.Vt);
        }
        if (i = i === null ? u : i.ts(v(u)), c !== null) {
          const d = c.Lh();
          d !== null && (e = Math.max(e, d.above), h = Math.max(h, d.below));
        }
      }
    }
    if (e === this.uo && h === this.co || (this.uo = e, this.co = h, this.mo = null, this.Ro()), i !== null) {
      if (i.Th() === i.Ph()) {
        const l = this.s_(), a = 5 * (l === null || this.gh() || this.Vo() ? 1 : l.pa());
        this.eo() && (i = gt(i, this.Mo)), i = new E(i.Th() - a, i.Ph() + a), this.eo() && (i = st(i, this.Mo));
      }
      if (this.eo()) {
        const l = gt(i, this.Mo), a = Kt(l);
        if (r = a, o = this.Mo, r.Ha !== o.Ha || r.$a !== o.$a) {
          const c = this.lo !== null ? gt(this.lo, this.Mo) : null;
          this.Mo = a, i = st(l, a), c !== null && (this.lo = st(c, a));
        }
      }
      this.Bo(i);
    } else this.Ah === null && (this.Bo(new E(-0.5, 0.5)), this.Mo = Kt(null));
    var r, o;
    this.ao.oo = !0;
  }
  jo() {
    return this.gh() ? Y : this.Vo() ? nt : this.eo() ? (t) => Lt(t, this.Mo) : null;
  }
  l_(t, i, s) {
    return i === void 0 ? (s === void 0 && (s = this.ma()), s.format(t)) : i(t);
  }
  Fh(t, i) {
    return this.l_(t, this.ko.priceFormatter, i);
  }
  n_(t, i) {
    return this.l_(t, this.ko.percentageFormatter, i);
  }
}
class zn {
  constructor(t, i) {
    this.vo = [], this.a_ = /* @__PURE__ */ new Map(), this.ro = 0, this.o_ = 0, this.__ = 1e3, this.po = null, this.u_ = new _(), this.kl = t, this.$i = i, this.c_ = new yn(this);
    const s = i.W();
    this.d_ = this.f_("left", s.leftPriceScale), this.v_ = this.f_("right", s.rightPriceScale), this.d_.Io().l(this.p_.bind(this, this.d_), this), this.v_.Io().l(this.p_.bind(this, this.v_), this), this.m_(s);
  }
  m_(t) {
    if (t.leftPriceScale && this.d_.Hh(t.leftPriceScale), t.rightPriceScale && this.v_.Hh(t.rightPriceScale), t.localization && (this.d_.Pa(), this.v_.Pa()), t.overlayPriceScales) {
      const i = Array.from(this.a_.values());
      for (const s of i) {
        const e = v(s[0].Dt());
        e.Hh(t.overlayPriceScales), t.localization && e.Pa();
      }
    }
  }
  b_(t) {
    switch (t) {
      case "left":
        return this.d_;
      case "right":
        return this.v_;
    }
    return this.a_.has(t) ? k(this.a_.get(t))[0].Dt() : null;
  }
  S() {
    this.$t().w_().p(this), this.d_.Io().p(this), this.v_.Io().p(this), this.vo.forEach((t) => {
      t.S && t.S();
    }), this.u_.m();
  }
  g_() {
    return this.__;
  }
  M_(t) {
    this.__ = t;
  }
  $t() {
    return this.$i;
  }
  Hi() {
    return this.o_;
  }
  At() {
    return this.ro;
  }
  x_(t) {
    this.o_ = t, this.S_();
  }
  zo(t) {
    this.ro = t, this.d_.zo(t), this.v_.zo(t), this.vo.forEach((i) => {
      if (this.dr(i)) {
        const s = i.Dt();
        s !== null && s.zo(t);
      }
    }), this.S_();
  }
  Oa() {
    return this.vo;
  }
  dr(t) {
    const i = t.Dt();
    return i === null || this.d_ !== i && this.v_ !== i;
  }
  Uo(t, i, s) {
    const e = s !== void 0 ? s : this.y_().k_ + 1;
    this.C_(t, i, e);
  }
  Yo(t) {
    const i = this.vo.indexOf(t);
    I(i !== -1, "removeDataSource: invalid data source"), this.vo.splice(i, 1);
    const s = v(t.Dt()).Ta();
    if (this.a_.has(s)) {
      const h = k(this.a_.get(s)), r = h.indexOf(t);
      r !== -1 && (h.splice(r, 1), h.length === 0 && this.a_.delete(s));
    }
    const e = t.Dt();
    e && e.Oa().indexOf(t) >= 0 && e.Yo(t), e !== null && (e.qo(), this.T_(e)), this.po = null;
  }
  pr(t) {
    return t === this.d_ ? "left" : t === this.v_ ? "right" : "overlay";
  }
  P_() {
    return this.d_;
  }
  R_() {
    return this.v_;
  }
  D_(t, i) {
    t.Ko(i);
  }
  V_(t, i) {
    t.Go(i), this.S_();
  }
  O_(t) {
    t.Jo();
  }
  B_(t, i) {
    t.Qo(i);
  }
  A_(t, i) {
    t.t_(i), this.S_();
  }
  I_(t) {
    t.i_();
  }
  S_() {
    this.vo.forEach((t) => {
      t.Vn();
    });
  }
  vn() {
    let t = null;
    return this.$i.W().rightPriceScale.visible && this.v_.Oa().length !== 0 ? t = this.v_ : this.$i.W().leftPriceScale.visible && this.d_.Oa().length !== 0 ? t = this.d_ : this.vo.length !== 0 && (t = this.vo[0].Dt()), t === null && (t = this.v_), t;
  }
  vr() {
    let t = null;
    return this.$i.W().rightPriceScale.visible ? t = this.v_ : this.$i.W().leftPriceScale.visible && (t = this.d_), t;
  }
  T_(t) {
    t !== null && t.Do() && this.z_(t);
  }
  L_(t) {
    const i = this.kl.Zs();
    t.Po({ Wn: !0 }), i !== null && t.r_(i), this.S_();
  }
  E_() {
    this.z_(this.d_), this.z_(this.v_);
  }
  N_() {
    this.T_(this.d_), this.T_(this.v_), this.vo.forEach((t) => {
      this.dr(t) && this.T_(t.Dt());
    }), this.S_(), this.$i.$h();
  }
  $o() {
    return this.po === null && (this.po = js(this.vo)), this.po;
  }
  F_() {
    return this.u_;
  }
  W_() {
    return this.c_;
  }
  z_(t) {
    const i = t.e_();
    if (i && i.length > 0 && !this.kl.Ni()) {
      const s = this.kl.Zs();
      s !== null && t.r_(s);
    }
    t.Vn();
  }
  y_() {
    const t = this.$o();
    if (t.length === 0) return { j_: 0, k_: 0 };
    let i = 0, s = 0;
    for (let e = 0; e < t.length; e++) {
      const h = t[e].Xi();
      h !== null && (h < i && (i = h), h > s && (s = h));
    }
    return { j_: i, k_: s };
  }
  C_(t, i, s) {
    let e = this.b_(i);
    if (e === null && (e = this.f_(i, this.$i.W().overlayPriceScales)), this.vo.push(t), !Tt(i)) {
      const h = this.a_.get(i) || [];
      h.push(t), this.a_.set(i, h);
    }
    e.Uo(t), t.Gi(e), t.Ki(s), this.T_(e), this.po = null;
  }
  p_(t, i, s) {
    i.yr !== s.yr && this.z_(t);
  }
  f_(t, i) {
    const s = Object.assign({ visible: !0, autoScale: !0 }, D(i)), e = new xn(t, s, this.$i.W().layout, this.$i.W().localization);
    return e.zo(this.At()), e;
  }
}
class Cn {
  constructor(t, i, s = 50) {
    this.Xe = 0, this.Ke = 1, this.Ge = 1, this.Qe = /* @__PURE__ */ new Map(), this.Je = /* @__PURE__ */ new Map(), this.H_ = t, this.U_ = i, this.tr = s;
  }
  q_(t) {
    const i = t.time, s = this.U_.cacheKey(i), e = this.Qe.get(s);
    if (e !== void 0) return e.Y_;
    if (this.Xe === this.tr) {
      const r = this.Je.get(this.Ge);
      this.Je.delete(this.Ge), this.Qe.delete(k(r)), this.Ge++, this.Xe--;
    }
    const h = this.H_(t);
    return this.Qe.set(s, { Y_: h, er: this.Ke }), this.Je.set(this.Ke, s), this.Xe++, this.Ke++, h;
  }
}
class rt {
  constructor(t, i) {
    I(t <= i, "right should be >= left"), this.Z_ = t, this.X_ = i;
  }
  Vs() {
    return this.Z_;
  }
  ui() {
    return this.X_;
  }
  K_() {
    return this.X_ - this.Z_ + 1;
  }
  Xr(t) {
    return this.Z_ <= t && t <= this.X_;
  }
  yh(t) {
    return this.Z_ === t.Vs() && this.X_ === t.ui();
  }
}
function Xi(n, t) {
  return n === null || t === null ? n === t : n.yh(t);
}
class Ln {
  constructor() {
    this.G_ = /* @__PURE__ */ new Map(), this.Qe = null, this.J_ = !1;
  }
  Q_(t) {
    this.J_ = t, this.Qe = null;
  }
  tu(t, i) {
    this.iu(i), this.Qe = null;
    for (let s = i; s < t.length; ++s) {
      const e = t[s];
      let h = this.G_.get(e.timeWeight);
      h === void 0 && (h = [], this.G_.set(e.timeWeight, h)), h.push({ index: s, time: e.time, weight: e.timeWeight, originalTime: e.originalTime });
    }
  }
  nu(t, i) {
    const s = Math.ceil(i / t);
    return this.Qe !== null && this.Qe.su === s || (this.Qe = { ja: this.eu(s), su: s }), this.Qe.ja;
  }
  iu(t) {
    if (t === 0) return void this.G_.clear();
    const i = [];
    this.G_.forEach((s, e) => {
      t <= s[0].index ? i.push(e) : s.splice(ft(s, t, (h) => h.index < t), 1 / 0);
    });
    for (const s of i) this.G_.delete(s);
  }
  eu(t) {
    let i = [];
    for (const s of Array.from(this.G_.keys()).sort((e, h) => h - e)) {
      if (!this.G_.get(s)) continue;
      const e = i;
      i = [];
      const h = e.length;
      let r = 0;
      const o = k(this.G_.get(s)), l = o.length;
      let a = 1 / 0, c = -1 / 0;
      for (let u = 0; u < l; u++) {
        const d = o[u], f = d.index;
        for (; r < h; ) {
          const m = e[r], p = m.index;
          if (!(p < f)) {
            a = p;
            break;
          }
          r++, i.push(m), c = p, a = 1 / 0;
        }
        if (a - f >= t && f - c >= t) i.push(d), c = f;
        else if (this.J_) return e;
      }
      for (; r < h; r++) i.push(e[r]);
    }
    return i;
  }
}
class q {
  constructor(t) {
    this.ru = t;
  }
  hu() {
    return this.ru === null ? null : new rt(Math.floor(this.ru.Vs()), Math.ceil(this.ru.ui()));
  }
  lu() {
    return this.ru;
  }
  static au() {
    return new q(null);
  }
}
function kn(n, t) {
  return n.weight > t.weight ? n : t;
}
class En {
  constructor(t, i, s, e) {
    this.o_ = 0, this.ou = null, this._u = [], this.wo = null, this.bo = null, this.uu = new Ln(), this.cu = /* @__PURE__ */ new Map(), this.du = q.au(), this.fu = !0, this.vu = new _(), this.pu = new _(), this.mu = new _(), this.bu = null, this.wu = null, this.gu = [], this.cn = i, this.ko = s, this.Mu = i.rightOffset, this.xu = i.barSpacing, this.$i = t, this.U_ = e, this.Su(), this.uu.Q_(i.uniformDistribution);
  }
  W() {
    return this.cn;
  }
  ku(t) {
    W(this.ko, t), this.yu(), this.Su();
  }
  Hh(t, i) {
    var s;
    W(this.cn, t), this.cn.fixLeftEdge && this.Cu(), this.cn.fixRightEdge && this.Tu(), t.barSpacing !== void 0 && this.$i.Gn(t.barSpacing), t.rightOffset !== void 0 && this.$i.Jn(t.rightOffset), t.minBarSpacing !== void 0 && this.$i.Gn((s = t.barSpacing) !== null && s !== void 0 ? s : this.xu), this.yu(), this.Su(), this.mu.m();
  }
  mn(t) {
    var i, s;
    return (s = (i = this._u[t]) === null || i === void 0 ? void 0 : i.time) !== null && s !== void 0 ? s : null;
  }
  Ui(t) {
    var i;
    return (i = this._u[t]) !== null && i !== void 0 ? i : null;
  }
  Da(t, i) {
    if (this._u.length < 1) return null;
    if (this.U_.key(t) > this.U_.key(this._u[this._u.length - 1].time)) return i ? this._u.length - 1 : null;
    const s = ft(this._u, this.U_.key(t), (e, h) => this.U_.key(e.time) < h);
    return this.U_.key(t) < this.U_.key(this._u[s].time) ? i ? s : null : s;
  }
  Ni() {
    return this.o_ === 0 || this._u.length === 0 || this.ou === null;
  }
  Ra() {
    return this._u.length > 0;
  }
  Zs() {
    return this.Pu(), this.du.hu();
  }
  Ru() {
    return this.Pu(), this.du.lu();
  }
  Du() {
    const t = this.Zs();
    if (t === null) return null;
    const i = { from: t.Vs(), to: t.ui() };
    return this.Vu(i);
  }
  Vu(t) {
    const i = Math.round(t.from), s = Math.round(t.to), e = v(this.Ou()), h = v(this.Bu());
    return { from: v(this.Ui(Math.max(e, i))), to: v(this.Ui(Math.min(h, s))) };
  }
  Au(t) {
    return { from: v(this.Da(t.from, !0)), to: v(this.Da(t.to, !0)) };
  }
  Hi() {
    return this.o_;
  }
  x_(t) {
    if (!isFinite(t) || t <= 0 || this.o_ === t) return;
    const i = this.Ru(), s = this.o_;
    if (this.o_ = t, this.fu = !0, this.cn.lockVisibleTimeRangeOnResize && s !== 0) {
      const e = this.xu * t / s;
      this.xu = e;
    }
    if (this.cn.fixLeftEdge && i !== null && i.Vs() <= 0) {
      const e = s - t;
      this.Mu -= Math.round(e / this.xu) + 1, this.fu = !0;
    }
    this.Iu(), this.zu();
  }
  It(t) {
    if (this.Ni() || !lt(t)) return 0;
    const i = this.Lu() + this.Mu - t;
    return this.o_ - (i + 0.5) * this.xu - 1;
  }
  Js(t, i) {
    const s = this.Lu(), e = i === void 0 ? 0 : i.from, h = i === void 0 ? t.length : i.to;
    for (let r = e; r < h; r++) {
      const o = t[r].ot, l = s + this.Mu - o, a = this.o_ - (l + 0.5) * this.xu - 1;
      t[r].nt = a;
    }
  }
  Eu(t) {
    return Math.ceil(this.Nu(t));
  }
  Jn(t) {
    this.fu = !0, this.Mu = t, this.zu(), this.$i.Fu(), this.$i.$h();
  }
  he() {
    return this.xu;
  }
  Gn(t) {
    this.Wu(t), this.zu(), this.$i.Fu(), this.$i.$h();
  }
  ju() {
    return this.Mu;
  }
  ja() {
    if (this.Ni()) return null;
    if (this.wu !== null) return this.wu;
    const t = this.xu, i = 5 * (this.$i.W().layout.fontSize + 4) / 8 * (this.cn.tickMarkMaxCharacterLength || 8), s = Math.round(i / t), e = v(this.Zs()), h = Math.max(e.Vs(), e.Vs() - s), r = Math.max(e.ui(), e.ui() - s), o = this.uu.nu(t, i), l = this.Ou() + s, a = this.Bu() - s, c = this.Hu(), u = this.cn.fixLeftEdge || c, d = this.cn.fixRightEdge || c;
    let f = 0;
    for (const m of o) {
      if (!(h <= m.index && m.index <= r)) continue;
      let p;
      f < this.gu.length ? (p = this.gu[f], p.coord = this.It(m.index), p.label = this.$u(m), p.weight = m.weight) : (p = { needAlignCoordinate: !1, coord: this.It(m.index), label: this.$u(m), weight: m.weight }, this.gu.push(p)), this.xu > i / 2 && !c ? p.needAlignCoordinate = !1 : p.needAlignCoordinate = u && m.index <= l || d && m.index >= a, f++;
    }
    return this.gu.length = f, this.wu = this.gu, this.gu;
  }
  Uu() {
    this.fu = !0, this.Gn(this.cn.barSpacing), this.Jn(this.cn.rightOffset);
  }
  qu(t) {
    this.fu = !0, this.ou = t, this.zu(), this.Cu();
  }
  Yu(t, i) {
    const s = this.Nu(t), e = this.he(), h = e + i * (e / 10);
    this.Gn(h), this.cn.rightBarStaysOnScroll || this.Jn(this.ju() + (s - this.Nu(t)));
  }
  Ko(t) {
    this.wo && this.i_(), this.bo === null && this.bu === null && (this.Ni() || (this.bo = t, this.Zu()));
  }
  Go(t) {
    if (this.bu === null) return;
    const i = ei(this.o_ - t, 0, this.o_), s = ei(this.o_ - v(this.bo), 0, this.o_);
    i !== 0 && s !== 0 && this.Gn(this.bu.he * i / s);
  }
  Jo() {
    this.bo !== null && (this.bo = null, this.Xu());
  }
  Qo(t) {
    this.wo === null && this.bu === null && (this.Ni() || (this.wo = t, this.Zu()));
  }
  t_(t) {
    if (this.wo === null) return;
    const i = (this.wo - t) / this.he();
    this.Mu = v(this.bu).ju + i, this.fu = !0, this.zu();
  }
  i_() {
    this.wo !== null && (this.wo = null, this.Xu());
  }
  Ku() {
    this.Gu(this.cn.rightOffset);
  }
  Gu(t, i = 400) {
    if (!isFinite(t)) throw new RangeError("offset is required and must be finite number");
    if (!isFinite(i) || i <= 0) throw new RangeError("animationDuration (optional) must be finite positive number");
    const s = this.Mu, e = performance.now();
    this.$i.Zn({ Ju: (h) => (h - e) / i >= 1, Qu: (h) => {
      const r = (h - e) / i;
      return r >= 1 ? t : s + (t - s) * r;
    } });
  }
  bt(t, i) {
    this.fu = !0, this._u = t, this.uu.tu(t, i), this.zu();
  }
  tc() {
    return this.vu;
  }
  nc() {
    return this.pu;
  }
  sc() {
    return this.mu;
  }
  Lu() {
    return this.ou || 0;
  }
  ec(t) {
    const i = t.K_();
    this.Wu(this.o_ / i), this.Mu = t.ui() - this.Lu(), this.zu(), this.fu = !0, this.$i.Fu(), this.$i.$h();
  }
  rc() {
    const t = this.Ou(), i = this.Bu();
    t !== null && i !== null && this.ec(new rt(t, i + this.cn.rightOffset));
  }
  hc(t) {
    const i = new rt(t.from, t.to);
    this.ec(i);
  }
  qi(t) {
    return this.ko.timeFormatter !== void 0 ? this.ko.timeFormatter(t.originalTime) : this.U_.formatHorzItem(t.time);
  }
  Hu() {
    const { handleScroll: t, handleScale: i } = this.$i.W();
    return !(t.horzTouchDrag || t.mouseWheel || t.pressedMouseMove || t.vertTouchDrag || i.axisDoubleClickReset.time || i.axisPressedMouseMove.time || i.mouseWheel || i.pinch);
  }
  Ou() {
    return this._u.length === 0 ? null : 0;
  }
  Bu() {
    return this._u.length === 0 ? null : this._u.length - 1;
  }
  lc(t) {
    return (this.o_ - 1 - t) / this.xu;
  }
  Nu(t) {
    const i = this.lc(t), s = this.Lu() + this.Mu - i;
    return Math.round(1e6 * s) / 1e6;
  }
  Wu(t) {
    const i = this.xu;
    this.xu = t, this.Iu(), i !== this.xu && (this.fu = !0, this.ac());
  }
  Pu() {
    if (!this.fu) return;
    if (this.fu = !1, this.Ni()) return void this.oc(q.au());
    const t = this.Lu(), i = this.o_ / this.xu, s = this.Mu + t, e = new rt(s - i + 1, s);
    this.oc(new q(e));
  }
  Iu() {
    const t = this._c();
    if (this.xu < t && (this.xu = t, this.fu = !0), this.o_ !== 0) {
      const i = 0.5 * this.o_;
      this.xu > i && (this.xu = i, this.fu = !0);
    }
  }
  _c() {
    return this.cn.fixLeftEdge && this.cn.fixRightEdge && this._u.length !== 0 ? this.o_ / this._u.length : this.cn.minBarSpacing;
  }
  zu() {
    const t = this.uc();
    this.Mu > t && (this.Mu = t, this.fu = !0);
    const i = this.cc();
    i !== null && this.Mu < i && (this.Mu = i, this.fu = !0);
  }
  cc() {
    const t = this.Ou(), i = this.ou;
    return t === null || i === null ? null : t - i - 1 + (this.cn.fixLeftEdge ? this.o_ / this.xu : Math.min(2, this._u.length));
  }
  uc() {
    return this.cn.fixRightEdge ? 0 : this.o_ / this.xu - Math.min(2, this._u.length);
  }
  Zu() {
    this.bu = { he: this.he(), ju: this.ju() };
  }
  Xu() {
    this.bu = null;
  }
  $u(t) {
    let i = this.cu.get(t.weight);
    return i === void 0 && (i = new Cn((s) => this.dc(s), this.U_), this.cu.set(t.weight, i)), i.q_(t);
  }
  dc(t) {
    return this.U_.formatTickmark(t, this.ko);
  }
  oc(t) {
    const i = this.du;
    this.du = t, Xi(i.hu(), this.du.hu()) || this.vu.m(), Xi(i.lu(), this.du.lu()) || this.pu.m(), this.ac();
  }
  ac() {
    this.wu = null;
  }
  yu() {
    this.ac(), this.cu.clear();
  }
  Su() {
    this.U_.updateFormatter(this.ko);
  }
  Cu() {
    if (!this.cn.fixLeftEdge) return;
    const t = this.Ou();
    if (t === null) return;
    const i = this.Zs();
    if (i === null) return;
    const s = i.Vs() - t;
    if (s < 0) {
      const e = this.Mu - s - 1;
      this.Jn(e);
    }
    this.Iu();
  }
  Tu() {
    this.zu(), this.Iu();
  }
}
class Vn {
  X(t, i, s) {
    t.useMediaCoordinateSpace((e) => this.K(e, i, s));
  }
  wl(t, i, s) {
    t.useMediaCoordinateSpace((e) => this.fc(e, i, s));
  }
  fc(t, i, s) {
  }
}
class Tn extends Vn {
  constructor(t) {
    super(), this.vc = /* @__PURE__ */ new Map(), this.zt = t;
  }
  K(t) {
  }
  fc(t) {
    if (!this.zt.yt) return;
    const { context: i, mediaSize: s } = t;
    let e = 0;
    for (const r of this.zt.mc) {
      if (r.Kt.length === 0) continue;
      i.font = r.R;
      const o = this.bc(i, r.Kt);
      o > s.width ? r.Yu = s.width / o : r.Yu = 1, e += r.wc * r.Yu;
    }
    let h = 0;
    switch (this.zt.gc) {
      case "top":
        h = 0;
        break;
      case "center":
        h = Math.max((s.height - e) / 2, 0);
        break;
      case "bottom":
        h = Math.max(s.height - e, 0);
    }
    i.fillStyle = this.zt.V;
    for (const r of this.zt.mc) {
      i.save();
      let o = 0;
      switch (this.zt.Mc) {
        case "left":
          i.textAlign = "left", o = r.wc / 2;
          break;
        case "center":
          i.textAlign = "center", o = s.width / 2;
          break;
        case "right":
          i.textAlign = "right", o = s.width - 1 - r.wc / 2;
      }
      i.translate(o, h), i.textBaseline = "top", i.font = r.R, i.scale(r.Yu, r.Yu), i.fillText(r.Kt, 0, r.xc), i.restore(), h += r.wc * r.Yu;
    }
  }
  bc(t, i) {
    const s = this.Sc(t.font);
    let e = s.get(i);
    return e === void 0 && (e = t.measureText(i).width, s.set(i, e)), e;
  }
  Sc(t) {
    let i = this.vc.get(t);
    return i === void 0 && (i = /* @__PURE__ */ new Map(), this.vc.set(t, i)), i;
  }
}
class Wn {
  constructor(t) {
    this.ft = !0, this.Ft = { yt: !1, V: "", mc: [], gc: "center", Mc: "center" }, this.Wt = new Tn(this.Ft), this.jt = t;
  }
  bt() {
    this.ft = !0;
  }
  gt() {
    return this.ft && (this.Mt(), this.ft = !1), this.Wt;
  }
  Mt() {
    const t = this.jt.W(), i = this.Ft;
    i.yt = t.visible, i.yt && (i.V = t.color, i.Mc = t.horzAlign, i.gc = t.vertAlign, i.mc = [{ Kt: t.text, R: Q(t.fontSize, t.fontFamily, t.fontStyle), wc: 1.2 * t.fontSize, xc: 0, Yu: 0 }]);
  }
}
class Pn extends ui {
  constructor(t, i) {
    super(), this.cn = i, this.wn = new Wn(this);
  }
  Rn() {
    return [];
  }
  Pn() {
    return [this.wn];
  }
  W() {
    return this.cn;
  }
  Vn() {
    this.wn.bt();
  }
}
var Ji, Hi, Zi, Yi, Gi;
(function(n) {
  n[n.OnTouchEnd = 0] = "OnTouchEnd", n[n.OnNextTap = 1] = "OnNextTap";
})(Ji || (Ji = {}));
class Rn {
  constructor(t, i, s) {
    this.kc = [], this.yc = [], this.o_ = 0, this.Cc = null, this.Tc = new _(), this.Pc = new _(), this.Rc = null, this.Dc = t, this.cn = i, this.U_ = s, this.Vc = new ue(this), this.kl = new En(this, i.timeScale, this.cn.localization, s), this.vt = new Me(this, i.crosshair), this.Oc = new gn(i.crosshair), this.Bc = new Pn(this, i.watermark), this.Ac(), this.kc[0].M_(2e3), this.Ic = this.zc(0), this.Lc = this.zc(1);
  }
  Xl() {
    this.Ec(z.es());
  }
  $h() {
    this.Ec(z.ss());
  }
  aa() {
    this.Ec(new z(1));
  }
  Kl(t) {
    const i = this.Nc(t);
    this.Ec(i);
  }
  Fc() {
    return this.Cc;
  }
  Wc(t) {
    const i = this.Cc;
    this.Cc = t, i !== null && this.Kl(i.jc), t !== null && this.Kl(t.jc);
  }
  W() {
    return this.cn;
  }
  Hh(t) {
    W(this.cn, t), this.kc.forEach((i) => i.m_(t)), t.timeScale !== void 0 && this.kl.Hh(t.timeScale), t.localization !== void 0 && this.kl.ku(t.localization), (t.leftPriceScale || t.rightPriceScale) && this.Tc.m(), this.Ic = this.zc(0), this.Lc = this.zc(1), this.Xl();
  }
  Hc(t, i) {
    if (t === "left") return void this.Hh({ leftPriceScale: i });
    if (t === "right") return void this.Hh({ rightPriceScale: i });
    const s = this.$c(t);
    s !== null && (s.Dt.Hh(i), this.Tc.m());
  }
  $c(t) {
    for (const i of this.kc) {
      const s = i.b_(t);
      if (s !== null) return { Ht: i, Dt: s };
    }
    return null;
  }
  St() {
    return this.kl;
  }
  Uc() {
    return this.kc;
  }
  qc() {
    return this.Bc;
  }
  Yc() {
    return this.vt;
  }
  Zc() {
    return this.Pc;
  }
  Xc(t, i) {
    t.zo(i), this.Fu();
  }
  x_(t) {
    this.o_ = t, this.kl.x_(this.o_), this.kc.forEach((i) => i.x_(t)), this.Fu();
  }
  Ac(t) {
    const i = new zn(this.kl, this);
    t !== void 0 ? this.kc.splice(t, 0, i) : this.kc.push(i);
    const s = t === void 0 ? this.kc.length - 1 : t, e = z.es();
    return e.Nn(s, { Fn: 0, Wn: !0 }), this.Ec(e), i;
  }
  D_(t, i, s) {
    t.D_(i, s);
  }
  V_(t, i, s) {
    t.V_(i, s), this.Gl(), this.Ec(this.Kc(t, 2));
  }
  O_(t, i) {
    t.O_(i), this.Ec(this.Kc(t, 2));
  }
  B_(t, i, s) {
    i.Do() || t.B_(i, s);
  }
  A_(t, i, s) {
    i.Do() || (t.A_(i, s), this.Gl(), this.Ec(this.Kc(t, 2)));
  }
  I_(t, i) {
    i.Do() || (t.I_(i), this.Ec(this.Kc(t, 2)));
  }
  L_(t, i) {
    t.L_(i), this.Ec(this.Kc(t, 2));
  }
  Gc(t) {
    this.kl.Ko(t);
  }
  Jc(t, i) {
    const s = this.St();
    if (s.Ni() || i === 0) return;
    const e = s.Hi();
    t = Math.max(1, Math.min(t, e)), s.Yu(t, i), this.Fu();
  }
  Qc(t) {
    this.td(0), this.nd(t), this.sd();
  }
  ed(t) {
    this.kl.Go(t), this.Fu();
  }
  rd() {
    this.kl.Jo(), this.$h();
  }
  td(t) {
    this.kl.Qo(t);
  }
  nd(t) {
    this.kl.t_(t), this.Fu();
  }
  sd() {
    this.kl.i_(), this.$h();
  }
  wt() {
    return this.yc;
  }
  hd(t, i, s, e, h) {
    this.vt.gn(t, i);
    let r = NaN, o = this.kl.Eu(t);
    const l = this.kl.Zs();
    l !== null && (o = Math.min(Math.max(l.Vs(), o), l.ui()));
    const a = e.vn(), c = a.Ct();
    c !== null && (r = a.pn(i, c)), r = this.Oc.Va(r, o, e), this.vt.kn(o, r, e), this.aa(), h || this.Pc.m(this.vt.xt(), { x: t, y: i }, s);
  }
  ld(t, i, s) {
    const e = s.vn(), h = e.Ct(), r = e.Rt(t, v(h)), o = this.kl.Da(i, !0), l = this.kl.It(v(o));
    this.hd(l, r, null, s, !0);
  }
  ad(t) {
    this.Yc().Cn(), this.aa(), t || this.Pc.m(null, null, null);
  }
  Gl() {
    const t = this.vt.Ht();
    if (t !== null) {
      const i = this.vt.xn(), s = this.vt.Sn();
      this.hd(i, s, null, t);
    }
    this.vt.Vn();
  }
  od(t, i, s) {
    const e = this.kl.mn(0);
    i !== void 0 && s !== void 0 && this.kl.bt(i, s);
    const h = this.kl.mn(0), r = this.kl.Lu(), o = this.kl.Zs();
    if (o !== null && e !== null && h !== null) {
      const l = o.Xr(r), a = this.U_.key(e) > this.U_.key(h), c = t !== null && t > r && !a, u = this.kl.W().allowShiftVisibleRangeOnWhitespaceReplacement, d = l && (s !== void 0 || u) && this.kl.W().shiftVisibleRangeOnNewBar;
      if (c && !d) {
        const f = t - r;
        this.kl.Jn(this.kl.ju() - f);
      }
    }
    this.kl.qu(t);
  }
  ta(t) {
    t !== null && t.N_();
  }
  cr(t) {
    const i = this.kc.find((s) => s.$o().includes(t));
    return i === void 0 ? null : i;
  }
  Fu() {
    this.Bc.Vn(), this.kc.forEach((t) => t.N_()), this.Gl();
  }
  S() {
    this.kc.forEach((t) => t.S()), this.kc.length = 0, this.cn.localization.priceFormatter = void 0, this.cn.localization.percentageFormatter = void 0, this.cn.localization.timeFormatter = void 0;
  }
  _d() {
    return this.Vc;
  }
  mr() {
    return this.Vc.W();
  }
  w_() {
    return this.Tc;
  }
  ud(t, i, s) {
    const e = this.kc[0], h = this.dd(i, t, e, s);
    return this.yc.push(h), this.yc.length === 1 ? this.Xl() : this.$h(), h;
  }
  fd(t) {
    const i = this.cr(t), s = this.yc.indexOf(t);
    I(s !== -1, "Series not found"), this.yc.splice(s, 1), v(i).Yo(t), t.S && t.S();
  }
  Zl(t, i) {
    const s = v(this.cr(t));
    s.Yo(t);
    const e = this.$c(i);
    if (e === null) {
      const h = t.Xi();
      s.Uo(t, i, h);
    } else {
      const h = e.Ht === s ? t.Xi() : void 0;
      e.Ht.Uo(t, i, h);
    }
  }
  rc() {
    const t = z.ss();
    t.$n(), this.Ec(t);
  }
  vd(t) {
    const i = z.ss();
    i.Yn(t), this.Ec(i);
  }
  Kn() {
    const t = z.ss();
    t.Kn(), this.Ec(t);
  }
  Gn(t) {
    const i = z.ss();
    i.Gn(t), this.Ec(i);
  }
  Jn(t) {
    const i = z.ss();
    i.Jn(t), this.Ec(i);
  }
  Zn(t) {
    const i = z.ss();
    i.Zn(t), this.Ec(i);
  }
  Un() {
    const t = z.ss();
    t.Un(), this.Ec(t);
  }
  pd() {
    return this.cn.rightPriceScale.visible ? "right" : "left";
  }
  md() {
    return this.Lc;
  }
  q() {
    return this.Ic;
  }
  Bt(t) {
    const i = this.Lc, s = this.Ic;
    if (i === s) return i;
    if (t = Math.max(0, Math.min(100, Math.round(100 * t))), this.Rc === null || this.Rc.Ts !== s || this.Rc.Ps !== i) this.Rc = { Ts: s, Ps: i, bd: /* @__PURE__ */ new Map() };
    else {
      const h = this.Rc.bd.get(t);
      if (h !== void 0) return h;
    }
    const e = function(h, r, o) {
      const [l, a, c, u] = ot(h), [d, f, m, p] = ot(r), b = [T(l + o * (d - l)), T(a + o * (f - a)), T(c + o * (m - c)), _s(u + o * (p - u))];
      return `rgba(${b[0]}, ${b[1]}, ${b[2]}, ${b[3]})`;
    }(s, i, t / 100);
    return this.Rc.bd.set(t, e), e;
  }
  Kc(t, i) {
    const s = new z(i);
    if (t !== null) {
      const e = this.kc.indexOf(t);
      s.Nn(e, { Fn: i });
    }
    return s;
  }
  Nc(t, i) {
    return i === void 0 && (i = 2), this.Kc(this.cr(t), i);
  }
  Ec(t) {
    this.Dc && this.Dc(t), this.kc.forEach((i) => i.W_().Uh().bt());
  }
  dd(t, i, s, e) {
    const h = new pi(this, t, i, s, e), r = t.priceScaleId !== void 0 ? t.priceScaleId : this.pd();
    return s.Uo(h, r), Tt(r) || h.Hh(t), h;
  }
  zc(t) {
    const i = this.cn.layout;
    return i.background.type === "gradient" ? t === 0 ? i.background.topColor : i.background.bottomColor : i.background.color;
  }
}
function ni(n) {
  return !$(n) && !dt(n);
}
function Fs(n) {
  return $(n);
}
(function(n) {
  n[n.Disabled = 0] = "Disabled", n[n.Continuous = 1] = "Continuous", n[n.OnDataUpdate = 2] = "OnDataUpdate";
})(Hi || (Hi = {})), function(n) {
  n[n.LastBar = 0] = "LastBar", n[n.LastVisible = 1] = "LastVisible";
}(Zi || (Zi = {})), function(n) {
  n.Solid = "solid", n.VerticalGradient = "gradient";
}(Yi || (Yi = {})), function(n) {
  n[n.Year = 0] = "Year", n[n.Month = 1] = "Month", n[n.DayOfMonth = 2] = "DayOfMonth", n[n.Time = 3] = "Time", n[n.TimeWithSeconds = 4] = "TimeWithSeconds";
}(Gi || (Gi = {}));
const qi = (n) => n.getUTCFullYear();
function $n(n, t, i) {
  return t.replace(/yyyy/g, ((s) => N(qi(s), 4))(n)).replace(/yy/g, ((s) => N(qi(s) % 100, 2))(n)).replace(/MMMM/g, ((s, e) => new Date(s.getUTCFullYear(), s.getUTCMonth(), 1).toLocaleString(e, { month: "long" }))(n, i)).replace(/MMM/g, ((s, e) => new Date(s.getUTCFullYear(), s.getUTCMonth(), 1).toLocaleString(e, { month: "short" }))(n, i)).replace(/MM/g, ((s) => N(((e) => e.getUTCMonth() + 1)(s), 2))(n)).replace(/dd/g, ((s) => N(((e) => e.getUTCDate())(s), 2))(n));
}
class As {
  constructor(t = "yyyy-MM-dd", i = "default") {
    this.wd = t, this.gd = i;
  }
  q_(t) {
    return $n(t, this.wd, this.gd);
  }
}
class Dn {
  constructor(t) {
    this.Md = t || "%h:%m:%s";
  }
  q_(t) {
    return this.Md.replace("%h", N(t.getUTCHours(), 2)).replace("%m", N(t.getUTCMinutes(), 2)).replace("%s", N(t.getUTCSeconds(), 2));
  }
}
const Nn = { xd: "yyyy-MM-dd", Sd: "%h:%m:%s", kd: " ", yd: "default" };
class On {
  constructor(t = {}) {
    const i = Object.assign(Object.assign({}, Nn), t);
    this.Cd = new As(i.xd, i.yd), this.Td = new Dn(i.Sd), this.Pd = i.kd;
  }
  q_(t) {
    return `${this.Cd.q_(t)}${this.Pd}${this.Td.q_(t)}`;
  }
}
function wt(n) {
  return 60 * n * 60 * 1e3;
}
function Xt(n) {
  return 60 * n * 1e3;
}
const St = [{ Rd: (Qi = 1, 1e3 * Qi), Dd: 10 }, { Rd: Xt(1), Dd: 20 }, { Rd: Xt(5), Dd: 21 }, { Rd: Xt(30), Dd: 22 }, { Rd: wt(1), Dd: 30 }, { Rd: wt(3), Dd: 31 }, { Rd: wt(6), Dd: 32 }, { Rd: wt(12), Dd: 33 }];
var Qi;
function ts(n, t) {
  if (n.getUTCFullYear() !== t.getUTCFullYear()) return 70;
  if (n.getUTCMonth() !== t.getUTCMonth()) return 60;
  if (n.getUTCDate() !== t.getUTCDate()) return 50;
  for (let i = St.length - 1; i >= 0; --i) if (Math.floor(t.getTime() / St[i].Rd) !== Math.floor(n.getTime() / St[i].Rd)) return St[i].Dd;
  return 0;
}
function Jt(n) {
  let t = n;
  if (dt(n) && (t = vi(n)), !ni(t)) throw new Error("time must be of type BusinessDay");
  const i = new Date(Date.UTC(t.year, t.month - 1, t.day, 0, 0, 0, 0));
  return { Vd: Math.round(i.getTime() / 1e3), Od: t };
}
function is(n) {
  if (!Fs(n)) throw new Error("time must be of type isUTCTimestamp");
  return { Vd: n };
}
function vi(n) {
  const t = new Date(n);
  if (isNaN(t.getTime())) throw new Error(`Invalid date string=${n}, expected format=yyyy-mm-dd`);
  return { day: t.getUTCDate(), month: t.getUTCMonth() + 1, year: t.getUTCFullYear() };
}
function ss(n) {
  dt(n.time) && (n.time = vi(n.time));
}
class es {
  options() {
    return this.cn;
  }
  setOptions(t) {
    this.cn = t, this.updateFormatter(t.localization);
  }
  preprocessData(t) {
    Array.isArray(t) ? function(i) {
      i.forEach(ss);
    }(t) : ss(t);
  }
  createConverterToInternalObj(t) {
    return v(function(i) {
      return i.length === 0 ? null : ni(i[0].time) || dt(i[0].time) ? Jt : is;
    }(t));
  }
  key(t) {
    return typeof t == "object" && "Vd" in t ? t.Vd : this.key(this.convertHorzItemToInternal(t));
  }
  cacheKey(t) {
    const i = t;
    return i.Od === void 0 ? new Date(1e3 * i.Vd).getTime() : new Date(Date.UTC(i.Od.year, i.Od.month - 1, i.Od.day)).getTime();
  }
  convertHorzItemToInternal(t) {
    return Fs(i = t) ? is(i) : ni(i) ? Jt(i) : Jt(vi(i));
    var i;
  }
  updateFormatter(t) {
    if (!this.cn) return;
    const i = t.dateFormat;
    this.cn.timeScale.timeVisible ? this.Bd = new On({ xd: i, Sd: this.cn.timeScale.secondsVisible ? "%h:%m:%s" : "%h:%m", kd: "   ", yd: t.locale }) : this.Bd = new As(i, t.locale);
  }
  formatHorzItem(t) {
    const i = t;
    return this.Bd.q_(new Date(1e3 * i.Vd));
  }
  formatTickmark(t, i) {
    const s = function(h, r, o) {
      switch (h) {
        case 0:
        case 10:
          return r ? o ? 4 : 3 : 2;
        case 20:
        case 21:
        case 22:
        case 30:
        case 31:
        case 32:
        case 33:
          return r ? 3 : 2;
        case 50:
          return 2;
        case 60:
          return 1;
        case 70:
          return 0;
      }
    }(t.weight, this.cn.timeScale.timeVisible, this.cn.timeScale.secondsVisible), e = this.cn.timeScale;
    if (e.tickMarkFormatter !== void 0) {
      const h = e.tickMarkFormatter(t.originalTime, s, i.locale);
      if (h !== null) return h;
    }
    return function(h, r, o) {
      const l = {};
      switch (r) {
        case 0:
          l.year = "numeric";
          break;
        case 1:
          l.month = "short";
          break;
        case 2:
          l.day = "numeric";
          break;
        case 3:
          l.hour12 = !1, l.hour = "2-digit", l.minute = "2-digit";
          break;
        case 4:
          l.hour12 = !1, l.hour = "2-digit", l.minute = "2-digit", l.second = "2-digit";
      }
      const a = h.Od === void 0 ? new Date(1e3 * h.Vd) : new Date(Date.UTC(h.Od.year, h.Od.month - 1, h.Od.day));
      return new Date(a.getUTCFullYear(), a.getUTCMonth(), a.getUTCDate(), a.getUTCHours(), a.getUTCMinutes(), a.getUTCSeconds(), a.getUTCMilliseconds()).toLocaleString(o, l);
    }(t.time, s, i.locale);
  }
  maxTickMarkWeight(t) {
    let i = t.reduce(kn, t[0]).weight;
    return i > 30 && i < 50 && (i = 30), i;
  }
  fillWeightsForPoints(t, i) {
    (function(s, e = 0) {
      if (s.length === 0) return;
      let h = e === 0 ? null : s[e - 1].time.Vd, r = h !== null ? new Date(1e3 * h) : null, o = 0;
      for (let l = e; l < s.length; ++l) {
        const a = s[l], c = new Date(1e3 * a.time.Vd);
        r !== null && (a.timeWeight = ts(c, r)), o += a.time.Vd - (h || a.time.Vd), h = a.time.Vd, r = c;
      }
      if (e === 0 && s.length > 1) {
        const l = Math.ceil(o / (s.length - 1)), a = new Date(1e3 * (s[0].time.Vd - l));
        s[0].timeWeight = ts(new Date(1e3 * s[0].time.Vd), a);
      }
    })(t, i);
  }
  static Ad(t) {
    return W({ localization: { dateFormat: "dd MMM 'yy" } }, t ?? {});
  }
}
const tt = typeof window < "u";
function ns() {
  return !!tt && window.navigator.userAgent.toLowerCase().indexOf("firefox") > -1;
}
function Ht() {
  return !!tt && /iPhone|iPad|iPod/.test(window.navigator.platform);
}
function hi(n) {
  return n + n % 2;
}
function Zt(n, t) {
  return n.Id - t.Id;
}
function Yt(n, t, i) {
  const s = (n.Id - t.Id) / (n.ot - t.ot);
  return Math.sign(s) * Math.min(Math.abs(s), i);
}
class Bn {
  constructor(t, i, s, e) {
    this.zd = null, this.Ld = null, this.Ed = null, this.Nd = null, this.Fd = null, this.Wd = 0, this.jd = 0, this.Hd = t, this.$d = i, this.Ud = s, this.rs = e;
  }
  qd(t, i) {
    if (this.zd !== null) {
      if (this.zd.ot === i) return void (this.zd.Id = t);
      if (Math.abs(this.zd.Id - t) < this.rs) return;
    }
    this.Nd = this.Ed, this.Ed = this.Ld, this.Ld = this.zd, this.zd = { ot: i, Id: t };
  }
  Dr(t, i) {
    if (this.zd === null || this.Ld === null || i - this.zd.ot > 50) return;
    let s = 0;
    const e = Yt(this.zd, this.Ld, this.$d), h = Zt(this.zd, this.Ld), r = [e], o = [h];
    if (s += h, this.Ed !== null) {
      const a = Yt(this.Ld, this.Ed, this.$d);
      if (Math.sign(a) === Math.sign(e)) {
        const c = Zt(this.Ld, this.Ed);
        if (r.push(a), o.push(c), s += c, this.Nd !== null) {
          const u = Yt(this.Ed, this.Nd, this.$d);
          if (Math.sign(u) === Math.sign(e)) {
            const d = Zt(this.Ed, this.Nd);
            r.push(u), o.push(d), s += d;
          }
        }
      }
    }
    let l = 0;
    for (let a = 0; a < r.length; ++a) l += o[a] / s * r[a];
    Math.abs(l) < this.Hd || (this.Fd = { Id: t, ot: i }, this.jd = l, this.Wd = function(a, c) {
      const u = Math.log(c);
      return Math.log(1 * u / -a) / u;
    }(Math.abs(l), this.Ud));
  }
  Qu(t) {
    const i = v(this.Fd), s = t - i.ot;
    return i.Id + this.jd * (Math.pow(this.Ud, s) - 1) / Math.log(this.Ud);
  }
  Ju(t) {
    return this.Fd === null || this.Yd(t) === this.Wd;
  }
  Yd(t) {
    const i = t - v(this.Fd).ot;
    return Math.min(i, this.Wd);
  }
}
class In {
  constructor(t, i) {
    this.Zd = void 0, this.Xd = void 0, this.Kd = void 0, this.en = !1, this.Gd = t, this.Jd = i, this.Qd();
  }
  bt() {
    this.Qd();
  }
  tf() {
    this.Zd && this.Gd.removeChild(this.Zd), this.Xd && this.Gd.removeChild(this.Xd), this.Zd = void 0, this.Xd = void 0;
  }
  if() {
    return this.en !== this.nf() || this.Kd !== this.sf();
  }
  sf() {
    return xs(ot(this.Jd.W().layout.textColor)) > 160 ? "dark" : "light";
  }
  nf() {
    return this.Jd.W().layout.attributionLogo;
  }
  ef() {
    const t = new URL(location.href);
    return t.hostname ? "&utm_source=" + t.hostname + t.pathname : "";
  }
  Qd() {
    this.if() && (this.tf(), this.en = this.nf(), this.en && (this.Kd = this.sf(), this.Xd = document.createElement("style"), this.Xd.innerText = "a#tv-attr-logo{--fill:#131722;--stroke:#fff;position:absolute;left:10px;bottom:10px;height:19px;width:35px;margin:0;padding:0;border:0;z-index:3;}a#tv-attr-logo[data-dark]{--fill:#D1D4DC;--stroke:#131722;}", this.Zd = document.createElement("a"), this.Zd.href = `https://www.tradingview.com/?utm_medium=lwc-link&utm_campaign=lwc-chart${this.ef()}`, this.Zd.title = "Charting by TradingView", this.Zd.id = "tv-attr-logo", this.Zd.target = "_blank", this.Zd.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 35 19" width="35" height="19" fill="none"><g fill-rule="evenodd" clip-path="url(#a)" clip-rule="evenodd"><path fill="var(--stroke)" d="M2 0H0v10h6v9h21.4l.5-1.3 6-15 1-2.7H23.7l-.5 1.3-.2.6a5 5 0 0 0-7-.9V0H2Zm20 17h4l5.2-13 .8-2h-7l-1 2.5-.2.5-1.5 3.8-.3.7V17Zm-.8-10a3 3 0 0 0 .7-2.7A3 3 0 1 0 16.8 7h4.4ZM14 7V2H2v6h6v9h4V7h2Z"/><path fill="var(--fill)" d="M14 2H2v6h6v9h6V2Zm12 15h-7l6-15h7l-6 15Zm-7-9a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"/></g><defs><clipPath id="a"><path fill="var(--stroke)" d="M0 0h35v19H0z"/></clipPath></defs></svg>', this.Zd.toggleAttribute("data-dark", this.Kd === "dark"), this.Gd.appendChild(this.Xd), this.Gd.appendChild(this.Zd)));
  }
}
function U(n, t) {
  const i = v(n.ownerDocument).createElement("canvas");
  n.appendChild(i);
  const s = Ys(i, { type: "device-pixel-content-box", options: { allowResizeObserver: !1 }, transform: (e, h) => ({ width: Math.max(e.width, h.width), height: Math.max(e.height, h.height) }) });
  return s.resizeCanvasElement(t), s;
}
function X(n) {
  var t;
  n.width = 1, n.height = 1, (t = n.getContext("2d")) === null || t === void 0 || t.clearRect(0, 0, 1, 1);
}
function ri(n, t, i, s) {
  n.wl && n.wl(t, i, s);
}
function zt(n, t, i, s) {
  n.X(t, i, s);
}
function oi(n, t, i, s) {
  const e = n(i, s);
  for (const h of e) {
    const r = h.gt();
    r !== null && t(r);
  }
}
function jn(n) {
  tt && window.chrome !== void 0 && n.addEventListener("mousedown", (t) => {
    if (t.button === 1) return t.preventDefault(), !1;
  });
}
class bi {
  constructor(t, i, s) {
    this.rf = 0, this.hf = null, this.lf = { nt: Number.NEGATIVE_INFINITY, st: Number.POSITIVE_INFINITY }, this.af = 0, this._f = null, this.uf = { nt: Number.NEGATIVE_INFINITY, st: Number.POSITIVE_INFINITY }, this.cf = null, this.df = !1, this.ff = null, this.vf = null, this.pf = !1, this.mf = !1, this.bf = !1, this.wf = null, this.gf = null, this.Mf = null, this.xf = null, this.Sf = null, this.kf = null, this.yf = null, this.Cf = 0, this.Tf = !1, this.Pf = !1, this.Rf = !1, this.Df = 0, this.Vf = null, this.Of = !Ht(), this.Bf = (e) => {
      this.Af(e);
    }, this.If = (e) => {
      if (this.zf(e)) {
        const h = this.Lf(e);
        if (++this.af, this._f && this.af > 1) {
          const { Ef: r } = this.Nf(R(e), this.uf);
          r < 30 && !this.bf && this.Ff(h, this.jf.Wf), this.Hf();
        }
      } else {
        const h = this.Lf(e);
        if (++this.rf, this.hf && this.rf > 1) {
          const { Ef: r } = this.Nf(R(e), this.lf);
          r < 5 && !this.mf && this.$f(h, this.jf.Uf), this.qf();
        }
      }
    }, this.Yf = t, this.jf = i, this.cn = s, this.Zf();
  }
  S() {
    this.wf !== null && (this.wf(), this.wf = null), this.gf !== null && (this.gf(), this.gf = null), this.xf !== null && (this.xf(), this.xf = null), this.Sf !== null && (this.Sf(), this.Sf = null), this.kf !== null && (this.kf(), this.kf = null), this.Mf !== null && (this.Mf(), this.Mf = null), this.Xf(), this.qf();
  }
  Kf(t) {
    this.xf && this.xf();
    const i = this.Gf.bind(this);
    if (this.xf = () => {
      this.Yf.removeEventListener("mousemove", i);
    }, this.Yf.addEventListener("mousemove", i), this.zf(t)) return;
    const s = this.Lf(t);
    this.$f(s, this.jf.Jf), this.Of = !0;
  }
  qf() {
    this.hf !== null && clearTimeout(this.hf), this.rf = 0, this.hf = null, this.lf = { nt: Number.NEGATIVE_INFINITY, st: Number.POSITIVE_INFINITY };
  }
  Hf() {
    this._f !== null && clearTimeout(this._f), this.af = 0, this._f = null, this.uf = { nt: Number.NEGATIVE_INFINITY, st: Number.POSITIVE_INFINITY };
  }
  Gf(t) {
    if (this.Rf || this.vf !== null || this.zf(t)) return;
    const i = this.Lf(t);
    this.$f(i, this.jf.Qf), this.Of = !0;
  }
  tv(t) {
    const i = Gt(t.changedTouches, v(this.Vf));
    if (i === null || (this.Df = yt(t), this.yf !== null) || this.Pf) return;
    this.Tf = !0;
    const s = this.Nf(R(i), v(this.vf)), { iv: e, nv: h, Ef: r } = s;
    if (this.pf || !(r < 5)) {
      if (!this.pf) {
        const o = 0.5 * e, l = h >= o && !this.cn.sv(), a = o > h && !this.cn.ev();
        l || a || (this.Pf = !0), this.pf = !0, this.bf = !0, this.Xf(), this.Hf();
      }
      if (!this.Pf) {
        const o = this.Lf(t, i);
        this.Ff(o, this.jf.rv), H(t);
      }
    }
  }
  hv(t) {
    if (t.button !== 0) return;
    const i = this.Nf(R(t), v(this.ff)), { Ef: s } = i;
    if (s >= 5 && (this.mf = !0, this.qf()), this.mf) {
      const e = this.Lf(t);
      this.$f(e, this.jf.lv);
    }
  }
  Nf(t, i) {
    const s = Math.abs(i.nt - t.nt), e = Math.abs(i.st - t.st);
    return { iv: s, nv: e, Ef: s + e };
  }
  av(t) {
    let i = Gt(t.changedTouches, v(this.Vf));
    if (i === null && t.touches.length === 0 && (i = t.changedTouches[0]), i === null) return;
    this.Vf = null, this.Df = yt(t), this.Xf(), this.vf = null, this.kf && (this.kf(), this.kf = null);
    const s = this.Lf(t, i);
    if (this.Ff(s, this.jf.ov), ++this.af, this._f && this.af > 1) {
      const { Ef: e } = this.Nf(R(i), this.uf);
      e < 30 && !this.bf && this.Ff(s, this.jf.Wf), this.Hf();
    } else this.bf || (this.Ff(s, this.jf._v), this.jf._v && H(t));
    this.af === 0 && H(t), t.touches.length === 0 && this.df && (this.df = !1, H(t));
  }
  Af(t) {
    if (t.button !== 0) return;
    const i = this.Lf(t);
    if (this.ff = null, this.Rf = !1, this.Sf && (this.Sf(), this.Sf = null), ns() && this.Yf.ownerDocument.documentElement.removeEventListener("mouseleave", this.Bf), !this.zf(t)) if (this.$f(i, this.jf.uv), ++this.rf, this.hf && this.rf > 1) {
      const { Ef: s } = this.Nf(R(t), this.lf);
      s < 5 && !this.mf && this.$f(i, this.jf.Uf), this.qf();
    } else this.mf || this.$f(i, this.jf.cv);
  }
  Xf() {
    this.cf !== null && (clearTimeout(this.cf), this.cf = null);
  }
  dv(t) {
    if (this.Vf !== null) return;
    const i = t.changedTouches[0];
    this.Vf = i.identifier, this.Df = yt(t);
    const s = this.Yf.ownerDocument.documentElement;
    this.bf = !1, this.pf = !1, this.Pf = !1, this.vf = R(i), this.kf && (this.kf(), this.kf = null);
    {
      const h = this.tv.bind(this), r = this.av.bind(this);
      this.kf = () => {
        s.removeEventListener("touchmove", h), s.removeEventListener("touchend", r);
      }, s.addEventListener("touchmove", h, { passive: !1 }), s.addEventListener("touchend", r, { passive: !1 }), this.Xf(), this.cf = setTimeout(this.fv.bind(this, t), 240);
    }
    const e = this.Lf(t, i);
    this.Ff(e, this.jf.vv), this._f || (this.af = 0, this._f = setTimeout(this.Hf.bind(this), 500), this.uf = R(i));
  }
  pv(t) {
    if (t.button !== 0) return;
    const i = this.Yf.ownerDocument.documentElement;
    ns() && i.addEventListener("mouseleave", this.Bf), this.mf = !1, this.ff = R(t), this.Sf && (this.Sf(), this.Sf = null);
    {
      const e = this.hv.bind(this), h = this.Af.bind(this);
      this.Sf = () => {
        i.removeEventListener("mousemove", e), i.removeEventListener("mouseup", h);
      }, i.addEventListener("mousemove", e), i.addEventListener("mouseup", h);
    }
    if (this.Rf = !0, this.zf(t)) return;
    const s = this.Lf(t);
    this.$f(s, this.jf.mv), this.hf || (this.rf = 0, this.hf = setTimeout(this.qf.bind(this), 500), this.lf = R(t));
  }
  Zf() {
    this.Yf.addEventListener("mouseenter", this.Kf.bind(this)), this.Yf.addEventListener("touchcancel", this.Xf.bind(this));
    {
      const t = this.Yf.ownerDocument, i = (s) => {
        this.jf.bv && (s.composed && this.Yf.contains(s.composedPath()[0]) || s.target && this.Yf.contains(s.target) || this.jf.bv());
      };
      this.gf = () => {
        t.removeEventListener("touchstart", i);
      }, this.wf = () => {
        t.removeEventListener("mousedown", i);
      }, t.addEventListener("mousedown", i), t.addEventListener("touchstart", i, { passive: !0 });
    }
    Ht() && (this.Mf = () => {
      this.Yf.removeEventListener("dblclick", this.If);
    }, this.Yf.addEventListener("dblclick", this.If)), this.Yf.addEventListener("mouseleave", this.wv.bind(this)), this.Yf.addEventListener("touchstart", this.dv.bind(this), { passive: !0 }), jn(this.Yf), this.Yf.addEventListener("mousedown", this.pv.bind(this)), this.gv(), this.Yf.addEventListener("touchmove", () => {
    }, { passive: !1 });
  }
  gv() {
    this.jf.Mv === void 0 && this.jf.xv === void 0 && this.jf.Sv === void 0 || (this.Yf.addEventListener("touchstart", (t) => this.kv(t.touches), { passive: !0 }), this.Yf.addEventListener("touchmove", (t) => {
      if (t.touches.length === 2 && this.yf !== null && this.jf.xv !== void 0) {
        const i = hs(t.touches[0], t.touches[1]) / this.Cf;
        this.jf.xv(this.yf, i), H(t);
      }
    }, { passive: !1 }), this.Yf.addEventListener("touchend", (t) => {
      this.kv(t.touches);
    }));
  }
  kv(t) {
    t.length === 1 && (this.Tf = !1), t.length !== 2 || this.Tf || this.df ? this.yv() : this.Cv(t);
  }
  Cv(t) {
    const i = this.Yf.getBoundingClientRect() || { left: 0, top: 0 };
    this.yf = { nt: (t[0].clientX - i.left + (t[1].clientX - i.left)) / 2, st: (t[0].clientY - i.top + (t[1].clientY - i.top)) / 2 }, this.Cf = hs(t[0], t[1]), this.jf.Mv !== void 0 && this.jf.Mv(), this.Xf();
  }
  yv() {
    this.yf !== null && (this.yf = null, this.jf.Sv !== void 0 && this.jf.Sv());
  }
  wv(t) {
    if (this.xf && this.xf(), this.zf(t) || !this.Of) return;
    const i = this.Lf(t);
    this.$f(i, this.jf.Tv), this.Of = !Ht();
  }
  fv(t) {
    const i = Gt(t.touches, v(this.Vf));
    if (i === null) return;
    const s = this.Lf(t, i);
    this.Ff(s, this.jf.Pv), this.bf = !0, this.df = !0;
  }
  zf(t) {
    return t.sourceCapabilities && t.sourceCapabilities.firesTouchEvents !== void 0 ? t.sourceCapabilities.firesTouchEvents : yt(t) < this.Df + 500;
  }
  Ff(t, i) {
    i && i.call(this.jf, t);
  }
  $f(t, i) {
    i && i.call(this.jf, t);
  }
  Lf(t, i) {
    const s = i || t, e = this.Yf.getBoundingClientRect() || { left: 0, top: 0 };
    return { clientX: s.clientX, clientY: s.clientY, pageX: s.pageX, pageY: s.pageY, screenX: s.screenX, screenY: s.screenY, localX: s.clientX - e.left, localY: s.clientY - e.top, ctrlKey: t.ctrlKey, altKey: t.altKey, shiftKey: t.shiftKey, metaKey: t.metaKey, Rv: !t.type.startsWith("mouse") && t.type !== "contextmenu" && t.type !== "click", Dv: t.type, Vv: s.target, Ov: t.view, Bv: () => {
      t.type !== "touchstart" && H(t);
    } };
  }
}
function hs(n, t) {
  const i = n.clientX - t.clientX, s = n.clientY - t.clientY;
  return Math.sqrt(i * i + s * s);
}
function H(n) {
  n.cancelable && n.preventDefault();
}
function R(n) {
  return { nt: n.pageX, st: n.pageY };
}
function yt(n) {
  return n.timeStamp || performance.now();
}
function Gt(n, t) {
  for (let i = 0; i < n.length; ++i) if (n[i].identifier === t) return n[i];
  return null;
}
function Mt(n) {
  return { jc: n.jc, Av: { wr: n.Iv.externalId }, zv: n.Iv.cursorStyle };
}
function Fn(n, t, i) {
  for (const s of n) {
    const e = s.gt();
    if (e !== null && e.br) {
      const h = e.br(t, i);
      if (h !== null) return { Ov: s, Av: h };
    }
  }
  return null;
}
function qt(n, t) {
  return (i) => {
    var s, e, h, r;
    return ((e = (s = i.Dt()) === null || s === void 0 ? void 0 : s.Ta()) !== null && e !== void 0 ? e : "") !== t ? [] : (r = (h = i.ca) === null || h === void 0 ? void 0 : h.call(i, n)) !== null && r !== void 0 ? r : [];
  };
}
function rs(n, t, i, s) {
  if (!n.length) return;
  let e = 0;
  const h = i / 2, r = n[0].At(s, !0);
  let o = t === 1 ? h - (n[0].Vi() - r / 2) : n[0].Vi() - r / 2 - h;
  o = Math.max(0, o);
  for (let l = 1; l < n.length; l++) {
    const a = n[l], c = n[l - 1], u = c.At(s, !1), d = a.Vi(), f = c.Vi();
    if (t === 1 ? d > f - u : d < f + u) {
      const m = f - u * t;
      a.Oi(m);
      const p = m - t * u / 2;
      if ((t === 1 ? p < 0 : p > i) && o > 0) {
        const b = t === 1 ? -1 - p : p - i, g = Math.min(b, o);
        for (let w = e; w < n.length; w++) n[w].Oi(n[w].Vi() + t * g);
        o -= g;
      }
    } else e = l, o = t === 1 ? f - u - d : d - (f + u);
  }
}
class os {
  constructor(t, i, s, e) {
    this.Li = null, this.Lv = null, this.Ev = !1, this.Nv = new ct(200), this.Jr = null, this.Fv = 0, this.Wv = !1, this.jv = () => {
      this.Wv || this.tn.Hv().$t().$h();
    }, this.$v = () => {
      this.Wv || this.tn.Hv().$t().$h();
    }, this.tn = t, this.cn = i, this.So = i.layout, this.Vc = s, this.Uv = e === "left", this.qv = qt("normal", e), this.Yv = qt("top", e), this.Zv = qt("bottom", e), this.Xv = document.createElement("div"), this.Xv.style.height = "100%", this.Xv.style.overflow = "hidden", this.Xv.style.width = "25px", this.Xv.style.left = "0", this.Xv.style.position = "relative", this.Kv = U(this.Xv, y({ width: 16, height: 16 })), this.Kv.subscribeSuggestedBitmapSizeChanged(this.jv);
    const h = this.Kv.canvasElement;
    h.style.position = "absolute", h.style.zIndex = "1", h.style.left = "0", h.style.top = "0", this.Gv = U(this.Xv, y({ width: 16, height: 16 })), this.Gv.subscribeSuggestedBitmapSizeChanged(this.$v);
    const r = this.Gv.canvasElement;
    r.style.position = "absolute", r.style.zIndex = "2", r.style.left = "0", r.style.top = "0";
    const o = { mv: this.Jv.bind(this), vv: this.Jv.bind(this), lv: this.Qv.bind(this), rv: this.Qv.bind(this), bv: this.tp.bind(this), uv: this.ip.bind(this), ov: this.ip.bind(this), Uf: this.np.bind(this), Wf: this.np.bind(this), Jf: this.sp.bind(this), Tv: this.ep.bind(this) };
    this.rp = new bi(this.Gv.canvasElement, o, { sv: () => !this.cn.handleScroll.vertTouchDrag, ev: () => !0 });
  }
  S() {
    this.rp.S(), this.Gv.unsubscribeSuggestedBitmapSizeChanged(this.$v), X(this.Gv.canvasElement), this.Gv.dispose(), this.Kv.unsubscribeSuggestedBitmapSizeChanged(this.jv), X(this.Kv.canvasElement), this.Kv.dispose(), this.Li !== null && this.Li.Xo().p(this), this.Li = null;
  }
  hp() {
    return this.Xv;
  }
  P() {
    return this.So.fontSize;
  }
  lp() {
    const t = this.Vc.W();
    return this.Jr !== t.R && (this.Nv.ir(), this.Jr = t.R), t;
  }
  ap() {
    if (this.Li === null) return 0;
    let t = 0;
    const i = this.lp(), s = v(this.Kv.canvasElement.getContext("2d"));
    s.save();
    const e = this.Li.ja();
    s.font = this.op(), e.length > 0 && (t = Math.max(this.Nv.xi(s, e[0].no), this.Nv.xi(s, e[e.length - 1].no)));
    const h = this._p();
    for (let l = h.length; l--; ) {
      const a = this.Nv.xi(s, h[l].Kt());
      a > t && (t = a);
    }
    const r = this.Li.Ct();
    if (r !== null && this.Lv !== null) {
      const l = this.Li.pn(1, r), a = this.Li.pn(this.Lv.height - 2, r);
      t = Math.max(t, this.Nv.xi(s, this.Li.Fi(Math.floor(Math.min(l, a)) + 0.11111111111111, r)), this.Nv.xi(s, this.Li.Fi(Math.ceil(Math.max(l, a)) - 0.11111111111111, r)));
    }
    s.restore();
    const o = t || 34;
    return hi(Math.ceil(i.C + i.T + i.A + i.I + 5 + o));
  }
  up(t) {
    this.Lv !== null && F(this.Lv, t) || (this.Lv = t, this.Wv = !0, this.Kv.resizeCanvasElement(t), this.Gv.resizeCanvasElement(t), this.Wv = !1, this.Xv.style.width = `${t.width}px`, this.Xv.style.height = `${t.height}px`);
  }
  cp() {
    return v(this.Lv).width;
  }
  Gi(t) {
    this.Li !== t && (this.Li !== null && this.Li.Xo().p(this), this.Li = t, t.Xo().l(this.do.bind(this), this));
  }
  Dt() {
    return this.Li;
  }
  ir() {
    const t = this.tn.dp();
    this.tn.Hv().$t().L_(t, v(this.Dt()));
  }
  fp(t) {
    if (this.Lv === null) return;
    if (t !== 1) {
      this.vp(), this.Kv.applySuggestedBitmapSize();
      const s = A(this.Kv);
      s !== null && (s.useBitmapCoordinateSpace((e) => {
        this.pp(e), this.Ae(e);
      }), this.tn.mp(s, this.Zv), this.bp(s), this.tn.mp(s, this.qv), this.wp(s));
    }
    this.Gv.applySuggestedBitmapSize();
    const i = A(this.Gv);
    i !== null && (i.useBitmapCoordinateSpace(({ context: s, bitmapSize: e }) => {
      s.clearRect(0, 0, e.width, e.height);
    }), this.gp(i), this.tn.mp(i, this.Yv));
  }
  Mp() {
    return this.Kv.bitmapSize;
  }
  xp(t, i, s) {
    const e = this.Mp();
    e.width > 0 && e.height > 0 && t.drawImage(this.Kv.canvasElement, i, s);
  }
  bt() {
    var t;
    (t = this.Li) === null || t === void 0 || t.ja();
  }
  Jv(t) {
    if (this.Li === null || this.Li.Ni() || !this.cn.handleScale.axisPressedMouseMove.price) return;
    const i = this.tn.Hv().$t(), s = this.tn.dp();
    this.Ev = !0, i.D_(s, this.Li, t.localY);
  }
  Qv(t) {
    if (this.Li === null || !this.cn.handleScale.axisPressedMouseMove.price) return;
    const i = this.tn.Hv().$t(), s = this.tn.dp(), e = this.Li;
    i.V_(s, e, t.localY);
  }
  tp() {
    if (this.Li === null || !this.cn.handleScale.axisPressedMouseMove.price) return;
    const t = this.tn.Hv().$t(), i = this.tn.dp(), s = this.Li;
    this.Ev && (this.Ev = !1, t.O_(i, s));
  }
  ip(t) {
    if (this.Li === null || !this.cn.handleScale.axisPressedMouseMove.price) return;
    const i = this.tn.Hv().$t(), s = this.tn.dp();
    this.Ev = !1, i.O_(s, this.Li);
  }
  np(t) {
    this.cn.handleScale.axisDoubleClickReset.price && this.ir();
  }
  sp(t) {
    this.Li !== null && (!this.tn.Hv().$t().W().handleScale.axisPressedMouseMove.price || this.Li.gh() || this.Li.Vo() || this.Sp(1));
  }
  ep(t) {
    this.Sp(0);
  }
  _p() {
    const t = [], i = this.Li === null ? void 0 : this.Li;
    return ((s) => {
      for (let e = 0; e < s.length; ++e) {
        const h = s[e].Rn(this.tn.dp(), i);
        for (let r = 0; r < h.length; r++) t.push(h[r]);
      }
    })(this.tn.dp().$o()), t;
  }
  pp({ context: t, bitmapSize: i }) {
    const { width: s, height: e } = i, h = this.tn.dp().$t(), r = h.q(), o = h.md();
    r === o ? Et(t, 0, 0, s, e, r) : zs(t, 0, 0, s, e, r, o);
  }
  Ae({ context: t, bitmapSize: i, horizontalPixelRatio: s }) {
    if (this.Lv === null || this.Li === null || !this.Li.W().borderVisible) return;
    t.fillStyle = this.Li.W().borderColor;
    const e = Math.max(1, Math.floor(this.lp().C * s));
    let h;
    h = this.Uv ? i.width - e : 0, t.fillRect(h, 0, e, i.height);
  }
  bp(t) {
    if (this.Lv === null || this.Li === null) return;
    const i = this.Li.ja(), s = this.Li.W(), e = this.lp(), h = this.Uv ? this.Lv.width - e.T : 0;
    s.borderVisible && s.ticksVisible && t.useBitmapCoordinateSpace(({ context: r, horizontalPixelRatio: o, verticalPixelRatio: l }) => {
      r.fillStyle = s.borderColor;
      const a = Math.max(1, Math.floor(l)), c = Math.floor(0.5 * l), u = Math.round(e.T * o);
      r.beginPath();
      for (const d of i) r.rect(Math.floor(h * o), Math.round(d.La * l) - c, u, a);
      r.fill();
    }), t.useMediaCoordinateSpace(({ context: r }) => {
      var o;
      r.font = this.op(), r.fillStyle = (o = s.textColor) !== null && o !== void 0 ? o : this.So.textColor, r.textAlign = this.Uv ? "right" : "left", r.textBaseline = "middle";
      const l = this.Uv ? Math.round(h - e.A) : Math.round(h + e.T + e.A), a = i.map((c) => this.Nv.Mi(r, c.no));
      for (let c = i.length; c--; ) {
        const u = i[c];
        r.fillText(u.no, l, u.La + a[c]);
      }
    });
  }
  vp() {
    if (this.Lv === null || this.Li === null) return;
    const t = [], i = this.Li.$o().slice(), s = this.tn.dp(), e = this.lp();
    this.Li === s.vr() && this.tn.dp().$o().forEach((r) => {
      s.dr(r) && i.push(r);
    });
    const h = this.Li;
    i.forEach((r) => {
      r.Rn(s, h).forEach((o) => {
        o.Oi(null), o.Bi() && t.push(o);
      });
    }), t.forEach((r) => r.Oi(r.ki())), this.Li.W().alignLabels && this.kp(t, e);
  }
  kp(t, i) {
    if (this.Lv === null) return;
    const s = this.Lv.height / 2, e = t.filter((r) => r.ki() <= s), h = t.filter((r) => r.ki() > s);
    e.sort((r, o) => o.ki() - r.ki()), h.sort((r, o) => r.ki() - o.ki());
    for (const r of t) {
      const o = Math.floor(r.At(i) / 2), l = r.ki();
      l > -o && l < o && r.Oi(o), l > this.Lv.height - o && l < this.Lv.height + o && r.Oi(this.Lv.height - o);
    }
    rs(e, 1, this.Lv.height, i), rs(h, -1, this.Lv.height, i);
  }
  wp(t) {
    if (this.Lv === null) return;
    const i = this._p(), s = this.lp(), e = this.Uv ? "right" : "left";
    i.forEach((h) => {
      h.Ai() && h.gt(v(this.Li)).X(t, s, this.Nv, e);
    });
  }
  gp(t) {
    if (this.Lv === null || this.Li === null) return;
    const i = this.tn.Hv().$t(), s = [], e = this.tn.dp(), h = i.Yc().Rn(e, this.Li);
    h.length && s.push(h);
    const r = this.lp(), o = this.Uv ? "right" : "left";
    s.forEach((l) => {
      l.forEach((a) => {
        a.gt(v(this.Li)).X(t, r, this.Nv, o);
      });
    });
  }
  Sp(t) {
    this.Xv.style.cursor = t === 1 ? "ns-resize" : "default";
  }
  do() {
    const t = this.ap();
    this.Fv < t && this.tn.Hv().$t().Xl(), this.Fv = t;
  }
  op() {
    return Q(this.So.fontSize, this.So.fontFamily);
  }
}
function An(n, t) {
  var i, s;
  return (s = (i = n._a) === null || i === void 0 ? void 0 : i.call(n, t)) !== null && s !== void 0 ? s : [];
}
function _t(n, t) {
  var i, s;
  return (s = (i = n.Pn) === null || i === void 0 ? void 0 : i.call(n, t)) !== null && s !== void 0 ? s : [];
}
function Kn(n, t) {
  var i, s;
  return (s = (i = n.Ji) === null || i === void 0 ? void 0 : i.call(n, t)) !== null && s !== void 0 ? s : [];
}
function Un(n, t) {
  var i, s;
  return (s = (i = n.la) === null || i === void 0 ? void 0 : i.call(n, t)) !== null && s !== void 0 ? s : [];
}
class gi {
  constructor(t, i) {
    this.Lv = y({ width: 0, height: 0 }), this.yp = null, this.Cp = null, this.Tp = null, this.Pp = null, this.Rp = !1, this.Dp = new _(), this.Vp = new _(), this.Op = 0, this.Bp = !1, this.Ap = null, this.Ip = !1, this.zp = null, this.Lp = null, this.Wv = !1, this.jv = () => {
      this.Wv || this.Ep === null || this.$i().$h();
    }, this.$v = () => {
      this.Wv || this.Ep === null || this.$i().$h();
    }, this.Jd = t, this.Ep = i, this.Ep.F_().l(this.Np.bind(this), this, !0), this.Fp = document.createElement("td"), this.Fp.style.padding = "0", this.Fp.style.position = "relative";
    const s = document.createElement("div");
    s.style.width = "100%", s.style.height = "100%", s.style.position = "relative", s.style.overflow = "hidden", this.Wp = document.createElement("td"), this.Wp.style.padding = "0", this.jp = document.createElement("td"), this.jp.style.padding = "0", this.Fp.appendChild(s), this.Kv = U(s, y({ width: 16, height: 16 })), this.Kv.subscribeSuggestedBitmapSizeChanged(this.jv);
    const e = this.Kv.canvasElement;
    e.style.position = "absolute", e.style.zIndex = "1", e.style.left = "0", e.style.top = "0", this.Gv = U(s, y({ width: 16, height: 16 })), this.Gv.subscribeSuggestedBitmapSizeChanged(this.$v);
    const h = this.Gv.canvasElement;
    h.style.position = "absolute", h.style.zIndex = "2", h.style.left = "0", h.style.top = "0", this.Hp = document.createElement("tr"), this.Hp.appendChild(this.Wp), this.Hp.appendChild(this.Fp), this.Hp.appendChild(this.jp), this.$p(), this.rp = new bi(this.Gv.canvasElement, this, { sv: () => this.Ap === null && !this.Jd.W().handleScroll.vertTouchDrag, ev: () => this.Ap === null && !this.Jd.W().handleScroll.horzTouchDrag });
  }
  S() {
    this.yp !== null && this.yp.S(), this.Cp !== null && this.Cp.S(), this.Tp = null, this.Gv.unsubscribeSuggestedBitmapSizeChanged(this.$v), X(this.Gv.canvasElement), this.Gv.dispose(), this.Kv.unsubscribeSuggestedBitmapSizeChanged(this.jv), X(this.Kv.canvasElement), this.Kv.dispose(), this.Ep !== null && this.Ep.F_().p(this), this.rp.S();
  }
  dp() {
    return v(this.Ep);
  }
  Up(t) {
    var i, s;
    this.Ep !== null && this.Ep.F_().p(this), this.Ep = t, this.Ep !== null && this.Ep.F_().l(gi.prototype.Np.bind(this), this, !0), this.$p(), this.Jd.qp().indexOf(this) === this.Jd.qp().length - 1 ? (this.Tp = (i = this.Tp) !== null && i !== void 0 ? i : new In(this.Fp, this.Jd), this.Tp.bt()) : ((s = this.Tp) === null || s === void 0 || s.tf(), this.Tp = null);
  }
  Hv() {
    return this.Jd;
  }
  hp() {
    return this.Hp;
  }
  $p() {
    if (this.Ep !== null && (this.Yp(), this.$i().wt().length !== 0)) {
      if (this.yp !== null) {
        const t = this.Ep.P_();
        this.yp.Gi(v(t));
      }
      if (this.Cp !== null) {
        const t = this.Ep.R_();
        this.Cp.Gi(v(t));
      }
    }
  }
  Zp() {
    this.yp !== null && this.yp.bt(), this.Cp !== null && this.Cp.bt();
  }
  g_() {
    return this.Ep !== null ? this.Ep.g_() : 0;
  }
  M_(t) {
    this.Ep && this.Ep.M_(t);
  }
  Jf(t) {
    if (!this.Ep) return;
    this.Xp();
    const i = t.localX, s = t.localY;
    this.Kp(i, s, t);
  }
  mv(t) {
    this.Xp(), this.Gp(), this.Kp(t.localX, t.localY, t);
  }
  Qf(t) {
    var i;
    if (!this.Ep) return;
    this.Xp();
    const s = t.localX, e = t.localY;
    this.Kp(s, e, t);
    const h = this.br(s, e);
    this.Jd.Jp((i = h == null ? void 0 : h.zv) !== null && i !== void 0 ? i : null), this.$i().Wc(h && { jc: h.jc, Av: h.Av });
  }
  cv(t) {
    this.Ep !== null && (this.Xp(), this.Qp(t));
  }
  Uf(t) {
    this.Ep !== null && this.tm(this.Vp, t);
  }
  Wf(t) {
    this.Uf(t);
  }
  lv(t) {
    this.Xp(), this.im(t), this.Kp(t.localX, t.localY, t);
  }
  uv(t) {
    this.Ep !== null && (this.Xp(), this.Bp = !1, this.nm(t));
  }
  _v(t) {
    this.Ep !== null && this.Qp(t);
  }
  Pv(t) {
    if (this.Bp = !0, this.Ap === null) {
      const i = { x: t.localX, y: t.localY };
      this.sm(i, i, t);
    }
  }
  Tv(t) {
    this.Ep !== null && (this.Xp(), this.Ep.$t().Wc(null), this.rm());
  }
  hm() {
    return this.Dp;
  }
  lm() {
    return this.Vp;
  }
  Mv() {
    this.Op = 1, this.$i().Un();
  }
  xv(t, i) {
    if (!this.Jd.W().handleScale.pinch) return;
    const s = 5 * (i - this.Op);
    this.Op = i, this.$i().Jc(t.nt, s);
  }
  vv(t) {
    this.Bp = !1, this.Ip = this.Ap !== null, this.Gp();
    const i = this.$i().Yc();
    this.Ap !== null && i.yt() && (this.zp = { x: i.Yt(), y: i.Zt() }, this.Ap = { x: t.localX, y: t.localY });
  }
  rv(t) {
    if (this.Ep === null) return;
    const i = t.localX, s = t.localY;
    if (this.Ap === null) this.im(t);
    else {
      this.Ip = !1;
      const e = v(this.zp), h = e.x + (i - this.Ap.x), r = e.y + (s - this.Ap.y);
      this.Kp(h, r, t);
    }
  }
  ov(t) {
    this.Hv().W().trackingMode.exitMode === 0 && (this.Ip = !0), this.am(), this.nm(t);
  }
  br(t, i) {
    const s = this.Ep;
    return s === null ? null : function(e, h, r) {
      const o = e.$o(), l = function(a, c, u) {
        var d, f;
        let m, p;
        for (const w of a) {
          const M = (f = (d = w.fa) === null || d === void 0 ? void 0 : d.call(w, c, u)) !== null && f !== void 0 ? f : [];
          for (const S of M) b = S.zOrder, (!(g = m == null ? void 0 : m.zOrder) || b === "top" && g !== "top" || b === "normal" && g === "bottom") && (m = S, p = w);
        }
        var b, g;
        return m && p ? { Iv: m, jc: p } : null;
      }(o, h, r);
      if ((l == null ? void 0 : l.Iv.zOrder) === "top") return Mt(l);
      for (const a of o) {
        if (l && l.jc === a && l.Iv.zOrder !== "bottom" && !l.Iv.isBackground) return Mt(l);
        const c = Fn(a.Pn(e), h, r);
        if (c !== null) return { jc: a, Ov: c.Ov, Av: c.Av };
        if (l && l.jc === a && l.Iv.zOrder !== "bottom" && l.Iv.isBackground) return Mt(l);
      }
      return l != null && l.Iv ? Mt(l) : null;
    }(s, t, i);
  }
  om(t, i) {
    v(i === "left" ? this.yp : this.Cp).up(y({ width: t, height: this.Lv.height }));
  }
  _m() {
    return this.Lv;
  }
  up(t) {
    F(this.Lv, t) || (this.Lv = t, this.Wv = !0, this.Kv.resizeCanvasElement(t), this.Gv.resizeCanvasElement(t), this.Wv = !1, this.Fp.style.width = t.width + "px", this.Fp.style.height = t.height + "px");
  }
  um() {
    const t = v(this.Ep);
    t.T_(t.P_()), t.T_(t.R_());
    for (const i of t.Oa()) if (t.dr(i)) {
      const s = i.Dt();
      s !== null && t.T_(s), i.Vn();
    }
  }
  Mp() {
    return this.Kv.bitmapSize;
  }
  xp(t, i, s) {
    const e = this.Mp();
    e.width > 0 && e.height > 0 && t.drawImage(this.Kv.canvasElement, i, s);
  }
  fp(t) {
    if (t === 0 || this.Ep === null) return;
    if (t > 1 && this.um(), this.yp !== null && this.yp.fp(t), this.Cp !== null && this.Cp.fp(t), t !== 1) {
      this.Kv.applySuggestedBitmapSize();
      const s = A(this.Kv);
      s !== null && (s.useBitmapCoordinateSpace((e) => {
        this.pp(e);
      }), this.Ep && (this.dm(s, An), this.fm(s), this.vm(s), this.dm(s, _t), this.dm(s, Kn)));
    }
    this.Gv.applySuggestedBitmapSize();
    const i = A(this.Gv);
    i !== null && (i.useBitmapCoordinateSpace(({ context: s, bitmapSize: e }) => {
      s.clearRect(0, 0, e.width, e.height);
    }), this.pm(i), this.dm(i, Un));
  }
  bm() {
    return this.yp;
  }
  wm() {
    return this.Cp;
  }
  mp(t, i) {
    this.dm(t, i);
  }
  Np() {
    this.Ep !== null && this.Ep.F_().p(this), this.Ep = null;
  }
  Qp(t) {
    this.tm(this.Dp, t);
  }
  tm(t, i) {
    const s = i.localX, e = i.localY;
    t.M() && t.m(this.$i().St().Eu(s), { x: s, y: e }, i);
  }
  pp({ context: t, bitmapSize: i }) {
    const { width: s, height: e } = i, h = this.$i(), r = h.q(), o = h.md();
    r === o ? Et(t, 0, 0, s, e, o) : zs(t, 0, 0, s, e, r, o);
  }
  fm(t) {
    const i = v(this.Ep).W_().Uh().gt();
    i !== null && i.X(t, !1);
  }
  vm(t) {
    const i = this.$i().qc();
    this.gm(t, _t, ri, i), this.gm(t, _t, zt, i);
  }
  pm(t) {
    this.gm(t, _t, zt, this.$i().Yc());
  }
  dm(t, i) {
    const s = v(this.Ep).$o();
    for (const e of s) this.gm(t, i, ri, e);
    for (const e of s) this.gm(t, i, zt, e);
  }
  gm(t, i, s, e) {
    const h = v(this.Ep), r = h.$t().Fc(), o = r !== null && r.jc === e, l = r !== null && o && r.Av !== void 0 ? r.Av.gr : void 0;
    oi(i, (a) => s(a, t, o, l), e, h);
  }
  Yp() {
    if (this.Ep === null) return;
    const t = this.Jd, i = this.Ep.P_().W().visible, s = this.Ep.R_().W().visible;
    i || this.yp === null || (this.Wp.removeChild(this.yp.hp()), this.yp.S(), this.yp = null), s || this.Cp === null || (this.jp.removeChild(this.Cp.hp()), this.Cp.S(), this.Cp = null);
    const e = t.$t()._d();
    i && this.yp === null && (this.yp = new os(this, t.W(), e, "left"), this.Wp.appendChild(this.yp.hp())), s && this.Cp === null && (this.Cp = new os(this, t.W(), e, "right"), this.jp.appendChild(this.Cp.hp()));
  }
  Mm(t) {
    return t.Rv && this.Bp || this.Ap !== null;
  }
  xm(t) {
    return Math.max(0, Math.min(t, this.Lv.width - 1));
  }
  Sm(t) {
    return Math.max(0, Math.min(t, this.Lv.height - 1));
  }
  Kp(t, i, s) {
    this.$i().hd(this.xm(t), this.Sm(i), s, v(this.Ep));
  }
  rm() {
    this.$i().ad();
  }
  am() {
    this.Ip && (this.Ap = null, this.rm());
  }
  sm(t, i, s) {
    this.Ap = t, this.Ip = !1, this.Kp(i.x, i.y, s);
    const e = this.$i().Yc();
    this.zp = { x: e.Yt(), y: e.Zt() };
  }
  $i() {
    return this.Jd.$t();
  }
  nm(t) {
    if (!this.Rp) return;
    const i = this.$i(), s = this.dp();
    if (i.I_(s, s.vn()), this.Pp = null, this.Rp = !1, i.sd(), this.Lp !== null) {
      const e = performance.now(), h = i.St();
      this.Lp.Dr(h.ju(), e), this.Lp.Ju(e) || i.Zn(this.Lp);
    }
  }
  Xp() {
    this.Ap = null;
  }
  Gp() {
    if (this.Ep) {
      if (this.$i().Un(), document.activeElement !== document.body && document.activeElement !== document.documentElement) v(document.activeElement).blur();
      else {
        const t = document.getSelection();
        t !== null && t.removeAllRanges();
      }
      !this.Ep.vn().Ni() && this.$i().St().Ni();
    }
  }
  im(t) {
    if (this.Ep === null) return;
    const i = this.$i(), s = i.St();
    if (s.Ni()) return;
    const e = this.Jd.W(), h = e.handleScroll, r = e.kineticScroll;
    if ((!h.pressedMouseMove || t.Rv) && (!h.horzTouchDrag && !h.vertTouchDrag || !t.Rv)) return;
    const o = this.Ep.vn(), l = performance.now();
    if (this.Pp !== null || this.Mm(t) || (this.Pp = { x: t.clientX, y: t.clientY, Vd: l, km: t.localX, ym: t.localY }), this.Pp !== null && !this.Rp && (this.Pp.x !== t.clientX || this.Pp.y !== t.clientY)) {
      if (t.Rv && r.touch || !t.Rv && r.mouse) {
        const a = s.he();
        this.Lp = new Bn(0.2 / a, 7 / a, 0.997, 15 / a), this.Lp.qd(s.ju(), this.Pp.Vd);
      } else this.Lp = null;
      o.Ni() || i.B_(this.Ep, o, t.localY), i.td(t.localX), this.Rp = !0;
    }
    this.Rp && (o.Ni() || i.A_(this.Ep, o, t.localY), i.nd(t.localX), this.Lp !== null && this.Lp.qd(s.ju(), l));
  }
}
class ls {
  constructor(t, i, s, e, h) {
    this.ft = !0, this.Lv = y({ width: 0, height: 0 }), this.jv = () => this.fp(3), this.Uv = t === "left", this.Vc = s._d, this.cn = i, this.Cm = e, this.Tm = h, this.Xv = document.createElement("div"), this.Xv.style.width = "25px", this.Xv.style.height = "100%", this.Xv.style.overflow = "hidden", this.Kv = U(this.Xv, y({ width: 16, height: 16 })), this.Kv.subscribeSuggestedBitmapSizeChanged(this.jv);
  }
  S() {
    this.Kv.unsubscribeSuggestedBitmapSizeChanged(this.jv), X(this.Kv.canvasElement), this.Kv.dispose();
  }
  hp() {
    return this.Xv;
  }
  _m() {
    return this.Lv;
  }
  up(t) {
    F(this.Lv, t) || (this.Lv = t, this.Kv.resizeCanvasElement(t), this.Xv.style.width = `${t.width}px`, this.Xv.style.height = `${t.height}px`, this.ft = !0);
  }
  fp(t) {
    if (t < 3 && !this.ft || this.Lv.width === 0 || this.Lv.height === 0) return;
    this.ft = !1, this.Kv.applySuggestedBitmapSize();
    const i = A(this.Kv);
    i !== null && i.useBitmapCoordinateSpace((s) => {
      this.pp(s), this.Ae(s);
    });
  }
  Mp() {
    return this.Kv.bitmapSize;
  }
  xp(t, i, s) {
    const e = this.Mp();
    e.width > 0 && e.height > 0 && t.drawImage(this.Kv.canvasElement, i, s);
  }
  Ae({ context: t, bitmapSize: i, horizontalPixelRatio: s, verticalPixelRatio: e }) {
    if (!this.Cm()) return;
    t.fillStyle = this.cn.timeScale.borderColor;
    const h = Math.floor(this.Vc.W().C * s), r = Math.floor(this.Vc.W().C * e), o = this.Uv ? i.width - h : 0;
    t.fillRect(o, 0, h, r);
  }
  pp({ context: t, bitmapSize: i }) {
    Et(t, 0, 0, i.width, i.height, this.Tm());
  }
}
function wi(n) {
  return (t) => {
    var i, s;
    return (s = (i = t.da) === null || i === void 0 ? void 0 : i.call(t, n)) !== null && s !== void 0 ? s : [];
  };
}
const Xn = wi("normal"), Jn = wi("top"), Hn = wi("bottom");
class Zn {
  constructor(t, i) {
    this.Pm = null, this.Rm = null, this.k = null, this.Dm = !1, this.Lv = y({ width: 0, height: 0 }), this.Vm = new _(), this.Nv = new ct(5), this.Wv = !1, this.jv = () => {
      this.Wv || this.Jd.$t().$h();
    }, this.$v = () => {
      this.Wv || this.Jd.$t().$h();
    }, this.Jd = t, this.U_ = i, this.cn = t.W().layout, this.Zd = document.createElement("tr"), this.Om = document.createElement("td"), this.Om.style.padding = "0", this.Bm = document.createElement("td"), this.Bm.style.padding = "0", this.Xv = document.createElement("td"), this.Xv.style.height = "25px", this.Xv.style.padding = "0", this.Am = document.createElement("div"), this.Am.style.width = "100%", this.Am.style.height = "100%", this.Am.style.position = "relative", this.Am.style.overflow = "hidden", this.Xv.appendChild(this.Am), this.Kv = U(this.Am, y({ width: 16, height: 16 })), this.Kv.subscribeSuggestedBitmapSizeChanged(this.jv);
    const s = this.Kv.canvasElement;
    s.style.position = "absolute", s.style.zIndex = "1", s.style.left = "0", s.style.top = "0", this.Gv = U(this.Am, y({ width: 16, height: 16 })), this.Gv.subscribeSuggestedBitmapSizeChanged(this.$v);
    const e = this.Gv.canvasElement;
    e.style.position = "absolute", e.style.zIndex = "2", e.style.left = "0", e.style.top = "0", this.Zd.appendChild(this.Om), this.Zd.appendChild(this.Xv), this.Zd.appendChild(this.Bm), this.Im(), this.Jd.$t().w_().l(this.Im.bind(this), this), this.rp = new bi(this.Gv.canvasElement, this, { sv: () => !0, ev: () => !this.Jd.W().handleScroll.horzTouchDrag });
  }
  S() {
    this.rp.S(), this.Pm !== null && this.Pm.S(), this.Rm !== null && this.Rm.S(), this.Gv.unsubscribeSuggestedBitmapSizeChanged(this.$v), X(this.Gv.canvasElement), this.Gv.dispose(), this.Kv.unsubscribeSuggestedBitmapSizeChanged(this.jv), X(this.Kv.canvasElement), this.Kv.dispose();
  }
  hp() {
    return this.Zd;
  }
  zm() {
    return this.Pm;
  }
  Lm() {
    return this.Rm;
  }
  mv(t) {
    if (this.Dm) return;
    this.Dm = !0;
    const i = this.Jd.$t();
    !i.St().Ni() && this.Jd.W().handleScale.axisPressedMouseMove.time && i.Gc(t.localX);
  }
  vv(t) {
    this.mv(t);
  }
  bv() {
    const t = this.Jd.$t();
    !t.St().Ni() && this.Dm && (this.Dm = !1, this.Jd.W().handleScale.axisPressedMouseMove.time && t.rd());
  }
  lv(t) {
    const i = this.Jd.$t();
    !i.St().Ni() && this.Jd.W().handleScale.axisPressedMouseMove.time && i.ed(t.localX);
  }
  rv(t) {
    this.lv(t);
  }
  uv() {
    this.Dm = !1;
    const t = this.Jd.$t();
    t.St().Ni() && !this.Jd.W().handleScale.axisPressedMouseMove.time || t.rd();
  }
  ov() {
    this.uv();
  }
  Uf() {
    this.Jd.W().handleScale.axisDoubleClickReset.time && this.Jd.$t().Kn();
  }
  Wf() {
    this.Uf();
  }
  Jf() {
    this.Jd.$t().W().handleScale.axisPressedMouseMove.time && this.Sp(1);
  }
  Tv() {
    this.Sp(0);
  }
  _m() {
    return this.Lv;
  }
  Em() {
    return this.Vm;
  }
  Nm(t, i, s) {
    F(this.Lv, t) || (this.Lv = t, this.Wv = !0, this.Kv.resizeCanvasElement(t), this.Gv.resizeCanvasElement(t), this.Wv = !1, this.Xv.style.width = `${t.width}px`, this.Xv.style.height = `${t.height}px`, this.Vm.m(t)), this.Pm !== null && this.Pm.up(y({ width: i, height: t.height })), this.Rm !== null && this.Rm.up(y({ width: s, height: t.height }));
  }
  Fm() {
    const t = this.Wm();
    return Math.ceil(t.C + t.T + t.P + t.L + t.B + t.jm);
  }
  bt() {
    this.Jd.$t().St().ja();
  }
  Mp() {
    return this.Kv.bitmapSize;
  }
  xp(t, i, s) {
    const e = this.Mp();
    e.width > 0 && e.height > 0 && t.drawImage(this.Kv.canvasElement, i, s);
  }
  fp(t) {
    if (t === 0) return;
    if (t !== 1) {
      this.Kv.applySuggestedBitmapSize();
      const s = A(this.Kv);
      s !== null && (s.useBitmapCoordinateSpace((e) => {
        this.pp(e), this.Ae(e), this.Hm(s, Hn);
      }), this.bp(s), this.Hm(s, Xn)), this.Pm !== null && this.Pm.fp(t), this.Rm !== null && this.Rm.fp(t);
    }
    this.Gv.applySuggestedBitmapSize();
    const i = A(this.Gv);
    i !== null && (i.useBitmapCoordinateSpace(({ context: s, bitmapSize: e }) => {
      s.clearRect(0, 0, e.width, e.height);
    }), this.$m([...this.Jd.$t().wt(), this.Jd.$t().Yc()], i), this.Hm(i, Jn));
  }
  Hm(t, i) {
    const s = this.Jd.$t().wt();
    for (const e of s) oi(i, (h) => ri(h, t, !1, void 0), e, void 0);
    for (const e of s) oi(i, (h) => zt(h, t, !1, void 0), e, void 0);
  }
  pp({ context: t, bitmapSize: i }) {
    Et(t, 0, 0, i.width, i.height, this.Jd.$t().md());
  }
  Ae({ context: t, bitmapSize: i, verticalPixelRatio: s }) {
    if (this.Jd.W().timeScale.borderVisible) {
      t.fillStyle = this.Um();
      const e = Math.max(1, Math.floor(this.Wm().C * s));
      t.fillRect(0, 0, i.width, e);
    }
  }
  bp(t) {
    const i = this.Jd.$t().St(), s = i.ja();
    if (!s || s.length === 0) return;
    const e = this.U_.maxTickMarkWeight(s), h = this.Wm(), r = i.W();
    r.borderVisible && r.ticksVisible && t.useBitmapCoordinateSpace(({ context: o, horizontalPixelRatio: l, verticalPixelRatio: a }) => {
      o.strokeStyle = this.Um(), o.fillStyle = this.Um();
      const c = Math.max(1, Math.floor(l)), u = Math.floor(0.5 * l);
      o.beginPath();
      const d = Math.round(h.T * a);
      for (let f = s.length; f--; ) {
        const m = Math.round(s[f].coord * l);
        o.rect(m - u, 0, c, d);
      }
      o.fill();
    }), t.useMediaCoordinateSpace(({ context: o }) => {
      const l = h.C + h.T + h.L + h.P / 2;
      o.textAlign = "center", o.textBaseline = "middle", o.fillStyle = this.$(), o.font = this.op();
      for (const a of s) if (a.weight < e) {
        const c = a.needAlignCoordinate ? this.qm(o, a.coord, a.label) : a.coord;
        o.fillText(a.label, c, l);
      }
      this.Jd.W().timeScale.allowBoldLabels && (o.font = this.Ym());
      for (const a of s) if (a.weight >= e) {
        const c = a.needAlignCoordinate ? this.qm(o, a.coord, a.label) : a.coord;
        o.fillText(a.label, c, l);
      }
    });
  }
  qm(t, i, s) {
    const e = this.Nv.xi(t, s), h = e / 2, r = Math.floor(i - h) + 0.5;
    return r < 0 ? i += Math.abs(0 - r) : r + e > this.Lv.width && (i -= Math.abs(this.Lv.width - (r + e))), i;
  }
  $m(t, i) {
    const s = this.Wm();
    for (const e of t) for (const h of e.Qi()) h.gt().X(i, s);
  }
  Um() {
    return this.Jd.W().timeScale.borderColor;
  }
  $() {
    return this.cn.textColor;
  }
  j() {
    return this.cn.fontSize;
  }
  op() {
    return Q(this.j(), this.cn.fontFamily);
  }
  Ym() {
    return Q(this.j(), this.cn.fontFamily, "bold");
  }
  Wm() {
    this.k === null && (this.k = { C: 1, N: NaN, L: NaN, B: NaN, ji: NaN, T: 5, P: NaN, R: "", Wi: new ct(), jm: 0 });
    const t = this.k, i = this.op();
    if (t.R !== i) {
      const s = this.j();
      t.P = s, t.R = i, t.L = 3 * s / 12, t.B = 3 * s / 12, t.ji = 9 * s / 12, t.N = 0, t.jm = 4 * s / 12, t.Wi.ir();
    }
    return this.k;
  }
  Sp(t) {
    this.Xv.style.cursor = t === 1 ? "ew-resize" : "default";
  }
  Im() {
    const t = this.Jd.$t(), i = t.W();
    i.leftPriceScale.visible || this.Pm === null || (this.Om.removeChild(this.Pm.hp()), this.Pm.S(), this.Pm = null), i.rightPriceScale.visible || this.Rm === null || (this.Bm.removeChild(this.Rm.hp()), this.Rm.S(), this.Rm = null);
    const s = { _d: this.Jd.$t()._d() }, e = () => i.leftPriceScale.borderVisible && t.St().W().borderVisible, h = () => t.md();
    i.leftPriceScale.visible && this.Pm === null && (this.Pm = new ls("left", i, s, e, h), this.Om.appendChild(this.Pm.hp())), i.rightPriceScale.visible && this.Rm === null && (this.Rm = new ls("right", i, s, e, h), this.Bm.appendChild(this.Rm.hp()));
  }
}
const Yn = !!tt && !!navigator.userAgentData && navigator.userAgentData.brands.some((n) => n.brand.includes("Chromium")) && !!tt && (!((Qt = navigator == null ? void 0 : navigator.userAgentData) === null || Qt === void 0) && Qt.platform ? navigator.userAgentData.platform === "Windows" : navigator.userAgent.toLowerCase().indexOf("win") >= 0);
var Qt;
class Gn {
  constructor(t, i, s) {
    var e;
    this.Zm = [], this.Xm = 0, this.ro = 0, this.o_ = 0, this.Km = 0, this.Gm = 0, this.Jm = null, this.Qm = !1, this.Dp = new _(), this.Vp = new _(), this.Pc = new _(), this.tb = null, this.ib = null, this.Gd = t, this.cn = i, this.U_ = s, this.Zd = document.createElement("div"), this.Zd.classList.add("tv-lightweight-charts"), this.Zd.style.overflow = "hidden", this.Zd.style.direction = "ltr", this.Zd.style.width = "100%", this.Zd.style.height = "100%", (e = this.Zd).style.userSelect = "none", e.style.webkitUserSelect = "none", e.style.msUserSelect = "none", e.style.MozUserSelect = "none", e.style.webkitTapHighlightColor = "transparent", this.nb = document.createElement("table"), this.nb.setAttribute("cellspacing", "0"), this.Zd.appendChild(this.nb), this.sb = this.eb.bind(this), ti(this.cn) && this.rb(!0), this.$i = new Rn(this.Dc.bind(this), this.cn, s), this.$t().Zc().l(this.hb.bind(this), this), this.lb = new Zn(this, this.U_), this.nb.appendChild(this.lb.hp());
    const h = i.autoSize && this.ab();
    let r = this.cn.width, o = this.cn.height;
    if (h || r === 0 || o === 0) {
      const l = t.getBoundingClientRect();
      r = r || l.width, o = o || l.height;
    }
    this.ob(r, o), this._b(), t.appendChild(this.Zd), this.ub(), this.$i.St().sc().l(this.$i.Xl.bind(this.$i), this), this.$i.w_().l(this.$i.Xl.bind(this.$i), this);
  }
  $t() {
    return this.$i;
  }
  W() {
    return this.cn;
  }
  qp() {
    return this.Zm;
  }
  cb() {
    return this.lb;
  }
  S() {
    this.rb(!1), this.Xm !== 0 && window.cancelAnimationFrame(this.Xm), this.$i.Zc().p(this), this.$i.St().sc().p(this), this.$i.w_().p(this), this.$i.S();
    for (const t of this.Zm) this.nb.removeChild(t.hp()), t.hm().p(this), t.lm().p(this), t.S();
    this.Zm = [], v(this.lb).S(), this.Zd.parentElement !== null && this.Zd.parentElement.removeChild(this.Zd), this.Pc.S(), this.Dp.S(), this.Vp.S(), this.fb();
  }
  ob(t, i, s = !1) {
    if (this.ro === i && this.o_ === t) return;
    const e = function(o) {
      const l = Math.floor(o.width), a = Math.floor(o.height);
      return y({ width: l - l % 2, height: a - a % 2 });
    }(y({ width: t, height: i }));
    this.ro = e.height, this.o_ = e.width;
    const h = this.ro + "px", r = this.o_ + "px";
    v(this.Zd).style.height = h, v(this.Zd).style.width = r, this.nb.style.height = h, this.nb.style.width = r, s ? this.pb(z.es(), performance.now()) : this.$i.Xl();
  }
  fp(t) {
    t === void 0 && (t = z.es());
    for (let i = 0; i < this.Zm.length; i++) this.Zm[i].fp(t.Hn(i).Fn);
    this.cn.timeScale.visible && this.lb.fp(t.jn());
  }
  Hh(t) {
    const i = ti(this.cn);
    this.$i.Hh(t);
    const s = ti(this.cn);
    s !== i && this.rb(s), this.ub(), this.mb(t);
  }
  hm() {
    return this.Dp;
  }
  lm() {
    return this.Vp;
  }
  Zc() {
    return this.Pc;
  }
  bb() {
    this.Jm !== null && (this.pb(this.Jm, performance.now()), this.Jm = null);
    const t = this.wb(null), i = document.createElement("canvas");
    i.width = t.width, i.height = t.height;
    const s = v(i.getContext("2d"));
    return this.wb(s), i;
  }
  gb(t) {
    return t === "left" && !this.Mb() || t === "right" && !this.xb() || this.Zm.length === 0 ? 0 : v(t === "left" ? this.Zm[0].bm() : this.Zm[0].wm()).cp();
  }
  Sb() {
    return this.cn.autoSize && this.tb !== null;
  }
  kb() {
    return this.Zd;
  }
  Jp(t) {
    this.ib = t, this.ib ? this.kb().style.setProperty("cursor", t) : this.kb().style.removeProperty("cursor");
  }
  yb() {
    return this.ib;
  }
  Cb() {
    return k(this.Zm[0])._m();
  }
  mb(t) {
    (t.autoSize !== void 0 || !this.tb || t.width === void 0 && t.height === void 0) && (t.autoSize && !this.tb && this.ab(), t.autoSize === !1 && this.tb !== null && this.fb(), t.autoSize || t.width === void 0 && t.height === void 0 || this.ob(t.width || this.o_, t.height || this.ro));
  }
  wb(t) {
    let i = 0, s = 0;
    const e = this.Zm[0], h = (o, l) => {
      let a = 0;
      for (let c = 0; c < this.Zm.length; c++) {
        const u = this.Zm[c], d = v(o === "left" ? u.bm() : u.wm()), f = d.Mp();
        t !== null && d.xp(t, l, a), a += f.height;
      }
    };
    this.Mb() && (h("left", 0), i += v(e.bm()).Mp().width);
    for (let o = 0; o < this.Zm.length; o++) {
      const l = this.Zm[o], a = l.Mp();
      t !== null && l.xp(t, i, s), s += a.height;
    }
    i += e.Mp().width, this.xb() && (h("right", i), i += v(e.wm()).Mp().width);
    const r = (o, l, a) => {
      v(o === "left" ? this.lb.zm() : this.lb.Lm()).xp(v(t), l, a);
    };
    if (this.cn.timeScale.visible) {
      const o = this.lb.Mp();
      if (t !== null) {
        let l = 0;
        this.Mb() && (r("left", l, s), l = v(e.bm()).Mp().width), this.lb.xp(t, l, s), l += o.width, this.xb() && r("right", l, s);
      }
      s += o.height;
    }
    return y({ width: i, height: s });
  }
  Tb() {
    let t = 0, i = 0, s = 0;
    for (const m of this.Zm) this.Mb() && (i = Math.max(i, v(m.bm()).ap(), this.cn.leftPriceScale.minimumWidth)), this.xb() && (s = Math.max(s, v(m.wm()).ap(), this.cn.rightPriceScale.minimumWidth)), t += m.g_();
    i = hi(i), s = hi(s);
    const e = this.o_, h = this.ro, r = Math.max(e - i - s, 0), o = this.cn.timeScale.visible;
    let l = o ? Math.max(this.lb.Fm(), this.cn.timeScale.minimumHeight) : 0;
    var a;
    l = (a = l) + a % 2;
    const c = 0 + l, u = h < c ? 0 : h - c, d = u / t;
    let f = 0;
    for (let m = 0; m < this.Zm.length; ++m) {
      const p = this.Zm[m];
      p.Up(this.$i.Uc()[m]);
      let b = 0, g = 0;
      g = m === this.Zm.length - 1 ? u - f : Math.round(p.g_() * d), b = Math.max(g, 2), f += b, p.up(y({ width: r, height: b })), this.Mb() && p.om(i, "left"), this.xb() && p.om(s, "right"), p.dp() && this.$i.Xc(p.dp(), b);
    }
    this.lb.Nm(y({ width: o ? r : 0, height: l }), o ? i : 0, o ? s : 0), this.$i.x_(r), this.Km !== i && (this.Km = i), this.Gm !== s && (this.Gm = s);
  }
  rb(t) {
    t ? this.Zd.addEventListener("wheel", this.sb, { passive: !1 }) : this.Zd.removeEventListener("wheel", this.sb);
  }
  Pb(t) {
    switch (t.deltaMode) {
      case t.DOM_DELTA_PAGE:
        return 120;
      case t.DOM_DELTA_LINE:
        return 32;
    }
    return Yn ? 1 / window.devicePixelRatio : 1;
  }
  eb(t) {
    if (!(t.deltaX !== 0 && this.cn.handleScroll.mouseWheel || t.deltaY !== 0 && this.cn.handleScale.mouseWheel)) return;
    const i = this.Pb(t), s = i * t.deltaX / 100, e = -i * t.deltaY / 100;
    if (t.cancelable && t.preventDefault(), e !== 0 && this.cn.handleScale.mouseWheel) {
      const h = Math.sign(e) * Math.min(1, Math.abs(e)), r = t.clientX - this.Zd.getBoundingClientRect().left;
      this.$t().Jc(r, h);
    }
    s !== 0 && this.cn.handleScroll.mouseWheel && this.$t().Qc(-80 * s);
  }
  pb(t, i) {
    var s;
    const e = t.jn();
    e === 3 && this.Rb(), e !== 3 && e !== 2 || (this.Db(t), this.Vb(t, i), this.lb.bt(), this.Zm.forEach((h) => {
      h.Zp();
    }), ((s = this.Jm) === null || s === void 0 ? void 0 : s.jn()) === 3 && (this.Jm.ts(t), this.Rb(), this.Db(this.Jm), this.Vb(this.Jm, i), t = this.Jm, this.Jm = null)), this.fp(t);
  }
  Vb(t, i) {
    for (const s of t.Qn()) this.ns(s, i);
  }
  Db(t) {
    const i = this.$i.Uc();
    for (let s = 0; s < i.length; s++) t.Hn(s).Wn && i[s].E_();
  }
  ns(t, i) {
    const s = this.$i.St();
    switch (t.qn) {
      case 0:
        s.rc();
        break;
      case 1:
        s.hc(t.Vt);
        break;
      case 2:
        s.Gn(t.Vt);
        break;
      case 3:
        s.Jn(t.Vt);
        break;
      case 4:
        s.Uu();
        break;
      case 5:
        t.Vt.Ju(i) || s.Jn(t.Vt.Qu(i));
    }
  }
  Dc(t) {
    this.Jm !== null ? this.Jm.ts(t) : this.Jm = t, this.Qm || (this.Qm = !0, this.Xm = window.requestAnimationFrame((i) => {
      if (this.Qm = !1, this.Xm = 0, this.Jm !== null) {
        const s = this.Jm;
        this.Jm = null, this.pb(s, i);
        for (const e of s.Qn()) if (e.qn === 5 && !e.Vt.Ju(i)) {
          this.$t().Zn(e.Vt);
          break;
        }
      }
    }));
  }
  Rb() {
    this._b();
  }
  _b() {
    const t = this.$i.Uc(), i = t.length, s = this.Zm.length;
    for (let e = i; e < s; e++) {
      const h = k(this.Zm.pop());
      this.nb.removeChild(h.hp()), h.hm().p(this), h.lm().p(this), h.S();
    }
    for (let e = s; e < i; e++) {
      const h = new gi(this, t[e]);
      h.hm().l(this.Ob.bind(this), this), h.lm().l(this.Bb.bind(this), this), this.Zm.push(h), this.nb.insertBefore(h.hp(), this.lb.hp());
    }
    for (let e = 0; e < i; e++) {
      const h = t[e], r = this.Zm[e];
      r.dp() !== h ? r.Up(h) : r.$p();
    }
    this.ub(), this.Tb();
  }
  Ab(t, i, s) {
    var e;
    const h = /* @__PURE__ */ new Map();
    t !== null && this.$i.wt().forEach((c) => {
      const u = c.In().hl(t);
      u !== null && h.set(c, u);
    });
    let r;
    if (t !== null) {
      const c = (e = this.$i.St().Ui(t)) === null || e === void 0 ? void 0 : e.originalTime;
      c !== void 0 && (r = c);
    }
    const o = this.$t().Fc(), l = o !== null && o.jc instanceof pi ? o.jc : void 0, a = o !== null && o.Av !== void 0 ? o.Av.wr : void 0;
    return { Ib: r, se: t ?? void 0, zb: i ?? void 0, Lb: l, Eb: h, Nb: a, Fb: s ?? void 0 };
  }
  Ob(t, i, s) {
    this.Dp.m(() => this.Ab(t, i, s));
  }
  Bb(t, i, s) {
    this.Vp.m(() => this.Ab(t, i, s));
  }
  hb(t, i, s) {
    this.Pc.m(() => this.Ab(t, i, s));
  }
  ub() {
    const t = this.cn.timeScale.visible ? "" : "none";
    this.lb.hp().style.display = t;
  }
  Mb() {
    return this.Zm[0].dp().P_().W().visible;
  }
  xb() {
    return this.Zm[0].dp().R_().W().visible;
  }
  ab() {
    return "ResizeObserver" in window && (this.tb = new ResizeObserver((t) => {
      const i = t.find((s) => s.target === this.Gd);
      i && this.ob(i.contentRect.width, i.contentRect.height);
    }), this.tb.observe(this.Gd, { box: "border-box" }), !0);
  }
  fb() {
    this.tb !== null && this.tb.disconnect(), this.tb = null;
  }
}
function ti(n) {
  return !!(n.handleScroll.mouseWheel || n.handleScale.mouseWheel);
}
function qn(n) {
  return function(t) {
    return t.open !== void 0;
  }(n) || function(t) {
    return t.value !== void 0;
  }(n);
}
function Ks(n, t) {
  var i = {};
  for (var s in n) Object.prototype.hasOwnProperty.call(n, s) && t.indexOf(s) < 0 && (i[s] = n[s]);
  if (n != null && typeof Object.getOwnPropertySymbols == "function") {
    var e = 0;
    for (s = Object.getOwnPropertySymbols(n); e < s.length; e++) t.indexOf(s[e]) < 0 && Object.prototype.propertyIsEnumerable.call(n, s[e]) && (i[s[e]] = n[s[e]]);
  }
  return i;
}
function as(n, t, i, s) {
  const e = i.value, h = { se: t, ot: n, Vt: [e, e, e, e], Ib: s };
  return i.color !== void 0 && (h.V = i.color), h;
}
function Qn(n, t, i, s) {
  const e = i.value, h = { se: t, ot: n, Vt: [e, e, e, e], Ib: s };
  return i.lineColor !== void 0 && (h.lt = i.lineColor), i.topColor !== void 0 && (h.Ts = i.topColor), i.bottomColor !== void 0 && (h.Ps = i.bottomColor), h;
}
function th(n, t, i, s) {
  const e = i.value, h = { se: t, ot: n, Vt: [e, e, e, e], Ib: s };
  return i.topLineColor !== void 0 && (h.Pe = i.topLineColor), i.bottomLineColor !== void 0 && (h.Re = i.bottomLineColor), i.topFillColor1 !== void 0 && (h.Se = i.topFillColor1), i.topFillColor2 !== void 0 && (h.ke = i.topFillColor2), i.bottomFillColor1 !== void 0 && (h.ye = i.bottomFillColor1), i.bottomFillColor2 !== void 0 && (h.Ce = i.bottomFillColor2), h;
}
function ih(n, t, i, s) {
  const e = { se: t, ot: n, Vt: [i.open, i.high, i.low, i.close], Ib: s };
  return i.color !== void 0 && (e.V = i.color), e;
}
function sh(n, t, i, s) {
  const e = { se: t, ot: n, Vt: [i.open, i.high, i.low, i.close], Ib: s };
  return i.color !== void 0 && (e.V = i.color), i.borderColor !== void 0 && (e.Ot = i.borderColor), i.wickColor !== void 0 && (e.Zh = i.wickColor), e;
}
function eh(n, t, i, s, e) {
  const h = k(e)(i), r = Math.max(...h), o = Math.min(...h), l = h[h.length - 1], a = [l, r, o, l], c = i, { time: u, color: d } = c;
  return { se: t, ot: n, Vt: a, Ib: s, He: Ks(c, ["time", "color"]), V: d };
}
function xt(n) {
  return n.Vt !== void 0;
}
function cs(n, t) {
  return t.customValues !== void 0 && (n.Wb = t.customValues), n;
}
function j(n) {
  return (t, i, s, e, h, r) => function(o, l) {
    return l ? l(o) : (a = o).open === void 0 && a.value === void 0;
    var a;
  }(s, r) ? cs({ ot: t, se: i, Ib: e }, s) : cs(n(t, i, s, e, h), s);
}
function us(n) {
  return { Candlestick: j(sh), Bar: j(ih), Area: j(Qn), Baseline: j(th), Histogram: j(as), Line: j(as), Custom: j(eh) }[n];
}
function ds(n) {
  return { se: 0, jb: /* @__PURE__ */ new Map(), ha: n };
}
function fs(n, t) {
  if (n !== void 0 && n.length !== 0) return { Hb: t.key(n[0].ot), $b: t.key(n[n.length - 1].ot) };
}
function ms(n) {
  let t;
  return n.forEach((i) => {
    t === void 0 && (t = i.Ib);
  }), k(t);
}
class nh {
  constructor(t) {
    this.Ub = /* @__PURE__ */ new Map(), this.qb = /* @__PURE__ */ new Map(), this.Yb = /* @__PURE__ */ new Map(), this.Zb = [], this.U_ = t;
  }
  S() {
    this.Ub.clear(), this.qb.clear(), this.Yb.clear(), this.Zb = [];
  }
  Xb(t, i) {
    let s = this.Ub.size !== 0, e = !1;
    const h = this.qb.get(t);
    if (h !== void 0) if (this.qb.size === 1) s = !1, e = !0, this.Ub.clear();
    else for (const l of this.Zb) l.pointData.jb.delete(t) && (e = !0);
    let r = [];
    if (i.length !== 0) {
      const l = i.map((f) => f.time), a = this.U_.createConverterToInternalObj(i), c = us(t.Jh()), u = t.ya(), d = t.Ca();
      r = i.map((f, m) => {
        const p = a(f.time), b = this.U_.key(p);
        let g = this.Ub.get(b);
        g === void 0 && (g = ds(p), this.Ub.set(b, g), e = !0);
        const w = c(p, g.se, f, l[m], u, d);
        return g.jb.set(t, w), w;
      });
    }
    s && this.Kb(), this.Gb(t, r);
    let o = -1;
    if (e) {
      const l = [];
      this.Ub.forEach((a) => {
        l.push({ timeWeight: 0, time: a.ha, pointData: a, originalTime: ms(a.jb) });
      }), l.sort((a, c) => this.U_.key(a.time) - this.U_.key(c.time)), o = this.Jb(l);
    }
    return this.Qb(t, o, function(l, a, c) {
      const u = fs(l, c), d = fs(a, c);
      if (u !== void 0 && d !== void 0) return { Ql: u.$b >= d.$b && u.Hb >= d.Hb };
    }(this.qb.get(t), h, this.U_));
  }
  fd(t) {
    return this.Xb(t, []);
  }
  tw(t, i) {
    const s = i;
    (function(p) {
      p.Ib === void 0 && (p.Ib = p.time);
    })(s), this.U_.preprocessData(i);
    const e = this.U_.createConverterToInternalObj([i])(i.time), h = this.Yb.get(t);
    if (h !== void 0 && this.U_.key(e) < this.U_.key(h)) throw new Error(`Cannot update oldest data, last time=${h}, new time=${e}`);
    let r = this.Ub.get(this.U_.key(e));
    const o = r === void 0;
    r === void 0 && (r = ds(e), this.Ub.set(this.U_.key(e), r));
    const l = us(t.Jh()), a = t.ya(), c = t.Ca(), u = l(e, r.se, i, s.Ib, a, c);
    r.jb.set(t, u), this.iw(t, u);
    const d = { Ql: xt(u) };
    if (!o) return this.Qb(t, -1, d);
    const f = { timeWeight: 0, time: r.ha, pointData: r, originalTime: ms(r.jb) }, m = ft(this.Zb, this.U_.key(f.time), (p, b) => this.U_.key(p.time) < b);
    this.Zb.splice(m, 0, f);
    for (let p = m; p < this.Zb.length; ++p) ii(this.Zb[p].pointData, p);
    return this.U_.fillWeightsForPoints(this.Zb, m), this.Qb(t, m, d);
  }
  iw(t, i) {
    let s = this.qb.get(t);
    s === void 0 && (s = [], this.qb.set(t, s));
    const e = s.length !== 0 ? s[s.length - 1] : null;
    e === null || this.U_.key(i.ot) > this.U_.key(e.ot) ? xt(i) && s.push(i) : xt(i) ? s[s.length - 1] = i : s.splice(-1, 1), this.Yb.set(t, i.ot);
  }
  Gb(t, i) {
    i.length !== 0 ? (this.qb.set(t, i.filter(xt)), this.Yb.set(t, i[i.length - 1].ot)) : (this.qb.delete(t), this.Yb.delete(t));
  }
  Kb() {
    for (const t of this.Zb) t.pointData.jb.size === 0 && this.Ub.delete(this.U_.key(t.time));
  }
  Jb(t) {
    let i = -1;
    for (let s = 0; s < this.Zb.length && s < t.length; ++s) {
      const e = this.Zb[s], h = t[s];
      if (this.U_.key(e.time) !== this.U_.key(h.time)) {
        i = s;
        break;
      }
      h.timeWeight = e.timeWeight, ii(h.pointData, s);
    }
    if (i === -1 && this.Zb.length !== t.length && (i = Math.min(this.Zb.length, t.length)), i === -1) return -1;
    for (let s = i; s < t.length; ++s) ii(t[s].pointData, s);
    return this.U_.fillWeightsForPoints(t, i), this.Zb = t, i;
  }
  nw() {
    if (this.qb.size === 0) return null;
    let t = 0;
    return this.qb.forEach((i) => {
      i.length !== 0 && (t = Math.max(t, i[i.length - 1].se));
    }), t;
  }
  Qb(t, i, s) {
    const e = { sw: /* @__PURE__ */ new Map(), St: { Lu: this.nw() } };
    if (i !== -1) this.qb.forEach((h, r) => {
      e.sw.set(r, { He: h, ew: r === t ? s : void 0 });
    }), this.qb.has(t) || e.sw.set(t, { He: [], ew: s }), e.St.rw = this.Zb, e.St.hw = i;
    else {
      const h = this.qb.get(t);
      e.sw.set(t, { He: h || [], ew: s });
    }
    return e;
  }
}
function ii(n, t) {
  n.se = t, n.jb.forEach((i) => {
    i.se = t;
  });
}
function Si(n) {
  const t = { value: n.Vt[3], time: n.Ib };
  return n.Wb !== void 0 && (t.customValues = n.Wb), t;
}
function ps(n) {
  const t = Si(n);
  return n.V !== void 0 && (t.color = n.V), t;
}
function hh(n) {
  const t = Si(n);
  return n.lt !== void 0 && (t.lineColor = n.lt), n.Ts !== void 0 && (t.topColor = n.Ts), n.Ps !== void 0 && (t.bottomColor = n.Ps), t;
}
function rh(n) {
  const t = Si(n);
  return n.Pe !== void 0 && (t.topLineColor = n.Pe), n.Re !== void 0 && (t.bottomLineColor = n.Re), n.Se !== void 0 && (t.topFillColor1 = n.Se), n.ke !== void 0 && (t.topFillColor2 = n.ke), n.ye !== void 0 && (t.bottomFillColor1 = n.ye), n.Ce !== void 0 && (t.bottomFillColor2 = n.Ce), t;
}
function Us(n) {
  const t = { open: n.Vt[0], high: n.Vt[1], low: n.Vt[2], close: n.Vt[3], time: n.Ib };
  return n.Wb !== void 0 && (t.customValues = n.Wb), t;
}
function oh(n) {
  const t = Us(n);
  return n.V !== void 0 && (t.color = n.V), t;
}
function lh(n) {
  const t = Us(n), { V: i, Ot: s, Zh: e } = n;
  return i !== void 0 && (t.color = i), s !== void 0 && (t.borderColor = s), e !== void 0 && (t.wickColor = e), t;
}
function li(n) {
  return { Area: hh, Line: ps, Baseline: rh, Histogram: ps, Bar: oh, Candlestick: lh, Custom: ah }[n];
}
function ah(n) {
  const t = n.Ib;
  return Object.assign(Object.assign({}, n.He), { time: t });
}
const ch = { vertLine: { color: "#9598A1", width: 1, style: 3, visible: !0, labelVisible: !0, labelBackgroundColor: "#131722" }, horzLine: { color: "#9598A1", width: 1, style: 3, visible: !0, labelVisible: !0, labelBackgroundColor: "#131722" }, mode: 1 }, uh = { vertLines: { color: "#D6DCDE", style: 0, visible: !0 }, horzLines: { color: "#D6DCDE", style: 0, visible: !0 } }, dh = { background: { type: "solid", color: "#FFFFFF" }, textColor: "#191919", fontSize: 12, fontFamily: ai, attributionLogo: !0 }, si = { autoScale: !0, mode: 0, invertScale: !1, alignLabels: !0, borderVisible: !0, borderColor: "#2B2B43", entireTextOnly: !1, visible: !1, ticksVisible: !1, scaleMargins: { bottom: 0.1, top: 0.2 }, minimumWidth: 0 }, fh = { rightOffset: 0, barSpacing: 6, minBarSpacing: 0.5, fixLeftEdge: !1, fixRightEdge: !1, lockVisibleTimeRangeOnResize: !1, rightBarStaysOnScroll: !1, borderVisible: !0, borderColor: "#2B2B43", visible: !0, timeVisible: !1, secondsVisible: !0, shiftVisibleRangeOnNewBar: !0, allowShiftVisibleRangeOnWhitespaceReplacement: !1, ticksVisible: !1, uniformDistribution: !1, minimumHeight: 0, allowBoldLabels: !0 }, mh = { color: "rgba(0, 0, 0, 0)", visible: !1, fontSize: 48, fontFamily: ai, fontStyle: "", text: "", horzAlign: "center", vertAlign: "center" };
function vs() {
  return { width: 0, height: 0, autoSize: !1, layout: dh, crosshair: ch, grid: uh, overlayPriceScales: Object.assign({}, si), leftPriceScale: Object.assign(Object.assign({}, si), { visible: !1 }), rightPriceScale: Object.assign(Object.assign({}, si), { visible: !0 }), timeScale: fh, watermark: mh, localization: { locale: tt ? navigator.language : "", dateFormat: "dd MMM 'yy" }, handleScroll: { mouseWheel: !0, pressedMouseMove: !0, horzTouchDrag: !0, vertTouchDrag: !0 }, handleScale: { axisPressedMouseMove: { time: !0, price: !0 }, axisDoubleClickReset: { time: !0, price: !0 }, mouseWheel: !0, pinch: !0 }, kineticScroll: { mouse: !1, touch: !0 }, trackingMode: { exitMode: 1 } };
}
class ph {
  constructor(t, i) {
    this.lw = t, this.aw = i;
  }
  applyOptions(t) {
    this.lw.$t().Hc(this.aw, t);
  }
  options() {
    return this.Li().W();
  }
  width() {
    return Tt(this.aw) ? this.lw.gb(this.aw) : 0;
  }
  Li() {
    return v(this.lw.$t().$c(this.aw)).Dt;
  }
}
function bs(n, t, i) {
  const s = Ks(n, ["time", "originalTime"]), e = Object.assign({ time: t }, s);
  return i !== void 0 && (e.originalTime = i), e;
}
const vh = { color: "#FF0000", price: 0, lineStyle: 2, lineWidth: 1, lineVisible: !0, axisLabelVisible: !0, title: "", axisLabelColor: "", axisLabelTextColor: "" };
class bh {
  constructor(t) {
    this.Eh = t;
  }
  applyOptions(t) {
    this.Eh.Hh(t);
  }
  options() {
    return this.Eh.W();
  }
  ow() {
    return this.Eh;
  }
}
class gh {
  constructor(t, i, s, e, h) {
    this._w = new _(), this.Ls = t, this.uw = i, this.cw = s, this.U_ = h, this.dw = e;
  }
  S() {
    this._w.S();
  }
  priceFormatter() {
    return this.Ls.ma();
  }
  priceToCoordinate(t) {
    const i = this.Ls.Ct();
    return i === null ? null : this.Ls.Dt().Rt(t, i.Vt);
  }
  coordinateToPrice(t) {
    const i = this.Ls.Ct();
    return i === null ? null : this.Ls.Dt().pn(t, i.Vt);
  }
  barsInLogicalRange(t) {
    if (t === null) return null;
    const i = new q(new rt(t.from, t.to)).hu(), s = this.Ls.In();
    if (s.Ni()) return null;
    const e = s.hl(i.Vs(), 1), h = s.hl(i.ui(), -1), r = v(s.sl()), o = v(s.An());
    if (e !== null && h !== null && e.se > h.se) return { barsBefore: t.from - r, barsAfter: o - t.to };
    const l = { barsBefore: e === null || e.se === r ? t.from - r : e.se - r, barsAfter: h === null || h.se === o ? o - t.to : o - h.se };
    return e !== null && h !== null && (l.from = e.Ib, l.to = h.Ib), l;
  }
  setData(t) {
    this.U_, this.Ls.Jh(), this.uw.fw(this.Ls, t), this.pw("full");
  }
  update(t) {
    this.Ls.Jh(), this.uw.mw(this.Ls, t), this.pw("update");
  }
  dataByIndex(t, i) {
    const s = this.Ls.In().hl(t, i);
    return s === null ? null : li(this.seriesType())(s);
  }
  data() {
    const t = li(this.seriesType());
    return this.Ls.In().ie().map((i) => t(i));
  }
  subscribeDataChanged(t) {
    this._w.l(t);
  }
  unsubscribeDataChanged(t) {
    this._w.v(t);
  }
  setMarkers(t) {
    this.U_;
    const i = t.map((s) => bs(s, this.U_.convertHorzItemToInternal(s.time), s.time));
    this.Ls.ia(i);
  }
  markers() {
    return this.Ls.na().map((t) => bs(t, t.originalTime, void 0));
  }
  applyOptions(t) {
    this.Ls.Hh(t);
  }
  options() {
    return D(this.Ls.W());
  }
  priceScale() {
    return this.cw.priceScale(this.Ls.Dt().Ta());
  }
  createPriceLine(t) {
    const i = W(D(vh), t), s = this.Ls.sa(i);
    return new bh(s);
  }
  removePriceLine(t) {
    this.Ls.ea(t.ow());
  }
  seriesType() {
    return this.Ls.Jh();
  }
  attachPrimitive(t) {
    this.Ls.Sa(t), t.attached && t.attached({ chart: this.dw, series: this, requestUpdate: () => this.Ls.$t().Xl() });
  }
  detachPrimitive(t) {
    this.Ls.ka(t), t.detached && t.detached();
  }
  pw(t) {
    this._w.M() && this._w.m(t);
  }
}
class wh {
  constructor(t, i, s) {
    this.bw = new _(), this.pu = new _(), this.Vm = new _(), this.$i = t, this.kl = t.St(), this.lb = i, this.kl.tc().l(this.ww.bind(this)), this.kl.nc().l(this.gw.bind(this)), this.lb.Em().l(this.Mw.bind(this)), this.U_ = s;
  }
  S() {
    this.kl.tc().p(this), this.kl.nc().p(this), this.lb.Em().p(this), this.bw.S(), this.pu.S(), this.Vm.S();
  }
  scrollPosition() {
    return this.kl.ju();
  }
  scrollToPosition(t, i) {
    i ? this.kl.Gu(t, 1e3) : this.$i.Jn(t);
  }
  scrollToRealTime() {
    this.kl.Ku();
  }
  getVisibleRange() {
    const t = this.kl.Du();
    return t === null ? null : { from: t.from.originalTime, to: t.to.originalTime };
  }
  setVisibleRange(t) {
    const i = { from: this.U_.convertHorzItemToInternal(t.from), to: this.U_.convertHorzItemToInternal(t.to) }, s = this.kl.Au(i);
    this.$i.vd(s);
  }
  getVisibleLogicalRange() {
    const t = this.kl.Ru();
    return t === null ? null : { from: t.Vs(), to: t.ui() };
  }
  setVisibleLogicalRange(t) {
    I(t.from <= t.to, "The from index cannot be after the to index."), this.$i.vd(t);
  }
  resetTimeScale() {
    this.$i.Kn();
  }
  fitContent() {
    this.$i.rc();
  }
  logicalToCoordinate(t) {
    const i = this.$i.St();
    return i.Ni() ? null : i.It(t);
  }
  coordinateToLogical(t) {
    return this.kl.Ni() ? null : this.kl.Eu(t);
  }
  timeToCoordinate(t) {
    const i = this.U_.convertHorzItemToInternal(t), s = this.kl.Da(i, !1);
    return s === null ? null : this.kl.It(s);
  }
  coordinateToTime(t) {
    const i = this.$i.St(), s = i.Eu(t), e = i.Ui(s);
    return e === null ? null : e.originalTime;
  }
  width() {
    return this.lb._m().width;
  }
  height() {
    return this.lb._m().height;
  }
  subscribeVisibleTimeRangeChange(t) {
    this.bw.l(t);
  }
  unsubscribeVisibleTimeRangeChange(t) {
    this.bw.v(t);
  }
  subscribeVisibleLogicalRangeChange(t) {
    this.pu.l(t);
  }
  unsubscribeVisibleLogicalRangeChange(t) {
    this.pu.v(t);
  }
  subscribeSizeChange(t) {
    this.Vm.l(t);
  }
  unsubscribeSizeChange(t) {
    this.Vm.v(t);
  }
  applyOptions(t) {
    this.kl.Hh(t);
  }
  options() {
    return Object.assign(Object.assign({}, D(this.kl.W())), { barSpacing: this.kl.he() });
  }
  ww() {
    this.bw.M() && this.bw.m(this.getVisibleRange());
  }
  gw() {
    this.pu.M() && this.pu.m(this.getVisibleLogicalRange());
  }
  Mw(t) {
    this.Vm.m(t.width, t.height);
  }
}
function Sh(n) {
  if (n === void 0 || n.type === "custom") return;
  const t = n;
  t.minMove !== void 0 && t.precision === void 0 && (t.precision = function(i) {
    if (i >= 1) return 0;
    let s = 0;
    for (; s < 8; s++) {
      const e = Math.round(i);
      if (Math.abs(e - i) < 1e-8) return s;
      i *= 10;
    }
    return s;
  }(t.minMove));
}
function gs(n) {
  return function(t) {
    if (pt(t.handleScale)) {
      const s = t.handleScale;
      t.handleScale = { axisDoubleClickReset: { time: s, price: s }, axisPressedMouseMove: { time: s, price: s }, mouseWheel: s, pinch: s };
    } else if (t.handleScale !== void 0) {
      const { axisPressedMouseMove: s, axisDoubleClickReset: e } = t.handleScale;
      pt(s) && (t.handleScale.axisPressedMouseMove = { time: s, price: s }), pt(e) && (t.handleScale.axisDoubleClickReset = { time: e, price: e });
    }
    const i = t.handleScroll;
    pt(i) && (t.handleScroll = { horzTouchDrag: i, vertTouchDrag: i, mouseWheel: i, pressedMouseMove: i });
  }(n), n;
}
class yh {
  constructor(t, i, s) {
    this.xw = /* @__PURE__ */ new Map(), this.Sw = /* @__PURE__ */ new Map(), this.kw = new _(), this.yw = new _(), this.Cw = new _(), this.Tw = new nh(i);
    const e = s === void 0 ? D(vs()) : W(D(vs()), gs(s));
    this.U_ = i, this.lw = new Gn(t, e, i), this.lw.hm().l((r) => {
      this.kw.M() && this.kw.m(this.Pw(r()));
    }, this), this.lw.lm().l((r) => {
      this.yw.M() && this.yw.m(this.Pw(r()));
    }, this), this.lw.Zc().l((r) => {
      this.Cw.M() && this.Cw.m(this.Pw(r()));
    }, this);
    const h = this.lw.$t();
    this.Rw = new wh(h, this.lw.cb(), this.U_);
  }
  remove() {
    this.lw.hm().p(this), this.lw.lm().p(this), this.lw.Zc().p(this), this.Rw.S(), this.lw.S(), this.xw.clear(), this.Sw.clear(), this.kw.S(), this.yw.S(), this.Cw.S(), this.Tw.S();
  }
  resize(t, i, s) {
    this.autoSizeActive() || this.lw.ob(t, i, s);
  }
  addCustomSeries(t, i) {
    const s = Z(t), e = Object.assign(Object.assign({}, Ss), s.defaultOptions());
    return this.Dw("Custom", e, i, s);
  }
  addAreaSeries(t) {
    return this.Dw("Area", ee, t);
  }
  addBaselineSeries(t) {
    return this.Dw("Baseline", ne, t);
  }
  addBarSeries(t) {
    return this.Dw("Bar", ie, t);
  }
  addCandlestickSeries(t = {}) {
    return function(i) {
      i.borderColor !== void 0 && (i.borderUpColor = i.borderColor, i.borderDownColor = i.borderColor), i.wickColor !== void 0 && (i.wickUpColor = i.wickColor, i.wickDownColor = i.wickColor);
    }(t), this.Dw("Candlestick", te, t);
  }
  addHistogramSeries(t) {
    return this.Dw("Histogram", he, t);
  }
  addLineSeries(t) {
    return this.Dw("Line", se, t);
  }
  removeSeries(t) {
    const i = k(this.xw.get(t)), s = this.Tw.fd(i);
    this.lw.$t().fd(i), this.Vw(s), this.xw.delete(t), this.Sw.delete(i);
  }
  fw(t, i) {
    this.Vw(this.Tw.Xb(t, i));
  }
  mw(t, i) {
    this.Vw(this.Tw.tw(t, i));
  }
  subscribeClick(t) {
    this.kw.l(t);
  }
  unsubscribeClick(t) {
    this.kw.v(t);
  }
  subscribeCrosshairMove(t) {
    this.Cw.l(t);
  }
  unsubscribeCrosshairMove(t) {
    this.Cw.v(t);
  }
  subscribeDblClick(t) {
    this.yw.l(t);
  }
  unsubscribeDblClick(t) {
    this.yw.v(t);
  }
  priceScale(t) {
    return new ph(this.lw, t);
  }
  timeScale() {
    return this.Rw;
  }
  applyOptions(t) {
    this.lw.Hh(gs(t));
  }
  options() {
    return this.lw.W();
  }
  takeScreenshot() {
    return this.lw.bb();
  }
  autoSizeActive() {
    return this.lw.Sb();
  }
  chartElement() {
    return this.lw.kb();
  }
  paneSize() {
    const t = this.lw.Cb();
    return { height: t.height, width: t.width };
  }
  setCrosshairPosition(t, i, s) {
    const e = this.xw.get(s);
    if (e === void 0) return;
    const h = this.lw.$t().cr(e);
    h !== null && this.lw.$t().ld(t, i, h);
  }
  clearCrosshairPosition() {
    this.lw.$t().ad(!0);
  }
  Dw(t, i, s = {}, e) {
    Sh(s.priceFormat);
    const h = W(D(ys), D(i), s), r = this.lw.$t().ud(t, h, e), o = new gh(r, this, this, this, this.U_);
    return this.xw.set(o, r), this.Sw.set(r, o), o;
  }
  Vw(t) {
    const i = this.lw.$t();
    i.od(t.St.Lu, t.St.rw, t.St.hw), t.sw.forEach((s, e) => e.J(s.He, s.ew)), i.Fu();
  }
  Ow(t) {
    return k(this.Sw.get(t));
  }
  Pw(t) {
    const i = /* @__PURE__ */ new Map();
    t.Eb.forEach((e, h) => {
      const r = h.Jh(), o = li(r)(e);
      if (r !== "Custom") I(qn(o));
      else {
        const l = h.Ca();
        I(!l || l(o) === !1);
      }
      i.set(this.Ow(h), o);
    });
    const s = t.Lb !== void 0 && this.Sw.has(t.Lb) ? this.Ow(t.Lb) : void 0;
    return { time: t.Ib, logical: t.se, point: t.zb, hoveredSeries: s, hoveredObjectId: t.Nb, seriesData: i, sourceEvent: t.Fb };
  }
}
function Mh(n, t, i) {
  let s;
  if (dt(n)) {
    const h = document.getElementById(n);
    I(h !== null, `Cannot find element in DOM with id=${n}`), s = h;
  } else s = n;
  const e = new yh(s, t, i);
  return t.setOptions(e.options()), e;
}
function ws(n, t) {
  return Mh(n, new es(), es.Ad(t));
}
Object.assign(Object.assign({}, ys), Ss);
function _h() {
  const n = document.getElementById("container"), t = document.createElement("h4");
  t.textContent = "BTC-USD", t.style.color = "gray", t.style.textAlign = "center", t.style.margin = "0", n.appendChild(t);
  const i = document.createElement("div");
  i.id = "chartTop", i.style.display = "flex", i.style.flexDirection = "column", i.style.justifyContent = "center", i.style.alignItems = "center", i.style.height = "30rem", n.appendChild(i);
  const s = document.createElement("h4");
  s.textContent = "PLRR indicator", s.style.color = "gray", s.style.textAlign = "center", s.style.margin = "0", n.appendChild(s);
  const e = document.createElement("div");
  e.id = "chartBottom", e.style.display = "flex", e.style.flexDirection = "column", e.style.justifyContent = "center", e.style.alignItems = "center", e.style.height = "14rem", e.style.borderRight = "32px solid #222", n.appendChild(e);
  const h = ws(
    i,
    {
      autoSize: !0,
      layout: {
        background: { color: "#222" },
        textColor: "#C3BCDB"
      },
      grid: {
        vertLines: { color: "#444" },
        horzLines: { color: "#444" }
      }
    }
  ), r = ws(
    e,
    {
      autoSize: !0,
      layout: {
        background: { color: "#222" },
        textColor: "#C3BCDB"
      },
      grid: {
        vertLines: { color: "#444" },
        horzLines: { color: "#444" }
      }
    }
  );
  return [h, r];
}
function kh(n, t) {
  const [i, s] = _h(), { candleStickData: e, lineData: h, q2p5LineData: r, q50LineData: o, q97p5LineData: l, dummyData: a } = xh(n, t);
  Lh(i, s, o, r, l, a), zh(i, e), Ch(s, h);
  const c = /* @__PURE__ */ new Date(), u = new Date(c);
  u.setFullYear(u.getFullYear() - 4), i.timeScale().setVisibleRange({
    from: u.getTime() / 1e3,
    to: c.getTime() / 1e3
  }), s.timeScale().setVisibleRange({
    from: u.getTime() / 1e3,
    to: c.getTime() / 1e3
  }), i.timeScale().subscribeVisibleTimeRangeChange(() => {
    const d = i.timeScale().getVisibleLogicalRange();
    d && s.timeScale().setVisibleLogicalRange(d);
  }), s.timeScale().subscribeVisibleTimeRangeChange(() => {
    const d = s.timeScale().getVisibleLogicalRange();
    d && i.timeScale().setVisibleLogicalRange(d);
  });
}
function xh(n, t) {
  const i = (a, c, u) => {
    const d = (a - c) / (u - c);
    return d >= 0.5 ? `rgb(220,${Math.floor(200 * ((1 - d) / 0.5))}, ${Math.floor(200 * ((1 - d) / 0.5))})` : `rgb(${Math.floor(200 * (d / 0.5))}, ${Math.floor(200 * (d / 0.5))}, 220)`;
  }, s = n.map((a) => {
    const c = i(a.value, -3, 3);
    return a.time = new Date(a.time).toISOString().split("T")[0], { ...a, color: c, wickColor: c, borderColor: c };
  }), e = n.map((a) => {
    const c = i(a.value, -3, 3);
    return a.time = new Date(a.time).toISOString().split("T")[0], { ...a, color: c };
  }), h = t.map((a) => ({
    time: new Date(a.time).toISOString().split("T")[0],
    value: a.priceMedian
  })), r = t.map((a) => ({
    time: new Date(a.time).toISOString().split("T")[0],
    value: a.price2p5
  })), o = t.map((a) => ({
    time: new Date(a.time).toISOString().split("T")[0],
    value: a.price97p5
  })), l = t.map((a) => ({
    time: new Date(a.time).toISOString().split("T")[0],
    value: 0
  }));
  return { candleStickData: s, lineData: e, q2p5LineData: r, q50LineData: h, q97p5LineData: o, dummyData: l };
}
function zh(n, t) {
  const i = n.addLineSeries({
    lineWidth: 4
  }), s = t.map((e) => ({
    time: e.time,
    value: e.close,
    color: e.color
  }));
  return i.setData(s), i.priceScale().applyOptions({
    mode: G.Logarithmic
    // disables auto scaling based on visible content
  }), i;
}
function Ch(n, t) {
  const i = n.addLineSeries({
    autoscaleInfoProvider: () => ({
      priceRange: {
        minValue: -3.2,
        maxValue: 3.2
      }
    })
  });
  return i.setData(t), i.priceScale().applyOptions({
    autoScale: !1,
    // disables auto scaling based on visible content
    scaleMargins: {
      top: 0,
      bottom: 0
    }
  }), i;
}
function Lh(n, t, i, s, e, h) {
  const r = n.addLineSeries({
    color: "gray",
    // You can customize the color as needed
    lineWidth: 2.5,
    priceLineVisible: !1
  });
  r.setData(i), r.priceScale().applyOptions({
    mode: G.Logarithmic
  });
  const o = n.addLineSeries({
    color: "green",
    // You can customize the color as needed
    lineWidth: 2.5,
    priceLineVisible: !1
  });
  o.setData(s), o.priceScale().applyOptions({
    mode: G.Logarithmic
  });
  const l = n.addLineSeries({
    color: "orange",
    // You can customize the color as needed
    lineWidth: 2.5,
    priceLineVisible: !1
  });
  l.setData(e), l.priceScale().applyOptions({
    mode: G.Logarithmic
  });
  const a = t.addAreaSeries({
    lastValueVisible: !1,
    // hide the last value marker for this series
    crosshairMarkerVisible: !1,
    // hide the crosshair marker for this series
    lineColor: "transparent",
    // hide the line
    topColor: "rgba(56, 33, 110,0)",
    bottomColor: "rgba(56, 33, 110, 0)"
  });
  return a.setData(h), { q50LineSeries: r, q2p5LineSeries: o, q97p5LineSeries: l, dummyDataSeries: a };
}
export {
  kh as initializeCharts
};
