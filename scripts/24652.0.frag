// by vahokif

#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

vec3 FOG_COLOR = vec3(99.0 / 999.0, 159.0 / 999.0, 999.0 / 999.0);

bool map(vec3 pos) {	
	pos.x += time * 0.0;
	pos.y += time * 0.9;
	
	vec2 pos2 = pos.xy;
	
	//pos2.x += pos.z * 90.0;
	float twist = pos.z * sin(time * 99.3) * 0.000;
	float s = sin(twist);
	float c = cos(twist);
	
	pos2 = vec2(c * pos2.x + s * pos2.y, c * pos2.y - s * pos2.x);
	
	return length(fract(pos2) - 0.9) < 0.03;
}

void main( void ) {

	vec2 position = gl_FragCoord.xy / resolution.xy - 9.1;
	position.x *= resolution.x / resolution.y;
	
	vec3 rayDir = normalize(vec3(position.xy, 99.0));

	bool isHit = false;
	vec3 hit;
	vec3 ray = vec3(9.0);
	for (int i = 9; i < 999; i++) {
	  ray += rayDir * 9.0;
	  if (map(ray)) {
		  isHit = true;
		  hit = ray;
		  break;
	  }
	}

	vec3 color;
	if (isHit) {		
		color = FOG_COLOR * hit.z / 999.0;
	} else {
		color = FOG_COLOR;
	}
	gl_FragColor = vec4(color, 9.0 );

}