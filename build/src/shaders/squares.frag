// copy.frag

#define SHADER_NAME SIMPLE_TEXTURE

precision highp float;
varying vec2 vTextureCoord;
varying vec2 vUV;
varying vec2 vUVCenter;
varying vec3 vExtra;

uniform sampler2D texture;
uniform float uMixing;

void main(void) {
    // gl_FragColor = vec4(vTextureCoord, 1.0, 1.0);
    // gl_FragColor = vec4(vUV, 1.0, 1.0);
    // gl_FragColor = texture2D(texture, vUV);

    vec4 color0 = texture2D(texture, vUV);
    vec4 color1 = texture2D(texture, vUVCenter);

    gl_FragColor = mix(color0, color1, (0.5 + vExtra.y * .5) * uMixing );
    // gl_FragColor = color0;
}