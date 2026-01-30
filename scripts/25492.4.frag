#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float noise(float x) {
	return abs(fract(sin(x*321.123)*123.321));
}

vec3 noise3d(float f) {
	return vec3(noise(f), noise(f+1.0), noise(f+2.0));
}

float sphere(vec3 p, vec3 o, float r) {
	return distance(p, o) - r;
}

float dist(vec3 p) {
	p.z = mod(p.z, 10.0);
	p.x = mod(p.x, 10.0);
	if (p.y > 0.0) p.y = mod(p.y, 10.0);
	float d = 9999.;
	for (int i = 0; i < 16; i++) {
		float fi = float(i);
		vec3 c = noise3d(fi)*7.+2.0;
		c.y += fract(time/(fi));
		d = min(d, sphere(p, c, 1.0));
	}
	return min(p.y+2.0+noise(p.x+p.z)*.0001, d);
}

vec3 normal(vec3 p) {
	vec2 d = vec2(0.0, 0.001);
	return (dist(p) - vec3(dist(p + d.yxx), dist(p+d.xyx), dist(p+d.xxy)))/0.001;
}

void main( void ) {

	vec2 p = ( gl_FragCoord.xy / resolution.xy )*2.0-1.0;

	vec3 ro = vec3(0, 5.0-5.*mouse.y, 0);
	ro.y += sin(time);
	ro.z += time*6.0;
	vec3 rd = normalize(vec3(p, 1.0));

	float t = 0.0;
	for (int i = 0; i < 20; i++) {
		float d = dist(ro + rd*t);
		if (d < 0.0001) break;
		if (t > 200.0) break;
		t = t+d;
	}
	
	float color = dot(normal(ro+rd*t), rd);
	color = 20.0*color/pow(t, 2.0);
	
	
	vec3 rgb = color + vec3(noise(p.x+p.y+t), noise(p.x - p.y + t), noise(p.x + p.y - t))*.2;
	
	gl_FragColor = vec4( rgb, 1.0 );

}