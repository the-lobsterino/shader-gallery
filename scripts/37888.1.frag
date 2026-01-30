#ifdef GL_ES
precision highp float;
#endif

#extension GL_OES_standard_derivatives : enable

//uniform float time;
//uniform vec2 mouse;
uniform vec2 resolution;

#define SQ(x) (x*x)
#define MOD1(x) ((x-0.75)-floor(x-0.75))
#define circ(x, y, c) distance(vec3(x,y,0), vec3(c.xy,c.z))

void main( void ) {
	vec2 g = gl_FragCoord.xy/resolution.xy;
	vec2 r = resolution;

	float aspect = resolution.x / resolution.y;
	g.x *= aspect;

	vec3 col1 = vec3(1.0, 0.0, 0.0);
	vec3 col2 = vec3(0.0, 1.0, 0.0);
	vec3 col3 = vec3(0.0, 0.0, 1.0);
	vec3 col4 = vec3(0.6, 0.4, 0.7);
	
	vec3 color;

	if(MOD1(100.0*circ(g.x,g.y, vec3(0.3,0.5,1))) < 0.5)
		gl_FragColor = vec4( col1, 1 );
	else
		gl_FragColor = vec4( col2, 1 );

	if(MOD1(100.0*circ(g.x,g.y, vec3(1.5,0.5,4))) < 0.5)
		gl_FragColor = mix (gl_FragColor, vec4( col3, 1 ), 0.5);
	else
		gl_FragColor = mix (gl_FragColor, vec4( col4, 1 ), 0.5);

}