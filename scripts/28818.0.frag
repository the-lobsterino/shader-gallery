// Glowing Line

// Original by:
// Brandon Fogerty
// xdpixel.com


#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;


void main( void )
{

     vec2 uv = ( gl_FragCoord.xy / resolution.xy ) * 2.0 - 1.0;
     uv.x *= (resolution.x * (sin(time))) / resolution.y;

     vec3 finalColor = vec3( 0.0 );
    
    
     float t = .0126 / abs( uv.x + 2.0*sin(uv.y + 2.0*time*100.)*(0.3 + sin(time*100.) * 0.444));
     finalColor = vec3( 8.0 * t, 4.0 * t, 2.0 * t );
    

     gl_FragColor = vec4( finalColor, 1.0 );

}