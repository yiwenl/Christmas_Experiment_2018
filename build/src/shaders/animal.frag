precision highp float;
varying vec4 vScreenPosition;

void main(void) {
	float z = vScreenPosition.z / vScreenPosition.w;
    gl_FragColor = vec4(vec3(z * 0.25), 1.0);
    // gl_FragColor  = vec4(1.0, 0.0, 0.0, 1.0);
}