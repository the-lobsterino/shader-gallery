#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 pos = ( gl_FragCoord.xy / resolution.xy );
	float col = 0.0;
	
	pos.y-=0.5;
	
	if((pos.y<0.5 *sin(pos.x * 3.14 + time) + 0.005)&&(pos.y>0.5 *sin(pos.x * 3.14 + time) - 0.005))
		col = 1.0;
	else
		col = 0.0;
	
	gl_FragColor = vec4(col,0.0,0.0,1.0);

}