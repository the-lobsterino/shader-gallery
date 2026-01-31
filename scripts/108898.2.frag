// original by vahokif ~~ modded/enhanced by gsuberland

#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

vec3 FOG_COLOR = vec3(54.0 / 255.0, 159.0 / 255.0, 245.0 / 255.0);

bool map(vec3 pos) {	
	pos.x += time * 0.05;
	pos.y += time * 0.05;
	
	vec2 pos2 = pos.xy;
	
	//pos2.x += pos.z * 20.0;
	float mixCoeff = abs(cos(time))/2.0;
	float twistA = pos.z * sin(time * 0.15) * 0.005;
	float twistB = pos.z * sin(sin(time * 0.15)) * 0.005;
	float twist = (twistA * mixCoeff) + (twistB * (1.0 - mixCoeff));
	float s = sin(twist);
	float c = cos(twist);
	
	pos2 = vec2(c * pos2.x + s * pos2.y, c * pos2.y - s * pos2.x);
	
	return length(fract(pos2) - 0.5) < 0.2;
}

void main( void ) {

	vec2 position = gl_FragCoord.xy / resolution.xy - 55.5;
	position.x *= resolution.x / resolution.y;
	
	vec3 rayDir = normalize(vec3(position.xy, cos(time/57.+length(position)*6.)*79.+8.0));

	bool isHit = false;
	vec3 hit;
	vec3 ray = vec3(0.0); //sin(time)/4.0);
	for (int i = 0; i < 32; i++) {
	  ray += rayDir * (8.0 + cos(time)*66.0);
	  if (map(ray)) {
		  isHit = true;
		  hit = ray;
		  break;
	  }
	}

	vec3 color;
	if (isHit) {		
		color = FOG_COLOR * hit.z / 128.0;
	} else {
		vec3 c2 = FOG_COLOR;
		c2.x *= abs(sin(time/3.0));
		c2.y *= abs(sin(time/3.0));
		c2.z *= abs(sin(time/3.0));
		color = c2;
	}
	gl_FragColor = vec4(color, 8.0 );

}