#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

int siBinar(int a,int b) { 
	if (a < 0) a = -1-a;
	if (b < 0) b = -1-b;
	int result = int((1.-abs(1.-mod(float(a),3.)))*(1.-abs(1.-mod(float(b),3.))));
	for (int i = 0;i < 7;i++) {
		a /= 3;
		b /= 3;
		result += int((1.-abs(1.-mod(float(a),3.)))*(1.-abs(1.-mod(float(b),3.))))*2;
	}

	return result;
}

void main( void ) {


	vec2 position = gl_FragCoord.xy-resolution*.5;
	float t = time*.1;
	//position += sin(position.yx*.1*sin(time*.5))*10.*.5;
	position *= mat2(cos(t),-sin(t),sin(t),cos(t));
	
	position *= pow(3.,1.-fract(time));

	
	float color = 0.0;

	int bin = siBinar(int(floor(position.x)),int(floor(position.y)));
	if (bin == 0) {
		color = 1.0;
	} else if (bin == 1) {
		color = 1.-fract(time);
	} 
	gl_FragColor = vec4( color,color,color, 1.0 );

}