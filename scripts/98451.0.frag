#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

vec2 cmpxcjg(in vec2 c) {
	return vec2(c.x, -c.y);
}

vec2 cmpxmul(in vec2 a, in vec2 b) {
	return vec2(a.x * b.x - a.y * b.y, a.y * b.x + a.x * b.y);
}

vec2 cmpxdiv(in vec2 a, in vec2 b) {
    return cmpxmul(a, cmpxcjg(b));
}

float cmpxmag(in vec2 c) {
    return sqrt(c.x * c.x + c.y * c.y);
}

void main( void ) {

	vec2 position = gl_FragCoord.xy;
	position -= resolution.xy/2.0;
	position /= resolution.xy;
	position /= 16.0;
	position.x -= 0.7;
	position.y -= -0.;
	position.x *= 18.0/9.0;
	vec2 z = vec2(0.0,0.0);
	const int k = 400;
	int j = 0;
	for(int i = 0;i < k; i++){
		z = cmpxmul(z,z) + position;
		j += 1;
		if(cmpxmag(z) > 2.0){
		break;}
	}
	float color = float(j)/ float(k);
	


	gl_FragColor = vec4( vec3( color,color, color ), 1.0 );
	//gl_FragColor = vec4(position, 0.0, 0.0);

}