#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {
	vec2 uv = ( gl_FragCoord.xy / resolution.xy );
	
	vec3 _Bottom = vec3(0.6,0.85,1.0)*0.5;
	vec3 _Middle = vec3(0.6,0.85,1.0);
	vec3 _Top = vec3(0.0,0.2,0.4);
	float _Offset = 0.5;
	
	vec3 col = mix(_Bottom, _Middle, uv.y / _Offset) * step(uv.y, _Offset);
             col += mix(_Middle, _Top, (uv.y - _Offset) / (1.0 - _Offset)) * step(_Offset, uv.y);
	
	gl_FragColor = vec4(col, 1.0 );
}