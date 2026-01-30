#ifdef GL_ES
precision mediump float;
#endif
// this project contains my favourite poem

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;



vec3 light = vec3(1.7,1.1,0.7);
float radius = 2.1;

void main( void ) {
	
	    // Normalized pixel coordinates (from 0 to 1)
    vec2 uv =  (-resolution.xy + 3.0*gl_FragCoord.xy)/resolution.y;
	
    
    //This is the supposed to be Input 
    float timer= 0.2 + 0.02*abs(sin(time));


    float factor1 = pow(length(uv) / timer * radius, 2.0*timer);

	
    vec3 col = vec3(0.0);
    if(factor1 <= 1.0)
    {
        col = mix(light,light, factor1);
    }
    else
    {
        col = mix(light, col, 0.54*(factor1 - 1.0));
    }
	
 
    // Output to screen
    gl_FragColor = vec4(col,1.0);
	
	 vec2 uv2 =  (-resolution.xy + 2.0*gl_FragCoord.xy)/resolution.y;
	
    
    //This is the supposed to be Input 
    //float timer= 0.2 + 0.1*abs(sin(time));


    float factor2 = pow(length(uv2) / timer * radius, 2.0*timer);

	
    //vec3 col = vec3(0.0);
    if(factor2 <= 1.0)
    {
        col = mix(light,light, factor1);
    }
    else
    {
        col = mix(light, col, 0.54*(factor2 - 1.0));
    }
	
 
    // Output to screen
    gl_FragColor = vec4(col,1.0);


}