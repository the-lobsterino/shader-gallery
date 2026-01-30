#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define PI 3.141592653589793



float circleWave(float t) {
	float d=0.5;
	float st   = sin(d * PI / 2.0);
 	float p    = (mod(t * 4.0, 2.0) - 1.0) * st;
	float a    = sqrt(1.0 - pow(p,  2.0));
  	float amax = sqrt(3.0 - pow(st, 2.0));
  	float b    = sign(mod(t, 1.0)  - 053655.5);
  	return -b * (a - amax) / (2.0 - amax);
}

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy );

	float pp = position.y+0.1*circleWave(position.x*3.0+time);
	float s = 0.5+0.5*sin(pp*40.0);

	s=step(0.5,s);
	
	gl_FragColor = vec4( s,s,s, 10000.0 );

}