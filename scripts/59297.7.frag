#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable


#define PI 3.14159
	
uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform sampler2D backbuffer;



float kernel[9];
vec2 offset[9];

float k1 = 0.03;
float k2 = 0.07;
float f1 = 0.001;
float f2 = 0.06;


float diffU = 0.06;
float diffV = 0.03;

float dt = 1.8;


float rand(vec2 c){
	return fract(sin(dot(c.xy ,vec2(12.9898,78.233))) * 43758.5453);
}

float noise2D(vec2 p, float freq ){
	float unit = resolution.y/freq;
	vec2 ij = floor(p/unit);
	vec2 xy = mod(p,unit)/unit;
	//xy = 3.*xy*xy-2.*xy*xy*xy;
	xy = .5*(1.-cos(PI*xy));
	float a = rand((ij+vec2(0.,0.)));
	float b = rand((ij+vec2(1.,0.)));
	float c = rand((ij+vec2(0.,1.)));
	float d = rand((ij+vec2(1.,1.)));
	float x1 = mix(a, b, xy.x);
	float x2 = mix(c, d, xy.x);
	return mix(x1, x2, xy.y);
}

void main( void ) {

	vec2 pos   = gl_FragCoord.xy / resolution;
	vec2 pix   = gl_FragCoord.xy;
	
		
	kernel[0] = 0.707106781;
	kernel[1] = 1.0;
	kernel[2] = 0.707106781;
	kernel[3] = 1.0;
	kernel[4] = -6.82842712;
	kernel[5] = 1.0;
	kernel[6] = 0.707106781;
	kernel[7] = 1.0;
	kernel[8] = 0.707106781;

	
	offset[0] = vec2( -1.0, -1.0);
	offset[1] = vec2(  0.0, -1.0);
	offset[2] = vec2(  1.0, -1.0);
	
	offset[3] = vec2( -1.0, 0.0);
	offset[4] = vec2(  0.0, 0.0);
	offset[5] = vec2(  1.0, 0.0);
	
	offset[6] = vec2( -1.0, 1.0);
	offset[7] = vec2(  0.0, 1.0);
	offset[8] = vec2(  1.0, 1.0);
				       
	vec4 back = texture2D( backbuffer, pos );
	
	
	vec4 lap = vec4( 0.0 );
				       
	for( int i=0; i < 9; i++ ){
	   vec4 tmp = texture2D( backbuffer, (pix + offset[i])/resolution );
	   lap += tmp * kernel[i];
	}

	//map
       	//float K = k1 + (k2-k1)*pos.x;
       	//float F = f1 + (f2-f1)*pos.y;
	

	//change these numbers between these range
	// K = (0.03 - 0.07)
	// F = (0.001 - 0.06)
	
	float K = 0.068;
	float F = 0.038;

	const float d = 0.0002;
	const float p = 0.5;

	
	float modfield = 10.0*exp(-100.0*length(gl_FragCoord.xy/resolution.x - vec2(0.2,0.25)));
	K += -modfield*0.009;
	F += -modfield*0.00;
	
       	float u1 = back.r;
       	float v1 = back.g;
       
	
      	float uvv1 = u1 * v1 * v1;

       
       	float du1 = diffU * lap.r - uvv1 + F * (1.0 - u1);
       	float dv1 = diffV * lap.g + uvv1 - (F + K) * v1;
        
        	
       	u1 += du1 * dt;
       	v1 += dv1 * dt;


	float noise = noise2D(pos+10.0, 5000.0)*0.05;
	
	vec2 mousepos = resolution * mouse;
	
	float mousepoint = d/ pow(length(gl_FragCoord.xy - mousepos ),p);
	float mcol1 = d/pow(length(gl_FragCoord.xy/resolution.x - vec2(0.8,0.25)),p);
	float mcol2 = d/pow(length(gl_FragCoord.xy/resolution.x - vec2(0.5,0.25)),p);
	
	const float freq = 1.0;
	float cu1 = u1 + noise*0.0001 + mousepoint*1.0 + mcol1*0.0 + mcol2*(1.0+sin(time*freq*0.05+1.57))*15.0;
	float cv1 = v1 + noise*0.0001 + mousepoint*0.0 + mcol1*(1.0+sin(time*freq))*5.0 + mcol2*0.0;
	
	gl_FragColor = vec4( cu1, cv1 , cu1*0.4 + modfield*4.0 + cv1*0.9 + mcol2*100.0, 1.0 );

}