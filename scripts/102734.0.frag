#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 resolution;

// Simplex 2D noise
//

float rand(vec2 co){
    return fract(sin(dot(co, vec2(12.9898, 78.233))) * 43758.5453);
}

float tau = atan(1.0) * 8.0;
vec3 hue(float x)
{
	return clamp(2.0 * cos(vec3(tau * x) + (tau * vec3(0,2,1) / 3.0)),-1.0, 1.0) * 0.5 + 0.5;
}

void main() {
   vec2 position = gl_FragCoord.xy / resolution.xy; // Normalized coordinates
   gl_FragColor = vec4(hue(position.x * position.y *time), 1.0);
}