#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy ) * vec2(10);

	bool shade = false;	
	
	shade = (log(position.y) / log(1.2229)) > position.x;
	
	if(position.x > 7.5 && position.y > 7.5){
		shade = false;
		
		shade = sqrt(pow(distance(8.5, position.x), 2.0) + distance(8.5, position.y)) > 1.0;
	}
	
	if(shade)
		gl_FragColor = vec4(1,1,1,1);
	else
		gl_FragColor = vec4(0,0,0,1);
}