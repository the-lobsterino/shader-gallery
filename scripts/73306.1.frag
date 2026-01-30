#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main()
{
    vec2 pos_ndc = 2.0 * gl_FragCoord.xy / resolution.xy - 1.0;
    float dist = length(pos_ndc);

    vec4 white = vec4(1.0, 1.0, 1.0, 1.0);
    vec4 red = vec4(1.0, 0.0, 0.0, 1.0);
    vec4 blue = vec4(0.0, 0.0, 1.0, 1.0);
    vec4 green = vec4(0.0, 1.0, 0.0, 1.0);
    float step1 = 0.0;
    float step2 = 0.33*(abs(sin(time)));
    float step3 = 0.66*(abs(sin(time)));
    float step4 = 1.0*abs(sin(time));

    vec4 color = mix(white, red, smoothstep(step1, step2, dist));
    color = mix(color, blue, smoothstep(step2, step3, dist));
    color = mix(color, green, smoothstep(step3, step4, dist));

    gl_FragColor = color;
}