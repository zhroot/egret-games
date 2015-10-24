var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
/**
 * Copyright (c) 2014,Egret-Labs.org
 * All rights reserved.
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 *     * Redistributions of source code must retain the above copyright
 *       notice, this list of conditions and the following disclaimer.
 *     * Redistributions in binary form must reproduce the above copyright
 *       notice, this list of conditions and the following disclaimer in the
 *       documentation and/or other materials provided with the distribution.
 *     * Neither the name of the Egret-Labs.org nor the
 *       names of its contributors may be used to endorse or promote products
 *       derived from this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY EGRET-LABS.ORG AND CONTRIBUTORS "AS IS" AND ANY
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL EGRET-LABS.ORG AND CONTRIBUTORS BE LIABLE FOR ANY
 * DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 * SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */
var egret;
(function (egret) {
    var WebGLShaderManager = (function () {
        function WebGLShaderManager(gl) {
            this.maxAttibs = 10;
            this.attribState = [];
            this.tempAttribState = [];
            for (var i = 0; i < this.maxAttibs; i++) {
                this.attribState[i] = false;
            }
            this.setContext(gl);
        }
        WebGLShaderManager.prototype.setContext = function (gl) {
            this.gl = gl;
            this.primitiveShader = new PrimitiveShader(gl);
            this.defaultShader = new EgretShader(gl);
            this.colorTransformShader = new ColorTransformShader(gl);
            this.activateShader(this.defaultShader);
        };
        WebGLShaderManager.prototype.activateShader = function (shader) {
            if (this.currentShader != shader) {
                this.gl.useProgram(shader.program);
                this.setAttribs(shader.attributes);
                this.currentShader = shader;
            }
        };
        WebGLShaderManager.prototype.setAttribs = function (attribs) {
            var i;
            var l;
            l = this.tempAttribState.length;
            for (i = 0; i < l; i++) {
                this.tempAttribState[i] = false;
            }
            l = attribs.length;
            for (i = 0; i < l; i++) {
                var attribId = attribs[i];
                this.tempAttribState[attribId] = true;
            }
            var gl = this.gl;
            l = this.attribState.length;
            for (i = 0; i < l; i++) {
                if (this.attribState[i] !== this.tempAttribState[i]) {
                    this.attribState[i] = this.tempAttribState[i];
                    if (this.tempAttribState[i]) {
                        gl.enableVertexAttribArray(i);
                    }
                    else {
                        gl.disableVertexAttribArray(i);
                    }
                }
            }
        };
        return WebGLShaderManager;
    })();
    egret.WebGLShaderManager = WebGLShaderManager;
    WebGLShaderManager.prototype.__class__ = "egret.WebGLShaderManager";
    var EgretShader = (function () {
        function EgretShader(gl) {
            this.defaultVertexSrc = "attribute vec2 aVertexPosition;\n" + "attribute vec2 aTextureCoord;\n" + "attribute vec2 aColor;\n" + "uniform vec2 projectionVector;\n" + "uniform vec2 offsetVector;\n" + "varying vec2 vTextureCoord;\n" + "varying vec4 vColor;\n" + "const vec2 center = vec2(-1.0, 1.0);\n" + "void main(void) {\n" + "   gl_Position = vec4( ((aVertexPosition + offsetVector) / projectionVector) + center , 0.0, 1.0);\n" + "   vTextureCoord = aTextureCoord;\n" + "   vColor = vec4(aColor.x, aColor.x, aColor.x, aColor.x);\n" + "}";
            this.program = null;
            this.fragmentSrc = "precision lowp float;\n" + "varying vec2 vTextureCoord;\n" + "varying vec4 vColor;\n" + "uniform sampler2D uSampler;\n" + "void main(void) {\n" + "gl_FragColor = texture2D(uSampler, vTextureCoord) * vColor ;\n" + "}";
            this.gl = gl;
            this.init();
        }
        EgretShader.prototype.init = function () {
            var gl = this.gl;
            var program = egret.WebGLUtils.compileProgram(gl, this.defaultVertexSrc, this.fragmentSrc);
            gl.useProgram(program);
            this.uSampler = gl.getUniformLocation(program, "uSampler");
            this.projectionVector = gl.getUniformLocation(program, "projectionVector");
            this.offsetVector = gl.getUniformLocation(program, "offsetVector");
            this.dimensions = gl.getUniformLocation(program, "dimensions");
            this.aVertexPosition = gl.getAttribLocation(program, "aVertexPosition");
            this.aTextureCoord = gl.getAttribLocation(program, "aTextureCoord");
            this.colorAttribute = gl.getAttribLocation(program, "aColor");
            if (this.colorAttribute === -1) {
                this.colorAttribute = 2;
            }
            this.attributes = [this.aVertexPosition, this.aTextureCoord, this.colorAttribute];
            for (var key in this.uniforms) {
                this.uniforms[key].uniformLocation = gl.getUniformLocation(program, key);
            }
            this.initUniforms();
            this.program = program;
        };
        EgretShader.prototype.initUniforms = function () {
            if (!this.uniforms) {
                return;
            }
            var gl = this.gl;
            var uniform;
            for (var key in this.uniforms) {
                uniform = this.uniforms[key];
                var type = uniform.type;
                if (type === 'mat2' || type === 'mat3' || type === 'mat4') {
                    uniform.glMatrix = true;
                    uniform.glValueLength = 1;
                    if (type === 'mat2') {
                        uniform.glFunc = gl.uniformMatrix2fv;
                    }
                    else if (type === 'mat3') {
                        uniform.glFunc = gl.uniformMatrix3fv;
                    }
                    else if (type === 'mat4') {
                        uniform.glFunc = gl.uniformMatrix4fv;
                    }
                }
                else {
                    uniform.glFunc = gl['uniform' + type];
                    if (type === '2f' || type === '2i') {
                        uniform.glValueLength = 2;
                    }
                    else if (type === '3f' || type === '3i') {
                        uniform.glValueLength = 3;
                    }
                    else if (type === '4f' || type === '4i') {
                        uniform.glValueLength = 4;
                    }
                    else {
                        uniform.glValueLength = 1;
                    }
                }
            }
        };
        EgretShader.prototype.syncUniforms = function () {
            if (!this.uniforms) {
                return;
            }
            var uniform;
            var gl = this.gl;
            for (var key in this.uniforms) {
                uniform = this.uniforms[key];
                if (uniform.glValueLength === 1) {
                    if (uniform.glMatrix === true) {
                        uniform.glFunc.call(gl, uniform.uniformLocation, uniform.transpose, uniform.value);
                    }
                    else {
                        uniform.glFunc.call(gl, uniform.uniformLocation, uniform.value);
                    }
                }
                else if (uniform.glValueLength === 2) {
                    uniform.glFunc.call(gl, uniform.uniformLocation, uniform.value.x, uniform.value.y);
                }
                else if (uniform.glValueLength === 3) {
                    uniform.glFunc.call(gl, uniform.uniformLocation, uniform.value.x, uniform.value.y, uniform.value.z);
                }
                else if (uniform.glValueLength === 4) {
                    uniform.glFunc.call(gl, uniform.uniformLocation, uniform.value.x, uniform.value.y, uniform.value.z, uniform.value.w);
                }
            }
        };
        return EgretShader;
    })();
    egret.EgretShader = EgretShader;
    EgretShader.prototype.__class__ = "egret.EgretShader";
    var ColorTransformShader = (function (_super) {
        __extends(ColorTransformShader, _super);
        function ColorTransformShader(gl) {
            _super.call(this, gl);
            this.fragmentSrc = "precision mediump float;\n" + "varying vec2 vTextureCoord;\n" + "varying vec4 vColor;\n" + "uniform float invert;\n" + "uniform mat4 matrix;\n" + "uniform vec4 colorAdd;\n" + "uniform sampler2D uSampler;\n" + "void main(void) {\n" + "vec4 locColor = texture2D(uSampler, vTextureCoord) * matrix;\n" + "if(locColor.a != 0.0){\n" + "locColor += colorAdd;\n" + "}\n" + "gl_FragColor = locColor;\n" + "}";
            this.uniforms = {
                matrix: { type: 'mat4', value: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1] },
                colorAdd: { type: '4f', value: { x: 0, y: 0, z: 0, w: 0 } }
            };
            this.init();
        }
        return ColorTransformShader;
    })(EgretShader);
    egret.ColorTransformShader = ColorTransformShader;
    ColorTransformShader.prototype.__class__ = "egret.ColorTransformShader";
    var PrimitiveShader = (function () {
        function PrimitiveShader(gl) {
            this.program = null;
            this.projectionVector = null;
            this.offsetVector = null;
            this.tintColor = null;
            this.aVertexPosition = null;
            this.colorAttribute = null;
            this.attributes = null;
            this.translationMatrix = null;
            this.alpha = null;
            this.fragmentSrc = "precision mediump float;\n" + "varying vec4 vColor;\n" + "void main(void) {\n" + "   gl_FragColor = vColor;\n" + "}";
            this.vertexSrc = "attribute vec2 aVertexPosition;\n" + "attribute vec4 aColor;\n" + "uniform mat3 translationMatrix;\n" + "uniform vec2 projectionVector;\n" + "uniform vec2 offsetVector;\n" + "uniform float alpha;\n" + "uniform vec3 tint;\n" + "varying vec4 vColor;\n" + "void main(void) {\n" + "   vec3 v = translationMatrix * vec3(aVertexPosition , 1.0);\n" + "   v -= offsetVector.xyx;\n" + "   gl_Position = vec4( v.x / projectionVector.x -1.0, v.y / -projectionVector.y + 1.0 , 0.0, 1.0);\n" + "   vColor = aColor * vec4(tint * alpha, alpha);\n" + "}";
            this.gl = gl;
            this.init();
        }
        PrimitiveShader.prototype.init = function () {
            var gl = this.gl;
            var program = egret.WebGLUtils.compileProgram(gl, this.vertexSrc, this.fragmentSrc);
            gl.useProgram(program);
            this.projectionVector = gl.getUniformLocation(program, "projectionVector");
            this.offsetVector = gl.getUniformLocation(program, "offsetVector");
            this.tintColor = gl.getUniformLocation(program, "tint");
            this.aVertexPosition = gl.getAttribLocation(program, "aVertexPosition");
            this.colorAttribute = gl.getAttribLocation(program, "aColor");
            this.attributes = [this.aVertexPosition, this.colorAttribute];
            this.translationMatrix = gl.getUniformLocation(program, "translationMatrix");
            this.alpha = gl.getUniformLocation(program, "alpha");
            this.program = program;
        };
        return PrimitiveShader;
    })();
    egret.PrimitiveShader = PrimitiveShader;
    PrimitiveShader.prototype.__class__ = "egret.PrimitiveShader";
})(egret || (egret = {}));
