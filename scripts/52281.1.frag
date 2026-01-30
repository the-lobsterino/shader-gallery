#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 resolution;
uniform vec2 mouse;
uniform float time;

const float CIRCLE_OUTER_WIDTH = 0.7;
const float CIRCLE_INNER_WIDTH = 0.07;

float circle_outer_width;
float circle_inner_width;

vec2 random2(vec2 st)
{
    st = vec2( dot(st,vec2(127.1,311.7)),
              dot(st,vec2(269.5,183.3)) );
    return -1.0 + 2.0*fract(sin(st)*43758.5453123);
}

// Value Noise by Inigo Quilez - iq/2013
// https://www.shadertoy.com/view/lsf3WH
float noise(vec2 st)
{
    vec2 i = floor(st);
    vec2 f = fract(st);

    vec2 u = f*f*(3.0-2.0*f);

    return mix( mix( dot( random2(i + vec2(0.0,0.0) ), f - vec2(0.0,0.0) ),
                     dot( random2(i + vec2(1.0,0.0) ), f - vec2(1.0,0.0) ), u.x),
                mix( dot( random2(i + vec2(0.0,1.0) ), f - vec2(0.0,1.0) ),
                     dot( random2(i + vec2(1.0,1.0) ), f - vec2(1.0,1.0) ), u.x), u.y);
}

mat2 rotate2d(float _angle){
    return mat2(cos(_angle),-sin(_angle),
                sin(_angle),cos(_angle));
}

float shape(vec2 st, float radius)
{
    float r = length(st)*2.0;
    float a = atan(st.y,st.x);
    float m = abs(mod(a+time,3.14*2.)-3.14)/3.6;
    float f = radius;

    f += sin(10.0 * a) * 0.25 * pow(m, 4.0);

    return 1.0 - (smoothstep(f - circle_inner_width, f, r) - smoothstep(f, f+circle_outer_width,r));
}

void main() {
	vec2 st = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);

    float usin_v = sin(time * 0.5) * 0.5 + 0.5;
    circle_outer_width = CIRCLE_OUTER_WIDTH;
    circle_inner_width = CIRCLE_INNER_WIDTH + CIRCLE_INNER_WIDTH * usin_v * 30.0;

	vec3 color = vec3(1.0) * shape(st, 1.5);

	gl_FragColor = vec4(color, 1.0);
}
