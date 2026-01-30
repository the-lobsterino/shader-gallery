// ändroshyt wow phenomenal! 
#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define rot( a ) mat2( cos(a), sin(a), sin(a), cos(a) )

void main( void ) {

	vec2 p = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);

	vec3 color;
        vec2 pCc = p;   // just a copy of p i say carbon copy "Cc"
	p *= rot(time);
	color.g = (sin(10. * p.x + time));
	p = pCc;
	color.r = (sin(10. * p.x + time*1.5));

	

	gl_FragColor = vec4( color, 1.0 );

}