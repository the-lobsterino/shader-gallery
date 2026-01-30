#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
float random (in vec2 st) { 
    return fract(sin(dot(st.xy,vec2(12.9898,78.233)))
		 * 43758.5453123);
}

// The MIT License
// Copyright © 2013 Inigo Quilez
float n( in vec2 p )
{
    vec2 i = floor( p );
    vec2 f = fract( p );
    
    vec2 u = f*f*(3.0-2.0*f);

    return mix( mix( random( i + vec2(0.0,0.0) ), 
                     random( i + vec2(1.0,0.0) ), u.x),
                mix( random( i + vec2(0.0,1.0) ), 
                     random( i + vec2(1.0,1.0) ), u.x), u.y);
}
void main( void ) {

	vec2 p = ( gl_FragCoord.xy * 2. - resolution.xy ) / resolution.y;
	#define p1 p += vec2(n(vec2(cos(time))), n(vec2(sin(time))));
	
	# define d3 p += abs(-p+cos(time)+n(p*time)) / dot(-p, -p)-n(p-p*time*time*100.);
	d3;
	
	vec2 q = vec2(n(p-time));
	#define d q = -q*vec2(n(q-time));
	#define d2 q = mod(q+time+cos(time), .1);
	d2;
	d;
	
	float color = 0.;
	#define d1 color += .01/length(p*q-n(p-q-time));
	d1;d1;d1;d1;d1;d1;d1;d1;d1;d1;d1;d1;d1;d1;d1;d1;
	
	
	
	gl_FragColor = vec4( vec3( color*.2, color*.8, color ), 1.0 );

}