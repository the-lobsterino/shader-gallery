#ifdef GL_ES
precision lowp float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
varying vec2 surfacePosition;
uniform sampler2D backbuffer;

void main( void ) {
	float radius = 6.0*(sin(cos(surfacePosition.x*-3.+surfacePosition.y+time*12.*2./3.14)*0.2+time/3.33)+1.0)+50.0;
	float gradius = 8.0*(sin((time/3.14-2.0)*3.5)+1.0)+48.0;
	
	vec2 d = (surfacePosition+vec2(0,-.125))*-200.;
	d += normalize(d)*abs(atan(d.x, d.y))*16.*vec2(.8,1.2);
	float dist = length(d);
	//vec2 dist = rmouse.xy-gl_FragCoord.xy;
	float i = 1.0-smoothstep(radius,radius+1.5,dist);
	float gi = 1.0-smoothstep(gradius,gradius+50.,dist);
	i=(i+gi);
	vec4 f = vec4(i*(gl_FragCoord.x/resolution.x),i/2.,i,1.0);
	gl_FragColor = max(f,texture2D(backbuffer,gl_FragCoord.xy/resolution.xy,0.1)-.002);
}