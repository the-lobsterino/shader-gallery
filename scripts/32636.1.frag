#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
float hash( float n )
{
    return fract(sin(n)*758.5453);
}
float noise( in vec3 x )
{
    vec3 p = floor(x);
    vec3 f = fract(x); 
    float n = p.x + p.y*57.0 + p.z*800.0;
    float res = mix(mix(mix( hash(n+  0.0), hash(n+  1.0),f.x), mix( hash(n+ 57.0), hash(n+ 58.0),f.x),f.y),
		    mix(mix( hash(n+800.0), hash(n+801.0),f.x), mix( hash(n+857.0), hash(n+858.0),f.x),f.y),f.z);
    return res;
}
float fbm( vec3 p )
{
    float f = 0.0;
    f += 0.50000*noise( p ); p = p*2.02;
    f -= 0.25000*noise( p ); p = p*2.03;
    f += 0.12500*noise( p ); p = p*2.01;
    f += 0.06250*noise( p ); p = p*2.04;
    f += 0.03500*noise( p ); p = p*4.01;
    f += 0.01250*noise( p ); p = p*4.04;
    f -= 0.00125*noise( p );
    return f/0.984375;
}
float fbm2( vec3 p )
{
    float f = 0.0;
    f += 0.50000*noise( p ); p = p*2.02;
    f -= 0.25000*noise( p ); p = p*2.03;
    f += 0.12500*noise( p ); p = p*2.01;
    f += 0.06250*noise( p ); p = p*2.04;
    f -= 0.00125*noise( p );
    return f/0.984375;
}
void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy ) *20.0;
	float color = fbm(vec3(position.x, position.y, time));
	if(position.x > 0.5) color = fbm2(vec3(position.x, position.y, time));
	gl_FragColor = vec4( vec3( color), 1.0 );


}