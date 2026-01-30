#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform sampler2D back;

void main( void ) {
	vec2 uv = (gl_FragCoord.xy / resolution);
  	vec4 tex = texture2D(back, uv);
	
	tex = mix(tex, (
		texture2D(back	, fract((gl_FragCoord.xy +vec2( 1, 0)) 	/ resolution))
		+texture2D(back	, fract((gl_FragCoord.xy +vec2(-1, 0)) 	/ resolution))
		+texture2D(back	, fract((gl_FragCoord.xy +vec2( 0, 1)) 	/ resolution))
		+texture2D(back	, fract((gl_FragCoord.xy +vec2( 0,-1)) 	/ resolution))
		)/4., 0.5);
	
	tex -= vec4(1,2,3,0)/256.;
	if(distance(mouse, uv) < (1.+length(mouse)*10.)*min(1./resolution.x, 1./resolution.y)){
		tex += 1./(1.+distance(mouse, uv)*max(resolution.x, resolution.y));
	}
  	tex += vec4(float(tex.x < 0.), float(tex.y < 0.), float(tex.z < 0.), 1.);
  	gl_FragColor = tex;
}