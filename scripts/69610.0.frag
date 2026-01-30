#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 resolution;
uniform sampler2D texture;

void main( void ) {


	vec2 uv = gl_FragCoord.xy / resolution.xy;
	    
	uv.x += sin(time);
	uv.y += cos(time);
	    
	uv.x += cos(uv.x * 10.0 + time) * 0.3;
	uv.y += sin(uv.y * 5.0 + uv.x * 4.0 + time * 1.3) * 0.4;

	gl_FragColor = texture2D(texture, uv);
}
