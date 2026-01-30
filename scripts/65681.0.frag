#ifdef GL_ES
precision highp float;
#endif
uniform float time;uniform vec2 resolution;float H( float x,float y ){float d=x
*x+y*y-1.;return x*x*y*y*y-d*d*d;}void main( void ) {vec2 uv=gl_FragCoord.xy/
resolution.xy/vec2(1,2);float t4=sin(time*4.);uv=(uv-vec2(0.5,0.15))*(t4*t4+9.)
*8.;float h =H(uv.x,uv.y);float hx=H(uv.x+0.1,uv.y);float hy=H(uv.x,uv.y-0.2);
vec3 v=normalize(vec3(hx-h,hy-h,1.));vec3 l=normalize(vec3(1.,1.,1.));float s=
pow(dot(v,l),5.);if(h>0.)gl_FragColor=vec4(mix(vec3(1,1,1),vec3(1,1,1),s),1);}
