#extension GL_OES_standard_derivatives : enable

precision highp float;


uniform vec2 TexCoord;

uniform sampler2D texture;
uniform float time;

void main()
{
    vec2 reflectedCoord = vec2(TexCoord.x, 1.0 - TexCoord.y);
    vec4 reflectedColor = texture2D(texture, reflectedCoord);

    float waveOffset = 0.1 * sin(time + TexCoord.x * 30.0);
    vec2 waveCoord = vec2(TexCoord.x, TexCoord.y + waveOffset);
    vec4 waveColor = texture2D(texture, waveCoord);

    vec4 finalColor = mix(reflectedColor, waveColor, 0.5);

    gl_FragColor = finalColor;
}