#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 resolution;

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy ) - 0.5;
	vec3 col = vec3(0.0,0.0,0.0);
	
	for(int i = 0; i < 1; i++){
		float red = 0.01  / abs(length(position +  float(i) * 0.1)  - 1.0 * abs(sin(time))) ;
		col.r += red;
	}
	
	col.g = abs(cos(time));
	col.b = abs(sin(time));

	gl_FragColor = vec4( col , 1.0 );

}