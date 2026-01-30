#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
const float radius = 60.;
const float PI = 3.1415923535897250175992918572850175680;
vec2 f(float t) {
	return vec2(sin(t), cos(t))/(30. + sin(t)*20.);
}
void main( void ) {
	vec2 m = mouse;
	vec2 position = ( gl_FragCoord.xy / resolution.xy );
	position.x *= resolution.x/resolution.y;
	m.x *= resolution.x/resolution.y;
	vec3 color = vec3(0, 0, 0);
	color.r = 1.-length(position - m - f(time))*radius;
	color.g = 1.-length(position - m - f(time+(2.*PI/3.)))*radius;
	color.b = 1.-length(position - m - f(time+(4.*PI/3.)))*radius;
	color.r *= 1.-length(position - m)*radius;
	color.g *= 1.-length(position - m)*radius;
	color.b *= 1.-length(position - m)*radius;
	
	//color.x = sin(mouse.x);
	//color.y = sin(mouse.y);
	gl_FragColor = vec4(color, 1.0);

}