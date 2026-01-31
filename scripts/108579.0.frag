#extension GL_OES_standard_derivatives : enable

precision highp float;


uniform sampler2D textureIn;
uniform vec2 iResolution;
uniform float radius;

uniform vec2 iChannelResolution[4];

void main() {
    vec2 uv = gl_FragCoord.xy / iChannelResolution[0].xy;
    
    vec3 col = texture2D(textureIn, uv + vec2(1, 1) / iChannelResolution[0].xy).rgb;
    col += texture2D(textureIn, uv + vec2(1, -1) / iChannelResolution[0].xy).rgb;
    col += texture2D(textureIn, uv + vec2(-1, 1) / iChannelResolution[0].xy).rgb;
    col += texture2D(textureIn, uv + vec2(-1, -1) / iChannelResolution[0].xy).rgb;
    col /= 4.0;

    gl_FragColor = vec4(col, 1.0);
}