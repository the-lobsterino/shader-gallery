#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 resolution;

void main ( void ) {
    vec2 uv = ( gl_FragCoord . xy - resolution * 0.5 ) / max ( resolution . x , resolution . y ) * 4.0 ;
	
    float e = 0.0 ;
    vec3 col_0 = vec3 ( 5. , 1.0 , 0.0 ) ;
    vec3 col_1 = vec3 ( 1.0 , 0.0 , 0.0 ) ;
    for ( float i = 1.0 ; i <= 9.0 ; i+= 1.0 ) {
	float val = 0.3 + 0.07 * i - sqrt ( uv . x * uv . x + uv . y * uv . y - 0.13 * ( 1.0 + sin ( time ) ) )  ; 
        e = 0.007 / abs ( val ) * ( i + 10.0 ) / 20.0 ;
	gl_FragColor = max ( gl_FragColor , vec4 ( mix ( col_0 , col_1 , ( i - 1.0 ) / 8.0 ) * e , 1.0 ) ) ;	
	}
	
    }