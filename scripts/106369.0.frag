#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 resolution;

float radius = .1;
float grid_size = 5.;
float speed = .1;

float pattern(in vec2 coord, in float speed){
	// uncoment for movement
	//coord += time * speed;
	// coord.y += time * 2. * speed;
	
	vec2 fractal = fract(coord);
	vec2 fractal_in_middle = .3 -fractal;
	float min_dist = min(length(fractal_in_middle), .1);
	
	return smoothstep(radius, min_dist, 1.);
}

void main( void ) {

	// keep the aspect ratio in mind (so the circles look like circles)
	vec2 uv = (gl_FragCoord.xy-resolution.xy)/min(resolution.x,resolution.y); 

   uv *= grid_size;      // Scale up the space


    vec3 color = vec3(pattern(uv, speed));

	gl_FragColor = vec4(color,1);

}