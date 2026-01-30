#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

mat2 rotate2D(float r)
{
	return mat2(cos(r), -sin(r), sin(r), cos(r));
}

float random(vec2 seed)
{
	return fract(dot(seed*vec2(480.235, 235.326), vec2(12.325, 6.235)));
}

void main()
{
	vec2 uv = (2.*gl_FragCoord.xy - resolution.xy) / max(resolution.x, resolution.y);
	float l = length(uv);
	uv *= rotate2D(cos(uv.x+time)*.5);
	uv *= rotate2D(cos(l*4.0+time)*.25);
	uv *= 40.0;
	//uv *= rotate2D(radians(29.));
	
	uv.y *= 0.2;
	
	float cellValue = random(floor(uv));
	vec3 color = vec3(0.5, 0.05, 0.8)*cellValue;
	if (cellValue < 0.5)
		color = vec3(0.5, 0., 0.8)*0.45;
	
	gl_FragColor = vec4(color.rgb, 1.0) ;
}