// basic.vert

precision highp float;
attribute vec3 aVertexPosition;
attribute vec2 aTextureCoord;
attribute vec3 aNormal;
attribute vec3 aExtra;
attribute vec3 aPosOffset;

uniform mat4 uModelMatrix;
uniform mat4 uViewMatrix;
uniform mat4 uProjectionMatrix;
uniform float uTime;
uniform float uRadius;
uniform float uSpeed;

varying vec2 vTextureCoord;
varying vec3 vNormal;

mat4 rotationMatrix(vec3 axis, float angle) {
    axis = normalize(axis);
    float s = sin(angle);
    float c = cos(angle);
    float oc = 1.0 - c;
    
    return mat4(oc * axis.x * axis.x + c,           oc * axis.x * axis.y - axis.z * s,  oc * axis.z * axis.x + axis.y * s,  0.0,
                oc * axis.x * axis.y + axis.z * s,  oc * axis.y * axis.y + c,           oc * axis.y * axis.z - axis.x * s,  0.0,
                oc * axis.z * axis.x - axis.y * s,  oc * axis.y * axis.z + axis.x * s,  oc * axis.z * axis.z + c,           0.0,
                0.0,                                0.0,                                0.0,                                1.0);
}

vec3 rotate(vec3 v, vec3 axis, float angle) {
	mat4 m = rotationMatrix(axis, angle);
	return (m * vec4(v, 1.0)).xyz;
}

void main(void) {
	vec3 scale     = mix(aExtra, vec3(1.0), .75);
	vec3 axis      = normalize(aExtra);
	float angle    = aExtra.y + mix(aExtra.z, 1.0, .5) * uTime;
	vec3 pos       = rotate(aVertexPosition, axis, angle);
	pos            = pos * scale * .0006;
	
	vec3 dir       = vec3(aExtra.x, aExtra.y * .5 + .5, aExtra.z);
	dir.y          *= -1.0;
	vec3 posOffset = aPosOffset + dir * uTime * 0.1 * uSpeed;
	posOffset.y    = mod(posOffset.y, uRadius);
	posOffset.x    = mod(posOffset.x + uRadius, uRadius * 2.0) - uRadius;
	posOffset.z    = mod(posOffset.z + uRadius, uRadius * 2.0) - uRadius;
	pos            += posOffset;
	
	gl_Position    = uProjectionMatrix * uViewMatrix * uModelMatrix * vec4(pos, 1.0);
	vTextureCoord  = aTextureCoord;
	vNormal        = aNormal;
}