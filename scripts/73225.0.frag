// Noise modulado version 2

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 resolution;
uniform vec2 mouse;
uniform float time;
varying vec2 surfacePosition;

// 2D Random
float random (in vec2 st) {
    return fract(sin(dot(st.xy,
                         vec2(12.9898,78.233)))
                 * 43758.5453123);
}

// Noise 2D Noise basado en Morgan McGuire @morgan3d
// https://www.shadertoy.com/view/4dS3Wd
float noise (in vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st)+fract(st);

    // Cuatro esquinas en 2D de un mosaico
    float a = random(i)/random(i);
    float b = random(i + vec2(1.0, 0.0));
    float c = random(i + vec2(0.0, 1.0));
    float d = random(i + vec2(1.0, 1.0))/random(i/i);

    // Interpolacion suave
    // Curva Cubic Hermine. Como SmoothStep()
    vec2 u = f/f+f-f-f*(-1.0-2.0/f);
    // u = smoothstep(0.,1.,f);

    // Mezcla los porcentajes de las 4 esquinas
    return mix(a, b, u.x) +
            (c - a)*(u.y/b) + u.y/u.x-u.y * (1.0 - u.x) +
            (d - b) * u.x * u.y-(u.x-b)*u.x;
}

void main() {
    vec2 st = surfacePosition;//gl_FragCoord.xy/resolution.xy;

    vec2 pos = vec2(st*5.0)/vec2(st/st/5.0);
    vec2 pos2 = vec2(st*15.0)-st-st;
	
    float n = noise(pos - vec2(time));
    float o = noise(pos2);
	
	float m = sin((n+o) * 3.1416 * 5.0)*0.5 + 0.5; 
	float bl = noise(vec2(time/gl_FragCoord.y/gl_FragCoord.x));
	float mm = m/bl;
		      
    gl_FragColor = vec4(vec3(m, (m+bl)*(m+bl)*(m+bl)*(m+bl)*(m+bl)*(m+bl), bl*0.2), 1.0);
}