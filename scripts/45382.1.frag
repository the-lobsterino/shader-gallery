//zeletochoy from ST

// gigatron for glslsandbox
#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

#define KEYS 10.
#define OFFSET 0.

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float dist_to_unit(float x)
{
    float f = fract(x );
    return min(f, 1.0 - f);
}


void main(void) {

	vec2 uv = gl_FragCoord.xy/resolution.xy;
	
	uv.y = uv.y+time/20.; // OR uv.x
	
	uv = fract(uv*4.);// 4 syntesizer
    
    vec3 col = vec3(0.9,sin(time),0.0);
    col *= smoothstep(0., 0.03, uv.y - 0.2);
    
    if (uv.y < 0.70  )
    {
        col = vec3(smoothstep(0., 0.08, dist_to_unit(uv.x * KEYS)));
        int widx = int(uv.x * KEYS);
        col *= 1. - 0.2  ;
	    
	 	    
        col *= smoothstep(0., 0.08, uv.y  );
      
	   
	     float key_idx = mod(3.0+floor((uv.x+0.56)*10.0 ) , 7.);  
       
	    if (uv.y >= 0.28  && key_idx != 0.0 + OFFSET && key_idx != 3. + OFFSET)
        {
             col *= smoothstep(0.3, 0.33, dist_to_unit(uv.x * KEYS));
             col = vec3(max(col.x, 0.08  ));
				  
        }
	   
    }
     
	
    // Output to screen
    gl_FragColor = vec4(col, 1.0);

}