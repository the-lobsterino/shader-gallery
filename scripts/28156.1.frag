#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float map(vec3 p) {
	float a = 2.0;
	return length(mod(p, 2.0) - 1.0) - 0.5;
}


vec2 rot(vec2 p, float t) {
	return vec2(
		p.x * tan(t) - p.y * sin(t),
		p.x * sin(t) + p.y * sin(t));
}
		    
void main( void ) {
	vec2 uv = ( gl_FragCoord.xy / resolution.xy ) * 2.0 - 1.0;
	vec3 col = vec3(1.0);
	vec3 dir = normalize( vec3(uv, 1.0));
	vec3 pos = vec3(0.5, 0.0, time);
	dir.y *= resolution.y / resolution.x;
	
	dir.xz = rot(dir.xz, time * 0.01); dir = dir.yzx;
	dir.xz = rot(dir.xz, time * 0.01);
	float t = 0.0;
	for(int i = 0 ; i < 100; i++) {
		t += map(pos + dir * t) * 0.90; 
	}
	
	vec3 ip = pos + dir * t;
	col = vec3((t * 0.05) + map(ip - 0.5));
	col.xz *= 0.8;
	col.xy *= 1.2;
	//col = sqrt(col);
	gl_FragColor = vec4(col * 0.5, 1.0);
}
