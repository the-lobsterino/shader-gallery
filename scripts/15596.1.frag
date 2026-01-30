#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {
	
	float x = resolution.x / 4.0;
	float y = resolution.y / 4.0;
	
	float color = 0.0;
	for (int i = 0; i < 16; i++){
		float size = 150.0;
		vec2 pos = vec2(x, y);
		pos.x = pos.x * (2.0 - sin((float(i)+time/66.)/2.0 * time));
		pos.y = pos.y * (2.0 - cos((float(i)+time/666.)/2.0 * time));
		float dist = length(gl_FragCoord.xy - pos);
		if (dist > 50.0){
			color += (size / dist) * 0.08;
		} else{
			color -= sin(size / dist)*0.1;
		}
	}
	gl_FragColor = vec4( vec3( color, 1./(color+sin(time)+2.), sin( (color*16.) )*0.35 ), 1.0 );
		

}