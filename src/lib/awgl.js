"use strict";function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor))throw new TypeError("Cannot call a class as a function")}function add_global_sym(sym,index){var to_eval="window.".concat(sym).concat("=").concat(index);eval(to_eval)}function init_buffer(gl,data,type){var buf=gl.createBuffer();if(!buf)throw new Error("Failed to create the buffer object");return gl.bindBuffer(gl.ARRAY_BUFFER,buf),gl.bufferData(gl.ARRAY_BUFFER,data,type),buf}function bind_attrib(gl,attrib,num,type,stride,offset){var attribute=gl.getAttribLocation(gl.program,attrib);if(0>attribute)throw new Error("Failed to get the storage location of "+attrib);gl.vertexAttribPointer(attribute,num,type,!1,stride,offset),gl.enableVertexAttribArray(attribute)}function initArrayBuffer(gl,method,attribute,data,num,type,stride,offset){var buffer=gl.createBuffer();if(!buffer)return console.log("Failed to create the buffer object"),!1;gl.bindBuffer(gl.ARRAY_BUFFER,buffer),gl.bufferData(gl.ARRAY_BUFFER,data,method);var a_attribute=gl.getAttribLocation(gl.program,attribute);return 0>a_attribute?(console.log("Failed to get the storage location of "+attribute),!1):(gl.vertexAttribPointer(a_attribute,num,type,!1,stride,offset),gl.enableVertexAttribArray(a_attribute),!0)}function subtract(va,vb){for(var tmp=new Float32Array([0,0,0]),x=0;x<va.length;x++)tmp[x]=va[x]-vb[x];return tmp}function multiS(va,s){for(var x=0;x<va.length;x++)va[x]*=s;return va}function addS(va,s){for(var x=0;x<va.length;x++)va[x]+=s;return va}function crossProduct(l1,l2){return new Float32Array([l1[1]*l2[2]-l2[1]*l1[2],-(l1[0]*l2[2]-l1[2]*l2[0]),l1[0]*l2[1]-l1[1]*l2[0]])}function getNormals(v_vc,v_ind,mode){var normals=[];if(0==mode){for(var i=0;i<v_ind.length;i++){var index=3*v_ind[i],point1=new vec3(v_vc[index],v_vc[index+1],v_vc[index+2]),point2=new vec3(v_vc[index+3],v_vc[index+4],v_vc[index+5]),point3=new vec3(v_vc[index+6],v_vc[index+7],v_vc[index+8]),lineA=vec3.subtract(point1,point3),lineB=vec3.subtract(point2,point3),CP=vec3.normalize(vec3.cross(lineA,lineB));normals.push(CP.elements[0]),normals.push(CP.elements[1]),normals.push(CP.elements[2])}return normals}throw new Error("Warning: Invalid mode selected for getNormals!")}var _createClass=function(){function defineProperties(target,props){for(var i=0;i<props.length;i++){var descriptor=props[i];descriptor.enumerable=descriptor.enumerable||!1,descriptor.configurable=!0,"value"in descriptor&&(descriptor.writable=!0),Object.defineProperty(target,descriptor.key,descriptor)}}return function(Constructor,protoProps,staticProps){return protoProps&&defineProperties(Constructor.prototype,protoProps),staticProps&&defineProperties(Constructor,staticProps),Constructor}}(),ORTHOGRAPHIC=1,PERSPECTIVE=0,Camera=function(){function Camera(gl,args){_classCallCheck(this,Camera);var perspective=(args.mode||0,args.perspective||40),position=args.position||[6,0,0],lookAt=args.lookAt||[0,0,0],up=args.up||[0,0,1];if(this.position=new vec3(position[0],position[1],position[2]),this.lookAt=new vec3(lookAt[0],lookAt[1],lookAt[2]),this.up=new vec3(up[0],up[1],up[2]),this.perspective=perspective,this._velocity=.05,this._angle=3.141592654,this._t_angle=3.141592654,this._angle_incr=.15,this._dist=vec3.create(),this._w=!1,this._s=!1,this._a=!1,this._d=!1,this._q=!1,this._e=!1,this._r=!1,this._f=!1,this._moving=!1,this._direction=vec3.create(),this._uL_position=gl.getUniformLocation(gl.program,"u_eyePosWorld"),!this._uL_position)throw new Error("Failed to get camera storage location");gl.uniform3fv(this.uL_position,this.position.elements)}return _createClass(Camera,[{key:"_mat4_proj",value:function(gl,mode){var mat4_proj=new Matrix4,zoom=5,vpAspect=gl.drawingBufferWidth/gl.drawingBufferHeight;switch(mode){case PERSPECTIVE:return mat4_proj.setPerspective(this.perspective,vpAspect,1,1e3),mat4_proj;case ORTHOGRAPHIC:return vpAspect>=1?mat4_proj.setOrtho(-vpAspect*zoom,vpAspect*zoom,-zoom,zoom,1,100):mat4_proj.setOrtho(-zoom,zoom,-1/vpAspect*zoom,1/vpAspect*zoom,1,100),mat4_proj}}},{key:"_mat4_view",value:function(){var mat4_view=new Matrix4;return mat4_view.setLookAt(this.position.elements[0],this.position.elements[1],this.position.elements[2],this.lookAt.elements[0],this.lookAt.elements[1],this.lookAt.elements[2],this.up.elements[0],this.up.elements[1],this.up.elements[2]),mat4_view}},{key:"mat4_VP",value:function mat4_VP(gl,mode,dT){var mat4_VP=(gl.drawingBufferWidth/gl.drawingBufferHeight,void 0);switch(mode){case PERSPECTIVE:return this.update(gl,dT),mat4_VP=this._mat4_proj(gl,PERSPECTIVE).concat(this._mat4_view());case ORTHOGRAPHIC:return this.update(gl,dT),mat4_VP=this._mat4_proj(gl,ORTHOGRAPHIC).concat(this._mat4_view())}}},{key:"keyPressed",value:function(key){switch(key){case 87:this._w=!0;break;case 65:this._a=!0;break;case 83:this._s=!0;break;case 68:this._d=!0;break;case 81:this._q=!0;break;case 69:this._e=!0;break;case 82:this._r=!0;break;case 70:this._f=!0}}},{key:"keyUp",value:function(){this._w=!1,this._a=!1,this._s=!1,this._d=!1,this._q=!1,this._e=!1,this._r=!1,this._f=!1}},{key:"update",value:function(gl,dT){var pi=3.141592654,vel=this._velocity*dT,angle_step=this._angle_incr*vel*.3;if(this._dist=vec3.create(),this.moving){if(this._w&&(this._dist=vec3.multiply(vec3.subtract(this.lookAt,this.position),vel),this.position=vec3.add(this.position,this._dist),this.lookAt=vec3.add(this.lookAt,this._dist)),this._a){this._dist=vec3.subtract(this.lookAt,this.position);var len=Math.sqrt(this._dist.elements[0]*this._dist.elements[0]+this._dist.elements[1]*this._dist.elements[1]);this._angle+=angle_step,this.lookAt.elements[0]=this.position.elements[0]+len*Math.cos(this._angle),this.lookAt.elements[1]=this.position.elements[1]+len*Math.sin(this._angle)}if(this._s&&(this._dist=vec3.multiply(vec3.subtract(this.lookAt,this.position),vel),this.position=vec3.subtract(this.position,this._dist),this.lookAt=vec3.subtract(this.lookAt,this._dist)),this._d){this._dist=vec3.subtract(this.lookAt,this.position);var _len=Math.sqrt(this._dist.elements[0]*this._dist.elements[0]+this._dist.elements[1]*this._dist.elements[1]);this._angle-=angle_step,this.lookAt.elements[0]=this.position.elements[0]+_len*Math.cos(this._angle),this.lookAt.elements[1]=this.position.elements[1]+_len*Math.sin(this._angle)}if(this._q&&(vel=8*vel,this._dist.elements[0]=vel*Math.cos(this._angle+3*pi/2),this._dist.elements[1]=vel*Math.sin(this._angle+3*pi/2),this.position=vec3.subtract(this.position,this._dist),this.lookAt=vec3.subtract(this.lookAt,this._dist)),this._e&&(vel=8*vel,this._dist.elements[0]=vel*Math.cos(this._angle+pi/2),this._dist.elements[1]=vel*Math.sin(this._angle+pi/2),this.position=vec3.subtract(this.position,this._dist),this.lookAt=vec3.subtract(this.lookAt,this._dist)),this._r){this._dist=vec3.subtract(this.lookAt,this.position);var _len2=Math.sqrt(this._dist.elements[0]*this._dist.elements[0]+this._dist.elements[1]*this._dist.elements[1]);this._t_angle<=2.1?this._t_angle=2.1:this._t_angle-=angle_step,this.lookAt.elements[2]=this.position.elements[2]+_len2*Math.sin(this._t_angle)}if(this._f){this._dist=vec3.subtract(this.lookAt,this.position);var _len3=Math.sqrt(this._dist.elements[0]*this._dist.elements[0]+this._dist.elements[1]*this._dist.elements[1]);this._t_angle+=angle_step,this._t_angle>=4.3?this._t_angle=4.3:this._t_angle+=angle_step,this.lookAt.elements[2]=this.position.elements[2]+_len3*Math.sin(this._t_angle)}gl.uniform3fv(this._uL_position,this.position.elements)}}}]),Camera}(),Light=function(){function Light(gl,index,light_sys,light){_classCallCheck(this,Light);var position=light.pos||!1,ambient=light.ambi||!1,diffuse=light.diff||!1,specular=light.spec||!1;if(this.position=position,this.ambient=ambient,this.diffuse=diffuse,this.specular=specular,this._light_sys=light_sys,this._uL_position=gl.getUniformLocation(gl.program,"light["+index+"].position"),this._uL_ambient=gl.getUniformLocation(gl.program,"light["+index+"].ambient"),this._uL_diffuse=gl.getUniformLocation(gl.program,"light["+index+"].diffuse"),this._uL_specular=gl.getUniformLocation(gl.program,"light["+index+"].specular"),!(this._uL_position&&this._uL_ambient&&this._uL_diffuse&&this._uL_specular))throw new Error("Failed to get light storage locations");this.update(gl,{all:1})}return _createClass(Light,[{key:"set",value:function(options){var options=options||{},position=options.position||!1,ambient=options.ambient||!1,diffuse=options.diffuse||!1,specular=options.specular||!1;position&&(this.position=position,this.gl.uniform3fv(this._uL_position,this.position)),ambient&&(this.ambient=ambient,this.gl.uniform3fv(this._uL_ambient,this.ambient)),diffuse&&(this.diffuse=diffuse,this.gl.uniform3fv(this._uL_diffuse,this.diffuse)),specular&&(this.specular=specular,this.gl.uniform3fv(this._uL_specular,this.specular))}},{key:"update",value:function(gl,options){var options=options||{},all=options.all||!1,position=options.position||!1,ambient=options.ambient||!1,diffuse=options.diffuse||!1,specular=options.specular||!1;all?(gl.uniform3fv(this._uL_position,this.position),gl.uniform3fv(this._uL_ambient,this.ambient),gl.uniform3fv(this._uL_diffuse,this.diffuse),gl.uniform3fv(this._uL_specular,this.specular)):(position&&gl.uniform3fv(this._uL_position,this.position),ambient&&gl.uniform3fv(this._uL_ambient,this.ambient),diffuse&&gl.uniform3fv(this._uL_diffuse,this.diffuse),specular&&gl.uniform3fv(this._uL_specular,this.specular))}}]),Light}(),Material=function(){function Material(gl,num,ke,ka,kd,ks,kshiny){if(_classCallCheck(this,Material),this.gl=gl,this.ke=ke,this.ka=ka,this.kd=kd,this.ks=ks,this.kshiny=kshiny,this.uLoc_ke=gl.getUniformLocation(gl.program,"material["+num+"].Ke"),this.uLoc_ka=gl.getUniformLocation(gl.program,"material["+num+"].Ka"),this.uLoc_kd=gl.getUniformLocation(gl.program,"material["+num+"].Kd"),this.uLoc_ks=gl.getUniformLocation(gl.program,"material["+num+"].Ks"),this.uLoc_kshiny=gl.getUniformLocation(gl.program,"material["+num+"].Kshiny"),!(this.uLoc_ke&&this.uLoc_ka&&this.uLoc_kd&&this.uLoc_ks&&this.uLoc_kshiny))throw new Error("Failed to get the Phong Reflectance storage locations");this.update({all:1})}return _createClass(Material,[{key:"set",value:function(options){var options=options||{},ke=options.ke||!1,ka=options.ka||!1,kd=options.kd||!1,ks=options.ks||!1,kshiny=options.kshiny||!1;ke&&(this.ke=ke,this.gl.uniform3fv(this.uLoc_ke,this.ke)),ka&&(this.ka=ka,this.gl.uniform3fv(this.uLoc_ka,this.ka)),kd&&(this.kd=kd,this.gl.uniform3fv(this.uLoc_kd,this.kd)),ka&&(this.ks=ks,this.gl.uniform3fv(this.uLoc_ks,this.ks)),kshiny&&(this.kshiny=kshiny,this.gl.uniform1i(this.uLoc_kshiny,this.kshiny))}},{key:"update",value:function(options){var options=options||{},all=options.all||!1,ke=options.ke||!1,ka=options.ka||!1,kd=options.kd||!1,kshiny=(options.kd||!1,options.kshiny||!1);all?(this.gl.uniform3fv(this.uLoc_ke,this.ke),this.gl.uniform3fv(this.uLoc_ka,this.ka),this.gl.uniform3fv(this.uLoc_kd,this.kd),this.gl.uniform3fv(this.uLoc_ks,this.ks),this.gl.uniform1i(this.uLoc_kshiny,this.kshiny)):(ke&&this.gl.uniform3fv(this.uLoc_ke,this.ke),ka&&this.gl.uniform3fv(this.uLoc_ka,this.ka),kd&&this.gl.uniform3fv(this.uLoc_kd,this.kd),ka&&this.gl.uniform3fv(this.uLoc_ks,this.ks),kshiny&&this.gl.uniform1i(this.uLoc_kshiny,this.kshiny))}}]),Material}(),Mesh=function(){function Mesh(gl,mutable,meshes){_classCallCheck(this,Mesh),this._locations=[],this.mutable=mutable,this._meshes=this._concat_meshes(meshes)}return _createClass(Mesh,[{key:"_concat_meshes",value:function(meshes){var positions=[],indicies=[],normals=[],last_len=0,last_vertex_len=0;this._locations.push(0);for(var x=0;x<meshes.length;x++){for(var curr_indicies=meshes[x][1],new_arr=[],i=0;i<curr_indicies.length;i++)new_arr.push(curr_indicies[i]+last_vertex_len/FLOATSPERVERTEX);last_len+=curr_indicies.length,last_vertex_len+=meshes[x][0].length,positions=positions.concat(meshes[x][0]),indicies=indicies.concat(new_arr),this._locations.push(last_len)}return[positions,indicies,normals]}},{key:"init_array_buffers",value:function(gl){var positions=new Float32Array(this._meshes[0]);if(FSIZE=positions.BYTES_PER_ELEMENT,this.mutable){if(gl.bindBuffer(gl.ARRAY_BUFFER,null),!initArrayBuffer(gl,gl.DYNAMIC_DRAW,"POSITION_MUT",positions,3,gl.FLOAT,3*FSIZE,0))throw new Error("Failed to create dynamic array buffers!")}else if(!initArrayBuffer(gl,gl.STATIC_DRAW,"POSITION_STAT",positions,3,gl.FLOAT,3*FSIZE,0))throw new Error("Failed to create static array buffers!")}},{key:"init_index_buffer",value:function(gl,indicies_static,indicies_mut){var indicies=new Float32Array(indicies_static.concat(indicies_mut));ISIZE=indicies.BYTES_PER_ELEMENT,gl.bindBuffer(gl.ARRAY_BUFFER,null);var indexBuffer=gl.createBuffer();if(!indexBuffer)throw new Error("Failed to create the buffer object");gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,indexBuffer),gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,indicies,gl.STATIC_DRAW)}},{key:"get_start_end",value:function(index){var start=void 0,end=void 0;return start=this._locations[index],end=this._locations[index+1],[start,end]}},{key:"mutate",value:function(gl,mesh){if(!this.mutable)throw new Error("Attempted to mutate a fixed mesh!");_init_buffers(gl,_concat_meshes(meshes))}},{key:"indicies",get:function(){return this._meshes[1]}},{key:"positions",get:function(){return this._meshes[0]}}]),Mesh}(),Model=function(){function Model(args){_classCallCheck(this,Model);var mesh_index=args.mesh||0,mat_index=args.mat||0,drawing_mode=args.draw||0;if(3!=Object.keys(args).length)throw new Error("Not enough args! Tried to create a malformed model. ");this.mat_index=mat_index,this.mesh_index=mesh_index,this._drawing_mode=drawing_mode}return _createClass(Model,[{key:"draw",value:function(gl,uL_mat,range){var start=range[0],end=range[1];gl.uniform1i(uL_mat,this.mat_index),gl.drawElements(gl.TRIANGLE_STRIP,end-start,gl.UNSIGNED_INT,ISIZE*start)}}]),Model}(),FSIZE,ISIZE,FLOATSPERVERTEX=3,POINTS=0,LINES=1,LINE_LOOP=2,LINE_STRIP=3,TRIANGLES=4,TRIANGLE_STRIP=5,TRIANGLE_FAN=6,Time=function(){function Time(){_classCallCheck(this,Time),this._last=Date.now(),this._now}return _createClass(Time,[{key:"dT",get:function(){var dT=void 0;return this._now=Date.now(),dT=this._now-this._last,this._last=Date.now(),dT}}]),Time}(),Scene=function(){function Scene(canvas){_classCallCheck(this,Scene),this.canvas=canvas,this.time=new Time,this.mat4_model=new Matrix4,this.mat4_mvp=new Matrix4,this.mat4_normal=new Matrix4,this._gl,this._lights=[],this._models=[],this._materials=[],this._meshes_fixed,this._meshes_mutable,this._camera,this._buffers=Array(null,null,null),this._symtbl_lights=[],this._symtbl_mats=[],this._symtbl_meshes=[],this._symtbl_models=[],this._begin_mut_mesh=0,this.__draw_stack__,this.__last_draw_stack__,this._UI_ELEMENTS_=Array(20),this._uL_mat4_model,this._uL_mat4_mvp,this._uL_mat4_normal,this._uL_light_sys,this._uL_mat,this._uL_mutable}return _createClass(Scene,[{key:"_init_",value:function(n_lights,n_mats){if(this._gl=this.canvas.getContext("webgl",{stencil:!0}),!this._gl)throw new Error("Failed to get the rendering context.");this._gl.getExtension("OES_standard_derivatives"),this._gl.getExtension("OES_element_index_uint"),this._init_shaders_(n_lights,n_mats),this._init_mats_(),this._init_locations_(),this._init_array_buffers_(this._gl),this._init_index_buffer_(this._gl),this._init_scene_()}},{key:"_init_shaders_",value:function(n_lights,n_mats){if(FSHADER_SOURCE="#define READ_SRC 1 \n#define NUM_LIGHTS "+n_lights+" \n#define NUM_MATERIALS "+n_mats+" \n"+FSHADER_SOURCE,!initShaders(this._gl,VSHADER_SOURCE,FSHADER_SOURCE))throw new Error("Failed to intialize shaders.")}},{key:"_init_locations_",value:function(){if(this._uL_mat4_model=this._gl.getUniformLocation(this._gl.program,"u_ModelMatrix"),this._uL_mat4_mvp=this._gl.getUniformLocation(this._gl.program,"u_MvpMatrix"),this._uL_mat=this._gl.getUniformLocation(this._gl.program,"u_matIndex"),this._uL_mutable=this._gl.getUniformLocation(this._gl.program,"mutable"),!this._uL_mat4_model||!this._uL_mat4_mvp||!this._uL_mat)throw new Error("Failed to get scene storage locations")}},{key:"_init_scene_",value:function(){this._gl.clearColor(0,0,0,1),this._gl.enable(this._gl.DEPTH_TEST)}},{key:"_init_light",value:function(light_sys,light){this._lights.push(new Light(this._gl,this._lights.length,light_sys,light))}},{key:"_init_camera",value:function(position,lookAt,up){this.camera=new Camera(this._gl,position,lookAt,up)}},{key:"_init_mats_",value:function(){var tmp_mats=this._materials;this._materials=[];for(var x=0;x<tmp_mats.length;x++){var mat=tmp_mats[x];this._materials.push(new Material(this._gl,this._materials.length,mat[0],mat[1],mat[2],mat[3],mat[4]))}}},{key:"_set_light",value:function(index,values){this._lights[index].set(values)}},{key:"_init_array_buffers_",value:function(gl){var positions=void 0;this._meshes_fixed&&(positions=new Float32Array(this._meshes_fixed.positions),FSIZE=positions.BYTES_PER_ELEMENT,gl.bindBuffer(gl.ARRAY_BUFFER,null),this._buffers[0]=init_buffer(gl,positions,gl.STATIC_DRAW)),this._meshes_mutable&&(positions=new Float32Array(this._meshes_mutable.positions),FSIZE=positions.BYTES_PER_ELEMENT,gl.bindBuffer(gl.ARRAY_BUFFER,null),this._buffers[1]=init_buffer(gl,positions,gl.DYNAMIC_DRAW))}},{key:"_init_index_buffer_",value:function(gl,indicies_static,indicies_mut){var ind=[];this._meshes_fixed&&(ind=ind.concat(this._meshes_fixed.indicies)),this._meshes_mutable&&(ind=ind.concat(this._meshes_mutable.indicies));var indicies=new Uint32Array(ind);ISIZE=indicies.BYTES_PER_ELEMENT,gl.bindBuffer(gl.ARRAY_BUFFER,null);var indexBuffer=gl.createBuffer();if(!indexBuffer)throw new Error("Failed to create the buffer object");gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,indexBuffer),gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,indicies,gl.STATIC_DRAW)}},{key:"init",value:function(args){var lights=args.lights||!1,models=args.models||!1,camera=args.camera||!1,self=this,_loop=function(light_sys){var lights_tmp=[];for(var light in lights[light_sys])add_global_sym(light,self._symtbl_lights.length),self._symtbl_lights.push(light),lights_tmp.push(lights[light_sys][light]);self._init_(lights_tmp.length,self._materials.length),lights_tmp.map(function(x){self._init_light(light_sys,x)})};for(var light_sys in lights)_loop(light_sys);for(var model in models)add_global_sym(model,self._symtbl_models.length),self._symtbl_models.push(model),self._models.push(new Model(models[model]));self.__draw_stack__=Array(self._models.length),self._camera=new Camera(self._gl,camera)}},{key:"defmat",value:function(args){if(this._symtbl_mats.length)throw new Error("Materials have already been initialized!");for(var material in args){add_global_sym(material,this._symtbl_mats.length),this._symtbl_mats.push(material);var mat=args[material];this._materials.push(mat)}}},{key:"defmesh",value:function(args){var fixed=args.fixed||!1,mutable=args.mutable||!1,self=this;if(self._symtbl_meshes.length)throw new Error("Meshes have already been initialized!");if(fixed){var tmp_meshes_fixed=[];for(var mesh in fixed){if(-1!=self._symtbl_meshes.indexOf(mesh))throw new Error(mesh.concat(" has already been defined!"));add_global_sym(mesh,self._symtbl_meshes.length),self._symtbl_meshes.push(mesh),tmp_meshes_fixed.push(fixed[mesh])}self._meshes_fixed=new Mesh(this._gl,!1,tmp_meshes_fixed),self._begin_mut_mesh=self._symtbl_meshes.length}else self._meshes_fixed=!1;if(mutable){var tmp_meshes_mutable=[];for(var _mesh in mutable){if(-1!=self._symtbl_meshes.indexOf(_mesh))throw new Error(_mesh.concat(" has already been defined!"));add_global_sym(_mesh,self._symtbl_meshes.length),self._symtbl_meshes.push(_mesh),tmp_meshes_mutable.push(mutable[_mesh])}self._meshes_mutable=new Mesh(this._gl,!0,tmp_meshes_mutable)}else self._meshes_mutable=!1}},{key:"switchMode",value:function(index){this._gl.uniform1i(this._uL_light_sys,index)}},{key:"set",value:function(options){var options=options||{},mat4_model=options.model||!1,mat4_mvp=options.mvp||!1;ModelMatrix&&(this.mat4_model=mat4_model,this._gl.uniformMatrix4fv(this._uL_mat4_model,!1,this.mat4_model.elements)),MvpMatrix&&(this.mat4_mvp=mat4_mvp,this._gl.uniformMatrix4fv(this._uL_mat4_mvp,!1,this.mat4_mvp.elements))}},{key:"update",value:function(options){var options=options||{},meshes=options.meshes||!1,gl=this._gl;if(meshes){gl.bindBuffer(gl.ARRAY_BUFFER,this._dynamic_buffer);for(var mesh in meshes)gl.bufferSubData(gl.ARRAY_BUFFER,0,new Float32Array(meshes[mesh][0]))}}},{key:"draw",value:function(symbol,mat4_model){this.__draw_stack__[symbol]=mat4_model}},{key:"drawUI",value:function(symbol,mat4_model){this._UI_ELEMENTS_[symbol]=mat4_model}},{key:"render",value:function(){var gl=this._gl,mat4_mvp=new Matrix4;if(mat4_mvp.set(this._camera.mat4_VP(this._gl,PERSPECTIVE,this.time.dT)),this._gl.viewport(0,0,this._gl.drawingBufferWidth,this._gl.drawingBufferHeight),this._meshes_mutable){gl.bindBuffer(gl.ARRAY_BUFFER,this._buffers[1]),bind_attrib(gl,"a_Position",3,gl.FLOAT,3*FSIZE,0);for(var i=0;i<this._models.length;i++){var mat4_model=this.__draw_stack__[i];if(mat4_model){var t_mat4_mvp=new Matrix4(mat4_mvp);t_mat4_mvp.multiply(mat4_model),gl.uniformMatrix4fv(this._uL_mat4_model,!1,mat4_model.elements),gl.uniformMatrix4fv(this._uL_mat4_mvp,!1,t_mat4_mvp.elements);var model=this._models[i],mesh_index=model.mesh_index;if(mesh_index>=this._begin_mut_mesh){mesh_index-=this._begin_mut_mesh;var range=this._meshes_mutable.get_start_end(mesh_index);this._meshes_fixed&&(range[0]+=this._meshes_fixed.indicies.length),model.draw(this._gl,this._uL_mat,range)}}}}if(this._meshes_fixed){gl.bindBuffer(gl.ARRAY_BUFFER,this._buffers[0]),bind_attrib(gl,"a_Position",3,gl.FLOAT,3*FSIZE,0);for(var _i=0;_i<this._models.length;_i++){var _mat4_model=this.__draw_stack__[_i];if(_mat4_model){var _t_mat4_mvp=new Matrix4(mat4_mvp);_t_mat4_mvp.multiply(_mat4_model),gl.uniformMatrix4fv(this._uL_mat4_model,!1,_mat4_model.elements),gl.uniformMatrix4fv(this._uL_mat4_mvp,!1,_t_mat4_mvp.elements);var _model=this._models[_i],_mesh_index=_model.mesh_index;_mesh_index<this._begin_mut_mesh&&_model.draw(this._gl,this._uL_mat,this._meshes_fixed.get_start_end(_mesh_index))}}}this.__last_draw_stack__=this.__draw_stack__}},{key:"_draw_hud",value:function(){var mat4_mvp=new Matrix4,mat4_view=new Matrix4,zoom=5,vpAspect=this._gl.drawingBufferWidth/this._gl.drawingBufferHeight;vpAspect>=1?mat4_mvp.setOrtho(-vpAspect*zoom,vpAspect*zoom,-zoom,zoom,0,100):mat4_mvp.setOrtho(-zoom,zoom,-1/vpAspect*zoom,1/vpAspect*zoom,0,100),mat4_view.setLookAt(6,0,0,0,0,0,0,0,1),mat4_mvp=mat4_mvp.concat(mat4_view);for(var i=0;i<this._UI_ELEMENTS_.length;i++){var mat4_model=this._UI_ELEMENTS_[i];if(mat4_model){var t_mat4_mvp=new Matrix4(mat4_mvp);t_mat4_mvp.multiply(mat4_model),this._gl.uniformMatrix4fv(this._uL_mat4_model,!1,mat4_model.elements),this._gl.uniformMatrix4fv(this._uL_mat4_mvp,!1,t_mat4_mvp.elements);var model=this._models[i],mesh_index=model.mesh_index;mesh_index<this._begin_mut_mesh&&model.draw(this._gl,this._uL_mat,this._meshes_fixed.get_start_end(mesh_index))}}}},{key:"_static_buffer",get:function(){if(this._buffers[0])return this._buffers[0];throw new Error("The static buffer is not initialized!")}},{key:"_dynamic_buffer",get:function(){if(this._buffers[1])return this._buffers[1];throw new Error("The dynamic buffer is not initialized!")}},{key:"_index_buffer",get:function(){if(this._buffers[2])return this._buffers[2];throw new Error("The index buffer is not initialized!")}}]),Scene}();Array.prototype.equals=function(arr){if(this.length!=arr.length)return!1;for(var i=0;i<this.length;i++)if(this[i]!=arr[i])return!1;return!0};var vec3=function(){function vec3(x,y,z){_classCallCheck(this,vec3),this.elements=new Float32Array(3),this.elements[0]=x,this.elements[1]=y,this.elements[2]=z}return _createClass(vec3,null,[{key:"create",value:function(){return new vec3(0,0,0)}},{key:"length",value:function(vec){vec=vec.elements;var len=Math.sqrt(vec[0]*vec[0]+vec[1]*vec[1]+vec[2]*vec[2]);return len}},{key:"normalize",value:function(vec){vec=vec.elements;var len=Math.sqrt(vec[0]*vec[0]+vec[1]*vec[1]+vec[2]*vec[2]);return new vec3(vec[0]/len,vec[1]/len,vec[2]/len)}},{key:"cross",value:function(l1,l2){return l1=l1.elements,l2=l2.elements,new vec3(l1[1]*l2[2]-l2[1]*l1[2],-(l1[0]*l2[2]-l1[2]*l2[0]),l1[0]*l2[1]-l1[1]*l2[0])}},{key:"add",value:function(va,vb){for(var tmp=new Float32Array(3),x=0;3>x;x++)tmp[x]=va.elements[x]+vb.elements[x];return new vec3(tmp[0],tmp[1],tmp[2])}},{key:"subtract",value:function(va,vb){for(var tmp=new Float32Array(3),x=0;3>x;x++)tmp[x]=va.elements[x]-vb.elements[x];return new vec3(tmp[0],tmp[1],tmp[2])}},{key:"multiply",value:function(va,scalar){for(var tmp=new Float32Array(3),x=0;3>x;x++)tmp[x]=va.elements[x]*scalar;return new vec3(tmp[0],tmp[1],tmp[2])}}]),vec3}(),quat4=function(){function quat4(vec,w){_classCallCheck(this,quat4),this.x=vec.elements[0],this.y=vec.elements[1],this.z=vec.elements[2],this.w=w}return _createClass(quat4,[{key:"normalize",value:function(){var len=Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w);return 0===len?(this.x=0,this.y=0,this.z=0,this.w=0):(len=1/len,this.x=this.x*len,this.y=this.y*len,this.z=this.z*len,this.w=this.w*len),this}},{key:"length",value:function(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}}],[{key:"toAxisAngle",value:function(vec,angleDeg){var ax=vec.elements[0],ay=vec.elements[1],az=vec.elements[2],mag2=ax*ax+ay*ay+az*az,quat4_tmp=new quat4(new vec3(0,0,0),0);if(mag2-1>1e-7||-1e-7>mag2-1){var normer=1/Math.sqrt(mag2);ax*=normer,ay*=normer,az*=normer}var halfAngle=angleDeg*Math.PI/360,s=Math.sin(halfAngle);return quat4_tmp.x=ax*s,quat4_tmp.y=ay*s,quat4_tmp.z=az*s,quat4_tmp.w=Math.cos(halfAngle),quat4_tmp}},{key:"inverse",value:function(quat){return new quat4(new vec3(quat.x*=-1,quat.y*=-1,quat.z*=1),quat.w)}},{key:"multiply",value:function(q1,q2){var quat4_tmp=new quat4(new vec3(0,0,0),0);return quat4_tmp.x=q1.x*q2.w+q1.y*q2.z-q1.z*q2.y+q1.w*q2.x,quat4_tmp.y=-q1.x*q2.z+q1.y*q2.w+q1.z*q2.x+q1.w*q2.y,quat4_tmp.z=q1.x*q2.y-q1.y*q2.x+q1.z*q2.w+q1.w*q2.z,quat4_tmp.w=-q1.x*q2.x-q1.y*q2.y-q1.z*q2.z+q1.w*q2.w,quat4_tmp}},{key:"multiplyVec3",value:function(quat,vec){var vec3_tmp=new vec3(0,0,0),x=vec.elements[0],y=vec.elements[1],z=vec.elements[2],qx=quat.x,qy=quat.y,qz=quat.z,qw=quat.w,ix=qw*x+qy*z-qz*y,iy=qw*y+qz*x-qx*z,iz=qw*z+qx*y-qy*x,iw=-qx*x-qy*y-qz*z;return vec3_tmp.elements[0]=ix*qw+iw*-qx+iy*-qz-iz*-qy,vec3_tmp.elements[1]=iy*qw+iw*-qy+iz*-qx-ix*-qz,vec3_tmp.elements[2]=iz*qw+iw*-qz+ix*-qy-iy*-qx,vec3_tmp}}]),quat4}();