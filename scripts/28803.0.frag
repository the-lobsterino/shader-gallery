#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 resolution;

void main( void ) {

    vec2 pos = ( gl_FragCoord.xy / resolution.xy );
  
    float r = (pos.x);
    float f = (pos.y);

    float a = .1;
    float b = .5;
  
    float color = pow( r, r * a + b );
    color = 1.0 - smoothstep( color * f * r, color, f );
   
    gl_FragColor = vec4( vec3(color,color,color), 1.0 );

}
