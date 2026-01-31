#extension GL_OES_standard_derivatives : enable

precision highp float;
uniform float brushEffect;
uniform sampler2D texture1;
uniform sampler2D texture2;

void main() {
    vec2 uv = gl_FragCoord.xy / resolution.xy;
    float mixValue = smoothstep(0.45, 0.55, uv.x - brushEffect);
    vec4 color1 = texture2D(texture1, uv);
    vec4 color2 = texture2D(texture2, uv);
    gl_FragColor = mix(color1, color2, mixValue);
}}