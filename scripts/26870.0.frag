#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float map(vec3 p) {
	p.y *= 1.0;
	return length(p) - 0.5 - 0.05 * sin(length(p.xy) * 3./sin(.512233*time+p.z)+10.*atan(p.y,p.x+.1));
}

vec3 calcNormal(vec3 p) {
	vec2 e = vec2(-1.0, 1.0);
	vec3 nor = e.xyy*map(p+e.xyy) + e.yxy*map(p+e.yxy) + e.yyx*map(p+e.yyx) + e.xxx*map(p+e.xxx);
	return normalize(nor);
}

void main( void ) {

	vec2 p = ( gl_FragCoord.xy / resolution.xy );
	p = 2.0 * p - 1.0;
	p.x *= resolution.x / resolution.y;
	vec2 ms = mouse * 2.0 - 1.0;
	ms.x *= resolution.x / resolution.y;
	float color = 0.0;
	float d = length(p);
	
	vec3 ro = vec3(0.0, 0.0, 3.0);
	vec3 rd = normalize(vec3(p.x, p.y, -5.0));
	float e = 0.0001;
	float h = e * 2.0;
	float t = 0.0;
	for(int i = 0; i < 60; i++) {
		if(abs(h) < e || t > 20.0) continue;
		h = map(ro + rd * t);
		t += h;
	}
	vec3 pos = ro + rd * t;
	vec3 nor = calcNormal(pos);
	vec3 lig = normalize(vec3(1.0));
	float dif = clamp(dot(nor, lig), 0.0, 1.0);
	float fre = clamp(1.0 + dot(nor, rd), 0.0, 1.0);
	float spe = pow(clamp(dot(reflect(rd, nor), lig), 0.0, 1.0), 32.0);
	color = fre + spe;
	if(t > 20.0) color = 0.5 / d;
	
	gl_FragColor = vec4( vec3( color ), 1.0 );
	
	gl_FragColor.g += pow(length(gl_FragColor)/6., 1.6);
	gl_FragColor.b += pow(length(gl_FragColor)/3.33, 2.);
}