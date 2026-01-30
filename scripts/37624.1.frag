#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 pos = ((( gl_FragCoord.xy / resolution.xy ) - vec2(0.5)) * 4.0);

	float z = 0.0;
	float cx = pos.x - 0.5;
	float cy = pos.y;
	float tx = pos.x - 0.5;
	float ty = pos.y;
	for(int iter = 0; iter < 50; iter++) {
		float xSquared = abs(tx)*abs(tx) - abs(ty)*abs(ty);
		float ySquared = -2.0 * abs(tx * ty);
		tx = xSquared + cx;
		ty = ySquared + cy;
		if(tx * tx + ty * ty > 8.0) {
			z = float(iter);
			break;
		}
	}
	
	float color = (z / 50.0);
	gl_FragColor = vec4(color, color, color, 1.0);

}