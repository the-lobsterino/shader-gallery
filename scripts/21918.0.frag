#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

vec2 spline[5];
#define CIRCLE_RADIUS 0.03


void set_spline(){
 spline[0] = vec2(0.1, 0.1);
 spline[1] = vec2(0.2, 0.7);
 spline[2] = vec2(0.6, 0.7);
 spline[3] = vec2(0.7, 0.1);
 spline[4] = vec2(0.1, 0.1);
}

vec2 spline_at_t(float t){
	return vec2(0.5 + 0.1*sin(time));
}


void main( void ) {
	set_spline();
	vec2 position = ( gl_FragCoord.xy / resolution.xy );// + mouse / 4.0;

	vec4 blah = vec4(0);
	vec2 diff = position - spline_at_t(time);
	float dist = sqrt(dot(diff, diff));
	if(dist < CIRCLE_RADIUS){
		blah.g = 1. - (dist / CIRCLE_RADIUS);
	}
	gl_FragColor = blah;
}