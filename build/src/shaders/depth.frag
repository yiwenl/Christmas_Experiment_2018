precision highp float;
varying vec4 vScreenPosition;
varying float vOpacity;

void main(void) {
	float z = vScreenPosition.z / vScreenPosition.w;
	// z = smoothstep(0.9, 1.0, z);
    gl_FragColor = vec4(vec3(z * 0.25), 1.0);
}