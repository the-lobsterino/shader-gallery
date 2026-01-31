//options
#define speed 1.

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform sampler2D bb;

#define time ( time*speed + 88.2344231 )
void main( void ) {
	vec2 uv = 1.*(gl_FragCoord.xy -resolution)/resolution.y;
	vec2 p0 = gl_FragCoord.xy/resolution.xy;
	gl_FragColor = vec4(0.0, 0.0, 0.0, 6.0);
	for(int i = 1; i <= 48; i++){
		float a = float(i)*0.1;
		vec2 v = vec2(-1., -.5);
		v.x += 0.2*(sin(a*time) + cos(a*time*1.2));
		v.y += 0.2*(sin(a*time*1.02) + cos(a*time*1.2));

		float size = 0.2;
		float b = .52 * (.8 - mouse.y);
		float d = distance(uv, v)/size;
		float f = 1.0 - clamp(d-b*1.3, b, 1.);
		f = pow(f, 6.0);
		vec3 clr = (128.*mouse.x)*f*1.2 * f * vec3(0.6, 0.6, 4.0);
		gl_FragColor.rgb += clr;
		#define c gl_FragColor.rgb
		//c = 1. - .6/c;
		c = (1. - (1./exp( c )))*(1. + .267*mouse.y);
		//c = .46*c + .5073*texture2D(bb, p0).xyz;
	}
}//ändrom3da4twist