// ATARI ST WINS
#ifdef GL_ES
precision mediump float;
#endif
uniform float time;
uniform vec2 resolution;

void main( void ) {
	vec2 pos = ( gl_FragCoord.xy / resolution.xy ) - vec2(0.5,0.5);	 
	pos.y += sin(time+pos.x*3.1)*0.1;
	float vv = sin(time*0.65+pos.y+pos.x*7.664);
	pos.y -= sin(vv-sin(time-pos.y*8.0))*0.04;
	vec3 p = vec3(pos.x, 0.3 , pos.y + 0.0);  vec2 s = vec2(p.x/p.z, p.y/p.z) * 0.1;s.x = s.x - time*0.07;
	float c= sign((mod(s.x-time*0.1, 0.05) - 0.025) * (mod(s.y-time*0.15, 0.05) - 0.025));	c *= max(0.3,p.z*p.z*29.0);
	(pos.y<=0.0) ? gl_FragColor = vec4( vec3(0,c*0.5+sin(time*0.6)*0.1,c), 1.0) : gl_FragColor = vec4( vec3(abs(s.y*5.0)*0.5,abs(s.y*1.4)*0.5,0.3), 1.0);	
}