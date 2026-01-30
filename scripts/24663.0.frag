#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
varying vec2 surfacePosition;


// Looking pretty good.
// Bring it all down!

float Hash( vec2 p) {
   vec3 p2 = vec3(p.xy,1.0);
   return fract(sin(dot(p2,vec3(37.1,61.7, 12.4)))*3758.5453123);
}

float noise(in vec2 p) {
   vec2 i = floor(p);
   vec2 f = fract(p);
   f *= f * (3.0-2.0*f);

   return mix(mix(Hash(i + vec2(0.,0.)),
		  Hash(i + vec2(1.,0.)),f.x),
                  mix(Hash(i + vec2(0.,1.)), Hash(i + vec2(1.,1.)),f.x),
                  f.y);


}

float fbm(vec2 p) {
	float v = 0.0;
	v += noise(p*1.)*.5;	v += noise(p*2.)*.25;

	v += noise(p*4.)*.125;
	return v;
}

void main(void) {
   float burningSpeed = .2;
   float artifacsSize = .5;
   vec2 pos = surfacePosition;

   float flag = 0.0;
   vec3 color;

   if(abs(pos.x) < 1.0 && abs(pos.y) < 1.0) {
      /* black */
      color = vec3(0.0,0.0,0.0);
      flag = 1.0;	
   }
   
   float ctime = 1.8*fract(burningSpeed*time);
   float d = pos.x+pos.y*0.5-0.3;
	


//   pos.x += ctime;
   float s = clamp(1.0-length((pos-vec2(0.5+0.25*pos.y*pos.y,0.7))*vec2(2.5-pos.y*pos.y,1.0)),0.0,1.0);
   float f = clamp(1.0-length((pos-vec2(0.5+pos.y*0.1*sin(pos.y+time*10.),0.2))*vec2(4.0+pos.y*pos.y,2.0)),0.0,1.0);

   s*=fbm((pos+time*vec2(-0.2,-0.4))*5.1);
   color = mix(color,vec3(s),s*3.);

   /* Flame up speed */
   f*=f*fbm((pos+time*vec2(-0.0,-0.6))*10.);
   f=f;

   vec3 flame = clamp(f*vec3((3.0-pos.y)*2.0,(1.3-pos.y)*2.0,pos.y-2.0),0.0,1.0);
   color+=flame;

   gl_FragColor = vec4(color, 1.0);
}
