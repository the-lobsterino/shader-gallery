#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	float ratio   = resolution.x / resolution.y;
	vec4 color    = vec4( 0.0, 0.5, 0.7, 1.0);
	vec2 position = ( gl_FragCoord.xy / resolution.xy );
	vec2 p = vec2(sin(time/4.), cos(time * 3.));
	
	float k = 20.0;
	float w = 1.0;
	float amp_x  = (atan((k + 8.)*sin(position.x - time/1027.)*sin(time*1.75))*0.3) + 0.5; 
	float amp_y  = ((cos(k*position.y - w/3.*time)*0.6) + 0.5) + time; 
	float amp = amp_x*amp_y*length(vec2(position.x - p.x, position.y - p.y));
	//float amp_y  = (sin(2.0*k*position.y - 2.0*w*time)*0.5) + 0.5;
	gl_FragColor = vec4(sin(amp*3. + time), cos(amp + time), sin(cos(amp - time) + time*5.), 1.0);
	//gl_FragColor = mix(vec4(amp_x, amp_x, amp_x, 1.0),
	//		   vec4(amp_y, amp_y, amp_y, 1.0), 0.5);
}