#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 _pos = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);
	vec3 _destColor = vec3(0.0);
	for(float i = 0.0; i < 5.0; ++i)
	{
		float j = i + 1.0;
		vec2 _pos2 = _pos + vec2(cos(time * j), sin(time * j)) * 0.5;
		_destColor.b += 0.05 / length(_pos2);
	}
	
	
	gl_FragColor = vec4(_destColor, 1.0);
	
}