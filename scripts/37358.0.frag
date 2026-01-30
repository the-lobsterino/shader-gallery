#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

vec2 rotate(vec2 point, float rads) {
	float cs = cos(rads);
	float sn = sin(rads);
	return point * mat2(cs, -sn, sn, cs);
}

bool star(vec2 p) {
	int i = (length(p) > 0.5) ? 1 : 0;
	int j = 0;
	for (float i=0.0; i<360.0; i+=72.0)
	{
		vec2 p0 = rotate(p.yx, radians(i)+0.2);
		if (p0.x > 0.1545) j++;
	}

	return (j < 2 && i < 1);
}


void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy ) ;
	
	position.x = position.x * resolution.x/resolution.y;
	position.x = abs( position.x -1. ) + .25;
	
	float ratio = resolution.x/resolution.y;
	
	float color=0.0;	
	float radius=0.1;
	
	vec2 origin = vec2(0.4,0.5);
	
	 
				if (star((position*1.25-vec2(1.-.18, 0.6+.11*sin(time*8.)))/0.3))
					color = 2.;
				else
					color = 0.;
			 
	
	
	if(pow((position.x+0.12-origin.x*ratio),2.0) + pow((position.y-.025*sin(time*8.)-origin.y),2.0) < pow(radius,0.8))
	{
	color+=1.0;
	}
	position *= 3.;
	position -= vec2(1.2,1.+.25*sin(time*8.));
	if(pow((position.x-origin.x*ratio),2.0) + pow((position.y-origin.y),2.0) < pow(radius,1.0))
	{
	color-=1.0;
	}	
	
	


	gl_FragColor = vec4( 1,color,color, 1.0 );

}