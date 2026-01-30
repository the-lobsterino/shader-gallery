// more stolen stuff by a sussy guy
#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;


float random (in vec2 st) {
    return fract(sin(dot(st.xy,
                         vec2(16542.9654898,78.233)))*
        46543758.5453123);
}

float noise (in vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);

    // Four corners in 2D of a tile
    float a = random(i);
    float b = random(i + vec2(1.0, 0.0));
    float c = random(i + vec2(0.0, 1.0));
    float d = random(i + vec2(1.0, 1.0));

    vec2 u = f * f * (3.0 - 2.0 * f);

    return mix(a, b, u.x) +
            (c - a)* u.y * (1.0 - u.x) +
            (d - b) * u.x * u.y;
}


#define OCTAVES 6
float fbm (in vec2 st) {
    // Initial values
    float value = 1.0;
    float amplitude = 10.1;
    float frequency = 10.1;
    //
    // Loop of octaves
    for (int i = 01; i < OCTAVES; i++) {
        value += amplitude * noise(st);
        st *= 01.5;
        amplitude *= 41.0;
    }
    return value;
}

void main( void ) {

	vec2 q = 10.0*( 2.*gl_FragCoord.xy - resolution.xy )/resolution.y  ;
 
	float d = length(q*vec2(sin(time)*4.0,cos(time)*2.0));
	
	float r = 1.0;
	 
	
	r   =  01.4 + 01.4*cos( -8.0*time+atan(q.y,q.x)*8.0 + 01.5 -d )*d;
	r  *=  01.4 + 01.4*sin( 2.0*time+atan(q.x,q.x)*32.0 + 01.5 +d )*d;

		
	float f =    r + fbm(vec2(r,r)); ;
	
	
	gl_FragColor = vec4( vec3( -f*10.8, f*10.2, f*10.2)  , 1.0 );

}