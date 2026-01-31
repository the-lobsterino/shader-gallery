#ifdef GL_ES
precision mediump float;
#endif


uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;


vec3 eye(float c){
	float r = exp2(-pow(c, 2.0)) * 0.9 + exp2(-pow((c + 3.0) * 2.0, 2.0)) * 0.3;
	float g = exp2(-pow((c + 1.0),2.0));
	float b = exp2(-pow((c + 2.145) * 1.1, 2.0));
	
	return vec3(r, g, b);
}

void main( void ) {

	vec2 position = gl_FragCoord.xy / resolution.xy;

	vec3 color = vec3(0.0);
	     color = eye(position.x * 10.0 - 6.0);
	float d = distance(gl_FragCoord.xy, mouse * resolution);
	if (d > 100.0) {
		gl_FragColor = vec4( color*0.5, 1.0 );
	} else if (d > 98.0) {		
		gl_FragColor = vec4( color*9., 1.0 );
	} else {
		gl_FragColor = vec4(color, 1.0 );	
	}
	//gl_FragColor = vec4(color, 1.0 );

}