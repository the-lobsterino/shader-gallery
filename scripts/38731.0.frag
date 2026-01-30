#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 resolution;

void main( void ) {
    vec2 position = ( gl_FragCoord.xy / resolution.xy );
    position = 2.0 * position - 1.0;
    position.x *= resolution.x / resolution.y;

    float color = 0.0;
    float d = length(position);
    d = distance(position, vec2(0,0));
    color = d;
    gl_FragColor = vec4( color, color, color, 1 );
}