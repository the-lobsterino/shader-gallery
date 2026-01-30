precision highp float;

uniform vec2 mouse;
uniform vec2 resolution;

float Random(inout int Seed) {
	float FloatingSeed = float(Seed);
	float FinalValue = (FloatingSeed + 0.2893712) * (FloatingSeed + 0.472890) * (FloatingSeed + 0.589470);
	Seed = int(FinalValue);
	
	return FinalValue - floor(FinalValue);
}

void main() {
	int Seed = int(mouse.y * resolution.x + mouse.x);
	
	float r = Random(Seed);
	float g = Random(Seed);
	float b = Random(Seed);
	float a = 1.0;
	
	vec4 Color = vec4(r, g, b, a);
	gl_FragColor = Color;
}