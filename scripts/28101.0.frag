#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) 
{
	float color = 0.0;
	
	float x = gl_FragCoord.x + time * -100.0;
	float y = gl_FragCoord.y + (cos(time) * 50.0);
	
	color = (sin(x*0.01)*10.0 + sin(y*0.1)*10.0) * 1.5;
	
	gl_FragColor = vec4(vec3(0.5 * color, 0.5 * color * sin(time) * 0.1, 0.5) * 0.6, 1.0 );
}