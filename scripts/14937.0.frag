#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float rand(vec2 co) {
	return fract(sin(dot(co.xy ,vec2(12.9898, 78.233))) * 43758.5453);
}

void main( void ) {


	float white = rand(gl_FragCoord.xy * vec2(time, time));
	
	vec4 color = vec4(white, white, white, 1.0);
 
	color *= mix(1.0, 0.8, sin(gl_FragCoord.y * 900.0 + time));
	color *= smoothstep(0.0, 1.0, distance(gl_FragCoord.xy, vec2(0.5, 0.5)));
 
	color *= mix(1.0, 0.93, rand(vec2(time, tan(time))));
 
	// Restore alpha
	color.a = 1.0;
 
	gl_FragColor = color;
}
