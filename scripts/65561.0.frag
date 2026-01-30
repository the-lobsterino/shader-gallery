// 180620N)ecip's first live form: GENESIS ONE

#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float render( vec2 position, vec2 offset ) {

	vec3 color = vec3(0.0);
	vec2 p = position * 2.0 - 1.0;
	p *= 32.;
	float k = 0.0;
	
	for (int i =0; i < 16; i++) {
		
		p = vec2((p.y * p.y - p.x * p.x) * 0.5, (p.y * p.x)) - offset;
		k += 0.06;
		if (dot(p, p) > 10.0) {
			break;
		}

	}

	return k;

}


void main( void ) {
	vec2 _position = (gl_FragCoord.xy) / min(resolution.x, resolution.y);
	_position *= 2.;
	float time = 0.04*time;
	
	vec2 position = _position;
	position.x = -0.5 + _position.x + 0.5*sin(0.1*time);
	position.y = -0.5 + _position.y + 0.5*cos(0.1*time);
	position.x *= 1. - .1*sin(time);
	position.y *= 1. - .1*sin(time);
	
	gl_FragColor += vec4(render(position, vec2(1. + sin(8.*time) / 16., 1. + cos(8.*time) / 16.)), 
			    render(position, vec2(2. + sin(8.*time) / 16., 2. + cos(8.*time) / 16.)), 
			    render(position, vec2(3. + sin(8.*time) / 16., 3. + cos(8.*time) / 16.)), 
			    1.);
}

