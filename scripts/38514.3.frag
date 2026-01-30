// gigatron copper bg 2017;
#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 p = gl_FragCoord.xy/resolution.xy;
 
	float f = 0.;
	
	    

	vec3 col = vec3(0.0,0.0,0.0);
	
 	float t = mod(time/10.0,1.0);// better now
    
        int copst = int(floor(1.+t *10. )); // int 0 1 2 3 4 5 6 7 8 9 
	
	f = smoothstep( -1.5, 1.50, sin( p.y*float(copst*8) + time*4.) );
	
	
	if (copst == 1) col = mix( vec3(0.0,0.0,0.0), vec3(1.0,0.0,0.0), f );
        if (copst == 2) col = mix( vec3(0.0,0.0,0.0), vec3(0.0,1.0,0.0), f );
	if (copst == 3) col = mix( vec3(0.0,0.0,0.0), vec3(0.0,0.0,1.0), f );
        if (copst == 4) col = mix( vec3(0.0,0.0,0.0), vec3(1.0,1.0,0.0), f );
	if (copst == 5) col = mix( vec3(0.0,0.0,0.0), vec3(0.0,1.0,1.0), f );
        if (copst == 6) col = mix( vec3(0.0,0.0,0.0), vec3(1.0,0.0,1.0), f );
	if (copst == 7) col = mix( vec3(0.0,0.0,0.0), vec3(1.0,1.0,1.0), f );
	
	if (copst == 8) col = mix( vec3(0.0,0.0,0.0), vec3(1.0,0.5,0.0), f );
        if (copst == 9) col = mix( vec3(0.0,0.0,0.0), vec3(0.0,1.0,0.5), f );
	if (copst == 10) col = mix( vec3(0.0,0.0,0.0), vec3(1.0,0.5,0.5), f );
     	 
	
	gl_FragColor = vec4(  col , 1.0 );

}