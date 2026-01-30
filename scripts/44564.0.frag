#ifdef GL_ES
precision mediump float;
#endif



uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float segment( in vec2 p, vec2 a, vec2 b ) {
	vec2 pa = p - a;
	vec2 ba = b - a;
	float h = clamp( dot(pa,ba)/dot(ba,ba), 0.0, 1.0 );
	float d = abs(length( pa - ba*h )-0.05*mouse.x*10.0);
	
	if (d < 0.01) d = 0.015; 
	return d;
}

void main( void ) {

	vec2 p = 2.0*( gl_FragCoord.xy / resolution.xy )-1.0;
	p.x *= resolution.x/resolution.y; 
	vec3 col = vec3(0); 
	
	
	col = vec3(1)*clamp(1.0/(1.0+20.0*segment(p, vec2(-0.5,-0.5),vec2(0.0,0.5))),0.0,1.0); 
	col += vec3(1)*1.0/(1.0+50.0*segment(p, vec2(0.0,0.5),vec2(0.5,-0.5))); 
	col += vec3(1)*1.0/(1.0+50.0*segment(p, vec2(0.25,-0.0),vec2(-0.25,0.0))); 
	col *= 0.5;
	gl_FragColor = vec4(col, 1.0); 
}