// 180620N)ecip's GENESIS ONE - UPGRADE: THE EYES ON WALKING

#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float render( vec2 position, vec2 offset ) {

	vec3 color = vec3(2.6);
	vec2 p = position * 2.0 - 1.;
	p *= 2.3;
	float k = 0.;
	
	for (int i =0; i < 18; i++) {
		
		p = vec2((p.x + p.y), (p.y - p.x)) - offset;
		k += 0.06;
		// if (p.x*p.y > 6.0) {
		// if (dot(p, p*p) > 6.0) {
		if (dot(p, p) > 100.0) {
			break;
		}

	}

	return k;

}


void main( void ) {
	vec2 position = (gl_FragCoord.xy) / min(resolution.x, resolution.y);
	position *= 2.;
	position.x -= 1.5;
	position.y -= .5;
	
	float r = render(position + vec2( 0.3 + 0.1*sin(time),.1*sin(time)), vec2(0.5 + sin(8.*time) / 16., 1.0 + cos(8.*time) / 16.));
	float g = render(position + vec2(-0.3 - 0.1*sin(time),.1*sin(time)), vec2(0.5 + sin(8.*time) / 16., 1.0 + cos(8.*time) / 16.));
	gl_FragColor = vec4(r+ g, 0., 0., 1.);
}

