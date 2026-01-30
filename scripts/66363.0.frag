#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 p = ( gl_FragCoord.xy / resolution.xy );
	p = (p*2.0) - 1.0;
	p.x *= resolution.x/resolution.y;
	vec3 col = vec3(0.0);
	if(p.x*p.x + p.y*p.y < .25)
		col = vec3(1.0);
	gl_FragColor = vec4(col, 1.0);

}