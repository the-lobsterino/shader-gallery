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

     vec2 uv = ( gl_FragCoord.xy / resolution.xy ) * 2.0 - 1.0;
     uv.x *= resolution.x / resolution.y;

     //vec3 finalColor = vec3( 0.0 );
    
    
     float t = pow( 1.0 / abs( (uv.y ) * 60.0 ), 1.8);
     //finalColor = vec3( 10.0 * t, 4.0 * t, 10.0 * t );
    
     //gl_FragColor = vec4( finalColor, 1.0 );

     vec4 finalColor = vec4( 0.0, 10.0, 0.0, 10.0 );
     gl_FragColor =  finalColor * t;
}