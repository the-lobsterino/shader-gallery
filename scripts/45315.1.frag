// Author:
// Title:

#ifdef GL_ES
precision mediump float;
#endif

#define PI 3.14159265358979323846

uniform vec2 resolution;
uniform float time;

#define u_resolution resolution
#define u_time time

vec3 c_scale(float i) {
    vec3 c = vec3(i);
    // c = mix(c, vec3(0., 0., 1.), smoothstep(0., -1., i));
    // c = mix(c, vec3(0.,1.,0.), smoothstep(0., 0.001, i) - smoothstep(0.001, 0.01, i));
    return c;
}

vec2 random(vec2 st) {
    st = st* mat2(1., 99., 0., 1.);
	st = fract(sin(st)*999999.);
    return st;
}

vec2 noise(vec2 st) {
    return random(floor(st));
}

vec2 smooth_h_noise(vec2 st) {
    return noise(st) * smoothstep(0., 1., fract(st))
        + noise(st+vec2(-1.,0.)) * (1.-smoothstep(0., 1., fract(st)));
}

vec2 smooth_noise(vec2 st) {
	return smooth_h_noise(st) * smoothstep(0., 1., fract(st*mat2(0., 1., -1., 0)))
        + smooth_h_noise(st+vec2(0.,-1.)) * (1.-smoothstep(0., 1., fract(st*mat2(0., 1., -1., 0))));
}

void main() {
    vec2 st = gl_FragCoord.xy/u_resolution.xy;
    vec2 aspect_ratio = u_resolution/min(u_resolution.x, u_resolution.y);
    st *= aspect_ratio;
    st *= 2.;
    vec2 move = vec2(u_time*cos(u_time*0.112)*0.03, u_time*sin(u_time*0.1)*0.02);
    st += move;

    vec3 color = vec3(0.);
    
    for (int i = 0; i < 15; i++) {
        float f = 1./pow(2.,float(i));
        float x = (smooth_noise(move + st/f)*f).x;
        color += x;
    }
    
    color = color * color * color;
    color *= 0.33;
    // st = smooth_h_noise(st);

    // color = c_scale(st.x);

    gl_FragColor = vec4(color,1.0);
}