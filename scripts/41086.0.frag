#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

const vec3 col1 = vec3(1.0,1.0,1.0);

float dist(vec2 p1,vec2 p2) {
	float s1 = p2.x-p1.x;
	float s2 = p2.y-p1.y;
	return sqrt((s1*s1)+(s2*s2));
}

float lite(vec2 p1,vec2 p2,float brightness) {
	float light = 1.0-sqrt(dist(p1,p2))-brightness;
	if (light < 0.0) light = 0.0;
	return light;
}

void main( void ) {
	vec2 pos = (gl_FragCoord.xy/resolution.xy);
	float lighte = lite(pos,vec2(0.5,0.5),sin(time)/2.0+0.5);
	gl_FragColor = vec4(col1*lighte,1.0);
}