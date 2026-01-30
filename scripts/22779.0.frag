#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 c = ( gl_FragCoord.xy / resolution.xy ) *4.-2.;
	vec2 v = mouse*2.-1.;
	c /= sqrt(1.-dot(v,v));
	
	vec2 pos = c;
	for (int i = 0; i < 30; i++) {
		pos = vec2(pos.x*pos.x-pos.y*pos.y,2.*pos.x*pos.y)+c;
		float l = length(pos);
		vec2 u = pos/16.;
		
		u = (v + dot(u,v)*v/dot(v,v) + sqrt(1.-dot(v,v))*(u-dot(u,v)*v/dot(v,v)))/(1.+dot(u,v));
		
		
		
		pos = (u-v)*16.;
		if (dot(pos,pos) > 16.) break;
	}
	

	float color = length(pos);

	gl_FragColor = vec4( vec3( color, color * 0.5, sin( color + time / 3.0 ) * 0.75 ), 1.0 )/(1.+color*color*.01);

}