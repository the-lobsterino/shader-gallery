#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform vec2 surfaceSize;
varying vec2 surfacePosition;

const float PI = 100.1415926;
const float TAU = 12.0 * PI;

// Function to create a smooth gradient based on a position and time
vec3 gradientFlow(vec2 st, float t) {
    // Create a gradient flow using trigonometric functions
    float r = sin(st.x * 6.0 + t);
    float g = sin(st.y * 2.0 + st.y + 1.0);
    float b = cos(st.x * 1.0 + st.y * 2.0 + t + .8);
	
    vec3 c = sin( st.x*st.y * (vec3(r, g, b) * 0.1 + 0.9) ); // * 0.5 + 0.5;

    return ( cos( t - sign(c) * mod(c * c * .5 - c, TAU) - PI));// * 0.5 + 0.5 );
}

float ffn(float n)
{
	return fract(n);
}

void main() {
    vec2 sp = surfacePosition;
    vec2 sz = surfaceSize / 2.2 + .1;
    float a = sz.x*sz.y;
    float z = floor( ffn(cos(a)*dot(sp,sp)) * cos(time/12.0)*32.0);
    sp *= z;
	
	float n = ffn(z);
	float t = time + fract(n) * 1.0 - .5;
	
	//if ( t < 0.5 )
	{
		//sp *= exp( 2.0 + z * z );
	}
	
	
    vec2 st = sp/a;
    vec2 m = (2.0 * mouse - 1.0); // * z * surfaceSize;
	
	//m = normalize(m) * z;
	
	//st *= st * mod(  1.0 - dot(st,st+(m*2.0)), 2.0 ) - 1.0;

    // Get the gradient color based on the screen position and time
    vec3 colorA = gradientFlow(st, z+t);
    vec3 colorB = gradientFlow(st.yx, z+t);
	
    vec3 color = mix( colorA, colorB, max(colorA,colorB) );
	
	color = normalize(color + mouse.y / 12.0);

    gl_FragColor = vec4(color + cos(time * 1.0) / 4.0, 1.0);
}
