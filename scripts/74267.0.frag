/*
 * Original shader from: https://www.shadertoy.com/view/NtBSz3
 */

#ifdef GL_ES
precision mediump float;
#endif

// glslsandbox uniforms
uniform float time;
uniform vec2 resolution;

// shadertoy emulation
#define iTime time
#define iResolution resolution

// Emulate some GLSL ES 3.x
#define round(x) (floor((x) + 0.5))

// --------[ Original ShaderToy begins here ]---------- //
// Originally done in Blender:
// https://twitter.com/cmzw_/status/1380115994320859147

#define PI 3.14159265359

#define RES 24.0
#define SCALE 1.0
#define SPEED_FAC 3.0

#define ARROW_MASK 0
#define ARROW_COL 1
#define ARROW_HIT_AREA 2
#define ARROW_HIT_AREA_MASK 3

float sdSegment(in vec2 p, in vec2 a, in vec2 b) {
	vec2 pa = p - a, ba = b - a;
	float h = clamp(dot(pa, ba) / dot(ba, ba), 0.0, 1.0);
	return length(pa - ba * h);
}

vec3 overlay(in vec3 a, in vec3 b) {
	return vec3((b.r > .5) ? (2. * a.r * b.r) : 1. - 2. * (1. - a.r) * (1. - b.r),
	            (b.g > .5) ? (2. * a.g * b.g) : 1. - 2. * (1. - a.g) * (1. - b.g),
	            (b.b > .5) ? (2. * a.b * b.b) : 1. - 2. * (1. - a.b) * (1. - b.b));
}

float sstep(in float f) { return 1. - step(0.0001, f); }

mat2 rot2(float a) { return mat2(cos(a), -sin(a), sin(a), cos(a)); }

vec3 arrow(in vec2 p, in float scale, int mode, in vec3 acol) {
	p *= scale;
	p = vec2(round(p * RES) / RES);
	vec2 p1 = vec2(abs(p.x), p.y);

	float af = sdSegment(p1, vec2(.58, .0), vec2(.0, .58));
	float al = sdSegment(p, vec2(.0, .48), vec2(.0, -.58));

	float a1 = sstep(af - .08);
	float a2 = sstep(sdSegment(p, vec2(.0, .15), vec2(.0, -.05)) - .15);
	float a3 = sstep(sdSegment(p, vec2(.0, .13), vec2(.0, -.51)) - .11);
	float tp = sstep(dot(p1 + vec2(.0, -mod(iTime / .4, 1.6)) + .4, vec2(.22)));
	float ts = sstep(abs(dot(p1 - vec2(0., -.15), vec2(.21, .26))) - .01);
	float rect = sstep(length(max(abs(p - vec2(.0, .42)) - vec2(.3, .2), 0.)));

	float arrow =
	    clamp(rect * sstep(dot(p1, vec2(.22)) - .11) + a1 - a2, 0., 1.) + clamp(a3 - ts, 0., 1.);
	float region = min(af, al) - .2;
	float outline = sstep(abs(region) - .02);

	vec3 color = overlay(acol, vec3(round((p.y + 1.) * 4.) / 4.) + .5);

	color = mix(vec3(0.), color, sstep(region));

	float mask = sstep(region - .02);

	if (mode == ARROW_MASK) {
		return vec3(mask);
    } else if (mode == ARROW_COL) {
		return vec3(outline + color + arrow * tp + arrow * .2);
    } else if (mode == ARROW_HIT_AREA) {
		return vec3(mask * .3 * mod(iTime / .5, 1.) + .5 - arrow + outline);
	} else { /* ARROW_HIT_AREA_MASK: */
		return vec3(mask - arrow);
	}
}

vec3 hit_arrow(in vec3 col, in vec2 ha) {
	vec3 acol = vec3(0.);
	return mix(col, arrow(ha, 2., ARROW_HIT_AREA, acol), arrow(ha, 2., ARROW_HIT_AREA_MASK, acol));
}

vec3 ca(in vec3 col, in vec3 ac, in vec2 p, in vec2 ha, in mat2 rot, in vec2 ss) {
	vec3 left_m = vec3(1. - step(0., abs(p.x - .25 * 3.) - .25)) * step(ss.x, mod(p.y * ss.y, 2.));
	vec2 a = mod((p * 2. - .5) + .5, 1.) - .5;
	vec2 ap = a * rot;
	return mix(col, arrow(ap, 2., ARROW_COL, ac),
	           arrow(ap, 2., ARROW_MASK, ac) * left_m * (sstep(ha.x - a.y)));
}

void mainImage(out vec4 fragColor, in vec2 fragCoord) {
	vec3 col;
	vec2 p = (2. * fragCoord - iResolution.xy) / iResolution.y;
	p *= SCALE;

	// checker bg
	vec2 cp = floor(p * 2.);
	col += mix(.13, .17, mod(cp.x + cp.y, 2.));

	// hit areas
	vec2 ha = (p * 2. - vec2(-1.5, 1.5)) * -rot2(PI / 2.);
	col = hit_arrow(col, ha);
	col = hit_arrow(col, (p * 2. - vec2(-.5, 1.5)) * rot2(PI));
	col = hit_arrow(col, (p * 2. - vec2(.5, 1.5)) * -rot2(PI));
	col = hit_arrow(col, (p * 2. - vec2(1.5, 1.5)) * rot2(PI / 2.));

	// colors
	vec3 blue = vec3(0., .1, .3);
	vec3 bluep = vec3(0., .202, .139);
	vec3 orange = vec3(.34, .045, .0);
	vec3 green = vec3(.0, .159, .03);
	vec3 red = vec3(.19, .0, .0);
	vec3 redp = vec3(.15, .0, .057);
	vec3 purple = vec3(.106, .001, .34);
	vec3 yellow = vec3(.202, .174, .0);

	// arrows
	vec2 tr = p - vec2(0., iTime * SPEED_FAC);
	col = ca(col, blue, tr - vec2(-1.5, .4), ha, -rot2(PI / 2.), vec2(1.5, 1.));
	col = ca(col, redp, tr - vec2(-1.5, -.2), ha, -rot2(PI / 2.), vec2(1., 2.));
	col = ca(col, green, tr - vec2(-1, 1.1), ha, rot2(PI), vec2(1.5, 1.));
	col = ca(col, orange, tr - vec2(-1, .1), ha, rot2(PI), vec2(1.5, 1.));
	col = ca(col, purple, tr - vec2(-.5, .1), ha, -rot2(PI), vec2(1., 2.));
	col = ca(col, red, tr - vec2(-.5, -.5), ha, -rot2(PI), vec2(1., 2.));
	col = ca(col, yellow, tr - vec2(0., -.5), ha, rot2(PI / 2.), vec2(1.5, 1.));
	col = ca(col, bluep, tr - vec2(0., .4), ha, rot2(PI / 2.), vec2(1.5, 1.));

	fragColor = vec4(col, 1.);
}
// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
}