#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float u_time;
vec2 v_uv;

void main( void ) {
    vec2 uv = v_uv;
    // Zooms out by a factor of 2.0
    uv *= 2.0;
    // Shifts every axis by -1.0
    uv -= 1.0;

    // Base color for the effect
    vec3 finalColor = vec3 ( .2, 1., 0. );

    finalColor *= abs(0.05 / (sin( uv.x + sin(uv.y+u_time)* 0.3 ) * 20.0) );

    gl_FragColor = vec4( finalColor, 1.0 );    
}