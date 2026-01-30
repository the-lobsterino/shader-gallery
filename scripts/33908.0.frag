#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;


highp float rand(vec2 co)
{
    highp float a = 12.9898;
    highp float b = 78.233;
    highp float c = 43758.5453;
    highp float dt= dot(co.xy ,vec2(a,b));
    highp float sn= mod(dt,3.14);
    return fract(sin(sn) * c);
}

void main( void )
{
    vec2 position = (floor(gl_FragCoord.xy / 1.0) / resolution.xy );
    //float x = rand(vec2(cos(mouse.x * position.x),sin(time* position.y)));
    float x = gl_FragCoord.x / resolution.x;
    gl_FragColor = vec4(x,0.1,0.4,1.0);
}