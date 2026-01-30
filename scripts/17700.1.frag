#ifdef GL_ES
precision mediump float;
#endif

// g-thong shader yay!

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
vec3 rgb(float r, float g, float b) {return vec3(r/255.,g/255.,b/255.);}

void main( void ) {

	vec2 p = ( gl_FragCoord.xy / resolution.xy ) + mouse/4.-.13;
	p.y = .8-p.y;
	
	vec3 col = rgb(241., 216., 175.);
	if ( ( ( p.x>.49+.05*log(p.y-.02) && p.x<.51-.05*log(p.y-.02) ) || p.y<.02 ) && p.y>-.1*(p.x-.5)*(p.x-.5) ) {col = vec3(0.);}
	
	gl_FragColor = vec4( col, 1.0 );

}