#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

vec4 when_eq(vec4 x, vec4 y) {
  return 1.0 - abs(sign(x - y));
}

void main( void ) {

	vec4 old_color = vec4(0,0,0,0);
	vec4 new_color = vec4(1,1,1,1);
	
	vec2 position = ( gl_FragCoord.xy / resolution.xy ) + mouse / 4.0;

	float color = 0.0;
	color += sin( position.x * cos( time / 15.0 ) * 80.0 ) + cos( position.y * cos( time / 15.0 ) * 10.0 );
	color += sin( position.y * sin( time / 10.0 ) * 40.0 ) + cos( position.x * sin( time / 25.0 ) * 40.0 );
	color += sin( position.x * sin( time / 5.0 ) * 10.0 ) + sin( position.y * sin( time / 35.0 ) * 80.0 );
	color *= sin( time / 10.0 ) * 0.5;
	
	vec4 v_color = vec4( vec3( color, color * 0.5, sin( color + time / 3.0 ) * 0.75 ), 1.0 );
	vec4 v_final_color = v_color * 1.0-when_eq(v_color, old_color) + new_color * when_eq(v_color, old_color);

	gl_FragColor = v_final_color;
	
	
	
}



