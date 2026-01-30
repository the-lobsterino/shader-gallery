#ifdef GL_ES
    precision mediump float;	// highp
#endif

#extension GL_OES_standard_derivatives : enable
#extension GL_ARB_gpu_shader_fp64 : enable

// Shader by Freddi.
// Things i have to say:
// First) Use u_index for a few different patterns, try it out ;)
// Second)etrtwx7j use double if possible. Sadly, i can not figure out if double precision is possible in GLSLSandbox :/
// Third) sinushyperbolicus = sinh & cosinushyperbolicus = cosh. Those definitions only exist, because sinh and cosh dont seem to be known in GLSLSandbox.


//standard things to know.
// uniform vec4 gl_FragCoord; there kjju. ikigutfmjfener
// uniform float u_time;
// uniform float u_offsetX;
// uniform float u_offsetY;
// uniform vec2 u_pos;
// uniform int u_index;
// uniform float u_scale;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define u_time time
#define u_pos mouse
#define u_index 16
#define u_scale 20.0
#define u_offsetX 0.0
#define u_offsetY 0.0

#define M_PI 3.1415926535897932384626433832795






vec4 posToHsb(vec2 origin, vec2 pos, float scale);
vec4 hsbToRgb(float h, float s, float v, float a);

vec2 scaleComplex(vec2 z, float scale);
vec2 sum(vec2 a, vec2 b);
vec2 sub(vec2 a, vec2 b);
vec2 mult(vec2 a, vec2 b);
vec2 div(vec2 a, vec2 b);
float norm(vec2 a);
vec2 sinus(vec2 a);
vec2 cosinus(vec2 a);
vec2 lnComplex(vec2 a);
float angleComplex(vec2 a);
vec2 createFromPolar(float amount, float angle);
vec2 expComplex(vec2 z);
vec3 complexToHsv (vec2 z);

float sinushyperbolicus(float a);
float cosinushyperbolicus(float a);

void main(void) {
	
	float scale = u_scale + 0.15 * u_scale * sin(time*3.0);

	
	vec2 origin = vec2(resolution.x/2.0 + u_offsetX, resolution.y/2.0 + u_offsetY);
	vec2 pos = gl_FragCoord.xy;
	pos += vec2(sin((gl_FragCoord.y+u_time*1e3) * 0.003) * 1e2, 0.0); // warp effect
	vec4 hsb = posToHsb(origin, pos, scale);
	vec4 rgb = hsbToRgb(hsb.r, hsb.g, hsb.b, hsb.a);
	
	gl_FragColor = vec4(rgb);
}



// Color functions
vec4 posToHsb(vec2 origin, vec2 pos, float scale){
	
	vec2 z = pos-origin;
	z = scaleComplex(z, scale);
	
	if(u_index==1){
	
		//Third Root
		z = scaleComplex(z, 0.00085);
		z = mult(sum(mult(mult(z,z),z), vec2(10.0, -10.0)), vec2(sum(vec2(100, 35667.0), vec2(-30.0, 0.0))));
	}else if(u_index==2){
	
		//Dancing Roots
		z = scaleComplex(z, 0.00085);
		z = mult(sum(mult(mult(z,z),z), vec2(10.0, -10.0)), vec2(sum(vec2(100, 35667.0), vec2(-30.0, 0.0))));
		
		z = z + vec2(600.0,0);
		z = scaleComplex(z, 0.0000001 + 0.00005*sin(u_time/10.0));
		z = sum(mult(mult(z, mult(z, z) ),z), vec2(1.0*1.0, 30000.0*sin(u_time*1.0)));
	}else if(u_index==3){
	
		//Star Flower
		z = scaleComplex(z, 0.00085);
		z = mult(sum(mult(mult(z,z),z), vec2(10.0, -10.0)), vec2(sum(vec2(100, 35667.0), vec2(-30.0, 0.0))));
		
		
		z = scaleComplex(z, 0.001);
		z = sum(mult(mult(z,z),z), vec2(sin(u_time)*u_time*u_time, 0.5+cos(z.x)));
		z = lnComplex(z);
		z = sum(z, -mult(z, vec2((sin(u_time*10.0), cos(z.y)))));
	}else if(u_index==4){
	
		//Geometric Disaster
		z = scaleComplex(z, 0.09);
		z = sum(mult(mult(z,z),z), vec2(sin(u_time)*u_time*u_time, 0.5+cos(z.x)));
		z = lnComplex(z);
		z = sum(z, -mult(z, vec2((sin(u_time*10.0), cos(z.y)))));
	}else if(u_index==5){
	
		//Flying Roots
		z = scaleComplex(z, 0.1);
		vec2 y = vec2(-100000.0*-sin(u_time/2.0), 0.0+100000.0*cos(1.0*u_time));
		vec2 c = sum(z, vec2(-300.0*sin(u_time), -100.0*cos(u_time)));
		z = mult(sum(mult(z, z), y), c);
	}else if(u_index==6){
	
		//Touching Universes
		z = scaleComplex(z, 0.003);
		z = sum(mult(mult(z,z),z), vec2(-5800.0*sin(u_time), 0));
		z = sin(0.5+0.5*cos(expComplex(scaleComplex(z, 0.001+0.0008*sin(u_time)))));
	}else if(u_index==7){

		//e^z / z-a
		//Elastic Wall
		z = scaleComplex(z, 0.2);
		vec2 a = vec2(-700.0 + 250.0*sin(u_time), 500.0*cos(u_time));
		z = div(expComplex(scaleComplex(z, 0.015)), sum(z, a));
		vec2 b = vec2(500.0, 10.0);
		vec2 c = vec2(0.0+25.0*sin(u_time/4.0), 10.0*cos(u_time*1.5));
		z = sum(z, div(sum(z, b), sum(z, c)));
	}else if(u_index==8){
	
		//Cycling Guardians
		vec2 a = vec2(0, 100);
		vec2 b = vec2(0, -300);
		z = div(sum(z, a), sum(z, b));			//z+a / z+b => broken-linear function
		z = expComplex(scaleComplex(z, 20.0));		//optional
		//z = mult(z, sum(z, scaleComplex(b, 0.005+0.05*cos(u_time/6.0))));	//optional
	}else if(u_index==9){
	
		//Waves
		z = scaleComplex(z, 0.06);
		z = expComplex(scaleComplex(z, 0.01));
		z = vec2(z.x*z.x, z.y*z.y);
		vec2 h = vec2(800, 0);
		z = mult(h, div(z, sum(z, h)));
	}else if(u_index==10){
	
		//Periodic Horizon
		z = scaleComplex(z, 0.05);
		z = sinus(scaleComplex(z, 0.01));
		z = cosinus(z);
		vec2 x = vec2(1.5, 1);
		z = mult(z, sum(z, x));
	}else if(u_index==11){

		//Complex Swirler
		z = scaleComplex(z, 0.001);
		vec2 c = expComplex(sin(z));
		vec2 f = (100.0*sin(z.y) - sinus(c), expComplex(z-10.0+cos(u_time)));
		z = div(mult(sin(z), vec2(cos(z.y), z.x+10.0*sin(u_time))), f);
	}else if(u_index==12){
	
		//L.S.D.
		z = scaleComplex(z, 0.0002);
		vec2 c = sin(cosinus(expComplex(vec2(z.x+sin(u_time), z.y+cos(u_time)))));
		z = sum(mult(z,z), c);
	}else if(u_index==13){
	
		//Periodic Rider 1
		z= scaleComplex(z, 0.001);
		vec2 f = div(vec2(3.0, 0.0), z);
		vec2 l = vec2(1.0 + z.x*z.y*sin(0.4*cos(z.y)), 1.0*cosinus(sum(z, vec2(u_time, cos(u_time*2.0)))));
		z = mult(mult(z*l,z),l);	//1)
	}else if(u_index==14){
	
		//Periodic Rider 2
		z= scaleComplex(z, 0.003);
		vec2 f = div(vec2(3.0, 0), z);
		vec2 l = vec2(1.0 + z.x*z.y*sin(0.4*cos(z.y)), 1.0*cosinus(sum(z, vec2(u_time, cos(u_time*2.0)))));
		z = mult(mult(z,z),l);	//2)
	}else if(u_index==15){

		//Rotating Roots
		z = scaleComplex(z, 0.1);
		vec2 a = vec2(0.0+200.0*cos(u_time), 0.0+200.0*sin(u_time));
		vec2 b = vec2(-280.0, 170.0*cos(u_time/2.0));
		vec2 c = vec2(b.x + 150.0*cos(u_time*2.0), b.y + 150.0*sin(u_time*2.0));
		z = mult(mult(mult(mult(z, z), sum(z, a)), sum(z, b)), sum(z, c));
	}else if(u_index==16){
		//Cycling Guardians + Crystal
		vec2 a = vec2(0, 100);
		vec2 b = vec2(0, -300);
		z = scaleComplex(z, 0.5);
		z = div(sum(z, a), sum(z, b));			
		z = expComplex(scaleComplex(z, 1.0));
		z = mult(z, sum(z, scaleComplex(b, 0.005+0.05*cos(u_time/6.0))));	
		
		z = mult(sum(expComplex(sin(z)*vec2(3.0, 0.0)), vec2(cos(z)*vec2(0.0, 5.0))), z);
	} else {
		
		// z being itself.	
	}
	
	return vec4(complexToHsv(z), 1.0);
}
vec4 hsbToRgb(float h, float s, float v, float a){
	float c = v * s;
	h = mod((h * 6.0), 6.0);
	float x = c * (1.0 - abs(mod(h, 2.0) - 1.0));
	vec4 color;

	if (0.0 <= h && h < 1.0) {
		color = vec4(c, x, 0.0, a);
	} else if (1.0 <= h && h < 2.0) {
		color = vec4(x, c, 0.0, a);
	} else if (2.0 <= h && h < 3.0) {
		color = vec4(0.0, c, x, a);
	} else if (3.0 <= h && h < 4.0) {
		color = vec4(0.0, x, c, a);
	} else if (4.0 <= h && h < 5.0) {
		color = vec4(x, 0.0, c, a);
	} else if (5.0 <= h && h < 6.0) {
		color = vec4(c, 0.0, x, a);
	} else {
		color = vec4(0.0, 0.0, 0.0, a);
	}

	color.rgb += float(v - c);

	return color;
}


//Complex Operations
vec2 scaleComplex(vec2 z, float scale){
	return vec2(z.x*scale, z.y*scale);
}
vec2 sum(vec2 a, vec2 b){
   return vec2(a.x + b.x,a.y + b.y);
}
vec2 sub(vec2 a, vec2 b){
   return vec2(a.x - b.x,a.y - b.y);
}
vec2 mult(vec2 a, vec2 b){
   return vec2(a.x*b.x - a.y*b.y,a.x*b.y + a.y*b.x);
}
vec2 div(vec2 a, vec2 b){
   return vec2((a.x*b.x + a.y*b.y)/(b.x*b.x + b.y*b.y), (a.y*b.x - a.x*b.y)/(b.x*b.x + b.y*b.y));
}
float norm(vec2 a){	//other name: magnitude
   return sqrt(a.x*a.x + a.y*a.y);
}
vec2 sinus(vec2 a){
	return vec2(sin(a.x)*cosinushyperbolicus(a.y), cos(a.x)*sinushyperbolicus(a.y));
}
vec2 cosinus(vec2 a){
	return vec2(cos(a.x)*cosinushyperbolicus(a.y), sin(a.x)*sinushyperbolicus(a.y));
}
vec2 lnComplex(vec2 a){		// doesnt work?
   //return vec2(log(a.x), angleComplex(a)+2.0*3.14915*1);//k=1?
   return vec2(log(float(norm(a))), angleComplex(a));
}
float angleComplex(vec2 a){	//other name: argument
	return atan(a.y, a.x)+u_time;
}
vec2 createFromPolar(float amount, float angle) {
    return vec2(amount * cos(angle), amount * sin(angle));
}
vec2 expComplex(vec2 z){
	return vec2(exp(z.x)*cos(z.y), exp(z.x)*sin(z.y));
}
float sinushyperbolicus(float a){
	return 0.5 * (exp(a)-exp(-a));
}
float cosinushyperbolicus(float a){
	return 0.5 * (exp(a)+exp(-a));
}



vec3 complexToHsv (vec2 z) {

	// get phase (trim!) and magnitude.
	float t = angleComplex(z);
	if (t < 0.0) {
		t += (M_PI*2.0) * floor(t / (M_PI*2.0));
	}
	if (t >= (M_PI*2.0)) {
		t -= (M_PI*2.0) * floor(t / (M_PI*2.0));
	}
	float h = t / (M_PI*2.0);
	
	
	// map contour lines on log scale, according to magnitude.
	float r = norm(z);
	if (r > 1.0) {
		r = (r - exp(floor(log(r)))) / (exp(ceil(log(r))) - exp(floor(log(r))));
	}


	// determine saturation and value based on r
	// p and q are complementary distances from a countour line
	float p = r < 0.5 ? 2.0 * r : 2.0 * (1.0 - r);
	float q = 1.0 - p;
	// only let p and q go to zero very close to zero;
	// otherwise they should stay nearly 1
	// this keep the countour lines from getting thick
	float p1 = 1.0 - q * q * q;
	float q1 = 1.0 - p * p * p;
	// fix s and v from p1 and q1
	float s = 0.4 + 0.6 * p1;
	float v = 0.6 + 0.4 * q1;

    return vec3(h,s,v);
}

