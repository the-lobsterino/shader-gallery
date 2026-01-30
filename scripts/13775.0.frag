// By @paulofalcao
//
// Blobs
// primary colors mixing rgb - xavierseb

#ifdef GL_ES
precision highp float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;


float makePoint(vec2 p,float fx,float fy,float sx,float sy){
   float xx=p.x+sin(time*fx)*sx;
   float yy=p.y+cos(time*fy)*sy;
   return pow(xx*xx+yy*yy,-100.0);
}

void main( void ) {

   vec2 p=(gl_FragCoord.xy/resolution.x)*4.0-vec2(2.0,2.0*resolution.y/resolution.x);

   gl_FragColor = vec4(makePoint(p,.3,.9,.3,.3),makePoint(p,.2,.9,.3,1.3),makePoint(p,.7,.3,1.3,.3),1.0);
}