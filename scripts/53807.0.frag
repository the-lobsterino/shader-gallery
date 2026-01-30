#ifdef GL_ES
precision mediump float;
#endif

//photo canvas shape calculator


//uniform fl
uniform vec2 resolution;
const float diameterx = 60.0;
const float diametery = 90.0;

void main( void ) {

	vec2 position = ((gl_FragCoord.xy / resolution.xy) * 2.0 - 1.0) * vec2(resolution.x / resolution.y, 1.0);
	vec2 apos = tan(position);
	
	float canvas = max(apos.x / diameterx, apos.y / diametery) * max(diameterx, diametery);
	      canvas = canvas > 0.9 ? 0.0 : 1.0;
	
	vec3 color = vec3(0.0);
	     color += canvas;

	gl_FragColor = vec4(color, 1.0 );

}