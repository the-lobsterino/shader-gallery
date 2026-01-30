
// ALL YOUR FUCKING BASE ARE BELONG TO ME CUNT VI
#ifdef GL_ES
precision mediump float;
#endif
 
uniform float time;
varying vec2 surfacePosition;
 
void main( void )
{
	vec2 p = abs(surfacePosition*2.);	
	p.x += sin(time+p.y*2.0);
	float c  = sin(fract(1. - p.x*p.x+p.y*(1.5+exp(sin(p.x*4.0+time)*0.5)) + time)*6.28);
	float m1 = sin(p.y*6.0+time*4.0)*0.3;
	float m2 = sin(p.x*4.0+time*3.3)*0.2;
	float m3 = sin(p.x*p.y*4.0+time*2.3)*0.2;
	vec3 col = vec3(0.7+m2,0.6-m1,0.6+m3)*c;
	p=p*0.125;
	col*=1.0-sin(time+p.y+m1+p.x-m2+m3);
	gl_FragColor = vec4(col*.8,1.0) ;
}
 
 
