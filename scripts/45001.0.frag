#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

//this looks like parallax idk why

void main( void ) {

	vec2 p = 2.0*( gl_FragCoord.xy / resolution.xy ) -1.0;
	vec3 col = vec3(0); 
	
	vec2 op = p; 
	for (int i = 0; i < 64; i++) {
		
	p = op; 
	p.x = mod(p.x+1. + time * 0.5, 1.0)-0.5;
	p.y = p.y + 0.5;
	
	float d = (abs(p.y + 0.05* smoothstep(0.0,0.25,p.x) - 0.05*smoothstep(0.0,0.25,p.x+0.5)));
	col += vec3(1.0, 1.0,1.0) / (2.0 + 55.0 * d);
	op *= 1.1;
	op.x += 2.0;
	}
	gl_FragColor = vec4(col / 4.0, 1.0); 
}