#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
const float s = 10.0;
void main( void ) {

	vec2 p = gl_FragCoord.xy ;
	vec2 r = resolution.xy;
	float w = r.x/r.y;
	
	for(float x = 0.0; x < s; x++){	
		for(float y = 0.0; y < s; y++){
			for(float z = 0.0; z < s; z++){
				float nz = z/s*r.x*0.3-100.0;
				float nx = x/s*r.x*0.3-100.0;
				float ny = y/s*r.y*0.3*w-100.0;
				//nx = x*10.0 + 10.0;
				//ny = y*10.0 + 110.0;
				
				ny = ny * cos(time*0.25) - nz * sin(time*0.25);
	    			nz = ny * sin(time*0.25) + nx * cos(time*0.25);
				//nx = ny*cos(time*0.25)+ny*sin(time*0.25);
				ny +=  r.y * 0.5;
				nx +=  r.x * 0.5;
				
				
				if((nz > p.x - 1.0 && nz < p.x + 1.0) || (nx > p.x - 1.0 && nx < p.x + 1.0) || (ny > p.y - 1.0 && ny < p.y + 1.0)){
					gl_FragColor = vec4(1.0/(z/s), 0.0, z/s, 1.0 );	
				}
				else {
					//gl_FragColor = vec4(1.0, 1.0, 0.9, 1.0 );	
				}
			}
		}
	}	

}