#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) 
{
	vec2 position = gl_FragCoord.xy / resolution.xy - vec2(0., .5);
	float scale = 4.0;
	float color = 0.1;
	
	for (int i=0; i<20; i++) 
	{
		float val = sin((position.x * float(i)/2. - time * .014 * float(i) + time*.4) * scale);
		
		color += 0.4 * smoothstep( 0.01, 0.0, abs(position.y * scale - val) - 0.015 );
	}
	
	gl_FragColor = vec4(vec3( color, 0, color), 1.0);

}