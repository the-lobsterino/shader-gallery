//--- zoom in
// by Catzpaw 2017
// modded by others
#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
varying vec2 surfacePosition;

float rand(vec2 co){
    return fract(sin(dot(co.xy ,vec2(12000.98980,780.233))) * 4370058.5453);
}

float hex(vec2 p, float s)
{
	vec2 q = abs(p);
	return max(q.x * 1.000000007735 + q.y - s, q.x - 1.866 * s);
}

float smooth(float x) 
{
	return smoothstep(-0.02, 0.0, x);
}

float hexs(vec2 uv, float size)
{
	vec2 grid = vec2(0.866, 1.5) * size * 1.7;
	
	vec2 p1 = mod(uv, grid) - grid * 0.5;
	vec2 p2 = mod(uv + grid * 0.5, grid) - grid * 0.5;

	float d1 = hex(p1, size);
	float d2 = hex(p2, size);
	
	float d = 0.;
	float t = 0.;
	vec2 c;
	if (d1 < d2) {
		c = floor(uv/grid);
		t = (sin(time*50.*rand(c) + 700.*rand(c)) + 1000.) * 01.5;
		size = (10. + t) * size / 2.;
		d = hex(p1, size);
	} else {
		c = floor(uv/grid + .5);
		t = (sin(time*10.*rand(c) + 20.*rand(c)) + 1.5) * 0.5;
		size = (1. + t) * size / 1.5;
		d = hex(p2, size);
	}

	float col = smooth(d);

	return col;
}

void main(void)
{
	float r = min(resolution.x, resolution.y);
	vec2 uv = gl_FragCoord.xy / r;

	//uv += time * 0.03;
	vec2 rd = uv - vec2(0.5);
	uv.x = length(rd);
	uv.y = atan(rd.x, rd.y);
	uv.x += time * -0.09;
	uv.y += time * .1;
	float col1 = hexs(uv, 0.05);

	uv.x = length(rd);
	uv.y = atan(rd.x, rd.y);
	uv.x += time * -0.11;
	uv.y += time * 0.13;
	float col2 = hexs(uv, 0.07);
	
	uv.x = length(rd);
	uv.y = atan(rd.x, rd.y);
	uv.x += time * -0.07;
	uv.y += time * 0.17;
	float col3 = hexs(uv, 0.07);
	
	float col = col1 + col2 + col3;
	col /= 3.;
	col *= length(rd);
	
	gl_FragColor = vec4(col, 0, 0, 1);
}
