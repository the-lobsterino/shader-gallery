

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float sphere(vec3 p, float r) {
	return length(p) - r;	
}
float map(vec3 p) {
	return sphere(p, 0.5);
}
vec3 getNormal(vec3 p) {
	vec2 h = vec2(0.001,0);
	return normalize(vec3(map(p+h.xyy) - map(p-h.xyy),
                              map(p+h.yxy) - map(p-h.yxy),
                              map(p+h.yyx) - map(p-h.yyx) ) );
}
void main(void) {
	vec2 position = (gl_FragCoord.xy - 0.5 * resolution) / resolution.y;
	vec3 ro = vec3(0, 0, 3);
	vec3 rd = normalize(vec3(position, -1.0));
	float t = 0.0;
	vec3 p;
	for (int i = 0; i < 100; i++) {
		p = ro + rd * t;
		
		float dist = map(p);
		t += dist;
		
		if (t > 100.0) { 
			t = -1.0;
			break;
		}
		if (dist < 0.001) break;
	}
	vec3 col = vec3(0.0);
	if (t > 0.0) {
		vec3 n = getNormal(p);
		col = n * 0.5 + 0.5;
	}
	gl_FragColor = vec4(sqrt(col), 1.0 );

}