#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
#define r resolution
#define c gl_FragCoord
varying vec2 surfacePosition;
#define xy surfacePosition

const float hpi = 3.14159265358979*0.5;

void main( void ) {
	gl_FragColor = vec4(0);
	
	//vec2 xy = ( c.xy / r.xy ) - 0.5;xy.y *= r.y/r.x;
	
	float s = length(xy)*pow(5., mouse.x*2.+1.);
	float fs = fract(s);
	float t = atan(xy.x, xy.y);
	
	t += (s-fs)*time*mouse.y*2.;
	t = mod(t, hpi*4.)-hpi*2.;
	
	if(t > hpi) return;
	
	if(t < 0. && t > -hpi) return;
	
	if(fs < 0.9) gl_FragColor = vec4(1);
	
	if(fs < 0.2 || fs > .7) gl_FragColor.xyz *= .75;
	
	if(t < 0.) gl_FragColor.xyz *= .67*vec3(.5,.6,.9);
	
}
//+pk