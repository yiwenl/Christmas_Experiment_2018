// copy.frag

#define SHADER_NAME SIMPLE_TEXTURE

precision highp float;
varying vec2 vTextureCoord;
uniform sampler2D texture;
uniform float uHeight;
uniform float uRange;
uniform float uPower;
uniform float uBumpHeight;
uniform vec2 uPos;

void main(void) {
	float d = distance(uPos, vTextureCoord);
	d = smoothstep(uRange, 0.0, d);
	d = pow(d, uPower);
    gl_FragColor = texture2D(texture, vTextureCoord);
    gl_FragColor.rgb += vec3(d * mix(uHeight, 1.0, 0.5) * uBumpHeight);
}