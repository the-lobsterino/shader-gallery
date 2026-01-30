#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {
	float mn = min(resolution.x,resolution.y);
	vec2 pos = ( gl_FragCoord.xy / mn );
	float d = distance(pos, vec2(0.75,0.5));
	float x = pow((pos.x),2.0); //distance(pos, vec2(0.75,0.5));
	float y = abs(pos.y - 0.5);
	float color = pos.x < 0.6 ? (d<0.25 ? 1.0 : 0.0) : (x>y*1.799999 ? 1.0 : 0.0);
	//float color = val;	
	gl_FragColor = vec4( vec3( color, color , color ), 1.0 );
}
