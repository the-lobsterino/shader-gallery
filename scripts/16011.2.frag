#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 resolution;

void main( void ) {
	vec2 p = (gl_FragCoord.xy / resolution.xy) - .5;
	float dy = 0.5*sin(8.*time+20.*atan(p.x, p.y));
	vec3 c = vec3(dy*sin(time),dy*cos(time),dy*tan(time));
	gl_FragColor = vec4(c*p.x*20.,0);
}