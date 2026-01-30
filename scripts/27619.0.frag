#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

//Interleaved Gradiant Noise from Next Generation Post Processing in Call of Duty: Advanced Warfare
float shadowNoise(float scale, float t)
{
    return -scale + 2.0 * scale * fract(52.9829189 * fract(dot(gl_FragCoord.xy + vec2(fract(t) * scale, 0.0), vec2(0.06711056, 0.00583715))));
}

void main( void ) {
    float v = shadowNoise(3.14159, time * 0.001);
    gl_FragColor.rgb = vec3(v / 4.0);
    gl_FragColor.a = 1.0;
}