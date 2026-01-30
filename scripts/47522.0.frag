#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
varying vec2 surfacePosition;

void main( void ) 
{
	vec2 p = surfacePosition*4.;
	float a = atan(p.x,p.y);
	float r = 6.*length(p);
	float c = sin(time+r*2.+cos(a*12.*sin(r)));
	gl_FragColor = vec4(c,c,0,1);

}