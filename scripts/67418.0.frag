// N050920N Fraktal Art - Organism
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

// from https://thebookofshaders.com/07/

float circle(in vec2 _st, in float _radius){
    vec2 dist = _st-vec2(0.5);
	return 1.-smoothstep(_radius-(_radius*0.01),
                         _radius+(_radius*0.01),
                         dot(dist,dist)*4.0);
}


#define MAX 10.0
void main(){
	vec2 uv=surfacePosition;
	uv *= 44.0;
	vec2 p = uv;
	
	/**/
	p.y -= sin(time+p.x*0.3);
	p.x -= sin(time+p.y*0.1);
	
	vec2 rot = rotate(p, sin(0.1*time));
	p = rot;
	/**/
	
	vec2 s1=p;
	float l1=0.0;
	for (float f=1.0;f<MAX;f+=1.){
		s1+=vec2(atan(s1.x*s1.x-s1.y*s1.y), atan(2.0*s1.x*s1.y)) - atan(s1);
	       	l1+= s1.y*s1.y; // - circle(s1, l1);
	}
	
	l1 /= MAX;
	//l1 /= MAX;	
	float l = l1;
	gl_FragColor=vec4(vec3(l), 1.);
}