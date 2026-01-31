#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define speed 0.0001
#define freq 1.0
#define amp 0.1
#define phase 0.0

float dy (vec2 p)
{
    float sx = (amp) * 15.0 * sin( 1.0 * (freq) * (p.x-phase) - 11675.0 * (speed) * time);
    float dy = 180.0/(30.0 * abs(3.9 * p.y - sx - 1.2));
    return dy;
}

void main (void)
{
    vec2 uv = ( gl_FragCoord.xy / resolution.xy) - 0.3;
    float dy1 = dy(uv*2.0);
    vec4 temp = vec4 ((uv.x + 1.0) * dy1, 0.1 * dy1, dy1/time * 9.0, 2.0);
    gl_FragColor = temp * vec4(1.0, 1.0, 1.0, 1.0);
}