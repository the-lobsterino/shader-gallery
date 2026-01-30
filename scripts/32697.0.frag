#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

const int steps = 24;
const float pi = 3.14159;

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy ) - vec2(0.5);
	position.x *= resolution.x/resolution.y;
	
	position.x += 0.2*(sin(time)*position.x + cos(time)*position.y);
	position.y += 0.2*(sin(time)*position.y + cos(time)*position.x);
	
	position.x += 0.3*sin(time);
	position.y += 0.3*cos(time);

	vec3 color = vec3(0.0);
	
	float h = 0.0;
	for (int i=0; i<steps; i++)
	{
		float phase = float(i)/float(steps) * 2.0 * pi + sin(time/4.0)*30.0;
		vec2 uv = mod((position) * phase, 0.5);
		h += uv.x*uv.y;
	}
	
	color.r = sin(h + time*0.66);
	color.b = cos(h*5.0 + time*0.8);
	color.g = pow(sin(h + time*0.66), 5.0);
	
	gl_FragColor = vec4( color, 1.0 );

}