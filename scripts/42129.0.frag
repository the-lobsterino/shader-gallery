#ifdef GL_ES
precision highp float;
#endif

//Public
vec3 color = vec3(1.0, 0.5, 0.0); //(0,0.5,1)
float trail = 5.0;
float speed = 5.0;


uniform float time;
uniform float dist;
uniform vec2 mouse;
uniform vec2 resolution;
uniform sampler2D backbuffer;


float hash(float x)
{
	x = x * 1234.56789;
	return  fract(fract(x)*x);
}


void main (void) {
	vec2 position = ( gl_FragCoord.xy / resolution.xy);
	vec2 pixel = 1./resolution;
	vec4 me = texture2D(backbuffer, position);

	vec2 rnd = vec2(mod(fract(sin(dot(position + time * 0.001, vec2(14.9898,78.233))) * 43758.5453), 1.0),
	                mod(fract(sin(dot(position + time * 0.001, vec2(24.9898,44.233))) * 27458.5453), 1.0));
	
	vec2 rate = vec2(rnd.x * 0.0005 * (sin(time * 1.0)) , rnd.y * abs(0.001 + 0.0003 * (sin(time * 25.0))));
	
	float mradius = 0.01;
	float dist = length(position - mouse);
	
	if (length(position-mouse) < mradius) {
		me.rgb = vec3(1,1,1);
	} else {
		rate *= speed * vec2(0.5, -2);

		float f = fract(time);
		float h = hash(f+position.x+hash(f-position.y));
		vec4 source = texture2D(backbuffer, fract(position + rate / h * h-vec2(0., .00115)));
		me.rgb =  color / (dist * 10.0);
		
		//me = me * 0.05  + source * 0.95;
		me = me * (trail / 100.0) + source * (1.0 - (trail / 100.0));
	}
	me.xy -= me.z/256.;
	gl_FragColor = me;


	//Uncomment to reset
	gl_FragColor *= float(mouse.x > .02);
}