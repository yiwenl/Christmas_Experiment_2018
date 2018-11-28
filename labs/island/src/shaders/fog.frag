precision highp float;

#define NUM ${NUM}

varying vec2 vTextureCoord;
varying vec3 vPosition;
varying vec3 vWsPosition;

uniform sampler2D texture0;
uniform sampler2D texture1;
uniform mat4 uModelMatrix;
uniform float uPercent;
uniform float uNum;
uniform float uNumSlices;
uniform float uOffset;
uniform float uSize;
uniform vec3 uDir;
uniform vec3 uPosOffset;
uniform vec3 uLights[NUM];


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


vec3 power(vec3 v, float p) {
	return vec3(
			pow(v.x, p),
			pow(v.y, p),
			pow(v.z, p)
		);
}


float getLight(vec3 pos, vec3 dir, vec3 posOffset) {
	vec3 _pos = pos + posOffset;
	vec3 dirToPoint     = normalize(_pos);
	float angle         = acos(dot(dirToPoint, dir));
	float distToLine    = sin(angle) * length(_pos);
	float distIntersect = cos(angle) * length(_pos);
	distIntersect       = 1.0 - smoothstep(0.0, uSize * 3.0, distIntersect);
	distToLine          = smoothstep(2.0 * distIntersect, 0.0, distToLine);

	return distToLine;
}


float getLight(vec3 pos, vec3 dir) {
	return getLight(pos, dir, vec3(0.0));
}




void main(void) {
	vec3 pos = vPosition;
	pos.xz = pos.xz / uSize * .5 + .5;
	pos.y = (pos.y + uSize)/uSize/2.0;

	vec3 color0 = texture3D(pos, texture0);
	vec3 color1 = texture3D(pos, texture1);

	vec3 color = mix(color0, color1, uPercent);

	pos = vPosition - uPosOffset;

	//	cone light
	// float distToLine0 	= getLight(pos, uDir, vec3(1.0, 0.0, 0.0));
	// float distToLine1 	= getLight(pos, uDir, vec3(-1.0, 0.0, 0.0));
	// float distToLine 	= distToLine0 + distToLine1;
	float distToLine = 0.0;
	for( int i=0; i<NUM; i++) {
		vec3 light = uLights[i];
		float l = getLight(pos, uDir, vec3(light.x, 0, light.y));
		distToLine += l;
	}

	// color.r             += pow(distToLine, 5.0) * 0.01;
	distToLine          = pow(distToLine, 1.0);

    // gl_FragColor = vec4( power(color.rrr * distToLine, 1.0 + uOffset) * 2.0, 1.0 );
    gl_FragColor = vec4( power(color.rrr, 1.0 + uOffset) * 2.0 * distToLine, 1.0 );
    // gl_FragColor = vec4( vec3(distToLine * 0.05), 1.0);
    // gl_FragColor = vec4(1.0);
}