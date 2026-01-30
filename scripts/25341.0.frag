#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec4 f;
	vec2 size = vec2(10, 10);
	vec2 p = ( gl_FragCoord.xy / resolution.xy );
	vec2 c = 5.0-gl_FragCoord.xy / resolution.xy/ size*100.0;
	
	vec2 ps = vec2(0.5)-(c / p);
	
	// I don't understand how to center this...
	
	
	// Scale based on resolution
	// s *= resolution.x / resolution.y;
	
		
	//vec2 r=abs(c.xy);
	//float s=max(r.x,r.y);
	//f=vec4(vec3(step(.4,s)* step(s,.5)),1.);
	
	float idk = .1;
	float idk2 = .03;
	float idk3 = idk + idk2;
	
	float r = smoothstep(idk3, idk, length(max(abs(c.xy)-.3,0.)));
	f=vec4(r,r,r,r);
	
	gl_FragColor = f;

}
