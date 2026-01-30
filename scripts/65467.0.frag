#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

//https://www.shadertoy.com/view/3tsyWN
float hash(float n) { return fract(sin(n) * 1e4); }

float noise(float x, float scale) {
    x *= scale;
	float i = floor(x);
	float f = fract(x);
	float u = f * f * (3.0 - 2.0 * f);
	return mix(hash(i), hash(i + 1.0), u);
}

mat2 rot(float a)
{
    float c = cos(a);
    float s = sin(a);
    return mat2(c, -s, s, c);
}

float brush(in vec2 uv)
{
    vec2 uv0 = uv;
    uv *= rot(pow(sin(time), 3.) + time);
    vec2 n = normalize(uv);
    float c1 = acos(n.x) - .3;
    float c0 = length(uv);
    c0 += sin(c1*5.)*.1*c0 * sin(time);
    float f = pow(noise(c0, 70.), 10.);
    float c3 = acos(normalize(uv0).x) - .3;
    f *= pow(.4, -c3*c3);
    float col = smoothstep(0., 1., f);
    col *= pow(1.-.8*length(uv), .5);
    
    return col;
}

void main( )
{
    vec2 uv = gl_FragCoord.xy/resolution.xy - 0.5;
    uv.x *= resolution.x/resolution.y;
    //uv += mouse;
    vec3 col = vec3(brush(uv), brush(uv*.9), brush(uv*1.1));
    gl_FragColor = vec4(col, length(col));
}