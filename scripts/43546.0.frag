// Meta Particle Ball
// By: Brandon Fogerty
// xdpixel.com

#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

vec3 particle( vec2 uv, vec2 offset )
{
     float t = pow( 1.0 / abs( (length(uv + offset)) * 30.0 ), 3.0);
     vec3 finalColor = vec3( 2.0 * t, 6.0 * t, 8.0 * t );
    
     return finalColor;
}

void main( void )
{

     vec2 uv = ( gl_FragCoord.xy / resolution.xy ) * 2.0 - 1.0;
     uv.x *= resolution.x / resolution.y;

     vec3 finalColor = vec3( 0.0 );
    
    
     float nt = time;
    
   //  finalColor += particle( uv, vec2( cos(nt) * 0.07, sin(-nt)*0.07 ) );
   //  finalColor += particle( uv, vec2( cos(-nt) * 0.15, sin(nt)*0.13 ) );
     finalColor += particle( uv, vec2( cos(-nt) * 0.09, sin(-nt)*0.16 ) );
    

     gl_FragColor = vec4( finalColor, 1.0 );

}