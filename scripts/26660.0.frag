#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float thickness = 10.0;
float glow = 50.0;



void main( void ) {

	float y = 100.0*(mouse.y-0.5)*sin(gl_FragCoord.x*.03+(time*2.0)) + (resolution.y/2.0);
	
	
	vec4 color = vec4(0,0,0,0);
	
	if ( distance(gl_FragCoord.xy, vec2(gl_FragCoord.x, y))<thickness )
	{
		color = color + vec4(1,1,1,1);
	}
	
	if ( distance(gl_FragCoord.xy, vec2(gl_FragCoord.x, y))<glow )
	{
		float dist = 1.0 - (distance(gl_FragCoord.xy, vec2(gl_FragCoord.x, y)) / 50.0);
		color = color + vec4(dist/2.0,dist,dist*4.0*abs(mouse.y-0.5),dist);
	}
	
	gl_FragColor = color;
}