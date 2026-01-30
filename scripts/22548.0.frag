#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform sampler2D backbuffer;

void main( void ) {
	vec2 pixel = gl_FragCoord.xy/resolution.xy;
	vec3 color = vec3(pixel.yx,sin(time*0.3+length(pixel))+1.);
	vec2 q = pixel-vec2(0.5,0.5);
	//pixel.x = sin(time+10.*pixel.x);
	
	float size = sin(2.*time+length((pixel.xy-pixel.yx)*pow(pixel, vec2(-0.5)))*8.)/100.;
	color += smoothstep(size,size+0.001,abs(q.x)*abs(q.y));
	gl_FragColor = vec4(1.-color,1.0);
	
	gl_FragColor *= 4./128.;
	gl_FragColor += (124./128.) * texture2D( backbuffer, pixel );
	gl_FragColor += 0.03;
}