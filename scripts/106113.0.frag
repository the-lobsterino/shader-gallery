#version 100

precision highp float;

uniform sampler2D screenTexture;
uniform vec2 screenSize;
uniform float time;

float grayScale(vec3 color)
{
    float gray = color.r * 0.299 + color.g * 0.587 + color.b * 0.114;
    return gray;
}

void main()
{
    vec2 uv = gl_FragCoord.xy / screenSize;
    vec2 up = (gl_FragCoord.xy + vec2(0.0, 1.0)) / screenSize;
    vec2 down = (gl_FragCoord.xy + vec2(0.0, -1.0)) / screenSize;
    vec2 left = (gl_FragCoord.xy + vec2(-1.0, 0.0)) / screenSize;
    vec2 right = (gl_FragCoord.xy + vec2(1.0, 0.0)) / screenSize;

    float gray = grayScale(texture2D(screenTexture, uv).rgb);
    float grayUp = grayScale(texture2D(screenTexture, up).rgb);
    float grayDown = grayScale(texture2D(screenTexture, down).rgb);
    float grayLeft = grayScale(texture2D(screenTexture, left).rgb);
    float grayRight = grayScale(texture2D(screenTexture, right).rgb);

    const float diff = 0.07;

    if (abs(gray - grayUp) >= diff || abs(gray - grayDown) >= diff || abs(gray - grayLeft) >= diff || abs(gray - grayRight) >= diff)
        gl_FragColor = texture2D(screenTexture, uv);
    else
        gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);

}