#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;



	vec2 hash2(vec2 p)
	{
		vec3 p3 = fract(vec3(p.xyx) * vec3(.1031, .1030, .0973));
	    p3 += dot(p3, p3.yzx+33.33);
	    return fract((p3.xx+p3.yz)*p3.zy);
	}
	
	
	//-- NOISE
	float gradient( vec2 p )
	{
	    vec2 i = floor( p );
	    vec2 f = fract( p );
		
		vec2 u = f*f*(3.0-2.0*f);
	
	    return mix( mix( dot( hash2( i + vec2(0,0) ), f - vec2(0,0) ), 
			     dot( hash2( i + vec2(1,0) ), f - vec2(1,0) ), u.x),
			mix( dot( hash2( i + vec2(0,1) ), f - vec2(0,1) ), 
			     dot( hash2( i + vec2(1,1) ), f - vec2(1,1) ), u.x), u.y);
	}
	

void main( void ) {
	

	gl_FragColor = vec4( vec3(gradient(gl_FragCoord.xy/resolution.x*4.)+.5), 1.0 );

}