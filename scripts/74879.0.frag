#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {
	float dx = (resolution.x/2.0 - gl_FragCoord.x) / (resolution.x/2.0);
	float dy = (resolution.y/2.0 - gl_FragCoord.y) / (resolution.y/2.0);
	dx *= resolution.x / resolution.y;
	float d = length(vec2(dx, dy));
	float a = dot(normalize(resolution.xy/2.0 - gl_FragCoord.xy), vec2(0.0, 1.0));
//	if ((d >= 0.41) && (d <= 0.45) && a < cos(time)) {
	if ((d >= 0.41) && (d <= 0.62)) {
		gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
	} else {
		gl_FragColor = vec4(0.5, 0.0, 0.0, 1.0);
	}
	//gl_FragColor = vec4(d, d, d, 1.340);

}