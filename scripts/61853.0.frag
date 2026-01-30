#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float dv = 32.0;

void main( void ) {

	 vec2 uv =  gl_FragCoord.xy/resolution.xy;
   
	float c = floor( uv.y*dv)/dv  ;
    
    if(uv.y<0.50) 
 
    gl_FragColor = vec4(c, c, 1.0,1.0);
    
    else
        uv.y = 1.-uv.y;
        c = floor( uv.y*dv)/dv  ;
    
    gl_FragColor = vec4(c, c, 0.0,1.0);
}