#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
	uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 pos = 2.0*(( gl_FragCoord.xy / resolution.xy )-0.5);
	pos.x *= resolution.x/resolution.y;
	vec2 p = pos;
	float c = length(p);
	for (int i = 0; i < 5; i++) {
		float d = length(p);
		float r = atan(p.x,p.y);
		float dt = (time*0.025)-d;
		d = 1.02 / d * sin(dt) * cos(dt) * 3.0;

		// some effective matrix rotation		
		vec2 sc = vec2(sin(d+time*0.003), cos(r+time*0.03));
		p = mat2( sc.y, -sc.x,
		          sc.x,  sc.y
		      ) * p;
		p = abs(p);
		p -= c;
		c += sin(float(i) + length(pos))*length(p);
		c += 0.1*fract(d);
	}
	float cst = pow(c*5.0, 2.2)*(1.0/time)*10.0;
	vec3 cs = vec3(
		fract(0.+0.1*cos(cst))
	,	fract(0.-0.3*cos(cst-3.14158*(sin(time*.107))))
	,	fract(0.-0.7*cos(cst-3.14158*(cos(time*.1))))
	);
	//vec3 cs = vec3((cos(cst+time)),(cos(cst+time+4.0)),(cos(cst+time+2.0)));
	gl_FragColor = vec4( vec3(c*cs),1.0);

}