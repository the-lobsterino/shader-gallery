#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform vec2 resolution;

float remap01(float a, float b, float t) {
	return (t-a) / (b - a);	
}

void main( void ) {
	vec2 uv = (gl_FragCoord.xy - .5 * resolution.xy) / resolution.y;
	
	vec3 col = vec3(0);
	
	vec3 ro = vec3(0);
	vec3 rd = normalize(vec3(uv.x, uv.y, 1));
	
	vec3 s = vec3(0, 0, 4);
	float r = 1.;
	
	float t = dot(s-ro, rd);
	
	vec3 p = ro + rd * t;
	
	float y = length(s-p);
	
	if(y < r) {
		float x = sqrt(r * r - y * y);
		float t1 = t - x;
		
		float c = remap01(s.z, s.z - r, t1);
		col = vec3(c);
	}
	
	gl_FragColor = vec4(col, 1.0);
		
	
}