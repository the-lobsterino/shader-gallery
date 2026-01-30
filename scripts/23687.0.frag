#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float rand(vec2 co){
    return fract(sin(dot(co.xy ,vec2((sin(time)*4.0)+12.0,78.233))) * 43758.5453);
}
void main( void ) {
	vec2 uv = ( gl_FragCoord.xy / resolution.xy );
	gl_FragColor = vec4( rand(uv.xy), rand(uv.xy), rand(uv.xy), 1.0 );
}
