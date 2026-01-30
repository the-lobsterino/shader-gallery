// by 834144373
//specular light
#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 pos = ( gl_FragCoord.xy / resolution.xy );// + mouse / 4.0;

	pos = pos*2. -vec2(1.);
	
	pos.y = fract(pos.y*5.);
	
	pos.y +=(-0.4+0.4*sin(time));
	pos.x +=(0.4+ 0.4*cos(time));
	
	
	float d =1.1 - length(pos);
	
	vec3 color = vec3(0.12,0.55,0.4);
	
	color *= d;
	
	gl_FragColor = vec4(color , 1.0 );

}