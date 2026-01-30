#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif

uniform vec2 resolution;
uniform float time;

void main( void )
{
vec2 uv = gl_FragCoord.xy/resolution.xy;

gl_FragColor = tan(vec4(uv,1,.1)) * sin(vec4(uv,1,.1)*time ) * sin(vec4(1,2,5,1));
}
 