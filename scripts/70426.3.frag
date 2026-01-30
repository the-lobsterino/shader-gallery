#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {
	vec2 pos = ( gl_FragCoord.xy / resolution.xy ) * 2. - 1.;
	pos.x *= resolution.x/resolution.y;
	pos *= 1.2;
	
	vec2 c = (mouse.xy * 2. - 1.);
	
	//julia set where uv is z and mousepos is c
	int iteration = 0;
	
	vec2 z = pos.xy;
	
	for (int i = 0; i < 100; i++){
	float xtemp = z.x * z.x - z.y * z.y;
       	z.y = 2. * z.x * z.y  + c.y;
        z.x = xtemp + c.x;
    
        iteration += 1;
	if(z.x * z.x + z.y * z.y > 2.){break;}
	}
		
	float color = 1.-float(iteration/30);
	gl_FragColor = vec4( vec3(color), 1.0 );
}