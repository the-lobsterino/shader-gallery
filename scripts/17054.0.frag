#ifdef GL_ES
precision mediump float;
#endif

#define TWO_PI 6.28318530717958646
#define PI 3.14159265358979323
#define HALF_PI 1.570796326794896615

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

/**
 * http://www.timeanddate.com/worldclock/sunearth.html
 */

void main(void) {
	vec2 glp = (gl_FragCoord.xy / resolution.xy) * vec2(TWO_PI, PI) - vec2(PI, HALF_PI);
	vec2 glm = mouse * vec2(TWO_PI, PI) - vec2(PI, HALF_PI);
	float multp = cos(glp.y);
	vec3 posp = vec3(multp * cos(glp.x), multp * sin(glp.x), sin(glp.y));
	float multm = cos(glm.y);
	vec3 posm = vec3(multm * cos(glm.x), multm * sin(glm.x), sin(glm.y));

	float color = dot(posp, posm) > 0.0 ? 1.0 : 0.0;

	gl_FragColor = vec4(vec3(color), 1.0);
}
