// FMS_Cat
// https://twitter.com/FMS_Cat

#define BITS 16.0
#define THR 0.5
#define LOOPFREQ 4.0
#define SCALE (resolution.y)
#define VIG 0.0

#define PI 3.14159265

#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float v2random( vec2 co ) {
    return fract( sin( dot( co.xy, vec2( 2.9898, 7.233 ) ) ) * 4838.5453 );
}

void main( void ) {
	vec2 p = ( gl_FragCoord.xy * 2.0 - resolution.xy ) / resolution.y;
	float r = length( p ) * SCALE * 0.09;
	float layer = floor( r );
	vec3 bg=vec3(1.);
	vec3 fg=vec3(0.,.3,1.);
	if ( 2.0 < layer ) {
		float theta = ( atan( p.y, p.x ) + PI ) / 2.0 / PI;
		float vel = 0.05 * ( v2random( vec2( layer, 3.155 ) ) - 0.5 );
		float freq = 1.0 + floor( layer * 2.0 * pow( v2random( vec2( layer, 2.456 ) ), 2.0 ) );
		
		float phase = fract( ( theta + time * vel ) * LOOPFREQ ) * freq;
		float phase0 = floor( phase );
		float phase1 = mod( phase0 + 1.0, freq );
		float phasec = fract( phase );
		
		float state0 = v2random( vec2( layer, phase0 ) ) < THR ? 0.0 : 1.0;
		float state1 = v2random( vec2( layer, phase1 ) ) < THR ? 0.0 : 1.0;
		float state = mix( state0, state1, smoothstep( 0.0, 0.5 / SCALE * LOOPFREQ * freq / length( p ), phasec ) );
		
		vec3 col = vec3( state );
		
		float layerc = mod( r, 1.0 );
		col *= smoothstep( 0.0, 0.0 + 0.4, layerc );
		col *= smoothstep( 0.6, 0.6 - 0.4, layerc );
		
		col *= exp( -VIG * length( p ) );
		
		gl_FragColor = vec4(mix(bg,fg,col),1.);
	} else {
		gl_FragColor = vec4(bg,1.);
	}
}