// GalaxyCollision by nikoclass
// 3-fold Symmetry by BackwardSpy
// 5-fold Symmetry by I.G.P.
// n-fold symmetry by Mr. E
// unfolded by 

#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
#define dmouse (vec2(cos(time*61.), sin(pow(time, 0.99)*61.))*0.001)
#define mouse (vec2(.5, .886140767) + dmouse)
uniform vec2 resolution;
#define P ((gl_FragCoord.xy/resolution)-dmouse/2.)
uniform sampler2D buffie;

const int iters = 200;
const int pow_z_n = 6;
const float invnz = 1./float(pow_z_n);

int fractal(vec2 p) {
	vec2 seed = (mouse - 0.5) * 2.0;
	for (int i = 0; i < iters; ++i) {
		if (length(p) > 2.0) {
			return i;
		}
		vec2 r = p;
		for (int j = 1; j < pow_z_n; ++j) {
			p = vec2(p.x * r.x - p.y * r.y, r.x * p.y + p.x * r.y);
		}
		p += seed;
	}
	return 0;	
}

vec3 color(int i) {
	float f = float(i)/float(iters) * 2.0;
	f = f * f * 2.0;
	//return vec3(f,f,f);    // gray shaded
	//return vec3((sin(f*2.0)), (sin(f*3.0)), abs(sin(f*7.0)));  // colorful
	return vec3(0.8+(sin(-0.53+f*26.))/log(2.0*f+2.0),  
		    0.8+(sin(-0.53+f*22.))/log(2.01*f+2.0),
		    0.8+(sin(-0.53+f*18.))/log(2.02*f+2.0));
}

vec4 texture2D_bicubic(sampler2D tex, vec2 uv);

void main( void ) {
	vec2 position = 2.5 * (-0.5 + gl_FragCoord.xy / resolution.xy );
	position.x *= resolution.x/resolution.y;
	float th = atan(position.x, position.y)*invnz/1.;
	position = pow(length(position), invnz)*vec2(sin(th), cos(th));
	vec3 c = color(fractal(position));
	c *= 0.1;
	c += texture2D_bicubic(buffie, P).xxx*0.9;
	gl_FragColor = vec4( c , 1.0 );
}





#define MNB 1.0
#define MNC 0.0

float MNweights(float x)
{
	float ax = abs(x);
	return (ax < 1.0) ?
		(((12.0 - 9.0 * MNB - 6.0 * MNC) * ax + (-18.0 + 12.0 * MNB +
		6.0 * MNC)) * ax * ax + (6.0 - 2.0 * MNB)) / 6.0
	: ((ax >= 1.0) && (ax < 2.0)) ?
		((((-MNB - 6.0 * MNC) * ax + (6.0 * MNB + 30.0 * MNC)) * ax + 
		(-12.0 * MNB - 48.0 * MNC)) * ax + (8.0 * MNB + 24.0 * MNC)) / 6.0
	: 0.0;
}

vec4 texture2D_bicubic(sampler2D tex, vec2 uv)
{
	vec2 fix = uv-vec2(0.5)/resolution; //remove diagonal offset
	vec2 px = (1.0 / resolution);
	vec2 f = fract(fix / px);
	vec2 texel = (fix / px - f + 0.5) * px;
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
