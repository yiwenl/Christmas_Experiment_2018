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
uniform mat4 uViewInvert;
uniform mat4 uProjInvert;
uniform float uOffset;

uniform sampler2D textureDepth;

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


float getSurfacePosition(mat4 shadowMatrix, vec3 position, mat4 invertProj, mat4 invertView, sampler2D textureDepth) {
    
    //  get the shadow coord
	vec4 vShadowCoord = shadowMatrix * uModelMatrix * vec4(position, 1.0);
	vec4 shadowCoord  = vShadowCoord / vShadowCoord.w;
	vec2 uv           = shadowCoord.xy;

    //  reconstruct world position from depth buffer
	float depth             = texture2D(textureDepth, uv).r;
	float z                 = depth * 2.0 - 1.0;
	vec4 clipSpacePosition  = vec4(uv * 2.0 - 1.0, z, 1.0);
	vec4 viewSpacePosition  = invertProj * clipSpacePosition;
	viewSpacePosition       /= viewSpacePosition.w;
	vec4 worldSpacePosition = invertView * viewSpacePosition;
    return worldSpacePosition.z;
}


void main(void) {
	float scale     = -aExtra.z + uOffset * 2.0;
	scale           = smoothstep(0.0, 1.0, scale);
	scale           = circularInOut(scale);
	
	vec3 pos        = aVertexPosition;
	pos             *= mix(aExtra.x, 1.0, .5) * scale; 
	pos             += aPosOffset;
	
	float z         = getSurfacePosition(uMatrix, aPosOffset, uProjInvert, uViewInvert, textureDepth);
	pos.z           = z;
	vScreenPosition = uProjectionMatrix * uViewMatrix * uModelMatrix * vec4(pos, 1.0);
	gl_Position     = vScreenPosition;
	vTextureCoord   = aTextureCoord;
	vNormal         = aNormal;
	
	vec4 coord      = uMatrix * uModelMatrix * vec4(pos, 1.0);
	vUV             = coord.xy / coord.w;
	coord           = uMatrix * uModelMatrix * vec4(aPosOffset, 1.0);
	vUVCenter       = coord.xy / coord.w;
	
	vExtra          = aExtra;
}