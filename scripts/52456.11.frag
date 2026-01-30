precision mediump float;
uniform float time;
uniform vec2 resolution;

void main( void ) {
	vec2 position = gl_FragCoord.xy/resolution.xy;
	vec4 shift = vec4(
		sin(position.x+time/5.0),
		cos(position.y+time/5.0),
		cos(position.x+time/5.0)+sin(position.y+time/5.0),
		1.0);
	float color = sin(position.x*cos(time/9.0)*time/1.5) 
		    + cos(position.y*sin(time/9.0)*time/1.5);
	color += sin(position.y*cos(time/7.0)*time/14.0);
	color += cos(position.x*sin(time/7.0)*time/15.0);
	gl_FragColor = vec4(-color, color, color, 1.0);
	gl_FragColor = gl_FragColor * shift;
}