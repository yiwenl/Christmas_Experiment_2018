// basic.vert

precision highp float;
attribute vec3 aVertexPosition;
attribute vec2 aTextureCoord;
attribute vec3 aNormal;
attribute vec3 aPosOffset;

uniform mat4 uModelMatrix;
uniform mat4 uViewMatrix;
uniform mat4 uProjectionMatrix;

varying vec2 vTextureCoord;
varying vec3 vNormal;
varying vec4 vScreenPosition;

void main(void) {
	vec3 pos        = aVertexPosition;
	pos.xz          *= mix(aPosOffset.y, 1.0, .5) * 2.0;
	pos.y           *= 10.0;
	pos.y           -= 1.0;
	
	pos.xz          += aPosOffset.xz;
	
	vScreenPosition = uProjectionMatrix * uViewMatrix * uModelMatrix * vec4(pos, 1.0);
	gl_Position     = vScreenPosition;
	vTextureCoord   = aTextureCoord;
	vNormal         = aNormal;
}