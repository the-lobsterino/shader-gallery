#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy-vec2(0,0) ) ;

	float color = 0.8;
	float tall = 0.02;
	float originX=0.5+sin(time)*0.5;
	float originY=0.5+sin(time*0.5)*0.5;
	
	if(position.x>originX-tall 
	   && position.x<originX+tall
	   && position.y>originY-tall
	   &&position.y<originY+tall)
	{
	
		color=sin(time);
	
	}


	gl_FragColor = vec4( color,color,color,1.0 );

}