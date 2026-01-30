precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {
    vec2 uv = gl_FragCoord.xy/resolution.xy;

    // Time varying pixel color
    vec3 col = 0.5 + 0.5*cos(time+uv.xyx * 2.+vec3(0,2,4));

    // Output to screen
    gl_FragColor = vec4(col,1.0);
}