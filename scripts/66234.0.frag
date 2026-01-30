#ifdef GL_ES
precision mediump float;
#endif

// dashxdr 20200722
// https://www.youtube.com/watch?v=sG_6nlMZ8f4
// Epic Circles
// Mapping points where r' = R0/r
// where R0 is the circle you're mapping around
// Circles stay as circles

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {
	vec2 uv = (gl_FragCoord.xy - .5*resolution.xy)/resolution.y;

	vec3 col = vec3(1);

	float r1 = .25;
	float thick1 = .003;
	float thick2 = thick1*1.1;
	col *= smoothstep(thick1, thick2, abs(length(uv)-r1));

	float r2 = .1;
	vec2 m = (mouse-.5);
	m.x*=resolution.x/resolution.y;

	col = mix(col, vec3(0,0,1),smoothstep(thick2, thick1, abs(length(uv-m)-r2)));
	float f = r1*r1/dot(uv,uv);
	vec2 t = f*uv;
	thick2*=f;thick1*=f;
	col = mix(col, vec3(1,0,0), smoothstep(thick2, thick1, abs(length(t-m)-r2)));

	gl_FragColor = vec4(col, 1);
}
