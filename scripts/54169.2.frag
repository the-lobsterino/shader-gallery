#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define STEPS 100.
#define SLOWRAY .7

float sphere(vec3 p, float radius) {
	return length(p) - radius;
}

float box(vec3 p, float size) {
	p = abs(p) - size;
	float rot = pow(sin(time), 3.);
	p = vec3(p.x*cos(rot)-p.y*sin(rot),p.x*sin(rot)+p.y*cos(rot), p.z);
	return length(max(p,0.0)) - min(max(p.x,max(p.y,p.z)),0.0);
}

float map(vec3 p) {
	p = mod(p, 3.) -1.5;
	return max(
		-sphere(p, 1.3 + .26*pow(sin(time*2.), 3.)),
		box(p, 1.1)
	);
}

vec3 normal(vec3 p) {
	vec2 c = vec2(.001/*epsilon*/,0.);
	return normalize(vec3(
		map(p+c.xyy) - map(p-c.xyy),
		map(p+c.yxy) - map(p-c.yxy),
		map(p+c.yyx) - map(p-c.yyx)		
		));
}

float light(vec3 p, vec3 ldir) {
	return dot(normal(p), ldir) * .7 + .3;
}
	     
void main( void ) {
	vec2 uv = (2. * gl_FragCoord.xy - resolution.xy) / min(resolution.x, resolution.y);
	vec3 raydir = normalize(vec3(uv, 1.5));

	bool hit = false;
	vec3 eye = vec3(0.,0.,time+.3*cos(time*4.));
	vec3 p = eye;
	float shading = 0.;
	
	vec3 ldir = normalize(vec3(.5,1.,-3.));
	
	for (float step = 0.; step < STEPS; step++) {
		float d = map(p);
		if (d < 0.01) {
			hit = true;
			shading = step/STEPS;
			break;
		}
		p += d * raydir * SLOWRAY;
	}
	
	
	vec3 color = vec3(0.);
	if (hit) color = mix(vec3(.2,.1,.3), vec3(.9,.5,.3), light(p,ldir))-shading;	
	
	color = mix(color, vec3(.2,.3,.6), clamp(length(p-eye)/80., 0., 1.));
	
	
	gl_FragColor = vec4(color,1.);

}