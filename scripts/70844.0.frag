/*
 * "Seascape" by Alexander Alekseev aka TDM - 2014
 * License Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Unported License.
 */

#ifdef GL_ES
precision mediump float;
#endif

#define WAVELENGTH 0.01
#define WAVESPEED 20.0

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float wave_height(vec2 p, vec2 c)
{
    float d = distance(p, c);
    return (1.0 - sin((d - WAVESPEED * time))/ WAVELENGTH) / 2.0;
}

// main
void main(void)
{
    // vec2 uv = gl_FragCoord.xy / resolution.xy;
    vec2 uv = gl_FragCoord.xy; // / resolution.xy;

    gl_FragColor = vec4(wave_height(uv, vec2(0.0, 0.0)),
			wave_height(uv, vec2(0.0, resolution.y / 2.0)),
			wave_height(uv, vec2(0.0, resolution.y)), 1.0);
}
