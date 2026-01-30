// Glowing Line
// By: Brandon Fogerty
// xdpixel.com

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 mouse;
uniform vec2 resolution;
uniform float time;


void main( void )
{

     vec2 uv = ( gl_FragCoord.xy / resolution.xy ) * 2.0 - 0.5;
     uv.x *= resolution.x / resolution.y;
      
    
    
    
     float t = pow( 1.0 / abs( (uv.x-1.0 ) * 20.0), 2.1+cos(time*2.));
	   t *=pow( 0.2 / abs( (uv.y-.5 ) * 10.0), 2.1+cos(time*2.));
    vec3   finalColor = vec3( 10.0 * t, 4.0 * t, 10.0 * t );
    
    
     gl_FragColor =  vec4(finalColor * t,1.0);
	 
}