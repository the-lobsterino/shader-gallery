#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 resolution;

void main( void ) {
	
	float t = sin(time);
	vec2 toSend = vec2(gl_FragCoord.x*t,gl_FragCoord.y);
	float joke = fract(cos(dot(toSend.xy,vec2(12.9898,78.233)))*43758.5453);
	gl_FragColor = vec4(joke);

}

/*float rand(vec2 co)
{
	return fract(sin(dot(co.xy,vec2(12.9898,78.233)))*43758.5453);
}*/