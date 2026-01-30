#ifdef GL_ES
precision mediump float;
#endif

uniform sampler2D inputTexture;
uniform vec2 inputTextureSize;
uniform float time;

uniform float rippleHeight;
uniform float rippleWidth;

void main() {
    vec2 uv = gl_FragCoord.xy / inputTextureSize.xy;
    vec2 center = vec2(0.5, 0.5);
    vec2 dist = center - uv;
    float radius = length(dist);
    float angle = atan(dist.y, dist.x);

    float ripple = sin((radius * rippleWidth + time) * 10.0) * rippleHeight;

    vec4 color = texture2D(inputTexture, uv);
    vec4 rippleColor = vec4(0.0, 0.0, 0.0, ripple);

    gl_FragColor = mix(color, rippleColor, smoothstep(0.0, rippleHeight, ripple));
}
