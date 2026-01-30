#ifdef GL_ES
precision mediump float;
#endif
// Falling Snow

// Incoming program time
uniform float time;

// Incoming window resolution
uniform vec2 resolution;

// Create snow
float Storm(vec2 p)
{
	// Flake size
	vec2 seed = floor(p * resolution * 4.0);
	
	// Fall pattern
	float rnd1 = fract(cos(seed.x * 8.3e-3 + seed.y) * 4.7e5);
	
	// Flake density
	return pow(rnd1, 150.0);
}

void main() 
{
	// Fall height
	vec2 p = (gl_FragCoord.xy / resolution.xy) - vec2(0.5, 0.05);
	
	// Overlay density
	float c = 0.0;

	// Flake properties
	for(int a = 1; a < 5; a++)
	c = max(c, Storm(vec2(0.037, 0.1) * acos(float(a) * 0.2) * time * 0.1 + p * 0.079 * float(a)) * (pow(p.y + 1.0, 20.0)));
	
	// Background/Overlay color
	gl_FragColor = vec4(vec3(c + 0.0, c + 0.0, c + 0.0), 1.0);
}