#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 resolution;

#define PI 3.141592


float rand(vec2 co){
    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
}


void main( void )
{
  vec2 pos = (gl_FragCoord.xy * 2.0 - resolution)/max(resolution.x, resolution.y);
  float wave = 0.0;
  float color = 0.0;
  
  for (int i = 0; i < 20; i+=1){
	  float x = rand(vec2(i, i+1));
	  float wavephase = 2.0*x*PI+float(i);
	  //float wavephase = 0.0;
	  float t = time*3.;	
	  float wavetime = 0.0;
	  float waveSize = 0.02;
	  float waveAmp = waveSize - float(i)*0.001;
	
	  float k = 2.0*PI/waveSize;
	  float waveshort = 5.0+float(i);	
	  //float wavestokes = ((1.0-1.0/16.0*pow((k*waveSize),2.0))*cos(pos.x*waveshort+t+wavephase) + 0.5*k*waveSize*cos(2.0*waveshort*pos.x+t+wavephase));
	  float wavestokes = cos(pos.x*waveshort+t+wavephase);
	  float wave = waveAmp*pow(wavestokes,1.0)+sin(t)*0.01+(float(i)*0.05-0.5);	 
	if (pos.y < wave){
	 color += 0.05;  
	}  
	
  }


  
  
  
  
  
  
  gl_FragColor = vec4(color, color,color,1.0);
}