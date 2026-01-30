#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;



void main( void ) {

	vec2 uv = gl_FragCoord.xy/resolution;
		
	vec3 color;
	color.r = sin(uv.x*5.+0.+time*25.);
	color.g = sin(uv.x*5.-2.0-time*25.);
	color.b = sin(uv.x*5.-4.+time*25.);
	
	gl_FragColor = vec4(color,1.);

}