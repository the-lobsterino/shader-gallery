#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) 
{

	vec2 p = (gl_FragCoord.xy / resolution.xx);
	float c = sin(length(p.x + sin(p.y) * cos(p.y) - 0.5)) * sin(time * 5.0);
	float d = sin(length(p.x + sin(p.y) * sin(p.y) - 0.5)) * sin(time * 1.0);
	float e = cos(length(p.y + sin(p.y) * sin(p.x) - 0.5)) * sin(time * 100.0);

		
	float r = sin(gl_FragCoord.x) * 2.0 + sin(gl_FragCoord.y) * 2.0;
	float g = sin(gl_FragCoord.x) * 2.0 + sin(gl_FragCoord.y) * 2.0;
	float b = sin(gl_FragCoord.x) * 2.0 + sin(gl_FragCoord.y) * 2.0;
	
	r = smoothstep(3.0, c * 100.0, g * r);
	g = smoothstep(3.0, d * 100.0, b * r);
	b = smoothstep(3.0, e * 100.0, g * r);
	
	gl_FragColor = vec4(r, g ,b, 1.0);

}