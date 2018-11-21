// copy.frag

#define SHADER_NAME SIMPLE_TEXTURE

precision highp float;
varying vec2 vTextureCoord;
uniform sampler2D texture;

varying vec4 vScreenPosition;

void main(void) {

	float d = distance(vTextureCoord, vec2(.5));
	d = smoothstep(0.5, 0.35, d);

    float z = vScreenPosition.z / vScreenPosition.w;
    gl_FragColor = vec4(vec3(z * 0.25), d);
}