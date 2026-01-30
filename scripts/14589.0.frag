#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform sampler2D buf;

// Bicubic resampling code yoinked from GPU Gems
// http://http.developer.nvidia.com/GPUGems/gpugems_ch24.html
// it uses no kernel tex, we compute weights on the fly
// it drifts down and to the left when FB_ZOOM == 1.0 because of ${REASONS}.
// I'm pretty sure I *have* seen an "escalator temporarily out of order" sign
// during my youth, so Mitch was slightly wrong... and I suppose it would be
// good to keep people off the temporary stairs, in case a gear was stripped
// or absent, so that enough people couldn't accidentally convert the
// temporary stairs in to a temporary down escalator with non-linear behavior

#define BICUBIC_FEEDBACK 1
#define FB_GAIN 0.5
#define FB_ZOOM 0.975
#define FB_POW 2.0

#define BEAM_WIDTH 0.0001
#define LINE1 1
#define LINE2 1
#define RING 1

// Mitchell Netravali Reconstruction Filter {
// cubic B-spline: 
#define MNB 0.10
#define MNC 3.40

// recommended
//#define MNB 0.333333333333
//#define MNC 0.333333333333

// Catmull-Rom spline
//#define MNB 0.0
//#define MNC 0.5
// }

float MNweights(float x)
{
	float ax = abs(x);
	return (ax < 1.0) ?
		((12.0 - 9.0 * MNB - 6.0 * MNC) * ax * ax * ax +
		 (-18.0 + 12.0 * MNB + 6.0 * MNC) * ax * ax + (6.0 - 2.0 * MNB)) / 6.0
	: ((ax >= 1.0) && (ax < 2.0)) ?
		((-MNB - 6.0 * MNC) * ax * ax * ax + (6.0 * MNB + 30.0 * MNC) * ax * ax + 
		 (-12.0 * MNB - 48.0 * MNC) * ax + (8.0 * MNB + 24.0 * MNC)) / 6.0
	: 0.0;
}

vec4 texture2D_bicubic(sampler2D tex, vec2 uv)
{
	vec2 px = (1.0 / resolution);
	vec2 f = fract(uv / px);
	vec2 texel = (uv / px - f + 0.5) * px;
	vec4 weights = vec4(MNweights(1.0 + f.x),
			    MNweights(f.x),
			    MNweights(1.0 - f.x),
			    MNweights(2.0 - f.x));
	vec4 t1 = 
		texture2D(tex, texel + vec2(-px.x, -px.y)) * weights.x +
		texture2D(tex, texel + vec2(0.0, -px.y)) * weights.y +
		texture2D(tex, texel + vec2(px.x, -px.y)) * weights.z +
		texture2D(tex, texel + vec2(2.0 * px.x, -px.y)) * weights.w;
	vec4 t2 = 
		texture2D(tex, texel + vec2(-px.x, 0.0)) * weights.x +
		texture2D(tex, texel) /* + vec2(0.0) */ * weights.y +
		texture2D(tex, texel + vec2(px.x, 0.0)) * weights.z +
		texture2D(tex, texel + vec2(2.0 * px.x, 0.0)) * weights.w;
	vec4 t3 = 
		texture2D(tex, texel + vec2(-px.x, px.y)) * weights.x +
		texture2D(tex, texel + vec2(0.0, px.y)) * weights.y +
		texture2D(tex, texel + vec2(px.x, px.y)) * weights.z +
		texture2D(tex, texel + vec2(2.0 * px.x, px.y)) * weights.w;
	vec4 t4 = 
		texture2D(tex, texel + vec2(-px.x, 2.0 * px.y)) * weights.x +
		texture2D(tex, texel + vec2(0.0, 2.0 * px.y)) * weights.y +
		texture2D(tex, texel + vec2(px.x, 2.0 * px.y)) * weights.z +
		texture2D(tex, texel + vec2(2.0 * px.x, 2.0 * px.y)) * weights.w;
	
	return MNweights(1.0 + f.y) * t1 +
		MNweights(f.y) * t2 +
		MNweights(1.0 - f.y) * t3 +
		MNweights(2.0 - f.y) * t4;
}

void main(void)
{
	float t = time * 0.1;
	//float intensity = pow(sin(time * 9.) * 0.5 + 0.5, 10.0) / 200.0 + BEAM_WIDTH;
	//float intensity = 1./mod(time*4.5, 3.) * BEAM_WIDTH + BEAM_WIDTH;
	float intensity = BEAM_WIDTH;
	vec2 unit = vec2(cos(t), sin(t));
	//vec2 mouse = vec2(0.5, 0.5);
	float aspect = resolution.y / resolution.x;
	vec2 position = (gl_FragCoord.xy / resolution) * vec2(1.0, aspect);
	vec2 ms = mouse * vec2(1.0, aspect);
	vec2 uv = ((gl_FragCoord.xy / resolution) - vec2(0.5)) * FB_ZOOM + vec2(0.5);
	float f = 0.0;
	
	vec2 lpos = position - ms;
	float lPosR = pow(position.x*position.x + position.y*position.y, 0.5);
	float lPosT = asin(position.x/lPosR);
	      lPosT += lPosR*3e3;
	      lpos.x = lPosR*sin(lPosT);
	      lpos.y = lPosR*cos(lPosT);
		
#if LINE1
	f += intensity / abs(dot(lpos, unit));
#endif
#if LINE2
	f += intensity / abs(dot(lpos, vec2(unit.y, -unit.x)));
#endif
#if RING
	f += intensity / abs((0.012+0.01*cos(time*317.))*length(position - ms));
#endif
#if BICUBIC_FEEDBACK
	f += pow(length(texture2D_bicubic(buf, uv).rgb), FB_POW) * FB_GAIN;
#else
	f += pow(length(texture2D(buf, uv).rgb), FB_POW) * FB_GAIN;
#endif
	gl_FragColor = vec4(f * 0.2, f * 0.5, f * 0.7, 1.0);
}
