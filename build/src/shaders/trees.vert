// basic.vert

precision highp float;
attribute vec3 aVertexPosition;
attribute vec2 aTextureCoord;
attribute vec3 aNormal;
attribute vec4 aPosOffset;

uniform mat4 uModelMatrix;
uniform mat4 uViewMatrix;
uniform mat4 uProjectionMatrix;

varying vec2 vTextureCoord;
varying vec3 vNormal;
varying vec4 vScreenPosition;

vec2 rotate(vec2 v, float a) {
	float s = sin(a);
	float c = cos(a);
	mat2 m = mat2(c, -s, s, c);
	return m * v;
}

void main(void) {
	vec3 pos        = aVertexPosition;
	float scale     = mix(aPosOffset.z, 1.0, .25);
	pos.xz          = rotate(pos.xz, aPosOffset.w);
	pos.y           *= 3.0;
	pos.y           -= 2.0;
	pos             *= scale;
	pos.xz          += aPosOffset.xy;
	
	vScreenPosition = uProjectionMatrix * uViewMatrix * uModelMatrix * vec4(pos, 1.0);
	gl_Position     = vScreenPosition;
	vTextureCoord   = aTextureCoord;
	vNormal         = aNormal;
}