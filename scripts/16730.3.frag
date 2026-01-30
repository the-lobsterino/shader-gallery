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
   float yy=y+sin(t*fy)*sy;
   return 1.0/sqrt(yy*yy) * 0.01;
}

void main( void ) {

   vec2 p=(gl_FragCoord.xy/resolution.x)*2.0-vec2(1.0,resolution.y/resolution.x);
   
   float x=p.x;
   float y=p.y;

   float a=makePoint(x,y,1.0,1.0,1.1,1.1, time);
   float b=makePoint(x,y,1.0,1.5,0.6,0.6, time);

   vec3 C=vec3(a*a,a*a,a)+vec3(b*b,b*b,b);
   
   gl_FragColor = vec4(pow(C,vec3(1.0/3.0)),1.0);
}