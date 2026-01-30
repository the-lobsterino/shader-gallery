#extension GL_OES_standard_derivatives : enable


/////////////////////////////////////////////////////////////////////
// Please ignore this. I am just learning how glsl works :P
// I didn't know this would be shared publicly automatically on glslsandbox.com.
//
/////////////////////////////////////////////////////////////////////


precision mediump float;
precision mediump int;


bool myBool = false;
int myInt = 0;
mediump float myFloat = 1.0;

bool myOtherBool;
//myOtherBool = true; //not allowed apparently. Its because declaring/initializing is ONLY allowed outside a function.


int myOtherInt;
//myOtherInt = 3; //not allowed apparently

int alpha = 123;
int beta = 0777;
int gamma = 0x123ABC;

int myDenom = 1000;
int myNumer = 200;


float delta = 1.;
float epsilon = 0.3421;
float phi = 2e4;
float theta = 2.45e-2;

const float pi = 3.141592;
const int number_lights = 5;

//int gl_hello = true; no "gl_" allowed

struct my_light {
	float intensity;
	vec3 position;
	vec4 color;
};


///////////////////////////////////////////////////////////////////////////////

bool exampleFunc(in int a, out int b, inout int c) {
	return true;
}
	
	

void main( void ) {	
	myOtherBool = false; //works fine here
	myOtherInt = 123;
	
	float frequencies[3];
	const int numLights = 2;
	my_light lights[numLights];
	frequencies[0] = 0.23;
	frequencies[1] = 0.67;
	frequencies[2] = 0.82;
	
	lights[0].intensity = 1.;
	lights[0].position = vec3(1, 1, 1);
	lights[0].color = vec4(1, 0.4, 0.5, 0.6);
	
	lights[1].intensity = 1.;
	lights[1].position = vec3(1, 1, 1);
	lights[1].color = vec4(1, 0.4, 0.5, 0.6);
	
	//lights[2].intensity = 1.;
	//lights[2].position = vec3(1, 1, 1);
	//lights[2].color = vec4(1, 0.4, 0.5, 0.6);
	
	//float myFloatArr2[3] = float[3](1.1, 1.1, 1.1); //not allowed
	
	//////////////////////////////////////////////////////////
	//data conversions
	int a = 37;
	float b = float(a) * 2.3;
	
	//////////////////////////////////////////////////////////
	//flow control (i know these are are a bad idea. But they are nice for debugging/learning)
	bool boolA = false;
	int i1 = 5;
	int i2 = 10;
	
	float finalShade= 0.0;
	//if(boolA) {
	//	finalShade = 0.5;
	//}
	
	if(i1 > 5) {
		finalShade = 0.5;
	} else if(i2 > 10) {
		finalShade = 0.8;
	} else {
		finalShade = 0.0;
	}
	
	
	
	//////////////////////////////////////////////////////////
	//loops
	const int maxLoops = 5;
	for(int j = 0; j < 5; j++) {
		for(int k = 0; k < maxLoops; k++){
			finalShade += 0.01;
		}
	}
	
	//testing global myBool vs local myBool
	bool myBool = true;
	bool b2 = myBool;
	finalShade = 0.0;
	
	if(b2) {
		finalShade = 0.0;
	} else {
		finalShade = 0.5;
	}
	
	
	gl_FragColor = vec4(finalShade);

}