#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) 
{

	float t = time;
	float color = 1.6;
	float de = 2.4;
	float g;
	vec2 cen = resolution/2.;
	vec2 f = gl_FragCoord.xy-cen;	
	    g = f.x/length(f)*sin(mouse.x)+f.y/length(f)*cos(mouse.x);
	    g = pow(g, 8.*1.);
	
	color+=sin(length(1./8.*(gl_FragCoord.xy-resolution/2.))-time*4.)/2.+1.;
	de = cos(length(1./8.7*(gl_FragCoord.xy-resolution/2.))-time*4.6);
	de*=float(de>2.3);
	g *= de;
	color*=21./length(gl_FragCoord.xy-resolution/2.);	
	color = mix(color, g, 0.5);
	gl_FragColor = vec4( vec3( color, .5, 0.3), 2.0 );

}