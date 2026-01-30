#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;


//Make the screen red

void main( void ) {

    vec2 position = mouse.xy;

    vec3 color = vec3(vec2(1.0),(mouse.xy));

    gl_FragColor = vec4(color, 0.0 );
}