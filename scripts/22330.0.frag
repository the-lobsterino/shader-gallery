// progress bar by nazgee

precision mediump float;

uniform vec2 resolution;
uniform float time;


// config; 0..1
#define rhw 0.06
// config; 0..1
#define range 0.8
// config; 0..1
#define radius 0.3


#define marginSoft 0.5
#define marginSharp 0.4
#define rangeOff ((1.0 - range) *0.5)

float angularizer(vec2 uv, float min, float max, float margin)
{
	float delta = max - min;
	float rdiff = (length(uv) - radius) / rhw * 3.14 / 2.0;
	float offset = -rangeOff;
	float a = atan(uv.y, uv.x) * 0.5 / 3.14 + 0.5 + offset;
	a /= range;
	return smoothstep(a - margin, a, max) * smoothstep(min - margin, min, a);
}

float radializer(vec2 uv, float min, float max, float margin)
{
	float fx = 49.0;
	float fy = 48.0;
	float ax = 0.01;
	float ay = 0.01;
	float noise = (sin(time * fx) * uv.x * ax) + (sin(time * fy) * uv.y * ay);
	//uncomment to stop shakiness
	//noise = 0.0;

	float r = length(uv);
	return smoothstep(r - margin - noise, r-noise, max) * smoothstep(min - margin + noise, min + noise, r);
}

void main(void)
{
	vec2 uv = (gl_FragCoord.xy / resolution - vec2(0.5));
	uv.x *= resolution.x/resolution.y;
		
	// input angle 0..1
	float angle = sin(time + 9.0)*0.5 + 0.5;

	float c1 = angularizer(uv, 0.0, angle + 0.010, marginSoft * rhw) * radializer(uv, radius - 1.0*rhw, radius + 1.0*rhw, marginSoft * rhw);
	float c2 = angularizer(uv, 0.0, angle + 0.010, marginSharp * rhw) * radializer(uv, radius - 0.7*rhw, radius + 0.7*rhw, marginSoft * rhw);
	float c3 = angularizer(uv, 0.0, angle - 0.00, marginSharp * rhw) * radializer(uv, radius - 0.4*rhw, radius + 0.4*rhw, marginSoft * rhw);
	gl_FragColor = vec4(c1, c2, c3, 1.0);
}