#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 resolution;

void main( void ) {
    vec2 p = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);
    float rotTime = sin(time) + 1.0;
    vec3 destColor = vec3(3.0 * rotTime, 1.0 + rotTime, 4.0 * rotTime);
    float f = 0.0;
    for(float i = 0.0; i < 64.0; i++){
        float s = sin((time / 4.0) + i * -1.54321) * 1.5;
        float c = cos((time / 4.0) + i * 1.54321) * 1.5;
        f += .00025 / abs(length(p / vec2(c, s)) - 0.5);
	
    }
    gl_FragColor = vec4(vec3(destColor * f), 2.0);

}