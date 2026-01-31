// by @neave

#ifdef GL_ES
precision lowp float;
#endif

uniform vec2 resolution;
uniform float time;
uniform sampler2D tex0;
uniform sampler2D tex1;

float circle(vec2 p, float r) {
    return length(p) < r ? 1.0 : 0.0;
}

void main(void)
{
     vec2 position = (gl_FragCoord.xy * 2.0 - resolution.xy) / min(resolution.x, resolution.y);
    vec3 color = vec3(circle(position, 0.5));
    gl_FragColor = vec4(color, 1.0);
}