#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
vec2 position;

float ball(float x, float y, float r){
	x = abs(position.x - x) * (resolution.x / resolution.y);
	y = abs(position.y - y);
	return 1.0-smoothstep(0.0, 0.0005, x*x+y*y-r*r);
}

void main( void ) {
	vec2 mousex = mouse - 1.0 * 0.5;
	position = ( gl_FragCoord.xy / resolution.xy ) - mousex / 4.0;

	float color = 0.0;
	for(float i = 0.1; i < 1.0; i+= 0.05){
		color += ball(((mousex.x) * 1.0 / i)*0.03 + 0.5,  (mousex.y * 1.0 / i)*0.03 + 0.5, i);
	}
	color /= 20.0;
	gl_FragColor = vec4(color, color, color, 1.0 );

}