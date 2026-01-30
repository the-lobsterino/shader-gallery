#ifdef GL_ES
precision mediump float;
#endif

#define SHOW_STEPS 1

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

const float PI = 3.14159;
const float EPSILON = 0.001;
const int MAX_STEPS = 64;
const float STEPS_DELTA=1.0/64.;

const float MAX_DISTANCE = 128.0;


//-------------------------------------
// Obiekty podstawowe
//-------------------------------------
float distBox( vec3 p, vec3 size )
{
  vec3 d = abs(p) - size;
  return min(max(d.x,max(d.y,d.z)),0.0) +
         length(max(d,0.0));
}

float distSphere(vec3 p, float radius) {
    return length(p) - radius;
}

float distToPlaneX(vec3 p, float depth) {
    return dot(p, vec3(0.0, 1.0, 0.0)) + depth;
}

//-------------------------------------
// Kolorowanie
//-------------------------------------
vec4 debugSteps(float distance){

	return vec4(
		(distance<0.25) ? 1.-distance * 4. : ((distance>0.24 && distance<0.50) ? 0.0 + distance * 2. : 0.),
		(distance<0.25) ? 1.-distance * 4. : ((distance>0.49 && distance<0.75) ? distance * 1.2 : 0.),
		(distance<0.15) ? 1.-distance * 4. : ((distance>0.75) ? distance : 0.),
		1.0
	);

//	return vec4(
//		(distance<0.25) ? 1.-distance * 4. : distance,
//		(distance<0.25) ? 1.-distance * 4. : ((distance>0.25 && distance<0.75) ? 0.5 + distance : 0.),
//		(distance<0.15) ? 1.-distance * 4. : ((distance<0.5) ? 0.5 + distance : 0.),
//		1.0
//	);
}

//
// Mapowanie odległości
//
float map(vec3 p)
{
    float ob1=distBox(p,vec3(1.0));
    float ob2=distToPlaneX(p,1.0);
    return min(ob1, ob2);
	
    //return distBox(p,vec3(1.0));
    //return distSphere(p, 1.0);
    //return distToPlaneX(p,1.0);
}

//
// Operacja RayCastingu
//
float rayCast(vec3 ray, vec3 rayDir){
	
    float d = 0.0, distance = 0.0;
	float steps=0.0;
	
    for(int i=0; i<MAX_STEPS; ++i) {
        d = map(ray);
        distance += d;
        ray += rayDir * d;
        steps += STEPS_DELTA;
        if(d<EPSILON) { 
		distance=0.0;
		break; 
      	}
        if(distance>MAX_DISTANCE) { 
		distance=MAX_DISTANCE; 
		break; 
	}
    }

	//
	// Ilość kroków
	//
	#if SHOW_STEPS==1
		return steps;
	#else	
		//
		// Dystans
		//
		distance=distance/MAX_DISTANCE;
		return distance;
	#endif		
}

void main() {

	//
	// Konfiguracja kamery
	//
	vec2 mouse = (mouse-0.5) * PI * vec2(-2.,-1.);	
    	vec2 pos = (gl_FragCoord.xy*2.0 - resolution.xy) / resolution.y;
    	vec3 camPos = vec3(cos(time*0.5), tan(time*0.5), 4.0);
    	//vec3 camPos = vec3(mouse.x, mouse.y, 3.0);
    	vec3 camTarget = vec3(0.0, 0.0, 0.0);

    	vec3 camDir = normalize(camTarget-camPos);
    	vec3 camUp  = normalize(vec3(1.0, 1.0, 0.0));
    	vec3 camSide = cross(camDir, camUp);
    	float focus = 1.0;

    	vec3 rayDir = normalize(camSide * pos.y + camUp*pos.x + camDir*focus);
    	vec3 ray = camPos;
		
	//
	// RayCasting
	//
	float distance = rayCast(ray, rayDir);
	
	#if SHOW_STEPS==1
		gl_FragColor = debugSteps(distance);
	#else	
		gl_FragColor = vec4( 1.-distance, 1.-distance, 1.-distance, 1.0 );
	#endif		
	
	//float red = (color>0.5) ? color*0.5 : 0.;
	//float green = (color<0.5) ? 1-color*2. : 0.;
	//float blue = 0.0;

	// float red = (distance<0.25) ? 1.-distance*4. : 0.;
	// float green = (distance<0.25) ? 1.-distance*4. : 0.;
	// float blue = (distance<0.25) ? 1.-distance*4. : 0.;
	// gl_FragColor = vec4( red, green, blue, 1.0 );

}