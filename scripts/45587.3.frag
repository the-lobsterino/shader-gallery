#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {
	
	float t = time * 0.1;

	vec2 position = ( gl_FragCoord.xy / resolution.xy ) - vec2(0.5, 0.0);
	     position /= -(position.y) + 0.8;
	     position *= 20.0;
	     vec2 horizon = position.xy;
	
             //position *= mat2(cos(-t), -sin(-t), sin(-t), cos(-t)) ;
	      position.x =position.x+time*18.;
	     
	
	vec3 color = vec3(2.-floor(1.+length(cos(position.xy)*2.0+2.*sin(time))));
	     color *= horizon.y < 0.0 ? 0.0 : 1.0;
		horizon.y -= 5.+position.y;
	    
		color += horizon.y > 0.0 ? 0.0 : 1.0;
	 	color *= pow(vec3(0.1, 0.7, 0.9), vec3(length(horizon.xy)) * 0.1);
	  
	
	
	    

	gl_FragColor = vec4(color, 1.0 );

}