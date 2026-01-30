#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
/**hello I am blogdron I run challenge gogogogo ::) 
 **@participants : anonymous,blogdron,
 **/
void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy ) - mouse + 0.5;

	if(position.x >=0.475 && position.x <=0.525 && position.y >= 0.45 && position.y <=0.55)
        {
		gl_FragColor=vec4(1.0,0.7,0.5,1.0);
		if(position.x > 0.499 && position.x < 0.501 )
		{
			gl_FragColor=vec4(0.0,0.0,1.5,1.0);
		};
		if(position.y > 0.499 && position.y < 0.502 )
		{
			gl_FragColor=vec4(0.0,0.0,1.5,1.0);
		};
		/**
		** @blogdron
		** TODO:next step, optimize this and add cicrle for this AIM point like shooter game ::)
		** think of the next step and write it down as the task below, and also write your name or nickname at the top of the @participants
		**/
	};



}