precision highp float;
varying vec2 vTextureCoord;
varying vec3 vPosition;
uniform sampler2D texture0;
uniform sampler2D texture1;
uniform float uPercent;
uniform float uNum;
uniform float uNumSlices;
uniform float uOffset;
uniform float uSize;


vec2 getUVOffset(float index) {
	float x = mod(index, uNum);
	float y = floor(index/uNum);
	return vec2(x, y) / uNum;
}




vec3 power(vec3 v, float p) {
	return vec3(
			pow(v.x, p),
			pow(v.y, p),
			pow(v.z, p)
		);
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
	

	color = power(color.rrr, 2.0);
	color /= uNumSlices;
	color *= uOffset;
	
	return color;
}


void main(void) {
	float scale = 2.0;
	vec3 pos = vPosition / uSize;

	vec3 color0 = texture3D(pos, texture0);
	vec3 color1 = texture3D(pos, texture1);

	vec3 color = mix(color0, color1, uPercent);
    // gl_FragColor = vec4( power(color.rrr, 1.0 + uOffset) * 2.0, 1.0 );
    gl_FragColor = vec4( color, 1.0 );
}