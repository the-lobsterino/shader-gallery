#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform vec2 surfaceSize;
varying vec2 surfacePosition;

const float PI = 3.1415926;
const float TAU = 2.0 * PI;

// Function to create a smooth gradient based on a position and time
vec3 gradientFlow(vec2 st, float t) {
    // Create a gradient flow using trigonometric functions
    float r = sin(st.x * 6.0 + t);
    float g = sin(st.y * 6.0 + t + 2.0);
    float b = sin(st.x * 6.0 + st.y * 6.0 + t + 8.);
	
    vec3 c = log( (vec3(r, g, b) * 0.5 + 0.5) ); // * 0.5 + 0.5;

    return sin( t - sign(c) * mod(c * c - c, TAU) - PI) * 0.5 + 0.5;
}

float ffn(float n)
{
	return fract(n);
}

void main() {
    vec2 sp = surfacePosition;
    vec2 sz = surfaceSize;
    float a = sz.x*sz.y;
    float z = floor( ffn(cos(a)*dot(sp,sp)) * 32.0);
    sp *= z;
	
	float n = ffn(z);
	float t = fract(n) * 2.0 - 1.0;
	
	//if ( t < 0.5 )
	{
		//sp *= exp( 2.0 + z * z );
	}
	
	
    vec2 st = sp;
    vec2 m = (2.0 * mouse - 1.0); // * z * surfaceSize;
	
	//m = normalize(m) * z;
	
	//st *= st * mod(  1.0 - dot(st,st+(m*2.0)), 2.0 ) - 1.0;

    // Get the gradient color based on the screen position and time
    vec3 color = gradientFlow(st, z+time);

    gl_FragColor = vec4(color, 1.0);
}
