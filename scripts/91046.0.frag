// Code Reading Next.js conf background animation
// https://nextjs.org/conf

#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;


vec4 LinearToLinear( in vec4 value ) {
    return value;
}
vec4 LinearTosRGB( in vec4 value ) {
    return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}
vec4 linearToOutputTexel( vec4 value ) {
    return LinearToLinear( value );
}

float fade = 1.;
float speed = 1.;
float startRadius = 0.;
float endRadius = 1.;
float emissiveIntensity = 1.;
float ratio = 1.0;

vec2 mp;

// ratio: 1/3 = neon, 1/4 = refracted, 1/5 + = approximate white

vec3 physhue2rgb(float hue, float ratio) {
    return smoothstep(
    vec3(0.0), vec3(1.0), abs(mod(hue + vec3(0.0, 1.0, 2.0)*ratio, 1.0)*2.0-1.0)
    );
}
vec3 iridescence (float angle, float thickness) {
    // typically the dot product of normal with eye ray
    float NxV = cos(angle);
    
    // energy of spectral colors
    
    float lum = 0.05064;
    // basic energy of light
    
    float luma = 0.01070;
    // tint of the final color
    
    //vec3 tint = vec3(0.7333, 0.89804, 0.94902);
    vec3 tint = vec3(0.49639, 0.78252, 0.8723);
    // interference rate at minimum angle
    
    float interf0 = 2.4;
    // phase shift rate at minimum angle
    
    float phase0 = 1.0 / 2.8;
    // interference rate at maximum angle
    
    float interf1 = interf0 * 4.0 / 3.0;
    // phase shift rate at maximum angle
    
    float phase1 = phase0;
    // fresnel (most likely completely wrong)
    
    float f = (1.0 - NxV) * (1.0 - NxV);
    float interf = mix(interf0, interf1, f);
    float phase = mix(phase0, phase1, f);
    float dp = (NxV - 1.0) * 0.5;
    
    // film hue, fade in higher frequency at the right end
    
    vec3 hue = mix(
    physhue2rgb(thickness * interf0 + dp, thickness * phase0), physhue2rgb(thickness * interf1 + 0.1 + dp, thickness * phase1), f
    );
    vec3 film = hue * lum + vec3(0.9639, 0.78252, 0.18723) * luma;
    return vec3((film * 3.0 + pow(f, 12.0))) * tint;
}
float _saturate (float x) {
    return min(1.0, max(0.0, x));
}
vec3 _saturate (vec3 x) {
    return min(vec3(1., 1., 1.), max(vec3(0., 0., 0.), x));
}
vec3 bump3y(vec3 x, vec3 yoffset) {
    vec3 y = vec3(1., 1., 1.) - x * x;
    y = _saturate(y-yoffset);
    return y;
}
vec3 spectral_zucconi6(float w, float t) {
    float x = _saturate((w - 400.0)/ 300.0);
    const vec3 c1 = vec3(3.54585104, 2.93225262, 2.41593945);
    const vec3 x1 = vec3(0.69549072, 0.49228336, 0.27699880);
    const vec3 y1 = vec3(0.02312639, 0.15225084, 0.52607955);
    const vec3 c2 = vec3(3.90307140, 3.21182957, 3.96587128);
    const vec3 x2 = vec3(0.11748627, 0.86755042, 0.66077860);
    const vec3 y2 = vec3(0.84897130, 0.88445281, 0.73949448);
    return bump3y(c1 * (x - x1), y1) + bump3y(c2 * (x - x2), y2);
}

vec2 rot(vec2 uv, float t) {
	float c = cos(t), s = sin(t);
	return mat2(c, -s, s, c) * uv;
}


void main() {
    vec2 vUV = gl_FragCoord.xy / resolution; 
	
    int id = int(vUV.x * 2.) + int(vUV.y * 2.) * 2;

    if (id < 2) {
	vUV.y += .25;
    } else {
        vUV = fract(vUV * 2.);
    }

    const vec2 vstart = vec2(0., 0.5);
    const vec2 vend = vec2(1.0, .5);
    vec2 dir = vstart - vend;
    float len = length(dir);
    float cosR = dir.y / len;
    float sinR = dir.x / len;
	
    vec2 uv = (
      mat2(cosR, -sinR, sinR, cosR) *
      (vUV - vec2(0., 1.) - vstart * vec2(1., -1.))
      / len
    );
	
    // Draw rainbow
    float a = atan(uv.x, uv.y) * 10.0;
    float s = uv.y * (endRadius - startRadius) + startRadius;
    float w = (uv.x / s + .5) * 300. + 400. + a;
    vec3 c = spectral_zucconi6(w, time); // [400, 700]
    
    if (id == 2) { gl_FragColor = vec4(c, 1); return; }
	
    vec3 ir = iridescence(uv.x * 0.5 * 3.14159, uv.y - time * 0.1);
    if (id == 3) { gl_FragColor = vec4(ir * 8., 1); return; }
	
	
    vec3 co = c / ir / 20.0;
	
    gl_FragColor = vec4(co, 1.0);
    if (gl_FragColor.r + gl_FragColor.g + gl_FragColor.b < 0.01) { discard; }
    gl_FragColor = linearToOutputTexel( gl_FragColor );
}

