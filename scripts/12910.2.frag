#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) 
	{
	vec2 p=(gl_FragCoord.xy/resolution.xy)*0.55;
	float c=atan(cos(length(time+200.+p*44.))*18.)-tan(4.-length(time+200.+p*44.));
	gl_FragColor = vec4(c,c,c-c*c*c/(8.1234-c),1.0)*vec4(1,0.4,0.12,0);
	}