#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform vec2 mouse;
uniform float time;
uniform vec2 resolution;
float speed = 		-20.0;
float size = 		30.0;
float speed_xy = 	500.0;
const float part = 	3.0;
float angle = 		360.0/part;
float color[int(part)];
float col = 		0.0;

void main( void ) {
	vec2 position = ( gl_FragCoord.xy / resolution.xy);
	position=position*4.0-2.0;
	position.x*=resolution.x/resolution.y;


	for (int i = 0; i < int(part); i++){
		color[i] = 1.0;
		vec2 xy_ = vec2( sin(radians(float(i)*angle)), cos(radians(float(i)*angle)));
		xy_ *= sin(time*speed_xy);
		color[i]+=0.06*sin(speed*time+size*distance(position.xy,xy_))/(distance(position.xy,xy_)+0.03);
		col += color[i];
	}

	gl_FragColor = vec4( vec3(sin(col),cos(col),tan(col)), 1.0 );

}

// by goanautix
// inspired by http://glslsandbox.com/e#35498.0