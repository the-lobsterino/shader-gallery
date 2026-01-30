#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define PI 3.141592653589793

void main( void ) {
	
	/* constants */
	float speed = 20.0;
	float size = .18;
	float nspikes = 3.0;
	float wave_size = cos(time) / 6.0;
	vec3 orange = vec3 ( 1.0 , .4 , .2 );
	float nshapes = 12.0;

	// y range goes from 0.0 to 1.0
	// x range goes from 0.0 to width
	vec2 p = gl_FragCoord.xy / resolution.y;
	float width = resolution.x / resolution.y;
	
	// move position in the middle
	vec2 ps = vec2(p.x, p.y);
	float nshapesf = 1.0 / nshapes;
	ps = mod(ps, nshapesf) / nshapesf - 0.5;
	float d_to_middle = distance( ps, vec2( 0 , 0 ) );
	
	float rotation = cos(mod( time, 2.0 * PI )) * speed;
	
	float angle = atan( ps.y, ps.x );
	
	vec3 color = orange * ( 1.0 - smoothstep( size , size + .05 , d_to_middle + cos( angle * nspikes + rotation ) * wave_size  ) );
	
	gl_FragColor = vec4( color , 1.0 );

}