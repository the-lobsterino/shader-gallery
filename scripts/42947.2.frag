#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

// MODS BY 27 

void main( void ) {

	vec2 position = ( ( gl_FragCoord.xy / resolution.xy ) - vec2( 1.0, 0.5 ) ) * 4.0;
	
	float value = sin( position.x + time * 2.) - cos(time + position.x * 3.);
	
	vec3 color = distance( position.y, value ) < 0.02 ? vec3( .7 * distance(position.y, value) * 1000., 
								 distance(position.y, value) * 1000.,
								 0.0 )
							  : vec3( .7, 1., 0. );
	
	float glow = smoothstep(abs(sin(time) + .75) / 4., .75, .5 - distance( position.y, value));
	
	color *= glow;
	
	if(color.r < .2) gl_FragColor = vec4( color, 0.4 );
	else gl_FragColor = vec4(0.);
}