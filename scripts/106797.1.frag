#extension GL_OES_standard_derivatives : enable

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
    vec2 shift = vec2(100.0);
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
	return ( 1.5*mouse.y + .5 )*(screen / resolution.y - vec2(resolution.x/resolution.y * 0.5, 0.5)) * 10.0;
}

vec4 grid(vec3 pos) {
	float grid_ratio = 0.03;
	vec3 grid_frac = mod(pos, 1.0);
	float grid = float((grid_frac.x > grid_ratio) && (grid_frac.y > grid_ratio) && (grid_frac.z > grid_ratio));
	float radial_grad = length(pos.yz) * 0.15;

	return vec4(vec3(grid*0.2 + radial_grad), 1.0);
}

float isobar(vec2 pos) {
	return fbm(pos);
}

vec3 rgb(float r, float g, float b)
{
	return vec3(r/255., g/255., b/255.);	
}

vec3 star(vec3 c, vec2 center, vec2 pos, float r)
{
	vec2 p = pos-center;
	float a = 4.*abs(p.x/r)*abs(p.y/r);
	a = a*a*a;
	r/=3.*a+0.9;
	return mix(vec3(1.), c, smoothstep(r, r+0.02, length(p)));
}

void main( void ) {
	vec3 obsv_pos = vec3(time, s2w(0.5 * resolution));
	vec2 p = s2w(gl_FragCoord.xy);
	
	float h = 7.0 * isobar(p * 0.45); // height
	h *= 1. + h * 0.1;
	float x = fwidth(h);
	float w = 1.4 * x; // line width
	float isline = 1. - smoothstep(0., w, fract(h) * (1. - fract(h)));
	isline = 1. - step(w, fract(h) * (1. - fract(h)));
	isline = 1. - smoothstep(0., w, fract(h) * (1. - fract(h)));
	float lum = mix(0.14, 0.37, isline); // BG luminance
	vec3 c = vec3(lum);
	p.x += 6.*( mouse.x -.5 );
	p.y += 2.*( mouse.y -.5 );
	float eps = 0.018;
	float lp = length(p);
	
	// sky
	vec3 b = rgb(68., 91., 129.); 
	b = mix(rgb(54., 82., 130.), b, smoothstep(2.4, 2.4+eps, 3.9 + 0.75*sin(1.1 * p.y + 2.6) - abs(p.x)));
	b = mix(rgb(38., 53., 85.), b, smoothstep(2.4, 2.4+eps, 4.4 + 0.5*sin(1.4 * p.y + 2.6) - abs(p.x)));
	
	// planet
	b = mix(rgb(223., 175., 101.), b, smoothstep(2.4, 2.4+eps, length(p-vec2(0., -3.5))));
	b = mix(rgb(232., 105., 59.), b, smoothstep(2.2, 2.2+eps, length(p-vec2(0., -3.5))));
	b = mix(rgb(205., 38., 61.), b, smoothstep(1.5, 1.5+eps, length(p-vec2(-0.6, -3.1))));
	
	// badge mix
	c = mix(b, c, smoothstep(2.5, 2.5 + eps, lp));
	
	// stars on top
	c = star(c, vec2(0.), p, 0.25);
	c = star(c, vec2(0., 1.1), p, 0.3);
	c = star(c, vec2(0.7, 0.3), p, 0.1);		
	c = star(c, vec2(-0.7, 0.3), p, 0.1);
	c = star(c, vec2(0.5, -0.6), p, 0.1);
	c = star(c, vec2(-0.5, -0.6), p, 0.1);	
	c = star(c, vec2(1.2, -0.6), p, 0.15);
	c = star(c, vec2(-1.2, -0.6), p, 0.15);			
	
	//c = star(c, vec2(0.), p, 0.3);
	
	// white circle
	c = mix(vec3(1.), c, smoothstep(0.05, 0.05 + eps, abs(2.5-lp))); 
	
	gl_FragColor = vec4(c, 1.);
} //ändrom3da4twist