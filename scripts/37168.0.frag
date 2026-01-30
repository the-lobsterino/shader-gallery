#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float formula(vec2 p) {
	//p.x += time;
	p.x = mod(p.x + 1.0, 2.0) - 1.0;
	float d = 100.0;

	for(int i = 0; i < 6; i++) {
		p.xy = abs(p.xy)/clamp(dot(p.xy, p.xy), 0.4, 1.0) - vec2(mouse.x, mouse.y);
		d = min(d, abs(p.y));
	}
	
	return d;
}

void main( void ) {
	vec2 p = (-resolution + 2.0*gl_FragCoord.xy)/resolution.y;
	
	float d = formula(p.xy);	
	vec3 col = vec3(d);
	
	gl_FragColor = vec4(col, 1);		  
}