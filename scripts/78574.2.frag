#extension GL_OES_standard_derivatives : enable

precision highp float;

//Not My Noise :https://observablehq.com/@riccardoscalco/value-and-gradient-noise-in-glsl
#define MAGIC 43758.5453123

float random (vec2 st) {
    float s = dot(st, vec2(0.400,0.230));
    return -1. + 2. * fract(sin(s) * MAGIC);
}

vec2 random2(vec2 st){
    vec2 s = vec2(
      dot(st, vec2(127.1,311.7)),
      dot(st, vec2(269.5,183.3))
    );
    return -1. + 2. * fract(sin(s) * MAGIC);
}

vec4 valueNoise (vec2 p) {
    vec2 i = floor(p);

    float f11 = random(i + vec2(0., 0.));
    float f12 = random(i + vec2(0., 1.));
    float f21 = random(i + vec2(1., 0.));
    float f22 = random(i + vec2(1., 1.));

    return vec4(f11, f12, f21, f22);
}

vec2 scale (vec2 p, float s) {
    return p * s;
}

float interpolate (float t) {
    //return t;
    // return t * t * (3. - 2. * t); // smoothstep
    return t * t * t * (10. + t * (6. * t - 15.)); // smootherstep
}
vec4 gradientNoise (vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);

    float f11 = dot(random2(i + vec2(0., 0.)), f - vec2(0., 0.));
    float f12 = dot(random2(i + vec2(0., 1.)), f - vec2(0., 1.));
    float f21 = dot(random2(i + vec2(1., 0.)), f - vec2(1., 0.));
    float f22 = dot(random2(i + vec2(1., 1.)), f - vec2(1., 1.));

    return vec4(f11, f12, f21, f22);
}

float noise (vec2 p) {
    vec4 v = gradientNoise(p);
    //vec4 v = valueNoise(p);
    
    vec2 f = fract(p);
    float t = interpolate(f.x);
    float u = interpolate(f.y);
    
    // linear interpolation 
    return mix(
        mix(v.x, v.z, t),
        mix(v.y, v.w, t), 
        u
    ) * .5 + .5;
}

uniform vec2 resolution;
uniform vec2 mouse;
uniform float time;

void main() {
    vec2 st = gl_FragCoord.xy/resolution.xy;
    st.x *= resolution.x/resolution.y;
    vec3 color = vec3(0.2);
    vec2 m = vec2(2. * mouse.x, mouse.y);
    float m_dist = distance(m, st);
    
    // The noise Distortion
    st.x = st.x + 0.5*time;
    st.y = st.y + (cos(0.5*time));
    float val1 = 2. * noise(st*9.) - 1.;
    float val2 = 2. * noise(st*9. + 3.) - 1.;
    vec2 shift = vec2(val1, val2);
    st += shift / m_dist * 0.085;
    // st += shift * (abs(sin(2.*u_time)));
    // Make stripes
    float stripes = 10.;
    st.y = mod(st.y, 1./stripes) * stripes;
    if (st.y>0.5) {
        color = vec3(mouse.x,mouse.y,0.5);
    } else {
        color = vec3(0,0,0);
    }
    
    // color = vec3(0.2);
    // color = vec3(u_mouse.x / u_resolution.x,u_mouse.y / u_resolution.y,0);

    gl_FragColor = vec4(color,1.0);
}