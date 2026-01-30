#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 resolution;

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy );
	
	vec3 color = vec3(0.0);
	
	
	vec2 distVec = position - vec2(0.5,0.5);
	float dist = dot(distVec, distVec);
	
	dist = sqrt(dist);
	
	vec3 colors[7];
	colors[0] = vec3(0.0, 0.0, 0.0);
	colors[1] = vec3(0.2, 0.6, 0.2);
	
	
	if(dist >= 0.48)
	{
		gl_FragColor = vec4(colors[0], 1.0);
	}
	else
	{
		gl_FragColor = vec4(colors[1], 1.0);
	}

}