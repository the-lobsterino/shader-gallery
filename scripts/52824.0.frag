#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {
	
	
	float amount = 1./10.;
	
	vec2 pos = ( gl_FragCoord.xy / resolution.xy );
	
	float thickness = sin(pos.y / 50.) + 0.02;
	
	vec3 color = vec3(0.97, 0.0, 0.25);
	
	float time = time / 4.;
	
	if (mod(pos.y + cos(time + pos.x) + sin(pos.x + pos.y * 3.) + tan(pos.x + pos.y/time), amount) <= thickness) {
		color = vec3(0, 0, 0);
	}
	
	gl_FragColor = vec4( color, 1.0);

}