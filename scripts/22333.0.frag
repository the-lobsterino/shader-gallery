precision mediump float;
uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main()
{
    vec2 pos = (gl_FragCoord.xy / resolution.xy);
}
