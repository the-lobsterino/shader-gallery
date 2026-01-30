#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

const float pi = radians(180.0);

float random(vec2 st)
{
	return fract(sin(dot(st, vec2(125.521, 53.235)))*12562.36);
}

vec2 rotate2D(in vec2 pivot, in vec2 point, float r)
{
	float s=sin(r), c=cos(r);
	mat2 rotMat = mat2(c, -s, s, c);
	
	point -= pivot*0.5;
	point *= rotMat;
	point += pivot*0.5;
	
	return point;
}

void main()
{
	vec2 uv = (gl_FragCoord.xy - 0.5*resolution.xy) / resolution.y;
	uv *= 25.0;
	uv += 0.5;
	vec2 uv_f = fract(uv);
	vec2 uv_i = floor(uv);
	
	float randnum = random(uv_i);
	float randrot = (randnum*2.0-1.0) * time;
	uv = rotate2D(vec2(1.0), uv_f, (randnum*2.0-1.0) * 2.0*pi + randrot);

	float cube = step(0.1, uv.x)*step(0.1, uv.y)*step(uv.x, 0.9)*step(uv.y, 0.9);
	vec3 color = vec3(0.0);
	color.r = cube*max(randnum, 0.05);
		
	gl_FragColor = vec4(color, 1.0);
}















