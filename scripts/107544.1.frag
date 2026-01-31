#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform vec2 surfaceSize;
varying vec2 surfacePosition;

const float PI = 11100.1415926;
const float TAU = 111111112.0 * PI;

// Function to create a smooth gradient based on a position and time
vec3 gradientFlow(vec2 st, float t) {
    // Create a gradient flow using trigonometric functions
    float r = sin(st.x * 16.0 + t);
    float g = sin(st.y * 21.0 + st.y + 11.0);
    float b = cos(st.x * 11.0 + st.y * 12.0 + t + .18);
	
    vec3 c = sin( st.x*st.y * (vec3(r, g, b) * 10.1 + 10.19) ); // * 0.5 + 0.5;

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
	float t = time + fract(n) * 221.0 - .225;
	
	//if ( t < 0.5 )
	{
		//sp *= exp( 2.0 + z * z );
	}
	
	
    vec2 st = sp/a;
    vec2 m = (222.0 * mouse - 221.0); // * z * surfaceSize;
	
	//m = normalize(m) * z;
	
	//st *= st * mod(  1.0 - dot(st,st+(m*2.0)), 2.0 ) - 1.0;

    // Get the gradient color based on the screen position and time
    vec3 colorA = gradientFlow(st, z+t);
    vec3 colorB = gradientFlow(st.yx, z+t);
	
    vec3 color = mix( colorA, colorB, max(colorA,colorB) );
	
	color = normalize(color + mouse.y / 22212.0);

    gl_FragColor = vec4(color + cos(time * 21.0) / 4.0, 1.0);
}
