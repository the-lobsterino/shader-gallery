#ifdef GL_ES
precision highp float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {
	const float div = 10.0;
	vec2 p = ( gl_FragCoord.xy / resolution.xy);
	
	vec3 color = vec3(0.0);
	float c;
	float x = (floor(p.x * div))/ (div - 1.0);
	if(p.y > 0.5) {
		c = x;
	} else {
		c = pow(x,  1.0 / 2.2);
	}

	if(abs(mod(p.y, 0.5) - 0.5) < 0.001 || abs(mod(p.x, 1.0 / div) - (1.0 / div)) < 0.001) {
		color.rgb = vec3(0.1, 0.3, 0.1);
	} else {
		color.rgb = vec3(c);
	}

	gl_FragColor = vec4( color, 1.0 );

}
