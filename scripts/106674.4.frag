#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform vec2 mouse;
uniform vec2 resolution;

vec4 gridColor = vec4(1., 1., 0.5, 1.);
vec2 gridSize = vec2(50., 50.);

void main( void ) {
    vec2 position = mouse / resolution;
    float fromMouse = distance(gl_FragCoord.xy, position.xy);
    if ((mod(gl_FragCoord.x, gridSize[0]) < 1. ||
         mod(gl_FragCoord.y, gridSize[1]) < 1.) &&
	fromMouse < 300.) {
          gl_FragColor = gridColor * fromMouse / 100.;
    } else {
        gl_FragColor = vec4(0.);
    }
}