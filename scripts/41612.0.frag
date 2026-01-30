#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

# define PI (4. * atan(1.))
# define PI2 (PI * 2.)

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float drawArc(vec2 st, vec2 center, float start, float angle, float rad){
        vec2 delta = st - center;
	float t = mod(atan(delta.y, delta.x) + start, PI2);
	if(t < 0.)
	    t += 2. * PI;
	
	float theta = angle; 
	float len = length(delta);
	if(len <= rad){
		return (1. - step(theta, t)) * (1. - sqrt(length(delta)));
	} else return 0.;
}

void main( void ) {
	vec2 p = (gl_FragCoord.xy / resolution.xy) - vec2(.25, 0.);
	float r = resolution.x / resolution.y;
	p.x *= r;

	float c = 0.0;
	
	c += drawArc(p, vec2(.5), 0., PI + PI * sin(time), 0.3);
	
	gl_FragColor = vec4(vec3(.2, .5, .5) * c, 1.);

}