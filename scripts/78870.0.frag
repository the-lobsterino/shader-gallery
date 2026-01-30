#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

const float PI = 3.141592653;
float C(vec2 a) 
{
	return abs(mouse.y*sin(time-a.x)+cos( a.y)) - mouse.x*cos(PI * a.x-sin(time));
}

void main( void ) {

	vec2 uv = (2.0 - gl_FragCoord.xy - resolution.xy ) / min(resolution.x, resolution.y);
	uv *= 8.0;
	float a = C(vec2(C(uv.xy), C(uv.xx+time)));
	
	a = smoothstep(0.9, 1., a);
	gl_FragColor = vec4(a);

}