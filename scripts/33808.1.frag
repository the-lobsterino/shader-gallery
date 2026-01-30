#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

highp float rand(highp vec2 co)
{
    highp float returnVal = fract(sin(dot(co.xy ,vec2(12.9898,78.233))+ mod(100.0,time)) * 43758.5453 );
	return returnVal;
}


void main( void )
{
    vec2 position = ( gl_FragCoord.xy / resolution.xy );
    float x = 0.7*rand(position)+0.2;
    gl_FragColor = vec4( x,x,x,1.0);
}