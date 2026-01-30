#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;



const int MAXITER = 122;

vec3 field(vec3 p) {
	p *= .1;
	float f = .1;
	for (int i = 0; i < 1; i++) {
		p = p.yzx*mat3(.2,.3,0,-.7,.9,0,0,0,.6);
		p += vec3(.123,.456,.789)*float(i);
		p = abs(fract(p)-.5);
		p *= 3.0;
		f *= 3.0;
	}
	p *= p;
	return sqrt(p+p.yzx)/f-.002;
}

void main( void ) {
	vec3 dir = normalize(vec3((gl_FragCoord.xy-resolution*.5)/resolution.x,1.));
	vec3 pos = vec3(mouse-0.5,time);
	vec3 color = vec3(0);
	for (int i = 0; i < MAXITER; i++) {
		vec3 f2 = field(pos);
		float f = min(min(f2.x,f2.y),f2.z);
		
		pos += dir*f;
		color += float(MAXITER-i)/(f2+.002);
	}
	vec3 color3 = vec3(1.-1./(1.+color*(.06/float(MAXITER*MAXITER))));
	color3 *= color3;
	gl_FragColor = vec4(color3,1.);
}