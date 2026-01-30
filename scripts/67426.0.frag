// N050920N Fraktal Art - deco light on the wall
precision highp float;
uniform vec2 resolution;
uniform float time;
varying vec2 surfacePosition;


vec2 rotate(vec2 v, float a) {
	float s = sin(a);
	float c = cos(a);
	mat2 m = mat2(c, -s, s, c);
	return m * v;
}

#define MAX 10.0
void main(){
	vec2 uv=surfacePosition;
	uv *= 2.0;
	uv /= dot(uv,uv);
	vec2 p = vec2(uv.xy);
	
	//p.y -= sin(time+p.x*0.1);
	//p.x -= sin(time+p.y*0.1);
	
	//vec2 rot = rotate(p, sin(0.1*time));
	//p = rot;
	
	vec2 s1=p;
	float l1=0.;
	for (float f=1.0;f<MAX;f+=1.){
		s1+=vec2(atan(s1.x*s1.x-s1.y*s1.y), acos(1.*s1.x*s1.y)) - atan(s1);
	       	l1+= (s1.x) * (s1.x);
	}
	
	l1 /= MAX;	
	l1 /= MAX;
	float l = l1;
	gl_FragColor=vec4(vec3((2.*l)), 1.);
}