#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void drawSin(float epsilon)
{
	vec2 position = gl_FragCoord.xy / resolution;
	float sinX = (sin(position.x * (time * 2.02)) * 0.2) + 0.5;
	if (position.y < sinX + epsilon && position.y > sinX - epsilon) {
		float smooth = smoothstep(0.0, 1.0, sinX);
		gl_FragColor = vec4(smooth * position.x, smooth * position.y, smooth * (position.x * .05 * (position.y * 0.05)), 1.0);
	}
	
	float sinX2 = ((sin(position.x * (time * .02)) * (0.2 * sin(time * 2.))) + 0.5);
	if (position.y < sinX2 + epsilon && position.y > sinX - epsilon) {
		//float smooth = //smoothstep(0.0, 1.0, sinX);
		float smooth = 1.0;
		gl_FragColor = vec4(mod(position.x, position.y) * cos(time * .5) + 0.4, .1, .1, 1.0);
	}
}

void main( void )
{
	gl_FragColor = vec4(vec3(0.0), 1.0);
	drawSin(.01);
}