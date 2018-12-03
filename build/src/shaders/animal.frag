precision highp float;
varying vec3 vNormal;
varying vec4 vScreenPosition;

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
}