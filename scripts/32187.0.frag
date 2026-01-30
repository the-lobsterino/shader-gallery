#ifdef GL_ES
precision highp float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;


// http://www.youi.tv/mobile-gpu-floating-point-accuracy-variances/
void main() {
        float x = ( 1.0 - ( gl_FragCoord.x / resolution.x ));
        float y = ( gl_FragCoord.y / resolution.y ) * 26.0;
        float yp = pow( 2.0, floor(y) );
        float fade = fract( yp + fract(x) );
        if(fract(y) < 0.9)
            gl_FragColor = vec4( vec3( fade ), 1.0 );
      else
            gl_FragColor = vec4( 0.0 );	
}