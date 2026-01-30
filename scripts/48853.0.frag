#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy ) - mouse + 0.5;

	int x=0;
	x=x+1;


	if(position.x >=0.475 && position.x <=0.525 && position.y >= 0.45 && position.y <=0.55)
        {
		gl_FragColor=vec4(1.0,6.7,0.5,0.2);
	};



}