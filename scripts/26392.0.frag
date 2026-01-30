#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

vec3 tex(vec2 uv, vec3 col1, vec3 col2)
{
	return (mod(floor(uv.x) + floor(uv.y), 2.0)==0.0?col1:col2);	
}

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy / mouse.x - mouse.y ) - vec2(0.5, 0.5); position.x *= resolution.x/resolution.y;
	vec2 uv = position*5.0;
	//uv.x += sin(length(uv+time))*(sin(time*2.0)+1.0)*0.5;
	//uv.y += cos(length(uv+time))*0.4;
	
	uv /= (1.01+cos(time+.2*length(uv)));
	
	gl_FragColor = vec4(tex(uv, vec3(.88), vec3(.12)), 1.0 );

}