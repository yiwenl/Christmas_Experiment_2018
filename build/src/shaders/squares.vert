// basic.vert

precision highp float;
attribute vec3 aVertexPosition;
attribute vec2 aTextureCoord;
attribute vec3 aNormal;
attribute vec3 aPosOffset;
attribute vec3 aExtra;

uniform mat4 uModelMatrix;
uniform mat4 uViewMatrix;
uniform mat4 uProjectionMatrix;
uniform mat4 uMatrix;
uniform float uOffset;

varying vec2 vTextureCoord;
varying vec3 vNormal;
varying vec2 vUV;
varying vec2 vUVCenter;
varying vec4 vScreenPosition;
varying vec3 vExtra;

float cubicInOut(float t) {
  return t < 0.5
    ? 4.0 * t * t * t
    : 0.5 * pow(2.0 * t - 2.0, 3.0) + 1.0;
}

float circularIn(float t) {
  return 1.0 - sqrt(1.0 - t * t);
}



float circularOut(float t) {
  return sqrt((2.0 - t) * t);
}

float circularInOut(float t) {
  return t < 0.5
    ? 0.5 * (1.0 - sqrt(1.0 - 4.0 * t * t))
    : 0.5 * (sqrt((3.0 - 2.0 * t) * (2.0 * t - 1.0)) + 1.0);
}

float cubicOut(float t) {
  float f = t - 1.0;
  return f * f * f + 1.0;
}

void main(void) {
	float scale   = -aExtra.z + uOffset * 2.0;
	scale         = smoothstep(0.0, 1.0, scale);
	scale         = circularInOut(scale);
	
	vec3 pos      = aVertexPosition;
	pos           *= mix(aExtra.x, 1.0, .5) * scale; 
	pos           += aPosOffset;
	gl_Position   = uProjectionMatrix * uViewMatrix * uModelMatrix * vec4(pos, 1.0);
	vTextureCoord = aTextureCoord;
	vNormal       = aNormal;


	// vec4 coord    = uMatrix * uModelMatrix * vec4(pos, 1.0);
	// vec4 coord    = uMatrix * uModelMatrix * vec4(aPosOffset, 1.0);
	vec4 coord = uMatrix * uModelMatrix * vec4(pos, 1.0);
	vUV        = coord.xy / coord.w * .5 + .5;
	coord      = uMatrix * uModelMatrix * vec4(aPosOffset, 1.0);
	vUVCenter  = coord.xy / coord.w * .5 + .5;

	vExtra = aExtra;
}