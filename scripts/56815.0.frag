#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float rand(vec2 st)
{
    return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 1000.0);
}

void main( void ) {
	vec2 p = ( gl_FragCoord.xy / resolution.xy )-0.5;

	float gs = 0.02;
	vec2 g = floor(p/gs);

	float noise = sqrt(rand(p+0.02*time));
	float circle = 0.5*fract(dot(p,p)*70.3-time*0.7);
	float ts = floor(time*0.90+ 0.5*rand(g) + 0.31*(noise*circle)+ 1.7*dot(p,p) ) ;
	float alt = step( mod(ts,2.0),0.5 )*(noise-circle)+circle  ;
	
	gl_FragColor = vec4( vec3(alt), 1.0 );

}