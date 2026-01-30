#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;


void main( void ) {
	float t = time;
	vec3 color = vec3(0.0, 0.0, 0.0);
	float angle = t * t * 0.005;
	vec2 p = mouse;
	vec2 q;
	q.x = p.x + cos(angle * 3.14 / 180.0) * 1.0;
	q.y = p.y + sin(angle * 3.14 / 180.0) * 1.0;
	float A = q.y - p.y;
	float B = p.x - q.x;
	float C = q.x * p.y - p.x * q.y;
	float rate;
	rate = A * gl_FragCoord.x + B * gl_FragCoord.y + C;
	rate = rate * rate;
	rate = rate / (A * A + B * B);
	rate = 100.0 / rate;
	color.x = rate * 0.0;
	color.y += rate * 0.0;
	color.z += rate * 0.8;
	float x, y;
	x = gl_FragCoord.x - 1366.0 / 2.0;
	y = gl_FragCoord.y - 768.0 / 2.0;
	rate = x * x + y * y;
	rate = sqrt(rate);
	int temp = int(mod(t, 20.0));
	rate -= float(temp * temp);
	if(rate < 0.0)
		rate = -rate;
	rate *= rate;
	rate = 100.0 / rate;
	color.x = rate * 0.8;
	color.y += rate * 0.0;
	color.z += rate * 0.0;
	
	gl_FragColor = vec4(color, 1.0);

}