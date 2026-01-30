#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 pos = ( gl_FragCoord.xy );
	vec3 color = vec3(1.0,1.0,1.0);
	
	
		if(distance(pos, resolution/2.0)> 200.0  )  {
	    	color.x = 0.0*abs(pos.y-mouse.y)/resolution.y;
            
        }
		if(distance(pos, resolution/2.0)< 200.0  )  {
	    	color.x = 1.0;
           
        }
		
	
	
	gl_FragColor = vec4( color, 1.0 );

}