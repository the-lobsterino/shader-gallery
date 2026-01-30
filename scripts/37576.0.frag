#ifdef GL_ES
precision lowp float;
#endif

#extension GL_OES_standard_derivatives : enable


uniform vec2 mouse;
uniform vec2 resolution;


#define rmouse mouse*resolution

void main( void ) {
	float radius = 120.0;
	float gradius = 100.0;
	
	vec2 dist = rmouse.xy-gl_FragCoord.xy;
	float i = 1.0-smoothstep(100.0,radius,length(dist));
	float gi = 1.0-smoothstep(100.0,gradius,length(dist));
	i=max(i,gi);
	vec4 f = vec4(i*(gl_FragCoord.x/resolution.x),i*(gl_FragCoord.y/resolution.y),i,1.0);
	gl_FragColor = f;
}