#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform sampler2D b;

// tests with terrainmarching by Jaksa

float groundHeight(vec3 p) {
	p.z+=time;
	float d = p.y 
		//+ 2.2*sin(p.x*.013) 
		+ 3.1*sin(p.z*.012) 
		+ 2.2*cos(length(p.xz - vec2(5,14))*.1)
		//+ 1.2*cos(length(p.xz - vec2(-50,-14))*.12)
		+ 5.2*cos(pow(length(p.xz - vec2(31,-72)),.1)*.13)
		+ 4.2*cos(pow(length(p.xz - vec2(31,-72)),.1)*.13)
		+ cos(length(p.x*.1)*.4)*pow(length(p.xz*.01), 1.05)
		+ 10.
		+ pow(sin(p.x)*sin(p.z), 32.0)*.1
		+ pow(sin(p.x)*sin(p.z), 8.0)*.1
		;		
	return d;
}

float ground(vec3 rd, vec3 p) {
	float lb = 0.0;
	float ub = 20.0;
	float mb;
	float ld = groundHeight(p + rd*lb);
	float ud = groundHeight(p + rd*ub);
	
	if (ld < 0.) return ld;
	if (ud > 0.) return ub;
	
	for (int i = 0; i < 4; i++) {
		
		mb = lb - ld*(ud-ld)/(ub-lb);
		float md = groundHeight(p+rd*mb);
		if (md > 0.) {
			lb = mb; 
			ld = md;
		} else {
			ub = mb; 
			ud = md;
		}
	}
	return lb;
}

float field(vec3 rd, vec3 p) {
	float h = -groundHeight(vec3(0,0,100))+20.;
	vec3 r = normalize(p - vec3(0,0,3));
	float d = distance(p, vec3(0,0,3)) - 1.0 + pow(cos(r.x*30.)*cos(r.y*30.-time)*.55, 8.);
	d = min(d, ground(rd, p));
	return d;
}

vec3 grad(vec3 rd, vec3 p) {
	vec2 d = vec2(.001,0.);
	return (field(rd,p)-vec3(field(rd,p-d.xyy), field(rd,p-d.yxy), field(rd,p-d.yyx)))/d.x;
}

void main( void ) {

	//vec2 position = ( gl_FragCoord.xy / resolution.xy -.5)*2.;
	vec2 position = gl_FragCoord.xy/resolution.xy;
	position = 2.*position - 1.;
	position.x *= resolution.x/resolution.y;
	vec3 rd = normalize(vec3(position.x, position.y, 1));
	
	float d = 0.0;
	vec3 p = vec3(0,0,0);
	for (int i = 0; i < 52; i++) {
		d += field(rd, p);
		if (abs(d) < .01) break;
		p = rd * d;
	}

	vec3 g = normalize(grad(rd, p));
	
	float c = dot(-g, rd)*clamp(80./d, 0.0, 1.0);
		
	gl_FragColor = vec4(c, c, c, 1.0 )*.3 + texture2D(b, gl_FragCoord.xy / resolution.xy)*.7;
	
	//if (g.y > 0.) gl_FragColor.b = 1.0;

}