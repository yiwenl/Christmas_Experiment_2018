precision highp float;
varying vec3 vNormal;
varying vec4 vScreenPosition;
varying vec2 vTextureCoord;

uniform sampler2D texture;
uniform sampler2D textureNoise;


#define PI 3.141592653
const float TwoPI = PI * 2.0;

vec2 envMapEquirect(vec3 wcNormal, float flipEnvMap) {
  float phi = acos(-wcNormal.y);
  float theta = atan(flipEnvMap * wcNormal.x, wcNormal.z) + PI;
  return vec2(theta / TwoPI, phi / PI);
}

vec2 envMapEquirect(vec3 wcNormal) {
    return envMapEquirect(wcNormal, -1.0);
}

#define LIGHT vec3(0.0, 0.0, 1.0)

float diffuse(vec3 N, vec3 L) {
	return max(dot(N, normalize(L)), 0.0);
}


vec3 diffuse(vec3 N, vec3 L, vec3 C) {
	return diffuse(N, L) * C;
}

void main(void) {
	float z = vScreenPosition.z / vScreenPosition.w;
    gl_FragColor = vec4(vec3(z * 0.25), 1.0);

    float d = diffuse(vNormal, LIGHT);
    gl_FragColor.rgb += pow(1.0 - d, 2.0) * .1;

    // vec3 noise = texture2D(textureNoise, vTextureCoord * 15.0).xyz - .5;
    // vec2 uv = envMapEquirect(normalize(vNormal + noise * 0.5));
    // uv.x = mod(uv.x + 0.2, 1.0);
    // float l = texture2D(texture, uv).r;
    // gl_FragColor.rgb += pow(l - .2, 5.0); 

    // gl_FragColor = vec4(vNormal, 1.0);
}