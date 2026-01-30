#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;


// from http://lodev.org/cgtutor/randomnoise.html#Turbulence

mat2 m = mat2( 0.8, 0.6, -0.6, 0.8 );

  //xPeriod and yPeriod together define the angle of the lines
    //xPeriod and yPeriod both 0 ==> it becomes a normal clouds or turbulence pattern
    float xPeriod = 10.0; //defines repetition of marble lines in x direction
    float yPeriod = 20.0; //defines repetition of marble lines in y direction
    //turbPower = 0 ==> it becomes a normal sine pattern
   // float turbPower = 3.2; //makes twists
   /// float turbSize = 5.0; //initial size of the turbulence


float hash( float n ) { return fract(sin(n)*43758.5453123); }
float noise( in vec3 x )
{
    vec3 p = floor(x);
    vec3 f = fract(x);
    f = f*f*(3.0-2.0*f);
	
    float n = p.x + p.y*157.0 + 113.0*p.z;
    return mix(mix(mix( hash(n+  0.0), hash(n+  1.0),f.x),
                   mix( hash(n+157.0), hash(n+158.0),f.x),f.y),
               mix(mix( hash(n+113.0), hash(n+114.0),f.x),
                   mix( hash(n+270.0), hash(n+271.0),f.x),f.y),f.z);
}

float fbm(vec3 co) {
	float n = 0.0;
	n += 0.5000 * noise(co); co.xy *= m * 2.02;
	n += 0.2500 * noise(co); co.xy *= m * 2.03;
	n += 0.1250 * noise(co); co.xy *= m * 2.01;
	n += 0.0625 * noise(co); co.xy *= m * 2.04;
	n /= 0.9375;
	
	return n;
}

 float xyPeriod = 8.0; //number of rings
 float turbPower = 0.1; //makes twists
 float turbSize = 5.0; //initial size of the turbulence

float marble(vec3 c) {
	 float xyValue = c.x * xPeriod  + c.y * yPeriod + turbPower * fbm(c * turbSize);
 	 return abs(sin(xyValue * 3.14159));
}



float wood(vec3 c) {
	
	vec2 d = c.xy - vec2(0.5, 0.5);
        float distValue = length(d) + turbPower * fbm(c * turbSize);
        return abs(sin(2. * xyPeriod * distValue * 3.14159));
	
	
	
}

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy );// + mouse / 4.0;

	float color = wood( vec3(position, 0.) ); //time * 0.4 // sin( (gl_FragCoord.x + gl_FragCoord.y) / 4. )
	gl_FragColor = vec4( vec3( color + 0.1, color + 0.05, color), 1.0 );

}