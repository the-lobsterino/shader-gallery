#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

const float PI = acos(-1.0);

vec3 uvToDir(vec2 uv) {
	vec2 angle = uv * PI * vec2(2.0, 1.0);
	
	float cosx = cos(angle.x);
	float sinx = sin(angle.x);
	float cosy = cos(angle.y);
	float siny = sin(angle.y);

	return vec3(sinx * siny, cosy, cosx * siny);	
}

vec2 dirToUv(vec3 dir) {
	float y = acos(dir.y) / PI;
	float x = atan(dir.x, dir.z) * 0.5 / PI - min(sign(dir.x),0.0);
	
	return vec2(x, y);
}

void main( void ) {

	vec2 uv = gl_FragCoord.xy / resolution.xy;
	
	vec3 dir = uvToDir(uv);
	vec2 reconstructedUv = dirToUv(dir);
	vec3 color = dir;

	gl_FragColor = vec4(vec3(reconstructedUv, 0.0), 1.0 );

}