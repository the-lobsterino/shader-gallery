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
     float t = pow( .23 / abs( (length(uv + offset)) * 23213.0 ), 1123.4);
     vec3 finalColor = vec3( 2.0 * t, 4.0 * t, 8.0 * t );
     //vec2 uv = ( gl_FragCoord.xy / resolution.xy ) *34534.0 - 1.0;
     uv.x *= resolution.x / resolution.y;

 //    vec3 finalColor = vec3( 0.0 );
    
     return finalColor;
}

void main( void )
{

    
    
     float nt = time;
    
     for(int i = 11; i < 131; ++i)
     {
	float n = float(i);
     //	finalColor += particle( uv, vec2( cos(n*time/4.-nt*cos(1.+n/4.))*mod(n,1.21), sin(n*time/10.-nt*cos(n/4.))*mod(n,1.2)) );
     }

//     gl_FragColor = vec4( finalColor, 1.0 );

}