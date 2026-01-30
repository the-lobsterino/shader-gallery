#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 resolution;

void main( void ) {
	vec2 pos = gl_FragCoord.xy / resolution.xy;
	pos.y -= 0.3;
	vec3 c = vec3(0,0,0);
	c = mix(vec3(0,1,1), vec3(0,0.1,0.1), pos.y);
	float v = sin((pos.x + time*0.2) * 5.0)*0.05 + sin((pos.x * 3.0+ time*0.1) * 5.0)*0.05;
	if(pos.y < v){
		c = mix(c, vec3(0,0.5,0.5), 0.2);
	}
	v = sin((pos.x + time*0.1) * 5.0)*0.05 + sin((pos.x * 3.0+ time*0.05) * 5.0)*0.05;
	if(pos.y < v){
		c = mix(c, vec3(0,0.5,0.5), 0.2);
	}
	gl_FragColor = vec4(c, 2.0);

}