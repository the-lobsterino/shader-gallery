#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 resolution;

mat2 rotate(float _rad) {
	return mat2(cos(_rad),-sin(_rad),
		   sin(_rad),cos(_rad));
}

float ran(float _n) {
	return fract(sin(_n)*100002.1425);
}

float circle(in vec2 _pos,float _size) {
	return step(distance(vec2(0.5),_pos),_size);
}

void main( void ) {

	vec2 pos = gl_FragCoord.xy / resolution.x;
	
	pos = rotate(time/10.0) * pos;
	
	pos *= 30.0;
	
	float size = ran(floor(pos.x)+floor(pos.y)*1.03);
	
	pos = fract(pos);
	
	float col = circle(pos,0.09+size/2.5);

	gl_FragColor = vec4(mix(vec3(0.75,0.6,0.45),vec3(0.94,0.89,0.73),col), 1.0 );

}