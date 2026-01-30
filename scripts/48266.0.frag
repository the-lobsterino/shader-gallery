#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform vec2 resolution;
uniform float time;

void main( void ) {
	vec2 uv = ( gl_FragCoord.xy / resolution.xy );
	//float k = 1.0 - pow(dot(uv, uv), 0.2);
	//uv = pow(uv, vec2(4.0));
	//float k = dot(uv, uv);
	//gl_FragColor = vec4(k);
	
	gl_FragColor=vec4(1.-uv.x,uv.x,0,1);
}