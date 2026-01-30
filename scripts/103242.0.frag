#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform vec2 resolution;
uniform float u_CornerRadius;

void main( void ) {

    vec2 p = gl_FragCoord.xy / resolution;
    vec2 size = vec2(0.8, 0.5);

    vec2 d = abs(p - 0.5 * size) - size * 0.1;

    float alpha = smoothstep(0.0, 0.01, min(d.x, d.y));

    gl_FragColor = vec4(1.0, 1.0, 1.0, alpha);
}