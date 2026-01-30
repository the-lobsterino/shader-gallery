// Kyle Mac, bitches

#ifdef GL_ES
precision mediump float;
#endif

#define E 2.71828182846

uniform float time;
uniform vec2 resolution;

void main() {
	vec2 pos = ( gl_FragCoord.xy / resolution.xy ) + 0.5;
	if (pos.y < 0.5 || pos.y > 1.6) {
		gl_FragColor = vec4(0.5, 0.5, 0.5, 1.0);
		return;
	}
	
	gl_FragColor = vec4( 0.25 * pow(E, -0.5 * pow((pos.y-1.0) / 0.025, 1.0)) * (cos(time*4.0+pos.x)/4.0+1.00), 0.65 * pow(E, -0.75 * pow((pos.y-1.0) / 0.0075, 2.0)) * (sin(time*2.0+pos.x*4.0)/1.0+1.0), 0.65 * pow(E, -0.25 * pow((pos.y-1.0) / 0.015, 0.50)) * (sin(time*1.5*4.0)/4.0+1.5), 1.0 );
}