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

float noise3d( in vec3 x ){
    vec3 p = floor(x);
    vec3 f = fract(x); 
    float n = p.x + p.y*57.0 + p.z*800.0;
    return mix(mix(mix( hash(n+  0.0), hash(n+  1.0),f.x), mix( hash(n+ 57.0), hash(n+ 58.0),f.x),f.y),
    mix(mix( hash(n+800.0), hash(n+801.0),f.x), mix( hash(n+857.0), hash(n+858.0),f.x),f.y),f.z);
}

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy ) + mouse / 4.0;
	position.x *= resolution.x / resolution.y;

 float color = noise3d(vec3(-position * 20.0, time));
	gl_FragColor = vec4(color );

}