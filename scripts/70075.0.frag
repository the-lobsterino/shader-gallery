#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

vec2 center = vec2(0,0);
vec3 col1 = vec3(0.0,0.8,.0);
vec3 col2 = vec3(0.0,0.8,.0);
float radius = 2.;

void main( void ) {
	
	    // Normalized pixel coordinates (from 0 to 1)
    vec2 uv =  (-resolution.xy + 2.0*gl_FragCoord.xy)/resolution.y;
    
    //This is the supposed to be Input
    float timer = 0.2 + 0.8*abs(sin(time));

    float factor = pow(length(uv - center) / timer * radius, 3.0*timer);
    
    vec3 col = vec3(0.0);
    if(factor <= 1.0)
    {
        col = mix(col1, col2, factor);
    }
    else
    {
        col = mix(col2, col, 0.5*(factor - 1.0));
    }

    // Output to screen
    gl_FragColor = vec4(col,1.0);

}