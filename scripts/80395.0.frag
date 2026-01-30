#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

const float PI = 3.141592653;
float C(vec2 a) 
{
	return abs(cos(PI * a.y+time)) - cos(PI * a.x);
}

void main( void ) {

	vec2 uv = (2.0 - gl_FragCoord.xy - resolution.xy ) / min(resolution.x, resolution.y);
	uv *= 1.0;
	float a = C(vec2(mouse.x+C(uv.xy), C(uv.yx)));
	
	a = smoothstep(0.9, 1., a);
	gl_FragColor = vec4(a);

}