#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;

uniform vec2 resolution;

float noise(float val){
    return fract(sin(dot(vec2(val,1), vec2(12.9898, 78.233))) * 43758.5453);
}


float distSqr(vec2 a,vec2 b){
	return((a.x-b.x)*(a.x-b.x)+(a.y-b.y)*(a.y-b.y));
}




void main( void ) {
	vec3 c3;
	vec2 pos = ( gl_FragCoord.xy / resolution.xy );
	float xfactor=resolution.x/resolution.y;
	pos[0]*=xfactor;
	float x=pos[0];
	float y=pos[1];
	float size;
	float expTime =0.06;
	float ballSize = 10000.;
	float expSize = 2.;
	
	
	expSize*= 0.01;
	
	float period = 1.;
	float tsp = float(int(time/period));
	float prevTsp = float(int(time/period)-1);
	float t = (mod(time,period))/period;
	
	if(t<1.-expTime){
		c3 = vec3(0.9,0.8,0.4)*(0.8+0.1*cos(time*2.));
		size=1./ballSize;
	}
	else
	{
		c3 = vec3(0.9,0.8,0.6)*(0.8+0.1*cos(time*2.));
		size=(expSize)*(1.-t)*(1./expTime);
	}
	
	vec2 ranPoint=vec2(0.2+0.6*noise(tsp)*xfactor,0.4+0.4*noise(tsp));
	vec2 prevRanPoint=vec2(0.2+0.6*noise(prevTsp)*xfactor,0.4+0.4*noise(prevTsp));
	vec2 pPos;
	float angle;
	float distP;
	float dist2;
	
	//SETTINGS
	float pSize=0.00005;
	float eSize=0.2;
	const int numParticles=200;
	float seedAdd=1.;
	vec3 c2 = vec3(0.99,0.6,0.4)*(0.8+0.1*cos(time*2.));
	for(int i=0; i<numParticles; ++i){
		angle=6.29*noise(tsp+seedAdd*float(i));
		distP=0.05+eSize*noise(noise(tsp)+seedAdd*float(i));
		pPos = vec2((xfactor/2.-(prevRanPoint.x-xfactor/2.)*0.2)+(prevRanPoint.x-xfactor/2.)+t*distP*cos(angle),prevRanPoint.y+t*distP*sin(angle)-0.05*t);
		
		if(distSqr(pPos,pos)<pSize){
			dist2 += 1.-pow(t,10.);
		}
	}
	
	
	

	ranPoint.y*=pow(t,0.3);
	ranPoint.x=(xfactor/2.-(ranPoint.x-xfactor/2.)*0.2)+(ranPoint.x-xfactor/2.)*t;
	float dist = step(distSqr(vec2(x,y),ranPoint),size);
	
	
	
		
		
	
	
	vec3 color = c3*dist*pow((1.+t),1.5)+c2*dist2;
	
	
	
	gl_FragColor = vec4( color, 1.0 );

}