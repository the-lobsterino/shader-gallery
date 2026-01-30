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
  

    for (int i = 15; i >= 1; i-=1){	
	  float x = rand(vec2(i, i+1));
	  float wavephase = 2.0*x*13.3*PI+float(i);
	  //float wavephase = 0.0;
	  float t = time*(6.-float(i)*.1);	
	  float wavetime = 0.0;
	  float waveSize = 0.025;
	  float waveAmp = max(0.0,waveSize - float(i)*0.0016);
	
	  float k = 2.0*PI/waveSize;
	  float waveshort = 5.0+float(i);	
	  float wavestokes = ((1.0-1.0/16.0*pow((k*waveSize),2.0))*cos(pos.x*waveshort+t+wavephase) + 0.5*k*waveSize*cos(2.0*waveshort*pos.x+t+wavephase));
	  
	  float wave = waveAmp*pow(wavestokes,1.0)+sin(t+x*12.2)*0.01/float(i)+(float(i)*(0.06-float(i)*0.0009)-0.5);	 
	if (pos.y < wave){
	  color = 0.05*float(i);  
	}  
	
  }


  
  
  

  if (color > 0.){ 
    //water color
    gl_FragColor = vec4(color-0.5, color-0.1,color,1.0);
  }
  else{
    //sky color
    gl_FragColor = vec4(.8, 0.8,.9,1.0);}
}