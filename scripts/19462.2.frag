#ifdef GL_ES
precision mediump float;
#endif
//www.trilor.com logo concept
//c64cosmin@gmail.com
uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy )-vec2(0.5,0.5);

	vec3 color = vec3(0.0);
	float detail=7.0;
	float r=cos( position.y*detail+time);
	float g=cos((position.x-position.y*0.5)*detail+time);
	float b=cos((position.x+position.y*0.5)*detail-time);
	float p1=-0.3;
	float p2=-0.3;
	vec3 tex=vec3(r+p1*g+p2*b,
		      g+p1*b+p2*r,
		      b+p1*r+p2*g);
	
	if(position.x-position.y*0.5+0.25>0.0&&
	   position.x+position.y*0.5+0.75<1.0&&
	   position.y+0.5>0.25)color=tex;

	gl_FragColor = vec4( color , 1.0 );

}