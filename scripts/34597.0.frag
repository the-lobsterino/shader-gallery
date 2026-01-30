
precision mediump float;
uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

mat2 rotate = mat2(cos(time * 0.027), -sin(time + 0.027), sin(time+ 0.027), cos(time* 0.027));

void main( void ) {
	vec2 aspect = resolution.xy / min(resolution.x, resolution.y);
	vec2 position = (gl_FragCoord.xy / resolution.xy) * aspect;
	vec2 center = 0.5 * aspect;
	vec3 color = vec3(0.0);
	
	position *= rotate;
	center *= rotate;
	
	vec2 next = vec2(0.27, 0.27) * rotate;
	
	
	for(int i = 54; i > 0; i--) {
		next *= rotate;
		if(distance(position, center + next) < 0.027 + float(i) * 0.0027) {
			color = vec3(sin(time + float(i)), sin(time + 2.7 + float(i)), sin(time + 4.08 + float(i)));
		}
	}
	
	gl_FragColor = vec4(color, 1.0 );

}