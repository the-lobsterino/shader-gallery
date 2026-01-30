#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform sampler2D texture; 
varying vec2 vTexCoord;

void main( void ) {
	
  vec2 texelSize = vec2(1.0);
    vec4 color = vec4(0.0);

    for (float x = -4.0; x <= 4.0; x += 1.0) {
        for (float y = -4.0; y <= 4.0; y += 1.0) {
            vec2 offset = vec2(x, y) * texelSize * 4.0; 
            
        }
    }

    color /= 81.0;
    gl_FragColor = color;


}