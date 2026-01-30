#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform sampler2D backbuffer;
float rand(float n){return fract(sin(n) * 43758.5453123);}

float noise(float p){
	float fl = floor(p);
  float fc = fract(p);
	return mix(rand(fl), rand(fl + 1.0), fc);
}
	

void main( void ) {

	vec2 pos = gl_FragCoord.xy / resolution.xy;
	pos = pos * 2. - 1.;
	pos.x *= resolution.x / resolution.y;
	
	const int count = 128;
	vec3 f = vec3(0.);
	for(int i = 0; i < count; i++){
		
		float t = pow((float(i)+(1.+cos(float(i)+time/12.))*float(count))/float(count), 10.)*3.1415*2.;
		vec2 c = vec2(cos(t*4.+3.14/2.)/4., sin(t));
		c.y *= noise(float(i) ) * 1.;
	
	
		float rad = 0.2;
	
		float p = (float(i)) / float(count);
		f += vec3(.2, .1, 1.) * 1. / distance(c, pos) * rad;
	}
	f /= float(count)*vec3(1,1.-0.05*f.x,1);
	
	gl_FragColor = max(vec4(f, 1.), texture2D(backbuffer, gl_FragCoord.xy/resolution)-1./256.);
	
}