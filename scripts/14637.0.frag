#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 resolution;
uniform vec2 mouse;

void main ( void ){
	
	vec2 pos = gl_FragCoord.xy / resolution.xy;
	
	float angled = pos.x - pos.y + 10.;
	float a = mod (cos(angled*4.0), -sin(angled*4.0)) ;
	a *= a;
	
	gl_FragColor = vec4(vec3(a),1.0);	
		
}
