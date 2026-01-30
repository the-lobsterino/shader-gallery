#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 resolution;

float pi = 3.14;
float halfPi = pi / 2.;
float twoPi = pi * 2.;

void main( void ) {
	vec2 pos = gl_FragCoord.xy / resolution.xy;
	float localTime = time * 1.;
	
	pos.y -= 0.18;
	
	vec3 c = vec3(0,1,1);
	
	c = mix(vec3(0,1,1), vec3(0,0,0), pos.y);

	float v;

	v = sin(pos.x * (1.8 * twoPi) + localTime / 5. + twoPi / 16.) / 26. + 0.19;
	if(pos.y < v){
		c = mix(c, vec3(0,0.5,0.5), 0.05);
	}

	
	v = sin(pos.x * (1.6 * twoPi) + localTime / 4. + twoPi / 8.) / 20. + 0.17;
	if(pos.y < v){
		c = mix(c, vec3(0,0.5,0.5), 0.1);
	}

	
	v = sin(pos.x * (1.4 * twoPi) + localTime / 3. + twoPi / 4.) / 15. + 0.14;
	if(pos.y < v){
		c = mix(c, vec3(0,0.5,0.5), 0.15);
	}

	v = sin(pos.x * (1.2 * twoPi) + localTime / 2. + twoPi / 2.) / 11. + 0.08;
	if(pos.y < v){
		c = mix(c, vec3(0,0.5,0.5), 0.2);
	}

	v = sin(pos.x * (1.0 * twoPi) + localTime + pi) / 8.;
	if(pos.y < v){
		c = mix(c, vec3(0,0.5,0.5), 0.25);
	}

	gl_FragColor = vec4(c, 1.0);
}