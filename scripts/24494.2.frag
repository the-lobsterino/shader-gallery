#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float circle(vec2 p, vec2 center, float r) {
	float d = distance(p, center);
	return 3.0 * r/d;
}

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy );
	position = 2.0 * position - 1.0;
	position.x *= resolution.x / resolution.y;

	float interval = 5.0;
	float t = mod(time, interval) / interval;
	float x = t * 3.0 - 3.0;
	float y = sin(t * 3.14 * 5.0);
	float color = 0.0;
	float ca = circle(position, vec2(x, y), 0.2);
	
	interval = 2.0;
	t = mod(time, interval) / interval;
	x = t * 5.0 - 1.0;
	y = sin(t * 3.14 * 5.0);
	float cb = circle(position, vec2(x, y), 0.2);
	
	interval = 3.0;
	t = mod(time, interval) / interval;
	x = t * 7.0 - 5.0;
	y = sin(t * 3.14 * 5.0);
	float cc = circle(position, vec2(x, y), 0.2);
	
	interval = 20.0;
	t= mod (time, interval) / interval;
	x = 0.5 * cos(3.14 * 2.0 * t);
	y = 0.5 * sin(3.14 * 2.0 * t);
	float cd = circle(position, vec2(-x, y), 0.3);
		
	color = min(ca, cc);
	float color2 = min(ca, cb);
	float color3 = min(cb, cc);
	
	color = ca * cb * cc * cd;
		
	gl_FragColor = vec4( color, color2, color3, 1.0 );

}