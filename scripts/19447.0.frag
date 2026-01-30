#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 resolution;

void main( void ) {
	vec2 pos1=gl_FragCoord.xy/resolution.x;
	pos1=pos1-0.4*vec2(.7,.7)*vec2(resolution.x/resolution.y,1);
	float l1=length(pos1 * 100.0);
	float l2=step(0.1,fract(1.0/l1+time/1.0));
	float a=step(0.1,fract(atan(pos1.x,pos1.y)*5.0));
	if(a!=l2){
		gl_FragColor=vec4(0.3,0.8,1.1,1);
	}
}