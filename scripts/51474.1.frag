#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {
	vec2 pos1=gl_FragCoord.xy/resolution.x-vec2(0.50,resolution.y/resolution.x/2.0);
	float l1=length(pos1*0.5);
	float d = l1;
	float l2=step(0.5,fract(1.0/l1+time/1.8));
	l1*=l2;
	float a=step(0.5,fract(0.1*sin(20.*l1+time*1.)/l1+atan(pos1.x,pos1.y)*3.));
	if(a!=l2)
	{
		gl_FragColor=(vec4(0.65,0.54,0.88,1.0)*2.7)*d;
	}
}