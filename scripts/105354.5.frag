#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
#define time ( time*2.5 - .5 )
void main( void ) {
    vec2 p = ((sin(time/8.)*32.)*.5+.8)*(gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);
    vec3 destColor = vec3(1, 1, 4);
    float f = 0.1;
    for(float i = 0.0; i < 24.0; i++){
        float s = sin(time*1.333 + i * 0.628318) * 0.2;
        float c = cos(time + i * 0.628318) * 0.4;
        f += 0.001 / abs(length(p + vec2(c, s)) - 0.07654321)*tan(length(p+p));
    }
    vec3 c = destColor*f;
	c = 1. - exp( -c );
	gl_FragColor = vec4( c, 1.0);

}