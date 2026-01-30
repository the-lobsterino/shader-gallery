#ifdef GL_ES
precision lowp float;
#endif

#define PI 3.14159265358979

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
varying vec2 surfacePosition;

mat2 rot(float a) {
	return mat2(cos(a), -sin(a), sin(a), cos(a));
}

void main( void ) {

	//vec2 position = ( gl_FragCoord.xy / resolution.xy ) + mouse / 4.0; // 0/0 is at bottom left
	vec2 position = surfacePosition; // 0/0 is in the center
	
	float color = 0.0;
	float height = 0.0;
	const int ITER_MAX = 10;
	float speed = time*0.125;
	for(int i=0;i<ITER_MAX;i++) {
		position.y += 0.005;
		vec2 a = floor((rot( PI*abs(sin(time/5.)+1.)*0.33))*position*100.0);
		vec2 b = floor((rot(-PI*abs(sin(time/5.)-1.)*0.33))*position*100.0);
		height = max(height, float(ITER_MAX-i)*(sin(b+sin(a*b+speed)-b*sin(a*b+speed)).y));
	}
	
	color += height/float(ITER_MAX/2);
	
	gl_FragColor = vec4( vec3( color, color * 0.5, sin( color / 3.0 ) * 0.75 ), 1.0 );
//gl_FragColor = vec4(surfacePosition.x,surfacePosition.y,0,1);
}