// basic.vert

precision highp float;
attribute vec3 aVertexPosition;
attribute vec2 aTextureCoord;
attribute vec3 aNormal;

uniform mat4 uModelMatrix;
uniform mat4 uViewMatrix;
uniform mat4 uProjectionMatrix;
uniform float uFloorHeight;

uniform sampler2D texture;

varying vec2 vTextureCoord;
varying vec3 vNormal;
varying vec4 vScreenPosition;

void main(void) {
	vec3 pos        = aVertexPosition;
	float h         = texture2D(texture, aTextureCoord).r;
	pos.y           = h * uFloorHeight;
	vScreenPosition = uProjectionMatrix * uViewMatrix * uModelMatrix * vec4(pos, 1.0);
	gl_Position     = vScreenPosition;
	vTextureCoord   = aTextureCoord;
	vNormal         = aNormal;
}