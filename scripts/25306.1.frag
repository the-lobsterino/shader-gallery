#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float sin01(float t){ return (sin(t)+1.0)/2.0;}

void main( void ) {
	vec2 p = ( gl_FragCoord.xy / resolution.xy );
	p.x -= 0.5 + sin(time*2.0)/5.0;
	p.y -= 0.5 + sin(time*3.1+5.0)/5.0;;
	float aspect = resolution.x/resolution.y;
	float color = 0.0;
	color += (0.1 * (sin01(time)+0.1))/sqrt(pow(p.x*aspect,2.0) + pow(p.y, 2.0));
	gl_FragColor = vec4( vec3( color * sin01(time*5.0), 0.0, color), 1.0 );
}