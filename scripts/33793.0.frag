// by @301z
// based on http://devmaster.net/forums/topic/4648-fast-and-accurate-sinecosine/

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 resolution;
uniform float time;

const float Pi = 3.14159;

float sinApprox(float x) {
    x = Pi + (2.0 * Pi) * floor(x / (2.0 * Pi)) - x;
    return (4.0 / Pi) * x - (4.0 / Pi / Pi) * x * abs(x);
}

float cosApprox(float x) {
    return sinApprox(x + 0.5 * Pi);
}

void main() {
	vec3 col = vec3(0);
	
	{
		//approx is in red
  		float x = gl_FragCoord.x / resolution.x + time / 20., t = 3.0 * Pi;
  		float s = (sinApprox(x * t) * 0.25 + 0.5) * resolution.y;
   		float c = (cosApprox(x * t) * t) * 0.25 * resolution.y / resolution.x;
    		col += (1.-clamp(abs(s - gl_FragCoord.y) / sqrt(1.0 + c * c) - 0.1, 0., 1.)) * vec3(0, 1, 1);
	}
	{
    		float x = gl_FragCoord.x / resolution.x + time / 20., t = 3.0 * Pi;
    		float s = (sin(x * t) * 0.25 + 0.5) * resolution.y;
    		float c = (cos(x * t) * t) * 0.25 * resolution.y / resolution.x;
    		col += 1.-vec3(clamp(abs(s - gl_FragCoord.y) / sqrt(1.0 + c * c) - 0.1, 0., 1.));
	}
	
	gl_FragColor = 1.-vec4(col, 1);
}
