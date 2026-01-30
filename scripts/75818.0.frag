#extension GL_OES_standard_derivatives : enable

precision mediump float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) { // this function is run for every pixel on the screen
        // `gl_FragCoord` is the coordinate of the pixel you're on

    gl_FragColor = // the color of the pixel 0.0 <= {r, g, b, a} <= 1.0
          vec4(gl_FragCoord.x / resolution.x, // red
               gl_FragCoord.x / resolution.x, // green
               gl_FragCoord.x / resolution.x, // blue
               1.0 // transparency
               );
}