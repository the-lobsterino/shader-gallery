#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float point(vec2 pos, vec2 center, float rad) {
	float dist = sqrt(pow(pos.x - center.x, 2.0) + pow(pos.y - center.y, 2.0));
	if (dist < rad) 
		return 2.0;
	return 1.0 - sqrt(dist - rad);
}

void main( void ) {
	
	float res = min(resolution.x, resolution.y);
	
	vec2 position = gl_FragCoord.xy/res;
	position.x -= sin(time) * 0.5 + 0.5;
	
	float color = point(position, vec2(0.5, 0.5), 0.3);
	
	gl_FragColor = vec4( color + 0.1, 0.0, color - 0.1, 0.1 );
}