var _, barChart, donutChart, forceChart, lineChart, childrenPercent, forceChildren, listForce, hourDonut, minDonut, secDonut, firstTick, interData, colorFunc, firstBar, lineChartData, columns, ratio, drawRatio, endAll, i, tick, clock;
_ = require("prelude-ls");
barChart = function(){
  var chrt, gradientData, build, i$;
  chrt = {};
  chrt.container = null;
  chrt.data = null;
  chrt.margin = {
    top: 10,
    left: 80,
    right: 50,
    bottom: 20
  };
  chrt.w = 500 - chrt.margin.left - chrt.margin.right;
  chrt.h = null;
  chrt.barHeight = 25;
  chrt.barMargin = 5;
  chrt.duration = 2000;
  chrt.delay = 200;
  gradientData = [
    {
      "offset": "0%",
      "color": "rgb(215, 235, 97)"
    }, {
      "offset": "100%",
      "color": "rgb(80, 180, 115)"
    }
  ];
  chrt.barStyle = null;
  chrt.textFunc = function(it){
    if (it === 0) {
      return "";
    } else {
      return it.toFixed(0);
    }
  };
  chrt.svg = null;
  build = function(){
    if (chrt.data === null || chrt.container === null) {
      return;
    }
    chrt.h = chrt.data.length * chrt.barHeight + (chrt.data.length - 1) * chrt.barMargin;
    return chrt.svg = d3.select(chrt.container).insert("svg", "span").attr({
      "viewBox": "0 0 " + (chrt.w + chrt.margin.left + chrt.margin.right) + " " + (chrt.h + chrt.margin.top + chrt.margin.bottom),
      "width": "100%",
      "height": "100%",
      "preserveAspectRatio": "xMinYMin meet"
    }).append("g").attr({
      "transform": "translate(" + chrt.margin.left + "," + chrt.margin.top + ")"
    });
  };
  build.draw = function(){
    var scaleX, scaleY, bars;
    scaleX = d3.scale.linear().domain([
      0, d3.max(chrt.data, function(it){
        return it.value;
      })
    ]).range([0, chrt.w]);
    scaleY = function(i){
      return i * (chrt.barHeight + chrt.barMargin);
    };
    chrt.svg.append("linearGradient").attr({
      "id": "themeGradient",
      "gradientUnits": "userSpaceOnUse",
      "x1": 0,
      "x2": chrt.w,
      "y1": 0,
      "y2": 0
    }).selectAll("stop").data(gradientData).enter().append("stop").attr({
      "offset": function(it){
        return it.offset;
      },
      "stop-color": function(it){
        return it.color;
      }
    });
    bars = chrt.svg.selectAll(".bars").data(chrt.data);
    bars.enter().append("rect").attr({
      "width": 0,
      "class": "bars"
    });
    bars.transition().duration(chrt.duration).delay(function(it, i){
      return i * chrt.delay;
    }).attr({
      "width": function(it){
        return scaleX(
        it.value);
      },
      "height": function(){
        return chrt.barHeight;
      },
      "x": 0,
      "y": function(it, i){
        return scaleY(i);
      }
    });
    if (chrt.barStyle !== null) {
      bars.call(chrt.barStyle);
    }
    chrt.svg.selectAll(".name").data(chrt.data).enter().append("text").attr({
      "x": -30,
      "y": function(it, i){
        return scaleY(i) + chrt.barHeight / 2 + 7;
      },
      "class": "name"
    }).style({
      "text-anchor": "end"
    }).text(function(it){
      return it.key;
    });
    return chrt.svg.selectAll(".number").data(chrt.data).enter().append("text").attr({
      "x": 5,
      "y": function(it, i){
        return scaleY(i) + chrt.barHeight / 2 + 7;
      },
      "class": "number"
    }).style({
      "text-anchor": "start"
    }).transition().duration(chrt.duration).delay(function(it, i){
      return i * chrt.delay;
    }).attr({
      "x": function(it){
        return scaleX(
        it.value) + 5;
      }
    }).tween("text", function(it){
      var i;
      i = d3.interpolate(this.textContent, it.value);
      return function(n){
        return this.textContent = chrt.textFunc(
        i(
        n));
      };
    });
  };
  for (i$ in chrt) {
    (fn$.call(this, i$));
  }
  return build;
  function fn$(it){
    build[it] = function(v){
      if (arguments.length === 0) {
        return chrt[it];
      } else {
        chrt[it] = v;
        return build;
      }
    };
  }
};
donutChart = function(){
  var chrt, svg, tau, foreground, number, scale, arcTween, textTween, arc, build, i$;
  chrt = {};
  chrt.container = null;
  chrt.data = null;
  chrt.margin = {
    top: 0,
    left: 0,
    right: 0,
    bottom: 0
  };
  chrt.w = 500 - chrt.margin.left - chrt.margin.right;
  chrt.h = 500 - chrt.margin.top - chrt.margin.bottom;
  chrt.outerRadius = chrt.h / 2;
  chrt.innerRadius = chrt.outerRadius - 20;
  chrt.cornerRadius = 10;
  chrt.startAngle = 0;
  chrt.duration = 1500;
  chrt.notes = "";
  chrt.textFunc = function(it){
    return it;
  };
  chrt.ease = "linear";
  chrt.svg = null;
  chrt.textStyle = function(){};
  chrt.fontSize = 72;
  svg = null;
  tau = 2 * Math.PI;
  foreground = undefined;
  number = undefined;
  scale = undefined;
  arcTween = undefined;
  textTween = undefined;
  arc = undefined;
  chrt.backgroundStyle = function(it){
    return it.style({
      "fill": "rgb(232, 233, 121)"
    });
  };
  chrt.foregroundStyle = function(it){
    return it.style({
      "fill": "rgb(84, 179, 108)"
    });
  };
  build = function(){
    if (chrt.data === null || chrt.container === null) {
      return;
    }
    if (chrt.svg === null) {
      chrt.svg = d3.select(chrt.container).insert("svg", ".notes").attr({
        "viewBox": "0 0 " + (chrt.w + chrt.margin.left + chrt.margin.right) + " " + (chrt.h + chrt.margin.top + chrt.margin.bottom),
        "width": "100%",
        "height": "100%",
        "preserveAspectRatio": "xMinYMin meet"
      }).append("g").attr({
        "transform": "translate(" + (chrt.w / 2 + chrt.margin.left) + "," + (chrt.h / 2 + chrt.margin.top) + ")"
      }).append("g");
      scale = d3.scale.linear().domain([0, chrt.data.total]).range([0, tau]);
      arc = d3.svg.arc().innerRadius(chrt.innerRadius).outerRadius(chrt.outerRadius).cornerRadius(chrt.cornerRadius).startAngle(chrt.startAngle);
      arcTween = function(transition, newAngle){
        return transition.attrTween("d", function(it){
          var interpolate;
          interpolate = d3.interpolate(it.endAngle, newAngle);
          return function(t){
            it.endAngle = interpolate(t);
            return arc(it);
          };
        });
      };
      textTween = function(transition, newValue){
        return transition.tween("text", function(){
          var interpolate;
          interpolate = d3.interpolate(parseFloat(
          this.textContent), newValue);
          return function(t){
            return this.textContent = function(it){
              if (chrt.textFunc) {
                return chrt.textFunc(
                it);
              } else {
                return it;
              }
            }(
            interpolate(
            t));
          };
        });
      };
      return build;
    }
  };
  build.draw = function(){
    chrt.svg.append("path").datum({
      endAngle: tau
    }).attr({
      "d": arc
    }).call(chrt.backgroundStyle);
    chrt.svg.append("text").style({
      "text-anchor": "middle",
      "font-size": "25px"
    }).attr({
      "transform": "translate(0," + -(chrt.h / 2 + 30) + ")"
    }).text(chrt.data.notes);
    foreground = chrt.svg.append("path").datum({
      endAngle: 0.01
    }).attr({
      "d": arc
    }).call(chrt.foregroundStyle);
    console.log(
    chrt.fontSize);
    number = chrt.svg.append("text").text(function(){
      if (chrt.textFunc) {
        return chrt.textFunc(0);
      } else {
        return 0;
      }
    }).attr({
      "class": "numbers",
      "font-size": chrt.fontSize + "px",
      "text-anchor": "middle"
    }).style({
      "dominant-baseline": "central"
    }).call(chrt.textStyle);
    this.update();
    return build;
  };
  build.update = function(data){
    if (data === undefined) {
      data = chrt.data;
    }
    foreground.transition().duration(chrt.duration).ease(chrt.ease).call(arcTween, scale(
    data.value));
    number.transition().duration(chrt.duration).ease(chrt.ease).call(textTween, data.value);
    return build;
  };
  for (i$ in chrt) {
    (fn$.call(this, i$));
  }
  return build;
  function fn$(it){
    build[it] = function(v){
      if (arguments.length === 0) {
        return chrt[it];
      } else {
        chrt[it] = v;
        return build;
      }
    };
  }
};
forceChart = function(){
  var chrt, updateModel, build, buildOrder, buildGrid, groupData, ifNaN, buildGridOrder, addPosition, i$;
  chrt = {};
  chrt.container = null;
  chrt.data = null;
  chrt.margin = {
    top: 0,
    left: 0,
    right: 0,
    bottom: 0
  };
  chrt.w = 800 - chrt.margin.left - chrt.margin.right;
  chrt.h = 400 - chrt.margin.top - chrt.margin.bottom;
  chrt.svg = null;
  chrt.dtsr = 10;
  chrt.selector = 'cdots';
  chrt.grpLength = null;
  chrt.grpColLength = null;
  chrt.grpEntry = null;
  chrt.labelYOffset = 30;
  chrt.isCollide = true;
  chrt.isGooeye = false;
  updateModel = undefined;
  build = function(){
    var svgContainer, defs, g;
    if (chrt.data === null || chrt.container === null) {
      return;
    }
    if (chrt.svg === null) {
      svgContainer = d3.select(chrt.container).append("svg").attr({
        "viewBox": "0 0 " + (chrt.w + chrt.margin.left + chrt.margin.right) + " " + (chrt.h + chrt.margin.top + chrt.margin.bottom),
        "width": "100%",
        "height": "100%",
        "preserveAspectRatio": "xMinYMin meet"
      });
      defs = svgContainer.append("defs").append("filter").attr({
        "id": "gooeying"
      });
      defs.append("feGaussianBlur").attr({
        "in": "SourceGraphic",
        "stdDeviation": "5",
        "result": "blur"
      });
      defs.append("feColorMatrix").attr({
        "in": "blur",
        "mode": "matrix",
        "values": "1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7",
        "result": "gooeying"
      });
      defs.append("feComposite").attr({
        "in": "SourceGraphic",
        "in2": "gooeying",
        "operator": "atop"
      });
      g = svgContainer.append("g").attr({
        "transform": "translate(" + chrt.margin.left + "," + chrt.margin.top + ")"
      });
      chrt.svg = g.append("g");
      if (chrt.isGooeye) {
        return chrt.svg.style({
          "filter": 'url(#gooeying)'
        });
      }
    }
  };
  buildOrder = function(data){
    var list;
    if (data.length === 0) {
      return console.log("not data to build order");
    } else {
      list = _.map(function(it){
        return it.key;
      })(
      _.sortBy(function(it){
        return it.value * -1;
      })(
      data));
      return function(key){
        return list.indexOf(
        key + "");
      };
    }
  };
  buildGrid = function(w, h, dataLength, xLength){
    var getHeight, xDomain, res$, i$, to$, ridx$, yDomain, padding, xScale, yScale, grid;
    if (!xLength) {
      xLength = 5;
    }
    getHeight = function(i){
      return Math.floor(
      i / xLength);
    };
    res$ = [];
    for (i$ = 0, to$ = Math.min(xLength, dataLength) - 1; i$ <= to$; ++i$) {
      ridx$ = i$;
      res$.push(ridx$);
    }
    xDomain = res$;
    res$ = [];
    for (i$ = 0, to$ = getHeight(
    dataLength - 1); i$ <= to$; ++i$) {
      ridx$ = i$;
      res$.push(ridx$);
    }
    yDomain = res$;
    padding = 1;
    xScale = d3.scale.ordinal().domain(xDomain).rangeRoundPoints([0, w], padding);
    yScale = d3.scale.ordinal().domain(yDomain).rangeRoundPoints([0, h], padding);
    return grid = function(i){
      return {
        "x": xScale(
        i % xLength),
        "y": yScale(
        getHeight(
        i))
      };
    };
  };
  groupData = function(data, groupFunc){
    return _.map(function(it){
      it.value = _.fold1(curry$(function(x$, y$){
        return x$ + y$;
      }))(
      _.map(function(it){
        return it.value;
      })(
      it.value));
      return it;
    })(
    d3.entries(
    _.groupBy(groupFunc)(
    data)));
  };
  ifNaN = function(it){
    if (isNaN(it)) {
      return 0;
    } else {
      return it;
    }
  };
  buildGridOrder = function(data, group){
    var groups, grid, order, gridOrder;
    groups = groupData(data, function(it){
      return it[group];
    });
    grid = buildGrid(chrt.w, chrt.h, groups.length);
    order = buildOrder(groups);
    return gridOrder = function(it){
      return {
        "x": function(it){
          return it.x;
        }(
        grid(
        order(
        it))),
        "y": function(it){
          return it.y;
        }(
        grid(
        order(
        it)))
      };
    };
  };
  addPosition = function(data, group){
    var gridOrder;
    gridOrder = buildGridOrder(data, group);
    return _.map(function(it){
      it.target = {};
      it.target.x = function(it){
        return it.x;
      }(
      gridOrder(
      it[group]));
      it.target.y = function(it){
        return it.y;
      }(
      gridOrder(
      it[group]));
      return it;
    })(
    data);
  };
  build.draw = function(group){
    var augmentData, collide, tick, forceLayout, node, label, gridOrder;
    augmentData = _.map(function(it){
      it.r = chrt.dtsr;
      return it;
    })(
    addPosition(chrt.data, group));
    collide = function(it){
      var margin, r, nx1, nx2, ny1, ny2;
      margin = 0;
      r = it.r;
      nx1 = it.x - r;
      nx2 = it.x + r;
      ny1 = it.y - r;
      ny2 = it.y + r;
      return function(quad, x1, y1, x2, y2){
        var x, y, l, r;
        if (quad.point && quad.point !== it) {
          x = it.x - quad.point.x;
          y = it.y - quad.point.y;
          l = Math.sqrt(x * x + y * y);
          r = it.r + quad.point.r + margin;
          if (l < r) {
            l = (l - r) / l * 0.5;
            it.x -= x *= l;
            it.y -= y *= l;
            quad.point.x += x;
            quad.point.y += y;
          }
        }
        return x1 > nx2 || x2 < nx1 || y1 > ny2 || y2 < ny1;
      };
    };
    tick = function(it){
      var k, q, i, n;
      k = 0.1 * it.alpha;
      augmentData.forEach(function(o, i){
        o.y += (o.target.y - o.y) * k;
        return o.x += (o.target.x - o.x) * k;
      });
      if (chrt.isCollide) {
        q = d3.geom.quadtree(augmentData);
        i = 0;
        n = augmentData.length;
        while (++i < n) {
          q.visit(collide(augmentData[i]));
        }
      }
      return node.attr({
        "cx": function(it){
          return ifNaN(it.x);
        },
        "cy": function(it){
          return ifNaN(it.y);
        }
      });
    };
    forceLayout = d3.layout.force().nodes(augmentData).links([]).gravity(0).charge(-15).friction(0.7).size([chrt.w, chrt.h]).on("tick", tick);
    node = chrt.svg.selectAll("." + chrt.selector).data(augmentData);
    node.enter().append("circle").attr({
      "class": function(it, i){
        return chrt.selector;
      },
      "r": 0
    }).style({
      "fill": function(it){
        return it.color;
      }
    });
    node.attr({
      "r": function(it){
        return it.r;
      }
    }).call(forceLayout.drag);
    node.exit().transition().attr({
      "r": 0
    }).remove();
    forceLayout.start();
    label = chrt.svg.selectAll(".grp" + chrt.selector).data(groupData(augmentData, function(it){
      return it[group];
    }), function(it){
      return it.key;
    });
    label.exit().remove();
    gridOrder = buildGridOrder(augmentData, group);
    return label.enter().append("text").attr({
      "x": function(it){
        return function(it){
          return it.x;
        }(
        gridOrder(
        it.key));
      },
      "y": function(it){
        return function(it){
          return it.y + chrt.labelYOffset;
        }(
        gridOrder(
        it.key));
      },
      "class": function(it){
        return "grp" + chrt.selector + " grp" + it;
      }
    }).style({
      "text-anchor": "middle",
      "fill": "rgb(10, 10, 10)",
      "text-shadow": '-1px -1px 0 #fff, 1px -1px 0 #fff, -1px 1px 0 #fff, 1px 1px 0 #fff'
    }).text(function(it){
      if (it.key === "undefined") {
        return "all";
      } else {
        return it.key;
      }
    });
  };
  for (i$ in chrt) {
    (fn$.call(this, i$));
  }
  return build;
  function fn$(it){
    build[it] = function(v){
      if (arguments.length === 0) {
        return chrt[it];
      } else {
        chrt[it] = v;
        return build;
      }
    };
  }
};
lineChart = function(){
  var chrt, svg, build, i$;
  chrt = {};
  chrt.container = null;
  chrt.data = null;
  chrt.margin = {
    top: 80,
    left: 80,
    right: 80,
    bottom: 80
  };
  chrt.w = 480 - chrt.margin.left - chrt.margin.right;
  chrt.h = 480 - chrt.margin.top - chrt.margin.bottom;
  chrt.duration = 500;
  chrt.delay = 2000;
  chrt.numberFormat = null;
  chrt.color = '#41afa5';
  chrt.strokeWidth = "3px";
  chrt.xGridNumber = 5;
  chrt.tickValues = null;
  chrt.scaleX = null;
  chrt.tickFormat = d3.time.format("%Y");
  svg = null;
  build = function(){
    if (chrt.data === null || chrt.container === null) {
      return;
    }
    return svg = d3.select(chrt.container).insert("svg", "span").attr({
      "viewBox": "0 0 " + (chrt.w + chrt.margin.left + chrt.margin.right) + " " + (chrt.h + chrt.margin.top + chrt.margin.bottom),
      "width": "100%",
      "height": "100%",
      "preserveAspectRatio": "xMinYMin meet"
    }).append("g").attr({
      "transform": "translate(" + chrt.margin.left + "," + chrt.margin.top + ")"
    });
  };
  build.draw = function(){
    var extent, max, scaleX, scaleY, path, line, track, circle, translateAlong, xAxis, xAxisGroup;
    extent = function(it){
      return d3.extent(it);
    }(
    _.flatten(
    _.map(function(row){
      return d3.extent(row, function(it){
        return it.key;
      });
    })(
    chrt.data)));
    max = function(it){
      return d3.max(it);
    }(
    _.flatten(
    _.map(function(row){
      return d3.max(row, function(it){
        return it.value;
      });
    })(
    chrt.data)));
    if (chrt.scaleX === null) {
      scaleX = d3.time.scale().domain(extent).range([0, chrt.w]);
    } else {
      scaleX = chrt.scaleX;
    }
    scaleY = d3.scale.linear().domain([0, max]).range([chrt.h, 0]);
    svg.selectAll(".gridX").data((function(){
      var i$, step$, to$, results$ = [];
      for (i$ = 0, to$ = chrt.w, step$ = chrt.w / chrt.xGridNumber; step$ < 0 ? i$ >= to$ : i$ <= to$; i$ += step$) {
        results$.push(i$);
      }
      return results$;
    }())).enter().append("line").attr({
      "x1": function(it){
        return it;
      },
      "x2": function(it){
        return it;
      },
      "y1": 0,
      "y2": chrt.h,
      "class": "gridX"
    }).style({
      "stroke": '#D8D5D5',
      "stroke-width": "1px"
    });
    svg.selectAll(".gridY").data((function(){
      var i$, step$, to$, results$ = [];
      for (i$ = 0, to$ = chrt.h, step$ = chrt.h / 5; step$ < 0 ? i$ >= to$ : i$ <= to$; i$ += step$) {
        results$.push(i$);
      }
      return results$;
    }())).enter().append("line").attr({
      "x1": 0,
      "x2": chrt.w,
      "y1": function(it){
        return it;
      },
      "y2": function(it){
        return it;
      },
      "class": "gridY"
    }).style({
      "stroke": '#D8D5D5',
      "stroke-width": "1px"
    });
    path = d3.svg.line().x(function(it){
      return scaleX(
      it.key);
    }).y(function(it){
      return scaleY(
      it.value);
    }).interpolate("monotone");
    line = svg.selectAll(".line").data(chrt.data);
    line.enter().append("path").attr({
      "class": "line"
    });
    line.attr({
      "d": path
    }).style({
      "stroke": chrt.color,
      "stroke-width": chrt.strokeWidth,
      "fill": "none",
      "stroke-dasharray": function(){
        var l;
        l = d3.select(this).node().getTotalLength();
        return l + " " + l;
      },
      "stroke-dashoffset": function(){
        return d3.select(this).node().getTotalLength();
      }
    }).transition().duration(chrt.duration).delay(chrt.delay).ease('linear').style({
      "stroke-dashoffset": 0
    });
    track = line.attr({
      "d": path
    }).style({
      "fill": "none"
    });
    svg.selectAll(".head").data(_.map(function(it){
      return _.head(
      it);
    })(
    chrt.data)).enter().append("circle").attr({
      "cx": function(it){
        return scaleX(
        it.key);
      },
      "cy": function(it){
        return scaleY(
        it.value);
      },
      "r": 3,
      "class": "head"
    }).style({
      "fill": chrt.color,
      "stroke": chrt.color,
      "stroke-width": chrt.strokeWidth
    });
    circle = svg.selectAll(".tail").data(_.map(function(it){
      return _.head(
      it);
    })(
    chrt.data)).enter().append("circle").attr({
      "cx": 0,
      "cy": 0,
      "r": 3,
      "class": "tail"
    }).style({
      "fill": chrt.color,
      "stroke": chrt.color,
      "stroke-width": chrt.strokeWidth,
      "opacity": 0
    });
    translateAlong = function(path){
      var l;
      l = path.getTotalLength();
      return function(d, i, a){
        return function(t){
          var p;
          p = path.getPointAtLength(t * l);
          return "translate(" + p.x + "," + p.y + ")";
        };
      };
    };
    circle.transition().duration(chrt.duration).delay(chrt.delay).ease('linear').style({
      "opacity": 1
    }).attrTween("transform", function(it, i){
      var f;
      f = translateAlong(
      d3.select(track[0][i]).node());
      return f(
      it);
    });
    svg.selectAll(".numberGroup").data(_.map(function(it){
      return [_.head(it), _.last(it)];
    })(
    chrt.data)).enter().append("g").attr({
      "class": "numberGroup"
    }).selectAll("text").data(function(it){
      return it;
    }).enter().append("text").text(function(it){
      if (chrt.numberFormat === null) {
        return it.value;
      } else {
        return chrt.numberFormat(
        it);
      }
    }).attr({
      "class": "number",
      "x": function(it){
        return scaleX(
        it.key);
      },
      "y": function(it){
        return scaleY(
        it.value) - 20;
      }
    }).style({
      "text-anchor": "middle",
      "opacity": 0
    }).transition().duration(0).delay(function(it, i){
      return i * (chrt.duration + chrt.delay);
    }).ease('linear').style({
      "opacity": 1
    });
    xAxis = d3.svg.axis().scale(scaleX).tickValues(chrt.tickValues ? chrt.tickValues : extent).tickFormat(chrt.tickFormat).orient("bottom");
    xAxisGroup = svg.append("g").call(xAxis).attr({
      "transform": "translate(0," + chrt.h + ")",
      "class": "axis"
    });
    return xAxisGroup.selectAll("path").style({
      "fill": "none",
      "stroke": "grey",
      "stroke-width": 1,
      "shape-rendering": "crispEdges"
    });
  };
  for (i$ in chrt) {
    (fn$.call(this, i$));
  }
  return build;
  function fn$(it){
    build[it] = function(v){
      if (arguments.length === 0) {
        return chrt[it];
      } else {
        chrt[it] = v;
        return build;
      }
    };
  }
};
barChart = function(){
  var chrt, gradientData, build, i$;
  chrt = {};
  chrt.container = null;
  chrt.data = null;
  chrt.margin = {
    top: 10,
    left: 80,
    right: 50,
    bottom: 20
  };
  chrt.w = 500 - chrt.margin.left - chrt.margin.right;
  chrt.h = null;
  chrt.barHeight = 25;
  chrt.barMargin = 5;
  chrt.duration = 2000;
  chrt.delay = 200;
  gradientData = [
    {
      "offset": "0%",
      "color": "rgb(215, 235, 97)"
    }, {
      "offset": "100%",
      "color": "rgb(80, 180, 115)"
    }
  ];
  chrt.barStyle = null;
  chrt.textFunc = function(it){
    if (it === 0) {
      return "";
    } else {
      return it.toFixed(0);
    }
  };
  chrt.svg = null;
  build = function(){
    if (chrt.data === null || chrt.container === null) {
      return;
    }
    chrt.h = chrt.data.length * chrt.barHeight + (chrt.data.length - 1) * chrt.barMargin;
    return chrt.svg = d3.select(chrt.container).insert("svg", "span").attr({
      "viewBox": "0 0 " + (chrt.w + chrt.margin.left + chrt.margin.right) + " " + (chrt.h + chrt.margin.top + chrt.margin.bottom),
      "width": "100%",
      "height": "100%",
      "preserveAspectRatio": "xMinYMin meet"
    }).append("g").attr({
      "transform": "translate(" + chrt.margin.left + "," + chrt.margin.top + ")"
    });
  };
  build.draw = function(){
    var scaleX, scaleY, bars;
    scaleX = d3.scale.linear().domain([
      0, d3.max(chrt.data, function(it){
        return it.value;
      })
    ]).range([0, chrt.w]);
    scaleY = function(i){
      return i * (chrt.barHeight + chrt.barMargin);
    };
    chrt.svg.append("linearGradient").attr({
      "id": "themeGradient",
      "gradientUnits": "userSpaceOnUse",
      "x1": 0,
      "x2": chrt.w,
      "y1": 0,
      "y2": 0
    }).selectAll("stop").data(gradientData).enter().append("stop").attr({
      "offset": function(it){
        return it.offset;
      },
      "stop-color": function(it){
        return it.color;
      }
    });
    bars = chrt.svg.selectAll(".bars").data(chrt.data);
    bars.enter().append("rect").attr({
      "width": 0,
      "class": "bars"
    });
    bars.transition().duration(chrt.duration).delay(function(it, i){
      return i * chrt.delay;
    }).attr({
      "width": function(it){
        return scaleX(
        it.value);
      },
      "height": function(){
        return chrt.barHeight;
      },
      "x": 0,
      "y": function(it, i){
        return scaleY(i);
      }
    });
    if (chrt.barStyle !== null) {
      bars.call(chrt.barStyle);
    }
    chrt.svg.selectAll(".name").data(chrt.data).enter().append("text").attr({
      "x": -30,
      "y": function(it, i){
        return scaleY(i) + chrt.barHeight / 2 + 7;
      },
      "class": "name"
    }).style({
      "text-anchor": "end"
    }).text(function(it){
      return it.key;
    });
    return chrt.svg.selectAll(".number").data(chrt.data).enter().append("text").attr({
      "x": 5,
      "y": function(it, i){
        return scaleY(i) + chrt.barHeight / 2 + 7;
      },
      "class": "number"
    }).style({
      "text-anchor": "start"
    }).transition().duration(chrt.duration).delay(function(it, i){
      return i * chrt.delay;
    }).attr({
      "x": function(it){
        return scaleX(
        it.value) + 5;
      }
    }).tween("text", function(it){
      var i;
      i = d3.interpolate(this.textContent, it.value);
      return function(n){
        return this.textContent = chrt.textFunc(
        i(
        n));
      };
    });
  };
  for (i$ in chrt) {
    (fn$.call(this, i$));
  }
  return build;
  function fn$(it){
    build[it] = function(v){
      if (arguments.length === 0) {
        return chrt[it];
      } else {
        chrt[it] = v;
        return build;
      }
    };
  }
};
childrenPercent = _.map(function(it){
  return {
    "languageText": "客家人的下一代",
    "identity": it <= 57
      ? "子女自認是客家人 57%"
      : it <= 57 + 8 ? "不知道 8%" : "子女自認不是 35%",
    "language": it <= 50 ? "子女不會講客家語 50%" : "子女會講客家語 50%",
    "value": 1,
    "color": function(it){
      return it[~~(Math.random() * 6)];
    }(
    ['#88C8AB', '#89C693', '#50B584', '#55B36C', '#A7CD6B', '#E7E879'])
  };
})(
[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100]);
forceChildren = forceChart().container('.chart-force').data(childrenPercent).labelYOffset(150);
forceChildren();
listForce = [
  function(){
    return forceChildren.draw("languageText");
  }, function(){
    return forceChildren.draw("identity");
  }, function(){
    return forceChildren.draw("language");
  }
];
hourDonut = null;
minDonut = null;
secDonut = null;
(firstTick = function(){
  hourDonut = donutChart().data({
    "total": 24,
    "value": 0
  }).container('#donut1').textFunc(function(it){
    return it.toFixed(0);
  }).ease("elastic");
  hourDonut().draw();
  minDonut = donutChart().data({
    "total": 60,
    "value": 0
  }).container('#donut2').textFunc(function(it){
    return it.toFixed(0);
  }).ease("elastic");
  minDonut().draw();
  secDonut = donutChart().data({
    "total": 60,
    "value": 0
  }).container('#donut3').textFunc(function(it){
    return it.toFixed(0);
  }).ease("elastic");
  return secDonut().draw();
})();
interData = [
  {
    "key": "日本",
    "value": 26
  }, {
    "key": "義大利",
    "value": 21
  }, {
    "key": "香港",
    "value": 14
  }, {
    "key": "台灣",
    "value": 12
  }, {
    "key": "星加坡",
    "value": 11
  }, {
    "key": "中國",
    "value": 9
  }, {
    "key": "越南",
    "value": 7
  }
];
colorFunc = function(it){
  return it.style({
    "fill": 'url(#themeGradient)'
  });
};
firstBar = barChart().data(interData).container('.chart-bar').margin({
  top: 10,
  left: 120,
  right: 50,
  bottom: 20
}).barHeight(25).barStyle(colorFunc);
lineChartData = [
  {
    "year": 1987,
    "件數": 145
  }, {
    "year": 1988,
    "件數": 163
  }, {
    "year": 1989,
    "件數": 150
  }, {
    "year": 1990,
    "件數": 127
  }, {
    "year": 1991,
    "件數": 128
  }, {
    "year": 1992,
    "件數": 165
  }, {
    "year": 1993,
    "件數": 140
  }, {
    "year": 1994,
    "件數": 191
  }, {
    "year": 1995,
    "件數": 194
  }, {
    "year": 1996,
    "件數": 234
  }, {
    "year": 1997,
    "件數": 260
  }, {
    "year": 1998,
    "件數": 287
  }, {
    "year": 1999,
    "件數": 332
  }, {
    "year": 2000,
    "件數": 383
  }, {
    "year": 2001,
    "件數": 366
  }, {
    "year": 2002,
    "件數": 456
  }, {
    "year": 2003,
    "件數": 457
  }, {
    "year": 2004,
    "件數": 447
  }, {
    "year": 2005,
    "件數": 374
  }, {
    "year": 2006,
    "件數": 418
  }, {
    "year": 2007,
    "件數": 443
  }, {
    "year": 2008,
    "件數": 475
  }, {
    "year": 2009,
    "件數": 557
  }, {
    "year": 2010,
    "件數": 499
  }, {
    "year": 2011,
    "件數": 547
  }
];
columns = _.filter(function(it){
  return it !== "year";
})(
_.keys(
lineChartData[0]));
ratio = _.sortBy(function(it){
  var pri;
  pri = ["件數"];
  return pri.indexOf(it[0]["label"]);
})(
_.map(function(c){
  return _.sortBy(function(it){
    return it.key;
  })(
  _.map(function(it){
    return {
      "key": new Date(it["year"], 1, 1),
      "value": +it[c],
      "label": c
    };
  })(
  lineChartData));
})(
columns));
drawRatio = lineChart().data(ratio).container('.chart-line').w(960).xGridNumber(13).strokeWidth(4).numberFormat(function(it){
  return "醫療事件 " + it.value + " 個";
}).tickValues([new Date(1987, 1, 1), new Date(2011, 1, 1)]);
endAll = function(transition, callback){
  var n;
  if (transition.size() === 0) {
    callback();
  }
  n = 0;
  return transition.each(function(){
    return ++n;
  }).each("end", function(){
    if (!--n) {
      return callback.apply(this, arguments);
    }
  });
};
i = -1;
(tick = function(){
  var l, d, h, m, s;
  ++this.i;
  l = listForce.length;
  listForce[this.i % l]();
  d = new Date();
  h = d.getHours();
  m = d.getMinutes();
  s = d.getSeconds();
  hourDonut.update({
    "value": h
  });
  minDonut.update({
    "value": m
  });
  secDonut.update({
    "value": s
  });
  if (i === 0) {
    firstBar();
    firstBar.draw();
  } else if (i % 2 === 0) {
    d3.select(".chart-bar").selectAll('rect,.number').transition().duration(1000).style({
      "opacity": 0
    }).remove().call(endAll, function(){
      return firstBar.draw();
    });
  }
  if (i === 0) {
    drawRatio();
    return drawRatio.draw();
  } else if (i % 2 === 0) {
    return d3.select(".chart-line").selectAll('.line,circle,.number,.numberGroup,.axis').transition().duration(1000).style({
      "opacity": 0
    }).remove().call(endAll, function(){
      return drawRatio.draw();
    });
  }
})();
// clock = setInterval(tick, 3000);

// 開始圖表繪製
var chart_start = setInterval(tick, 3000);
$(window).blur(function(){
  clearInterval(chart_start);
});
$(window).focus(function(){
  chart_start = setInterval(tick, 3000);
});

function curry$(f, bound){
  var context,
  _curry = function(args) {
    return f.length > 1 ? function(){
      var params = args ? args.concat() : [];
      context = bound ? context || this : this;
      return params.push.apply(params, arguments) <
          f.length && arguments.length ?
        _curry.call(context, params) : f.apply(context, params);
    } : f;
  };
  return _curry();
}
