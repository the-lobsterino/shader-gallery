#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy );

	float p=1.0;
	
	if(position.y<0.5)
	{
	  p=0.0;
	}
	
        float i = 1.0;
	if(position.x<0.3||position.x>0.7||position.y<0.2||position.y>0.8)
	{
	 i=0.1;	
	}
	
	gl_FragColor.gb = vec2(p*i,p*i);
	gl_FragColor.ra = vec2(i,i);

}