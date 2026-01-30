#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
float x = 0.0;
vec2 u;
vec2 c;

void main (void) {
	vec2 v = (15.0*gl_FragCoord.xy-resolution) /max(resolution.x,resolution.y);

	for(int i=1;i<5;i++)
	{

		vec2 newv = v;
		x = fract(u.x * u.y + 0.9);
		x *= (1.0 - length(fract(v)*0.45 - vec2(0.1, 0.1)) * (3.0));
		float speed = 2.0 * time; // speed control
    newv.x += 0.8/float(i)*sin(float(i)*v.y+time/(100.0/speed)+0.2*float(i));
	  newv.y += 0.9/float(i)*sin(float(i)*v.x+time/(100.0/speed)+0.2*float(i)+0.9)-0.3;
		v = newv;

	}
	c = vec2(x , 0.5);
	gl_FragColor = vec4(c,0.6,1.0)*1.4;
}
