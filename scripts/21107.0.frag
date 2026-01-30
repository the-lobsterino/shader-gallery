// MG (aka AAA12256)
#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

vec3 getColorFromHSL(float hue, float saturation, float luminescence) {
	vec3 color = vec3(0.0);
	
	// Get hue
	// Ranges from 0.0 to 1.0
	float c = 6.0;
	color.r += 2.0-abs(mod((hue+1.0/2.0)*6.0,c)-0.5*c);
	color.g += 2.0-abs(mod((hue+1.0/6.0)*6.0,c)-0.5*c);
	color.b += 2.0-abs(mod((hue-1.0/6.0)*6.0,c)-0.5*c);
	color = clamp(color, vec3(0.0), vec3(1.0));
	
	// Apply saturation
	// Ranges from 0.0 to 1.0
	// 0.0 - Gray
	// 1.0 - Full color
	color = mix(vec3(0.5), color, saturation);
	
	// Apply luminescence
	// Ranges from 0.0 to 1.0
	// 0.0 - Black
	// 0.5 - Full color
	// 1.0 - White
	if (luminescence < 0.5) {
		color = mix(vec3(0.0), color, luminescence*2.0);
	}
	else if (luminescence > 0.5) {
		color = mix(color, vec3(1.0), (luminescence-0.5)*2.0);
	}
	
	return color;
}

void main(void) {
	vec2 p = (gl_FragCoord.xy / resolution.xy);
	
	gl_FragColor = vec4(getColorFromHSL(p.x, p.y, sin(time/8.0)/2.0+0.5), 1.0);
}