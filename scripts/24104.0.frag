#ifdef GL_ES+
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define PI 3.14159265359

#define SPEED -.25
#define SCALE 3.

vec3 hsv2rgb(vec3 c){
    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

void main( void ) {
	vec4 col  = vec4(0.);

	for(int i=0; i<2; i++)
	{
		float ratio = resolution.x/resolution.y;
		vec2 p = gl_FragCoord.xy / resolution.xy;
		p-=vec2(.5);
		p.x*=ratio;
		
		float f = ((i == 0) ? .1 : -1.);
	
		float r = time*.2*f;
		p = vec2(cos(r)*p.x + sin(r)*p.y, cos(r)*p.y + -sin(r)*p.x);
	
		float freq = 30.+5.*cos(time*.001);
		float d = freq*(time*.1+abs(p.x*sin(time*.5))-abs(p.y*cos(time*.5)));
		float strips = 3.;// + 16.*(0.5+0.5*sin(time*0.001));
		d = floor(mod(d*strips*.1, strips))*1./strips;
		
		vec4 color = vec4(d);
		float mix = .5+0.5*sin(time*0.05);
		if(i == 1) mix = 1. - mix;
		col += color*.5*mix;
	}
	float s = 0.5*(1.+sin(time));
	col.rgb = hsv2rgb(vec3(col.r*2., s, mix(col.r, 1., s)    ));
	gl_FragColor = col;
}