#define iterations 256
precision lowp float; //SET THE ZOOM FROM 2.0 TO 0.5
uniform vec2 mouse;uniform vec2 resolution;uniform float time; //mouse input and the resolution for the coordinate system placement
vec2 complex_mult(vec2 a,vec2 b){return vec2(a.x*b.x-a.y*b.y , a.x*b.y+a.y*b.x);} //complex multiplication
vec3 hue(float hue){return abs(mod(hue * 6.0 + vec3(0.0, 4.0, 2.0), 6.0) - 3.0) - 1.0;}//generate RGB value from a hue
vec4 GetColor(vec2 current) //FRACTAL CODE
{
 vec2 next;vec2 z;int stp=0;
 for(int i=0;i<iterations;++i)
 {
  next=(complex_mult(current,current)+vec2(mouse.x-0.5,mouse.y-0.5)*1.6);//Julia Set: f(Z)=Z^2+C
  if(dot(next,next)>100.0){break;} //if the resulting vector is far out, the result equals zero
  current=next; //the current "buffer" is rewritten with the new iteration
  z=next;stp=i; //creates output of vector and the current iteration of the fractal
 }
 return vec4(hue(float(float(stp)-log2(log2(dot(z,z))) + 4.0)/(float(iterations)/3.0)),1.0);
}
void main(void) {vec2 p=(gl_FragCoord.xy - resolution.xy/2.0)*0.001; gl_FragColor=GetColor(p);} //simplified mouse movement edit by Robert 08.09.2015