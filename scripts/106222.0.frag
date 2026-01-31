#extension GL_OES_standard_derivatives : enable
//glsl sandbox benutzt andere Namen als im VJ beschrieben
precision highp float;

uniform vec2 resolution;
uniform float time;

vec3 palette(float t)
{
    vec3 a = vec3(0.349, 0.5, 0.5);
    vec3 b = vec3(0.5, 0.5, 0.5);
    vec3 c = vec3(1.0, 1.0, 1.0);
    vec3 d = vec3(0.9, 0.416, 0.557);
    return a + b*cos( 6.28318*(c*t+d) );
}

void main() {
    vec2 st = gl_FragCoord.xy / resolution.xy * 2.0 - 1.0;
    st.x += sin(time);
    vec2 st0 = st;
    vec3 final_color = vec3(0.0);

    for (float i = 0.0; i < 4.0; i++){
        st = fract(st) - 0.5;

        float d = length(st) * exp(-length(st0));

        vec3 col = palette(length(st0) + i * .4 + time);

        d = sin(d * 2.5+sin(12.0) + 9.)/4.0;
        d = abs(d);
        
        d = pow(0.01 / d, 1.2);
        final_color += col * d;
    }

    gl_FragColor = vec4(final_color, 1.0);

}