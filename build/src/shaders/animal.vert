// basic.vert

precision highp float;
attribute vec3 aVertexPosition;
attribute vec3 aNormal;

uniform mat4 uLocalMatrix;
uniform mat4 uModelMatrix;
uniform mat4 uViewMatrix;
uniform mat4 uProjectionMatrix;
uniform mat3 uNormalMatrix;

varying vec3 vNormal;
varying vec4 vScreenPosition;

void main(void) {
	vec3 pos        = aVertexPosition;
	pos.y           += 0.2;
	vScreenPosition = uProjectionMatrix * uViewMatrix * uModelMatrix * uLocalMatrix * vec4(pos, 1.0);
	gl_Position     = vScreenPosition;
	
	vec3 N          = (uLocalMatrix * vec4(aNormal, 1.0)).xyz;
	vNormal         = uNormalMatrix * N;
}