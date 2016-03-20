'use strict';
// Source: src/lib/awgl.js

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
}function add_global_sym(sym, index) {
  var to_eval = "window.".concat(sym).concat("=").concat(index);eval(to_eval);
}function init_buffer(gl, data, type) {
  var buf = gl.createBuffer();if (!buf) throw new Error("Failed to create the buffer object");return gl.bindBuffer(gl.ARRAY_BUFFER, buf), gl.bufferData(gl.ARRAY_BUFFER, data, type), buf;
}function bind_attrib(gl, attrib, num, type, stride, offset) {
  var attribute = gl.getAttribLocation(gl.program, attrib);if (0 > attribute) throw new Error("Failed to get the storage location of " + attrib);gl.vertexAttribPointer(attribute, num, type, !1, stride, offset), gl.enableVertexAttribArray(attribute);
}function initArrayBuffer(gl, method, attribute, data, num, type, stride, offset) {
  var buffer = gl.createBuffer();if (!buffer) return console.log("Failed to create the buffer object"), !1;gl.bindBuffer(gl.ARRAY_BUFFER, buffer), gl.bufferData(gl.ARRAY_BUFFER, data, method);var a_attribute = gl.getAttribLocation(gl.program, attribute);return 0 > a_attribute ? (console.log("Failed to get the storage location of " + attribute), !1) : (gl.vertexAttribPointer(a_attribute, num, type, !1, stride, offset), gl.enableVertexAttribArray(a_attribute), !0);
}function subtract(va, vb) {
  for (var tmp = new Float32Array([0, 0, 0]), x = 0; x < va.length; x++) {
    tmp[x] = va[x] - vb[x];
  }return tmp;
}function multiS(va, s) {
  for (var x = 0; x < va.length; x++) {
    va[x] *= s;
  }return va;
}function addS(va, s) {
  for (var x = 0; x < va.length; x++) {
    va[x] += s;
  }return va;
}function crossProduct(l1, l2) {
  return new Float32Array([l1[1] * l2[2] - l2[1] * l1[2], -(l1[0] * l2[2] - l1[2] * l2[0]), l1[0] * l2[1] - l1[1] * l2[0]]);
}function getNormals(v_vc, v_ind, mode) {
  var normals = [];if (0 == mode) {
    for (var i = 0; i < v_ind.length; i++) {
      var index = 3 * v_ind[i],
          point1 = new vec3(v_vc[index], v_vc[index + 1], v_vc[index + 2]),
          point2 = new vec3(v_vc[index + 3], v_vc[index + 4], v_vc[index + 5]),
          point3 = new vec3(v_vc[index + 6], v_vc[index + 7], v_vc[index + 8]),
          lineA = vec3.subtract(point1, point3),
          lineB = vec3.subtract(point2, point3),
          CP = vec3.normalize(vec3.cross(lineA, lineB));normals.push(CP.elements[0]), normals.push(CP.elements[1]), normals.push(CP.elements[2]);
    }return normals;
  }throw new Error("Warning: Invalid mode selected for getNormals!");
}var _createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || !1, descriptor.configurable = !0, "value" in descriptor && (descriptor.writable = !0), Object.defineProperty(target, descriptor.key, descriptor);
    }
  }return function (Constructor, protoProps, staticProps) {
    return protoProps && defineProperties(Constructor.prototype, protoProps), staticProps && defineProperties(Constructor, staticProps), Constructor;
  };
}(),
    ORTHOGRAPHIC = 1,
    PERSPECTIVE = 0,
    Camera = function () {
  function Camera(gl, args) {
    _classCallCheck(this, Camera);var perspective = (args.mode || 0, args.perspective || 40),
        position = args.position || [6, 0, 0],
        lookAt = args.lookAt || [0, 0, 0],
        up = args.up || [0, 0, 1];if (this.position = new vec3(position[0], position[1], position[2]), this.lookAt = new vec3(lookAt[0], lookAt[1], lookAt[2]), this.up = new vec3(up[0], up[1], up[2]), this.perspective = perspective, this._velocity = .05, this._angle = 3.141592654, this._t_angle = 3.141592654, this._angle_incr = .15, this._dist = vec3.create(), this._w = !1, this._s = !1, this._a = !1, this._d = !1, this._q = !1, this._e = !1, this._r = !1, this._f = !1, this._moving = !1, this._direction = vec3.create(), this._uL_position = gl.getUniformLocation(gl.program, "u_eyePosWorld"), !this._uL_position) throw new Error("Failed to get camera storage location");gl.uniform3fv(this.uL_position, this.position.elements);
  }return _createClass(Camera, [{ key: "_mat4_proj", value: function value(gl, mode) {
      var mat4_proj = new Matrix4(),
          zoom = 5,
          vpAspect = gl.drawingBufferWidth / gl.drawingBufferHeight;switch (mode) {case PERSPECTIVE:
          return mat4_proj.setPerspective(this.perspective, vpAspect, 1, 1e3), mat4_proj;case ORTHOGRAPHIC:
          return vpAspect >= 1 ? mat4_proj.setOrtho(-vpAspect * zoom, vpAspect * zoom, -zoom, zoom, 1, 100) : mat4_proj.setOrtho(-zoom, zoom, -1 / vpAspect * zoom, 1 / vpAspect * zoom, 1, 100), mat4_proj;}
    } }, { key: "_mat4_view", value: function value() {
      var mat4_view = new Matrix4();return mat4_view.setLookAt(this.position.elements[0], this.position.elements[1], this.position.elements[2], this.lookAt.elements[0], this.lookAt.elements[1], this.lookAt.elements[2], this.up.elements[0], this.up.elements[1], this.up.elements[2]), mat4_view;
    } }, { key: "mat4_VP", value: function mat4_VP(gl, mode, dT) {
      var mat4_VP = (gl.drawingBufferWidth / gl.drawingBufferHeight, void 0);switch (mode) {case PERSPECTIVE:
          return this.update(gl, dT), mat4_VP = this._mat4_proj(gl, PERSPECTIVE).concat(this._mat4_view());case ORTHOGRAPHIC:
          return this.update(gl, dT), mat4_VP = this._mat4_proj(gl, ORTHOGRAPHIC).concat(this._mat4_view());}
    } }, { key: "keyPressed", value: function value(key) {
      switch (key) {case 87:
          this._w = !0;break;case 65:
          this._a = !0;break;case 83:
          this._s = !0;break;case 68:
          this._d = !0;break;case 81:
          this._q = !0;break;case 69:
          this._e = !0;break;case 82:
          this._r = !0;break;case 70:
          this._f = !0;}
    } }, { key: "keyUp", value: function value() {
      this._w = !1, this._a = !1, this._s = !1, this._d = !1, this._q = !1, this._e = !1, this._r = !1, this._f = !1;
    } }, { key: "update", value: function value(gl, dT) {
      var pi = 3.141592654,
          vel = this._velocity * dT,
          angle_step = this._angle_incr * vel * .3;if (this._dist = vec3.create(), this.moving) {
        if (this._w && (this._dist = vec3.multiply(vec3.subtract(this.lookAt, this.position), vel), this.position = vec3.add(this.position, this._dist), this.lookAt = vec3.add(this.lookAt, this._dist)), this._a) {
          this._dist = vec3.subtract(this.lookAt, this.position);var len = Math.sqrt(this._dist.elements[0] * this._dist.elements[0] + this._dist.elements[1] * this._dist.elements[1]);this._angle += angle_step, this.lookAt.elements[0] = this.position.elements[0] + len * Math.cos(this._angle), this.lookAt.elements[1] = this.position.elements[1] + len * Math.sin(this._angle);
        }if (this._s && (this._dist = vec3.multiply(vec3.subtract(this.lookAt, this.position), vel), this.position = vec3.subtract(this.position, this._dist), this.lookAt = vec3.subtract(this.lookAt, this._dist)), this._d) {
          this._dist = vec3.subtract(this.lookAt, this.position);var _len = Math.sqrt(this._dist.elements[0] * this._dist.elements[0] + this._dist.elements[1] * this._dist.elements[1]);this._angle -= angle_step, this.lookAt.elements[0] = this.position.elements[0] + _len * Math.cos(this._angle), this.lookAt.elements[1] = this.position.elements[1] + _len * Math.sin(this._angle);
        }if (this._q && (vel = 8 * vel, this._dist.elements[0] = vel * Math.cos(this._angle + 3 * pi / 2), this._dist.elements[1] = vel * Math.sin(this._angle + 3 * pi / 2), this.position = vec3.subtract(this.position, this._dist), this.lookAt = vec3.subtract(this.lookAt, this._dist)), this._e && (vel = 8 * vel, this._dist.elements[0] = vel * Math.cos(this._angle + pi / 2), this._dist.elements[1] = vel * Math.sin(this._angle + pi / 2), this.position = vec3.subtract(this.position, this._dist), this.lookAt = vec3.subtract(this.lookAt, this._dist)), this._r) {
          this._dist = vec3.subtract(this.lookAt, this.position);var _len2 = Math.sqrt(this._dist.elements[0] * this._dist.elements[0] + this._dist.elements[1] * this._dist.elements[1]);this._t_angle <= 2.1 ? this._t_angle = 2.1 : this._t_angle -= angle_step, this.lookAt.elements[2] = this.position.elements[2] + _len2 * Math.sin(this._t_angle);
        }if (this._f) {
          this._dist = vec3.subtract(this.lookAt, this.position);var _len3 = Math.sqrt(this._dist.elements[0] * this._dist.elements[0] + this._dist.elements[1] * this._dist.elements[1]);this._t_angle += angle_step, this._t_angle >= 4.3 ? this._t_angle = 4.3 : this._t_angle += angle_step, this.lookAt.elements[2] = this.position.elements[2] + _len3 * Math.sin(this._t_angle);
        }gl.uniform3fv(this._uL_position, this.position.elements);
      }
    } }]), Camera;
}(),
    Light = function () {
  function Light(gl, index, light_sys, light) {
    _classCallCheck(this, Light);var position = light.pos || !1,
        ambient = light.ambi || !1,
        diffuse = light.diff || !1,
        specular = light.spec || !1;if (this.position = position, this.ambient = ambient, this.diffuse = diffuse, this.specular = specular, this._light_sys = light_sys, this._uL_position = gl.getUniformLocation(gl.program, "light[" + index + "].position"), this._uL_ambient = gl.getUniformLocation(gl.program, "light[" + index + "].ambient"), this._uL_diffuse = gl.getUniformLocation(gl.program, "light[" + index + "].diffuse"), this._uL_specular = gl.getUniformLocation(gl.program, "light[" + index + "].specular"), !(this._uL_position && this._uL_ambient && this._uL_diffuse && this._uL_specular)) throw new Error("Failed to get light storage locations");this.update(gl, { all: 1 });
  }return _createClass(Light, [{ key: "set", value: function value(options) {
      var options = options || {},
          position = options.position || !1,
          ambient = options.ambient || !1,
          diffuse = options.diffuse || !1,
          specular = options.specular || !1;position && (this.position = position, this.gl.uniform3fv(this._uL_position, this.position)), ambient && (this.ambient = ambient, this.gl.uniform3fv(this._uL_ambient, this.ambient)), diffuse && (this.diffuse = diffuse, this.gl.uniform3fv(this._uL_diffuse, this.diffuse)), specular && (this.specular = specular, this.gl.uniform3fv(this._uL_specular, this.specular));
    } }, { key: "update", value: function value(gl, options) {
      var options = options || {},
          all = options.all || !1,
          position = options.position || !1,
          ambient = options.ambient || !1,
          diffuse = options.diffuse || !1,
          specular = options.specular || !1;all ? (gl.uniform3fv(this._uL_position, this.position), gl.uniform3fv(this._uL_ambient, this.ambient), gl.uniform3fv(this._uL_diffuse, this.diffuse), gl.uniform3fv(this._uL_specular, this.specular)) : (position && gl.uniform3fv(this._uL_position, this.position), ambient && gl.uniform3fv(this._uL_ambient, this.ambient), diffuse && gl.uniform3fv(this._uL_diffuse, this.diffuse), specular && gl.uniform3fv(this._uL_specular, this.specular));
    } }]), Light;
}(),
    Material = function () {
  function Material(gl, num, ke, ka, kd, ks, kshiny) {
    if (_classCallCheck(this, Material), this.gl = gl, this.ke = ke, this.ka = ka, this.kd = kd, this.ks = ks, this.kshiny = kshiny, this.uLoc_ke = gl.getUniformLocation(gl.program, "material[" + num + "].Ke"), this.uLoc_ka = gl.getUniformLocation(gl.program, "material[" + num + "].Ka"), this.uLoc_kd = gl.getUniformLocation(gl.program, "material[" + num + "].Kd"), this.uLoc_ks = gl.getUniformLocation(gl.program, "material[" + num + "].Ks"), this.uLoc_kshiny = gl.getUniformLocation(gl.program, "material[" + num + "].Kshiny"), !(this.uLoc_ke && this.uLoc_ka && this.uLoc_kd && this.uLoc_ks && this.uLoc_kshiny)) throw new Error("Failed to get the Phong Reflectance storage locations");this.update({ all: 1 });
  }return _createClass(Material, [{ key: "set", value: function value(options) {
      var options = options || {},
          ke = options.ke || !1,
          ka = options.ka || !1,
          kd = options.kd || !1,
          ks = options.ks || !1,
          kshiny = options.kshiny || !1;ke && (this.ke = ke, this.gl.uniform3fv(this.uLoc_ke, this.ke)), ka && (this.ka = ka, this.gl.uniform3fv(this.uLoc_ka, this.ka)), kd && (this.kd = kd, this.gl.uniform3fv(this.uLoc_kd, this.kd)), ka && (this.ks = ks, this.gl.uniform3fv(this.uLoc_ks, this.ks)), kshiny && (this.kshiny = kshiny, this.gl.uniform1i(this.uLoc_kshiny, this.kshiny));
    } }, { key: "update", value: function value(options) {
      var options = options || {},
          all = options.all || !1,
          ke = options.ke || !1,
          ka = options.ka || !1,
          kd = options.kd || !1,
          kshiny = (options.kd || !1, options.kshiny || !1);all ? (this.gl.uniform3fv(this.uLoc_ke, this.ke), this.gl.uniform3fv(this.uLoc_ka, this.ka), this.gl.uniform3fv(this.uLoc_kd, this.kd), this.gl.uniform3fv(this.uLoc_ks, this.ks), this.gl.uniform1i(this.uLoc_kshiny, this.kshiny)) : (ke && this.gl.uniform3fv(this.uLoc_ke, this.ke), ka && this.gl.uniform3fv(this.uLoc_ka, this.ka), kd && this.gl.uniform3fv(this.uLoc_kd, this.kd), ka && this.gl.uniform3fv(this.uLoc_ks, this.ks), kshiny && this.gl.uniform1i(this.uLoc_kshiny, this.kshiny));
    } }]), Material;
}(),
    Mesh = function () {
  function Mesh(gl, mutable, meshes) {
    _classCallCheck(this, Mesh), this._locations = [], this.mutable = mutable, this._meshes = this._concat_meshes(meshes);
  }return _createClass(Mesh, [{ key: "_concat_meshes", value: function value(meshes) {
      var positions = [],
          indicies = [],
          normals = [],
          last_len = 0,
          last_vertex_len = 0;this._locations.push(0);for (var x = 0; x < meshes.length; x++) {
        for (var curr_indicies = meshes[x][1], new_arr = [], i = 0; i < curr_indicies.length; i++) {
          new_arr.push(curr_indicies[i] + last_vertex_len / FLOATSPERVERTEX);
        }last_len += curr_indicies.length, last_vertex_len += meshes[x][0].length, positions = positions.concat(meshes[x][0]), indicies = indicies.concat(new_arr), this._locations.push(last_len);
      }return [positions, indicies, normals];
    } }, { key: "init_array_buffers", value: function value(gl) {
      var positions = new Float32Array(this._meshes[0]);if (FSIZE = positions.BYTES_PER_ELEMENT, this.mutable) {
        if (gl.bindBuffer(gl.ARRAY_BUFFER, null), !initArrayBuffer(gl, gl.DYNAMIC_DRAW, "POSITION_MUT", positions, 3, gl.FLOAT, 3 * FSIZE, 0)) throw new Error("Failed to create dynamic array buffers!");
      } else if (!initArrayBuffer(gl, gl.STATIC_DRAW, "POSITION_STAT", positions, 3, gl.FLOAT, 3 * FSIZE, 0)) throw new Error("Failed to create static array buffers!");
    } }, { key: "init_index_buffer", value: function value(gl, indicies_static, indicies_mut) {
      var indicies = new Float32Array(indicies_static.concat(indicies_mut));ISIZE = indicies.BYTES_PER_ELEMENT, gl.bindBuffer(gl.ARRAY_BUFFER, null);var indexBuffer = gl.createBuffer();if (!indexBuffer) throw new Error("Failed to create the buffer object");gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer), gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indicies, gl.STATIC_DRAW);
    } }, { key: "get_start_end", value: function value(index) {
      var start = void 0,
          end = void 0;return start = this._locations[index], end = this._locations[index + 1], [start, end];
    } }, { key: "mutate", value: function value(gl, mesh) {
      if (!this.mutable) throw new Error("Attempted to mutate a fixed mesh!");_init_buffers(gl, _concat_meshes(meshes));
    } }, { key: "indicies", get: function get() {
      return this._meshes[1];
    } }, { key: "positions", get: function get() {
      return this._meshes[0];
    } }]), Mesh;
}(),
    Model = function () {
  function Model(args) {
    _classCallCheck(this, Model);var mesh_index = args.mesh || 0,
        mat_index = args.mat || 0,
        drawing_mode = args.draw || 0;if (3 != Object.keys(args).length) throw new Error("Not enough args! Tried to create a malformed model. ");this.mat_index = mat_index, this.mesh_index = mesh_index, this._drawing_mode = drawing_mode;
  }return _createClass(Model, [{ key: "draw", value: function value(gl, uL_mat, range) {
      var start = range[0],
          end = range[1];gl.uniform1i(uL_mat, this.mat_index), gl.drawElements(gl.TRIANGLE_STRIP, end - start, gl.UNSIGNED_INT, ISIZE * start);
    } }]), Model;
}(),
    FSIZE,
    ISIZE,
    FLOATSPERVERTEX = 3,
    POINTS = 0,
    LINES = 1,
    LINE_LOOP = 2,
    LINE_STRIP = 3,
    TRIANGLES = 4,
    TRIANGLE_STRIP = 5,
    TRIANGLE_FAN = 6,
    Time = function () {
  function Time() {
    _classCallCheck(this, Time), this._last = Date.now(), this._now;
  }return _createClass(Time, [{ key: "dT", get: function get() {
      var dT = void 0;return this._now = Date.now(), dT = this._now - this._last, this._last = Date.now(), dT;
    } }]), Time;
}(),
    Scene = function () {
  function Scene(canvas) {
    _classCallCheck(this, Scene), this.canvas = canvas, this.time = new Time(), this.mat4_model = new Matrix4(), this.mat4_mvp = new Matrix4(), this.mat4_normal = new Matrix4(), this._gl, this._lights = [], this._models = [], this._materials = [], this._meshes_fixed, this._meshes_mutable, this._camera, this._buffers = Array(null, null, null), this._symtbl_lights = [], this._symtbl_mats = [], this._symtbl_meshes = [], this._symtbl_models = [], this._begin_mut_mesh = 0, this.__draw_stack__, this.__last_draw_stack__, this._UI_ELEMENTS_ = Array(20), this._uL_mat4_model, this._uL_mat4_mvp, this._uL_mat4_normal, this._uL_light_sys, this._uL_mat, this._uL_mutable;
  }return _createClass(Scene, [{ key: "_init_", value: function value(n_lights, n_mats) {
      if (this._gl = this.canvas.getContext("webgl", { stencil: !0 }), !this._gl) throw new Error("Failed to get the rendering context.");this._gl.getExtension("OES_standard_derivatives"), this._gl.getExtension("OES_element_index_uint"), this._init_shaders_(n_lights, n_mats), this._init_mats_(), this._init_locations_(), this._init_array_buffers_(this._gl), this._init_index_buffer_(this._gl), this._init_scene_();
    } }, { key: "_init_shaders_", value: function value(n_lights, n_mats) {
      if (FSHADER_SOURCE = "#define READ_SRC 1 \n#define NUM_LIGHTS " + n_lights + " \n#define NUM_MATERIALS " + n_mats + " \n" + FSHADER_SOURCE, !initShaders(this._gl, VSHADER_SOURCE, FSHADER_SOURCE)) throw new Error("Failed to intialize shaders.");
    } }, { key: "_init_locations_", value: function value() {
      if (this._uL_mat4_model = this._gl.getUniformLocation(this._gl.program, "u_ModelMatrix"), this._uL_mat4_mvp = this._gl.getUniformLocation(this._gl.program, "u_MvpMatrix"), this._uL_mat = this._gl.getUniformLocation(this._gl.program, "u_matIndex"), this._uL_mutable = this._gl.getUniformLocation(this._gl.program, "mutable"), !this._uL_mat4_model || !this._uL_mat4_mvp || !this._uL_mat) throw new Error("Failed to get scene storage locations");
    } }, { key: "_init_scene_", value: function value() {
      this._gl.clearColor(0, 0, 0, 1), this._gl.enable(this._gl.DEPTH_TEST);
    } }, { key: "_init_light", value: function value(light_sys, light) {
      this._lights.push(new Light(this._gl, this._lights.length, light_sys, light));
    } }, { key: "_init_camera", value: function value(position, lookAt, up) {
      this.camera = new Camera(this._gl, position, lookAt, up);
    } }, { key: "_init_mats_", value: function value() {
      var tmp_mats = this._materials;this._materials = [];for (var x = 0; x < tmp_mats.length; x++) {
        var mat = tmp_mats[x];this._materials.push(new Material(this._gl, this._materials.length, mat[0], mat[1], mat[2], mat[3], mat[4]));
      }
    } }, { key: "_set_light", value: function value(index, values) {
      this._lights[index].set(values);
    } }, { key: "_init_array_buffers_", value: function value(gl) {
      var positions = void 0;this._meshes_fixed && (positions = new Float32Array(this._meshes_fixed.positions), FSIZE = positions.BYTES_PER_ELEMENT, gl.bindBuffer(gl.ARRAY_BUFFER, null), this._buffers[0] = init_buffer(gl, positions, gl.STATIC_DRAW)), this._meshes_mutable && (positions = new Float32Array(this._meshes_mutable.positions), FSIZE = positions.BYTES_PER_ELEMENT, gl.bindBuffer(gl.ARRAY_BUFFER, null), this._buffers[1] = init_buffer(gl, positions, gl.DYNAMIC_DRAW));
    } }, { key: "_init_index_buffer_", value: function value(gl, indicies_static, indicies_mut) {
      var ind = [];this._meshes_fixed && (ind = ind.concat(this._meshes_fixed.indicies)), this._meshes_mutable && (ind = ind.concat(this._meshes_mutable.indicies));var indicies = new Uint32Array(ind);ISIZE = indicies.BYTES_PER_ELEMENT, gl.bindBuffer(gl.ARRAY_BUFFER, null);var indexBuffer = gl.createBuffer();if (!indexBuffer) throw new Error("Failed to create the buffer object");gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer), gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indicies, gl.STATIC_DRAW);
    } }, { key: "init", value: function value(args) {
      var lights = args.lights || !1,
          models = args.models || !1,
          camera = args.camera || !1,
          self = this,
          _loop = function _loop(light_sys) {
        var lights_tmp = [];for (var light in lights[light_sys]) {
          add_global_sym(light, self._symtbl_lights.length), self._symtbl_lights.push(light), lights_tmp.push(lights[light_sys][light]);
        }self._init_(lights_tmp.length, self._materials.length), lights_tmp.map(function (x) {
          self._init_light(light_sys, x);
        });
      };for (var light_sys in lights) {
        _loop(light_sys);
      }for (var model in models) {
        add_global_sym(model, self._symtbl_models.length), self._symtbl_models.push(model), self._models.push(new Model(models[model]));
      }self.__draw_stack__ = Array(self._models.length), self._camera = new Camera(self._gl, camera);
    } }, { key: "defmat", value: function value(args) {
      if (this._symtbl_mats.length) throw new Error("Materials have already been initialized!");for (var material in args) {
        add_global_sym(material, this._symtbl_mats.length), this._symtbl_mats.push(material);var mat = args[material];this._materials.push(mat);
      }
    } }, { key: "defmesh", value: function value(args) {
      var fixed = args.fixed || !1,
          mutable = args.mutable || !1,
          self = this;if (self._symtbl_meshes.length) throw new Error("Meshes have already been initialized!");if (fixed) {
        var tmp_meshes_fixed = [];for (var mesh in fixed) {
          if (-1 != self._symtbl_meshes.indexOf(mesh)) throw new Error(mesh.concat(" has already been defined!"));add_global_sym(mesh, self._symtbl_meshes.length), self._symtbl_meshes.push(mesh), tmp_meshes_fixed.push(fixed[mesh]);
        }self._meshes_fixed = new Mesh(this._gl, !1, tmp_meshes_fixed), self._begin_mut_mesh = self._symtbl_meshes.length;
      } else self._meshes_fixed = !1;if (mutable) {
        var tmp_meshes_mutable = [];for (var _mesh in mutable) {
          if (-1 != self._symtbl_meshes.indexOf(_mesh)) throw new Error(_mesh.concat(" has already been defined!"));add_global_sym(_mesh, self._symtbl_meshes.length), self._symtbl_meshes.push(_mesh), tmp_meshes_mutable.push(mutable[_mesh]);
        }self._meshes_mutable = new Mesh(this._gl, !0, tmp_meshes_mutable);
      } else self._meshes_mutable = !1;
    } }, { key: "switchMode", value: function value(index) {
      this._gl.uniform1i(this._uL_light_sys, index);
    } }, { key: "set", value: function value(options) {
      var options = options || {},
          mat4_model = options.model || !1,
          mat4_mvp = options.mvp || !1;ModelMatrix && (this.mat4_model = mat4_model, this._gl.uniformMatrix4fv(this._uL_mat4_model, !1, this.mat4_model.elements)), MvpMatrix && (this.mat4_mvp = mat4_mvp, this._gl.uniformMatrix4fv(this._uL_mat4_mvp, !1, this.mat4_mvp.elements));
    } }, { key: "update", value: function value(options) {
      var options = options || {},
          meshes = options.meshes || !1,
          gl = this._gl;if (meshes) {
        gl.bindBuffer(gl.ARRAY_BUFFER, this._dynamic_buffer);for (var mesh in meshes) {
          gl.bufferSubData(gl.ARRAY_BUFFER, 0, new Float32Array(meshes[mesh][0]));
        }
      }
    } }, { key: "draw", value: function value(symbol, mat4_model) {
      this.__draw_stack__[symbol] = mat4_model;
    } }, { key: "drawUI", value: function value(symbol, mat4_model) {
      this._UI_ELEMENTS_[symbol] = mat4_model;
    } }, { key: "render", value: function value() {
      var gl = this._gl,
          mat4_mvp = new Matrix4();if (mat4_mvp.set(this._camera.mat4_VP(this._gl, PERSPECTIVE, this.time.dT)), this._gl.viewport(0, 0, this._gl.drawingBufferWidth, this._gl.drawingBufferHeight), this._meshes_mutable) {
        gl.bindBuffer(gl.ARRAY_BUFFER, this._buffers[1]), bind_attrib(gl, "a_Position", 3, gl.FLOAT, 3 * FSIZE, 0);for (var i = 0; i < this._models.length; i++) {
          var mat4_model = this.__draw_stack__[i];if (mat4_model) {
            var t_mat4_mvp = new Matrix4(mat4_mvp);t_mat4_mvp.multiply(mat4_model), gl.uniformMatrix4fv(this._uL_mat4_model, !1, mat4_model.elements), gl.uniformMatrix4fv(this._uL_mat4_mvp, !1, t_mat4_mvp.elements);var model = this._models[i],
                mesh_index = model.mesh_index;if (mesh_index >= this._begin_mut_mesh) {
              mesh_index -= this._begin_mut_mesh;var range = this._meshes_mutable.get_start_end(mesh_index);this._meshes_fixed && (range[0] += this._meshes_fixed.indicies.length), model.draw(this._gl, this._uL_mat, range);
            }
          }
        }
      }if (this._meshes_fixed) {
        gl.bindBuffer(gl.ARRAY_BUFFER, this._buffers[0]), bind_attrib(gl, "a_Position", 3, gl.FLOAT, 3 * FSIZE, 0);for (var _i = 0; _i < this._models.length; _i++) {
          var _mat4_model = this.__draw_stack__[_i];if (_mat4_model) {
            var _t_mat4_mvp = new Matrix4(mat4_mvp);_t_mat4_mvp.multiply(_mat4_model), gl.uniformMatrix4fv(this._uL_mat4_model, !1, _mat4_model.elements), gl.uniformMatrix4fv(this._uL_mat4_mvp, !1, _t_mat4_mvp.elements);var _model = this._models[_i],
                _mesh_index = _model.mesh_index;_mesh_index < this._begin_mut_mesh && _model.draw(this._gl, this._uL_mat, this._meshes_fixed.get_start_end(_mesh_index));
          }
        }
      }this.__last_draw_stack__ = this.__draw_stack__;
    } }, { key: "_draw_hud", value: function value() {
      var mat4_mvp = new Matrix4(),
          mat4_view = new Matrix4(),
          zoom = 5,
          vpAspect = this._gl.drawingBufferWidth / this._gl.drawingBufferHeight;vpAspect >= 1 ? mat4_mvp.setOrtho(-vpAspect * zoom, vpAspect * zoom, -zoom, zoom, 0, 100) : mat4_mvp.setOrtho(-zoom, zoom, -1 / vpAspect * zoom, 1 / vpAspect * zoom, 0, 100), mat4_view.setLookAt(6, 0, 0, 0, 0, 0, 0, 0, 1), mat4_mvp = mat4_mvp.concat(mat4_view);for (var i = 0; i < this._UI_ELEMENTS_.length; i++) {
        var mat4_model = this._UI_ELEMENTS_[i];if (mat4_model) {
          var t_mat4_mvp = new Matrix4(mat4_mvp);t_mat4_mvp.multiply(mat4_model), this._gl.uniformMatrix4fv(this._uL_mat4_model, !1, mat4_model.elements), this._gl.uniformMatrix4fv(this._uL_mat4_mvp, !1, t_mat4_mvp.elements);var model = this._models[i],
              mesh_index = model.mesh_index;mesh_index < this._begin_mut_mesh && model.draw(this._gl, this._uL_mat, this._meshes_fixed.get_start_end(mesh_index));
        }
      }
    } }, { key: "_static_buffer", get: function get() {
      if (this._buffers[0]) return this._buffers[0];throw new Error("The static buffer is not initialized!");
    } }, { key: "_dynamic_buffer", get: function get() {
      if (this._buffers[1]) return this._buffers[1];throw new Error("The dynamic buffer is not initialized!");
    } }, { key: "_index_buffer", get: function get() {
      if (this._buffers[2]) return this._buffers[2];throw new Error("The index buffer is not initialized!");
    } }]), Scene;
}();Array.prototype.equals = function (arr) {
  if (this.length != arr.length) return !1;for (var i = 0; i < this.length; i++) {
    if (this[i] != arr[i]) return !1;
  }return !0;
};var vec3 = function () {
  function vec3(x, y, z) {
    _classCallCheck(this, vec3), this.elements = new Float32Array(3), this.elements[0] = x, this.elements[1] = y, this.elements[2] = z;
  }return _createClass(vec3, null, [{ key: "create", value: function value() {
      return new vec3(0, 0, 0);
    } }, { key: "length", value: function value(vec) {
      vec = vec.elements;var len = Math.sqrt(vec[0] * vec[0] + vec[1] * vec[1] + vec[2] * vec[2]);return len;
    } }, { key: "normalize", value: function value(vec) {
      vec = vec.elements;var len = Math.sqrt(vec[0] * vec[0] + vec[1] * vec[1] + vec[2] * vec[2]);return new vec3(vec[0] / len, vec[1] / len, vec[2] / len);
    } }, { key: "cross", value: function value(l1, l2) {
      return l1 = l1.elements, l2 = l2.elements, new vec3(l1[1] * l2[2] - l2[1] * l1[2], -(l1[0] * l2[2] - l1[2] * l2[0]), l1[0] * l2[1] - l1[1] * l2[0]);
    } }, { key: "add", value: function value(va, vb) {
      for (var tmp = new Float32Array(3), x = 0; 3 > x; x++) {
        tmp[x] = va.elements[x] + vb.elements[x];
      }return new vec3(tmp[0], tmp[1], tmp[2]);
    } }, { key: "subtract", value: function value(va, vb) {
      for (var tmp = new Float32Array(3), x = 0; 3 > x; x++) {
        tmp[x] = va.elements[x] - vb.elements[x];
      }return new vec3(tmp[0], tmp[1], tmp[2]);
    } }, { key: "multiply", value: function value(va, scalar) {
      for (var tmp = new Float32Array(3), x = 0; 3 > x; x++) {
        tmp[x] = va.elements[x] * scalar;
      }return new vec3(tmp[0], tmp[1], tmp[2]);
    } }]), vec3;
}(),
    quat4 = function () {
  function quat4(vec, w) {
    _classCallCheck(this, quat4), this.x = vec.elements[0], this.y = vec.elements[1], this.z = vec.elements[2], this.w = w;
  }return _createClass(quat4, [{ key: "normalize", value: function value() {
      var len = Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w);return 0 === len ? (this.x = 0, this.y = 0, this.z = 0, this.w = 0) : (len = 1 / len, this.x = this.x * len, this.y = this.y * len, this.z = this.z * len, this.w = this.w * len), this;
    } }, { key: "length", value: function value() {
      return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w);
    } }], [{ key: "toAxisAngle", value: function value(vec, angleDeg) {
      var ax = vec.elements[0],
          ay = vec.elements[1],
          az = vec.elements[2],
          mag2 = ax * ax + ay * ay + az * az,
          quat4_tmp = new quat4(new vec3(0, 0, 0), 0);if (mag2 - 1 > 1e-7 || -1e-7 > mag2 - 1) {
        var normer = 1 / Math.sqrt(mag2);ax *= normer, ay *= normer, az *= normer;
      }var halfAngle = angleDeg * Math.PI / 360,
          s = Math.sin(halfAngle);return quat4_tmp.x = ax * s, quat4_tmp.y = ay * s, quat4_tmp.z = az * s, quat4_tmp.w = Math.cos(halfAngle), quat4_tmp;
    } }, { key: "inverse", value: function value(quat) {
      return new quat4(new vec3(quat.x *= -1, quat.y *= -1, quat.z *= 1), quat.w);
    } }, { key: "multiply", value: function value(q1, q2) {
      var quat4_tmp = new quat4(new vec3(0, 0, 0), 0);return quat4_tmp.x = q1.x * q2.w + q1.y * q2.z - q1.z * q2.y + q1.w * q2.x, quat4_tmp.y = -q1.x * q2.z + q1.y * q2.w + q1.z * q2.x + q1.w * q2.y, quat4_tmp.z = q1.x * q2.y - q1.y * q2.x + q1.z * q2.w + q1.w * q2.z, quat4_tmp.w = -q1.x * q2.x - q1.y * q2.y - q1.z * q2.z + q1.w * q2.w, quat4_tmp;
    } }, { key: "multiplyVec3", value: function value(quat, vec) {
      var vec3_tmp = new vec3(0, 0, 0),
          x = vec.elements[0],
          y = vec.elements[1],
          z = vec.elements[2],
          qx = quat.x,
          qy = quat.y,
          qz = quat.z,
          qw = quat.w,
          ix = qw * x + qy * z - qz * y,
          iy = qw * y + qz * x - qx * z,
          iz = qw * z + qx * y - qy * x,
          iw = -qx * x - qy * y - qz * z;return vec3_tmp.elements[0] = ix * qw + iw * -qx + iy * -qz - iz * -qy, vec3_tmp.elements[1] = iy * qw + iw * -qy + iz * -qx - ix * -qz, vec3_tmp.elements[2] = iz * qw + iw * -qz + ix * -qy - iy * -qx, vec3_tmp;
    } }]), quat4;
}();
// Source: src/lib/cuon-matrix-mod.js
// cuon-matrix.js (c) 2012 kanda and matsuda
/**  * This is a class treating 4x4 matrix. * This class contains the function that is equivalent to OpenGL matrix stack. * The matrix after conversion is calculated by multiplying a conversion matrix from the right. * The matrix is replaced by the calculated result. */

/** * Constructor of Matrix4 * If opt_src is specified, new matrix is initialized by opt_src. * Otherwise, new matrix is initialized by identity matrix. * @param opt_src source matrix(option) */
var Matrix4 = function Matrix4(opt_src) {
  var i, s, d;
  if (opt_src && (typeof opt_src === "undefined" ? "undefined" : _typeof(opt_src)) === 'object' && opt_src.hasOwnProperty('elements')) {
    s = opt_src.elements;
    d = new Float32Array(16);
    for (i = 0; i < 16; ++i) {
      d[i] = s[i];
    }
    this.elements = d;
  } else {
    this.elements = new Float32Array([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]);
  }
};

/** * Set the identity matrix. * @return this */
Matrix4.prototype.setIdentity = function () {
  var e = this.elements;
  e[0] = 1;e[4] = 0;e[8] = 0;e[12] = 0;
  e[1] = 0;e[5] = 1;e[9] = 0;e[13] = 0;
  e[2] = 0;e[6] = 0;e[10] = 1;e[14] = 0;
  e[3] = 0;e[7] = 0;e[11] = 0;e[15] = 1;
  return this;
};

/** * Copy matrix. * @param src source matrix * @return this */
Matrix4.prototype.set = function (src) {
  var i, s, d;

  s = src.elements;
  d = this.elements;

  if (s === d) {
    return;
  }

  for (i = 0; i < 16; ++i) {
    d[i] = s[i];
  }

  return this;
};

/** * Multiply the matrix from the right. * @param other The multiply matrix * @return this */
Matrix4.prototype.concat = function (other) {
  var i, e, a, b, ai0, ai1, ai2, ai3;

  // Calculate e = a * b
  e = this.elements;
  a = this.elements;
  b = other.elements;

  // If e equals b, copy b to temporary matrix.
  if (e === b) {
    b = new Float32Array(16);
    for (i = 0; i < 16; ++i) {
      b[i] = e[i];
    }
  }

  for (i = 0; i < 4; i++) {
    ai0 = a[i];ai1 = a[i + 4];ai2 = a[i + 8];ai3 = a[i + 12];
    e[i] = ai0 * b[0] + ai1 * b[1] + ai2 * b[2] + ai3 * b[3];
    e[i + 4] = ai0 * b[4] + ai1 * b[5] + ai2 * b[6] + ai3 * b[7];
    e[i + 8] = ai0 * b[8] + ai1 * b[9] + ai2 * b[10] + ai3 * b[11];
    e[i + 12] = ai0 * b[12] + ai1 * b[13] + ai2 * b[14] + ai3 * b[15];
  }

  return this;
};
Matrix4.prototype.multiply = Matrix4.prototype.concat;

/** * Multiply the three-dimensional vector. * @param pos  The multiply vector * @return The result of multiplication(Float32Array) */
Matrix4.prototype.multiplyVec3 = function (pos) {
  var e = this.elements;
  var p = pos.elements;
  var v = new vec3(0, 0, 0);
  var result = v.elements;

  result[0] = p[0] * e[0] + p[1] * e[4] + p[2] * e[8] + e[11];
  result[1] = p[0] * e[1] + p[1] * e[5] + p[2] * e[9] + e[12];
  result[2] = p[0] * e[2] + p[1] * e[6] + p[2] * e[10] + e[13];

  return v;
};

/** * Multiply the four-dimensional vector. * @param pos  The multiply vector * @return The result of multiplication(Float32Array) */
Matrix4.prototype.multiplyVector4 = function (pos) {
  var e = this.elements;
  var p = pos.elements;
  var v = new Vector4();
  var result = v.elements;

  result[0] = p[0] * e[0] + p[1] * e[4] + p[2] * e[8] + p[3] * e[12];
  result[1] = p[0] * e[1] + p[1] * e[5] + p[2] * e[9] + p[3] * e[13];
  result[2] = p[0] * e[2] + p[1] * e[6] + p[2] * e[10] + p[3] * e[14];
  result[3] = p[0] * e[3] + p[1] * e[7] + p[2] * e[11] + p[3] * e[15];

  return v;
};

/** * Transpose the matrix. * @return this */
Matrix4.prototype.transpose = function () {
  var e, t;

  e = this.elements;

  t = e[1];e[1] = e[4];e[4] = t;
  t = e[2];e[2] = e[8];e[8] = t;
  t = e[3];e[3] = e[12];e[12] = t;
  t = e[6];e[6] = e[9];e[9] = t;
  t = e[7];e[7] = e[13];e[13] = t;
  t = e[11];e[11] = e[14];e[14] = t;

  return this;
};

/** * Calculate the inverse matrix of specified matrix, and set to this. * @param other The source matrix * @return this */
Matrix4.prototype.setInverseOf = function (other) {
  var i, s, d, inv, det;

  s = other.elements;
  d = this.elements;
  inv = new Float32Array(16);

  inv[0] = s[5] * s[10] * s[15] - s[5] * s[11] * s[14] - s[9] * s[6] * s[15] + s[9] * s[7] * s[14] + s[13] * s[6] * s[11] - s[13] * s[7] * s[10];
  inv[4] = -s[4] * s[10] * s[15] + s[4] * s[11] * s[14] + s[8] * s[6] * s[15] - s[8] * s[7] * s[14] - s[12] * s[6] * s[11] + s[12] * s[7] * s[10];
  inv[8] = s[4] * s[9] * s[15] - s[4] * s[11] * s[13] - s[8] * s[5] * s[15] + s[8] * s[7] * s[13] + s[12] * s[5] * s[11] - s[12] * s[7] * s[9];
  inv[12] = -s[4] * s[9] * s[14] + s[4] * s[10] * s[13] + s[8] * s[5] * s[14] - s[8] * s[6] * s[13] - s[12] * s[5] * s[10] + s[12] * s[6] * s[9];

  inv[1] = -s[1] * s[10] * s[15] + s[1] * s[11] * s[14] + s[9] * s[2] * s[15] - s[9] * s[3] * s[14] - s[13] * s[2] * s[11] + s[13] * s[3] * s[10];
  inv[5] = s[0] * s[10] * s[15] - s[0] * s[11] * s[14] - s[8] * s[2] * s[15] + s[8] * s[3] * s[14] + s[12] * s[2] * s[11] - s[12] * s[3] * s[10];
  inv[9] = -s[0] * s[9] * s[15] + s[0] * s[11] * s[13] + s[8] * s[1] * s[15] - s[8] * s[3] * s[13] - s[12] * s[1] * s[11] + s[12] * s[3] * s[9];
  inv[13] = s[0] * s[9] * s[14] - s[0] * s[10] * s[13] - s[8] * s[1] * s[14] + s[8] * s[2] * s[13] + s[12] * s[1] * s[10] - s[12] * s[2] * s[9];

  inv[2] = s[1] * s[6] * s[15] - s[1] * s[7] * s[14] - s[5] * s[2] * s[15] + s[5] * s[3] * s[14] + s[13] * s[2] * s[7] - s[13] * s[3] * s[6];
  inv[6] = -s[0] * s[6] * s[15] + s[0] * s[7] * s[14] + s[4] * s[2] * s[15] - s[4] * s[3] * s[14] - s[12] * s[2] * s[7] + s[12] * s[3] * s[6];
  inv[10] = s[0] * s[5] * s[15] - s[0] * s[7] * s[13] - s[4] * s[1] * s[15] + s[4] * s[3] * s[13] + s[12] * s[1] * s[7] - s[12] * s[3] * s[5];
  inv[14] = -s[0] * s[5] * s[14] + s[0] * s[6] * s[13] + s[4] * s[1] * s[14] - s[4] * s[2] * s[13] - s[12] * s[1] * s[6] + s[12] * s[2] * s[5];

  inv[3] = -s[1] * s[6] * s[11] + s[1] * s[7] * s[10] + s[5] * s[2] * s[11] - s[5] * s[3] * s[10] - s[9] * s[2] * s[7] + s[9] * s[3] * s[6];
  inv[7] = s[0] * s[6] * s[11] - s[0] * s[7] * s[10] - s[4] * s[2] * s[11] + s[4] * s[3] * s[10] + s[8] * s[2] * s[7] - s[8] * s[3] * s[6];
  inv[11] = -s[0] * s[5] * s[11] + s[0] * s[7] * s[9] + s[4] * s[1] * s[11] - s[4] * s[3] * s[9] - s[8] * s[1] * s[7] + s[8] * s[3] * s[5];
  inv[15] = s[0] * s[5] * s[10] - s[0] * s[6] * s[9] - s[4] * s[1] * s[10] + s[4] * s[2] * s[9] + s[8] * s[1] * s[6] - s[8] * s[2] * s[5];

  det = s[0] * inv[0] + s[1] * inv[4] + s[2] * inv[8] + s[3] * inv[12];
  if (det === 0) {
    return this;
  }

  det = 1 / det;
  for (i = 0; i < 16; i++) {
    d[i] = inv[i] * det;
  }

  return this;
};

/** * Calculate the inverse matrix of this, and set to this. * @return this */
Matrix4.prototype.invert = function () {
  return this.setInverseOf(this);
};

/** * Set the orthographic projection matrix. * @param left The coordinate of the left of clipping plane. * @param right The coordinate of the right of clipping plane. * @param bottom The coordinate of the bottom of clipping plane. * @param top The coordinate of the top top clipping plane. * @param near The distances to the nearer depth clipping plane. This value is minus if the plane is to be behind the viewer. * @param far The distances to the farther depth clipping plane. This value is minus if the plane is to be behind the viewer. * @return this */
Matrix4.prototype.setOrtho = function (left, right, bottom, top, near, far) {
  var e, rw, rh, rd;

  if (left === right || bottom === top || near === far) {
    throw 'null frustum';
  }

  rw = 1 / (right - left);
  rh = 1 / (top - bottom);
  rd = 1 / (far - near);

  e = this.elements;

  e[0] = 2 * rw;
  e[1] = 0;
  e[2] = 0;
  e[3] = 0;

  e[4] = 0;
  e[5] = 2 * rh;
  e[6] = 0;
  e[7] = 0;

  e[8] = 0;
  e[9] = 0;
  e[10] = -2 * rd;
  e[11] = 0;

  e[12] = -(right + left) * rw;
  e[13] = -(top + bottom) * rh;
  e[14] = -(far + near) * rd;
  e[15] = 1;

  return this;
};

/** * Multiply the orthographic projection matrix from the right. * @param left The coordinate of the left of clipping plane. * @param right The coordinate of the right of clipping plane. * @param bottom The coordinate of the bottom of clipping plane. * @param top The coordinate of the top top clipping plane. * @param near The distances to the nearer depth clipping plane. This value is minus if the plane is to be behind the viewer. * @param far The distances to the farther depth clipping plane. This value is minus if the plane is to be behind the viewer. * @return this */
Matrix4.prototype.ortho = function (left, right, bottom, top, near, far) {
  return this.concat(new Matrix4().setOrtho(left, right, bottom, top, near, far));
};

/** * Set the perspective projection matrix. * @param left The coordinate of the left of clipping plane. * @param right The coordinate of the right of clipping plane. * @param bottom The coordinate of the bottom of clipping plane. * @param top The coordinate of the top top clipping plane. * @param near The distances to the nearer depth clipping plane. This value must be plus value. * @param far The distances to the farther depth clipping plane. This value must be plus value. * @return this */
Matrix4.prototype.setFrustum = function (left, right, bottom, top, near, far) {
  var e, rw, rh, rd;

  if (left === right || top === bottom || near === far) {
    throw 'null frustum';
  }
  if (near <= 0) {
    throw 'near <= 0';
  }
  if (far <= 0) {
    throw 'far <= 0';
  }

  rw = 1 / (right - left);
  rh = 1 / (top - bottom);
  rd = 1 / (far - near);

  e = this.elements;

  e[0] = 2 * near * rw;
  e[1] = 0;
  e[2] = 0;
  e[3] = 0;

  e[4] = 0;
  e[5] = 2 * near * rh;
  e[6] = 0;
  e[7] = 0;

  e[8] = (right + left) * rw;
  e[9] = (top + bottom) * rh;
  e[10] = -(far + near) * rd;
  e[11] = -1;

  e[12] = 0;
  e[13] = 0;
  e[14] = -2 * near * far * rd;
  e[15] = 0;

  return this;
};

/** * Multiply the perspective projection matrix from the right. * @param left The coordinate of the left of clipping plane. * @param right The coordinate of the right of clipping plane. * @param bottom The coordinate of the bottom of clipping plane. * @param top The coordinate of the top top clipping plane. * @param near The distances to the nearer depth clipping plane. This value must be plus value. * @param far The distances to the farther depth clipping plane. This value must be plus value. * @return this */
Matrix4.prototype.frustum = function (left, right, bottom, top, near, far) {
  return this.concat(new Matrix4().setFrustum(left, right, bottom, top, near, far));
};

/** * Set the perspective projection matrix by fovy and aspect. * @param fovy The angle between the upper and lower sides of the frustum. * @param aspect The aspect ratio of the frustum. (width/height) * @param near The distances to the nearer depth clipping plane. This value must be plus value. * @param far The distances to the farther depth clipping plane. This value must be plus value. * @return this */
Matrix4.prototype.setPerspective = function (fovy, aspect, near, far) {
  var e, rd, s, ct;

  if (near === far || aspect === 0) {
    throw 'null frustum';
  }
  if (near <= 0) {
    throw 'near <= 0';
  }
  if (far <= 0) {
    throw 'far <= 0';
  }

  fovy = Math.PI * fovy / 180 / 2;
  s = Math.sin(fovy);
  if (s === 0) {
    throw 'null frustum';
  }

  rd = 1 / (far - near);
  ct = Math.cos(fovy) / s;

  e = this.elements;

  e[0] = ct / aspect;
  e[1] = 0;
  e[2] = 0;
  e[3] = 0;

  e[4] = 0;
  e[5] = ct;
  e[6] = 0;
  e[7] = 0;

  e[8] = 0;
  e[9] = 0;
  e[10] = -(far + near) * rd;
  e[11] = -1;

  e[12] = 0;
  e[13] = 0;
  e[14] = -2 * near * far * rd;
  e[15] = 0;

  return this;
};

/** * Multiply the perspective projection matrix from the right. * @param fovy The angle between the upper and lower sides of the frustum. * @param aspect The aspect ratio of the frustum. (width/height) * @param near The distances to the nearer depth clipping plane. This value must be plus value. * @param far The distances to the farther depth clipping plane. This value must be plus value. * @return this */
Matrix4.prototype.perspective = function (fovy, aspect, near, far) {
  return this.concat(new Matrix4().setPerspective(fovy, aspect, near, far));
};

/** * Set the matrix for scaling. * @param x The scale factor along the X axis * @param y The scale factor along the Y axis * @param z The scale factor along the Z axis * @return this */
Matrix4.prototype.setScale = function (x, y, z) {
  var e = this.elements;
  e[0] = x;e[4] = 0;e[8] = 0;e[12] = 0;
  e[1] = 0;e[5] = y;e[9] = 0;e[13] = 0;
  e[2] = 0;e[6] = 0;e[10] = z;e[14] = 0;
  e[3] = 0;e[7] = 0;e[11] = 0;e[15] = 1;
  return this;
};

/** * Multiply the matrix for scaling from the right. * @param x The scale factor along the X axis * @param y The scale factor along the Y axis * @param z The scale factor along the Z axis * @return this */
Matrix4.prototype.scale = function (x, y, z) {
  var e = this.elements;
  e[0] *= x;e[4] *= y;e[8] *= z;
  e[1] *= x;e[5] *= y;e[9] *= z;
  e[2] *= x;e[6] *= y;e[10] *= z;
  e[3] *= x;e[7] *= y;e[11] *= z;
  return this;
};

/** * Set the matrix for translation. * @param x The X value of a translation. * @param y The Y value of a translation. * @param z The Z value of a translation. * @return this */
Matrix4.prototype.setTranslate = function (x, y, z) {
  var e = this.elements;
  e[0] = 1;e[4] = 0;e[8] = 0;e[12] = x;
  e[1] = 0;e[5] = 1;e[9] = 0;e[13] = y;
  e[2] = 0;e[6] = 0;e[10] = 1;e[14] = z;
  e[3] = 0;e[7] = 0;e[11] = 0;e[15] = 1;
  return this;
};

/** * Multiply the matrix for translation from the right. * @param x The X value of a translation. * @param y The Y value of a translation. * @param z The Z value of a translation. * @return this */
Matrix4.prototype.translate = function (x, y, z) {
  var e = this.elements;
  e[12] += e[0] * x + e[4] * y + e[8] * z;
  e[13] += e[1] * x + e[5] * y + e[9] * z;
  e[14] += e[2] * x + e[6] * y + e[10] * z;
  e[15] += e[3] * x + e[7] * y + e[11] * z;
  return this;
};

/** * Set the matrix for rotation. * The vector of rotation axis may not be normalized. * @param angle The angle of rotation (degrees) * @param x The X coordinate of vector of rotation axis. * @param y The Y coordinate of vector of rotation axis. * @param z The Z coordinate of vector of rotation axis. * @return this */
Matrix4.prototype.setRotate = function (angle, x, y, z) {
  var e, s, c, len, rlen, nc, xy, yz, zx, xs, ys, zs;

  angle = Math.PI * angle / 180;
  e = this.elements;

  s = Math.sin(angle);
  c = Math.cos(angle);

  if (0 !== x && 0 === y && 0 === z) {
    // Rotation around X axis
    if (x < 0) {
      s = -s;
    }
    e[0] = 1;e[4] = 0;e[8] = 0;e[12] = 0;
    e[1] = 0;e[5] = c;e[9] = -s;e[13] = 0;
    e[2] = 0;e[6] = s;e[10] = c;e[14] = 0;
    e[3] = 0;e[7] = 0;e[11] = 0;e[15] = 1;
  } else if (0 === x && 0 !== y && 0 === z) {
    // Rotation around Y axis
    if (y < 0) {
      s = -s;
    }
    e[0] = c;e[4] = 0;e[8] = s;e[12] = 0;
    e[1] = 0;e[5] = 1;e[9] = 0;e[13] = 0;
    e[2] = -s;e[6] = 0;e[10] = c;e[14] = 0;
    e[3] = 0;e[7] = 0;e[11] = 0;e[15] = 1;
  } else if (0 === x && 0 === y && 0 !== z) {
    // Rotation around Z axis
    if (z < 0) {
      s = -s;
    }
    e[0] = c;e[4] = -s;e[8] = 0;e[12] = 0;
    e[1] = s;e[5] = c;e[9] = 0;e[13] = 0;
    e[2] = 0;e[6] = 0;e[10] = 1;e[14] = 0;
    e[3] = 0;e[7] = 0;e[11] = 0;e[15] = 1;
  } else {
    // Rotation around another axis
    len = Math.sqrt(x * x + y * y + z * z);
    if (len !== 1) {
      rlen = 1 / len;
      x *= rlen;
      y *= rlen;
      z *= rlen;
    }
    nc = 1 - c;
    xy = x * y;
    yz = y * z;
    zx = z * x;
    xs = x * s;
    ys = y * s;
    zs = z * s;

    e[0] = x * x * nc + c;
    e[1] = xy * nc + zs;
    e[2] = zx * nc - ys;
    e[3] = 0;

    e[4] = xy * nc - zs;
    e[5] = y * y * nc + c;
    e[6] = yz * nc + xs;
    e[7] = 0;

    e[8] = zx * nc + ys;
    e[9] = yz * nc - xs;
    e[10] = z * z * nc + c;
    e[11] = 0;

    e[12] = 0;
    e[13] = 0;
    e[14] = 0;
    e[15] = 1;
  }

  return this;
};

/** * Multiply the matrix for rotation from the right. * The vector of rotation axis may not be normalized. * @param angle The angle of rotation (degrees) * @param x The X coordinate of vector of rotation axis. * @param y The Y coordinate of vector of rotation axis. * @param z The Z coordinate of vector of rotation axis. * @return this */
Matrix4.prototype.rotate = function (angle, x, y, z) {
  return this.concat(new Matrix4().setRotate(angle, x, y, z));
};

/** * Set the viewing matrix. * @param eyeX, eyeY, eyeZ The position of the eye point. * @param centerX, centerY, centerZ The position of the reference point. * @param upX, upY, upZ The direction of the up vector. * @return this */
Matrix4.prototype.setLookAt = function (eyeX, eyeY, eyeZ, centerX, centerY, centerZ, upX, upY, upZ) {
  var e, fx, fy, fz, rlf, sx, sy, sz, rls, ux, uy, uz;

  fx = centerX - eyeX;
  fy = centerY - eyeY;
  fz = centerZ - eyeZ;

  // Normalize f.
  rlf = 1 / Math.sqrt(fx * fx + fy * fy + fz * fz);
  fx *= rlf;
  fy *= rlf;
  fz *= rlf;

  // Calculate cross product of f and up.
  sx = fy * upZ - fz * upY;
  sy = fz * upX - fx * upZ;
  sz = fx * upY - fy * upX;

  // Normalize s.
  rls = 1 / Math.sqrt(sx * sx + sy * sy + sz * sz);
  sx *= rls;
  sy *= rls;
  sz *= rls;

  // Calculate cross product of s and f.
  ux = sy * fz - sz * fy;
  uy = sz * fx - sx * fz;
  uz = sx * fy - sy * fx;

  // Set to this.
  e = this.elements;
  e[0] = sx;
  e[1] = ux;
  e[2] = -fx;
  e[3] = 0;

  e[4] = sy;
  e[5] = uy;
  e[6] = -fy;
  e[7] = 0;

  e[8] = sz;
  e[9] = uz;
  e[10] = -fz;
  e[11] = 0;

  e[12] = 0;
  e[13] = 0;
  e[14] = 0;
  e[15] = 1;

  // Translate.
  return this.translate(-eyeX, -eyeY, -eyeZ);
};

/** * Multiply the viewing matrix from the right. * @param eyeX, eyeY, eyeZ The position of the eye point. * @param centerX, centerY, centerZ The position of the reference point. * @param upX, upY, upZ The direction of the up vector. * @return this */
Matrix4.prototype.lookAt = function (eyeX, eyeY, eyeZ, centerX, centerY, centerZ, upX, upY, upZ) {
  return this.concat(new Matrix4().setLookAt(eyeX, eyeY, eyeZ, centerX, centerY, centerZ, upX, upY, upZ));
};

/** * Multiply the matrix for project vertex to plane from the right. * @param plane The array[A, B, C, D] of the equation of plane "Ax + By + Cz + D = 0". * @param light The array which stored coordinates of the light. if light[3]=0, treated as parallel light. * @return this */
Matrix4.prototype.dropShadow = function (plane, light) {
  var mat = new Matrix4();
  var e = mat.elements;

  var dot = plane[0] * light[0] + plane[1] * light[1] + plane[2] * light[2] + plane[3] * light[3];

  e[0] = dot - light[0] * plane[0];
  e[1] = -light[1] * plane[0];
  e[2] = -light[2] * plane[0];
  e[3] = -light[3] * plane[0];

  e[4] = -light[0] * plane[1];
  e[5] = dot - light[1] * plane[1];
  e[6] = -light[2] * plane[1];
  e[7] = -light[3] * plane[1];

  e[8] = -light[0] * plane[2];
  e[9] = -light[1] * plane[2];
  e[10] = dot - light[2] * plane[2];
  e[11] = -light[3] * plane[2];

  e[12] = -light[0] * plane[3];
  e[13] = -light[1] * plane[3];
  e[14] = -light[2] * plane[3];
  e[15] = dot - light[3] * plane[3];

  return this.concat(mat);
};

/** * Multiply the matrix for project vertex to plane from the right.(Projected by parallel light.) * @param normX, normY, normZ The normal vector of the plane.(Not necessary to be normalized.) * @param planeX, planeY, planeZ The coordinate of arbitrary points on a plane. * @param lightX, lightY, lightZ The vector of the direction of light.(Not necessary to be normalized.) * @return this */
Matrix4.prototype.dropShadowDirectionally = function (normX, normY, normZ, planeX, planeY, planeZ, lightX, lightY, lightZ) {
  var a = planeX * normX + planeY * normY + planeZ * normZ;
  return this.dropShadow([normX, normY, normZ, -a], [lightX, lightY, lightZ, 0]);
};

/** * Constructor of Vector4 * If opt_src is specified, new vector is initialized by opt_src. * @param opt_src source vector(option) */
var Vector4 = function Vector4(opt_src) {
  var v = new Float32Array(4);
  if (opt_src && (typeof opt_src === "undefined" ? "undefined" : _typeof(opt_src)) === 'object') {
    v[0] = opt_src[0];v[1] = opt_src[1];v[2] = opt_src[2];v[3] = opt_src[3];
  }
  this.elements = v;
};

/** * Additions by Adrien Katsuya Tateno * January 28, 2014 * * pushMatrix(myMat)   * Puts contents of 'myMat' matrix on top of a push-down stack * @param myMat the matrix to store * * myMat = popMatrix() * Removes the top matrix from a push-down stack * @return the matrix found at the top of the stack */
var __cuon_matrix_mod_stack = [];
function pushMatrix(mat) {
  __cuon_matrix_mod_stack.push(new Matrix4(mat));
}
function popMatrix() {
  return __cuon_matrix_mod_stack.pop();
}

// Source: src/lib/cuon-matrix.js
// cuon-matrix.js (c) 2012 kanda and matsuda
/** 
 * This is a class treating 4x4 matrix.
 * This class contains the function that is equivalent to OpenGL matrix stack.
 * The matrix after conversion is calculated by multiplying a conversion matrix from the right.
 * The matrix is replaced by the calculated result.
 */

/**
 * Constructor of Matrix4
 * If opt_src is specified, new matrix is initialized by opt_src.
 * Otherwise, new matrix is initialized by identity matrix.
 * @param opt_src source matrix(option)
 */
var Matrix4 = function Matrix4(opt_src) {
  var i, s, d;
  if (opt_src && (typeof opt_src === "undefined" ? "undefined" : _typeof(opt_src)) === 'object' && opt_src.hasOwnProperty('elements')) {
    s = opt_src.elements;
    d = new Float32Array(16);
    for (i = 0; i < 16; ++i) {
      d[i] = s[i];
    }
    this.elements = d;
  } else {
    this.elements = new Float32Array([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]);
  }
};

/**
 * Set the identity matrix.
 * @return this
 */
Matrix4.prototype.setIdentity = function () {
  var e = this.elements;
  e[0] = 1;e[4] = 0;e[8] = 0;e[12] = 0;
  e[1] = 0;e[5] = 1;e[9] = 0;e[13] = 0;
  e[2] = 0;e[6] = 0;e[10] = 1;e[14] = 0;
  e[3] = 0;e[7] = 0;e[11] = 0;e[15] = 1;
  return this;
};

/**
 * Copy matrix.
 * @param src source matrix
 * @return this
 */
Matrix4.prototype.set = function (src) {
  var i, s, d;

  s = src.elements;
  d = this.elements;

  if (s === d) {
    return;
  }

  for (i = 0; i < 16; ++i) {
    d[i] = s[i];
  }

  return this;
};

/**
 * Multiply the matrix from the right.
 * @param other The multiply matrix
 * @return this
 */
Matrix4.prototype.concat = function (other) {
  var i, e, a, b, ai0, ai1, ai2, ai3;

  // Calculate e = a * b
  e = this.elements;
  a = this.elements;
  b = other.elements;

  // If e equals b, copy b to temporary matrix.
  if (e === b) {
    b = new Float32Array(16);
    for (i = 0; i < 16; ++i) {
      b[i] = e[i];
    }
  }

  for (i = 0; i < 4; i++) {
    ai0 = a[i];ai1 = a[i + 4];ai2 = a[i + 8];ai3 = a[i + 12];
    e[i] = ai0 * b[0] + ai1 * b[1] + ai2 * b[2] + ai3 * b[3];
    e[i + 4] = ai0 * b[4] + ai1 * b[5] + ai2 * b[6] + ai3 * b[7];
    e[i + 8] = ai0 * b[8] + ai1 * b[9] + ai2 * b[10] + ai3 * b[11];
    e[i + 12] = ai0 * b[12] + ai1 * b[13] + ai2 * b[14] + ai3 * b[15];
  }

  return this;
};
Matrix4.prototype.multiply = Matrix4.prototype.concat;

/**
 * Multiply the three-dimensional vector.
 * @param pos  The multiply vector
 * @return The result of multiplication(Float32Array)
 */
Matrix4.prototype.multiplyVector3 = function (pos) {
  var e = this.elements;
  var p = pos.elements;
  var v = new Vector3();
  var result = v.elements;

  result[0] = p[0] * e[0] + p[1] * e[4] + p[2] * e[8] + e[11];
  result[1] = p[0] * e[1] + p[1] * e[5] + p[2] * e[9] + e[12];
  result[2] = p[0] * e[2] + p[1] * e[6] + p[2] * e[10] + e[13];

  return v;
};

/**
 * Multiply the four-dimensional vector.
 * @param pos  The multiply vector
 * @return The result of multiplication(Float32Array)
 */
Matrix4.prototype.multiplyVector4 = function (pos) {
  var e = this.elements;
  var p = pos.elements;
  var v = new Vector4();
  var result = v.elements;

  result[0] = p[0] * e[0] + p[1] * e[4] + p[2] * e[8] + p[3] * e[12];
  result[1] = p[0] * e[1] + p[1] * e[5] + p[2] * e[9] + p[3] * e[13];
  result[2] = p[0] * e[2] + p[1] * e[6] + p[2] * e[10] + p[3] * e[14];
  result[3] = p[0] * e[3] + p[1] * e[7] + p[2] * e[11] + p[3] * e[15];

  return v;
};

/**
 * Transpose the matrix.
 * @return this
 */
Matrix4.prototype.transpose = function () {
  var e, t;

  e = this.elements;

  t = e[1];e[1] = e[4];e[4] = t;
  t = e[2];e[2] = e[8];e[8] = t;
  t = e[3];e[3] = e[12];e[12] = t;
  t = e[6];e[6] = e[9];e[9] = t;
  t = e[7];e[7] = e[13];e[13] = t;
  t = e[11];e[11] = e[14];e[14] = t;

  return this;
};

/**
 * Calculate the inverse matrix of specified matrix, and set to this.
 * @param other The source matrix
 * @return this
 */
Matrix4.prototype.setInverseOf = function (other) {
  var i, s, d, inv, det;

  s = other.elements;
  d = this.elements;
  inv = new Float32Array(16);

  inv[0] = s[5] * s[10] * s[15] - s[5] * s[11] * s[14] - s[9] * s[6] * s[15] + s[9] * s[7] * s[14] + s[13] * s[6] * s[11] - s[13] * s[7] * s[10];
  inv[4] = -s[4] * s[10] * s[15] + s[4] * s[11] * s[14] + s[8] * s[6] * s[15] - s[8] * s[7] * s[14] - s[12] * s[6] * s[11] + s[12] * s[7] * s[10];
  inv[8] = s[4] * s[9] * s[15] - s[4] * s[11] * s[13] - s[8] * s[5] * s[15] + s[8] * s[7] * s[13] + s[12] * s[5] * s[11] - s[12] * s[7] * s[9];
  inv[12] = -s[4] * s[9] * s[14] + s[4] * s[10] * s[13] + s[8] * s[5] * s[14] - s[8] * s[6] * s[13] - s[12] * s[5] * s[10] + s[12] * s[6] * s[9];

  inv[1] = -s[1] * s[10] * s[15] + s[1] * s[11] * s[14] + s[9] * s[2] * s[15] - s[9] * s[3] * s[14] - s[13] * s[2] * s[11] + s[13] * s[3] * s[10];
  inv[5] = s[0] * s[10] * s[15] - s[0] * s[11] * s[14] - s[8] * s[2] * s[15] + s[8] * s[3] * s[14] + s[12] * s[2] * s[11] - s[12] * s[3] * s[10];
  inv[9] = -s[0] * s[9] * s[15] + s[0] * s[11] * s[13] + s[8] * s[1] * s[15] - s[8] * s[3] * s[13] - s[12] * s[1] * s[11] + s[12] * s[3] * s[9];
  inv[13] = s[0] * s[9] * s[14] - s[0] * s[10] * s[13] - s[8] * s[1] * s[14] + s[8] * s[2] * s[13] + s[12] * s[1] * s[10] - s[12] * s[2] * s[9];

  inv[2] = s[1] * s[6] * s[15] - s[1] * s[7] * s[14] - s[5] * s[2] * s[15] + s[5] * s[3] * s[14] + s[13] * s[2] * s[7] - s[13] * s[3] * s[6];
  inv[6] = -s[0] * s[6] * s[15] + s[0] * s[7] * s[14] + s[4] * s[2] * s[15] - s[4] * s[3] * s[14] - s[12] * s[2] * s[7] + s[12] * s[3] * s[6];
  inv[10] = s[0] * s[5] * s[15] - s[0] * s[7] * s[13] - s[4] * s[1] * s[15] + s[4] * s[3] * s[13] + s[12] * s[1] * s[7] - s[12] * s[3] * s[5];
  inv[14] = -s[0] * s[5] * s[14] + s[0] * s[6] * s[13] + s[4] * s[1] * s[14] - s[4] * s[2] * s[13] - s[12] * s[1] * s[6] + s[12] * s[2] * s[5];

  inv[3] = -s[1] * s[6] * s[11] + s[1] * s[7] * s[10] + s[5] * s[2] * s[11] - s[5] * s[3] * s[10] - s[9] * s[2] * s[7] + s[9] * s[3] * s[6];
  inv[7] = s[0] * s[6] * s[11] - s[0] * s[7] * s[10] - s[4] * s[2] * s[11] + s[4] * s[3] * s[10] + s[8] * s[2] * s[7] - s[8] * s[3] * s[6];
  inv[11] = -s[0] * s[5] * s[11] + s[0] * s[7] * s[9] + s[4] * s[1] * s[11] - s[4] * s[3] * s[9] - s[8] * s[1] * s[7] + s[8] * s[3] * s[5];
  inv[15] = s[0] * s[5] * s[10] - s[0] * s[6] * s[9] - s[4] * s[1] * s[10] + s[4] * s[2] * s[9] + s[8] * s[1] * s[6] - s[8] * s[2] * s[5];

  det = s[0] * inv[0] + s[1] * inv[4] + s[2] * inv[8] + s[3] * inv[12];
  if (det === 0) {
    return this;
  }

  det = 1 / det;
  for (i = 0; i < 16; i++) {
    d[i] = inv[i] * det;
  }

  return this;
};

/**
 * Calculate the inverse matrix of this, and set to this.
 * @return this
 */
Matrix4.prototype.invert = function () {
  return this.setInverseOf(this);
};

/**
 * Set the orthographic projection matrix.
 * @param left The coordinate of the left of clipping plane.
 * @param right The coordinate of the right of clipping plane.
 * @param bottom The coordinate of the bottom of clipping plane.
 * @param top The coordinate of the top top clipping plane.
 * @param near The distances to the nearer depth clipping plane. This value is minus if the plane is to be behind the viewer.
 * @param far The distances to the farther depth clipping plane. This value is minus if the plane is to be behind the viewer.
 * @return this
 */
Matrix4.prototype.setOrtho = function (left, right, bottom, top, near, far) {
  var e, rw, rh, rd;

  if (left === right || bottom === top || near === far) {
    throw 'null frustum';
  }

  rw = 1 / (right - left);
  rh = 1 / (top - bottom);
  rd = 1 / (far - near);

  e = this.elements;

  e[0] = 2 * rw;
  e[1] = 0;
  e[2] = 0;
  e[3] = 0;

  e[4] = 0;
  e[5] = 2 * rh;
  e[6] = 0;
  e[7] = 0;

  e[8] = 0;
  e[9] = 0;
  e[10] = -2 * rd;
  e[11] = 0;

  e[12] = -(right + left) * rw;
  e[13] = -(top + bottom) * rh;
  e[14] = -(far + near) * rd;
  e[15] = 1;

  return this;
};

/**
 * Multiply the orthographic projection matrix from the right.
 * @param left The coordinate of the left of clipping plane.
 * @param right The coordinate of the right of clipping plane.
 * @param bottom The coordinate of the bottom of clipping plane.
 * @param top The coordinate of the top top clipping plane.
 * @param near The distances to the nearer depth clipping plane. This value is minus if the plane is to be behind the viewer.
 * @param far The distances to the farther depth clipping plane. This value is minus if the plane is to be behind the viewer.
 * @return this
 */
Matrix4.prototype.ortho = function (left, right, bottom, top, near, far) {
  return this.concat(new Matrix4().setOrtho(left, right, bottom, top, near, far));
};

/**
 * Set the perspective projection matrix.
 * @param left The coordinate of the left of clipping plane.
 * @param right The coordinate of the right of clipping plane.
 * @param bottom The coordinate of the bottom of clipping plane.
 * @param top The coordinate of the top top clipping plane.
 * @param near The distances to the nearer depth clipping plane. This value must be plus value.
 * @param far The distances to the farther depth clipping plane. This value must be plus value.
 * @return this
 */
Matrix4.prototype.setFrustum = function (left, right, bottom, top, near, far) {
  var e, rw, rh, rd;

  if (left === right || top === bottom || near === far) {
    throw 'null frustum';
  }
  if (near <= 0) {
    throw 'near <= 0';
  }
  if (far <= 0) {
    throw 'far <= 0';
  }

  rw = 1 / (right - left);
  rh = 1 / (top - bottom);
  rd = 1 / (far - near);

  e = this.elements;

  e[0] = 2 * near * rw;
  e[1] = 0;
  e[2] = 0;
  e[3] = 0;

  e[4] = 0;
  e[5] = 2 * near * rh;
  e[6] = 0;
  e[7] = 0;

  e[8] = (right + left) * rw;
  e[9] = (top + bottom) * rh;
  e[10] = -(far + near) * rd;
  e[11] = -1;

  e[12] = 0;
  e[13] = 0;
  e[14] = -2 * near * far * rd;
  e[15] = 0;

  return this;
};

/**
 * Multiply the perspective projection matrix from the right.
 * @param left The coordinate of the left of clipping plane.
 * @param right The coordinate of the right of clipping plane.
 * @param bottom The coordinate of the bottom of clipping plane.
 * @param top The coordinate of the top top clipping plane.
 * @param near The distances to the nearer depth clipping plane. This value must be plus value.
 * @param far The distances to the farther depth clipping plane. This value must be plus value.
 * @return this
 */
Matrix4.prototype.frustum = function (left, right, bottom, top, near, far) {
  return this.concat(new Matrix4().setFrustum(left, right, bottom, top, near, far));
};

/**
 * Set the perspective projection matrix by fovy and aspect.
 * @param fovy The angle between the upper and lower sides of the frustum.
 * @param aspect The aspect ratio of the frustum. (width/height)
 * @param near The distances to the nearer depth clipping plane. This value must be plus value.
 * @param far The distances to the farther depth clipping plane. This value must be plus value.
 * @return this
 */
Matrix4.prototype.setPerspective = function (fovy, aspect, near, far) {
  var e, rd, s, ct;

  if (near === far || aspect === 0) {
    throw 'null frustum';
  }
  if (near <= 0) {
    throw 'near <= 0';
  }
  if (far <= 0) {
    throw 'far <= 0';
  }

  fovy = Math.PI * fovy / 180 / 2;
  s = Math.sin(fovy);
  if (s === 0) {
    throw 'null frustum';
  }

  rd = 1 / (far - near);
  ct = Math.cos(fovy) / s;

  e = this.elements;

  e[0] = ct / aspect;
  e[1] = 0;
  e[2] = 0;
  e[3] = 0;

  e[4] = 0;
  e[5] = ct;
  e[6] = 0;
  e[7] = 0;

  e[8] = 0;
  e[9] = 0;
  e[10] = -(far + near) * rd;
  e[11] = -1;

  e[12] = 0;
  e[13] = 0;
  e[14] = -2 * near * far * rd;
  e[15] = 0;

  return this;
};

/**
 * Multiply the perspective projection matrix from the right.
 * @param fovy The angle between the upper and lower sides of the frustum.
 * @param aspect The aspect ratio of the frustum. (width/height)
 * @param near The distances to the nearer depth clipping plane. This value must be plus value.
 * @param far The distances to the farther depth clipping plane. This value must be plus value.
 * @return this
 */
Matrix4.prototype.perspective = function (fovy, aspect, near, far) {
  return this.concat(new Matrix4().setPerspective(fovy, aspect, near, far));
};

/**
 * Set the matrix for scaling.
 * @param x The scale factor along the X axis
 * @param y The scale factor along the Y axis
 * @param z The scale factor along the Z axis
 * @return this
 */
Matrix4.prototype.setScale = function (x, y, z) {
  var e = this.elements;
  e[0] = x;e[4] = 0;e[8] = 0;e[12] = 0;
  e[1] = 0;e[5] = y;e[9] = 0;e[13] = 0;
  e[2] = 0;e[6] = 0;e[10] = z;e[14] = 0;
  e[3] = 0;e[7] = 0;e[11] = 0;e[15] = 1;
  return this;
};

/**
 * Multiply the matrix for scaling from the right.
 * @param x The scale factor along the X axis
 * @param y The scale factor along the Y axis
 * @param z The scale factor along the Z axis
 * @return this
 */
Matrix4.prototype.scale = function (x, y, z) {
  var e = this.elements;
  e[0] *= x;e[4] *= y;e[8] *= z;
  e[1] *= x;e[5] *= y;e[9] *= z;
  e[2] *= x;e[6] *= y;e[10] *= z;
  e[3] *= x;e[7] *= y;e[11] *= z;
  return this;
};

/**
 * Set the matrix for translation.
 * @param x The X value of a translation.
 * @param y The Y value of a translation.
 * @param z The Z value of a translation.
 * @return this
 */
Matrix4.prototype.setTranslate = function (x, y, z) {
  var e = this.elements;
  e[0] = 1;e[4] = 0;e[8] = 0;e[12] = x;
  e[1] = 0;e[5] = 1;e[9] = 0;e[13] = y;
  e[2] = 0;e[6] = 0;e[10] = 1;e[14] = z;
  e[3] = 0;e[7] = 0;e[11] = 0;e[15] = 1;
  return this;
};

/**
 * Multiply the matrix for translation from the right.
 * @param x The X value of a translation.
 * @param y The Y value of a translation.
 * @param z The Z value of a translation.
 * @return this
 */
Matrix4.prototype.translate = function (x, y, z) {
  var e = this.elements;
  e[12] += e[0] * x + e[4] * y + e[8] * z;
  e[13] += e[1] * x + e[5] * y + e[9] * z;
  e[14] += e[2] * x + e[6] * y + e[10] * z;
  e[15] += e[3] * x + e[7] * y + e[11] * z;
  return this;
};

/**
 * Set the matrix for rotation.
 * The vector of rotation axis may not be normalized.
 * @param angle The angle of rotation (degrees)
 * @param x The X coordinate of vector of rotation axis.
 * @param y The Y coordinate of vector of rotation axis.
 * @param z The Z coordinate of vector of rotation axis.
 * @return this
 */
Matrix4.prototype.setRotate = function (angle, x, y, z) {
  var e, s, c, len, rlen, nc, xy, yz, zx, xs, ys, zs;

  angle = Math.PI * angle / 180;
  e = this.elements;

  s = Math.sin(angle);
  c = Math.cos(angle);

  if (0 !== x && 0 === y && 0 === z) {
    // Rotation around X axis
    if (x < 0) {
      s = -s;
    }
    e[0] = 1;e[4] = 0;e[8] = 0;e[12] = 0;
    e[1] = 0;e[5] = c;e[9] = -s;e[13] = 0;
    e[2] = 0;e[6] = s;e[10] = c;e[14] = 0;
    e[3] = 0;e[7] = 0;e[11] = 0;e[15] = 1;
  } else if (0 === x && 0 !== y && 0 === z) {
    // Rotation around Y axis
    if (y < 0) {
      s = -s;
    }
    e[0] = c;e[4] = 0;e[8] = s;e[12] = 0;
    e[1] = 0;e[5] = 1;e[9] = 0;e[13] = 0;
    e[2] = -s;e[6] = 0;e[10] = c;e[14] = 0;
    e[3] = 0;e[7] = 0;e[11] = 0;e[15] = 1;
  } else if (0 === x && 0 === y && 0 !== z) {
    // Rotation around Z axis
    if (z < 0) {
      s = -s;
    }
    e[0] = c;e[4] = -s;e[8] = 0;e[12] = 0;
    e[1] = s;e[5] = c;e[9] = 0;e[13] = 0;
    e[2] = 0;e[6] = 0;e[10] = 1;e[14] = 0;
    e[3] = 0;e[7] = 0;e[11] = 0;e[15] = 1;
  } else {
    // Rotation around another axis
    len = Math.sqrt(x * x + y * y + z * z);
    if (len !== 1) {
      rlen = 1 / len;
      x *= rlen;
      y *= rlen;
      z *= rlen;
    }
    nc = 1 - c;
    xy = x * y;
    yz = y * z;
    zx = z * x;
    xs = x * s;
    ys = y * s;
    zs = z * s;

    e[0] = x * x * nc + c;
    e[1] = xy * nc + zs;
    e[2] = zx * nc - ys;
    e[3] = 0;

    e[4] = xy * nc - zs;
    e[5] = y * y * nc + c;
    e[6] = yz * nc + xs;
    e[7] = 0;

    e[8] = zx * nc + ys;
    e[9] = yz * nc - xs;
    e[10] = z * z * nc + c;
    e[11] = 0;

    e[12] = 0;
    e[13] = 0;
    e[14] = 0;
    e[15] = 1;
  }

  return this;
};

/**
 * Multiply the matrix for rotation from the right.
 * The vector of rotation axis may not be normalized.
 * @param angle The angle of rotation (degrees)
 * @param x The X coordinate of vector of rotation axis.
 * @param y The Y coordinate of vector of rotation axis.
 * @param z The Z coordinate of vector of rotation axis.
 * @return this
 */
Matrix4.prototype.rotate = function (angle, x, y, z) {
  return this.concat(new Matrix4().setRotate(angle, x, y, z));
};

/**
 * Set the viewing matrix.
 * @param eyeX, eyeY, eyeZ The position of the eye point.
 * @param centerX, centerY, centerZ The position of the reference point.
 * @param upX, upY, upZ The direction of the up vector.
 * @return this
 */
Matrix4.prototype.setLookAt = function (eyeX, eyeY, eyeZ, centerX, centerY, centerZ, upX, upY, upZ) {
  var e, fx, fy, fz, rlf, sx, sy, sz, rls, ux, uy, uz;

  fx = centerX - eyeX;
  fy = centerY - eyeY;
  fz = centerZ - eyeZ;

  // Normalize f.
  rlf = 1 / Math.sqrt(fx * fx + fy * fy + fz * fz);
  fx *= rlf;
  fy *= rlf;
  fz *= rlf;

  // Calculate cross product of f and up.
  sx = fy * upZ - fz * upY;
  sy = fz * upX - fx * upZ;
  sz = fx * upY - fy * upX;

  // Normalize s.
  rls = 1 / Math.sqrt(sx * sx + sy * sy + sz * sz);
  sx *= rls;
  sy *= rls;
  sz *= rls;

  // Calculate cross product of s and f.
  ux = sy * fz - sz * fy;
  uy = sz * fx - sx * fz;
  uz = sx * fy - sy * fx;

  // Set to this.
  e = this.elements;
  e[0] = sx;
  e[1] = ux;
  e[2] = -fx;
  e[3] = 0;

  e[4] = sy;
  e[5] = uy;
  e[6] = -fy;
  e[7] = 0;

  e[8] = sz;
  e[9] = uz;
  e[10] = -fz;
  e[11] = 0;

  e[12] = 0;
  e[13] = 0;
  e[14] = 0;
  e[15] = 1;

  // Translate.
  return this.translate(-eyeX, -eyeY, -eyeZ);
};

/**
 * Multiply the viewing matrix from the right.
 * @param eyeX, eyeY, eyeZ The position of the eye point.
 * @param centerX, centerY, centerZ The position of the reference point.
 * @param upX, upY, upZ The direction of the up vector.
 * @return this
 */
Matrix4.prototype.lookAt = function (eyeX, eyeY, eyeZ, centerX, centerY, centerZ, upX, upY, upZ) {
  return this.concat(new Matrix4().setLookAt(eyeX, eyeY, eyeZ, centerX, centerY, centerZ, upX, upY, upZ));
};

/**
 * Multiply the matrix for project vertex to plane from the right.
 * @param plane The array[A, B, C, D] of the equation of plane "Ax + By + Cz + D = 0".
 * @param light The array which stored coordinates of the light. if light[3]=0, treated as parallel light.
 * @return this
 */
Matrix4.prototype.dropShadow = function (plane, light) {
  var mat = new Matrix4();
  var e = mat.elements;

  var dot = plane[0] * light[0] + plane[1] * light[1] + plane[2] * light[2] + plane[3] * light[3];

  e[0] = dot - light[0] * plane[0];
  e[1] = -light[1] * plane[0];
  e[2] = -light[2] * plane[0];
  e[3] = -light[3] * plane[0];

  e[4] = -light[0] * plane[1];
  e[5] = dot - light[1] * plane[1];
  e[6] = -light[2] * plane[1];
  e[7] = -light[3] * plane[1];

  e[8] = -light[0] * plane[2];
  e[9] = -light[1] * plane[2];
  e[10] = dot - light[2] * plane[2];
  e[11] = -light[3] * plane[2];

  e[12] = -light[0] * plane[3];
  e[13] = -light[1] * plane[3];
  e[14] = -light[2] * plane[3];
  e[15] = dot - light[3] * plane[3];

  return this.concat(mat);
};

/**
 * Multiply the matrix for project vertex to plane from the right.(Projected by parallel light.)
 * @param normX, normY, normZ The normal vector of the plane.(Not necessary to be normalized.)
 * @param planeX, planeY, planeZ The coordinate of arbitrary points on a plane.
 * @param lightX, lightY, lightZ The vector of the direction of light.(Not necessary to be normalized.)
 * @return this
 */
Matrix4.prototype.dropShadowDirectionally = function (normX, normY, normZ, planeX, planeY, planeZ, lightX, lightY, lightZ) {
  var a = planeX * normX + planeY * normY + planeZ * normZ;
  return this.dropShadow([normX, normY, normZ, -a], [lightX, lightY, lightZ, 0]);
};

/**
 * Constructor of Vector3
 * If opt_src is specified, new vector is initialized by opt_src.
 * @param opt_src source vector(option)
 */
var Vector3 = function Vector3(opt_src) {
  var v = new Float32Array(3);
  if (opt_src && (typeof opt_src === "undefined" ? "undefined" : _typeof(opt_src)) === 'object') {
    v[0] = opt_src[0];v[1] = opt_src[1];v[2] = opt_src[2];
  }
  this.elements = v;
};

/**
  * Normalize.
  * @return this
  */
Vector3.prototype.normalize = function () {
  var v = this.elements;
  var c = v[0],
      d = v[1],
      e = v[2],
      g = Math.sqrt(c * c + d * d + e * e);
  if (g) {
    if (g == 1) return this;
  } else {
    v[0] = 0;v[1] = 0;v[2] = 0;
    return this;
  }
  g = 1 / g;
  v[0] = c * g;v[1] = d * g;v[2] = e * g;
  return this;
};

/**
 * Constructor of Vector4
 * If opt_src is specified, new vector is initialized by opt_src.
 * @param opt_src source vector(option)
 */
var Vector4 = function Vector4(opt_src) {
  var v = new Float32Array(4);
  if (opt_src && (typeof opt_src === "undefined" ? "undefined" : _typeof(opt_src)) === 'object') {
    v[0] = opt_src[0];v[1] = opt_src[1];v[2] = opt_src[2];v[3] = opt_src[3];
  }
  this.elements = v;
};

// Source: src/lib/cuon-utils.js
// cuon-utils.js (c) 2012 kanda and matsuda
/**
 * Create a program object and make current
 * @param gl GL context
 * @param vshader a vertex shader program (string)
 * @param fshader a fragment shader program (string)
 * @return true, if the program object was created and successfully made current 
 */
function initShaders(gl, vshader, fshader) {
  var program = createProgram(gl, vshader, fshader);
  if (!program) {
    console.log('Failed to create program');
    return false;
  }

  gl.useProgram(program);
  gl.program = program;

  return true;
}

/**
 * Create the linked program object
 * @param gl GL context
 * @param vshader a vertex shader program (string)
 * @param fshader a fragment shader program (string)
 * @return created program object, or null if the creation has failed
 */
function createProgram(gl, vshader, fshader) {
  // Create shader object
  var vertexShader = loadShader(gl, gl.VERTEX_SHADER, vshader);
  var fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fshader);
  if (!vertexShader || !fragmentShader) {
    return null;
  }

  // Create a program object
  var program = gl.createProgram();
  if (!program) {
    return null;
  }

  // Attach the shader objects
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);

  // Link the program object
  gl.linkProgram(program);

  // Check the result of linking
  var linked = gl.getProgramParameter(program, gl.LINK_STATUS);
  if (!linked) {
    var error = gl.getProgramInfoLog(program);
    console.log('Failed to link program: ' + error);
    gl.deleteProgram(program);
    gl.deleteShader(fragmentShader);
    gl.deleteShader(vertexShader);
    return null;
  }
  return program;
}

/**
 * Create a shader object
 * @param gl GL context
 * @param type the type of the shader object to be created
 * @param source shader program (string)
 * @return created shader object, or null if the creation has failed.
 */
function loadShader(gl, type, source) {
  // Create shader object
  var shader = gl.createShader(type);
  if (shader == null) {
    console.log('unable to create shader');
    return null;
  }

  // Set the shader program
  gl.shaderSource(shader, source);

  // Compile the shader
  gl.compileShader(shader);

  // Check the result of compilation
  var compiled = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
  if (!compiled) {
    var error = gl.getShaderInfoLog(shader);
    console.log('Failed to compile shader: ' + error);
    gl.deleteShader(shader);
    return null;
  }

  return shader;
}

/** 
 * Initialize and get the rendering for WebGL
 * @param canvas <cavnas> element
 * @param opt_debug flag to initialize the context for debugging
 * @return the rendering context for WebGL
 */
function getWebGLContext(canvas, opt_debug) {
  // Get the rendering context for WebGL
  var gl = WebGLUtils.setupWebGL(canvas);
  if (!gl) return null;

  // if opt_debug is explicitly false, create the context for debugging
  if (arguments.length < 2 || opt_debug) {
    gl = WebGLDebugUtils.makeDebugContext(gl);
  }

  return gl;
}

// Source: src/lib/materials.js

var MATL_PEWTER = [[0.0, 0.0, 0.0], [0.105882, 0.058824, 0.113725], [0.427451, 0.470588, 0.541176], [0.333333, 0.333333, 0.521569], 9.84615];

// Source: src/main.js

var scene;
function main() {
  scene = new Scene(document.getElementById('webgl'));
  scene.defmat({
    MAT_PEWTER: MATL_PEWTER
  });
  scene.defmesh({
    mutable: {
      VMESH_PLANE: Plane(60, 60, 10, 10, 100)
    }
  });
  scene.init({
    lights: {
      blinn_phong: {
        L_OVERHEAD: {
          pos: [0.0, -0.0, 40.0],
          ambi: [0.2, 0.2, 0.2],
          spec: [1.0, 1.0, 1.0],
          diff: [1.0, 1.0, 1.0]
        },
        L_HEADLIGHT: {
          pos: [6.0, -9.0, 8.0],
          ambi: [0.4, 0.4, 0.4],
          spec: [1.0, 1.0, 1.0],
          diff: [1.0, 1.0, 1.0]
        }
      } },
    models: {
      DYNAMIC_PLANE: {
        mesh: VMESH_PLANE,
        mat: MAT_PEWTER,
        draw: TRIANGLE_STRIP
      }
    },
    camera: {
      position: [10.0, 0.0, 0.0],
      lookAt: [0.0, 0.0, 0.0],
      up: [0.0, 0.0, 1.0],
      perspective: 40
    }
  });

  winResize();

  document.addEventListener('keydown', function (ev) {
    if (!scene._camera.moving) {
      scene._camera.moving = true;
      scene._camera.keyPressed(ev.keyCode);
    }
  });

  document.addEventListener('keyup', function (ev) {
    if (scene._camera.moving) {
      scene._camera.moving = false;
      scene._camera.keyUp();
    }
  });

  main_loop();
}

function update_plane(options) {
  var displacement = options.displacement || false;
  var height = options.height || false;

  if (!displacement) {
    displacement = document.getElementById("displacement").innerHTML;
    document.getElementById("displacement").innerHTML = displacement;
    document.getElementById("height").innerHTML = height;
  } else if (!height) {
    height = document.getElementById("height").innerHTML;
    document.getElementById("height").innerHTML = height;
    document.getElementById("displacement").innerHTML = displacement;
  }
  scene.update({
    meshes: {
      VMESH_PLANE: Plane(60, 60, displacement, height, 100)
    }
  });
}

function main_loop() {
  //   animate(scene);
  draw(scene);
  requestAnimationFrame(main_loop);
  scene.render();
}

function animate(scene) {
  var dT = scene.time.dT;
}

function draw(scene) {
  scene._gl.clear(scene._gl.COLOR_BUFFER_BIT | scene._gl.DEPTH_BUFFER_BIT);

  var m_modelMatrix = new Matrix4(); // Model matrix
  pushMatrix(m_modelMatrix);

  m_modelMatrix.setTranslate(-220, -60, -10);
  m_modelMatrix.scale(2, 2, 2);
  m_modelMatrix.rotate(90, 0, 0, 1);

  scene.draw(DYNAMIC_PLANE, m_modelMatrix);
}

function winResize() {
  scene.canvas.width = window.innerWidth;
  scene.canvas.height = window.innerHeight;
  draw(scene);
}

// Source: src/objects.js
var floatsPerVertex = 6;
function Plane(c_x, c_y, displacement, side_height) {
  var len = 0.5;
  var positions = [];
  var indicies = [];

  var num_verticies = c_x * c_y;
  var step = 6.283185307 * (1 / num_verticies);
  var curr_step = 0;

  var xstep = step * 10;
  var cxstep = 6.283185307 * 1 / c_x;

  for (var x = 0; x < c_x; x++) {
    cxstep = 0;

    for (var y = 0; y < c_y; y++) {
      curr_step += step;
      cxstep += xstep;

      var displace = Math.random() * displacement;
      var height = Math.cos(curr_step) * side_height;
      var xvarying = Math.sin(cxstep * side_height);

      positions.push(x); // x
      positions.push(y); // y
      positions.push((displace + height) * xvarying); // z
    }
  }

  for (var strips = 0; strips < c_x - 1; strips++) {
    var temp_indicies = [];
    if (!(strips & 1)) {
      for (var _y = 0; _y < c_y; _y++) {
        var i = _y + c_y * strips;
        indicies.push(i); // Push first column
        indicies.push(i + c_y); // Push second column
      }
    } else {
        for (var _y2 = c_y * (strips + 1) - 1; _y2 >= c_y * strips; _y2--) {
          indicies.push(_y2); // Push first column
          indicies.push(_y2 + c_y); // Push second column
        }
      }
  }
  return [positions, indicies, getNormals(positions, indicies, 0)];
}

// Source: src/shaders/_FSHADER.js
var FSHADER_SOURCE = "\n\n\n/**\n * Fragment shader definitions for a WebGl system\n * Time-stamp: <2016-03-20 15:02:11>\n */\n\n#ifndef READ_SRC // Suppress errors\n#define NUM_LIGHTS 3\n#define NUM_MATERIALS 3\n#endif\n\n#extension GL_OES_standard_derivatives : enable\n\n#ifdef GL_ES\nprecision mediump float;\n#endif\n\nuniform vec3 u_eyePosWorld;   // Camera/eye location in world coords.\nvarying vec3 v_Normal;\nvarying vec4 v_Position;\nvarying vec3 v_Kd;            // Find diffuse reflectance K_d per pix\nuniform int u_matIndex;\nuniform int u_mode; \n\nuniform struct Material{\n  vec3 Ke;     \t// Phong Reflectance: emissive\n  vec3 Ka;    \t// Phong Reflectance: ambient\n  vec3 Ks;     \t// Phong Ref lectance: specular\n  vec3 Kd;      // Find diffuse reflectance K_d per pix\n  int Kshiny;\n} material[NUM_MATERIALS];\n\nuniform struct Light {\n  vec3 position;\n  vec3 ambient;\n  vec3 diffuse;\n  vec3 specular;\n} light[NUM_LIGHTS];\n\n\nvec3 find_normal(){\n  vec3 dx = dFdx(v_Position.xyz);\n  vec3 dy = dFdy(v_Position.xyz);\n\n  return normalize(cross(dx, dy));\n}\n\nvec3 lighting_phong(int n_mat, vec3 pos, vec3 N){\n  vec3 emissive, ambient, diffuse, speculr;\n  for (int i=0; i<NUM_LIGHTS; i++){\n    for (int j=0; j<=NUM_MATERIALS; j++){ // Workaround for const int access\n      if (j != n_mat) continue;\n      vec3 L = normalize(light[i].position - pos.xyz);\n      float lambertian = max(dot(L, N), 0.0); \n\n      vec3 R = reflect(-L, N);\n      vec3 V = normalize(u_eyePosWorld - pos.xyz);\n      \n      float rDotV = max(dot(R, V), 0.0);       // phong\n\n      float e = pow(rDotV, float(material[j].Kshiny)); //phong\n      e*=e;  //e128\n      e*=e;  //e256\n\n      emissive += material[j].Ke;\n      ambient += light[i].ambient * material[j].Ka;\n      diffuse += light[i].diffuse * material[j].Kd * lambertian;\n      speculr += light[i].specular * material[j].Ks * e;\n    }\n  }\n  return emissive + ambient + diffuse + speculr;\n}\n\n\nvoid main(){\n  gl_FragColor = vec4(lighting_phong(u_matIndex,v_Position.xyz,find_normal()),1.0);\n}\n";
// Source: src/shaders/_VSHADER.js
var VSHADER_SOURCE = "\n\n/**\n * Vertex shader definitions for a WebGl system\n * Time-stamp: <2016-03-20 14:57:32>\n */\n\nattribute vec4 a_Position;\n\nuniform bool mutable;  \n\nattribute vec4 a_Normal;\nuniform vec3 u_Kd; \nuniform mat4 u_MvpMatrix;\nuniform mat4 u_ModelMatrix;\nuniform mat4 u_NormalMatrix;\nvarying vec3 v_Kd;            // Phong Lighting: diffuse reflectance\nvarying vec4 v_Position; \nvarying vec3 v_Normal;\n\nvarying vec4 v_Color;\nuniform struct GouraudLight {\n  vec3 color;\n  vec3 position;\n  vec3 ambient; \n} gLight[3];\n\n\nvoid main(){\n  gl_Position = u_MvpMatrix * a_Position;\n  v_Position = u_ModelMatrix * a_Position;\n}\n";
