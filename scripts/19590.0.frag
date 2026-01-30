/* wavy! */
#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

vec4 texture ( vec2 pos ) {
	bool b=mod(pos.x+time/500000000.,.1)>.05;
	bool c=mod(pos.y,.1)>.05;
	return vec4(712342./pos.x,b,.33*pos.x,1.9);
}

void main( void ) {
	vec2 position = gl_FragCoord.xy/resolution.xx - vec2(.55,.05*(resolution.y/resolution.x));
	float a = atan(position.y,position.x); 
	float r = length(position);
	r = r + sin(time)*1.22*sin(16.*a+time)*r;
	
	gl_FragColor = (120.*r*r)*texture(vec2(.62/r,a/1.14159));
}