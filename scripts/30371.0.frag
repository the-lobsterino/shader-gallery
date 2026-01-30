// By @paulofalcao
//
// Blobs

#ifdef GL_ES
precision highp float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
float scale = 50.0;
float thyme = time * 0.15;

float makePoint(float x,float y,float fx,float fy,float sx,float sy,float t){
   float xx=x+sin(t*fx)*sx * scale;
   float yy=y+cos(t*fy)*sy * scale;
   return 1.0/sqrt(xx*xx*yy*yy)/scale;
}

void main( void ) {

   //vec2 p=(gl_FragCoord.xy/resolution.xy)*2.0-vec2(1.0,resolution.y/resolution.x);
   //p=p*2.0;
	
   vec2 p = (( gl_FragCoord.xy / resolution.xy ) * 2.0 - 1.0)*scale;
   p*=normalize(resolution).xy;
  
   float x=p.x;
   float y=p.y;

   float a=makePoint(x,y,2.0,2.5,0.9,0.3,thyme);
   float b=makePoint(x,y,1.0,1.5,0.6,0.6,thyme);
   float c=makePoint(x,y,3.0,3.5,0.3,0.9,thyme);
   float d=makePoint(x,y,1.0,1.5,0.3,0.9,thyme);
   float e=makePoint(x,y,2.0,2.5,0.6,0.6,thyme);
   float f=makePoint(x,y,3.0,3.5,0.9,0.3,thyme);

   vec3 C=vec3(a*3.0,a*a,a*a)+vec3(b*b,b*3.0,b*b)+vec3(c*c,c*c,c*3.0)+
	   vec3(d*1.5,d*1.5,d*d*d)+vec3(e*e*e,e*1.5,e*1.5)+vec3(f*1.5,f*f*f,f*1.5);
   
   gl_FragColor = vec4(pow(C,vec3(1.0/2.2)),1.0);
}