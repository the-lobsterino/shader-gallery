#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

//Voronoi sample : this is not optimized for GPU,
//and seriously needs some shading.
//But at least, it can be interesting for education.
//Use the mouse to move the last seed

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	float radius = 0.0021;
	
	vec2 position = ( gl_FragCoord.xy / resolution.xy );
	
	vec2 seeds[6];
	vec3 colors[6];
	seeds[0] = vec2(0.1, 0.5);
	seeds[1] = vec2(0.4, 0.8);
	seeds[2] = vec2(0.6, 0.2);
	seeds[3] = vec2(0.7, 0.2);
	seeds[4] = vec2(0.8, 0.6);
	seeds[5] = mouse.xy;
	
	colors[0] = vec3(1.0, 0.0, 0.0);
	colors[1] = vec3(0.0, 1.0, 0.0);
	colors[2] = vec3(0.0, 0.0, 1.0);
	colors[3] = vec3(0.5, 0.5, 0.5);
	colors[4] = vec3(0.25, 0.5, 0.75);
	colors[5] = vec3(0.7, 0.5, 0.75);
	
	vec3 color = colors[0];
	float tamp_dist = distance(seeds[0], position.xy);
	for (int i = 0; i < 6; i++) {
		float dist = distance(seeds[i], position.xy);
		if (dist < tamp_dist) {
			color = colors[i];
			tamp_dist = dist;
		}
		
		if (dist <= radius) {
			color = vec3 (0.0,0.0,0.0);	
		}
	}
	

	
	gl_FragColor = vec4(color, 1.0);

}