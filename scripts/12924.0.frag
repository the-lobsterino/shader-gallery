#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;





#define WIDTH resolution[0]
#define HEIGHT resolution[1]

#define pi 3.141592653589793238462643383279
#define PI pi


//in float a;
//in vec2 mouse;
float p = time;
float a = p;


struct complex{
	float Re;
	float Im;
};

//this defines the window of the complex function plot
complex range = complex(3.0, 3.0);


float angle(float x, float y) {
float phi = 0.0;

    if (x==0.0) phi = (y>0.0) ? pi/2.0 : -pi/2.0;
	else phi = (x>0.0) ? atan(y/x) : atan(y/x)-pi;

    return mod(phi,2.0*pi);
}


float abs_c(complex z) {
	return sqrt(pow(z.Re,2.0)+pow(z.Im,2.0));
}


complex pol2complex(float r, float phi) {
	complex z;
	z.Re = cos(phi)*r;
	z.Im = sin(phi)*r;
	return z;
}


vec3 HSVtoRGB(vec3 HSV)
{
    vec3 RGB = vec3(0.0,0.0,0.0);
    float C = HSV.z * HSV.y;
    float H = HSV.x * 6.0;
    float X = C * (1.0 - abs(mod(H, 2.0) - 1.0));
    if (HSV.y != 0.0)
    {
        float I = floor(H);
        if (I == 0.0) { RGB = vec3(C, X, 0.0); }
        else if (I == 1.0) { RGB = vec3(X, C, 0.0); }
        else if (I == 2.0) { RGB = vec3(0, C, X); }
        else if (I == 3.0) { RGB = vec3(0, X, C); }
        else if (I == 4.0) { RGB = vec3(X, 0, C); }
        else { RGB = vec3(C, 0, X); }
    }
    float M = HSV.z - C;
    return RGB + M;
}

/*
complex mul_c(complex z1, complex z2) {
	float r, r1, r2; // length of complex number in complex plane (absolute value)
	float phi, phi1, phi2; // angle of complex number in complex plane
	

	r1 = abs_c(z1);
	phi1 = angle(z1.Re, z1.Im);

	r2 = abs_c(z2);
	phi2 = angle(z2.Re, z2.Im);


	r = r1*r2;
	phi = phi1+phi2;

	return pol2complex(r, phi);

}*/
complex mul_c(complex z1, complex z2) {
	complex z;
	z.Re = z1.Re*z2.Re-z1.Im*z2.Im;
	z.Im = z1.Re*z2.Im+z1.Im*z2.Re;
	return z;

}

complex pow_c(complex z, float n) {
	float r; // length of complex number in complex plane (absolute value)
	float phi; // angle of complex number in complex plane
	

	r = pow(abs_c(z),n);
	phi = mod(angle(z.Re, z.Im)*n,2.0*pi);


	return pol2complex(r, phi);

}


complex div_c(complex z1, complex z2) {
	complex zk;
	zk.Im = -z2.Im;
	zk.Re = z2.Re;
	return mul_c(z1, zk);
}


complex add_c(complex z1, complex z2) {
	complex z;
	z.Re = z1.Re+z2.Re;
	z.Im = z1.Im+z2.Im;
	return z;
}


complex sub_c(complex z1, complex z2) {
	complex z;
	z.Re = z1.Re-z2.Re;
	z.Im = z1.Im-z2.Im;
	return z;
}


complex sin_c(complex z) {
	complex result;
	result.Re = sin(z.Re)*acos(z.Im);
	result.Im = cos(z.Re)*asin(z.Im);
	return result;
}


complex cos_c(complex z) {
	complex result;
	result.Re = sin(z.Re)*acos(z.Im);
	result.Im = cos(z.Re)*asin(z.Im);
	return result;
}


complex fun(complex z) {
	vec2 var = vec2(0.3,0.3);//mouse;
	float a = p;
	// (x^2-1) * (x-2-I)^2 / (x^2+2+2I):
	return div_c(mul_c(sub_c(pow_c(z,2.0),complex(sin(a*2.0*pi),0.0)), pow_c(sub_c(z,complex(var[0]*range.Im*2.0-
		         range.Im,range.Im-var[1]*range.Im*2.0)),2.0)), add_c(pow_c(z,2.0),complex(2.0,2.0)));
	
	//return div_c(cos_c(z),sin_c(sub_c(pow_c(z,3),complex(0.10,10.0))));
}


// the code on the page starts here!!!
void main()
{
	float x = 2.0*(gl_FragCoord).x/WIDTH-1.0; // [-1.0 - 1.0]
	float y = 2.0*(gl_FragCoord).y/HEIGHT-1.0; // [-1.0 - 1.0]
	
	
	
	complex z;
	z.Re = x*range.Re;//(sin(p)+1.1);
	z.Im = y*range.Im;//(sin(p)+1.1);


	complex f = fun(z);
	

	float H = mod(angle(f.Re,f.Im)+2.0*a,2.0*pi)/(2.0*pi);
	float S = sin(mod(log(abs_c(f))*2.0,pi));
	float V = 1.0;
	

	gl_FragColor = vec4(HSVtoRGB(vec3(H,S,V)),0.0);
}