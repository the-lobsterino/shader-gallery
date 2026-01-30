#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;


float fade(float a, float b, float v) {
if(v>=a && v<=b) return 1.0;
if(v<a) return min(v,a)*1.0/a;
if(v>b) return 1.0-((v-b)*1.0/(1.0-b));
}

float rand(vec2 co){
    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
}



float hash(float n) { return fract(sin(n) * 1e4); }
void main( void ) {
	const int num = 25;
	vec3 controlPoints[num];
	controlPoints[0] = vec3(mouse,0.5);
	
	float s=.5;
	float x;
	for(int i = 1; i < num; i++){
		s=hash(s);
		x=s;
		s=hash(s);
		controlPoints[i]=vec3((x+.5)*.5,(s+.5)*.5,1.);
	}
	
	
	float a=400.;
	float c=0.;
	vec2 p = gl_FragCoord.xy / resolution.xy;
	float j;
	for(int i=0; i<num; ++i) {
		j=mod(float(i)+mouse.x*float(num),float(num));//mod(mouse.x*float(num)+float(i), float(num));
		float d=distance(controlPoints[i].xy, p);
		c+=exp((a+j*30.)*-d*d);
	}
	
	float r=fade(0.5,1.0,c);
	float g=fade(0.15,0.75,c); //puta que cuesta encontrar el verde adecuado, 
	                           //hay que modificar la funcion para que no sea lineal o poner 4 puntos en vez de 2
	float b=fade(0.0,0.15,c);

	
	gl_FragColor = vec4(r,g,b,1.0);
	
	/*
	
	
	vec2 p = gl_FragCoord.xy / resolution.xy;
	float swell = 0.0;
	float dist = 0.0;
	float scale = 60.0/float(num);
	for(int i = 0; i < num; i++){
		dist = distance(controlPoints[i].xy,p)*scale+controlPoints[i].z;
		if(dist > 0.0){
			swell += controlPoints[i].z/dist;
		}
	}
	swell = swell / float(num);
	
	float c=clamp(swell-0.3,0.0,0.1)*10.0;
	
	float r=fade(0.5,1.0,c);
	float g=fade(0.15,0.75,c); //puta que cuesta encontrar el verde adecuado, 
	                           //hay que modificar la funcion para que no sea lineal o poner 4 puntos en vez de 2
	float b=fade(0.0,0.15,c);
        	
	gl_FragColor = vec4(r,g,b,1.0);
	*/
	
}