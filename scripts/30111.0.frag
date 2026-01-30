#ifdef GL_ES
precision lowp float;
#endif
//GLSL code from shadertoy : https://www.shadertoy.com/view/4dS3Ry
//Perlin Noise test for : http://advances.realtimerendering.com/s2015/The%20Real-time%20Volumetric%20Cloudscapes%20of%20Horizon%20-%20Zero%20Dawn%20-%20ARTR.pdf
//Contact : florian.brillat@gmail.com

#define M_PI 3.14159265358979323846

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;


float rand(vec2 co){
	return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
}

float rand (vec2 co, float l) {
	return rand(vec2(rand(co), l));
}

float rand (vec2 co, float l, float t) {
	return rand(vec2(rand(co, l), t));
}

float perlin(vec2 p, float dim, float time) {
	vec2 pos = floor(p * dim);
	vec2 posx = pos + vec2(1.0, 0.0);
	vec2 posy = pos + vec2(0.0, 1.0);
	vec2 posxy = pos + vec2(1.0);

	float c = rand(pos, dim, time);
	float cx = rand(posx, dim, time);
	float cy = rand(posy, dim, time);
	float cxy = rand(posxy, dim, time);

	vec2 d = fract(p * dim);
	d = -0.5 * cos(d * M_PI) + 0.5;

	float ccx = mix(c, cx, d.x);
	float cycxy = mix(cy, cxy, d.x);
	float center = mix(ccx, cycxy, d.y);

	return center * 2.0 - 1.0;
}


void main()
{
        vec2 uv = gl_FragCoord.xy / resolution.xx;

	float dt = 0.00;
	float time = 13.0;
	float progress = 1.0;
    vec3 clr = vec3(0.5);
	vec3 nextClr = vec3(0.5);

	for (float i = 2.0; i < 11.0; ++i) {
		clr += pow(0.6, i) * vec3(perlin(uv, pow(2.0, i), time));
		nextClr += pow(0.6, i) * vec3(perlin(uv, pow(2.0, i), time + dt));
	}
	gl_FragColor = mix (vec4(clr, 1.0), vec4(nextClr, 1.0), progress);
}
