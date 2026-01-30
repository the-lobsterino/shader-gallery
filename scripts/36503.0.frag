#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
void main( void ) {

	vec2 p = 2.0*( gl_FragCoord.xy / resolution.xy )-1.0;
	p.x *= resolution.x/resolution.y; 
	p -= fract(p*32.)/32.;
	if(abs(p.y) > 0.8) return;
	p.y *= 1.3;
	
	vec3 col = vec3(0); 
	
	if (abs(p.x) < 0.1) {
		col = vec3(0.9); 
	}
	p.x = abs(p.x); 
	if (abs(p.x-0.25-1.0*smoothstep(0.0,1.7,clamp(-p.y,0.0,1.0))) < 0.08+clamp(-p.y,0.0,1.0)*0.05) {
		col = vec3(0.9); 
	}
	gl_FragColor = vec4(col, 1.0); 

}


//https://images.duckduckgo.com/iu/?u=http%3A%2F%2Ffiles.tomek.cedro.info%2Fold-www%2Fbios%2Flogo%2Fatari-fullscreen.jpg&f=1

