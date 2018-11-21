// basic.vert

precision highp float;
attribute vec3 aVertexPosition;
attribute vec2 aTextureCoord;
attribute vec3 aNormal;

uniform mat4 uModelMatrix;
uniform mat4 uViewMatrix;
uniform mat4 uProjectionMatrix;

varying vec2 vTextureCoord;
varying vec3 vNormal;
varying vec4 vScreenPosition;

void main(void) {
	vScreenPosition = uProjectionMatrix * uViewMatrix * uModelMatrix * vec4(aVertexPosition, 1.0);
	gl_Position     = vScreenPosition;
	vTextureCoord   = aTextureCoord;
	vNormal         = aNormal;
}