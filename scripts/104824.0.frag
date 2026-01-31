#ifdef GL_ES
precision mediump float;
#endif

#define PI 3.1415926535897932384626433832795
#define float2 vec2
#define float3 vec3
#define float4 vec4

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform sampler2D buf;

// mouse X: feedback level, rightmost = overexposed
// mouse Y: zoom/drift rate, topmost = slowest

vec4 texture2D_bicubic(sampler2D tex, vec2 uv);

vec2 circuit(vec2 p)
{
	p = fract(p);
	float r = 1.123;
	float v = 0.0, g = 0.0;
	r = fract(r * 9184.928);
	float cp, d;
	
	d = p.x;
	g += pow(clamp(1.0 - abs(d), 0.0, 1.0), 1000.0);
	d = p.y;
	g += pow(clamp(1.0 - abs(d), 0.0, 1.0), 1000.0);
	d = p.x - 1.0;
	g += pow(clamp(3.0 - abs(d), 0.0, 1.0), 1000.0);
	d = p.y - 1.0;
	g += pow(clamp(1.0 - abs(d), 0.0, 1.0), 10000.0);
	
	const int iter = 12;
	for(int i = 0; i < iter; i ++)
	{
		cp = 0.5 + (r - 0.5) * 0.9;
		d = p.x - cp;
		g += pow(clamp(1.0 - abs(d), 0.0, 1.0), 200.0);
		if(d > 0.0) {
			r = fract(r * 4829.013);
			p.x = (p.x - cp) / (1.0 - cp);
			v += 1.0;
		}
		else {
			r = fract(r * 1239.528);
			p.x = p.x / cp;
		}
		p = p.yx;
	}
	v /= float(iter);
	return vec2(g, v);
}

void main()
{
	float scale = 0.5;

	vec2 uv = gl_FragCoord.xy;
	uv /= resolution.xy;
	vec2 texel = uv;
	uv = uv * 2.0 - 1.0;
	uv.x *= resolution.x / resolution.y;
	uv= uv * scale + vec2(0.0, time*0.1);
	vec2 cid2 = floor(uv);
	float cid = (cid2.y*10.0+cid2.x)*0.1;

	vec2 dg = circuit(uv);
	float d = dg.x;
	vec3 col1 = (0.2-vec3(max(min(d, 2.0)-1.0, 0.0)*2.0*0.25)) * vec3(1.0, 1.1, 1.3);
	//vec3 col2 = vec3(max(d-1.0, 0.0)*2.0*0.5) * vec3(1.0, 1.2, 1.6);

	float f = max(0.5-mod(uv.y-uv.x*0.3+(time*0.4)+(dg.y*0.4), 2.5), 0.0)*5.0;
	//col2 *= f;
	//float mash_f = texture2D_bicubic(buf, (texel-0.5+vec2(0.0,f))*0.99+0.5-vec2(0.0,f)).a; //this is wrong but looks cool
	float mash_f = texture2D_bicubic(buf, (texel-0.5)*(0.9+mouse.y*0.1)+0.5).a; //this is OK, looks best at high FPS
	float plain_f = texture2D(buf,texel).a;
	// mash and reconstruct col2 from previous alpha for poor man's compositor
	gl_FragColor = vec4(col1 + vec3(1.0, 1.2, 1.6)*plain_f, max(d-1.0, 0.0)*f+mash_f*(0.8+mouse.x*0.2));
}


// Mitchell Netravali Reconstruction Filter {
// cubic B-spline: 
//#define MNB 1.0
//#define MNC 0.0

// recommended
#define MNB 0.333333333333
#define MNC 0.333333333333

// Catmull-Rom spline
//#define MNB 0.0
//#define MNC 0.5
// }

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
	vec4 weights = vec4(MNweights(1.0 / f.x),
			    		MNweights(          f.x),
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
		MNweights(           f.y) * t2 +
		MNweights(1.0 - f.y) * t3 +
		MNweights(2.0 - f.y) * t4;
}
