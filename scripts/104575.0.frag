#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define rot( a ) mat2(cos(a), sin(a), -sin(a), cos(a))
#define calcLine( a ) smoothstep( 0.1, ( mod( a, .5 ) - .25 ), 0.21 )
#define PI 3.1415926



void main( void ) {

    vec2 position = ( gl_FragCoord.xy / resolution.xy );

    position = (position - .5) * 2.;

    position.x *= resolution.x / resolution.y;

    vec3 col = vec3( 0.66, 0.80, 0.89 );
    
    float p = 0.1;
    
    position *= 1.2;
    
    float a = position.x + position.y;
    
    for( float i = 0.; i < 5.; i++ ){
        
        float g = 0.;
        
        a += sin( i * position.x - time ) * .05;
        a += cos( i * position.x * position.y - time ) * .05;
    }
    
    p = (calcLine( a ));
    
    position.x /= 1.1;
    position *= rot( PI * -.1 );
    a = position.x + position.y;
    
    for( float i = 0.; i < 5.; i++ ){
        
        float g = 0.;
        
        a += sin( i * position.x - time ) * .05 ;
        a += cos( i * position.x * position.y + time ) * .05;
    }
    
    p = mix(
        p,
        .1,
        (calcLine( a ))
    );
    
    
    col += p;  
    gl_FragColor = vec4( col, 1.0 );
}