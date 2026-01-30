#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {
	//GREENTOOTH!
	vec2 position = ( 2.0*gl_FragCoord.xy - resolution.xy ) / resolution.y;
	float t = cos(time)/4.0;
	mat2 rota = mat2(cos(t), sin(t), -sin(t), cos(t));
	position = rota*position;
	
	vec3 color = vec3(0.145,0.49,0.239);
	float alpha = 0.0;
		
	float size = 1.0;
	if(length(position)<=size) {
		alpha = 1.0;
		
		vec2 eye_pos = vec2(size*0.37);
		float eye_size = 0.138*size;
		float mouth_size = 0.64*size;
		float teeth = 0.4*mouth_size;
		
		if(length(position) <= mouth_size)
			if(position.y < -abs(mod(position.x, teeth) - teeth/2.0 )) {
				alpha -= 1.0;
			}
		if(distance(abs(position), eye_pos) < eye_size && position.y > 0.0)
			alpha -= 1.0;

	}
	
	gl_FragColor = vec4( alpha*color, 1.0 );
}
