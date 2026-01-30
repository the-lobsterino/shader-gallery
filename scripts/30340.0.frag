// By @paulofalcao
//
// Blobs

#ifdef GL_ES
precision highp float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float makePoint(float x,float y,float fx,float fy,float sx,float sy,float t){
   float xx=x+sin(t*fx)*sx;
   float yy=y+cos(t*fy)*sy;
   return 1.0/sqrt(xx*xx*yy*yy)/(100.);
}

void main( void ) {

   vec2 p=(gl_FragCoord.xy/resolution.x)*2.0-vec2(1.0,resolution.y/resolution.x);
	p*=normalize(resolution).xy;
   p=p*2.0;
   
   float x=p.x;
   float y=p.y;

   float a=makePoint(x,y,2.0,2.5,0.9,0.3,time);
   float b=makePoint(x,y,1.0,1.5,0.6,0.6,time);
   float c=makePoint(x,y,3.0,3.5,0.3,0.9,time);
   float d=makePoint(x,y,1.0,1.5,0.3,0.9,time);
   float e=makePoint(x,y,2.0,2.5,0.6,0.6,time);
   float f=makePoint(x,y,3.0,3.5,0.9,0.3,time);

   vec3 C=vec3(a*3.0,a*a,a*a)+vec3(b*b,b*3.0,b*b)+vec3(c*c,c*c,c*3.0)+
	   vec3(d*1.5,d*1.5,d*d*d)+vec3(e*e*e,e*1.5,e*1.5)+vec3(f*1.5,f*f*f,f*1.5);
   
   gl_FragColor = vec4(pow(C,vec3(1.0/2.2)),1.0);
}