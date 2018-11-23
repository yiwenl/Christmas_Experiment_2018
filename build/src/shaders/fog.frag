precision highp float;
varying vec2 vTextureCoord;
varying vec3 vPosition;
uniform sampler2D texture0;
uniform sampler2D texture1;
uniform float uPercent;
uniform float uNum;
uniform float uNumSlices;
uniform float uOffset;


vec2 getUVOffset(float index) {
	float x = mod(index, uNum);
	float y = floor(index/uNum);
	return vec2(x, y) / uNum;
}

vec3 texture3D(vec3 pos, sampler2D texture) {
	vec3 posAdj = (pos * .25 + .5);
	
	float tz    = posAdj.z;
	float num   = uNum * uNum;
	
	float i0    = floor(tz * num);
	float i1    = ceil(tz * num);
	vec2 uv0    = posAdj.xy / uNum + getUVOffset(i0);
	vec2 uv1    = posAdj.xy / uNum + getUVOffset(i1);
	vec3 color0 = texture2D(texture, uv0).xyz;
	vec3 color1 = texture2D(texture, uv1).xyz;
	float p     = mod(tz * num - i0, 1.0);
	vec3 color  = mix(color0, color1, p);
	
	color       /= uNumSlices;
	return color;
}



void main(void) {
	vec3 color0 = texture3D(vPosition, texture0);
	vec3 color1 = texture3D(vPosition, texture1);

	vec3 color = mix(color0, color1, uPercent);

	float a = smoothstep(-0.5, -0.2, vPosition.y);
    // gl_FragColor = vec4( pow(color.r, 1.0 + uOffset) * 2.0);
    gl_FragColor = vec4( vec3(pow(color.r, 1.0 + uOffset) * 2.0), 1.0 );
    // gl_FragColor = vec4( a);
}