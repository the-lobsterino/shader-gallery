#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform vec2 surfaceSize;
varying vec2 surfacePosition;

// Function to create a ripple effect based on position and time
vec3 rippleEffect(vec2 st, float t) {
    // Calculate the distance from the center of the screen
    float distance = length(st - vec2(0.5));
    
    // Create a ripple pattern using sine waves
    float r = sin(distance * 10.0 - t);
    float g = sin(distance * 10.0 + t);
    float b = sin(distance * 10.0 - t * 0.5);

    return vec3(r, g, b);
}

void main() {
    vec2 sp = surfacePosition;
    float z = (1.0 - dot(sp, sp));
    sp *= z;
    vec2 st = sp;
    vec2 m = (2.0 * mouse - 1.0) * z * surfaceSize;
	
	st /= mod(1.0 - dot(st, st + st * m), 2.0) - 6.;

    // Get the ripple effect color based on the screen position and time
    vec3 color = rippleEffect(st, time);

    gl_FragColor = vec4(color, 1.0);
}

