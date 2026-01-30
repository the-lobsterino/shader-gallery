#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 uv = gl_FragCoord.xy/resolution.xy;
	
	vec2 p = (uv * 2. - 1.) * vec2(resolution.x/resolution.y, 1.);

	p = 2.* pow(p, vec2(mouse.x*64.)) * sqrt(2.)+1.;
	
	float l = step(length(p)/16., .25);
	
	gl_FragColor = vec4(l);
}//sphinx