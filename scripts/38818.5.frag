// from   Darksecond ST;
// gtr
#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define t .8*sin(time)
#define t2 1.+.08*sin(time)
//frequency default is 1.
//offset default is 0.
vec3 sinX(in vec2 uv, in float frequency, in float offset) {
    vec2 p = 800. * uv;
    float x = sin((p.x + offset) * frequency);
    return vec3(x,x,x);
}

//frequency default is 1.
//offset default is 0.
vec3 sinY(in vec2 uv, in float frequency, in float offset) {
    vec2 p = 800. * uv;
    float x = sin((p.y + offset) * frequency);
    return vec3(x,x,x);
}

vec3 tex1(in vec2 uv) {
    vec3 x = vec3(0.);
    x += sinX(uv, 0.066*t2, 0.0);
    x += sinY(uv, 0.066*t2, 0.0);
    x *= sinX(uv, 0.044*t2, 0.0) * vec3(2.);
    x *= sinY(uv, 0.044*t2, 8.) * vec3(2.);
    x -= vec3(0.1+t, 0.2, 0.3*t);
    
    return x;
}


void main()
{
    vec2 uv = (2.*gl_FragCoord.xy-resolution.xy)/resolution.y;
    
    vec3 x = tex1(vec2(mod(uv.x,3.0),1.-abs(uv.y)));

    gl_FragColor = vec4(x,1.0);
}