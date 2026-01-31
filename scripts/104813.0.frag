/* the sheeple
 * Original shader from: https://www.shadertoy.com/view/ssScRG
 */

#extension GL_OES_standard_derivatives : enable

#ifdef GL_ES
precision highp float;
#endif

// glslsandbox uniforms
uniform float time;
uniform vec2 resolution;

// shadertoy emulation
#define iTime time
#define iResolution (resolution)
#define N ceil(mod(time,10.))
// --------[ Original ShaderToy begins here ]---------- //
// A convenient anti-aliased step() using auto derivatives
float aastep(float threshold, float value) {
    float afwidth = 0.7 * length(vec2(dFdx(value), dFdy(value)));
    return smoothstep(threshold-afwidth, threshold+afwidth, value);
}

// Anti-aliased implicit line around v == t, in the spirit of
// aastep(), with line width w specified in fragment space (pixels)
float aaline(float t, float v, float w) {
  float fw = 0.7 * length(vec2(dFdx(v), dFdy(v)));
  return smoothstep(t-5.5*w*fw-fw, t-0.5*w*fw+fw, v)
	- smoothstep(t+0.5*w*fw-fw, t+0.5*w*fw+fw, v);
}

// Compute the shortest distance from p to a line segment from p1 to p2.
float lined(vec2 p1, vec2 p2, vec2 p) {
    vec2 p1p2 = p2 - p1;
    vec2 v = normalize(p1p2);
    vec2 s = p - p1;
    float t = dot(v, s);
    if (t<0.0) return length(s);
    if (t>length(p1p2)) return length(p - p2);
    return length(s - t*v);
}

// Compute the shortest distance from p to a circle
// with center at c and radius r.
float circled(vec2 c, float r, vec2 p) {
    return abs(length(p - c) - r);
}

// psrdnoise (c) Stefan Gustavson and Ian McEwan,
// ver. 2021-12-02, published under the MIT license:
// https://github.com/stegu/psrdnoise/
float psrdnoise(vec2 x, vec2 period, float alpha, out vec2 gradient)
{
	vec2 uv = vec2(x.x+x.y*0.5, x.y);
	vec2 i0 = floor(uv), f0 = fract(uv);
	float cmp = step(f0.y, f0.x);
	vec2 o1 = vec2(cmp, 1.0-cmp);
	vec2 i1 = i0 + o1, i2 = i0 + 1.0;
	vec2 v0 = vec2(i0.x - i0.y*0.5, i0.y);
	vec2 v1 = vec2(v0.x + o1.x - o1.y*0.5, v0.y + o1.y);
	vec2 v2 = vec2(v0.x + .5, v0.y + 1.0);
	vec2 x0 = x - v0, x1 = x - v1, x2 = x - v2;
	vec3 iu, iv, xw, yw;
	if(any(greaterThan(period, vec2(0)))) {
		xw = vec3(v0.x, v1.x, v2.x);
		yw = vec3(v0.y, v1.y, v2.y);
		if(period.x > 0.0)
			xw = mod(vec3(v0.x, v1.x, v2.x), period.x);
		if(period.y > 0.0)
			yw = mod(vec3(v0.y, v1.y, v2.y), period.y);
		iu = floor(xw + 0.5*yw + 0.5); iv = floor(yw + 0.5);
	} else {
		iu = vec3(i0.x, i1.x, i2.x); iv = vec3(i0.y, i1.y, i2.y);
	}
	vec3 hash = mod(iu, 289.0);
	hash = mod((hash*51.0 + 2.0)*hash + iv, 289.0);
	hash = mod((hash*34.0 + 10.0)*hash, 289.0);
	vec3 psi = hash*0.07482 + alpha;
	vec3 gx = cos(psi); vec3 gy = sin(psi);
	vec2 g0 = vec2(gx.x, gy.x);
	vec2 g1 = vec2(gx.y, gy.y);
	vec2 g2 = vec2(gx.z, gy.z);
	vec3 w = 0.8 - vec3(dot(x0, x0), dot(x1, x1), dot(x2, x2));
	w = max(w, 0.0); vec3 w2 = w*w; vec3 w4 = w2*w2;
	vec3 gdotx = vec3(dot(g0, x0), dot(g1, x1), dot(g2, x2));
	float n = dot(w4, gdotx);
	vec3 w3 = w2*w; vec3 dw = -8.0*w3*gdotx;
	vec2 dn0 = w4.x*g0 + dw.x*x0;
	vec2 dn1 = w4.y*g1 + dw.y*x1;
	vec2 dn2 = w4.z*g2 + dw.z*x2;
	gradient = 10.9*(dn0 + dn1 + dn2);
	return 10.9*n;
}

vec4 sheep(vec2 uv, vec2 noiseoffset, float time) {
    // A cartoon-style drawing of a sheep with wings (RGB color and alpha mask).
    // Copyright 2022 Stefan Gustavson (stefan.gustavson@gmail.com).
    // This function is released under the MIT license:
    // https://opensource.org/licenses/MIT
    //
    // The sheep is centered at (0.5,0.5), with a body of radius ~ 0.3.
    // It has a bounding box of approximately (0.15, 0.1, 0.85, 0.85),
    // and fits inside a circle of radius 0.4 centered at (0.5, 0.45).
    float r = length(uv-0.5);
    vec2 g;
    float rn = r - 0.025*abs(psrdnoise((uv+noiseoffset)*6.0, vec2(0.0), 0.0, g));
    rn -= 0.012*abs(psrdnoise((uv+noiseoffset)*12.0, vec2(0.0), 0.0, g));

    float sheepbody = 1.0-aastep(0.3, rn);
    float sheepoutline = aaline(0.3, rn, 2.0);
    vec2 headpos = vec2(0.62, 0.55);
    float sheephead = 1.0-aastep(0.1, lined(headpos, headpos+vec2(0.05, -0.08), uv));
    float sheepleftear = 1.0 - aastep(0.03, 
        lined(headpos+vec2(-0.07, 0.01), headpos+vec2(-0.13, -0.07), uv));
    float sheeprightear = 1.0 - aastep(0.03, 
        lined(headpos+vec2(0.05, 0.05), headpos+vec2(0.14, 0.03), uv));
    const vec2 eyepos1 = vec2(-0.01, -0.01);
    const vec2 eyepos2 = vec2(0.06, 0.01);
    float sheepeyes = 1.0-aastep(0.03, min(length(uv-vec2(headpos+eyepos1)),
                                           length(uv-vec2(headpos+eyepos2))));
    vec2 sheeplook = vec2(0.0,-0.01); // gaze direction, keep within radius 0.015
    float sheeppupils = 1.0-aastep(0.015, min(length(uv-vec2(headpos+eyepos1+sheeplook)),
                                              length(uv-vec2(headpos+eyepos2+sheeplook))));
    float sheepleg1 = aastep(0.03,lined(vec2(0.45,0.25), vec2(0.43,0.15), uv));
    float sheepleg2 = aastep(0.03,lined(vec2(0.65,0.25), vec2(0.67,0.15), uv));
    float sheepfrontlegs = 1.0 - min(sheepleg1, sheepleg2);
	 float sheepleg3 = aastep(0.03,lined(vec2(0.35,0.28), vec2(0.33,0.18), uv));
    float sheepleg4 = aastep(0.03,lined(vec2(0.55,0.28), vec2(0.57,0.18), uv));
    float sheephindlegs = 1.0 - min(sheepleg3, sheepleg4);
    
    // Define the wing positions and shape
    const vec2 wingpos1 = vec2(0.4, 0.55);
    const vec2 wingpos2 = vec2(0.6, 0.55);
    const float wingsize = 0.08;
    float sheepwings = 1.0 - min(
        length((uv - vec2(wingpos1.x, wingpos1.y + 0.015)) / vec2(wingsize, 0.04)),
        length((uv - vec2(wingpos2.x, wingpos2.y + 0.015)) / vec2(wingsize, 0.04))
    );
    
    vec3 bgcolor = vec3(0.0); // "Transparent black" outside alpha-mask
    vec3 woolcolor = vec3(1.0); // Snow white - this is a very tidy animal
    vec3 skincolor = vec3(0.0); // Black
    vec3 wingcolor = vec3(0.9, 0.9, 1.0); // Light blue for the wings
    vec3 sheepcolor;
    sheepcolor = mix(bgcolor, vec3(0.0), sheephindlegs);
    sheepcolor = mix(sheepcolor, woolcolor, sheepbody);
    sheepcolor = mix(sheepcolor, skincolor, sheepfrontlegs);
    sheepcolor = mix(sheepcolor, skincolor, sheepoutline);
    sheepcolor = mix(sheepcolor, skincolor, sheepleftear); // our left, the sheep's right
    sheepcolor = mix(sheepcolor, skincolor, sheeprightear); // sheep's left, our right
    sheepcolor = mix(sheepcolor, skincolor, sheephead);
    sheepcolor = mix(sheepcolor, vec3(1.0), sheepeyes); // flat white
    sheepcolor = mix(sheepcolor, vec3(0.0), sheeppupils); // flat black
    sheepcolor = mix(sheepcolor, wingcolor, sheepwings); // light blue for the wings
    
    float sheepmask = max(max(sheepbody, sheepoutline), max(sheephindlegs, sheepfrontlegs));
    sheepmask = max(sheepmask, sheeprightear); // This ear pokes out for some noise offsets
    sheepmask = max(sheepmask, sheepwings); // Add wings to the alpha mask
    
    return vec4(sheepcolor, sheepmask);
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    // Our fluffy friend wants coordinates in the range [0,1]
    vec2 uv = vec2(0.5)+(fragCoord-0.5/N*iResolution.xy)/min(iResolution.x, iResolution.y)*N;

    // The noise offset is used for individual variations (a "seed" of sorts)
    vec2 noiseoffset = vec2(0.0, 0.0);

    // The time variable is unused for now, because there's no animation
    vec4 sheepRGBA = sheep(uv, noiseoffset, iTime);

    // The alpha channel is meant for compositing, like this:
    vec3 mixcolor = mix(vec3(0.0,0.6,0.0), sheepRGBA.rgb, sheepRGBA.a);

    fragColor = vec4(mixcolor,1.0);
}
// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    mainImage(gl_FragColor, mod(gl_FragCoord.xy,resolution.xy/N));
}