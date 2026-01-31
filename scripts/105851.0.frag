#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

// a raymarching experiment by kabuto


const int MAXITER = 9;

vec3 field(vec3 p) {
	p *= .1;
	float f = .1;
	for (int i = 0; i <5; i++) {
		p = p.yzx*mat3(-.6,-.6,.6,.1,.6,.1,0.1,0,1.2);
		p += vec3(.123,.456,.789)*float(i);
		p = abs(fract(p)-.5);
		p *= 2.5;
		f *= 2.;
	}
	p *= p;
	return abs(p+p.yzx)/f+.02+sin(time*0.001);
}

void main( void ) {
	vec3 dir = normalize(vec3((gl_FragCoord.xy-resolution*.5)/resolution.x,1.));
vec3 pos = vec3(mouse+.0005,time*0.1);
	vec3 color = vec3(0);
	for (int i = 0; i < MAXITER; i++) {
		vec3 f2 = field(pos);
		float f = min(max(f2.x,f2.y),f2.z);
		
		pos += dir*f;
		color += float(MAXITER-i)/(f2-.007);
	}
	vec3 color3 = vec3(1.-1./(1.+color*(.3/float(MAXITER*MAXITER))));
	color3 *= color3;
	gl_FragColor = vec4(color3,1.);
}