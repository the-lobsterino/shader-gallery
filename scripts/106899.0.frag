#extension GL_OES_standard_derivatives : enable


/*                              *
 *  STARFIELD - Constelation    *
 *  			-nodj   *
 *                              */ 

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float random (in vec2 _st) {
    return fract(sin(dot(_st.xy,
                         vec2(12.9898,78.233)))*
        43758.5453123);
}

// Based on Morgan McGuire @morgan3d
// https://www.shadertoy.com/view/4dS3Wd
float noise (in vec2 _st) {
    vec2 i = floor(_st);
    vec2 f = fract(_st);

    // Four corners in 2D of a tile
    float a = random(i);
    float b = random(i + vec2(1.0, 0.0));
    float c = random(i + vec2(0.0, 1.0));
    float d = random(i + vec2(1.0, 1.0));

    vec2 u = f * f * (3.0 - 2.0 * f);

    return mix(a, b, u.x) +
            (c - a)* u.y * (1.0 - u.x) +
            (d - b) * u.x * u.y;
}

#define NUM_OCTAVES 2

float fbm ( in vec2 _st) {
    float v = 0.0;
    float a = 0.5;
    vec2 shift = vec2(100.0)*time/100.;
    // Rotate to reduce axial bias
    mat2 rot = mat2(cos(0.5), sin(0.5),
                    -sin(0.5), cos(0.50));
    for (int i = 0; i < NUM_OCTAVES; ++i) {
        v += a * noise(_st);
        _st = rot * _st * 2.0 + shift;
        a *= 0.585;
    }
    return v;
}

vec2 s2w(vec2 screen) {
	return (screen / resolution.y - vec2(resolution.x/resolution.y * 0.5, 0.5)) * 10.0;
}

void main( void ) 
{
	vec2 p = s2w(gl_FragCoord.xy)*1.5;
	//p*=0.4+sin(time+p.y*0.5)*0.1;
	
	// background
	float h = 7.0 * fbm(p * 0.45 + mouse*0.); // height
	h *= 1. + h * 0.2;
	float x = fwidth(h);
	float w = 1. * x; // line width
	float isline = 1. - smoothstep(0., w, fract(h) * (1. - fract(h)));
	float lum = mix(0.14, 0.37, isline); // BG luminance
	vec3 c = vec3(isline/2.);
	float eps = 0.02;
	
	c.x*=0.2;
	gl_FragColor = vec4(c, 1.);
}