// sample code from shadertoy; 
// Modified by Gigatron Amiga Rules !   ---  Just need a Sinusscroll and a bounceing logo and you got a Amiga Cracktro
#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main()
{
	float x = gl_FragCoord.x;
    vec2 p = gl_FragCoord.xy / resolution.xy;
	vec2 c = p - vec2(0.25, 0.5);
    
    
    
        
  
  
    //Another amiga/atari copper fx 
    	
    float coppers = -time*5.0;
    float rep = 64.;// try 8 16 32 64 128 256 ...
    vec3 col2 = vec3(0.5 + 0.5 * sin(x/rep + 3.14 + coppers), 0.5 + 0.5 * cos (x/rep + coppers), 0.5 + 0.5 * sin (x/rep + coppers));
    vec3 col3 = vec3(0.5 + 0.5 * sin(x/rep + 3.14 - coppers), 0.5 + 0.5 * cos (x/rep -coppers), 0.5 + 0.5 * sin (x/rep - coppers));	
    
	if ( p.y > 0.1 && p.y < 0.106 ) gl_FragColor = vec4 ( col2, 1.0 );
   
   	if ( p.y > 0.9 && p.y < 0.906 ) gl_FragColor = vec4 ( col3, 1.0 );
   
   
}
 