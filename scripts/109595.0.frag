// By @paulofalcao
//
// Blobs with nice gradient

#ifdef GL_ES
precision highp float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;


// makePoint( x: positionX, y: positionY, fx: frequencyX, fy: frequencyY, sx: distX, sy: distY, t: time, s: width )
float makePoint(float x,float y,float fx,float fy,float sx,float sy,float t, float s)
{
float xx=x+sin(t*fx)*sx;
   float yy=y+cos(t*fy)*sy;
   return ((s/3.0)/((0.007/s)+sqrt(xx*xx+yy*yy)));
}

vec3 gu(vec4 a,vec4 b,float f){
  return mix(a.xyz,b.xyz,(f-a.w)*(1.0/(b.w-a.w)));
}

vec3 grad(float f){
	// vec4( r, g, b, distance )
	vec4 c01=vec4(0.0,0.0,0.0,0.00);
	vec4 c02=vec4(0.5,0.0,0.0,0.50);
	vec4 c03=vec4(1.0,0.0,0.0,0.55);
	vec4 c04=vec4(1.0,1.0,0.0,0.80);
	vec4 c05=vec4(1.0,1.0,1.0,1.00);
	return (f<c02.w)?gu(c01,c02,f):
	(f<c03.w)?gu(c02,c03,f):
	(f<c04.w)?gu(c03,c04,f):
	gu(c04,c05,f);
}

void main( void ) {

   vec2 p=(gl_FragCoord.xy/resolution.x)*2.0-vec2(1.0,resolution.y/resolution.x);

   p=p*2.0;
   
   float x=p.x;
   float y=p.y;

   /*float a=
       makePoint(x,y,3.3,2.9,0.3,0.3,time,7.0);
   a=a+makePoint(x,y,1.9,2.0,0.4,0.4,time,0.6);
   a=a+makePoint(x,y,0.8,0.7,0.4,0.5,time,2.0);
   a=a+makePoint(x,y,2.3,0.1,0.6,0.3,time,1.0);
   a=a+makePoint(x,y,0.,0.4,time,8.0);
   a=a+makePoint(x,y,0.3,1.0,0.4,0.4,time,55.0);
   a=a+makePoint(x,y,1.4,1.7,0.4,0.5,time,1.0);
   a=a+makePoint(x,y,1.3,2.1,0.6,0.3,time,1.0);
   a=a+makePoint(x,y,1.8,1.7,0.5,0.4,time,1.0);   
   a=a+makePoint(x,y,1.2,1.9,0.3,0.3,time,5.0);
   a=a+makePoint(x,y,0.7,2.7,0.4,0.4,time,1.0);
   a=a+makePoint(x,y,1.4,0.6,0.4,0.5,time,8.0);
   a=a+makePoint(x,y,2.6,0.4,0.6,0.3,time,1.0);
   a=a+makePoint(x,y,0.7,1.4,0.5,0.4,time,3.0);
   a=a+makePoint(x,y,0.7,1.7,0.4,0.4,time,1.0);
   a=a+makePoint(x,y,0.8,0.5,0.4,0.5,time,8.0);
   a=a+makePoint(x,y,1.4,0.9,0.6,0.3,time,1.0);
   a=a+makePoint(x,y,0.7,1.3,0.5,0.4,time,1.0);
   a=a+makePoint(x,y,3.7,0.3,0.3,0.3,time,1.0);
   a=a+makePoint(x,y,1.9,1.3,0.4,0.4,time,1.0);
   a=a+makePoint(x,y,0.8,0.9,0.4,0.5,time,1.0);
   a=a+makePoint(x,y,1.2,1.7,0.6,0.3,time,1.0);
   a=a+makePoint(x,y,0.3,0.6,0.5,0.4,time,1.0);
   a=a+makePoint(x,y,0.3,0.3,0.4,0.4,time,1.0);
   a=a+makePoint(x,y,1.4,0.8,0.4,0.5,time,1.0);
   a=a+makePoint(x,y,0.2,0.6,0.6,0.3,time,1.0);
   a=a+makePoint(x,y,1.3,0.5,0.5,0.4,time,1.0);*/
	
   float a=makePoint(x,y,0.3,1.0,0.4,0.4,time,55.0);
   
   vec3 a1=grad(a/183.0);
   
   gl_FragColor = vec4(a1.x,a1.y,a1.z,1.0);
}