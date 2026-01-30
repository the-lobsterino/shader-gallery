#ifdef GL_ES
precision lowp float;
#endif

uniform float time;

void main() {
	
	vec4 color2;
	vec2 fragmentPosition = gl_FragCoord.xy;

	/*vec4 color2 = vec4((cos(fragmentPosition.x * 15.0 + time) + 15.0) * 0.3,
				 (cos(fragmentPosition.y * 15.0 + time) + 15.0) * 0.3,
				 (sin(fragmentPosition.x * 15.0 + time) + 15.0) * 0.3, 1);

*/
	

	//Trippy
	color2 = vec4(cos(fragmentPosition.y/fragmentPosition.y*time),tan(fragmentPosition.x/fragmentPosition.y *time),sin(fragmentPosition.y/fragmentPosition.x*time), 1.0);
	
	gl_FragColor = color2;
}