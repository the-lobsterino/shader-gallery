#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define time time*0.1

vec4 texture ( vec2 pos ) {
	bool b=mod(pos.x+time/1.,.1)>.05;
	bool c=mod(pos.y,.1)>.05;
	return vec4(b^^c,b^^c,b^^c,1.);
}

void main( void ) {
	vec2 position = gl_FragCoord.xy/resolution.xx - mouse.xy + vec2(0.,resolution.y/resolution.x-.5);
	float a = atan(position.x/position.y); 
	float r = length(position)+0.02*sin(6.*a);
	
	gl_FragColor = (2.*r)*texture(vec2(.2/r,a/3.14159));
}