#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float hash( vec2 p )
{
        float h = dot(p,vec2(127.1,311.7));
    return -1.0 + 2.0*fract(sin(h)*43758.5453123);
}
float noise( in vec2 p )
{    
    vec2 i = floor( p );
    vec2 f = fract( p );
        vec2 u = f*f*(3.0-2.0*f);
    return mix( mix( hash( i + vec2(0.0,0.0) ),
                     hash( i + vec2(1.0,0.0) ), u.x),
                mix( hash( i + vec2(0.0,1.0) ),
                     hash( i + vec2(1.0,1.0) ), u.x), u.y);
}

void main( void ) {

//	vec2 pos = ( gl_FragCoord.xy / resolution.xy ) + mouse / 4.0;
	vec2 pos = ( gl_FragCoord.xy / resolution.xy ) ;
	
	float a = 10.;
	
	float r = pos.x;
	float g = noise(pos*a + time) * noise(pos*a - time);
	float b = 0.;
	gl_FragColor = vec4( vec3( r,g,b ), 1.0 );

}


















































