#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float map(vec3 p) {
	float a = p.z/30.;
	p = vec3(p.x*cos(a)-p.y*sin(a),p.y*cos(a)+p.x*sin(a), p.z);
	p.y += cos(p.z);
	p += cos(p.y*2.)*sin(p.x*2.+p.z)*(.7+sin(p.z/3.)*.4);
	return 2.+3.*abs(sin(time)) - length(p.xy);
}

vec3 normal(vec3 p) {
	vec2 e = vec2(0.001, 0);
	return normalize(vec3(
		map(p+e.xyy)-map(p-e.xyy),
		map(p+e.yxy)-map(p-e.yxy),
		map(p+e.yyx)-map(p-e.yyx)
		));
}

vec3 lightdir = normalize(vec3(.5,-.5, 1.1));
float light(vec3 p) {
	return dot(normal(p), -lightdir) * .5 + .5;
}

void main( void ) {

	vec2 pos= (2.*gl_FragCoord.xy - resolution.xy )/min(resolution.x, resolution.y);

	vec3 eye = vec3(0.,0.,time*4.);
	vec3 p = eye;
	vec3 raydir = normalize(vec3(pos.x, pos.y, 1.));
	int hit = -1;
	
	for (int i = 0; i < 200; i++) {
		float d = map(p);
		if (d < 0.001) {
			hit = i;
			break;
		}
		p += d * raydir * .4;
	}
	
	float color = -.5;
	if (hit > -1) color = light(p) - float(hit)/100.;
	
	gl_FragColor = vec4(mix(vec3(.5,.2,.4), vec3(.7,.8,.5), color), 1.0 );

}