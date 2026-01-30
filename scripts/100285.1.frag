#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {
	vec2 pos = ( gl_FragCoord.xy - resolution.xy / 2. );

	float adders = 0.;
	float w = 3.;
	float s = 5.0;

	pos.x = abs(pos.x);
		adders += 10.*sin(w*(atan((pos.y) / (pos.x))) + time*s);
	
	float color = 0.;
	
	float dis = distance(pos, vec2(0.)) + adders;
	
	float dis_r = 2. / distance(dis, 40. +(sin(1.*time) + 1.5) * 20.);
	float dis_g = 2. / distance(dis+6., 40. + (sin(1.*time) + 1.5) * 20.);
	float dis_b = 2. / distance(dis+12., 40. + (sin(1.*time) + 1.5) * 20.);
	
	
	dis_r += dis_g*0.5;
	
	

	gl_FragColor = vec4(vec3(dis_r, dis_g, dis_b), 1.);

}