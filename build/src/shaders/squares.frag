// copy.frag

#define SHADER_NAME SIMPLE_TEXTURE

precision highp float;
varying vec2 vTextureCoord;
varying vec2 vUV;
varying vec2 vUVCenter;
varying vec3 vExtra;
varying vec4 vScreenPosition;

uniform sampler2D texture;
uniform sampler2D textureDepth;
uniform float uMixing;

void main(void) {
    vec4 color0 = texture2D(texture, vUV);
    vec4 color1 = texture2D(texture, vUVCenter);

    gl_FragColor = mix(color0, color1, (0.5 + vExtra.y * .5) * uMixing );

    float z = vScreenPosition.z / vScreenPosition.w;
    gl_FragColor.rgb *= (1.0 - z * 0.25);
}