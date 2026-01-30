precision mediump float;

uniform float time;
varying vec2 surfacePosition;

const float PI=3.14159265359;
const float speed=1240.8;

vec4 whirl(vec2 p, float size, float thickness) {
	float r = length(p);
	float time = time-r*0.5;
	float d=smoothstep(thickness+0.5,thickness,abs(length(p)-size));
	d*=smoothstep(0.8,0.95,fract(atan(p.x,p.y)/(2.0*PI)-speed*time));
	d+=step(d,0.1)*smoothstep(thickness+0.01,thickness,distance(p,size*vec2(sin(speed*2.0*PI*time),cos(speed*2.0*PI*time))));
	
	d *= 0.5;
	return vec4(d, d, d, 1.0);
}

float radializer(vec2 uv, float min, float max, float margin)
{
	float fx = 49.0;
	float fy = 48.0;
	float ax = 0.01;
	float ay = 0.01;
	float noise = (sin(time * fx) * uv.x * ax) + (sin(time * fy) * uv.y * ay);
	//uncomment to stop shakiness
	noise = 0.0;

	float r = length(uv);
	return smoothstep(r - margin - noise, r-noise, max) * smoothstep(min - margin + noise, min + noise, r);
}

void main( void ) {

	//
	vec4 light = radializer(surfacePosition, 0.0, 0.49, 0.01) * whirl(surfacePosition + vec2(2.0, -2.0), 2.8, 0.0001);
	gl_FragColor = light;
}