
precision mediump float;

uniform float time;
uniform vec2 resolution;
uniform vec2 mouse;
varying vec2 surfacePosition;
#define ITERATIONS 300

void main( void ) {
	
	vec3 color = vec3(0.0,0.0,0.0);
	vec2 p_pos = ( gl_FragCoord.xy / resolution.xy ) * 2.0 - 1.0;
	p_pos.x *= (resolution.x / resolution.y);
	int n = 10;
	vec3 light_color = vec3(0.8, 0.5, 0.1); // RGB, proportional values, higher increases intensity
	
	for(int i = 0; i < ITERATIONS; i++){
		float phase = mouse.x * 180.0 * float(i)/float(ITERATIONS);
		vec2 pos = vec2(sin(time + phase), float(i)/float(ITERATIONS) * 2.0 - 1.0);
		pos.y *= p_pos.y;
		vec2 diff = abs(pos - p_pos);
		float dist = diff.x * diff.x + diff.y * diff.y;
		float c = 0.0005/dist;
	
	
		light_color.r *= sin(p_pos.x);
		light_color.b += sin(.6 * p_pos.x * light_color.r);
		light_color.g += sin(.8 * p_pos.x -0.1 * light_color.b);
		color += vec3(c * light_color * ( 5. * p_pos.y));
		
	
	}
	
		
	
	
	gl_FragColor = vec4(color, 1.0 );

}