#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float windows(vec2 uv){
	uv.x += sin(uv.y * 12.0 + time) * 0.02;
	uv.y -= sin(uv.x * 12.0 + time) * 0.02;
	float box = smoothstep(0.55, 0.604, uv.x) * (1.0 - smoothstep(1.196, 1.25, uv.x)) * smoothstep(0.25, 0.304, uv.y) * (1.0 - smoothstep(0.796, 0.85, uv.y));
	//box *= smoothstep(0.005, 0.008, abs(uv.x - 0.9));
	//box *= smoothstep(0.005, 0.008, abs(uv.y - 0.55));
	return box;
}

void main( void ) {

	vec2 position = 2.*( gl_FragCoord.xy / resolution.xy ) -vec2(0.4,0.7);
	position.x *= resolution.x / resolution.y;
 
	position.y -= 0.35;
	 
	gl_FragColor = vec4(vec3(windows(position-vec2(0.0,0.0)), 0.0, 0.), 1.);
	
	gl_FragColor += vec4(vec3(0.0,windows( position-vec2(0.7,0.0)), 0.).rgg, 1.);
	
	gl_FragColor += vec4(vec3(0.0,0.0, windows( position+vec2(0.0,0.6))), 1.);
	
	gl_FragColor += vec4(vec3(windows( position-vec2(0.7,-0.6)),windows( position-vec2(0.7,-0.6)), 0.0), 1.);
	 
	gl_FragColor += vec4(vec3(windows(position-vec2(0.0,-1.2)), 0.0, 0.).brb, 1.);
	
	gl_FragColor += vec4(vec3(0.0,windows( position-vec2(0.7,-1.2)), 0.).grg, 1.);
	
	
	 // M$ doesn't care about cyan and magenta |: 
}