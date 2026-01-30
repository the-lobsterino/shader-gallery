#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define TWOPI 6.2831853
const float num = 15.0;

void main( void ) {

	vec2 _pos = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);
	vec3 _destColor;
	
	_destColor.b = abs(sin(time));
	_destColor.g = abs(cos(time));
	_destColor.r = (_destColor.b + _destColor.g) / 1.0;
	
	float _exrate = abs(sin(time));
	
	float f = 0.0;
	for(float i = 0.0; i < num; ++i)
	{
		float theta = time + i * TWOPI / num;
		vec2 tr = vec2(cos(theta), sin(theta)) * _exrate;
		f += (mouse.y * 0.025 + 0.0025) / distance(length(_pos + tr), mouse.x);
	}
	gl_FragColor = vec4(vec3(_destColor * f), 1.0);
}