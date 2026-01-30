#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define thickness 30.0

void main( void )
{
	float speed = 100.0;// * (1.0 + mouse.x / resolution.x);
	float amplitude = resolution.y * mouse.y;
	float wavelength = 0.1 * abs(mouse.x - resolution.x / 2.0);
	
	vec2 position = gl_FragCoord.xy - vec2(time * speed, 0);
	
	float y = sin(position.x / wavelength) * amplitude * (gl_FragCoord.x / (resolution.x / 2.0));
	
	float distance = abs(y / 2.0 + resolution.y / 2.0 - position.y);
	
	if(distance <= thickness)
	{
		float c = (thickness - distance) / thickness;
		
		gl_FragColor = vec4(tan(gl_FragCoord.x) * c, cos(gl_FragCoord.x) * c, sin(gl_FragCoord.x) * c, 1.0);
	}
	else
		gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
}