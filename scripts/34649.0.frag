// Warped Hex
// By: Brandon Fogerty
// xdpixel.com

#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
float hash( float n ){
    return fract(sin(n)*758.5453);
}
float noise( in vec3 x ){
    vec3 p = floor(x); 
    vec3 f = fract(x); 
    float n = p.x + p.y*57.0 + p.z*800.0;
    float res = mix(mix(mix( hash(n+  0.0), hash(n+  1.0),f.x), mix( hash(n+ 57.0), hash(n+ 58.0),f.x),f.y),
    mix(mix( hash(n+800.0), hash(n+801.0),f.x), mix( hash(n+857.0), hash(n+858.0),f.x),f.y),f.z);
    return res;
}
float hex( vec2 p )
{		
	p += 0.05 * noise(vec3(p*20.1, time));
	p *= 0.1 * noise(vec3(p*10.1, time)) + 0.9;
	p *= 10.0;
	p.y += mod( floor(p.x), 4.0) * 0.5;
	p = abs( fract(p)- 0.5 );
	return abs( max(p.x*1.5 + p.y, p.y * 2.0) - 1.0 ) ;
}

void main( void ) {

	vec2 uv = ( gl_FragCoord.xy / resolution.xy ) * 2.0 - 1.0;
	uv.x *= resolution.x / resolution.y;	
	gl_FragColor = vec4( vec3(hex(uv)), 1.0 );

}