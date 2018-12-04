// basic.vert

precision highp float;
attribute vec3 aVertexPosition;
attribute vec4 aPosOffset;

uniform mat4 uLocalMatrix;
uniform mat4 uModelMatrix;
uniform mat4 uViewMatrix;
uniform mat4 uProjectionMatrix;
uniform float uTreeScale;
uniform vec3 uCamPos;

varying vec4 vScreenPosition;

vec2 rotate(vec2 v, float a) {
	float s = sin(a);
	float c = cos(a);
	mat2 m = mat2(c, -s, s, c);
	return m * v;
}

void main(void) {
	float d = distance(uCamPos.xz, aPosOffset.xy);
	float t = smoothstep(1.0, 2.5, d);
	t = mix(1.0, t, .5);

	
	vec3 pos        = (uLocalMatrix * vec4(aVertexPosition, 1.0)).xyz;
	float scale     = mix(aPosOffset.z, 1.0, .3);
	pos.xz          = rotate(pos.xz, aPosOffset.w);
	pos.xz 			*= t;
	pos.y           *= 3.0;
	pos.y           -= 3.0;
	pos             *= scale * uTreeScale;

	pos.xz          += aPosOffset.xy;

	
	vScreenPosition = uProjectionMatrix * uViewMatrix * uModelMatrix * vec4(pos, 1.0);
	gl_Position     = vScreenPosition;
}