#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
varying vec2 surfacePosition;
#define s surfacePosition
uniform sampler2D backbuffer;

void main( void ) {
	vec2 p = ( gl_FragCoord.xy / resolution.xy );
	
	gl_FragColor = vec4(0);
	
	vec2 r = s;
	
	r = r*cos(time/12.) + sin(time/12.)*vec2(1./length(r), atan(r.x, r.y));
	
	
	if(fract(r.x*10.) < 0.5) gl_FragColor = vec4(1);
	
	vec4 c = gl_FragColor;
	
	
	gl_FragColor = gl_FragColor*(1.-mouse.x)+mouse.x*abs(fwidth(c));
	
	gl_FragColor += (0.94+0.05*mouse.y)*(texture2D(backbuffer, p)-gl_FragColor);
	
}