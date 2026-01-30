#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

//	vec2 position = ( gl_FragCoord.xy / resolution.xy );
	vec2 position = gl_FragCoord.xy;

	vec3 color = vec3(0);
	
	
	float a = sin(position.x/40. + time*3.) * 5.;
	
	color = vec3(smoothstep(resolution.y/2., resolution.y/2. + 3. , position.y + a));
	//if(position.y + a>= resolution.y/2.)
	//	color = vec3(1,1,1);
	float b = sin(time*3. + 250.) * 5.;
	if(position.y + a + b> 100. && position.y + b < 200. && position.x > 100. && position.x < 200.)
		color = vec3(1,1,0);
	
	

	gl_FragColor = vec4( color, 1 );

}